<template>
  <div class="setting-wrapper">
    <p v-if="publicTitle" class="public-title">期限</p>
    <div class="setting-row">
      <div class="setting-item">
        <radio-button
          id="setting-on"
          name="radio-button"
          value="on"
          label="設定あり"
          :checked="selectedSettings === 'on'"
          class="radio-button"
          @change="changeSetting"
        />
      </div>
      <div class="setting-item">
        <radio-button
          id="setting-off"
          name="radio-button"
          value="off"
          label="設定なし"
          :checked="selectedSettings === 'off'"
          class="radio-button"
          @change="changeSetting"
        />
      </div>
    </div>
    <div v-if="selectedSettings === 'on'" class="date-wrapper">
      <div class="date-row" @click="onCalendarActiveInactiveButtonClick">
        <div class="date-calendar-container">
          <div class="date-row">
            <div class="date">
              <p>
                {{ start | dateFilter }}
                <img class="icon" src="/icon/Icon-calendar.svg" />
              </p>
            </div>
            <div class="time">
              {{ start | timeFilter }}
            </div>
          </div>
        </div>
        <div class="space">
          〜
        </div>
        <div class="date-calendar-end date-calendar-container">
          <div class="date-row">
            <div class="date">
              <p>
                {{ end | dateFilter }}
                <img class="icon" src="/icon/Icon-calendar.svg" />
              </p>
            </div>
            <div class="time">
              {{ end | timeFilter }}
            </div>
          </div>
        </div>
      </div>
      <div class="toggle-wrapper">
        <p class="all-day-text">終日</p>
        <toggle-button
          v-model="isAllDay"
          class="switch-button"
          @onChange="allDay"
        />
      </div>
    </div>
    <div
      v-if="isShowSelectCalender && selectedSettings === 'on'"
      class="calender-range-modal"
    >
      <date-picker
        v-model="startEndRange"
        type="datetime"
        range
        :open="isShowSelectCalender"
        :editable="false"
        :disabled-time="disabledTime"
        :popup-style="{
          position: 'relative',
          top: '-35px',
          left: '0px',
          width: '500px',
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
        @click="onCalendarActiveInactiveButtonClick"
      >
        完了
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import ToggleButton from '@/components/App/atoms/buttons/ToggleButton.vue';
import RadioButton from '@/components/App/atoms/buttons/RaadioButton.vue';
import dayjs from '@/libs/dayjs';
import DatePicker from 'vue2-datepicker';
import 'vue2-timepicker/dist/VueTimepicker.css';

export default Vue.extend({
  filters: {
    timeFilter(unixTime: number) {
      if (unixTime) {
        return dayjs.unix(unixTime).format('HH:mm');
      }
      return null;
    },
    dateFilter(unixTime: number) {
      if (unixTime) {
        return dayjs.unix(unixTime).format('YYYY/MM/DD');
      }
      return null;
    },
  },
  components: {
    BaseButton,
    ToggleButton,
    RadioButton,
    DatePicker,
  },
  props: {
    publicTitle: {
      type: Boolean,
      required: false,
      default: false,
    },
    startAt: {
      type: Number as PropType<number | null>,
      required: false,
      default: null,
    },
    endAt: {
      type: Number as PropType<number | null>,
      required: false,
      default: null,
    },
    selectedSettings: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    start: null as number | null,
    end: null as number | null,
    startEndRange: [new Date(), new Date()] as Date[],
    expire_at: new Date(),
    isExpireShowSelectCalender: false as boolean,
    isShowSelectCalender: false as boolean,
    isAllDay: false as boolean,
  }),
  watch: {
    selectedSettings(value: string) {
      if (value === 'off') {
        this.start = null;
        this.end = null;
        this.isAllDay = false;

        this.$emit('changeStartDate', this.start);
        this.$emit('changeEndDate', this.end);
      }
    },
    startEndRange(): void {
      this.start = dayjs(this.startEndRange[0]).unix();
      this.end = dayjs(this.startEndRange[1]).unix();

      this.$emit('changeStartDate', this.start);
      this.$emit('changeEndDate', this.end);
    },
  },
  created() {
    this.start = this.startAt;
    this.end = this.endAt;

    if (this.start != null && this.end != null) {
      this.$emit('changeSetting', 'on');
    }
  },
  methods: {
    disabledTime(): boolean {
      return this.isAllDay;
    },
    changeSetting(value: string) {
      this.$emit('changeSetting', value);
    },
    notBeforeToday(date: Date) {
      return date < new Date(new Date().setHours(0, 0, 0, 0));
    },
    onCalendarActiveInactiveButtonClick() {
      if (this.isAllDay) {
        return;
      }
      this.isShowSelectCalender = !this.isShowSelectCalender;
    },
    allDay(isActive: boolean) {
      this.isAllDay = isActive;

      if (isActive) {
        this.isShowSelectCalender = false;
        const now = new Date();
        this.startEndRange = [
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0),
          new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23,
            59,
            59
          ),
        ];
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.public-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;
  color: $dark_blue;
  margin: 0 0 16px;
}

.setting-row {
  display: flex;
  align-items: center;
}

.setting-item {
  display: flex;
  align-items: center;
  margin: 0 20px 0 0;
}

.radio-button {
  margin: 0 10px 0 0;
}

.radio-button /deep/ .radio-label {
  font-size: 15px;
  font-weight: 300;
  color: $dark_blue;
}

.date-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 698px;
}

.date-input {
  margin: 0 8px 0 0;
}

.date-row {
  display: flex;
  align-items: center;
}

.vue__time-picker {
  width: 80px;

  ::placeholder {
    font-size: 18px;
  }
}

.vue__time-picker /deep/ .display-time {
  font-family: 'Lato', sans-serif;
  font-size: 24px;
  font-weight: 400;
  color: $dark_blue;
  width: 62px;
  border: none;
  padding: 0;
  height: 1em;
}

.date-period {
  font-size: 24px;
  font-weight: 300;
  color: $dark_blue;
  margin: 0 18px 0;
}

.toggle-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.all-day-text {
  font-size: 15px;
  font-weight: 400;
  color: $gray_blue_1;
  margin: 0 0 5px;
}

.input {
  width: 100%;
  appearance: none;
  border: none;
  padding: 20px 0;
  color: $main_color;
}

.date-calendar-container {
  .date {
    background: $light_gray_blue_3;
    color: $main_color;
    font-size: 13px;
    position: relative;
    margin-right: 7px;
    font-family: 'Lato', sans-serif;
    height: 30px;
    font-weight: 400;
    padding: 7px 35px 7px 12px;
    background-color: #e4e5ed;
    border-radius: 16px;
    width: 118px;

    p {
      position: absolute;
      top: 50%;
      transform: translate(0%, -50%);
      display: flex;
      align-items: center;
    }

    .icon {
      margin: 0 0 0 8px;
    }
  }

  .time {
    font-family: 'Lato', sans-serif;
    font-size: 24px;
    font-weight: 400;
    color: $main_color;
  }
}

.space {
  font-family: 'Lato', sans-serif;
  font-size: 24px;
  font-weight: 400;
  color: $main_color;
  margin: 0 20px;
}

.calender-range-modal {
  background: white;
  width: 521px;
  height: 360px;
  position: relative;
  border: solid 1px $ruled_line;
  padding: 10px;
  margin: 5px 0;

  .close-button {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: $link_color;
  }
}

.calender-modal {
  background: white;
  width: 270px;
  height: 360px;
  position: relative;
  border: solid 1px $ruled_line;
  padding: 10px;
  margin: 5px 0;

  .close-button {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: $link_color;
  }
}

.calender-modal ::v-deep .mx-datepicker .mx-input-wrapper {
  visibility: hidden;
}
</style>
