<template>
  <div
    class="profile-container"
    :class="{ link: !isVisitor, 'preview-mode': previewMode }"
    @click="goToUserProfile"
  >
    <img :src="icon" class="icon" alt="" />
    <div>
      <p class="name">{{ name }}</p>
      <p v-if="organization" class="organization">
        {{ organization }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    userUuid: {
      type: String,
      required: true,
    },
    icon: {
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
      required: false,
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
.icon {
  height: 40px;
  width: 40px;
  border-radius: 15px;
  box-shadow: 0 1px 3px $box-shadow;
  margin: 0 17px 0 0;
}

.name {
  color: $main_color;
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;
  margin: 0 0 6px 0;
}

.organization {
  color: $gentle_bluish_purple;
  font-size: 11px;
  font-weight: 300;
  line-height: 1em;
  margin: 0 0 8px 0;
}

.profile-container {
  display: flex;
  align-items: center;

  &.link {
    cursor: pointer;
  }
}

.profile-text {
  color: $gentle_bluish_purple;
  font-size: 9px;
  font-weight: 300;
  line-height: 1em;
  margin: 0 0 8px 0;
}

.preview-mode {
  pointer-events: none;
}
</style>
