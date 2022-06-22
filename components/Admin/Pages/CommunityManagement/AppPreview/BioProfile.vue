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
          >{{ userPositionName || '係長' }}
        </span>
      </div>

      <div
        v-if="size !== 'small'"
        class="bio-profile-text-user-enrollment-container"
      >
        <span class="bio-profile-text-user-enrollment-color" />
        <span class="bio-profile-text-user-enrollment-name-text">{{
          userEnrollmentName || '有給消化中'
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Avatar from '~/components/Admin/Pages/CommunityManagement/AppPreview/Avatar.vue';

export default Vue.extend({
  components: {
    Avatar,
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
    userEnrollmentName: {
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

.bio-profile-text-user-enrollment-color {
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 50%;

  /* TODO: APIアクセスで取得した色になる予定 */
  background-color: #52db31;
}

.bio-profile-text-user-enrollment-name-text {
  font-size: 13px;
  line-height: 23px;
}
</style>
