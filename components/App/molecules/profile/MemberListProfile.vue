<template>
  <div>
    <img class="profile-avatar" :src="userIcon" alt="Logo" />
    <div>
      <p class="profile-name">{{ userName }}</p>
      <p class="profile-organization-name">
        {{ userOrganizationName }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    userIcon: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userOrganizationName: {
      type: String,
      required: false,
      default: null,
    },
  },
});
</script>

<style lang="scss" scoped>
.profile-avatar {
  margin-right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 12px;
  box-shadow: 0 1px 3px $box-shadow;
  object-fit: cover;
}

.profile-name {
  font-size: 13px;
  line-height: 1em;
  font-weight: 600;
  color: $main_color;
}

.profile-organization-name {
  font-size: 11px;
  line-height: 1em;
  font-weight: 300;
  margin-top: 5px;
  color: $sub_color;
}
</style>
