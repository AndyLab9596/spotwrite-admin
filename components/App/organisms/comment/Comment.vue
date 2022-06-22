<template>
  <div class="comment-wrapper">
    <comment-header
      :class="{ 'comment-header': !hasComments }"
      :total-count="totalCount"
      @onClickComment="clickComment"
    />
    <comment-list
      :comments="comments"
      :is-visitor="isVisitor"
      @onClickReply="clickCommentReply"
      @onClickReplyToReply="clickCommentReplyToReply"
      @onChangeCommentLike="changeCommentLike"
      @onChangeCommentReplyLike="changeCommentReplyLike"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import CommentHeader from './CommentHeader.vue';
import CommentList from '../../molecules/comments/CommentList.vue';

export default Vue.extend({
  components: {
    CommentHeader,
    CommentList,
  },
  props: {
    comments: {
      type: Array as PropType<ApiResponse.Comment[]>,
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
  },
  computed: {
    hasComments() {
      return this.comments.length > 0;
    },
  },
  methods: {
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
.comment-header {
  margin: 0 0 40px 0;
}

.comment-wrapper {
  padding: 40px;
  background-color: $background_color;
}
</style>
