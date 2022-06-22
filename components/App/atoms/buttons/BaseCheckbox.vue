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
  margin-right: 1px;
}

.inline {
  display: inline;
}

input[type='checkbox'] {
  display: none;
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
  font-size: 13px;
  cursor: pointer;
  color: $main_color;

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
  border: 1px solid $button_background_color;
  border-radius: 4px;
  background-color: $true_white;
}

input[type='checkbox']:checked + .checkbox-label::before {
  background-color: $true_white;
  border: 1px solid $link_color;
}

input[type='checkbox']:checked + .checkbox-label .checkbox-icon::before {
  content: '';
  display: block;
  position: absolute;
  top: 9px;
  left: 3px;
  width: 5px;
  height: 1px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  transform: rotate(45deg);
  background: $link_color;
}

input[type='checkbox']:checked + .checkbox-label .checkbox-icon::after {
  content: '';
  display: block;
  position: absolute;
  top: 8px;
  right: 1.5px;
  width: 8px;
  height: 1px;
  border-top-right-radius: 1px;
  border-bottom-right-radius: 1px;
  transform: rotate(-45deg);
  background: $link_color;
}
</style>
