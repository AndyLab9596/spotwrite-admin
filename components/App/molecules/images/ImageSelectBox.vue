<template>
  <div>
    <div class="image-wrapper">
      <video
        v-if="srcType === 'video' || srcTypeCheck(src) === 'video'"
        controls
        :src="src"
        :style="{
          height: height + 'px',
          'background-color': backgroundColorPalette,
        }"
        class="detail-video-tag"
      />
      <img
        v-else
        :src="src"
        alt=""
        :style="{
          height: height + 'px',
          'background-color': backgroundColorPalette,
        }"
      />
      <pick-up-frame v-if="frameName === pickUp" :height="height + 1" />
      <thank-you-frame v-if="frameName === thankYou" :height="height + 1" />
      <interview-frame
        v-if="frameName === interview"
        :height="height + 1"
        :pattern="pattern"
      />
      <div
        class="lightbox-mask"
        :class="{
          'lightbox-video-mask':
            srcType === 'video' || srcTypeCheck(src) === 'video',
        }"
        @click="lightBoxIndex = currentMediaIndex"
      ></div>
    </div>
    <CoolLightBox
      :items="lightBoxItems"
      :index="lightBoxIndex"
      :slideshow="false"
      :gallery="false"
      @close="lightBoxIndex = null"
      @on-change="lightBoxChange"
      @on-open="openLightBox"
    >
    </CoolLightBox>
    <div v-if="images.length > 1" class="select-button-wrapper">
      <template v-for="(item, itemIndex) in images">
        <label
          :key="itemIndex"
          class="button"
          :style="selectImageSrc === item.src ? setSelectButtonColor : null"
          @change="changeImage(item.src, itemIndex)"
        >
          <input
            :id="itemIndex"
            type="radio"
            name="radio"
            :value="item"
            :checked="selectImageSrc === item.src"
          />
        </label>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { enumPostTypes } from '@/libs/definition';
import CoolLightBox from 'vue-cool-lightbox';
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css';
import Vibrant from 'node-vibrant';
import PickUpFrame from '../frame/PickUpFrame.vue';
import ThankYouFrame from '../frame/ThankYouFrame.vue';
import InterviewFrame from '../frame/InterviewFrame.vue';

type Color = {
  backgroundColor: string;
};

export default Vue.extend({
  components: {
    PickUpFrame,
    ThankYouFrame,
    InterviewFrame,
    CoolLightBox,
  },
  props: {
    src: {
      type: String,
      required: true,
    },
    srcType: {
      type: String,
      default: 'image',
      required: false,
    },
    images: {
      type: Array,
      required: true,
    },
    selectImageSrc: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      required: false,
      default: 540,
    },
    selectButtonColor: {
      type: String,
      required: false,
      default: '#f09c9c',
    },
    frameName: {
      type: String,
      required: false,
      default: '',
    },
    pattern: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      pickUp: enumPostTypes.PICKUP as string,
      thankYou: enumPostTypes.THANKYOU as string,
      interview: enumPostTypes.INTERVIEW as string,
      lightBoxIndex: null,
      currentMediaIndex: 0 as number,
      backgroundColorPalette: `rgba(255, 255, 255, 0.2)`,
    };
  },
  computed: {
    setSelectButtonColor(): Color {
      return {
        backgroundColor: this.selectButtonColor,
      };
    },
    lightBoxItems(): Array<Object> {
      return this.images.map((item: any) => {
        if (item.type === 'video') {
          return {
            src: `${item.src}?type=video.mov&v=${Math.random()}`,
            mediaType: 'webVideo',
            autoplay: true,
          };
        }
        return { src: item.src, mediaType: item.type };
      });
    },
  },
  async created() {
    const imageSrc =
      this.srcType === 'video' || this.srcTypeCheck(this.src) === 'video'
        ? `${this.src}-thumb`
        : this.src;
    this.backgroundColorPalette = await Vibrant.from(
      `${imageSrc}?x-request=xhr`
    )
      .getPalette()
      .then(
        // eslint-disable-next-line @typescript-eslint/typedef
        (palette: any) => {
          const vibrantRbgArr =
            !palette || !palette.Vibrant || !palette.Vibrant.rgb
              ? [255, 255, 255]
              : palette.Vibrant.rgb;
          return `rgba(${vibrantRbgArr.join()}, 0.2)`;
        },
        () => {
          return `rgba(255, 255, 255, 0.2)`;
        }
      );
  },
  methods: {
    changeImage(src: string, index: number) {
      this.$emit('onChange', src);
      this.currentMediaIndex = index;
    },
    srcTypeCheck(src: string) {
      const selectedMedia = this.images.find((f: any) => f.src === src);
      if (!selectedMedia) {
        return '';
      }
      return selectedMedia.type;
    },
    lightBoxChange(indexItem: number) {
      const item = this.images[indexItem];
      this.changeImage(item.src, indexItem);
    },
    openLightBox() {
      setTimeout(() => {
        const d: any = document;
        const videoTag = d.getElementsByClassName('detail-video-tag');
        if (videoTag && videoTag[0]) {
          videoTag[0].pause();
        }
      }, 250);
    },
  },
});
</script>

<style lang="scss" scoped>
.image-wrapper {
  position: relative;
}

img {
  width: 100%;
  object-fit: cover;
  object-position: center;
  margin: 0 0 24px 0;
}

video {
  width: 100%;
  object-position: center;
  margin: 0 0 24px 0;
  pointer-events: all;
  background-color: black;
}

.select-button-wrapper {
  display: flex;
  justify-content: center;
}

.button {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  margin: 0 12px 0 0;
  background-color: $image_select_button_color;
  border: none;
  padding: 0;
  cursor: pointer;

  &:last-of-type {
    margin: 0;
  }
}

.select-button {
  background-color: $link_color;
}

input {
  display: none;
}

.lightbox-mask {
  height: 100%;
  width: 100%;
  z-index: 9;
  position: absolute;
  top: 0;
  left: 0;
}

.lightbox-video-mask {
  height: 77% !important;
}
</style>
