<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-container">
          <div class="modal-title">お知らせ投稿</div>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
          <div class="form-group">
            <vue-loading
              v-if="isLoading"
              type="spin"
              color="#333"
              :size="{ width: '50px', height: '50px' }"
            />
            <validation-observer v-else v-slot="{ errors, invalid, passes }">
              <div class="radio-group">
                <label>種別</label>
                <label
                  for="type-notice"
                  :class="{ checked: newNotice.type == 'notice' }"
                >
                  <input
                    id="type-notice"
                    v-model="newNotice.type"
                    type="radio"
                    name="type"
                    value="notice"
                  />
                  お知らせ
                </label>
                <label
                  for="type-update"
                  :class="{ checked: newNotice.type == 'update' }"
                >
                  <input
                    id="type-update"
                    v-model="newNotice.type"
                    type="radio"
                    name="type"
                    value="update"
                  />
                  アップデート
                </label>
                <button @click="saveDraft()">
                  下書き保存する
                </button>
              </div>
              <div class="input-group">
                <label for="title">
                  タイトル
                </label>
                <validation-provider
                  v-slot="title"
                  rules="required"
                  name="タイトル"
                >
                  <input
                    id="title"
                    v-model="newNotice.title"
                    class="input"
                    :class="{ 'input-error-back': title.errors[0] }"
                    type="text"
                    placeholder="タイトルを入力してください"
                  />
                </validation-provider>
              </div>
              <div class="input-group">
                <label for="message">
                  説明文
                </label>
                <validation-provider
                  v-slot="message"
                  rules="required"
                  name="説明文"
                >
                  <textarea
                    id="message"
                    v-model="newNotice.message"
                    class="input"
                    :class="{ 'input-error-back': message.errors[0] }"
                    type="text"
                    rows="18"
                    placeholder="お知らせの内容を入力してください"
                  />
                </validation-provider>
              </div>
              <div class="summary-error">
                <div v-for="error in errors" :key="error[0]">
                  <div v-for="e in error" :key="e">{{ e }}</div>
                </div>
              </div>
              <div class="button-container">
                <base-button
                  size="large"
                  class="add-button"
                  :disabled="invalid"
                  @click="passes(onSubmit)"
                >
                  投稿する
                </base-button>
                <base-button
                  size="large"
                  class="cancel-button"
                  @click="onClose"
                >
                  キャンセル
                </base-button>
              </div>
            </validation-observer>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import { VueLoading } from 'vue-loading-template';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { BaseButton } from '@/components/Admin/Modules/Button';

type NewNotice = ApiRequest.Notice;

export default Vue.extend({
  components: {
    ValidationObserver,
    ValidationProvider,
    BaseButton,
    VueLoading,
  },
  data() {
    return {
      newNotice: {
        type: 'notice',
        is_draft: 0,
      } as NewNotice,
      isLoading: false,
    };
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onSubmit() {
      this.isLoading = true;
      this.newNotice.is_draft = 0;
      this.$emit('submit', { ...this.newNotice });
    },
    saveDraft() {
      this.isLoading = true;
      this.newNotice.is_draft = 1;
      this.$emit('submit', { ...this.newNotice });
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
  background: rgba(126, 129, 149, 0.8);
}

.modal-window {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 800px;
  background: $true_white;
  color: #2e303e;
  border-radius: 6px;
  padding: 15px 70px 20px 30px;

  .modal-title {
    font-size: 16px;
    line-height: 16px;
    margin-bottom: 15px;
  }

  .icon-cross {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }

  .form-group {
    min-height: 551px;

    .input-group {
      label {
        display: block;
        width: max-content;
        line-height: 16px;
        margin-bottom: 10px;

        &[for='message'] {
          margin-top: 30px;
        }
      }

      .input {
        width: 100%;
        background: #fafbff;
        border: solid 1px #e4e5ed;
        border-radius: 4px;
        resize: none;

        &#title {
          height: 40px;
          padding: 10px;
        }

        &#message {
          padding: 14px 10px;
        }
      }
    }

    .button-container {
      display: flex;
      justify-content: center;
      margin-top: 40px;

      button {
        width: 200px;
        height: 40px;
        border: none;
        border-radius: 4px;

        &.add-button {
          margin-right: 20px;
        }

        &.cancel-button {
          background: #fff;
          border: solid 1px #e4e5ed;
          color: #6a6d83;
        }
      }
    }

    .radio-group {
      display: flex;
      align-items: center;
      margin-bottom: 30px;

      label {
        line-height: 16px;

        &:first-child {
          margin-right: 140px;
        }

        &[for] {
          position: relative;
          padding-left: calc(16px + 15px);
          cursor: pointer;

          input {
            display: none;
          }

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: solid 1px #e4e5ed;
          }

          &.checked {
            &::after {
              content: '';
              position: absolute;
              top: 4px;
              left: 4px;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #f09c9c;
            }
          }

          &[for='type-update'] {
            margin-left: 50px;
            margin-right: auto;
          }
        }
      }

      button {
        border: none;
        background: #7e8195;
        color: #fff;
        width: 160px;
        height: 40px;
        border-radius: 4px;
      }
    }
  }
}

.summary-error {
  position: absolute;
  font-size: 12px;
  color: red;
}

.input-error-back {
  background-color: $light_pink !important;
}

.modal-contents {
  display: flex;
  flex-direction: column;
  padding-top: 18px;
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
</style>
