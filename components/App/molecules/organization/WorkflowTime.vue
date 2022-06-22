<template>
  <div class="workflow-time-container">
    <div class="workflow-date">{{ time }}</div>
    <img src="/app/icon/Icon-time.svg" class="workflow-clock" />
    <div class="workflow-dots" :class="{ hidden: isLast }"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    time: {
      required: true,
      default: null,
      type: String,
    },
    isLast: {
      default: false,
      type: Boolean,
    },
  },
});
</script>

<style lang="scss" scoped>
.workflow-time-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
  margin: 0 14px 0 0;
  height: 100%;
}

.workflow-date {
  color: $link_color;
  line-height: 1;
}

.workflow-clock {
  margin: 9px 0;
  width: 16px;
  height: auto;
}

.workflow-dots {
  width: 2px;
  height: inherit;
  background-repeat: repeat-y;
  background-image: url('/app/icon/dots.svg');
  margin: 0 0 20px;
}

.hidden {
  display: none;
}
</style>
