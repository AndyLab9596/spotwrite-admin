<template>
  <div class="page-container">
    <div v-if="isFirstPage">
      <ValidationObserver v-slot="{ handleSubmit, invalid }">
        <form class="form" @submit.prevent="handleSubmit(onClickNextButton)">
          <p class="form-top-text">Welcome!</p>
          <img class="logo" src="/image/logo_white@2x.png" />
          <p class="user-name">
            {{ userName }}<span class="user-name-word">さん</span>
          </p>
          <label class="label password-requirement"
            >パスワードは英字と数字を含めた6文字以上で<br />入力してください。</label
          >
          <validation-provider
            v-slot="password"
            :rules="{
              required,
              regex: /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/,
            }"
            vid="confirmation"
            class="input-box"
          >
            <label class="label">パスワード</label>
            <input
              v-model="input.password"
              type="password"
              class="input"
              name="パスワード"
              :class="{ 'input-error': password.errors[0] }"
            />
          </validation-provider>
          <validation-provider
            v-slot="password_confirmation"
            rules="required|confirmed:confirmation"
            class="input-box"
          >
            <label class="label">パスワード再入力</label>
            <input
              v-model="input.password_confirmation"
              type="password"
              class="input"
              name="パスワード"
              :class="{ 'input-error': password_confirmation.errors[0] }"
            />
          </validation-provider>
          <button class="next-button" :disabled="isLoading || invalid">
            プロフィール登録へ進む
          </button>
        </form>
      </ValidationObserver>
    </div>
    <div v-if="!isFirstPage && canRegister">
      <ValidationObserver v-slot="{ handleSubmit, invalid }">
        <form class="form" @submit.prevent="handleSubmit(onSubmit)">
          <div class="profile-top">
            <img class="logo" src="/image/logo_white@2x.png" />
            <p class="profile-description">必須プロフィール登録</p>
          </div>
          <div class="input-box">
            <label class="label">プロフィール写真</label>
            <div v-show="input.user_icon" class="upload-icon-box">
              <img class="upload-icon" :src="input.user_icon" />
              <div class="delete-icon-circle" @click="deleteIcon">
                <icon class="icon-delete" name="cross_w" :size="18" />
              </div>
            </div>
            <label v-show="!input.user_icon" class="upload-icon-box">
              <div class="white-circle">
                <icon class="icon-plus" name="plus" :size="10" />
              </div>
              <div class="camera-circle">
                <icon class="icon-plus" name="camera" :size="18" />
              </div>
              <input
                type="file"
                name="pic"
                accept=".png, .jpg, .jpeg"
                style="display: none;"
                @change="onIconImageChange"
              />
            </label>
          </div>
          <div class="input-box">
            <label class="label">生年月日</label>
            <div class="birthday-box">
              <validation-provider
                v-slot="year"
                rules="required"
                class="birthday-select"
              >
                <normal-select-box
                  v-model="selectedYear"
                  name="select-box"
                  large-font
                  :display-pull-down="true"
                  :items="years"
                  class="select-box"
                  :errored="Boolean(year.errors[0])"
                  @change="changeBirthDay"
                />
              </validation-provider>
              <span class="birth-word">年</span>
              <validation-provider
                v-slot="month"
                rules="required"
                class="birthday-select"
              >
                <normal-select-box
                  v-model="selectedMonth"
                  name="select-box"
                  large-font
                  :display-pull-down="true"
                  :items="months"
                  class="select-box"
                  :errored="Boolean(month.errors[0])"
                  @change="changeBirthDay"
                />
              </validation-provider>
              <span class="birth-word">月</span>
              <validation-provider
                v-slot="day"
                rules="required"
                class="birthday-select"
              >
                <normal-select-box
                  v-model="selectedDay"
                  name="select-box"
                  large-font
                  :display-pull-down="true"
                  :items="days"
                  class="select-box"
                  :errored="Boolean(day.errors[0])"
                  @change="changeBirthDay"
                />
              </validation-provider>
              <span class="birth-word">日</span>
            </div>
          </div>
          <div class="input-box">
            <validation-provider v-slot="gender" name="性別" rules="required">
              <label class="label">性別</label>
              <normal-select-box
                v-model="input.gender"
                name="select-box"
                :items="genderTypes"
                placeholder="選択してください。"
                large-font
                :errored="Boolean(gender.errors[0])"
              />
              {{ gender.errors[0] }}
            </validation-provider>
          </div>
          <div class="input-box">
            <validation-provider
              v-slot="language"
              name="使用言語"
              rules="required"
            >
              <label class="label">使用言語</label>
              <normal-select-box
                v-model="input.language"
                name="select-box"
                :items="languagesSelectOption"
                placeholder="選択してください。"
                large-font
                :errored="Boolean(language.errors[0])"
              />
              {{ language.errors[0] }}
            </validation-provider>
          </div>
          <div class="input-box">
            <span class="label">出身地</span>
            <validation-provider rules="" class="radio-buttons">
              <radio-button
                id="japan"
                name="radio-button"
                value="japan"
                label="日本"
                :checked="selectedCountry === 'japan'"
                class="radio"
                @change="whichCountry"
              />
              <radio-button
                id="other"
                name="radio-button"
                value="other"
                label="日本以外"
                :checked="selectedCountry === 'other'"
                class="radio"
                @change="whichCountry"
              />
            </validation-provider>
            <validation-provider
              v-if="isJapan"
              v-slot="prefecture"
              rules="required"
              class="input-box"
            >
              <normal-select-box
                v-model="input.birthplace_prefecture"
                name="select-box"
                :items="prefectures"
                placeholder="選択してください"
                large-font
                :errored="Boolean(prefecture.errors[0])"
              />
            </validation-provider>
            <validation-provider
              v-else
              v-slot="country"
              rules="required"
              class="input-box input-box-county"
            >
              <normal-select-box
                v-model="input.birthplace_country"
                name="select-box"
                :items="countries"
                placeholder="選択してください"
                large-font
                :errored="Boolean(country.errors[0])"
              />
            </validation-provider>
            <validation-provider
              v-slot="city"
              rules="required"
              class="input-box"
            >
              <input
                v-model="input.birthplace_city"
                type="text"
                class="input"
                name="市町村"
                placeholder="市町村を入力"
                :class="{ 'input-error': city.errors[0] }"
              />
            </validation-provider>
          </div>
          <button
            class="next-button"
            :disabled="isLoading || invalid || !input.user_icon"
          >
            登録完了
          </button>
        </form>
      </ValidationObserver>
    </div>
    <div v-show="tokenInvalid" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
            トークンの有効期限が切れています。<br />
            御社のSpotwrite管理者にご確認ください。
          </div>
          <div class="modal-footer">
            <button
              class="modal-default-button"
              @click="$router.push({ path: '/login' })"
            >
              ログインページへ
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isFirstPage && !canRegister" class="pageError">
      <img class="logo-error" src="/image/logo_white@2x.png" />
      <div class="message-content">
        <p class="bottom-text">登録可能なメンバー数を超えているため</p>
        <p class="bottom-text">本登録することができません。</p>
        <p class="bottom-text">担当者の方にご確認ください。</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Context } from '@nuxt/types';
import {
  ValidationObserver,
  ValidationProvider,
} from 'vee-validate/dist/vee-validate.full.esm';
import NormalSelectBox from '@/components/App/atoms/selectBox/NormalSelectBox.vue';
import RadioButton from '@/components/App/atoms/buttons/RaadioButton.vue';
import Icon from '@/components/App/atoms/images/Icon.vue';
import {
  enumGenderTypes,
  enumPrefectures,
  enumCountries,
} from '@/libs/definition';
import dayjs from 'dayjs';
import {
  authenticationCheck,
  authenticationRegister,
  uploadImage,
  fetchEmployeeLanguages,
} from '../../../libs/api/app';

type selectItem = {
  value: string | number;
  name: string | number;
};

export default Vue.extend({
  layout: 'clean',
  components: {
    ValidationObserver,
    ValidationProvider,
    NormalSelectBox,
    RadioButton,
    Icon,
  },
  async asyncData({
    query,
  }: Context): Promise<{
    tokenInvalid: boolean;
    userName?: string;
    canRegister?: boolean;
  }> {
    if (!query?.token || Array.isArray(query.token)) {
      return { tokenInvalid: true };
    }
    try {
      const { data } = await authenticationCheck({ token: query.token });
      return {
        tokenInvalid: false,
        userName: data.user_name,
        canRegister: data.can_register,
      };
    } catch (error) {
      return { tokenInvalid: true };
    }
  },
  data() {
    return {
      genderTypes: enumGenderTypes,
      prefectures: enumPrefectures,
      countries: enumCountries,
      userName: '' as string,
      canRegister: true as boolean,
      input: {
        token: '',
        password: '',
        password_confirmation: '',
        birthday: 0,
        gender: '',
        birthplace_prefecture: '',
        birthplace_country: '日本',
        birthplace_city: '',
        user_icon: '',
        language: '',
      } as ApiRequest.AuthenticationInformation,
      error: false as boolean,
      isLoading: false as boolean,
      isFirstPage: true as boolean,
      isJapan: true as boolean,
      birthDay: 631152000 as number,
      selectedCountry: 'japan',
      selectedYear: 0 as number,
      selectedMonth: 0 as number,
      selectedDay: 0 as number,
      languages: [] as AppApiResponse.Language[],
    };
  },
  computed: {
    years(): Types.Date[] {
      const nowYear = dayjs().year();
      return [...Array(100).keys()].map((i: number) => {
        return { name: nowYear - i, value: nowYear - i };
      });
    },
    months(): Types.Date[] {
      return [...Array(12).keys()].map((i: number) => {
        return { name: i + 1, value: i + 1 };
      });
    },
    days(): Types.Date[] {
      if (!this.selectedYear || !this.selectedMonth) return [];

      const daysInMonth = dayjs()
        .year(this.selectedYear)
        .month(this.selectedMonth - 1)
        .daysInMonth();
      return [...Array(daysInMonth).keys()].map((i: number) => {
        return { name: i + 1, value: i + 1 };
      });
    },
    languagesSelectOption(): Array<Object> {
      return this.languages.map((language: AppApiResponse.Language) => ({
        value: language.code,
        name: language.name,
      }));
    },
  },
  created() {
    setTimeout(() => {
      if (this.$store.state.userProfile) {
        this.$accessor.deleteUserProfile();
        this.$accessor.clearAccessToken();
      }
      this.$accessor.contract.flush();
    }, 300);
    this.fetchLanguages();
    this.setBirthDay();
  },
  methods: {
    onIconImageChange(e: any) {
      const files = e.target.files || e.dataTransfer.files;
      if (files[0].type !== 'image/jpeg' && files[0].type !== 'image/png')
        return;
      this.createIconImage(files[0]);
    },
    async createIconImage(image: Blob) {
      const formData: any = new FormData();
      formData.append('image', image);
      const res = await uploadImage(formData);
      this.input.user_icon = res.data.url;
    },
    deleteIcon() {
      this.input.user_icon = '';
    },
    onClickNextButton() {
      this.isFirstPage = false;
    },
    async onSubmit() {
      this.isLoading = true;
      try {
        const token = this.$route.query?.token;
        if (!token || Array.isArray(token)) {
          throw new Error('tokenが不正です');
        }
        await authenticationRegister({
          token,
          password: this.input.password,
          password_confirmation: this.input.password_confirmation,
          gender: this.input.gender,
          birthday: this.birthDay,
          birthplace_country: this.input.birthplace_country,
          birthplace_prefecture: this.input.birthplace_prefecture,
          birthplace_city: this.input.birthplace_city,
          user_icon: this.input.user_icon,
          language: this.input.language,
        });
        this.$router.push({ path: '/signup/completed' });
      } catch (error) {
        alert('本登録に失敗しました。御社のSpotwrite管理者にご確認ください。');
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    whichCountry(selected: string) {
      if (selected === 'japan') {
        this.isJapan = true;
        this.input.birthplace_country = '日本';
      } else {
        this.isJapan = false;
        this.input.birthplace_prefecture = '';
        this.input.birthplace_country = '';
      }
      this.selectedCountry = selected;
    },
    setBirthDay(): void {
      this.selectedYear = Number(dayjs.unix(this.birthDay).format('YYYY'));
      this.selectedMonth = Number(dayjs.unix(this.birthDay).format('MM'));
      this.selectedDay = Number(dayjs.unix(this.birthDay).format('DD'));
    },
    changeBirthDay() {
      if (
        this.selectedYear !== 0 &&
        this.selectedMonth !== 0 &&
        this.selectedDay !== 0
      ) {
        // unixに変換するために文字列に変換する
        const birthDay =
          `${String(this.selectedYear)}-` +
          `${String(this.selectedMonth)}-${String(this.selectedDay)}`;
        this.birthDay = dayjs(birthDay)
          .add(1, 'd')
          .unix();
      }
    },
    async fetchLanguages() {
      try {
        const { data } = await fetchEmployeeLanguages();
        this.languages = data;
      } catch (e) {
        alert('仕様言語一覧を取得できませんでした。');
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(45deg, #e39999, #8a8faf);
}

.pageError {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 557px;
  height: 384px;
  padding: 13px 30px 31px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
  padding: 27px 30px 31px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
}

.birthday-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.birth-word {
  font-size: 15px;
  color: #fff;
  margin: 0 2px;
}

.birthday-select {
  flex: 1;
}

.input-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 0 15px 0;
}

.profile-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.logo-profile {
  width: 100px;
  margin-bottom: 10px;
}

.profile-description {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}

.upload-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 24px;
  background-color: rgba(126, 129, 149, 0.2);
  margin: 0 auto;
}

.delete-icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #7e8195;
  top: -7px;
  right: -7px;
}

.upload-icon {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 24px;
  object-fit: cover;
}

.white-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #fff;
  opacity: 1;
}

.camera-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #e4e5ed;
  right: -7px;
  bottom: -7px;
}

.icon-cross {
  width: 10px;
  height: 10px;
  object-fit: cover;
}

.input {
  height: 40px;
  width: 100%;
  background-color: #fafbff;
  border: 1px solid #e4e5ed;
  border-radius: 4px;
  font-size: 15px;
  color: #6a6d83;
  padding: 0 11px;
  filter: none;
}

input:-internal-autofill-selected {
  -webkit-text-fill-color: #6a6d83 !important;
  box-shadow: 0 0 0 999px #fafbff inset !important;
}

.next-button {
  width: 100%;
  height: 44px;
  text-align: center;
  border: none;
  background-color: #7e8195;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  border-radius: 4px;
  margin: 0 0 15px 0;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.form-top-text {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  font-size: 15px;
  letter-spacing: 0;
  color: #fff;
  margin: 0 0 13px 0;
}

.logo {
  width: 113px;
  margin-bottom: 28px;
}

.logo-error {
  width: 113px;
  margin-top: 20px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 24px;

  &-word {
    font-size: 15px;
    font-weight: 300;
    margin-left: 4px;
  }
}

.label {
  font-weight: 300;
  font-size: 13px;
  letter-spacing: 0;
  color: #fff;
  margin: 0 0 6px 0;

  &.password-requirement {
    font-weight: bold;
    width: 100%;
    margin-bottom: 15px;
  }
}

.radio-buttons {
  margin-bottom: 18px;
}

.input-error {
  background-color: #faf0f0;
  border: 1px solid #ffb4b4;
}

.modal-mask {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-wrapper {
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
}

.modal-body {
  padding-bottom: 8px;
}

.modal-default-button {
  display: block;
  margin: 0 0 0 auto;
}

.bottom-text {
  color: #fff;
  font-size: 24px;
  font-weight: 300;
  align-items: center;
}

.message-content {
  display: flex;
  height: auto;
  flex-direction: column;
  align-items: center;
  margin: 70px auto;
}
</style>
