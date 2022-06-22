<template>
  <div class="addition-option-item">
    <div class="option-item">
      <div class="option-text">
        利用容量を追加して頂くことが可能です。お気軽にお問い合わせください。
      </div>
    </div>
    <div class="storage-info">
      <span class="storage-des">※1100円(税込) / 10GB</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style lang="scss" scoped>
.addition-option-item {
  height: 30px;
  width: 320px;
  margin-bottom: 5px;
  float: left;
  margin-top: 2px;
  padding: 10px;

  .option-item {
    width: 100%;
    float: left;
    margin-top: 8px;

    .option-text {
      font-size: 15px;
      font-weight: 300;
      margin-left: 5px;
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

.storage-info {
  width: '48%';
  float: 'left';
  line-height: '1.4';
  margin-top: '10px';
}
</style>
