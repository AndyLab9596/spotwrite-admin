<template>
  <div class="page-container">
    <Register>
      <template v-slot:header>
        <h2>プランを選択</h2>
        <div>
          ご利用の人数に応じてプランをお選びいただけます。
        </div>
        <div>
          記載されているご利用料金はひと月あたりの金額です。
        </div>
      </template>
      <div class="plans">
        <Plan
          v-for="(plan, i) of plans"
          :key="i"
          :plan="plan"
          :plan-index="i"
          :storage-list="storageList"
          :selected="selectedPlanIndex === i"
          :products="products"
          :storage-selected="storageSelected"
          :stored-selected-plan="storedSelectedPlan"
          @onSelectedPlan="onSelectButtonClick"
          @sendContactPlan="sendContact"
        >
        </Plan>
      </div>
      <template v-slot:footer>
        <div class="plan-footer">
          <div>
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
              @click="onDecideButtonClick"
            >
              このプランに決定する
            </BaseButton>
          </div>
        </div>
      </template>
    </Register>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Register from '@/components/Admin/Templates/Register.vue';
import Plan from '@/components/Admin/Pages/ContractInfo/Plan.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import { fetchContractPlans, fetchContractPlanPrices } from '@/libs/api';
import { ContractPlan } from '@/store/contract';

export default Vue.extend({
  layout: 'clean',
  components: {
    Register,
    Plan,
    BaseButton,
  },
  data: () => ({
    plans: [] as ApiResponse.ContractPlan[],
    selectedPlanIndex: undefined as number | undefined,
    storageList: [] as ApiResponse.ContractPlanPrice[],
    storageSelected: 0 as number,
    totalPrice: 0 as Number,
    products: [] as any[],
  }),
  computed: {
    isEdit(): boolean {
      return 'edit' in this.$route.query;
    },
    storedSelectedPlan(): ContractPlan | undefined {
      return this.$accessor.contract.selectedPlan;
    },
  },
  async created() {
    if (this.$store.getters.isAccountHolderWithoutOwner === false) {
      this.$router.push({ path: '/admin' });
    }
    await this.fetchContractPlans();
    await this.fetchAdditionContractPlanPrice('storage');
    this.selectedPlanIndex = this.plans.findIndex(
      (p: ContractPlan): boolean => {
        return p.uuid === this.storedSelectedPlan?.uuid;
      }
    );
    const products = this.$accessor.contract?.selectedPlan?.products ?? [];
    this.products = products;
    products.forEach((item: any) => {
      const storage = this.storageList.find((s: any) => s.uuid === item.uuid);
      if (storage) {
        this.storageSelected = storage.monthly_price;
      }
    });
    this.totalPrice = this.$accessor.contract?.selectedPlan?.total_price ?? 0;
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
    async fetchAdditionContractPlanPrice(type: string): Promise<void> {
      try {
        const { data } = await fetchContractPlanPrices(type);
        this.storageList = data.data;
      } catch (e) {
        console.error(e);
      }
    },
    onSelectButtonClick(value: any): void {
      this.selectedPlanIndex = value.index ?? 0;
      this.totalPrice = value.price_total;
      this.products = value.products_data;
    },
    sendContact() {
      this.$router.push('/admin/register/special-plan-contact');
    },
    onDecideButtonClick(): void {
      if (
        this.selectedPlanIndex === undefined ||
        this.plans[this.selectedPlanIndex] === undefined
      ) {
        return;
      }
      const selectedPlan = this.plans[this.selectedPlanIndex];
      Vue.set(selectedPlan, 'products', this.products);
      Vue.set(selectedPlan, 'total_price', this.totalPrice);
      this.$accessor.contract.selectPlan(selectedPlan);
      if (this.isEdit) {
        this.$router.push('/admin/register/confirm');
      } else {
        this.$router.push('/admin/register/company');
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.page-container {
  font-size: 15px;
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
  width: 100vw;
  height: 104px;
  background-color: $true_white;
  text-align-last: center;
  padding-top: 30px;

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
</style>
