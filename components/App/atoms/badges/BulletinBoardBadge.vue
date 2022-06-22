<template>
  <div @click="onClick">
    <div class="badge" :style="{ backgroundColor: backgroundColor }">
      <div class="status" :style="{ backgroundColor: color }"></div>
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
    color: {
      type: String,
      default: null,
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
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
  cursor: pointer;
}

.status {
  width: 7px;
  height: 7px;
  border-radius: 2px;
  margin-right: 5px;
}
</style>
