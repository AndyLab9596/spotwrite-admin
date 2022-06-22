<template>
  <div class="schedule-accordion">
    <div
      :class="{ 'schedule-title-box_close': !show }"
      class="schedule-title-box"
      @click="toggleSchedule"
    >
      <h3 class="schedule-title">予定{{ workflowNumber }}</h3>
      <div class="tab-button">
        <svg
          :class="{ close: show }"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <g
            id="長方形_3776"
            data-name="長方形 3776"
            transform="translate(24 24) rotate(180)"
            fill="#fff"
            stroke="#e4e5ed"
            stroke-width="1"
          >
            <rect width="24" height="24" rx="4" stroke="none" />
            <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" fill="none" />
          </g>
          <g
            id="Icon_arrow_r"
            data-name="Icon/arrow_r"
            transform="translate(10 14) rotate(-90)"
          >
            <path
              id="パス_351"
              data-name="パス 351"
              d="M673.472,750.512l3-2-3-2"
              transform="translate(-673.472 -746.512)"
              fill="none"
              stroke="#f09c9c"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
            />
          </g>
        </svg>
      </div>
    </div>
    <div v-show="show" class="schedule-details">
      <label class="label">時間</label>
      <div class="time-box">
        <base-select
          v-model="workflowHour"
          :items="hours"
          @input="onChangeHour"
        />
        <span class="time-word">時</span>

        <base-select
          v-model="workflowMinute"
          :items="minutes"
          @input="onChangeMinute"
        />
        <span class="time-word">分</span>
      </div>
      <label class="label">タイトル</label>
      <base-input-text
        v-model="inputWorkflow.title"
        class="input"
        placeholder="例）出社後、メールチェックなど"
        @input="onInputTitle"
      />
      <label class="label textarea-label">説明</label>
      <base-textarea
        class="textarea"
        :value="inputWorkflow.content"
        placeholder="例）メールチェック、当日やるべき仕事の確認"
        @input="onInputContent"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseInputText from '@/components/Admin/Modules/Input/BaseInputText.vue';
import BaseTextarea from '@/components/Admin/Modules/Input/BaseTextarea.vue';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';

export default Vue.extend({
  components: {
    BaseInputText,
    BaseTextarea,
    BaseSelect,
  },
  props: {
    workflowNumber: {
      type: Number,
      required: true,
    },
    inputWorkflow: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      show: false,
      workflowHour: Number(
        this.inputWorkflow.starting_time.split(':')[0]
      ) as number,
      workflowMinute: Number(
        this.inputWorkflow.starting_time.split(':')[1]
      ) as number,
    };
  },
  computed: {
    hours() {
      const hours = [];

      for (let i = 0; i < 24; i += 1) {
        if (i < 10) {
          hours.push({ name: `0${i}`, value: i });
        } else {
          hours.push({ name: String(i), value: i });
        }
      }
      return hours;
    },
    minutes() {
      const minutes = [];

      for (let i = 0; i < 60; i += 1) {
        if (i < 10) {
          minutes.push({ name: `0${i}`, value: i });
        } else {
          minutes.push({ name: String(i), value: i });
        }
      }
      return minutes;
    },
  },
  methods: {
    toDoubleDigit(num: string): string {
      return `0${num}`.slice(-2);
    },
    toggleSchedule() {
      this.show = !this.show;
    },
    onChangeHour(hour: number) {
      this.workflowHour = hour;
      this.$emit('input', {
        ...this.inputWorkflow,
        starting_time: `${this.toDoubleDigit(
          hour.toString()
        )}:${this.toDoubleDigit(this.workflowMinute.toString())}`,
      });
    },
    onChangeMinute(minute: number) {
      this.workflowMinute = minute;
      this.$emit('input', {
        ...this.inputWorkflow,
        starting_time: `${this.toDoubleDigit(
          this.workflowHour.toString()
        )}:${this.toDoubleDigit(minute.toString())}`,
      });
    },
    onInputTitle(title: string) {
      const value = { ...this.inputWorkflow, title };
      this.$emit('input', value);
    },
    onInputContent(content: string) {
      const value = { ...this.inputWorkflow, content };
      this.$emit('input', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.schedule-contents {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  margin-top: 30px;
}

.schedule-title-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: $white_1;
  padding: 0 15px 0;
  cursor: pointer;
  border-style: solid;
  border-color: $light_gray_blue_3;
  border-width: 1px 1px 0;
  height: 44px;

  &_close {
    border-width: 1px;
  }
}

.schedule-title {
  font-size: 14px;
}

.schedule-details {
  display: grid;
  grid-template-columns: 90px 1fr;
  grid-template-rows: 30px 40px 120px;
  grid-row-gap: 20px;
  padding: 20px;
  border-style: solid;
  border-color: $light_gray_blue_3;
  border-width: 0 1px 1px;
}

.label {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
}

.select {
  height: 100%;
  width: 80px;
  border: solid 1px $light_gray_blue_3;
  background-color: $extra_light_gray;
  border-radius: 4px;
}

.time-word {
  margin-left: 5px;
  margin-right: 15px;
}

.textarea-label {
  align-items: start;
}

.close {
  transform: rotateZ(180deg);
}

.tab-button {
  transform: rotateZ(180deg);
  display: flex;
  align-items: center;
}

.time-box {
  display: flex;
  align-items: center;
}
</style>
