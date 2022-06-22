<template>
  <div class="layout">
    <side-navigation class="side-navigation" />
    <nuxt class="navigation-content" />
    <right-side-navigation />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SideNavigation from '@/components/App/organisms/navigation/SideNavigation.vue';
import RightSideNavigation from '@/components/App/organisms/navigation/RightSideNavigation.vue';
import { fetchAdditionalFunctionStatuses } from '@/libs/api/app';

export default Vue.extend({
  components: {
    SideNavigation,
    RightSideNavigation,
  },
  middleware: ['auth'],
  beforeCreate() {
    if (process.env.ApiMock?.toLowerCase() === 'true') {
      console.info('Mock API 使用中');
    }
  },
  created() {
    this.fetchAdditionalFunctionStatuses();
  },
  methods: {
    async fetchAdditionalFunctionStatuses() {
      const { data } = await fetchAdditionalFunctionStatuses();
      await this.$store.dispatch('setAdditionalFunctionStatuses', data);
    },
  },
});
</script>

<style type="scss" scoped>
html {
  font-family: 'Hiragino Kaku Gothic Pro', 'Source Sans Pro', -apple-system,
    BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  color: #2e303e;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.layout {
  display: flex;
  width: 100%;
  background-color: #fafbfc;
}

.side-navigation-container {
  min-width: 172px;
  margin-left: 40px;
  height: auto;
}

@media screen and (max-width: 1080px) {
  .side-navigation-container {
    min-width: 66px;
    margin-left: auto;
  }
}

.navigation-content {
  width: 100%;
}
</style>
