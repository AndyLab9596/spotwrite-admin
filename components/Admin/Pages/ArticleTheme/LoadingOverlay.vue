<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay">
      <vue-loading
        type="spin"
        color="#eee"
        :size="{ width: '50px', height: '50px' }"
      ></vue-loading>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import { VueLoading } from 'vue-loading-template';

export default Vue.extend({
  components: { VueLoading },
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
  width: 464px;
  height: 328px;
  background: $true_white;
  border-radius: 6px;
  padding: 18px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.modal-content {
  height: 250px;
  margin-top: 5px;
  margin-bottom: 16px;
  padding: 10px;
  border: solid 1px #707070;
  overflow-y: auto;
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
