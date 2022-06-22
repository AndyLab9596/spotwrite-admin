<template>
  <transition name="modal" appear>
    <div class="modal-overlay">
      <div ref="container" class="modal-window">
        <img
          v-if="displayCloseButton || slides.length <= 1"
          src="/app/icon/cross.svg"
          class="close"
          @click="onClose"
        />
        <transition name="list">
          <div
            v-if="slides.length && !translating"
            ref="content"
            :class="
              `modal-contents ${slides[activeIndex].type} ${isMovingClass}`
            "
            @mousedown="onMouseDown"
            @mouseup="onMouseUp"
          >
            <img class="popup-image" :src="currentImage" />
            <div class="item-list">
              <div
                v-for="(item, itemIndex) in currentSlide"
                :key="itemIndex"
                class="item-group"
              >
                <div v-if="item.prefix" class="prefix">{{ item.prefix }}</div>
                <template v-if="item.items">
                  <template v-for="(childItem, index) in item.items">
                    <div
                      v-if="isShowDate(item.items, index)"
                      :key="`date-${index}`"
                      class="date"
                    >
                      {{ childItem.date }}
                    </div>
                    <div
                      v-else-if="isShowLine(item.items, index)"
                      :key="`line-${index}`"
                      class="line"
                    ></div>
                    <div :key="index" class="item">{{ childItem.content }}</div>
                  </template>
                </template>
                <div v-else class="item">{{ item.content }}</div>
              </div>
            </div>
          </div>
        </transition>
        <template v-if="slides.length > 1">
          <div class="navigation-container">
            <div
              v-for="(slide, slideIndex) in slides"
              :key="slideIndex"
              class="icon-dot"
              :class="{
                active: activeIndex === slideIndex && !translating,
              }"
              @click="slideTo(slideIndex)"
            ></div>
          </div>
          <img
            v-if="!(!displayCloseButton && activeIndex === 0)"
            src="/icon/arrow_left.svg"
            class="icon-left"
            @click="prev"
          />
          <img src="/icon/arrow_right.svg" class="icon-right" @click="next" />
        </template>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

import { readUserPopup } from '@/libs/api/app';

type Slide = {
  type: string;
  list: AppApiResponse.UserPopup[];
};

export default Vue.extend({
  props: {
    popups: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    slides: [] as Slide[],
    activeIndex: 0 as number,
    images: {
      default: '/app/image/popup_02.svg',
      'community-add-member': '/app/image/popup_10.svg',
      'community-add-self': '/app/image/popup_10.svg',
      'end-community-news-post': '/app/image/popup_07.svg',
      'publish-community': '/app/image/popup_10.svg',
      'store-community': '/app/image/popup_10.svg',
      'important-post': '/app/image/popup_08.svg',
      'start-post-theme': '/app/image/popup_01.svg',
      'end-post-theme': '/app/image/popup_03.svg',
      'many-likes-post': '/app/image/popup_11.svg',
      'organization-publish': '/app/image/popup_05.svg',
      'organization-member-add': '/app/image/popup_05.svg',
      'organization-user-register': '/app/image/popup_05.svg',
      'end-my-episode-posts-deadline': '/app/image/popup_04.svg',
      'close-end-department-news-post': '/app/image/popup_02.svg',
      'close-end-my-episode-post': '/app/image/popup_02.svg',
      'store-event-post': '/app/image/popup_10.svg',
      'close-user-profile-update-deadline': '/app/image/popup_05.svg',
      'end-department-news-post': '/app/image/popup_04.svg',
    },
    translating: false,
    displayCloseButton: false,
    isMouseDown: false,
    mouseDownX: null,
    listViewedIndex: [0] as Array,
  }),
  computed: {
    currentSlide() {
      const slide = this.slides[this.activeIndex].list;
      const reduce = (
        newItems: AppApiResponse.UserPopup[],
        item: AppApiResponse.UserPopup
      ) => {
        if (item.content?.multiple) {
          const isMultiple = slide.findIndex(
            (i: AppApiResponse.UserPopup, index: number) =>
              i.prefix === item.prefix && index !== slide.indexOf(item)
          );
          if (isMultiple > -1) {
            const findIndex = newItems.findIndex(
              (i: AppApiResponse.UserPopup) => i.prefix === item.prefix
            );
            if (findIndex > -1) {
              const { items } = newItems[findIndex];
              const findExistIndex = items.findIndex(
                (i: AppApiResponse.UserPopup) =>
                  i.content === item.content.multiple && i?.date === item?.date
              );
              if (findExistIndex === -1) {
                const pushItem = { ...item, content: item.content.multiple };
                let pushIndex = -1;
                if (item.date) {
                  const sameDateItems = items.filter(
                    (i: AppApiResponse.UserPopup) => i.date === item.date
                  );
                  if (sameDateItems.length) {
                    const sameLineItems = sameDateItems.filter(
                      (i: AppApiResponse.UserPopup) =>
                        i.line_type === item.line_type
                    );
                    if (sameLineItems.length) {
                      pushIndex = items.indexOf(sameLineItems.pop()) + 1;
                    } else if (item.line_type === 'company') {
                      pushIndex = items.indexOf(sameDateItems.shift());
                    } else if (item.line_type === 'organization') {
                      const companyLineItems = sameDateItems.filter(
                        (i: Type.Popup) => i.line_type === 'company'
                      );
                      if (companyLineItems.length) {
                        pushIndex = items.indexOf(companyLineItems.pop()) + 1;
                      } else {
                        pushIndex = items.indexOf(sameDateItems.shift());
                      }
                    } else {
                      pushIndex = items.indexOf(sameDateItems.pop()) + 1;
                    }
                    items.splice(pushIndex, 0, pushItem);
                  }
                }
                if (pushIndex === -1) {
                  items.push(pushItem);
                }
              }
            } else {
              newItems.push({
                prefix: item.prefix,
                items: [{ ...item, content: item.content.multiple }],
              });
            }
          } else {
            newItems.push({
              ...item,
              prefix: '',
              content: item.content.single,
            });
          }
        } else if (item.content?.single) {
          newItems.push({
            uuid: item.uuid,
            content: item.content.single,
          });
        } else {
          newItems.push({
            uuid: item.uuid,
            content: item.content,
          });
        }
        return newItems;
      };
      return slide.reduce(reduce, []);
    },
    currentImage() {
      return (
        this.images[this.slides[this.activeIndex].type] ?? this.images.default
      );
    },
    isShowDate() {
      return (items: AppApiResponse.UserPopup[], index: number) => {
        const item = items[index];
        if (item.date) {
          const findIndex = items.findIndex(
            (i: AppApiResponse.UserPopup) => i.date === item.date
          );
          return index === findIndex;
        }
        return false;
      };
    },
    isShowLine() {
      return (items: AppApiResponse.UserPopup[], index: number) => {
        return index && items[index - 1].line_type !== items[index].line_type;
      };
    },
    isMovingClass() {
      return this.isMouseDown ? 'moving' : '';
    },
  },
  watch: {
    popups() {
      const activeType = this.slides[this.activeIndex]?.type ?? '';
      this.slides = this.popups.reduce(
        (popupGroups: Slide[], popup: AppApiResponse.UserPopup) => {
          const popupIndex = popupGroups.findIndex(
            (popupGroup: Slide) => popupGroup.type === popup.popup_type
          );
          if (popupIndex > -1) {
            if (
              popupGroups[popupIndex].list.findIndex(
                (p: AppApiResponse.UserPopup) =>
                  JSON.stringify(p.content) === JSON.stringify(popup.content)
              ) === -1
            ) {
              popupGroups[popupIndex].list.push(popup);
            }
          } else {
            popupGroups.push({
              type: popup.popup_type,
              list: [popup],
            });
          }
          return popupGroups;
        },
        []
      );
      if (activeType) {
        this.activeIndex = this.slides.findIndex(
          (slide: Slide) => slide.type === activeType
        );
      } else {
        this.$emit(
          'changeActivePopupType',
          this.slides[this.activeIndex]?.type
        );
      }
      if (this.listViewedIndex.length - 1 === this.slides.length - 1) {
        this.displayCloseButton = true;
      } else {
        this.displayCloseButton = false;
      }
    },
    activeIndex(index: number) {
      this.$emit('changeActivePopupType', this.slides[index]?.type);
    },
  },
  methods: {
    async onClose() {
      try {
        await readUserPopup(
          this.popups.map((popup: AppApiResponse.UserPopup) => popup.uuid)
        );
        this.$emit('close');
        setTimeout(() => {
          this.activeIndex = 0;
          this.translating = false;
          this.displayCloseButton = false;
        }, 200);
      } catch (e) {
        console.error(e);
      }
    },
    next() {
      this.slideTo((this.activeIndex + 1) % this.slides.length);
    },
    prev() {
      this.slideTo(
        (this.activeIndex + this.slides.length - 1) % this.slides.length
      );
    },
    slideTo(index: number) {
      if (!this.listViewedIndex.includes(index)) {
        this.listViewedIndex.push(index);
      }
      if (this.listViewedIndex.length - 1 === this.slides.length - 1) {
        this.displayCloseButton = true;
      }
      if (index === this.activeIndex) {
        return;
      }
      this.translating = true;
      setTimeout(() => {
        this.activeIndex = index;
        this.translating = false;
      }, 200);
    },
    onMouseDown(e: any) {
      this.isMouseDown = true;
      this.mouseDownX = e.clientX;
    },
    onMouseUp(e: any) {
      this.isMouseDown = false;
      const mouseUpX = e.clientX;
      if (this.mouseDownX < mouseUpX && this.mouseDownX + 5 < mouseUpX) {
        if (!(!this.displayCloseButton && this.activeIndex === 0)) {
          this.prev();
        }
      }
      if (this.mouseDownX > mouseUpX && this.mouseDownX + 5 > mouseUpX) {
        this.next();
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  width: 460px;
  min-height: 300px;
  max-height: calc(100vh - 60px);
  padding: 40px 36px 60px;
  background-color: $true_white;
  position: relative;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.modal-contents {
  width: 100%;
  max-height: calc(100vh - 150px);
  padding: 0 4px;
  text-align: center;
  overflow: auto;
  user-select: none;

  &.moving {
    & > * {
      pointer-events: none;
    }
  }

  .popup-image {
    height: 140px;
    margin-bottom: 30px;
  }

  .item-list {
    font-size: 15px;

    .item-group {
      .prefix {
        margin-bottom: 10px;
      }

      .date {
        min-height: 22px;
        margin-bottom: 5px;
      }

      .line {
        width: 267px;
        margin: 10px auto;
        border-top: solid 1px #e4e5ed;
      }

      .item {
        min-height: 22px;
        white-space: pre-line;

        & + .date {
          margin-top: 15px;
        }
      }

      & + .item-group {
        margin-top: 20px;
      }
    }
  }

  &.list-enter-active,
  &.list-leave-active {
    transition: opacity 200ms;
  }

  &.list-enter,
  &.list-leave-to {
    opacity: 0;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.modal-enter {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 12px;
  cursor: pointer;
}

.icon-dot {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  margin: 0 5px 0 0;
  background-color: $image_select_button_color;
  cursor: pointer;
  transition: background 0.2s;

  &:last-of-type {
    margin: 0;
  }

  &.active {
    background: #2e303e;
  }
}

.navigation-container {
  position: absolute;
  left: 50%;
  bottom: 26px;
  display: flex;
  transform: translateX(-50%);
}

.icon-left,
.icon-right {
  position: absolute;
  top: 50%;
  width: 10px;
  cursor: pointer;
  transform: translateY(-50%);

  &.icon-left {
    left: 10px;
  }

  &.icon-right {
    right: 10px;
  }
}

.next-enter {
  opacity: 0;
}

.next-enter-to {
  transform: scale3d(1, 1, 1);
}

.next-enter-active,
.next-leave-active {
  transition: 0.2s cubic-bezier(0.57, 0.21, 0.69, 1.25);
}

.next-leave {
  transform: scale3d(1, 1, 1);
}

.next-leave-to {
  opacity: 0;
}

input {
  display: none;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
  background: #7e8195;
  border-radius: 2px;
}
</style>
