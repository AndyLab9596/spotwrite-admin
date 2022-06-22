<template>
  <div>
    <template v-for="comment in visibleComments">
      <comment-list-item
        :key="comment.uuid"
        :date="comment.date"
        :user-icon="comment.user_icon"
        :user-name="comment.user_name"
        :user-uuid="comment.user_uuid"
        :content="comment.content"
        :is-liked="comment.is_liked"
        :replies="comment.replies"
        :uuid="comment.uuid"
        :is-visitor="isVisitor"
        class="item"
        @onClickReply="clickReply"
        @onChangeCommentLike="changeCommentLike"
        @onClickReplyToReply="clickCommentReplyToReply"
        @onChangeCommentReplyLike="changeCommentReplyLike"
      />
    </template>
    <div v-if="!showAll && comments.length >= 5" class="viewmore-btn">
      <base-button inverse="true" size="large" @click="showAll = true">
        もっと見る
      </base-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import CommentListItem from './CommentIListtem.vue';
import BaseButton from '../../atoms/buttons/BaseButton.vue';

export default Vue.extend({
  components: {
    CommentListItem,
    BaseButton,
  },
  props: {
    comments: {
      type: Array as PropType<ApiResponse.Comment[]>,
      required: true,
    },
    isVisitor: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      showAll: false as boolean,
    };
  },
  computed: {
    visibleComments(): ApiResponse.Comment[] {
      if (this.showAll) {
        return this.comments;
      }
      return this.comments.slice(0, 5);
    },
  },
  methods: {
    changeCommentLike(comment: Types.LikeComment) {
      this.$emit('onChangeCommentLike', comment);
    },
    clickReply(reply: Types.Reply) {
      this.$emit('onClickReply', reply);
    },
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

  &:first-of-type {
    border-top: none;
  }
}

.viewmore-btn {
  text-align: center;

  .button {
    width: 300px;
  }
}
</style>
