<template>
  <div class="pick-up-profile-wrapper" :class="{ 'preview-mode': previewMode }">
    <div
      class="pick-up-profile-container"
      :class="{ link: !isVisitor }"
      @click="goToUserProfile"
    >
      <img :src="icon" class="profile-icon" alt="" />
      <div>
        <p class="profile-name">{{ name }}</p>
        <p v-if="organization" class="profile-organization">
          {{ organization }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    icon: {
      type: String,
      required: true,
    },
    userUuid: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: false,
      default: null,
    },
    isVisitor: {
      type: Boolean,
      required: false,
      default: false,
    },
    previewMode: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    goToUserProfile(): void {
      if (!this.isVisitor) {
        this.$router.push(`/users/${this.userUuid}`);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.pick-up-profile-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pick-up-profile-container {
  display: flex;
  align-items: center;

  &.link {
    cursor: pointer;
  }
}

.profile-icon {
  height: 40px;
  width: 40px;
  border-radius: 15px;
  text-shadow: 0 1px 2px $box-shadow;
  margin: 0 15px 0 0;
  object-fit: cover;
}

.profile-name {
  color: $true-white;
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;
  margin: 0 0 6px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.profile-organization {
  color: $true-white;
  font-size: 11px;
  font-weight: 300;
  line-height: 1em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.preview-mode {
  pointer-events: none;
}
</style>
