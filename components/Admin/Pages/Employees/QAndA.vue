<template>
  <div>
    <ValidationObserver v-slot="{ errors }">
      <form v-if="Object.keys(input).length > 0" class="l-contents">
        <div class="question-box">
          <h2 class="question-box-title">会社からのアンケート</h2>
          <div class="question-wrapper">
            <div class="questionnaire-item">
              <label class="label">血液型<span>※必須</span></label>
              <validation-provider
                v-slot="blood_type"
                rules="required"
                name="血液型"
                class="questionnaire-select-width"
              >
                <select
                  v-model="input.company_questions.blood_type"
                  class="select"
                  :class="{
                    'input-error':
                      blood_type.errors[0] ||
                      !input.company_questions.blood_type,
                  }"
                  :disabled="inputDisabled"
                  label="name"
                >
                  <option value="">お選びください</option>
                  <option
                    v-for="bloodType in bloodTypes"
                    :key="bloodType.id"
                    :value="bloodType.value"
                    >{{ bloodType.name }}</option
                  >
                </select>
              </validation-provider>
            </div>
            <div class="questionnaire-item">
              <label class="label">文系・理系<span>※必須</span></label>
              <validation-provider
                v-slot="humanities_or_science"
                rules="required"
                name="文系・理系"
                class="questionnaire-select-width"
              >
                <select
                  v-model="input.company_questions.humanities_or_science"
                  class="select"
                  :class="{
                    'input-error':
                      humanities_or_science.errors[0] ||
                      !input.company_questions.humanities_or_science,
                  }"
                  :disabled="inputDisabled"
                  label="name"
                >
                  <option value="">お選びください</option>
                  <option
                    v-for="universityType in universityTypes"
                    :key="universityType.id"
                    :value="universityType.value"
                    >{{ universityType.name }}</option
                  >
                </select>
              </validation-provider>
            </div>
            <div class="questionnaire-item">
              <label class="label">新卒/中途入社<span>※必須</span></label>
              <validation-provider
                v-slot="new_graduate_or_mid_career"
                rules="required"
                name="入社"
                class="questionnaire-select-width"
              >
                <select
                  v-model="input.company_questions.new_graduate_or_mid_career"
                  class="select"
                  :class="{
                    'input-error':
                      new_graduate_or_mid_career.errors[0] ||
                      !input.company_questions.new_graduate_or_mid_career,
                  }"
                  :disabled="inputDisabled"
                  label="name"
                >
                  <option value="">お選びください</option>
                  <option
                    v-for="companyJoinType in companyJoinTypes"
                    :key="companyJoinType.id"
                    :value="companyJoinType.value"
                    >{{ companyJoinType.name }}</option
                  >
                </select>
              </validation-provider>
            </div>
            <div class="questionnaire-item"></div>
            <div class="questionnaire-item questionnaire-item--long">
              <validation-provider rules="required" name="出身地">
                <birthplace-form-item
                  class="birthplace-form-item"
                  :country="submitData.birthplace_country"
                  :prefecture="submitData.birthplace_prefecture"
                  :city="submitData.birthplace_city"
                  :countries="countries"
                  :saved-profile-birth-country="savedProfileBirthCountry"
                  :prefectures="prefectures"
                  :saved-profile-birth-prefecture="savedProfileBirthPrefecture"
                  :disabled="inputDisabled"
                  @onChangeCountry="changeCountry"
                  @onChangePrefecture="changePrefecture"
                  @onChangeCity="changeCity"
                />
              </validation-provider>
            </div>

            <div class="questionnaire-item">
              <label class="label">職種<span>※必須</span></label>
              <div class="questionnaire-select-width addition">
                <validation-provider
                  v-for="(item, index) in input.job_types"
                  :key="index"
                  :rules="{ required: !trimJobTypes.length }"
                  name="職種"
                  slim
                >
                  <select
                    v-model="input.job_types[index]"
                    class="select"
                    label="name"
                    :class="{
                      'input-error':
                        !trimJobTypes.length && input.job_types[index] === '',
                    }"
                    :disabled="inputDisabled"
                  >
                    <option value="">選択してください。</option>
                    <option
                      v-for="jobType in jobTypes"
                      :key="jobType.uuid"
                      :value="jobType.uuid"
                      >{{ jobType.name }}</option
                    >
                  </select>
                </validation-provider>
              </div>
            </div>
            <div class="questionnaire-item add-button">
              <add-button
                class="button"
                :disabled="inputDisabled"
                @click="addJobType"
              >
                職種を追加する
              </add-button>
            </div>
          </div>
        </div>
        <div class="q-and-a-box">
          <h2 class="q-and-a-box-title">Q & A</h2>
          <div
            v-for="(question, index) in sortQa"
            :key="question.id"
            class="q-and-a-item"
          >
            <label class="label q-and-a-box-label">
              {{ question.content }}
            </label>
            <base-input-text
              v-model="input.qa_free_questions[index].answer"
              :disabled="inputDisabled"
            />
          </div>
        </div>
        <base-button
          size="large"
          class="save-button"
          :disabled="isError(errors) || inputDisabled"
          @click="onSubmit"
        >
          保存する
        </base-button>
      </form>
      <vue-loading
        v-if="isLoading"
        type="spin"
        color="#333"
        :size="{ width: '50px', height: '50px' }"
      ></vue-loading>
    </ValidationObserver>
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
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import AddButton from '@/components/Admin/Pages/CommunityManagement/AddButton.vue';
import { VueLoading } from 'vue-loading-template';
import {
  fetchOrganizationsJobType,
  fetchUserQa,
  putUserQa,
  fetchMemberProfile,
} from '@/libs/api';
import BaseInputText from '@/components/Admin/Modules/Input/BaseInputText.vue';
import {
  enumPrefectures,
  enumBloodTypes,
  enumUniversityTypes,
  enumCompanyJoinTypes,
  enumCountries,
} from '@/libs/definition';
import SuccessMessage from '@/components/Admin/Modules/Modal/SuccessMessage.vue';
import BirthplaceFormItem from './ProfileComponents/BirthplaceFormItem.vue';

export default Vue.extend({
  components: {
    ValidationObserver,
    ValidationProvider,
    SuccessMessage,
    BaseButton,
    AddButton,
    VueLoading,
    BaseInputText,
    BirthplaceFormItem,
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
      isLoading: false as boolean,
      successMessageModal: false as boolean,
      input: {
        company_questions: {} as ApiResponse.CompanyQuestions,
        job_types: [''] as string[],
        qa_free_questions: [] as ApiResponse.QaFreeQuestions[],
      } as ApiResponse.UserQa,
      submitData: {} as ApiRequest.UserQa,
      bloodTypes: enumBloodTypes,
      universityTypes: enumUniversityTypes,
      companyJoinTypes: enumCompanyJoinTypes,
      countries: enumCountries,
      prefectures: enumPrefectures,
      jobTypes: [] as ApiResponse.JobType[],
      savedProfileBirthCountry: '' as string,
      savedProfileBirthPrefecture: '' as string,
    };
  },
  computed: {
    // TODO: ちゃんと返り値かく
    sortQa(): object {
      return this.input.qa_free_questions
        .slice()
        .sort(
          (a: ApiResponse.QaFreeQuestions, b: ApiResponse.QaFreeQuestions) => {
            return a.order - b.order;
          }
        );
    },
    trimJobTypes(): ApiResponse.JobType[] {
      if (this.input.job_types) {
        return this.input.job_types.reduce(
          (newData: ApiResponse.jopType[], jopType: ApiResponse.jopType) => {
            if (jopType && !newData.includes(jopType)) {
              newData.push(jopType);
            }
            return newData;
          },
          []
        );
      }
      return [];
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
  },
  async mounted() {
    this.isLoading = true;
    try {
      await Promise.all([
        this.fetchOrganizationsJobTypes(),
        this.fetchUserQa(),
        this.fetchMemberProfile(),
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    async onSubmit() {
      try {
        this.submitData.company_questions = this.input.company_questions;
        this.submitData.job_types = this.trimJobTypes;
        this.submitData.qa_free_questions = this.input.qa_free_questions.map(
          (item: ApiResponse.QaFreeQuestions) => {
            return { uuid: item.uuid, answer: item.answer };
          }
        );
        await putUserQa(this.userUuid, this.submitData);
        this.input.job_types = this.trimJobTypes;
        this.toggleSuccessMessageModal();
      } catch (e) {
        alert('保存に失敗しました。');
        console.error(e);
      }
    },
    toggleSuccessMessageModal() {
      this.successMessageModal = !this.successMessageModal;
    },
    isError(errors: object) {
      return (
        !!Object.values(errors).filter(
          (errorList: string[]) => !!errorList.length
        ).length || !this.trimJobTypes.length
      );
    },
    addJobType() {
      this.input.job_types.push('');
    },
    async fetchOrganizationsJobTypes(): Promise<void> {
      const { data } = await fetchOrganizationsJobType();
      // FIXME: 型定義なおしてください
      // @ts-ignore
      this.jobTypes = data.job_types;
    },
    async fetchUserQa(): Promise<void> {
      const { data } = await fetchUserQa(this.userUuid);
      this.input = data;
      if (!this.input.company_questions.blood_type) {
        this.input.company_questions.blood_type = '';
      }
      if (!this.input.company_questions.humanities_or_science) {
        this.input.company_questions.humanities_or_science = '';
      }
      if (!this.input.company_questions.new_graduate_or_mid_career) {
        this.input.company_questions.new_graduate_or_mid_career = '';
      }
      if (!this.input.job_types || !this.input.job_types.length) {
        this.input.job_types = [''];
      }
    },
    async fetchMemberProfile(): Promise<void> {
      const { data } = await fetchMemberProfile(this.userUuid);
      this.submitData.birthplace_city = data.birthplace_city ?? '';
      this.submitData.birthplace_country = data.birthplace_country ?? '';
      this.submitData.birthplace_prefecture = data.birthplace_prefecture ?? '';
      this.savedProfileBirthCountry = this.submitData.birthplace_country;
      this.savedProfileBirthPrefecture = this.submitData.birthplace_prefecture;
    },
    changeCountry(value: string) {
      this.submitData.birthplace_country = value;
    },
    changePrefecture(value: string) {
      this.submitData.birthplace_prefecture = value;
    },
    changeCity(value: string) {
      this.submitData.birthplace_city = value;
    },
  },
});
</script>

<style lang="scss" scoped>
textarea {
  resize: none;
}

.l-contents {
  padding: 15px 30px 30px;
}

.save-button {
  width: 200px;
  margin-left: auto;
  margin-right: auto;

  &[disabled] {
    background: #f3f3f3;
    border-color: #e4e5ed;
    color: #bebebe;
  }
}

input,
textarea {
  flex: 1;
  height: 40px;
  width: 100%;
  background-color: $white_1;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  padding: 0 11px;
  font-family: 'Hiragino Kaku Gothic Pro', sans-serif;
  font-weight: 300;
  font-size: 13px;
  color: $gray_blue_4;
}

.select {
  flex-shrink: 0;
  width: 100%;
  height: 40px;
  max-width: 300px;
  border-radius: 4px;
  color: $gray_blue_4;
  background-color: $true_white;
  border: solid 1px $light_gray_blue_3;

  &:not(input) {
    -webkit-appearance: none;
    -moz-appearance: none;
    padding: 0 26px 0 8px;
    background-image: url('/icon/icon_caret-down.svg');
    background-repeat: no-repeat;
    background-position: calc(100% - 8px) center;
  }

  &::placeholder {
    color: $placeholder_gray;
  }
}

.question-box {
  background-color: $white_1;
  border-radius: 6px;
  padding: 15px 55px 15px 15px;
  margin-left: -15px;
  margin-right: -15px;
  margin-bottom: 43px;
}

.question-box-title {
  font-size: 15px;
}

.question-wrapper {
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
}

.label {
  flex-shrink: 0;
  font-weight: bold;
  font-size: 15px;
  line-height: 1;
  display: flex;
  width: 190px;

  span {
    font-size: 13px;
    font-weight: 300;
    color: $gray_blue_1;
    margin-left: 9px;
  }
}

.questionnaire-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  width: calc(50% - 50px);
  margin-top: 30px;

  &--long {
    width: 100%;
  }

  &.add-button {
    flex-grow: 1;
    margin-left: 10px;

    .button {
      min-width: 160px;
      text-align: left;

      &[disabled] {
        background: #f3f3f3;
        border-color: #e4e5ed;
        color: #bebebe;
      }
    }
  }
}

.questionnaire-select-width {
  flex-grow: 1;

  &.addition {
    display: flex;
    flex-direction: column;
  }
}

.job-type-item {
  width: 100%;
}

.job-type-item-left {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
}

.job-type-width {
  flex-grow: 1;
}

.input-job-type {
  min-height: 53px;
  background-color: $true_white;
  padding: 13px 11px;
  height: 100%;
  cursor: pointer;
}

.job-type-button {
  margin-left: 10px;
  word-break: keep-all;
}

.q-and-a-box-title {
  font-size: 15px;
}

.q-and-a-box-label {
  max-width: 300px;
  width: 100%;
}

.q-and-a-item {
  display: flex;
  flex-direction: row;
  align-content: center;
  margin: 30px 0 0 0;

  &:last-of-type {
    margin: 30px 0 41px 0;
  }
}

.input-error {
  border: solid 1px $pink;
  background-color: $light_pink;

  /deep/ .vs__dropdown-toggle {
    background-color: $light_pink;
  }
}

::placeholder {
  color: $placeholder_gray !important;
}

.birthplace-form-item {
  & ::v-deep .label {
    font-size: 15px;
  }
}
</style>
