<template>
  <div class="profile-detail-wrapper">
    <img :src="userIcon" class="profile-icon" />
    <div class="profile-contents">
      <p class="profile-name">{{ userName }}</p>
      <div class="profile-enrollment-contents">
        <bulletin-board-badge
          v-if="setEnrollmentText"
          :name="setEnrollmentText"
          :background-color="backgroundColor"
          :color="setEnrollmentColor"
          class="enrollment-status-badge"
        />
        <div class="enrollment-status-info">
          <p class="enrollment-status-text">
            {{ enrollmentDescription }}
          </p>
          <p v-if="updatedDate" class="enrollment-status-update-text">
            （{{ updatedDate }}）
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';
import { enumEnrollmentColors } from '@/libs/definition';
import BulletinBoardBadge from '~/components/App/atoms/badges/BulletinBoardBadge.vue';

export default Vue.extend({
  components: {
    BulletinBoardBadge,
  },
  props: {
    userName: {
      type: String,
      required: true,
    },
    userIcon: {
      type: String,
      required: true,
    },
    enrollmentText: {
      type: String as () => string | null,
      default: '',
    },
    enrollmentColor: {
      type: String as () => string | null,
      default: '#9c9da5',
    },
    enrollmentDescription: {
      type: String,
      required: false,
      default: null,
    },
    enrollmentUpdatedAt: {
      type: Number || null,
      required: false,
      default: null,
    },
  },
  computed: {
    updatedDate(): string {
      if (this.enrollmentUpdatedAt === null) {
        return '';
      }
      return dayjs
        .unix(this.enrollmentUpdatedAt)
        .format('YYYY/MM/DD HH:mm更新');
    },
    setEnrollmentColor(): string {
      return this.enrollmentColor !== null ? this.enrollmentColor : '';
    },
    setEnrollmentText(): string {
      return this.enrollmentText !== null ? this.enrollmentText : '';
    },
    backgroundColor() {
      const color = this.enrollmentColor !== null ? this.enrollmentColor : '';
      const findColor = enumEnrollmentColors.find(
        (item: string) => item.color === color
      );
      return findColor ? findColor.background_color : '#FFFFFF';
    },
  },
});
</script>

<style lang="scss" scoped>
.profile-detail-wrapper {
  display: flex;
  align-items: center;
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  box-shadow: 0 1px 2px $box-shadow;
  margin: 0 15px 0 0;
  object-fit: cover;
}

.profile-name {
  font-size: 15px;
  font-weight: 600;
  color: $main_color;
  line-height: 1em;
  margin: 0 0 7px 0;
}

.profile-enrollment-contents {
  display: flex;
  align-items: flex-start;
}

.enrollment-status-badge {
  margin: 0 7px 0 0;
}

.enrollment-status-text {
  font-size: 13px;
  font-weight: 300;
  color: $gentle_bluish_purple;
  line-height: 1em;
  margin: 0 0 6px 0;
}

.enrollment-status-update-text {
  font-size: 11px;
  font-weight: 300;
  color: $sub_color;
  line-height: 1em;
}

.enrollment-status-info {
  padding-left: 20px;
}
</style>
