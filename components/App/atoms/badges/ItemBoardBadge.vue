<template>
  <div>
    <div class="badge" :style="{ backgroundColor: backgroundColor }">
      {{ name }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    name: {
      type: String,
      default: null,
    },
    backgroundColor: {
      type: String,
      default: `#7e8195`,
    },
  },
});
</script>

<style lang="scss" scoped>
.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  line-height: 1em;
  color: $true_white;
  border-radius: 2px;
  height: 17px;
  white-space: nowrap;
}
</style>
