<template>
  <div
    class="pick-up-member-wrapper"
    :class="{ link: !isVisitor }"
    @click="goToUserProfile"
  >
    <img :src="icon" class="pick-up-member-icon" alt="" />
    <div>
      <p class="pick-up-member-name">{{ name }}</p>
      <p v-if="organization" class="pick-up-member-organization">
        {{ organization }}
      </p>
      <p v-if="careerYear" class="pick-up-member-join-text">{{ careerYear }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';

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
      required: true,
    },
    organization: {
      type: String,
      required: false,
      default: null,
    },
    joinedYear: {
      type: Number,
      required: false,
      default: 0,
    },
    joinedMonth: {
      type: Number,
      required: false,
      default: 0,
    },
    isVisitor: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    careerYear(): string {
      if (this.joinedYear === 0 || this.joinedMonth === 0) {
        return '';
      }
      const n = dayjs().diff(
        dayjs(`${this.joinedYear}-${this.joinedMonth}-01`),
        'year'
      );
      return `入社${n}年目`;
    },
  },
  methods: {
    goToUserProfile(): void {
      if (!this.isVisitor) {
        this.$router.push(`/users/${this.uuid}`);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.pick-up-member-wrapper {
  display: flex;
  align-items: center;

  &.link {
    cursor: pointer;
  }
}

.pick-up-member-icon {
  height: 72px;
  width: 72px;
  border-radius: 27px;
  box-shadow: 0 1px 3px $box-shadow;
  margin: 0 17px 0 0;
  object-fit: cover;
}

.pick-up-member-name {
  color: $main_color;
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;
  margin: 0 0 4px 0;
}

.pick-up-member-organization {
  color: $gentle_bluish_purple;
  font-size: 11px;
  font-weight: 300;
  line-height: 1em;
  margin: 0 0 8px 0;
}

.pick-up-member-join-text {
  color: $main_color;
  font-size: 11px;
  font-weight: 300;
  line-height: 1em;
}
</style>
