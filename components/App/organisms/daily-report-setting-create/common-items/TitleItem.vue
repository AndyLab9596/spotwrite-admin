<template>
  <div class="title-wrapper">
    <p class="title">{{ title }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.title-wrapper {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 16px;
  background-color: $white_1;
  border-top: 1px solid $ruled_line;
  border-bottom: 1px solid $ruled_line;
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: $gentle_bluish_purple;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
