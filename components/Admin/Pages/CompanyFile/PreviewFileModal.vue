<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        <base-button class="button" size="large" @click="onClose">
          プレビューを閉じる
          <img
            src="/icon/icon_cross-white.svg"
            class="icon-button-cross"
            @click="onClose"
          />
        </base-button>
        <div class="scroll-contents">
          <object
            v-if="!isFetchPreviewFile"
            :data="url"
            width="940"
            height="600"
            class="object-style"
          >
            ファイルをプレビューできませんでした
          </object>
          <vue-loading
            v-if="isFetchPreviewFile"
            type="spin"
            color="#333"
            :size="{ width: '50px', height: '50px' }"
          ></vue-loading>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import { VueLoading } from 'vue-loading-template';

export default Vue.extend({
  components: {
    BaseButton,
    VueLoading,
  },
  props: {
    url: {
      type: String,
      required: true,
    },
    isFetchPreviewFile: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    onClose() {
      this.$emit('onClose');
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
  width: 1000px;
  height: 678px;
  background: $true_white;
  border-radius: 6px;
  padding: 48px 30px 30px;
  position: relative;
}

.scroll-contents {
  overflow-y: scroll;
}

.icon-cross {
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
}

.icon-button-cross {
  cursor: pointer;
  margin: 0 0 0 12px;
  width: 16px;
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

.button {
  position: absolute;
  top: -50px;
  right: 0;
  font-weight: 600;
  width: fit-content;
  display: flex;
  align-items: center;
}

.object-style {
  object-fit: contain;
}
</style>
