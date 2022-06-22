<template>
  <div>
    <div class="vue-loading">
      <vue-loading
        v-if="isLoading"
        type="spin"
        color="#333"
        :size="{ width: '50px', height: '50px' }"
      ></vue-loading>
    </div>
    <form class="form l-contents">
      <div class="employ-position-row">
        <div class="employ-position-column">
          <p class="employ-position-title">雇用形態の設定</p>
          <p class="employ-position-sub-title">新規登録</p>
          <div class="employ-position-row">
            <input
              v-model="employmentStatus.name"
              type="text"
              placeholder="雇用形態を入力してください"
              class="employ-position-register-input"
            />
            <base-button
              class="register-button"
              size="large"
              type="button"
              :disabled="isLoading"
              @click="addEmployStatusList(employmentStatus)"
            >
              登録する
            </base-button>
          </div>
          <p class="employ-position-list-title">雇用形態一覧</p>
          <p class="employ-position-text">
            表示させたい名前をフォームに入力することができます。<br />
            フォームが未入力な場合、登録した雇用形態名が反映されます。
          </p>
          <table class="employ-table">
            <thead>
              <tr class="heading">
                <th class="left-item employ-table-cell">雇用形態</th>
                <th class="center-item employ-table-cell">表示名</th>
                <th class="center-item employ-table-cell-small">表示順</th>
                <th class="right-item employ-table-cell-small"></th>
              </tr>
            </thead>
            <draggable
              v-model="employStatuses"
              :animation="200"
              :ghost-class="'ghost'"
              tag="tbody"
            >
              <tr
                v-for="item in employStatuses"
                :key="item.uuid"
                class="draggable-item"
              >
                <td class="left-item employ-left-item employ-table-cell">
                  <img src="/icon/icon-move.png" class="move-icon" />
                  {{ item.name }}
                </td>
                <td class="center-item employ-table-cell">
                  <input
                    v-model="item.display_name"
                    class="table-input"
                    type="text"
                  />
                </td>
                <td class="center-item employ-table-cell-small">
                  {{ item.order_number }}
                </td>
                <td class="right-item employ-table-cell-small">
                  <img
                    v-if="item.is_deletable"
                    class="delete-button"
                    src="/icon/icon_delete.svg"
                    @click="deleteEmployStatusItem(item)"
                  />
                  <img
                    v-else
                    class="delete-disabled-button"
                    src="/icon/icon_delete_disabled.svg"
                  />
                </td>
              </tr>
            </draggable>
          </table>
        </div>
        <div class="line" />
        <div class="employ-position-column">
          <p class="employ-position-title">役職の設定</p>
          <p class="employ-position-sub-title">新規登録</p>
          <div class="employ-position-row">
            <input
              v-model="position.name"
              type="text"
              placeholder="役職を入力してください"
              class="employ-position-register-input"
            />
            <base-button
              class="register-button"
              size="large"
              type="button"
              :disabled="isLoading"
              @click="addPositionList(position)"
            >
              登録する
            </base-button>
          </div>
          <p class="employ-position-list-title">役職一覧</p>
          <p class="employ-position-text">
            設定された役職はユーザー登録時とプロフィールで選択可能になります。
          </p>
          <table class="employ-table">
            <thead>
              <tr class="heading">
                <th class="left-item position-left-item">役職</th>
                <th class="center-item employ-table-cell-small">表示順</th>
                <th class="right-item employ-table-cell-small"></th>
              </tr>
            </thead>
            <draggable
              v-model="positions"
              :animation="200"
              :ghost-class="'ghost'"
              tag="tbody"
            >
              <tr
                v-for="item in positions"
                :key="item.uuid"
                class="draggable-item"
              >
                <td class="left-item position-left-item">
                  <img src="/icon/icon-move.png" class="move-icon" />
                  {{ item.name }}
                </td>
                <td class="center-item employ-table-cell-small">
                  {{ item.order_number }}
                </td>
                <td class="right-item employ-table-cell-small">
                  <img
                    v-if="item.is_deletable"
                    class="delete-button"
                    src="/icon/icon_delete.svg"
                    @click="deletePositionItem(item)"
                  />
                  <img
                    v-else
                    class="delete-disabled-button"
                    src="/icon/icon_delete_disabled.svg"
                  />
                </td>
              </tr>
            </draggable>
          </table>
        </div>
      </div>
      <base-button
        class="save-button"
        size="large"
        :disabled="isLoading"
        type="button"
        @click="onSubmit"
      >
        保存する
      </base-button>
    </form>
    <alert-message
      v-if="alertModalEmploymentStatus"
      @close="toggleAlertModalEmployStatus"
    >
      この投稿を選択しているメンバーがいます。<br />
      全てのメンバーの雇用形態を変更後、削除してください。
    </alert-message>
    <alert-message v-if="alertModalPosition" @close="toggleAlertModalPosition">
      この投稿を選択しているメンバーがいます。<br />
      全てのメンバーの役職を変更後、削除してください。
    </alert-message>
    <check-delete
      v-if="checkDeleteModalEmploymentStatus"
      submit-button-text="完全に削除"
      :index="deleteValue"
      @click="deleteSubmitEmployStatus(deleteValue)"
      @close="toggleCheckDeleteModalEmployStatus"
    >
      雇用形態を完全に削除しますか？<br />
      削除した場合、この雇用形態のメンバーは「未定」になります。
    </check-delete>
    <check-delete
      v-if="checkDeleteModalPosition"
      submit-button-text="完全に削除"
      :index="deleteValue"
      @click="deleteSubmitPosition(deleteValue)"
      @close="toggleCheckDeleteModalPosition"
    >
      役職を完全に削除しますか？<br />
      削除した場合、この役職のメンバーは「なし」になります。
    </check-delete>
    <success-message
      v-if="successMessageModal"
      @close="toggleSuccessMessageModal"
    >
      入力された情報が保存されました。
    </success-message>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';
import {
  CheckDelete,
  AlertMessage,
  SuccessMessage,
} from '@/components/Admin/Modules/Modal';
import {
  fetchOrganizationsEmploymentStatuses,
  fetchOrganizationsPositions,
  createOrganizationsEmploymentStatuses,
  createPositions,
  updateOrganizationsEmploymentPositions,
  deletePositions,
  updateOrganizationsEmploymentStatuses,
  deleteOrganizationsEmploymentStatuses,
} from '@/libs/api';
import { VueLoading } from 'vue-loading-template';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: {
    SuccessMessage,
    CheckDelete,
    AlertMessage,
    VueLoading,
    BaseButton,
    draggable,
  },
  data() {
    return {
      checkDeleteModalEmploymentStatus: false as boolean,
      checkDeleteModalPosition: false as boolean,
      successMessageModal: false as boolean,
      alertModalEmploymentStatus: false as boolean,
      alertModalPosition: false as boolean,
      deleteValue: '' as string,
      employmentStatus: {} as ApiRequest.EmploymentStatus,
      position: {} as ApiRequest.Position,
      employStatuses: [] as ApiResponse.EmploymentStatus[],
      positions: [] as ApiResponse.Position[],
      isLoading: false as boolean,
    };
  },
  async mounted() {
    this.isLoading = true;
    try {
      await this.fetchOrganizationsEmploymentStatuses();
      this.isLoading = false;
      this.isLoading = true;
      await this.fetchOrganizationsPositions();
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    async onSubmit() {
      this.isLoading = true;
      try {
        await this.updateEmployStatusList();
        await this.updateEmployPositionsList();
        this.fetchOrganizationsEmploymentStatuses();
      } catch (error) {
        console.error(error);
      } finally {
        this.fetchOrganizationsPositions();
        this.toggleSuccessMessageModal();
        this.isLoading = false;
      }
    },
    toggleSuccessMessageModal() {
      this.successMessageModal = !this.successMessageModal;
    },
    toggleCheckDeleteModalEmployStatus() {
      this.checkDeleteModalEmploymentStatus = !this
        .checkDeleteModalEmploymentStatus;
    },
    toggleCheckDeleteModalPosition() {
      this.checkDeleteModalPosition = !this.checkDeleteModalPosition;
    },
    toggleAlertModalEmployStatus() {
      this.alertModalEmploymentStatus = !this.alertModalEmploymentStatus;
    },
    toggleAlertModalPosition() {
      this.alertModalPosition = !this.alertModalPosition;
    },
    async addEmployStatusList(item: ApiResponse.EmploymentStatus) {
      this.isLoading = true;
      try {
        await createOrganizationsEmploymentStatuses(item);
        await this.fetchOrganizationsEmploymentStatuses();
        this.employmentStatus.name = '';
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async addPositionList(item: ApiResponse.Position) {
      this.isLoading = true;
      try {
        await createPositions(item);
        await this.fetchOrganizationsPositions();
        this.position.name = '';
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async updateEmployPositionsList() {
      this.isLoading = true;
      try {
        await updateOrganizationsEmploymentPositions(
          // @ts-ignore
          this.positions as ApiResponse.Position
        );
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async updateEmployStatusList() {
      this.isLoading = true;
      try {
        await updateOrganizationsEmploymentStatuses(
          // @ts-ignore
          this.employStatuses as ApiResponse.EmploymentStatus
        );
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    deleteEmployStatusItem(item: ApiResponse.EmploymentStatus) {
      if (item.is_master) return;
      this.deleteValue = item.uuid;
      this.checkDeleteModalEmploymentStatus = true;
    },
    deletePositionItem(item: ApiResponse.Position) {
      this.deleteValue = item.uuid;
      this.checkDeleteModalPosition = true;
    },
    async deleteSubmitEmployStatus(item: string) {
      this.isLoading = true;
      try {
        await deleteOrganizationsEmploymentStatuses(item);
        await this.fetchOrganizationsEmploymentStatuses();
        this.checkDeleteModalEmploymentStatus = false;
      } catch (error) {
        if (error.response.status === 400) {
          this.checkDeleteModalEmploymentStatus = false;
          this.alertModalEmploymentStatus = true;
        }
      } finally {
        this.isLoading = false;
      }
    },
    async deleteSubmitPosition(item: string) {
      this.isLoading = true;
      try {
        await deletePositions(item);
        await this.fetchOrganizationsPositions();
        this.checkDeleteModalPosition = false;
      } catch (error) {
        if (error.response.status === 400) {
          this.checkDeleteModalPosition = false;
          this.alertModalPosition = true;
        }
      } finally {
        this.isLoading = false;
      }
    },
    async fetchOrganizationsEmploymentStatuses(): Promise<void> {
      const { data } = await fetchOrganizationsEmploymentStatuses();
      // @ts-ignore
      (this.employStatuses as ApiResponse.EmploymentStatus[]) = data;
    },
    async fetchOrganizationsPositions(): Promise<void> {
      const { data } = await fetchOrganizationsPositions();
      // @ts-ignore
      (this.positions as ApiResponse.Position[]) = data;
    },
  },
});
</script>

<style lang="scss" scoped>
.employ-position-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1em;
  margin-bottom: 20px;
  color: $dark_blue;
}

.employ-position-sub-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1em;
  margin-bottom: 12px;
  color: $dark_blue;
}

.employ-position-column {
  display: flex;
  flex-flow: column;
}

.employ-position-row {
  display: flex;
  flex-flow: row;
  margin: 0 0 33px 0;

  &:last-of-type {
    margin: 0 0 40px 0;
  }
}

.employ-position-text {
  font-size: 13px;
  line-height: 1.7em;
  letter-spacing: 0;
  color: $dark_blue;
  margin: 0 0 12px 0;
}

.employ-position-register-input {
  width: 300px;
  height: 40px;
  border-radius: 4px;
  padding: 0 0 0 11px;
  font-size: 13px;
  letter-spacing: 0;
  line-height: 1em;
  border: 1px solid $light_gray_blue_3;
  background-color: $extra_light_gray;
  margin: 0 10px 0 0;
}

.line {
  min-width: 1px;
  background-color: $light_gray_blue_3;
  margin: 0 20px 0 19px;
}

.vue-loading {
  position: fixed;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}

.register-button {
  width: 120px;
}

.save-button {
  margin: 0 auto;
  width: 200px;
}

.employ-position-list-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;
  color: $dark_blue;
  margin: 0 0 14px 0;
}

table {
  border-bottom: 1px solid $light_gray_blue_3;
  border-right: 1px solid $light_gray_blue_3;
  border-left: 1px solid $light_gray_blue_3;
}

tr {
  display: flex;
  align-items: center;
  height: 40px;
}

th {
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 160px;
  background-color: $white_1;
  color: $gray_blue_4;
  font-size: 13px;
  font-weight: 600;
}

.left-item {
  display: flex;
  align-items: center;
  width: 160px;
  height: 40px;
  color: $gray_blue_4;
  padding: 0 0 0 11px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.7em;
  border-top: 1px solid $light_gray_blue_3;
  border-right: 1px solid $light_gray_blue_3;
}

.employ-left-item {
  background-color: $white_1;
}

.center-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 191px;
  height: 40px;
  border-top: 1px solid $light_gray_blue_3;
  border-right: 1px solid $light_gray_blue_3;
}

.right-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 40px;
  border-top: 1px solid $light_gray_blue_3;
}

.table-input {
  width: 95%;
  height: 30px;
  border-radius: 4px;
  background-color: $extra_light_gray;
  border: 1px solid $light_gray_blue_3;
  color: $gray_blue_4;
  padding: 0 0 0 11px;
  line-height: 1em;
}

.move-icon {
  margin-right: 15px;
}

.delete-button {
  width: 16px;
  cursor: pointer;
}

.delete-disabled-button {
  width: 16px;
  cursor: not-allowed;
}

.position-left-item {
  width: 350px;
}

.employ-table {
  width: 100%;
  table-layout: fixed;
}

.employ-table-cell {
  width: 350px;
}

.employ-table-cell-small {
  max-width: 60px;
}

.heading {
  background-color: $white_1;
}

.heading > .right-item {
  cursor: default;
}

.l-contents {
  padding: 30px;
}

input::placeholder {
  color: $placeholder_gray;
}

input:-ms-input-placeholder {
  color: $placeholder_gray;
}

.draggable-item {
  cursor: grab;
}

.ghost {
  opacity: 0.5;
}
</style>
