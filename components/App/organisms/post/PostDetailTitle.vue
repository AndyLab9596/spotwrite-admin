<template>
  <div class="post-top-wrapper">
    <div class="date-wrapper">
      <div class="date-container">
        <div class="header-date-month">{{ formattedMonth }}</div>
        <div
          class="header-date-slash"
          :style="{
            width: `${Math.sqrt(2) * 55}px`,
            left: `${-(Math.sqrt(2) * 55 - 55) / 2}px`,
          }"
        ></div>
        <p class="header-date-day">{{ formattedDate }}</p>
      </div>
      <div class="week-wrapper">
        <p class="header-week-day">{{ formattedWeek }}</p>
      </div>
    </div>
    <div class="header-container">
      <div class="title-wrapper">
        <p class="title">{{ title }}</p>
        <p class="header-title-text">{{ contentType }}</p>
      </div>
    </div>
    <img v-if="isNew" class="header-new" src="/app/icon/icon-new.svg" alt="" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';

export default Vue.extend({
  props: {
    date: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    formattedMonth(): string {
      return dayjs.unix(this.date).format('MM');
    },
    formattedDate(): string {
      return dayjs.unix(this.date).format('DD');
    },
    formattedWeek(): string {
      return dayjs.unix(this.date).format('ddd');
    },
    contentType(): string {
      switch (this.type) {
        case 'my-episode':
          return 'マイエピソード';
        case 'internal-communication':
          return '社内連絡';
        case 'department-news':
          return '組織ニュース';
        case 'community-news':
          return 'コミュニティニュース';
        default:
          return '';
      }
    },
    isNew(): boolean {
      const newCondition = dayjs().subtract(3, 'day');
      const date = dayjs.unix(this.date);
      return date.isAfter(newCondition);
    },
  },
});
</script>

<style lang="scss" scoped>
.post-top-wrapper {
  display: flex;
  width: 100%;
  border-radius: 4px;
  position: relative;
}

.header-date-month {
  font-family: 'Lato', sans-serif;
  font-size: 24px;
  line-height: 1em;
  font-weight: 400;
  width: 55px;
  margin-bottom: 6px;
}

.header-date-slash {
  position: absolute;
  transform: rotate(-45deg);
  border-bottom: solid 1px #50536e;
}

.header-container {
  display: flex;
  align-items: center;
  height: fit-content;
  width: 100%;
}

.header-date-day {
  font-family: 'Lato', sans-serif;
  font-size: 28px;
  line-height: 1em;
  margin: 7px 12px 0 29px;
  color: #2e303e;
  width: 55px;
  font-weight: 400;
}

.header-title-text {
  line-height: 1em;
  font-size: 11px;
  font-weight: 300;
  color: $sub_color;
}

.header-more-button {
  margin-left: auto;
}

.header-new {
  position: absolute;
  top: -32px;
  right: 3px;
}

.header-week-day {
  font-size: 10px;
  line-height: 1em;
  color: #2e303e;
  font-weight: 300;
  margin-top: 6px;
}

.title {
  font-size: 28px;
  color: #2e303e;
  font-weight: 600;
  line-height: 1.4em;
  margin: 0 0 21px 0;
}

.week-wrapper {
  width: 55px;
  text-align: center;
}

.date-wrapper {
  margin: 0 35px 0 0;
}

.date-container {
  height: 55px;
  width: 55px;
  margin: 0 0 8px 0;
}
</style>
