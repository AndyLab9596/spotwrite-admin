<template>
  <div class="daily-report">
    <div class="title">{{ dailyReport.name }}</div>
    <div class="content">
      {{ dailyReport.content }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    dailyReport: {
      type: Object as PropType<AppApiResponse.DailyReportItem>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.daily-report {
  .title {
    font-size: 15px;
    font-weight: 600;
    padding: 25px 16px;
    color: $gray_blue_4;
    background-color: $white_1;
  }

  .content {
    font-size: 15px;
    padding: 23px 40px 40px 40px;
    word-break: break-all;
  }
}
</style>
