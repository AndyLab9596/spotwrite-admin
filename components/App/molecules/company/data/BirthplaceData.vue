<template>
  <div class="data-item">
    <div class="data-item__header">
      <icon-bg src="/app/icon/icon-earth.svg" />
      <span>出身地の割合は？</span>
    </div>
    <div
      v-if="show && regions && highestCount"
      class="data-item__contents hometown"
    >
      <div
        v-for="region in regions"
        :key="region.name"
        class="region"
        :class="{ 'region--pink': region.count === highestCount }"
      >
        <div class="region__name">{{ region.name }}</div>
        <div class="region__count">{{ region.percent }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import IconBg from '../../../atoms/icons/IconBg.vue';

export default Vue.extend({
  components: {
    IconBg,
  },
  props: {
    regions: {
      default: null,
      type: Array,
    },
    highestCount: {
      default: null,
      type: Number,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.data-item {
  position: relative;
  flex: 50%;
  max-width: 50%;
  margin: 24px 0;
}

.data-item__header {
  display: flex;
  align-items: center;

  span {
    margin: 0 0 0 16px;
    font-size: 15px;
    font-weight: 600;
    color: $main_color;
  }
}

.data-item__contents {
  width: 100%;
  margin: 16px 0 0;
}

.data-item__contents.hometown {
  background-image: url('/app/image/data/japan.svg');
  background-size: initial;
  background-position: center;
  background-repeat: no-repeat;
}

.hometown {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 0fr 0fr 0fr;
  column-gap: 13px;
  row-gap: 16px;

  :first-child {
    grid-column-start: 1;
    grid-column-end: 4;
  }

  :nth-child(7) {
    grid-column-start: 2;
    grid-column-end: 3;
  }
}

.region {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: $icon_gray;
  opacity: 0.9;
  color: $true_white;
  position: relative;

  &--pink {
    background-color: $link_color;
  }

  &::after {
    content: '%';
    font-size: 9px;
    line-height: 21px;
    position: absolute;
    bottom: 8px;
    right: 6px;
  }
}

.region__name {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 22.75px;
}

.region__count {
  font-size: 24px;
  line-height: 29px;
  margin: 0 2px 0 0;
}
</style>
