<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <img src="/icon/icon_cross.svg" class="icon-cross" @click="onClose" />
        </div>
        <div class="modal-content">
          <slot />
        </div>
        <div class="modal-footer">
          <base-button size="large" class="submit-button" @click="onClick">
            {{ submitButtonText }}
          </base-button>
          <base-button size="large" class="cancel-button" @click="onClose"
            >キャンセル</base-button
          >
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: { BaseButton },
  props: {
    deleteButtonText: {
      type: String,
      default: '削除',
    },
    index: {
      type: [Number, Array, String],
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      submitButtonText: this.deleteButtonText,
    };
  },
  methods: {
    onClick() {
      this.$emit('click', this.index);
    },
    onClose() {
      this.$emit('close');
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
  z-index: 999;
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
  background: $true_white;
  border-radius: 6px;
  padding: 16px 10px 20px;
  font-size: 15px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.icon-cross {
  cursor: pointer;
}

.modal-content {
  display: flex;
  flex-direction: row;
  padding: 0 20px;
}

.select {
  flex: 1;
  width: 230px;
  height: 40px;
}

.modal-footer {
  display: flex;
  flex-direction: row;
  padding: 32px 20px 10px;
}

.button {
  width: 215px;
  height: 40px;
  font-size: 13px;
  font-weight: bold;
  border-radius: 4px;
}

.submit-button {
  margin-right: 10px;
  color: $true_white;
  background: $gray_blue_3;
  border: none;

  &:hover {
    background-color: $gray_blue_4;
  }
}

.cancel-button {
  color: $gray_blue_4;
  background-color: $true_white;
  border: solid 1px $light_gray_blue_3;

  &:hover {
    background-color: $light_gray_blue_3;
  }
}
</style>
