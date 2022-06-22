<template>
  <div class="item">
    <div class="item-time">{{ time }}</div>
    <img src="/app/icon/Icon-time.svg" class="icon" />
    <img src="/icon/dots.svg" class="dots" :class="{ hidden: isLast }" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    time: {
      required: true,
      default: '',
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
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
  margin: 0 10px 0 0;
}

.item-time {
  color: $link_color;
  line-height: 1;
}

.icon {
  margin: 4px 0;
  width: 20px;
  height: auto;
}

.dots {
  height: 23px;
}

.hidden {
  display: none;
}
</style>
