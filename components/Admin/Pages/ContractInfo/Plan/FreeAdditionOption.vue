<template>
  <div class="addition-option-item">
    <div class="label-option">
      <span class="label-text">追加する容量を選択</span><br />
      <span class="storage-des">※1100円(税込) / 10GB</span>
    </div>
    <div class="option-input">
      <base-select
        v-model="storage"
        class="select-storage"
        :items="storageList"
        dropdown-scroll-item
        @input="onChangeStorage"
      />
    </div>
    <div class="option-unit">
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
    storageSelected: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      storage: 0 as Number,
    };
  },
  watch: {
    storageSelected() {
      this.storage = Number(this.$props.storageSelected);
    },
  },
  methods: {
    onChangeStorage(value: number) {
      this.storage = value;
      this.$emit('changeStorage', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.addition-option-item {
  height: 30px;
  width: 320px;
  margin-bottom: 5px;
  margin-top: 30px;
  padding: 5px;
  float: left;

  .label-option {
    width: 48%;
    float: left;
    line-height: 1.4;

    .label-text {
      font-size: 15px;
      font-weight: 300;
      margin-left: 5px;
    }
  }

  .option-input {
    width: 48%;
    float: left;
  }

  .option-unit {
    width: 4%;
    float: left;

    .unit-text {
      float: left;
      margin-top: 10px;
      margin-left: 8px;
    }
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
