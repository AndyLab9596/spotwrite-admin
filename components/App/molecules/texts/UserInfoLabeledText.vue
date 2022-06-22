<template>
  <div class="user-info-labeled-text-container">
    <p class="label">{{ label }}</p>
    <p class="text">
      <slot></slot>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    label: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.user-info-labeled-text-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 16px;
  width: 33%;
}

.label {
  background-color: #7e8195;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  color: #fff;
  white-space: nowrap;
}

.text {
  margin-left: 10px;
  padding: 2px 8px;
  font-size: 12px;
  color: #2e303e;
  white-space: nowrap;
  width: 70%;
}
</style>
