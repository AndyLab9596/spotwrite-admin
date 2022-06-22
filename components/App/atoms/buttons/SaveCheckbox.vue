<template>
  <label for="saveCheckbox" class="checkbox">
    <input
      id="saveCheckbox"
      type="checkbox"
      name="saveCheckbox"
      class="checkbox--hidden"
      @change="$emit('input', $event.target.checked)"
    />
    <span class="checkbox--displayed"></span>
    <slot></slot>
  </label>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss" scoped>
.checkbox {
  position: relative;
  cursor: pointer;
  color: $true_white;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.checkbox--hidden {
  display: none;

  &:checked ~ span {
    background: $link_color;

    &::after {
      visibility: visible;
    }
  }
}

.checkbox--displayed {
  width: 16px;
  height: 16px;
  margin: 0 16px 0 0;
  background: $input_text_background_color;
  display: inline-block;
  border-radius: 4px;
  transition: all linear 0.3s;

  &::after {
    content: '';
    position: absolute;
    top: 4px;
    left: 5px;
    border-bottom: 2px solid $true_white;
    border-right: 2px solid $true_white;
    height: 9px;
    width: 6px;
    transform: rotate(45deg);
    visibility: hidden;
  }
}
</style>
