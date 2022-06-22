<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>

        <div class="modal-content">
          <div v-if="isUpgrading">
            <p>契約プラン変更の予約が完了しました。</p>
            <p>早速新しいプランでspotwriteをご利用頂けます！</p>
            <p>次回契約更新日（{{ changedOn }}）から新しい料金にて</p>
            <p>ご請求させていただきます。</p>
          </div>
          <div v-else>
            <p>契約プラン変更の予約が完了しました。</p>
          </div>
        </div>

        <div class="button-box">
          <base-button size="large" @click="onClose">
            閉じる
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
  components: {
    BaseButton,
  },
  props: {
    isUpgrading: {
      type: Boolean || undefined,
      required: true,
    },
    changedOn: {
      type: Date,
      default: undefined,
      required: false,
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
  right: 0;
  bottom: 0;
  background-color: $modal_bg;
}

.modal-window {
  display: flex;
  flex-direction: column;
  background: $true_white;
  border-radius: 4px;
  padding: 15px 15px 20px 15px;
  box-shadow: 0 0 3px 0 $light_gray;
  width: 500px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.modal-content {
  display: flex;
  justify-content: center;
  padding: 30px 0 0;
}

.title {
  font-size: 15px;
  font-weight: 600;
}

.sub-title {
  font-size: 15px;
  margin-top: 21px;
}

.icon-cross {
  cursor: pointer;
}

.button-box {
  display: flex;
  justify-content: center;
  margin-top: 32px;

  button {
    width: 215px;
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
