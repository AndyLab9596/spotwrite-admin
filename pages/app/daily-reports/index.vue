<template>
  <div class="wrapper">
    <div>
      <sidebar
        :user-name="userName"
        :organization-name="organizationName"
        @select-main-group="selectMainGroup"
        @select-sub-group="selectSubGroup"
        @show-select-employees-modal="selectEmployeeModal = true"
        @show-select-organizations-modal="selectOrganizationModal = true"
      />
      <div class="container">
        <div class="inner-header">
          <date-selector
            :date="date"
            :end-date="endDate"
            @change="changeDate"
          />

          <base-button
            class="setting"
            inverse
            @click="$router.push('/daily-reports-settings')"
            >日報設定</base-button
          >
        </div>

        <select-tab
          :current-tab="currentTab"
          :submitted-count="submittedCount"
          :not-submitted-count="notSubmittedCount"
          @tab="changeCurrentTab"
        />

        <div v-if="!isLoading">
          <daily-report-card
            v-for="dailyReport in selectedTabDailyReports"
            :key="dailyReport.uuid"
            class="daily-report-card"
            :daily-report="dailyReport"
            link-to-detail-enabled
            @show-detail="showDetail(dailyReport.uuid)"
          />
        </div>

        <daily-report-detail-modal
          v-if="dailyReportDetailModal"
          :daily-report-uuid="dailyReportUuid"
          :daily-report-uuid-list="dailyReportUuidList"
          @close="dailyReportDetailModal = false"
        />

        <Modal v-if="selectEmployeeModal" @close="selectEmployeeModal = false">
          <SelectEmployee
            v-if="selectEmployeeModal"
            :items="[]"
            class="select-employee"
            @select="selectEmployee"
          />
        </Modal>

        <Modal
          v-if="selectOrganizationModal"
          @close="selectOrganizationModal = false"
        >
          <SelectOrganization
            v-if="selectOrganizationModal"
            :items="[]"
            class="select-employee"
            @select="selectOrganization"
          />
        </Modal>
      </div>
      <vue-loading
        v-if="isLoading"
        type="spin"
        color="#333"
        :size="{ width: '50px', height: '50px' }"
      ></vue-loading>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { fetchDailyReports } from '@/libs/api/app';
import DailyReportDetailModal from '@/components/App/organisms/daily-report-detail/DailyReportDetailModal.vue';
import DailyReportCard from '@/components/App/molecules/card/DailyReportCard.vue';
import SelectEmployee from '@/components/App/molecules/list/SelectEmployee.vue';
import SelectOrganization from '@/components/App/molecules/list/SelectOrganization.vue';
import Modal from '@/components/App/atoms/modals/Modal.vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import Sidebar from '@/components/App/organisms/daily-report/Sidebar.vue';
import DateSelector from '@/components/App/molecules/daily-report/DateSelector.vue';
import SelectTab from '@/components/App/organisms/daily-report/SelectTab.vue';
import dayjs from '@/libs/dayjs';
import { VueLoading } from 'vue-loading-template';

type Payload = {
  setting_uuid: string | null;
  read_type: string | null;
  from: number;
  to: number;
  free_word: string | null;
};

export default Vue.extend({
  layout: 'app/default',
  components: {
    DailyReportDetailModal,
    DailyReportCard,
    SelectEmployee,
    SelectOrganization,
    Modal,
    BaseButton,
    Sidebar,
    DateSelector,
    VueLoading,
    SelectTab,
  },
  data() {
    return {
      date: dayjs()
        .startOf('date')
        .unix(),
      endDate: dayjs()
        .endOf('date')
        .unix(),
      isShowCalender: false,
      selectEmployeeModal: false,
      selectOrganizationModal: false,
      selectedWeeks: [] as string[],
      dailyReportUuid: '',
      dailyReportDetailModal: false,
      dailyReports: [] as AppApiResponse.DailyReport[],
      notSubmittedDailyReports: [] as AppApiResponse.NotSubmittedDailyReport[],
      currentTab: 1,
      isLoading: false as boolean,
      isDailyReportsLoading: false as boolean,
      userName: null as string | null,
      organizationName: null as string | null,
      payload: {
        setting_uuid: null,
        read_type: null,
        from: dayjs()
          .startOf('day')
          .unix(),
        to: dayjs()
          .endOf('day')
          .unix(),
        free_word: null,
      } as Payload,
    };
  },
  computed: {
    dailyReportUuidList(): string[] {
      return this.dailyReports.map((d: { uuid: string }) => d.uuid);
    },
    submittedCount(): number {
      return this.dailyReports.length;
    },
    notSubmittedCount(): number {
      return this.notSubmittedDailyReports.length;
    },
    selectedTabDailyReports():
      | AppApiResponse.DailyReport[]
      | AppApiResponse.NotSubmittedDailyReport[] {
      if (this.currentTab === 1) {
        return this.dailyReports;
      }
      return this.notSubmittedDailyReports;
    },
  },
  async created() {
    this.fetchDailyReports();
  },
  methods: {
    clearDailyReports() {
      this.dailyReports = [];
      this.notSubmittedDailyReports = [];
    },
    changeDate(period: { start: number; end: number }) {
      this.date = period.start;
      this.endDate = period.end;
      this.payload.from = period.start;
      this.payload.to = period.end;
      this.clearDailyReports();
      this.fetchDailyReports();
    },
    changeCurrentTab(key: number) {
      this.currentTab = key;
    },
    showDetail(uuid: string) {
      this.dailyReportUuid = uuid;
      this.dailyReportDetailModal = true;
    },
    selectEmployee(item: AppApiResponse.Employee) {
      this.payload.free_word = item.name;
      this.userName = item.name;
      this.organizationName = null;
      this.fetchDailyReports();
      this.selectEmployeeModal = false;
    },
    selectOrganization(item: AppApiResponse.Organization) {
      this.payload.free_word = item.name;
      this.organizationName = item.name;
      this.userName = null;
      this.fetchDailyReports();
      this.selectOrganizationModal = false;
    },
    setReadType(type: string, uuid?: string) {
      this.payload.read_type = type;
      this.payload.setting_uuid = uuid || '';
    },
    selectMainGroup(value: string) {
      this.clearDailyReports();
      if (value === 'allmain') {
        this.setReadType('main');
        this.fetchDailyReports();
        return;
      }
      this.setReadType('main', value);
      this.fetchDailyReports();
    },
    selectSubGroup(value: string) {
      this.clearDailyReports();
      if (value === 'allsub') {
        this.setReadType('sub');
        this.fetchDailyReports();
        return;
      }
      this.setReadType('sub', value);
      this.fetchDailyReports();
    },
    async fetchDailyReports() {
      this.isLoading = true;
      const { data } = await fetchDailyReports(this.payload);
      this.dailyReports = data.daily_reports;
      this.notSubmittedDailyReports = data.not_submitted_daily_reports;
      this.isLoading = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  min-width: 745px;
}

.container {
  *[role='button'] {
    cursor: pointer;
  }

  min-width: 800px;
  max-width: 800px;
  width: 800px;
  background-color: $true_white;
  margin: 40px auto 120px auto;
  box-shadow: 0 3px 6px $box-shadow;
  border-radius: 4px;
  z-index: 0;
}

.inner-header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 34px;

  .setting {
    position: absolute;
    top: 16px;
    right: 16px;
  }
}

.daily-report-card {
  border-top: solid 1px $ruled_line;
  padding: 24px 40px;
}

.select-employee {
  width: 100%;
  max-height: 500px;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: #7e8195 white;
}

.select-employee::-webkit-scrollbar {
  width: 4px;
  height: 0;
}

.select-employee::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #7e8195;
}
</style>
