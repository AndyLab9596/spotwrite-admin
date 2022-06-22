<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div class="modal-content">
          <slot />
        </div>
        <div class="modal-footer">
          <button class="button submit-button" @click="onClick">
            {{ submitButtonText }}
          </button>
          <button class="button cancel-button" @click="onClose">
            キャンセル
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    updateButtonText: {
      type: String,
      required: false,
      default: '変更',
    },
    index: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      submitButtonText: this.updateButtonText,
    };
  },
  methods: {
    onClick() {
      this.$emit('click', this.index);
    },
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
  background: $true_white;
  border-radius: 6px;
  padding: 16px 16px 10px 10px;
  font-size: 15px;
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
  padding: 18px 20px 0;
}

.select {
  flex: 1;
  width: 230px;
  height: 40px;
}

.modal-footer {
  display: flex;
  flex-direction: row;
  padding: 32px 20px 10px;
}

.button {
  width: 215px;
  height: 40px;
  font-size: 13px;
  font-weight: bold;
  border-radius: 4px;
}

.submit-button {
  margin-right: 10px;
  color: $true_white;
  background-color: $gray_blue_3;
  border: none;

  &:hover {
    background-color: $gray_blue_4;
  }
}

.cancel-button {
  color: $gray_blue_4;
  background-color: $true_white;
  border: solid 1px $light_gray_blue_3;

  &:hover {
    background-color: $light_gray_blue_3;
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
