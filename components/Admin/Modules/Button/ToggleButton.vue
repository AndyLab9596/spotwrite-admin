<template>
  <div class="toggle-button-container">
    <div v-for="(content, index) in contents" :key="index">
      <input
        :id="`${name}-${index}`"
        :checked="value === content.value"
        type="radio"
        class="radio"
        :value="content.value"
        :name="name"
        :disabled="disabled"
        @change="onChange"
      />
      <label
        :for="`${name}-${index}`"
        :class="'label-' + size"
        class="toggle-item"
        >{{ content.label }}</label
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

type Content = {
  label: String;
  value: String;
};

export default Vue.extend({
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: false,
      default: '',
    },
    contents: {
      type: Array as PropType<Content[]>,
      required: true,
    },
    size: {
      type: String as PropType<'small' | 'default'>,
      required: false,
      default: 'default',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    onChange(event: Event) {
      if (event.target instanceof HTMLInputElement) {
        this.$emit('change', event.target.value);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.toggle-button-container {
  display: flex;
  flex-direction: row;
  background-color: $white_1;
  padding: 3px;
  border: 1px solid $light_gray_blue_3;
  border-radius: 7px;
}

.radio {
  display: none;
}

label {
  display: block;
  padding: 0 15px;
  color: $gray_blue_4;
  font-size: 13px;
  line-height: 23px;
  white-space: nowrap;
  cursor: pointer;
}

.label {
  &-small {
    font-size: 11px;
    line-height: 11px;
    padding: 0 5px;
  }
}

.radio:checked + label {
  background-color: $true_white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.16);
  font-weight: 600;
}

.toggle-item {
  min-height: 14px;
  display: flex;
  align-items: center;
}
</style>
