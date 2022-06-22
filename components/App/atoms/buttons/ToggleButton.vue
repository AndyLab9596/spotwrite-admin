<template>
  <div class="toggle-button-container">
    <div class="toggle-switch">
      <input
        id="toggle"
        class="toggle-input"
        type="checkbox"
        :checked="value"
        @change="onChange"
      />
      <label for="toggle" class="toggle-label" />
    </div>
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
    value: {
      type: [Number, Boolean],
      required: false,
      default: 0,
    },
  },
  data: () => ({
    isActive: false as boolean,
  }),
  created() {
    this.isActive = this.value;
  },
  methods: {
    onChange(event: Event) {
      if (event.target instanceof HTMLInputElement) {
        this.isActive = !this.isActive;
        this.$emit('onChange', this.isActive);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.toggle-input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  opacity: 0;
  cursor: pointer;
}

.toggle-label {
  width: 52px;
  height: 32px;
  background: #ccc;
  position: relative;
  display: inline-block;
  border-radius: 46px;
  transition: 0.4s;
  box-sizing: border-box;

  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 28px;
    border-radius: 100%;
    left: 0;
    top: 2px;
    z-index: 2;
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    transition: 0.4s;
  }
}

.toggle-input:checked + .toggle-label {
  background-color: $link_color;
}

.toggle-input:checked + .toggle-label::after {
  left: 22px;
}

.toggle-switch {
  position: relative;
  width: 52px;
  height: 32px;
  margin: auto;
}
</style>
