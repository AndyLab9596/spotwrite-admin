<template>
  <transition name="modal" appear>
    <div class="modal-overlay">
      <div class="modal-window">
        <div class="icon-cross-wrapper" @click="onClose">
          <img src="/app/icon/cross_circle.svg" class="icon-cross" />
        </div>
        <div class="modal-contents">
          <transition name="next" mode="out-in">
            <component :is="slides[currentChapter]"></component>
          </transition>
          <div class="select-button-wrapper">
            <template v-for="(item, index) in slides">
              <label
                :key="index"
                class="radio-button-label"
                :style="
                  slides[currentChapter] === item
                    ? 'backgroundColor: #2e303e;'
                    : null
                "
                @change="nextSelect(index)"
              >
                <input
                  :id="index"
                  type="radio"
                  name="radio"
                  :value="item"
                  :checked="currentChapter === index"
                />
              </label>
            </template>
          </div>
          <div class="bottom-menu">
            <BaseButton size="large" class="post-button" @click="next">
              次へ
            </BaseButton>
          </div>
          <div
            v-if="currentChapter === 0 && tutorialModalShowTimes > 1"
            class="stop-tutorial-btn"
          >
            <label @click="notShowTutorial">
              今後表示しない
            </label>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import TutorialPage01 from '@/components/App/organisms/modal/tutorial/TutorialPage01.vue';
import TutorialPage02 from '@/components/App/organisms/modal/tutorial/TutorialPage02.vue';
import TutorialPage03 from '@/components/App/organisms/modal/tutorial/TutorialPage03.vue';
import TutorialPage04 from '@/components/App/organisms/modal/tutorial/TutorialPage04.vue';
import TutorialPage05 from '@/components/App/organisms/modal/tutorial/TutorialPage05.vue';
import TutorialPage06 from '@/components/App/organisms/modal/tutorial/TutorialPage06.vue';

export default Vue.extend({
  components: {
    BaseButton,
    TutorialPage01,
    TutorialPage02,
    TutorialPage03,
    TutorialPage04,
    TutorialPage05,
    TutorialPage06,
  },
  data: () => ({
    currentChapter: 0 as number,
    slides: [
      'TutorialPage01',
      'TutorialPage02',
      'TutorialPage03',
      'TutorialPage04',
      'TutorialPage05',
      'TutorialPage06',
    ],
  }),
  computed: {
    tutorialModalShowTimes() {
      return this.$accessor.tutorialShowTimes;
    },
    limit() {
      return this.slides.length;
    },
  },
  methods: {
    onClose() {
      this.$emit('close');
      setTimeout(() => {
        this.currentChapter = 0;
      }, 200);
    },
    next() {
      this.currentChapter += 1;
      if (this.currentChapter >= this.limit) {
        this.currentChapter = 0;
      }
    },
    nextSelect(index: number) {
      if (index < this.limit) {
        this.currentChapter = index;
      }
    },
    notShowTutorial() {
      this.$accessor.setShowTutorialFlag(false);
      this.$accessor.setTutorialShowTimes(0);
      this.$emit('close');
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
  height: auto;
  min-height: 360px;
  padding-bottom: 10px;
  background-color: $true_white;
  position: relative;
  border-radius: 5px;
}

.modal-contents {
  height: 100%;
  padding-top: 10px;
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

.icon-cross-wrapper {
  position: absolute;
  top: 0;
  right: calc(0px + 0px);
  color: black;
}

.icon-cross {
  cursor: pointer;
  width: 24px;
}

.radio-button-label {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  margin: 0 4px 0 0;
  background-color: $image_select_button_color;
  border: none;
  padding: 0;
  cursor: pointer;

  &:last-of-type {
    margin: 0;
  }
}

.bottom-menu {
  width: 100%;
  height: 80px;
  text-align: center;
  padding-top: 18px;
  z-index: 10000;

  .post-button {
    width: 252.5px;
  }

  & /deep/ .button {
    background-color: $link_color_alt;
    width: 412px;
  }
}

.select-button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 10px;
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

.stop-tutorial-btn {
  margin: 0 0 15px 0;
  color: $placeholder_gray_2;
  text-align: center;

  label {
    cursor: pointer;
  }
}
</style>
