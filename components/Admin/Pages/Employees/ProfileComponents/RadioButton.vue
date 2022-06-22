<template>
  <div class="radio">
    <input
      :id="id"
      :name="name"
      type="radio"
      class="radio-input"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      @change="onChange"
    />
    <label class="radio-label" :class="{ disabled: disabled }" :for="id">
      {{ label }}
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
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
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
.radio {
  display: inline-block;
  margin: 0 8px 0 0;
}

input[type='radio'] {
  display: none;
}

.radio-label {
  position: relative;
  padding: 0 0 0 24px;
  font-size: 15px;
  color: $dark_blue;

  &:not(.disabled) {
    cursor: pointer;
  }
}

.radio-label::after,
.radio-label::before {
  position: absolute;
  content: '';
  display: block;
  margin: -1px 0 0 0;
}

.radio-label::after {
  left: 0;
  top: 0;
  width: 16px;
  height: 16px;
  border: 1px solid $light_gray_blue_3;
  border-radius: 50%;
}

.radio-label::before {
  left: 4px;
  top: 4px;
  width: 8px;
  height: 8px;
  background: $pink;
  border-radius: 50%;
  opacity: 0;
}

input[type='radio']:checked + .radio-label::before {
  opacity: 1;
}

.error {
  .radio-label {
    color: $pink;

    &::after {
      border-color: $pink;
    }
  }
}
</style>
