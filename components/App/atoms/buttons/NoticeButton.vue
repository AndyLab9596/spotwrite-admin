<template>
  <div class="outer-container">
    <div class="button-container">
      <div class="left-button">
        <button
          class="button"
          :type="type"
          :class="[{ inverse, leftSelected }]"
          :disabled="disabled"
          @click.stop.prevent="$emit('clickLeft')"
        >
          {{ leftButtonContent }}
        </button>
      </div>
      <div class="right-button">
        <button
          class="button"
          :type="type"
          :class="[{ inverse, rightSelected }]"
          :disabled="disabled"
          @click.stop.prevent="$emit('clickRight')"
        >
          {{ rightButtonContent }}
        </button>
      </div>
    </div>
    <div
      class="new-icon--left"
      :class="leftSelected ? 'text-white' : 'text-pink'"
    ></div>
    <div
      class="new-icon--right"
      :class="rightSelected ? 'text-white' : 'text-pink'"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'NoticeButton',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    inverse: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    leftButtonContent: {
      type: String,
      default: '',
    },
    rightButtonContent: {
      type: String,
      default: '',
    },
    leftSelected: {
      type: Boolean,
      default: false,
    },
    rightSelected: {
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
.outer-container {
  position: relative;
}

.button-container {
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.left-button,
.right-button {
  position: relative;
}

.button {
  flex: 50%;
  width: 124px;
  height: 32px;
  color: $true_white;
  font-size: 12px;
  font-weight: 600;
  appearance: none;
  background-color: $button_gray;
  border: none;
  box-shadow: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
}

.inverse {
  background-color: $button_background_color;
  color: $gentle_bluish_purple;
  border: 1px solid $ruled_line;
}

.leftSelected,
.rightSelected {
  background-color: $link_color_alt;
}

.text-white {
  color: $true_white;
}

.text-pink {
  color: $link_color;
}

.new-icon--left::before {
  content: 'New!';
  position: absolute;
  top: -50%;
  left: 8px;
  font-family: 'Alex Brush', Arial, Helvetica, sans-serif;
  font-size: 15px;
  transform: translateY(40%);
}

.new-icon--right::before {
  content: 'New!';
  position: absolute;
  top: -50%;
  right: 88px;
  font-family: 'Alex Brush', Arial, Helvetica, sans-serif;
  font-size: 15px;
  transform: translateY(40%);
}
</style>
