<template>
  <ul class="weeks">
    <li
      v-for="week in weeks"
      :key="week.key"
      class="week"
      :class="selectedWeeks.includes(week.key) ? 'active' : ''"
      @click="clickWeek(week.key)"
    >
      {{ week.name }}
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';

type WeekItem = {
  key: string;
  name: string;
};

export default Vue.extend({
  name: 'DayOfTheWeekSelector',
  props: {
    selectedWeeks: {
      type: Array,
      default: [] as string[],
    },
  },
  computed: {
    weeks(): WeekItem[] {
      return [
        { key: 'sunday', name: '日' },
        { key: 'monday', name: '月' },
        { key: 'tuesday', name: '火' },
        { key: 'wednesday', name: '水' },
        { key: 'thursday', name: '木' },
        { key: 'friday', name: '金' },
        { key: 'saturday', name: '土' },
      ];
    },
  },
  methods: {
    clickWeek(key: string): void {
      if (this.selectedWeeks.includes(key)) {
        this.$emit('removeWeek', key);
      } else {
        this.$emit('addWeek', key);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.weeks {
  display: flex;
  justify-content: space-between;
  height: 28px;
  width: 256px;
}

.week {
  height: 28px;
  width: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 50%;
  border: 1px solid $link_color;
  color: $link_color;
  user-select: none;
  line-height: 1em;
}

.active {
  color: $true_white;
  background-color: $link_color;
  border-color: $pink_orange;
}
</style>
