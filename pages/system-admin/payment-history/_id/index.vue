<template>
  <div class="l-page-container">
    <div class="l-page">
      <nuxt-link
        tag="a"
        :to="`/system-admin/contract-company/detail/${this.$route.params.id}`"
        class="link"
      >
        <span>＜ 詳細ページに戻る</span>
      </nuxt-link>
      <h1 class="title-content-owner">
        <img class="icon-gear-dark" src="/icon/pass.svg" />
        &nbsp;&nbsp;&nbsp;契約会社一覧
      </h1>
      <div class="title-content-owner">
        <h1 class="title">{{ ownerName }}</h1>
      </div>
      <div v-if="histories.length > 0" class="title-content">
        <h2 class="title">決済履歴一覧</h2>
      </div>
      <vue-loading
        v-if="isLoading"
        type="spin"
        color="#333"
        :size="{ width: '50px', height: '50px' }"
      ></vue-loading>
      <div v-if="!isLoading" class="contents">
        <div v-if="histories.length > 0" class="contents-main">
          <table class="vertical-table__inner">
            <thead class="vertical-table__headers">
              <tr class="vertical-table__header-row">
                <th class="vertical-table__header" width="120px">
                  決済日
                </th>
                <th class="vertical-table__header" width="200px">
                  プラン名
                </th>
                <th class="vertical-table__header" width="150px">
                  金額
                </th>
                <th class="vertical-table__header" width="150px">
                  お支払い方法
                </th>
                <th class="vertical-table__header" width="250px">
                  ステータス
                </th>
              </tr>
            </thead>
            <tbody class="vertical-table__body">
              <tr
                v-for="history in histories"
                :key="history.id"
                class="vertical-table__body-row"
              >
                <td class="vertical-table__text">
                  <div class="date-content">
                    {{ formattedDate(history.payment_date) }}
                  </div>
                </td>
                <td class="vertical-table__text">
                  {{ history.plan_name }}
                </td>
                <td class="vertical-table__text">
                  <div class="send-column">
                    <div class="amount text center">
                      {{ formattedAmount(history.amount) }}
                    </div>
                  </div>
                </td>
                <td class="vertical-table__text">
                  <div class="from-user-info">
                    <div class="payment-method center">
                      {{ paymentMethodToJapanese(history.payment_method) }}
                    </div>
                  </div>
                </td>
                <td class="vertical-table__text">
                  <div class="from-user-info">
                    <div
                      v-if="history.payment_status"
                      class="payment-method center"
                    >
                      {{ statusPaymentToJapanese(history.payment_status) }}
                    </div>
                    <div v-else class="post-link-container">
                      <div class="post-link">
                        再決済
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="totalItem > 20" class="pagination">
            <base-pagination
              :value="{
                number: pagination.current_page,
                offset: pagination.from - 1,
                limit: Number(pagination.per_page),
                total: pagination.total,
              }"
              @go-to-page="gotoPage($event)"
            />
          </div>
        </div>
        <div v-if="responseMessage != ''" class="no-payment-history">
          {{ responseMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import BasePagination from '@/components/Admin/Modules/Pagination/BasePagination.vue';
import { VueLoading } from 'vue-loading-template';
import { fetchPaymentHistoryOfSystemAdmin } from '@/libs/api';

type paymentHistory = ApiResponse.PaymentHistory;

export default Vue.extend({
  layout: 'system-admin/default',
  components: {
    BasePagination,
    VueLoading,
  },
  data() {
    return {
      limit: 1,
      offset: 0,
      page: 1,
      totalItem: 0,
      histories: [] as paymentHistory[],
      isLoading: false as boolean,
      pagination: {} as ApiResponse.Panination,
      ownerName: '',
      responseMessage: '',
    };
  },
  computed: {
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
          path: `/system-admin/payment-history/${this.$route.params.id}`,
          query: { page: `${v}` },
        });
      },
    },
  },
  watch: {
    async $route() {
      this.fetchPaymentHistoryData(this.currentPage);
    },
  },
  async created() {
    const pageNum =
      !('page' in this.$route.query) ||
      typeof this.$route.query.page !== 'string'
        ? 1
        : parseInt(this.$route.query.page, 10);
    this.fetchPaymentHistoryData(pageNum);
  },
  methods: {
    async fetchPaymentHistoryData(pageNum: number) {
      this.isLoading = true;
      this.responseMessage = '';
      try {
        const {
          data: paymentHistoryData,
        } = await fetchPaymentHistoryOfSystemAdmin(
          this.$route.params.id,
          pageNum
        );
        this.histories =
          Object.keys(paymentHistoryData).length > 0
            ? paymentHistoryData.data
            : [];
        this.ownerName =
          Object.keys(paymentHistoryData).length > 0
            ? paymentHistoryData.ownerName
            : '';
        this.responseMessage =
          this.histories.length === 0 ? '決済履歴がありません。' : '';
        this.totalItem =
          Object.keys(paymentHistoryData.meta).length > 0
            ? paymentHistoryData.meta.total
            : 0;
        this.isLoading = false;
        this.pagination = paymentHistoryData.meta;
      } catch (e) {
        this.responseMessage = e.response.data.message;
        if (e.response.status === 500) {
          this.responseMessage = '内部サーバーエラー';
        }
        this.isLoading = false;
      }
    },
    formattedDate(unixTime: number): string {
      return dayjs.unix(unixTime).format('YYYY-MM-DD');
    },
    formattedAmount(amount: number): string {
      return `￥ ${amount.toLocaleString()}`;
    },
    gotoPage(page: number): void {
      this.currentPage = page;
    },
    hasPrev(n: number): boolean {
      return n - 1 >= 1;
    },
    hasNext(n: number): boolean {
      return n + 1 <= this.pagination.last_page;
    },
    isCurrentPage(n: number): boolean {
      return n === this.currentPage;
    },
    statusPaymentToJapanese(status: string) {
      switch (status) {
        case 'draft':
          return '請求書は変更可能です。';
        case 'open':
          return '再決済';
        case 'paid':
          return '決済完了';
        case 'void':
          return '請求書は無効になりました。';
        case 'uncollectible':
          return '請求書が支払われる可能性は非常に低く、不良債権と見なされる可能性があります。';
        default:
          return '-';
      }
    },
    paymentMethodToJapanese(type: string) {
      switch (type) {
        case 'au_becs_debit':
        case 'ach_debit':
        case 'sepa_debit':
        case 'sofort':
          return '銀行の負債';
        case 'bancontact':
        case 'eps':
        case 'giropay':
        case 'ideal':
        case 'p24':
          return '銀行のリダイレクト';
        case 'card':
        case 'card_present':
          return 'カード';
        case 'klarna':
          return 'klarna';
        case 'ach_credit_transfer':
        case 'multibanco':
          return '銀行振込';
        case 'stripe_account':
          return 'Stripe account';
        case 'alipay':
        case 'wechat':
          return '財布 ';
        default:
          return '-';
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.vertical-table__inner {
  text-align: center;
  table-layout: fixed;
  border: solid 1px $light_gray_blue_3;
  border-collapse: collapse;
  width: 100%;
}

.vertical-table__header-row {
  background-color: #efefef;
}

.link {
  margin-bottom: 20px;
  display: table;
  padding: 10px;
  background-color: #f7f8fd;
  border-radius: 5px;
  color: #2f303e;
  font-size: 13px;
}

.title-content-owner {
  margin-bottom: 20px;
  display: flex;
}

.title-content {
  margin-bottom: 10px;
  display: flex;
}

.vertical-table__header {
  color: $gray_blue_4;
  padding: 10px;
  border-right: 1px solid $light_gray_blue_3;
  border-bottom: 1px solid $light_gray_blue_3;
  font-weight: 600;
  vertical-align: middle;
  text-align: center;
  font-size: 14px;
  background-color: $white_1;
}

.sort-img {
  margin-bottom: 5px;
}

.vertical-table__text {
  padding: 10px;
  border-right: 1px solid $light_gray_blue_3;
  border-bottom: 1px solid $light_gray_blue_3;
  vertical-align: middle;
}

.vertical-table__header:last-child,
.vertical-table__text:last-child {
  border-right-width: 0;
}

.vertical-table__body-row:last-child .vertical-table__text {
  border-bottom-width: 0;
  height: 40px;
}

.vertical-table__body {
  background-color: $true_white;
}

.post-link-container {
  color: $red_1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.post-link {
  font-size: 14px;
}

.date-column {
  cursor: pointer;
}

.from-user-info {
  white-space: nowrap;
  overflow: hidden;
}

.payment-method {
  overflow: hidden;
  font-size: 15px;
  text-overflow: ellipsis;
  text-align: center;
}

.amount {
  overflow: hidden;
  font-size: 15px;
  text-overflow: ellipsis;
  text-align: center;
}

.date-content {
  min-width: 120px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;

  .active {
    font-weight: 700;
  }
}

.Suspension-of-use-message {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(126, 129, 149, 0.8);
  height: 100px;
  color: $true_white;
  z-index: 100;
  padding-left: 200px;

  .inner {
    position: relative;
    max-width: 960px;
    margin: 0 auto;
    padding: 18px;
  }

  .red-text {
    color: $red;
  }

  .icon-cross {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}

.centering {
  flex-grow: 1;
  display: flex;
  justify-content: center;
}
</style>
