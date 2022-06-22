<template>
  <div class="contents">
    <page-header title="アカウントホルダー設定" />

    <div class="tabs">
      <base-tabs
        :items="tabs"
        :current-id="currentId"
        @change-tab="changeTab($event)"
      />
    </div>

    <!-- メールアドレスタブ -->
    <div v-show="currentId === '1'" class="display-switch-box">
      <validation-observer v-slot="{ invalid }">
        <div class="title-content">
          メールアドレスの変更
        </div>
        <div class="input-container">
          <label class="label-container">
            現在のメールアドレス
          </label>
          <div class="current-value">
            {{ $accessor.userProfile.email }}
          </div>
        </div>
        <div class="input-container">
          <label class="label-container">
            新しいメールアドレス
          </label>
          <validation-provider
            rules="required|email"
            class="validation-content"
          >
            <base-input-text
              v-model="email"
              placeholder="新しいメールアドレスを入力してください。"
            />
          </validation-provider>
        </div>
        <div class="action-button">
          <base-button
            :disabled="invalid || loading"
            size="large"
            @click="emailChange"
            >メールアドレスを変更する</base-button
          >
        </div>
      </validation-observer>
    </div>

    <!-- パスワードタブ -->
    <div v-show="currentId === '2'" class="display-switch-box">
      <validation-observer v-slot="{ invalid }">
        <div class="title-content">
          パスワードの変更
        </div>
        <div class="input-container">
          <label class="label-container">
            現在のパスワード
          </label>
          <validation-provider rules="required" class="validation-content">
            <base-input-password
              v-model="currentPassword"
              placeholder="現在のパスワードを入力してください。"
            />
          </validation-provider>
        </div>
        <div class="input-container">
          <label class="label-container">
            新しいパスワード
          </label>
          <validation-provider
            rules="required|min:8"
            vid="confirmation"
            class="validation-content"
          >
            <base-input-password
              v-model="newPassword"
              placeholder="新しいパスワードを入力してください。"
            />
          </validation-provider>
        </div>
        <div class="input-container">
          <label class="label-container"></label>
          <validation-provider
            rules="required|confirmed:confirmation"
            class="validation-content"
          >
            <base-input-password
              v-model="newPasswordConfirmation"
              placeholder="パスワードを再度入力してください。"
            />
          </validation-provider>
        </div>
        <div class="action-button">
          <base-button
            :disabled="invalid || loading"
            size="large"
            @click="passwordChange"
            >パスワードを変更する</base-button
          >
        </div>
      </validation-observer>
    </div>

    <success-message v-show="showModal" @close="closeModal">{{
      modalMessage
    }}</success-message>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import BaseTabs from '@/components/Admin/Modules/Tab/BaseTabs.vue';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BaseInputText from '@/components/Admin/Modules/Input/BaseInputText.vue';
import BaseInputPassword from '@/components/Admin/Modules/Input/BaseInputPassword.vue';
import { SuccessMessage } from '@/components/Admin/Modules/Modal';
import {
  fetchOwnerProfile,
  updateAccountHolderEmail,
  updateAccountHolderPassword,
} from '@/libs/api';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    ValidationObserver,
    ValidationProvider,
    BaseTabs,
    PageHeader,
    BaseButton,
    BaseInputText,
    BaseInputPassword,
    SuccessMessage,
  },
  data() {
    return {
      tabs: [
        {
          id: '1',
          name: 'メールアドレス',
        },
        {
          id: '2',
          name: 'パスワード',
        },
      ],
      currentId: '1',
      showModal: false,
      modalMessage: '',
      loading: false,
      email: '',
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
    };
  },
  methods: {
    async fetchOwnerProfile(): Promise<void> {
      const { data } = await fetchOwnerProfile();
      this.$accessor.setUserProfile(data);
    },
    changeTab(id: string) {
      this.currentId = id;
    },
    async emailChange() {
      this.loading = true;
      try {
        await updateAccountHolderEmail({
          email: this.email,
        });
        this.modalMessage = 'メールアドレスが変更されました。';
      } catch {
        this.modalMessage = 'メールアドレスが変更されませんでした。';
      } finally {
        this.loading = false;
        this.showModal = true;
      }
      // 表示するためのデータ更新
      try {
        await this.fetchOwnerProfile();
      } catch (error) {
        console.error(error);
      }
    },
    async passwordChange() {
      this.loading = true;
      try {
        await updateAccountHolderPassword({
          current_password: this.currentPassword,
          password: this.newPassword,
          password_confirmation: this.newPasswordConfirmation,
        });
        this.modalMessage = 'パスワードが変更されました。';
      } catch {
        this.modalMessage = 'パスワードが変更されませんでした。';
      } finally {
        this.loading = false;
        this.showModal = true;
        this.currentPassword = '';
        this.newPassword = '';
        this.newPasswordConfirmation = '';
      }
    },
    closeModal() {
      this.showModal = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.contents {
  position: relative;
  padding-left: 40px;
  padding-right: 80px;
}

.tabs {
  margin-top: 18px;
  margin-bottom: 15px;
}

.display-switch-box {
  display: flex;
  flex-direction: column;
  min-height: 800px;
  min-width: 960px;
  padding-top: 33px;
  padding-left: 30px;
  background-color: $true_white;
  font-size: 13px;
  color: $dark_blue;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
}

.title-content {
  width: 270px;
  margin-bottom: 27px;
  font-size: 15px;
  font-weight: bold;
}

.current-value {
  font-size: 15px;
  color: $gray_blue_4;
}

.input-container {
  display: flex;
  align-items: center;
  height: 40px;
  min-width: 830px;
  margin-right: 100px;
  margin-bottom: 30px;
}

.validation-content {
  width: 100%;
}

.label-container {
  min-width: 180px;
  font-size: 15px;
  font-weight: bold;
}

.action-button {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}
</style>
