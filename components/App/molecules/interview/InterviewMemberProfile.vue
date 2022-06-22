<template>
  <div @click="goToUserProfile">
    <div v-if="type" class="profile-type-wrapper">
      <div class="offset" />
      <p class="profile-text">{{ type }}</p>
    </div>
    <div class="profile-container" :class="{ link: !isVisitor }">
      <img :src="icon" class="icon" alt="" />
      <div>
        <p class="name">{{ name }}</p>
        <p v-if="organization" class="organization">
          {{ organization }}
        </p>
        <p v-if="careerYear" class="profile-join-text">
          {{ careerYear }}
        </p>
      </div>
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
    type: {
      type: String,
      required: false,
      default: '',
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
    previewMode: {
      type: Boolean,
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
.icon {
  height: 40px;
  width: 40px;
  border-radius: 15px;
  box-shadow: 0 1px 3px $box-shadow;
  margin: 0 17px 0 0;
  object-fit: cover;
}

.offset {
  width: calc(40px + 17px);
}

.profile-type-wrapper {
  display: flex;
}

.name {
  color: $main_color;
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;
  margin: 0 0 6px 0;
}

.organization {
  color: $sub_color;
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

.profile-join-text {
  color: $link-color;
  font-size: 11px;
  font-weight: 300;
  line-height: 1em;
}
</style>
