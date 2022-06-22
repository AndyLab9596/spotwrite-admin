<template>
  <div class="container">
    <daily-report-settings-head />
    <template v-if="!isLoading">
      <daily-report-settings-item
        v-for="item in dailyReportSettings"
        :key="item.uuid"
        :item="item"
      />
    </template>
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
import DailyReportSettingsHead from '@/components/App/organisms/daily-report-settings/DailyReportSettingsHead.vue';
import DailyReportSettingsItem from '@/components/App/organisms/daily-report-settings/DailyReportSettingsItem.vue';
import { fetchDailyReportSettings } from '@/libs/api/app';
import { VueLoading } from 'vue-loading-template';

export default Vue.extend({
  layout: 'app/default',
  components: {
    DailyReportSettingsHead,
    DailyReportSettingsItem,
    VueLoading,
  },
  data: () => ({
    dailyReportSettings: [] as AppApiResponse.DailyReportRequired[],
    isLoading: false as boolean,
  }),
  created() {
    this.fetchDailyReportSettings();
  },
  methods: {
    async fetchDailyReportSettings() {
      this.isLoading = true;
      try {
        const { data } = await fetchDailyReportSettings();
        this.dailyReportSettings = data.daily_report_settings;
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  border-radius: 4px;
  box-shadow: 0 1px 2px $box-shadow;
  padding: 0 0 171px 0;
  margin: 40px auto 0;
}
</style>
