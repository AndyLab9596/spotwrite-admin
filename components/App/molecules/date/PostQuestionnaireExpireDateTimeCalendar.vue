<template>
  <div class="wrapper">
    <div class="date-picker">
      <div class="date">
        <DatePicker
          v-model="dateValue"
          type="date"
          :disabled-date="notBeforeToday"
          :editable="false"
          @input="onDateInput"
        />
      </div>
      <div class="time">
        <div class="all-day">
          <span>終日</span>
          <toggle-button
            v-model="isAllDay"
            class="button"
            @onChange="allDay"
          ></toggle-button>
        </div>
        <DatePicker
          v-model="timeValue"
          type="time"
          :disabled="isAllDay"
          format="hh:mm a"
          :disabled-time="notBeforeTodayTwelveOClock"
          :editable="false"
          @input="onTimeInput"
        />
      </div>
      <div class="complete">
        <BaseButton inverse size="large" class="post-button" @click="complete">
          完了
        </BaseButton>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import DatePicker from 'vue2-datepicker';
import dayjs from '@/libs/dayjs';
import 'vue2-datepicker/index.css';
import ToggleButton from '../../atoms/buttons/ToggleButton.vue';
import BaseButton from '../../atoms/buttons/BaseButton.vue';

export default Vue.extend({
  components: {
    DatePicker,
    ToggleButton,
    BaseButton,
  },
  props: {
    value: {
      type: [Date, String],
      default: () => new Date(),
    },
  },
  data: () => ({
    dateValue: new Date(),
    timeValue: new Date(),
    dateTime: new Date(),
    isAllDay: false as boolean,
  }),
  watch: {
    value(): void {
      this.dateValue = new Date(this.value);
      this.timeValue = new Date(this.value);
    },
  },
  created() {
    if (this.value != null) {
      this.dateValue = new Date(this.value);
      this.timeValue = new Date(this.value);
      if (
        dayjs(this.value)
          .format('H:m')
          .toString() === '23:59'
      ) {
        this.isAllDay = true;
        this.allDay(true);
        this.$emit('allDay', true);
      }
      this.onDateInput();
      this.onTimeInput();
      this.$emit('onExpireChange', this.dateTime);
    }
  },
  methods: {
    onDateInput() {
      this.dateTime = new Date(
        this.dateValue.getFullYear(),
        this.dateValue.getMonth(),
        this.dateValue.getDate(),
        this.timeValue.getHours(),
        this.timeValue.getMinutes()
      );
      this.$emit('onExpireChange', this.dateTime);
    },
    onTimeInput() {
      this.dateTime = new Date(
        this.dateValue.getFullYear(),
        this.dateValue.getMonth(),
        this.dateValue.getDate(),
        this.timeValue.getHours(),
        this.timeValue.getMinutes()
      );
      this.$emit('onExpireChange', this.dateTime);
    },
    notBeforeToday(date: Date) {
      return date < new Date(new Date().setHours(0, 0, 0, 0));
    },
    notBeforeTodayTwelveOClock(date: Date) {
      return date < new Date(new Date().setHours(0, 0, 0, 0));
    },
    allDay(isActive: boolean) {
      if (isActive) {
        this.timeValue = new Date(new Date().setHours(23, 59));
        this.onTimeInput();
        this.isAllDay = true;
      } else {
        this.isAllDay = false;
      }
    },
    complete() {
      if (this.dateTime < new Date()) {
        alert('回答の期限は現在時刻よりも後に設定してください。');
      } else {
        this.$emit('onClose');
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  z-index: 100;

  .date-picker {
    background: $true_white;
    padding: 20px;
    position: absolute;
    top: 0;
    width: 100%;
    box-shadow: 0 1px 2px $box-shadow;
    display: flex;
    flex-direction: column;

    .time {
      .all-day {
        display: flex;
        padding: 20px 0;
        align-items: center;
      }
    }

    .complete {
      padding-top: 20px;
      text-align: center;
    }

    /deep/ .mx-icon-clear {
      display: none;
    }

    /deep/ .mx-input-wrapper {
      &:hover {
        .mx-icon-calendar {
          display: block;
        }
      }
    }
  }
}
</style>
