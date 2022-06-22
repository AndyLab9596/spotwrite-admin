<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="投稿ルール一覧・設定">
        <template #tutorial>
          <TutorialButtonIcon
            :url="`/admin/tutorial/postingrules-list-organization.html`"
          />
        </template>
        <template #description>
          各記事の投稿ルールをまとめて確認、設定することができます。
        </template>
      </page-header>
      <div class="link-box">
        <nuxt-link
          tag="button"
          to="/admin/post-rule/organization/"
          class="tab-button active"
        >
          会社、組織（BOX）
        </nuxt-link>
        <nuxt-link
          tag="button"
          to="/admin/post-rule/community/"
          class="tab-button"
        >
          コミュニティ
        </nuxt-link>
      </div>
      <scrollable-tabs
        class="company-tabs"
        :companies="companies"
        :current-id="currentUuid"
        @change-tab="changeTab($event)"
      />
      <div class="contents">
        <div class="flex align-items-center">
          <h2 class="content-title">この会社の基本投稿ルール</h2>
          <img class="icon" src="/icon/icon_help-outline.png" />
          <span class="link" @click="openRuleTableModal = true"
            >投稿ルール・アラートについて</span
          >
        </div>
        <div class="content-description">
          会社ごとに基本の投稿ルールを設定します。
          <br />組織や個人で別に設定したい場合は、下の一覧から個別に設定を変更できます。
        </div>

        <table border class="company-rules">
          <tr>
            <th class="post-rule">マイエピソード</th>
            <th class="post-rule">チームエピソード</th>
            <th class="post-rule">プロフィール更新</th>
            <th class="alert">投稿アラート</th>
          </tr>
          <tr v-if="currentCompany">
            <td>
              <base-select
                v-model="currentCompany.my_episode"
                :items="postRuleWithLabels(configRules.my_episode)"
                @input="updateCompanyRule()"
              />
            </td>
            <td>
              <base-select
                v-model="currentCompany.team_episode"
                :items="postRuleWithLabels(configRules.team_episode)"
                @input="updateCompanyRule()"
              />
            </td>
            <td>
              <base-select
                v-model="currentCompany.profile"
                :items="postRuleWithLabels(configRules.profile)"
                @input="updateCompanyRule()"
              />
            </td>
            <td>
              <base-select
                v-model="currentCompany.alert"
                :items="alertWithLabels(configRules.alert)"
                @input="updateCompanyRule()"
              />
            </td>
          </tr>
        </table>

        <hr class="horizontal" />

        <div class="flex justify-between">
          <h2 class="content-title">組織（BOX）の投稿ルール一覧</h2>

          <div class="setting-box">
            <base-button @click="openBulkBasicPostRuleModal = true">
              全て基本投稿ルールに戻す
            </base-button>
          </div>
        </div>

        <div class="table-wrapper">
          <table v-if="!isLoading" border class="organization-rules">
            <tr>
              <th class="checkbox-header">
                <base-checkbox
                  v-model="isAllChecked"
                  @change="toggleAllCheck"
                />
              </th>
              <th class="organization-header">
                部署・支店・店舗
              </th>
              <th class="post-rule">マイエピソード</th>
              <th class="post-rule">チームエピソード</th>
              <th class="post-rule">プロフィール更新</th>
              <th class="alert">投稿アラート</th>
              <th class="member">メンバー<br />個別設定</th>
            </tr>
            <tr v-for="organization in organizations" :key="organization.uuid">
              <td>
                <base-checkbox
                  v-model="selectGroup"
                  :value="organization.uuid"
                  @change="onClickCheckbox"
                />
              </td>
              <td>
                <div v-if="organization.parent" class="parent">
                  {{ organization.parent }}
                </div>
                <div
                  class="organization-name"
                  :class="{ 'with-parent': organization.parent }"
                >
                  {{ organization.name }}
                </div>
              </td>
              <td>
                <select-box
                  v-model="organization.my_episode"
                  :items="postRuleWithLabels(configRules.my_episode, false)"
                  @input="updateOrganizationRule(organization)"
                />
              </td>
              <td>
                <select-box
                  v-model="organization.team_episode"
                  :items="postRuleWithLabels(configRules.team_episode, false)"
                  @input="updateOrganizationRule(organization)"
                />
              </td>
              <td>
                <select-box
                  v-model="organization.profile"
                  :items="postRuleWithLabels(configRules.profile, false)"
                  @input="updateOrganizationRule(organization)"
                />
              </td>
              <td>
                <select-box
                  v-model="organization.alert"
                  :items="alertWithLabels(configRules.alert, false)"
                  @input="updateOrganizationRule(organization)"
                />
              </td>
              <td class="organization-member">
                <button
                  class="member-button"
                  @click="
                    openGroupPostRule(organization.uuid, organization.name)
                  "
                >
                  設定
                </button>
              </td>
            </tr>
          </table>
        </div>

        <vue-loading
          v-if="isLoading"
          type="spin"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>

        <div
          v-if="!isLoading && !organizations.length"
          class="no-organizations"
        >
          部署・支店・店舗が存在しません
        </div>

        <base-pagination v-model="pagination" class="pagination" />

        <GroupPostRuleModal
          v-if="openGroupPostRuleModal"
          :uuid="organizationUserRuleUuid"
          :position-name="positionName"
          :config-rules="configRules"
          @onClose="openGroupPostRuleModal = false"
        />
        <BulkGroupPostRuleModal
          v-if="openBulkGroupPostRuleModal"
          :config-rules="configRules"
          @onClose="openBulkGroupPostRuleModal = false"
          @onSubmit="handleBulkSubmit($event)"
        />
        <RuleTableModal
          v-if="openRuleTableModal"
          :config-rules="configRules"
          @onClose="openRuleTableModal = false"
        />
        <BulkPostRuleSettingModal
          v-if="openBulkPostRuleSettingModal"
          @onClose="openBulkPostRuleSettingModal = false"
          @onOpen="onOpenBulkGroupPostRuleModal()"
        />
        <BulkBasicPostRuleModal
          v-if="openBulkBasicPostRuleModal"
          @onClose="openBulkBasicPostRuleModal = false"
          @onSubmit="handleBulkBasicSubmit()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  GroupPostRuleModal,
  BulkGroupPostRuleModal,
  RuleTableModal,
  BulkPostRuleSettingModal,
  BulkBasicPostRuleModal,
} from '@/components/Admin/Pages';
import ScrollableTabs from '@/components/Admin/Modules/Tab/ScrollableTabs.vue';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import {
  fetchOrganizations,
  fetchOrganizationRule,
  updateOrganizationRule,
  fetchConfigRules,
  resetOrganizationRules,
} from '@/libs/api';
import { VueLoading } from 'vue-loading-template';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BasePagination from '@/components/Admin/Modules/Pagination/BasePagination.vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';
import SelectBox from '@/components/Admin/Pages/PostRule/SelectBox.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';

type selectGroup = string[];
type Interval = 'normal' | 'slowly' | 'frequent';
type AlertLevel = 'normal' | 'strong' | 'weak';
type Rule = {
  my_episode: Interval;
  team_episode: Interval;
  profile: Interval;
  alert: AlertLevel;
};
type Organization = ApiResponse.OrganizationRule & { parent?: string };
type Pagenation = {
  number: number;
  limit: number;
  offset: number;
  total: number;
};

export default Vue.extend({
  layout: 'admin/default',
  components: {
    GroupPostRuleModal,
    BulkGroupPostRuleModal,
    BulkPostRuleSettingModal,
    BulkBasicPostRuleModal,
    RuleTableModal,
    ScrollableTabs,
    VueLoading,
    PageHeader,
    BaseButton,
    BasePagination,
    BaseCheckbox,
    BaseSelect,
    SelectBox,
    TutorialButtonIcon,
  },
  async asyncData({ error }: any) {
    try {
      const {
        data: { organizations: organizationMaster },
      } = await fetchOrganizations();

      const configRules = await fetchConfigRules();

      return {
        organizationMaster,
        configRules: configRules.data,
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
      isLoading: false,
      organizationUserRuleUuid: '',
      openBulkGroupPostRuleModal: false,
      openGroupPostRuleModal: false,
      openRuleTableModal: false,
      openBulkPostRuleSettingModal: false,
      openBulkBasicPostRuleModal: false,
      currentId: null as null | string,
      organizationMaster: [] as ApiResponse.Organization[],
      selectGroup: [] as selectGroup,
      // @ts-ignore
      organizationRules: null as null | ApiResponse.OrganizationRule[],
      offset: 0,
      currentPage: 1,
      positionName: '',
      configRules: {} as ApiResponse.ConfigRules,
      isAllChecked: [] as string[],
      postRules: [
        {
          value: 'slowly',
          name: 'ゆっくり',
        },
        {
          value: 'normal',
          name: '普通',
        },
        {
          value: 'frequent',
          name: '頻繁',
        },
      ],
      alerts: [
        {
          value: 'strong',
          name: '強め',
        },
        {
          value: 'normal',
          name: '普通',
        },
        {
          value: 'weak',
          name: '弱め',
        },
      ],
      labelRuleMap: {
        three_months: '3ヶ月',
        month: '1ヶ月',
        week: '一週間',
        two_years: '2年',
        year: '1年',
        six_months: '6ヶ月',
      } as { [key: string]: string },
      labelAlertMap: {
        once: '期限が切れた時に1度',
        once_one_week_before: '期限切れの一週間前に1度',
        everyday_one_week_before: '期限切れの一週間前から毎日',
      } as { [key: string]: string },
    };
  },
  computed: {
    companies(): ApiResponse.Organization[] {
      return this.$data.organizationMaster.filter(
        (o: ApiResponse.Organization) => o.type === 'company'
      );
    },
    children(): ApiResponse.Organization[] {
      return this.$data.organizationMaster.filter(
        (o: ApiResponse.Organization) => o.type !== 'company'
      );
    },
    currentUuid: {
      get(): string {
        if (this.currentId) {
          return this.currentId;
        }
        if (this.companies[0]) {
          return this.companies[0].uuid;
        }
        return '';
      },
      set(value: string) {
        this.currentId = value;
      },
    },
    currentCompany: {
      get(): ApiResponse.OrganizationRule | null {
        if (this.organizationRules == null) {
          return null;
        }
        return this.organizationRules!.find(
          (o: { uuid: string }) => o.uuid === this.currentUuid
        )!;
      },
    },
    organizations: {
      get(): Organization[] {
        return this.organizationRules
          ? this.organizationRules
              .filter((o: { uuid: string }) => o.uuid !== this.currentUuid)
              .map((o: ApiResponse.OrganizationRule) => {
                const child = this.children.find(
                  (c: ApiResponse.Organization) => c.uuid === o.uuid
                );
                if (child == null) {
                  return o;
                }
                if (child!.relations.parent) {
                  const parent = this.children.find(
                    (c: ApiResponse.Organization) =>
                      c.uuid === child!.relations.parent
                  );
                  return { ...o, parent: parent!.name };
                }
                return o;
              })
          : [];
      },
    },
    pagination(): Pagenation {
      return {
        total: this.organizations.length,
        limit: 20,
        offset: this.$data.offset,
        number: this.$data.currentPage,
      };
    },
  },
  async created() {
    this.refresh();
  },
  methods: {
    async handleBulkSubmit(rule: Rule) {
      const rules = this.organizations
        .filter((o: ApiResponse.OrganizationRule) =>
          this.selectGroup.find((id: string) => o.uuid === id)
        )
        .map((o: ApiResponse.OrganizationRule) => {
          return { ...rule, uuid: o.uuid };
        });
      await updateOrganizationRule({ rules });
      this.openBulkGroupPostRuleModal = false;
      this.refresh();
      this.selectGroup.splice(0);
      this.isAllChecked = [];
    },
    async handleBulkBasicSubmit() {
      await resetOrganizationRules(this.currentUuid);
      this.openBulkBasicPostRuleModal = false;
      this.refresh();
      this.selectGroup.splice(0);
      this.isAllChecked = [];
    },
    updateOrganizationRule(organization: ApiResponse.OrganizationRule) {
      try {
        const rules = [organization];
        updateOrganizationRule({
          // @ts-ignore
          rules,
        });
      } catch (error) {
        console.error(error);
      }
    },
    async updateCompanyRule() {
      try {
        const rules = [this.currentCompany!];
        await updateOrganizationRule({
          // @ts-ignore
          rules,
        });
        this.refresh();
      } catch (error) {
        console.error(error);
      }
    },
    async refresh() {
      this.isLoading = true;
      try {
        const {
          data: { rules },
        } = await fetchOrganizationRule(this.currentUuid);
        // @ts-ignore
        this.organizationRules = rules;
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async changeTab(uuid: string) {
      this.currentUuid = uuid;
      await this.refresh();
    },
    openGroupPostRule(uuid: string, positionName: string) {
      this.openGroupPostRuleModal = true;
      this.organizationUserRuleUuid = uuid;
      this.positionName = positionName;
    },
    toggleAllCheck(selectedList: string[]) {
      this.selectGroup = selectedList.length
        ? this.organizations.map((g: Organization) => g.uuid)
        : [];
      if (this.selectGroup.length > 0) {
        this.openBulkPostRuleSettingModal = true;
      } else {
        this.openBulkPostRuleSettingModal = false;
      }
    },
    onClickCheckbox(selectGroup: string[]) {
      this.isAllChecked =
        selectGroup.length === this.organizations.length ? ['default'] : [];
      if (selectGroup.length > 0) {
        this.openBulkPostRuleSettingModal = true;
      } else {
        this.openBulkPostRuleSettingModal = false;
      }
    },
    onOpenBulkGroupPostRuleModal() {
      this.openBulkGroupPostRuleModal = true;
      this.openBulkPostRuleSettingModal = false;
    },
    postRuleWithLabels(
      configRules: object,
      saparator: boolean = true
    ): object[] {
      return this.postRules.map((postRule: object) => {
        const label = this.labelRuleMap[configRules[postRule.value]] ?? '';
        if (saparator) {
          return { ...postRule, label };
        }
        const name = `${postRule.name}（${label}）`;
        return { ...postRule, name };
      });
    },
    alertWithLabels(configAlerts: object, saparator: boolean = true): object[] {
      return this.alerts.map((postRule: object) => {
        const label = this.labelAlertMap[configAlerts[postRule.value]] ?? '';
        if (saparator) {
          return { ...postRule, label };
        }
        const name = `${postRule.name}（${label}）`;
        return { ...postRule, name };
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.company-tabs {
  margin-top: 25px;
}

.no-organizations {
  color: red;
  padding: 30px 0;
}

.tabs {
  margin-top: 28px;
}

.horizontal {
  margin: 16px 0;
  height: 1px;
  background-color: $light_gray_blue_3;
  border: none;
  color: $light_gray_blue_3;
}

.tab {
  height: 36px;
  line-height: 36px;
  width: 160px;
  border: solid 1px #707070;
  border-radius: 6px 6px 0 0;
  padding: 0 20px;
  cursor: pointer;
  outline: none;
  margin-right: 4px;
  background-color: $true_white;
  text-align: center;
  font-size: 14px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;

  &.active {
    background-color: #d1d1d1;
  }
}

.link-box {
  margin-top: 32px;
}

.tab-button {
  color: $gray_blue_4;
  height: 40px;
  line-height: 36px;
  width: 260px;
  border-radius: 6px;
  padding: 0 20px;
  cursor: pointer;
  outline: none;
  margin-right: 4px;
  background-color: $true_white;
  border: solid 1px $light_gray_blue_5;
  text-align: center;
  font-size: 14px;

  &:hover {
    background-color: $light_gray_blue_5;
  }

  &.active {
    background-color: $light_gray_blue_5;
    border: none;
    font-weight: 600;
    color: $dark_blue;
  }
}

.link {
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 4px;
  color: $pink;
}

.contents {
  position: relative;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  height: 100%;
  min-height: 900px;
  background-color: $true_white;
  margin-top: 14px;
  padding: 23px 20px 20px 20px;

  .new-annouce {
    margin: auto;
    width: 600px;
    height: 800px;

    div {
      margin-top: 200px;
    }
  }
}

.company-rules {
  margin-top: 20px;
}

.icon {
  margin-left: 15px;
  height: 16px;
  width: 16px;
}

.content-title {
  color: $dark_blue;
  font-size: 15px;
  line-height: 1;
}

.content-description {
  margin-top: 6px;
  font-size: 12px;
  line-height: 16px;
}

.table-wrapper {
  margin-top: 20px;
  width: 900px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #7e8195;
  }
}

table {
  border: solid 1px $light_gray_blue_3;
  width: 900px;

  .checkbox-header {
    width: 29px;
  }

  .organization-header {
    width: 275px;
  }

  th,
  td {
    border: solid 1px $light_gray_blue_3;
  }

  th {
    color: $gray_blue_4;
    font-size: 13px;
    font-weight: 600;
    background-color: $white_1;
    text-align: center;
    vertical-align: middle;
    padding: 6px;
  }

  td {
    color: $dark_blue;
    background-color: $true_white;
    font-size: 15px;
    vertical-align: middle;
    height: 38px;
    padding: 6px;

    .parent {
      font-size: 11px;
      font-weight: 300;
      color: $gray_blue_1;
      height: 13px;
      line-height: 13px;
    }

    .organization-name {
      height: 30px;
      line-height: 30px;

      &.with-parent {
        height: 18px;
        line-height: 18px;
      }
    }
  }

  .rules {
    width: 130px;
    height: 40px;
  }

  .post-rule {
    width: 130px;
    height: 40px;
  }

  .alert {
    width: 130px;
    height: 40px;
  }

  .member {
    width: 80px;
    height: 40px;
  }

  .organization-member {
    text-align: center;
  }
}

.flex {
  display: flex;
}

.setting-box {
  font-size: 13px;
  color: $dark_blue;
}

.justify-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 25px;
}

.member-button {
  width: 60px;
  border: 1px solid $light_gray_blue_3;
  background-color: $light_gray_blue_4;
  color: $gray_blue_4;
  font-size: 13px;
  font-weight: 600;
  height: 30px;
  border-radius: 50px;
}
</style>
