<template>
  <div class="dotted-border" :class="{ 'vertical-border': isVertical }"></div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DottedBorder',
  props: {
    isVertical: {
      default: false,
      type: Boolean,
    },
  },
});
</script>

<style lang="scss" scoped>
.dotted-border {
  width: 100%;
  height: 1px;
  background-image: url('/app/icon/dotted-border.svg');
  background-repeat: repeat;
}

.vertical-border {
  position: absolute;
  top: 54px;
  left: 49%;
  width: 78px;
  transform: translate(-50%, -50%) rotate(90deg);
}
</style>
