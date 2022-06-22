<template>
  <p class="title-with-index-text">
    <span class="index">{{ index }}. </span>{{ title }}
  </p>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
    },
    index: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.title-with-index-text {
  line-height: 1em;
  font-size: 15px;
  color: $main_color;
  font-weight: 600;

  .index {
    color: $link_color;
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    font-weight: bold;
  }
}
</style>
