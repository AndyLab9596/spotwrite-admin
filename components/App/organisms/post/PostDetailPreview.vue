<template>
  <div>
    <div class="post-detail-container">
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
        :src-type="selectImageSrcType"
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
        :comment-count="post.comment_count"
        :is-favorite="post.is_favorite"
        :preview-mode="previewMode"
        @onChange="changeLike"
        @onChangeFavorite="changeFavorite"
      />
    </div>
    <comment
      v-if="!previewMode"
      :total-count="totalCount"
      :comments="comments"
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
import ImageSelectBox from '../../molecules/images/ImageSelectBox.vue';
import PostDetailTitle from './PostDetailTitle.vue';
import PostProfile from './PostProfile.vue';
import PostDetailContents from './PostDetailContents.vue';
import Comment from '../comment/Comment.vue';

type Media = {
  src: string;
  type: string;
};

export default Vue.extend({
  components: {
    ImageSelectBox,
    PostDetailTitle,
    PostProfile,
    PostDetailContents,
    Comment,
  },
  props: {
    post: {
      type: Object as PropType<AppApiResponse.Post>,
      required: true,
    },
    comments: {
      type: Array as PropType<ApiResponse.Comment[]>,
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
    selectImageSrcType: {
      type: String,
      required: false,
      default: null,
    },
    previewMode: {
      type: Boolean,
      required: false,
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
    clickCommentReply(reply: Types.Reply) {
      this.$emit('onClickReply', reply);
    },
    clickCommentReplyToReply(reply: Types.Reply) {
      this.$emit('onClickReplyToReply', reply);
    },
    changeCommentLike(comment: Types.LikeComment) {
      this.$emit('onChangeCommentLike', comment);
    },
    changeCommentReplyLike(comment: Types.LikeComment) {
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
</style>
