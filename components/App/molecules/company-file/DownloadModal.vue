<template>
  <transition name="modal" appear>
    <div class="modal-window">
      <img
        src="/icon/icon_cross.png"
        class="icon-cross"
        @click="$emit('onClose')"
      />
      <div class="modal-content">
        <p>チェックを入れたファイルをまとめて</p>
        <base-button
          greyed
          :disabled="downloadValidation"
          @click="$emit('onDownload')"
        >
          ダウンロード
        </base-button>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';

export default Vue.extend({
  components: {
    BaseButton,
  },
  props: {
    selectedItems: {
      type: Array as PropType<string[]>,
      required: true,
    },
    downloadValidation: {
      type: Boolean,
      required: true,
    },
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
  top: 50%;
  left: 50%;
}

.icon-cross {
  height: 12px;
  width: 12px;
  cursor: pointer;
  position: absolute;
  right: 8px;
  top: 8px;
}

.modal-content {
  display: flex;
  align-items: center;
}

.modal-content > p {
  margin: 0 10px 0 0;
  line-height: 1;
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
