<template>
  <div class="base-tabs">
    <div
      ref="wrapper"
      :class="{
        wrapper: canScrollTabs,
        'wrapper-overflow': !autoScroll,
      }"
    >
      <ul
        ref="tabs"
        class="tabs"
        :class="{
          'tabs-scroll': canScrollTabs,
          'tabs-overflow': !autoScroll,
        }"
        :style="[{ left: '0px' }]"
      >
        <li
          v-for="item in items"
          :key="item.id"
          class="tab"
          :class="{
            active: active(item.id),
            'tab-overflow': !autoScroll,
          }"
          :style="[autoScroll ? { width: `${tabWidth}px` } : { width: 'auto' }]"
          @click="$emit('change-tab', item.id)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div v-if="canScrollTabs">
      <div class="arrow-left" @click="scrollRight()">
        <img
          class="arrow-image"
          src="/app/icon/icon-arrow_right_white.svg"
          alt="arrow left"
        />
      </div>
      <div class="arrow-right" @click="scrollLeft()">
        <img
          class="arrow-image"
          src="/app/icon/icon-arrow_right_white.svg"
          alt="arrow right"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    items: {
      type: Array as PropType<AppTypes.TabItem[]>,
      required: true,
    },
    selectedTab: {
      type: String,
      required: true,
    },
    itemCountThreshold: {
      type: Number,
      required: false,
      default: 5,
    },
    width: {
      type: Number,
      required: false,
      default: 800,
    },
    autoScroll: {
      default: true,
      type: Boolean,
    },
  },
  computed: {
    active() {
      return (id: string): boolean => {
        return this.selectedTab === id;
      };
    },
    canScrollTabs(): boolean {
      return this.items.length > this.itemCountThreshold;
    },
    tabWidth(): number {
      if (this.items.length < this.itemCountThreshold) {
        return this.width / this.items.length;
      }
      return this.width / this.itemCountThreshold;
    },
  },
  methods: {
    scrollRight() {
      const el = this.$refs.tabs as HTMLElement;
      const value = Number(el.style.left.replace('px', ''));
      const to = value + this.tabWidth;
      if (to < 0) {
        el.style.left = `${to}px`;
        return;
      }
      el.style.left = `0px`;
    },
    scrollLeft() {
      const targetElement = this.$refs.tabs as HTMLElement;
      const wrapperElement = this.$refs.wrapper as HTMLElement;
      const currentValue = Number(targetElement.style.left.replace('px', ''));
      const maxValue = targetElement.clientWidth - wrapperElement.clientWidth;
      const to = Math.abs(currentValue) + this.tabWidth;
      if (to <= maxValue) {
        targetElement.style.left = `-${to}px`;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.base-tabs {
  position: relative;
  min-height: 68px;
  border-radius: 4px;
  padding: 0 44px;
  box-shadow: 0 3px 6px $box-shadow;
}

.arrow-left {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%) scale(-1, 1);
  width: 24px;
  height: 24px;
  background-color: $icon_gray;
  border-radius: 50%;
  box-shadow: 0 1px 2px #dce5ef;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.arrow-right {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background-color: $icon_gray;
  border-radius: 50%;
  box-shadow: 0 1px 2px #dce5ef;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.arrow-image {
  width: 7px;
}

.wrapper {
  position: relative;
  overflow-x: hidden;
  height: 68px;
}

.tabs {
  display: flex;
  justify-content: space-around;
}

.tabs-scroll {
  position: absolute;
  width: max-content;
  transition-duration: 0.5s;
}

.tab {
  font-size: 13px;
  color: $sub_color;
  line-height: 1;
  padding: 30px 0 21px;
  text-align: center;
  cursor: pointer;

  &.active {
    font-weight: bold;
    color: $link_color;
    border-bottom: solid 4px;
    border-image: $gradient_5;
    border-image-slice: 1;
  }
}

.wrapper-overflow {
  width: 100%;
}

.tabs-overflow {
  overflow-y: hidden;
  overflow-x: auto;
  justify-content: initial;
}

.tab-overflow {
  flex: 1 0 300px;
}
</style>
