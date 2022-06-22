<template>
  <div>
    <div class="company-images">
      <div class="image-slider">
        <transition-group name="fade" tag="div">
          <div v-for="i in [slideIndex]" :key="i" class="image-slider__slide">
            <div
              class="image-slider__image"
              :style="{ backgroundImage: 'url(' + currentImg + ')' }"
            ></div>
          </div>
        </transition-group>
      </div>
      <button class="prev" @click="prev">
        <span>
          <img class="left-arrow" src="/app/icon/left-arrow.svg" />
        </span>
      </button>
      <button class="next" @click="next">
        <span>
          <img class="right-arrow" src="/app/icon/left-arrow.svg" />
        </span>
      </button>
    </div>
    <div class="dots">
      <span
        v-for="(image, index) in images"
        :key="index"
        :class="{ 'dot--active': slideIndex === index + 1 }"
        class="dot"
        @click="selectSlide(index + 1)"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

interface Image {
  id: string;
  url: string;
}

export default Vue.extend({
  props: {
    images: {
      default: () => [],
      type: Array as PropType<Array<Image>>,
    },
  },
  data() {
    return {
      slideIndex: 1,
    };
  },
  computed: {
    currentImg(): string {
      if (this.images.length > 0) {
        return this.images[Math.abs(this.slideIndex) % this.images.length].url;
      }
      return '/image/no-image.png';
    },
  },
  mounted() {
    this.slideIndex = 1;
  },
  methods: {
    next() {
      if (this.slideIndex === this.images.length) {
        this.slideIndex = 1;
      } else {
        this.slideIndex += 1;
      }
    },
    prev() {
      if (this.slideIndex === 1) {
        this.slideIndex = this.images.length;
      } else {
        this.slideIndex -= 1;
      }
    },
    selectSlide(index: number) {
      this.slideIndex = index;
    },
  },
});
</script>

<style lang="scss" scoped>
.company-images {
  position: relative;
}

.image-slider {
  min-width: 720px;
  min-height: 220px;
}

.image-slider__slide {
  text-align: center;
}

.image-slider__image {
  max-width: 100%;
  height: 220px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.prev,
.next {
  position: absolute;
  top: calc(50% - 16px);
  display: inline-block;
  background-color: $link_color;
  border: none;
  box-shadow: none;
  margin: 0;
  padding: 0;
  width: 32px;
  height: 32px;
  border-radius: 12px;
  opacity: 0.8;
}

.prev {
  left: -16px;
}

.next {
  right: -16px;
}

.right-arrow {
  vertical-align: middle;
}

.left-arrow {
  transform: rotate(180deg);
  vertical-align: middle;
}

.dots {
  margin: 16px 0 0;
  text-align: center;
}

.dot {
  display: inline-block;
  cursor: pointer;
  width: 8px;
  height: 8px;
  margin: 0 6px;
  border-radius: 50%;
  background-color: $radio_gray;
  transition: background-color 0.6s ease;
}

.dot--active {
  background-color: $radio_active;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.9s ease;
  overflow: hidden;
  visibility: visible;
  position: absolute;
  width: 100%;
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  visibility: hidden;
  width: 100%;
  opacity: 0;
}
</style>
