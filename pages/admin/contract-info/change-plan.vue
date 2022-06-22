<template>
  <div class="l-page-container">
    <div class="l-page">
      <div>
        <nuxt-link
          class="back-to-index-container"
          tag="a"
          to="/admin/contract-info"
        >
          ＜ 契約情報に戻る</nuxt-link
        >
      </div>
      <page-header title="契約情報"> </page-header>
      <h2>利用プラン変更</h2>
      <div class="page-contener">
        <div v-if="contractStatusMessage && !isOverPlan" class="sentence">
          {{ contractStatusMessage }}
        </div>
        <div class="plans">
          <Plan
            v-for="(plan, i) of plans"
            :key="i"
            :plan="plan"
            :plan-index="i"
            :style="[{ marginLeft: '0px' }]"
            :storage-list="storageList"
            :selected="selectedPlanIndex === i"
            :products="products"
            :storage-selected="storageSelected"
            @onSelectedPlan="onSelectButtonClick"
            @sendContactPlan="sendContact"
          >
          </Plan>
        </div>
      </div>

      <div class="plan-footer">
        <div class="footer-price-plan">
          <span>現在ご選択中の料金は</span>
          <span class="selected-label">合計</span>
          <span class="selected-label" :style="[{ marginLeft: '10px' }]">
            {{ totalPrice.toLocaleString() }}円（税込）
          </span>
          <span>です。</span>
          <BaseButton
            size="large"
            class="button decide-button"
            :disabled="selectedPlanIndex === -1"
            @click="onChangeContractPlan"
          >
            このプランに決定する
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import Plan from '@/components/Admin/Pages/ContractInfo/Plan.vue';
import dayjs from '@/libs/dayjs';
import {
  changeContractPlan,
  fetchContractPlans,
  fetchContractPlanPrices,
  fetchContractPlan,
  fetchContractStatus,
} from '@/libs/api';

type ContractPlan = ApiResponse.ContractPlan;
type ContractStatus = ApiResponse.ContractStatus;

export default Vue.extend({
  layout: 'admin/default',
  components: {
    PageHeader,
    BaseButton,
    Plan,
  },
  data: () => ({
    plans: [] as ApiResponse.ContractPlan[],
    selectedPlanIndex: undefined as number | undefined,
    storageList: [] as ApiResponse.ContractPlanPrice[],
    storageSelected: 0 as number,
    totalPrice: 0 as Number,
    contract_plan_owner: {} as any,
    products: [] as any[],
    planSelected: {} as ApiResponse.ContractPlan,
    contractStatus: undefined as ContractStatus | undefined,
  }),
  computed: {
    uuid(): string {
      return this.planSelected?.uuid ?? '';
    },
    nextPlan(): { name: string; change_at: number } | undefined {
      if (!this.contractStatus) {
        return undefined;
      }
      if ('upgrading' in this.contractStatus) {
        return {
          ...this.contractStatus.upgrading.plan,
          change_at: this.contractStatus.upgrading.change_at,
        };
      }
      if ('downgrading' in this.contractStatus) {
        return {
          ...this.contractStatus.downgrading.plan,
          change_at: this.contractStatus.downgrading.change_at,
        };
      }
      return undefined;
    },
    changeAt(): string {
      if (this.nextPlan) {
        return dayjs.unix(this.nextPlan.change_at).format('YYYY年MM月DD日');
      }
      return '';
    },
    contractStatusMessage(): string {
      if (!this.nextPlan) {
        return '';
      }
      if ('upgrading' in this.contractStatus) {
        return this.changeAt
          ? `次回契約更新日（${this.changeAt}）から新しいプラン料金にてお支払いとなります。`
          : '';
      }
      const planName = this.nextPlan.name;
      const maxMemberStr =
        this.nextPlan.type !== 'free'
          ? `、ご利用人数${this.nextPlan.max_member}人`
          : '';
      const maxStorageStr =
        this.nextPlan.storage_add != null
          ? `、追加容量${this.nextPlan.storage_add}GB`
          : '';
      return this.changeAt
        ? `次回契約更新日（${this.changeAt}）に「${planName}${maxMemberStr}${maxStorageStr}」にプラン変更されます。`
        : '';
    },
    isOverPlan(): boolean | undefined {
      if (!this.contractStatus) {
        return undefined;
      }
      if ('downgrading' in this.contractStatus) {
        if (this.contractStatus.downgrading.over) {
          return Object.keys(this.contractStatus.downgrading.over).length > 0;
        }
      }
      return undefined;
    },
  },
  async created() {
    await Promise.all([
      this.fetchAdditionContractPlanPrice('storage'),
      this.fetchContractPlan(),
      this.fetchContractPlans(),
    ]);
    this.selectedPlanIndex = this.plans.findIndex(
      (p: ContractPlan): boolean => {
        return p.uuid === this.uuid;
      }
    );
    this.contract_plan_owner = this.planSelected?.contract_plan_owner ?? {};
    const products = this.$accessor.contract?.selectedPlan?.products ?? [];
    products.forEach((item: any) => {
      const storage = this.storageList.find((s: any) => s.uuid === item.uuid);
      if (storage) {
        this.storageSelected = storage.monthly_price;
      }
    });
    await this.fetchContractStatus();
  },
  methods: {
    async fetchContractPlans(): Promise<void> {
      try {
        const { data } = await fetchContractPlans();
        this.plans = data.data;
      } catch (e) {
        console.error(e);
      }
    },
    async fetchContractPlan() {
      const { data } = await fetchContractPlan();
      this.planSelected = data;
      this.products =
        this.planSelected?.contract_plan_owner?.product_data ?? [];
      this.totalPrice =
        this.planSelected?.contract_plan_owner?.total_monthly_price ?? 0;
      Vue.set(this.planSelected, 'products', this.products);
      Vue.set(this.planSelected, 'total_price', this.totalPrice);
      this.$accessor.contract.selectPlan(this.planSelected);
    },
    async fetchAdditionContractPlanPrice(type: string): Promise<void> {
      try {
        const { data } = await fetchContractPlanPrices(type);
        this.storageList = data.data;
      } catch (e) {
        console.error(e);
      }
    },
    async fetchContractStatus() {
      const { data } = await fetchContractStatus();
      this.contractStatus = data;
      if ('downgrading' in data) {
        this.$accessor.contract.storeDowngradingStatus(data.downgrading);
      }
    },
    onSelectButtonClick(value: any): void {
      this.selectedPlanIndex = value.index ?? 0;
      this.totalPrice = value.price_total;
      this.products = value.products_data;
    },
    sendContact() {
      this.$router.push({
        path: '/admin/send-contact',
        query: { type: 'plan' },
      });
    },
    async onChangeContractPlan() {
      if (
        this.selectedPlanIndex === undefined ||
        this.plans[this.selectedPlanIndex] === undefined
      ) {
        return;
      }
      try {
        const plan = this.plans[this.selectedPlanIndex];
        const payload = {
          uuid: plan.uuid,
          products: this.products ?? [],
        };
        const { data } = await changeContractPlan(payload);
        if (data) {
          Vue.set(plan, 'products', this.products);
          Vue.set(plan, 'total_price', this.totalPrice);
          this.$router.push({
            path: '/admin/contract-info',
            query: { changePlan: 'success' },
          });
        }
      } catch (e) {
        // ダウングレード要件を満たしていない場合
        if (e.response?.data?.usage) {
          this.$accessor.contract.storeChangePlanResponse({
            status: 'error',
            data: e.response.data.usage,
          });
          this.$router.push({
            path: '/admin/contract-info',
            query: { changePlan: 'error' },
          });
        } else {
          alert('プランの変更に失敗しました。');
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.back-to-index-container {
  display: flex;
  color: $gray_blue_4;
  font-weight: bold;
  border: solid 1px $light_gray_blue_3;
  background-color: $light_gray_blue_4;
  border-radius: 4px;
  width: 135px;
  height: 30px;
  position: absolute;
  top: 17px;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: $light_gray_blue_1;
  }
}

.page-contener {
  margin-top: 30px;
  max-width: 870px;
}

.plans {
  display: grid;
  margin-top: 50px;
  -ms-grid-columns: 48% 2% 48%;
  grid-template-columns: 48% 48%;
  grid-column-gap: 2%;
  -moz-column-gap: 2%;
  column-gap: 2%;
  grid-row-gap: 43px;
  row-gap: 43px;
}

.plan-footer {
  position: fixed;
  left: 200px;
  bottom: 0;
  width: 100%;
  background-color: rgba(247, 248, 253, 0.9);
  height: 104px;
  padding-top: 30px;
  z-index: 2;

  .footer-price-plan {
    margin-left: 125px;
  }

  .selected-label {
    color: #f09c9c;
    font-size: 18px;
    font-weight: 600;
  }
}

.decide-button {
  line-height: 40px;
  width: 232px;
  margin: auto 40px;
}

.sentence {
  background-color: $white_1;
  padding: 14px 20px;
  margin-top: -13px;
  border-radius: 4px;
  color: $red;
  margin-right: 35px;
}
</style>
