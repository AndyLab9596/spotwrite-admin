<template>
  <div>
    <div class="publishBirthday">
      <p class="form-label">生年月日</p>
      <img
        v-if="!selectPublishedBirthday"
        src="/app/icon/icon-check-pink.svg"
        class="user-check-icon"
        @click="publishedBirthdayChecked"
      />
      <img
        v-else
        src="/app/icon/icon-check-gray.svg"
        class="user-check-icon"
        @click="publishedBirthdayChecked"
      />
      <label class="publishBirthdayLable" @click="publishedBirthdayChecked">
        非公開
      </label>
    </div>
    <div class="birthday-wrapper">
      <normal-select-box
        v-model="selectedYear"
        name="select-box"
        large-font
        :display-pull-down="true"
        :items="years"
        class="select-box"
        @change="changeBirthDay"
      />
      <p class="birthday-text">年</p>
      <normal-select-box
        v-model="selectedMonth"
        name="select-box"
        large-font
        :display-pull-down="true"
        :items="months"
        class="select-box"
        @change="changeBirthDay"
      />
      <p class="birthday-text">月</p>
      <normal-select-box
        v-model="selectedDay"
        name="select-box"
        large-font
        :display-pull-down="true"
        :items="days"
        class="select-box"
        @change="changeBirthDay"
      />
      <p class="birthday-text">日</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from '@/libs/dayjs';
import NormalSelectBox from '../../../atoms/selectBox/NormalSelectBox.vue';

export default Vue.extend({
  components: {
    NormalSelectBox,
  },
  props: {
    birthDay: {
      type: Number,
      required: true,
    },
    years: {
      type: Array as PropType<number[]>,
      required: true,
    },
    months: {
      type: Array as PropType<number[]>,
      required: true,
    },
    publishedBirthday: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      selectedYear: 0 as number,
      selectedMonth: 0 as number,
      selectedDay: 0 as number,
      selectPublishedBirthday: false as boolean,
    };
  },
  computed: {
    days(): Types.Date[] {
      if (!this.selectedYear || !this.selectedMonth) return [];

      const daysInMonth = dayjs()
        .year(this.selectedYear)
        .month(this.selectedMonth - 1)
        .daysInMonth();
      return [...Array(daysInMonth).keys()].map((i: number) => {
        return { name: i + 1, value: i + 1 };
      });
    },
  },
  created() {
    this.setBirthDay();
  },
  methods: {
    setBirthDay(): void {
      this.selectedYear = Number(dayjs.unix(this.birthDay).format('YYYY'));
      this.selectedMonth = Number(dayjs.unix(this.birthDay).format('MM'));
      this.selectedDay = Number(dayjs.unix(this.birthDay).format('DD'));
      this.selectPublishedBirthday = this.$props.publishedBirthday;
    },
    publishedBirthdayChecked(): void {
      this.selectPublishedBirthday = !this.selectPublishedBirthday;
      this.$emit('onChangePublishedBirthday', this.selectPublishedBirthday);
    },
    changeBirthDay() {
      if (
        this.selectedYear !== 0 &&
        this.selectedMonth !== 0 &&
        this.selectedDay !== 0
      ) {
        // unixに変換するために文字列に変換する
        const birthDay =
          `${String(this.selectedYear)}-` +
          `${String(this.selectedMonth)}-${String(this.selectedDay)}`;
        this.$emit(
          'onChangeBirthDay',
          dayjs(birthDay)
            .add(1, 'd')
            .unix()
        );
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.publishBirthday {
  display: flex;
}

.user-check-icon {
  height: 16px;
  cursor: pointer;
  margin-left: 25px;
}

.publishBirthdayLable {
  margin-left: 5px;
  font-size: 13px;
  margin-top: -1px;
  cursor: pointer;
}

.birthday-wrapper {
  display: flex;
  align-items: flex-end;
  margin: 0 0 24px 0;
}

.select-box {
  width: 100%;
  margin: 0 22px 0 0;
  color: $main-color;
  line-height: 1em;
}

.birthday-text {
  font-size: 15px;
  color: $main-color;
  line-height: 1em;
  margin: 0 23px 0 0;

  &:last-of-type {
    margin: 0;
  }
}

.form-label {
  font-size: 15px;
  line-height: 1em;
  font-weight: 600;
  color: $main_color;
  margin: 0 0 16px 0;
}
</style>
