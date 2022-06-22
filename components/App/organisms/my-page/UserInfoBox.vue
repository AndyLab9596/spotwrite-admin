<template>
  <div class="user-info-container">
    <div class="user-info-header-container">
      <img src="/app/icon/profile.svg" class="profile-icon" alt="" />
      <div class="links">
        <div class="links-item" @click="openProfile">
          <icon name="pencil" class="icon" />プロフィール編集
        </div>
        <div class="links-item" @click="openPasswordChange">
          <icon name="rock" class="icon" />パスワード変更
        </div>
      </div>
      <img :src="userInfo.user_icon" class="avatar-icon" alt="" />
      <div class="user-basic-info-container">
        <div class="name">
          {{ userInfo.name }}
          <div class="line"></div>
        </div>
        <div class="joined-date">
          {{ userInfo.joined_year }}年{{ userInfo.joined_month }}月入社
        </div>
        <div v-if="bulletinBoard" class="enrollment-status">
          <status-info-labeled-text
            :label-color="userInfo.enrollment_color"
            :background-color="backgroundColor"
            class="enrollment-status-badge"
            >{{ userInfo.enrollment_text }}</status-info-labeled-text
          >
          <div>
            <div class="enrollment-name">
              {{ userInfo.enrollment_description }}
            </div>
            <div class="enrollment-edit" @click="openBulletinBoard">
              編集
            </div>
          </div>
        </div>
      </div>
      <div class="links-bottom">
        <div class="links-bottom-item" @click="goToProfile(userInfo.uuid)">
          <icon name="people_white_green" class="icon" :size="28" />
          <span class="profile-text">プロフィールを見る</span>
        </div>
      </div>
    </div>
    <div class="user-info-body-container">
      <template v-if="!isLoading">
        <answer-rate
          v-if="baseProfilePercent < 100"
          label="プロフィール回答率"
          :value="baseProfilePercent"
          class="answer-rate"
          @onClick="openProfile"
        />
        <answer-rate
          v-if="baseProfileQaPercent < 100"
          label="Q&A回答率"
          :value="baseProfileQaPercent"
          class="answer-rate"
          @onClick="openQAndA"
        />
      </template>
    </div>
    <profile-edit-modal
      v-if="profileEditModal"
      :selected-tab-id="profileEditSelectedTabId"
      :tab-items="profileEditTabItems"
      :user-info="userInfo"
      :profile="profile"
      :profile-qa="profileQa"
      :enrollment-status="enrollmentStatus"
      :languages="languages"
      :job-types="jobTypes"
      :organizations="organizations"
      @onClose="onClose"
      @onProfileSave="onProfileSaveModalClose"
      @onQAndASave="onQAndASaveModalClose"
      @onCangeTab="selectTab"
      @clickProfileContinued="clickProfileContinued"
      @clickQAndAContinued="clickQAndAContinued"
    />
    <bulletin-board-edit-modal
      v-if="bulletinBoardEditModal"
      :enrollment-status="enrollmentStatus"
      :enrollment-text="userInfo.enrollment_text"
      :enrollment-description="userInfo.enrollment_description"
      @close="closeBulletinBoard"
      @click="updateEnrollmentStatus"
    />
    <password-change-modal
      v-if="passwordChangeModal"
      :tab-items="profileEditTabItems"
      :user-info="userInfo"
      @onClose="closePasswordCange"
      @onPasswordSave="onPasswordChangeSaveModalClose"
    />
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import StatusInfoLabeledText from '../../molecules/texts/StatusInfoLabeledText.vue';
import Icon from '../../atoms/images/Icon.vue';
import AnswerRate from '../../molecules/answerRate/index.vue';
import ProfileEditModal from './ProfileEditModal.vue';
import BulletinBoardEditModal from './BulletinBoardEditModal.vue';
import {
  postQuestionAndAnswers,
  postProfile,
  fetchEnrollmentStatus,
  updateEnrollmentStatus,
  postPassword,
  fetchProfile,
  fetchQuestionAndAnswers,
  fetchLanguages,
  fetchJobTypes,
  fetchOrganizations,
} from '../../../../libs/api/app';
import { enumEnrollmentColors } from '../../../../libs/definition';
import passwordChangeModal from './PasswordChangeModal.vue';

export default Vue.extend({
  components: {
    StatusInfoLabeledText,
    AnswerRate,
    ProfileEditModal,
    BulletinBoardEditModal,
    passwordChangeModal,
    Icon,
  },
  props: {
    userInfo: {
      type: Object as PropType<ApiResponse.User>,
      required: true,
    },
    bulletinBoard: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      tabs: [
        {
          id: 'profile',
          name: 'プロフィール・配属履歴',
        },
        {
          id: 'qa',
          name: 'Q&A',
        },
        {
          id: 'my-episode',
          name: 'マイエピソード',
        },
        {
          id: 'communities',
          name: '参加コミュニティ',
        },
      ],
      profileEditModal: false as boolean,
      bulletinBoardEditModal: false as boolean,
      profileEditSelectedTabId: '1' as string,
      profileEditTabItems: [
        { id: '1', name: 'プロフィール' },
        { id: '2', name: 'Q&A' },
      ],
      enrollmentStatus: {} as AppApiResponse.EnrollmentStatus,
      passwordChangeModal: false as boolean,
      profile: {} as AppApiResponse.Profile,
      beforeEditProfile: {} as AppApiResponse.Profile,
      isLoading: false,
      profileQa: {} as AppApiResponse.ProfileQuestionAndAnswers,
      beforeEditProfileQa: {} as AppApiResponse.ProfileQuestionAndAnswers,
      languages: [] as AppApiResponse.Language[],
      jobTypes: [] as AppApiResponse.Job[],
      organizations: [] as AppApiResponse.Organization[],
      baseProfilePercent: {} as number,
      baseProfileQaPercent: {} as number,
    };
  },
  computed: {
    backgroundColor() {
      const findColor = enumEnrollmentColors.find(
        (item: string) => item.color === this.$props.userInfo.enrollment_color
      );
      return findColor ? findColor.background_color : '#FFFFFF';
    },
  },
  async created() {
    this.isLoading = true;
    this.fetchLanguages();
    this.fetchJobTypes();
    this.fetchOrganizations();
    await Promise.all([
      this.fetchEnrollmentStatus(),
      this.fetchProfile(),
      this.fetchQuestionAndAnswers(),
    ]);
    this.isLoading = false;
  },
  methods: {
    goMessageRoom() {
      // FIXME DMのAPIができたら向き先を差し替える
      this.$router.push({
        path: `/message/`,
      });
    },
    openBulletinBoard() {
      this.bulletinBoardEditModal = true;
    },
    closeBulletinBoard() {
      this.bulletinBoardEditModal = false;
    },
    closePasswordCange() {
      this.passwordChangeModal = false;
    },
    openProfile() {
      this.profileEditSelectedTabId = '1';
      this.profileEditModal = true;
    },
    openQAndA() {
      this.profileEditSelectedTabId = '2';
      this.profileEditModal = true;
    },
    openPasswordChange() {
      this.passwordChangeModal = true;
    },
    selectTab(id: string) {
      this.profileEditSelectedTabId = id;
    },
    onClose() {
      this.profile = cloneDeep(this.beforeEditProfile);
      this.profileQa = cloneDeep(this.beforeEditProfileQa);
      this.profileEditModal = false;
    },
    async closeModal(tabId: number) {
      await this.fetchProfile();
      if (tabId === 2) {
        await this.fetchQuestionAndAnswers();
      }
      this.profileEditModal = false;
    },
    async fetchEnrollmentStatus() {
      try {
        const { data } = await fetchEnrollmentStatus();
        this.enrollmentStatus = data;
      } catch (e) {
        alert('在籍情報を取得できませんでした。');
      }
    },
    async fetchProfile() {
      try {
        const { data } = await fetchProfile();
        this.profile = data;
        this.profile.birthplace_country =
          this.profile.birthplace_country ?? '日本';
        this.baseProfilePercent = this.calResponseRateProfile();
        this.beforeEditProfile = cloneDeep(this.profile);
      } catch (e) {
        // eslint-disable-next-line no-console
        alert('プロフィールの取得に失敗しました。');
      }
    },
    async fetchQuestionAndAnswers() {
      try {
        const { data } = await fetchQuestionAndAnswers();
        this.profileQa = {
          ...data,
          // @ts-ignore
          // answer.uuidはnullを持たないが、qa_free_questionsをv-forを回した時answer自体がnullだと落ちるため回避してる
          qa_free_questions: data.qa_free_questions.map(
            (item: AppApiResponse.ProfileQuestionnaireItem) => {
              return {
                uuid: item.uuid,
                content: item.content,
                answer: {
                  uuid: item.answer ? item.answer.uuid : null,
                  content: item.answer ? item.answer.content : null,
                },
              };
            }
          ),
        };
        this.baseProfileQaPercent = this.calResponseRateQuestion();
        this.beforeEditProfileQa = cloneDeep(this.profileQa);
      } catch (e) {
        // eslint-disable-next-line no-console
        alert('Q&Aの取得に失敗しました。');
      }
    },
    async fetchLanguages() {
      try {
        const { data } = await fetchLanguages();
        this.languages = data;
      } catch (e) {
        alert('仕様言語一覧を取得できませんでした。');
      }
    },
    async updateEnrollmentStatus(payload: AppApiRequest.EnrollmentStatus) {
      try {
        await updateEnrollmentStatus(this.$accessor.userProfile.uuid, payload);
        this.$accessor.setEnrollmentStatus(payload);
        this.closeBulletinBoard();
      } catch (e) {
        alert('在籍情報を更新できませんでした。');
      }
    },
    async fetchJobTypes() {
      try {
        const { data } = await fetchJobTypes();
        this.jobTypes = data.job_types;
      } catch (e) {
        // eslint-disable-next-line no-console
        alert('職種の取得に失敗しました。');
      }
    },
    async fetchOrganizations() {
      try {
        const { data } = await fetchOrganizations({
          users_list: false,
        });
        this.organizations = data.organizations;
      } catch (e) {
        // eslint-disable-next-line no-console
        alert('組織の取得に失敗しました。');
      }
    },
    async onProfileSaveModalClose(payload: AppApiRequest.Profile) {
      try {
        await postProfile(payload);
        this.$emit('fresh');
        this.closeModal(1);
      } catch (e) {
        alert('プロフィール情報を保存できませんでした。');
      }
    },
    async onQAndASaveModalClose({
      qaPayload,
      profilePayload,
    }: {
      qaPayload: AppApiRequest.ProfileQuestionAndAnswers;
      profilePayload: AppApiRequest.Profile;
    }) {
      await this.onQAndASave(qaPayload);
      await this.onProfileSave(profilePayload);
      this.$emit('fresh');
      this.closeModal(2);
    },
    goToProfile(uuid: string) {
      this.$router.push({
        path: `/users/${uuid}`,
      });
    },
    async onQAndASave(payload: AppApiRequest.ProfileQuestionAndAnswers) {
      try {
        await postQuestionAndAnswers(payload);
      } catch (e) {
        alert('Q&A情報を保存できませんでした。');
      }
    },
    async onProfileSave(payload: AppApiRequest.Profile) {
      try {
        await postProfile(payload);
      } catch (e) {
        alert('プロフィール情報を保存できませんでした。');
      }
    },
    async onPasswordChangeSaveModalClose(input: ApiRequest.UpdatePassword) {
      try {
        await postPassword(input);
        this.closePasswordCange();
        alert('パスワードの変更が完了しました');
      } catch (e) {
        alert('パスワードを変更できませんでした。');
      }
    },
    clickProfileContinued({
      qaPayload,
      profilePayload,
    }: {
      qaPayload: AppApiRequest.ProfileQuestionAndAnswers;
      profilePayload: AppApiRequest.Profile;
    }) {
      this.onQAndASave(qaPayload);
      this.onProfileSave(profilePayload);
      this.selectTab(this.profileEditTabItems[0].id);
      this.beforeEditProfile = cloneDeep(this.profile);
      this.beforeEditProfileQa = cloneDeep(this.profileQa);
      this.baseProfileQaPercent = this.calResponseRateQuestion();
      this.baseProfilePercent = this.calResponseRateProfile();
    },
    clickQAndAContinued(value: AppApiRequest.Profile) {
      this.onProfileSave(value);
      this.selectTab(this.profileEditTabItems[1].id);
      this.beforeEditProfile = cloneDeep(this.profile);
      this.beforeEditProfileQa = cloneDeep(this.profileQa);
      this.baseProfileQaPercent = this.calResponseRateQuestion();
      this.baseProfilePercent = this.calResponseRateProfile();
    },
    calResponseRateProfile(): number {
      let birthplaceAnswer =
        !!this.profile.birthplace_country && !!this.profile.birthplace_city;
      if (this.profile.birthplace_country === '日本') {
        birthplaceAnswer =
          !!this.profile.birthplace_country &&
          !!this.profile.birthplace_prefecture &&
          !!this.profile.birthplace_city;
      }

      if (!Object.keys(this.profile).length) return 0;
      const question = [
        !!this.profile.gender,
        !!this.profile.birthday,
        birthplaceAnswer,
        !!this.profile.joined_year && !!this.profile.joined_month,
        !!this.profile.main_language,
        ...this.profile.profile_free_questions.map(
          (item: AppApiResponse.profileFreeQuestions) => {
            return Object.keys(item.answer).length
              ? !!item.answer.content
              : false;
          }
        ),
      ];
      return Math.round(
        (question.filter((item: boolean) => item === true).length /
          question.length) *
          100
      );
    },
    calResponseRateQuestion(): number {
      if (!Object.keys(this.profileQa).length) return 0;
      const companyQuestions = Object.entries(this.profileQa.company_questions);

      const question = [
        ...companyQuestions.map((item: string[]) => item[1] != null),
        ...this.profileQa.qa_free_questions.map(
          (item: AppApiResponse.ProfileQuestionnaireItem) =>
            !!item.answer.content
        ),
      ];

      return Math.round(
        (question.filter((item: boolean) => item === true).length /
          question.length) *
          100
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.user-info-container {
  display: flex;
  flex-direction: column;
  min-width: 600px;
  width: 100%;
  background-color: $true-white;
  position: relative;

  .icon-edit {
    cursor: pointer;
    margin: 10px 8px 0 0;
  }

  .links {
    padding: 24px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 40px;
    font-size: 11px;
    color: $main_color;

    div + div {
      margin-left: 16px;
    }

    .icon {
      margin-right: 8px;
    }
  }

  .links-bottom {
    padding: 14px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 40px;
    font-size: 11px;
    color: $main_color;

    div + div {
      margin-left: 16px;
    }

    .icon {
      margin-right: 8px;
    }
  }

  .profile-icon {
    width: 41px;
    position: absolute;
    top: 6px;
    left: 8px;
  }
}

.avatar-icon {
  width: 100px;
  height: 100px;
  border-radius: 38px;
  box-shadow: 0 1px 3px $box-shadow;
  object-fit: cover;
}

.user-info-header-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  margin-bottom: 24px;
  padding: 0 0 16px 0;
  background: linear-gradient(267deg, #ffe0ba, #cddcfe);
  position: relative;
  border-radius: 4px 4px 0 0;

  .message-link {
    background: none;
    border: none;
    width: fit-content;
    height: fit-content;
    margin: 0;
    padding: 0;
    position: absolute;
    right: 40px;
    bottom: -20px;
  }
}

.user-basic-info-container {
  margin-left: 20px;

  .name {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 10px 0;
  }

  .line {
    width: inherit;
    margin: 8px 0 0;
    border-bottom: solid 1px #f88;
  }

  .joined-date {
    font-size: 11px;
    line-height: 1em;
    color: $main-color;
    margin: 0 0 16px 0;
  }

  .enrollment-status {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  .enrollment-color {
    width: 8px;
    height: 8px;
    margin-right: 8px;
    border-radius: 50%;
  }

  .enrollment-name {
    font-size: 11px;
    line-height: 19px;
    margin: 0 0 4px 0;
  }

  .enrollment-edit {
    font-size: 13px;
    line-height: 1em;
    font-weight: 300;
    color: $link_color;
    cursor: pointer;
  }

  .enrollment-status-badge {
    margin: 1px 9px 0 0;
  }
}

.user-info-body-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
  margin-bottom: 24px;
  padding: 0 40px;
}

.links-item {
  cursor: pointer;
}

.links-bottom-item {
  height: 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
}

.answer-rate {
  cursor: pointer;
}

.profile-text {
  padding: 6px 0;
}
</style>
