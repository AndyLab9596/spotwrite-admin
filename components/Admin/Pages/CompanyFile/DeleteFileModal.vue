<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <img src="/app/icon/cross.svg" class="icon-cross" @click="onClose" />
        <!-- eslint-disable -->
        <p class="modal-text">選択したフォルダー / ファイル を削除しますか？
          削除したデータを元に戻すことはできません。
        </p>
        <div class="modal-footer">
          <base-button size="large" class="delete-button" @click="onDelete">
            削除
          </base-button>
          <base-button
            size="large"
            class="cancel-button"
            inverse
            @click="onClose"
          >
            キャンセル
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
  components: { BaseButton },
  methods: {
    onDelete() {
      this.$emit('delete');
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
  padding: 56px 30px 20px;
  position: relative;
}

.icon-cross {
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  width: 16px;
}

.modal-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
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

.modal-text {
  color: $main_color;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.6;
  margin: 0 0 15px;
  white-space: pre-line;
}

.cancel-button,
.delete-button {
  width: 100%;
}

.delete-button {
  margin: 0 10px 0 0;

  &:hover {
    color: $true-white;
  }
}
</style>
