<template>
  <div :class="{ 'room-icon-bg': isActive(src) }">
    <img v-if="src && !isUploading" :src="src" alt="" />
    <div v-if="isUploading" class="image-uploading"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    src: {
      type: String,
      required: false,
      default: null,
    },
    isUploading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    isActive() {
      return (src: string): boolean => {
        return !src;
      };
    },
  },
});
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 1px 3px $box-shadow;
}

.room-icon-bg {
  border-radius: 15px;
  background-color: #b0e0e6;
}

.image-uploading {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  display: block;
  box-sizing: border-box;
  flex: 0 0 100%;
  word-wrap: break-word;
  padding: 1px;
  background-color: #f2f3f7;
  position: relative;

  &::after {
    content: ' ';
    display: block;
    height: 32px;
    width: 32px;
    // TODO: 素材がなかったため適当に用意したアイコンなので、デザインに合わせて置き換えてください
    background: url('~assets/image/icon/loading.gif');
    background-repeat: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
