<template>
  <div class="submenu">
    <button class="submenu__button" @click="$emit('download')">
      ダウンロード
    </button>
    <button class="submenu__button" @click="$emit('move-file')">
      移動
    </button>
    <button class="submenu__button" @click="clickDelete">
      削除
    </button>
    <button class="submenu__button" @click="$emit('toggle-name-edit')">
      名前を変更
    </button>
    <button
      class="submenu__button"
      :disabled="!checkFileType"
      @click="clickPreview"
    >
      プレビュー
    </button>
    <button class="submenu__button" @click="$emit('link-copy')">
      リンクをコピー
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    checkFileType(): boolean {
      // PDFもしくは画像、オフィスファイル
      return (
        this.type === 'pdf' ||
        this.type === 'gif' ||
        this.type === 'jpg' ||
        this.type === 'jpeg' ||
        this.type === 'png' ||
        this.type === 'mp4' ||
        this.type === 'bmp' ||
        this.type === 'pptx' ||
        this.type === 'xlsx' ||
        this.type === 'docx'
      );
    },
  },
  methods: {
    clickPreview() {
      this.$emit('preview', this.name);
    },
    clickDelete() {
      const deleteItem = {
        name: this.name,
        type: this.type,
      };
      this.$emit('delete', deleteItem);
    },
  },
});
</script>

<style lang="scss" scoped>
.submenu {
  z-index: 1;
  border-radius: 5px;
  border: 1px solid #e4e5ed;
  background-color: $true_white;
  width: 150px;
  min-height: 140px;
  position: absolute;
  top: 5px;
  left: 35px;
  text-align: left;

  &__button {
    border: none;
    display: block;
    width: 100%;
    text-align: left;
    background-color: $true_white;
    color: #7e8195;
    padding: 10px;

    &:hover {
      background-color: $light_gray_blue_1;
    }

    &:disabled {
      opacity: 0.2;
      cursor: not-allowed;
    }
  }
}
</style>
