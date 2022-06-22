<template>
  <div v-if="show" class="data-item">
    <div class="data-item__header">
      <icon-bg src="/icon/icon-house.svg" />
      <span>住んだことのある街は？</span>
    </div>
    <div v-if="cities && cities.length > 0" class="data-item__contents">
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
            >{{ city.name }}</span
          >
        </div>
        <div class="top-city--right">
          <img class="top-city__dots" src="/app/icon/icon-triple-dot.svg" />
          <span class="top-city__count">{{ city.count }}</span>
        </div>
      </div>
      <div v-if="otherCities && otherCities.length > 0" class="other-cities">
        <div
          v-for="(city, index) in otherCities"
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
          <span class="other-city__name">{{ city.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import IconBg from '@/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/IconBg.vue';

export default Vue.extend({
  components: {
    IconBg,
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
      default: false,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.data-item {
  padding: 24px 1px;
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
  margin: 0 0 0 8px;
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
  white-space: nowrap;

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
</style>
