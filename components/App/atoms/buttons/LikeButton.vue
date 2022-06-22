<template>
  <div class="button">
    <img :src="likeSrc" @click="changeLike" />
    <span v-if="likeCount" class="count">{{ likeCount }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    isLiked: {
      type: Boolean,
      required: true,
    },
    likeCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  computed: {
    likeSrc(): string {
      return this.isLiked
        ? '/app/icon/Icon-like-pink.svg'
        : '/app/icon/Icon-like.svg';
    },
  },
  methods: {
    changeLike() {
      if (this.isLiked) {
        this.$emit('onChange', true);
      } else {
        this.$emit('onChange', true);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
}

img {
  width: 16px;
  cursor: pointer;
}

.count {
  font-family: 'Lato', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: $main_color;
  padding: 0 0 0 9px;
}
</style>
