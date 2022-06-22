<template>
  <div v-if="notices && notices.length > 0">
    <div v-if="selectedTab === 'important'">
      <h1 class="tab-title">お知らせ</h1>
      <notice-button
        left-button-content="新着情報"
        right-button-content="重要な記事"
        :right-selected="true"
        @clickLeft="selectTab('new')"
        @clickRight="selectTab('important')"
      />
      <div class="notice-list" :style="[{ height: windowHeight - 250 + 'px' }]">
        <div
          v-for="notice in importantNotices"
          :key="notice.uuid"
          class="notice"
          @click="onSave(notice)"
        >
          <div class="notice__read">
            <check-icon :checked="!notice.is_read" class="notice__check-icon" />
            <span v-if="!notice.is_read" class="unread-notice">未読</span>
            <span v-else class="read-notice">既読</span>
          </div>
          <div class="notice-inner">
            <div
              class="notice-inner__content"
              :class="{ 'read-notice': notice.is_read }"
            >
              <div>{{ notice.created_at | dateFilter }}</div>
              <div>{{ notice.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedTab === 'new'">
      <h1 class="tab-title">新着情報</h1>
      <notice-button
        left-button-content="新着情報"
        right-button-content="重要な記事"
        :left-selected="true"
        @clickLeft="selectTab('new')"
        @clickRight="selectTab('important')"
      />
      <div class="notice-list" :style="[{ height: windowHeight - 250 + 'px' }]">
        <div
          v-for="notice in newNotices"
          :key="notice.uuid"
          class="notice"
          @click="onSave(notice)"
        >
          <div class="notice__read">
            <check-icon :checked="!notice.is_read" class="notice__check-icon" />
            <span v-if="!notice.is_read" class="unread-notice">未読</span>
            <span v-else class="read-notice">既読</span>
          </div>
          <div class="notice-inner">
            <div
              class="notice-inner__content"
              :class="{ 'read-notice': notice.is_read }"
            >
              <div>{{ notice.created_at | dateFilter }}</div>
              <div v-html="notice.content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import CheckIcon from '@/components/App/atoms/icons/CheckIcon.vue';
import NoticeButton from '@/components/App/atoms/buttons/NoticeButton.vue';
import dayjs from '@/libs/dayjs';

type UserNotice = {
  action_type: string;
  content: string;
  created_at: number;
  is_read: boolean;
  params: null;
  route_name: string;
  type: string;
  uuid: string;
  web_url: string;
};

export default Vue.extend({
  components: {
    CheckIcon,
    NoticeButton,
  },
  filters: {
    dateFilter: (notice: any) => {
      if (notice === '') {
        return dayjs().format('YYYY/MM/DD');
      }
      return dayjs.unix(notice as number).format('YYYY/MM/DD');
    },
  },
  props: {
    notices: {
      type: Array,
      required: true,
    } as PropOptions<UserNotice[]>,
  },
  data() {
    return {
      selectedTab: 'new' as string,
    };
  },
  computed: {
    importantNotices() {
      return this.notices.filter(
        (notice: UserNotice) => notice.type === 'important'
      );
    },
    newNotices() {
      return this.notices.filter((notice: UserNotice) => notice.type === 'new');
    },
    windowHeight() {
      return window.innerHeight || 0;
    },
  },
  methods: {
    selectTab(key: string) {
      this.selectedTab = key;
      this.$emit('onSelectTab', this.selectedTab);
    },
    onSave(notice: AppApiResponse.UserNotice) {
      this.$emit('onSave', notice);
    },
  },
});
</script>

<style lang="scss" scoped>
.notice {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 13px 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;

  &:nth-of-type(1) {
    padding: 0;
  }
}

.notice__read {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 0 auto;
  min-width: 15px;
  margin: 0 5px 0 0;
  font-size: 15px;
  line-height: 1;
}

.notice__check-icon {
  display: flex;
  margin: 0 0 8px;
}

.unread-notice {
  color: $link_color;
}

.read-notice {
  color: $true_white;
  opacity: 0.6;
}

.pink-bg {
  background-color: $link_color;
}

.notice-inner {
  width: 220px;
}

.notice-inner__content {
  color: $true_white;
  font-size: 12px;
  line-height: 21px;
}

.notice-buttons {
  margin: 13px 0;
  display: flex;
  justify-content: space-between;
}

.tab-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 24px;
  color: $true_white;
  text-align: center;
  margin: 0 0 16px;
}

.notice-list {
  overflow-x: scroll;
  margin-top: 10px;
}
</style>
