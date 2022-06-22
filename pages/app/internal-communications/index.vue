<template>
  <div class="container">
    <vue-loading
      v-if="isLoadingPost"
      type="spin"
      class="post-loading"
      color="#333"
      :size="{ width: '50px', height: '110px' }"
    />
    <post-cards
      class="post-cards"
      :items="posts"
      :is-loading="isLoadingPost"
      :is-visitor="isVisitor"
      @onClickDeletePost="clickDeletePost"
      @onClickEditPost="clickEditPost"
    />
    <post-create-modal
      v-if="showPostCreateModal"
      :edit-post-uuid="editPostUuid"
      @close="closeModal"
      @re-render="reRender"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { VueLoading } from 'vue-loading-template';

import PostCards from '@/components/App/organisms/list/PostCards.vue';
import PostCreateModal from '@/components/App/organisms/modal/PostCreateModal.vue';
import { fetchNewsPosts, fetchUser, deletePost } from '@/libs/api/app';

export default Vue.extend({
  layout: 'app/default',
  components: {
    VueLoading,
    PostCards,
    PostCreateModal,
  },
  data() {
    return {
      showPostCreateModal: false,
      posts: [] as Array<ApiResponse.Post>,
      isLoadingPost: false,
      accessPermission: 'all' as string,
      editPostUuid: '' as string,
    };
  },
  computed: {
    isVisitor(): boolean {
      return ['visitor'].includes(this.accessPermission);
    },
  },
  async created(): Promise<void> {
    const {
      data: { access_permission },
    } = await fetchUser(this.$accessor.userProfile.uuid);
    this.accessPermission = access_permission;
    await this.fetchPostsData();
  },
  methods: {
    async fetchPostsData() {
      this.isLoadingPost = true;
      const { data } = await fetchNewsPosts();
      this.posts = data.posts;
      this.isLoadingPost = false;
    },
    async clickDeletePost(uuid: string) {
      try {
        await deletePost(uuid);
        window.location.reload();
      } catch (e) {
        alert('記事を削除できませんでした。');
      }
    },
    clickEditPost(uuid: string) {
      this.editPostUuid = uuid;
      this.showPostCreateModal = true;
    },
    async reRender() {
      this.posts = [];
      this.showPostCreateModal = false;
      await this.fetchPostsData();
      this.isLoadingPost = false;
    },
    closeModal() {
      this.showPostCreateModal = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  margin-top: 50px;
  margin-bottom: 50px;
}
</style>
