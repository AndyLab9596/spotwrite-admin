<template>
  <input
    :value="value"
    type="text"
    :class="size"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    size: {
      type: String,
      validator: (value: string) => {
        const included = ['small', 'large'].indexOf(value);
        return included !== -1;
      },
      default: 'large',
    },
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
input {
  width: 100%;
  padding: 11px;
  color: $gray_blue_4;
  appearance: none;
  background-color: $extra_light_gray;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;

  &:disabled {
    color: $gray;
    background-color: $white_2;
    cursor: not-allowed;
  }

  &::placeholder {
    color: $placeholder_gray;
  }
}

.small {
  height: 30px;
}

.large {
  height: 40px;
}
</style>
