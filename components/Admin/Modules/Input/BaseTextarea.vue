<template>
  <textarea
    :value="value"
    :placeholder="placeholder"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
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
textarea {
  height: 120px;
  width: 100%;
  padding: 11px;
  color: $gray_blue_4;
  appearance: none;
  background-color: $extra_light_gray;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  resize: none;

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
