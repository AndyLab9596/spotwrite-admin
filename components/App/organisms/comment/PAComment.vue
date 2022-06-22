<template>
  <div class="comment-wrapper">
    <div
      class="comment-bg"
      :style="{ 'background-image': 'url(' + bgImage + ')' }"
    ></div>
    <div class="comment-inner">
      <pickup-comment-header
        :class="{ 'comment-header': !hasComments }"
        :awardee="awardee"
        :post-type="postType"
        :total-count="totalCount"
        @onClickComment="clickComment"
      />
      <pickup-comment-list :comments="comments" :post-type="postType" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import PickupCommentHeader from './PACommentHeader.vue';
import PickupCommentList from '../../molecules/comments/PACommentList.vue';

export default Vue.extend({
  components: {
    PickupCommentHeader,
    PickupCommentList,
  },
  props: {
    comments: {
      type: Array as PropType<AppApiResponse.Comment[]>,
      required: true,
    },
    totalCount: {
      type: Number,
      required: true,
    },
    isVisitor: {
      type: Boolean,
      required: false,
      default: false,
    },
    awardee: {
      type: String,
      required: true,
    },
    postType: {
      type: String,
      required: true,
    },
  },
  computed: {
    hasComments() {
      return this.comments.length > 0;
    },
    bgImage() {
      return this.postType === 'pickup'
        ? '/app/image/comment_bg.svg'
        : '/app/image/comment_bg-thanks.svg';
    },
  },
  methods: {
    clickComment(comment: string) {
      this.$emit('onClickComment', comment);
    },
  },
});
</script>

<style lang="scss" scoped>
.comment-header {
  margin: 0 0 40px 0;
}

.comment-wrapper {
  position: relative;
}

.comment-bg {
  position: relative;
  left: -48px;
  width: 880px;
  height: 946px;
}

.comment-inner {
  position: absolute;
  width: 100%;
  top: -83px;
}
</style>
