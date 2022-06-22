<template>
  <div class="l-page-container">
    <div v-if="showMessage" class="Suspension-of-use-message">
      <div class="inner">
        <img
          src="/icon/icon_cross-white.png"
          class="icon-cross"
          @click="showMessage = false"
        />
        <p>あと<span class="red-text">〇日で利用停止</span>となります。</p>
        <p>再決算をお願いします。</p>
      </div>
    </div>
    <div class="l-page">
      <page-header title="支払い履歴"> </page-header>
      <h3>決済履歴一覧</h3>
      <vue-loading
        v-if="isLoading"
        type="spin"
        color="#333"
        :size="{ width: '50px', height: '50px' }"
      ></vue-loading>
      <template v-else>
        <div class="contents">
          <div class="contents-main">
            <table class="vertical-table__inner">
              <thead class="vertical-table__headers">
                <tr class="vertical-table__header-row">
                  <th class="vertical-table__header" width="120px">
                    <div class="date-column">
                      <span>決済日</span>
                    </div>
                  </th>
                  <th class="vertical-table__header" width="200px">プラン名</th>
                  <th class="vertical-table__header" width="200px">
                    金額
                  </th>
                  <th class="vertical-table__header" width="150px">
                    お支払い方法
                  </th>
                  <th class="vertical-table__header" width="150px">
                    ステータス
                  </th>
                  <th class="vertical-table__header" width="80px">請求書</th>
                  <th class="vertical-table__header" width="80px">領収書</th>
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
                      <div class="send-name text center">
                        {{ formattedAmount(history.amount) }}
                      </div>
                    </div>
                  </td>
                  <td class="vertical-table__text">
                    <div class="from-user-info">
                      <div class="payment-method center">
                        {{ history.payment_method | paymentMethodText }}
                      </div>
                    </div>
                  </td>
                  <td class="vertical-table__text">
                    <div class="from-user-info">
                      <div
                        v-if="
                          history.payment_status &&
                            history.payment_status !== 'open'
                        "
                        class="payment-method center"
                      >
                        {{ history.payment_status | paymentStatusText }}
                      </div>
                      <div
                        v-else-if="$store.getters.userProfile.is_account_holder"
                        class="post-link-container"
                        @click="retryPaymentByInvoiceId(history.id)"
                      >
                        <div class="post-link">
                          未決済
                        </div>
                      </div>
                      <div v-else class="payment-method center">
                        再決済
                      </div>
                    </div>
                  </td>
                  <td class="vertical-table__text">
                    <div
                      class="post-link-container"
                      @click="downloadInvoicePDF(history.id)"
                    >
                      <div class="post-link">発行</div>
                    </div>
                  </td>
                  <td class="vertical-table__text">
                    <div
                      class="post-link-container"
                      @click="downloadReceiptPDF(history.id)"
                    >
                      <div class="post-link">発行</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <div v-if="histories.length > 0" class="pagination">
        <BasePagination :value="pagination" @go-to-page="page($event)" />
      </div>
      <InternalCommunicationSearchModal
        v-if="openSearchModal"
        @close="openSearchModal = false"
        @submit="searchNoticePosts"
      />
      <DestinationUserListModal
        v-if="openDestinationUserListModal"
        @close="openDestinationUserListModal = false"
        @submit="reSend"
      />
      <PaymentMethodModal
        v-if="openPaymentMethodModal && paymentInvoiceId"
        :cards="cards"
        :invoice-id="paymentInvoiceId"
        title=""
        sentence=""
        @pay="onPay"
        @close="openPaymentMethodModal = false"
      />
      <AlertMessage
        v-if="paymentSucceededAlert"
        @close="paymentSucceededAlert = false"
      >
        <div class="centering">
          決済が完了しました。
        </div>
      </AlertMessage>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  InternalCommunicationSearchModal,
  DestinationUserListModal,
} from '@/components/Admin/Pages/';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import PaymentMethodModal from '@/components/Admin/Pages/PaymentHistory/PaymentMethodModal.vue';
import AlertMessage from '@/components/Admin/Modules/Modal/AlertMessage.vue';

import { timestampToDateString } from '@/libs/dayjs';
import BasePagination from '@/components/Admin/Modules/Pagination/BasePagination.vue';
import {
  fetchPaymentHistories,
  downloadInvoicePDF,
  downloadReceiptPDF,
  fetchCreditCards,
  fetchCurrentSubscription,
} from '@/libs/api';
import { VueLoading } from 'vue-loading-template';

type NoticePost = {
  uuid: string;
  created_at: number;
  title: string;
  organizations: Array<Organization>;
  from_user: FromUser;
  to_users_count: number;
  read_users_count: number;
};

type Organization = {
  uuid: string;
  name: string;
};

type FromUser = {
  uuid: string;
  name: string;
  organization: Organization;
};

export default Vue.extend({
  layout: 'admin/default',
  components: {
    InternalCommunicationSearchModal,
    DestinationUserListModal,
    PaymentMethodModal,
    PageHeader,
    BasePagination,
    AlertMessage,
    VueLoading,
  },
  filters: {
    paymentMethodText(val: ApiResponse.PaymentMethod): string {
      const kvs = { card: 'クレジットカード' };
      return val in kvs ? kvs[val] : '';
    },
    paymentStatusText(val: ApiResponse.PaymentStatus): string {
      const kvs = {
        paid: '決済済み',
        open: '再決済',
        // 以下あり得る値だが表示文字列が未定
        draft: '',
        uncollectible: '',
        void: '',
      };
      return val in kvs ? kvs[val] : '';
    },
  },
  data() {
    return {
      histories: [] as any,
      showMessage: false,
      openSearchModal: false,
      openDestinationUserListModal: false,
      openPaymentMethodModal: false,
      paymentSucceededAlert: false,
      paginationMeta: {} as ApiResponse.Pagination,
      pagination: {},
      isLoading: false as boolean,
      cards: [] as ApiResponse.CreditCard[],
      paymentInvoiceId: '' as string,
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
          path: '/admin/payment-history',
          query: { page: `${v}` },
        });
      },
    },
  },
  watch: {
    async $route() {
      this.fetchPaymentHistories(this.currentPage);
    },
  },
  created(): void {
    this.fetchPaymentHistories(this.currentPage);
    this.fetchCreditCards();
  },
  methods: {
    async fetchPaymentHistories(page: number): Promise<void> {
      this.isLoading = true;
      const { data } = await fetchPaymentHistories(page);
      const failedInvoices = data.data.reduce(
        (newData: [], history: any, index: number) => {
          if (history.payment_status === 'open' && index === newData.length) {
            newData.push(history);
          }
          return newData;
        },
        []
      );
      if (failedInvoices.length) {
        if (this.$accessor.contract?.subscription?.status === 'active') {
          this.refreshStatus();
        }
      }
      if (failedInvoices.length > 1) {
        this.histories = data.data
          .slice(failedInvoices.length - 1)
          .filter(
            (history: any, index: number) =>
              history.payment_status !== 'open' || index === 0
          );
      } else {
        this.histories = data.data;
      }
      this.paginationMeta = data.meta;
      this.pagination = {
        number: this.paginationMeta.current_page,
        offset: this.paginationMeta.from - 1,
        limit: this.paginationMeta.per_page,
        total: this.paginationMeta.total,
      };
      this.isLoading = false;
    },
    async fetchCreditCards(): void {
      const { data } = await fetchCreditCards();
      this.cards = data;
    },
    formattedDate(unixTime: number): string {
      return timestampToDateString(unixTime);
    },
    formattedAmount(amount: number): string {
      return `￥ ${amount.toLocaleString()}`;
    },
    takePages(n: number): number[] {
      const min = 1;
      const max = this.paginationMeta.last_page;
      const curr = this.currentPage;
      let center = curr;
      if (center > max - 2) {
        center = max - 2;
      } else if (center < min + 2) {
        center = min + 2;
      }
      const offset = center - 2;

      return Array.from(Array(n), (_v: any, k: number) => k + offset);
    },
    hasPrev(n: number): boolean {
      return n - 1 >= 1;
    },
    hasNext(n: number): boolean {
      return n + 1 <= this.paginationMeta.last_page;
    },
    isCurrentPage(n: number): boolean {
      return n === this.currentPage;
    },
    page(page: number): void {
      this.currentPage = page;
    },
    async downloadInvoicePDF(id: string) {
      const response = await downloadInvoicePDF(id);

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      link.click();
    },
    async downloadReceiptPDF(id: string) {
      const response = await downloadReceiptPDF(id);

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', `receipt-${id}.pdf`);
      link.click();
    },
    retryPaymentByInvoiceId(invoiceId: string) {
      this.paymentInvoiceId = invoiceId;
      this.openPaymentMethodModal = true;
    },
    onPay() {
      this.paymentSucceededAlert = true;
      this.openPaymentMethodModal = false;
      const paymentIndex = this.histories.findIndex((history: any) => {
        return history.id === this.paymentInvoiceId;
      });
      this.histories[paymentIndex].payment_status = 'paid';
      this.fetchPaymentHistories(this.currentPage);
      this.refreshStatus();
    },
    async refreshStatus() {
      const { data } = await fetchCurrentSubscription();
      this.$accessor.contract.storeSubscription(data);
    },
  },
});
</script>

<style lang="scss" scoped>
.contents-main {
  position: relative;
  margin-top: 18px;
}

.center {
  text-align: center;
}

.vertical-table__inner {
  text-align: center;
  table-layout: fixed;
  border: solid 1px $light_gray_blue_3;
  border-collapse: collapse;
}

.vertical-table__header-row {
  background-color: #efefef;
}

.vertical-table__header {
  color: $gray_blue_4;
  padding: 5px;
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
  padding: 5px;
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
  color: $gray_blue_4;
  font-weight: 600;
  border-radius: 4px;
  background-color: $light_gray_blue_4;
  padding: 4px;
  cursor: pointer;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
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
  width: 150px;
  overflow: hidden;
  font-size: 15px;
  text-overflow: ellipsis;
}

.date-content {
  min-width: 120px;
}

.read-user-count {
  cursor: pointer;
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
