<template>
  <div class="checkbox-wrapper inline">
    <input
      :id="id"
      :checked="checked"
      type="radio"
      class="main-check"
      name="main"
      :value="url"
    />
    <label :for="id" class="radio-label" @click="onChange(displayImage)">
      <span class="checkbox-icon"></span>
    </label>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    displayImage: {
      type: Object,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    onChange(displayImage: Types.Image) {
      this.$emit('change', displayImage);
    },
  },
});
</script>

<style lang="scss" scoped>
.checkbox-wrapper {
  position: relative;
  height: 16px;
  line-height: 14px;
  margin-right: 1px;
}

.inline {
  display: inline;
}

input[type='radio'] {
  display: none;
}

.radio-label {
  position: relative;
  display: inline-block;
  height: 16px;
  vertical-align: text-top;
  padding: 0 0 0 16px;
  font-size: 13px;
  cursor: pointer;
  color: $dark_blue;

  &.empty {
    padding: 0 0 0 16px;
  }

  &.disabled {
    cursor: not-allowed;
  }
}

.radio-label::after,
.radio-label::before {
  position: absolute;
  content: '';
  display: block;
}

.radio-label::before {
  left: 0;
  top: 0;
  width: 16px;
  height: 16px;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  background-color: $true_white;
}

input[type='radio']:checked + .radio-label::before {
  background-color: $pink;
  border: 0;
}

input[type='radio']:checked + .radio-label .checkbox-icon::before {
  content: '';
  display: block;
  position: absolute;
  top: 8px;
  left: 3px;
  width: 6px;
  height: 2px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  transform: rotate(45deg);
  background: $true_white;
}

input[type='radio']:checked + .radio-label .checkbox-icon::after {
  content: '';
  display: block;
  position: absolute;
  top: 7px;
  left: 6px;
  width: 8px;
  height: 2px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  transform: rotate(-45deg);
  background: $true_white;
}
</style>
