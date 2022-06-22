<template>
  <div class="button">
    <img src="/app/icon/Icon-talk.svg" />
    <span class="count">{{ commentCount }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    commentCount: {
      type: Number,
      required: true,
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
}

.count {
  font-family: 'Lato', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: $main_color;
  padding: 0 0 0 7px;
}
</style>
