<template>
  <select
    v-model="propedValue"
    :class="classSelect"
    @change="$emit('input', propedValue)"
  >
    <option value="strong"
      >強め<span v-if="rule.strong">（{{ toLabel('strong') }}）</span></option
    >
    <option value="normal"
      >普通<span v-if="rule.normal">（{{ toLabel('normal') }}）</span></option
    >
    <option value="weak"
      >弱め<span v-if="rule.weak">（{{ toLabel('weak') }}）</span></option
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
      default: () => ({} as ApiResponse.Alert),
    },
    hasRule: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      propedValue: this.value,
      labelMap: {
        once: '期限が切れた時に1度',
        once_one_week_before: '期限切れの一週間前に1度',
        everyday_one_week_before: '期限切れの一週間前から毎日',
      } as { [key: string]: string },
    };
  },
  computed: {
    classSelect() {
      return {
        change: this.hasRule,
      };
    },
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
