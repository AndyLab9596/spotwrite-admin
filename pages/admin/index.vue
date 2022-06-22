<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="ダッシュボード" />
      <div class="contents">
        <div class="block-1">
          <div class="title">運営会社からのお知らせ</div>
          <vue-loading
            v-if="isLoading.notice"
            type="spin"
            color="#333"
            :size="{ width: '50px', height: '192px' }"
          />
          <div v-else class="body">
            <div class="notice-container">
              <div v-for="notice in notices" :key="notice.uuid" class="item">
                <span class="date">{{ formatedDate(notice.created_at) }}</span>
                {{ notice.title }}
              </div>
            </div>
            <nuxt-link tag="a" :to="'/admin/notice'" class="all-notice-button">
              <img src="/icon/arrow_right.svg" />
              全てのお知らせを表示
            </nuxt-link>
          </div>
        </div>
        <div class="block-2">
          <div class="left">
            <div class="title">今月のアクセス数</div>
            <vue-loading
              v-if="isLoading.useCheck"
              type="spin"
              color="#333"
              :size="{ width: '50px', height: '303px' }"
            />
            <div v-else class="body">
              <div class="total-percent">
                今月のアクセス率<b>{{ measurementItem.access_rate }}</b>
                ％
              </div>
              <div class="chart-container">
                <div class="chart-title">
                  <b>アクセス数</b>
                  <div class="total-access">
                    <b>{{ measurementItem.access_count }}</b>
                    回
                  </div>
                  <div class="chart-legend">全体の平均アクセス数</div>
                </div>
                <chart v-if="chartData.length > 0" :chart-data="chartData" />
              </div>
            </div>
          </div>
          <div class="right">
            <div class="title">変更履歴</div>
            <div class="search-container">
              <input
                v-model="activityLog.input"
                type="search"
                class="input"
                placeholder="テキストを入力"
              />
              <base-button @click="activityLog.filterString = activityLog.input"
                >検索</base-button
              >
            </div>
            <vue-loading
              v-if="isLoading.activityLog"
              type="spin"
              color="#333"
              :size="{ width: '50px', height: '303px' }"
            />
            <div v-else class="body">
              <div class="button-container">
                <base-button
                  class="type"
                  :active="activityLog.tab === 'all'"
                  @click="activityLog.tab = 'all'"
                  >全て</base-button
                >
                <base-button
                  class="type"
                  :active="activityLog.tab === 'organizations'"
                  @click="activityLog.tab = 'organizations'"
                  >組織</base-button
                >
                <base-button
                  class="type"
                  :active="activityLog.tab === 'individuals'"
                  @click="activityLog.tab = 'individuals'"
                  >個人</base-button
                >
                <base-button
                  class="type"
                  :active="activityLog.tab === 'communities'"
                  @click="activityLog.tab = 'communities'"
                  >コミュニティ</base-button
                >
              </div>
              <div class="activity-log-container">
                <div class="activity-log-scroller">
                  <div
                    v-for="(activity, index) in activityLogFiltered[
                      activityLog.tab
                    ]"
                    :key="index"
                    class="item"
                  >
                    <span class="activity-log__date">{{
                      formatedDateTime(activity.created_at)
                    }}</span>
                    <span class="activity-log__text">
                      {{ activity.text }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="block-3">
          <div class="col left">
            <div class="title">更新頻度ランキング</div>
            <vue-loading
              v-if="isLoading.ranking"
              type="spin"
              color="#333"
              :size="{ width: '50px', height: '296px' }"
            />
            <div v-else class="body">
              <div class="button-container">
                <base-button
                  class="type"
                  :active="ranking.activityTab === 'organizations'"
                  @click="ranking.activityTab = 'organizations'"
                  >組織</base-button
                >
                <base-button
                  class="type"
                  :active="ranking.activityTab === 'users'"
                  @click="ranking.activityTab = 'users'"
                  >個人</base-button
                >
                <div class="label">更新頻度 :</div>
                <div class="sort-container">
                  <base-button
                    class="sort"
                    :active="ranking.activityOrder === 'desc'"
                    @click="ranking.activityOrder = 'desc'"
                    >多い順</base-button
                  >
                  <base-button
                    class="sort"
                    :active="ranking.activityOrder === 'asc'"
                    @click="ranking.activityOrder = 'asc'"
                    >少ない順</base-button
                  >
                </div>
              </div>
              <div
                v-if="ranking.activityTab === 'organizations'"
                class="ranking-container"
              >
                <div class="ranking-scroller">
                  <div
                    v-for="(organization, index) in rankingSorted.activity
                      .organizations"
                    :key="index"
                    class="item"
                  >
                    <div class="number">{{ index + 1 }}</div>
                    {{ organization.company_name }} |
                    {{ organization.department_name }}
                    <div class="counter">
                      <div>
                        {{ formatedNumber(organization.activity_average) }}回
                      </div>
                      <div>
                        {{ formatedNumber(organization.activity_rate) }}％
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="ranking-container">
                <div class="ranking-scroller">
                  <div
                    v-for="(user, index) in rankingSorted.activity.users"
                    :key="index"
                    class="item"
                  >
                    <div class="number">{{ index + 1 }}</div>
                    {{ user.company_name }} | {{ user.department_name }}
                    {{ user.user_name }}
                    <div class="counter">
                      <div>{{ formatedNumber(user.activity_average) }}回</div>
                      <div>{{ formatedNumber(user.activity_rate) }}％</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col right">
            <div class="title">マイエピソード達成度ランキング</div>
            <vue-loading
              v-if="isLoading.ranking"
              type="spin"
              color="#333"
              :size="{ width: '50px', height: '296px' }"
            />
            <div v-else class="body">
              <div class="button-container">
                <base-button
                  class="type"
                  :active="ranking.achievementTab === 'organizations'"
                  @click="ranking.achievementTab = 'organizations'"
                  >組織</base-button
                >
              </div>
              <div class="ranking-container">
                <div class="ranking-scroller">
                  <div
                    v-for="(organization, index) in rankingSorted.achievement
                      .organizations"
                    :key="index"
                    class="item"
                  >
                    <div class="number">{{ index + 1 }}</div>
                    {{ organization.company_name }} |
                    {{ organization.department_name }}
                    <div class="counter">
                      {{ formatedNumber(organization.achievement_rate) }}％
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import { VueLoading } from 'vue-loading-template';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import Chart from '@/components/Admin/Pages/Dashboard/Chart.vue';
import {
  fetchAllCompanyNotices,
  fetchOrganizations,
  fetchUseCheckGraphCompany,
  fetchUseCheckTotalCompany,
  fetchPostRankingOrganizations,
  fetchPostRankingUsers,
  fetchActivityLogs,
} from '@/libs/api';

type Organization = ApiResponse.Organization;
type Graph = ApiResponse.Graph;
type Notice = ApiResponse.Notice;
type PostRanking = ApiResponse.PostRanking;
type ActivityLog = ApiResponse.ActivityLog;

export default Vue.extend({
  layout: 'admin/default',
  components: {
    VueLoading,
    PageHeader,
    BaseButton,
    Chart,
  },
  data() {
    return {
      isLoading: {
        notice: true as boolean,
        useCheck: true as boolean,
        activityLog: true as boolean,
        ranking: true as boolean,
      },
      startAt: Number(
        dayjs()
          .subtract(1, 'month')
          .unix()
      ),
      endAt: Number(dayjs().unix()),
      companies: [] as any,
      companieUuids: [] as any,
      measurementItem: {},
      chartData: [] as any,
      checkUseType: 'access_count' as string,
      notices: [] as Notice[],
      activityLog: {
        all: [] as ActivityLog,
        organizations: [] as ActivityLog,
        individuals: [] as ActivityLog,
        communities: [] as ActivityLog,
        tab: 'all' as string,
        input: '' as string,
        filterString: '' as string,
      },
      ranking: {
        type: 'my-episode' as string,
        organizations: [] as PostRanking[],
        users: [] as PostRanking[],
        activityTab: 'organizations' as string,
        achievementTab: 'organizations' as string,
        activityOrder: 'desc' as string,
        achievementOrder: 'desc' as string,
      },
    };
  },
  computed: {
    rankingSorted() {
      return {
        activity: {
          organizations: [...this.ranking.organizations].sort(
            (a: PostRanking, b: PostRanking) => {
              if (this.ranking.activityOrder === 'asc') {
                return a.activity_rate - b.activity_rate;
              }
              return b.activity_rate - a.activity_rate;
            }
          ),
          users: [...this.ranking.users].sort(
            (a: PostRanking, b: PostRanking) => {
              if (this.ranking.activityOrder === 'asc') {
                return a.activity_rate - b.activity_rate;
              }
              return b.activity_rate - a.activity_rate;
            }
          ),
        },
        achievement: {
          organizations: [...this.ranking.organizations].sort(
            (a: PostRanking, b: PostRanking) => {
              if (this.ranking.achievementOrder === 'asc') {
                return a.achievement_rate - b.achievement_rate;
              }
              return b.achievement_rate - a.achievement_rate;
            }
          ),
        },
      };
    },
    activityLogFiltered() {
      return {
        all: this.activityLog.all.filter((activity: ActivityLog) => {
          return activity.text
            .toLowerCase()
            .includes(this.activityLog.filterString.toLowerCase());
        }),
        organizations: this.activityLog.organizations.filter(
          (activity: ActivityLog) => {
            return activity.text
              .toLowerCase()
              .includes(this.activityLog.filterString.toLowerCase());
          }
        ),
        individuals: this.activityLog.individuals.filter(
          (activity: ActivityLog) => {
            return activity.text
              .toLowerCase()
              .includes(this.activityLog.filterString.toLowerCase());
          }
        ),
        communities: this.activityLog.communities.filter(
          (activity: ActivityLog) => {
            return activity.text
              .toLowerCase()
              .includes(this.activityLog.filterString.toLowerCase());
          }
        ),
      };
    },
  },
  created() {
    this.fetchAll();
  },
  methods: {
    async fetchAllNotice() {
      const { data } = await fetchAllCompanyNotices();
      this.notices = data.data;
      this.isLoading.notice = false;
    },
    async fetchOrganizationData() {
      const res = await fetchOrganizations({
        layer: 0,
        key: this.checkUseType,
      });
      this.companies = res.data.organizations;
      this.companieUuids = this.companies.map(
        (organization: Organization) => organization.uuid
      );
    },
    async fetchUseCheckTotalData() {
      this.isLoading.useCheck = true;
      const res = await fetchUseCheckTotalCompany(
        this.startAt,
        this.endAt,
        this.companieUuids,
        this.checkUseType
      );
      this.measurementItem = res.data.total;
      this.isLoading.useCheck = false;
    },
    async fetchUseCheckGraphData() {
      this.isLoading.useCheck = true;
      const res = await fetchUseCheckGraphCompany(
        this.startAt,
        this.endAt,
        this.companieUuids,
        this.checkUseType
      );

      this.chartData = [];
      if (res.data.graph.length > 0) {
        this.chartData = res.data.graph.map((graph: Graph) => {
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
          '全体の平均アクセス数',
          { type: 'string', role: 'tooltip' },
        ]);
      }
      this.isLoading.useCheck = false;
    },
    async fetchActivityLog() {
      const allActivities = await fetchActivityLogs('');
      this.activityLog.all = allActivities.data.data;
      const organizationsActivities = await fetchActivityLogs('organization');
      this.activityLog.organizations = organizationsActivities.data.data;
      const individualsActivities = await fetchActivityLogs('personal');
      this.activityLog.individuals = individualsActivities.data.data;
      const communitiesActivities = await fetchActivityLogs('community');
      this.activityLog.communities = communitiesActivities.data.data;

      this.isLoading.activityLog = false;
    },
    async fetchPostRanking() {
      const {
        data: { organizations },
      } = await fetchPostRankingOrganizations(
        this.startAt,
        this.endAt,
        this.ranking.type
      );
      this.ranking.organizations = organizations;
      const {
        data: { users },
      } = await fetchPostRankingUsers(
        this.startAt,
        this.endAt,
        this.ranking.type
      );
      this.ranking.users = users;
      this.isLoading.ranking = false;
    },
    async fetchAll() {
      this.isLoading.notice = true;
      this.isLoading.useCheck = true;
      this.isLoading.activityLog = true;
      this.isLoading.ranking = true;
      await this.fetchOrganizationData();
      this.fetchAllNotice();
      Promise.all([
        this.fetchUseCheckTotalData(),
        this.fetchUseCheckGraphData(),
      ]);
      this.fetchActivityLog();
      this.fetchPostRanking();
    },
    formatedDate(date: string) {
      return dayjs(date).format('YYYY/MM/DD');
    },
    formatedDateTime(time: number) {
      return dayjs.unix(time).format('YYYY/MM/DD HH:mm');
    },
    formatedNumber(number: number | string) {
      return Number(number)
        .toFixed(2)
        .replace(/\.0+$/, '');
    },
  },
});
</script>

<style lang="scss" scoped>
.contents {
  margin-top: 30px;

  .vue-loading {
    display: flex;
  }

  .title {
    font-weight: bold;
    font-size: 15px;
  }

  .button-container {
    display: flex;
    align-items: center;
    margin-top: 15px;

    .type {
      padding: 8px 25px;
      height: 35px;

      &[active] {
        background: $light_gray_blue_5;
        border: solid 1px $light_gray_blue_5;
        color: $dark_blue;
        pointer-events: none;
        font-weight: 600;
      }

      &:not([active]) {
        background: $true_white;
        color: $gray_blue_4;
        border: solid 1px $light_gray_blue_3;
        font-weight: 300;
      }

      &:hover {
        background-color: $light_gray_blue_3;
      }

      & + .type {
        margin-left: 10px;
      }
    }

    .label {
      margin-left: auto;
    }

    .sort-container {
      display: flex;
      background: #f7f8fd;
      border: solid 1px #e4e5ed;
      padding: 3px;
      margin-left: 10px;
      border-radius: 7px;
      font-size: 13px;

      .sort {
        padding: 3px 15px;
        border-radius: 4px;
        height: auto;

        &:not([active]) {
          background: transparent;
          color: $gray_blue_4;
          font-weight: 300;
        }

        &[active] {
          background: #fff;
          color: $gray_blue_4;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.16);
          pointer-events: none;
        }

        & + .sort {
          margin-left: 3px;
        }
      }
    }
  }

  .item {
    display: flex;

    &:not(:first-child) {
      margin-top: 10px;
    }
  }

  .block-1 {
    .body {
      position: relative;
      border: solid 1px #e4e5ed;
      border-radius: 4px;
      margin-top: 15px;
      padding: 20px 20px 40px 30px;

      .notice-container {
        height: 120px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #7e8195 white;

        .item {
          line-height: 1;

          .date {
            margin-right: 20px;
          }
        }
      }

      .notice-container::-webkit-scrollbar {
        width: 4px;
        height: 0;
      }

      .notice-container::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: #7e8195;
      }
    }
  }

  .block-2 {
    display: flex;
    margin-top: 30px;

    .left {
      width: calc(50% - 10px);
      margin-right: 20px;

      .body {
        margin-top: 15px;
        border-top: solid 1px #e4e5ed;

        .total-percent {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 7px 0;
          height: 46px;
          border-radius: 4px;
          background: #f7f8fd;
          font-weight: bold;
          color: $gray_blue_4;

          b {
            color: #f09c9c;
            margin-left: 5px;
            margin-right: 2px;
          }
        }

        .chart-container {
          margin-top: 5px;
          border: solid 1px #e4e5ed;
          border-radius: 4px;
          padding: 15px 10px;
          height: 230px;

          .chart-title {
            position: relative;
            z-index: 9;
            display: flex;
            align-items: center;
            margin-bottom: -20px;
            padding-left: 10px;

            .total-access {
              margin-left: 20px;
              padding: 5px 20px;
              background: #f7f8fd;

              b {
                margin-right: 2px;
                color: #f09c9c;
              }
            }

            .chart-legend {
              position: absolute;
              right: 0;
              top: 50%;

              &::before {
                content: '';
                position: absolute;
                left: -20px;
                top: 4px;
                background: #e52525;
                width: 11px;
                height: 11px;
                border-radius: 2px;
              }
            }
          }
        }
      }
    }

    .right {
      position: relative;
      width: calc(50% - 10px);

      .search-container {
        position: absolute;
        display: flex;
        top: 0;
        right: 0;

        .input {
          height: 30px;
          margin-right: 5px;
          border-radius: 4px;
          padding: 0 5px;
          border: solid 1px #e4e5ed;
        }
      }

      .body {
        margin-top: 15px;
        border-top: solid 1px #e4e5ed;

        .button-container {
          margin-top: 15px;
        }

        .activity-log-container {
          margin-top: 10px;
          padding: 15px 20px 10px;
          border: solid 1px #e4e5ed;
          border-radius: 4px;
          height: 230px;

          .activity-log-scroller {
            height: 210px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #7e8195 white;

            .item {
              line-height: 1;

              .activity-log__date {
                width: 128px;
              }

              .activity-log__text {
                flex: 1;
              }
            }
          }

          .activity-log-scroller::-webkit-scrollbar {
            width: 4px;
            height: 0;
          }

          .activity-log-scroller::-webkit-scrollbar-thumb {
            border-radius: 4px;
            background: #7e8195;
          }
        }
      }
    }
  }

  .block-3 {
    display: flex;
    margin-top: 30px;

    .col {
      width: calc(50% - 10px);

      .body {
        margin-top: 15px;
        border-top: solid 1px #e4e5ed;

        .ranking-container {
          margin-top: 10px;
          border-radius: 4px;
          border: solid 1px #e4e5ed;
          padding: 15px 16px 20px 20px;
          height: 226px;

          .ranking-scroller {
            height: 192px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #7e8195 white;

            .item {
              line-height: 1.2;

              .number {
                width: 30px;
              }

              .counter {
                margin-left: 15px;
                text-align: right;
              }
            }
          }

          .ranking-scroller::-webkit-scrollbar {
            width: 4px;
            height: 0;
          }

          .ranking-scroller::-webkit-scrollbar-thumb {
            border-radius: 4px;
            background: #7e8195;
          }
        }
      }

      &.left {
        margin-right: 20px;
      }
    }
  }
}

.all-notice-button {
  position: absolute;
  display: flex;
  align-items: center;
  padding: 4px 14px 4px 12px;
  right: 10px;
  bottom: 10px;
  background: $light_gray_blue_4;
  color: $gray_blue_4;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  font-size: 13px;
  font-weight: bold;

  &:hover {
    background: $light_gray_blue_1;
  }

  img {
    margin-right: 11px;
  }
}
</style>
