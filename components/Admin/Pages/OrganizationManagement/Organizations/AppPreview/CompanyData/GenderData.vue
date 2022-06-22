<template>
  <div v-if="show" class="data-item">
    <div class="data-item__header">
      <icon-bg src="/icon/icon-sex.svg" />
      <span>男女比の割合は？</span>
    </div>
    <div v-if="Object.keys(genderData).length > 0" class="data-item__contents">
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
import IconBg from '@/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/IconBg.vue';

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
      default: false,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.data-title {
  display: flex;
  height: 50px;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
  padding: 0 10px;
  background: #f7f8fd;
}

.data-item {
  position: relative;
  flex: 100%;
  padding: 24px 1px;

  & + .data-item {
    border-top: 1px dotted #7e819587;
  }
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
  width: fit-content;
  margin: 16px auto 0;
}

.repeating-background {
  position: relative;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  row-gap: 8px;

  &--grad {
    position: relative;
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
    grid-template-columns: 18px 18px 18px 18px 18px 18px 18px 18px 18px 18px;
    column-gap: 7px;
  }

  &--gender {
    display: grid;
    grid-template-columns: 11px 11px 11px 11px 11px 11px 11px 11px 11px 11px;
    column-gap: 15px;
  }

  &--grad {
    display: grid;
    grid-template-columns: 20px 20px 20px 20px 20px 20px 20px 20px 20px 20px;
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
