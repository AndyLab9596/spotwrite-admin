<template>
  <div class="company-history-row-container">
    <div class="history-day">
      <p>
        {{ transformYear(history.date) }}年{{ transformMonth(history.date) }}月
      </p>
    </div>
    <div class="right-box">
      <div class="history-content">
        <p class="history-content-title">{{ history.title }}</p>
        <p class="history-content-text">{{ history.content }}</p>
      </div>
      <div class="history-buttons">
        <base-button class="history-button" @click="onPressEditButton(history)">
          変更
        </base-button>
        <outlined-button
          class="history-button"
          @click="toggleDeleteHistoryModal(history.uuid)"
        >
          削除
        </outlined-button>
      </div>
    </div>
    <check-delete
      v-if="deleteHistoryModal"
      :index="history.uuid"
      @click="deleteHistory"
      @close="toggleDeleteHistoryModal"
    >
      <p>この社歴を削除しますか？</p>
    </check-delete>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import CheckDelete from '@/components/Admin/Modules/Modal/CheckDelete.vue';
import dayjs from '@/libs/dayjs';
import OutlinedButton from '@/components/Admin/Modules/Button/OutlinedButton.vue';

export default Vue.extend({
  components: {
    BaseButton,
    CheckDelete,
    OutlinedButton,
  },
  props: {
    history: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      deleteHistoryModal: false as boolean,
    };
  },
  methods: {
    transformYear(timestamp: number) {
      return Number(dayjs.unix(timestamp).format('YYYY'));
    },
    transformMonth(timestamp: number) {
      return Number(dayjs.unix(timestamp).format('M'));
    },
    onPressEditButton() {
      this.$emit('edit', this.history);
    },
    toggleDeleteHistoryModal() {
      this.deleteHistoryModal = !this.deleteHistoryModal;
    },
    deleteHistory() {
      this.$emit('delete', this.history.uuid);
      this.toggleDeleteHistoryModal();
    },
  },
});
</script>

<style lang="scss" scoped>
.company-history-row-container {
  min-height: 50px;
  display: flex;
  flex-direction: row;
  border-top: solid 1px $light_gray_blue_3;
  font-size: 13px;
}

.history-day {
  width: 100px;
  border-right: solid 4px #ededed;
  padding: 8px 6px;
}

.right-box {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;

  .history-content {
    max-width: 520px;

    .history-content-title {
      white-space: pre-wrap;
      font-weight: bold;
    }

    .history-content-text {
      white-space: pre-wrap;
    }
  }
}

.history-buttons {
  width: 130px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.history-button {
  width: 60px;
}
</style>
