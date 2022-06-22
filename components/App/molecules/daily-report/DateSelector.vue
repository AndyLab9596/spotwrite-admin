<template>
  <div class="date-selector">
    <div
      v-if="!canSpecifyPeriod"
      class="circle-button left"
      role="button"
      @click="prevDay"
    >
      <img src="/app/icon/Icon-arrow_right-dark.svg" alt="prev" />
    </div>

    <div class="date-selector">
      <div class="year number">{{ year }}</div>
      <div class="date number">{{ dateText }}</div>
      <div class="day-of-week">({{ dayOfWeek }})</div>
      <div class="calender-icon">
        <img
          src="/app/icon/Icon-calendar.svg"
          alt="calender"
          role="button"
          class="calender-button"
          @click="isShowCalender = true"
        />

        <div v-if="isShowCalender" class="date-picker">
          <div class="calender-modal">
            <date-picker
              v-model="selectedDate"
              type="date"
              range
              :open="isShowCalender"
              :editable="false"
              :popup-style="{
                position: 'relative',
                top: '-10px',
                left: '0px',
                width: '100%',
                border: 'none',
                'box-shadow': 'none',
              }"
              :append-to-body="false"
              :show-second="false"
            ></date-picker>
            <BaseButton
              inverse
              size="large"
              class="close-button"
              @click="selectDate"
            >
              完了
            </BaseButton>
          </div>
        </div>
      </div>

      <template v-if="canSpecifyPeriod">
        <div class="to">~</div>
        <div class="year number">{{ endYear }}</div>
        <div class="date number">{{ endDateText }}</div>
        <div class="day-of-week">({{ endDayOfWeek }})</div>
        <div class="calender-icon">
          <img
            src="/app/icon/Icon-calendar.svg"
            alt="calender"
            role="button"
            class="calender-button"
            @click="isShowCalender = true"
          />
        </div>
      </template>
    </div>

    <div
      v-if="!canSpecifyPeriod"
      class="circle-button right"
      role="button"
      @click="nextDay"
    >
      <img src="/app/icon/Icon-arrow_right-dark.svg" alt="next" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';
import { Dayjs } from 'dayjs';
import DatePicker from 'vue2-datepicker';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';

export default Vue.extend({
  components: { DatePicker, BaseButton },
  props: {
    date: {
      type: Number,
      required: true,
    },
    endDate: {
      type: Number,
      required: true,
    },
  },
  data() {
    return { selectedDate: [], isShowCalender: false };
  },
  computed: {
    canSpecifyPeriod(): boolean {
      return !dayjs(dayjs.unix(this.date)).isSame(
        dayjs.unix(this.endDate),
        'day'
      );
    },
    dateObj(): Dayjs {
      return dayjs.unix(this.date);
    },
    endDateObj(): Dayjs {
      return dayjs.unix(this.endDate);
    },
    year(): string {
      return String(this.dateObj.year());
    },
    dateText(): string {
      return this.dateObj.format('M/D');
    },
    dayOfWeek(): string {
      return this.dateObj.format('dd');
    },
    endYear(): string {
      return String(this.endDateObj.year());
    },
    endDateText(): string {
      return this.endDateObj.format('M/D');
    },
    endDayOfWeek(): string {
      return this.endDateObj.format('dd');
    },
  },
  created() {
    this.selectedDate = [new Date(this.dateObj), new Date(this.endDateObj)];
  },
  methods: {
    selectDate() {
      this.isShowCalender = false;

      if (!this.canSpecifyPeriod) {
        this.$emit('change', {
          start: dayjs(this.selectedDate[0]).unix(),
          end: dayjs(this.selectedDate[1])
            .endOf('day')
            .unix(),
        });
      } else {
        this.$emit('change', {
          start: dayjs(this.selectedDate[0]).unix(),
          end: dayjs(this.selectedDate[1]).unix(),
        });
      }
    },
    prevDay() {
      this.selectedDate[0].setDate(this.selectedDate[0].getDate() - 1);
      this.selectedDate[1].setDate(this.selectedDate[1].getDate() - 1);

      if (!this.canSpecifyPeriod) {
        this.$emit('change', {
          start: dayjs(this.selectedDate[0]).unix(),
          end: dayjs(this.selectedDate[1])
            .endOf('day')
            .unix(),
        });
      } else {
        this.$emit('change', {
          start: dayjs(this.selectedDate[0]).unix(),
          end: dayjs(this.selectedDate[1]).unix(),
        });
      }
    },
    nextDay() {
      this.selectedDate[0].setDate(this.selectedDate[0].getDate() + 1);
      this.selectedDate[1].setDate(this.selectedDate[1].getDate() + 1);

      if (!this.canSpecifyPeriod) {
        this.$emit('change', {
          start: dayjs(this.selectedDate[0])
            .add(1, 'day')
            .unix(),
          end: dayjs(this.selectedDate[1])
            .endOf('day')
            .add(1, 'day')
            .unix(),
        });
      } else {
        this.$emit('change', {
          start: dayjs(this.selectedDate[0])
            .add(1, 'day')
            .unix(),
          end: dayjs(this.selectedDate[1])
            .add(1, 'day')
            .unix(),
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.date-selector {
  display: flex;
  align-items: flex-end;
  position: relative;
}

.number {
  font-family: 'Lato', sans-serif;
}

.year {
  font-size: 18px;
}

.date {
  font-size: 28px;
  margin-left: 16px;
}

.day-of-week {
  font-size: 18px;
  font-family: 'Hiragino Kaku Gothic Pro', sans-serif;
  margin-left: 8px;
}

.date-picker {
  position: absolute;
  left: 0;
}

.calender-modal {
  background: $true_white;
  width: 521px;
  height: 320px;
  position: relative;
  border: solid 1px $ruled_line;
  padding: 10px;
  margin: 5px 0;
  z-index: 1;

  .close-button {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: $link_color;
  }

  & ::v-deep .mx-datepicker .mx-input-wrapper {
    display: none;
  }

  & ::v-deep .mx-datepicker-range {
    width: 100%;
  }
}

.calender-button {
  cursor: pointer;
  margin-left: 10px;
}

.calender-icon {
  padding-bottom: 3px;
}

.circle-button {
  width: 24px;
  height: 24px;
  background-color: $button_background_color;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &.left {
    transform: rotateY(180deg);
    margin-right: 32px;
  }

  &.right {
    margin-left: 32px;
  }

  img {
    width: 6px;
  }
}

.to {
  margin: 0 20px;
  font-size: 24px;
}
</style>
