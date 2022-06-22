<template>
  <div>
    <div v-show="!isLoading" class="l-contents">
      <div class="input-box">
        <label class="label">ログイン情報の変更</label>
      </div>
      <ValidationObserver v-slot="{ errors, handleSubmit }">
        <form class="form-box">
          <label class="label">メールアドレス</label>
          <div class="input-box">
            <div class="heading">
              <span>{{ userData.email }}</span>
              <base-button
                class="button"
                :disabled="inputDisabled"
                @click="emailToggle = !emailToggle"
                >変更する</base-button
              >
            </div>
            <div v-if="emailToggle" class="toggle-box">
              <validation-provider
                v-slot="email"
                rules="required"
                name="メールアドレス"
                vid="email"
                slim
              >
                <input
                  v-model="input_email.email"
                  type="email"
                  class="input"
                  :class="{
                    'input-error':
                      email.errors[0] || invalidEmail(input_email.email),
                  }"
                  :disabled="inputDisabled"
                  :title="emailTitle(email.errors)"
                  placeholder="新しいメールアドレスを入力してください"
                />
              </validation-provider>
              <validation-provider
                v-slot="emailConfirmation"
                rules="required|confirmed:email"
                name="確認メールアドレス"
                slim
              >
                <input
                  v-model="input_email.email_confirmation"
                  type="email"
                  class="input"
                  :class="{
                    'input-error':
                      emailConfirmation.errors[0] ||
                      invalidEmail(input_email.email_confirmation),
                  }"
                  :disabled="inputDisabled"
                  :title="emailConfirmTitle(emailConfirmation.errors)"
                  placeholder="再度メールアドレスを入力してください"
                />
              </validation-provider>
              <base-button
                size="large"
                class="button"
                :disabled="
                  isError(errors) ||
                    invalidEmail(input_email.email) ||
                    invalidEmail(input_email.email_confirmation) ||
                    inputDisabled
                "
                @click="handleSubmit(onSubmitEmail)"
              >
                保存する
              </base-button>
            </div>
          </div>
        </form>
      </ValidationObserver>
      <ValidationObserver v-slot="{ errors, handleSubmit }">
        <form class="form-box">
          <label class="label">パスワード</label>
          <div class="input-box">
            <div class="heading">
              <span>********</span>
              <base-button
                class="button"
                :disabled="inputDisabled"
                @click="passwordToggle = !passwordToggle"
                >変更する</base-button
              >
            </div>
            <div v-if="passwordToggle" class="toggle-box">
              <div class="password-condition-label">
                パスワードは英字と数字を含めた6文字以上で入力してください。
              </div>
              <validation-provider
                v-slot="password"
                :rules="{
                  required,
                  regex: /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/,
                }"
                name="パスワード"
                vid="password"
                slim
              >
                <input
                  v-model="input_password.password"
                  type="password"
                  class="input"
                  :class="{
                    'input-error':
                      password.errors[0] || !input_password.password,
                  }"
                  :disabled="inputDisabled"
                  :title="passwordTitle(password.errors)"
                  placeholder="新しいパスワードを入力してください"
                />
              </validation-provider>
              <validation-provider
                v-slot="passwordConfirmation"
                rules="required|confirmed:password"
                name="確認用のパスワード"
                slim
              >
                <input
                  v-model="input_password.password_confirmation"
                  type="password"
                  class="input"
                  :class="{
                    'input-error':
                      passwordConfirmation.errors[0] ||
                      !input_password.password_confirmation,
                  }"
                  :disabled="inputDisabled"
                  :title="passwordConfirmTitle(passwordConfirmation.errors)"
                  placeholder="再度新しいパスワードを入力してください"
                />
              </validation-provider>
              <base-button
                size="large"
                class="button"
                :disabled="
                  isError(errors) ||
                    !input_password.password ||
                    !input_password.password_confirmation ||
                    inputDisabled
                "
                @click="handleSubmit(onSubmitPassword)"
              >
                保存する
              </base-button>
            </div>
          </div>
        </form>
      </ValidationObserver>
    </div>
    <vue-loading
      v-if="isLoading"
      type="spin"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    ></vue-loading>
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
import { VueLoading } from 'vue-loading-template';
import {
  ValidationObserver,
  ValidationProvider,
} from 'vee-validate/dist/vee-validate.full.esm';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import SuccessMessage from '@/components/Admin/Modules/Modal/SuccessMessage.vue';
import { fetchUser, updateUserEmail, updatePassword } from '@/libs/api';

export default Vue.extend({
  components: {
    VueLoading,
    ValidationObserver,
    ValidationProvider,
    SuccessMessage,
    BaseButton,
  },
  props: {
    userUuid: {
      type: String,
      required: true,
    },
    userAuthorities: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isLoading: true as boolean,
      successMessageModal: false as boolean,
      optionSettingModal: false as boolean,
      authorityModal: false as boolean,
      userData: {} as ApiResponse.fetchUser,
      input_email: {
        email: '',
        email_confirmation: '',
      },
      input_password: {
        password: '',
        password_confirmation: '',
      },
      emailToggle: false as boolean,
      passwordToggle: false as boolean,
    };
  },
  computed: {
    uuid(): string {
      return this.$route.params.id;
    },
    inputDisabled(): boolean {
      let enable = false;
      if (this.$store.getters.userProfile.is_account_holder) {
        enable = true;
      } else if (this.uuid === this.$store.getters.userProfile.uuid) {
        enable = true;
      } else if (this.userAuthorities && this.userAuthorities.length) {
        enable = this.userAuthorities.includes('admin');
      }
      return !enable;
    },
    passwordTitle(): string {
      return (errors: string[]) => {
        if (!this.input_password.password) {
          return '新しいパスワードを入力してください';
        }
        if (errors.length) {
          return 'パスワードは英字と数字を含めた6文字以上で入力してください。';
        }
        return null;
      };
    },
    passwordConfirmTitle(): string {
      return (errors: string[]) => {
        if (!this.input_password.password_confirmation) {
          return '再度新しいパスワードを入力してください';
        }
        if (errors.length) {
          return 'パスワードの確認が一致しません';
        }
        return null;
      };
    },
    emailTitle(): string {
      return (errors: string[]) => {
        if (!this.input_email.email) {
          return '新しいメールアドレスを入力してください';
        }
        if (errors.length) {
          return 'メールアドレスが正しくありません';
        }
        return null;
      };
    },
    emailConfirmTitle(): string {
      return (errors: string[]) => {
        if (!this.input_email.email_confirmation) {
          return '再度メールアドレスを入力してください';
        }
        if (errors.length) {
          return 'メールアドレスの確認が一致しません';
        }
        return null;
      };
    },
  },
  async mounted() {
    this.isLoading = true;
    this.refreshUserData();
    this.isLoading = false;
  },
  methods: {
    async onSubmitEmail() {
      try {
        await updateUserEmail(this.uuid, {
          email: this.input_email.email,
        });
        this.toggleSuccessMessageModal();
      } catch (e) {
        alert('メールの変更に失敗しました。');
      } finally {
        this.refreshUserData();
      }
    },
    async onSubmitPassword() {
      try {
        await updatePassword(this.uuid, this.input_password);
        this.toggleSuccessMessageModal();
      } catch (e) {
        alert('パスワードの変更に失敗しました。');
      } finally {
        this.refreshUserData();
      }
    },
    async refreshUserData() {
      const { data: userData } = await fetchUser(this.userUuid);
      this.userData = userData;
    },
    toggleSuccessMessageModal() {
      this.successMessageModal = !this.successMessageModal;
    },
    invalidEmail(email: string) {
      return (
        !email ||
        email !== this.input_email.email ||
        email === this.userData.email
      );
    },
    isError(errors: object) {
      return !!Object.values(errors).filter(
        (errorList: string[]) => !!errorList.length
      ).length;
    },
  },
});
</script>

<style lang="scss" scoped>
.l-contents {
  padding: 33px 30px 535px;
}

.form-item {
  margin-top: 30px;
}

.form-box {
  display: flex;
  align-items: flex-start;
  margin-top: 30px;
}

.input-box {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.heading {
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 20px;

  .button {
    margin-left: auto;
  }
}

.password-condition-label {
  width: 100%;
  font-size: 15px;
  margin-bottom: 15px;
}

.toggle-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px 30px;
  background: $white_1;
}

.error {
  margin-left: 180px;
  font-size: 0.8em;
  color: red;
}

.label {
  flex-shrink: 0;
  width: 180px;
  font-weight: bold;
  font-size: 15px;
  color: $dark_blue;
}

.input {
  width: 100%;
  height: 40px;
  background-color: $true_white;
  border: solid 1px $light_gray_blue_3;
  padding: 0 11px;
  color: $gray_blue_4;

  & + .input {
    margin-top: 20px;
  }

  & + .button {
    margin-top: 30px;
    min-width: 200px;
  }

  &::placeholder {
    color: $placeholder_gray;
  }
}

.select {
  flex: 1;
  height: 40px;
}

.textarea {
  flex: 1;
  height: 120px;
}

.option-button {
  width: 200px;
  margin-left: auto;
  margin-right: auto;
}

.input-error {
  border: solid 1px $pink;
  background-color: $light_pink;
}
</style>
