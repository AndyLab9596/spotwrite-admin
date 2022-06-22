<template>
  <div class="page-container">
    <div class="page">
      <h1 class="page-title">
        <img class="icon-pass" src="/icon/pass.svg" />
        <span>契約会社一覧</span>
      </h1>
      <vue-loading
        v-if="isLoading"
        type="spin"
        color="#333"
        :size="{ width: '50px', height: '50px' }"
      ></vue-loading>
      <template v-else>
        <div class="contents">
          <div class="filter-container">
            <div class="filter-row">
              <div class="input-group select">
                <div class="label">利用プラン</div>
                <select
                  id="name"
                  v-model="filterParams.contract_plan"
                  class="input"
                >
                  <option value="">選択してください。</option>
                  <option
                    v-for="(contractPlan, key) in contractPlans"
                    :key="key"
                    :value="contractPlan.id"
                    >{{ contractPlan.name }}</option
                  >
                </select>
              </div>
              <div class="input-group select">
                <div class="label">ステータス</div>
                <select id="status" v-model="filterParams.status" class="input">
                  <option value="">選択してください。</option>
                  <option value="unsettled">未決済</option>
                  <option value="payment_completed">決済完了</option>
                  <option value="stopping">停止中</option>
                  <option value="withdraw">退会</option>
                </select>
              </div>
              <div class="input-group">
                <div class="label">会社名で検索</div>
                <base-input-text
                  v-model="filterParams.name"
                  placeholder="社名を入力"
                  class="input"
                />
              </div>
            </div>
            <div class="filter-row">
              <base-button class="button" @click="search()"
                >検索する</base-button
              >
            </div>
          </div>
          <div class="table-container">
            <ContractCompanyTable
              :contract-companies="contractCompanies"
              :orders="orders"
            />
          </div>
          <base-pagination
            v-if="contractCompanies.length > 0"
            v-model="pagination"
            @go-to-page="goToPage($event)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { VueLoading } from 'vue-loading-template';
import ContractCompanyTable from '@/components/SystemAdmin/Pages/ContractCompany/ContractCompanyTable.vue';
import {
  fetchAdminContractCompanies,
  fetchAdminContractPlans,
} from '@/libs/api';
import { Route } from 'vue-router/types/router';
import BaseInputText from '@/components/Admin/Modules/Input/BaseInputText.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BasePagination from '@/components/Admin/Modules/Pagination/BasePagination.vue';

type ContractCompany = ApiResponse.ContractCompany;
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
    BaseButton,
    BasePagination,
    ContractCompanyTable,
    VueLoading,
    BaseInputText,
  },
  data() {
    return {
      contractCompanies: [] as ContractCompany[],
      paginationInfo: {} as PaginationInfo,
      limit: 20,
      offset: 0,
      alertModalMessage: '',
      isLoading: false as boolean,
      filterParams: {
        name: '',
        contract_plan: '',
        status: '',
      },
      contractPlans: [],
      owners: [],
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
          path: '/system-admin/contract-company',
          query: { page: `${v}`, orders: this.orders },
        });
      },
    },
    orders: {
      get(): string[] {
        const { orders } = this.$route.query;
        if (typeof orders === 'string') {
          return [orders];
        }
        if (typeof orders !== 'object') {
          return [];
        }
        return orders;
      },
      set(v: string[]) {
        this.$router.push({
          path: '/system-admin/contract-company',
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
          : parseInt(route.query.page, 20);
      const orders =
        !('orders' in route.query) || typeof route.query.orders !== 'object'
          ? []
          : (route.query.orders as string[]);
      this.fetchAdminContractCompanies(page, orders);
    },
  },
  async created() {
    this.isLoading = true;
    const { data: contractPlans } = await fetchAdminContractPlans();
    this.contractPlans = contractPlans;
    this.isLoading = false;

    await this.fetchAdminContractCompanies(this.currentPage, this.orders);
  },
  methods: {
    async fetchAdminContractCompanies(page: number, orders: string[]) {
      this.isLoading = true;
      try {
        let dummyOrders = '';
        if (orders && orders.length) {
          dummyOrders = orders.join(',');
        }
        const { data } = await fetchAdminContractCompanies({
          limit: this.limit,
          page,
          orders: dummyOrders,
          ...this.filterParams,
        });

        this.contractCompanies = data.data;
        this.paginationInfo = data.meta;
      } catch (e) {
        throw new Error(e);
      } finally {
        this.isLoading = false;
      }
    },
    async goToPage(page: number) {
      this.offset = this.limit * (page - 1);
      this.currentPage = page;
    },
    async search() {
      this.currentPage = 1;
      await this.fetchAdminContractCompanies(this.currentPage, this.orders);
    },
  },
});
</script>

<style lang="scss" scoped>
.page {
  width: 960px;
  min-height: calc(100% - 128px);
  margin-left: 40px;
  color: #2e303e;

  &-title {
    line-height: 36px;
    font-size: 24px;
    padding: 14px;
    color: #2e303e;
    font-weight: normal;

    .icon-pass {
      height: 36px;
      margin-right: 38px;
    }
  }

  .filter-container {
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 25px 30px;
    border: solid 1px #e4e5ed;
    border-radius: 4px;

    .filter-row {
      display: flex;

      .input-group {
        &:not(:first-child) {
          margin-left: 20px;
        }

        .input {
          width: 200px;
          height: 40px;
          margin-top: 5px;
          background: #fafbff;
          border: solid 1px #e4e5ed;
          border-radius: 4px;
        }

        &.select {
          position: relative;

          &::before {
            content: '';
            position: absolute;
            width: 10px;
            height: 8px;
            right: 8px;
            bottom: 16px;
            background: url('/icon/icon_caret-down.svg') no-repeat center;
          }

          .input {
            appearance: none;
            padding: 0 24px 0 8px;
          }
        }
      }

      .button {
        width: 200px;
        height: 40px;
        font-weight: normal;
        margin: 20px auto 0;
      }
    }
  }

  .pagination {
    justify-content: flex-end;
    margin-top: 25px;
    margin-bottom: 25px;
  }
}
</style>
