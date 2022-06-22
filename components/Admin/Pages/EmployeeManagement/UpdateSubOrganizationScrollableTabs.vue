<template>
  <div class="scrollable-tabs">
    <div ref="wrapper" :class="{ wrapper: hasCompaniesExceeded() }">
      <div ref="tabs" class="tabs" :style="[{ left: '0px' }]">
        <button
          v-for="company in companies"
          :key="company.uuid"
          class="tab"
          :class="{
            active: active(company.uuid),
          }"
          @click="$emit('change-tab', company.uuid)"
        >
          {{ company.name }}
          <span v-if="displayUserCount && company.users"
            >({{ company.users.length }})</span
          >
        </button>
      </div>
    </div>
    <div
      v-if="hasCompaniesExceeded()"
      class="arrow-left"
      @click="scrollRight()"
    >
      <div class="arrow-button">
        <img src="/icon/icon_go_left.svg" alt="" />
      </div>
    </div>
    <div
      v-if="hasCompaniesExceeded()"
      class="arrow-right"
      @click="scrollLeft()"
    >
      <div class="arrow-button">
        <img src="/icon/icon_go_right.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

type Company = {
  uuid: string;
  name: string;
  users?: [];
};

export default Vue.extend({
  props: {
    companies: {
      type: Array as PropType<Company[]>,
      required: true,
    },
    currentId: {
      type: String,
      required: true,
    },
    companyCountThreshold: {
      type: Number,
      required: false,
      default: 5,
    },
    displayUserCount: {
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
  methods: {
    scrollRight() {
      const el = (this.$refs.tabs as any) as HTMLOrSVGImageElement;
      const value = Number(el.style.left.replace('px', ''));
      const to = value + this.scrollStep;
      if (to < 0) {
        el.style.left = `${to}px`;
        return;
      }
      el.style.left = `0px`;
    },
    scrollLeft() {
      const targetElement = (this.$refs.tabs as any) as HTMLOrSVGImageElement;
      const wrapperElement = (this.$refs
        .wrapper as any) as HTMLOrSVGImageElement;
      const currentValue = Number(targetElement.style.left.replace('px', ''));
      const maxValue = targetElement.clientWidth - wrapperElement.clientWidth;
      const to = Math.abs(currentValue) + this.scrollStep;
      if (to < maxValue) {
        targetElement.style.left = `-${to}px`;
        return;
      }
      targetElement.style.left = `-${maxValue}px`;
    },
    hasCompaniesExceeded() {
      return this.companies.length > this.companyCountThreshold;
    },
  },
});
</script>

<style lang="scss" scoped>
.scrollable-tabs {
  position: relative;
  height: 50px;

  .arrow-left {
    height: 100%;
    position: absolute;
    left: 3px;
    top: 8.5px;
    z-index: 10;
  }

  .arrow-right {
    height: 100%;
    position: absolute;
    right: 3px;
    top: 8.5px;
    z-index: 10;
  }

  .arrow-button {
    border: 0;
    cursor: pointer;
  }

  .wrapper {
    position: relative;
    height: 50px;
    margin: 0 40px;
    overflow-x: hidden;
  }

  .tabs {
    position: absolute;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: max-content;
  }

  .tab {
    height: 40px;
    line-height: 1;
    width: 160px;
    border: solid 1px $light_gray_blue_5;
    border-radius: 4px;
    padding: 0 20px;
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

    &:not(:last-child) {
      margin-right: 15px;
    }

    &:hover {
      background-color: $light_gray_blue_5;
    }

    &.active {
      font-weight: bold;
      background-color: $light_gray_blue_5;
    }
  }
}
</style>
