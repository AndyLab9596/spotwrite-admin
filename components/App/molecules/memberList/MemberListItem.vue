<template>
  <div>
    <p v-if="companyName" class="member-list-company-name">
      {{ companyName }}
    </p>
    <member-list-profile
      v-for="user in users"
      :key="user.uuid"
      :user-icon="user.icon"
      :user-name="user.name"
      :user-organization-name="user.organization_name"
      class="member-list-profile"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import MemberListProfile from '../profile/MemberListProfile.vue';

export default Vue.extend({
  components: {
    MemberListProfile,
  },
  props: {
    companyName: {
      type: String,
      required: false,
      default: '',
    },
    users: {
      type: Array as PropType<ApiResponse.CompanyUser[]>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.member-list-company-name {
  display: flex;
  align-items: center;
  color: $gentle_bluish_purple;
  background-color: $white_1;
  font-weight: 600;
  font-size: 15px;
  height: 64px;
  padding: 0 0 0 16px;
  border-top: 1px solid $ruled_line;
}

.member-list-profile {
  display: flex;
  align-items: center;
  height: 58px;
  width: 100%;
  border-top: 1px solid $ruled_line;
  padding: 0 32px;
}
</style>
