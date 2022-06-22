<template>
  <div class="plan" :class="{ selected }">
    <img v-if="selected" class="check-icon" src="/icon/icon_circle-check.png" />
    <PlanContentData
      :name="planName"
      :title="planTitle"
      :heading="planHeading"
      :body="planBody"
      :type="plan.type"
      :selected="selected"
    >
    </PlanContentData>
    <DefaultOption
      :plan="plan"
      :default-plan-data="defaultData"
      :group-price="groupPrice"
    >
    </DefaultOption>
    <AdditionOption
      ref="selectPlanOption"
      :plan="plan"
      :storage-list="storageItems"
      :storage-selected="
        storedSelectedPlan !== undefined &&
        storedSelectedPlan.type === plan.type
          ? storageSelected
          : 0
      "
      :group-price="groupPrice"
      :products="$props.products"
    >
    </AdditionOption>
    <BaseButton
      size="large"
      :class="selected ? 'plan-button-selected' : 'plan-button'"
      @click="onSelectButtonClick()"
    >
      {{ buttonPlanText }}
    </BaseButton>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { fetchContractPlanPrices } from '@/libs/api';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import PlanContentData from '@/components/Admin/Pages/ContractInfo/Plan/ContentData.vue';
import DefaultOption from '@/components/Admin/Pages/ContractInfo/Plan/DefaultOption.vue';
import AdditionOption from '@/components/Admin/Pages/ContractInfo/Plan/AdditionOption.vue';

export default Vue.extend({
  components: {
    BaseButton,
    PlanContentData,
    DefaultOption,
    AdditionOption,
  },
  props: {
    plan: {
      type: Object as PropType<ApiResponse.ContractPlan>,
      required: true,
    },
    storageList: {
      type: Array as PropType<ApiResponse.ContractPlanPrice[]>,
      default: () => [],
    },
    selected: {
      type: Boolean,
      default: false,
    },
    planIndex: {
      type: Number,
      default: 0,
    },
    storageSelected: {
      type: Number,
      default: 0,
    },
    products: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    defaultData: {} as ApiResponse.ContractPlanPrice,
    groupPrice: [] as ApiResponse.ContractPlanPrice[],
    totalPrice: 0 as number,
    contractPlanPrices: [] as ApiResponse.ContractPlanPrice[],
  }),
  computed: {
    planName(): string {
      return this.$props.plan.name;
    },
    planTitle(): string {
      const contentData = this.$props.plan.content_data;
      const titleStr = contentData.title;
      return titleStr.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
    },
    planHeading(): string {
      const contentData = this.$props.plan.content_data;
      const headingStr = contentData.heading;
      return headingStr.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
    },
    planBody(): string {
      const contentData = this.$props.plan.content_data;
      const bodyStr = contentData.body;
      return bodyStr.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
    },
    storageItems(): any {
      const priceStorage = [
        {
          max_storage: '選択してください。',
          monthly_price: 0,
          uuid: '',
        },
        ...this.$props.storageList,
      ];
      return priceStorage.map((item: ApiResponse.ContractPlanPrice) => ({
        name: item.max_storage,
        value: Number(item.monthly_price),
        uuid: item.uuid,
      }));
    },
    buttonPlanText(): string {
      return this.$props.plan.type === 'special'
        ? '問い合わせをする'
        : 'このプランを選択';
    },
    storedSelectedPlan(): ApiResponse.ContractPlan | undefined {
      return this.$accessor.contract.selectedPlan;
    },
  },
  async created() {
    if (this.$props.plan.type !== 'special') {
      await Promise.all([this.fetchContractPlanPrice(this.$props.plan.type)]);
    }
  },
  methods: {
    async fetchContractPlanPrice(type: string): Promise<void> {
      try {
        const { data } = await fetchContractPlanPrices(type);
        this.contractPlanPrices = data.data;
        if (type === 'free' || type === 'single') {
          // eslint-disable-next-line prefer-destructuring
          this.defaultData = this.contractPlanPrices[0];
        }
        if (type === 'group') {
          const endIndex = this.contractPlanPrices.length;
          this.defaultData = this.contractPlanPrices[endIndex - 1];
          this.groupPrice = this.contractPlanPrices;
        }
      } catch (e) {
        console.error(e);
      }
    },
    onSelectButtonClick() {
      const products = [];
      const selected = this.$refs.selectPlanOption.$data.storage;
      const priceStorageSelected = this.$props.storageList.find(
        (item: ApiResponse.ContractPlanPrice) => item.monthly_price === selected
      );
      if (priceStorageSelected) {
        products.push({
          uuid: priceStorageSelected.uuid,
          quantity: 1,
        });
      }
      let priceDefault = 0;
      if (this.$props.plan.type === 'special') {
        this.$emit('sendContactPlan');
        return false;
      }
      const priceStorage = this.$refs.selectPlanOption.$data.storage;
      if (this.$props.plan.type === 'free') {
        products.push({
          uuid: this.defaultData.uuid,
          quantity: 1,
        });
      }
      if (this.$props.plan.type === 'single') {
        priceDefault =
          Number(this.defaultData.monthly_price) *
          this.$refs.selectPlanOption.$data.memberNumSelected;

        products.push({
          uuid: this.defaultData.uuid,
          quantity: this.$refs.selectPlanOption.$data.memberNumSelected,
        });
      }
      if (this.$props.plan.type === 'group') {
        priceDefault = this.$refs.selectPlanOption.$data.memberNumSelected;
        const findPriceMember = this.contractPlanPrices.find(
          (item: ApiResponse.ContractPlanPrice) =>
            item.monthly_price === priceDefault
        );
        if (findPriceMember) {
          products.push({
            uuid: findPriceMember.uuid,
            quantity: 1,
          });
        }
      }
      const totalPrice = priceStorage + priceDefault;
      this.$emit('onSelectedPlan', {
        index: this.$props.planIndex,
        price_total: totalPrice,
        type: this.$props.plan.type,
        products_data: products,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.plan {
  width: 380px;
  height: 500px;
  background-color: $true_white;
  border-radius: 24px;
  flex-direction: column;
  align-items: center;
  margin: 0 33px;
  margin-bottom: 22px;
  border: 1px solid #c2c4cc;

  .select-storage {
    background-color: $true_white;
  }

  .storage-des {
    font-size: 11px;
    margin-left: 5px;
    font-weight: 600;
    color: #6a6d83;
  }

  .check-icon {
    position: absolute;
    margin-left: 190px;
    margin-top: -33px;
    transform: translateX(-50%);
    z-index: 1;
    width: 28px;
  }
}

.plan-button {
  line-height: 40px;
  width: 232px;
  margin-left: 74px;
  margin-top: 15px;
  background-color: $true_white;
  border: 1px solid #e4e5ed;
  color: darkgray;
}

.plan-button-selected {
  line-height: 40px;
  width: 232px;
  margin-left: 74px;
  margin-top: 15px;
}

.plan-button:hover {
  background-color: $true_white;
  border: 1px solid #e4e5ed;
  color: darkgray;
}

.selected {
  box-shadow: inset 0 0 0 3px $pink;
  border-color: $pink;
}
</style>
