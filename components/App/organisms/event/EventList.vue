<template>
  <div>
    <div v-for="(items, key) in postsEveryMonth" :key="key">
      <event-list-header :month="items[0]" />
      <template v-for="item in sortPosts(items[1])">
        <event-list-item
          :key="item.uuid"
          :posts="item"
          :is-visitor="isVisitor"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from '@/libs/dayjs';
import EventListItem from './EventListItem.vue';
import EventListHeader from './EventListHeader.vue';

type PostsEveryMonth = {
  [key: string]: ApiResponse.Post[];
};

export default Vue.extend({
  components: {
    EventListItem,
    EventListHeader,
  },
  props: {
    posts: {
      type: Array as PropType<ApiResponse.Post[]>,
      required: true,
      default: [],
    },
    isCompletedEvent: {
      type: Boolean,
      required: true,
    },
    isVisitor: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    postsEveryMonth(): [string, ApiResponse.Post[]][] {
      const posts = {} as PostsEveryMonth;

      this.posts.forEach((item: ApiResponse.Post) => {
        // 終了したイベントを取得
        if (
          this.isCompletedEvent &&
          item.event &&
          item.event.end_at < dayjs().unix()
        ) {
          const i = dayjs.unix(item.event.start_at).format('M');
          (posts[i] || (posts[i] = [])).push(item);
        }
        // 開催前&開催中のイベントを取得
        if (
          !this.isCompletedEvent &&
          item.event &&
          (item.event.start_at > dayjs().unix() ||
            item.event.end_at > dayjs().unix())
        ) {
          const i = dayjs.unix(item.event.start_at).format('M');
          (posts[i] || (posts[i] = [])).push(item);
        }
      });

      const sortPost = Object.entries(posts) as [string, ApiResponse.Post[]][];
      sortPost.sort(
        (a: [string, ApiResponse.Post[]], b: [string, ApiResponse.Post[]]) => {
          return Number(b[0]) - Number(a[0]);
        }
      );

      return sortPost;
    },
  },
  methods: {
    sortPosts(item: ApiResponse.Post[]) {
      return item.sort((a: ApiResponse.Post, b: ApiResponse.Post) => {
        // 同じ日付の場合イベント開始時刻の昇順で並び替える
        if (b.event && a.event && b.start_at === a.start_at) {
          return a.event.start_at - b.event.start_at;
        }
        return b.date - a.date;
      });
    },
  },
});
</script>
