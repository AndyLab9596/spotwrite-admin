<template>
  <div class="company-data-container">
    <div class="add">
      <h2 class="sub-title">項目を追加</h2>
      <div class="input-day">
        <select v-model="historyYear" class="select">
          <option value="" disabled>選択してください</option>
          <option
            v-for="displayYear in displayYears"
            :key="`year_option_${displayYear}`"
            :value="displayYear"
          >
            {{ displayYear }}
          </option>
        </select>
        <span class="input-day__label">年</span>

        <select v-model="historyMonth" class="select">
          <option value="" disabled>選択してください</option>
          <option
            v-for="displayMonth in displayMonths"
            :key="`month_option_${displayMonth}`"
            :value="displayMonth"
          >
            {{ displayMonth }}
          </option>
        </select>
        <span class="input-day__label">月</span>
      </div>
      <input
        v-model="historyTitle"
        placeholder="タイトルをご記入ください。"
        class="input"
      />
      <textarea
        v-model="historyContent"
        class="textarea"
        placeholder="社歴をご記入ください。"
      ></textarea>
      <base-button
        class="add-button"
        :disabled="addButtonDisabled"
        @click="addHistory"
      >
        保存する
      </base-button>
    </div>
    <div class="display">
      <h2 class="sub-title">沿革を確認</h2>
      <div class="history-list">
        <company-history-row
          v-for="history in histories"
          :key="history.uuid"
          :history="history"
          @edit="showEditHistoryModal"
          @delete="deleteHistory"
        ></company-history-row>
      </div>
    </div>
    <edit-history
      v-if="editHistoryModal"
      :history="propHistory"
      @click="editHistory"
      @close="closeEditHistoryModal"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';
import { EditHistory } from '@/components/Admin/Modules/Modal';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import CompanyHistoryRow from '@/components/Admin/Pages/Organizations/Company/CompanyHistoryRow.vue';

export default Vue.extend({
  components: {
    EditHistory,
    BaseButton,
    CompanyHistoryRow,
  },
  props: {
    organizationHistories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      displayYears: [] as number[],
      displayMonths: [] as number[],
      historyMonth: '' as string,
      historyYear: '' as string,
      historyTitle: '' as string,
      historyContent: '' as string,
      editHistoryModal: false as boolean,
      propHistory: {},
      deleteHistoryUuid: '' as string,
    };
  },
  computed: {
    histories() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.$props.organizationHistories.sort(
        (a: Types.History, b: Types.History) => {
          if (a.date > b.date) {
            return 1;
          }
          return -1;
        }
      );
    },
    addButtonDisabled(): boolean {
      return (
        !this.historyYear ||
        !this.historyMonth ||
        !this.historyTitle ||
        !this.historyContent
      );
    },
  },
  mounted() {
    const nowYear = Number(dayjs().format('YYYY'));
    this.displayYears = [...Array(100).keys()].map((m: number) => nowYear - m);
    this.displayMonths = [...Array(12).keys()].map((i: number) => i + 1);
  },
  methods: {
    addHistory() {
      if (this.historyYear !== null && this.historyMonth !== null) {
        const timestamp = dayjs(
          new Date(Number(this.historyYear), Number(this.historyMonth))
        ).unix();
        const value = {
          title: this.historyTitle,
          content: this.historyContent,
          date: timestamp,
        };
        this.$emit('add', value);
      }
      this.historyTitle = '';
      this.historyContent = '';
      this.historyYear = '';
      this.historyMonth = '';
    },
    deleteHistory(deleteHistoryUuid: string) {
      this.$emit('delete', deleteHistoryUuid);
    },
    editHistory(history: Types.History) {
      this.$emit('edit', history);
      this.closeEditHistoryModal();
    },
    showEditHistoryModal(history: Types.History) {
      this.propHistory = history;
      this.editHistoryModal = true;
    },
    closeEditHistoryModal() {
      this.editHistoryModal = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.sub-title {
  font-size: 15px;
}

.add {
  display: flex;
  flex-direction: column;
}

.input-day {
  display: flex;
  align-items: center;
  margin-top: 16px;

  &__label {
    margin-left: 5px;
    margin-right: 15px;
  }
}

.add-button {
  width: 200px;
  height: 40px;
  margin: 40px auto 0;
}

.display {
  margin-top: 40px;
}

.history-list {
  margin-top: 16px;
  border-bottom: solid 1px $light_gray_blue_3;
}

.input {
  color: $gray_blue_4;
  height: 40px;
  background-color: $extra_light_gray;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  margin-top: 20px;
  padding-left: 11px;

  &::placeholder {
    color: $placeholder_gray;
  }
}

.textarea {
  color: $gray_blue_4;
  background-color: $extra_light_gray;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  margin-top: 20px;
  width: 100%;
  height: 120px;
  resize: none;
  padding: 11px;

  &::placeholder {
    color: $placeholder_gray;
  }
}

.select {
  height: 40px;
  width: 150px;
  color: $gray_blue_4;
  background-color: $extra_light_gray;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  padding-left: 8px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url(/icon/icon_pulldown.svg);
  background-repeat: no-repeat;
  background-size: 10px 8px;
  background-position: right 4px center;
}
</style>
