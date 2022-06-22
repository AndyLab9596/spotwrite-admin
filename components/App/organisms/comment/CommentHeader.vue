<template>
  <div>
    <p class="comment">
      コメント
      <span class="count">{{ totalCount }}</span>
      件
    </p>
    <div class="input" @click="sendCommentModal = true">
      <p class="placeholder">コメントをしてみよう！</p>
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
  },
  data() {
    return {
      sendCommentModal: false as boolean,
    };
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
.comment {
  color: $comment_color;
  font-family: 'Lato', sans-serif;
  font-weight: bold;
  font-size: 15px;
  margin: 0 0 25px 0;
  line-height: 1em;
}

.count {
  color: $link_color;
  font-family: 'Lato', sans-serif;
  font-weight: bold;
  font-size: 24px;
  padding: 0 7px 0 5px;
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
