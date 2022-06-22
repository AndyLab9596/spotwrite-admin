<template>
  <div class="daily-report-settings-content-wrapper">
    <p class="daily-report-settings-left-text">
      {{ leftText }}
    </p>
    <div class="daily-report-settings-right-item">
      <p class="daily-report-settings-right-text">{{ rightText }}</p>
      <img src="/icon/Icon-arrow_right_pink.svg" class="icon-arrow" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    leftText: {
      type: String,
      required: true,
    },
    rightText: {
      type: String,
      required: true,
    },
  },
  methods: {
    clickCreate() {
      // TODO: 日報追加する画面に遷移する処理かく
    },
  },
});
</script>

<style lang="scss" scoped>
.daily-report-settings-content-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 40px;
  border-bottom: 1px solid $ruled_line;
  background-color: $true-white;
}

.daily-report-settings-left-text {
  font-size: 15px;
  font-weight: 300;
  color: $main_color;
}

.daily-report-settings-right-item {
  display: flex;
  align-items: center;

  .daily-report-settings-right-text {
    font-family: 'Lato', 'Hiragino Kaku Gothic Pro', sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: $main_color;
    margin: 0 17px 0 0;
  }

  .icon-arrow {
    width: 8px;
  }
}
</style>
