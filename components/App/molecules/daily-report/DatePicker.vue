<template>
  <div class="date-picker-wrapper">
    <img
      src="/app/icon/Icon-calendar.svg"
      alt="calender"
      role="button"
      @click="isShowCalender = true"
    />
    <div v-if="isShowCalender" class="date-picker">
      <div class="calender-modal">
        <date-picker
          v-model="selectedDate"
          type="date"
          :open="isShowCalender"
          :editable="false"
          :popup-style="{
            position: 'relative',
            top: '-10px',
            left: '0px',
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
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DatePicker from 'vue2-datepicker';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import dayjs from '@/libs/dayjs';
import { Dayjs } from 'dayjs';

export default Vue.extend({
  components: { DatePicker, BaseButton },
  props: {
    date: {
      type: Object as PropType<Dayjs>,
      required: true,
    },
  },
  data() {
    return { selectedDate: null, isShowCalender: false };
  },
  created() {
    this.selectedDate = new Date(this.date.utc().format());
  },
  methods: {
    selectDate() {
      this.$emit('change', dayjs(this.selectedDate));
      this.isShowCalender = !this.isShowCalender;
    },
  },
});
</script>

<style lang="scss" scoped>
.date-picker-wrapper {
  *[role='button'] {
    cursor: pointer;
  }

  position: relative;
  margin-left: 10px;

  .date-picker {
    position: absolute;
  }
}

.calender-modal {
  background: $true_white;
  height: 320px;
  position: relative;
  border: solid 1px $ruled_line;
  padding: 10px;
  margin: 5px 0;

  .close-button {
    position: absolute;
    bottom: 2px;
    left: 0;
    width: 100%;
    background: $link_color;
    z-index: 1;
  }

  & ::v-deep .mx-datepicker .mx-input-wrapper {
    display: none;
  }
}
</style>
