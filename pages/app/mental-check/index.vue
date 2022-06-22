<template>
  <div class="container" :class="isClicked ? 'container-clicked' : ''">
    <logo class="logo" />
    <avatar
      class="avatar"
      size="medium"
      :user-icon="$accessor.userProfile.user_icon"
    />
    <div class="text">
      <span class="user-name">{{ $accessor.userProfile.name }}さん！</span>
      <span>今日の気分はどんな感じ？</span>
    </div>
    <div class="button-container">
      <mental-check-button
        class="button-content"
        status="poor"
        @click="onClick"
      />
      <mental-check-button
        class="button-content"
        status="average"
        @click="onClick"
      />
      <mental-check-button
        class="button-content"
        status="good"
        @click="onClick"
      />
      <mental-check-button
        class="button-content"
        status="very_good"
        @click="onClick"
      />
      <mental-check-button
        class="button-content"
        status="excellent"
        @click="onClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Route, RawLocation } from 'vue-router';
import Logo from '@/components/App/atoms/images/Logo.vue';
import Avatar from '@/components/App/atoms/images/Avatar.vue';
import MentalCheckButton from '@/components/App/atoms/buttons/MentalCheckButton.vue';
import { postMentalType } from '@/libs/api/app';

export default Vue.extend({
  layout: 'clean',
  components: {
    Logo,
    Avatar,
    MentalCheckButton,
  },
  data() {
    return {
      isClicked: false,
      nextRoute: '' as string,
    };
  },
  /* eslint no-param-reassign: ["error", { "ignorePropertyModificationsFor": ["vm"] }] */
  beforeRouteEnter(
    _: Route,
    from: Route,
    next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void
  ): void {
    next((vm: Vue) => {
      vm.$data.nextRoute = from.path;
    });
  },
  methods: {
    async onClick(status: string) {
      this.isClicked = true;

      try {
        await postMentalType(status);
      } catch (e) {
        if (e.response.status === 403) {
          this.$router.replace('/');
          return;
        }
      }
      this.$accessor.mentalCheck.setMentalCheckedAt();

      setTimeout(() => {
        this.$router.replace(this.nextRoute);
      }, 1200);
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-width: max-content;
  width: 100%;
}

.container-clicked {
  pointer-events: none;
  animation: feidOut 0.25s 1s forwards;
}

@keyframes feidOut {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.logo {
  width: 130px;
  height: 55px;
  margin-bottom: 38px;
}

.avatar {
  margin-bottom: 24px;
}

.user-name {
  font-weight: 600;
}

.text {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 15px;
  line-height: 24px;
  margin-bottom: 40px;
}

.button-container {
  display: flex;
}

.button-content {
  margin: 0 12px;
}
</style>
