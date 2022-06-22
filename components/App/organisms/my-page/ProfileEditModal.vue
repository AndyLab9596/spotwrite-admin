<template>
  <transition name="modal" appear>
    <div class="modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="icon-cross-wrapper" @click="onClose">
          <img src="/app/icon/cross-white.svg" class="icon-cross" />
        </div>
        <div class="modal-contents">
          <div class="user-info-header-container">
            <img src="/app/icon/profile.svg" class="profile-icon" alt="" />
            <div class="links">
              <div class="links-item"></div>
            </div>
            <div class="user-info-contents">
              <img
                v-if="!isUploadingIcon"
                :src="changeIconImage || userInfo.user_icon"
                class="avatar-icon"
                alt=""
                title="プロフィール写真を変更"
                @click="$refs.file.click()"
              />
              <vue-loading
                v-if="isUploadingIcon"
                type="spin"
                class="loading-avatar user-info-contents"
                color="#f88"
                :size="{ width: '100px', height: '100px' }"
              />
              <input
                id="file"
                ref="file"
                type="file"
                style="display: none;"
                accept=".png, .jpg, .jpeg"
                @change="changeIcon"
              />
              <div class="user-basic-info-container">
                <div class="name">
                  {{ userInfo.name }}
                  <div class="line"></div>
                </div>
                <div class="joined-date">
                  {{ userInfo.joined_year }}年{{ userInfo.joined_month }}月入社
                </div>
                <div class="enrollment-status">
                  <status-info-labeled-text
                    :label-color="userInfo.enrollment_color"
                    :background-color="backgroundColor"
                    class="status-info-labeled-text"
                  >
                    {{ userInfo.enrollment_text }}
                  </status-info-labeled-text>
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
            </div>
          </div>
          <profile-edit-contents
            :tab-items="tabItems"
            :selected-tab-id="selectedTabId"
            :profile="profile"
            :languages="languages"
            :job-types="jobTypes"
            :organizations="organizations"
            :profile-qa="profileQa"
            class="profile-edit-contents-wrapper"
            @onCangeTab="onCangeTab"
            @onQAndASave="onQAndASave"
            @onProfileSave="onProfileSave"
            @onClose="onClose"
            @clickProfileContinued="clickProfileContinued"
            @clickQAndAContinued="clickQAndAContinued"
          />
        </div>
      </div>
      <bulletin-board-edit-modal
        v-if="bulletinBoardEditModal"
        :enrollment-status="enrollmentStatus"
        :enrollment-text="userInfo.enrollment_text"
        :enrollment-description="userInfo.enrollment_description"
        @close="closeBulletinBoard"
        @click="updateEnrollmentStatus"
      />
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import {
  updateEnrollmentStatus,
  updateProfileIcon,
  fetchUser,
} from '@/libs/api/app';
import { getResizedImage } from '@/libs/message/message';
import { enumEnrollmentColors } from '@/libs/definition';
import BulletinBoardEditModal from '@/components/App/organisms/my-page/BulletinBoardEditModal.vue';
import StatusInfoLabeledText from '../../molecules/texts/StatusInfoLabeledText.vue';
import ProfileEditContents from './ProfileEditContents.vue';

export default Vue.extend({
  components: {
    StatusInfoLabeledText,
    ProfileEditContents,
    BulletinBoardEditModal,
  },
  props: {
    userInfo: {
      type: Object as PropType<ApiResponse.User>,
      required: true,
    },
    profile: {
      type: Object as PropType<AppApiResponse.Profile>,
      required: true,
    },
    profileQa: {
      type: Object as PropType<AppApiResponse.ProfileQuestionAndAnswers>,
      required: true,
    },
    enrollmentStatus: {
      type: Object as PropType<AppApiResponse.EnrollmentStatus>,
      required: true,
    },
    languages: {
      type: Array as PropType<AppApiResponse.Language>,
      required: true,
    },
    jobTypes: {
      type: Array as PropType<AppApiResponse.Job>,
      required: true,
    },
    organizations: {
      type: Array as PropType<AppApiResponse.Organization>,
      required: true,
    },
    closeButton: {
      type: String,
      required: false,
      default: '閉じる',
    },
    saveButton: {
      type: String,
      required: false,
      default: '完了',
    },
    tabItems: {
      type: Array as PropType<AppTypes.TabItem[]>,
      required: true,
    },
    selectedTabId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      totalCount: {
        questionCount: 20,
        answerdCount: 10,
      },
      bulletinBoardEditModal: false as boolean,
      changeIconImage: '' as string,
      isUploadingIcon: false as boolean,
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
  methods: {
    onClose() {
      this.$emit('onClose');
    },
    onQAndASave({
      qaPayload,
      profilePayload,
    }: {
      qaPayload: AppApiRequest.ProfileQuestionAndAnswers;
      profilePayload: AppApiRequest.Profile;
    }) {
      this.$emit('onQAndASave', {
        qaPayload,
        profilePayload,
      });
    },
    onProfileSave(item: AppApiRequest.Profile) {
      this.$emit('onProfileSave', item);
    },
    onCangeTab(id: string) {
      this.$emit('onCangeTab', id);
    },
    clickProfileContinued({
      qaPayload,
      profilePayload,
    }: {
      qaPayload: AppApiRequest.ProfileQuestionAndAnswers;
      profilePayload: AppApiRequest.Profile;
    }) {
      this.$emit('clickProfileContinued', { qaPayload, profilePayload });
    },
    clickQAndAContinued(value: AppApiRequest.Profile) {
      this.$emit('clickQAndAContinued', value);
    },
    openBulletinBoard() {
      this.bulletinBoardEditModal = true;
    },
    closeBulletinBoard() {
      this.bulletinBoardEditModal = false;
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
    async changeIcon(e: any) {
      if (!e.target?.files) return;

      if (
        e.target.files[0].type !== 'image/jpeg' &&
        e.target.files[0].type !== 'image/png'
      )
        return;

      this.isUploadingIcon = true;

      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = async () => {
        if (!reader.result) return;
        this.changeIconImage = reader.result as string;
      };

      const formData = new FormData() as any;
      formData.append('image', image);
      await updateProfileIcon(formData);
      const { data } = await updateProfileIcon(formData);
      const newIconUrl = data.user_icon;
      const orgName = newIconUrl.split('/').pop();
      if (orgName) {
        const resizeName = `resize-${orgName}`;
        const resizeUrl = newIconUrl.replace(orgName, resizeName);
        await getResizedImage(resizeUrl);
      }

      // 全体の画面に反映させる
      const { data: userProfile }: { data: any } = await fetchUser();
      this.$accessor.setUserProfile(userProfile);

      this.isUploadingIcon = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  width: 700px;
  height: 98%;
  background: $true_white;
  border-radius: 4px;
  position: relative;
}

.modal-contents {
  height: 100%;
  overflow-y: scroll;
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

.icon-cross-wrapper {
  position: absolute;
  top: 0;
  right: calc(-25px + -25px);
}

.icon-cross {
  cursor: pointer;
  width: 25px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  line-height: 1em;
  color: $gentle_bluish_purple;
  margin: 37px 0 32px 40px;
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

.user-info-container {
  display: flex;
  flex-direction: column;
  min-width: 600px;
  width: 100%;
  background-color: #fff;
  position: relative;
}

.profile-icon {
  position: absolute;
  top: 9px;
  left: 9px;
}

.links {
  margin: 25px 24px 9px 0;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  font-size: 11px;
  color: $main_color;
}

.links-item {
  cursor: pointer;
}

.icon {
  margin-right: 8px;
}

.user-info-contents {
  display: flex;
  margin: 0 0 45px 0;
}

.user-info-header-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  background: linear-gradient(267deg, #ffe0ba, #cddcfe);
  position: relative;
  border-radius: 4px 4px 0 0;
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

    /* TODO: APIアクセスで取得した色になる予定 */
    background-color: #52db31;
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
}

.user-info-body-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
  margin-bottom: 24px;
}

.answer-rate {
  cursor: pointer;
}

.avatar-icon {
  width: 100px;
  height: 100px;
  border-radius: 38px;
  box-shadow: 0 1px 3px $box-shadow;
  cursor: pointer;
  object-fit: cover;
}

.status-info-labeled-text {
  margin: 0 9px 0 0;
}

.enrollment-status-edit {
  color: $link-color;
  font-size: 13px;
  font-weight: 300;
  line-height: 1em;
  margin: 4px 0 0 0;
  cursor: pointer;
}

.loading-avatar {
  padding: 20px;
}
</style>
