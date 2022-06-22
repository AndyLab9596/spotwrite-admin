<template>
  <div>
    <div
      v-if="relatedPosts"
      class="related-posts"
      :class="{ 'preview-mode': previewMode }"
    >
      <div class="related-posts__nav">
        <!-- TODO 関連記事一覧にリンク -->
        <a class="related-posts__link" href="#">
          <img class="related-img" src="/app/icon/icon-related.svg" />
          <span>
            関連記事
            <span class="related-length">{{ relatedPosts.length }}</span>
            件
          </span>
          <img
            class="related-arrow"
            src="/app/icon/Icon-arrow-right-pink.svg"
          />
        </a>
        <!-- TODO 関連記事を書く追加 -->
        <base-button size="small" inverse @click="$emit('onCreateRelatedPost')"
          >関連記事を書く</base-button
        >
      </div>
      <div v-for="post in relatedPosts" :key="post.uuid" class="related-post">
        <img :src="post.thumbnail" class="related-post__thumbnail" />
        <div class="related-post__inner">
          <div class="related-post__header">{{ post.title }}</div>
          <div class="related-post__content">{{ post.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';

export default Vue.extend({
  components: {
    BaseButton,
  },
  props: {
    relatedPosts: {
      type: Array,
      required: true,
    },
    previewMode: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.related-posts {
  border-top: 1px solid $ruled_line;
  margin: 40px 0 0;
  padding: 36px 0 46px;

  &__nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 18px;
  }

  &__link {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    color: $main_color;
    text-decoration: none;
  }

  .related-img {
    margin: 0 3px 0 0;
  }

  .related-length {
    margin: 0 0 0 7px;
  }

  .related-arrow {
    margin: 0 0 0 15px;
  }
}

.related-post {
  display: flex;
  align-items: center;
  margin: 0 0 20px;
  max-width: 800px;

  &:last-of-type {
    margin: 0;
  }

  &__thumbnail {
    width: 100px;
    height: 75px;
    margin: 0 22px 0 0;
    object-fit: cover;
  }

  &__inner {
    max-width: 600px;
  }

  &__header {
    font-size: 15px;
    font-weight: bold;
    color: $main_color;
    line-height: 1;
  }

  &__content {
    margin: 10px 0 0 0;
    font-size: 15px;
    font-weight: normal;
    color: $sub_color;
    width: 100%;
    height: 50px;
    $lines: 2;
    $line-multiple: 1.3;
    $font-size: 15px;

    display: -webkit-box;
    max-height: $font-size * $line-multiple * $lines;
    line-height: $font-size * $line-multiple;
    text-overflow: ellipsis;
    overflow: hidden;
    word-wrap: break-word;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
  }
}

.preview-mode {
  pointer-events: none;
}
</style>
