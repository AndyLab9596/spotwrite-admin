<template>
  <div class="l-page-container">
    <div class="l-page">
      <back-to-index />
      <div class="header-title-page">
        <div class="header-page">
          <page-header title="組織（BOX）情報の登録">
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
      <base-tabs
        :items="[
          { id: 'overview', name: '部署概要' },
          { id: 'history', name: '仕事の流れ・データ' },
        ]"
        :current-id="currentId"
        @change-tab="changeTab"
      />
      <div class="l-contents">
        <div v-if="currentId === 'overview'">
          <department-profile
            :organization="organization"
            :organization-users="organizationUsers"
            @updatedProfile="updatedProfile"
          />
        </div>
        <div v-if="currentId === 'history'">
          <schedule-and-data
            :organization-uuid="organization.uuid"
            :workflows="workflows"
            @UpdatedWorkflows="UpdatedWorkflows"
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { DepartmentProfile, ScheduleAndData } from '@/components/Admin/Pages';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import {
  fetchContainSubOrganizationUsers,
  fetchOrganization,
  fetchOrganizationData,
  fetchWorkFlows,
} from '@/libs/api';
import BaseTabs from '@/components/Admin/Modules/Tab/BaseTabs.vue';
import BackToIndex from '@/components/Admin/Pages/OrganizationManagement/Organizations/BackToIndex.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';
import ApplicationPreview from '~/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/ApplicationPreviewOrganization.vue';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    DepartmentProfile,
    ScheduleAndData,
    PageHeader,
    BaseTabs,
    BackToIndex,
    ApplicationPreview,
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
      const organizationData = await fetchOrganizationData(params.id);
      // 仕事の流れ一覧取得
      const workFlows = await fetchWorkFlows(params.id);
      return {
        organization: organization.data,
        organizationUsers: organizationUsers.data,
        workflows: workFlows.data.workflows,
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
      applicationPreviewModal: false,
      sections: [
        {
          label: 'A型',
          value: 0,
          color: '#F09C9C',
        },
        {
          label: 'B型',
          value: 0,
          color: '#9498AF',
        },
        {
          label: 'O型',
          value: 0,
          color: '#7E8195',
        },
        {
          label: 'AB型',
          value: 0,
          color: '#D3D5E0',
        },
      ],
    };
  },
  computed: {
    active() {
      return (id: string): boolean => {
        return this.currentId === id;
      };
    },
    tutorialUrl() {
      let url = '';
      switch (this.currentId) {
        case 'overview':
          url = '/admin/tutorial/organization-detail.html';
          break;
        case 'history':
          url = '/admin/tutorial/organization-data.html';
          break;
        default:
          break;
      }
      return url;
    },
  },
  mounted() {
    this.assignBloodTypes();
  },
  methods: {
    changeTab(id: string) {
      this.currentId = id;
    },
    toggleApplicationPreviewModal() {
      this.applicationPreviewModal = !this.applicationPreviewModal;
    },
    assignBloodTypes() {
      const bloodTypes = this.organizationData.blood_type_count;
      const bloodArray = Object.values(bloodTypes);
      bloodArray.forEach((e: any) => {
        if (e.name === 'A') {
          this.sections[0].value = e.percent;
        } else if (e.name === 'B') {
          this.sections[1].value = e.percent;
        } else if (e.name === 'O') {
          this.sections[2].value = e.percent;
        } else if (e.name === 'AB') {
          this.sections[3].value = e.percent;
        }
      });
    },
    async updatedProfile() {
      const { data } = await fetchOrganization(this.$route.params.id);
      this.organization = data;
    },
    async UpdatedWorkflows() {
      const workFlows = await fetchWorkFlows(this.$route.params.id);
      this.workflows = workFlows.data.workflows;
    },
  },
});
</script>

<style lang="scss" scoped>
.header-title-page {
  display: flex;
}

.header-page {
  width: 80%;
  margin-bottom: 18px;
}

.review-button {
  width: 20%;
  color: red;
  margin-top: 10px;
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

.tabs {
  margin-top: 28px;
}

.back-to-index-container {
  position: absolute;
  top: 17px;
}
</style>
