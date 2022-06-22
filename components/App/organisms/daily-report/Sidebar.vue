<template>
  <div class="sidebar" :class="[isCollapsed ? 'collapsed' : 'expanded']">
    <div class="toggle-button">
      <img src="/app/icon/Icon-arrow_right.svg" alt="open" />
    </div>
    <div class="item selectable selected">すべての日報</div>
    <reading-group-menu
      :main-menu-items="mainMenuItems"
      :sub-menu-items="subMenuItems"
      @select-main-group="selectMainGroup"
      @select-sub-group="selectSubGroup"
    />
    <div class="item divide">
      <div>個人</div>
      <div
        role="button"
        class="with-icon"
        @click="$emit('show-select-employees-modal')"
      >
        <div>{{ displayUserName }}</div>
        <img src="/app/icon/Icon-pulldown.svg" alt="select_person" />
      </div>
    </div>
    <div class="item divide">
      <div>部署</div>
      <div
        role="button"
        class="with-icon"
        @click="$emit('show-select-organizations-modal')"
      >
        <div>{{ displayOrganizationName }}</div>
        <img src="/app/icon/Icon-pulldown.svg" alt="select_organization" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ReadingGroupMenu from '@/components/App/molecules/daily-report/ReadingGroupMenu.vue';
import { fetchDailyReportsSettings } from '@/libs/api/app';

export default Vue.extend({
  components: {
    ReadingGroupMenu,
  },
  props: {
    userName: {
      type: String,
      default: null,
    },
    organizationName: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isCollapsed: false,
      isShow: {
        main: false,
        sub: false,
      },
      mainMenuItems: [
        {
          uuid: 'allmain',
          title: 'すべて',
        },
      ] as AppApiResponse.DailyReportSettingItem[],
      subMenuItems: [
        { uuid: 'allsub', title: 'すべて' },
      ] as AppApiResponse.DailyReportSettingItem[],
    };
  },
  computed: {
    displayUserName(): string {
      return this.userName === null ? '選択してください' : this.userName;
    },
    displayOrganizationName(): string {
      return this.organizationName === null
        ? '選択してください'
        : this.organizationName;
    },
  },
  async created() {
    const {
      data: { read_only_main_settings: main, read_only_sub_settings: sub },
    } = await fetchDailyReportsSettings();
    this.mainMenuItems = [...this.mainMenuItems, ...main];
    this.subMenuItems = [...this.subMenuItems, ...sub];
  },
  methods: {
    selectMainGroup(value: string) {
      this.$emit('select-main-group', value);
    },
    selectSubGroup(value: string) {
      this.$emit('select-sub-group', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100vh;
  width: 168px;
  display: flex;
  flex-direction: column;
  transition-timing-function: ease;
  transition-duration: 0.5s;
  top: 0;
  position: fixed;
  left: 240px;
  padding-top: 92px;
  border-left: solid 1px $light_gray_blue_2;
  border-right: solid 1px $light_gray_blue_2;
  background-color: $true_white;
  z-index: 1;

  .toggle-button {
    position: fixed;
    top: 42px;
    left: 251px;

    & > img {
      height: 16px;
      width: 10px;
      transition-timing-function: ease;
      transition-duration: 0.5s;
    }
  }

  &.collapsed {
    left: 97px;
  }

  &.expanded {
    .toggle-button > img {
      transform: rotateY(180deg);
    }
  }
}

.item {
  padding: 10px 16px;
  font-size: 13px;

  &.selected {
    font-weight: 600;
  }
}

.divide {
  border-top: solid 1px $light_gray_blue_2;
  border-bottom: solid 1px $light_gray_blue_2;

  & > div {
    padding: 10px 0;
  }

  & + & {
    border-top: none;
  }
}

.with-icon {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &[role='button'] {
    cursor: pointer;
  }
}
</style>
