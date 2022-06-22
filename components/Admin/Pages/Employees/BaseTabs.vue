<template>
  <div class="base-tabs">
    <div ref="wrapper">
      <div ref="tabs" class="tabs" :style="[{ left: '0px' }]">
        <button
          v-for="item in items"
          :key="item.id"
          class="tab"
          :class="{
            active: active(item.id),
          }"
          :disabled="disabled || disabledItems.includes(item.id)"
          @click="$emit('change-tab', item.id)"
          v-html="item.name"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

type Item = {
  id: string;
  name: string;
};

export default Vue.extend({
  props: {
    /**
     * CAUTION: item.nameの値をv-htmlをつかってエスケープを解除しているが、入ってくる値は内部で生成した静的な文字列なので大丈夫。
     * そのためitem.nameの値に動的な値を入れないように注意すること！
     */
    items: {
      type: Array as PropType<Item[]>,
      required: true,
    },
    currentId: {
      type: String,
      required: true,
    },
    disabledItems: {
      type: Array as string[],
      default: [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scrollStep: 164,
    };
  },
  computed: {
    active() {
      return (id: string): boolean => {
        return this.currentId === id;
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.base-tabs {
  position: relative;
  height: 50px;

  .wrapper {
    position: relative;
    height: 50px;
    margin: 0 40px;
    overflow-x: hidden;
  }

  .tabs {
    position: absolute;
    display: flex;
    justify-content: start;
    width: 100%;
  }

  .tab {
    height: 50px;
    line-height: 1;
    width: 19%;
    border: solid 1px $light_gray_blue_5;
    border-radius: 4px;
    cursor: pointer;
    outline: none;
    background-color: $true_white;
    text-align: center;
    font-size: 15px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: $gray_blue_4;
    margin-right: 15px;

    &.active {
      background-color: $light_gray_blue_5;
      font-weight: bold;
      color: $dark_blue;
    }

    &:last-child {
      margin-right: 0;
    }

    &[disabled] {
      background-color: #f3f3f3;
      cursor: not-allowed;
    }
  }
}
</style>
