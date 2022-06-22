<template>
  <button
    class="button"
    :class="size"
    :disabled="disabled"
    @click.stop.prevent="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'BaseButton',
  props: {
    size: {
      type: String,
      validator: (value: string) => {
        return ['small', 'large'].includes(value);
      },
      default: 'small',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.button {
  padding-right: 14px;
  padding-left: 14px;
  color: $gray_blue_3;
  font-size: 13px;
  font-weight: 600;
  appearance: none;
  background-color: $true_white;
  border: solid 1px $gray_blue_3;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    color: $gray;
    background-color: $white_2;
    cursor: not-allowed;
  }
}

.small {
  height: 30px;
}

.large {
  height: 40px;
}
</style>
