<template>
  <div class="icon-gradient">
    <img class="icon-image" :src="src" />
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    src: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss" scoped>
.icon-gradient {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  background: $gradient_8;
  border-radius: 12px;
}
</style>
