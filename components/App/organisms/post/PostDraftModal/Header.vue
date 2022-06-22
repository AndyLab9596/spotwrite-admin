<template>
  <div>
    <div class="header-container">
      <div class="row">
        <!-- 「サンプルを見る」の遷移先、アクションが決定したら有効にしてください -->
        <!-- <BaseButton inverse class="button">サンプルを見る</BaseButton> -->
      </div>
      <div class="row">
        <div class="title">
          {{ title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  computed: {},
  methods: {},
});
</script>

<style lang="scss" scoped>
.header-container {
  padding: 16px 16px 24px 16px;
  background-color: $white_1;

  .row {
    display: flex;
    justify-content: space-between;
  }

  .heading {
    color: $gentle_bluish_purple;
    font-weight: 600;
    font-size: 13px;
  }

  .button {
    padding: 0 16px;
  }

  .title {
    font-size: 15px;
    font-weight: 600;
  }

  .templates {
    margin-top: 8px;
    display: flex;
    font-size: 13px;
    color: $link_color;

    li {
      border: 1px solid $link_color;
      border-radius: 14px;
      // width: 130px;
      height: 28px;
      padding: 0 28px;
      text-align: center;
      line-height: 28px;
      cursor: pointer;
    }

    li:not(:last-child) {
      margin-right: 16px;
    }

    .active {
      color: $true_white;
      background-color: $link_color;
    }
  }
}
</style>
