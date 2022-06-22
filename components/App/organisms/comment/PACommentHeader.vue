<template>
  <div>
    <div class="comment-header">
      <img src="/app/icon/icon-chat-pink.svg" />
      <p class="awardee">{{ awardee }}さんへ</p>
      <p class="comment">
        {{ postTypeName }}コメント
        <span class="count">{{ totalCount }}</span>
        件
      </p>
    </div>
    <div class="input-container">
      <div class="input" @click="sendCommentModal = true">
        <p class="placeholder">コメントをしてみよう！</p>
      </div>
    </div>
    <send-comment-modal
      v-if="sendCommentModal"
      @onClick="clickComment"
      @onClose="sendCommentModal = false"
    />
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
    totalCount: {
      type: Number,
      required: true,
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
  data() {
    return {
      sendCommentModal: false as boolean,
    };
  },
  computed: {
    postTypeName(): string {
      return this.postType === 'pickup' ? 'MVP' : 'ありがとう';
    },
  },
  methods: {
    clickComment(comment: string) {
      this.$emit('onClickComment', comment);
      this.sendCommentModal = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.comment-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.awardee {
  margin: 16px 0 0;
  border-bottom: 1px solid $link_color;
}

.comment {
  color: $comment_color;
  font-family: 'Lato', sans-serif;
  font-weight: bold;
  font-size: 15px;
  margin: 0 0 36px 0;
}

.count {
  color: $link_color;
  font-family: 'Lato', sans-serif;
  font-weight: bold;
  font-size: 24px;
  padding: 0 7px 0 5px;
}

.input-container {
  width: 800px;
  padding: 24px 40px;
  background-color: $comment_bg;
  box-shadow: 0 1px 2px $comment_box;
  border-radius: 4px;
  margin: 0 0 8px;
}

.input {
  display: flex;
  align-items: center;
  height: 52px;
  background-color: $true_white;
  border-radius: 4px;
  box-shadow: 0 1px 2px $box-shadow;
  cursor: pointer;
}

.placeholder {
  color: $sub_color;
  font-size: 15px;
  line-height: 1em;
  font-weight: 300;
  font-family: 'Hiragino Sans CNS', sans-serif;
  margin-left: 16px;
}
</style>
