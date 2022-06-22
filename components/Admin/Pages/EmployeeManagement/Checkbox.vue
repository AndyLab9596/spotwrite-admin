<template>
  <div class="checkbox-wrapper inline">
    <input
      :id="key"
      :checked="checkedValue(value)"
      type="checkbox"
      class="checkbox-input"
      :value="value"
      :disabled="disabled"
      @change="onChange"
    />
    <label
      class="checkbox-label"
      :class="{ empty: !label.length, disabled }"
      :for="key"
    >
      <span class="checkbox-title">{{ title }}</span>
      <span class="checkbox-icon checkbox-text">{{ label }}</span>
    </label>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

type Content = {
  label: String;
  value: String;
};

export default Vue.extend({
  model: {
    prop: 'selectedValues',
    event: 'change',
  },
  props: {
    selectedValues: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: 'default',
    },
    title: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    checkedValue() {
      return (value: string): boolean => {
        return this.selectedValues.includes(value);
      };
    },
    key() {
      return `${this.value}_${Math.random()
        .toString(32)
        .substring(2)}`;
    },
  },
  methods: {
    onChange(event: { target: HTMLInputElement }) {
      if (event.target instanceof HTMLInputElement) {
        let updateValues = [...this.selectedValues] as string[];
        if (event.target.checked) {
          updateValues.push(event.target.value);
        } else {
          updateValues = updateValues.filter(
            (v: string) => v !== event.target!.value
          );
        }
        this.$emit('change', updateValues);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.checkbox-wrapper {
  position: relative;
  height: 16px;
  line-height: 14px;
  white-space: nowrap;
}

.inline {
  display: inline;
}

input[type='checkbox'] {
  display: none;
}

.checkbox-title {
  color: $pink;
}

.checkbox-text {
  display: inline-block;
  height: 16px;
  padding-top: 2px;
}

.checkbox-label {
  position: relative;
  display: inline-block;
  height: 16px;
  vertical-align: text-top;
  padding: 0 0 0 22px;
  font-size: 12px;
  cursor: pointer;
  color: $dark_blue;

  &.empty {
    padding: 0 0 0 16px;
  }

  &.disabled {
    cursor: not-allowed;
  }
}

.checkbox-label::after,
.checkbox-label::before {
  position: absolute;
  content: '';
  display: block;
}

.checkbox-label::before {
  left: 0;
  top: 0;
  width: 16px;
  height: 16px;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  background-color: $true_white;
}

input[type='checkbox']:checked + .checkbox-label::before {
  background-color: $pink;
  border: 0;
}

input[type='checkbox']:checked + .checkbox-label .checkbox-icon::before {
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

input[type='checkbox']:checked + .checkbox-label .checkbox-icon::after {
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
