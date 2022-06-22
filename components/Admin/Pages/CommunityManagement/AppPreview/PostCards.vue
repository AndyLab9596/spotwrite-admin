<template>
  <div class="post-cards-container">
    <post-card
      v-for="item in items"
      :key="item.uuid"
      :date="item.date"
      :type="item.type"
      :title="item.title"
      :content="item.content"
      :thumbnail="item.thumbnail"
      :images="item.images"
      :videos="item.videos"
      :like-count="item.like_count"
      :comment-count="item.comment_count"
      :is-read="item.is_read"
      :is-liked="item.is_liked"
      :is-favorite="item.is_favorite"
      :user="item.user"
      :event="item.event"
      :questionnaire="item.questionnaire"
      :uuid="item.uuid"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PostCard from '~/components/Admin/Pages/CommunityManagement/AppPreview/PostCard.vue';

export default Vue.extend({
  components: {
    PostCard,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.post-cards-container {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}
</style>
