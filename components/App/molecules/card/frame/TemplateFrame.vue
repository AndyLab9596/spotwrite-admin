<template>
  <div>
    <img
      v-if="urlFrameImage"
      :src="urlFrameImage"
      :style="[{ height: height + 'px', pointerEvents: none }]"
      class="frame"
      alt=""
    />
    <img
      v-if="$props.type === thankYou"
      src="/app/image/hanging-flag-left.svg"
      class="hanging-flag-left"
      alt=""
    />
    <img
      v-if="$props.type === thankYou"
      src="/app/image/hanging-flag-right.svg"
      class="hanging-flag-right"
      alt=""
    />
    <img :src="urlLableImage" class="label" alt="" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { enumPostTypes } from '@/libs/definition';

export default Vue.extend({
  props: {
    height: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      lableWidth: 0 as number,
      thankYou: enumPostTypes.THANKYOU as string,
      pickup: enumPostTypes.PICKUP as string,
      none: enumPostTypes.DEFAULT as string,
    };
  },
  computed: {
    urlFrameImage(): string {
      switch (this.$props.type) {
        case 'thankyou':
          return '/app/image/thankyou-frame.png';
        case 'pickup':
          return '/app/image/pickup-frame.png';
        case 'interview':
          return '/app/image/interview-frame.png';
        default:
          return '';
      }
    },
    urlLableImage(): string {
      switch (this.$props.type) {
        case 'thankyou':
          return '/app/image/thankyou-label-small.svg';
        case 'pickup':
          return '/app/image/pickup-label-small.svg';
        case 'interview':
          return '/app/image/interview-label-small.svg';
        default:
          return '';
      }
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
  width: 110px;
}

.hanging-flag-right {
  position: absolute;
  top: 0;
  right: 0;
  width: 110px;
}

.label {
  position: absolute;
  bottom: -4px;
  right: 0;
  left: 0;
  margin: 0 auto;
  z-index: 2;
}
</style>
