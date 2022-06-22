<template>
  <div class="occupations l-contents">
    <form class="form" @submit.prevent>
      <div class="occupation-container">
        <vue-loading
          v-if="isLoading"
          type="spin"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
        <template v-else>
          <div class="employ-job-type-column">
            <p class="employ-job-type-title">職種の設定</p>
            <p class="employ-job-type-sub-title">新規登録</p>
            <div class="employ-job-type-row">
              <input
                v-model="jobType.name"
                type="text"
                placeholder="職種を入力してください"
                class="employ-job-type-register-input"
              />
              <base-button
                class="register-button"
                size="large"
                type="button"
                :disabled="isLoading"
                @click="addJobTypeList(jobType)"
              >
                登録する
              </base-button>
            </div>
            <p class="employ-job-type-list-title">職種一覧</p>
            <p class="employ-job-type-text">
              設定された職種はユーザーのプロフィールで選択できるようになります。<br />
              デフォルトで登録されている職種は削除が可能です。
            </p>
            <table>
              <tr class="heading">
                <th class="left-item job-type-left-item">職種</th>
                <th class="right-item"></th>
              </tr>
              <tr v-for="item in jobTypes" :key="item.uuid">
                <td class="left-item job-type-left-item">{{ item.name }}</td>
                <td class="right-item">
                  <img
                    class="delete-button"
                    :class="{ disabled: item.name === 'なし' }"
                    src="/icon/icon_delete.svg"
                    @click="deleteJobTypeItem(item)"
                  />
                </td>
              </tr>
            </table>
          </div>
          <div class="submit-button-wrapper">
            <base-button
              type="submit"
              class="submit-button"
              size="large"
              @click="onSubmit"
            >
              保存する
            </base-button>
          </div>
        </template>
      </div>
    </form>
    <success-message
      v-if="successMessageModal"
      @close="toggleSuccessMessageModal"
    >
      入力された情報が保存されました。
    </success-message>
    <check-delete
      v-if="checkDeleteModalJobType"
      submit-button-text="完全に削除"
      :index="deleteValue"
      @click="deleteSubmitJobType(deleteValue)"
      @close="togglecheckDeleteModalJobType"
    >
      この職種を完全に削除しますか？
    </check-delete>
    <alert-message v-if="alertModalJobType" @close="togglealertModalJobType">
      この投稿を選択しているメンバーがいます。<br />
      全てのメンバーの職種を変更後、削除してください。
    </alert-message>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  CheckDelete,
  AlertMessage,
  SuccessMessage,
} from '@/components/Admin/Modules/Modal';
import {
  createOrganizationsJobType,
  deleteOrganizationsJobType,
  fetchOrganizationsJobType,
} from '@/libs/api';
import { VueLoading } from 'vue-loading-template';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: {
    SuccessMessage,
    VueLoading,
    BaseButton,
    CheckDelete,
    AlertMessage,
  },
  data() {
    return {
      successMessageModal: false as boolean,
      isLoading: false as boolean,
      occupationTab: [],
      selectedValues: [] as string[],
      deleteValue: '' as string,
      checkDeleteModalJobType: false as boolean,
      alertModalJobType: false as boolean,
      jobType: {} as ApiRequest.JobType,
      jobTypes: [] as ApiResponse.JobType[],
    };
  },
  computed: {
    showOccupationTab() {
      return (key: any) => {
        return this.occupationTab.some((t: any) => t === key);
      };
    },
  },
  async mounted() {
    this.isLoading = true;
    try {
      this.isLoading = true;
      await this.fetchOrganizationsJobTypes();
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    onSubmit() {
      this.toggleSuccessMessageModal();
    },
    toggleSuccessMessageModal() {
      this.successMessageModal = !this.successMessageModal;
    },
    togglecheckDeleteModalJobType() {
      this.checkDeleteModalJobType = !this.checkDeleteModalJobType;
    },
    togglealertModalJobType() {
      this.alertModalJobType = !this.alertModalJobType;
    },
    toggleOccupationTab(key: number) {
      const exist = this.occupationTab.some((t: any) => t === key);
      if (exist) {
        this.occupationTab = this.occupationTab.filter((t: any) => t !== key);
      } else {
        // @ts-ignore
        this.occupationTab.push(key);
      }
    },
    changeSelectedValues(updateValues: string[]) {
      this.selectedValues = updateValues;
    },
    deleteJobTypeItem(item: ApiResponse.JobType) {
      if (item.name === 'なし') {
        return;
      }
      this.deleteValue = item.uuid;
      this.checkDeleteModalJobType = true;
    },
    async addJobTypeList(item: ApiResponse.Jobtype) {
      this.isLoading = true;
      try {
        await createOrganizationsJobType(item);
        await this.fetchOrganizationsJobTypes();
        this.jobType.name = '';
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteSubmitJobType(item: string) {
      this.isLoading = true;
      try {
        await deleteOrganizationsJobType(item);
        await this.fetchOrganizationsJobTypes();
        this.checkDeleteModalJobType = false;
      } catch (error) {
        if (error.response.status === 400) {
          this.checkDeleteModalJobType = false;
          this.alertModalJobType = true;
        }
      } finally {
        this.isLoading = false;
      }
    },
    async fetchOrganizationsJobTypes(): Promise<void> {
      const { data } = await fetchOrganizationsJobType();
      // FIXME: 型定義なおしてください
      // @ts-ignore
      this.jobTypes = data.job_types;
    },
  },
});
</script>

<style lang="scss" scoped>
.occupation-title {
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 1em;
  margin-bottom: 19px;
}

.occupation-sub-title {
  font-size: 13px;
  line-height: 1;
  margin-bottom: 11px;
}

.submit-button-wrapper {
  width: 480px;
  text-align: center;
}

.submit-button {
  width: 200px;
  margin-top: 50px;
}

.companies-title {
  padding-left: 21px;
}

.accordion {
  display: block;
  margin-bottom: 15px;

  .accordion__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border: 1px solid #e4e5ed;
    height: 58px;
    line-height: 58px;
    width: 100%;
    border-radius: 4px;
    cursor: pointer;
  }
}

.tab-button {
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;

  &:hover {
    background-color: black;
  }
}

.children {
  padding: 16px 21px;
  border: solid 1px #e4e5ed;
  border-top: none;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
}

.closed {
  transform: rotateZ(180deg);
}

.checkbox-wrapper {
  margin-right: 15px;
}

.employ-job-type-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1em;
  margin-bottom: 20px;
  color: $dark_blue;
}

.employ-job-type-sub-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1em;
  margin-bottom: 12px;
  color: $dark_blue;
}

.employ-job-type-column {
  display: flex;
  flex-flow: column;
}

.employ-job-type-row {
  display: flex;
  flex-flow: row;
  margin: 0 0 33px 0;

  &:last-of-type {
    margin: 0 0 40px 0;
  }
}

.employ-job-type-text {
  font-size: 13px;
  line-height: 1.7em;
  letter-spacing: 0;
  color: $dark_blue;
  margin: 0 0 12px 0;
}

.employ-job-type-register-input {
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

.employ-job-type-list-title {
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
  width: 479px;
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
  width: 180px;
  height: 30px;
  border-radius: 4px;
  background-color: $extra_light_gray;
  border: 1px solid $light_gray_blue_3;
  color: $gray_blue_4;
  padding: 0 0 0 11px;
  line-height: 1em;
}

.delete-button {
  width: 16px;
  cursor: pointer;

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.job-type-left-item {
  width: 400px;
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
</style>
