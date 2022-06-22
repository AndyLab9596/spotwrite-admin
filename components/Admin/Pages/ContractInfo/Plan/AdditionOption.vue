<template>
  <div>
    <div class="addition-option">
      <!-- *** Type free *** -->
      <FreeAdditionOption
        v-if="plan.type === 'free'"
        :storage-list="storageList"
        :storage-selected="storageSelected"
        @changeStorage="changeStorage"
      >
      </FreeAdditionOption>
      <!-- *** Type single *** -->
      <SingleAdditionOption
        v-if="plan.type === 'single'"
        :storage-list="storageList"
        :storage-selected="storageSelected"
        :member-selected="memberNumSelected"
        :products="$props.products"
        @changeStorage="changeStorage"
        @changeMember="changeMember"
      >
      </SingleAdditionOption>
      <!-- *** Type group *** -->
      <GroupAdditionOption
        v-if="plan.type === 'group'"
        :storage-list="storageList"
        :storage-selected="storageSelected"
        :group-price="groupPrice"
        :products="$props.products"
        @changeStorage="changeStorage"
        @changeMember="changeMember"
      >
      </GroupAdditionOption>
      <!-- *** Type special *** -->
      <SpecialAdditionOption v-if="plan.type === 'special'">
      </SpecialAdditionOption>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { enumContractPlan } from '@/libs/definition';
import FreeAdditionOption from '@/components/Admin/Pages/ContractInfo/Plan/FreeAdditionOption.vue';
import SingleAdditionOption from '@/components/Admin/Pages/ContractInfo/Plan/SingleAdditionOption.vue';
import GroupAdditionOption from '@/components/Admin/Pages/ContractInfo/Plan/GroupAdditionOption.vue';
import SpecialAdditionOption from '@/components/Admin/Pages/ContractInfo/Plan/SpecialAdditionOption.vue';

export default Vue.extend({
  components: {
    FreeAdditionOption,
    SingleAdditionOption,
    GroupAdditionOption,
    SpecialAdditionOption,
  },
  props: {
    plan: {
      type: Object as PropType<ApiResponse.ContractPlan>,
      required: true,
    },
    storageList: {
      type: Array as any,
      required: true,
    },
    groupPrice: {
      type: Array as any,
      default: () => [],
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
  data() {
    return {
      memberNumSelected: 0 as number,
      storage: 0 as number,
    };
  },
  watch: {
    groupPrice() {
      if (this.$props.groupPrice.length > 0) {
        if (this.$props.plan.type === 'group') {
          this.memberNumSelected = this.$props.groupPrice[0].monthly_price ?? 0;
          setTimeout(() => {
            let products =
              this.$accessor.contract?.selectedPlan?.products ?? [];
            if (this.$props.products.length > 0) {
              products = this.$props.products ?? [];
            }
            const productsUuid = products.map((item: any) => {
              return item.uuid;
            });
            this.$props.groupPrice.forEach((item: any) => {
              if (productsUuid.includes(item.uuid)) {
                this.memberNumSelected = item.monthly_price;
              }
            });
          }, 800);
        }
        if (this.$props.plan.type === 'free') {
          this.memberNumSelected = this.$props.groupPrice.max_member;
        }
      }
    },
    storageSelected() {
      this.storage = Number(this.$props.storageSelected);
    },
    products() {
      if (this.$props.plan.type === 'group') {
        if (this.$props.products.length > 0) {
          const products = this.$props.products ?? [];
          const productsUuid = products.map((item: any) => {
            return item.uuid;
          });
          if (this.$props.groupPrice.length > 0) {
            this.$props.groupPrice.forEach((item: any) => {
              if (productsUuid.includes(item.uuid)) {
                this.memberNumSelected = item.monthly_price;
              }
            });
          }
        }
      }
    },
  },
  computed: {
    selectedPlan(): ApiResponse.ContractPlan | undefined {
      return this.$accessor.contract.selectedPlan;
    },
  },
  mounted() {
    const minMember = enumContractPlan.MAX_MEMBER_PLAN_FREE + 1;
    setTimeout(() => {
      let products = this.$accessor.contract?.selectedPlan?.products ?? [];
      if (this.$props.products.length > 0) {
        products = this.$props.products ?? [];
      }
      if (this.$props.plan.type === 'single') {
        this.memberNumSelected = minMember;
        if (products.length > 0) {
          products.forEach((item: any) => {
            if (item.quantity >= minMember) {
              this.memberNumSelected = item.quantity;
            }
          });
        }
      }
      if (this.$props.plan.type === 'group') {
        const productsUuid = products.map((item: any) => {
          return item.uuid;
        });
        this.$props.groupPrice.forEach((item: any) => {
          if (productsUuid.includes(item.uuid)) {
            this.memberNumSelected = item.monthly_price;
          }
        });
      }
    }, 1000);
  },
  methods: {
    changeStorage(value: number) {
      this.storage = value;
    },
    changeMember(value: number) {
      this.memberNumSelected = value;
    },
  },
});
</script>

<style lang="scss" scoped>
.addition-option {
  justify-content: center;
  height: 110px;
  margin-left: 15px;
  margin-right: 15px;
  margin-top: 15px;
  background-color: #f7f8fd;
}
</style>
