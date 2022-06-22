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
          <base-button size="large" class="cancel-button" @click="onClose">
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
      default: '閉じる',
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
  border-radius: 6px;
  padding: 20px;
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
  padding: 0 10px;
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
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  background-color: #7e8195;
  color: $true_white;
  width: 200px;
  height: 40px;
  font-weight: normal;
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
