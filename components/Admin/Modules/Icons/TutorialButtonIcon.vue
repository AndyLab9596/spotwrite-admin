<template>
  <img src="/icon/tutorial.svg" @click="showTutorial" />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    url: {
      type: String,
      default: 'none',
    },
  },
  methods: {
    showTutorial(): void {
      window.open(this.$props.url, 'Tutorial', 'fullscreen=yes');
    },
  },
});
</script>
