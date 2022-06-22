<template>
  <div class="options">
    <div class="option">
      <span class="lable">利用人数</span>
      <div class="number"><span class="num">501</span> 人以上</div>
    </div>
    <div class="option">
      <span class="lable">利用容量</span>
      <div class="number">
        <span class="negotiable-text">応相談</span>
      </div>
    </div>
    <div class="option">
      <span class="lable">利用料金</span>
      <div class="number">
        <span class="negotiable-text">応相談</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style lang="scss" scoped>
.options {
  justify-content: center;
  padding-left: 10px;
  margin-top: 10px;
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

  .negotiable-text {
    font-size: 13px;
    font-weight: 600;
  }

  .storage-option {
    height: 22px;
    width: 320px;
  }
}
</style>
