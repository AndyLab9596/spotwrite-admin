<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="利用度チェック">
        <template #description>
          Spotwriteの利用状況を見ることができます。
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
            >回：前同期間比<span class="text-pink">{{ fluctuation }}%</span>
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
import { VueLoading } from 'vue-loading-template';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import { SelectPeriod } from '@/components/Admin/Modules/Modal';
import {
  fetchUseCheckGraphUser,
  fetchUseCheckTotalUser,
  fetchUser,
} from '@/libs/api';
import dayjs from '@/libs/dayjs';
import DateSelectButton from '@/components/Admin/Pages/Analysis/DateSelectButton.vue';
import UseCheckButton from '~/components/Admin/Modules/Button/UseCheckButton.vue';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    DateSelectButton,
    Chart,
    VueLoading,
    PageHeader,
    SelectPeriod,
    UseCheckButton,
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
      average: 3.3 as number,
      fluctuation: 0 as number,
      userName: 'ユーザ' as string,
      userIcon: '' as string,
      lastAccess: 0 as number,
      organizations: {
        company: '\u30B5\u30F3\u30D7\u30EB\u4F1A\u793EA',
        parent: '\u90E8\u7F72A-1',
        children: '\u652F\u5E97A-1-b',
      } as any,
      companyUuid: '' as string,
      selectPeriodModal: false as boolean,
      selectPeriodLabel: '過去1ヶ月',
      measurementItem: {},
      checkUseType: 'access_count' as string,
      currentType: 'access_count',
    };
  },
  computed: {
    active() {
      return (id: string): boolean => {
        return this.$data.currentType === id;
      };
    },
    uuid(): string {
      return this.$route.params.id;
    },
  },
  created() {
    this.fetchAll();
  },
  methods: {
    async fetchUseCheckTotalUserData() {
      const res = await fetchUseCheckTotalUser(
        this.startAt,
        this.endAt,
        this.uuid,
        this.checkUseType
      );
      this.measurementItem = res.data.total;
      this.average = res.data.average;
      this.fluctuation = res.data.fluctuation;
      this.userName = res.data.name;
      this.userIcon = res.data.user_icon;
      this.lastAccess = res.data.last_access;
      this.organizations = res.data.organizations;
      this.companyUuid = res.data.company_uuid;
    },
    async fetchUseCheckGraphUserData() {
      const res = await fetchUseCheckGraphUser(
        this.startAt,
        this.endAt,
        this.uuid,
        this.checkUseType
      );

      this.chartData = [];
      if (res.data.graph.length > 0) {
        const scoreArray = res.data.average
          .map((average: ApiResponse.Average) => {
            return [
              average.score,
              `${average.organization_name}の平均回: ${average.score}`,
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
              `${average.organization_name}の平均回`,
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
      await this.fetchUseCheckTotalUserData();
      if (!this.$accessor.userProfile.is_account_holder) {
        const {
          data: { authorities },
        } = await fetchUser(this.$accessor.userProfile.uuid);
        if (
          !authorities.read_usage_check ||
          !authorities.read_usage_check.includes(this.companyUuid)
        ) {
          this.$router.push({ path: '/admin/analysis/useCheck' });
        }
      } else {
        this.$router.push({ path: '/admin/analysis/useCheck' });
      }
      await this.fetchUseCheckGraphUserData();
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
      await this.fetchUseCheckTotalUserData();

      const srcRes = await fetchUseCheckGraphUser(
        this.startAt,
        this.endAt,
        this.uuid,
        this.checkUseType
      );

      this.chartData = [];
      if (srcRes.data.graph.length > 0) {
        const destRes = await fetchUseCheckGraphUser(
          data.dest.startAt,
          data.dest.endAt,
          this.uuid,
          this.checkUseType
        );

        if (destRes.data.graph.length > 0) {
          this.chartData = srcRes.data.graph.map((graph: ApiResponse.Graph) => {
            return [
              dayjs.unix(graph.date).format('MM/DD'),
              graph.score,
              `${dayjs.unix(graph.date).format('MM/DD')}\n平均回: ${
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
                .format('MM/DD')}\n比較期間の平均回: ${
                destRes.data.graph[index].score
              }`,
            ];
          });
          this.chartData.unshift([
            'Month',
            '平均回',
            { type: 'string', role: 'tooltip' },
            '比較期間の平均回',
            { type: 'string', role: 'tooltip' },
          ]);
        }
      }
      this.average = srcRes.data.average.slice(-1)[0].score;
      this.isLoading = false;
    },
    async handleChangeUseType(useType: string) {
      this.isLoading = true;
      this.currentType = useType;
      this.checkUseType = useType;
      this.isLoading = true;
      await this.fetchUseCheckTotalUserData();
      await this.fetchUseCheckGraphUserData();
      this.isLoading = false;
    },
    getUnitTextForButton(type: string): string {
      switch (type) {
        case 'access_rate':
          return '％';
        case 'like_send_count':
          return '％';
        default:
          return '回';
      }
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

.category {
  display: flex;
  margin: 25px 0 0 0;
  padding: 0 0 15px 0;
  border-bottom: 1px solid $light_gray_blue_3;
}

.use-check-button {
  margin-right: 12px;

  &:last-of-type {
    margin: 0;
  }
}
</style>
