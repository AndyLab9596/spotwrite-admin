<template>
  <div class="page-container">
    <ValidationObserver v-slot="{ invalid, handleSubmit }">
      <form class="form" @submit.prevent="handleSubmit(onSubmit)">
        <p class="form-top-text">新規登録!</p>
        <img class="logo" src="/image/logo_white@2x.png" />
        <div class="form-top-message">
          <p>spotwriteのご利用ありがとうございます。</p>
          <p>メールアドレスとパスワードをご登録ください。</p>
        </div>
        <validation-provider
          v-slot="email"
          rules="required|email"
          class="input-box"
        >
          <label class="label">メールアドレス</label>
          <input
            v-model="input.email"
            type="text"
            name="メールアドレス"
            class="input"
            :class="{ 'input-error': email.errors[0] }"
          />
          <div class="error">{{ email.errors[0] }}</div>
        </validation-provider>
        <validation-provider
          v-slot="password"
          rules="required|min:8"
          class="input-box"
        >
          <label class="label">パスワード</label>
          <input
            v-model="input.password"
            type="password"
            class="input"
            name="パスワード"
            :class="{ 'input-error': password.errors[0] }"
          />
          <div class="error">{{ password.errors[0] }}</div>
        </validation-provider>
        <vue-loading
          v-if="isLoading"
          type="spin"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
        <button
          v-else
          class="submit-button"
          :disabled="invalid"
          @click="onSubmit"
        >
          新規登録する
        </button>
      </form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { singupAccountHolder } from '@/libs/api';
import { VueLoading } from 'vue-loading-template';

export default Vue.extend({
  components: {
    ValidationObserver,
    ValidationProvider,
    VueLoading,
  },
  data() {
    return {
      input: {} as ApiRequest.Login,
      error: false as boolean,
      isLoading: false as boolean,
    };
  },
  created() {
    setTimeout(() => {
      this.$accessor.contract.flush();
    }, 300);
  },
  methods: {
    async onSubmit() {
      this.isLoading = true;
      try {
        await singupAccountHolder(this.input);
        localStorage.setItem(
          'REGISTER_EMAIL',
          JSON.stringify(this.input.email)
        );
        this.$router.push({ path: '/admin/register/success' });
      } catch (error) {
        if (error.response?.status === 422) {
          alert('このメールアドレスは既に使用されています。');
        } else {
          alert('新規登録に失敗しました。');
        }
        console.error(error);
      } finally {
        this.isLoading = false;
      }
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

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
}

.form-top-text {
  font-family: 'Lato', sans-serif;
  font-weight: bold;
  font-size: 15px;
  letter-spacing: 0;
  color: $true_white;
  margin: 0 0 13px 0;
}

.form-top-message {
  font-family: 'Lato', sans-serif;
  font-weight: normal;
  font-size: 13px;
  color: $true_white;
  margin-bottom: 15px;
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

.input-error {
  background-color: $light_pink;
  border: 1px solid $valid_pink;
}

.error {
  font-weight: 600;
  color: $red;
}
</style>
