<template>
  <div>
    <img
      src="/app/image/pickup-frame.png"
      :style="{ height: height + 'px' }"
      class="frame"
      alt=""
    />
    <img src="/app/image/pickup-label.svg" class="pick-up-label" alt="" />
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

.pick-up-label {
  position: absolute;
  bottom: 11px;
  right: 0;
  left: 0;
  margin: 0 auto;
  width: 160px;
}
</style>
