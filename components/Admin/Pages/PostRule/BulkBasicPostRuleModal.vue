<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        <div class="description">
          実行すると、個別に適用した全ての設定が上書きされます。<br />本当に戻しますか？
        </div>
        <div class="button-box">
          <base-button class="button" size="large" @click="onSubmit"
            >はい</base-button
          >
          <base-button class="button" inverse size="large" @click="onClose"
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
  components: {
    BaseButton,
  },
  methods: {
    onClose() {
      this.$emit('onClose');
    },
    onSubmit() {
      this.$emit('onSubmit');
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
}

.modal-window {
  display: flex;
  flex-direction: column;
  width: 500px;
  background: $true_white;
  border-radius: 6px;
  padding: 56px 30px 20px;
  box-shadow: 0 0 3px 0 $light_gray;
  position: relative;
}

.icon-cross {
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
}

.description {
  font-size: 15px;
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

.button-box {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}

.button {
  width: 215px;
}
</style>
