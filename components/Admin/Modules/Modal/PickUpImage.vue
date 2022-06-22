<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClick">
      <div class="modal-window">
        <img src="/icon/icon-close.svg" class="icon-close" @click="onClick" />
        <div class="modal-content">
          <img class="image" :src="uploadedImage" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    uploadedImage: {
      type: String,
      default: '',
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
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
  background: $true_white;
  border-radius: 4px;
  box-sizing: border-box;
  position: relative;
}

.modal-content {
  text-align: center;
  margin: 40px 30px 30px;

  .image {
    width: 550px;
    height: 380px;
    object-fit: contain;
  }
}

.icon-close {
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
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
