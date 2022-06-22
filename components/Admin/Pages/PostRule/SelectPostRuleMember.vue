<template>
  <select
    v-model="propedValue"
    :style="styleSelect"
    :class="classSelect"
    @change="$emit('input', propedValue)"
  >
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
    fontColor: {
      type: String,
      default: '#6a6d83',
    },
    hasRule: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      propedValue: this.value,
      initValue: '' as string,
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
  computed: {
    styleSelect() {
      return {
        color: this.fontColor,
      };
    },
    classSelect() {
      return {
        change: this.hasRule,
      };
    },
  },
  created() {
    this.initValue = this.value;
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

.change {
  border: solid 1px #a8acc7;
  background-color: $true_white;
  font-weight: bold;
}
</style>
