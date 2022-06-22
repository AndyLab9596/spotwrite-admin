<template>
  <div v-if="labelColor" class="status-info-labeled-text-container">
    <div class="badge" :style="{ backgroundColor: backgroundColor }">
      <div class="status" :style="{ backgroundColor: labelColor }"></div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    labelColor: {
      type: String,
      default: '#7e8195',
    },
    backgroundColor: {
      type: String,
      default: null,
    },
  },
});
</script>

<style lang="scss" scoped>
.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  line-height: 1em;
  border-radius: 2px;
  height: 17px;
  white-space: nowrap;
  padding-right: 4px;
  padding-left: 4px;
  padding-bottom: 1px;
}

.status {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  margin-right: 5px;
}
</style>
