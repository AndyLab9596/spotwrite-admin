<template>
  <img
    class="write-button"
    :src="require(`@/assets/image/btn/write-pink.svg`)"
    @click="onClick"
  />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
});
</script>

<style lang="scss" scoped>
.write-button {
  display: block;
  width: 56px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.16));
  cursor: pointer;
}
</style>
