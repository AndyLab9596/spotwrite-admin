<template>
  <div class="month">
    <span>{{ month }}月</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    month: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
span {
  color: #2e303e;
  font-weight: 600;
  font-size: 15px;
  margin-right: 8px;
  margin-left: 16px;
}

.month {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  width: 100%;
  height: 60px;
  box-shadow: 0 1px 4px rgba(220, 229, 239, 1);
  margin-bottom: 16px;
}
</style>
