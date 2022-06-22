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
          <base-button
            size="large"
            class="cancel-button"
            :class="{ gray: grayButton }"
            @click="onClose"
          >
            {{ buttonText }}
          </base-button>
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
    buttonText: {
      type: String,
      required: false,
      default: 'キャンセル',
    },
    grayButton: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
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
  height: 200px;
  background: $true_white;
  border-radius: 4px;
  padding: 10px;
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
  justify-content: center;
  flex-direction: row;
  padding: 10px 10px 30px;
  font-size: 15px;
}

.select {
  flex: 1;
  width: 230px;
  height: 40px;
}

.modal-footer {
  display: flex;
  flex-direction: row;
  padding: 0 10px 10px;
  justify-content: center;
}

.cancel-button {
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: $gray_blue_3;
  font-weight: bold;
  color: $true_white;
  width: 200px;
  height: 40px;

  &:hover {
    background-color: $gray_blue_4;
  }

  &.gray.button {
    background-color: $gray_blue_3;
    color: $true_white;
  }
}

// オーバーレイのトランジション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  // オーバーレイに包含されているモーダルウィンドウのトランジション
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

// ディレイを付けるとモーダルウィンドウが消えた後にオーバーレイが消える
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.modal-enter {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>
