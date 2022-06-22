<template>
  <div :class="`bio-profile-container-${size}`">
    <avatar
      :class="`bio-profile-avatar-${size}`"
      :size="size"
      :user-icon="userIcon"
      :link="link"
    />
    <div>
      <span :class="`bio-profile-text-user-name-text-${size}`">{{ name }}</span>
      <div :class="`bio-profile-text-user-organization-container-${size}`">
        <span :class="`bio-profile-text-user-organization-name-text-${size}`">
          {{ organizationName }}
        </span>
        <span v-if="size !== 'small'"> | </span>
        <span
          v-if="size !== 'small'"
          :class="`bio-profile-text-user-position-name-text-${size}`"
          >{{ userPositionName }}
        </span>
      </div>

      <div
        v-if="size !== 'small' && bulletinBoard"
        class="bio-profile-text-user-enrollment-container"
      >
        <div class="bio-profile-text-user-enrollment-text-container">
          <bulletin-board-badge
            :name="userEnrollmentText"
            :background-color="backgroundColor"
            :color="userEnrollmentColor"
            class="bio-profile-text-user-enrollment-color"
            @click="openBulletinBoard"
          />
          <div
            v-if="!userEnrollmentText && !userEnrollmentColor"
            class="bio-profile-text-user-enrollment-edit-text"
            @click="openBulletinBoard"
          >
            在籍状況を設定する
          </div>
          <div>
            <div class="bio-profile-text-user-enrollment-name-text">
              <popper
                trigger="hover"
                :disabled="
                  userEnrollmentDescription &&
                    userEnrollmentDescription.length <= 8
                "
                :options="{
                  placement: 'bottom-start',
                  modifiers: { offset: { offset: '0,3px' } },
                }"
              >
                <div class="popper-full">
                  {{ userEnrollmentDescription }}
                </div>
                <div slot="reference">
                  {{ limitedString(userEnrollmentDescription, 8) }}
                </div>
              </popper>
            </div>
          </div>
        </div>
      </div>
    </div>
    <bulletin-board-edit-modal
      v-if="bulletinBoardEditModal"
      :enrollment-status="enrollmentStatus"
      :enrollment-text="userEnrollmentText"
      :enrollment-description="userEnrollmentDescription"
      @close="closeBulletinBoard"
      @click="updateEnrollmentStatus"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { enumEnrollmentColors } from '@/libs/definition';
import Avatar from '@/components/App/atoms/images/Avatar.vue';
import BulletinBoardEditModal from '@/components/App/organisms/my-page/BulletinBoardEditModal.vue';
import { updateEnrollmentStatus, fetchEnrollmentStatus } from '@/libs/api/app';
import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';
import BulletinBoardBadge from '~/components/App/atoms/badges/BulletinBoardBadge.vue';

export default Vue.extend({
  components: {
    Avatar,
    BulletinBoardBadge,
    BulletinBoardEditModal,
    Popper,
  },
  props: {
    size: {
      type: String,
      default: 'medium',
      validator: (v: string) => ['small', 'medium', 'large'].includes(v),
    },
    userIcon: {
      type: String,
      required: true,
      default: '',
    },
    userName: {
      type: String,
      required: true,
      default: '',
    },
    userOrganizationName: {
      type: String,
      required: false,
      default: null,
    },
    userPositionName: {
      type: String,
      required: false,
      default: '',
    },
    userEnrollmentText: {
      type: String,
      required: false,
      default: '',
    },
    userEnrollmentColor: {
      type: String,
      required: false,
      default: '',
    },
    userEnrollmentDescription: {
      type: String,
      required: false,
      default: '',
    },
    numberOfName: {
      type: Number,
      required: false,
      default: 0,
    },
    numberOfOrganizationName: {
      type: Number,
      required: false,
      default: 0,
    },
    link: {
      type: String,
      required: false,
      default: '',
    },
    postsProfile: {
      type: Boolean,
      required: false,
      default: false,
    },
    bulletinBoard: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      bulletinBoardEditModal: false as boolean,
      enrollmentStatus: {} as AppApiResponse.EnrollmentStatus,
    };
  },
  computed: {
    name(): string {
      if (this.userName && this.numberOfName) {
        return this.userName.length > this.numberOfName
          ? `${this.userName.substr(0, this.numberOfName)}...`
          : this.userName;
      }
      return this.userName;
    },
    organizationName(): string | null {
      if (this.userOrganizationName && this.numberOfOrganizationName) {
        return this.userOrganizationName.length > this.numberOfOrganizationName
          ? `${this.userOrganizationName.substr(
              0,
              this.numberOfOrganizationName
            )}...`
          : this.userOrganizationName;
      }
      return this.userOrganizationName;
    },
    backgroundColor() {
      const findColor = enumEnrollmentColors.find(
        (item: string) => item.color === this.$props.userEnrollmentColor
      );
      return findColor ? findColor.background_color : '#FFFFFF';
    },
  },
  created() {
    if (!this.postsProfile) {
      this.fetchEnrollmentStatus();
    }
  },
  methods: {
    async fetchEnrollmentStatus() {
      try {
        const { data } = await fetchEnrollmentStatus();
        this.enrollmentStatus = data;
      } catch (e) {
        console.error(e);
      }
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
        // TODO エラーで落ちた時にアラートが出過ぎるので、一時的にコメント
        // alert('在籍情報を更新できませんでした。');
      }
    },
    limitedString(input: string, limit: number = 8): string {
      let output = input;
      if (output && output.length > limit) {
        output = output.slice(0, limit).concat('...');
      }
      return output;
    },
  },
});
</script>

<style lang="scss" scoped>
.bio-profile-container-small {
  display: flex;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  height: 40px;
}

.bio-profile-container-medium {
  display: flex;
  flex-direction: column;
  white-space: nowrap;
}

.bio-profile-container-large {
  display: flex;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  height: 120px;
}

.bio-profile-avatar-small {
  margin-right: 15px;
}

.bio-profile-avatar-medium {
  margin-bottom: 8px;
}

.bio-profile-avatar-large {
  margin-right: 32px;
}

.bio-profile-text-user-name-text-small {
  font-size: 15px;
  line-height: 26px;
  font-weight: 600;
  margin-bottom: 7px;
}

.bio-profile-text-user-name-text-medium {
  font-size: 15px;
  line-height: 26px;
  font-weight: 600;
  margin-bottom: 8px;
}

.bio-profile-text-user-name-text-large {
  font-size: 22px;
  line-height: 37px;
  font-weight: 600;
  margin-bottom: 16px;
}

.bio-profile-text-user-organization-container-small {
  font-size: 11px;
  line-height: 14px;
  color: $sub_color;
}

.bio-profile-text-user-organization-container-medium {
  font-size: 11px;
  line-height: 19px;
  color: $sub_color;
  margin-bottom: 14px;
}

.bio-profile-text-user-organization-container-large {
  font-size: 15px;
  line-height: 26px;
  color: $sub_color;
  margin-bottom: 24.5px;
}

.bio-profile-text-user-enrollment-container {
  display: flex;
  align-items: center;
}

.bio-profile-text-user-enrollment-text-container {
  display: flex;
  align-items: flex-start;
}

.bio-profile-text-user-enrollment-color {
  margin: 0 9px 0 -5px;
}

.bio-profile-text-user-enrollment-name-text {
  font-size: 11px;
  line-height: 1em;
  font-weight: 300;
  color: $main_color;
  margin: 3px 0 0 0;
}

.bio-profile-text-user-enrollment-edit-text {
  font-size: 13px;
  line-height: 1em;
  font-weight: 300;
  color: $link_color;
  cursor: pointer;
  margin-left: -25px;
}

.popper-full {
  background-color: $true_white;
  font-size: 13px;
  line-height: 1em;
  color: $dark_blue;
  border: 1px solid $light_gray_blue_3;
  border-radius: 5px;
  padding: 10px;
  pointer-events: none;
  max-width: 350px;
  z-index: 99;
}
</style>
