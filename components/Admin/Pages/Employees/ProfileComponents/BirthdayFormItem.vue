<template>
  <div class="container">
    <div class="heading">
      <label class="label"
        >生年月日<span class="required-label">※必須</span></label
      >
    </div>
    <div class="content">
      <validation-provider v-slot="year" rules="required" name="年">
        <div class="form-item">
          <base-select
            v-model="selectedYear"
            :items="years"
            :class="{ 'v-select-error': year.errors[0] || !selectedYear }"
            class="select"
            :disabled="disabled"
          />
          <span>年</span>
        </div>
      </validation-provider>
      <validation-provider v-slot="month" rules="required" name="月">
        <div class="form-item">
          <base-select
            v-model="selectedMonth"
            class="select"
            label="name"
            :items="months"
            :class="{ 'v-select-error': month.errors[0] || !selectedMonth }"
            :disabled="disabled"
          />
          <span>月</span>
        </div>
      </validation-provider>
      <validation-provider v-slot="day" rules="required" name="日">
        <div class="form-item">
          <base-select
            v-model="selectedDay"
            class="select"
            label="name"
            :items="days"
            :class="{ 'v-select-error': day.errors[0] || !selectedDay }"
            :disabled="disabled"
          />
          <span>日</span>
        </div>
      </validation-provider>
      <base-checkbox
        :value="isPublished ? null : 'privated'"
        :selected-values="['privated']"
        name="birthday-hidden"
        label="非公開"
        class="checkbox"
        :disabled="disabled"
        @change="changeIsPublished"
      />
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import Vue, { PropType } from 'vue';
import { ValidationProvider } from 'vee-validate';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';

type Data = {
  selectedYear: number | null;
  selectedMonth: number | null;
  selectedDay: number | null;
};

export default Vue.extend({
  name: 'BirthdayFormItem',
  components: {
    BaseSelect,
    ValidationProvider,
    BaseCheckbox,
  },
  props: {
    birthday: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    years: {
      type: Array as PropType<{ name: string; value: number }[]>,
      required: true,
    },
    months: {
      type: Array as PropType<{ name: string; value: number }[]>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data(): Data {
    return {
      selectedYear: null,
      selectedMonth: null,
      selectedDay: null,
    };
  },
  computed: {
    days(): { name: string; value: number }[] {
      if (!this.selectedYear || !this.selectedMonth) return [];

      const daysInMonth = dayjs()
        .year(this.selectedYear)
        .month(this.selectedMonth - 1)
        .daysInMonth();
      return [...Array(daysInMonth).keys()].map((i: number) => ({
        name: String(i + 1),
        value: i + 1,
      }));
    },
  },
  watch: {
    birthday(value: string) {
      if (value) {
        const s = value.split('-');
        this.selectedYear = Number(s[0]);
        this.selectedMonth = Number(s[1]);
        this.selectedDay = Number(s[2]);
      }
    },
    selectedYear() {
      this.changeBirthday();
    },
    selectedMonth() {
      this.changeBirthday();
    },
    selectedDay() {
      this.changeBirthday();
    },
  },
  methods: {
    isBirthdayFilled(): boolean {
      return (
        this.selectedYear != null &&
        this.selectedMonth != null &&
        this.selectedDay != null
      );
    },
    changeBirthday() {
      if (this.isBirthdayFilled()) {
        // birtyYear, birthMonth, birthDayの入力が全て完了していたら大元のデータを更新する
        const birthday = `${this.selectedYear}-${this.selectedMonth}-${this.selectedDay}`;
        this.$emit('onChangeBirthday', birthday);
      }
    },
    isBirthdayPublished(value: string[]) {
      /**
       * 非公開チェックボックスのチェック判定
       *   - チェックが入っていたら非公開（falseを返す）
       *   - チェックが入ってなかったら公開（trueを返す）
       */
      return value.length <= 0;
    },
    changeIsPublished(value: string[]) {
      if (this.isBirthdayPublished(value)) {
        this.$emit('onChangePublishedBirthday', true);
      } else {
        this.$emit('onChangePublishedBirthday', false);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
  font-weight: normal;
  font-size: 15px;
}

.heading {
  display: flex;
  min-width: 180px;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
}

.form-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  margin-right: 16px;
  width: 172px;
}

.select {
  flex: 1;
  font-size: 13px;
  font-weight: 300;
  margin-right: 10px;
}

.error {
  font-size: 0.8em;
  color: red;
}

.v-select-error /deep/ .vs__dropdown-toggle {
  background-color: $light_pink;
  border-color: $pink;
}

.required-label {
  color: #9c9da5;
  font-size: 13px;
  font-weight: normal;
  margin-left: 9px;
}

.label {
  font-weight: bold;
}
</style>
