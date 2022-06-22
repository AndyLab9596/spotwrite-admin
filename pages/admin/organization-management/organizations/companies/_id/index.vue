<template>
  <div class="l-page-container">
    <div class="l-page">
      <back-to-index />
      <div class="header-title-page">
        <div class="header-page">
          <page-header title="会社情報の登録">
            <template #tutorial>
              <TutorialButtonIcon :url="tutorialUrl"></TutorialButtonIcon>
            </template>
          </page-header>
        </div>
        <div class="review-button">
          <button
            class="app-preview"
            type="button"
            @click="toggleApplicationPreviewModal"
          >
            <img
              class="app-preview__icon"
              src="/icon/icon_mobile.svg"
              alt=""
            />アプリプレビュー
          </button>
        </div>
      </div>

      <div class="tabs-container">
        <base-tabs
          :items="[
            { id: 'overview', name: '会社概要' },
            { id: 'data', name: '会社データ' },
            { id: 'history', name: '沿革' },
          ]"
          :current-id="currentId"
          @change-tab="changeTab"
        />
      </div>
      <div class="l-contents">
        <div v-if="currentId === 'overview'">
          <company-profile
            :organization="organization"
            :organization-users="organizationUsers"
            @update-organization="updateOrganization"
          />
        </div>
        <div v-if="currentId === 'data'">
          <company-data
            :sections="sections"
            :is-loading="isLoadingCompanyData"
            :organization-data="companyData"
            :config-status="configStatus"
            :show-description="true"
            @changeStatus="changeStatus"
          />
          <div class="button-wrapper">
            <base-button
              v-if="!isLoadingCompanyData"
              type="submit"
              class="submit-button"
              size="large"
              @click="onSubmit"
              >保存する</base-button
            >
          </div>
        </div>
        <div v-if="currentId === 'history'">
          <company-history
            :organization-histories="organizationHistories"
            @add="addHistory"
            @edit="editHistory"
            @delete="deleteHistory"
          />
        </div>
      </div>
    </div>
    <application-preview
      v-if="applicationPreviewModal"
      :active-tab="currentId"
      :organization="organization"
      :organization-data="organizationData"
      :workflows="workflows"
      :sections="sections"
      @click="toggleApplicationPreviewModal"
    />
    <success-message v-if="successModal" @close="toggleSuccessModal">
      入力された情報が保存されました。
    </success-message>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  fetchOrganization,
  fetchHistories,
  createHistory,
  updateHistory,
  deleteHistory,
  fetchOrganizationData,
  fetchContainSubOrganizationUsers,
  fetchOrganizationDataConfig,
  updateOrganizationDataConfig,
} from '@/libs/api';
import { CompanyProfile, CompanyHistory } from '@/components/Admin/Pages';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import BaseTabs from '@/components/Admin/Modules/Tab/BaseTabs.vue';
import BackToIndex from '@/components/Admin/Pages/OrganizationManagement/Organizations/BackToIndex.vue';
import CompanyData from '@/components/Admin/Pages/Organizations/Company/CompanyData.vue';
import { SuccessMessage } from '@/components/Admin/Modules/Modal';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';
import ApplicationPreview from '~/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/ApplicationPreviewOrganization.vue';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    CompanyProfile,
    CompanyData,
    CompanyHistory,
    PageHeader,
    BaseTabs,
    BackToIndex,
    ApplicationPreview,
    SuccessMessage,
    BaseButton,
    TutorialButtonIcon,
  },
  async asyncData({ params, error }: { params: any; error: any }) {
    try {
      // 組織取得（画像・代表者も含む）
      const organization = await fetchOrganization(params.id);
      // ユーザー一覧取得
      const organizationUsers = await fetchContainSubOrganizationUsers(
        params.id
      );
      // 沿革取得
      const organizationHistories = await fetchHistories(params.id);
      const organizationData = await fetchOrganizationData(params.id);
      return {
        organization: organization.data,
        organizationUsers: organizationUsers.data,
        organizationHistories: organizationHistories.data.histories,
        organizationData: organizationData.data,
      };
    } catch (err) {
      error({
        statusCode: err.response.status,
        message: err.response.data.message,
      });
    }
  },
  data() {
    return {
      currentId: 'overview',
      deleteCompanyModal: false as boolean,
      alertModal: false as boolean,
      applicationPreviewModal: false,
      sections: [] as any,
      companyData: {} as ApiResponse.OrganizationData,
      isLoadingCompanyData: false as boolean,
      configStatus: {} as ApiResponse.OrganizationDataConfig,
      successModal: false as boolean,
    };
  },
  computed: {
    active() {
      return (id: number): boolean => {
        return this.$data.currentId === id;
      };
    },
    workflows() {
      return this.organizationHistories;
    },
    tutorialUrl() {
      let url = '';
      switch (this.currentId) {
        case 'overview':
          url = '/admin/tutorial/company-detail.html';
          break;
        case 'data':
          url = '/admin/tutorial/company-data.html';
          break;
        case 'history':
          url = '/admin/tutorial/company-history.html';
          break;
        default:
          break;
      }
      return url;
    },
  },
  async created() {
    this.isLoadingCompanyData = true;
    try {
      await Promise.all([
        this.fetchCompanyData(),
        this.fetchOrganizationDataConfig(),
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoadingCompanyData = false;
    }
  },
  methods: {
    async addHistory(value: ApiRequest.CreateHistory) {
      try {
        const res = await createHistory(this.$data.organization.uuid, value);
        this.$data.organizationHistories.push(res.data);
      } catch (err) {
        console.error(err);
      }
    },
    async editHistory(history: Types.History) {
      try {
        const value = {
          title: history.title,
          content: history.content,
          date: history.date,
        };
        await updateHistory(this.$data.organization.uuid, history.uuid, value);
      } catch (err) {
        console.error(err);
      }
      this.$data.organizationHistories = this.$data.organizationHistories.map(
        (o: Types.History) => {
          if (o.uuid === history.uuid) {
            Vue.set(history, 'date', history.dateDisplay);
            return history;
          }
          return o;
        }
      );
    },
    async deleteHistory(deleteHistoryUuid: string) {
      try {
        await deleteHistory(this.$data.organization.uuid, deleteHistoryUuid);
      } catch (err) {
        console.error(err);
      }
      this.$data.organizationHistories = this.$data.organizationHistories.filter(
        (o: Types.History) => !(o.uuid === deleteHistoryUuid)
      );
    },
    async fetchOrganizationDataConfig() {
      try {
        const { data } = await fetchOrganizationDataConfig(
          this.$route.params.id
        );
        this.configStatus = data;
      } catch (e) {
        console.log(e);
      }
    },
    onSubmit() {
      this.updateOrganizationDataConfig(this.configStatus);
      this.toggleSuccessModal();
    },
    toggleSuccessModal() {
      this.successModal = !this.successModal;
    },
    changeTab(id: string) {
      this.currentId = id;
    },
    toggleApplicationPreviewModal() {
      this.applicationPreviewModal = !this.applicationPreviewModal;
    },
    async fetchCompanyData() {
      try {
        const { data } = await fetchOrganizationData(
          this.$accessor.userProfile.company_uuid
        );
        this.companyData = data;

        // 血液型の円グラフ情報を設定
        this.setBloodTypeData(data.blood_type_count);
      } catch (e) {
        console.log(e);
      }
    },
    setBloodTypeData(bloodTypeCount: any) {
      const tempSection: any = [];
      // eslint-disable-next-line func-names
      Object.keys(bloodTypeCount).forEach(function(key: string) {
        if (bloodTypeCount[key].name === 'A') {
          tempSection.push({
            label: 'A型',
            value: bloodTypeCount[key].percent,
          });
        } else if (bloodTypeCount[key].name === 'B') {
          tempSection.push({
            label: 'B型',
            value: bloodTypeCount[key].percent,
          });
        } else if (bloodTypeCount[key].name === 'O') {
          tempSection.push({
            label: 'O型',
            value: bloodTypeCount[key].percent,
          });
        } else if (bloodTypeCount[key].name === 'AB') {
          tempSection.push({
            label: 'AB型',
            value: bloodTypeCount[key].percent,
          });
        }
      });
      const sorted = tempSection.sort((a: any, b: any) => b.value - a.value);
      sorted[0].color = '#F09C9C';
      sorted[1].color = '#9498AF';
      sorted[2].color = '#7E8195';
      sorted[3].color = '#D3D5E0';
      this.sections = sorted;
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
    updateOrganization(organization: Types.GroupOrganization) {
      this.organization = { ...organization };
    },
  },
});
</script>

<style lang="scss" scoped>
.tabs-container {
  display: flex;
  align-items: center;
  margin: 18px 0 15px;

  .base-tabs {
    flex-grow: 1;
  }
}

.app-preview {
  flex-shrink: 0;
  margin-left: 10px;
  display: flex;
  align-items: center;
  font-weight: bold;
  color: $true_white;
  background-color: $gray_blue_3;
  border: none;
  border-radius: 4px;
  width: 140px;
  height: 30px;
  padding: 0 0 0 11px;
  font-size: 12px;
  float: right;

  &:hover {
    background-color: $gray_blue_4;
  }

  &__icon {
    float: left;
    width: 9px;
    height: 16px;
    margin-right: 10px;
  }
}

.back-to-index-container {
  position: absolute;
  top: 17px;
}

.header-title-page {
  display: flex;
}

.header-page {
  width: 80%;
}

.review-button {
  width: 20%;
  color: red;
  margin-top: 10px;
}

.button-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  .submit-button {
    width: 200px;
    margin: 40px 0 0;
  }
}
</style>
