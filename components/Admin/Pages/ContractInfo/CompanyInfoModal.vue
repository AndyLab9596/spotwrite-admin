<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <ValidationObserver v-slot="{ invalid, passes }">
        <div class="modal-window">
          <div class="modal-header">
            <p class="title">会社情報</p>
            <img
              src="/icon/icon_cross.png"
              class="icon-cross"
              @click="onClose"
            />
          </div>
          <div class="input-form">
            <ValidationProvider
              v-slot="{ errors }"
              name="会社名"
              rules="required|max:20"
            >
              <div class="input-row">
                <p class="label">会社名 <span class="required">※必須</span></p>
                <div class="content">
                  <BaseInputText
                    v-model="owner.name"
                    :class="{ 'input-error': errors[0] }"
                  />
                  <div class="error-text">{{ errors[0] }}</div>
                </div>
              </div>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              name="代表者名"
              rules="required|max:30"
            >
              <div class="input-row">
                <p class="label">
                  代表者名 <span class="required">※必須</span>
                </p>
                <div class="content half">
                  <BaseInputText
                    v-model="owner.representative_name"
                    :class="{ 'input-error': errors[0] }"
                  />
                  <div class="error-text">{{ errors[0] }}</div>
                </div>
              </div>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              name="郵便番号"
              rules="required|postalCode"
            >
              <div class="input-row">
                <p class="label">住所 <span class="required">※必須</span></p>
                <div class="content half">
                  <BaseInputText
                    v-model="owner.postal_code"
                    :class="{ 'input-error': errors[0] }"
                  />
                  <div class="error-text">{{ errors[0] }}</div>
                </div>
              </div>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              name="都道府県市区町村"
              rules="required|max:200"
            >
              <div class="input-row">
                <p class="label"></p>
                <div class="content">
                  <BaseInputText
                    v-model="owner.address1"
                    :class="{ 'input-error': errors[0] }"
                  />
                  <div class="error-text">{{ errors[0] }}</div>
                </div>
              </div>
            </ValidationProvider>
            <div class="input-row">
              <p class="label"></p>
              <div class="content">
                <BaseInputText v-model="owner.address2" />
              </div>
            </div>
            <ValidationProvider
              v-slot="{ errors }"
              name="電話番号"
              rules="required|phone"
            >
              <div class="input-row">
                <p class="label">
                  電話番号 <span class="required">※必須</span>
                </p>
                <div class="content">
                  <BaseInputText
                    v-model="owner.tel"
                    :class="{ 'input-error': errors[0] }"
                  />
                  <div class="error-text">{{ errors[0] }}</div>
                </div>
              </div>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors }"
              name="会社規模"
              rules="required|numeric|max:9"
            >
              <div class="input-row">
                <p class="label">
                  会社規模 <span class="required">※必須</span>
                </p>
                <div class="content half">
                  <div class="flex align-items-center">
                    <BaseInputText
                      v-model="owner.size"
                      :class="{ 'input-error': errors[0] }"
                    />
                    <span class="unit-label">人</span>
                  </div>
                  <div class="error-text">{{ errors[0] }}</div>
                </div>
              </div>
            </ValidationProvider>
            <div class="input-row">
              <p class="label">会社ロゴ登録</p>
              <div class="file-upload-box">
                <div class="logo">
                  <img v-if="logo" :src="logo.url" />
                </div>
                <div class="file-upload-box-inner">
                  <div class="file-upload-input">
                    <input
                      ref="logoInput"
                      type="file"
                      class="hidden"
                      accept="image/*"
                      @change="selectedFile"
                    />
                    <div class="content">
                      <BaseInputText type="text" :value="filename" />
                    </div>
                    <base-button
                      class="file-select-button"
                      size="large"
                      @click="() => $refs.logoInput.click()"
                      >ファイルを選択</base-button
                    >
                  </div>
                  <base-button
                    class="file-upload-button"
                    size="large"
                    :disabled="saving"
                    @click="onUploadButtonClick"
                  >
                    アップロード
                  </base-button>
                </div>
              </div>
            </div>
          </div>
          <div class="button-box">
            <base-button
              size="large"
              :disabled="saving || invalid"
              @click="passes(onSave)"
            >
              変更する
            </base-button>
            <base-button size="large" :disabled="saving" @click="onClose">
              キャンセル
            </base-button>
          </div>
        </div>
      </ValidationObserver>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BaseInputText from '@/components/Admin/Modules/Input/BaseInputText.vue';
import { updateMyOwner, uploadOwnerFile } from '@/libs/api';

type OwnerLogo = ApiResponse.OwnerFile;

export default Vue.extend({
  components: {
    ValidationObserver,
    ValidationProvider,
    BaseButton,
    BaseInputText,
  },
  props: {
    owner: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    file: null as File | null,
    logo: null as OwnerLogo | null, // 置き換わる可能性があるのでこれだけ別に保持する
    saving: false as boolean,
  }),
  computed: {
    filename(): string {
      return this.file ? this.file.name : '';
    },
  },
  created() {
    this.logo = this.owner.logo ? { ...this.owner.logo } : null;
  },
  methods: {
    selectedFile(e: Event) {
      e.preventDefault();
      if (!(e.target instanceof HTMLInputElement)) {
        return;
      }
      const { files } = e.target;
      if (files == null || files.length === 0) {
        return;
      }
      // eslint-disable-next-line prefer-destructuring
      this.file = files[0];
    },
    async onUploadButtonClick(): Promise<void> {
      if (!this.file) {
        return;
      }
      this.saving = true;
      const formData = new FormData();
      formData.append('image', this.file);
      try {
        const { data } = await uploadOwnerFile(formData);
        this.logo = { ...data };
      } catch (e) {
        alert('ファイルアップロードに失敗しました。');
      } finally {
        this.saving = false;
      }
    },
    onClose() {
      this.$emit('close');
    },
    async onSave() {
      try {
        this.saving = true;
        const { data } = await updateMyOwner({
          ...this.owner,
          logo_file_uuid: this.logo ? this.logo.uuid : null,
        });
        this.$emit('save', data);
      } catch (e) {
        console.error(e);
      } finally {
        this.saving = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

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
}

.modal-window {
  display: flex;
  flex-direction: column;
  background: $true_white;
  border-radius: 6px;
  padding: 30px 27px;
  box-shadow: 0 0 3px 0 $light_gray;
  width: 900px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.required {
  font-size: 13px;
  color: $gray_blue_1;
}

.icon-cross {
  cursor: pointer;
}

.text-red {
  color: red;
}

.button-box {
  display: flex;
  justify-content: center;

  button {
    width: 200px;

    &:nth-child(1) {
      margin-right: 20px;
    }
  }
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

.input-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 32px;
  margin-top: 19px;

  .label {
    width: 180px;
    font-weight: 600;
    font-size: 15px;

    &_long {
      width: 100%;
    }
  }

  .unit-label {
    font-size: 13px;
    margin-left: 10px;
  }

  .content {
    flex-grow: 1;
  }

  .content.half {
    flex-grow: 0;
    width: 40%;
  }
}

.logo {
  width: 160px;
  height: 160px;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;

  img {
    max-width: 100%;
    max-height: 100%;
  }
}

.hidden {
  display: none;
}

.file-upload-box {
  display: flex;
  flex-grow: 1;
}

.file-upload-box-inner {
  flex-direction: column;
  flex-grow: 1;
  margin-left: 20px;
}

.file-upload-input {
  display: flex;
}

.file-select-button {
  margin-left: 20px;
}

.file-upload-button {
  margin-top: 10px;
}

.input-form {
  height: 510px;
  overflow-y: scroll;
}
</style>
