<template>
  <div class="Interview-head-line">
    <img src="/app/icon/Icon-left-slash.svg" class="left-slash" />
    <p class="title-text" :class="pattern">{{ title }}</p>
    <img src="/app/icon/Icon-right-slash.svg" class="right-slash" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
    },
    pattern: {
      type: String,
      required: false,
      default: '',
    },
  },
});
</script>

<style lang="scss" scoped>
.Interview-head-line {
  display: flex;
  align-items: flex-end;
  justify-content: center;

  .title-text {
    font-size: 18px;
    font-weight: 600;
    color: $main_color;
    line-height: 1.5em;

    &.pattern1 {
      color: #008b7f;
    }

    &.pattern2 {
      color: #e57373;
    }

    &.pattern3 {
      color: #f78f28;
    }
  }

  .left-slash {
    width: 15px;
    margin: 0 24px 0 0;
  }

  .right-slash {
    width: 15px;
    margin: 0 0 0 19px;
  }
}
</style>
