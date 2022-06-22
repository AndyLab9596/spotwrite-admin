<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="Spotwrite 運営会社へお問い合わせ。" />
      <div v-if="!contactComplete" class="l-contents">
        <ValidationObserver v-slot="{ errors, handleSubmit }">
          <form
            class="form"
            enctype="multipart/form-data"
            @submit.prevent="handleSubmit(updateProfile)"
          >
            <div class="form-item radio-button-list">
              <BaseRadioButtons
                id="contactTypeGlobal"
                value="normal"
                class="contact-type-global"
                label="一般的な問い合わせ"
                name="contact_type"
                :checked="is_contact_normal"
                @change="select"
              ></BaseRadioButtons>
              <BaseRadioButtons
                v-show="is_account_holder"
                id="contactTypePlan"
                value="plan"
                class="contact-type-plan"
                label="大企業サポートプランお問い合わせ"
                name="contact_type"
                :checked="is_contact_plan"
                @change="select"
              ></BaseRadioButtons>
            </div>
            <div class="input-box  form-item">
              <label class="label">会社名</label>
              <div>{{ companyName }}</div>
            </div>
            <div v-if="!is_account_holder" class="input-box  form-item">
              <label class="label">氏名</label>
              <div>{{ userName }}</div>
            </div>
            <div class="input-box  form-item">
              <label v-if="!is_account_holder" class="label">
                メールアドレス
              </label>
              <label v-else class="label">アカウントホルダー</label>
              <div>{{ userEmail }}</div>
            </div>
            <div v-if="is_account_holder" class="input-box  form-item">
              <label class="label">
                担当者名
                <span class="required-tag-account-name">※必須</span>
              </label>
              <ValidationProvider
                v-slot="accountName"
                rules="required"
                name="担当者名"
                class="full"
              >
                <input
                  v-model="input.curator"
                  type="text"
                  class="input"
                  :class="{ 'validate-error': accountName.errors[0] }"
                  placeholder="例）山田太郎"
                />
              </ValidationProvider>
            </div>
            <div class="input-box  form-item content-box">
              <label class="label">
                本文
                <span class="required-tag-content">※必須</span>
              </label>
              <ValidationProvider
                v-slot="content"
                rules="required"
                name="本文"
                vid="tel"
                class="full"
              >
                <textarea
                  v-model="input.content"
                  class="textarea"
                  :class="{ 'validate-error': content.errors[0] }"
                  placeholder="本文をご入力ください"
                ></textarea>
              </ValidationProvider>
            </div>
            <div v-if="contactType === 'plan'" class="input-box  form-item">
              <label class="label">
                利用容量の追加
              </label>
              <base-checkbox
                class="extend-storage-required"
                label="検討している"
                @change="selectExtendStorage"
              />
            </div>
            <base-button
              size="large"
              class="submit-button"
              :disabled="isError(errors)"
              @click="handleSubmit(sendMail)"
            >
              お問い合わせする
            </base-button>
          </form>
        </ValidationObserver>
      </div>
      <div v-if="contactComplete" class="l-contents contact-complete">
        <span
          >お問い合わせありがとうございます。<br />
          担当者より折り返しご連絡させていただきます。<br />
          今しばらくお待ちください。</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BaseRadioButtons from '@/components/Admin/Modules/Button/BaseRadioButtons.vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import {
  fetchMyOwner,
  fetchUser,
  fetchAccountHolderProfile,
  sendMasterContactEmail,
} from '@/libs/api';

type Owner = ApiResponse.Owner;

export default Vue.extend({
  layout: 'admin/default',
  components: {
    ValidationObserver,
    ValidationProvider,
    PageHeader,
    BaseButton,
    BaseRadioButtons,
    BaseCheckbox,
  },
  data() {
    return {
      input: {
        company_name: '',
        curator: '',
        email: '',
        content: '',
        type: '',
        is_account_holder: false,
        extend_storage: false,
      },
      owner: {
        name: '',
        representative_name: '',
        postal_code: '',
        address1: '',
        address2: '',
        tel: '',
        size: '',
      } as Owner,
      contactType: 'normal' as string,
      contactComplete: false as boolean,
      loginUser: {} as ApiResponse.fetchUser,
    };
  },
  computed: {
    is_account_holder(): boolean {
      return this.$store.getters.userProfile.is_account_holder;
    },
    is_contact_plan(): boolean {
      return this.contactType === 'plan';
    },
    is_contact_normal(): boolean {
      return this.contactType === 'normal';
    },
    userEmail(): string {
      if (this.$store.getters.userProfile.is_account_holder) {
        return this.$store.getters.userProfile.email;
      }
      return this.loginUser.email;
    },
    userName(): string {
      if (this.$store.getters.userProfile.is_account_holder) {
        return this.$store.getters.userProfile.name;
      }
      return this.loginUser.name;
    },
    companyName(): string {
      return this.owner.name;
    },
  },
  created() {
    this.fetchOwner();
    if (
      !this.$accessor.userProfile.is_account_holder ||
      !this.$store.getters.userProfile.email
    ) {
      this.fetchLoginUser();
    } else {
      this.fetchMe();
    }
    if ('type' in this.$route.query && this.$route.query.type === 'plan') {
      this.contactType = 'plan';
    }
  },
  mounted() {
    this.input.curator = this.userName;
    this.input.email = this.userEmail;
  },
  methods: {
    select(value: string) {
      this.contactType = value;
    },
    async fetchOwner() {
      const { data } = await fetchMyOwner();
      this.owner = data;
      this.input.company_name = this.owner.name;
    },
    async fetchLoginUser() {
      const { data: userData } = await fetchUser(
        this.$store.getters.userProfile.uuid
      );
      this.loginUser = userData;
      this.input.curator = this.userName;
      this.input.email = this.userEmail;
    },
    async fetchMe() {
      const { data } = await fetchAccountHolderProfile();
      this.$accessor.setUserProfile(data);
      this.input.curator = this.userName;
      this.input.email = this.userEmail;
    },
    selectExtendStorage() {
      this.input.extend_storage = !this.input.extend_storage;
    },
    async sendMail() {
      try {
        this.input.type = this.contactType;
        this.input.is_account_holder = this.is_account_holder;
        await sendMasterContactEmail(this.input);
      } catch (e) {
        alert('システムエラー');
      } finally {
        this.contactComplete = true;
      }
    },
    isError(errors: object) {
      const error = !this.input.content;
      return (
        error ||
        !!Object.values(errors).filter(
          (errorList: string[]) => !!errorList.length
        ).length
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.l-contents {
  padding: 33px 100px 30px 30px;
}

.form {
  display: flex;
  flex-direction: column;
  color: $dark_blue;
  font-size: 15px;
}

.form-item {
  margin-bottom: 30px;
}

.input-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.error {
  margin-left: 180px;
  font-size: 0.8em;
  color: red;
}

.select-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.label {
  flex-shrink: 0;
  width: 180px;
  font-weight: bold;
}

.select {
  flex: 1;
  font-size: 13px;
  font-weight: 300;
}

.input {
  flex: 1;
  font-size: 13px;
  font-weight: 300;
  border-radius: 4px;
  background-color: $extra_light_gray;
  color: $gray_blue_4;
  height: 40px;
  width: 650px;
  border: solid 1px $light_gray_blue_3;
  padding: 0 11px;
}

.submit-button {
  width: 200px;
  margin: 40px auto 63px;
}

.radio-button-list {
  margin-left: 180px;
}

.textarea {
  flex: 1;
  border-radius: 4px;
  width: 650px;
  height: 120px;
  border: solid 1px $light_gray_blue_3;
  padding: 13px 11px;

  &::placeholder {
    color: $placeholder_gray;
  }
}

.required-tag-content {
  margin-left: 45px;
  color: #9c9da5 !important;
  font-size: 13px;
  font-weight: normal !important;
}

.required-tag-account-name {
  margin-left: 12px;
  color: #9c9da5 !important;
  font-size: 13px;
  font-weight: normal !important;
}

.contact-type-plan {
  margin-left: 20px;
}

.content-box {
  align-items: flex-start !important;
}

.error-message {
  color: $red;
}

.validate-error {
  border-color: #ffb4b4;
  border-style: solid;
  border-width: 1;
  background-color: #faf0f0;
}

.contact-complete {
  text-align: center;
  min-height: 530px;
  padding: auto;

  span {
    margin: auto;
  }
}
</style>
