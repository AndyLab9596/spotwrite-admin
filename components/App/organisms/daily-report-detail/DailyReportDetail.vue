<template>
  <div>
    <div class="content-header">
      <div class="title">日報詳細</div>
      <daily-report-card :daily-report="dailyReport" :preview="preview" />
      <daily-report-achievement-level
        v-if="!achievementRateDisabled"
        :value="dailyReport.achievement_rate"
        label="達成度"
        class="daily-report-achievement-level"
        disabled
      />
    </div>

    <div class="daily-report-contents">
      <report
        v-for="item in dailyReport.items"
        :key="item.uuid"
        :daily-report="item"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DailyReportAchievementLevel from '@/components/App/organisms/daily-report-create/Items/DailyReportAchievementLevel.vue';
import Report from '@/components/App/molecules/daily-report/Report.vue';
import DailyReportCard from '@/components/App/molecules/card/DailyReportCard.vue';

export default Vue.extend({
  components: {
    DailyReportAchievementLevel,
    Report,
    DailyReportCard,
  },
  props: {
    dailyReport: {
      type: Object as PropType<AppApiResponse.DailyReportDetail>,
      required: true,
    },
    achievementRateDisabled: {
      type: Boolean,
      default: false,
    },
    preview: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.content-header {
  padding: 40px 40px 0;

  .title {
    color: $dark_blue;
    font-size: 15px;
    font-weight: bold;
    font-family: 'Lato', sans-serif;
  }
}

.daily-report-contents {
  margin-top: 32px;
}

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
  }
}

.daily-report-card {
  margin-top: 24px;
}

.daily-report-achievement-level {
  margin-top: 24px;
}

.loading {
  display: flex;
  align-content: center;
  height: 800px;
}
</style>
