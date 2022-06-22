<template>
  <div class="container">
    <post-theme-popup v-if="postTheme" @close="closePopup" />

    <event-share
      class="event-share"
      :is-visitor="isVisitor"
      :new-member-flag="newMemberFlag"
      @shareButtonClick="openModal"
      @openTutorial="openTutorial"
    />

    <!-- ニュース -->
    <vue-loading
      v-if="isLoadingNews"
      type="spin"
      class="news-loading"
      color="#333"
      :size="{ width: '50px', height: '110px' }"
    />
    <news-cards v-if="news.length" class="news-cards" :items="news" />

    <!-- ポスト -->
    <vue-loading
      v-if="isLoadingPost"
      type="spin"
      class="news-loading"
      color="#333"
      :size="{ width: '50px', height: '110px' }"
    />
    <div class="post-cards-container" :class="{ not_new_posts: !news.length }">
      <post-cards
        class="post-cards"
        :items="posts"
        :is-loading="isLoadingPost"
        :is-visitor="isVisitor"
        @onClickDeletePost="clickDeletePost"
        @onClickEditPost="clickEditPost"
      />
      <vue-loading
        v-if="isLoadingGetMorePost"
        type="spin"
        class="loading"
        color="#333"
        :size="{ width: '50px', height: '110px' }"
      />
      <post-create-modal
        v-if="showPostCreateModal"
        :edit-post-uuid="editPostUuid"
        @close="closeModal"
        @re-render="reRender"
      />
      <tutorial-modal v-show="showTutorialModal" @close="closeTutorialModal" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { VueLoading } from 'vue-loading-template';

import EventShare from '@/components/App/organisms/share/EventShare.vue';
import NewsCards from '@/components/App/organisms/list/NewsCards.vue';
import PostCards from '@/components/App/organisms/list/PostCards.vue';
import PostCreateModal from '@/components/App/organisms/modal/PostCreateModal.vue';
import PostThemePopup from '@/components/App/organisms/modal/PostThemePopup.vue';
import {
  fetchPosts,
  fetchNewsPosts,
  deletePost,
  fcmPushNotificationSubscribe,
  fcmPushNotificationUnsubscribe,
  fetchUser,
} from '@/libs/api/app';
import { messaging } from '@/plugins/firebase';
import TutorialModal from '@/components/App/organisms/modal/tutorial/TutorialModal.vue';

interface PostTheme {
  postTheme: number | null;
}

export default Vue.extend({
  layout: 'app/default',
  components: {
    VueLoading,
    EventShare,
    NewsCards,
    PostCards,
    PostCreateModal,
    PostThemePopup,
    TutorialModal,
  },
  data() {
    return {
      showPostCreateModal: false,
      news: [] as Array<AppApiResponse.Post>,
      posts: [] as Array<AppApiResponse.Post>,
      editPostUuid: '' as string,
      isLoadingNews: false,
      isLoadingPost: false,
      isLoadingGetMorePost: false,
      pagination: {} as ApiResponse.Pagination,
      accessPermission: 'all' as string,
      hasNewPostTheme: null as PostTheme['postTheme'],
      showTutorialModal: false,
    };
  },
  computed: {
    isVisitor(): boolean {
      return ['visitor'].includes(this.accessPermission);
    },
    postTheme(): boolean {
      return this.hasNewPostTheme !== null;
    },
    newMemberFlag() {
      return this.$accessor.showTutorialFlag;
    },
  },
  watch: {
    showTutorialModal(newValue: boolean) {
      if (newValue === true) {
        const tutorialShowTimes = this.$accessor.tutorialShowTimes + 1;
        this.$accessor.setTutorialShowTimes(tutorialShowTimes);
      }
    },
  },
  async created(): Promise<void> {
    const {
      data: { access_permission, has_new_post_theme },
    } = await fetchUser(this.$accessor.userProfile.uuid);
    this.accessPermission = access_permission;
    this.hasNewPostTheme = has_new_post_theme;
    await Promise.all([
      this.fetchNewsPostsData(),
      this.fetchPostsData(),
      this.notificationInit(),
    ]);
    if (
      this.$accessor.userProfile.login_times === 1 &&
      this.$accessor.showTutorialFlag === true
    ) {
      this.showTutorialModal = true;
    } else {
      this.showTutorialModal = false;
    }
  },
  mounted() {
    document.addEventListener('scroll', this.infiniteHandler);
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.infiniteHandler);
  },
  methods: {
    async fetchPostsData(offset: number = 0) {
      this.isLoadingPost = true;
      this.isLoadingGetMorePost = true;
      const {
        data: { posts, meta },
      } = await fetchPosts({ offset });
      this.posts = [...this.posts, ...posts];
      this.pagination = meta;
      this.posts = this.posts.map((item: AppApiResponse.Post) => {
        return {
          ...item,
          thumbnail:
            item.thumbnail === null ? '/image/no-image.png' : item.thumbnail,
        };
      });
      this.isLoadingPost = false;
      this.isLoadingGetMorePost = false;
    },
    async reRender() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      this.news = [];
      this.posts = [];
      await Promise.all([
        this.fetchNewsPostsData(),
        this.fetchPostsData(),
        this.notificationInit(),
      ]);
    },
    openModal() {
      this.editPostUuid = '';
      this.showPostCreateModal = true;
    },
    closeModal() {
      this.showPostCreateModal = false;
    },
    async fetchNewsPostsData(): Promise<void> {
      this.isLoadingNews = true;

      try {
        const query = {
          is_top_content: true,
        };
        const { data } = await fetchNewsPosts(query);
        this.news = data.posts;
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoadingNews = false;
      }
    },
    async clickDeletePost(uuid: string) {
      try {
        await deletePost(uuid);
        // FIXME: 挙動の仕様が決まってないので、一旦、全画面リロード
        window.location.reload();
      } catch (e) {
        alert('記事を削除できませんでした。');
      }
    },
    clickEditPost(uuid: string) {
      this.editPostUuid = uuid;
      this.showPostCreateModal = true;
    },
    notificationInit() {
      if (!messaging) return;
      this.notificationSubscribe();
      messaging.onTokenRefresh(async () => {
        await this.notificationSubscribe();
      });
    },
    async notificationSubscribe() {
      try {
        // 既存のTokenがあれば削除してから登録処理を行う
        await this.notificationUnsubscribe();
        await messaging.requestPermission();
        const fcmPushToken = await messaging.getToken();
        if (!fcmPushToken) return;

        localStorage.setItem('fcmPushToken', fcmPushToken);
        await fcmPushNotificationSubscribe({
          token: fcmPushToken,
        });
      } catch (err) {
        console.error(err);
      }
    },
    async notificationUnsubscribe() {
      const fcmPushToken = localStorage.getItem('fcmPushToken');
      if (!fcmPushToken) return;

      try {
        await fcmPushNotificationUnsubscribe({
          token: fcmPushToken,
        });
      } catch (err) {
        console.error(err);
      }
    },
    async infiniteHandler() {
      if (this.isLoadingGetMorePost) {
        return;
      }
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      ) {
        return;
      }
      if (this.pagination.current_page === this.pagination.last_page) {
        return;
      }
      await this.fetchPostsData(this.pagination.to);
    },
    closePopup() {
      this.hasNewPostTheme = null;
    },
    closeTutorialModal() {
      this.showTutorialModal = false;
    },
    openTutorial() {
      this.showTutorialModal = true;
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

.event-share {
  margin-bottom: 16px;
}

.news-cards {
  margin-bottom: 40px;
}

.news-loading {
  margin: auto;
  padding: 30px 0;
}

.post-cards-container {
  min-height: 600px;
}

.post-cards {
  margin-bottom: 40px;
}

.not_new_posts {
  margin-top: 30px;
}
</style>
