<template>
  <div class="default-container">
    <the-side-navigation
      :authorities="authorities"
      @change-user-authorities="changeUserAuthorities"
    />
    <div class="main">
      <the-header :authorities="authorities" />
      <nuxt class="nuxt" />
    </div>
  </div>
</template>
<script lang="ts">
import TheHeader from '@/components/Admin/Templates/TheHeader.vue';
import TheSideNavigation from '@/components/Admin/Templates/TheSideNavigation.vue';

export default {
  middleware: ['auth'],
  name: 'Default',
  components: {
    TheHeader,
    TheSideNavigation,
  },
  data() {
    return {
      authorities: [] as string[],
    };
  },
  methods: {
    changeUserAuthorities(userAuthorities: string[]) {
      this.authorities = userAuthorities;
    },
  },
};
</script>

<style lang="scss" scoped>
.default-container {
  display: flex;
  min-height: 100vh;
}

.main {
  width: 100%;
  background-color: $true_white;
}
</style>
