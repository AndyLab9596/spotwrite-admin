<template>
  <div>
    <post-detail-head v-if="!previewMode && !isVisitor" class="header" />
    <div class="post-detail-container">
      <p
        v-if="!isEvent && !isQuestionnaire && isPublishSetting"
        class="date-text"
      >
        {{ publishSettingFormattedDate }} {{ publishSettingFormattedTime }}
      </p>
      <post-detail-title
        :date="post.date"
        :type="post.type"
        :title="post.title"
        class="title"
      />
      <image-select-box
        class="image"
        :src="selectImageSrc"
        :images="getMediaOfPost"
        :select-image-src="selectImageSrc"
        @onChange="changeImage"
      />
      <post-detail-contents
        class="post-contents"
        :content="post.content"
        :user-uuid="post.user.uuid"
        :questionnaire="post.questionnaire"
        :preview-mode="previewMode"
        @onClick="clickAnswer"
      />
      <post-profile
        :icon="post.user.icon"
        :name="post.user.name"
        :user-uuid="post.user.uuid"
        :organization="post.user.organization"
        :is-liked="post.is_liked"
        :like-count="post.like_count"
        :comment-count="totalCount"
        :is-favorite="post.is_favorite"
        :is-visitor="isVisitor"
        @onChange="changeLike"
        @onChangeFavorite="changeFavorite"
      />

      <related-posts
        :related-posts="relatedPosts"
        @onCreateRelatedPost="$emit('onCreateRelatedPost')"
      />
    </div>
    <comment
      v-if="!previewMode"
      :total-count="totalCount"
      :comments="comments"
      :is-visitor="isVisitor"
      @onClickComment="clickComment"
      @onClickReply="clickCommentReply"
      @onClickReplyToReply="clickCommentReplyToReply"
      @onChangeCommentLike="changeCommentLike"
      @onChangeCommentReplyLike="changeCommentReplyLike"
    />
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from '@/libs/dayjs';
import ImageSelectBox from '../../molecules/images/ImageSelectBox.vue';
import PostDetailHead from './PostDetailHead.vue';
import PostDetailTitle from './PostDetailTitle.vue';
import PostProfile from './PostProfile.vue';
import PostDetailContents from './PostDetailContents.vue';
import RelatedPosts from './RelatedPosts.vue';
import Comment from '../comment/Comment.vue';

type Media = {
  src: string;
  type: string;
};

export default Vue.extend({
  components: {
    ImageSelectBox,
    PostDetailHead,
    PostDetailTitle,
    PostProfile,
    PostDetailContents,
    RelatedPosts,
    Comment,
  },
  props: {
    post: {
      type: Object as PropType<AppApiResponse.Post>,
      required: true,
    },
    comments: {
      type: Array as PropType<AppApiResponse.Comment[]>,
      required: true,
    },
    totalCount: {
      type: Number,
      required: true,
    },
    src: {
      type: String,
      required: false,
      default: null,
    },
    selectImageSrc: {
      type: String,
      required: false,
      default: null,
    },
    previewMode: {
      type: Boolean,
      required: false,
      default: false,
    },
    relatedPosts: {
      type: Array as PropType<AppApiResponse.Post[]>,
      default: null,
    },
    isVisitor: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      postMedia: [] as Media[],
    };
  },
  computed: {
    getMediaOfPost(): Media[] {
      if (this.post.videos.length > 0) {
        this.post.videos.map((value: string) => {
          return this.postMedia.push({ src: value, type: 'video' });
        });
      }
      if (this.post.images.length > 0) {
        this.post.images.map((value: string) => {
          return this.postMedia.push({ src: value, type: 'image' });
        });
      }
      return this.postMedia;
    },
    publishSettingFormattedDate(): string {
      if (this.post.publish_setting) {
        if (!this.post.publish_setting.start_at) {
          return '';
        }
        return dayjs
          .unix(this.post.publish_setting.start_at)
          .format('YYYY/M/D（ddd）');
      }
      return '';
    },
    publishSettingFormattedTime(): string {
      if (this.post.publish_setting) {
        if (!this.post.publish_setting.start_at) {
          return '';
        }
        const startAt = dayjs
          .unix(this.post.publish_setting.start_at)
          .format('HH:mm');
        const endAt = dayjs
          .unix(this.post.publish_setting.end_at)
          .format('HH:mm');

        return `${startAt}〜${endAt}`;
      }
      return '';
    },
    isEvent(): boolean {
      return !!this.post.event;
    },
    isQuestionnaire(): boolean {
      return !!this.post.questionnaire;
    },
    isPublishSetting(): boolean {
      if (this.post.publish_setting) {
        if (
          this.post.publish_setting.start_at ||
          this.post.publish_setting.end_at
        ) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    changeImage(src: string) {
      this.$emit('onChangeImage', src);
    },
    changeLike(boolean: boolean) {
      this.$emit('onChangeLike', boolean);
    },
    changeFavorite(boolean: boolean) {
      this.$emit('onChangeFavorite', boolean);
    },
    clickAnswer(uuid: string) {
      this.$emit('onClickAnswer', uuid);
    },
    clickComment(comment: string) {
      this.$emit('onClickComment', comment);
    },
    clickCommentReply(reply: AppTypes.Reply) {
      this.$emit('onClickReply', reply);
    },
    clickCommentReplyToReply(reply: AppTypes.Reply) {
      this.$emit('onClickReplyToReply', reply);
    },
    changeCommentLike(comment: AppTypes.LikeComment) {
      this.$emit('onChangeCommentLike', comment);
    },
    changeCommentReplyLike(comment: AppTypes.LikeComment) {
      this.$emit('onChangeCommentReplyLike', comment);
    },
  },
});
</script>

<style lang="scss" scoped>
.header {
  margin: 0 0 16px 0;
  border-radius: 4px;
}

.post-detail-container {
  padding: 40px 40px;
  border-radius: 4px;
  box-shadow: 0 1px 2px $box-shadow;
}

.title {
  margin: 0 0 24px 0;
}

.image {
  margin: 0 0 40px 0;
}

.post-contents {
  margin: 0 0 40px 0;
}

.date-text {
  line-height: 1em;
  font-size: 15px;
  font-weight: 300;
  color: $link_color;
  margin: 0 0 25px 0;
}
</style>
