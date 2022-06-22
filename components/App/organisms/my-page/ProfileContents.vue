<template>
  <div>
    <div class="profile-edit-contents">
      <div class="user-info-body-container">
        <answer-rate
          v-if="responseRate < 100"
          label="プロフィール回答率"
          :value="responseRate"
          :total-count="setTotalCount"
          class="answer-rate"
        />
      </div>
      <div class="form-contents">
        <profile-birthday
          :birth-day="input.birthday"
          :years="years"
          :months="months"
          :published-birthday="input.published_birthday"
          @onChangePublishedBirthday="onChangePublishedBirthday"
          @onChangeBirthDay="onChangeBirthDay"
        />
        <p class="form-label">性別</p>
        <normal-select-box
          v-model="input.gender"
          name="select-box"
          large-font
          :items="genderTypes"
          :display-pull-down="true"
          class="select-box"
        />
        <profile-language
          :languages="languages"
          :main-language="input.main_language"
          :sub-languages="input.sub_languages"
          @onChangeLanguage="onChangeLanguage"
          @clickLanguage="clickLanguage"
          @deleteLanguage="deleteSubLanguage"
        />
        <p class="form-label">出身地</p>
        <div>
          <radio-button
            id="japan"
            name="radio-button"
            value="japan"
            label="日本"
            :checked="isJapan"
            black
            class="radio"
            @change="whichCountry"
          />
          <radio-button
            id="other"
            name="radio-button"
            value="other"
            label="日本以外"
            :checked="!isJapan"
            black
            class="radio"
            @change="whichCountry"
          />
        </div>
        <div class="birth-place-wrapper">
          <template v-if="isJapan">
            <normal-select-box
              v-model="input.birthplace_prefecture"
              name="select-box"
              large-font
              :items="prefectures"
              :display-pull-down="true"
              placeholder="選択してください。"
              class="select-box"
            />
          </template>
          <template v-else>
            <normal-select-box
              v-model="input.birthplace_country"
              name="select-box"
              large-font
              :items="countries"
              :display-pull-down="true"
              placeholder="選択してください。"
              class="select-box"
            />
          </template>
          <outlined-text-field
            v-model="input.birthplace_city"
            input-name="birthplace_city"
            class="form-input"
            type="text"
          />
        </div>
        <p class="form-label">携帯電話</p>
        <outlined-text-field
          v-model="input.tel"
          rules="phone"
          input-name="tel"
          class="form-input"
          type="text"
          placeholder="（例）03-5547-5321"
          @input="checkPhoneFormat"
        />
        <p class="form-label">社用電話番号</p>
        <outlined-text-field
          v-model="input.company_tel"
          rules="phone"
          input-name="company_tel"
          class="form-input"
          type="text"
          placeholder="（例）03-5547-5321"
          @input="checkPhoneFormat"
        />
        <p class="form-label">内線番号</p>
        <outlined-text-field
          v-model="input.internal_tel"
          rules="numeric"
          input-name="internal_tel"
          class="form-input"
          type="text"
          placeholder="（例）03-5547-5321"
          @input="checkNumericFormat"
        />
        <p class="form-label">入社年</p>
        <div class="join-wrapper">
          <normal-select-box
            v-model="input.joined_year"
            name="joined-year"
            large-font
            :items="years"
            :display-pull-down="true"
            class="select-box"
          />
          <p class="join-text">年</p>
          <normal-select-box
            v-model="input.joined_month"
            name="joined-month"
            large-font
            :items="months"
            :display-pull-down="true"
            class="select-box"
          />
          <p class="join-text">月</p>
        </div>
        <profile-sub-organization
          :organizations="organizations"
          :main-organization="input.main_organization"
          :selected-division-uuids="selectedDivisionUuids"
          class="profile-sub-organization"
          @clickDivision="clickDivision"
          @deleteDivision="deleteDivision"
        />
        <template v-for="item in input.profile_free_questions">
          <p :key="item.uuid" class="form-label">{{ item.content }}</p>
          <textarea
            :key="item.answer.uuid"
            v-model="item.answer.content"
            class="form-textarea"
          ></textarea>
        </template>
      </div>
      <p class="continued-text" @click="clickContinued">
        続けてQ&Aを回答する
        <img
          src="/app/icon/Icon-arrow-right-pink.svg"
          class="icon-arrow-right"
          alt=""
        />
      </p>
      <div class="button-wrapper">
        <base-button class="close-button" @click="onClose">
          キャンセル
        </base-button>
        <base-button
          :disabled="!isPhoneFormat || !isNumericFormat"
          class="save-button"
          @click="onSave"
        >
          完了
        </base-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from '@/libs/dayjs';
import {
  enumCountries,
  enumPrefectures,
  enumGenderTypes,
} from '@/libs/definition';
import BaseButton from '../../atoms/buttons/BaseButton.vue';
import AnswerRate from '../../molecules/answerRate/index.vue';
import NormalSelectBox from '../../atoms/selectBox/NormalSelectBox.vue';
import OutlinedTextField from '../../atoms/textFields/OutlinedTextField.vue';
import ProfileBirthday from './forms/ProfileBirthday.vue';
import ProfileSubOrganization from './forms/ProfileSubOrganization.vue';
import ProfileLanguage from './forms/ProfileLanguage.vue';
import RadioButton from '../../atoms/buttons/RaadioButton.vue';

export default Vue.extend({
  components: {
    BaseButton,
    AnswerRate,
    NormalSelectBox,
    OutlinedTextField,
    ProfileBirthday,
    ProfileSubOrganization,
    ProfileLanguage,
    RadioButton,
  },
  props: {
    profile: {
      type: Object as PropType<AppApiResponse.Profile>,
      required: true,
    },
    languages: {
      type: Array as PropType<AppApiResponse.Language[]>,
      required: true,
    },
    organizations: {
      type: Array as PropType<ApiResponse.Organization[]>,
      required: true,
    },
  },
  data() {
    return {
      input: {} as AppApiResponse.Profile,
      selectedCountry: 'japan',
      isJapan: true as boolean,
      selectedSubOrganization: '' as string,
      selectedCompany: '' as string,
      isPhoneFormat: true as boolean,
      isNumericFormat: true as boolean,
      baseProfile: {} as AppApiResponse.Profile,
    };
  },
  computed: {
    selectedDivisionUuids(): string[] {
      return this.input.sub_organizations.map(
        (o: AppApiResponse.ProfileOrganization) => o.uuid
      );
    },
    setTotalCount(): AppTypes.TotalCount {
      const totalCount = {} as AppTypes.TotalCount;
      const question = this.ConfirmationQuestion() as boolean[];
      totalCount.questionCount = question.length;
      totalCount.answerdCount = question.filter(
        (item: boolean) => item === true
      ).length;

      return totalCount;
    },
    responseRate() {
      const question = this.ConfirmationQuestion() as boolean[];
      return Math.round(
        (question.filter((item: boolean) => item === true).length /
          question.length) *
          100
      );
    },
    years(): AppTypes.Date[] {
      const nowYear = dayjs().year();
      return [...Array(100).keys()].map((i: number) => {
        return { name: nowYear - i, value: nowYear - i };
      });
    },
    months(): AppTypes.Date[] {
      return [...Array(12).keys()].map((i: number) => {
        return { name: i + 1, value: i + 1 };
      });
    },
    countries() {
      return enumCountries;
    },
    prefectures() {
      return enumPrefectures;
    },
    genderTypes() {
      return enumGenderTypes;
    },
  },
  created() {
    this.baseProfile = { ...this.profile };
    this.input = { ...this.profile };
    this.input.birthplace_country = this.input.birthplace_country ?? '日本';
    this.input.main_language = this.profile.main_language ?? '';
    this.isJapan = this.input.birthplace_country === '日本';
  },
  methods: {
    ConfirmationQuestion(): boolean[] {
      let birthplaceAnswer =
        !!this.input.birthplace_country && !!this.input.birthplace_city;
      if (this.isJapan) {
        birthplaceAnswer =
          !!this.input.birthplace_country &&
          !!this.input.birthplace_prefecture &&
          !!this.input.birthplace_city;
      }
      return [
        !!this.input.gender,
        !!this.input.birthday,
        birthplaceAnswer,
        !!this.input.joined_year && !!this.input.joined_month,
        !!this.input.main_language,
        ...this.input.profile_free_questions.map(
          (item: AppApiResponse.profileFreeQuestions) => {
            return Object.keys(item.answer).length
              ? !!item.answer.content
              : false;
          }
        ),
      ];
    },
    onClose() {
      this.$emit('onClose');
    },
    async onSave() {
      const payload = this.createRequest();
      if (
        !this.testPhoneFormat(payload.tel) ||
        !this.testPhoneFormat(payload.company_tel)
      ) {
        alert('電話番号を正しい形式で入力してください。（例）090-0000-0000）');
        return;
      }
      this.$emit('onProfileSave', payload);
    },
    onChangeBirthDay(value: number) {
      this.input.birthday = value;
    },
    onChangePublishedBirthday(value: boolean) {
      this.input.published_birthday = value;
    },
    onChangeLanguage(value: string) {
      this.input.main_language = value;
    },
    clickLanguage(value: string) {
      if (this.input.sub_languages.includes(value)) {
        this.deleteSubLanguage(value);
        return;
      }
      this.addSubLanguage(value);
    },
    addSubLanguage(value: string) {
      this.input.sub_languages.push(value);
    },
    deleteSubLanguage(value: string) {
      this.input.sub_languages = this.input.sub_languages.filter(
        (l: string) => l !== value
      );
    },
    whichCountry(value: string) {
      if (value === 'japan') {
        this.isJapan = true;
        this.input.birthplace_country = '日本';
        if (this.baseProfile.birthplace_prefecture !== '') {
          this.$set(
            this.input,
            'birthplace_prefecture',
            this.baseProfile.birthplace_prefecture
          );
        }
      } else {
        this.isJapan = false;
        this.input.birthplace_prefecture = '';
        if (
          this.baseProfile.birthplace_country !== '' &&
          this.baseProfile.birthplace_country !== '日本'
        ) {
          this.$set(
            this.input,
            'birthplace_country',
            this.baseProfile.birthplace_country
          );
        } else {
          this.input.birthplace_country = '';
        }
      }
    },
    onChangeSubOrganization(organization: AppTypes.Organization) {
      this.selectedSubOrganization = organization.subOrganization;
      this.selectedCompany = organization.company;
    },
    clickDivision(uuid: string) {
      if (this.selectedDivisionUuids.includes(uuid)) {
        this.deleteDivision(uuid);
        return;
      }
      this.addDivision(uuid);
    },
    addDivision(uuid: string) {
      const division:
        | ApiResponse.Organization
        | undefined = this.organizations.find(
        (o: ApiResponse.Organization) => o.uuid === uuid
      );
      if (division) {
        this.input.sub_organizations.push({
          uuid: division.uuid,
          name: division.name,
        });
      }
    },
    deleteDivision(uuid: string) {
      this.input.sub_organizations = this.input.sub_organizations.filter(
        (o: AppApiResponse.ProfileOrganization) => o.uuid !== uuid
      );
    },
    createRequest(): AppApiRequest.Profile {
      const request = {} as AppApiRequest.Profile;

      request.gender = this.input.gender;
      request.birthday = this.input.birthday;
      request.birthplace_prefecture = this.input.birthplace_prefecture;
      request.published_birthday = this.input.published_birthday;
      request.main_language = this.input.main_language;
      request.sub_languages = this.input.sub_languages;
      request.birthplace_city = this.input.birthplace_city;
      request.birthplace_country = this.input.birthplace_country;
      request.tel = this.input.tel;
      request.company_tel = this.input.company_tel;
      request.internal_tel = this.input.internal_tel;
      request.joined_year = this.input.joined_year;
      request.joined_month = this.input.joined_month;
      request.sub_organizations = this.input.sub_organizations.map(
        (o: AppApiResponse.ProfileOrganization) => o.uuid
      );
      request.profile_free_questions = this.input.profile_free_questions.map(
        (item: AppApiResponse.profileFreeQuestions) => {
          return Object.keys(item.answer).length > 0
            ? { uuid: item.uuid, answer: item.answer.content }
            : { uuid: item.uuid, answer: null };
        }
      );

      return request;
    },
    clickContinued() {
      this.$emit('clickQAndAContinued', this.createRequest());
    },
    checkPhoneFormat(phoneValue: string) {
      this.isPhoneFormat = true;
      if (!this.testPhoneFormat(phoneValue)) {
        this.isPhoneFormat = false;
      }
    },
    testPhoneFormat(phoneValue: string) {
      const phone = /^[0-9]{3,5}[-\s.]?[0-9]{3,5}[-\s.]?[0-9]{3,5}$/;
      if (!phoneValue) {
        return true;
      }
      return phone.test(phoneValue);
    },
    checkNumericFormat(numberValue: string) {
      const numberPattern = /^[0-9]*$/;
      this.isNumericFormat = true;
      if (!numberPattern.test(numberValue)) {
        this.isNumericFormat = false;
      }
      if (numberValue === '') {
        this.isNumericFormat = true;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.title {
  font-size: 20px;
  font-weight: 600;
  line-height: 1em;
  color: $gentle_bluish_purple;
  margin: 37px 0 32px 40px;
}

.profile-edit-contents {
  padding: 32px 48px 40px 46px;
}

.button-wrapper {
  display: flex;
}

.close-button {
  width: 350px;
  background-color: $button_background_color;
  color: $gentle_bluish_purple;
  height: 44px;
  margin: 0 20px 0 0;
}

.save-button {
  width: 350px;
  background-color: $button_background_color;
  color: $gentle_bluish_purple;
  height: 44px;
}

.base-tabs {
  border-bottom: 1px solid $ruled_line;
}

.base-tabs /deep/ .tab {
  padding: 32px 0 24px;
}

.form-label {
  font-size: 15px;
  line-height: 1em;
  font-weight: 600;
  color: $main_color;
  margin: 0 0 16px 0;

  &:first-of-type {
    margin: 32px 0 16px;
  }
}

.form-sub-label {
  font-size: 15px;
  line-height: 1em;
  font-weight: 300;
  color: $sub_color;
  margin: 0 0 8px 0;
}

.select-box {
  margin: 0 0 24px 0;
}

.select-box /deep/ select {
  height: 44px;
}

.answer-rate {
  margin: 0 0 32px 0;
}

.form-textarea {
  width: 100%;
  color: $gentle_bluish_purple;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.7em;
  border-radius: 4px;
  background-color: $input_text_background_color;
  padding: 15px 16px;
  resize: vertical;
  border: 1px solid $ruled_line;
  min-height: 180px;
}

.form-input /deep/ .outline-label {
  padding: 0;
}

.form-input /deep/ .outline-input {
  color: $gentle_bluish_purple;
}

.birth-place-wrapper {
  display: flex;
  width: 100%;
  margin-top: 16px;

  .select-box {
    margin: 0 24px 0 0;
    width: 50%;
  }

  .form-input {
    width: 50%;
  }
}

.birthday-wrapper {
  display: flex;
  align-items: flex-end;
  margin: 0 0 24px 0;

  .select-box {
    width: 100%;
    margin: 0 22px 0 0;
    color: $main-color;
    line-height: 1em;
  }
}

.join-wrapper {
  display: flex;
  align-items: flex-end;
  margin: 0 0 24px 0;

  .select-box {
    width: 100%;
    margin: 0 22px 0 0;
  }
}

.join-text,
.birthday-text {
  font-size: 15px;
  color: $main-color;
  line-height: 1em;
  margin: 0 23px 0 0;

  &:last-of-type {
    margin: 0;
  }
}

.profile-sub-organization {
  margin: 0 0 24px 0;
}

.continued-text {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 15px;
  font-weight: 300;
  color: $link-color;
  margin: 72px 0 16px 0;
  cursor: pointer;
}

.icon-arrow-right {
  width: 8px;
  margin: 0 0 0 8px;
}
</style>
