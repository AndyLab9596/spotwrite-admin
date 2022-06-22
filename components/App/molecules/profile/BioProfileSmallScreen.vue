<template>
  <div :class="`bio-profile-container-${size}`">
    <avatar
      :class="`bio-profile-avatar-${size}`"
      :size="size"
      :user-icon="userIcon"
      :link="link"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Avatar from '@/components/App/atoms/images/Avatar.vue';

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
    link: {
      type: String,
      required: false,
      default: '',
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
</style>
