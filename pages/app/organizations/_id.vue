<template>
  <div class="id-container">
    <vue-loading
      v-if="isLoading"
      type="spin"
      class="loading"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    />

    <div v-if="Object.keys(organization).length > 0">
      <div v-if="organization.type === 'company'" class="container">
        <organization-header
          :main-image="mainImage"
          :logo-image="organization.logo_image"
          :org-name="organization.name"
          :user-count="organization.subordinated_organization_user_count"
          :is-favorite="organization.is_favorite"
          :type="organization.type"
          :uuid="organization.uuid"
          :establish-date="establishDate"
          is-company
          @unfavorite="unfavorite"
          @favorite="favorite"
        />

        <base-tabs
          :items="tabItems"
          :selected-tab="selectedTab"
          @change-tab="selectTab($event)"
        ></base-tabs>

        <company-overview
          v-show="selectedTab === 'overview'"
          :leader="organization.leader"
          :detail="organization.detail"
          :images="organization.images"
        />

        <company-member
          v-show="selectedTab === 'member'"
          :grouped-members="groupedMembers"
          :is-visitor="isVisitor"
        />

        <company-data
          v-show="selectedTab === 'data'"
          :organization-data="organizationData"
          :sections="sections"
          :is-loading="isLoadingOrgData"
          :config-status="configStatus"
        />

        <company-history
          v-show="selectedTab === 'history'"
          :histories="
            (organization.detail && organization.detail.histories) || []
          "
        />
      </div>

      <div
        v-else
        class="container"
        :class="{ 'container--data': selectedTab === 'data' }"
      >
        <organization-header
          :main-image="mainImage"
          :is-company="false"
          :logo-image="organization.logo_image"
          :user-count="organization.subordinated_organization_user_count"
          :org-name="organization.name"
          :is-favorite="organization.is_favorite"
          :class="{ 'org-header--data': selectedTab === 'data' }"
          :type="organization.type"
          :uuid="organization.uuid"
          @unfavorite="unfavorite"
          @favorite="favorite"
        />

        <base-tabs
          :items="departmentTabItems"
          :selected-tab="selectedTab"
          :class="{ 'base-tabs--data': selectedTab === 'data' }"
          @change-tab="selectTab($event)"
        ></base-tabs>

        <organization-overview
          v-show="selectedTab === 'overview'"
          :leader="organization.leader"
          :main-image="organization && organization.main_image"
          :org-images-not-main="orgImagesNotMain"
          :visible-images="3"
          :detail="organization.detail"
        />

        <organization-member-tab
          v-show="selectedTab === 'member'"
          :grouped-members="groupedMembers"
          :is-visitor="isVisitor"
        />

        <div v-show="selectedTab === 'data'">
          <h2 class="data-header">仕事の流れ</h2>
          <org-workflow
            :workflows="
              organization.detail ? organization.detail.workflows : null
            "
          />
          <div>
            <h2 class="data-header">部署データ</h2>
            <company-data
              :is-busho="true"
              :is-loading="isLoadingOrgData"
              :organization-data="organizationData"
              :sections="sections"
              :config-status="configStatus"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Route } from 'vue-router';
import { VueLoading } from 'vue-loading-template';
import { timestampToDateString } from '@/libs/dayjs';

import BaseTabs from '@/components/App/molecules/tabs/BaseTabs.vue';
import CompanyOverview from '@/components/App/organisms/company/CompanyOverview.vue';
import CompanyMember from '@/components/App/organisms/company/CompanyMember.vue';
import CompanyData from '@/components/App/organisms/company/CompanyData.vue';
import CompanyHistory from '@/components/App/organisms/company/CompanyHistory.vue';
import OrganizationOverview from '@/components/App/organisms/organizations/OrganizationOverview.vue';
import OrganizationHeader from '@/components/App/molecules/organization/OrgHeader.vue';
import OrgWorkflow from '@/components/App/molecules/organization/OrgWorkflow.vue';
import OrganizationMemberTab from '@/components/App/organisms/organizations/OrganizationMemberTab.vue';
import {
  fetchOrganization,
  fetchOrganizationData,
  fetchGroupedOrganizationMembers,
  fetchUser,
  organizationFavorite,
  organizationUnFavorite,
  fetchUserNotifications,
  putUserNotice,
} from '@/libs/api/app';
import { fetchOrganizationDataConfig } from '@/libs/api';
import { mapGetters } from 'vuex';

export default Vue.extend({
  layout: 'app/default',
  components: {
    VueLoading,
    BaseTabs,
    CompanyOverview,
    CompanyMember,
    CompanyData,
    CompanyHistory,
    OrganizationOverview,
    OrganizationHeader,
    OrgWorkflow,
    OrganizationMemberTab,
  },
  data() {
    return {
      tabItems: [
        {
          id: 'member',
          name: 'メンバー',
        },
        {
          id: 'overview',
          name: '会社概要',
        },
        {
          id: 'data',
          name: '会社データ',
        },
        {
          id: 'history',
          name: '沿革',
        },
      ],
      departmentTabItems: [
        {
          id: 'member',
          name: 'メンバー',
        },
        {
          id: 'overview',
          name: '事業部概要',
        },
        {
          id: 'data',
          name: '仕事の流れ・部署データ',
        },
      ],
      selectedTab: 'member' as string,
      isLoading: false,
      isLoadingOrgData: false,
      groupedMembers: [] as AppApiResponse.GroupedOrganizationMember[],
      organization: {} as AppApiResponse.Organization,
      organizationData: {} as AppApiResponse.OrganizationData,
      imageSteps: 0,
      visibleImages: 3, // ページの右側のイメージスライダー
      sections: [], // データの血液割合円グラフ
      configStatus: {} as ApiResponse.OrganizationDataConfig,
      accessPermission: 'all' as string,
      notices: [] as AppApiResponse.UserNotice[],
      randomImages: [
        '/app/image/random/random1.png',
        '/app/image/random/random2.png',
        '/app/image/random/random3.png',
        '/app/image/random/random4.png',
        '/app/image/random/random5.png',
        '/app/image/random/random6.png',
        '/app/image/random/random7.png',
        '/app/image/random/random8.png',
        '/app/image/random/random9.png',
        '/app/image/random/random10.png',
        '/app/image/random/random11.png',
        '/app/image/random/random12.png',
        '/app/image/random/random13.png',
      ],
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeRouteUpdate(to: Route, from: Route, next: Function) {
    this.selectedTab = to.query.tab ? String(to.query.tab) : 'overview';
    next();
  },
  computed: {
    orgImagesNotMain(): Array<any> {
      if (this.organization.main_image) {
        return this.organization.images.filter(
          (item: AppApiResponse.OrganizationImage) =>
            item.url !== this.organization.main_image.toString()
        );
      }
      return [];
    },
    uuid(): string {
      return this.$route.params.id;
    },
    mainImage(): string {
      if (this.organization.main_image) {
        return this.organization.main_image;
      }
      return this.randomImage();
    },
    ...mapGetters(['userProfile']),
    isVisitor(): boolean {
      return ['visitor'].includes(this.accessPermission);
    },
    establishDate(): string {
      return this.organization.detail && this.organization.detail.establish_date
        ? timestampToDateString(
            this.organization.detail.establish_date,
            'YYYY年M月D日'
          )
        : '';
    },
  },
  async created(): Promise<void> {
    const {
      data: { access_permission },
    } = await fetchUser(this.$accessor.userProfile.uuid);
    this.accessPermission = access_permission;
    await Promise.all([
      this.fetchOrg(),
      this.fetchOrgData(),
      this.fetchOrganizationDataConfig(),
      this.fetchGroupedOrganizationMembersData(),
    ]);
    // update notice
    await this.fetchNotificationsData().then(() => {
      const updateNotifications: any = [...this.notices].filter(
        (item: any) =>
          !item.is_read && item.params && item.params.includes(this.uuid)
      );
      if (updateNotifications) {
        updateNotifications.forEach((notification: any) => {
          this.putUserNotice(notification);
        });
      }
    });
  },
  methods: {
    selectTab(key: string) {
      this.selectedTab = key;
    },
    async fetchOrg(): Promise<void> {
      this.isLoading = true;

      try {
        // Vuex 'user' getter
        const { data } = await fetchOrganization(this.uuid);
        this.organization = data;
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchOrgData() {
      this.isLoadingOrgData = true;
      try {
        const { data } = await fetchOrganizationData(this.uuid);
        this.organizationData = data;
        // 血液型の円グラフ情報を設定
        this.setBloodTypeData(data.blood_type_count);
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoadingOrgData = false;
      }
    },
    async fetchGroupedOrganizationMembersData() {
      this.isLoading = true;

      const payload = {
        uuid: this.uuid,
        limit: 10000,
        is_translation: false,
      };

      try {
        const { data } = await fetchGroupedOrganizationMembers(payload);
        this.groupedMembers = data.employment_positions;
      } catch (e) {
        console.log(e);
        alert('ユーザの取得に失敗しました。');
      } finally {
        this.isLoading = false;
      }
    },
    setBloodTypeData(bloodTypeCount: any) {
      const tempSection: any = [];
      // eslint-disable-next-line func-names
      Object.keys(bloodTypeCount).forEach(function(key: string) {
        if (bloodTypeCount[key].name === 'A') {
          tempSection.push({
            label: 'A型',
            value: bloodTypeCount[key].percent,
          });
        } else if (bloodTypeCount[key].name === 'B') {
          tempSection.push({
            label: 'B型',
            value: bloodTypeCount[key].percent,
          });
        } else if (bloodTypeCount[key].name === 'O') {
          tempSection.push({
            label: 'O型',
            value: bloodTypeCount[key].percent,
          });
        } else if (bloodTypeCount[key].name === 'AB') {
          tempSection.push({
            label: 'AB型',
            value: bloodTypeCount[key].percent,
          });
        }
      });
      const sorted = tempSection.sort((a: any, b: any) => b.value - a.value);
      sorted[0].color = '#F09C9C';
      sorted[1].color = '#9498AF';
      sorted[2].color = '#7E8195';
      sorted[3].color = '#D3D5E0';
      this.sections = sorted;
    },
    async fetchOrganizationDataConfig() {
      try {
        const { data } = await fetchOrganizationDataConfig(this.uuid);
        this.configStatus = data;
      } catch (e) {
        console.log(e);
      }
    },
    async favorite(uuid: string) {
      await organizationFavorite(uuid);
      this.organization.is_favorite = true;
    },
    async unfavorite(uuid: string) {
      await organizationUnFavorite(uuid);
      this.organization.is_favorite = false;
    },
    async fetchNotificationsData(): Promise<void> {
      try {
        const { data } = await fetchUserNotifications();
        this.notices = data.data;
      } catch (e) {
        console.log(e);
      }
    },
    async putUserNotice(notice: AppApiResponse.UserNotice) {
      try {
        await putUserNotice(notice.uuid);
      } catch (e) {
        console.log(e);
      }
    },
    randomImage() {
      const randomIndex = Math.floor(Math.random() * this.randomImages.length);
      const randomImage = this.randomImages[randomIndex];

      return randomImage;
    },
  },
});
</script>

<style lang="scss" scoped>
.loading {
  margin: 30% auto 0;
}

.base-tabs {
  width: 111%;
  margin: 0 0 0 -40px;
  border-bottom: 1px solid $ruled_line;

  &--data {
    width: 100%;
    margin: 0;
  }
}

.container {
  width: 800px;
  padding: 40px;
  min-height: 600px;
  margin: 40px auto 120px auto;
  background-color: $true_white;
  box-shadow: 0 3px 6px $box_shadow;
  border-radius: 4px;

  &--data {
    padding: 0;
  }
}

.org-header--data {
  padding: 40px 40px 0;
}

// データ
.data-header {
  height: 64px;
  font-size: 13px;
  font-weight: 600;
  line-height: 20;
  display: flex;
  align-items: center;
  padding: 0 0 0 16px;
  color: $gray_blue_4;
  background-color: $white_1;
}
</style>
