<template>
  <div class="container">
    <h1 class="table-title">過去の配属先履歴</h1>
    <table>
      <tr>
        <th>配属開始年月日</th>
        <th>会社名</th>
        <th>所属名</th>
        <th>備考</th>
      </tr>
      <tr v-for="item in ascendingOrderedHistories" :key="item.uuid">
        <td>
          {{ item.joined_year ? item.joined_year + '年' : '' }}
          {{ item.joined_month ? item.joined_month + '月' : '' }}
        </td>
        <td>{{ item.company_name }}</td>
        <td>{{ item.organization_name }}</td>
        <td>{{ item.note }}</td>
      </tr>
    </table>

    <add-button
      type="button"
      class="history-button"
      :disabled="disabled"
      @click="showModal"
    >
      配属先履歴を追加
    </add-button>

    <add-affiliation-history-modal
      v-if="isModalShown"
      :years="years"
      :months="months"
      @onClose="closeModal"
      @onSubmit="addAssignmentHistory"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AddButton from '@/components/Admin/Pages/CommunityManagement/AddButton.vue';
import AddAffiliationHistoryModal from '@/components/Admin/Pages/Employees/AddAffiliationHistoryModal.vue';
import { fetchAssignmentHistories, addAssignmentHistory } from '@/libs/api';

type Data = {
  isModalShown: boolean;
  assignmentHistories: Types.AssignmentHistory[];
};

export default Vue.extend({
  name: 'AssignmentHistoriesFormItem',
  components: {
    AddButton,
    AddAffiliationHistoryModal,
  },
  props: {
    uuid: {
      type: String,
      required: true,
      default: '',
    },
    years: {
      type: Array,
      default: () => [],
    },
    months: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data(): Data {
    return {
      isModalShown: false,
      assignmentHistories: [],
    };
  },
  computed: {
    ascendingOrderedHistories(): Types.AssignmentHistory[] {
      return this.assignmentHistories
        .slice()
        .sort((a: Types.AssignmentHistory, b: Types.AssignmentHistory) => {
          // 年の昇順
          if (a.joined_year > b.joined_year) {
            return 1;
          }
          if (a.joined_year < b.joined_year) {
            return -1;
          }

          // 年が同じ場合は月の昇順
          if (a.joined_month > b.joined_month) {
            return 1;
          }
          return -1;
        });
    },
  },
  mounted() {
    this.fetchAssignmentHistories();
  },
  methods: {
    async fetchAssignmentHistories() {
      const { data } = await fetchAssignmentHistories(this.uuid);
      this.assignmentHistories = data.assignment_histories;
    },
    async addAssignmentHistory(value: ApiRequest.AssignmentHistory) {
      try {
        this.closeModal();
        const { data } = await addAssignmentHistory(this.uuid, value);
        this.assignmentHistories = data.assignment_histories;
      } catch (e) {
        alert('配属履歴の追加に失敗しました。');
      }
    },
    showModal() {
      this.isModalShown = true;
    },
    closeModal() {
      this.isModalShown = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 4px;
  width: 900px;
}

.table-title {
  line-height: 1em;
  margin: 0 0 17px;
  font-size: 15px;
  font-weight: 600;
}

table {
  width: 100%;
  margin-bottom: 15px;

  th {
    background-color: $white_1;
    font-weight: normal;
    color: $gray_blue_4;
    font-size: 13px;
    vertical-align: middle;

    &:first-child {
      padding-left: 10px;
    }
  }

  tr {
    border-bottom: 1px solid $light_gray_blue_3;
    border-top: 1px solid $light_gray_blue_3;
    height: 40px;
  }

  td {
    color: $dark_blue;
    font-size: 13px;
    font-weight: 300;
    vertical-align: middle;

    &:first-child {
      padding-left: 10px;
    }
  }
}

.history-button {
  max-width: 147px;
  width: 100%;

  &[disabled] {
    background: #f3f3f3;
    border-color: #e4e5ed;
    color: #bebebe;
  }
}
</style>
