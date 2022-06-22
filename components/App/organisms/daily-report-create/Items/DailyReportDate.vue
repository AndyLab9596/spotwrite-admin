<template>
  <div class="daily-report-date-wrapper">
    <p class="daily-report-date-title">日付</p>
    <div class="daily-report-date-button-wrapper">
      <date-item :date="selectedPostedAt" @click="switchCalender" />
      <div v-if="isShowCalender" class="calender-modal">
        <date-picker
          v-model="postAt"
          type="date"
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
import Vue from 'vue';
import dayjs from '@/libs/dayjs';
import DatePicker from 'vue2-datepicker';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import DateItem from '@/components/App/organisms/daily-report-create/Items/DateItem.vue';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    DatePicker,
    BaseButton,
    DateItem,
  },
  props: {
    selectedPostedAt: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    postAt: new Date(),
    postAtUnix: 0 as number,
    isShowCalender: false as boolean,
  }),
  watch: {
    postAt(date: Date) {
      this.$emit('change', dayjs(date).unix());
    },
  },
  created() {
    // Dateオブジェクトはミリ秒で計算しているのでunixに1000かけている
    this.postAt = new Date(this.selectedPostedAt * 1000);
    this.postAtUnix = this.selectedPostedAt;
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
  },
});
</script>

<style lang="scss" scoped>
.daily-report-date-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;
  color: $dark_blue;
  margin: 0 0 9px;
  font-family: 'Lato', 'Hiragino Kaku Gothic Pro', sans-serif;
}

.calender-modal {
  background: $true_white;
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
  display: none;
}
</style>
