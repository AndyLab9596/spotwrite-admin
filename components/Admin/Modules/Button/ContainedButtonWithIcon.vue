<template>
  <button
    class="button"
    :type="type"
    :class="[size, { inverse }]"
    :disabled="disabled"
    @click.stop.prevent="$emit('click')"
  >
    <img
      :src="src"
      :style="{ width: iconWidth + 'px', marginRight: iconMarginRight + 'px' }"
      alt=""
    />
    <slot></slot>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    src: {
      type: String,
      required: true,
    },
    iconWidth: {
      type: Number,
      required: false,
      // スタイルガイドのサイズ
      default: 16,
    },
    iconMarginRight: {
      type: Number,
      required: false,
      // スタイルガイドのサイズ
      default: 7,
    },
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
  },
});
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  padding-right: 14px;
  padding-left: 7px;
  color: $true_white;
  font-size: 13px;
  font-weight: 600;
  appearance: none;
  background-color: $gray_blue_3;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  line-height: 1em;
  transition: all 0.2s ease-in;

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
    background-color: $white_6;
  }
}
</style>
