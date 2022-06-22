<template>
  <div class="container">
    <div v-if="isLoading" class="loading-container">
      <vue-loading
        type="spin"
        class="loading"
        color="#333"
        :size="{ width: '50px', height: '50px' }"
      />
    </div>

    <div v-else>
      <div
        class="hero-image"
        :style="{ backgroundImage: 'url(' + company.main_image + ')' }"
      ></div>

      <header class="company-header">
        <img
          class="logo"
          :src="`${company.logo_image}`"
          onerror="document.getElementById('company-name').style.display = null; this.remove();"
        />
        <div id="company-name" class="name" :style="{ display: 'none' }">
          {{ company.name }}
        </div>
        <div class="employee-count">
          社員数：{{ company.subordinated_organization_user_count }}名
          <span v-if="establishDate" class="establish-date">
            設立日：{{ establishDate }}
          </span>
        </div>
        <!-- TODO クリック時に is_favorite = true(?) -->
        <img src="@/assets/image/bookmark.svg" class="bookmark" />
      </header>

      <base-tabs
        :items="tabItems"
        :selected-tab="selectedTab"
        @change-tab="selectTab($event)"
      ></base-tabs>

      <div class="content">
        <!-- 会社概要 -->
        <company-overview
          v-show="selectedTab === 'overview' && !isLoadingCompanyData"
          :leader="company.leader"
          :detail="company.detail"
          :images="company.images"
        />

        <company-member
          v-show="selectedTab === 'member'"
          :grouped-members="groupedMembers"
          :is-visitor="isVisitor"
        />

        <!-- 会社データ -->
        <company-data
          v-show="selectedTab === 'data'"
          :is-loading="isLoadingCompanyData"
          :organization-data="companyData"
          :config-status="configStatus"
          :sections="sections"
        />

        <!-- 沿革 -->
        <company-history
          v-show="selectedTab === 'history' && !isLoadingCompanyData"
          :histories="company.detail && company.detail.histories"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Route } from 'vue-router';
import { VueLoading } from 'vue-loading-template';
import { mapGetters } from 'vuex';
import { timestampToDateString } from '@/libs/dayjs';
import BaseTabs from '@/components/App/molecules/tabs/BaseTabs.vue';
import CompanyOverview from '@/components/App/organisms/company/CompanyOverview.vue';
import CompanyMember from '@/components/App/organisms/company/CompanyMember.vue';
import CompanyData from '@/components/App/organisms/company/CompanyData.vue';
import CompanyHistory from '@/components/App/organisms/company/CompanyHistory.vue';
import {
  fetchOrganization,
  fetchOrganizationData,
  fetchGroupedOrganizationMembers,
  fetchUser,
} from '@/libs/api/app';
import { fetchOrganizationDataConfig } from '@/libs/api';

export default Vue.extend({
  layout: 'app/default',
  components: {
    VueLoading,
    BaseTabs,
    CompanyOverview,
    CompanyMember,
    CompanyData,
    CompanyHistory,
  },
  data() {
    return {
      tabItems: [
        {
          id: 'overview',
          name: '会社概要',
        },
        {
          id: 'member',
          name: 'メンバー',
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
      selectedTab: 'data' as string,
      isLoading: false,
      isLoadingCompanyData: false,
      companyData: {} as AppApiResponse.OrganizationData,
      company: {} as AppApiResponse.Organization,
      groupedMembers: [] as AppApiResponse.GroupedOrganizationMember[],
      sections: [] as any,
      blood_type_count: [] as Array<AppApiResponse.CountPercent>,
      configStatus: {} as ApiResponse.OrganizationDataConfig,
      accessPermission: 'all' as string,
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeRouteUpdate(to: Route, from: Route, next: Function) {
    this.selectedTab = to.query.tab ? String(to.query.tab) : 'overview';
    next();
  },
  computed: {
    ...mapGetters(['userProfile']),
    isVisitor(): boolean {
      return ['visitor'].includes(this.accessPermission);
    },
    establishDate(): string {
      return this.company.detail && this.company.detail.establish_date
        ? timestampToDateString(
            this.company.detail.establish_date,
            'YYYY年M月D日'
          )
        : '';
    },
  },
  async created(): Promise<void> {
    await Promise.all([
      this.fetchUser(),
      this.fetchCompany(),
      this.fetchCompanyData(),
      this.fetchOrganizationDataConfig(),
      this.fetchGroupedOrganizationMembersData(),
    ]);
  },
  methods: {
    selectTab(key: string) {
      this.selectedTab = key;
    },
    async fetchUser(): Promise<void> {
      const {
        data: { access_permission },
      } = await fetchUser(this.userProfile.uuid);
      this.accessPermission = access_permission;
    },
    async fetchCompany(): Promise<void> {
      this.isLoading = true;

      try {
        // Vuex 'user' getter
        const { data } = await fetchOrganization(this.userProfile.company_uuid);
        this.company = data;
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchCompanyData() {
      this.isLoadingCompanyData = true;
      try {
        const { data } = await fetchOrganizationData(
          this.userProfile.company_uuid
        );
        this.companyData = data;

        // 血液型の円グラフ情報を設定
        this.setBloodTypeData(data.blood_type_count);
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoadingCompanyData = false;
      }
    },
    async fetchGroupedOrganizationMembersData() {
      this.isLoading = true;

      const payload = {
        uuid: this.userProfile.company_uuid,
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
        const { data } = await fetchOrganizationDataConfig(
          this.userProfile.company_uuid
        );
        this.configStatus = data;
      } catch (e) {
        console.log(e);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.loading-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  background-color: $true_white;
  padding: 40px;
  margin: 40px auto 120px auto;
  box-shadow: 0 3px 6px $box_shadow;
  border-radius: 4px;
}

.base-tabs {
  width: 111%;
  margin: 0 0 0 -40px;
  border-bottom: 1px solid $ruled_line;
}

.hero-image {
  width: 100%;
  height: 152px;
  border-radius: 4px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.company-header {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo {
  margin: 16px 0 0;
  width: 142px;
  height: auto;
}

.name {
  font-size: 15px;
  font-weight: bold;
}

.employee-count {
  margin: 7px 0 16px;
  font-size: 11px;
  line-height: 1;
  color: $main_color;
}

.bookmark {
  cursor: pointer;
  position: absolute;
  top: calc(50% - 8px);
  right: 0;
  line-height: 100%;
}
</style>
