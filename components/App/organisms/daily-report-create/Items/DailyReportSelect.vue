<template>
  <div class="daily-report-select-wrapper">
    <p class="daily-report-select-title">日報選択</p>
    <div v-if="isPreviewMode" class="daily-report-select-button-wrapper">
      <button class="category-button category-button-active">
        本日の業務内容
      </button>
    </div>
    <div v-else class="daily-report-select-button-wrapper">
      <button
        v-for="item in dailyReportSettings"
        :key="item.uuid"
        class="category-button"
        :class="{
          'category-button-active':
            item.uuid === selectedDailyReportSettingItem,
        }"
        @click="clickButton(item.uuid)"
      >
        {{ item.title }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  layout: 'admin/default',
  props: {
    dailyReportSettings: {
      type: Array as PropType<AppApiResponse.DailyReportRequired[]>,
      default: () => [],
    },
    selectedDailyReportSettingItem: {
      type: String,
      default: '',
    },
    isPreviewMode: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clickButton(uuid: string) {
      this.$emit('select', uuid);
    },
  },
});
</script>

<style lang="scss" scoped>
.daily-report-select-title {
  font-size: 13px;
  font-weight: 600;
  line-height: 1em;
  color: $dark_blue;
  margin: 0 0 9px;
}

.daily-report-select-button-wrapper {
  display: flex;
  align-items: center;
  width: inherit;
  overflow-x: scroll;
  overflow-y: hidden;
}

.category-button {
  font-size: 13px;
  border: 1px solid $link_color;
  border-radius: 50px;
  height: 28px;
  padding: 0 20px; //TODO: 余白決まってなさそうだったので一旦この値で
  text-align: center;
  line-height: 28px;
  cursor: pointer;
  color: $link_color;
  background-color: $true_white;
  flex-shrink: 0;
  font-weight: 300;

  &:not(:last-child) {
    margin-right: 18px;
  }

  &-active {
    color: $true_white;
    background-color: $link_color;
  }
}
</style>
