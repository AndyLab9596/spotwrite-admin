<template>
  <div :key="componentKey" class="layout">
    <side-navigation
      class="side-navigation"
      :access-permission="accessPermission"
      @change-access-permission="changeAccessPermission"
      @re-render="reRender"
    />
    <nuxt class="navigation-content" />
    <right-side-navigation />
    <write-contained-button
      v-if="!['visitor'].includes(accessPermission)"
      class="write-button"
      @click="onClick"
    />
    <post-create-modal
      v-if="showPostCreateModal"
      :style="{ zIndex: 999 }"
      @close="closeModal"
      @showDraft="showDraft"
      @showPreview="showPreview"
      @re-render="reRender"
    />
    <post-draft-modal v-if="showDraftModal" @close="closeDraftModal" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SideNavigation from '@/components/App/organisms/navigation/SideNavigation.vue';
import RightSideNavigation from '@/components/App/organisms/navigation/RightSideNavigation.vue';
import WriteContainedButton from '@/components/App/atoms/buttons/WriteContainedButton.vue';
import PostCreateModal from '@/components/App/organisms/modal/PostCreateModal.vue';
import PostDraftModal from '@/components/App/organisms/modal/PostDraftModal.vue';
import { fetchAdditionalFunctionStatuses } from '@/libs/api/app';

export default Vue.extend({
  components: {
    SideNavigation,
    RightSideNavigation,
    WriteContainedButton,
    PostCreateModal,
    PostDraftModal,
  },
  data() {
    return {
      showPostCreateModal: false as boolean,
      showPreviewModal: false as boolean,
      previewPost: {} as AppApiResponse.Post,
      selectImageSrc: '' as string,
      showDraftModal: false as boolean,
      accessPermission: 'all' as string,
      componentKey: 0,
    };
  },
  middleware: ['auth', 'mentalCheck', 'accessCount'],
  beforeCreate() {
    if (process.env.ApiMock?.toLowerCase() === 'true') {
      console.info('Mock API 使用中');
    }
  },
  created() {
    this.fetchAdditionalFunctionStatuses();
  },
  methods: {
    changeAccessPermission(accessPermission: string) {
      this.accessPermission = accessPermission;
    },
    onClick() {
      this.showPostCreateModal = true;
    },
    reRender() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      this.componentKey += 1;
    },
    closeModal() {
      this.showPostCreateModal = false;
    },
    showPreview(post: AppApiResponse.Post) {
      if (post.images.length > 0) {
        this.selectImageSrc = post.thumbnail;
      }
      if (post.images.length === 0) {
        this.selectImageSrc = '/image/no-image.png';
      }
      this.showPreviewModal = !this.showPreviewModal;
      this.previewPost = post;
    },
    closePreviewModal() {
      this.showPreviewModal = false;
    },
    showDraft() {
      this.showDraftModal = !this.showDraftModal;
    },
    closeDraftModal() {
      this.showDraftModal = false;
    },
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
  background-color: $main_background_color;
}

.navigation-content {
  width: calc(100% - 282px);
  min-width: calc(600px + 20%);
}

.container {
  min-width: 800px;
  max-width: 800px;
  width: 800px;
  margin: auto;
}

.write-button {
  position: fixed;
  z-index: 1;
  right: 89px;
  bottom: 15px;
}
</style>
