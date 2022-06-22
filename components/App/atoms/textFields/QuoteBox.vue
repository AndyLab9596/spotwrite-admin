<template>
  <div class="quote-container">
    <div v-if="isBefore" class="is-before"></div>
    <div
      class="quote-box"
      :class="{ 'before-radius': isBefore, 'after-radius': isAfter }"
    >
      <slot></slot>
    </div>
    <div v-if="isAfter" class="is-after"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    isBefore: {
      default: false,
      type: Boolean,
    },
    isAfter: {
      default: false,
      type: Boolean,
    },
  },
});
</script>

<style lang="scss" scoped>
.quote-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  color: $chart_text;
  margin: 0 0 16px;
}

.quote-box {
  width: 100%;
  min-height: 71px;
  background: transparent $gradient_6 0% 0% no-repeat padding-box;
  border-radius: 0 0 8px 8px;
  padding: 16px 16px 19px 16px;
}

.before-radius {
  border-radius: 0 8px 8px 8px;
}

.after-radius {
  border-radius: 8px 0 8px 8px;
}

.is-before {
  margin: 0 -3px 0 0;
  border-left: 20px solid transparent;
  border-top: 20px solid $baby_blue;
  border-bottom: 20px solid transparent;
  background-color: transparent;
}

.is-after {
  margin: 0 0 0 -3px;
  border-right: 20px solid transparent;
  border-top: 20px solid $powder_pink;
  border-bottom: 20px solid transparent;
  background-color: transparent;
}
</style>
