<template>
  <div class="addition-option-item">
    <div class="label-option">
      <span class="label-text">ご利用人数帯</span><br />
    </div>
    <div class="member-option">
      <base-select
        v-model="memberSelected"
        class="select-storage"
        :style="[{ fontSize: '11px' }]"
        :items="groupPriceAndStorageItems"
        :disabled="disabled"
        dropdown-scroll-item
        @input="onChangeMember"
      />
    </div>
    <div class="member-unit">
      <span class="unit-text">
        人
      </span>
    </div>
    <div class="storage-option">
      <span class="label-text">
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
    <div class="storage-unit">
      <span class="unit-text">
        ㎇
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';

export default Vue.extend({
  components: {
    BaseSelect,
  },
  props: {
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
      memberSelected: 0 as Number,
      storage: Number(this.$props.storageSelected) as Number,
      disabled: false as Boolean,
    };
  },
  computed: {
    groupPriceAndStorageItems() {
      let minMember: number = 41;
      const priceItems: any = [];
      const products = this.$accessor.contract?.selectedPlan?.products ?? [];
      const productsUuid = products.map((item: any) => {
        return item.uuid;
      });

      this.$props.groupPrice.forEach((item: any, index: number) => {
        if (index > 0) {
          const firstPrice = this.$props.groupPrice[index - 1];
          minMember = firstPrice.max_member + 1;
        }
        const nameStr = `${minMember}～${
          item.max_member
        }人 ${item.monthly_price.toLocaleString()}円`;
        priceItems.push({
          name: nameStr,
          value: item.monthly_price,
          uuid: item.uuid,
        });
        if (productsUuid.includes(item.uuid)) {
          this.memberSelected = item.monthly_price;
        }
      });
      return priceItems;
    },
  },
  watch: {
    groupPrice() {
      if (this.$props.groupPrice.length > 0) {
        this.memberSelected = this.$props.groupPrice[0].monthly_price ?? 0;
        let products = this.$accessor.contract?.selectedPlan?.products ?? [];
        if (this.$props.products.length > 0) {
          products = this.$props.products ?? [];
        }
        const productsUuid = products.map((item: any) => {
          return item.uuid;
        });
        this.$props.groupPrice.forEach((item: any) => {
          if (productsUuid.includes(item.uuid)) {
            this.memberSelected = item.monthly_price;
          }
        });
        this.disabled = true;
      }
    },
    storageSelected() {
      this.storage = Number(this.$props.storageSelected);
    },
  },
  mounted() {
    setTimeout(() => {
      let products = this.$accessor.contract?.selectedPlan?.products ?? [];
      if (this.$props.products.length > 0) {
        products = this.$props.products ?? [];
      }
      const productsUuid = products.map((item: any) => {
        return item.uuid;
      });
      this.$props.groupPrice.forEach((item: any) => {
        if (productsUuid.includes(item.uuid)) {
          this.memberSelected = item.monthly_price;
        }
      });
    }, 1000);
  },
  methods: {
    onChangeStorage(value: number) {
      this.storage = value;
      this.$emit('changeStorage', value);
    },
    onChangeMember(value: number) {
      this.memberSelected = value;
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
  padding: 5px;
  float: left;
  margin-top: '2px';

  .label-option {
    width: 48%;
    float: left;
    margin-top: 8px;
  }

  .label-text {
    font-size: '15px';
    font-weight: 300;
    margin-left: 5px;
  }

  .member-option {
    width: 48%;
    float: left;
    margin-bottom: 10px;
  }

  .member-unit {
    width: 4%;
    float: left;
  }

  .unit-text {
    float: left;
    margin-top: 10px;
    margin-left: 8px;
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

  .storage-unit {
    width: 4%;
    float: left;
  }
}

.plan-button {
  line-height: 40px;
  width: 232px;
  margin-left: 74px;
  margin-top: 15px;
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
