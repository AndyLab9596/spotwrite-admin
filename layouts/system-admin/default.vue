<template>
  <div class="default-container">
    <the-admin-side-navigation />
    <div class="main">
      <the-admin-header />
      <nuxt class="nuxt" />
    </div>
  </div>
</template>
<script lang="ts">
import TheAdminHeader from '~/components/SystemAdmin/Templates/TheAdminHeader.vue';
import TheAdminSideNavigation from '~/components/SystemAdmin/Templates/TheAdminSideNavigation.vue';

export default {
  middleware: ['auth'],
  name: 'Default',
  components: {
    TheAdminHeader,
    TheAdminSideNavigation,
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
