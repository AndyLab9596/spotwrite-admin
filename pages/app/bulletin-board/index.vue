<template>
  <div>
    <div class="content">
      <side-bar
        :is-loading="isLoadingSidebar"
        class="bulletin-board-side-bar"
        :organizations="organizations"
        :selected-organization="selectedOrganization"
        @onChange="selectOrganization"
      />
      <div v-if="isLoadingSidebar || isLoadingList" class="bulletin-board-list">
        <vue-loading
          type="spin"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
      </div>
      <bulletin-board-list
        v-else-if="users && users.length"
        class="bulletin-board-list"
        :users="users"
      />
      <div v-else class="bulletin-board-list">ユーザーが存在しません</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SideBar from '@/components/App/organisms/bulletin-board/SideBar.vue';
import BulletinBoardList from '@/components/App/organisms/bulletin-board/BulletinBoardList.vue';
import { fetchOrganizations, fetchMainAndSubUsers } from '@/libs/api/app';
import { VueLoading } from 'vue-loading-template';

export default Vue.extend({
  layout: 'app/default',
  components: {
    SideBar,
    BulletinBoardList,
    VueLoading,
  },
  data() {
    return {
      isLoadingSidebar: false as boolean,
      isLoadingList: false as boolean,
      organizations: [] as AppApiResponse.Organization[],
      selectedOrganization: '' as string,
      users: [] as AppApiResponse.EmployeeUser[],
    };
  },
  async created() {
    this.fetchMainAndSubUsersData();
    await this.fetchOrganizations();
  },
  methods: {
    async fetchOrganizations() {
      this.isLoadingSidebar = true;
      try {
        const { data } = await fetchOrganizations({
          users_list: false,
        });
        this.organizations = data.organizations;
        this.selectedOrganization = this.organizations[1].uuid;
      } catch (e) {
        // eslint-disable-next-line no-console
        alert('組織の取得に失敗しました。');
      }
      this.isLoadingSidebar = false;
    },
    async fetchMainAndSubUsersData() {
      this.isLoadingList = true;

      const params = {
        limit: 30,
        offset: undefined,
        first_organization: !this.organizations.length,
      };

      try {
        const { data } = await fetchMainAndSubUsers(
          this.selectedOrganization !== ''
            ? this.selectedOrganization
            : this.$accessor.userProfile.organization_uuid,
          params
        );
        this.users = data.users;
      } catch (e) {
        console.error(e);
        alert('ユーザの取得に失敗しました。');
      } finally {
        this.isLoadingList = false;
      }
    },
    selectOrganization(uuid: string) {
      this.selectedOrganization = uuid;
      this.fetchMainAndSubUsersData();
    },
  },
});
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.bulletin-board-side-bar {
  margin: 0 57px 0 0;
}

.bulletin-board-list {
  min-width: 800px;
  margin: 40px 0 120px;
}

.blank {
  display: flex;
  align-items: center;
  width: 100%;
  height: 97px;
  padding: 0 24px;
  box-shadow: 0 1px 2px $box-shadow;
}
</style>
