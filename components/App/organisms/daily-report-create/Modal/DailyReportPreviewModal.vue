<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="icon-cross-wrapper" role="button" @click="onClose">
          <img src="/app/icon/cross-white.svg" class="icon-cross" alt="close" />
        </div>

        <div class="modal-content"><slot /></div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
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
  background: rgba(0, 0, 0, 0.5);
  padding: 30px 0 80px 0;
}

.modal-window {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 800px;
  background: $true_white;
  border-radius: 4px;
  position: relative;
}

.icon-cross-wrapper {
  position: absolute;
  top: 0;
  right: calc(-25px + -25px);
}

.icon-cross {
  cursor: pointer;
  width: 25px;
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

.modal-content {
  max-height: 93vh;
  overflow-y: scroll;
}
</style>
