<template>
  <div>
    <post-detail-title
      :date="post.date"
      :type="post.type"
      :title="post.title"
      class="title"
    />
    <div class="thank-you-card" :class="{ 'preview-mode': previewMode }">
      <image-select-box
        v-if="hasImages"
        :src="selectImageSrc"
        :images="getMediaOfPost"
        :select-image-src="selectImageSrc"
        :select-button-color="`#89d3ca`"
        :frame-name="postTypes.THANKYOU"
        class="image"
        @onChange="changeImage"
      />
      <thank-you-contents
        v-if="post.awardee != null"
        :letter-body="post.content"
        :user-uuid="post.awardee.uuid"
        :user-icon="post.awardee.user_icon"
        :user-name="post.awardee.name"
        :user-organization="post.awardee.organization"
        :user-joined-year="post.awardee.joined_year"
        :user-joined-month="post.awardee.joined_month"
        :awardee-user-comment="post.awardee_user_comment"
        :title="'ありがとう'"
        :is-visitor="isVisitor"
        :preview-mode="previewMode"
        class="thank-you-contents"
      />
      <thank-you-profile
        :icon="post.user.icon"
        :name="post.user.name"
        :user-uuid="post.user.uuid"
        :organization="post.user.organization"
        :is-visitor="isVisitor"
        :preview-mode="previewMode"
      />
      <related-posts
        v-if="!previewMode"
        :related-posts="relatedPosts"
        :preview-mode="previewMode"
      />
    </div>
    <arigato-comment
      v-if="!previewMode"
      :awardee="post.awardee.name"
      :post-type="postType"
      :total-count="totalCount"
      :comments="comments"
      :is-visitor="isVisitor"
      @onClickComment="clickComment"
      @onClickReply="clickCommentReply"
      @onClickReplyToReply="clickCommentReplyToReply"
    />
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';
import { enumPostTypes } from '@/libs/definition';
import ImageSelectBox from '../../molecules/images/ImageSelectBox.vue';
import PostDetailTitle from '../post/PostDetailTitle.vue';
import ArigatoComment from '../comment/PAComment.vue';
import RelatedPosts from '../post/RelatedPosts.vue';
import ThankYouProfile from '../../molecules/thank-you/ThankYouProfile.vue';
import ThankYouContents from './ThankYouContents.vue';

type Media = {
  src: string;
  type: string;
};

export default Vue.extend({
  components: {
    ImageSelectBox,
    PostDetailTitle,
    ArigatoComment,
    ThankYouProfile,
    ThankYouContents,
    RelatedPosts,
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
      required: false,
      default: false,
    },
    postType: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    postTypes: enumPostTypes,
    postMedia: [] as Media[],
  }),
  computed: {
    hasImages() {
      return this.post.images.length > 0 || this.post.videos.length > 0;
    },
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
.title {
  margin: 0 0 24px 0;
}

.image {
  margin: 0 0 40px 0;
}

.thank-you-contents {
  margin: 0 0 40px;
}

.thank-you-card {
  padding: 40px;
  background: $thank_you_card_background_color;

  &:not(.preview-mode) {
    margin: 0 0 123px 0;
  }
}
</style>
