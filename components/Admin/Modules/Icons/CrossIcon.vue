<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="outerSize"
    :height="outerSize"
    :viewBox="`0 0 ${outerSize} ${outerSize}`"
  >
    <g id="button-close" transform="translate(-827 -363)">
      <rect
        :width="outerSize"
        :height="outerSize"
        transform="translate(827 363)"
        :fill="backgroundColor"
      />
      <g transform="translate(833 369)">
        <line
          :x2="size"
          :y2="size"
          fill="none"
          :stroke="color"
          stroke-width="1"
        />
        <line
          :x2="size"
          :y2="size"
          :transform="`translate(${size}) rotate(90)`"
          fill="none"
          :stroke="color"
          stroke-width="1"
        />
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    size: {
      type: Number,
      default: 16,
    },
    backgroundColor: {
      type: String,
      default: 'none',
    },
    color: {
      type: String,
      default: '#7e8195',
    },
  },
  computed: {
    outerSize(): number {
      return this.size + 12;
    },
  },
});
</script>
