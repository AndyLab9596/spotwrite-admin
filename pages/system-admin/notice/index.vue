<template>
  <div class="page-container">
    <div class="page">
      <h1 class="page-title">
        <img class="icon-gear-dark" src="/icon/icon_gear-dark.svg" />
        お知らせ管理
      </h1>
      <button class="add-button" @click="openCreateModal = true">
        お知らせを投稿する
      </button>
      <div class="contents">
        <table class="table">
          <tr>
            <th>
              <button
                :class="{ asc: orders[0] == 'created_at' }"
                class="sort"
                @click="sortBy('created_at')"
              >
                日付
                <img src="/icon/icon_caret-down.svg" />
              </button>
            </th>
            <th>
              <button
                :class="{ asc: orders[0] == 'type' }"
                class="sort"
                @click="sortBy('type')"
              >
                種別
                <img src="/icon/icon_caret-down.svg" />
              </button>
            </th>
            <th>タイトル</th>
          </tr>
          <tr v-for="notice in notices" :key="notice.uuid">
            <td>{{ notice.created_at }}</td>
            <td class="notice-type">
              <button
                :class="notice.type"
                @click="showUpdateModal(notice.uuid)"
              >
                {{ getTypeName(notice.type) }}
              </button>
            </td>
            <td class="notice-title">
              <button @click="showUpdateModal(notice.uuid)">
                {{ notice.title }}
                <span v-if="notice.is_draft">（下書き）</span>
              </button>
            </td>
          </tr>
        </table>

        <BasePagination
          v-if="notices.length > 0"
          v-model="pagination"
          @go-to-page="goToPage($event)"
        />
        <NoticeCreateModal
          v-if="openCreateModal"
          @close="openCreateModal = false"
          @submit="createNotice"
        />
        <NoticeUpdateModal
          v-if="openUpdateModal"
          :uuid="updateUuid"
          @close="openUpdateModal = false"
          @submit="updateNotice"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import NoticeCreateModal from '@/components/SystemAdmin/Pages/Notice/NoticeCreateModal.vue';
import NoticeUpdateModal from '@/components/SystemAdmin/Pages/Notice/NoticeUpdateModal.vue';
import BasePagination from '@/components/Admin/Modules/Pagination/BasePagination.vue';

import { fetchNotices, createNotice, updateNotice } from '@/libs/api';

import { Route } from 'vue-router/types/router';

type Notice = ApiResponse.Notice;
type NoticeParams = ApiRequest.Notice;
type PaginationInfo = ApiResponse.Pagination;
type Pagination = {
  number: number;
  offset: number;
  limit: number;
  total: number;
};

export default Vue.extend({
  layout: 'system-admin/default',
  components: {
    NoticeCreateModal,
    NoticeUpdateModal,
    BasePagination,
  },
  data() {
    return {
      openCreateModal: false,
      openUpdateModal: false,
      addCommunityId: 0,
      updateUuid: '',
      notices: [] as Notice[],
      paginationInfo: {} as PaginationInfo,
      limit: 20,
      offset: 0,
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
          path: '/system-admin/notice',
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
          path: '/system-admin/notice',
          query: { page: 1, orders: v },
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
    await this.fetchNotices(this.currentPage, this.orders);
    this.$router.push('/system-admin/notice');
  },
  methods: {
    async fetchNotices(page: number, orders: string[]): Promise<void> {
      this.$accessor.setLoading(true);
      try {
        const { data } = await fetchNotices(page, orders);
        this.notices = data.data;
        this.paginationInfo = data.meta;
      } catch (e) {
        throw new Error(e);
      } finally {
        this.$accessor.setLoading(false);
      }
    },
    sortBy(field: string): void {
      const deField = `-${field}`;
      if (this.orders[0] === field) {
        this.orders = [deField];
      } else {
        this.orders = [field];
      }
    },
    async goToPage(page: number) {
      this.offset = this.limit * (page - 1);
      this.currentPage = page;
    },
    hasPrev(n: number): boolean {
      return n - 1 >= 1;
    },
    getTypeName(type: string): string {
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
    async showUpdateModal(uuid: string) {
      this.updateUuid = uuid;
      this.openUpdateModal = true;
    },
    async createNotice(notice: NoticeParams) {
      try {
        this.$accessor.setLoading(true);
        await createNotice(notice);
        this.openCreateModal = false;
        if (this.currentPage !== 1) {
          this.currentPage = 1;
        } else {
          await this.fetchNotices(1, this.orders);
        }
      } catch (e) {
        throw new Error(e);
      } finally {
        this.$accessor.setLoading(false);
      }
    },
    async updateNotice(uuid: string, notice: NoticeParams) {
      try {
        this.$accessor.setLoading(true);
        await updateNotice(uuid, notice);
        this.openUpdateModal = false;
        await this.fetchNotices(this.currentPage, this.orders);
      } catch (e) {
        throw new Error(e);
      } finally {
        this.$accessor.setLoading(false);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.page-container {
  background-color: #fff;
  color: #2e303e;
  padding-bottom: 40px;
}

.page {
  width: 960px;
  min-height: calc(100% - 128px);
  margin-left: 40px;

  &-title {
    font-size: 24px;
    padding: 10px;
    margin-bottom: 15px;
    font-weight: normal;

    .icon-gear-dark {
      height: 36px;
      margin-right: 34px;
    }
  }
}

.add-button {
  background: #7e8195;
  color: #fff;
  width: 200px;
  height: 40px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: none;
}

.contents {
  position: relative;

  button.sort {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border: none;
    background: none;

    img {
      margin-left: 6px;
      margin-right: -10px;
    }

    &.asc {
      img {
        transform: rotate(180deg);
      }
    }
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 25px;

    span {
      height: 14px;
      line-height: 14px;

      &.text-muted {
        color: #9c9da5;
      }
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      background: #fff;
      border: solid 1px #e4e5ed;
      color: #7e8195;
      border-radius: 4px;
      width: 30px;
      height: 30px;
      margin: 0 3px;
      font-size: 14px;

      &.active {
        background: #f09c9c;
        color: #fff;
      }

      &.caret-double {
        img {
          height: 8px;

          &:nth-child(2) {
            margin-left: 1px;
          }
        }
      }
    }
  }

  .table {
    width: 100%;
    font-size: 13px;

    th {
      position: relative;
      background: #f7f8fd;
      border: solid 1px #e4e5ed;
      color: #6a6d83;
      padding: 8px;
      text-align: center;
      font-weight: normal;

      &:nth-child(1),
      &:nth-child(2) {
        width: 100px;
      }
    }

    td {
      border: solid 1px #e4e5ed;
      padding: 8px;
      vertical-align: middle;

      &:nth-child(1),
      &:nth-child(2) {
        text-align: center;
      }

      &.notice-type {
        button {
          font-size: 11px;
          border: solid 1px #7e8195;
          color: #6a6d83;
          border-radius: 4px;
          min-width: 80px;
          text-align: center;
          padding: 2px;

          &.notice {
            background: #edeff7;
          }

          &.update {
            background: #fff;
          }
        }
      }

      &.notice-title {
        button {
          display: contents;
        }
      }
    }
  }
}
</style>
