<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="利用度チェック">
        <template #tutorial>
          <TutorialButtonIcon :url="`/admin/tutorial/analysis-riyoudo.html`" />
        </template>
        <template #description>
          Spotwriteの利用状況を見ることができます。
        </template>
      </page-header>
      <div v-if="companies.length > 0" class="checkbox-row">
        <base-checkbox
          v-model="checkedCompaniesAll"
          value="all"
          label="全てを表示"
          class="checkbox-item"
          @change="handleChangeCompanyAll"
        ></base-checkbox>
        <base-checkbox
          v-for="item in companies"
          :key="item.uuid"
          v-model="checkedCompanies"
          :value="item.uuid"
          :label="item.name"
          class="checkbox-item"
          :disabled="!activeCompanies.includes(item)"
          @change="handleChangeCompany"
        ></base-checkbox>
      </div>

      <div v-if="!isLoading" class="l-contents">
        <div class="contents-top">
          <p class="contents-title">全ユーザー</p>
          <date-select-button
            :select-period-label="selectPeriodLabel"
            @click="toggleSelectPeriodModal"
          />
        </div>
        <div class="category">
          <use-check-button
            v-for="(item, key) in measurementItem"
            :key="key"
            class="use-check-button"
            :name="changeTypeName(key)"
            :count="item"
            :unit="getUnitTextForButton(key)"
            :is-active="active(key)"
            @click="handleChangeUseType(key)"
          ></use-check-button>
        </div>
        <div class="chart-header">
          <p class="chart-title">{{ changeTypeName(checkUseType) }}</p>
          <div class="chart-score">
            <span class="text-pink">{{ measurementItem[checkUseType] }}</span
            >回
          </div>
        </div>
        <chart v-if="chartData.length > 0" :chart-data="chartData"></chart>
        <div v-else class="no-data">表示するデータがありません</div>
        <div v-if="!disableRanking" class="ranking">
          <div class="ranking-header">
            <p class="ranking-header-title">
              利用度平均ランキング 全BOX
            </p>
            <div class="ranking-select">
              <p class="ranking-select-label">BOXで絞り込む：</p>
              <select
                v-model="organizationType"
                class="ranking-select-form"
                @change="handleChangeBox"
              >
                <option
                  v-for="(value, key) in selectBox"
                  :key="key"
                  :value="key"
                >
                  {{ value }}
                </option>
              </select>
            </div>
          </div>
          <div v-if="!isLoadingRanking">
            <div v-if="ranking.length > 0">
              <div
                v-for="(item, index) in ranking"
                :key="item.name"
                class="ranking-row"
              >
                <p class="ranking-number">NO.{{ Number(index) + 1 }}</p>
                <div class="ranking-category">
                  <nuxt-link
                    tag="a"
                    :to="'/admin/analysis/useCheck/organizations/' + item.uuid"
                  >
                    {{ item.name }}
                  </nuxt-link>
                </div>
                <p class="ranking-score">
                  平均{{ item.average }}回 （合計{{ item.total
                  }}{{ changeTypeUnit(checkUseType) }}）
                </p>
                <p class="ranking-arrow">
                  <span v-if="item.fluctuation === 0">-</span>
                  <img
                    v-else
                    :src="fluctuationIcon(item.fluctuation)"
                    alt="fluctuation icon"
                  />
                </p>
              </div>
            </div>
            <div v-else class="no-data">表示するデータがありません</div>
          </div>
        </div>
      </div>
      <vue-loading
        v-if="isLoading"
        type="spin"
        color="#333"
        :size="{ width: '50px', height: '50px' }"
      ></vue-loading>
      <select-period
        v-if="selectPeriodModal"
        @click="toggleSelectPeriodModal"
        @updatePeriodFilter="updatePeriodFilter"
        @updatePeriodComparison="updatePeriodComparison"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Chart } from '@/components/Admin/Pages/';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import { VueLoading } from 'vue-loading-template';
import { SelectPeriod } from '@/components/Admin/Modules/Modal';
import {
  fetchOrganizations,
  fetchUseCheckGraphCompany,
  fetchUseCheckRankingCompany,
  fetchUseCheckTotalCompany,
  fetchUser,
} from '@/libs/api';
import dayjs from '@/libs/dayjs';
import DateSelectButton from '@/components/Admin/Pages/Analysis/DateSelectButton.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';
import UseCheckButton from '~/components/Admin/Modules/Button/UseCheckButton.vue';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    DateSelectButton,
    Chart,
    VueLoading,
    PageHeader,
    SelectPeriod,
    BaseCheckbox,
    UseCheckButton,
    TutorialButtonIcon,
  },
  data() {
    return {
      isLoading: true as boolean,
      isLoadingRanking: false as boolean,
      disableRanking: false as boolean,
      startAt: Number(
        dayjs()
          .subtract(1, 'month')
          .unix()
      ),
      endAt: Number(dayjs().unix()),
      selectCategory: {},
      currentType: 'access_count',
      selectBox: {
        all: '全BOX',
        department: '部署',
        branch: '支店',
        shop: '店舗',
      },
      input: {
        selectBox: 'お選びください',
      },
      companies: [] as any,
      checkedCompanies: [] as any,
      checkedCompaniesAll: ['all'],
      currentId: '1',
      organizationType: '',
      isCheckedCompanyAll: true as boolean,
      average: 0 as number,
      selectPeriodModal: false as boolean,
      selectPeriodLabel: '過去1ヶ月',
      measurementItem: {},
      ranking: [] as any,
      chartData: [] as any,
      checkUseType: 'access_count' as string,
      userAuthorities: {} as Types.UserAuthorities,
    };
  },
  computed: {
    active() {
      return (id: string): boolean => {
        return this.$data.currentType === id;
      };
    },
    categoryImagePath() {
      return (type: string): string => {
        if (this.$data.currentType === type) {
          return `/icon/icon-motivation_${type}_on@2x.png`;
        }
        return `/icon/icon-motivation_${type}_off@2x.png`;
      };
    },
    fluctuationIcon() {
      return (fluctuation: number): string => {
        if (fluctuation > 0) {
          return '/icon/icon_arrow-up@2x.png';
        }
        return '/icon/icon_arrow-down@2x.png';
      };
    },
    activeCompanies() {
      return this.companies.filter(
        (organization: ApiResponse.Organization) =>
          (this.userAuthorities.admin &&
            this.userAuthorities.admin.includes(organization.uuid)) ||
          (this.userAuthorities.read_usage_check &&
            this.userAuthorities.read_usage_check.includes(organization.uuid))
      );
    },
  },
  created() {
    this.fetchAll();
  },
  methods: {
    async fetchOrganizationData() {
      const res = await fetchOrganizations({
        layer: 0,
        key: this.checkUseType,
      });
      this.companies = res.data.organizations;
      this.checkedCompanies = this.activeCompanies.map(
        (organization: ApiResponse.Organization) => organization.uuid
      );
    },
    async fetchUseCheckTotalData() {
      const res = await fetchUseCheckTotalCompany(
        this.startAt,
        this.endAt,
        this.checkedCompanies,
        this.checkUseType
      );
      this.measurementItem = res.data.total;
    },
    async fetchUseCheckGraphData() {
      const res = await fetchUseCheckGraphCompany(
        this.startAt,
        this.endAt,
        this.checkedCompanies,
        this.checkUseType
      );

      this.chartData = [];
      if (res.data.graph.length > 0) {
        this.chartData = res.data.graph.map((graph: ApiResponse.Graph) => {
          const graphDate = dayjs.unix(graph.date);
          return [
            new Date(
              Number(graphDate.format('YYYY')),
              Number(graphDate.format('MM')) - 1,
              Number(graphDate.format('DD'))
            ),
            graph.score,
            `${dayjs.unix(graph.date).format('MM/DD')}\n平均: ${graph.score}`,
            res.data.average.score,
            `${res.data.average.organization_name}の平均: ${res.data.average.score}`,
          ];
        });
        this.chartData.unshift([
          'Month',
          '平均',
          { type: 'string', role: 'tooltip' },
          '全体の平均',
          { type: 'string', role: 'tooltip' },
        ]);
      }
      this.average = res.data.average.score;
      this.isLoading = false;
    },
    async fetchUseCheckRankingData() {
      const res = await fetchUseCheckRankingCompany(
        this.startAt,
        this.endAt,
        this.checkedCompanies,
        this.organizationType === 'all' ? '' : this.organizationType,
        this.checkUseType
      );
      this.ranking = res.data.ranking;
    },
    async handleChangeCompanyAll(data: any) {
      this.isLoading = true;
      this.resetPeriod();
      if (data.length > 0) {
        this.checkedCompanies = this.activeCompanies.map(
          (organization: ApiResponse.Organization) => organization.uuid
        );
        await Promise.all([
          this.fetchUseCheckTotalData(),
          this.fetchUseCheckGraphData(),
          this.fetchUseCheckRankingData(),
        ]);
      } else {
        this.checkedCompanies = [];
      }
      this.disableRanking = false;
      this.isLoading = false;
    },
    async handleChangeCompany() {
      this.isLoading = true;
      this.resetPeriod();
      if (this.activeCompanies.length === this.checkedCompanies.length) {
        this.$set(this.checkedCompaniesAll, 0, 'all');
        await this.fetchAll();
      } else if (this.checkedCompanies.length > 0) {
        this.checkedCompaniesAll = [];
        await Promise.all([
          this.fetchUseCheckTotalData(),
          this.fetchUseCheckGraphData(),
          this.fetchUseCheckRankingData(),
        ]);
      }
      this.disableRanking = false;
      this.isLoading = false;
    },
    async handleChangeBox() {
      this.isLoadingRanking = true;
      await this.fetchUseCheckRankingData();
      this.isLoadingRanking = false;
    },
    async fetchAll() {
      this.isLoading = true;
      if (!this.$accessor.userProfile.is_account_holder) {
        const {
          data: { authorities },
        } = await fetchUser(this.$accessor.userProfile.uuid);
        this.userAuthorities = Object.keys(authorities).reduce(
          (newData: Types.UserAuthorities, authorityKey: string) => {
            const result = { ...newData };
            if (
              authorities[authorityKey] &&
              (authorityKey === 'read_personal_information' ||
                authorities[authorityKey].length)
            ) {
              result[authorityKey] = authorities[authorityKey];
            }
            return result;
          },
          {}
        );
      }
      await this.fetchOrganizationData();
      await Promise.all([
        this.fetchUseCheckTotalData(),
        this.fetchUseCheckGraphData(),
        this.fetchUseCheckRankingData(),
      ]);
      this.disableRanking = false;
      this.isLoading = false;
    },
    async handleChangeUseType(useType: string) {
      this.isLoading = true;
      this.currentType = useType;
      this.checkUseType = useType;
      await this.fetchOrganizationData();
      await Promise.all([
        this.fetchUseCheckTotalData(),
        this.fetchUseCheckGraphData(),
        this.fetchUseCheckRankingData(),
      ]);
      this.disableRanking = false;
      this.isLoading = false;
    },
    toggleSelectPeriodModal() {
      this.selectPeriodModal = !this.selectPeriodModal;
    },
    async updatePeriodFilter(data: any) {
      this.toggleSelectPeriodModal();
      this.startAt = data.startAt;
      this.endAt = data.endAt;
      this.selectPeriodLabel = data.label;
      await this.fetchAll();
    },
    async updatePeriodComparison(data: any) {
      this.toggleSelectPeriodModal();
      this.startAt = data.src.startAt;
      this.endAt = data.src.endAt;
      this.selectPeriodLabel = data.label;
      this.isLoading = true;
      await this.fetchUseCheckTotalData();

      const srcRes = await fetchUseCheckGraphCompany(
        this.startAt,
        this.endAt,
        this.checkedCompanies,
        this.checkUseType
      );

      if (srcRes.data.graph.length > 0) {
        const destRes = await fetchUseCheckGraphCompany(
          data.dest.startAt,
          data.dest.endAt,
          this.checkedCompanies,
          this.checkUseType
        );

        if (destRes.data.graph.length > 0) {
          const res = await fetchUseCheckGraphCompany(
            this.startAt,
            this.endAt,
            this.checkedCompanies,
            this.checkUseType
          );

          this.chartData = [];
          if (res.data.graph.length > 0) {
            this.chartData = res.data.graph.map((graph: ApiResponse.Graph) => {
              const graphDate = dayjs.unix(graph.date);
              return [
                new Date(
                  Number(graphDate.format('YYYY')),
                  Number(graphDate.format('MM')) - 1,
                  Number(graphDate.format('DD'))
                ),
                graph.score,
                `${dayjs.unix(graph.date).format('MM/DD')}\n平均: ${
                  graph.score
                }`,
                res.data.average.score,
                `${res.data.average.organization_name}の平均: ${res.data.average.score}`,
              ];
            });
            this.chartData.unshift([
              'Month',
              '平均',
              { type: 'string', role: 'tooltip' },
              '全体の平均',
              { type: 'string', role: 'tooltip' },
            ]);
          }
        }
        this.average = srcRes.data.average.score;
        this.disableRanking = true;
        this.isLoading = false;
      }
    },
    resetPeriod() {
      this.startAt = dayjs()
        .subtract(1, 'month')
        .unix();
      this.endAt = dayjs().unix();
      this.selectPeriodLabel = '過去1ヶ月';
    },
    changeTypeName(type: string): string {
      let name = '';
      switch (type) {
        case 'access_count':
          name = 'アクセス数';
          break;
        case 'access_rate':
          name = 'アクセス率';
          break;
        case 'post_count':
          name = '記事投稿数';
          break;
        case 'like_receive_count':
          name = '拍手受信数';
          break;
        case 'like_send_count':
          name = '拍手送信数';
          break;
        case 'comment_send_count':
          name = 'コメント受信数';
          break;
        case 'comment_receive_count':
          name = 'コメント送信数';
          break;
        default:
          break;
      }
      return name;
    },
    getUnitTextForButton(type: string): string {
      switch (type) {
        case 'access_rate':
          return '％';
        default:
          return '回';
      }
    },
    changeTypeUnit(type: string): string {
      let name = '';
      switch (type) {
        case 'access_count':
          name = 'アクセス';
          break;
        case 'access_rate':
          name = '回';
          break;
        case 'post_count':
          name = '回';
          break;
        case 'like_receive_count':
          name = '回';
          break;
        case 'like_send_count':
          name = '回';
          break;
        case 'comment_send_count':
          name = '回';
          break;
        case 'comment_receive_count':
          name = '回';
          break;
        default:
          break;
      }
      return name;
    },
  },
});
</script>

<style lang="scss" scoped>
.checkbox-row {
  display: flex;
  flex-flow: wrap;
  background-color: $true_white;
  margin: 30px 0 0 0;
  padding: 0 0 16px 16px;
  border-radius: 4px;
  border: 1px solid $light_gray_blue_3;
}

.checkbox-item {
  margin: 16px 25px 0 0;
}

.contents-top {
  display: flex;
  justify-content: space-between;
  margin: 6px 0 0 0;
}

.contents-title {
  font-size: 15px;
  font-weight: bold;
  margin: 4px 0 0 0;
}

.category {
  display: flex;
  margin: 25px 0 0 0;
  padding: 0 0 15px 0;
  border-bottom: 1px solid $light_gray_blue_3;
}

.category-count {
  font-size: 13px;
  margin: 0 0 5px;
  line-height: 1;

  .category-count__name {
    font-weight: bold;
  }
}

.text-pink {
  color: $pink;
  font-size: 15px;
  font-family: 'Lato', sans-serif;
  padding-right: 5px;
}

.chart-header {
  display: flex;
  align-items: center;
  margin: 15px 0 0 0;
}

.chart-title {
  font-size: 13px;
  font-weight: bold;
  margin: 0 16px 0 0;
}

.chart-score {
  font-size: 12px;
  background-color: $white_1;
  border-radius: 6px;
  height: 38px;
  line-height: 38px;
  padding: 0 20px;
}

.no-data {
  text-align: center;
  margin: 90px 0;
}

.ranking {
  border-radius: 8px;
  background-color: $white_1;
  padding: 10px 20px 20px 20px;
  margin: 10px 0 0 0;
}

.ranking-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 24px 0;
}

.ranking-header-title {
  font-size: 13px;
  font-weight: bold;
  color: $gray_blue_4;
}

.ranking-select {
  display: flex;
  align-items: center;
}

.ranking-select-label {
  font-size: 13px;
  font-weight: bold;
  color: #666;
}

.ranking-select-form {
  width: 150px;
  height: 30px;
  font-size: 13px;
  padding: 0 0 0 4px;
  background-color: $extra_light_gray;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
}

.ranking-row {
  display: flex;
  align-items: center;
  margin: 0 0 10px 0;
  padding: 5px 0;
  background-color: $true_white;
  border-radius: 4px;

  &:last-of-type {
    margin: 0 0 0 0;
  }
}

.ranking-number {
  width: 62px;
  padding: 9px 0 8px 0;
  font-weight: bold;
  font-size: 13px;
  line-height: 1;
  text-align: center;
  border-right: 1px solid $light_gray_blue_3;
}

.ranking-category {
  width: 210px;
  font-size: 15px;
  color: $pink;
  padding: 8px 0 7px 15px;
  line-height: 1;
  border-right: 1px solid $light_gray_blue_3;
}

.ranking-category > a {
  color: $pink;

  &:hover {
    color: $pink_hover;
  }
}

.ranking-score {
  width: 540px;
  font-size: 15px;
  padding: 8px 0 7px 15px;
  line-height: 1;
  border-right: 1px solid $light_gray_blue_3;
}

.ranking-arrow {
  padding: 7px 0 7px 15px;
  line-height: 1;
}

.use-check-button {
  margin-right: 12px;

  &:last-of-type {
    margin: 0;
  }
}
</style>
