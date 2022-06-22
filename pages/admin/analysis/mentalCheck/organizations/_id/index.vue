<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="モチベーションチェック">
        <template #tutorial>
          <TutorialButtonIcon
            :url="`/admin/tutorial/analysis-motivation-relactive.html`"
          />
        </template>
        <template #description>
          メンバーのモチベーション状況を見ることができます。
        </template>
      </page-header>
      <div v-if="!isLoading" class="l-contents">
        <div class="contents-top">
          <div>
            <div class="type-tag-counters">
              <div
                v-if="selfOrganizationType === 'department'"
                class="type-tag-counter"
              >
                <span class="type-tag type-tag--department">
                  {{ selectBox[selfOrganizationType] }}
                </span>
                <span class="type-tag-counter__count">
                  <div class="company-name">
                    {{ organizationsCompanyName }}
                  </div>
                  <span class="organization-name">
                    {{ selfOrganizationName }}
                  </span>
                </span>
              </div>
              <div
                v-if="selfOrganizationType === 'branch'"
                class="type-tag-counter"
              >
                <span class="type-tag type-tag--branch">
                  {{ selectBox[selfOrganizationType] }}
                </span>
                <span class="type-tag-counter__count">
                  <div class="company-name">
                    {{ organizationsCompanyName }}<br />
                    {{ organizationsParentName }}
                    <span class="branch-name">
                      {{ selfOrganizationName }}
                    </span>
                  </div>
                </span>
              </div>
              <div
                v-if="selfOrganizationType === 'shop'"
                class="type-tag-counter"
              >
                <span class="type-tag type-tag--shop">
                  {{ selectBox[selfOrganizationType] }}
                </span>
                <span class="type-tag-counter__count">
                  <div class="company-name">
                    {{ organizationsCompanyName }}
                  </div>
                  <span class="organization-name">
                    {{ selfOrganizationName }}
                  </span>
                </span>
              </div>
              <div
                v-if="selfOrganizationType === 'management'"
                class="type-tag-counter"
              >
                <span class="type-tag type-tag--management">
                  {{ selectBox[selfOrganizationType] }}
                </span>
                <span class="type-tag-counter__count">
                  <div class="company-name">
                    {{ organizationsCompanyName }}
                  </div>
                  <span class="organization-name">
                    {{ selfOrganizationName }}
                  </span>
                </span>
              </div>
              <div
                v-if="selfOrganizationType === 'other'"
                class="type-tag-counter"
              >
                <span class="type-tag type-tag--other">
                  {{ selectBox[selfOrganizationType] }}
                </span>
                <span class="type-tag-counter__count">
                  <div class="company-name">
                    {{ organizationsCompanyName }}
                  </div>
                  <span class="organization-name">
                    {{ selfOrganizationName }}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <date-select-button
            :select-period-label="selectPeriodLabel"
            @click="toggleSelectPeriodModal"
          />
        </div>
        <div class="category">
          <div
            v-for="(item, key) in measurementItem"
            :key="key"
            class="category-item"
          >
            <img :src="categoryImagePath(key)" class="category-img" />
            <div class="category-count">
              <span class="text-pink"> {{ item }} </span>回
            </div>
          </div>
        </div>
        <div class="chart-header">
          <p class="chart-title">モチベーション分析</p>
          <div class="chart-score">
            平均<span class="text-pink">{{ average }}</span
            >点
          </div>
        </div>
        <chart v-if="chartData.length > 0" :chart-data="chartData"></chart>
        <div v-else class="no-data">表示するデータがありません</div>
        <div v-if="!disableRanking" class="ranking">
          <div class="ranking-header">
            <p class="ranking-header-title">
              モチベーション平均点ランキング 全BOX
            </p>
            <div class="ranking-select">
              <p class="ranking-select-label">絞り込み：役職</p>
              <select
                v-model="employmentPositionId"
                class="ranking-select-form first-form"
                @change="handleChangeBox"
              >
                <option
                  v-for="position in selectEmploymentPosition"
                  :key="position.uuid"
                  :value="position.uuid"
                >
                  {{ position.name }}
                </option>
              </select>
              <p class="ranking-select-label">雇用形態</p>
              <select
                v-model="employmentStatusId"
                class="ranking-select-form"
                @change="handleChangeBox"
              >
                <option
                  v-for="status in selectEmploymentStatus"
                  :key="status.uuid"
                  :value="status.uuid"
                >
                  {{ status.name }}
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
                    v-if="userAuthorities.read_personal_information"
                    tag="a"
                    :to="childrenLink(item.uuid)"
                  >
                    {{ item.name }}
                  </nuxt-link>
                  <span v-else>{{ item.name }}</span>
                </div>
                <p class="ranking-score">{{ item.average }}点</p>
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
          <vue-loading
            v-if="isLoadingRanking"
            type="spin"
            color="#333"
            :size="{ width: '50px', height: '50px' }"
          ></vue-loading>
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
import dayjs from '@/libs/dayjs';
import {
  fetchMentalCheckTotalOrganization,
  fetchMentalCheckGraphOrganization,
  fetchMentalCheckRankingChildren,
  fetchOrganizationPositions,
  fetchOrganizationsEmploymentStatuses,
  fetchUser,
} from '@/libs/api';
import { VueLoading } from 'vue-loading-template';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import { SelectPeriod } from '@/components/Admin/Modules/Modal';
import DateSelectButton from '@/components/Admin/Pages/Analysis/DateSelectButton.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    DateSelectButton,
    Chart,
    VueLoading,
    PageHeader,
    SelectPeriod,
    TutorialButtonIcon,
  },
  data() {
    return {
      isLoading: true as boolean,
      isLoadingRanking: false as boolean,
      disableRanking: false as boolean,
      organizationType: '',
      employmentPositionId: '',
      selectEmploymentPosition: [] as any,
      employmentStatusId: '',
      selectEmploymentStatus: [] as any,
      startAt: Number(
        dayjs()
          .subtract(1, 'month')
          .unix()
      ),
      endAt: Number(dayjs().unix()),
      selectCategory: {},
      selectBox: {
        all: '全BOX',
        department: '部署',
        branch: '支店',
        shop: '店舗',
        management: '経営陣',
        other: 'その他',
      },
      measurementItem: {},
      ranking: [] as any,
      chartData: [] as any,
      average: 0 as number,
      organizations: {} as any,
      companyUuid: '' as string,
      selfOrganizationType: '',
      selfOrganizationLayer: '',
      selfOrganizationName: '',
      organizationsChildrenName: '',
      organizationsCompanyName: '',
      organizationsParentName: '',
      selectPeriodModal: false as boolean,
      selectPeriodLabel: '過去1ヶ月',
      userAuthorities: {} as Types.UserAuthorities,
    };
  },
  computed: {
    categoryImagePath() {
      return (type: string): string => {
        return `/icon/icon-motivation_${type}_off@2x.png`;
      };
    },
    uuid(): string {
      return this.$route.params.id;
    },
    childrenLink() {
      return (uuid: string): string => {
        return `/admin/analysis/mentalCheck/employees/${uuid}`;
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
  },
  created() {
    this.fetchAll();
  },
  methods: {
    async fetchMentalCheckTotalData() {
      const res = await fetchMentalCheckTotalOrganization(
        this.startAt,
        this.endAt,
        this.uuid
      );
      this.measurementItem = res.data.total;
      this.organizations = res.data.organizations;
      this.companyUuid = res.data.company_uuid;
      this.selfOrganizationType = res.data.organization_type;
      this.selfOrganizationLayer = res.data.organization_layer;

      switch (this.selfOrganizationLayer) {
        case 'children':
          this.selfOrganizationName = this.organizations.children;
          break;
        case 'company':
          this.selfOrganizationName = this.organizations.company;
          break;
        case 'parent':
          this.selfOrganizationName = this.organizations.children;
          break;
        default:
          break;
      }
      if (this.organizations) {
        this.organizationsChildrenName = this.organizations.children;
        this.organizationsCompanyName = this.organizations.company;
        this.organizationsParentName = this.organizations.parent;
      }
    },
    async fetchMentalCheckGraphData() {
      const res = await fetchMentalCheckGraphOrganization(
        this.startAt,
        this.endAt,
        this.uuid
      );

      this.chartData = [];
      if (res.data.graph.length > 0) {
        const scoreArray = res.data.average
          .map((average: ApiResponse.Average) => {
            return [
              average.score,
              `${average.organization_name}の平均点: ${average.score}`,
            ];
          })
          .flat();

        this.chartData = res.data.graph.map((graph: ApiResponse.Graph) => {
          const graphDate = dayjs.unix(graph.date);
          return [
            new Date(
              Number(graphDate.format('YYYY')),
              Number(graphDate.format('MM')) - 1,
              Number(graphDate.format('DD'))
            ),
            graph.score,
            `${dayjs.unix(graph.date).format('MM/DD')}\n平均点: ${graph.score}`,
            ...scoreArray,
          ];
        });

        const nameArray = res.data.average
          .map((average: ApiResponse.Average) => {
            return [
              `${average.organization_name}の平均点`,
              { type: 'string', role: 'tooltip' },
            ];
          })
          .flat();

        nameArray.unshift('Month', '日別の平均点', {
          type: 'string',
          role: 'tooltip',
        });
        this.chartData.unshift(nameArray);
      }
      this.average = res.data.average.slice(-1)[0].score;
      this.isLoading = false;
    },
    async fetchMentalCheckRankingData() {
      const { data } = await fetchMentalCheckRankingChildren(
        this.startAt,
        this.endAt,
        this.uuid,
        this.employmentPositionId,
        this.employmentStatusId
      );
      this.ranking = data.ranking;
    },
    async fetchRankingSelectBox() {
      // 役職一覧を取得する
      const positionResponse = await fetchOrganizationPositions();
      this.selectEmploymentPosition = positionResponse.data;
      // 雇用形態一覧を取得する
      const statusResponse = await fetchOrganizationsEmploymentStatuses();
      this.selectEmploymentStatus = statusResponse.data;
    },
    async handleChangeBox() {
      this.isLoadingRanking = true;
      await this.fetchMentalCheckRankingData();
      this.isLoadingRanking = false;
    },
    async fetchAll() {
      this.isLoading = true;
      await this.fetchMentalCheckTotalData();
      if (!this.$accessor.userProfile.is_account_holder) {
        const {
          data: { authorities },
        } = await fetchUser(this.$accessor.userProfile.uuid);
        this.userAuthorities = authorities;
        if (
          !this.userAuthorities.read_motivation_analytics ||
          !this.userAuthorities.read_motivation_analytics.includes(
            this.companyUuid
          )
        ) {
          this.$router.push({ path: '/admin/analysis/mentalCheck' });
        }
      } else {
        this.$router.push({ path: '/admin/analysis/mentalCheck' });
      }
      await Promise.all([
        this.fetchMentalCheckGraphData(),
        this.fetchMentalCheckRankingData(),
        this.fetchRankingSelectBox(),
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
      await this.fetchMentalCheckTotalData();

      const srcRes = await fetchMentalCheckGraphOrganization(
        this.startAt,
        this.endAt,
        this.uuid
      );

      this.chartData = [];
      if (srcRes.data.graph.length > 0) {
        const destRes = await fetchMentalCheckGraphOrganization(
          data.dest.startAt,
          data.dest.endAt,
          this.uuid
        );

        if (destRes.data.graph.length > 0) {
          this.chartData = srcRes.data.graph.map((graph: ApiResponse.Graph) => {
            return [
              dayjs.unix(graph.date).format('MM/DD'),
              graph.score,
              `${dayjs.unix(graph.date).format('MM/DD')}\n平均点: ${
                graph.score
              }`,
            ];
          });

          this.chartData = this.chartData.map((item: any, index: number) => {
            return [
              ...item,
              destRes.data.graph[index].score,
              `${dayjs
                .unix(destRes.data.graph[index].date)
                .format('MM/DD')}\n比較期間の平均点: ${
                destRes.data.graph[index].score
              }`,
            ];
          });
          this.chartData.unshift([
            'Month',
            '平均点',
            { type: 'string', role: 'tooltip' },
            '比較期間の平均点',
            { type: 'string', role: 'tooltip' },
          ]);
        }
      }
      this.average = srcRes.data.average.slice(-1)[0].score;
      this.disableRanking = true;
      this.isLoading = false;
    },
  },
});
</script>

<style lang="scss" scoped>
$color_department: $blue;
$color_branch: $light_blue_green_1;
$color_shop: $purple_1;
$color_management: $wild_blue_yonder;
$color_null: $gray_blue_1;
$color_other: $hopbush;

.contents-top {
  display: flex;
  justify-content: space-between;
  margin: 6px 0 0 0;
}

.contents-title {
  font-size: 15px;
  font-weight: bold;
  margin: 7px 0 0 0;
}

.category {
  display: flex;
  margin: 25px 0 0 0;
  padding: 0 0 15px 0;
  border-bottom: 1px solid $light_gray_blue_3;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 140px;
  height: 60px;
  margin: 0 12px 0 0;
  border-radius: 6px;
  background-color: $true_white;
  border: 1px solid $light_gray_blue_3;

  &:last-of-type {
    margin: 0 0 0 0;
  }
}

.category-img {
  width: 48px;
  height: 48px;
  margin: 0 0 0 4px;
}

.category-count {
  font-size: 12px;
  margin: 0 0 0 5px;
}

.text-pink {
  color: $pink;
  font-size: 15px;
  font-family: 'Lato', sans-serif;
  padding: 0 5px 0 5px;
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
  margin: 0 0 0 10px;

  &.first-form {
    margin: 0 20px 0 10px;
  }
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

.type-tag {
  &--department {
    background-color: $color_department;
  }

  &--branch {
    background-color: $color_branch;
  }

  &--shop {
    background-color: $color_shop;
  }

  &--management {
    background-color: $color_management;
  }

  &--other {
    background-color: $color_other;
  }

  &--null {
    background-color: $color_null;
  }
}

.type-tag-counters {
  display: flex;
  align-items: center;
  background-color: $true_white;
  border-radius: 6px;
  width: 100%;
  height: 24px;
  margin-bottom: 15px;

  &__title {
    font-size: 14px;
    margin-right: 20px;
  }

  .type-tag {
    padding: 6px 8px;
    margin-right: 10px;
    font-size: 13px;
    color: $true_white;
    font-weight: bold;
    border-radius: 4px;
    line-height: 1;
  }

  .type-tag-counter {
    display: flex;
    align-items: center;
  }

  .type-tag-counter__count {
    margin-right: 20px;
    font-weight: bold;
    vertical-align: middle;
    line-height: 1;
  }

  .company-name {
    font-size: 11px;
    line-height: 1;
    color: #9c9da5;
    margin-bottom: 2px;
  }

  .organization-name {
    font-size: 15px;
  }

  .branch-name {
    font-size: 15px;
    font-weight: bold;
    color: #2e303e;
  }
}
</style>
