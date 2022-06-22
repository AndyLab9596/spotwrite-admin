<template>
  <div class="page-container">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form class="form" @submit.prevent="handleSubmit(onSubmit)">
        <p class="form-top-text">運営会社専用</p>
        <img class="logo" src="/image/logo_white@2x.png" />
        <validation-provider v-slot="email" rules="required" class="input-box">
          <label class="label">メールアドレス</label>
          <input
            v-model="input.email"
            type="text"
            label="メールアドレス"
            name="メールアドレス"
            class="input"
          />
          <span v-if="multipleClick" class="error">{{ email.errors[0] }}</span>
        </validation-provider>
        <validation-provider
          v-slot="password"
          rules="required"
          class="input-box input-box-password"
        >
          <label class="label">パスワード</label>
          <input
            v-model="input.password"
            type="password"
            class="input"
            name="パスワード"
          />
          <span v-if="multipleClick" class="error">{{
            password.errors[0]
          }}</span>
        </validation-provider>
        <label class="login-hold">
          <base-checkbox />
          <!--        TODO: ログイン状態を保持する処理を実装する -->
          <p class="login-hold-text">ログイン状態を保持する</p>
        </label>
        <vue-loading
          v-if="isLoading"
          type="spin"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
        <button v-else class="submit-button" @click="checkFirstClick">
          ログイン
        </button>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { adminLogin, fetchAdminUserProfile } from '@/libs/api';
import { VueLoading } from 'vue-loading-template';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';

export default Vue.extend({
  layout: 'clean',
  components: {
    ValidationObserver,
    ValidationProvider,
    VueLoading,
    BaseCheckbox,
  },
  data() {
    return {
      input: {} as ApiRequest.Login,
      error: false as boolean,
      multipleClick: false as boolean,
      isLoading: false as boolean,
    };
  },
  methods: {
    async onSubmit() {
      this.isLoading = true;
      try {
        const { data } = await adminLogin(this.input);
        await this.$accessor.setAccessToken({ accessToken: data.access_token });
        await this.fetchAdminUserProfile();
        this.$router.push({ path: '/system-admin/article-theme' });
      } catch (error) {
        alert(
          'ログインに失敗しました。メールアドレスとパスワードが正しいか確認をお願いします。'
        );
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    checkFirstClick() {
      this.multipleClick = true;
    },
    async fetchAdminUserProfile(): Promise<void> {
      const { data } = await fetchAdminUserProfile();
      this.$accessor.setAdminUserProfile(data);
    },
  },
});
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: $gradient_pink_blue;
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
  padding: 27px 30px 31px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
}

.title {
  margin-bottom: 32px;
}

.input-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 0 15px 0;
}

.input {
  height: 40px;
  width: 100%;
  background-color: $extra_light_gray;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  color: $gray_blue_4;
  padding: 0 11px;
  filter: none;
}

input:-internal-autofill-selected {
  -webkit-text-fill-color: $gray_blue_4 !important;
  box-shadow: 0 0 0 999px $extra_light_gray inset !important;
}

.password-forgot {
  font-size: 13px;
  font-weight: 300;
  line-height: 1.7;
  color: $true_white;
}

.submit-button {
  width: 100%;
  height: 44px;
  text-align: center;
  border: none;
  background-color: $gray_blue_3;
  font-size: 15px;
  font-weight: 600;
  color: $true_white;
  border-radius: 4px;
  margin: 0 0 15px 0;
}

.form-top-text {
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0;
  color: $true_white;
  margin: 0 0 13px 0;
}

.logo {
  width: 113px;
  margin: 0 0 30px 0;
}

.label {
  font-weight: 300;
  font-size: 13px;
  letter-spacing: 0;
  color: $true-white;
  margin: 0 0 6px 0;
}

.login-hold {
  display: flex;
  align-items: center;
  margin: 0 0 15px 0;
}

.register-box {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 350px;
  height: fit-content;
  text-align: right;
  margin: 17px 0 0 0;
}

.register-text {
  font-size: 13px;
  letter-spacing: 0;
  color: $true_white;
  font-weight: 300;
  padding: 0 15px 0 0;
}

.arrow-right {
  height: 12px;
}

.register-link {
  display: flex;
  align-items: center;
}

.input-error {
  background-color: $light_pink;
  border: 1px solid $valid_pink;
}

.login-hold-text {
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0;
  color: $true_white;
  padding: 0 0 0 15px;
}
</style>
