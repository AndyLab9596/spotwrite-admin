<template>
  <div class="l-page-container">
    <div class="page">
      <div class="page-top">
        <page-header title="組織一覧・編集">
          <template #tutorial>
            <TutorialButtonIcon
              :url="`/admin/tutorial/organization-list.html`"
            />
          </template>
          <template #description>
            部署・支店・店舗に関する情報を一覧で確認することができます。
          </template>
        </page-header>
        <scrollable-tabs
          :companies="forTabItem.concat(companies(organizations))"
          :current-id="currentCompanyUuid"
          :company-count-threshold="7"
          @change-tab="changeCompanyTab($event)"
        />
      </div>
      <vue-loading
        v-if="isLoading"
        type="spin"
        color="#333"
        :size="{ width: '50px', height: '50px' }"
      ></vue-loading>
      <organization-list
        v-if="!isLoading"
        :current-company-id="currentCompanyUuid"
        :organizations="organizations"
        :config-rules="configRules"
        @changePublic="execChangePublicSelectTag"
        @delete="execDeleteOrganization"
      ></organization-list>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { OrganizationList } from '@/components/Admin/Pages/';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import {
  fetchOrganizations,
  deleteOrganization,
  publishOrganization,
  unpublishOrganization,
  fetchConfigRules,
} from '@/libs/api';
import { VueLoading } from 'vue-loading-template';
import ScrollableTabs from '@/components/Admin/Modules/Tab/ScrollableTabs.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    OrganizationList,
    VueLoading,
    PageHeader,
    ScrollableTabs,
    TutorialButtonIcon,
  },
  data() {
    return {
      showProcedure: false as boolean,
      currentCompanyUuid: 'all' as string,
      organizations: [] as ApiResponse.GroupOrganization[],
      isLoading: true as boolean,
      forTabItem: [
        {
          uuid: 'all',
          name: '全てを表示',
        },
      ],
      configRules: {} as ApiResponse.ConfigRules,
    };
  },
  computed: {
    active() {
      return (id: string): boolean => {
        return this.$data.currentCompanyUuid === id;
      };
    },
    companies() {
      return (
        organizations: ApiResponse.GroupOrganization[]
      ): ApiResponse.GroupOrganization[] => {
        return organizations.filter(
          (n: ApiResponse.Organization) => n.type === 'company'
        );
      };
    },
  },
  async created() {
    await Promise.all([
      this.fetchOrganizationsData(),
      this.fetchConfigRulesData(),
    ]);
  },
  methods: {
    async execChangePublicSelectTag(uuid: string, status: string) {
      try {
        if (status === 'public') {
          await publishOrganization(uuid);
        } else {
          await unpublishOrganization(uuid);
        }
      } catch (err) {
        this.organizations = this.organizations.map(
          (organization: ApiResponse.GroupOrganization) => {
            const o = organization;
            if (o.uuid === uuid) {
              o.status = status === 'public' ? 'private' : 'public';
            }
            return o;
          }
        );
        console.error(err);
        alert('ステータスの更新に失敗しました');
      }
    },
    async execDeleteOrganization(uuid: string) {
      try {
        await deleteOrganization(uuid);
        this.organizations = this.organizations.filter(
          (organization: ApiResponse.GroupOrganization) =>
            organization.uuid !== uuid
        );
      } catch (err) {
        console.error(err);
      }
    },
    async fetchOrganizationsData() {
      const res = await fetchOrganizations();
      this.organizations = res.data.organizations;
      this.isLoading = false;
    },
    async fetchConfigRulesData() {
      const { data } = await fetchConfigRules();
      this.configRules = data;
    },
    changeCompanyTab(uuid: string) {
      this.currentCompanyUuid = uuid;
    },
    goToOrganizationGroupPage() {
      this.$router.push({
        path: '/admin/organization-management/grouping/groups',
      });
    },
  },
});
</script>

<style lang="scss" scoped>
* {
  color: $dark_blue;
}

.page {
  min-height: calc(100% - 128px);
  margin: 0 40px;
  position: relative;
}

.page-top {
  position: relative;
  width: 960px;
}

.type-tag {
  background-color: #0063b9;

  &--blue {
    background-color: #0063b9;
  }

  &--yellow {
    background-color: #e9b653;
  }

  &--green {
    background-color: #87c34b;
  }
}

.scrollable-tabs {
  margin: 30px 0 11px;
}
</style>
