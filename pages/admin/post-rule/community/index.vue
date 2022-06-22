<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="投稿ルール一覧・設定">
        <template #tutorial>
          <TutorialButtonIcon
            :url="`/admin/tutorial/postingrules-list-community.html`"
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
          class="tab-button"
        >
          会社、組織（BOX）
        </nuxt-link>
        <nuxt-link
          tag="button"
          to="/admin/post-rule/community/"
          class="tab-button active"
        >
          コミュニティ
        </nuxt-link>
      </div>

      <div class="contents">
        <div class="flex align-items-center">
          <h2 class="content-title">コミュニティの基本投稿ルール</h2>
          <img class="icon" src="/icon/icon_help-outline.png" />
          <span class="link" @click="openRuleTableModal = true"
            >権限について</span
          >
        </div>
        <div class="content-description">
          全コミュニティの基本の投稿ルールを設定します。
          <br />コミュニティや個人で別に設定したい場合は、下の一覧から個別に設定を変更できます。
        </div>
        <table border class="company-rules">
          <tr>
            <th class="rules">コミュニティニュース</th>
          </tr>
          <tr>
            <td>
              <base-select
                v-model="ownerRule.community_team_episode"
                :items="postRuleWithLabels(configRules.my_episode)"
                @input="updateOwnerRule()"
              />
            </td>
          </tr>
        </table>

        <hr class="horizontal" />

        <div class="inner-content">
          <div class="flex justify-between">
            <h2 class="content-title">コミュニティごとの投稿ルール一覧</h2>
            <div class="setting-box">
              <base-button @click="openBulkBasicPostRuleModal = true">
                全て基本投稿ルールに戻す
              </base-button>
            </div>
          </div>

          <table v-if="!isLoading" class="community-table" border>
            <tr>
              <th class="checkbox-header">
                <base-checkbox
                  v-model="isAllChecked"
                  @change="toggleAllCheck"
                />
              </th>
              <th class="community-header">コミュニティ</th>
              <th class="rules">コミュニティニュース</th>
              <th class="member">メンバー<br />個別設定</th>
            </tr>
            <tr v-for="community in communities" :key="community.uuid">
              <td>
                <base-checkbox
                  v-model="selectGroup"
                  :value="community.uuid"
                  @change="onClickCheckbox"
                />
              </td>
              <td>
                <div class="community-name">{{ community.name }}</div>
              </td>
              <td>
                <select-box
                  v-model="community.community_team_episode"
                  :items="
                    postRuleWithLabels(
                      configRules.community_team_episode,
                      false
                    )
                  "
                  @input="updateCommunityRule(community)"
                />
              </td>
              <td>
                <button
                  @click="openCommunityPostRule(community.uuid, community.name)"
                >
                  設定
                </button>
              </td>
            </tr>
          </table>

          <base-pagination
            v-model="pagination"
            @go-to-page="goToPage($event)"
          ></base-pagination>

          <vue-loading
            v-if="isLoading"
            type="spin"
            color="#333"
            :size="{ width: '50px', height: '50px' }"
          ></vue-loading>
        </div>

        <CommunityPostRuleModal
          v-if="openCommunityPostRuleModal"
          :uuid="communityUserRuleUuid"
          :community-name="communityName"
          :config-rules="configRules"
          @onClose="openCommunityPostRuleModal = false"
        />
        <BulkCommunityPostRuleModal
          v-if="openBulkCommunityPostRuleModal"
          :config-rules="configRules"
          @onClose="openBulkCommunityPostRuleModal = false"
          @onSubmit="handleBulkSubmit"
        />
        <BulkCommunityPostRuleSettingModal
          v-if="openBulkCommunityPostRuleSettingModal"
          @onClose="openBulkCommunityPostRuleSettingModal = false"
          @onOpen="onOpenBulkCommunityPostRuleModal()"
        />
        <CommunityRuleTableModal
          v-if="openRuleTableModal"
          :config-rules="configRules"
          @onClose="openRuleTableModal = false"
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
  BulkCommunityPostRuleModal,
  BulkCommunityPostRuleSettingModal,
  CommunityPostRuleModal,
  CommunityRuleTableModal,
  BulkBasicPostRuleModal,
} from '@/components/Admin/Pages/';
import {
  fetchCommunityRule,
  fetchConfigRules,
  fetchOwnerRule,
  resetAllCommunityRules,
  updateCommunityRule,
  updateOwnerRule,
} from '@/libs/api';
import { VueLoading } from 'vue-loading-template';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import BasePagination from '@/components/Admin/Modules/Pagination/BasePagination.vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';
import SelectBox from '@/components/Admin/Pages/PostRule/SelectBox.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';

type selectGroup = string[];
type Interval = 'normal' | 'slowly' | 'frequent';
type Rule = {
  community_team_episode: Interval;
};

type Pagination = {
  number: number;
  offset: number;
  limit: number;
  total: number;
};

export default Vue.extend({
  layout: 'admin/default',
  components: {
    CommunityPostRuleModal,
    CommunityRuleTableModal,
    BulkCommunityPostRuleModal,
    BulkCommunityPostRuleSettingModal,
    BulkBasicPostRuleModal,
    VueLoading,
    PageHeader,
    BasePagination,
    BaseCheckbox,
    BaseButton,
    BaseSelect,
    SelectBox,
    TutorialButtonIcon,
  },
  async asyncData({ error }: any) {
    try {
      const configRules = await fetchConfigRules();
      const ownerRule = await fetchOwnerRule();

      return {
        configRules: configRules.data,
        ownerRule: ownerRule.data,
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
      communityUserRuleUuid: '',
      openBulkCommunityPostRuleModal: false,
      openCommunityPostRuleModal: false,
      openBulkCommunityPostRuleSettingModal: false,
      openRuleTableModal: false,
      openBulkBasicPostRuleModal: false,
      communityList: [] as ApiResponse.CommunityRule[],
      selectGroup: [] as selectGroup,
      limit: 20 as number,
      offset: 0 as number,
      page: 1 as number,
      totalCount: 0 as number,
      communityName: '',
      configRules: {} as ApiResponse.ConfigRules,
      ownerRule: {} as ApiResponse.OwnerRule,
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
      labelRuleMap: {
        three_months: '3ヶ月',
        month: '1ヶ月',
        week: '一週間',
        two_years: '2年',
        year: '1年',
        six_months: '6ヶ月',
      } as { [key: string]: string },
    };
  },
  computed: {
    pagination: {
      set(value: Pagination) {
        this.page = value.number;
        this.offset = value.offset;
      },
      get(): Pagination {
        return {
          number: this.page,
          offset: this.offset,
          limit: this.limit,
          total: this.totalCount,
        };
      },
    },
    isChecked(): boolean {
      return !!this.selectGroup.length;
    },
    communities: {
      get(): ApiResponse.CommunityRule[] {
        return this.communityList;
      },
      set(value: ApiResponse.CommunityRule[]) {
        this.communityList = value;
      },
    },
  },
  async created() {
    await this.refresh();
  },
  methods: {
    async refresh() {
      this.isLoading = true;
      this.communities = [];
      const { data } = await fetchCommunityRule({
        limit: this.limit,
        offset: this.offset,
      });
      this.communities = data.rules;
      this.totalCount = data.total_count;
      this.isLoading = false;
    },
    async goToPage(page: number) {
      this.offset = this.limit * (page - 1);
      await this.refresh();
      this.selectGroup = [];
      this.isAllChecked = [];
      this.openBulkCommunityPostRuleSettingModal = false;
      this.page = page;
    },
    openCommunityPostRule(uuid: string, communityName: string) {
      this.openCommunityPostRuleModal = true;
      this.communityUserRuleUuid = uuid;
      this.communityName = communityName;
    },
    async handleBulkSubmit(rule: Rule) {
      const rules = this.communities
        .filter((o: ApiResponse.CommunityRule) =>
          this.selectGroup.find((id: string) => o.uuid === id)
        )
        .map((o: ApiResponse.CommunityRule) => {
          return { ...rule, uuid: o.uuid };
        });
      await updateCommunityRule({ rules });
      this.refresh();
      this.selectGroup.splice(0);
      this.isAllChecked = [];
      this.openBulkCommunityPostRuleModal = false;
    },
    async handleBulkBasicSubmit() {
      await resetAllCommunityRules();
      this.openBulkBasicPostRuleModal = false;
      this.refresh();
      this.selectGroup.splice(0);
      this.isAllChecked = [];
    },
    updateOwnerRule() {
      try {
        updateOwnerRule({
          ...this.ownerRule,
        });
      } catch (error) {
        console.error(error);
      }
    },
    updateCommunityRule(community: ApiResponse.CommunityRule) {
      try {
        const rules = [community];
        updateCommunityRule({ rules });
      } catch (error) {
        console.error(error);
      }
    },
    toggleAllCheck(selectedList: string[]) {
      this.selectGroup = selectedList.length
        ? this.communities.map((g: { uuid: string }) => g.uuid)
        : [];
      if (this.selectGroup.length > 0) {
        this.openBulkCommunityPostRuleSettingModal = true;
      } else {
        this.openBulkCommunityPostRuleSettingModal = false;
      }
    },
    onClickCheckbox(selectGroup: string[]) {
      this.isAllChecked =
        selectGroup.length === this.communities.length ? ['default'] : [];
      if (selectGroup.length > 0) {
        this.openBulkCommunityPostRuleSettingModal = true;
      } else {
        this.openBulkCommunityPostRuleSettingModal = false;
      }
    },
    onOpenBulkCommunityPostRuleModal() {
      this.openBulkCommunityPostRuleModal = true;
      this.openBulkCommunityPostRuleSettingModal = false;
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
  },
});
</script>

<style lang="scss" scoped>
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

.inner-content {
  width: 600px;
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

table {
  border: solid 1px $light_gray_blue_3;

  .checkbox-header {
    width: 29px;
  }

  .community-header {
    width: 300px;
  }

  .member {
    width: 70px;
    height: 40px;
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

    button {
      border: none;
      background-color: $light_gray_blue_4;
      color: $gray_blue_4;
      font-size: 13px;
      font-weight: 600;
      padding: 0 15px;
      height: 30px;
      border-radius: 50px;
    }

    .community-name {
      height: 30px;
      line-height: 30px;
    }
  }

  .rules {
    width: 200px;
    height: 40px;
  }
}

.flex {
  display: flex;
}

.setting-box {
  font-size: 13px;
  color: $dark_blue;
}

.grow {
  flex-grow: 1;
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

.community-table {
  width: 100%;
  margin-top: 20px;
}

.horizontal {
  margin: 16px 0;
  height: 1px;
  background-color: $light_gray_blue_3;
  border: none;
  color: $light_gray_blue_3;
}
</style>
