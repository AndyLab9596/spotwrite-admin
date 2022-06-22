<template>
  <div class="deadline-time-wrapper">
    <title-with-index title="提出時間の設定" index="3" class="title" />
    <p class="deadline-time-value" @click="switchCalender">
      {{ formatedDate }}
    </p>
    <div v-if="isShowCalender" class="calender-modal">
      <date-picker
        :value="date"
        type="time"
        :open="isShowCalender"
        :editable="false"
        :popup-style="{
          position: 'relative',
          top: '-10px',
          left: '0px',
          width: '250px',
          border: 'none',
          'box-shadow': 'none',
        }"
        :append-to-body="false"
        :show-second="false"
        @input="changeTime"
      ></date-picker>
      <BaseButton
        inverse
        size="large"
        class="close-button"
        @click="switchCalender"
      >
        完了
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import DatePicker from 'vue2-datepicker';
import dayjs from '@/libs/dayjs';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import TitleWithIndex from '@/components/App/organisms/daily-report-setting-create/delivery-date-setting/common-items/TitleWithIndex.vue';

export default Vue.extend({
  components: {
    DatePicker,
    BaseButton,
    TitleWithIndex,
  },
  props: {
    time: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    isShowCalender: false as boolean,
  }),
  computed: {
    formatedDate(): string {
      return dayjs(this.date).format('HH:mm');
    },
    date(): Date {
      // 日付の時間だけ欲しいので適当な日付をセットしている
      return dayjs(`2020/01/01 ${this.time}`).toDate();
    },
  },
  methods: {
    disabledTime() {
      return true;
    },
    clickButton(value: string) {
      this.$emit('change', value);
    },
    switchCalender() {
      this.isShowCalender = !this.isShowCalender;
    },
    changeTime(value: Date) {
      this.$emit('change', dayjs(value).format('HH:mm:00'));
    },
  },
});
</script>

<style lang="scss" scoped>
.deadline-time-wrapper {
  width: 125px;
  height: inherit;
  border-bottom: 1px solid $ruled_line;
}

.title {
  margin: 0 0 27px 0;
}

.calender-modal {
  background: $true_white;
  width: 262px;
  height: 272px;
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
  display: none;
}

.deadline-time-value {
  color: $main_color;
  padding: 0 0 0 16px;
  cursor: pointer;
}
</style>
