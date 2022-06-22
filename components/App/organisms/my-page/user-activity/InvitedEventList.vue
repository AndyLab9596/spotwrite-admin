<template>
  <div>
    <div v-for="(items, key) in postsEveryMonth" :key="key">
      <invited-event-list-header :month="items[0]" />
      <template v-for="item in sortPosts(items[1])">
        <event-list-item :key="item.uuid" :posts="item" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from '@/libs/dayjs';
import EventListItem from '../../event/EventListItem.vue';
import InvitedEventListHeader from './InvitedEventListHeader.vue';

type PostsEveryMonth = {
  [key: string]: AppApiResponse.Post[];
};

export default Vue.extend({
  components: {
    EventListItem,
    InvitedEventListHeader,
  },
  props: {
    posts: {
      type: Array as PropType<AppApiResponse.Post[]>,
      required: true,
      default: [],
    },
    isParticipationEvent: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    postsEveryMonth(): [string, AppApiResponse.Post[]][] {
      const posts = {} as PostsEveryMonth;

      this.posts.forEach((item: AppApiResponse.Post) => {
        // isParticipationEvent ? filter : allPost
        if (
          this.isParticipationEvent &&
          !item.event?.participation_users.some(
            (user: AppApiResponse.EventUser) =>
              user.uuid === this.$accessor.userProfile.uuid
          )
        ) {
          return; // continue
        }

        if (!item.event?.start_at) {
          return; // continue
        }

        const i = dayjs.unix(item.event.start_at).format('M');
        (posts[i] || (posts[i] = [])).push(item);
      });

      const sortPost = Object.entries(posts) as [
        string,
        AppApiResponse.Post[]
      ][];
      sortPost.sort(
        (
          a: [string, AppApiResponse.Post[]],
          b: [string, AppApiResponse.Post[]]
        ) => {
          return Number(b[0]) - Number(a[0]);
        }
      );

      return sortPost;
    },
  },
  methods: {
    sortPosts(item: AppApiResponse.Post[]) {
      return item.sort((a: AppApiResponse.Post, b: AppApiResponse.Post) => {
        // 同じ日付の場合イベント開始時刻の昇順で並び替える
        if (a.date === b.date && a.event?.start_at && b.event?.start_at) {
          return a.event.start_at - b.event.start_at;
        }
        return b.date - a.date;
      });
    },
  },
});
</script>
