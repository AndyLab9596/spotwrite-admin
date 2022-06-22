<template>
  <div class="button">
    <img :src="favoriteIconPath" @click="changeFavorite" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    isFavorite: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    favoriteIconPath(): string {
      return this.isFavorite
        ? '/app/icon/Icon-favorite-yellow.svg'
        : '/app/icon/Icon-favorite.svg';
    },
  },
  methods: {
    changeFavorite() {
      if (this.isFavorite) {
        this.$emit('onChange', false);
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
  width: 12px;
  cursor: pointer;
}
</style>
