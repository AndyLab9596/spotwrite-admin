<template>
  <button
    class="button"
    :type="type"
    :class="[size, { inverse }]"
    :disabled="disabled"
    @click.stop.prevent="$emit('click')"
  >
    <img :src="iconSrc" />
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
        const included = ['small', 'large'].indexOf(value);
        return included !== -1;
      },
      default: 'small',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    inverse: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      validator: (value: string | undefined) => {
        if (value === undefined) return true;
        return ['button', 'submit'].includes(value);
      },
      default: undefined,
    },
    iconSrc: {
      type: String,
      default: '/app/icon/Icon-questionnaire.svg',
    },
  },
});
</script>

<style lang="scss" scoped>
.button {
  padding-right: 14px;
  padding-left: 14px;
  color: $true_white;
  font-size: 15px;
  font-weight: 600;
  appearance: none;
  background-color: $icon_gray;
  border: none;
  box-shadow: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  img {
    margin-right: 25px;
  }
}

.small {
  height: 30px;
  font-size: 12px;
}

.large {
  height: 44px;
}

.inverse {
  background: $true_white;
  color: $gentle_bluish_purple;
  border: 1px solid $ruled_line;
}
</style>
