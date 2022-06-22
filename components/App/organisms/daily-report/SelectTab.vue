<template>
  <div class="tab">
    <div
      class="item"
      :class="{ selected: currentTab === 1 }"
      role="button"
      @click="changeTab(1)"
    >
      <span class="title">提出日報</span>&nbsp;(&nbsp;<span class="count">{{
        submittedCount
      }}</span
      >件&nbsp;)&nbsp;
    </div>
    <div
      class="item"
      :class="{ selected: currentTab === 2 }"
      role="button"
      @click="changeTab(2)"
    >
      <span class="title">未着日報</span>&nbsp;(&nbsp;<span class="count">{{
        notSubmittedCount
      }}</span
      >件&nbsp;)&nbsp;
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  layout: 'app/default',
  props: {
    currentTab: {
      type: Number,
      required: true,
    },
    submittedCount: {
      type: Number,
      default: null,
    },
    notSubmittedCount: {
      type: Number,
      default: null,
    },
  },
  methods: {
    changeTab(key: number) {
      this.$emit('tab', key);
    },
  },
});
</script>

<style lang="scss" scoped>
*[role='button'] {
  cursor: pointer;
}

.tab {
  display: flex;

  .item {
    color: $sub_color;
    flex-grow: 1;
    padding: 20px 0;
    text-align: center;
  }

  & .item.selected {
    color: $main_color;
    border-bottom: solid 4px;
    border-image: $gradient_5;
    border-image-slice: 1;

    .title {
      font-weight: 600;
      font-size: 14px;
    }

    .count {
      font-family: 'Lato', sans-serif;
      font-weight: bold;
      color: $pink;
    }
  }
}
</style>
