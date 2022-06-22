<template>
  <div>
    <div
      class="go-to-analytics-button-container"
      :class="{
        current: $route.path === to || hasSubCurrent,
      }"
      @mouseover="mouseover"
      @mouseleave="mouseleave"
    >
      <nuxt-link
        tag="button"
        :to="to"
        class="button-box"
        :class="{ 'beginner-setting': buttonIndex == 0 ? true : false }"
      >
        <div class="icon-box">
          <img :src="icon" class="icon-speaker" />
        </div>
        <p>{{ text }}</p>
      </nuxt-link>
      <transition name="fade">
        <template v-if="isSideMenuActive">
          <div v-if="items && items.length" class="side-menu">
            <nuxt-link
              v-for="(item, index) in items"
              :key="index"
              :to="item.path"
            >
              {{ item.name }}
            </nuxt-link>
          </div>
          <div v-else-if="enabledSideMenu" class="side-menu">
            <nuxt-link to="/admin/analysis/useCheck">利用度チェック</nuxt-link>
            <nuxt-link to="/admin/analysis/mentalCheck">
              モチベーションチェック
            </nuxt-link>
          </div>
        </template>
      </transition>
    </div>
    <hr v-if="buttonIndex == 0" class="horizontal" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SideMenuOutlinedButton',
  props: {
    icon: {
      type: String,
      required: true,
      default: '',
    },
    text: {
      type: String,
      required: true,
      default: '',
    },
    to: {
      type: String,
      default: '#',
    },
    items: {
      type: Array,
      default: () => [],
    },
    enabledSideMenu: {
      type: Boolean,
      default: false,
    },
    buttonIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isSideMenuActive: false as boolean,
    };
  },
  computed: {
    hasSubCurrent(): boolean {
      if (!this.items || !this.items.length) {
        return false;
      }
      return this.items.filter(
        (item: MenuItem) => item.path === this.$route.path
      ).length;
    },
  },
  methods: {
    mouseover() {
      this.isSideMenuActive = true;
    },
    mouseleave() {
      this.isSideMenuActive = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.go-to-analytics-button-container {
  position: relative;
  background-color: $true_white;

  &:hover,
  &.current {
    background-color: $light_gray_blue_3;
  }
}

button {
  padding: 0;
  width: 160px;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  height: 36px;
  background: none;
  color: $gray_blue_4;
  transition: all 0.2s ease-in;
}

.horizontal {
  margin: 10px 0;
  height: 1px;
  background-color: $light_gray_blue_3;
  border: none;
  color: $light_gray_blue_3;
}

.button-box {
  display: flex;
  align-items: center;
  flex-flow: row;

  p {
    letter-spacing: 0;
    line-height: 1em;
    font-weight: 600;
    font-size: 12px;
  }
}

.beginner-setting {
  background-color: #dde0f0;
  color: #7d83b3;

  &:hover {
    background-color: $light_gray_blue_9;
  }
}

.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 100%;
}

.side-menu {
  position: absolute;
  top: 0;
  background-color: $true_white;
  left: 164px;
  width: 150px;
  z-index: 8;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  padding: 10px;

  a {
    display: inline-block;
    color: inherit;
    font-size: 12px;
    white-space: nowrap;
    line-height: 1;

    & + a {
      margin-top: 18px;
    }
  }
}

.fade-enter,
.fade-leave-to {
  transition: opacity 0.8s;
}
</style>
