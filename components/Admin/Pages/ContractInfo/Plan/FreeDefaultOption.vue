<template>
  <div class="options">
    <div class="option">
      <span class="lable">最大利用人数</span>
      <div class="number">
        <span class="num">{{ defaultMember }}</span> 人
      </div>
    </div>
    <div class="option">
      <span class="lable">利用容量</span>
      <div class="number">
        <span class="num">
          {{ storageOnePerson }}
        </span>
        GB
        <span :style="[{ fontSize: '10px' }]">/ 1人</span>
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
  },
  computed: {
    storageOnePerson() {
      const maxStorage = this.$props.defaultOption.max_storage ?? 0;
      const maxMember = this.$props.defaultOption.max_member ?? 0;
      if (maxMember <= 0) {
        return 0;
      }
      return Number(maxStorage) / Number(maxMember);
    },
    defaultMember() {
      return this.$props.defaultOption.max_member ?? 0;
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
  margin-top: 25px;

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
    }
  }

  .storage-option {
    height: 22px;
    width: 320px;
  }
}
</style>
