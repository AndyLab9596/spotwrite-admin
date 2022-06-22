<template>
  <div>
    <div class="comment-wrapper" :class="{ link: !isVisitor }">
      <div class="comment__top">
        <img :src="userIcon" class="icon" @click="goToUserProfile" />
        <div>
          <p class="name" @click="goToUserProfile">{{ userName }}</p>
          <p class="organization">{{ organization }}</p>
        </div>
      </div>

      <p class="comment__main" :class="{ 'comment__main--arigato': isArigato }">
        {{ content }}
      </p>

      <send-comment-modal
        v-if="sendCommentModal"
        @onClick="clickReply"
        @onClose="sendCommentModal = false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SendCommentModal from '../../atoms/modals/SendCommentModal.vue';

export default Vue.extend({
  components: {
    SendCommentModal,
  },
  props: {
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
    uuid: {
      type: String,
      required: true,
    },
    isVisitor: {
      type: Boolean,
      required: false,
      default: false,
    },
    organization: {
      type: String,
      required: true,
    },
    postType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      sendCommentModal: false as boolean,
      lineHeight: '',
      lineHeightFull: '',
    };
  },
  computed: {
    isArigato(): Boolean {
      return this.postType === 'thankyou';
    },
  },
  methods: {
    goToUserProfile(): void {
      if (!this.isVisitor) {
        this.$router.push(`/users/${this.userUuid}`);
      }
    },
    clickReply(comment: string) {
      const reply = {
        commentUuid: this.uuid,
        content: comment,
      } as AppTypes.Reply;
      this.$emit('onClickReply', reply);
      this.sendCommentModal = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.comment-wrapper {
  padding: 16px;
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
  color: $main_color;
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;

  .link & {
    cursor: pointer;
  }
}

.organization {
  color: $gray_blue_4;
  font-size: 11px;
  line-height: 1em;
  margin: 6px 0 0;
}

.comment__top {
  display: flex;
  margin: 0 0 16px;
}

.comment__main {
  color: $chart_text;
  font-size: 15px;
  font-weight: 300;
  line-height: 2.1em;
  position: relative;

  &--arigato {
    color: $mustard;
    border-top: 1px dotted $mustard;
  }
}
</style>
