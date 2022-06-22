<template>
  <div class="daily-report-settings-item-wrapper">
    <daily-report-settings-item-title
      :title="item.title"
      :created-at="item.created_at"
      :uuid="item.uuid"
    />
    <daily-report-settings-item-content
      left-text="対象メンバー"
      :right-text="item.target_user_count + ' 名'"
    />
    <daily-report-settings-item-content
      left-text="閲覧メインのメンバー"
      :right-text="item.main_read_user_count + ' 名'"
    />
    <daily-report-settings-item-content
      left-text="閲覧サブのメンバー"
      :right-text="item.sub_read_user_count + ' 名'"
    />
    <daily-report-settings-item-content
      left-text="条件設定"
      :right-text="formatConditions"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DailyReportSettingsItemContent from '@/components/App/organisms/daily-report-settings/DailyReportSettingsItemContent.vue';
import DailyReportSettingsItemTitle from '@/components/App/organisms/daily-report-settings/DailyReportSettingsItemTitle.vue';
import dayjs from '@/libs/dayjs';

export default Vue.extend({
  components: {
    DailyReportSettingsItemContent,
    DailyReportSettingsItemTitle,
  },
  props: {
    item: {
      type: Object as PropType<AppApiResponse.DailyReportRequired>,
      required: true,
    },
  },
  computed: {
    formatConditions(): string {
      return `${this.formatFrequencyCount},${this.formatSubmissionPeriod},${this.formatExpireAt},${this.isAlert}`;
    },
    formatFrequencyCount(): string {
      if (this.item.frequency.length === 7) return '毎日';

      return `週${String(this.item.frequency.length)}回`;
    },
    formatSubmissionPeriod(): string {
      return `${dayjs.unix(this.item.start_date).format('YYYY/MM/DD')}
      〜${dayjs.unix(this.item.end_date).format('YYYY/MM/DD')}まで`;
    },
    formatExpireAt(): string {
      if (this.item.expire_time != null) {
        const time = this.item.expire_time.split(':');
        const [hour, minute] = time;
        return `${hour}:${minute}まで`;
      }
      return '';
    },
    isAlert(): string {
      return this.item.is_alert_required ? 'アラート有り' : 'アラート無し';
    },
  },
});
</script>

<style lang="scss" scoped>
.daily-report-settings-item-wrapper {
  padding: 0 0 40px 0;
}
</style>
