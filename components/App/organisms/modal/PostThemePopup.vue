<template>
  <transition name="modal" appear>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-window">
        <div class="content-body">
          <img src="/app/image/popper.svg" />
          <p>CONGRATULATIONS</p>
        </div>
        <div class="modal-message">
          記事テーマが更新されました！
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
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
  cursor: pointer;
}

.modal-overlay::after {
  content: '';
  background: url('/app/image/white-spotlight.svg') no-repeat;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 204px;
  height: 100%;
}

.content-body {
  width: 204px;
  height: 204px;
  background-color: $true_white;
  border-radius: 4px;
  text-align: center;
  margin: 0 auto;
  padding: 40px 0 0 0;

  p {
    color: $link_color;
    margin: 8px 0 0 0;
    font-weight: bold;
  }
}

.modal-message {
  margin: 25px 0 0 0;
  color: $true_white;
  font-size: 15px;
  font-weight: bold;
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
