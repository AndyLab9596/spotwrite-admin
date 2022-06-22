<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="オプション権限一覧・設定">
        <template #tutorial>
          <TutorialButtonIcon
            :url="`/admin/tutorial/optionalpermissions-list.html`"
          />
        </template>
        <template #description>
          spotwriteを運用するのに便利な権限をまとめて確認、設定することができます。
        </template>
      </page-header>
      <scrollable-tabs
        class="tabs"
        :companies="[
          { name: '全てを表示', uuid: 'all' },
          ...Object.values(companies),
        ]"
        display-user-count
        :current-id="selectedCompanyUuid"
        :company-count-threshold="4"
        @change-tab="changeTab"
      />
      <div v-if="!isLoading && users" class="contents">
        <div
          v-for="company in selectedCompany"
          :key="company.uuid"
          class="table-box"
        >
          <authority-table
            ref="authorities"
            class="authority-table"
            :title="company.name"
            :users="filteredUsers(company.uuid)"
            :companies="companies"
            :boxes="boxes"
            :selected-company-uuid="selectedCompanyUuid"
            :disabled="isOpenedOptionAuthorityModal || isOpenedBulkSettingModal"
            @open-bulk-setting-modal="openBulkSettingModal"
            @should-close-bulk-setting-modal="shouldCloseBulkSettingModal"
            @open-option-authority-modal="openOptionAuthorityModal"
            @add="addSelectedUsers"
            @delete="deleteSelectedUsers"
          />
        </div>
        <BasePagination
          v-if="pagination"
          :value="{
            number: pagination.current_page,
            offset: pagination.from - 1,
            limit: Number(pagination.per_page),
            total: pagination.total,
          }"
          class="pagination"
          @go-to-page="goToPage"
        />
      </div>
    </div>
    <option-authority-modal
      v-if="isOpenedOptionAuthorityModal"
      :organizations="companies"
      :authorities="authorities"
      class="option-authority-modal"
      @save="saveOptionAuthority"
      @close="closeOptionAuthorityModal"
    />
    <bulk-setting-modal
      v-if="isOpenedBulkSettingModal"
      @close="isOpenedBulkSettingModal = false"
      @show-option-authority-modal="
        isOpenedBulkSettingModal = false;
        isOpenedOptionAuthorityModal = true;
      "
    />
    <vue-loading
      v-if="isLoading"
      type="spin"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    ></vue-loading>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { uniq } from 'lodash';
import {
  fetchAuthorities,
  fetchOrganizations,
  updateAuthorities,
} from '@/libs/api';
import ScrollableTabs from '@/components/Admin/Modules/Tab/ScrollableTabs.vue';
import { VueLoading } from 'vue-loading-template';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import BasePagination from '@/components/Admin/Modules/Pagination/BasePagination.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';
import OptionAuthorityModal from '@/components/Admin/Pages/AuthoritySetting/OptionAuthorityModal.vue';
import BulkSettingModal from '~/components/Admin/Pages/AuthoritySetting/BulkSettingModal.vue';
import AuthorityTable from '~/components/Admin/Pages/AuthoritySetting/AuthorityTable.vue';

type User = Types.UserAuthority;
type Authorities = Types.Authorities;

export default Vue.extend({
  layout: 'admin/default',
  components: {
    BulkSettingModal,
    PageHeader,
    BasePagination,
    ScrollableTabs,
    VueLoading,
    OptionAuthorityModal,
    AuthorityTable,
    TutorialButtonIcon,
  },
  data() {
    return {
      selectedCompanyUuid: 'all' as string,
      organizations: [] as ApiResponse.Organization[],
      users: null as null | User[],
      isLoading: true as boolean,
      pagination: null as null | ApiResponse.Pagination,
      isOpenedOptionAuthorityModal: false,
      isOpenedBulkSettingModal: false,
      selectedUsers: [] as string[],
      authorities: {
        admin: [],
        readUsageCheck: [],
        readMotivationAnalytics: [],
        readPersonalInformation: [],
      } as Authorities,
      order: '' as Types.Orders,
      page: 1,
    };
  },
  computed: {
    companies(): ApiResponse.Organization[] {
      return this.organizations.filter(
        (o: ApiResponse.Organization) => o.layer === 0
      );
    },
    selectedCompany(): ApiResponse.Organization[] {
      return this.companies.filter((o: ApiResponse.Organization) => {
        if (this.selectedCompanyUuid === 'all') {
          return true;
        }
        return this.selectedCompanyUuid === o.uuid;
      });
    },
    boxes(): ApiResponse.Organization[] {
      return this.organizations.filter(
        (o: ApiResponse.Organization) => o.layer !== 0
      );
    },
  },
  async created() {
    await Promise.all([this.fetchOrganizationsData(), this.fetchUsers()]);
    this.isLoading = false;
  },
  methods: {
    shouldCloseBulkSettingModal() {
      if (this.selectedUsers.length === 0) {
        this.closeModals();
      }
    },
    addSelectedUsers(uuids: string[]) {
      this.selectedUsers = [...this.selectedUsers, ...uuids];
    },
    deleteSelectedUsers(uuids: string[]) {
      this.selectedUsers = this.selectedUsers.filter(
        (uuid: string) => !uuids.includes(uuid)
      );
    },
    closeOptionAuthorityModal() {
      this.selectedUsers = [];
      this.$refs.authorities.forEach((child: unknown) => {
        child.clearSelectedUsers();
      });
      this.isOpenedOptionAuthorityModal = false;
    },
    async saveOptionAuthority(authorities: Types.UserAuthorities) {
      try {
        this.isLoading = true;
        this.isOpenedOptionAuthorityModal = false;
        this.users = null;
        await updateAuthorities({
          users: uniq(this.selectedUsers).filter((s: string) => s),
          authorities,
        });
        await this.fetchUsers();
        this.isLoading = false;
      } catch (e) {
        console.error(e);
      }
    },
    openBulkSettingModal({
      uuid,
      authorities,
    }: {
      uuid: string;
      authorities: Authorities;
    }) {
      this.selectedUsers = [...this.selectedUsers, uuid].filter(
        (s: string) => s
      );
      if (this.isOpenedOptionAuthorityModal) {
        return;
      }
      this.authorities = authorities;
      this.isOpenedBulkSettingModal = true;
    },
    openOptionAuthorityModal({ uuid, authorities }: User) {
      this.selectedUsers = [...this.selectedUsers, uuid];
      this.authorities = authorities;
      this.isOpenedOptionAuthorityModal = true;
    },
    filteredUsers(uuid: string) {
      return this.users?.filter(
        (u: User) =>
          this.organizations.find(
            (o: ApiResponse.Organization) => o.uuid === u.organization
          )?.relations.company === uuid
      );
    },
    async goToPage(page: number) {
      this.closeModals();
      this.isLoading = true;
      this.page = page;
      await this.fetchUsers();
      this.isLoading = false;
    },
    async fetchUsers() {
      const {
        data: { data: users, meta: pagination },
      } = await fetchAuthorities({
        company:
          this.selectedCompanyUuid === 'all' ? '' : this.selectedCompanyUuid,
        page: this.page,
        order: this.order,
      });
      this.users = null;
      this.users = users;
      this.pagination = pagination;
    },
    async fetchOrganizationsData() {
      const { data: organizationsData } = await fetchOrganizations();
      this.organizations = organizationsData.organizations;
    },
    async changeTab(uuid: string) {
      this.closeModals();
      this.selectedCompanyUuid = uuid;
      this.isLoading = true;
      this.users = null;
      this.page = 1;
      await this.fetchUsers();
      this.isLoading = false;
    },
    closeModals() {
      this.isOpenedBulkSettingModal = false;
      this.isOpenedOptionAuthorityModal = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.tabs {
  margin-top: 30px;
}

.contents {
  position: relative;
  height: 100%;
  min-height: 900px;
  background-color: $true_white;
  margin-top: 14px;
  padding: 30px;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  opacity: 1;
}

.table-box {
  & + & {
    margin-top: 37px;
  }
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 25px;
}

.option-authority-modal {
  overflow: scroll;
  height: 95%;
  z-index: 99;
  scrollbar-width: thin;
  scrollbar-color: #7e8195 white;
}
</style>
