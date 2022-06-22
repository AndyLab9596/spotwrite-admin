<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="コミュニティ一覧・編集">
        <template #tutorial>
          <TutorialButtonIcon :url="`/admin/tutorial/community-list.html`" />
        </template>
        <template #description>
          誰でもコミュニティを登録することができます。
        </template>
      </page-header>
      <div class="toolbar">
        <div class="sorting-box">
          <span class="label">コミュニティを並び替え：</span>
          <div class="sorting-switch">
            <integrated-switch-button
              v-model="sortState"
              :items="sortItems"
              @input="selectSort"
            />
            <sort-menu
              v-if="showSortMenu === 'user_count'"
              class="sort-menu user-count"
              :selected="selectedSortState"
              :items="[
                { text: '人数が多い順', value: 'desc' },
                { text: '人数が少ない順', value: 'asc' },
                { text: '順番を元に戻す', value: 'default' },
              ]"
              @input="sort"
            ></sort-menu>
            <sort-menu
              v-if="showSortMenu === 'name'"
              class="sort-menu name"
              :selected="selectedSortState"
              :items="[
                { text: 'あ→ん の順', value: 'asc' },
                { text: 'ん→あ の順', value: 'desc' },
                { text: '順番を元に戻す', value: 'default' },
              ]"
              @input="sort"
            ></sort-menu>
            <sort-menu
              v-if="showSortMenu === 'created_at'"
              class="sort-menu created-at"
              :selected="selectedSortState"
              :items="[
                { text: '日付が新しい順', value: 'desc' },
                { text: '日付が古い順', value: 'asc' },
                { text: '順番を元に戻す', value: 'default' },
              ]"
              @input="sort"
            ></sort-menu>
          </div>
        </div>
        <div class="button-box">
          <add-button @click="goToCreateCommunityPage">
            コミュニティを新規で登録する
          </add-button>
        </div>
      </div>
      <div class="contents">
        <vue-loading
          v-if="isLoading"
          type="spin"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
        <community
          v-for="community in communities"
          :key="community.uuid"
          :community="community"
          class="community"
          @open-add-user-modal="openAddUserModal"
          @refresh-community-user="refreshCommunityUser"
        />
        <div v-if="communities.length > 0" class="pagination-box">
          <base-pagination
            :value="{
              number: pagination.current_page,
              offset: pagination.from - 1,
              limit: Number(pagination.per_page),
              total: pagination.total,
            }"
            @go-to-page="page"
          />
        </div>
      </div>
    </div>
    <CommunityAddMemberModal
      v-if="isAddUserCommunityModalVisible"
      :users="users"
      @close="closeAddUserModal"
      @submit="addUser"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  AddButton,
  CommunityAddMemberModal,
  IntegratedSwitchButton,
  SortMenu,
} from '@/components/Admin/Pages/';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import Community from '@/components/Admin/Pages/CommunityManagement/Community.vue';
import { VueLoading } from 'vue-loading-template';

import {
  addCommunityUser,
  createCommunity,
  fetchCommunities,
  fetchCommunityRule,
} from '@/libs/api';
import { Route } from 'vue-router/types/router';
import BasePagination from '@/components/Admin/Modules/Pagination/BasePagination.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';

type Community = ApiResponse.Community;

type PayloadData = {
  uuid: string;
  name: string;
};

export default Vue.extend({
  layout: 'admin/default',
  components: {
    VueLoading,
    PageHeader,
    IntegratedSwitchButton,
    AddButton,
    BasePagination,
    SortMenu,
    Community,
    CommunityAddMemberModal,
    TutorialButtonIcon,
  },
  data() {
    return {
      deleteCommunityModal: false,
      deleteCommunityId: 0,
      addCommunityId: 0,
      communities: [] as (Community & ApiResponse.CommunityRule)[],
      pagination: {} as ApiResponse.Pagination,
      sortItems: [
        { text: '人数順', value: 'user_count' },
        { text: 'あいうえお順', value: 'name' },
        { text: '登録順', value: 'created_at' },
      ],
      sortStateKey: null as null | string,
      sortStates: [
        { key: 'user_count', state: '' },
        { key: 'name', state: '' },
        { key: 'created_at', state: '' },
      ],
      showSortMenu: '',
      createLoading: false,
      isAlertModalVisible: false,
      isAddUserCommunityModalVisible: false,
      alertModalMessage: '',
      organizations: [] as ApiResponse.Organization[],
      companies: [] as ApiResponse.Organization[],
      positions: [] as PayloadData[],
      statuses: [] as PayloadData[],
      users: [] as ApiResponse.UserInfo[],
      communityUuid: '',
      isLoading: false as boolean,
    };
  },
  computed: {
    joinedMembers() {
      const community = this.communities.find(
        (c: Community) => c.uuid === this.communityUuid
      );
      return Object.values(community.companies).flatMap(
        (c: Community) => c.users
      );
    },
    selectedSortState(): string {
      const res = this.sortStates.find(
        (state: { key: string; state: string }) =>
          state.key === this.showSortMenu
      )!.state;
      return res;
    },
    currentPage: {
      get(): number {
        const { page } = this.$route.query;
        if (typeof page !== 'string') {
          return 1;
        }
        return page ? parseInt(page, 10) : 1;
      },
      set(v: number) {
        this.$router.push({
          path: '/admin/community-management',
          query: { page: `${v}`, orders: this.orders },
        });
      },
    },
    orders: {
      get(): string[] {
        const { orders } = this.$route.query;
        if (orders == null) {
          return [];
        }
        if (typeof orders !== 'object') {
          if (orders.length) {
            return [orders.slice(0, 1) === '-' ? orders.slice(1) : orders];
          }
          return [];
        }
        return orders ?? [];
      },
      set(v: string[]) {
        this.$router.push({
          path: '/admin/community-management',
          query: { page: '1', orders: v },
        });
      },
    },
    sortState: {
      get(): string {
        const order = this.sortStateKey ?? this.orders[0];
        if (order == null) {
          return '';
        }
        return order.slice(0, 1) === '-' ? order.slice(1) : order;
      },
      set(v: string) {
        this.sortStateKey = v;
      },
    },
  },
  watch: {
    async $route(route: Route) {
      const page =
        !('page' in route.query) || typeof route.query.page !== 'string'
          ? 1
          : parseInt(route.query.page, 10);
      const orders =
        !('orders' in route.query) || typeof route.query.orders !== 'object'
          ? []
          : (route.query.orders as string[]);
      this.fetchCommunities(page, orders);
    },
  },
  async created() {
    this.isLoading = true;
    await this.fetchCommunities(this.currentPage, this.orders);
    if (this.hasNotCommunity()) {
      this.$router.push('/admin/community-management/create');
    }
    this.isLoading = false;
  },
  methods: {
    openAddUserModal(uuid: string) {
      this.communityUuid = uuid;
      this.isAddUserCommunityModalVisible = true;
    },
    closeAddUserModal() {
      this.communityUuid = '';
      this.isAddUserCommunityModalVisible = false;
    },
    sort(order: string) {
      this.sortStates = this.sortStates.map(
        (state: { key: string; state: string }) => {
          if (this.showSortMenu === state.key) {
            return { ...state, state: order };
          }
          return { ...state, state: '' };
        }
      );

      if (order === 'default') {
        this.sortReset();
        return;
      }
      this.sortBy(`${order === 'desc' ? '-' : ''}${this.showSortMenu}`);
      this.showSortMenu = '';
    },
    sortReset() {
      // @ts-ignore
      this.sortStates[this.showSortMenu] = '';
      this.orders = [];
      this.showSortMenu = '';
      this.sortState = '';
    },
    selectSort(v: string) {
      this.showSortMenu = v;
    },
    hasNotCommunity(): boolean {
      // TODO ユーザー情報をストアで持つようになったら「管理者以外かつコミュニティ未参加のメンバー」の制御を実装してください
      if (this.$accessor.loading) {
        return false;
      }
      return this.communities.length === 0;
    },
    async fetchCommunities(page: number, orders: string[]): Promise<void> {
      this.$accessor.setLoading(true);
      try {
        const { data } = await fetchCommunities(page, orders);
        const { data: communityRules } = await fetchCommunityRule();
        this.communities = data.data.map((community: ApiResponse.Community) => {
          return {
            ...community,
            community_team_episode:
              communityRules.rules.find(
                (rule: ApiResponse.CommunityRule) =>
                  rule.uuid === community.uuid
              )?.community_team_episode ?? 'normal',
          };
        });
        this.pagination = data.meta;
      } catch (e) {
        console.error(e);
      } finally {
        this.$accessor.setLoading(false);
      }
    },
    sortBy(field: string): void {
      this.orders = [field];
    },
    takePages(n: number): number[] {
      const min = 1;
      const max = this.pagination.last_page;
      const curr = this.currentPage;
      let center = curr;
      if (center > max - 2) {
        center = max - 2;
      } else if (center < min + 2) {
        center = min + 2;
      }
      const offset = center - 2;

      return Array.from(Array(n), (_v: any, k: number) => k + offset);
    },
    hasPrev(n: number): boolean {
      return n - 1 >= 1;
    },
    hasNext(n: number): boolean {
      return n + 1 <= this.pagination.last_page;
    },
    isCurrentPage(n: number): boolean {
      return n === this.currentPage;
    },
    page(page: number): void {
      this.currentPage = page;
    },
    openAddUser(key: number) {
      this.openAddUserModal = true;
      this.addCommunityId = key;
    },
    async createCommunity(newCommunity: ApiRequest.NewCommunity) {
      try {
        this.createLoading = true;
        const { data } = await createCommunity(newCommunity);

        // 同じ場所に push すると遷移しないのでコミュニティの追加が反映されないので uuid をクエリパラメータに含めることで回避した
        this.$router.push({
          path: '/admin/community-management',
          query: {
            page: '1',
            orders: ['-created_at'],
            uuid: data.uuid,
          },
        });
      } catch (e) {
        console.error(e);
      } finally {
        this.createLoading = false;
      }
    },
    async addUser(userUuidList: string[]) {
      try {
        await addCommunityUser(this.communityUuid, { users: userUuidList });
      } catch (error) {
        console.error(error);
      }
      // FIXME: ユーザー登録の仕様決まり次第書き直すので一旦リロードしている
      window.location.reload();
      // FIXME: エラーになるのでコメントアウト
      // // @ts-ignore
      // this.communities[this.addCommunityId].companies[0].users = [
      //   // @ts-ignore
      //   ...this.communities[this.addCommunityId].companies[0].users,
      //   ...users,
      // ];
      // this.openAddUserModal = false;
    },
    refreshCommunityUser() {
      this.fetchCommunities(this.currentPage, this.orders);
    },
    goToCreateCommunityPage() {
      this.$router.push({
        path: '/admin/community-management/registration',
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.toolbar {
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  margin-top: 32px;
  padding: 15px;
  display: flex;
  justify-content: space-between;

  .sorting-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
      font-size: 13px;
      color: $dark_blue;
    }
  }

  .sorting-switch {
    position: relative;
    margin-left: 6px;
  }

  .sort-menu {
    position: absolute;
    z-index: 1;
    top: 26px;

    &.user-count {
      left: 2px;
    }

    &.name {
      left: 52px;
    }

    &.created-at {
      left: 106px;
    }
  }

  .sorting_options {
    list-style: none;
    display: inline-block;

    li {
      display: inline-block;

      a {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }

  .sort-box {
    span {
      font-size: 13px;
      font-weight: 300;
    }
  }
}

.contents {
  position: relative;
  height: 100%;
  min-height: 900px;

  .community {
    margin-top: 40px;
  }
}

.pagination-box {
  margin-top: 25px;
  display: flex;
  justify-content: flex-end;
}

.vue-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}
</style>
