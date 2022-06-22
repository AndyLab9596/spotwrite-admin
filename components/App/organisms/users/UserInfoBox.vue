<template>
  <div class="user-info-container">
    <div class="user-info-header-container">
      <avatar
        :class="`bio-profile-avatar-medium`"
        size="medium"
        :user-icon="userInfo.user_icon"
      ></avatar>
      <div class="user-basic-info-container">
        <div class="name">{{ userInfo.name }}</div>
        <div class="joined-date">
          {{ userInfo.main_organization_name }}
        </div>
        <div v-if="bulletinBoard" class="enrollment-status">
          <status-info-labeled-text
            :label-color="enrollmentColor"
            :background-color="backgroundColor"
          >
            {{ enrollmentText }}
          </status-info-labeled-text>
          <span class="enrollment-name">{{ enrollmentDescription }}</span>
        </div>
      </div>
      <button v-if="isMyDetailPage" class="edit-profile" @click="openProfile()">
        <img src="/app/icon/icon-edit.svg" />
      </button>
      <button class="message-link" @click="goMessageRoom()">
        <img src="/app/icon/icon-message.svg" />
      </button>
    </div>
    <div class="user-info-body-container">
      <user-info-labeled-text label="サブ組織">
        <popper
          trigger="click"
          :options="{
            placement: 'bottom-start',
            modifiers: { offset: { offset: '0,3px' } },
          }"
          :style="{ position: 'relative' }"
        >
          <div class="popper-full">{{ userInfo.sub_organization_name }}</div>
          <div slot="reference">
            <div class="popper-text">{{ userInfo.sub_organization_name }}</div>
          </div>
        </popper>
      </user-info-labeled-text>
      <user-tel-info-labeled-text
        label="TEL"
        :tel="userTel"
        :company-tel="userCompanyTel"
      >
      </user-tel-info-labeled-text>
      <user-info-labeled-text label="内線">{{
        userInfo.internal_tel
      }}</user-info-labeled-text>
    </div>
    <div class="user-info-body-container-bottom">
      <user-info-labeled-text label="役職">
        {{ userInfo.employment_position }}
      </user-info-labeled-text>
      <user-info-labeled-text label="雇用形態">{{
        userInfo.employment_status
      }}</user-info-labeled-text>
      <user-info-labeled-text label="入社年">
        {{ userInfo.joined_year }}年{{ userInfo.joined_month }}月入社
      </user-info-labeled-text>
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
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';
import Popper from 'vue-popperjs';
import { enumEnrollmentColors } from '@/libs/definition';
import Avatar from '../../atoms/images/Avatar.vue';
import UserInfoLabeledText from '../../molecules/texts/UserInfoLabeledText.vue';
import UserTelInfoLabeledText from '../../molecules/texts/UserTelInfoLabeledText.vue';
import StatusInfoLabeledText from '../../molecules/texts/StatusInfoLabeledText.vue';
import ProfileEditModal from '../my-page/ProfileEditModal.vue';
import 'vue-popperjs/dist/vue-popper.css';

import {
  postQuestionAndAnswers,
  postProfile,
  fetchProfile,
  fetchQuestionAndAnswers,
  fetchLanguages,
  fetchJobTypes,
  fetchOrganizations,
  fetchEnrollmentStatus,
} from '../../../../libs/api/app';

export default Vue.extend({
  components: {
    Avatar,
    UserInfoLabeledText,
    UserTelInfoLabeledText,
    StatusInfoLabeledText,
    Popper,
    ProfileEditModal,
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
      profileEditModal: false as boolean,
      profileEditSelectedTabId: '1' as string,
      profileEditTabItems: [
        { id: '1', name: 'プロフィール' },
        { id: '2', name: 'Q&A' },
      ],
      enrollmentStatus: {} as AppApiResponse.EnrollmentStatus,
      profile: {} as AppApiResponse.Profile,
      isLoading: false,
      profileQa: {} as AppApiResponse.ProfileQuestionAndAnswers,
      languages: [] as AppApiResponse.Language[],
      jobTypes: [] as AppApiResponse.Job[],
      organizations: [] as AppApiResponse.Organization[],
    };
  },
  computed: {
    userTel(): string {
      return this.userInfo.tel ?? '';
    },
    userCompanyTel(): string {
      return this.userInfo.company_tel ?? '';
    },
    enrollmentText(): string {
      return this.$accessor.userProfile.uuid === this.userInfo.uuid
        ? this.$accessor.userProfile.enrollment_text
        : this.userInfo.enrollment_text;
    },
    enrollmentColor(): string {
      return this.$accessor.userProfile.uuid === this.userInfo.uuid
        ? this.$accessor.userProfile.enrollment_color
        : this.userInfo.enrollment_color;
    },
    enrollmentDescription(): string {
      return this.$accessor.userProfile.uuid === this.userInfo.uuid
        ? this.$accessor.userProfile.enrollment_description
        : this.userInfo.enrollment_description;
    },
    backgroundColor(): string {
      const color =
        this.$accessor.userProfile.uuid === this.userInfo.uuid
          ? this.$accessor.userProfile.enrollment_color
          : this.userInfo.enrollment_color;
      const findColor = enumEnrollmentColors.find(
        (item: string) => item.color === color
      );
      return findColor ? findColor.background_color : '#FFFFFF';
    },
    isMyDetailPage(): boolean {
      return this.$accessor.userProfile.uuid === this.userInfo.uuid;
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
    onClose() {
      this.profileEditModal = false;
    },
    openProfile() {
      this.profileEditSelectedTabId = '1';
      this.profileEditModal = true;
    },
    selectTab(id: string) {
      this.profileEditSelectedTabId = id;
    },
    openQAndA() {
      this.profileEditSelectedTabId = '2';
      this.profileEditModal = true;
    },
    async fetchLanguages() {
      try {
        const { data } = await fetchLanguages();
        this.languages = data;
      } catch (e) {
        alert('仕様言語一覧を取得できませんでした。');
      }
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
      } catch (e) {
        // eslint-disable-next-line no-console
        alert('Q&Aの取得に失敗しました。');
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
    async onQAndASaveModalClose({
      qaPayload,
      profilePayload,
    }: {
      qaPayload: AppApiRequest.ProfileQuestionAndAnswers;
      profilePayload: AppApiRequest.Profile;
    }) {
      await this.onQAndASave(qaPayload);
      await this.onProfileSave(profilePayload);
      await this.fetchQuestionAndAnswers();
      await this.fetchProfile();
      this.$emit('freshQNA');
      this.onClose();
    },
    async onProfileSaveModalClose(payload: AppApiRequest.Profile) {
      try {
        await postProfile(payload);
        await this.fetchProfile();
        this.$emit('fresh');
        this.onClose();
      } catch (e) {
        alert('プロフィール情報を保存できませんでした。');
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
    },
    clickQAndAContinued(value: AppApiRequest.Profile) {
      this.onProfileSave(value);
      this.selectTab(this.profileEditTabItems[1].id);
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
  background-color: #fff;
  position: relative;

  &::before {
    content: '';
    background: url('/app/icon/profile.svg') no-repeat;
    display: inline-block;
    width: 41px;
    height: 18px;
    margin: 0 4px 0 0;
    position: absolute;
    left: 8px;
    top: 9px;
    z-index: 9;
  }
}

.user-info-header-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  margin-bottom: 24px;
  padding: 40px 0;
  background: linear-gradient(267deg, #ffe0ba, #cddcfe);
  position: relative;

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

  .edit-profile {
    background: none;
    border: none;
    width: fit-content;
    height: fit-content;
    margin: 0;
    padding: 0;
    position: absolute;
    right: 5px;
    top: 5px;
  }
}

.user-basic-info-container {
  margin-left: 20px;

  .name {
    font-size: 20px;
    font-weight: 500;
    border-bottom: solid 1px #f88;
  }

  .joined-date {
    margin-top: 10px;
    font-size: 12px;
  }

  .enrollment-status {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .enrollment-color {
    width: 8px;
    height: 8px;
    margin-right: 8px;
    border-radius: 50%;

    /* TODO: APIアクセスで取得した色になる予定 */
    background-color: #52db31;
  }

  .enrollment-name {
    font-size: 13px;
    line-height: 23px;
    padding-left: 8px;
  }
}

.user-info-body-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
  padding: 0 40px;
}

.user-info-body-container-bottom {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
  margin-bottom: 24px;
  padding: 0 40px;
}

.popper-full {
  background-color: $true_white;
  font-size: 15px;
  line-height: 1.5;
  color: $dark_blue;
  border: 1px solid $light_gray_blue_3;
  padding: 10px;
  pointer-events: none;
  z-index: 9;
  border-radius: 4px;
  position: absolute;
}

.popper-text {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
