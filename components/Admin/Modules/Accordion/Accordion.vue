<template>
  <div v-cloak class="accordion-wrapper">
    <button
      class="accordion-group"
      :class="{ closed: !isOpened }"
      type="button"
      @click="accordionToggle()"
    >
      <div class="title">
        <div class="icon">
          <img :src="iconPath" />
        </div>
        <p class="title__text" v-html="title" />
      </div>
      <img v-if="isOpened" src="/icon/icon_hide@2x.png" />
      <img v-else src="/icon/icon_open@2x.png" />
    </button>
    <transition
      name="accordion"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <div v-if="isOpened" ref="group_items" class="group_items">
        <div
          v-for="(item, index) in body"
          :key="index"
          class="accordion-item"
          :class="{
            current: $route.path === item.path || hasSubCurrent(item),
          }"
        >
          <nuxt-link v-if="item.path !== null" tag="a" :to="item.path">
            {{ item.name }}
          </nuxt-link>
          <div
            v-else
            class="menubox"
            @mouseover="toggleSubItem(true)"
            @mouseleave="toggleSubItem(false)"
          >
            <a class="menu">{{ item.name }}</a>
            <transition name="fade">
              <div v-show="showSubItem" class="sub-menu">
                <button
                  v-for="(subItem, key) in item.items"
                  :key="key"
                  class="sub-menu__button"
                  @click="clickSubMenu(subItem.path)"
                >
                  {{ subItem.name }}
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

type MenuItem = {
  name: string;
  path: string;
  items?: MenuItem[];
};

export default Vue.extend({
  props: {
    /**
     * CAUTION: v-htmlをつかってエスケープを解除しているが、入ってくる値は内部で生成した静的な文字列なので大丈夫。
     * そのため動的な値を入れないように注意すること！
     */
    title: {
      type: String,
      required: true,
    },
    iconPath: {
      type: String,
      required: true,
    },
    body: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isOpened: true,
      showSubItem: false,
    };
  },
  : {
    body() {
      if (this.isOpened) {
        this.$refs.group_items.style.removeProperty('height');
        setTimeout(() => {
          this.enter(this.$refs.group_items as HTMLElement);
        }, 0);
      }
    },
  },
  mounted() {
    // 初回のアコーディオンを閉じるアニメーションをきかせるために
    // マウント時にアコーディオンボディの高さを設定する
    this.enter(this.$refs.group_items as HTMLElement);
  },
  methods: {
    accordionToggle() {
      this.isOpened = !this.isOpened;
    },
    beforeEnter(element: HTMLElement) {
      // eslint-disable-next-line no-param-reassign
      element.style.height = '0';
    },
    enter(element: HTMLElement) {
      // eslint-disable-next-line no-param-reassign
      element.style.height = `${element.scrollHeight + 1}px`;
    },
    beforeLeave(element: HTMLElement) {
      // eslint-disable-next-line no-param-reassign
      element.style.height = `${element.scrollHeight}px`;
    },
    leave(element: HTMLElement) {
      // eslint-disable-next-line no-param-reassign
      element.style.height = '0';
    },
    toggleSubItem(active: boolean) {
      this.showSubItem = active;
    },
    clickSubMenu(url: string) {
      this.toggleSubItem(false);
      this.$router.push({
        path: url,
      });
    },
    hasSubCurrent(item: MenuItem) {
      if (!item.items || !item.items.length) {
        return false;
      }
      return item.items.filter((i: MenuItem) => i.path === this.$route.path)
        .length;
    },
  },
});
</script>

<style lang="scss" scoped>
.accordion-wrapper {
  position: relative;
  background-color: $true_white;

  &-enter-active {
    animation-duration: 1s;
    animation-fill-mode: both;
    animation-name: accordion--anime__opend;
  }

  &-leave-active {
    animation-duration: 1s;
    animation-fill-mode: both;
    animation-name: accordion--anime__closed;
  }
}

.accordion-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 44px;
  transition: all 0.2s ease-in;
  text-align: left;
  outline: none;
  border: none;
  cursor: pointer;
  padding: 0 20px 0 10px;
  background-color: $light_gray_blue_4;
  border-bottom: solid 1px $white_1;

  &.closed {
    border-bottom-color: $true_white;
  }
}

.title {
  display: flex;
  justify-content: center;
  align-items: center;

  .icon {
    display: flex;
    align-items: center;
    width: 26px;
    height: 26px;
    margin-right: 8px;
  }

  img {
    object-fit: contain;
    height: 26px;
  }

  &__text {
    font-size: 12px;
    letter-spacing: 0;
    line-height: 1;
    color: $gray_blue_4;
    font-weight: 600;
    margin-right: 8px;
  }
}

.group_items {
  transition: height 0.4s ease-in-out;

  a {
    display: flex;
    align-items: center;
    padding: 0 20px;
    color: $gray_blue_4;
    flex-grow: 1;
    font-size: 12px;
    font-weight: 300;
    height: 36px;
  }
}

.accordion-item {
  display: flex;
  background-color: $white_1;
  font-size: 14px;
  transition: all 0.2s ease-in;

  &:hover {
    background-color: #e3e7f7;
  }

  &.current {
    background-color: #e3e7f7;
    border: 1px solid #6f779b;
    border-radius: 4px;
  }
}

@keyframes accordion--anime__opend {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes accordion--anime__closed {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.menubox {
  position: relative;
  width: 100%;
  height: 100%;
}

.menu {
  cursor: pointer;
}

.sub-menu {
  z-index: 20;
  border-radius: 5px;
  border: 1px solid #e4e5ed;
  background-color: $true_white;
  width: 150px;
  margin-left: 10px;
  position: absolute;
  top: 0;
  left: 100%;
  text-align: left;

  &__button {
    border: none;
    display: block;
    background-color: $true_white;
    color: #7e8195;
    padding: 10px;
  }
}

.fade-enter,
.fade-leave-to {
  transition: opacity 0.8s;
}
</style>
