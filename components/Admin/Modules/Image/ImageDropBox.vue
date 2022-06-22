<template>
  <div class="image-drop-box-container">
    <p class="description">ここに写真をドロップ</p>
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
    <p v-if="limit > 0" class="description-small">
      登録できる写真は最大{{ limit }}枚です
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
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    availableFilesCount: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      default: 0,
    },
  },
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
      this.dragEntered = false;
      if (
        this.limit > 0 &&
        this.availableFilesCount + files.length > this.limit
      ) {
        alert(`${this.limit}枚以上写真は追加できません。`);
        return true;
      }
      for (let i = 0; i < files.length; i += 1) {
        this.$emit('create', files[i]);
      }
    },
    onFileChange(e: any) {
      const files = e.target.files || e.dataTransfer.files;
      if (
        this.limit > 0 &&
        this.availableFilesCount + files.length > this.limit
      ) {
        alert(`${this.limit}枚以上写真は追加できません。`);
        return true;
      }
      for (let i = 0; i < files.length; i += 1) {
        this.$emit('create', files[i]);
      }
      this.$refs.fileInput.value = '';
    },
  },
});
</script>

<style lang="scss" scoped>
.image-drop-box-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  background-color: $extra_light_gray;
  border: dotted 1px $light_gray_blue_3;
  border-radius: 6px;
  color: $gray_blue_4;
}

.description {
  font-size: 15px;
  margin-top: 4px;
}

.description-small {
  font-size: 13px;
  margin-top: 4px;
}

.upload-image-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 30px;
  font-size: 13px;
  background-color: $gray_blue_3;
  border-radius: 6px;
  cursor: pointer;
  z-index: 1;
  color: $true_white;
  font-weight: bold;
  margin-top: 8px;
}

.drop-area-over {
  position: absolute;
  width: 100%;
  height: 120px;
  background-color: $true_white;
  opacity: 0;

  &_entered {
    opacity: 0.5;
    z-index: 9;

    &.upload-image-button {
      pointer-events: none;
    }
  }
}
</style>
