<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-content">
          <div class="title-wrapper">
            <p class="public-setting-title">期限</p>
            <img
              src="/icon/icon-close.svg"
              class="icon-cross"
              @click="onClose"
            />
          </div>
          <div class="setting-wrapper">
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
            <div
              v-if="selectedSettings === 'on'"
              class="date-wrapper"
              @click="onCalendarActiveInactiveButtonClick"
            >
              <div class="date-row">
                <div class="date-calendar-container">
                  <div class="date-row">
                    <div class="date">
                      <p>
                        {{ startAt | dateFilter }}
                        <img class="icon" src="/icon/Icon-calendar.svg" />
                      </p>
                    </div>
                    <div class="time">
                      {{ startAt | timeFilter }}
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
                        {{ endAt | dateFilter }}
                        <img class="icon" src="/icon/Icon-calendar.svg" />
                      </p>
                    </div>
                    <div class="time">
                      {{ endAt | timeFilter }}
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
                :disabled-date="notBeforeToday"
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

          <div class="title-wrapper">
            <p class="public-setting-title">記事設定</p>
          </div>
          <div class="article-setting-wrapper">
            <p class="article-text">重要な記事に設定する</p>
            <toggle-button
              v-model="importantArticle"
              class="switch-button"
              @onChange="changeImportantArticle"
            />
          </div>
        </div>
        <div class="modal-footer">
          <base-button size="large" class="button" inverse @click="onClose">
            キャンセル
          </base-button>
          <base-button
            size="large"
            class="button"
            inverse
            :disabled="hasValidationError"
            @click="clickPost"
          >
            投稿
          </base-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import ToggleButton from '@/components/App/atoms/buttons/ToggleButton.vue';
import RadioButton from '@/components/App/atoms/buttons/RaadioButton.vue';
import dayjs from '@/libs/dayjs';
import DatePicker from 'vue2-datepicker';
import 'vue2-timepicker/dist/VueTimepicker.css';

type Data = {
  A: string;
  H: string;
  HH: string;
  a: string;
  h: string;
  hh: string;
  k: string;
  kk: string;
  m: string;
  mm: string;
  s: string;
  ss: string;
};

type TimePicker = {
  data: Data;
  displayTime: string;
};

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
    hasValidationError: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    importantArticle: false as boolean,
    selectedSettings: 'off',
    startAt: dayjs().unix() as number | null,
    endAt: dayjs().unix() as number | null,
    startEndRange: [] as Array<Date>,
    expire_at: new Date(),
    isExpireShowSelectCalender: false as boolean,
    isShowSelectCalender: false as boolean,
    isAllDay: false as boolean,
  }),
  watch: {
    selectedSettings(value: string) {
      if (value === 'off') {
        this.startAt = null;
        this.endAt = null;

        this.$emit('changeStartDate', this.startAt);
        this.$emit('changeEndDate', this.endAt);
        // this.allDay = false;
      }
    },
    startEndRange(): void {
      this.startAt = dayjs(this.startEndRange[0]).unix();
      this.endAt = dayjs(this.startEndRange[1]).unix();

      this.$emit('changeStartDate', this.startAt);
      this.$emit('changeEndDate', this.endAt);
    },
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    selectedSettingsOn() {
      this.selectedSettings = 'on';
    },
    changeImportantArticle(value: boolean) {
      this.importantArticle = value;
      this.$emit('changeImportantArticle', value);
    },
    changeSetting(value: string) {
      this.selectedSettings = value;
    },
    clickPost() {
      this.$emit('post');
    },
    disabledTime(): boolean {
      return this.isAllDay;
    },
    onExpireCalendarActiveInactiveButtonClick() {
      this.isExpireShowSelectCalender = !this.isExpireShowSelectCalender;
    },
    notBeforeToday(date: Date) {
      return date < new Date(new Date().setHours(0, 0, 0, 0));
    },
    onCalendarActiveInactiveButtonClick() {
      this.isShowSelectCalender = !this.isShowSelectCalender;
    },
    allDay(isActive: boolean) {
      if (isActive) {
        if (this.startEndRange.length === 0) {
          this.startEndRange = [new Date(), new Date()];
          this.startEndRange[0] = new Date(
            this.startEndRange[0].setHours(0, 0)
          );
          this.startEndRange[1] = new Date(
            this.startEndRange[1].setHours(23, 59)
          );
        } else {
          this.startEndRange = [
            new Date(this.startEndRange[0].setHours(0, 0)),
            new Date(this.startEndRange[1].setHours(23, 59)),
          ];
        }
        this.isAllDay = true;
      } else {
        this.isAllDay = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 800px;
  background: $true_white;
  border-radius: 4px;
}

.icon-cross {
  cursor: pointer;
}

.select {
  flex: 1;
  width: 230px;
  height: 40px;
}

.modal-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 30px 20px;
}

.button {
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  background-color: $light_gray_blue_7;
  font-weight: bold;
  color: $gray_blue_4;
  width: 100%;
  height: 40px;

  &:first-of-type {
    margin: 0 10px 0 0;
  }
}

// オーバーレイのトランジション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  // オーバーレイに包含されているモーダルウィンドウのトランジション
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

// ディレイを付けるとモーダルウィンドウが消えた後にオーバーレイが消える
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.modal-enter {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $white_1;
  padding: 18px 24px 17px;
  margin: 0 0 30px;
  width: 100%;
  border-radius: 4px 4px 0 0;
}

.public-setting-title {
  font-size: 15px;
  font-weight: 600;
  color: $gray_blue_4;
}

.setting-wrapper {
  margin: 0 0 41px 30px;
}

.article-setting-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 698px;
  margin: 0 0 40px 30px;
}

.article-text {
  font-size: 15px;
  font-weight: 300;
  color: $dark_blue;
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

// .time {
//   display: flex;
//   align-items: center;
// }

// TODO: いらないのけす

.input {
  width: 100%;
  appearance: none;
  border: none;
  padding: 20px 0;
  color: $main_color;
}

.icon {
  margin: 0 0 0 1px;
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

.expire-setting {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 26px 0 21px 0;
  border-bottom: 1px solid $ruled_line;
  margin-bottom: 11px;

  .expire-date-calendar {
    display: flex;
    flex-direction: column;

    .date-calendar-container {
      display: flex;
      justify-content: space-between;
      padding-top: 17px;
    }

    .time {
      font-family: 'Lato', sans-serif;
      font-size: 24px;
      font-weight: 400;
      color: $main_color;
    }
  }

  .all-day {
    .text {
      color: $gray;
      text-align: center;
    }

    .toggle-button-container {
      padding-top: 17px;
    }
  }
}

.dates-setting {
  display: flex;
  justify-content: space-between;
  padding: 26px 0 21px 0;
  border-bottom: 1px solid $ruled_line;
  margin-bottom: 11px;

  .date-info {
    display: flex;
    flex-direction: column;

    .date-calendar {
      display: flex;
      font-size: 24px;
      padding-top: 17px;

      .date-calendar-start {
        display: flex;
      }

      .date-calendar-end {
        display: flex;
      }

      .space {
        width: 54px;
        text-align: center;
      }
    }
  }

  .all-day {
    .text {
      color: $gray;
      text-align: center;
    }

    .toggle-button-container {
      padding-top: 17px;
    }
  }
}

.place-setting {
  .input {
    width: 100%;
    appearance: none;
    border: none;
    padding: 20px 0;
    color: $main_color;
  }

  input.input {
    border-bottom: 1px solid $ruled_line;
    margin-bottom: 11px;
  }
}

.show-joining-setting {
  display: flex;
  justify-content: space-between;
  padding: 20px 0 20px 0;
  border-bottom: 1px solid $ruled_line;
  margin-bottom: 11px;
}

.show-invitation-setting {
  height: fit-content;
  border-bottom: 1px solid $ruled_line;
  margin-bottom: 24px;

  .content {
    display: flex;
    justify-content: space-between;

    .text {
      .count {
        font-weight: bold;
      }
    }

    .open-add-invite-modal {
      cursor: pointer;
    }
  }

  .invited-organization {
    padding: 16px 0 24px 0;

    ul {
      display: flex;
      color: $text_gray;
      flex-wrap: wrap;
      height: fit-content;

      li {
        padding: 10px;
        border: 1px solid $ruled_line;
        border-radius: 10px;
        margin-right: 8px;
        margin-bottom: 10px;
      }
    }
  }
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
