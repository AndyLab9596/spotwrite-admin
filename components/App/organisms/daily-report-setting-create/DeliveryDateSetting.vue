<template>
  <div>
    <title-item :title="title" />
    <div class="delivery-date-setting-wrapper">
      <div class="delivery-date-setting-top">
        <notification-frequency
          :frequency="frequency"
          class="notification-frequency"
          @change="changeFrequency"
        />
        <week-select
          v-if="frequency === 'weekly'"
          :selected-weeks="input.frequency"
          :interval-days="input.interval_days"
          class="week-select"
          @removeWeek="removeWeek"
          @addWeek="addWeek"
          @changeIntervalDay="changeIntervalDay"
        />
      </div>
      <div class="delivery-date-setting-bottom">
        <date-period
          :start-at="input.start_date"
          :end-at="input.end_date"
          class="date-period"
          @changeStartAt="changePeriodStartAt"
          @changeEndAt="changePeriodEndAt"
        />
        <deadline-time
          :time="input.expire_time"
          class="deadline-time"
          @change="changeDeadlineTime"
        />
        <alert-settings
          :is-alert="input.is_alert_required"
          @change="changeAlertSettings"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import NotificationFrequency from '@/components/App/organisms/daily-report-setting-create/delivery-date-setting/NotificationFrequency.vue';
import WeekSelect from '@/components/App/organisms/daily-report-setting-create/delivery-date-setting/WeekSelect.vue';
import DeadlineTime from '@/components/App/organisms/daily-report-setting-create/delivery-date-setting/DeadlineTime.vue';
import DatePeriod from '@/components/App/organisms/daily-report-setting-create/delivery-date-setting/DatePeriod.vue';
import AlertSettings from '@/components/App/organisms/daily-report-setting-create/delivery-date-setting/AlertSettings.vue';
import TitleItem from '@/components/App/organisms/daily-report-setting-create/common-items/TitleItem.vue';

export default Vue.extend({
  layout: 'app/default',
  components: {
    NotificationFrequency,
    WeekSelect,
    DeadlineTime,
    DatePeriod,
    AlertSettings,
    TitleItem,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    input: {
      type: Object as PropType<AppApiRequest.DailyReportSettingDetail>,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
  },
  methods: {
    changeFrequency(value: string) {
      this.$emit('changeFrequency', value);
    },
    removeWeek(value: string) {
      this.$emit('removeWeek', value);
    },
    addWeek(value: string) {
      this.$emit('addWeek', value);
    },
    changeDeadlineTime(value: string) {
      this.$emit('changeDeadlineTime', value);
    },
    changePeriodStartAt(value: number) {
      this.$emit('changePeriodStartAt', value);
    },
    changePeriodEndAt(value: number) {
      this.$emit('changePeriodEndAt', value);
    },
    changeAlertSettings(value: boolean) {
      this.$emit('changeAlertSettings', value);
    },
    changeIntervalDay(value: number) {
      this.$emit('changeIntervalDay', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.delivery-date-setting-wrapper {
  padding: 24px 40px 40px;

  .delivery-date-setting-top {
    margin: 0 0 33px 0;
    border-bottom: 1px solid $ruled_line;

    .notification-frequency {
      margin: 0 0 20px 0;
    }

    .week-select {
      padding: 0 0 16px 30px;
    }
  }

  .delivery-date-setting-bottom {
    display: flex;
    height: 88px;

    .date-period,
    .deadline-time {
      margin: 0 30px 0 0;
    }
  }
}
</style>
