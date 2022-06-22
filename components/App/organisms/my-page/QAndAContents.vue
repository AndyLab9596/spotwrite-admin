<template>
  <div>
    <div class="profile-edit-contents">
      <div class="user-info-body-container">
        <answer-rate
          v-if="responseRate < 100"
          label="Q&A回答率"
          :value="responseRate"
          :total-count="setTotalCount"
          class="answer-rate"
        />
      </div>
      <div class="form-contents">
        <p class="wrapper-title">会社アンケート</p>
        <div class="questionnaire-wrapper">
          <div class="form-item">
            <p class="form-label">
              <span class="form-label-number">Q.{{ qaNumbers[0] }}.</span>
              あなたの血液型は？
            </p>
            <img
              v-if="qaInput.company_questions.blood_type"
              src="/app/icon/Icon-check-pink.svg"
              class="icon-check"
              alt=""
            />
          </div>
          <normal-select-box
            v-model="qaInput.company_questions.blood_type"
            name="select-box"
            large-font
            :items="bloodTypes"
            :display-pull-down="true"
            placeholder="お選びください"
            class="select-box"
          />
          <div class="form-item">
            <p class="form-label">
              <span class="form-label-number">Q.{{ qaNumbers[1] }}.</span>
              文系？理系？
            </p>
            <img
              v-if="qaInput.company_questions.humanities_or_science"
              src="/app/icon/Icon-check-pink.svg"
              class="icon-check"
              alt=""
            />
          </div>
          <normal-select-box
            v-model="qaInput.company_questions.humanities_or_science"
            name="select-box"
            large-font
            :items="universityTypes"
            :display-pull-down="true"
            placeholder="お選びください"
            class="select-box"
          />
          <div class="form-item">
            <p class="form-label">
              <span class="form-label-number">Q.{{ qaNumbers[2] }}.</span>
              新卒 or 中途入社どっち？
            </p>
            <img
              v-if="qaInput.company_questions.new_graduate_or_mid_career"
              src="/app/icon/Icon-check-pink.svg"
              class="icon-check"
              alt=""
            />
          </div>
          <normal-select-box
            v-model="qaInput.company_questions.new_graduate_or_mid_career"
            name="select-box"
            large-font
            :items="companyJoinTypes"
            :display-pull-down="true"
            placeholder="お選びください"
            class="select-box"
          />
          <p class="form-label">
            <span class="form-label-number">{{ 'Q.4.' }}</span>
            出身地
          </p>
          <div class="birth-place-country">
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
                v-model="profileInput.birthplace_prefecture"
                name="select-box"
                large-font
                :items="prefectures"
                :display-pull-down="true"
                placeholder="選択してください。"
                class="birth-place-select-box"
              />
            </template>
            <template v-else>
              <normal-select-box
                v-model="profileInput.birthplace_country"
                name="birth-place-select-box"
                large-font
                :items="countries"
                :display-pull-down="true"
                placeholder="選択してください。"
                class="birth-place-select-box"
              />
            </template>
            <outlined-text-field
              v-model="profileInput.birthplace_city"
              :placeholder="isJapan ? '市町村' : '州・地域'"
              input-name="birthplace_city"
              class="form-input"
              type="text"
            />
          </div>
          <p class="form-label">
            <span class="form-label-number">{{ 'Q.5.' }}</span>
            職種
          </p>
          <div class="job-wrapper">
            <p
              v-for="item in selectedJobTypeItems"
              :key="item.uuid"
              class="job-name"
            >
              {{ item.name }}
              <img
                src="/app/icon/Icon-delete.svg"
                alt=""
                class="delete-icon"
                @click="deleteJobType(item.uuid)"
              />
            </p>
          </div>
          <base-button class="job-add-button" @click="openProfileJobTypesModal">
            <p>職種を追加</p>
            <img src="/app/icon/Icon-plus-pink.svg" class="icon-plus" alt="" />
          </base-button>
        </div>

        <div
          v-for="(item, index) in qaInput.qa_free_questions"
          :key="item.uuid"
        >
          <p class="form-label">
            <span class="form-label-number">{{ 'Q.' + (index + 1) }}</span>
            {{ item.content }}
          </p>
          <outlined-text-field
            v-model="item.answer.content"
            :input-name="item.uuid"
            class="form-input"
          />
        </div>
      </div>
      <p class="continued-text" @click="clickContinued">
        続けてプロフィールを回答する
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
        <base-button class="save-button" @click="onSave">
          完了
        </base-button>
      </div>
    </div>
    <profile-job-types-modal
      v-if="profileJobTypesModal"
      :job-types="jobTypes"
      :selected-job-type-uuids="selectedJobTypeUuids"
      @clickJobType="clickJobType"
      @onClose="closeProfileJobTypesModal"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import {
  enumBloodTypes,
  enumPrefectures,
  enumUniversityTypes,
  enumCompanyJoinTypes,
  enumCountries,
} from '@/libs/definition';
import BaseButton from '../../atoms/buttons/BaseButton.vue';
import AnswerRate from '../../molecules/answerRate/index.vue';
import NormalSelectBox from '../../atoms/selectBox/NormalSelectBox.vue';
import OutlinedTextField from '../../atoms/textFields/OutlinedTextField.vue';
import ProfileJobTypesModal from './ProfileJobTypesModal.vue';
import RadioButton from '../../atoms/buttons/RaadioButton.vue';

export default Vue.extend({
  components: {
    BaseButton,
    AnswerRate,
    NormalSelectBox,
    OutlinedTextField,
    ProfileJobTypesModal,
    RadioButton,
  },
  props: {
    profileQa: {
      type: Object as PropType<AppApiResponse.ProfileQuestionAndAnswers>,
      required: true,
    },
    profile: {
      type: Object as PropType<AppApiResponse.Profile>,
      required: true,
    },
    jobTypes: {
      type: Array as PropType<AppApiResponse.Job[]>,
      required: true,
    },
  },
  data() {
    return {
      qaInput: {} as AppApiResponse.ProfileQuestionAndAnswers,
      profileInput: {} as AppApiResponse.Profile,
      hoge: '',
      qaNumbers: [0, 0, 0, 0],
      profileJobTypesModal: false as boolean,
      selectedJobTypeUuids: [] as string[],
      selectedJobTypes: [] as AppApiResponse.Job[],
      isJapan: true as boolean,
      baseProfile: {} as AppApiResponse.Profile,
    };
  },
  computed: {
    setTotalCount(): AppTypes.TotalCount {
      const totalCount = {} as AppTypes.TotalCount;
      const question = this.confirmationQuestion() as boolean[];
      totalCount.questionCount = question.length;
      totalCount.answerdCount = question.filter(
        (item: boolean) => item === true
      ).length;

      return totalCount;
    },
    responseRate() {
      const question = this.confirmationQuestion() as boolean[];
      return Math.round(
        (question.filter((item: boolean) => item === true).length /
          question.length) *
          100
      );
    },
    bloodTypes() {
      return enumBloodTypes;
    },
    prefectures() {
      return enumPrefectures;
    },
    universityTypes() {
      return enumUniversityTypes;
    },
    companyJoinTypes() {
      return enumCompanyJoinTypes;
    },
    countries() {
      return enumCountries;
    },
    selectedJobTypeItems(): AppApiResponse.Job[] {
      return [
        ...new Map(
          this.selectedJobTypes.map((item: AppApiResponse.Job) => [
            item.uuid,
            item,
          ])
        ).values(),
      ];
    },
  },
  created() {
    this.baseProfile = { ...this.profile };
    this.selectedJobTypeUuids = this.profileQa.job_types.map(
      (item: AppApiResponse.Job) => item.uuid
    );
    this.selectedJobTypes = this.profileQa.job_types;
    this.profileInput = { ...this.profile };
    this.profileInput.birthplace_country =
      this.profileInput.birthplace_country ?? '日本';
    this.isJapan = this.profileInput.birthplace_country === '日本';
    this.qaInput.company_questions = Object.keys(
      this.profileQa.company_questions
    ).reduce((resultData: object, key: string) => {
      const newData = { ...resultData };
      newData[key] = this.profileQa.company_questions[key] ?? '';
      return newData;
    }, {});
    this.qaInput.qa_free_questions = this.profileQa.qa_free_questions;

    this.qaNumbers = this.setQuestionNumber(
      this.qaInput.company_questions.blood_type,
      0
    );
    this.qaNumbers = this.setQuestionNumber(
      this.qaInput.company_questions.humanities_or_science,
      1
    );
    this.qaNumbers = this.setQuestionNumber(
      this.qaInput.company_questions.new_graduate_or_mid_career,
      2
    );
    this.qaNumbers = this.setQuestionNumber(
      this.qaInput.company_questions.prefectures_where_lived,
      3
    );
  },
  methods: {
    setQuestionNumber(
      value: string | null | undefined,
      index: number
    ): number[] {
      if (value == null) return [...this.qaNumbers];

      return [
        ...this.qaNumbers.slice(0, index),
        ...this.qaNumbers.slice(index).map((item: number) => item + 1),
      ];
    },
    confirmationQuestion(): boolean[] {
      const companyQuestions = Object.entries(this.qaInput.company_questions);
      return [
        ...companyQuestions.map((item: string[]) => !!item[1]),
        ...this.qaInput.qa_free_questions.map(
          (item: AppApiResponse.ProfileQuestionnaireItem) =>
            !!item.answer.content
        ),
      ];
    },
    onClose() {
      this.$emit('onClose');
    },
    async onSave() {
      const qaPayload = this.createQaRequest();
      const profilePayload = this.createProfileRequest();
      this.$emit('onQAndASave', { qaPayload, profilePayload });
    },
    createQaRequest(): AppApiRequest.ProfileQuestionAndAnswers {
      const request = {} as AppApiRequest.ProfileQuestionAndAnswers;

      request.company_questions = this.qaInput.company_questions;
      request.job_types = this.selectedJobTypeUuids;
      request.qa_free_questions = this.qaInput.qa_free_questions.map(
        (item: AppApiResponse.ProfileQuestionnaireItem) => {
          return { uuid: item.uuid, answer: item.answer.content };
        }
      );
      return request;
    },
    createProfileRequest(): AppApiRequest.Profile {
      const request = {} as AppApiRequest.Profile;

      request.gender = this.profileInput.gender;
      request.birthday = this.profileInput.birthday;
      request.birthplace_prefecture = this.profileInput.birthplace_prefecture;
      request.main_language = this.profileInput.main_language;
      request.sub_languages = this.profileInput.sub_languages;
      request.birthplace_city = this.profileInput.birthplace_city;
      request.birthplace_country = this.profileInput.birthplace_country;
      request.tel = this.profileInput.tel;
      request.company_tel = this.profileInput.company_tel;
      request.internal_tel = this.profileInput.internal_tel;
      request.joined_year = this.profileInput.joined_year;
      request.joined_month = this.profileInput.joined_month;
      request.sub_organizations = this.profileInput.sub_organizations.map(
        (o: AppApiResponse.ProfileOrganization) => o.uuid
      );
      request.profile_free_questions = this.profileInput.profile_free_questions.map(
        (item: AppApiResponse.profileFreeQuestions) => {
          return Object.keys(item.answer).length > 0
            ? { uuid: item.uuid, answer: item.answer.content }
            : { uuid: item.uuid, answer: null };
        }
      );
      return request;
    },
    clickContinued() {
      const qaPayload = this.createQaRequest();
      const profilePayload = this.createProfileRequest();
      this.$emit('clickContinued', { qaPayload, profilePayload });
    },
    openProfileJobTypesModal() {
      this.profileJobTypesModal = true;
    },
    closeProfileJobTypesModal() {
      this.profileJobTypesModal = false;
    },
    deleteJobType(uuid: string) {
      this.selectedJobTypeUuids = this.selectedJobTypeUuids.filter(
        (item: string) => item !== uuid
      );
      this.selectedJobTypes = this.selectedJobTypes.filter(
        (item: AppApiResponse.Job) => item.uuid !== uuid
      );
    },
    clickJobType(uuid: string) {
      if (this.selectedJobTypeUuids.includes(uuid)) {
        this.deleteJobType(uuid);
        return;
      }
      this.addJobType(uuid);
    },
    addJobType(uuid: string) {
      const jobType = this.jobTypes.find(
        (item: AppApiResponse.Job) => item.uuid === uuid
      ) as AppApiResponse.Job;
      this.selectedJobTypeUuids = [...this.selectedJobTypeUuids, uuid];
      this.selectedJobTypes = [...this.selectedJobTypes, jobType];
    },
    whichCountry(value: string) {
      if (value === 'japan') {
        this.isJapan = true;
        this.profileInput.birthplace_country = '日本';
        if (this.baseProfile.birthplace_prefecture !== '') {
          this.$set(
            this.profileInput,
            'birthplace_prefecture',
            this.baseProfile.birthplace_prefecture
          );
        }
      } else {
        this.isJapan = false;
        this.profileInput.birthplace_prefecture = '';
        if (
          this.baseProfile.birthplace_country !== '' &&
          this.baseProfile.birthplace_country !== '日本'
        ) {
          this.$set(
            this.profileInput,
            'birthplace_country',
            this.baseProfile.birthplace_country
          );
        } else {
          this.profileInput.birthplace_country = '';
        }
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
  display: flex;
  align-items: center;
  font-size: 15px;
  line-height: 1em;
  font-weight: 600;
  color: $main_color;
  margin: 0 0 16px 0;
}

.form-sub-label {
  font-family: 'Lato', sans-serif;
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

.wrapper-title {
  font-size: 15px;
  font-weight: 600;
  color: $main_color;
  margin: 0 0 16px 0;
}

.questionnaire-wrapper {
  border-radius: 8px;
  background-color: $white_1;
  border: 1px solid $ruled_line;
  padding: 24px 16px;
  margin: 0 0 32px;

  .select-box {
    margin: 0 0 24px 0;

    &:last-of-type {
      margin: 0;
    }
  }

  .form-label {
    display: flex;
    align-items: center;
    font-size: 15px;
    line-height: 1em;
    font-weight: 600;
    color: $main_color;
    margin: 0;
  }
}

.form-label-number {
  font-size: 13px;
  font-weight: 600;
  color: $link-color;
}

.icon-check {
  width: 16px;
}

.form-input /deep/ .outline-label {
  padding: 0;
}

.form-input /deep/ .outline-input {
  color: $gentle_bluish_purple;
}

.continued-text {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 15px;
  font-weight: 300;
  color: $link-color;
  margin: 0 0 16px 0;
  cursor: pointer;
}

.icon-arrow-right {
  width: 8px;
  margin: 0 0 0 8px;
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 16px;
}

.answer-rate {
  margin: 0 0 32px 0;
}

.job-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 6px 0;
}

.job-name {
  display: flex;
  align-items: center;
  font-size: 15px;
  line-height: 1em;
  border: 1px solid $job_type_border;
  height: 44px;
  padding: 0 9px;
  border-radius: 4px;
  margin: 0 8px 10px 0;
}

.job-add-button {
  width: 100%;
  height: 44px;
  background-color: $button_background_color;
  color: $gentle_bluish_purple;
  margin: 0 0 16px 0;
  position: relative;
}

.icon-plus {
  width: 16px;
  position: absolute;
  top: 14px;
  right: 13px;
}

.delete-icon {
  width: 16px;
  margin: 0 0 0 8px;
  cursor: pointer;
}

.birth-place-country {
  margin-top: 14px;
}

.birth-place-wrapper {
  display: flex;
  width: 100%;
  margin-top: 16px;

  .birth-place-select-box {
    margin-right: 24px !important;
    width: 50%;
  }

  .form-input {
    width: 50%;
  }
}
</style>
