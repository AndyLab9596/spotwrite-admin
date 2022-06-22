<template>
  <div class="wrapper">
    <div class="inner">
      <div
        v-for="(item, i) in items"
        :key="`radio-${i}`"
        class="item"
        :class="{ selected: isSelected(item.value) }"
        @click="select(item.value)"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  model: {
    prop: 'selected',
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    selected: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      state: '',
    };
  },
  computed: {
    selectedValue: {
      get(): string {
        return this.selected ?? this.state;
      },
      set(v: string) {
        this.state = v;
      },
    },
    isSelected(): (v: string) => boolean {
      return (v: string) => v === this.selectedValue;
    },
  },
  methods: {
    select(v: string) {
      this.selectedValue = v;
      this.$emit('input', v);
    },
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  display: inline-block;
}

.inner {
  padding: 2px;
  background-color: $white_1;
  border: solid 1px $light_gray_blue_3;
  border-radius: 7px;
  height: 30px;
  display: flex;
  align-items: center;
}

.item {
  color: $gray_blue_4;
  font-size: 13px;
  font-weight: 300;
  display: inline-block;
  height: 24px;
  line-height: 17px;
  padding: 3px 15px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  cursor: pointer;

  & + & {
    margin-left: 3px;
  }

  &.selected {
    background-color: $true_white;
    box-shadow: 0 0 3px 0 $light_gray;
    font-weight: 600;
  }
}
</style>
