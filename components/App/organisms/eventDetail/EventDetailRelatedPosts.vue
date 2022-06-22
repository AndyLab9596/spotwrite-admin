<template>
  <div>
    <!--          TODO: 関連記事一覧ページを実装してください-->
    <div class="relation-wrapper">
      <img src="/app/icon/Icon-article.svg" alt="" class="icon-article" />
      <span class="article-text">関連記事</span>
      <span class="count-number-text">
        {{ relationPostCount }}
      </span>
      <span class="count-text">件</span>
      <img src="/app/icon/Icon-arrow_right.svg" alt="" class="icon-arrow" />
    </div>
    <!--    TODO: 関連記事一覧ページのAPI連携時修正お願いします-->
    <!--    <event-detail-related-posts-item class="post-item" />-->
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
// import EventDetailRelatedPostsItem from '@/components/organisms/eventDetail/EventDetailRelatedPostsItem.vue';

export default Vue.extend({
  components: {
    // EventDetailRelatedPostsItem,
  },
  props: {
    event: {
      type: Object as PropType<ApiResponse.Event>,
      required: false,
      default: null,
    },
  },
  computed: {
    relationPostCount(): number {
      return this.event ? this.event.relation_post_count : 0;
    },
  },
});
</script>

<style lang="scss" scoped>
.relation-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 40px 0 24px 0;
}

.icon-article {
  width: 16px;
  margin-right: 7px;
}

.icon-arrow {
  width: 8px;
}

.article-text,
.count-text,
.count-number-text {
  color: #2e303e;
  font-size: 15px;
  line-height: 1em;
}

.article-text {
  margin-right: 6px;
}

.count-text {
  margin-right: 16px;
}

.post-item {
  margin: 0 0 24px 0;

  &:last-of-type {
    margin: 0;
  }
}
</style>
