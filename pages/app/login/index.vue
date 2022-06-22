<template>
  <div class="login">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form class="form" @submit.prevent="handleSubmit(onSubmit)">
        <h1 class="form__title">Welcome!</h1>

        <spotwrite-logo class="logo-image" />

        <outlined-text-field
          v-model="input.email"
          input-name="email"
          placeholder="spot@spotwrite.co.jp"
          class="form__input"
          rules="required|email"
        >
          メールアドレス
        </outlined-text-field>

        <outlined-text-field
          v-model="input.password"
          input-name="password"
          class="form__input"
          rules="required"
          type="password"
        >
          パスワード
        </outlined-text-field>

        <save-checkbox v-model="saveLoginInfo">
          ログイン状態を保持する
        </save-checkbox>

        <vue-loading
          v-if="isLoading"
          type="spin"
          color="#333"
          class="spinner"
          :size="{ width: '50px', height: '44px' }"
        />

        <button v-else class="login-button" type="submit">ログイン</button>

        <nuxt-link class="link" to="/reset-password/send-email">
          パスワードをお忘れの方はこちら
        </nuxt-link>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { VueLoading } from 'vue-loading-template';
import { ValidationObserver } from 'vee-validate';

import OutlinedTextField from '@/components/App/atoms/textFields/OutlinedTextField.vue';
import LogoWhite from '@/components/App/atoms/images/LogoWhite.vue';
import SaveCheckbox from '@/components/App/atoms/buttons/SaveCheckbox.vue';
import {
  loginEmployee,
  fetchUserProfile,
  fetchContractStatus,
  fetchCurrentSubscription,
} from '@/libs/api';

export default Vue.extend({
  layout: 'app/clean',
  components: {
    ValidationObserver,
    OutlinedTextField,
    'spotwrite-logo': LogoWhite,
    SaveCheckbox,
    VueLoading,
  },
  data() {
    return {
      input: {} as ApiRequest.Login,
      saveLoginInfo: false as boolean,
      isLoading: false as boolean,
      multipleClick: false as boolean,
    };
  },
  middleware: ['login'],
  methods: {
    async onSubmit() {
      this.isLoading = true;

      try {
        const { data: loginResponse } = await loginEmployee(this.input);
        await this.$accessor.setAccessToken({
          accessToken: loginResponse.access_token,
        });
        const { data: userProfile } = await fetchUserProfile();
        this.$accessor.setUserProfile(userProfile);
        if (userProfile.login_times === 1) {
          this.$accessor.setShowTutorialFlag(true);
        } else {
          this.$accessor.setShowTutorialFlag(false);
        }
        if (userProfile.has_same_account_holder_email) {
          await this.fetchContractStatus();
          await this.fetchCurrentSubscription();
        }
        // INFO: this.$router.push()を使うと画面遷移後のmiddlewareが発動しないため下記のコードにしている
        window.location.href = '/';
      } catch (error) {
        alert('ログインに失敗しました。');
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchContractStatus(): Promise<void> {
      const { data } = await fetchContractStatus();
      if ('downgrading' in data) {
        this.$accessor.contract.storeDowngradingStatus(data.downgrading);
      }
    },
    async fetchCurrentSubscription(): Promise<void> {
      const { data } = await fetchCurrentSubscription();
      this.$accessor.contract.storeSubscription(data);
    },
  },
});
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-block-size: 100vh;
  width: 100%;
  background: $gradient_pink_blue;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 480px;
  padding: 40px;
  background-color: hsla(0, 0%, 100%, 0.3);
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
}

.form__input {
  width: 100%;
}

.form__title {
  font-size: 15px;
  margin: 0 0 16px;
  letter-spacing: 0;
  color: $true_white;
  font-weight: normal;
}

.logo-image {
  margin: 0 0 30px;
}

.link {
  cursor: pointer;
  color: $true_white;
  font-size: 13px;
}

.login-button {
  width: 100%;
  height: 44px;
  margin: 24px 0;
  padding-right: 14px;
  padding-left: 14px;
  color: $true_white;
  font-size: 15px;
  font-weight: 600;
  appearance: none;
  background-color: $icon_gray;
  border: none;
  box-shadow: none;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
}

.spinner {
  margin: 24px 0;
}
</style>
