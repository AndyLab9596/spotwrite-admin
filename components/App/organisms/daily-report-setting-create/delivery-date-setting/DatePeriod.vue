<template>
  <div class="date-period-wrapper">
    <title-with-index title="期間の設定" index="2" class="title" />
    <div class="date-wrapper" @click="switchCalender">
      <div class="date-item">
        <p>
          {{ startAt | dateFilter }}
          <img class="icon" src="/icon/Icon-calendar.svg" />
        </p>
      </div>
      <div class="space">
        〜
      </div>
      <div class="date-item">
        <p>
          {{ endAt | dateFilter }}
          <img class="icon" src="/icon/Icon-calendar.svg" />
        </p>
      </div>
    </div>
    <div v-if="isShowCalender" class="calender-range-modal-wrapper">
      <div class="calender-range-modal">
        <date-picker
          :value="date"
          type="date"
          range
          :open="isShowCalender"
          :disabled-date="notBeforeToday"
          :editable="false"
          :popup-style="{
            position: 'relative',
            top: '-10px',
            left: '0px',
            width: '500px',
            border: 'none',
            'box-shadow': 'none',
          }"
          :append-to-body="false"
          :show-second="false"
          @input="changeDate"
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
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DatePicker from 'vue2-datepicker';
import dayjs from '@/libs/dayjs';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import TitleWithIndex from '@/components/App/organisms/daily-report-setting-create/delivery-date-setting/common-items/TitleWithIndex.vue';

export default Vue.extend({
  filters: {
    dateFilter(unixTime: number) {
      if (unixTime) {
        return dayjs.unix(unixTime).format('YYYY/MM/DD');
      }
      return null;
    },
  },
  components: {
    DatePicker,
    BaseButton,
    TitleWithIndex,
  },
  props: {
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
  },
  data: () => ({
    isShowCalender: false as boolean,
  }),
  computed: {
    date(): Date[] | null[] {
      if (this.startAt == null || this.endAt == null)
        return [new Date(), new Date()] as Date[];
      // Dateオブジェクトはミリ秒で計算しているのでunixに1000かけている
      return [new Date(this.startAt * 1000), new Date(this.endAt * 1000)];
    },
  },
  methods: {
    switchCalender() {
      this.isShowCalender = !this.isShowCalender;
    },
    notBeforeToday(date: Date) {
      return date < new Date(new Date().setHours(0, 0, 0, 0));
    },
    changeDate(values: Date[]) {
      this.$emit('changeStartAt', dayjs(values[0]).unix());
      this.$emit('changeEndAt', dayjs(values[1]).unix());
    },
  },
});
</script>

<style lang="scss" scoped>
.title {
  margin: 0 0 19px 0;
}

.date-period-wrapper {
  height: inherit;
  border-bottom: 1px solid $ruled_line;
}

.date-wrapper {
  display: flex;
  align-items: center;
  width: fit-content;

  .date-item {
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
    cursor: pointer;

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

  .space {
    font-size: 24px;
    font-weight: 300;
    color: $main_color;
    margin: 0 16px;
  }
}

.calender-range-modal-wrapper {
  position: relative;
}

.calender-range-modal {
  width: 521px;
  height: 319px;
  position: absolute;
  top: 0;
  left: 0;
  border: solid 1px $ruled_line;
  padding: 10px;
  margin: 5px 0;
  background: white;

  .close-button {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: $link_color;
  }
}

.calender-range-modal ::v-deep .mx-datepicker .mx-input-wrapper {
  display: none;
}
</style>
