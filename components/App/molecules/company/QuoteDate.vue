<template>
  <div class="item-date">
    <div class="item-date__year">{{ date | yearFilter }}</div>
    <div class="item-date__date">{{ date | dateFilter }}</div>
    <img src="/app/icon/info-nyusya_gray.svg" class="item-building" />
    <img
      src="/app/icon/dots.svg"
      class="item-dots"
      :class="{ hidden: isLast }"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';

export default Vue.extend({
  filters: {
    yearFilter(unixTime: number) {
      if (unixTime) {
        return dayjs.unix(unixTime).format('YYYY');
      }
      return null;
    },
    dateFilter(unixTime: number) {
      if (unixTime) {
        return dayjs.unix(unixTime).format('MM/DD');
      }
      return null;
    },
  },
  props: {
    date: {
      required: true,
      default: null,
      type: Number,
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
  font-size: 13px;
  margin: 0 14px 0 0;
}

.item-date__year {
  color: $gentle_bluish_purple;
  line-height: 1;
}

.item-date__date {
  color: $link_color;
  line-height: 1;
}

.item-building {
  margin: 4px 0;
  width: 28px;
  height: auto;
}

.item-dots {
  height: 23px;
}

.hidden {
  display: none;
}
</style>
