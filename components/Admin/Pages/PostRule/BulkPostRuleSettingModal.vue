<template>
  <transition name="modal" appear>
    <div class="modal-window">
      <img
        src="/icon/icon_cross.png"
        class="icon-cross"
        @click="$emit('onClose')"
      />
      <div class="modal-content">
        チェックを入れた組織（BOX）をまとめて
        <base-button @click="$emit('onOpen')">設定</base-button>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: {
    BaseButton,
  },
});
</script>

<style lang="scss" scoped>
.modal-window {
  display: flex;
  flex-direction: column;
  height: auto;
  background: $true_white;
  border-radius: 4px;
  padding: 30px 20px;
  border: none;
  box-shadow: 0 0 3px #b8c7d8;
  position: absolute;
  top: 210px;
  left: 280px;
}

.icon-cross {
  height: 12px;
  width: 12px;
  cursor: pointer;
  position: absolute;
  right: 8px;
  top: 8px;
}

// モーダルウィンドウのトランジション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
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
