<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClick">
      <div class="modal-window">
        <div class="header">
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClick" />
          <div class="label">期間</div>
        </div>
        <div class="content">
          <div class="toggle-wrapper">
            <div
              class="toggle-button"
              :class="{ 'active-toggle': isFilter }"
              @click="isFilter = !isFilter"
            >
              フィルタ
            </div>
            <div
              class="toggle-button"
              :class="{ 'active-toggle': !isFilter }"
              @click="isFilter = !isFilter"
            >
              比較
            </div>
          </div>
          <div v-if="isFilter">
            <base-radio-buttons
              v-for="(radioFilterItem, index) in radioFilterItems"
              :id="`radio-filter${index}`"
              :key="`filter${index}`"
              name="radio-filter"
              :value="radioFilterItem.value"
              :label="radioFilterItem.label"
              :checked="radioFilterItem.value === selectedRadioFilter"
              class="radio"
              @change="(selected) => (selectedRadioFilter = selected)"
            />
            <div class="date-box">
              <div>
                <span>開始</span>
                <date-input
                  v-model="input.start_date"
                  class="date-input"
                  display-format="YYYY年MM月DD日"
                  :disabled="selectedRadioFilter !== 'custom'"
                />
              </div>
              <div class="end-date-box">
                <span>終了</span>
                <date-input
                  v-model="input.end_date"
                  class="date-input"
                  display-format="YYYY年MM月DD日"
                  :disabled="selectedRadioFilter !== 'custom'"
                />
              </div>
            </div>
            <base-button
              class="button"
              size="large"
              :disabled="disablePeriodFilterButton"
              @click="handleUpdatePeriodFilter"
            >
              適応する
            </base-button>
          </div>
          <div v-else>
            <base-radio-buttons
              v-for="(radioComparisonItem, index) in radioComparisonItems"
              :id="`radio-comparison${index}`"
              :key="`comparison${index}`"
              name="radio-comparison"
              :value="radioComparisonItem.value"
              :label="radioComparisonItem.label"
              :checked="radioComparisonItem.value === selectedRadioComparison"
              class="radio"
              @change="(selected) => (selectedRadioComparison = selected)"
            />
            <div class="date-box">
              <div>
                <span>開始</span>
                <date-input
                  v-model="input.start_date"
                  class="date-input"
                  display-format="YYYY年MM月DD日"
                  :disabled="selectedRadioComparison !== 'custom'"
                />
              </div>
              <div class="end-date-box">
                <span>終了</span>
                <date-input
                  v-model="input.end_date"
                  class="date-input"
                  display-format="YYYY年MM月DD日"
                  :disabled="selectedRadioComparison !== 'custom'"
                />
              </div>
            </div>
            <base-button
              class="button"
              size="large"
              :disabled="disablePeriodComparisonButton"
              @click="handleUpdatePeriodComparison"
            >
              適応する
            </base-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseRadioButtons from '@/components/Admin/Modules/Button/BaseRadioButtons.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import DateInput from '@/components/Admin/Modules/Input/DateInput.vue';
import dayjs from '@/libs/dayjs';

export default Vue.extend({
  components: {
    BaseRadioButtons,
    BaseButton,
    DateInput,
  },
  data() {
    return {
      isFilter: true as boolean,
      selectedRadioFilter: 'latest-day',
      selectedRadioComparison: 'last-7day-before-period',
      input: {
        start_date: '',
        end_date: '',
      },
      radioFilterItems: [
        {
          value: 'latest-day',
          label: `最新日（${dayjs().format('YYYY年MM月DD日')}）`,
          startAt: dayjs().unix(),
          endAt: dayjs().unix(),
        },
        {
          value: 'last-7day',
          label: '過去7日間',
          startAt: dayjs()
            .subtract(7, 'day')
            .unix(),
          endAt: dayjs()
            .subtract(1, 'day')
            .unix(),
        },
        {
          value: 'last-1month',
          label: '過去1ヶ月',
          startAt: dayjs()
            .subtract(1, 'month')
            .unix(),
          endAt: dayjs()
            .subtract(1, 'day')
            .unix(),
        },
        {
          value: 'last-3month',
          label: '過去3ヶ月',
          startAt: dayjs()
            .subtract(3, 'month')
            .unix(),
          endAt: dayjs()
            .subtract(1, 'day')
            .unix(),
        },
        {
          value: 'last-12month',
          label: '過去12ヶ月',
          startAt: dayjs()
            .subtract(12, 'month')
            .unix(),
          endAt: dayjs()
            .subtract(1, 'day')
            .unix(),
        },
        {
          value: 'last-16month',
          label: '過去16ヶ月',
          startAt: dayjs()
            .subtract(16, 'month')
            .unix(),
          endAt: dayjs()
            .subtract(1, 'day')
            .unix(),
        },
        {
          value: 'custom',
          label: 'カスタム',
          startAt: '',
          endAt: '',
        },
      ],
      radioComparisonItems: [
        {
          value: 'last-7day-before-period',
          label: '過去7日間と前の期間を比較',
          src: {
            startAt: dayjs()
              .subtract(7, 'day')
              .unix(),
            endAt: dayjs()
              .subtract(1, 'day')
              .unix(),
          },
          dest: {
            startAt: dayjs()
              .subtract(14, 'day')
              .unix(),
            endAt: dayjs()
              .subtract(8, 'day')
              .unix(),
          },
        },
        {
          value: 'last-1month-before-period',
          label: '過去1ヶ月と前の期間を比較',
          src: {
            startAt: dayjs()
              .subtract(1, 'month')
              .unix(),
            endAt: dayjs()
              .subtract(1, 'day')
              .unix(),
          },
          dest: {
            startAt: dayjs()
              .subtract(2, 'month')
              .unix(),
            endAt: dayjs()
              .subtract(1, 'month')
              .subtract(1, 'day')
              .unix(),
          },
        },
        {
          value: 'last-3month-before-period',
          label: '過去3ヶ月と前の期間を比較',
          src: {
            startAt: dayjs()
              .subtract(3, 'month')
              .unix(),
            endAt: dayjs()
              .subtract(1, 'day')
              .unix(),
          },
          dest: {
            startAt: dayjs()
              .subtract(6, 'month')
              .unix(),
            endAt: dayjs()
              .subtract(3, 'month')
              .subtract(1, 'day')
              .unix(),
          },
        },
        {
          value: 'last-6month-before-period',
          label: '過去6ヶ月と前の期間を比較',
          src: {
            startAt: dayjs()
              .subtract(6, 'month')
              .unix(),
            endAt: dayjs()
              .subtract(1, 'day')
              .unix(),
          },
          dest: {
            startAt: dayjs()
              .subtract(12, 'month')
              .unix(),
            endAt: dayjs()
              .subtract(6, 'month')
              .subtract(1, 'day')
              .unix(),
          },
        },
        {
          value: 'last-7day-before-year',
          label: '過去7日間を前年を比較',
          src: {
            startAt: dayjs()
              .subtract(7, 'day')
              .unix(),
            endAt: dayjs()
              .subtract(1, 'day')
              .unix(),
          },
          dest: {
            startAt: dayjs()
              .subtract(1, 'year')
              .subtract(7, 'day')
              .unix(),
            endAt: dayjs()
              .subtract(1, 'year')
              .subtract(1, 'day')
              .unix(),
          },
        },
        {
          value: 'last-1month-before-year',
          label: '過去1ヶ月を前年を比較',
          src: {
            startAt: dayjs()
              .subtract(1, 'month')
              .unix(),
            endAt: dayjs()
              .subtract(1, 'day')
              .unix(),
          },
          dest: {
            startAt: dayjs()
              .subtract(1, 'year')
              .subtract(1, 'month')
              .unix(),
            endAt: dayjs()
              .subtract(1, 'year')
              .subtract(1, 'day')
              .unix(),
          },
        },
        {
          value: 'last-3month-before-year',
          label: '過去3ヶ月と前年を比較',
          src: {
            startAt: dayjs()
              .subtract(3, 'month')
              .unix(),
            endAt: dayjs()
              .subtract(1, 'day')
              .unix(),
          },
          dest: {
            startAt: dayjs()
              .subtract(1, 'year')
              .subtract(3, 'month')
              .unix(),
            endAt: dayjs()
              .subtract(1, 'year')
              .subtract(1, 'day')
              .unix(),
          },
        },
        {
          value: 'custom',
          label: 'カスタム',
          src: {
            startAt: '',
            endAt: '',
          },
          dest: {
            startAt: '',
            endAt: '',
          },
        },
      ],
    };
  },
  computed: {
    disablePeriodFilterButton(): boolean {
      if (this.selectedRadioFilter !== 'custom') return false;
      return !(this.input.start_date && this.input.end_date);
    },
    disablePeriodComparisonButton(): boolean {
      if (this.selectedRadioComparison !== 'custom') return false;
      return !(this.input.start_date && this.input.end_date);
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
    handleUpdatePeriodFilter() {
      const selectedPeriod: any = this.radioFilterItems.find(
        (item: any) => item.value === this.selectedRadioFilter
      );
      let date = {
        startAt: selectedPeriod.startAt,
        endAt: selectedPeriod.endAt,
      };
      if (this.selectedRadioFilter === 'custom') {
        date = {
          startAt: dayjs(this.input.start_date).unix(),
          endAt: dayjs(this.input.end_date).unix(),
        };
      }
      this.$emit('updatePeriodFilter', {
        ...selectedPeriod,
        ...date,
      });
    },
    handleUpdatePeriodComparison() {
      const selectedPeriod: any = this.radioComparisonItems.find(
        (item: any) => item.value === this.selectedRadioComparison
      );
      let date = {
        src: {
          ...selectedPeriod.src,
        },
        dest: {
          ...selectedPeriod.dest,
        },
      };
      if (this.selectedRadioComparison === 'custom') {
        const startDate = dayjs(this.input.start_date);
        const endDate = dayjs(this.input.end_date);
        const diffDate = endDate.diff(startDate, 'day') + 1;
        date = {
          src: {
            startAt: startDate.unix(),
            endAt: endDate.unix(),
          },
          dest: {
            startAt: startDate.subtract(diffDate, 'day').unix(),
            endAt: endDate.subtract(diffDate, 'day').unix(),
          },
        };
      }
      this.$emit('updatePeriodComparison', {
        ...selectedPeriod,
        ...date,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
// modal
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
  background: rgba(126, 129, 149, 0.8);
}

.modal-window {
  background: #fff;
  border-radius: 4px;
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

.header {
  position: relative;
  padding: 20px 30px;
  border-bottom: 1px solid $light_gray_blue_3;
}

.content {
  position: relative;
  padding: 20px 30px;
}

.icon-cross {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}

.label {
  color: $dark_blue;
  font-size: 15px;
  font-weight: 600;
}

.toggle-wrapper {
  display: flex;
  margin: 0 0 14px 0;
}

.toggle-button {
  width: 250px;
  height: 30px;
  text-align: center;
  line-height: 1;
  font-size: 15px;
  padding: 0 0 14px 0;
  color: $gray_blue_1;
  border-bottom: 1px solid $light_gray_blue_3;
  cursor: pointer;
}

.active-toggle {
  color: $pink;
  border-bottom: 3px solid $pink;
  cursor: default;
  font-weight: bold;
  pointer-events: none;
}

.radio {
  display: block;
  margin: 4px 0 4px 0;
}

.date-box {
  display: flex;
  font-size: 15px;
  color: $dark_blue;
  margin: 6px 0 0 0;
  padding: 0 0 50px 0;
  border-bottom: 1px solid $light_gray_blue_3;
}

.end-date-box {
  margin-left: 25px;
}

.button {
  width: 200px;
  display: block;
  margin: 20px auto 0;
}
</style>
