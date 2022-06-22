<template>
  <div class="bulletin-board-wrapper">
    <div class="bulletin-board-item">
      <profile-detail
        :user-name="user.user_name"
        :user-icon="user.user_icon"
        :enrollment-text="enrollmentText"
        :enrollment-color="enrollmentColor"
        :enrollment-description="enrollmentDescription"
        :enrollment-updated-at="user.enrollment_updated_at"
        class="profile-detail"
      />
      <profile-tel
        :tel="user.tel"
        :internal-tel="user.internal_tel"
        :company-tel="user.company_tel"
        class="profile-tel"
      />
      <img
        src="/app/icon/icon-message-green.svg"
        class="message-icon"
        alt=""
        @click="goToMessage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ProfileDetail from '@/components/App/molecules/bulletin-board/ProfileDetail.vue';
import ProfileTel from '@/components/App/molecules/bulletin-board/ProfileTel.vue';

export default Vue.extend({
  components: {
    ProfileDetail,
    ProfileTel,
  },
  props: {
    user: {
      type: Object as PropType<AppApiResponse.EmployeeUser>,
      required: true,
    },
  },
  computed: {
    enrollmentText() {
      return this.$accessor.userProfile.uuid === this.user.user_uuid
        ? this.$accessor.userProfile.enrollment_text
        : this.user.enrollment_text;
    },
    enrollmentColor() {
      return this.$accessor.userProfile.uuid === this.user.user_uuid
        ? this.$accessor.userProfile.enrollment_color
        : this.user.enrollment_color;
    },
    enrollmentDescription() {
      return this.$accessor.userProfile.uuid === this.user.user_uuid
        ? this.$accessor.userProfile.enrollment_description
        : this.user.enrollment_description;
    },
  },
  methods: {
    goToMessage() {
      // TODO: 選択したユーザにメッセージを送信する画面に遷移するよう修正お願いします
      this.$router.push('/message');
    },
  },
});
</script>

<style lang="scss">
.bulletin-board-wrapper {
  &:first-of-type {
    border-radius: 4px 4px 0 0;
  }

  &:last-of-type {
    border-radius: 0 0 4px 4px;
  }

  &:only-of-type {
    border-radius: 4px;
  }
}

.bulletin-board-item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 97px;
  padding: 0 24px;
  box-shadow: 0 1px 2px $box-shadow;
}

.profile-detail {
  width: 352px;
}

.profile-tel {
  width: 179px;
  margin: 45px;
}

.message-icon {
  width: 40px;
  cursor: pointer;
}
</style>
