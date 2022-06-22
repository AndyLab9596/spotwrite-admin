<template>
  <div>
    <div :class="{ group: plan.type === 'group' }" class="default-option">
      <!-- Type free -->
      <FreeDefaultOption
        v-if="plan.type === 'free'"
        :plan="plan"
        :default-option="defaultPlanData"
      >
      </FreeDefaultOption>
      <!-- Type single -->
      <SingleDefaultOption
        v-if="plan.type === 'single'"
        :plan="plan"
        :max-member="40"
        :default-option="defaultPlanData"
      >
      </SingleDefaultOption>
      <!-- Type Group -->
      <GroupDefaultOption
        v-if="plan.type === 'group'"
        :plan="plan"
        :max-member="defaultPlanData.max_member"
        :default-option="defaultPlanData"
        :group-price="groupPrice"
      >
      </GroupDefaultOption>
      <!-- Type special -->
      <SpecialDefaultOption v-if="plan.type === 'special'">
      </SpecialDefaultOption>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import FreeDefaultOption from '@/components/Admin/Pages/ContractInfo/Plan/FreeDefaultOption.vue';
import SingleDefaultOption from '@/components/Admin/Pages/ContractInfo/Plan/SingleDefaultOption.vue';
import GroupDefaultOption from '@/components/Admin/Pages/ContractInfo/Plan/GroupDefaultOption.vue';
import SpecialDefaultOption from '@/components/Admin/Pages/ContractInfo/Plan/SpecialDefaultOption.vue';

export default Vue.extend({
  components: {
    FreeDefaultOption,
    SingleDefaultOption,
    GroupDefaultOption,
    SpecialDefaultOption,
  },
  props: {
    plan: {
      type: Object as PropType<ApiResponse.ContractPlan>,
      required: true,
    },
    defaultPlanData: {
      type: Object as PropType<ApiResponse.ContractPlanPrice>,
      default: () => {},
    },
    groupPrice: {
      type: Array as any,
      default: () => [],
    },
  },
});
</script>

<style lang="scss" scoped>
.default-option {
  border-top: 1px dotted #7e8195;
  border-bottom: 1px dotted #7e8195;
  height: 102px;
  margin-left: 15px;
  margin-right: 15px;
  align-items: center;

  &.group {
    background-color: #fffceb;
  }

  .options {
    justify-content: center;
    padding-left: 10px;
    font-size: 15px;
    font-weight: 300;

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
}
</style>
