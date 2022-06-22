<template>
  <div class="container">
    <event-header
      :years="years"
      :select-year="selectYear"
      :is-completed-event="isCompletedEvent"
      :is-visitor="isVisitor"
      @onChange="changeSelectYear"
      @onChangeCompletedEvent="changeCompletedEvent"
    />
    <event-list
      :posts="selectYearPosts"
      :is-completed-event="isCompletedEvent"
      :is-visitor="isVisitor"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import EventList from '@/components/App/organisms/event/EventList.vue';
import dayjs from '@/libs/dayjs';
import { fetchEvent, fetchUser } from '@/libs/api/app';
import EventHeader from '@/components/App/organisms/event/EventHeader.vue';

export default Vue.extend({
  layout: 'app/default',
  components: {
    EventList,
    EventHeader,
  },
  data() {
    return {
      years: [] as number[],
      selectYear: 0 as number,
      posts: [] as ApiResponse.Post[],
      selectYearPosts: [] as ApiResponse.Post[],
      month: [] as number[],
      isCompletedEvent: false as boolean,
      accessPermission: 'all' as string,
    };
  },
  computed: {
    isVisitor(): boolean {
      return ['visitor'].includes(this.accessPermission);
    },
  },
  async created() {
    this.createYears();
    try {
      const {
        data: { access_permission },
      } = await fetchUser(this.$accessor.userProfile.uuid);
      this.accessPermission = access_permission;
      const { data } = await fetchEvent();
      this.posts = data.posts;
      this.changePosts();
    } catch (error) {
      // eslint-disable-next-line no-console
      alert('イベント一覧の取得に失敗しました。');
    }
  },
  methods: {
    createYears() {
      const nowYear = dayjs().year();
      for (let i = nowYear - 10; i <= nowYear; i += 1) {
        this.years.push(i);
      }
      this.years.reverse();
      this.selectYear = nowYear;
    },
    changePosts() {
      this.filterSelectYearPosts();
      this.filterSelectYearPostsMonth();
    },
    filterSelectYearPosts() {
      this.selectYearPosts = [] as ApiResponse.Post[];

      this.posts.forEach((item: ApiResponse.Post) => {
        if (this.selectYear === Number(dayjs.unix(item.date).format('YYYY'))) {
          this.selectYearPosts.push(item);
        }
      });
    },
    filterSelectYearPostsMonth() {
      this.month = [] as number[];

      this.selectYearPosts.forEach((item: ApiResponse.Post) => {
        if (!this.month.includes(Number(dayjs.unix(item.date).format('M')))) {
          this.month.push(Number(dayjs.unix(item.date).format('M')));
        }
      });
    },
    changeSelectYear(year: number) {
      this.selectYear = year;
      this.changePosts();
    },
    changeCompletedEvent(boolean: boolean) {
      this.isCompletedEvent = boolean;
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  margin: 40px auto 120px;
}
</style>
