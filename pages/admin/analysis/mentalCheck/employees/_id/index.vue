<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="モチベーションチェック">
        <template #description>
          メンバーのモチベーション状況を見ることができます。
        </template>
      </page-header>
      <div v-if="!isLoading" class="l-contents">
        <div class="contents-top">
          <div class="profile">
            <img class="profile-image" :src="userIcon" />
            <div class="organization">
              <div class="profile-name">{{ userName }}</div>
              <span
                v-for="(organization, key) in organizations"
                :key="key"
                class="profile-organization"
              >
                {{ organization }}
              </span>
              <div class="access">最終アクセス {{ lastAccess }}日前</div>
            </div>
          </div>
          <date-select-button
            :select-period-label="selectPeriodLabel"
            @click="toggleSelectPeriodModal"
          />
        </div>
        <div class="category">
          <div class="category-item">
            <div class="category-header">モチベーション分析</div>
            <div class="category-score">
              平均<span class="text-pink">{{ average }}</span
              >点
            </div>
          </div>
        </div>
        <div class="chart-header">
          <p class="chart-title">モチベーション分析</p>
          <div class="chart-score">
            平均<span class="text-pink">{{ average }}</span
            >点：前同期間比<span class="text-pink">{{ fluctuation }}%</span>
          </div>
        </div>
        <chart v-if="chartData.length > 0" :chart-data="chartData"></chart>
        <div v-else class="no-data">表示するデータがありません</div>
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
import DateSelectButton from '@/components/Admin/Pages/Analysis/DateSelectButton.vue';
import dayjs from '@/libs/dayjs';
import {
  fetchMentalCheckTotalUser,
  fetchMentalCheckGraphUser,
  fetchUser,
} from '@/libs/api';
import { VueLoading } from 'vue-loading-template';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import { SelectPeriod } from '@/components/Admin/Modules/Modal';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    Chart,
    VueLoading,
    PageHeader,
    SelectPeriod,
    DateSelectButton,
  },
  data() {
    return {
      isLoading: true as boolean,
      startAt: Number(
        dayjs()
          .subtract(1, 'month')
          .unix()
      ),
      endAt: Number(dayjs().unix()),
      chartData: [] as any,
      average: 0 as number,
      fluctuation: 0 as number,
      userName: '' as string,
      userIcon: '' as string,
      lastAccess: 0 as number,
      organizations: {} as any,
      companyUuid: '' as string,
      selectPeriodModal: false as boolean,
      selectPeriodLabel: '過去1ヶ月',
    };
  },
  computed: {
    uuid(): string {
      return this.$route.params.id;
    },
  },
  created() {
    this.fetchAll();
  },
  methods: {
    async fetchMentalCheckTotalUserData() {
      const res = await fetchMentalCheckTotalUser(
        this.startAt,
        this.endAt,
        this.uuid
      );
      this.average = res.data.average;
      this.fluctuation = res.data.fluctuation;
      this.userName = res.data.name;
      this.userIcon = res.data.user_icon;
      this.lastAccess = res.data.last_access;
      this.organizations = res.data.organizations;
      this.companyUuid = res.data.company_uuid;
    },
    async fetchMentalCheckGraphUserData() {
      const res = await fetchMentalCheckGraphUser(
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
            `${dayjs.unix(graph.date).format('MM/DD')}\nスコア: ${graph.score}`,
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

        nameArray.unshift('Month', '日別のスコア', {
          type: 'string',
          role: 'tooltip',
        });
        this.chartData.unshift(nameArray);
      }
      this.average = res.data.average.slice(-1)[0].score;
    },
    async fetchAll() {
      this.isLoading = true;
      await this.fetchMentalCheckTotalUserData();
      if (!this.$accessor.userProfile.is_account_holder) {
        const {
          data: { authorities },
        } = await fetchUser(this.$accessor.userProfile.uuid);
        if (
          !authorities.read_motivation_analytics ||
          !authorities.read_motivation_analytics.includes(this.companyUuid)
        ) {
          this.$router.push({ path: '/admin/analysis/mentalCheck' });
        }
      } else {
        this.$router.push({ path: '/admin/analysis/mentalCheck' });
      }
      await this.fetchMentalCheckGraphUserData();
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
      await this.fetchMentalCheckTotalUserData();

      const srcRes = await fetchMentalCheckGraphUser(
        this.startAt,
        this.endAt,
        this.uuid
      );

      this.chartData = [];
      if (srcRes.data.graph.length > 0) {
        const destRes = await fetchMentalCheckGraphUser(
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
      this.isLoading = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.contents-top {
  display: flex;
  justify-content: space-between;
  padding: 0 0 15px 0;
  border-bottom: 1px solid $light_gray_blue_3;
  margin: 6px 0 0 0;
}

.profile {
  display: flex;
}

.profile-image {
  width: 64px;
}

.organization {
  margin: 0 0 0 15px;
}

.profile-name {
  font-size: 15px;
  font-weight: bold;
  line-height: 1;
}

.profile-organization {
  font-size: 13px;
  line-height: 1;
  color: $gray_blue_1;
  margin: 2px 0 0 0;
}

.access {
  font-size: 13px;
  line-height: 1;
  margin: 15px 0 0 0;
}

.category {
  margin: 15px 0 0 0;
  padding: 0 0 15px 0;
  border-bottom: 1px solid $light_gray_blue_3;
}

.category-item {
  width: 140px;
  height: 52px;
  border-radius: 4px;
  border: 1px solid $light_gray_blue_3;
  background-color: $true_white;
}

.category-header {
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  margin: 10px 0 0 0;
}

.category-score {
  font-size: 12px;
  margin: 6px 0 0 0;
  text-align: center;
  line-height: 1;
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
</style>
