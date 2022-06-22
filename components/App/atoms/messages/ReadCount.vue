<template>
  <div class="message">既読{{ count }}</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    count: {
      type: Number,
      required: false,
      default: 0,
    },
  },
});
</script>
<style lang="scss" scoped>
.message {
  padding: 0 4px;
  white-space: nowrap;
  font-size: 11px;
  color: $sub_color;
  align-self: end;
  margin-bottom: 14px;
}
</style>
