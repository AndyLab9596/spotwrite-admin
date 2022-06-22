<template>
  <input
    :value="value"
    type="password"
    :placeholder="placeholder"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'BaseInputPassword',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss" scoped>
input {
  height: 40px;
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
</style>
