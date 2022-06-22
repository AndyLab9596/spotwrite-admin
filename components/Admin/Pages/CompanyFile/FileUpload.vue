<template>
  <transition name="modal" appear>
    <div class="modal-window">
      <header>
        <h1>ファイルをアップロード</h1>
        <img
          src="/icon/icon_cross.png"
          class="icon-cross"
          @click="$emit('on-close')"
        />
      </header>

      <div class="image-drop-box-container">
        <p class="description">ここにファイルをドロップ</p>
        <p class="description-small">または</p>
        <label
          class="upload-image-button"
          :class="{ 'drop-area-over_entered': dragEntered }"
        >
          ファイルを選択
          <input
            ref="fileInput"
            type="file"
            name="pic"
            style="display: none;"
            multiple
            @change="onFileChange"
          />
        </label>
        <p class="description-small">
          ※アップロードできるファイルサイズの上限は1GBです。
        </p>
        <div
          class="drop-area-over"
          :class="{ 'drop-area-over_entered': dragEntered }"
          @dragenter="dragEnter"
          @dragleave="dragLeave"
          @dragover.prevent
          @drop.prevent="dropFile"
        ></div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      dragEntered: false as boolean,
    };
  },
  methods: {
    dragEnter() {
      this.dragEntered = true;
    },
    dragLeave() {
      this.dragEntered = false;
    },
    dropFile(e: any) {
      const { files } = e.dataTransfer;
      for (let i = 0; i < files.length; i += 1) {
        this.$emit('create', files[i]);
      }
      this.dragEntered = false;
    },
    onFileChange(e: any) {
      const files = e.target.files || e.dataTransfer.files;
      for (let i = 0; i < files.length; i += 1) {
        this.$emit('create', files[i]);
      }
      this.$refs.fileInput.value = '';
    },
  },
});
</script>
<style lang="scss" scoped>
.modal-window {
  position: fixed;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 710px;
  height: auto;
  background: $true_white;
  border-radius: 4px;
  padding: 21px 30px 28px;
  border: none;
  box-shadow: 0 0 3px $light_gray;
}

header {
  display: flex;
  justify-content: space-between;
  margin: 0 0 22px;

  h1 {
    font-size: 15px;
    padding: 0;
    margin: 0;
    line-height: 1;
  }
}

.icon-cross {
  height: 16px;
  width: 16px;
  cursor: pointer;
  position: absolute;
  right: 16px;
  top: 16px;
}

.image-drop-box-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  color: $gentle_bluish_purple;
  line-height: 1;
  border: 1px $button_background_color dashed;
  border-radius: 4px;
  background: $extra_light_gray;
  padding: 14px 0 8px 0;
}

.description {
  font-size: 15px;
  margin: 0 0 10px;
}

.description-small {
  font-size: 13px;
}

.upload-image-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 30px;
  font-size: 13px;
  background-color: $gray_blue_3;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1;
  color: $true_white;
  font-weight: 600;
  margin: 8px 0;
}

.drop-area-over {
  position: absolute;
  width: 100%;
  height: 120px;
  background-color: $true_white;
  opacity: 0;

  &_entered {
    opacity: 0.5;

    &.upload-image-button {
      pointer-events: none;
    }
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
