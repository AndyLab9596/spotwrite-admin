<template>
  <select v-model="propedValue" @change="$emit('input', propedValue)">
    <option value="slowly"
      >ゆっくり<span v-if="rule.slowly"
        >（{{ toLabel('slowly') }}）</span
      ></option
    >
    <option value="normal"
      >普通<span v-if="rule.normal">（{{ toLabel('normal') }}）</span></option
    >
    <option value="frequent"
      >頻繁<span v-if="rule.frequent"
        >（{{ toLabel('frequent') }}）</span
      ></option
    >
  </select>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: '',
    },
    rule: {
      type: Object,
      default: () => ({} as ApiResponse.PostRule),
    },
  },
  data() {
    return {
      propedValue: this.value,
      labelMap: {
        three_months: '3ヶ月',
        month: '1ヶ月',
        week: '一週間',
        two_years: '2年',
        year: '1年',
        six_months: '6ヶ月',
      } as { [key: string]: string },
    };
  },
  methods: {
    toLabel(key: string): string {
      return this.labelMap[this.rule[key]] ?? '';
    },
  },
});
</script>

<style lang="scss" scoped>
select {
  color: $gray_blue_4;
  width: 100%;
  height: 30px;
  padding: 4px;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  background-color: $extra_light_gray;
}
</style>
