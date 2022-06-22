<template>
  <div>
    <div v-show="!isLoading" class="l-contents">
      <ValidationObserver v-slot="{ errors, handleSubmit }">
        <form
          class="form"
          enctype="multipart/form-data"
          @submit.prevent="handleSubmit(updateProfile)"
        >
          <h1 class="contents-title">{{ input.name }}さんのプロフィール</h1>
          <user-icon-form-item
            :value="input.user_icon"
            :disabled="inputDisabled"
            @onChange="changeUserIcon"
          />
          <birthday-form-item
            :years="years"
            :months="months"
            :birthday="input.birthday"
            :is-published="input.published_birthday"
            :disabled="inputDisabled"
            @onChangeBirthday="changeBirthday"
            @onChangePublishedBirthday="changePublishedBirthday"
          />
          <gender-form-item
            :value="input.gender"
            :disabled="inputDisabled"
            @onChange="changeGender"
          />
          <div class="container">
            <div class="select-box form-item language-box">
              <label class="label">
                使用言語
                <span data-v-ffabcb58="" class="required-label">※必須</span>
              </label>
              <div class="select-row">
                <base-select
                  v-model="inputLanguages.language"
                  :items="languageSelectItems"
                  class="select"
                  :disabled="inputDisabled"
                />
                <div class="sub-label">その他の言語</div>
                <base-select
                  v-for="(subLanguage, index) in inputLanguages.sub_languages"
                  :key="index"
                  v-model="inputLanguages.sub_languages[index]"
                  :items="subLanguageSelectItems(index)"
                  class="select"
                  :disabled="inputDisabled"
                />
                <add-button
                  class="button"
                  :disabled="inputDisabled"
                  @click="addLanguage"
                >
                  言語を追加する
                </add-button>
              </div>
            </div>
            <div class="note--language-box">
              ※選択した言語は、翻訳機能とプロフィールに<br />反映されます。
            </div>
          </div>
          <birthplace-form-item
            :country="input.birthplace_country"
            :prefecture="input.birthplace_prefecture"
            :city="input.birthplace_city"
            :countries="countries"
            :saved-profile-birth-country="savedProfileBirthCountry"
            :prefectures="prefectures"
            :saved-profile-birth-prefecture="savedProfileBirthPrefecture"
            :disabled="inputDisabled"
            @onChangeCountry="changeCountry"
            @onChangePrefecture="changePrefecture"
            @onChangeCity="changeCity"
          />

          <div class="input-box  form-item">
            <label class="label">携帯電話</label>
            <ValidationProvider
              v-slot="tel"
              rules="phone"
              name="携帯電話"
              vid="tel"
              class="full"
            >
              <input
                v-model="input.tel"
                type="text"
                class="input"
                :disabled="inputDisabled"
                placeholder="例）03-5547-5321"
              />
              <span class="error-message">{{ tel.errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="input-box  form-item">
            <label class="label">社用電話番号</label>
            <ValidationProvider
              v-slot="tel"
              rules="phone"
              name="社用電話番号"
              vid="company_tel"
              class="full"
            >
              <input
                v-model="input.company_tel"
                type="text"
                class="input"
                :disabled="inputDisabled"
                placeholder="例）03-5547-5321"
              />
              <span class="error-message">{{ tel.errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="input-box  form-item">
            <label class="label">内線番号</label>
            <label>
              <ValidationProvider
                v-slot="tel"
                rules="max:20"
                name="内線番号"
                vid="internal_tel"
                class="full"
              >
                <input
                  v-model="input.internal_tel"
                  type="text"
                  class="input"
                  :disabled="inputDisabled"
                  placeholder="例）012"
                />
                <span class="error-message">{{ tel.errors[0] }}</span>
              </ValidationProvider>
            </label>
          </div>

          <div class="select-box form-item">
            <label class="label">入社年</label>
            <div class="select-row">
              <div class="select-item-small">
                <base-select
                  v-model="input.joined_year"
                  :items="years"
                  class="select"
                  :disabled="inputDisabled"
                />
                <label class="sub-label-right">年</label>
              </div>
              <div class="select-item-small">
                <base-select
                  v-model="input.joined_month"
                  :items="months"
                  class="select"
                  :disabled="inputDisabled"
                />
                <label class="sub-label-right">月</label>
              </div>
            </div>
          </div>

          <sub-organization-form-item
            :value="input.sub_organizations"
            :organizations="organizations"
            :main-organization="mainOrganization"
            :disabled="inputDisabled"
            @add="addSubOrganization"
            @remove="removeSubOrganization"
          />

          <profile-free-questions-form-item
            v-if="profileFreeQuestions.length > 0"
            :answers="input.profile_free_questions"
            :questions="profileFreeQuestions"
            :disabled="inputDisabled"
            @onChange="changeProfileFreeQuestion"
          />

          <base-button
            size="large"
            class="submit-button"
            :disabled="isError(errors) || inputDisabled"
            @click="handleSubmit(updateProfile)"
          >
            保存する
          </base-button>

          <assignment-histories-form
            :uuid="uuid"
            :years="years"
            :months="months"
            :disabled="inputDisabled"
          />
        </form>
      </ValidationObserver>
      <success-message
        v-if="successMessageModal"
        @close="toggleSuccessMessageModal"
      >
        入力された情報が保存されました。
      </success-message>
    </div>
    <vue-loading
      v-if="isLoading"
      type="spin"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    ></vue-loading>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { VueLoading } from 'vue-loading-template';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import dayjs from '@/libs/dayjs';
import SuccessMessage from '@/components/Admin/Modules/Modal/SuccessMessage.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import {
  fetchOrganizations,
  fetchMemberProfile,
  updateMemberProfile,
  fetchUserProfile,
  fetchLanguages,
  fetchUser,
} from '@/libs/api';
import { enumCountries, enumPrefectures } from '@/libs/definition';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';
import AddButton from '@/components/Admin/Pages/CommunityManagement/AddButton.vue';
import UserIconFormItem from './ProfileComponents/UserIconFormItem.vue';
import BirthdayFormItem from './ProfileComponents/BirthdayFormItem.vue';
import SubOrganizationFormItem from './ProfileComponents/SubOrganizationFormItem.vue';
import GenderFormItem from './ProfileComponents/GenderFormItem.vue';
import ProfileFreeQuestionsFormItem from './ProfileComponents/ProfileFreeQuestionsFormItem.vue';
import AssignmentHistoriesForm from './ProfileComponents/AssignmentHistoriesForm.vue';
import BirthplaceFormItem from './ProfileComponents/BirthplaceFormItem.vue';

type Data = {
  organizations: ApiResponse.GroupOrganization[];
  mainOrganization: string | null;
  profileFreeQuestions: {
    uuid: string;
    content: string;
  }[];
  successMessageModal: boolean;
  input: ApiRequest.MemberProfile;
  isLoading: Boolean;
  languages: ApiResponse.Language[];
  inputLanguages: ApiResponse.fetchUser;
  savedProfileBirthCountry: string | null;
  savedProfileBirthPrefecture: string | null;
};

export default Vue.extend({
  components: {
    VueLoading,
    ValidationObserver,
    ValidationProvider,
    SuccessMessage,
    BaseButton,
    UserIconFormItem,
    BirthdayFormItem,
    SubOrganizationFormItem,
    GenderFormItem,
    ProfileFreeQuestionsFormItem,
    AssignmentHistoriesForm,
    BirthplaceFormItem,
    BaseSelect,
    AddButton,
  },
  props: {
    companyUuid: {
      type: String,
      required: true,
      default: '',
    },
    userAuthorities: {
      type: Array,
      default: () => [],
    },
  },
  data(): Data {
    return {
      isLoading: true as boolean,
      organizations: [],
      mainOrganization: null,
      profileFreeQuestions: [],
      successMessageModal: false,
      input: {
        name: '',
        user_icon: '',
        gender: '',
        birthday: '',
        published_birthday: true,
        birthplace_country: '',
        birthplace_prefecture: '',
        birthplace_city: '',
        tel: '',
        company_tel: '',
        internal_tel: '',
        joined_year: null,
        joined_month: null,
        sub_organizations: [],
        profile_free_questions: [],
        language: '',
        sub_languages: [''] as string[],
      },
      inputLanguages: {
        language: '',
        sub_languages: [''] as string[],
      } as ApiResponse.fetchUser,
      languages: [] as ApiResponse.Language[],
      savedProfileBirthCountry: '',
      savedProfileBirthPrefecture: '',
    };
  },
  computed: {
    uuid(): string {
      return this.$route.params.id;
    },
    years() {
      const nowYear = dayjs().year();
      return [...Array(100).keys()].map((i: number) => ({
        name: String(nowYear - i),
        value: nowYear - i,
      }));
    },
    months() {
      return [...Array(12).keys()].map((i: number) => ({
        name: String(i + 1),
        value: i + 1,
      }));
    },
    countries() {
      return enumCountries;
    },
    prefectures() {
      return enumPrefectures;
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
    languageSelectItems(): ApiResponse.Language[] {
      return this.languages.map((language: ApiResponse.Language) => {
        if (this.inputLanguages.sub_languages.includes(language.value)) {
          return { ...language, disabled: true };
        }
        return language;
      });
    },
    subLanguageSelectItems(): ApiResponse.Language[] {
      return (index: number) => {
        return this.languages.map((language: ApiResponse.Language) => {
          if (
            language.value === this.inputLanguages.language ||
            this.inputLanguages.sub_languages.find(
              (subLanguageCode: string, subIndex: number) =>
                subLanguageCode === language.value && subIndex !== index
            )
          ) {
            return { ...language, disabled: true };
          }
          return language;
        });
      };
    },
  },
  async created() {
    this.isLoading = true;
    await Promise.all([
      this.fetchOrganizations(),
      this.fetchMemberProfile(),
      this.fetchLanguages(),
      this.fetchUser(),
    ]);
    this.isLoading = false;
  },
  methods: {
    setInput(data: ApiResponse.MemberProfile) {
      this.input = {
        ...data,
        sub_organizations: data.sub_organizations.map(
          ({ uuid }: { uuid: string }) => uuid
        ),
        profile_free_questions: data.profile_free_questions.map(
          (item: Types.ProfileFreeQuestion) => {
            return { uuid: item.uuid, answer: item.answer };
          }
        ),
      };
      this.savedProfileBirthCountry = data.birthplace_country;
      this.savedProfileBirthPrefecture = data.birthplace_prefecture;
    },
    async fetchLanguages() {
      const { data: languages } = await fetchLanguages();
      this.languages = [...languages].map((item: ApiResponse.Language) => {
        return { ...item, value: item.code };
      });
    },
    async fetchOrganizations() {
      const { data: organizationsData } = await fetchOrganizations();
      this.organizations = organizationsData.organizations;
    },
    async fetchMemberProfile() {
      const { data } = await fetchMemberProfile(this.uuid);
      this.setInput(data);
      this.mainOrganization = data.main_organization?.uuid ?? null;
      this.profileFreeQuestions = data.profile_free_questions.map(
        (item: Types.ProfileFreeQuestion) => ({
          uuid: item.uuid,
          content: item.content,
        })
      );
    },
    async fetchUser() {
      const { data: userData } = await fetchUser(this.uuid);
      if (userData.language == null) {
        this.inputLanguages.language = '';
      } else {
        this.inputLanguages.language = userData.language;
      }
      if (!userData.sub_languages || !userData.sub_languages.length) {
        this.inputLanguages.sub_languages = [''];
      } else {
        this.inputLanguages.sub_languages = userData.sub_languages;
      }
    },
    changeUserIcon(value: string) {
      this.input.user_icon = value;
    },
    changeBirthday(value: string) {
      this.input.birthday = value;
    },
    changePublishedBirthday(value: boolean) {
      this.input.published_birthday = value;
    },
    changeGender(value: string) {
      this.input.gender = value;
    },
    changeCountry(value: string) {
      this.input.birthplace_country = value;
    },
    changePrefecture(value: string) {
      this.input.birthplace_prefecture = value;
    },
    changeCity(value: string) {
      this.input.birthplace_city = value;
    },
    addSubOrganization(uuid: string) {
      this.input.sub_organizations.push(uuid);
    },
    removeSubOrganization(removeUuid: string) {
      this.input.sub_organizations = this.input.sub_organizations.filter(
        (subOrganizationUuid: string) => subOrganizationUuid !== removeUuid
      );
    },
    changeProfileFreeQuestion({
      uuid,
      answer,
    }: {
      uuid: string;
      answer: string;
    }) {
      this.input.profile_free_questions = this.input.profile_free_questions.map(
        (item: { uuid: string; answer: string }) => {
          if (item.uuid === uuid) {
            return {
              ...item,
              answer,
            };
          }
          return item;
        }
      );
    },
    async updateProfile() {
      try {
        this.input.language = this.inputLanguages.language;
        this.input.sub_languages = this.inputLanguages.sub_languages.filter(
          (subLanguage: string) => subLanguage.length
        );
        const { data } = await updateMemberProfile(this.uuid, this.input);
        this.setInput(data);
        this.toggleSuccessMessageModal();
      } catch (e) {
        alert('プロフィールの更新に失敗しました。');
      } finally {
        if (!this.$accessor.userProfile.is_account_holder) {
          // INFO: Vuexに保持している自分の情報を更新するために再度API叩いている
          const { data: userProfile } = await fetchUserProfile();
          this.$accessor.setUserProfile(userProfile);
        }
      }
    },
    toggleSuccessMessageModal() {
      this.successMessageModal = !this.successMessageModal;
    },
    isError(errors: object) {
      const error =
        !this.input.birthday ||
        !this.input.gender ||
        (!this.input.birthplace_country && !this.input.birthplace_prefecture);
      return (
        error ||
        !!Object.values(errors).filter(
          (errorList: string[]) => !!errorList.length
        ).length
      );
    },
    addLanguage() {
      this.inputLanguages.sub_languages.push('');
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

.select /deep/ .vs__dropdown-toggle {
  border: solid 1px $light_gray_blue_3;
  background-color: $extra_light_gray;
  color: $gray_blue_4;
  height: 40px;
}

.v-select-error /deep/ .vs__dropdown-toggle {
  background-color: $light_pink;
  border-color: $pink;
}

.delete-link {
  text-align: center;
  margin: 18px auto 30px;
  cursor: pointer;
}

.select-row {
  display: flex;
  flex-direction: row;

  span {
    margin-left: 0;
  }
}

.select-item-small {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
  width: 172px;
}

.sub-label-right {
  margin-left: 6px;
}

.option-help {
  border-bottom: 1px solid #47494e;
  margin-left: 30px;
  font-size: 12px;
  cursor: pointer;
}

.submit-button {
  width: 200px;
  margin: 40px auto 63px;
}

.contents-title {
  font-size: 15px;
  line-height: 1em;
  margin-bottom: 27px;
}

.sub-label {
  font-size: 15px;
  color: $dark_blue;
  font-weight: 300;
}

.error-message {
  color: $red;
}

.language-box > .select-row {
  align-items: center;
  flex-wrap: wrap;
}

.language-box > .select-row > .select {
  color: $gray_blue_4;
  height: 40px;
  border: solid 1px $light_gray_blue_3;
  background-color: $extra_light_gray;
  border-radius: 4px;
  width: 170px;
}

.language-box > .select-row > .sub-label {
  margin-left: 30px;
  margin-right: 30px;
}

.language-box > .select-row > .button {
  margin-left: 15px;
}

.sub-languages-box {
  display: flex;
  flex-direction: column;
  color: $gray_blue_4;
  height: 40px;
  border: solid 1px $light_gray_blue_3;
  background-color: $extra_light_gray;
  border-radius: 4px;
  width: 170px;
  padding-top: 10px;
  margin-top: 3px;
}

.note {
  &--language-box {
    margin-left: 180px;
    margin-bottom: 41px;
    margin-top: -16px;
    font-size: 13px;
  }
}
</style>
