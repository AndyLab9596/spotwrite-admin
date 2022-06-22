<template>
  <div class="wrapper">
    <div class="input" :class="{ disabled }" @click="openCalender">
      <svg
        class="icon"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
      >
        <g id="Group_3740" data-name="Group 3740">
          <g
            id="Group_3739"
            data-name="Group 3739"
            transform="translate(5.912 12.241)"
          >
            <line
              id="Line_1040"
              data-name="Line 1040"
              x2="8.216"
              fill="none"
              stroke="#7e8195"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1"
            />
            <line
              id="Line_1041"
              data-name="Line 1041"
              x2="8.216"
              transform="translate(0 3.081)"
              fill="none"
              stroke="#7e8195"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1"
            />
          </g>
          <path
            id="Path_1630"
            data-name="Path 1630"
            d="M73.866,103.6H70.014v-1.2a.707.707,0,0,0-1.414,0v1.2H61.632v-1.2a.707.707,0,0,0-1.414,0v1.2H56.366a1.229,1.229,0,0,0-1.25,1.207V120.51a1.229,1.229,0,0,0,1.25,1.208h17.5a1.229,1.229,0,0,0,1.25-1.208V104.8A1.229,1.229,0,0,0,73.866,103.6ZM68.6,106.143v.958a.707.707,0,0,0,1.414,0v-.958a1.153,1.153,0,0,1,.61.98,1.323,1.323,0,0,1-2.634,0A1.153,1.153,0,0,1,68.6,106.143Zm-8.381,0v.958a.707.707,0,0,0,1.414,0v-.959a1.157,1.157,0,0,1,.61.981,1.323,1.323,0,0,1-2.634,0A1.153,1.153,0,0,1,60.219,106.143ZM73.866,120.51h-17.5V110.136h17.5Z"
            transform="translate(-55.116 -101.717)"
            fill="#7e8195"
          />
        </g>
      </svg>
      <div v-if="shouldPlaceholder" class="date placeholder">
        日付を選択してください。
      </div>
      <div v-else class="date">{{ date }}</div>
    </div>
    <div v-if="isActive" class="date-picker">
      <div class="header">
        <a
          v-if="!isLessThanMin(subMonth(`${year}/${month}`), 'month')"
          role="button"
          class="handle"
          @click.prevent="prevMonth"
        >
          &lt;
        </a>
        <div class="year-month">
          {{ year }}<span class="dot">.</span>{{ month }}
        </div>
        <a
          v-if="!isGreaterThanMax(addMonth(`${year}/${month}`), 'month')"
          role="button"
          class="handle"
          @click.prevent="nextMonth"
        >
          &gt;
        </a>
      </div>
      <div class="calender">
        <div class="day-of-week">
          <div class="box">月</div>
          <div class="box">火</div>
          <div class="box">水</div>
          <div class="box">木</div>
          <div class="box">金</div>
          <div class="box">土</div>
          <div class="box">日</div>
        </div>
        <div
          v-for="(week, i) in chunkedDayInWeek"
          :key="i + 'week'"
          class="week"
        >
          <div
            v-for="(day, j) in week"
            :key="j + 'day'"
            class="box day"
            :class="{
              selected: isSelected(day),
              disabled:
                isLessThanMin(day, 'day') || isGreaterThanMax(day, 'day'),
            }"
            @click="selectDate(day)"
          >
            {{ figuresFor35Days(day) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';
import _ from 'lodash';

export default Vue.extend({
  props: {
    value: {
      type: String,
      required: true,
      validator(value: string) {
        if (value === '') {
          return true;
        }
        const regex = RegExp(
          `^[0-9]{4}[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])$`
        );
        return regex.test(value);
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    displayFormat: {
      type: String,
      default: 'YYYY/MM/DD',
    },
    minDate: {
      type: String,
      default: null,
      validator(value: string) {
        const regex = RegExp(
          `^[0-9]{4}[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])$`
        );
        return regex.test(value);
      },
    },
    maxDate: {
      type: String,
      default: null,
      validator(value: string) {
        const regex = RegExp(
          `^[0-9]{4}[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])$`
        );
        return regex.test(value);
      },
    },
  },
  data() {
    return {
      isActive: false,
      lock: false,
      selectedYear: null as null | string,
      selectedMonth: null as null | string,
      selectedDate: null as null | string,
    };
  },
  computed: {
    shouldPlaceholder(): boolean {
      return this.value === '' && this.selectedDate == null;
    },
    date(): string {
      if (this.selectedDate) {
        dayjs(this.selectedDate).format(this.displayFormat);
      }
      if (this.value === '') {
        return dayjs().format('YYYY/MM/DD');
      }
      return dayjs(this.value as string).format(this.displayFormat);
    },
    year(): string {
      if (this.selectedYear) {
        return this.selectedYear;
      }
      if (this.value === '') {
        return dayjs().format('YYYY');
      }
      return dayjs(this.value as string).format('YYYY');
    },
    month(): string {
      if (this.selectedMonth) {
        return this.selectedMonth;
      }
      if (this.value === '') {
        return dayjs().format('MM');
      }
      return dayjs(this.value as string).format('MM');
    },
    yearMonth(): string {
      return `${this.year}/${this.month}`;
    },
    thirtyFiveDays(): string[] {
      const date = dayjs()
        .year(Number(this.year))
        .month(Number(this.month) - 1)
        .date(1);
      return [...Array(35).keys()].map((i: number) => {
        return date.add(i, 'day').format('YYYY/M/D');
      });
    },
    chunkedDayInWeek(): string[][] {
      return _.chunk(this.thirtyFiveDays, 7);
    },
    figuresFor35Days(): (date: string) => string {
      return (date: string) => {
        return dayjs(date).format('D');
      };
    },
    isSelected(): (date: string) => boolean {
      return (date: string) => {
        return dayjs(date).isSame(dayjs(this.value as string));
      };
    },
  },
  methods: {
    selectDate(date: string) {
      if (
        this.isGreaterThanMax(date, 'day') ||
        this.isLessThanMin(date, 'day')
      ) {
        this.lock = true;
        this.unlockWithDelay();
        return;
      }
      this.selectedDate = date;
      this.$emit('input', this.selectedDate);
    },
    prevMonth() {
      this.lock = true;
      const date = dayjs(this.yearMonth).subtract(1, 'month');
      this.selectedMonth = date.format('MM');
      this.selectedYear = date.format('YYYY');
      this.unlockWithDelay();
    },
    nextMonth() {
      this.lock = true;
      const date = dayjs(this.yearMonth).add(1, 'month');
      this.selectedMonth = date.format('MM');
      this.selectedYear = date.format('YYYY');
      this.unlockWithDelay();
    },
    openCalender() {
      if (this.disabled) {
        return;
      }
      this.isActive = true;
      this.lock = true;
      setTimeout(() => {
        this.lock = false;
        if (document == null) {
          return;
        }
        const d: any = document;
        d.getElementById('__nuxt').addEventListener(
          'click',
          this.closeCalender,
          false
        );
      }, 250);
    },
    closeCalender() {
      if (this.lock || document == null) {
        return;
      }
      this.isActive = false;
      const d: any = document;
      d.getElementById('__nuxt').removeEventListener(
        'click',
        this.closeCalender,
        false
      );
    },
    isLessThanMin(date: string, unit: 'day' | 'month') {
      return dayjs(date).isBefore(dayjs(this.minDate), unit);
    },
    isGreaterThanMax(date: string, unit: 'day' | 'month') {
      return dayjs(date).isAfter(dayjs(this.maxDate), unit);
    },
    addMonth(date: string) {
      return dayjs(date)
        .add(1, 'month')
        .format('YYYY/MM');
    },
    subMonth(date: string) {
      return dayjs(date)
        .subtract(1, 'month')
        .format('YYYY/MM');
    },
    unlockWithDelay() {
      setTimeout(() => {
        this.lock = false;
      }, 251);
    },
  },
});
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap');

.date-picker {
  position: absolute;
  top: 15px;
  left: 120px;
  padding: 10px;
  width: 313px;
  height: 217px;
  background-color: $true_white;
  box-shadow: 0 0 3px 0 $light_gray;
  z-index: 100;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 18px;

    .year-month {
      flex-grow: 1;
      text-align: center;
      font-size: 16px;

      .dot {
        color: #707f89;
      }
    }

    .handle {
      color: $gray_blue_3;
      height: 28px;
      width: 40px;
      text-align: center;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .box {
    height: 28px;
    width: 40px;
    text-align: center;
    padding-top: 7px;
  }

  .week,
  .day-of-week {
    display: flex;
    justify-content: space-between;
    color: $dark_blue;
    font-size: 13px;
  }

  .day-of-week > .box {
    padding: 0;
    height: 18px;
  }

  .week + .week {
    margin-top: 2px;
  }

  .day {
    background-color: $white_1;
    color: $gray_blue_4;
    font-size: 12px;
    font-family: 'Lato', 'Hiragino Kaku Gothic Pro', sans-serif;

    &:hover {
      cursor: pointer;
    }

    &.disabled {
      background-color: $true_white;
      cursor: default;
    }

    &.selected,
    &:hover:not(.disabled) {
      background-color: #dfe2ed;
      color: $true_white;
    }
  }

  .calender {
    display: flex;
    flex-direction: column;
    margin-top: 12px;
  }
}

.wrapper {
  display: inline-block;
  position: relative;

  .input {
    cursor: pointer;

    &.disabled {
      cursor: not-allowed;
    }
  }

  .icon {
    position: absolute;
    top: 9px;
    left: 9px;
    cursor: pointer;
  }

  .date {
    color: $gray_blue_4;
    height: 40px;
    font-size: 11px;
    font-weight: 300;
    padding: 10px 18px 14px 39px;
    background-color: $extra_light_gray;
    border: solid 1px $light_gray_blue_3;
    border-radius: 4px;
  }

  .placeholder {
    color: $placeholder_gray;
  }
}
</style>
