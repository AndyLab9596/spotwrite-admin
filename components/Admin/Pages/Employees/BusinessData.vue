<template>
  <div class="form-contents">
    <div v-show="!isLoading">
      <ValidationObserver v-slot="{ errors }">
        <form class="form">
          <div class="select-box contents-top-item">
            <label class="label">在籍状況</label>
            <select
              v-model="input.enrollment_status"
              class="select enrollment"
              :disabled="inputDisabled"
              label="name"
            >
              <option
                v-for="status in enrollmentStatuses"
                :key="status.key"
                :value="status.key"
                >{{ status.name }}</option
              >
            </select>
          </div>
          <div class="contents">
            <div class="block-title">
              <div class="label">必須項目</div>
              <div class="note">※管理者のみの入力項目です</div>
            </div>
            <div class="content-block">
              <div class="form-inline">
                <validation-provider
                  v-slot="name"
                  rules="required"
                  name="氏名"
                  class="validation"
                >
                  <div class="select-box">
                    <label class="label">氏名</label>
                    <input
                      id="name"
                      v-model="input.name"
                      class="input"
                      :disabled="inputDisabled"
                      :class="{ 'input-error': name.errors[0] || !input.name }"
                      label="name"
                      placeholder="例）山田太郎"
                      @input="onNameInput"
                    />
                  </div>
                </validation-provider>
                <validation-provider
                  v-slot="kana"
                  rules="required|isHiragana"
                  name="ふりがな"
                  class="validation"
                >
                  <div class="select-box">
                    <label class="label">ふりがな</label>
                    <input
                      id="kana"
                      v-model="input.name_kana"
                      type="text"
                      placeholder="例）やまだたろう"
                      :disabled="inputDisabled"
                      class="input"
                      :class="{
                        'input-error': kana.errors[0] || !input.name_kana,
                      }"
                    />
                  </div>
                </validation-provider>
              </div>
              <div class="select-box form-item">
                <label class="label">所属組織(BOX)</label>
                <div class="select-row">
                  <validation-provider
                    v-slot="company"
                    rules="required"
                    name="会社"
                    class="validation"
                  >
                    <div class="select-item-medium">
                      <label class="sub-label">会社</label>
                      <select
                        v-model="mainCompany"
                        class="select input-medium gap"
                        label="name"
                        :disabled="inputDisabled"
                        :class="{ 'input-error': company.errors[0] }"
                        @change="onMainCompanyChange"
                      >
                        <option value="">選択してください。</option>
                        <option
                          v-for="co in companies"
                          :key="co.uuid"
                          :value="co"
                        >
                          {{ co.name }}
                        </option>
                      </select>
                    </div>
                  </validation-provider>
                  <validation-provider
                    v-slot="store"
                    rules="required"
                    name="部署・支店・店舗"
                    class="grow validation"
                  >
                    <div class="select-item-medium">
                      <label class="sub-label main-organization-label gap"
                        >組織<br />(BOX)</label
                      >
                      <select
                        v-model="input.organization"
                        class="select input-medium main-organization gap"
                        label="name"
                        :disabled="inputDisabled"
                        :class="{
                          'input-error': store.errors[0] || !input.organization,
                        }"
                        @change="onChangeMainOrganization()"
                      >
                        <option value="">選択してください。</option>
                        <option
                          v-for="mainDivision in mainDivisions"
                          :key="mainDivision.uuid"
                          :value="mainDivision.uuid"
                          >{{ mainDivision.name }}</option
                        >
                      </select>
                      <base-button
                        class="create-box-button grow"
                        size="large"
                        :disabled="inputDisabled"
                        @click="onPressBoxCreate"
                      >
                        組織（BOX）作成する
                      </base-button>
                    </div>
                  </validation-provider>
                </div>
              </div>
              <validation-provider
                v-slot="position"
                rules="required"
                name="役職"
                class="validation"
              >
                <div class="select-box form-item position-input">
                  <label class="label">役職</label>
                  <select
                    v-model="input.employment_position"
                    class="select"
                    label="name"
                    :options="positions"
                    :disabled="inputDisabled"
                    :class="{
                      'input-error':
                        position.errors[0] || !input.employment_position,
                    }"
                  >
                    <option value="">選択してください。</option>
                    <option
                      v-for="pos in positions"
                      :key="pos.uuid"
                      :value="pos.uuid"
                      >{{
                        pos.display_name ? pos.display_name : pos.name
                      }}</option
                    >
                  </select>
                </div>
              </validation-provider>
              <validation-provider
                v-slot="employmentStatus"
                rules="required"
                name="雇用形態"
                class="validation"
              >
                <div class="select-box form-item employment-status-input">
                  <label class="label">雇用形態</label>
                  <select
                    v-model="input.employment_status"
                    class="select"
                    label="name"
                    :disabled="inputDisabled"
                    :class="{
                      'input-error':
                        employmentStatus.errors[0] || !input.employment_status,
                    }"
                  >
                    <option value="">選択してください。</option>
                    <option
                      v-for="status in employmentStatuses"
                      :key="status.uuid"
                      :value="status.uuid"
                      >{{ status.name }}</option
                    >
                  </select>
                </div>
              </validation-provider>
              <validation-provider
                v-slot="access_permission"
                rules="required"
                name="利用権限"
                class="validation"
              >
                <div class="select-box form-item access-permission-input">
                  <label class="label">利用権限</label>
                  <select
                    v-model="input.access_permission"
                    class="select"
                    :disabled="inputDisabled"
                    :class="{
                      'input-error':
                        access_permission.errors[0] || !input.access_permission,
                    }"
                    label="name"
                  >
                    <option value="">選択してください。</option>
                    <option
                      v-for="accessPermission in enumAccessPermissions"
                      :key="accessPermission.key"
                      :value="accessPermission.key"
                    >
                      {{ accessPermission.name }}
                    </option>
                  </select>
                  <span class="option-help" @click="toggleAuthorityModal"
                    ><svg
                      id="Icon_help"
                      data-name="Icon/help"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                    >
                      <g id="Path_789" data-name="Path 789" fill="none">
                        <path
                          d="M8,0A8,8,0,1,1,0,8,8,8,0,0,1,8,0Z"
                          stroke="none"
                        />
                        <path
                          d="M 8 1 C 4.140190124511719 1 1 4.140190124511719 1 8 C 1 11.85980987548828 4.140190124511719 15 8 15 C 11.85980987548828 15 15 11.85980987548828 15 8 C 15 4.140190124511719 11.85980987548828 1 8 1 M 8 0 C 12.41827964782715 0 16 3.581720352172852 16 8 C 16 12.41827964782715 12.41827964782715 16 8 16 C 3.581720352172852 16 0 12.41827964782715 0 8 C 0 3.581720352172852 3.581720352172852 0 8 0 Z"
                          stroke="none"
                          fill="#7e8195"
                        />
                      </g>
                      <g
                        id="Group_1435"
                        data-name="Group 1435"
                        transform="translate(-150 -294)"
                      >
                        <line
                          id="Line_401"
                          data-name="Line 401"
                          y2="5.154"
                          transform="translate(158 297.426)"
                          fill="none"
                          stroke="#7e8195"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1"
                        />
                        <circle
                          id="Ellipse_231"
                          data-name="Ellipse 231"
                          cx="0.902"
                          cy="0.902"
                          r="0.902"
                          transform="translate(157.098 304.77)"
                          fill="#7e8195"
                        />
                      </g>
                    </svg>
                    <a class="about-authority" role="button">利用権限とは？</a>
                    <authority-modal
                      v-if="authorityModal"
                      class="authority-modal"
                      @close="toggleAuthorityModal"
                    />
                  </span>
                </div>
              </validation-provider>
              <div class="select-box form-item sub-organization-box">
                <label class="label">サブ組織（BOX）</label>
                <div class="right">
                  <div class="select-row-column">
                    <div class="select-item-medium">
                      <label class="sub-label  sub-organization">会社</label>
                      <select
                        v-model="subCompany"
                        class="select input-medium organization-select"
                        :disabled="inputDisabled"
                        label="name"
                        @change="changeSubCompany"
                      >
                        <option value=""></option>
                        <option
                          v-for="company in companies"
                          :key="company.uuid"
                          :value="company"
                        >
                          {{ company.name }}
                        </option>
                      </select>
                    </div>
                    <div class="select-item-medium">
                      <label class="sub-label sub-organization"
                        >組織<br />(BOX)</label
                      >
                      <select
                        v-model="selectedSubOrganization"
                        class="select input-medium organization-select"
                        :disabled="inputDisabled"
                        label="name"
                      >
                        <option value=""></option>
                        <option
                          v-for="subDivision in subDivisions"
                          :key="subDivision.uuid"
                          :value="subDivision"
                        >
                          {{ subDivision.name }}
                        </option>
                      </select>
                    </div>
                    <add-button
                      class="add-button"
                      :disabled="
                        subCompany === '' || selectedSubOrganization === ''
                      "
                      :is-disabled="
                        subCompany === '' || selectedSubOrganization === ''
                      "
                      @click="addSubOrganization"
                    >
                      追加
                    </add-button>
                  </div>
                  <hr class="vertical" />
                  <div class="grow">
                    <div class="list-box-title">選択したサブ組織（BOX）</div>
                    <ul class="list-box grow">
                      <li v-if="!subOrganizations.length">なし</li>
                      <li
                        v-for="so in subOrganizations"
                        :key="so.uuid"
                        class="list-item"
                      >
                        {{ getCompanyByUuid(so.relations.company).name }} |
                        {{ so.name }}
                        <img
                          v-if="!inputDisabled"
                          src="/icon/icon_delete.svg"
                          @click="removeSubOrganization(so)"
                        />
                      </li>
                    </ul>
                  </div>
                  <div class="note">
                    ※メイン以外に所属している組織、もしくは関わっている組織を登録出来ます。
                  </div>
                </div>
              </div>
            </div>
            <div class="block-title">
              <div class="label">追加項目</div>
              <div class="note">
                ※管理者とメンバー双方から入力可能な項目です
              </div>
            </div>
            <div class="content-block">
              <div class="select-box form-item language-box">
                <label class="label">使用言語</label>
                <div class="select-row">
                  <select
                    v-model="input.language"
                    class="select"
                    :disabled="inputDisabled"
                  >
                    <option value="">選択してください。</option>
                    <option
                      v-for="language in languages"
                      :key="language.code"
                      :value="language.code"
                      :disabled="isDisabledLanguageSelectItem(language.code)"
                    >
                      {{ language.name }}
                    </option>
                  </select>
                  <div class="sub-label">その他の言語</div>
                  <div class="sub-languages-box">
                    <validation-provider
                      v-for="(subLanguage, index) in input.sub_languages"
                      :key="index"
                    >
                      <select
                        :key="index"
                        v-model="input.sub_languages[index]"
                        class="select"
                        :disabled="inputDisabled"
                      >
                        <option value="">選択してください。</option>
                        <option
                          v-for="language in languages"
                          :key="language.code"
                          :value="language.code"
                          :disabled="
                            isDisabledSubLanguageSelectItem(
                              language.code,
                              index
                            )
                          "
                        >
                          {{ language.name }}
                        </option>
                      </select>
                    </validation-provider>
                  </div>
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
              <div class="select-box form-item">
                <label class="label">入社年</label>
                <div class="select-row">
                  <div class="select-item-small">
                    <select
                      v-model="input.joined_year"
                      class="select select_joined-year"
                      :disabled="inputDisabled"
                    >
                      <option value="">選択してください。</option>

                      <option v-for="year in years" :key="year" :value="year">
                        {{ year }}
                      </option>
                    </select>
                    <label class="sub-label date-label">年</label>
                  </div>
                  <div class="select-item-small">
                    <select
                      v-model="input.joined_month"
                      class="select select_joined-month"
                      :disabled="inputDisabled"
                      :options="months"
                    >
                      <option value="">選択してください。</option>
                      <option
                        v-for="month in months"
                        :key="month"
                        :value="month"
                      >
                        {{ month.toString().padStart(2, '0') }}
                      </option>
                    </select>
                    <label class="sub-label date-label">月</label>
                  </div>
                </div>
              </div>
              <div class="input-box  form-item">
                <label class="label">社用電話番号</label>
                <ValidationProvider
                  v-slot="companyTel"
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
                  <span class="error-message">{{ companyTel.errors[0] }}</span>
                </ValidationProvider>
              </div>
              <div class="input-box  form-item">
                <label class="label">内線番号</label>
                <label>
                  <ValidationProvider
                    v-slot="internalTel"
                    rules="max:20"
                    name="内線番号"
                    vid="internal_tel"
                    class="full"
                  >
                    <input
                      v-model="input.internal_tel"
                      type="text"
                      class="input input_internal-tel"
                      :disabled="inputDisabled"
                      placeholder="例）012"
                    />
                    <span class="error-message">{{
                      internalTel.errors[0]
                    }}</span>
                  </ValidationProvider>
                </label>
              </div>
              <div class="button-box form-item">
                <label class="label">オプション権限</label>
                <base-button
                  size="large"
                  class="setting-button"
                  :disabled="inputDisabled"
                  @click="toggleOptionAuthorityModal()"
                >
                  オプション権限を設定する
                </base-button>
              </div>
            </div>
            <!--              :disabled="isError(errors) || isSending || inputDisabled"-->
            <base-button
              size="large"
              class="option-button form-item"
              :disabled="isError(errors)"
              @click="onSubmit"
            >
              更新する
            </base-button>
          </div>
        </form>
      </ValidationObserver>
      <box-create-modal
        v-if="showBoxCreateModal"
        :companies="companies"
        @close="showBoxCreateModal = false"
        @select-after-creating-organization="selectAfterCreatingOrganization"
        @add-created-organization-to-organizations="
          addCreatedOrganizationToOrganizations
        "
      />
      <option-authority-modal
        v-if="showOptionAuthorityModal"
        :organizations="companies"
        :authorities="authorities"
        :fixed="true"
        class="option-authority-modal"
        @save="saveOptionAuthority"
        @close="closeOptionAuthorityModal"
      />
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
import * as AutoKana from 'vanilla-autokana';
import {
  fetchUser,
  updateUser,
  fetchEmploymentStatus,
  fetchOrganizations,
  fetchOrganizationPositions,
  fetchLanguages,
  updateAuthorities,
  fetchUserProfile,
} from '@/libs/api';
import BoxCreateModal from '@/components/Admin/Pages/Employees/BoxCreateModal.vue';
import OptionAuthorityModal from '@/components/Admin/Pages/AuthoritySetting/OptionAuthorityModal.vue';
import AuthorityModal from '@/components/Admin/Pages/Employees/AuthorityModal.vue';
import SuccessMessage from '@/components/Admin/Modules/Modal/SuccessMessage.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import AddButton from '@/components/Admin/Pages/CommunityManagement/AddButton.vue';
import { enumAccessPermissions } from '@/libs/definition';

export default Vue.extend({
  components: {
    VueLoading,
    ValidationObserver,
    ValidationProvider,
    BoxCreateModal,
    OptionAuthorityModal,
    AuthorityModal,
    SuccessMessage,
    BaseButton,
    AddButton,
  },
  props: {
    companyUuid: {
      type: String,
      required: true,
      default: '',
    },
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
      isSending: false as boolean,
      isLoading: false as boolean,
      successMessageModal: false as boolean,
      showOptionAuthorityModal: false as boolean,
      showLanguageCreateModal: false as boolean,
      showBoxCreateModal: false as boolean,
      authorityModal: false as boolean,
      organizations: [] as ApiResponse.GroupOrganization[],
      autokana: undefined as AutoKana.AutoKana | undefined,
      mainCompany: {} as ApiResponse.GroupOrganization,
      subCompany: {} as ApiResponse.GroupOrganization,
      selectedSubOrganization: {} as ApiResponse.GroupOrganization,
      subOrganizations: [] as ApiResponse.GroupOrganization[],
      input: {
        sub_languages: [''] as string[],
      } as ApiResponse.fetchUser,
      companies: [] as ApiResponse.GroupOrganization[],
      mainOrganization: [] as ApiResponse.GroupOrganization[],
      employmentStatuses: [],
      positions: [] as ApiResponse.Position[],
      years: [] as number[],
      months: [] as number[],
      languages: [] as ApiResponse.Language[],
    };
  },
  computed: {
    enrollmentStatuses() {
      return [
        { key: 'currently_enrolled', name: '在籍中' },
        { key: 'on_leave', name: '休職中' },
        { key: 'retirement', name: '退職' },
      ];
    },
    mainDivisions(): ApiResponse.GroupOrganization[] {
      const divisions = this.organizations.filter(
        (organization: ApiResponse.GroupOrganization) =>
          organization.relations.company === this.mainCompany.uuid
      );
      const independentIndex = divisions.findIndex(
        (n: ApiResponse.Organization) => n.type === 'independent'
      );
      if (independentIndex > -1) {
        const independent = divisions[independentIndex];
        divisions.splice(independentIndex, 1);
        divisions.push(independent);
      }
      return divisions;
    },
    subDivisions(): ApiResponse.GroupOrganization[] {
      if (this.subCompany === '') {
        return [];
      }
      return this.organizations.filter(
        (organization: ApiResponse.GroupOrganization) =>
          organization.relations.company === this.subCompany.uuid &&
          organization.uuid !== this.input.organization
      );
    },
    enumAccessPermissions(): object {
      return enumAccessPermissions;
    },
    authorities(): object {
      return {
        admin: this.input.authorities.admin,
        readUsageCheck: this.input.authorities.read_usage_check,
        readMotivationAnalytics: this.input.authorities
          .read_motivation_analytics,
        readPersonalInformation: this.input.authorities
          .read_personal_information
          ? ['default']
          : [],
      };
    },
    inputDisabled(): boolean {
      let enable = false;
      if (this.$store.getters.userProfile.is_account_holder) {
        enable = true;
      }
      if (this.userAuthorities && this.userAuthorities.length) {
        enable = this.userAuthorities.includes('admin');
      }
      return !enable;
    },
    isDisabledLanguageSelectItem(): boolean {
      return (languageCode: string) => {
        return this.input.sub_languages.includes(languageCode);
      };
    },
    isDisabledSubLanguageSelectItem(): boolean {
      return (languageCode: string, index: number) => {
        return (
          languageCode === this.input.language ||
          this.input.sub_languages.find(
            (subLanguageCode: string, subIndex: number) =>
              subLanguageCode === languageCode && subIndex !== index
          )
        );
      };
    },
  },
  async mounted() {
    // createdでAPIを叩くとローディング終了を待たずにmountedへ行ってしまってDOMがしぬのでmountedでAPIを叩いている
    this.setDate();
    this.isLoading = true;
    // 組織一覧取得
    const { data: organizationsData } = await fetchOrganizations({
      independent: 'true',
    });
    this.organizations = organizationsData.organizations;
    // 会社一覧
    this.companies = this.organizations.filter(
      (n: ApiResponse.GroupOrganization) => n.layer === 0
    );
    // 役職一覧
    const { data: positionsData } = await fetchOrganizationPositions();
    this.positions = positionsData;
    // 雇用形態一覧取得
    const { data: employmentStatusData } = await fetchEmploymentStatus();
    this.employmentStatuses = employmentStatusData;
    // 言語のリストを取得する
    const { data: languages } = await fetchLanguages();
    this.languages = languages;

    this.subCompany = '';
    this.selectedSubOrganization = '';

    const { data: userData } = await fetchUser(this.userUuid);
    this.input = userData;
    if (this.input.language == null) {
      this.input.language = '';
    }
    if (!this.input.sub_languages || !this.input.sub_languages.length) {
      this.input.sub_languages = [''];
    }
    // 登録されているメイン組織（部署・支店・店舗）
    const userMainDivision = this.organizations.find(
      (organization: ApiResponse.GroupOrganization) =>
        organization.uuid === this.input.organization
    );
    // 登録されているメイン組織UUID（部署・支店・店舗）
    // @ts-ignore
    this.input.organization = userMainDivision.uuid;
    // 登録されているメイン会社
    // @ts-ignore
    this.mainCompany = this.organizations.find(
      (organization: ApiResponse.GroupOrganization) =>
        // @ts-ignore
        organization.uuid === userMainDivision.relations.company
    );
    // 登録されているサブ組織（部署・支店・店舗）
    this.subOrganizations = this.organizations.filter(
      (organization: ApiResponse.GroupOrganization) => {
        return this.input.sub_organizations.some(
          (so: string) => so === organization.uuid
        );
      }
    );

    try {
      this.autokana = AutoKana.bind('#name', '#kana');
    } catch (e) {
      console.log(e);
    }
    this.isLoading = false;
  },
  methods: {
    async selectAfterCreatingOrganization(
      createdOrganization: ApiResponse.GroupOrganization
    ) {
      this.addCreatedOrganizationToOrganizations(createdOrganization);
      this.input.organization = createdOrganization.uuid;
      this.mainCompany = this.organizations.find(
        (organization: ApiResponse.GroupOrganization) =>
          // @ts-ignore
          organization.uuid === createdOrganization.relations.company
      )!;
    },
    addCreatedOrganizationToOrganizations(
      createdOrganization: ApiResponse.GroupOrganization
    ) {
      this.organizations.push(createdOrganization);
    },
    async selectAfterCreatingLanguage(createdLanguage: ApiResponse.Language) {
      this.addCreatedLanguageToLanguages(createdLanguage);
      this.input.language = createdLanguage.code;
    },
    addCreatedLanguageToLanguages(createdLanguage: ApiResponse.Language) {
      this.languages.push(createdLanguage);
    },
    onNameInput(): void {
      if (this.autokana === undefined) {
        return;
      }
      this.input.name_kana = this.autokana.getFurigana();
    },
    onMainCompanyChange(): void {
      if (
        this.input.organization !== '' &&
        !this.mainDivisions
          .map((mainDivision: object) => mainDivision.uuid)
          .includes(this.input.organization)
      ) {
        this.input.organization = '';
      }
    },
    addSubOrganization() {
      const duplicateOrganization = this.subOrganizations.find(
        (organization: ApiResponse.GroupOrganization) =>
          organization.uuid === this.selectedSubOrganization.uuid
      );

      if (this.input.organization === this.selectedSubOrganization.uuid) {
        alert('メイン組織と同じ組織はサブ組織に追加できません');
        return;
      }
      if (duplicateOrganization !== undefined) {
        alert('既に追加済みのサブ組織は追加できません');
        return;
      }
      this.subOrganizations.push(this.selectedSubOrganization);
      this.subCompany = '';
      this.selectedSubOrganization = '';
    },
    removeSubOrganization(organization: ApiResponse.GroupOrganization) {
      this.subOrganizations = this.subOrganizations.filter(
        (subOrganization: ApiResponse.GroupOrganization) =>
          organization.uuid !== subOrganization.uuid
      );
    },
    isError(errors: object) {
      const error =
        !this.input.name ||
        !this.input.name_kana ||
        !this.input.organization ||
        !this.input.employment_position ||
        !this.input.employment_status ||
        !this.input.access_permission ||
        !this.input.email;
      return (
        error ||
        !!Object.values(errors).filter(
          (errorList: string[]) => !!errorList.length
        ).length
      );
    },
    onSubmit() {
      this.isSending = true;
      this.updateUser();
      this.isSending = false;
    },
    async updateUser() {
      this.input.sub_organizations = this.subOrganizations.map(
        (organization: ApiResponse.GroupOrganization) => organization.uuid
      );
      this.input.sub_languages = this.input.sub_languages.filter(
        (subLanguage: string) => subLanguage.length
      );
      try {
        this.input.is_registered_additional = true;
        await updateUser(this.userUuid, this.input);
        this.toggleSuccessMessageModal();
      } catch (e) {
        alert('ユーザーの登録に失敗しました');
      } finally {
        if (!this.$accessor.userProfile.is_account_holder) {
          // INFO: Vuexに保持している自分の情報を更新するために再度API叩いている
          const { data: userProfile } = await fetchUserProfile();
          this.$accessor.setUserProfile(userProfile);
        }
        this.isSending = false;
      }
    },
    toggleOptionAuthorityModal() {
      this.showOptionAuthorityModal = true;
    },
    closeOptionAuthorityModal() {
      this.showOptionAuthorityModal = false;
    },
    saveOptionAuthority(authorities: UserAuthorities) {
      try {
        this.input.authorities = authorities;
        const payload = {
          users: [this.userUuid],
          authorities: this.input.authorities,
        };
        updateAuthorities(payload);
        this.showOptionAuthorityModal = false;
      } catch (e) {
        console.error(e);
      }
    },
    toggleAuthorityModal() {
      this.authorityModal = !this.authorityModal;
    },
    toggleSuccessMessageModal() {
      this.successMessageModal = !this.successMessageModal;
    },
    onChangeMainOrganization() {
      this.subOrganizations = this.subOrganizations.filter(
        (organization: ApiResponse.GroupOrganization) =>
          organization.uuid !== this.input.organization
      );
    },
    setDate() {
      // 年
      const nowYear = dayjs().year();
      this.years = [...Array(100).keys()].map((i: number) => nowYear - i);
      // 月
      for (let i = 1; i <= 12; i += 1) {
        this.months.push(i);
      }
    },
    onPressLanguageCreate() {
      this.showLanguageCreateModal = true;
    },
    onPressBoxCreate() {
      this.showBoxCreateModal = true;
    },
    getCompanyByUuid(uuid: string) {
      return (
        this.companies
          .filter(
            (company: ApiResponse.GroupOrganization) => company.uuid === uuid
          )
          .pop() ?? {}
      );
    },
    changeSubCompany() {
      if (!this.subDivisions.includes(this.selectedSubOrganization)) {
        this.selectedSubOrganization = '';
      }
    },
    addLanguage() {
      this.input.sub_languages.push('');
    },
  },
});
</script>

<style lang="scss" scoped>
.contents {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 15px;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-item {
  margin-top: 30px;

  &:first-child {
    margin-top: 0;
  }
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

.validation {
  position: relative;

  .company-name {
    position: absolute;
    top: 45px;
    left: 45px;
  }

  .organization-name {
    position: absolute;
    top: 45px;
    left: 150px;
  }
}

.label {
  flex-shrink: 0;
  width: 180px;
  font-weight: bold;
}

.block-title {
  display: flex;
  align-items: flex-end;
  height: 50px;

  .label {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 180px;
    background: #f7f8fd;
    border: solid $light_gray_blue_3;
    border-width: 1px 1px 0;
    border-radius: 4px 4px 0 0;
  }

  .note {
    margin-left: 20px;
  }
}

.input {
  color: $gray_blue_4;
  flex: 1;
  height: 40px;
  background-color: $true_white;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  padding: 0 8px;

  &::placeholder {
    color: $placeholder_gray;
  }

  &_internal-tel {
    width: 200px;
  }

  & + .note {
    margin-top: 10px;
    font-size: 13px;
  }
}

.select {
  color: $gray_blue_4;
  height: 40px;
  background-color: $true_white;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;

  &:not(input) {
    -webkit-appearance: none;
    -moz-appearance: none;
    padding: 0 26px 0 8px;
    background-image: url('/icon/icon_caret-down.svg');
    background-repeat: no-repeat;
    background-position: calc(100% - 8px) center;
  }

  &_joined-year {
    width: 150px;
  }

  &_joined-month {
    width: 150px;
  }

  &::placeholder {
    color: $placeholder_gray;
  }
}

.select-row {
  display: flex;
  flex-direction: row;
  width: 100%;

  span {
    margin-left: 0;
  }
}

.sub-label {
  &.sub-organization {
    width: 85px;
  }
}

.select-box {
  display: flex;
  flex-direction: row;
  align-items: center;

  &.position-input {
    margin-top: 30px;
  }

  &.employment-status-input {
    margin-top: 30px;
  }

  &.access-permission-input {
    margin-top: 30px;
  }

  &.language-box {
    .select-row {
      align-items: center;
      flex-wrap: wrap;

      .select {
        width: 180px;
      }

      .sub-label {
        margin-left: 30px;
        margin-right: 20px;
      }

      .button {
        margin-left: 15px;
      }

      .sub-languages-box {
        display: flex;
        flex-direction: column;
      }
    }
  }

  &.sub-organization-box {
    align-items: flex-start;

    .right {
      display: flex;
      flex-wrap: wrap;

      hr {
        border-color: $light_gray_blue_3;
        border-width: 0 1px 0 0;
        margin-left: 20px;
        margin-right: 20px;
      }

      .note {
        margin-top: 10px;
        width: 100%;
        font-size: 13px;
      }
    }
  }
}

.note--language-box {
  margin-top: 10px;
  padding-left: 180px;
  width: 100%;
  font-size: 13px;
}

.button-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.textarea-box {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.input-file-box {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.textarea {
  flex: 1;
  height: 120px;
}

.submit-button {
  width: 200px;
  height: 40px;
  cursor: pointer;
  margin: 40px auto;
}

.delete-link {
  text-align: center;
  margin: 18px auto 30px;
  cursor: pointer;
}

.select-row-column {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.select-item-medium {
  display: flex;
  flex-direction: row;
  align-items: center;

  + .select-item-medium {
    margin-top: 15px;
  }
}

.select-item-small {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
}

.setting-button {
  max-width: 300px;
}

.input-medium {
  max-width: 300px;
  width: 210px;
}

.option-help {
  display: flex;
  align-items: center;
  margin-left: 15px;
  font-size: 12px;
  cursor: pointer;
  position: relative;

  a {
    margin-left: 5px;
  }

  .authority-modal {
    position: absolute;
    top: 25px;
    left: 0;
    z-index: 999;
  }
}

.add-button {
  width: 70px;
  margin-top: 15px;
}

.option-button {
  width: 200px;
  margin-left: auto;
  margin-right: auto;
}

.list-box-title {
  font-size: 13px;
  line-height: 20px;
  margin-bottom: 6px;
}

.list-box {
  width: 100%;
  height: 120px;
  overflow-y: scroll;
  background: $true_white;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  padding: 14px 17px;
  scrollbar-width: thin;
  scrollbar-color: #7e8195 white;

  .list-item {
    position: relative;
    padding-right: 20px;
    line-height: 24px;

    img {
      position: absolute;
      top: 4px;
      right: 0;
      height: 16px;
      cursor: pointer;
    }
  }
}

.list-box::-webkit-scrollbar {
  width: 4px;
  height: 0;
}

.list-box::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #7e8195;
}

.arrow-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 96px;
  font-size: 30px;
  color: #7f828b;
}

.contents-top-item {
  margin-left: 30px;
  margin-top: 15px;
  width: 300px;

  label {
    width: 60px;
  }
}

.form-contents {
  color: $dark_blue;
  font-size: 15px;
}

.required {
  color: $gray_blue_1;
  font-size: 13px;
  margin-left: 8px;
}

.create-box-button {
  margin-left: 15px;
}

.grow {
  flex-grow: 1;
}

.date-label {
  margin-left: 20px;
}

.about-authority {
  color: $pink;
  font-size: 13px;

  &:hover {
    color: $pink-hover;
  }
}

.gap {
  margin-left: 10px;
}

.input-error {
  background-color: $light_pink_1;
  border: solid 1px $pink;
}

.enrollment {
  height: 30px;
  width: 120px;
  margin-left: 15px;
}

.organization-select {
  width: 230px;
}

.content-block {
  border: solid 1px $light_gray_blue_3;
  border-radius: 0 0 4px 4px;
  padding: 30px;
  background: #f7f8fd;

  & + .block-title {
    margin-top: 40px;
  }

  .form-inline {
    display: flex;

    .validation {
      width: calc((100% - 20px) / 2);

      & + .validation {
        margin-left: 20px;
      }
    }
  }

  [disabled] {
    background: #f3f3f3;
    border-color: #e8ebed;
    color: #bebebe;
  }
}

.option-authority-modal {
  overflow: scroll;
  height: 95%;
  z-index: 99;
}

.error-message {
  color: $red;
}
</style>
