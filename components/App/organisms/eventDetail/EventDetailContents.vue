<template>
  <div class="post-top-wrapper">
    <img v-if="isNew" class="header-new" src="/app/icon/icon-new.svg" alt="" />
    <p class="date-text">{{ formattedDate }} {{ formattedTime }}</p>
    <p class="title-text">{{ title }}</p>
    <p class="type-text">{{ contentType }}</p>
    <p class="contents-text">{{ content }}</p>
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
    content: {
      type: String,
      required: true,
    },
    startAt: {
      type: Number,
      required: true,
    },
    endAt: {
      type: Number,
      required: true,
    },
  },
  computed: {
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
    formattedDate(): string {
      return dayjs.unix(this.startAt).format('YYYY/M/D（ddd）');
    },
    formattedTime(): string {
      const startAt = dayjs.unix(this.startAt).format('hh:mm');
      const endAt = dayjs.unix(this.endAt).format('hh:mm');

      return `${startAt}〜${endAt}開催`;
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
  position: relative;
  width: 100%;
  margin: 0 0 32px 0;
}

.title-text {
  font-size: 28px;
  color: #2e303e;
  font-weight: 600;
  line-height: 1.4em;
  margin: 0 0 15px 0;
}

.date-text {
  line-height: 1em;
  font-size: 15px;
  font-weight: 300;
  color: $link_color;
  margin: 0 0 14px 0;
}

.type-text {
  line-height: 1em;
  font-size: 11px;
  font-weight: 300;
  color: $sub_color;
  margin: 0 0 15px 0;
}

.contents-text {
  color: $main_color;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.header-new {
  position: absolute;
  top: -32px;
  right: 3px;
}
</style>
