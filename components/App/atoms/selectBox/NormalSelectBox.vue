<template>
  <div class="select-box">
    <select
      :name="name"
      :value="selectedValue"
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
      <option
        v-for="(item, index) in items"
        :key="index"
        :value="item.value || item.name"
        :selected="item.value === value || item.name === value"
        :disabled="item.disabled"
      >
        {{ item.name }}
      </option>
    </select>
    <img
      v-if="displayPullDown"
      src="/app/icon/Icon-pulldown.svg"
      class="pulldown-icon"
      alt=""
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SelectBox',
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
    displayPullDown: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    inputType(): string {
      return this.isNumber ? 'number' : 'text';
    },
    pattern(): boolean | string {
      return this.isNumber ? '\\d*' : false;
    },
    firstValue(): string {
      return this.placeholder || '-';
    },
    selectedValue(): number | string {
      return this.value || '';
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
.select-box {
  position: relative;
}

select {
  width: 100%;
  height: 40px;
  font-size: 13px;
  color: $gray_blue_4;
  background-color: $extra_light_gray;
  outline: none;
  border: solid 1px #e4e5ed;
  border-radius: 4px;
  padding-left: 12px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

select::-ms-expand {
  display: none;
}

select [disabled] {
  background-color: #f3f3f3;
  color: #bebebe;
}

.large-font {
  font-size: 15px;
}

.errored {
  border-color: #ffb4b4;
  background-color: #faf0f0;
}

.pulldown-icon {
  position: absolute;
  right: 13px;
  top: 18px;
  width: 10px;
}
</style>
