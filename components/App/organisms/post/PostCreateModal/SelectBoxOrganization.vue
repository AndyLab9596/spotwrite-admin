<template>
  <select
    v-model="selectedItem"
    :name="name"
    :value="value"
    :class="{
      'large-font': largeFont,
      errored: errored,
    }"
    :disabled="disabled"
    :pattern="pattern"
    @change="onChange"
    @focus="onFocus"
    @blur="onBlur"
  >
    <option value="" hidden>{{ firstValue }}</option>
    <option v-for="(item, index) in items" :key="index" :value="item.uuid">
      {{ item.name }}
    </option>
  </select>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SelectBoxOrganization',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    name: {
      type: String,
      required: true,
      default: '',
    },
    items: {
      type: Array,
      required: true,
    },
    value: {
      type: [String, Number],
      required: false,
      default: '',
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    errored: {
      type: Boolean,
      required: false,
      default: false,
    },
    largeFont: {
      type: Boolean,
      required: false,
      default: false,
    },
    isNumber: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    selectedItem: '' as string,
  }),
  computed: {
    pattern(): boolean | string {
      return this.isNumber ? '\\d*' : false;
    },
    firstValue(): string {
      return this.placeholder || '-';
    },
  },
  methods: {
    onChange(event: { target: HTMLInputElement }) {
      this.$emit('change', event.target.value);
    },
    onFocus(event: Event) {
      this.$emit('focus', event);
    },
    onBlur(event: Event) {
      this.$emit('blur', event);
    },
  },
});
</script>

<style lang="scss" scoped>
select {
  margin: 8px 0 0;
  width: 100%;
  height: 44px;
  font-size: 13px;
  color: $gentle_bluish_purple;
  background-color: $extra_light_gray;
  outline: none;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  padding-left: 12px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('/app/icon/Icon-pulldown.svg');
  background-repeat: no-repeat;
  background-size: 10px 8px;
  background-position: center right 10px;
  cursor: pointer;
}

select::-ms-expand {
  display: none;
}

.large-font {
  font-size: 15px;
}

.errored {
  border-color: #ffb4b4;
  background-color: #faf0f0;
}
</style>
