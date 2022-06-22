<template>
  <div class="data-item">
    <div class="data-item__header">
      <icon-bg src="/app/icon/icon-cake.svg" /><span>年齢はいくつですか？</span>
    </div>
    <div
      v-if="show && Object.keys(ageData).length > 0"
      class="data-item__contents"
    >
      <div class="age">
        <img src="/app/icon/icon-male.svg" class="age-icon" />
        <img src="/app/icon/icon-female.svg" class="age-icon" />
        <div class="average-age">
          <div class="average-age__name">
            {{ ageData.average.name }}
          </div>
          <div class="average-age__count">
            {{ Math.round(ageData.average.count) }}
          </div>
        </div>
      </div>
      <div v-for="age in agesNotAverage" :key="age.name" class="age-bracket">
        <span class="age-bracket__name">{{ age.name }}</span>
        <span class="age-bracket__icons">
          <span v-for="(i, index) in 5" :key="i.name" class="gender-icons">
            <img
              src="/app/icon/icon-male-gray.svg"
              class="gender-icon"
              :class="{
                'gender-icon--pink':
                  age.count === maxAgeCount &&
                  index < Math.round(((age.count / totalAgeCount) * 10) / 2),
                'gender-icon--opacity-reset':
                  age.count !== 0 &&
                  index < Math.round(((age.count / totalAgeCount) * 10) / 2),
              }"
            />
            <img
              src="/app/icon/icon-female-gray.svg"
              class="gender-icon"
              :class="{
                'gender-icon--pink':
                  age.count === maxAgeCount &&
                  index < Math.round(((age.count / totalAgeCount) * 10) / 2),
                'gender-icon--opacity-reset':
                  age.count !== 0 &&
                  index < Math.round(((age.count / totalAgeCount) * 10) / 2),
              }"
            />
          </span>
        </span>
        <span class="age-bracket__count">{{ age.count }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import IconBg from '../../../atoms/icons/IconBg.vue';

export default Vue.extend({
  components: {
    IconBg,
  },
  props: {
    ageData: {
      default: null,
      type: Object,
    },
    agesNotAverage: {
      type: Array,
      default: null,
    },
    maxAgeCount: {
      type: Number,
      default: null,
    },
    totalAgeCount: {
      type: Number,
      default: null,
    },
    show: {
      type: Boolean,
      required: true,
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

// AGE
.age {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 8px;
}

.age-icon {
  width: 24px;
  height: 47px;

  &:first-of-type {
    margin: 0 8px 0 0;
  }
}

.average-age {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 0 0 14px;
}

.average-age__name {
  font-size: 12px;
  color: $main_color;
}

.average-age__count {
  font-size: 40px;
  line-height: 48px;
  color: $main_color;

  &::after {
    content: '歳';
    height: 12px;
    position: absolute;
    top: 26px;
    right: -18px;
    font-size: 12px;
    color: $main_color;
  }
}

.age-bracket {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px 9px 16px;
  background: $gradient_6;
  border-radius: 4px;

  &:nth-of-type(n) {
    margin: 4px 0;
  }
}

.age-bracket__name {
  font-size: 14px;
  color: $chart-text;
  line-height: 18px;
}

.age-bracket__icons {
  display: flex;
}

.age-bracket__count {
  min-width: 40px;
  text-align: right;
  font-size: 24px;
  line-height: 29px;
  color: $chart_text;

  &::after {
    content: '人';
    font-size: 12px;
    line-height: 21px;
    color: $chart_text;
  }
}

.gender-icons {
  display: flex;
}

.gender-icon {
  margin: 0 3px;
  opacity: 0.4;
}

.gender-icon--opacity-reset {
  opacity: 1;
}

.gender-icon--pink {
  filter: invert(70%) sepia(36%) saturate(587%) hue-rotate(311deg)
    brightness(98%) contrast(92%);
}
</style>
