<template>
  <div>
    <div v-if="pattern === 'pattern1'">
      <img
        src="/app/image/interview-frame-pattern1.png"
        :style="{ height: height + 'px' }"
        class="frame"
        alt=""
      />
      <img
        src="/app/image/interview-label-pattern1.svg"
        class="interview-label"
        alt=""
      />
    </div>
    <div v-if="pattern === 'pattern2'">
      <img
        src="/app/image/interview-frame-pattern2.png"
        :style="{ height: height + 'px' }"
        class="frame"
        alt=""
      />
      <img
        src="/app/image/interview-label-pattern2.svg"
        class="interview-label"
        alt=""
      />
    </div>
    <div v-if="pattern === 'pattern3'">
      <img
        src="/app/image/interview-frame-pattern3.png"
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
      <img
        src="/app/image/interview-label-pattern3.svg"
        class="interview-label"
        alt=""
      />
    </div>
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
    pattern: {
      type: String,
      required: false,
      default: '',
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

.interview-label {
  position: absolute;
  bottom: 16px;
  right: 0;
  left: 0;
  margin: 0 auto;
  width: 191px;
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
</style>
