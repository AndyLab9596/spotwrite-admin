<template>
  <button @click.stop.prevent="$emit('click')">
    <svg
      id="Icon_plus_pink"
      data-name="Icon/plus_pink"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <circle
        id="Ellipse_216"
        data-name="Ellipse 216"
        cx="8"
        cy="8"
        r="8"
        fill="#f09c9c"
      />
      <g id="Group_1350" data-name="Group 1350" transform="translate(5 5)">
        <line
          id="Line_373"
          data-name="Line 373"
          y2="6"
          transform="translate(3)"
          fill="#fff"
          stroke="#fff"
          stroke-linecap="round"
          stroke-miterlimit="10"
          stroke-width="1"
        />
        <line
          id="Line_374"
          data-name="Line 374"
          x2="6"
          transform="translate(0 3)"
          fill="#fff"
          stroke="#fff"
          stroke-linecap="round"
          stroke-miterlimit="10"
          stroke-width="1"
        />
      </g>
    </svg>
    <span :class="{ disabled: isDisabled }"><slot /></span>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      propedValue: this.value as string,
      show: false as boolean,
      lock: false as boolean,
    };
  },
});
</script>
<style lang="scss" scoped>
svg {
  position: absolute;
  top: 7px;
  left: 7px;
}

button {
  position: relative;
  padding: 0 15px 0 28px;
  border: none;
  border-radius: 4px;
  background-color: $gray_blue_3;
  height: 30px;
  line-height: 30px;

  span {
    font-size: 13px;
    font-weight: 600;
    color: $true_white;
  }

  &:hover {
    background-color: $gray_blue_4;
  }

  .disabled {
    color: #bebebe;
  }
}
</style>
