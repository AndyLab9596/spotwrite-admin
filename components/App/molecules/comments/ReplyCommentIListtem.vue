<template>
  <div>
    <div class="comment-wrapper" :class="{ link: !isVisitor }">
      <img :src="userIcon" class="icon" @click="goToUserProfile" />
      <div class="comment-contents">
        <p class="name" @click="goToUserProfile">{{ userName }}</p>
        <p class="comment">{{ content }}</p>
        <div class="action-wrapper">
          <p class="time">
            {{ fromTime + ' ' }}
            <span class="reply" @click="sendCommentModal = true">返信する</span>
          </p>
          <like-button :is-liked="isLiked" @onChange="changeCommentReplyLike" />
        </div>
      </div>
      <send-comment-modal
        v-if="sendCommentModal"
        @onClick="clickCommentReplyToReply"
        @onClose="sendCommentModal = false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LikeButton from '../../atoms/buttons/LikeButton.vue';
import SendCommentModal from '../../atoms/modals/SendCommentModal.vue';

dayjs.extend(relativeTime);

export default Vue.extend({
  components: {
    LikeButton,
    SendCommentModal,
  },
  props: {
    date: {
      type: Number,
      required: true,
    },
    userIcon: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userUuid: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isLiked: {
      type: Boolean,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
    commentUuid: {
      type: String,
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
      sendCommentModal: false as boolean,
    };
  },
  computed: {
    fromTime(): string {
      return dayjs.unix(this.date).fromNow();
    },
  },
  methods: {
    clickCommentReplyToReply(comment: string) {
      const reply = {
        commentUuid: this.commentUuid,
        content: comment,
      } as Types.Reply;
      this.$emit('onClickReplyToReply', reply);
      this.sendCommentModal = false;
    },
    changeCommentReplyLike(boolean: boolean) {
      const comment = {
        uuid: this.uuid,
        is_liked: boolean,
      } as Types.LikeComment;
      this.$emit('onChangeCommentReplyLike', comment);
    },
    goToUserProfile(): void {
      if (!this.isVisitor) {
        this.$router.push(`/users/${this.userUuid}`);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.comment-wrapper {
  padding: 26px 0;
  display: flex;
  justify-content: flex-start;
}

.comment-contents {
  width: calc(100% - 56px);
  overflow-wrap: break-word;
}

.icon {
  width: 40px;
  height: 40px;
  object-position: center;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 1px 2px $box-shadow;
  margin: 0 16px 0 0;

  .link & {
    cursor: pointer;
  }
}

.name {
  color: $comment_color;
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;
  margin: 0 0 16px 0;

  .link & {
    cursor: pointer;
  }
}

.comment {
  color: $comment_color;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.6em;
  margin: 0 0 9px 0;
  white-space: pre-wrap;
}

.action-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.time {
  color: $comment_color;
  font-size: 15px;
  font-weight: 300;
  line-height: 1em;
}

.reply {
  color: $reply_color;
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;
  cursor: pointer;
}
</style>
