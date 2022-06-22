<template>
  <div class="container">
    <div v-if="!isLoading" class="contents">
      <setting-title :title="input.title" @title="changeTitle" />
      <target-member-select
        title="対象メンバー選択"
        :employees="employees"
        :target-members="input.target_user_uuids"
        @select="selectTargetMember"
      />
      <read-member-select
        title="閲覧メインのメンバー選択"
        sub-title="閲覧メインメンバー"
        :employees="employees"
        :read-members="input.main_read_user_uuids"
        @select="selectReadMainMember"
      />
      <read-member-select
        title="閲覧サブのメンバー選択"
        sub-title="閲覧サブメンバー"
        :employees="employees"
        :read-members="input.sub_read_user_uuids"
        @select="selectReadSubMember"
      />
      <delivery-date-setting
        title="納期設定"
        :input="input"
        :frequency="frequency"
        :frequency-options="frequencyOptions"
        @changeFrequency="changeFrequency"
        @removeWeek="removeWeek"
        @addWeek="addWeek"
        @changeDeadlineTime="changeDeadlineTime"
        @changePeriodStartAt="changePeriodStartAt"
        @changePeriodEndAt="changePeriodEndAt"
        @changeAlertSettings="changeAlertSettings"
        @changeIntervalCount="changeIntervalCount"
      />
      <format-item
        title="フォーマット"
        :formats="formats"
        :selected-format-uuid="input.format_uuid"
        @select="selectFormat"
      />
      <button-menu
        :post-validation="hasPostValidationError"
        @cancel="clickCancelButton"
        @post="clickPostButton"
      />
    </div>
    <vue-loading
      v-if="isLoading"
      type="spin"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    ></vue-loading>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ButtonMenu from '@/components/App/organisms/daily-report-setting-create/ButtounMenu.vue';
import SettingTitle from '@/components/App/organisms/daily-report-setting-create/SettingTitle.vue';
import TargetMemberSelect from '@/components/App/organisms/daily-report-setting-create/TargetMemberSelect.vue';
import ReadMemberSelect from '@/components/App/organisms/daily-report-setting-create/ReadMemberSelect.vue';
import DeliveryDateSetting from '@/components/App/organisms/daily-report-setting-create/DeliveryDateSetting.vue';
import FormatItem from '@/components/App/organisms/daily-report-setting-create/FormatItem.vue';
import dayjs from '@/libs/dayjs';
import { VueLoading } from 'vue-loading-template';
import {
  postDailyReportSettings,
  employees,
  fetchDailyReportFormats,
} from '@/libs/api/app';

export default Vue.extend({
  layout: 'app/default',
  components: {
    ButtonMenu,
    SettingTitle,
    TargetMemberSelect,
    ReadMemberSelect,
    DeliveryDateSetting,
    FormatItem,
    VueLoading,
  },
  data: () => ({
    input: {} as AppApiRequest.DailyReportSettingDetail,
    employees: [] as AppApiResponse.Employee[],
    frequencyOptions: [
      { name: '毎日', value: 'everyday' },
      { name: '毎週', value: 'weekly' },
    ],
    frequency: 'weekly' as string,
    formats: [] as AppApiResponse.DailyReportFormat[],
    isLoading: false as boolean,
  }),
  computed: {
    hasPostValidationError(): boolean {
      // タイトル未入力 & 頻度選択されていない & フォーマットが設定されていない
      return (
        this.input.title === '' ||
        this.input.frequency.length === 0 ||
        this.input.format_uuid === ''
      );
    },
    hasInput(): boolean {
      return Object.keys(this.input).length > 0;
    },
  },
  async created() {
    this.isLoading = true;
    await this.fetchDailyReportFormats();
    this.setInput();
    this.fetchEmployees(10000);
    this.isLoading = false;
  },
  methods: {
    setInput() {
      this.input = {
        title: '',
        target_user_uuids: [] as string[],
        main_read_user_uuids: [] as string[],
        sub_read_user_uuids: [] as string[],
        expire_time: '00:00:00',
        start_date: dayjs().unix(),
        end_date: dayjs().unix(),
        frequency: ['sunday'] as string[],
        interval_days: null,
        is_alert_required: true,
        format_uuid: this.formats[0].uuid,
      };
    },
    selectTargetMember(uuids: string[]) {
      this.input.target_user_uuids = uuids;
    },
    selectReadMainMember(uuids: string[]) {
      this.input.main_read_user_uuids = uuids;
    },
    selectReadSubMember(uuids: string[]) {
      this.input.sub_read_user_uuids = uuids;
    },
    changeFrequency(value: string) {
      this.frequency = value;
      if (this.frequency === 'everyday') {
        this.input.frequency = [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
        ];
      }
    },
    changeDeadlineTime(value: string) {
      this.input.expire_time = value;
    },
    changePeriodStartAt(value: number) {
      this.input.start_date = value;
    },
    changePeriodEndAt(value: number) {
      this.input.end_date = value;
    },
    changeAlertSettings(value: boolean) {
      this.input.is_alert_required = value;
    },
    clickCancelButton() {
      this.$router.push(`/daily-reports-settings/`);
    },
    removeWeek(key: string) {
      this.input.frequency = this.input.frequency.filter(
        (selectedWeek: string) => selectedWeek !== key
      );
    },
    addWeek(key: string) {
      this.input.frequency.push(key);
      this.input.frequency = Array.from(new Set(this.input.frequency));
      if (this.input.frequency.length === 7) {
        this.frequency = 'everyday';
      }
    },
    changeIntervalCount(value: number) {
      this.input.interval_days = value;
    },
    async clickPostButton() {
      await this.postDailyReportSettings();
      this.$router.push(`/daily-reports-settings/`);
    },
    changeTitle(value: string) {
      this.input.title = value;
    },
    selectFormat(uuid: string) {
      this.input.format_uuid = uuid;
    },
    async postDailyReportSettings() {
      try {
        await postDailyReportSettings(this.input);
      } catch (e) {
        console.log(e);
      }
    },
    async fetchEmployees(limit: number): Promise<void> {
      try {
        const { data } = await employees({ limit });
        this.employees = data.users;
      } catch (e) {
        console.log(e);
      }
    },
    async fetchDailyReportFormats(): Promise<void> {
      try {
        const { data } = await fetchDailyReportFormats();
        this.formats = data.daily_report_formats;
      } catch (e) {
        console.log(e);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.contents {
  border-radius: 4px;
  box-shadow: 0 1px 2px $box-shadow;
  margin: 37px auto 123px;
}
</style>
