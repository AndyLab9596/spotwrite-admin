<template>
  <div class="thank-you-head-wrapper">
    <img src="/app/image/flower-left.svg" class="flower-left" />
    <div class="head-center-contents">
      <p class="contents-title">ありがとう</p>
      <img src="/app/image/clapping-hands.svg" class="clapping-hands" />
    </div>
    <img src="/app/image/flower-right.svg" class="flower-right" />
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
.thank-you-head-wrapper {
  display: flex;
  justify-content: space-between;
  width: 231px;
  margin: 0 0 28px;
}

.head-center-contents {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.contents-title {
  font-family: 'Lato', sans-serif;
  font-size: 22px;
  font-weight: bold;
  line-height: 1em;
  margin: 0 0 7px 0;
}

.flower-right,
.flower-left {
  width: 36px;
}

.clapping-hands {
  width: 32px;
  margin: 0 0 -10px;
}
</style>
