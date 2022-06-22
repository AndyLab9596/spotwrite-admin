<template>
  <!-- eslint-disable prettier/prettier -->
  <span>
    <svg xmlns="http://www.w3.org/2000/svg" :width="outerSize" :height="outerSize" :viewBox="`0 0 ${outerSize} ${outerSize}`">
      <path d="M106.006,301.622" transform="translate(-102.538 -293.668)" fill="none" stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1"/>
      <g transform="translate(-102.554 -293.668)">
        <circle cx="8" cy="8" r="8" transform="translate(102.554 293.668)" :fill="backgroundColor"/>
        <path d="M114.042,299.305l-4.726,4.726-2.4-2.4" fill="none" stroke="#fff" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1"/>
      </g>
    </svg>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 8,
    },
  },
  computed: {
    outerSize(): number {
      return this.size + 8;
    },
    backgroundColor(): string {
      return this.checked ? '#f09c9c' : '#d4e5ed';
    },
  },
});
</script>
