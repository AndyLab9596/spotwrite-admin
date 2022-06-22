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
          <div class="post-theme-statistic">
            <div class="line">
              <span class="label">利用中テーマ</span>
              <span v-if="company.post_themes && company.post_themes.length">
                {{ company.post_themes[0].title }}
              </span>
            </div>
            <div class="line">
              <span class="label">次回以降の予約</span>
              <span v-if="company.post_themes && company.post_themes.length">
                {{ company.post_themes.length - 1 }}記事
              </span>
            </div>
          </div>
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
};

export default Vue.extend({
  name: 'CompanyTabs',
  props: {
    companies: {
      type: Array as PropType<Company[]>,
      required: true,
    },
    currentId: {
      type: String,
      required: true,
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
      return this.companies.length > 4;
    },
  },
});
</script>

<style lang="scss" scoped>
.scrollable-tabs {
  position: relative;
  height: 100px;

  .arrow-left {
    position: absolute;
    left: 3px;
    top: 50%;
    z-index: 10;
    transform: translateY(-50%);
  }

  .arrow-right {
    position: absolute;
    right: 3px;
    top: 50%;
    z-index: 10;
    transform: translateY(-50%);
  }

  .arrow-button {
    border: 0;
    cursor: pointer;
  }

  .wrapper {
    position: relative;
    margin: 0 40px;
    height: 100px;
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
    line-height: 1;
    width: 200px;
    border: solid 1px $light_gray_blue_5;
    border-radius: 4px;
    padding: 15px;
    cursor: pointer;
    outline: none;
    margin-right: 15px;
    background-color: $true_white;
    text-align: center;
    font-size: 15px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      background-color: $light_gray_blue_5;
    }

    &.active {
      font-weight: bold;
      background-color: $light_gray_blue_5;
    }

    .post-theme-statistic {
      font-weight: normal;
      text-align: left;
      margin-top: 10px;
      background: #f7f8fd;
      border-radius: 4px;
      padding: 7px 10px;
      font-size: 12px;

      .line {
        display: flex;

        & + .line {
          margin-top: 5px;
        }

        span {
          &.label {
            flex-grow: 1;
          }

          &:not(.label) {
            font-weight: bold;
          }
        }
      }
    }
  }
}

.badge::before {
  content: '●';
  color: red;
}
</style>
