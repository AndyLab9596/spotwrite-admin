<template>
  <button
    class="button"
    :type="type"
    :class="[size, { inverse }, { greyed }]"
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
    greyed: {
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
  },
});
</script>

<style lang="scss" scoped>
.button {
  padding-right: 14px;
  padding-left: 14px;
  color: $true_white;
  font-size: 13px;
  font-weight: 600;
  appearance: none;
  background-color: $gray_blue_3;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: $gray_blue_4;
  }

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

.inverse {
  background-color: $true_white;
  color: $gray_blue_4;
  border: 1px solid $light_gray_blue_3;

  &:hover {
    color: $gray_blue_4;
    background-color: $light_gray_blue_3;
  }
}

.greyed {
  color: $gray_blue_4;
  background-color: $light_gray_blue_3;
  border: 1px solid transparent;

  &:disabled {
    color: $gray;
    background-color: $white_2;
    cursor: not-allowed;
    border: none;
  }

  &:hover {
    background-color: $true_white;
    color: $gray_blue_4;
    border: 1px solid $light_gray_blue_3;

    &:disabled {
      color: $gray;
      background-color: $white_2;
      cursor: not-allowed;
      border: none;
    }
  }
}
</style>
