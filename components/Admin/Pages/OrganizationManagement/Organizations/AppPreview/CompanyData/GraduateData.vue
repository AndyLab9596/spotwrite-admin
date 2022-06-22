<template>
  <div v-if="show" class="data-item">
    <div class="data-item__header">
      <icon-bg src="/icon/icon-graduate.svg" /><span>新卒？中途？</span>
    </div>
    <div
      v-if="Object.keys(graduateData).length > 0"
      class="data-item__contents grad"
    >
      <div class="repeating-background--grad">
        <div v-for="o in 5" :key="o.index" class="repeating-row--grad">
          <img
            v-for="p in gradCount"
            :key="p.index"
            src="/app/icon/icon-grad-cap.svg"
            class="repeating-image--grad"
          />
          <img
            v-for="q in midCareerCount"
            :key="q.index"
            src="/app/icon/icon-briefcase.svg"
            class="repeating-image--briefcase"
          />
        </div>
        <div class="data-circles">
          <div
            class="data-circle"
            :class="{
              'data-circle--pink':
                Math.round(graduateData.new_graduate.percent / 10) >=
                Math.round(graduateData.mid_career.percent / 10),
            }"
          >
            <!-- TODO  APIからorganizationData.new_graduate_or_mid_career_count.new_graduate.nameを漢字で返すように -->
            <div class="data-circle__label">新卒</div>
            <div class="data-circle__number">
              {{ Math.round(graduateData.new_graduate.percent / 10) }}
            </div>
          </div>
          <div
            class="data-circle"
            :class="{
              'data-circle--pink':
                Math.round(graduateData.mid_career.percent / 10) >=
                Math.round(graduateData.new_graduate.percent / 10),
            }"
          >
            <!-- TODO  APIからorganizationData.new_graduate_or_mid_career_count.mid_career.nameを漢字で返すように -->
            <div class="data-circle__label">中途</div>
            <div class="data-circle__number">
              {{ Math.round(graduateData.mid_career.percent / 10) }}
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
    graduateData: {
      default: null,
      type: Object,
    },
    gradCount: {
      type: Number,
      default: null,
    },
    midCareerCount: {
      type: Number,
      default: null,
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
