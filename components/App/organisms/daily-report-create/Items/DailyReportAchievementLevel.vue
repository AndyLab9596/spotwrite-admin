<template>
  <div class="achievement-level-box">
    <div class="progress-bar-box">
      <div class="progress-bar-label">{{ label }}</div>
      <input
        v-model="range"
        type="range"
        class="progress-bar-range"
        :disabled="disabled"
      />
    </div>
    <div class="achievement-level-value-box">
      <div class="achievement-level-value-item">
        <p class="item-value">{{ value }}</p>
        <p class="item-mark">%</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    value: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    range: '0' as string,
  }),
  watch: {
    value() {
      this.range = String(this.value);
    },
    range() {
      this.$emit('change', Number(this.range));
    },
  },
  created() {
    this.range = String(this.value);
  },
});
</script>

<style lang="scss" scoped>
.achievement-level-box {
  display: flex;
  padding: 16px 24px;
  width: 100%;
  background-color: $white_1;
  border-radius: 4px;
}

.progress-bar-box {
  width: 100%;
}

.progress-bar-label {
  font-size: 13px;
  font-weight: 600;
  color: $gentle_bluish_purple;
  margin: 0 0 6px;
}

.achievement-level-value-box {
  display: flex;
  align-items: flex-end;
  flex-grow: 1;

  .achievement-level-value-item {
    display: flex;
    align-items: flex-end;
    color: $gentle_bluish_purple;
    font-family: 'Lato', sans-serif;
    font-weight: 400;
  }

  .item-value {
    width: 50px;
    margin-left: 22px;
    font-size: 28px;
    text-align: right;
    line-height: 1em;
  }

  .item-mark {
    margin-left: 7px;
    font-size: 15px;
  }
}

.progress-bar-range {
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  background-image: $gradient_9;
  height: 18px;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 0 4px $true-white inset;

  &:disabled {
    cursor: default;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    border-radius: 50%;
    background-color: $gray_blue_3;
    border: 3px solid $true-white;
    width: 20px;
    height: 20px;
    box-shadow: 101vw 0 0 100vw $true-white;
  }

  &::-moz-range-thumb {
    border-radius: 50%;
    background-color: $gray_blue_3;
    border: 2px solid $true-white;
    width: 18px;
    height: 18px;
    box-shadow: 101vw 0 0 100vw $true-white;
  }
}
</style>
