<template>
  <!-- eslint-disable prettier/prettier -->
  <div @click="$emit('click')">
    <svg id="Icon_search" data-name="Icon/search" xmlns="http://www.w3.org/2000/svg" width="16.707" height="16.707" viewBox="0 0 16.707 16.707">
      <g id="楕円形_223" data-name="楕円形 223" fill="none" :stroke="color" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1">
        <circle cx="7.83" cy="7.83" r="7.83" stroke="none"/>
        <circle cx="7.83" cy="7.83" r="7.33" fill="none"/>
      </g>
      <line id="線_389" data-name="線 389" x2="2.895" y2="2.895" transform="translate(13.104 13.104)" fill="none" :stroke="color" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1"/>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    color: {
      type: String,
      default: '#c3c4ce',
    },
  },
});
</script>
