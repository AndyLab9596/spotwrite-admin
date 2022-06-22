<template>
  <div class="data-item">
    <div class="data-item__header">
      <icon-bg src="/app/icon/icon-house.svg" />
      <span>住んだことのある街は？</span>
    </div>
    <div v-if="show && cities && cities.length > 0" class="data-item__contents">
      <div
        v-for="(city, index) in cities"
        :key="city.name + index"
        class="top-city"
      >
        <div class="top-city--left">
          <span class="city-icon">
            <img
              v-if="index === 0"
              class="city-icon__house"
              src="/app/icon/icon-house-pink.svg"
            />
            <img
              v-else
              class="city-icon__house"
              src="/app/icon/icon-house-gray.svg"
            />
            <span class="city-icon__number">{{ index + 1 }}</span>
          </span>
          <span
            class="top-city__name"
            :class="{ 'top-city__name--pink': index === 0 }"
          >
            <popper
              trigger="hover"
              :disabled="city.name.length <= 8"
              :options="{
                placement: 'bottom-start',
                modifiers: { offset: { offset: '0,3px' } },
              }"
            >
              <div class="popper-full">
                {{ city.name }}
              </div>
              <div slot="reference">
                {{ limitedString(city.name, 8) }}
              </div>
            </popper>
          </span>
        </div>
        <div class="top-city--right">
          <img class="top-city__dots" src="/app/icon/icon-triple-dot.svg" />
          <span class="top-city__count">{{ city.count }}</span>
        </div>
      </div>
      <div
        v-if="limitedOtherLivedCity && limitedOtherLivedCity.length > 0"
        class="other-cities"
      >
        <div
          v-for="(city, index) in limitedOtherLivedCity"
          :key="city.name"
          class="other-city"
        >
          <span class="other-city-icon">
            <img
              class="other-city-icon__house"
              src="/app/icon/icon-house-rainbow.svg"
            />
            <span class="other-city-icon__number">{{ index + 4 }}</span>
          </span>
          <span class="other-city__name">
            <popper
              trigger="hover"
              :disabled="city.name.length <= 8"
              :options="{
                placement: 'bottom-start',
                modifiers: { offset: { offset: '0,3px' } },
              }"
            >
              <div class="popper-full">
                {{ city.name }}
              </div>
              <div slot="reference">
                {{ limitedString(city.name, 8) }}
              </div>
            </popper>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';
import IconBg from '../../../atoms/icons/IconBg.vue';

export default Vue.extend({
  components: {
    IconBg,
    Popper,
  },
  props: {
    cities: {
      default: null,
      type: Array,
    },
    otherCities: {
      default: null,
      type: Array,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    limitedOtherLivedCity() {
      const returnCities: Array<object> = [];
      this.otherCities.forEach((item: any, index: number) => {
        if (item && index <= 5) {
          returnCities.push(item);
        }
      });
      return returnCities;
    },
  },
  methods: {
    limitedString(input: string, limit: number = 8): string {
      let output = input;
      if (output.length > limit) {
        output = output.slice(0, limit).concat('...');
      }
      return output;
    },
  },
});
</script>

<style lang="scss" scoped>
.data-item {
  position: relative;
  flex: 50%;
  max-width: 50%;
  margin: 24px 0;
}

.data-item__header {
  display: flex;
  align-items: center;

  span {
    margin: 0 0 0 16px;
    font-size: 15px;
    font-weight: 600;
    color: $main_color;
  }
}

.data-item__contents {
  width: 100%;
  margin: 16px 0 0;
}

.top-city,
.top-joined {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  background: $gradient_6;
  margin: 4px 0 0;
  padding: 8px;
  border-radius: 4px;
}

.top-city--left,
.top-city--right,
.top-joined--left,
.top-joined--right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.city-icon,
.joined-icon {
  position: relative;
  display: inline-block;
  margin: 0 8px 0 0;
}

.city-icon__number,
.joined-icon__number {
  font-size: 15px;
  color: $true_white;
  position: absolute;
  top: 57%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.top-city__name,
.top-joined__name {
  font-size: 15px;
  color: $chart_text;
  line-height: 20px;
}

.top-city__name--pink,
.top-joined__name--pink {
  font-weight: 600;
  color: $link_color;
}

.top-joined__name--jp {
  font-size: 11px;
  color: $chart_text;
  line-height: 20px;
  margin: 0 0 0 5px;
}

.top-joined__name--jp--pink {
  font-weight: 600;
  color: $link_color;
}

.top-city__dots,
.top-joined__dots {
  margin: 0 10px 0 0;
}

.top-city__count,
.top-joined__count {
  font-size: 24px;
  color: $chart_text;
  position: relative;

  &::after {
    content: '人';
    font-size: 11px;
  }
}

.other-cities,
.other-joined {
  max-height: 140px;
  margin: 16px 0 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
}

.other-city,
.other-join {
  display: flex;
  font-size: 13px;
  line-height: 34px;
  color: $main_color;
  flex: 1;
  min-width: 124px;
  margin: 0 24px 8px 0;

  &:nth-child(3) {
    margin-bottom: 0;
  }

  &:nth-child(6) {
    margin-bottom: 0;
  }
}

.other-city-icon,
.other-join-icon {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 8px 0 0;
}

.other-city-icon__number,
.other-join-icon__number {
  font-size: 13px;
  color: $main_color;
  position: absolute;
  top: 57%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.popper-full {
  background-color: $true_white;
  font-size: 13px;
  line-height: 1.8;
  color: $dark_blue;
  border: 1px solid $light_gray_blue_3;
  padding: 10px;
  pointer-events: none;
  max-width: 350px;
  z-index: 99;
}
</style>
