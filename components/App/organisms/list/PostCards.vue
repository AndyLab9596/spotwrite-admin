<template>
  <div v-if="(!items || !items.length) && !isLoading">
    投稿がありません。
  </div>
  <div v-else class="post-cards-container">
    <post-card
      v-for="item in items"
      :key="item.uuid"
      :date="item.date"
      :type="item.type"
      :title="item.title"
      :content="item.content"
      :thumbnail="setThumbnail(item)"
      :images="item.images"
      :videos="item.videos"
      :like-count="item.like_count"
      :comment-count="item.comment_count"
      :is-read="item.is_read"
      :is-liked="item.is_liked"
      :is-favorite="item.is_favorite"
      :user="setUser(item)"
      :event="item.event"
      :questionnaire="item.questionnaire"
      :uuid="item.uuid"
      :enrollment-status="enrollmentStatus"
      :is-visitor="isVisitor"
      :publish-setting="item.publish_setting"
      :template="item.template"
      @onClickDeletePost="clickDeletePost"
      @onClickEditPost="clickEditPost"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { fetchEnrollmentStatus } from '@/libs/api/app';
import PostCard from '../../molecules/card/PostCard.vue';

export default Vue.extend({
  components: {
    PostCard,
  },
  props: {
    items: {
      type: Array,
      default: null,
    },
    isLoading: {
      type: Boolean,
      required: false,
    },
    isVisitor: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      enrollmentStatus: {} as AppApiResponse.EnrollmentStatus,
    };
  },
  created() {
    this.fetchEnrollmentStatus();
  },
  methods: {
    clickDeletePost(uuid: string) {
      this.$emit('onClickDeletePost', uuid);
    },
    clickEditPost(uuid: string) {
      this.$emit('onClickEditPost', uuid);
    },
    async fetchEnrollmentStatus() {
      try {
        const { data } = await fetchEnrollmentStatus();
        this.enrollmentStatus = data;
      } catch (e) {
        alert('在籍情報を取得できませんでした。');
      }
    },
    // TODO /posts APIにPOSTする時に動画があれば、サムネイルとして設定
    setThumbnail(item: AppApiResponse.Post) {
      if (item.permission === 'system') {
        return '/app/image/welcome-thumbnail.jpg';
      }
      if (item.videos.length > 0) {
        return item.videos[0];
      }
      return item.thumbnail ?? '/image/no-image.png';
    },
    setUser(item: AppApiResponse.Post) {
      if (item.permission === 'system') {
        return {
          icon: '/app/image/welcome-user-icon.jpg',
          name: 'Spotwrite運営',
        };
      }
      if (!item.user.uuid || !item.user.icon) {
        return {
          icon: '/app/image/default-user-icon.jpg',
          name: '存在しないユーザー',
        };
      }
      return item.user;
    },
  },
});
</script>

<style lang="scss" scoped>
.post-cards-container {
  display: grid;
  grid-template-columns: 48% 48%;
  column-gap: 2%;
  row-gap: 43px;
  min-width: 600px;
}
</style>
