<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClick">
      <div class="modal-window">
        <div class="modal-header">
          <base-button size="large" @click="onClick"
            >プレビューを閉じる<svg
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16.707"
              height="16.707"
              viewBox="0 0 16.707 16.707"
            >
              <g
                id="Icon_close_w_large"
                data-name="Icon/close_w_large"
                transform="translate(0.354 0.354)"
              >
                <line
                  id="Line_879"
                  data-name="Line 879"
                  x2="16"
                  y2="16"
                  fill="none"
                  stroke="#fff"
                  stroke-width="1"
                />
                <line
                  id="Line_880"
                  data-name="Line 880"
                  x2="16"
                  y2="16"
                  transform="translate(16) rotate(90)"
                  fill="none"
                  stroke="#fff"
                  stroke-width="1"
                />
              </g>
            </svg>
          </base-button>
        </div>
        <div class="modal-content">
          <img src="/image/img_iphone-outline.png" class="image" />
          <div class="modal-body">
            <img
              class="app-top"
              src="/image/app_preview-organization_top.png"
            />
            <div class="app-container">
              <div class="organization-top">
                <organization-header
                  :organization="organization"
                  :favorite="organizationInfo.is_favorite"
                  :user-count="allUserCount"
                />
              </div>

              <div
                v-show="organization.type === 'company'"
                class="tab-container"
              >
                <div
                  :class="{ active: currentTab === 'member' }"
                  :style="{
                    width: `calc(100% / 4)`,
                  }"
                  @click="currentTab = 'member'"
                >
                  メンバー
                </div>
                <div
                  :class="{ active: currentTab === 'overview' }"
                  :style="{
                    width: `calc(100% / 4)`,
                  }"
                  @click="currentTab = 'overview'"
                >
                  {{ overviewTitle }}
                </div>
                <div
                  :class="{ active: currentTab === 'data' }"
                  :style="{
                    width: `calc(100% / 4)`,
                  }"
                  @click="currentTab = 'data'"
                >
                  会社データ
                </div>
                <div
                  :class="{ active: currentTab === 'history' }"
                  :style="{
                    width: `calc(100% / 4)`,
                  }"
                  @click="currentTab = 'history'"
                >
                  沿革
                </div>
              </div>
              <div v-show="organization.type === 'company'" class="container">
                <div class="main">
                  <company-members
                    v-show="currentTab === 'member'"
                    :grouped-members="groupedMembers"
                  />
                  <company-overview
                    v-show="currentTab === 'overview'"
                    :company="organizationInfo"
                    :detail="organizationInfo.detail"
                  />
                  <div v-show="currentTab === 'data'" class="company-data">
                    <company-data
                      :organization-data="organizationData"
                      :sections="sections"
                      :is-busho="true"
                      :config-status="configStatus"
                    />
                  </div>
                  <company-history
                    v-show="currentTab === 'history'"
                    :histories="workflows"
                  />
                </div>
              </div>

              <div
                v-show="organization.type !== 'company'"
                class="tab-container"
              >
                <div
                  :class="{ active: currentTab === 'member' }"
                  :style="{
                    width: `calc(100% / 3)`,
                  }"
                  @click="currentTab = 'member'"
                >
                  メンバー
                </div>

                <div
                  :class="{ active: currentTab === 'overview' }"
                  :style="{
                    width: `calc(100% / 3)`,
                  }"
                  @click="currentTab = 'overview'"
                >
                  {{ overviewTitle }}
                </div>

                <div
                  :class="{ active: currentTab === 'history' }"
                  :style="{
                    width: `calc(100% / 3)`,
                  }"
                  @click="currentTab = 'history'"
                >
                  仕事の流れ・部署データ
                </div>
              </div>
              <div v-show="organization.type !== 'company'" class="container">
                <div class="main">
                  <organization-members
                    v-show="currentTab === 'member'"
                    :grouped-members="groupedMembers"
                  />
                  <organization-overview
                    v-show="currentTab === 'overview'"
                    :organization="organizationInfo"
                    :org-images-not-main="orgImagesNotMain"
                    :visible-images="3"
                    :detail="organization.detail"
                  />

                  <div v-show="currentTab === 'history'">
                    <h2 v-show="workflowsData.length > 0" class="data-header">
                      仕事の流れ
                    </h2>
                    <div
                      v-if="workflowsData.length > 0"
                      class="department-workflow"
                    >
                      <org-workflow
                        :workflows="
                          organizationInfo.detail ? workflowsData : null
                        "
                      />
                    </div>
                    <div>
                      <h2 class="data-header">部署データ</h2>
                      <div class="department-data">
                        <company-data
                          :organization-data="organizationData"
                          :sections="sections"
                          :is-busho="true"
                          :config-status="configStatus"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <img
              class="app-bottom"
              src="/image/app_preview-community_bottom.png"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import {
  fetchEmployeeOrganizations,
  fetchOrganizationData,
  fetchWorkFlows,
  fetchOrganizationDataConfig,
  fetchPreviewGroupedOrganizationMembers,
} from '@/libs/api';

import BaseButton from '~/components/Admin/Modules/Button/BaseButton.vue';
import OrganizationHeader from '~/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/OrganizationHeader.vue';
import CompanyOverview from '~/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/CompanyOverview.vue';
import OrganizationOverview from '~/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/OrganizationOverview.vue';
import OrgWorkflow from '~/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/OrgWorkflow.vue';
import CompanyHistory from '~/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/CompanyHistory.vue';
import CompanyData from '~/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/CompanyData.vue';
import OrganizationMembers from '~/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/OrganizationMembers.vue';
import CompanyMembers from '~/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/CompanyMembers.vue';

export default Vue.extend({
  components: {
    CompanyMembers,
    BaseButton,
    OrganizationHeader,
    CompanyOverview,
    OrganizationOverview,
    OrgWorkflow,
    CompanyHistory,
    CompanyData,
    OrganizationMembers,
  },
  props: {
    activeTab: {
      type: String,
      default: 'history',
    },
    sections: {
      type: Array,
      default: () => [],
    },
    organization: {
      type: Object,
      required: true,
      default: {} as Types.GroupOrganization,
    },
    organizationData: {
      type: Object as PropType<ApiResponse.OrganizationData>,
      required: true,
      default: () => {},
    },
    workflows: {
      type: Array as PropType<Types.Workflow[]>,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      currentTab: '' as string,
      organizationInfo: {} as ApiResponse.Organization,
      workflowsData: [] as Types.Workflow[],
      configStatus: {} as ApiResponse.OrganizationDataConfig,
      groupedMembers: [] as AppApiResponse.GroupedOrganizationMember[],
    };
  },
  computed: {
    orgImagesNotMain(): Array<any> {
      if (this.organization.main_image) {
        return this.organization.images.filter(
          (item: AppApiResponse.OrganizationImage) =>
            item.url !== this.organization.main_image.toString()
        );
      }
      return [];
    },
    overviewTitle(): string {
      if (this.organization.type === 'company') return '会社概要';
      if (this.organization.type === 'department') return '部署概要';
      if (this.organization.type === 'shop') return '店舗概要';
      return '概要';
    },
    allUserCount(): number {
      return this.groupedMembers.reduce(
        (acc: number, cur: AppApiResponse.GroupedOrganizationMember) =>
          acc + cur.users.length,
        0
      );
    },
  },
  async created(): Promise<void> {
    this.currentTab = this.activeTab;
    await Promise.all([
      this.fetchCompany(),
      this.fetchCompanyData(),
      this.fetchWorkFlowsData(),
      this.fetchOrganizationDataConfig(),
      this.fetchGroupedOrganizationMembersData(),
    ]);
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
    getImageUrl(obj: string) {
      if (obj) {
        return obj.url;
      }
      return '';
    },
    async fetchCompany(): Promise<void> {
      this.isLoading = true;

      try {
        // Vuex 'user' getter
        const { data } = await fetchEmployeeOrganizations(
          this.organization.uuid
        );
        this.organizationInfo = data;
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchWorkFlowsData() {
      try {
        const { data } = await fetchWorkFlows(this.organization.uuid);
        this.workflowsData = data.workflows;
      } catch (e) {
        console.log(e);
      }
    },
    async fetchCompanyData() {
      this.isLoadingCompanyData = true;
      try {
        const { data } = await fetchOrganizationData(this.user.company_uuid);
        this.organizationInfo = data;

        // 血液型の円グラフ情報を設定
        this.setBloodTypeData(data.blood_type_count);
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoadingCompanyData = false;
      }
    },
    async fetchOrganizationDataConfig() {
      try {
        const { data } = await fetchOrganizationDataConfig(
          this.organization.uuid
        );
        this.configStatus = data;
      } catch (e) {
        console.log(e);
      }
    },
    async fetchGroupedOrganizationMembersData() {
      const payload = {
        uuid: this.organization.uuid,
        limit: 10000,
      };
      try {
        const { data } = await fetchPreviewGroupedOrganizationMembers(payload);
        this.groupedMembers = data.employment_positions;
      } catch (e) {
        console.log(e);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(126, 129, 149, 0.8);
}

.modal-window {
  background-color: transparent;
}

.modal-header {
  display: flex;
  justify-content: flex-end;
}

.modal-content {
  position: relative;
  margin-top: 25px;
}

.modal-body {
  position: absolute;
  top: calc(3.5%);
  right: calc(6.9%);
  bottom: calc(3.8%);
  left: calc(7.8%);
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .app-top,
  .app-bottom {
    width: 100%;

    &.app-top {
      margin-top: -6px;
      margin-bottom: -36px;
    }

    &.app-bottom {
      border-top: solid 1px #eff0f7;
    }
  }

  .app-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    font-size: 11px;
    overflow: hidden;
    background: #eff0f7;

    .organization-top {
      flex-shrink: 0;
      background: $true_white;
      text-align: center;
    }

    .tab-container {
      display: flex;
      background: #fff;
      padding: 0 8px;

      div {
        flex-shrink: 0;
        text-align: center;
        align-self: center;
        padding: 12px 0;
        cursor: pointer;
        color: #9c9da5;
        font-weight: 600;

        &.active {
          position: relative;
          color: #f09b9c;
          font-weight: 600;

          &::before {
            content: '';
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            height: 2px;
            background: linear-gradient(to right, #f09b9c, #b2b7d8);
          }
        }
      }
    }

    .container {
      background: #fafbfc;
      overflow: auto;
      flex-grow: 1;

      .main {
        background-color: #fff;
      }
    }
  }
}

.image {
  width: 390px;
  height: auto;
}

// オーバーレイのトランジション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  // オーバーレイに包含されているモーダルウィンドウのトランジション
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

// ディレイを付けるとモーダルウィンドウが消えた後にオーバーレイが消える
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.modal-enter {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.icon {
  margin-left: 10px;
}

.data-header {
  height: 48px;
  font-size: 13px;
  font-weight: 600;
  line-height: 20;
  display: flex;
  align-items: center;
  padding: 0 0 0 16px;
  color: $gray_blue_4;
  background-color: $light_gray_blue_4;
}

.company-data {
  margin: 10px;
  padding: 10px;
  box-shadow: 0 3px 6px #dce5ef;
  border-radius: 4px;
  background-color: #fff;
}

.department-data {
  padding: 0 10px;
}

.department-workflow {
  padding: 0 10px;
}
</style>
