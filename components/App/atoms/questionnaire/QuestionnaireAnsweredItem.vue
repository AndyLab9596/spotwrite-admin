<template>
  <div class="item">{{ voteCount }}票 {{ answer }}</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    answer: {
      type: String,
      required: false,
      default: '',
    },
    uuid: {
      type: String,
      required: false,
      default: '',
    },
    voteCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
});
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  padding: 0 0 0 15px;
  height: 44px;
  border-radius: 4px;
  color: $main_color;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  background-color: $graph_background_color;
}
</style>
