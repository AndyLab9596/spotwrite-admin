<template>
  <ValidationProvider v-slot="{ errors }" :name="inputName" :rules="rules">
    <label :for="inputName" class="outline-label">
      <slot />
    </label>
    <input
      :id="inputName"
      :type="type"
      class="outline-input"
      :class="{ 'outline-input--error': errors[0] }"
      :name="inputName"
      :placeholder="placeholder"
      :value="value"
      :title="title"
      @input="$emit('input', $event.target.value)"
      @focus="$emit('focus', $event.target.value)"
      @blur="$emit('blur', $event.target.value)"
    />
  </ValidationProvider>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';

export default Vue.extend({
  components: {
    ValidationProvider,
  },
  props: {
    inputName: {
      default: '',
      type: String,
    },
    type: {
      default: 'text',
      type: String,
    },
    placeholder: {
      default: '',
      type: String,
    },
    value: {
      default: '',
      type: String,
    },
    rules: {
      default: '',
      type: [String, Object],
    },
    title: {
      default: null,
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped>
.outline-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0;
  padding: 0 0 8px;
  color: $true_white;
}

.outline-input {
  height: 44px;
  width: 100%;
  margin: 0 0 24px;
  padding: 12px 11px 13px;
  font-size: 15px;
  color: $main_color;
  border: 1px solid $button_background_color;
  background: $input_text_background_color 0% 0% no-repeat padding-box;
  border-radius: 4px;

  &::placeholder {
    color: $main_color;
    opacity: 0.2;
  }
}

.outline-input--error {
  background-color: $light_pink;
  border: 1px solid $invalid_pink;
}
</style>
