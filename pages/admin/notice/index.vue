<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="Spotwrite運営会社からお知らせ">
        <template #description>
          アップデートなどSpotwrite運営会社からご利用企業様へお知らせです。
        </template>
      </page-header>
      <div class="toolbar"></div>
      <div class="contents">
        <div class="users">
          <table border class="table">
            <tr>
              <th class="relative date">
                日付
                <svg
                  id="Icon_pulldown"
                  class="sort"
                  data-name="Icon/pulldown"
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  @click="openSortDialog('date')"
                >
                  <path
                    id="Path_845"
                    data-name="Path 845"
                    d="M450.361,106.779l-4.549,7.06a.44.44,0,0,1-.746,0l-4.549-7.06a.471.471,0,0,1,.373-.733h9.1A.471.471,0,0,1,450.361,106.779Z"
                    transform="translate(-440.439 -106.046)"
                    fill="#7e8195"
                  />
                </svg>
                <div v-if="showSortDialogDate" class="sort-dialog">
                  <ul>
                    <li
                      :class="{ selected: 'desc' === orderStates.date }"
                      @click="sortByDate('desc')"
                    >
                      日付が新しい順
                    </li>
                    <li
                      :class="{ selected: 'asc' === orderStates.date }"
                      @click="sortByDate('asc')"
                    >
                      日付が古い順
                    </li>
                    <li @click="sortByDate({ ...orderStates, date: '' })">
                      順番を元に戻す
                    </li>
                  </ul>
                </div>
              </th>
              <th class="category">種別</th>
              <th class="title">タイトル</th>
            </tr>
            <tr v-for="notice in notices" :key="notice.uuid">
              <td>{{ notice.created_at }}</td>
              <td>
                <label :class="notice.type">{{
                  changeTypeName(notice.type)
                }}</label>
              </td>
              <td>
                <nuxt-link
                  class="detail-link"
                  :to="`/admin/notice/detail/${notice.uuid}`"
                >
                  <span
                    v-if="isLatestNotice(notice.created_at)"
                    class="icon-new"
                    >New!</span
                  >
                  <span class="list-title">{{ notice.title }}</span>
                </nuxt-link>
              </td>
            </tr>
          </table>
        </div>
        <BasePagination
          v-if="notices.length > 0"
          v-model="pagination"
          @go-to-page="goToPage($event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { fetchCompanyNotices } from '@/libs/api';
import { Route } from 'vue-router/types/router';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import BasePagination from '@/components/Admin/Modules/Pagination/BasePagination.vue';
import dayjs from '@/libs/dayjs';
import moment from 'moment';

type Notice = ApiResponse.Notice;
type Pagination = {
  number: number;
  offset: number;
  limit: number;
  total: number;
};
type OrderState = 'asc' | 'desc' | '';
type OrderStates = {
  date: OrderState;
};

export default Vue.extend({
  layout: 'admin/default',
  components: {
    PageHeader,
    BasePagination,
  },
  data() {
    return {
      openCreateModal: false,
      openAddUserModal: false,
      addCommunityId: 0,
      notices: [] as Notice[],
      paginationInfo: {} as ApiResponse.Pagination,
      limit: 10,
      offset: 0,
      showSortDialogDate: false as boolean,
      lock: false,
      orderStates: {
        date: '',
      } as OrderStates,
    };
  },
  computed: {
    pagination: {
      set(value: Pagination) {
        this.currentPage = value.number;
        this.offset = value.offset;
      },
      get(): Pagination {
        return {
          number: this.paginationInfo.current_page,
          offset: this.offset,
          limit: this.limit,
          total: this.paginationInfo.total,
        };
      },
    },
    isLoading(): boolean {
      return this.$accessor.loading;
    },
    currentPage: {
      get(): number {
        const { page } = this.$route.query;
        if (typeof page !== 'string') {
          return 1;
        }
        return page ? parseInt(page, 10) : 1;
      },
      set(v: number) {
        this.$router.push({
          path: '/admin/notice',
          query: { page: `${v}`, orders: this.orders },
        });
      },
    },
    orders: {
      get(): string[] {
        const { orders } = this.$route.query;
        if (typeof orders !== 'object') {
          return [];
        }
        return orders ?? [];
      },
      set(v: string[]) {
        this.$router.push({
          path: '/admin/notice',
          query: { page: '1', orders: v },
        });
      },
    },
  },
  watch: {
    async $route(route: Route) {
      const page =
        !('page' in route.query) || typeof route.query.page !== 'string'
          ? 1
          : parseInt(route.query.page, 10);
      const orders =
        !('orders' in route.query) || typeof route.query.orders !== 'object'
          ? []
          : (route.query.orders as string[]);
      this.fetchNotices(page, orders);
    },
  },
  async created() {
    const orders = ['-created_at'];
    await this.fetchNotices(this.currentPage, orders);
    this.$router.push('/admin/notice');
  },
  methods: {
    async fetchNotices(page: number, orders: string[]): Promise<void> {
      this.$accessor.setLoading(true);
      try {
        const { data } = await fetchCompanyNotices(page, orders);
        this.notices = data.data;
        this.paginationInfo = data.meta;
      } catch (e) {
        console.error(e);
      } finally {
        this.$accessor.setLoading(false);
      }
    },
    toTimestamp(y: number, m: number) {
      return moment(`${y}-${m}`, 'YYYY-MM').unix();
    },
    sortByDate(order: OrderState = 'asc') {
      if (order === 'asc') {
        const orders = ['created_at'];
        this.fetchNotices(this.currentPage, orders);
        this.$router.push('/admin/notice');
      } else if (order === 'desc') {
        const orders = ['-created_at'];
        this.fetchNotices(this.currentPage, orders);
        this.$router.push('/admin/notice');
      } else {
        const orders = ['-created_at'];
        this.fetchNotices(this.currentPage, orders);
        this.$router.push('/admin/notice');
      }

      this.orderStates = {
        date: order,
      };
    },
    changeTypeName(type: string): string {
      let name = '';
      switch (type) {
        case 'notice':
          name = 'お知らせ';
          break;
        case 'update':
          name = 'アップデート';
          break;
        default:
          break;
      }
      return name;
    },
    async goToPage(page: number) {
      this.offset = this.limit * (page - 1);
      this.currentPage = page;
    },
    isLatestNotice(date: string) {
      const latestDate = 3;
      return dayjs().diff(dayjs(date), 'day') <= latestDate;
    },
    openSortDialog(title: string) {
      switch (title) {
        case 'date':
          this.showSortDialogDate = true;
          break;
        default:
          return;
      }

      this.lock = true;
      setTimeout(() => {
        this.lock = false;
        if (document == null) {
          return;
        }
        const d: any = document;
        d.getElementById('__nuxt').addEventListener(
          'click',
          this.closeSortDialog,
          false
        );
      }, 250);
    },
    closeSortDialog() {
      if (this.lock || document == null) {
        return;
      }
      this.showSortDialogDate = false;
      const d: any = document;
      d.getElementById('__nuxt').removeEventListener(
        'click',
        this.closeSortDialog,
        false
      );
    },
  },
});
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap');

.toolbar {
  display: flex;
  justify-content: space-between;

  .sorting_options {
    list-style: none;
    display: inline-block;
  }
}

.contents {
  position: relative;
  height: 100%;
  min-height: 900px;
  margin-top: 14px;

  .community {
    border-top: solid 1px #707070;
    padding: 8px 0;
    margin-bottom: 32px;
  }

  .community-status {
    position: relative;
    display: flex;
    height: 44px;
    align-items: center;
    padding-bottom: 8px;
    margin-bottom: 12px;
    border-bottom: 1px dashed #bbb;

    .name-box {
      display: flex;
      background-color: $true_white;
      align-items: center;
      border-radius: 4px;
      padding: 0 8px;
      height: 100%;
      margin-right: 16px;

      .type {
        width: 70px;
        height: 26px;
        text-align: center;
        font-size: 14px;
        border-radius: 6px;
        background-color: #ededed;
        margin-right: 8px;
      }

      .name {
        max-width: 270px;
        font-weight: bold;
        line-height: 1;
      }
    }

    .toggle {
      position: absolute;
      right: 0;
      top: 0;
      height: 36px;
    }
  }

  .users {
    max-height: 800px;
  }

  .table {
    width: 100%;
    margin-bottom: 16px;
    font-size: 13px;
    color: $dark_blue;
    border: 1px solid $light_gray_blue_3;

    .relative {
      position: relative;
    }

    .sort {
      cursor: pointer;
      margin-left: 7px;
    }

    .sort-dialog {
      position: absolute;
      right: 0;
      z-index: 10;
      padding: 4px 15px;
      text-align: left;
      background-color: $true_white;
      border: solid 1px $light_gray_blue_3;
      border-radius: 4px;
    }

    ul {
      list-style: none;

      li {
        position: relative;
        color: $gray_blue_4;
        cursor: pointer;
      }
    }

    th {
      padding: 8px;
      color: $gray_blue_4;
      background: $white_1;
      text-align: center;
      border: 1px solid $light_gray_blue_3;
      height: 40px;
    }

    > tr > th {
      border: solid 1px $light_gray_blue_3;
      vertical-align: middle;
    }

    th > div {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .pulldown {
      vertical-align: baseline;
    }

    .date {
      width: 100px;
    }

    .category {
      width: 100px;
    }

    .title {
      width: 762px;
    }

    td {
      background-color: $true_white;
      padding: 8px 10px 7px;
      color: $dark_blue;
      vertical-align: baseline;
      border: 1px solid $light_gray_blue_3;

      label {
        display: block;
        background-color: $light_gray_blue_4;
        border: 1px solid $gray_blue_3;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        color: $gray_blue_4;
        width: 80px;
        text-align: center;
        padding: 2px 0;
      }

      .notice {
        background-color: $light_gray_blue_4;
      }

      .update {
        background-color: $true_white;
      }

      .detail-link {
        color: $dark_blue;
      }

      .list-title {
        font-size: 15px;
        margin-left: 6px;
      }

      .icon-new {
        color: $pink;
        font-size: 20px;
        font-family: 'Alex Brush', cursive;
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;

    .active {
      font-weight: 700;
    }
  }
}
</style>
