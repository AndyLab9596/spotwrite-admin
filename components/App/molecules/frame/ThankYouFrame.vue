<template>
  <div>
    <img
      src="/app/image/thankyou-frame.png"
      :style="{ height: height + 'px' }"
      class="frame"
      alt=""
    />
    <img
      src="/app/image/hanging-flag-left.svg"
      class="hanging-flag-left"
      alt=""
    />
    <img
      src="/app/image/hanging-flag-right.svg"
      class="hanging-flag-right"
      alt=""
    />
    <img src="/app/image/thankyou-label.svg" class="thank-you-label" alt="" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    height: {
      type: Number,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.frame {
  position: absolute;
  top: 0;
  left: 0;
  object-fit: fill;
  width: 100%;
}

.hanging-flag-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 204px;
}

.hanging-flag-right {
  position: absolute;
  top: 0;
  right: 0;
  width: 203px;
}

.thank-you-label {
  position: absolute;
  bottom: 11px;
  right: 0;
  left: 0;
  margin: 0 auto;
  width: 213px;
}
</style>
