<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <div class="icon-cross__wrapper" @click="onClose">
            <icon name="cross" class="icon-cross" />
          </div>
        </div>
        <div class="modal-content">
          <p class="title">コメントを入力する</p>
          <textarea
            v-model="comment"
            class="textarea"
            placeholder="コメントを入力しよう！"
          ></textarea>
          <div class="counter">
            <span :class="{ 'error-text': hasTextCountError }">
              {{ comment.length }}
            </span>
            <span class="divider">/</span>
            <span>{{ maxLength }}文字</span>
          </div>
        </div>
        <div class="modal-footer">
          <base-button
            class="submit-button"
            :disabled="hasTextCountError"
            @click="onClick"
          >
            {{ submitButtonText }}
          </base-button>
          <base-button class="cancel-button" @click="onClose">
            キャンセル
          </base-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '../images/Icon.vue';
import BaseButton from '../buttons/BaseButton.vue';

export default Vue.extend({
  components: {
    Icon,
    BaseButton,
  },
  props: {
    submitButtonText: {
      type: String,
      required: false,
      default: '送信',
    },
  },
  data() {
    return {
      comment: '' as string,
      maxLength: 255 as number,
    };
  },
  computed: {
    hasTextCountError(): boolean {
      return this.comment.length > this.maxLength;
    },
  },
  methods: {
    onClick() {
      this.$emit('onClick', this.comment);
      this.comment = '';
    },
    onClose() {
      this.$emit('onClose');
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(126, 129, 149, 0.8);
}

.modal-window {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 500px;
  min-height: 200px;
  background: #fff;
  border-radius: 6px;
  padding: 20px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.icon-cross__wrapper {
  display: inline-block;

  .icon-cross {
    cursor: pointer;
  }
}

.modal-content {
  padding: 0 20px;

  span {
    font-size: 12px;
    line-height: 1em;
  }
}

.modal-footer {
  display: flex;
  flex-direction: row;
  padding: 0 20px 10px;
}

.submit-button {
  flex: 1;
  margin-right: 10px;
}

.cancel-button {
  flex: 1;
  background-color: $button_background_color;
  color: $gentle_bluish_purple;
}

.title {
  font-size: 15px;
  font-weight: bold;
  color: $main-color;
  line-height: 1em;
  margin: 0 0 30px 0;
}

.textarea {
  resize: vertical;
  min-height: 170px;
  background-color: $true_white;
  border-radius: 4px;
  box-shadow: 0 1px 2px $box-shadow;
  padding: 5px 16px 5px;
  color: $main-color;
  width: 100%;
  border: 1px solid $input_ruled_line_color;
  margin: 0 0 5px 0;
}

::placeholder {
  color: $sub_color;
}

.error-text {
  color: $link_color;
}

.counter {
  display: flex;
  justify-content: flex-end;
  margin: 0 0 30px 0;
}
</style>
