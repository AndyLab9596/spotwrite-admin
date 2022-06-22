<template>
  <div class="item-date">
    <div class="item-date__date">{{ time }}</div>
    <img src="/app/icon/Icon-time.svg" class="item-time" />
    <img src="/icon/dots.svg" class="item-dots" :class="{ hidden: isLast }" />
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
.item-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
  margin: 0 10px 0 0;
}

.item-date__year {
  color: $gentle_bluish_purple;
  line-height: 1;
}

.item-date__date {
  color: $link_color;
  line-height: 1;
}

.item-time {
  margin: 4px 0;
  width: 20px;
  height: auto;
}

.item-dots {
  height: 23px;
}

.hidden {
  display: none;
}
</style>
