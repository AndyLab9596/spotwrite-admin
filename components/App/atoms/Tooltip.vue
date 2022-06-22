<template>
  <div class="container">
    <div v-show="visible" class="tooltip">
      <slot></slot>
    </div>
    <div class="content" @mouseenter="showTooltip" @mouseleave="hideTooltip">
      <slot name="activator"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    visible: false as boolean,
  }),
  methods: {
    showTooltip() {
      this.visible = true;
    },
    hideTooltip() {
      this.visible = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  position: relative;
}

.tooltip {
  position: absolute;
  bottom: 120%;
  right: 50%;
  transform: translateX(50%);
  background-color: #000;
  border: 1px solid #000;
  border-radius: 4px;
  padding: 6px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  white-space: nowrap;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #000 transparent transparent transparent;
}
</style>
