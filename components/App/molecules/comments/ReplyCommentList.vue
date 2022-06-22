<template>
  <div>
    <template v-for="comment in replies">
      <reply-comment-list-item
        :key="comment.uuid"
        :date="comment.date"
        :user-icon="comment.user_icon"
        :user-name="comment.user_name"
        :user-uuid="comment.user_uuid"
        :content="comment.content"
        :is-liked="comment.is_liked"
        :uuid="comment.uuid"
        :comment-uuid="comment.comment_uuid"
        :is-visitor="isVisitor"
        class="item"
        @onClickReplyToReply="clickCommentReplyToReply"
        @onChangeCommentReplyLike="changeCommentReplyLike"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ReplyCommentListItem from './ReplyCommentIListtem.vue';

export default Vue.extend({
  components: {
    ReplyCommentListItem,
  },
  props: {
    replies: {
      type: Array as PropType<ApiResponse.CommentReply[]>,
      required: true,
    },
    isVisitor: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    changeCommentReplyLike(comment: Types.LikeComment) {
      this.$emit('onChangeCommentReplyLike', comment);
    },
    clickCommentReplyToReply(reply: Types.Reply) {
      this.$emit('onClickReplyToReply', reply);
    },
  },
});
</script>

<style lang="scss" scoped>
.item {
  border-top: 1px solid $comment_line;
}
</style>
