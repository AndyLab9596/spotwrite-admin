<template>
  <div class="container">
    <SingleColumn class="template">
      <div>
        <img class="logo" src="/image/logo_white@2x.png" />
      </div>
      <h2>パスワード再発行</h2>
      <ValidationObserver
        v-slot="{ handleSubmit, invalid }"
        tag="div"
        class="full"
      >
        <ValidationProvider
          v-slot="password"
          :rules="{
            required: true,
            regex: /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/,
          }"
          name="パスワード"
          vid="password"
          class="full"
        >
          <div class="input-box full">
            <label class="label">パスワード再入力</label>
            <input
              v-model="input.password"
              type="password"
              class="input full"
              :class="{ 'input-error': password.errors[0] }"
              placeholder="新しいパスワードを入力してください。"
            />
            <div>
              ※パスワードは英字と数字を含めた6文字以上で入力してください。
            </div>
            <span v-if="passwordErrorMessage(password.errors)" class="error">{{
              passwordErrorMessage(password.errors)
            }}</span>
          </div>
        </ValidationProvider>
        <ValidationProvider
          v-slot="passwordConfirmation"
          rules="required|confirmed:password"
          name="確認用のパスワード"
        >
          <div class="input-box full">
            <label class="label">パスワード再入力</label>
            <input
              v-model="input.password_confirmation"
              type="password"
              class="input full"
              :class="{ 'input-error': passwordConfirmation.errors[0] }"
              placeholder="パスワードを再度入力してください。"
            />
            <span
              v-if="confirmationErrorMessage(passwordConfirmation.errors)"
              class="error"
            >
              {{ confirmationErrorMessage(passwordConfirmation.errors) }}
            </span>
          </div>
        </ValidationProvider>
        <button
          class="button full"
          :disabled="isLoading || invalid"
          @click="handleSubmit(onSaveButtonClick)"
        >
          再設定
        </button>
      </ValidationObserver>
      <template v-slot:bottom>
        <div>
          <nuxt-link to="/admin/login" class="link">
            ログインはこちら
            <img
              class="arrow-right"
              src="/icon/icon_arrow_right_white@2x.png"
            />
          </nuxt-link>
        </div>
      </template>
    </SingleColumn>
    <success-message v-if="successMessageModal" @close="onSuccessMessageClose">
      パスワードが保存されました。
    </success-message>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  ValidationObserver,
  ValidationProvider,
} from 'vee-validate/dist/vee-validate.full.esm';
import SingleColumn from '@/components/Admin/Templates/SingleColumn.vue';
import SuccessMessage from '@/components/Admin/Modules/Modal/SuccessMessage.vue';
import { resetPasswordEmployee } from '@/libs/api';

export default Vue.extend({
  layout: 'clean',
  components: {
    SingleColumn,
    ValidationObserver,
    ValidationProvider,
    SuccessMessage,
  },
  data: () => ({
    input: {
      password: '' as string,
      password_confirmation: '' as string,
    },
    isLoading: false as boolean,
    successMessageModal: false as boolean,
  }),
  computed: {
    token(): string {
      return 'token' in this.$route.query
        ? (this.$route.query.token as string)
        : '';
    },
    email(): string {
      return 'email' in this.$route.query
        ? (this.$route.query.email as string)
        : '';
    },
    passwordErrorMessage(): string {
      return (errors: string[]) => {
        if (errors.length && !this.input.password) {
          return '新しいパスワードを入力してください';
        }
        if (errors.length) {
          return 'パスワードは英字と数字を含めた6文字以上で入力してください。';
        }
        return null;
      };
    },
    confirmationErrorMessage(): string {
      return (errors: string[]) => {
        if (errors.length && !this.input.password_confirmation) {
          return '再度新しいパスワードを入力してください';
        }
        if (errors.length) {
          return 'パスワードの確認が一致しません';
        }
        return null;
      };
    },
  },
  methods: {
    async onSaveButtonClick(): Promise<void> {
      try {
        this.isLoading = true;
        await resetPasswordEmployee({
          ...this.input,
          email: this.email,
          token: this.token,
        });
        this.successMessageModal = true;
      } catch (e) {
        alert(
          'パスワードの更新に失敗しました。もう一度最初からやり直してください。'
        );
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
    onSuccessMessageClose(): void {
      this.successMessageModal = !this.successMessageModal;
      this.$router.push('/admin/login');
    },
  },
});
</script>

<style lang="scss" scoped>
.template {
  color: $true_white;
}

.logo {
  padding-left: 32px;
}

h2 {
  font-size: 15px;
  margin: 8px 0;
}

.full {
  width: 100%;

  > * {
    width: 100%;
  }
}

.label {
  font-weight: 300;
  font-size: 13px;
  letter-spacing: 0;
  color: $true-white;
  margin: 0 0 6px 0;
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

.input-error {
  background-color: $light_pink;
  border: 1px solid $valid_pink;
}

.error {
  color: #e52525;
}

.button {
  height: 44px;
  text-align: center;
  border: none;
  background-color: $gray_blue_3;
  font-size: 15px;
  font-weight: 600;
  color: $true_white;
  border-radius: 4px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.link {
  color: $true_white;
  display: flex;
  align-items: center;

  img {
    margin-left: 15px;
  }
}
</style>
