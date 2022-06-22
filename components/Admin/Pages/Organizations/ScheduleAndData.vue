<template>
  <div class="schedule-and-data">
    <form class="form" @submit.prevent="onSubmit">
      <div class="schedule-top">
        <h2 class="title">仕事の流れ</h2>
      </div>
      <!-- データの構造によってかなり変わりそう -->
      <div class="schedule-contents">
        <template v-for="(inputWorkflow, index) in inputWorkflows">
          <schedule-accordion
            :key="inputWorkflow.uuid"
            :workflow-number="index + 1"
            :input-workflow="inputWorkflow"
            @input="onInputWorkflows(inputWorkflow.uuid, $event)"
          />
        </template>
      </div>
      <h2 class="title statistics-top-title">統計データ</h2>
      <div class="statistics">
        <company-data
          :sections="sections"
          :is-loading="isLoadingCompanyData"
          :organization-data="companyData"
          :config-status="configStatus"
          @changeStatus="changeStatus"
        />
      </div>
      <base-button
        type="submit"
        class="submit-button"
        size="large"
        @click="onSubmit"
        >保存する</base-button
      >
    </form>
    <success-message v-if="successModal" @close="toggleSuccessModal">
      入力された情報が保存されました。
    </success-message>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import {
  updateWorkFlows,
  fetchOrganizationDataConfig,
  updateOrganizationDataConfig,
} from '@/libs/api';
import { SuccessMessage } from '@/components/Admin/Modules/Modal';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import CompanyData from '@/components/Admin/Pages/Organizations/Company/CompanyData.vue';
import ScheduleAccordion from './ScheduleAccordion.vue';

export default Vue.extend({
  components: {
    ScheduleAccordion,
    SuccessMessage,
    BaseButton,
    CompanyData,
  },
  props: {
    organizationUuid: {
      type: String,
      required: true,
    },
    workflows: {
      type: Array as PropType<Types.Workflow[]>,
      required: true,
      default: [],
    },
  },
  data() {
    return {
      successModal: false as boolean,
      inputWorkflows: [...this.workflows] as Types.Workflow[],
      sections: [] as any,
      companyData: {} as AppApiResponse.OrganizationData,
      isLoadingCompanyData: false as boolean,
      configStatus: {} as ApiResponse.OrganizationDataConfig,
    };
  },
  async created() {
    this.isLoadingCompanyData = true;
    try {
      await this.fetchOrganizationDataConfig();
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoadingCompanyData = false;
    }
  },
  methods: {
    onChange() {
      // ChangeToggle
    },
    onInputWorkflows(uuid: string, workflow: Types.Workflow) {
      this.inputWorkflows = this.inputWorkflows.map((i: Types.Workflow) => {
        if (i.uuid === uuid) {
          return {
            ...workflow,
          };
        }
        return i;
      });
      this.$emit('change-workflows', this.inputWorkflows);
    },
    onSubmit() {
      this.UpdateWorkflows();
      this.toggleSuccessModal();
    },
    toggleSuccessModal() {
      this.successModal = !this.successModal;
    },
    async UpdateWorkflows() {
      try {
        const { data } = await updateWorkFlows(
          this.organizationUuid,
          this.inputWorkflows
        );
        this.inputWorkflows = data.workflows;
        this.$emit('change-workflows', this.inputWorkflows);
        this.$emit('UpdatedWorkflows');
      } catch (err) {
        console.error(err);
      }
    },
    async fetchOrganizationDataConfig() {
      try {
        const { data } = await fetchOrganizationDataConfig(
          this.organizationUuid
        );
        this.configStatus = data;
      } catch (e) {
        console.log(e);
      }
    },
    changeStatus(value: ApiResponse.OrganizationDataConfig) {
      this.updateOrganizationDataConfig(value);
    },
    async updateOrganizationDataConfig(
      value: ApiResponse.OrganizationDataConfig
    ) {
      try {
        const { data } = await updateOrganizationDataConfig(
          this.$route.params.id,
          value
        );
        this.configStatus = data;
      } catch (e) {
        console.error(e);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 15px;
}

.schedule-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.schedule-contents {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  grid-gap: 20px;
  margin-top: 20px;
}

.statistics-top-title {
  margin-top: 40px;
}

.content-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.button-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.switch-word {
  font-size: 12px;
}

.switch-button {
  margin: 0 4px;
}

.content {
  width: 440px;
  height: 400px;
  border: solid 1px $light_gray_blue_3;
  margin-top: 10px;
}

.submit-button {
  width: 200px;
  margin: 40px auto 0;
}
</style>
