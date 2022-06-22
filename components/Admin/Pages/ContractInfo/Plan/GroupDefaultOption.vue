<template>
  <div class="options">
    <div class="option">
      <span class="lable">最大利用人数</span>
      <div class="number">
        <span class="num">{{ maxMember }}</span> 人
      </div>
    </div>
    <div class="option">
      <span class="lable">利用容量</span>
      <div class="number"><span>人数帯に毎に異なります</span></div>
    </div>
    <div class="option">
      <div class="number">
        <img
          class="icon-mark"
          src="/app/image/contract-plan/icon-mark.svg"
          @click="showModal"
        />
        <span class="capacityText">人数帯ごとの料金・容量表</span>
      </div>
    </div>
    <ModalGroupPrice
      v-if="showModalGroupPrice"
      :group-price="groupPriceAndStorageItems"
      @close="closeModal()"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ModalGroupPrice from '@/components/Admin/Pages/ContractInfo/Plan/ModalGroupPrice.vue';

export default Vue.extend({
  components: {
    ModalGroupPrice,
  },
  props: {
    plan: {
      type: Object as PropType<ApiResponse.ContractPlan>,
      required: true,
    },
    defaultOption: {
      type: Object as PropType<ApiResponse.ContractPlanPrice>,
      required: false,
      default: () => {},
    },
    maxMember: {
      type: Number,
      required: false,
      default: 500,
    },
    groupPrice: {
      type: Array as any,
      default: () => [],
    },
  },
  data() {
    return {
      showModalGroupPrice: false as boolean,
    };
  },
  computed: {
    groupPriceAndStorageItems() {
      let minMember = 41;
      const priceItems: any = [];
      this.$props.groupPrice.forEach((item: any, index: number) => {
        if (index > 0) {
          const firstPrice = this.$props.groupPrice[index - 1];
          minMember = firstPrice.max_member + 1;
        }
        const numberMemberStr = `${minMember}～${item.max_member.toString()}`;
        priceItems.push({
          numberMembers: numberMemberStr,
          price: item.monthly_price.toLocaleString(),
          storage: item.max_storage,
        });
      });
      return priceItems;
    },
  },
  methods: {
    showModal() {
      this.showModalGroupPrice = true;
    },
    closeModal() {
      this.showModalGroupPrice = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.options {
  justify-content: center;
  padding-left: 10px;
  font-size: 15px;
  font-weight: 300;
  margin-top: 10px;

  .option {
    height: 30px;
    width: 320px;
    margin-bottom: 5px;
    margin-top: -5px;
    float: left;

    .lable {
      float: left;
    }

    .number {
      float: right;

      .num {
        font-size: 15px;
        font-size: 18px;
        font-weight: bold;
      }

      .capacityText {
        color: #f09c9c;
        font-size: 15px;
      }

      .icon-mark {
        margin-bottom: 4px;
        cursor: pointer;
      }
    }
  }

  .storage-option {
    height: 22px;
    width: 320px;
  }
}
</style>
