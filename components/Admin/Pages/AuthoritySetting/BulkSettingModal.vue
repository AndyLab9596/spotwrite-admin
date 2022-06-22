<template>
  <transition name="modal" appear>
    <div class="modal-window">
      <img
        src="/icon/icon_cross.png"
        class="icon-cross"
        @click="$emit('close')"
      />
      <div class="modal-content">
        チェックを入れたメンバーをまとめて
        <base-button @click="$emit('show-option-authority-modal')"
          >設定</base-button
        >
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: { BaseButton },
});
</script>

<style lang="scss" scoped>
.modal-window {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  width: 325px;
  background: $true_white;
  border-radius: 4px;
  padding: 40px 20px;
  border: none;
  box-shadow: 0 0 3px #b8c7d8;
}

.icon-cross {
  height: 18px;
  width: 18px;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
}

// オーバーレイのトランジション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.1s;

  // オーバーレイに包含されているモーダルウィンドウのトランジション
  .modal-window {
    transition: opacity 0.1s, transform 0.1s;
  }
}

// ディレイを付けるとモーダルウィンドウが消えた後にオーバーレイが消える
.modal-leave-active {
  transition: opacity 0.1s ease 0.1s;
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
