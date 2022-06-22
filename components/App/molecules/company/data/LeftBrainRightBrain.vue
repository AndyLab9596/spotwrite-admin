<template>
  <div class="data-item">
    <div class="data-item__header">
      <icon-bg src="/app/icon/icon-pencil.svg" />
      <span>あなたは文系？理系？</span>
    </div>
    <div
      v-if="show && Object.keys(humanitiesOrScience).length > 0"
      class="data-item__contents"
    >
      <div class="repeating-background">
        <div v-for="i in 5" :key="i.index" class="repeating-row--study">
          <img
            v-for="j in bookCount"
            :key="j.index"
            src="/app/icon/icon-book.svg"
            class="repeating-image--study"
          />
          <img
            v-for="k in beakerCount"
            :key="k.index"
            src="/app/icon/icon-beaker.svg"
            class="repeating-image--study"
          />
        </div>
        <div class="data-circles">
          <div
            class="data-circle"
            :class="{
              'data-circle--pink':
                Math.round(humanitiesOrScience.humanities.percent / 10) >=
                Math.round(humanitiesOrScience.science.percent / 10),
            }"
          >
            <!-- TODO  APIでorganizationData.humanities_or_science_count.humanities.nameを漢字で返すように -->
            <div class="data-circle__label">文系</div>
            <div class="data-circle__number">
              {{ Math.round(humanitiesOrScience.humanities.percent / 10) }}
            </div>
          </div>
          <div
            class="data-circle"
            :class="{
              'data-circle--pink':
                Math.round(humanitiesOrScience.science.percent / 10) >=
                Math.round(humanitiesOrScience.humanities.percent / 10),
            }"
          >
            <!-- TODO  APIでorganizationData.humanities_or_science_count.science.nameを漢字で返すように -->
            <div class="data-circle__label">理系</div>
            <div class="data-circle__number">
              {{ Math.round(humanitiesOrScience.science.percent / 10) }}
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
    humanitiesOrScience: {
      default: null,
      type: Object,
    },
    bookCount: {
      type: Number,
      default: null,
    },
    beakerCount: {
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
