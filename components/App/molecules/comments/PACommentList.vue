<template>
  <div class="comment-list">
    <div v-if="isHidingComments">
      <template v-for="(comment, index) in firstFiveComments">
        <pa-comment-list-item
          :key="comment.uuid"
          :date="comment.date"
          :user-icon="comment.user_icon"
          :user-name="comment.user_name"
          :user-uuid="comment.user_uuid"
          :content="comment.content"
          :uuid="comment.uuid"
          :is-visitor="isVisitor"
          :organization="comment.organization_name"
          :post-type="postType"
          class="item"
          :class="{
            'item--odd': isOdd(index),
            'item--even': !isOdd(index),
            'item--arigato': isArigato(postType),
          }"
          @onClickReply="clickReply"
        />
      </template>
    </div>
    <div v-else>
      <template v-for="(comment, index) in comments">
        <pa-comment-list-item
          :key="comment.uuid"
          :date="comment.date"
          :user-icon="comment.user_icon"
          :user-name="comment.user_name"
          :user-uuid="comment.user_uuid"
          :content="comment.content"
          :uuid="comment.uuid"
          :is-visitor="isVisitor"
          :organization="comment.organization_name"
          :post-type="postType"
          class="item"
          :class="{
            'item--odd': isOdd(index),
            'item--even': !isOdd(index),
            'item--arigato': isArigato(postType),
          }"
          @onClickReply="clickReply"
        />
      </template>
    </div>

    <button
      v-if="comments.length > 5"
      class="more-button"
      @click="showMoreComments"
    >
      もっとみる
    </button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import PaCommentListItem from './PACommentListItem.vue';

export default Vue.extend({
  components: {
    PaCommentListItem,
  },
  props: {
    comments: {
      type: Array as PropType<AppApiResponse.Comment[]>,
      required: true,
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
  data() {
    return {
      isHidingComments: true as Boolean,
    };
  },
  computed: {
    firstFiveComments(): AppApiResponse.Comment[] {
      return this.comments.filter(
        (_: AppApiResponse.Comment, index: number) => index < 5
      );
    },
  },
  methods: {
    isOdd(index: number) {
      return index % 2 === 0;
    },
    isArigato(type: string) {
      return type === 'thankyou';
    },
    showMoreComments(): void {
      this.isHidingComments = false;
    },
    clickReply(reply: AppTypes.Reply) {
      this.$emit('onClickReply', reply);
    },
  },
});
</script>

<style lang="scss" scoped>
.comment-list {
  padding: 0 0 120px 0;
}

.comment-list div {
  display: flex;
  flex-direction: column;
}

.item {
  width: 752px;
  background: $gradient_6;
  margin: 16px 0;
  border-radius: 8px;
}

.item--arigato {
  background: $desert_color;
}

.item--odd {
  align-self: flex-start;
}

.item--even {
  align-self: flex-end;
}

.more-button {
  width: 100%;
  font-family: 'Hiragino Kaku Gothic Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
  font-weight: bold;
  color: $gray_blue_4;
  background-color: $button_background_color;
  height: 44px;
  margin: 24px 0 0 0;
  border: none;
  border-radius: 4px;
}
</style>
