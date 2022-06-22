<template>
  <div class="options">
    <div class="option">
      <span class="lable">最大利用人数</span>
      <div class="number">
        <span class="num">{{ maxMember }}</span> 人
      </div>
    </div>
    <div class="option">
      <label class="lable">利用容量</label>
      <div class="number">
        <span class="num">{{ storageOnePerson }}</span> GB
        <span class="unit">/ 1人</span>
      </div>
    </div>
    <div class="option">
      <span class="lable">利用料金</span>
      <div class="number">
        <span class="num">{{ priceOnePerson }}</span> 円（税込）
        <span class="unit">/ 1人</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
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
      default: 40,
    },
  },
  computed: {
    storageOnePerson() {
      const priceDefaultPlan = this.$props.defaultOption;
      return priceDefaultPlan.max_storage;
    },
    priceOnePerson() {
      const priceDefaultPlan = this.$props.defaultOption;
      return priceDefaultPlan.monthly_price;
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

      .unit {
        font-size: 10px;
      }

      .capacityText {
        color: #f09c9c;
        font-size: 15px;
      }
    }
  }

  .storage-option {
    height: 22px;
    width: 320px;
  }
}
</style>
