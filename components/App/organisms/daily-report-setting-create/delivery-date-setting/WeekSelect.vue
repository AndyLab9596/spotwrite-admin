<template>
  <div class="week-select-wrapper">
    <day-of-the-week-selector
      :selected-weeks="selectedWeeks"
      @removeWeek="removeWeek"
      @addWeek="addWeek"
    />
    <div class="count-wrapper">
      <p>繰り返す間隔</p>
      <input
        type="number"
        :value="intervalDays"
        class="input"
        placeholder="繰り返し間隔を入力"
        @input="changeInput"
      />
      <p>日おき</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DayOfTheWeekSelector from '@/components/App/molecules/daily-report/DayOfTheWeekSelector.vue';

export default Vue.extend({
  components: {
    DayOfTheWeekSelector,
  },
  props: {
    selectedWeeks: {
      type: Array as PropType<string[]>,
      required: true,
    },
    intervalDays: {
      type: Number,
      required: false,
      default: null,
    },
  },
  methods: {
    removeWeek(key: string) {
      this.$emit('removeWeek', key);
    },
    addWeek(key: string) {
      this.$emit('addWeek', key);
    },
    changeInput(event: { target: HTMLInputElement }) {
      this.$emit('changeIntervalDay', event.target.value);
    },
  },
});
</script>

<style lang="scss" scoped>
.week-select-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.count-wrapper {
  display: flex;
  align-items: center;

  p {
    color: $main_color;
    font-size: 15px;

    &:first-of-type {
      margin: 0 15px 0 0;
    }
  }
}

.input {
  background-color: $input_text_background_color;
  width: 200px;
  border-radius: 4px;
  border: 1px solid $ruled_line;
  height: 44px;
  margin: 0 20px 0 0;
  padding: 0 0 0 16px;
}
</style>
