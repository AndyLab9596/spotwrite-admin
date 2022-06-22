<template>
  <div class="image-mask" :number="displayNumber" @click="onImageClick">
    <img :src="src" class="image" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    src: {
      type: String,
      required: true,
    },
    displayNumber: {
      type: Number,
      required: false,
      default: 0,
    },
    imageIndex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  methods: {
    onImageClick(): void {
      this.$emit('imageClick', this.$props.imageIndex);
    },
  },
});
</script>

<style lang="scss" scoped>
.image-mask {
  background-color: $true_black;
  position: relative;
  height: 159px;
  width: 159px;
  border-radius: 8px;

  &:last-of-type {
    margin: 0;
  }

  &::after {
    position: absolute;
    right: 17px;
    bottom: 16px;
    content: attr(number);
    color: $true-white;
    font-size: 15px;
    font-weight: bold;
    font-family: 'Lato', sans-serif;
  }
}

.image {
  opacity: 0.7;
  object-position: center;
  object-fit: cover;
  height: 159px;
  width: 159px;
  border-radius: 8px;
}
</style>
