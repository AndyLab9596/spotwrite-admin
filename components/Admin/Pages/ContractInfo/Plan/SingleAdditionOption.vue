<template>
  <div class="addition-option-item">
    <div class="member-option">
      <span class="option-text">
        ご利用人数
      </span>
      <br />
    </div>
    <div class="member-input">
      <base-select
        v-model="memberNumSelected"
        class="select-storage"
        :items="memberNumOption"
        dropdown-scroll-item
        @input="onChangeMember"
      />
    </div>
    <div class="unit">
      <span class="unit-text">
        人
      </span>
    </div>
    <div class="storage-option">
      <span class="option-text">
        追加する容量を選択
      </span>
      <br />
      <span class="storage-des">※1100円(税込) / 10GB</span>
    </div>
    <div class="storage-input">
      <base-select
        v-model="storage"
        class="select-storage"
        :items="storageList"
        dropdown-scroll-item
        @input="onChangeStorage"
      />
    </div>
    <div class="unit">
      <span class="unit-text">
        ㎇
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { enumContractPlan } from '@/libs/definition';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';

const minMember = enumContractPlan.MAX_MEMBER_PLAN_FREE + 1;
const maxMember = enumContractPlan.MAX_MEMBER_PLAN_SINGLE;

export default Vue.extend({
  components: {
    BaseSelect,
  },
  props: {
    storageList: {
      type: Array as any,
      required: true,
    },
    storageSelected: {
      type: Number,
      default: 0,
    },
    memberSelected: {
      type: Number,
      default: minMember,
    },
    products: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      memberNumSelected: minMember as Number,
      storage: 0 as Number,
    };
  },
  computed: {
    memberNumOption() {
      const memberNumberItem = [];
      for (let i = minMember; i <= maxMember; i += 1) {
        memberNumberItem.push({
          name: i,
          value: i,
        });
      }
      return memberNumberItem;
    },
  },
  watch: {
    storageSelected() {
      this.storage = Number(this.$props.storageSelected);
    },
    memberSelected() {
      this.memberNumSelected = Number(this.$props.memberSelected);
    },
  },
  mounted() {
    setTimeout(() => {
      let products = this.$accessor.contract?.selectedPlan?.products ?? [];
      if (this.$props.products.length > 0) {
        products = this.$props.products ?? [];
      }
      if (products.length > 0) {
        products.forEach((item: any) => {
          if (item.quantity >= minMember) {
            this.memberNumSelected = item.quantity;
          }
        });
      }
    }, 1000);
  },
  methods: {
    onChangeStorage(value: number) {
      this.storage = value;
      this.$emit('changeStorage', value);
    },
    onChangeMember(value: number) {
      this.memberNumSelected = value;
      this.$emit('changeMember', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.addition-option-item {
  height: 30px;
  width: 320px;
  margin-bottom: 5px;
  margin-top: 2px;
  padding: 5px;
  float: left;

  .member-option {
    width: 48%;
    float: left;
    margin-top: 8px;
  }

  .option-text {
    font-size: 15px;
    font-weight: 300;
    margin-left: 5px;
  }

  .member-input {
    width: 48%;
    float: left;
    margin-bottom: 10px;
  }

  .unit {
    width: 4%;
    float: left;

    .unit-text {
      float: left;
      margin-top: 10px;
      margin-left: 8px;
    }
  }

  .storage-option {
    width: 48%;
    float: left;
    line-height: 1.4;
  }

  .storage-input {
    width: 48%;
    float: left;
  }
}

.select-storage {
  background-color: $true_white;
}

.storage-des {
  font-size: 11px;
  margin-left: 5px;
  font-weight: 600;
  color: #6a6d83;
}
</style>
