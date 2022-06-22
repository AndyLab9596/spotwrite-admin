<template>
  <button type="button" class="date-select-button" @click="onClick">
    日付：{{ selectPeriodLabel }}
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    selectPeriodLabel: {
      type: String,
      required: true,
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
.date-select-button {
  font-size: 13px;
  font-weight: bold;
  color: $true_white;
  background-color: $gray_blue_3;
  line-height: 1;
  height: 30px;
  padding: 0 12px 0 34px;
  border-radius: 4px;
  border: none;
  position: relative;

  &::before {
    position: absolute;
    top: 7px;
    left: 7px;
    content: '';
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url('/icon/icon_pen@2x.png') no-repeat;
    background-size: contain;
  }

  &:hover {
    background-color: $gray_blue_4;
  }
}
</style>
