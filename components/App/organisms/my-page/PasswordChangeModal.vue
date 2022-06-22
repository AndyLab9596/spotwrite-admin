<template>
  <transition name="modal" appear>
    <div class="modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <div class="icon-cross-wrapper" @click="onClose">
            <img src="/app/icon/cross.svg" class="icon-cross" />
          </div>
          <div class="modal-header-container">
            <div class="modal-header-icon">
              <img src="/app/image/password_rock.svg" />
            </div>
            <div class="modal-header-description">
              新しいパスワードを入力してください
            </div>
          </div>
        </div>
        <div class="modal-contents">
          <div class="password-condition-label">
            パスワードは英字と数字を含めた6文字以上で入力してください。
          </div>
          <ValidationObserver v-slot="{ errors }">
            <div class="form-contents">
              <validation-provider
                v-slot="password"
                :rules="{
                  required: true,
                  regex: /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/,
                }"
                vid="confirmation"
                class="input-box"
                name="パスワードを入力してください"
              >
                <outlined-text-field
                  v-model="input.password"
                  class="form-input"
                  type="password"
                  :rules="{
                    required: true,
                    regex: /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/,
                  }"
                  :title="passwordTitle(password.errors)"
                  placeholder="パスワードを入力してください"
                  input-name="password"
                />
              </validation-provider>
              <validation-provider
                v-slot="password_confirmation"
                rules="required|confirmed:confirmation"
                class="input-box"
              >
                <outlined-text-field
                  v-model="input.password_confirmation"
                  class="form-input"
                  type="password"
                  rules="required|confirmed:confirmation"
                  :title="passwordConfirmTitle(password_confirmation.errors)"
                  placeholder="パスワードをもう一度入力してください"
                  input-name="password_confirmation"
                />
              </validation-provider>
            </div>
            <div class="button-wrapper">
              <base-button
                class="save-button"
                :disabled="
                  isError(errors) ||
                    !input.password ||
                    !input.password_confirmation
                "
                @click="onPasswordSave"
              >
                パスワードを更新
              </base-button>
              <base-button class="close-button" @click="onClose">
                キャンセル
              </base-button>
            </div>
          </ValidationObserver>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import OutlinedTextField from '@/components/App/atoms/textFields/OutlinedTextField.vue';
import {
  ValidationObserver,
  ValidationProvider,
} from 'vee-validate/dist/vee-validate.full.esm';
import BaseButton from '~/components/App/atoms/buttons/BaseButton.vue';

export default Vue.extend({
  components: {
    OutlinedTextField,
    BaseButton,
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    userInfo: {
      type: Object as PropType<ApiResponse.User>,
      required: true,
    },
    closeButton: {
      type: String,
      required: false,
      default: 'キャンセル',
    },
    saveButton: {
      type: String,
      required: false,
      default: 'パスワードを更新',
    },
  },
  data() {
    return {
      input: {} as ApiRequest.UpdatePassword,
      jobTypes: [] as ApiResponse.Job[],
      organizations: [] as ApiResponse.Organization[],
      profileQa: {} as ApiResponse.ProfileQuestionAndAnswers,
      isLoading: false as boolean,
      error: false as boolean,
    };
  },
  computed: {
    passwordTitle(): string {
      return (errors: string[]) => {
        if (!this.input.password) {
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
        if (!this.input.password_confirmation) {
          return '再度新しいパスワードを入力してください';
        }
        if (errors.length) {
          return 'パスワードの確認が一致しません';
        }
        return null;
      };
    },
    isError(): boolean {
      return (errors: object) => {
        return !!Object.values(errors).filter(
          (errorList: string[]) => !!errorList.length
        ).length;
      };
    },
  },
  methods: {
    onClose() {
      this.$emit('onClose');
    },
    onPasswordSave() {
      this.$emit('onPasswordSave', this.input);
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  width: 460px;
  min-height: 50%;
  background: $true_white;
  border-radius: 4px;
  position: relative;
  padding: 20px;
}

.modal-header {
  height: 35%;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.modal-header-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 4px 4px 0 0;
  justify-content: center;
  align-items: center;
}

.modal-header-icon {
  height: 50px;
  margin-bottom: 30px;
}

.modal-header-description {
  font-size: 15px;
  color: #2e303e;
  height: 50px;
  font-weight: bold;
}

.modal-contents {
  height: 65%;
  width: 100%;
  margin: 0 auto;
}

.password-condition-label {
  text-align: center;
  font-size: 13px;
  margin-bottom: 15px;
}

// オーバーレイのトランジション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  // オーバーレイに包含されているモーダルウィンドウのトランジション
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

// ディレイを付けるとモーダルウィンドウが消えた後にオーバーレイが消える
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.modal-enter {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.icon-cross-wrapper {
  position: absolute;
  top: 15px;
  right: 25px;
}

.icon-cross {
  cursor: pointer;
  width: 25px;
}

.button-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.close-button {
  font-size: 15px;
  width: 100%;
  background-color: white;
  color: #9c9da5;
  height: 44px;
}

.save-button {
  font-size: 15px;
  width: 100%;
  background-color: $button_background_color;
  color: #6a6d83;
  height: 44px;
  margin-bottom: 10px;
}

.input-error {
  background-color: #faf0f0;
  border: 1px solid #ffb4b4;
}

.input-box {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-input {
  height: 55px;
  margin-bottom: 10px;
}

.outline-input {
  margin: 0 10px 0 0;
}
</style>
