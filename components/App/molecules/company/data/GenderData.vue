<template>
  <div class="data-item">
    <div class="data-item__header">
      <icon-bg src="/app/icon/icon-sex.svg" />
      <span>男女比の割合は？</span>
    </div>
    <div
      v-if="show && Object.keys(genderData).length > 0"
      class="data-item__contents"
    >
      <div class="repeating-background">
        <div v-for="l in 5" :key="l.index" class="repeating-row--gender">
          <img
            v-for="m in maleCount"
            :key="m.index"
            src="/app/icon/icon-male.svg"
            class="repeating-image--gender"
          />
          <img
            v-for="n in femaleCount"
            :key="n.index"
            src="/app/icon/icon-female.svg"
            class="repeating-image--gender"
          />
        </div>
        <div class="data-circles">
          <div
            class="data-circle"
            :class="{
              'data-circle--pink':
                Math.round(genderData.man.percent / 10) >=
                Math.round(genderData.woman.percent / 10),
            }"
          >
            <!-- TODO  APIからorganizationData.gender_count.man.nameを漢字で返すように -->
            <div class="data-circle__label">男性</div>
            <div class="data-circle__number">
              {{ Math.round(genderData.man.percent / 10) }}
            </div>
          </div>
          <div
            class="data-circle"
            :class="{
              'data-circle--pink':
                Math.round(genderData.woman.percent / 10) >=
                Math.round(genderData.man.percent / 10),
            }"
          >
            <!-- TODO  APIからorganizationData.gender_count.woman.nameを漢字で返すように -->
            <div class="data-circle__label">女性</div>
            <div class="data-circle__number">
              {{ Math.round(genderData.woman.percent / 10) }}
            </div>
          </div>
        </div>
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
    genderData: {
      default: null,
      type: Object,
    },
    maleCount: {
      type: Number,
      default: null,
    },
    femaleCount: {
      type: Number,
      default: null,
    },
    bookEqualsBeaker: {
      type: Boolean,
      default: false,
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

.repeating-background {
  position: relative;
  padding: 0 0 0 35px;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  row-gap: 8px;

  &--grad {
    position: relative;
    padding: 0 0 0 35px;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    row-gap: 17px;
  }
}

.repeating-image {
  &--study {
    width: 18px;
    height: 22px;
  }

  &--gender {
    width: 11px;
    height: 22px;
  }

  &--grad {
    width: 20px;
    height: 15px;
  }

  &--briefcase {
    width: 20px;
    height: 17px;
  }
}

.repeating-row {
  &--study {
    display: grid;
    grid-template-columns: repeat(auto-fit, 18px);
    column-gap: 7px;
  }

  &--gender {
    display: grid;
    grid-template-columns: repeat(auto-fit, 11px);
    column-gap: 15px;
  }

  &--grad {
    display: grid;
    grid-template-columns: repeat(auto-fit, 20px);
    column-gap: 5px;
  }
}

.data-circles {
  position: absolute;
  width: 80%;
  display: flex;
  justify-content: space-around;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.data-circle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: $icon_gray;
  color: $true_white;
}

.data-circle--pink {
  background-color: $link_color;
}

.data-circle__label {
  font-size: 15px;
  line-height: 21px;
}

.data-circle__number {
  font-size: 32px;
  line-height: 39px;
}
</style>
