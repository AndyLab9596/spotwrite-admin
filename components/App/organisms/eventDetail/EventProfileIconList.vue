<template>
  <div class="icon-list">
    <template v-for="(user, index) in participationUsersSlice">
      <profile-list-icon
        :key="user.uuid"
        :src="user.icon"
        :user-uuid="user.uuid"
        :dark-icon-number="darkIconNumber"
        :index="index"
        :is-visitor="isVisitor"
        class="profile-icon"
        @onClick="onClick"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ProfileListIcon from '../../molecules/profile/ProfileListIcon.vue';

export default Vue.extend({
  components: {
    ProfileListIcon,
  },
  props: {
    darkIconNumber: {
      type: Number,
      required: false,
      default: 7,
    },
    participationUsers: {
      type: Array as PropType<ApiResponse.EventUser[]>,
      required: true,
    },
    isVisitor: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    // 7つ以上は表示させないようにする
    participationUsersSlice(): ApiResponse.EventUser[] | [] {
      return this.participationUsers.length > 7
        ? this.participationUsers.slice(0, 8)
        : this.participationUsers;
    },
  },
  methods: {
    onClick() {
      this.$emit('onClick');
    },
  },
});
</script>

<style lang="scss" scoped>
.icon-list {
  display: flex;
  align-items: center;
}

.profile-icon {
  margin: 0 5px 0 0;

  &:last-of-type {
    margin: 0;
  }
}
</style>
