<template>
  <transition name="modal" appear>
    <div class="progress-bar-wrapper">
      <div class="progress-bar-container">
        <img
          src="/icon/icon_cross-white.svg"
          class="icon-cross"
          @click="onClose"
        />
        <div class="progress-bar-contents">
          <p class="status-text">{{ fileName }}{{ updateStatusMesage }}</p>
          <div class="progress-bar">
            <div
              class="progress-bar-front"
              :style="{ width: loadedSize + '%' }"
            ></div>
            <div class="progress-bar-back"></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    fileName: {
      type: String,
      required: true,
    },
    loadedSize: {
      type: Number,
      required: true,
    },
  },
  computed: {
    updateStatusMesage(): string {
      return this.loadedSize === 100
        ? 'のアップロードが完了しました。'
        : `をアップロード中：${this.loadedSize}%完了`;
    },
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
  },
});
</script>

<style scoped lang="scss">
.progress-bar-container {
  padding: 30px 0 26px;
  width: 800px;
  background-color: $gray_blue_3;
  position: relative;
}

.icon-cross {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 16px;
  cursor: pointer;
}

.progress-bar-contents {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .status-text {
    color: $true-white;
    font-size: 15px;
    font-weight: 300;
    margin: 0 0 14px 0;
  }

  .progress-bar {
    width: 300px;
    border-radius: 20px;
    box-shadow: 0 0 0 2px $true-white;
    position: relative;
    height: 12px;
  }

  .progress-bar-front {
    background: $gradient_10;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border-radius: 20px;
  }
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
