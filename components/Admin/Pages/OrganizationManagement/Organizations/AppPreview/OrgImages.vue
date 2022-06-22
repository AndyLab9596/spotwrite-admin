<template>
  <div class="images-container">
    <div class="org-images">
      <div
        class="org-images__main"
        :class="{ 'org-images__main--only': orgImagesNotMain.length < 3 }"
        :style="{
          backgroundImage: 'url(' + mainImageIfElse + ')',
        }"
      ></div>
      <div
        v-if="orgImagesNotMain.length >= 3"
        id="carousel"
        ref="carousel"
        class="org-images__sub"
      >
        <div
          v-for="(img, index) in orgImagesNotMain"
          :key="img.uuid + index"
          :style="{ backgroundImage: 'url(' + img.url + ')' }"
          class="sub-image"
        ></div>
      </div>
    </div>
    <div v-if="orgImagesNotMain.length >= 3">
      <button class="prev" @click="prev">
        <span>
          <img class="prev-arrow" src="/app/icon/left-arrow.svg" />
        </span>
      </button>
      <button class="next" @click="next">
        <span>
          <img class="next-arrow" src="/app/icon/left-arrow.svg" />
        </span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    mainImage: {
      default: null,
      type: String,
    },
    orgImagesNotMain: {
      default: null,
      type: Array,
    },
    visibleImages: {
      // ページの右側のイメージスライダー
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      imageSteps: 0,
    };
  },
  computed: {
    mainImageIfElse(): string {
      if (this.mainImage) {
        return this.mainImage;
      }
      return '/image/no-image.png';
    },
  },
  methods: {
    next() {
      if (this.imageSteps < this.orgImagesNotMain.length - this.visibleImages) {
        this.imageSteps += 1;
        this.changeSlides();
      }
    },
    prev() {
      if (this.imageSteps > 0) {
        this.imageSteps -= 1;
        this.changeSlides();
      }
    },
    changeSlides() {
      const carousel = document.getElementById('carousel')!;
      // 69px = slide height + margin
      carousel.style.transform = `translateY(-${69 * this.imageSteps}px)`;
    },
  },
});
</script>

<style lang="scss" scoped>
.images-container {
  position: relative;
  margin: 0 0 40px;
}

.org-images {
  position: relative;
  display: flex;
  height: 200px;
  overflow: hidden;
}

.org-images__main {
  min-width: 290px;
  max-width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 4px;
}

.org-images__main--only {
  flex: 1;
}

.org-images__sub {
  margin: 0 0 0 16px;
  width: 154px;
  height: 100%;
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  transform-style: preserve-3d;
  transition: transform 0.3s;
  transform: translateY(0);
}

.sub-image {
  width: 100%;
  min-height: 61px;
  height: 61px;
  margin: 0 0 8px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 4px;
}

.org-images__sub > .sub-image:last-child {
  margin: 0;
}

.prev,
.next {
  position: absolute;
  right: calc((154px / 2) - 16px);
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
  top: -16px;
}

.next {
  bottom: -16px;
}

.next-arrow {
  transform: rotate(90deg);
  vertical-align: middle;
}

.prev-arrow {
  transform: rotate(270deg);
  vertical-align: middle;
}
</style>
