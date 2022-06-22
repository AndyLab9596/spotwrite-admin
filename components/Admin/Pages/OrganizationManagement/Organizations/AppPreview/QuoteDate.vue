<template>
  <div class="item">
    <div class="item-year">{{ year }}</div>
    <div class="item-date">{{ month }}/{{ day }}</div>
    <img src="/icon/icon_nyusya.svg" class="icon" />
    <img src="/icon/dots.svg" class="dots" :class="{ hidden: isLast }" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';

export default Vue.extend({
  props: {
    date: {
      required: true,
      default: 0,
      type: Number,
    },
    isLast: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    year() {
      return dayjs.unix(this.date).year();
    },
    month() {
      return Number(dayjs.unix(this.date).format('M'))
        .toString()
        .padStart(2, '0');
    },
    day() {
      return dayjs
        .unix(this.date)
        .date()
        .toString()
        .padStart(2, '0');
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

.item-year {
  color: $gentle_bluish_purple;
  line-height: 1;
  margin-bottom: 5px;
}

.item-date {
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
