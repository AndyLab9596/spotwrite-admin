<template>
  <div>
    <img
      class="icon"
      :class="{ link: !isVisitor }"
      :src="icon"
      alt=""
      @click="goToUserProfile"
    />
    <p v-if="name && !hideName" class="profile-name">{{ name }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    uuid: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
      default: '',
    },
    isVisitor: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideName: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    onClick() {
      this.$emit('onClick');
    },
    goToUserProfile(): void {
      if (!this.isVisitor) {
        this.$router.push(`/users/${this.uuid}`);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.icon {
  height: 64px;
  width: 64px;
  border-radius: 24px;
  box-shadow: 0 1px 3px $box-shadow;
  margin: 0 0 8px 0;
  object-fit: cover;

  &.link {
    cursor: pointer;
  }
}

.profile-name {
  font-size: 13px;
  color: $main_color;
  font-weight: 600;
  line-height: 1em;
}
</style>
