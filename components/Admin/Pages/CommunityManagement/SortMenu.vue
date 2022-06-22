<template>
  <div class="wrapper">
    <div
      v-for="(item, i) in items"
      :key="`sort-menu-${i}`"
      class="item"
      :class="{ selected: isSelected(item.value) }"
      @click="select(item.value)"
    >
      {{ item.text }}
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
  width: 150px;
  background-color: $true_white;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  padding: 10px 15px;
  text-align: left;
}

.item {
  position: relative;
  color: $gray_blue_4;
  font-size: 13px;
  font-weight: 300;
  display: inline-block;
  height: 13px;
  line-height: 13px;
  cursor: pointer;

  & + & {
    margin-top: 4px;
  }

  &.selected::before {
    content: '●';
    position: absolute;
    top: 0;
    left: -13px;
    transform: scale(0.5);
  }
}
</style>
