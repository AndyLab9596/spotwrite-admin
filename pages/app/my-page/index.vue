/*eslint no-param-reassign: "error"*/
<template>
  <div class="container">
    <div class="common-container">
      <user-info-box
        :user-info="userProfile"
        :bulletin-board="isBulletinBoard"
        @fresh="freshProfileData"
      />
      <base-tabs
        :items="tabItems"
        :selected-tab="selectedTab"
        class="tabs-container"
        @change-tab="selectTab($event)"
      ></base-tabs>
    </div>

    <vue-loading
      v-if="isLoading.includes(selectedTab)"
      type="spin"
      class="loading"
      color="#333"
      :size="{ width: '50px', height: '110px' }"
    />
    <div class="body-container">
      <user-activity
        v-if="selectedTab === 'my-activity'"
        :activities="activities"
        :posts="posts"
        :is-loading="isLoading.includes('my-activity')"
      />
      <post-cards
        v-if="selectedTab === 'my-posts'"
        class="post-cards"
        :items="myPosts"
        :is-loading="isLoading.includes('my-posts')"
        :is-visitor="isVisitor"
        @onClickDeletePost="clickDeletePost"
        @onClickEditPost="clickEditPost"
      />
      <post-cards
        v-if="selectedTab === 'favorite-posts'"
        class="post-cards"
        :items="favoritePosts"
        :is-loading="isLoading.includes('favorite-posts')"
        :is-visitor="isVisitor"
        @onClickDeletePost="clickDeletePost"
        @onClickEditPost="clickEditPost"
      />
      <community-cards
        v-if="selectedTab === 'favorite-community'"
        :items="favoriteCommunities"
        :is-loading="isLoading.includes('favorite-community')"
        @unfavorite="unfavorite"
      />
      <organization-cards
        v-if="selectedTab === 'favorite-organizations'"
        :items="favoriteOrganizations"
        :is-loading="isLoading.includes('favorite-organizations')"
      />
      <post-create-modal
        v-if="showPostCreateModal"
        :edit-post-uuid="editPostUuid"
        @close="closeModal"
        @re-render="reRender"
      />
    </div>
    <vue-loading
      v-if="
        (selectedTab === 'my-posts' && myPostsIsLoading) ||
          (selectedTab === 'favorite-posts' && favoritePostsIsLoading)
      "
      type="spin"
      class="loading"
      color="#333"
      :size="{ width: '50px', height: '110px' }"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { VueLoading } from 'vue-loading-template';
import PostCards from '@/components/App/organisms/list/PostCards.vue';
import BaseTabs from '@/components/App/molecules/tabs/BaseTabs.vue';
import { mapGetters } from 'vuex';
import CommunityCards from '@/components/App/organisms/list/CommunityCards.vue';
import OrganizationCards from '@/components/App/organisms/list/OrganizationCards.vue';
import PostCreateModal from '@/components/App/organisms/modal/PostCreateModal.vue';
import {
  fetchMyPosts,
  fetchFavoritePosts,
  fetchCommunities,
  fetchFavoriteOrganizations,
  fetchUserActivities,
  fetchInvitedEvents,
  communityUnFavorite,
  fetchUser,
  deletePost,
  fetchUserNotifications,
  putUserNotice,
} from '@/libs/api/app';
import { fetchUserProfile } from '@/libs/api';
import UserInfoBox from '@/components/App/organisms/my-page/UserInfoBox.vue';
import UserActivity from '@/components/App/organisms/my-page/UserActivity.vue';

export default Vue.extend({
  layout: 'app/default',
  components: {
    VueLoading,
    PostCards,
    BaseTabs,
    UserInfoBox,
    CommunityCards,
    OrganizationCards,
    UserActivity,
    PostCreateModal,
  },
  data() {
    return {
      tabItems: [
        {
          id: 'my-activity',
          name: '活用状況',
        },
        {
          id: 'my-posts',
          name: '投稿一覧',
        },
        {
          id: 'favorite-posts',
          name: 'お気に入り記事',
        },
        {
          id: 'favorite-organizations',
          name: 'お気に入り組織',
        },
        {
          id: 'favorite-community',
          name: 'お気に入りコミュニティ',
        },
      ],
      selectedTab: 'my-activity' as string,
      myPosts: null as Array<AppApiResponse.Post>,
      myPostsOffset: 0 as number,
      myPostsLimit: 20 as number,
      myPostsIsLoading: false as boolean,
      myPostsIsFetching: false as boolean,
      favoritePosts: null as Array<AppApiResponse.Post>,
      favoritePostsOffset: 0 as number,
      favoritePostsLimit: 20 as number,
      favoritePostsIsLoading: false as boolean,
      favoritePostsIsFetching: false as boolean,
      isLoadingList: [] as Array,
      communities: [] as Array<AppApiResponse.Community> | [],
      favoriteOrganizations: [] as Array<AppApiResponse.Organization>,
      activities: {} as AppApiResponse.Activity,
      posts: [] as AppApiResponse.Post[],
      accessPermission: 'all' as string,
      editPostUuid: '' as string,
      showPostCreateModal: false as boolean,
      notices: [] as AppApiResponse.UserNotice[],
      isBulletinBoard: false as boolean,
    };
  },
  computed: {
    ...mapGetters(['userProfile', 'isEnableBulletinBoard']),
    isVisitor(): boolean {
      return ['visitor'].includes(this.accessPermission);
    },
    isLoading() {
      return this.isLoadingList.map((tab: string) => tab.replace(/-\d+$/, ''));
    },
    favoriteCommunities() {
      return this.communities.filter(
        (community: AppApiResponse.Community) => community.is_favorite
      );
    },
  },
  watch: {
    async selectedTab(value: string) {
      if (value === 'my-posts' && !this.myPosts) {
        this.myPosts = [];
        this.isLoadingList.push('my-posts');
        await this.fetchMyPostsData();
        this.onLoaded('my-posts');
        if (this.myPosts.length >= this.myPostsLimit) {
          this.myPostsIsLoading = true;
          document.addEventListener('scroll', this.onMyPostsScroll);
        }
      }
      if (value === 'favorite-posts' && !this.favoritePosts) {
        this.favoritePosts = [];
        this.isLoadingList.push('favorite-posts');
        await this.fetchFavoritePostsData();
        this.onLoaded('favorite-posts');
        if (this.favoritePosts.length >= this.favoritePostsLimit) {
          this.favoritePostsIsLoading = true;
          document.addEventListener('scroll', this.onFavoritePostsScroll);
        }
      }
    },
  },
  async created(): Promise<void> {
    this.isLoadingList = [
      'my-activity-1',
      'my-activity-2',
      'favorite-community',
      'favorite-organizations',
    ];
    const {
      data: { access_permission },
    } = await fetchUser(this.userProfile.uuid);
    this.accessPermission = access_permission;
    this.fetchCommunities();
    this.fetchFavoriteOrganizationsData();
    this.fetchUserActivities();
    this.fetchInvitedEvents();
    this.fetchNotificationsData().then(() => {
      const updateNotifications: any = [...this.notices].filter((item: any) => {
        let params: any = {};
        if (item.params) {
          params = JSON.parse(item.params);
        }
        return (
          !item.is_read && params && params.initialRouteName === 'ProfileEdit'
        );
      });
      if (updateNotifications) {
        updateNotifications.forEach((notification: any) => {
          this.putUserNotice(notification);
        });
      }
    });
    this.isBulletinBoard = this.isEnableBulletinBoard;
  },
  methods: {
    closeModal() {
      this.showPostCreateModal = false;
    },
    onLoaded(str: string) {
      this.isLoadingList = this.isLoadingList.filter(
        (tab: string) => tab !== str
      );
    },
    async onMyPostsScroll() {
      const { scrollTop, scrollHeight } = document.documentElement;
      const { innerHeight } = window;
      if (
        this.selectedTab === 'my-posts' &&
        this.myPostsIsLoading &&
        !this.myPostsIsFetching &&
        Math.ceil(scrollTop) + innerHeight + 110 >= scrollHeight
      ) {
        this.myPostsIsFetching = true;
        await this.fetchMyPostsData();
        document.documentElement.scrollTop = scrollTop + 1;
      }
    },
    async onFavoritePostsScroll() {
      const { scrollTop, scrollHeight } = document.documentElement;
      const { innerHeight } = window;
      if (
        this.selectedTab === 'favorite-posts' &&
        this.favoritePostsIsLoading &&
        !this.favoritePostsIsFetching &&
        Math.ceil(scrollTop) + innerHeight + 110 >= scrollHeight
      ) {
        this.favoritePostsIsFetching = true;
        await this.fetchFavoritePostsData();
        document.documentElement.scrollTop = scrollTop + 1;
      }
    },
    async fetchMyPostsData() {
      const { data } = await fetchMyPosts({
        limit: this.myPostsLimit,
        offset: this.myPostsOffset,
      });
      if (data.posts.length < this.myPostsLimit) {
        this.myPostsIsLoading = false;
        document.removeEventListener('scroll', this.onMyPostsScroll);
      }
      this.myPostsOffset += this.myPostsLimit;
      this.myPosts = [...this.myPosts, ...data.posts];
      this.myPostsIsFetching = false;
    },
    async fetchFavoritePostsData() {
      const { data } = await fetchFavoritePosts({
        limit: this.favoritePostsLimit,
        offset: this.favoritePostsOffset,
      });
      if (data.posts.length < this.favoritePostsLimit) {
        this.favoritePostsIsLoading = false;
        document.removeEventListener('scroll', this.onFavoritePostsScroll);
      }
      this.favoritePostsOffset += this.favoritePostsLimit;
      this.favoritePosts = [...this.favoritePosts, ...data.posts];
      this.favoritePostsIsFetching = false;
    },
    selectTab(tab: string) {
      this.selectedTab = tab;
    },
    async fetchCommunities(): Promise<void> {
      const {
        data: { data: communities },
      } = await fetchCommunities({ limit: 100 });
      this.communities = [
        ...this.communities,
        ...communities.filter(
          (community: AppApiResponse.Community) => community.is_favorite
        ),
      ];
      this.onLoaded('favorite-community');
    },
    async unfavorite(uuid: string) {
      this.changeFavoriteIcon(uuid, false);
      try {
        await communityUnFavorite(uuid);
      } catch (e) {
        this.changeFavoriteIcon(uuid, true);
      }
    },
    changeFavoriteIcon(uuid: string, isFavorite: boolean) {
      this.communities = this.communities.map((c: AppApiResponse.Community) => {
        if (c.uuid === uuid) {
          return { ...c, is_favorite: isFavorite };
        }
        return c;
      });
    },
    async fetchFavoriteOrganizationsData() {
      const { data } = await fetchFavoriteOrganizations({
        users_count: false,
      });
      this.favoriteOrganizations = data.organizations;
      this.onLoaded('favorite-organizations');
    },
    async fetchUserActivities() {
      const { data } = await fetchUserActivities();
      this.activities = data.activities;
      this.onLoaded('my-activity-1');
    },
    async fetchInvitedEvents() {
      const { data } = await fetchInvitedEvents();
      this.posts = data.posts;
      this.onLoaded('my-activity-2');
    },
    async reRender() {
      this.isLoadingList = [
        'my-activity-1',
        'my-activity-2',
        'favorite-community',
        'favorite-organizations',
      ];
      this.myPosts = null;
      this.favoritePosts = null;
      this.selectedTab = 'my-activity';
      this.myPostsOffset = 0;
      this.myPostsLimit = 20;
      this.favoritePostsOffset = 0;
      this.favoritePostsLimit = 20;
      this.fetchCommunities();
      this.fetchFavoriteOrganizationsData();
      this.fetchUserActivities();
      this.fetchInvitedEvents();
      this.myPostsIsLoading = false;
      this.favoritePostsIsLoading = false;
    },
    async clickDeletePost(uuid: string) {
      try {
        await deletePost(uuid);
        window.location.reload();
      } catch (e) {
        alert('記事を削除できませんでした。');
      }
    },
    clickEditPost(uuid: string) {
      this.editPostUuid = uuid;
      this.showPostCreateModal = true;
    },
    async freshProfileData() {
      const { data: userProfile } = await fetchUserProfile();
      this.$accessor.setUserProfile(userProfile);
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
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  margin-top: 40px;
}

.common-container {
  box-shadow: 0 1px 2px #dce5ef;
  border-radius: 4px;
  margin-bottom: 40px;
}

.body-container {
  min-height: 200px;
}

.tabs-container {
  margin: 0;

  & /deep/ .tab {
    flex-grow: 1;
    width: auto !important;
    white-space: nowrap;
  }
}

.loading {
  margin: auto;
  padding: 30px 0;
}

.post-cards {
  margin-bottom: 40px;
}
</style>
