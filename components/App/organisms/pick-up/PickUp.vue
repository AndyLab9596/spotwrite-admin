<template>
  <div>
    <post-detail-title
      :date="post.date"
      :type="post.type"
      :title="post.title"
      class="title"
    />
    <div class="pick-up-card" :class="{ 'preview-mode': previewMode }">
      <image-select-box
        :src="selectImageSrc"
        :images="getMediaOfPost"
        :select-image-src="selectImageSrc"
        :select-button-color="`#89d3ca`"
        :frame-name="postTypes.PICKUP"
        class="image"
        @onChange="changeImage"
      />
      <pick-up-contents
        v-if="post.awardee != null"
        :letter-body="post.content"
        :user-uuid="post.awardee.uuid"
        :user-icon="post.awardee.user_icon"
        :user-name="post.awardee.name"
        :user-organization="post.awardee.organization"
        :user-joined-year="post.awardee.joined_year"
        :user-joined-month="post.awardee.joined_month"
        :awardee-user-comment="post.awardee_user_comment"
        :title="'PICK UP'"
        :is-visitor="isVisitor"
        :preview-mode="previewMode"
        class="pick-up-contents"
      />
      <pick-up-profile
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
        @onCreateRelatedPost="$emit('onCreateRelatedPost')"
      />
    </div>
    <pickup-comment
      v-if="!previewMode"
      :total-count="totalCount"
      :comments="comments"
      :awardee="post.awardee.name"
      :is-visitor="isVisitor"
      :post-type="postType"
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
import PickupComment from '../comment/PAComment.vue';
import PickUpProfile from '../../molecules/pick-up/PickUpProfile.vue';
import RelatedPosts from '../post/RelatedPosts.vue';
import PickUpContents from './PickUpContents.vue';

type Media = {
  src: string;
  type: string;
};

export default Vue.extend({
  components: {
    ImageSelectBox,
    PostDetailTitle,
    PickupComment,
    PickUpProfile,
    PickUpContents,
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

.pick-up-contents {
  margin: 0 0 40px;
}

.pick-up-card {
  padding: 40px;
  background: $gradient_8;

  &:not(.preview-mode) {
    margin: 0 0 123px 0;
  }
}
</style>
