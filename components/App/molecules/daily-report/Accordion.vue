<template>
  <div v-cloak class="accordion">
    <div
      class="trigger"
      role="button"
      @click="accordionToggle"
      @mouseover.stop="isShowPopup = true"
      @mouseleave="isShowPopup = false"
    >
      <div class="title">
        <div class="popup-wrapper">
          {{ tag === 'main' ? '閲覧メイン' : '閲覧サブ' }}
          <div v-if="isShowPopup && !isOpened">
            <div class="arrow-left"></div>
            <div class="popup">
              <div
                v-for="item in body"
                :key="item.uuid"
                class="item"
                @click="$emit('click', clickItemUuid(item.uuid))"
              >
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        v-if="isOpened"
        class="close"
        src="/app/icon/Icon-arrow_right.svg"
        alt="close"
      />
      <img v-else src="/app/icon/Icon-arrow_right.svg" alt="open" />
    </div>
    <transition
      name="accordion"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <div v-if="isOpened" ref="target" class="target">
        <div
          v-for="(item, index) in body"
          :key="index"
          class="body"
          :class="{ selected: isSelectedItem(item.uuid) }"
          role="button"
          @click="$emit('click', clickItemUuid(item.uuid))"
        >
          {{ item.title }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

type Item = {
  uuid: string;
  title: string;
};

export default Vue.extend({
  props: {
    body: {
      type: Array as PropType<Item[]>,
      required: true,
    },
    selected: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isShowPopup: false,
      isOpened: false,
      showSubItem: false,
    };
  },
  watch: {
    body() {
      if (this.isOpened) {
        this.$refs.target.style.removeProperty('height');
        setTimeout(() => {
          this.enter(this.$refs.target as HTMLElement);
        }, 0);
      }
    },
  },
  methods: {
    isSelectedItem(uuid: string) {
      return this.selected === uuid;
    },
    clickItemUuid(uuid: string) {
      return this.tag.length ? `${this.tag}-${uuid}` : uuid;
    },
    accordionToggle() {
      this.isOpened = !this.isOpened;
    },
    beforeEnter(element: HTMLElement) {
      // eslint-disable-next-line no-param-reassign
      element.style.height = '0';
    },
    enter(element: HTMLElement) {
      const height = `${element.scrollHeight}px`;
      // eslint-disable-next-line no-param-reassign
      element.style.height = height;
    },
    beforeLeave(element: HTMLElement) {
      const height = `${element.scrollHeight}px`;
      // eslint-disable-next-line no-param-reassign
      element.style.height = height;
    },
    leave(element: HTMLElement) {
      // eslint-disable-next-line no-param-reassign
      element.style.height = '0';
    },
  },
});
</script>

<style lang="scss" scoped>
.accordion {
  position: relative;
  background-color: $true_white;
  color: $main_color;

  &-enter-active {
    animation-duration: 1s;
    animation-fill-mode: both;
    animation-name: accordion--anime__opened;
  }

  &-leave-active {
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-name: accordion--anime__closed;
  }
}

.trigger {
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
  padding: 0 16px;
}

.title {
  display: flex;
  justify-content: center;
  align-items: center;

  &__text {
    font-size: 13px;
    letter-spacing: 0;
    line-height: 1.3em;
    margin-right: 8px;
  }
}

.target {
  transition: height 0.4s ease-in-out;

  a {
    display: flex;
    align-items: center;
    padding: 0 20px;
    flex-grow: 1;
    font-size: 12px;
    font-weight: 300;
    height: 36px;
  }
}

.body {
  width: 100%;
  transition: all 0.2s ease-in;
  text-align: left;
  outline: none;
  border: none;
  cursor: pointer;
  padding: 7px 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5em;
  max-height: 46px;

  &.selected {
    background-color: $pink;
    color: $true_white;
  }
}

.popup {
  padding: 20px 10px;
  position: absolute;
  width: 180px;
  right: -180px;
  max-height: 310px;
  border-radius: 4px;
  background-color: rgba(228, 229, 237, 0.9);
  overflow-y: auto;
  top: -17px;
}

.arrow-left {
  position: absolute;
  right: 0;
  margin-top: -15px;
  border: 9px solid transparent;
  border-right: 9px solid rgba(228, 229, 237, 0.9);
  z-index: 1;
  top: 28px;
}

.item {
  padding: 10px 16px;
  font-size: 13px;

  &.selected {
    font-weight: 600;
  }
}

@keyframes accordion--anime__opened {
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

.close {
  transform: rotateZ(-90deg);
}
</style>
