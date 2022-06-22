<template>
  <div
    class="right-side-navigation-container"
    :class="showCheckList ? 'right-side-navigation-show-list' : ''"
  >
    <div class="right-side-navigation-wrap">
      <div
        v-if="isEnableMessenger"
        class="right-side-navigation-icon-container"
        @click="onClickMessageNavigation"
      >
        <div class="todo-icon">
          <icon class="right-side-navigation-icon" name="talk_w" />
          <div v-if="unreadMessagesCountNotice > 0" class="todo-counter">
            {{ unreadMessagesCountNotice }}
          </div>
        </div>
      </div>
      <div
        class="right-side-navigation-icon-container"
        @click="selectSection('tasks')"
      >
        <div class="todo-icon">
          <icon class="right-side-navigation-icon" name="check_w" />
          <div v-if="tasks && tasksIconCount(tasks) > 0" class="todo-counter">
            {{ tasksIconCount(tasks) }}
          </div>
        </div>
      </div>
      <div
        class="right-side-navigation-icon-container"
        @click="selectSection('notices')"
      >
        <div class="todo-icon">
          <icon class="right-side-navigation-icon" name="help_w" />
          <div
            v-if="notices && notificationsIconCount(notices) > 0"
            class="todo-counter"
          >
            {{ notificationsIconCount(notices) }}
          </div>
        </div>
      </div>
    </div>
    <div class="right-side-navigation-list-container">
      <div
        class="right-side-navigation-list-back"
        :class="{ 'right-side-navigation-list-back--notice': noticeSelected }"
        @click="onClickCheckListHide"
      >
        <icon class="right-side-navigation-icon" name="arrow_r" />
      </div>
      <todo-list
        v-if="selectedIcon === 'tasks'"
        :tasks="tasks"
        @onSave="onClickTaskNavigation"
      />
      <notice-list
        v-if="selectedIcon === 'notices'"
        :notices="notices"
        @onSelectTab="onSelectNoticeListTab"
        @onSave="onClickNotificationsNavigation"
      />
    </div>
    <PopupModal
      :style="{ display: !popups.length ? 'none' : null }"
      :popups="popups"
      @changeActivePopupType="changeActivePopupType"
      @close="closePopupModal"
    />
    <interview-room-modal
      v-if="interviewRoomModal"
      :room-id="interviewRoomId"
      :room-is-close="interviewRoomClosed"
      @close="closeInterviewRoomModal"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '@/components/App/atoms/images/Icon.vue';
import TodoList from '@/components/App/molecules/todos/TodoList.vue';
import NoticeList from '@/components/App/molecules/notices/NoticeList.vue';
import PopupModal from '@/components/App/organisms/modal/popup/PopupModal.vue';
import InterviewRoomModal from '@/components/App/organisms/modal/InterviewRoomModal.vue';
import {
  fetchUserTasks,
  putUserTask,
  fetchUserNotifications,
  putUserNotice,
  unreadMessagesCount,
  fetchUserPopups,
  readAllUserNotices,
} from '@/libs/api/app';
import { mapGetters } from 'vuex';
import { cloneDeep } from 'lodash';

type NoticeEvent = {
  body: string;
};

export default Vue.extend({
  components: {
    Icon,
    TodoList,
    NoticeList,
    PopupModal,
    InterviewRoomModal,
  },
  data() {
    return {
      selectedIcon: '' as string,
      showCheckList: false,
      tasks: [] as AppApiResponse.UserTask[],
      notices: [] as AppApiResponse.UserNotice[],
      popups: [] as AppApiResponse.UserPopup[],
      unreadMessagesCountNotice: 0 as number,
      activePopupType: null as string,
      selectedTab: 'new' as string,
      timeout: null,
      interviewRoomModal: false as boolean,
      interviewRoomId: 0 as number,
      interviewRoomClosed: false as boolean,
    };
  },
  computed: {
    noticeSelected(): boolean {
      return this.selectedIcon === 'notices';
    },
    ...mapGetters(['isEnableMessenger']),
  },
  async created(): Promise<void> {
    await Promise.all([
      this.fetchTasksData(),
      this.fetchNotificationsData(),
      this.fetchUnreadMessagesCount(),
    ]);
    this.fetchPopupsData();
    if (this.$route.query && this.$route.query.room_id) {
      const roomId = this.getInterviewRoomByQueryParam(this.$route.query);
      if (roomId > 0) {
        this.interviewRoomId = roomId;
        this.interviewRoomModal = true;
      }
    }
  },
  async mounted() {
    // @ts-ignore
    this.$echo
      .channel(`notice.${this.$accessor.userProfile.uuid}`)
      .listen('UserHasNewNotice', (e: NoticeEvent) => {
        const body = JSON.parse(e.body);
        switch (body.notice_type) {
          case 'new_message':
            this.fetchUnreadMessagesCount();
            break;
          case 'new_notice':
            this.fetchNotificationsData();
            break;
          case 'new_task':
            this.fetchTasksData();
            break;
          case 'end_interview_room':
            if (
              this.interviewRoomModal &&
              !this.interviewRoomClosed &&
              this.interviewRoomId === body.room_id
            ) {
              this.interviewRoomClosed = true;
            }
            if (
              this.interviewRoomId === body.room_id &&
              body.from_user_uuid === this.$accessor.userProfile.uuid
            ) {
              window.location.reload();
            }

            this.fetchTasksData();
            break;
          default:
            break;
        }
      })
      .listen('UserReadNotice', (e: NoticeEvent) => {
        const body = JSON.parse(e.body);
        if (body.notice_type === 'read_message') {
          this.fetchUnreadMessagesCount();
        }
      })
      .listen('UserHasNewPopup', (e: NoticeEvent) => {
        const body = JSON.parse(e.body);
        const sameTypeItems = this.popups.filter(
          (popup: AppApiResponse.UserPopup) =>
            popup.popup_type === body.popup_type
        );
        if (body.popup_type === this.activePopupType) {
          this.popups.splice(this.popups.indexOf(sameTypeItems[0]), 0, body);
        } else {
          const activeIndex = this.popups.findIndex(
            (popup: AppApiResponse.UserPopup) =>
              popup.popup_type === this.activePopupType
          );
          this.popups = this.popups.filter(
            (popup: AppApiResponse.UserPopup) =>
              popup.popup_type !== body.popup_type
          );
          this.popups.splice(activeIndex + 1, 0, body, ...sameTypeItems);
        }
      });
  },
  async destroyed() {
    // @ts-ignore
    this.$echo
      .channel(`notice.${this.$accessor.userProfile.uuid}`)
      .stopListening('UserHasNewNotice')
      .stopListening('UserReadNotice')
      .stopListening('UserHasNewPopup');
  },
  methods: {
    getInterviewRoomByQueryParam(query: any) {
      const roomIdParam = query.room_id;
      const tasks = cloneDeep(this.tasks);
      return tasks.reduce((newData: number, item: any) => {
        let newValue = newData;
        if (item.web_url.match(/^\/interview-room/)) {
          const arr = item.web_url.split('/');
          const id = arr[arr.length - 1];
          if (id === roomIdParam) {
            newValue = parseInt(roomIdParam, 10);
          }
        }
        return newValue;
      }, 0);
    },
    async onClickTaskNavigation(task: AppApiResponse.UserTask) {
      if (task.web_url.match(/^\/interview-room/)) {
        const arr = task.web_url.split('/');
        const roomId = parseInt(arr[arr.length - 1], 10);
        this.interviewRoomModal = true;
        this.interviewRoomId = roomId;
      } else {
        this.$router.push(task.web_url);
        await this.putTasksData(task);
      }
    },
    async onClickNotificationsNavigation(notice: AppApiResponse.UserNotice) {
      this.$router.push(notice.web_url);
      await this.putUserNotice(notice);
    },
    onClickMessageNavigation() {
      this.$router.push('/message');
    },
    onClickCheckListShow() {
      this.showCheckList = true;
    },
    onSelectNoticeListTab(selectedTab: string, timeOut: number = 1000) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      const unreadNotices = this.notices.filter(
        (notice: AppApiResponse.UserNotice) =>
          !notice.is_read && notice.type === selectedTab
      );
      if (unreadNotices.length) {
        this.timeout = setTimeout(() => {
          readAllUserNotices(selectedTab);
        }, timeOut);
      }
      this.selectedTab = selectedTab;
    },
    selectSection(key: string) {
      this.selectedIcon = key;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      const timeOut = this.showCheckList ? 1000 : 1500;
      if (this.selectedIcon === 'tasks') {
        const unreadTasks = this.tasks.filter(
          (task: AppApiResponse.UserTask) => !task.is_read
        );
        if (unreadTasks.length) {
          this.timeout = setTimeout(() => {
            readAllUserNotices('task');
          }, timeOut);
        }
      }
      if (this.selectedIcon === 'notices') {
        this.onSelectNoticeListTab(this.selectedTab, timeOut);
      }
      this.onClickCheckListShow();
    },
    onClickCheckListHide() {
      this.showCheckList = false;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
    },
    tasksIconCount(tasks: AppApiResponse.UserTask[]) {
      const tasksIconCount = tasks.filter(
        (task: AppApiResponse.UserTask) => task.is_read === 0
      );
      return tasksIconCount.length;
    },
    notificationsIconCount(notifications: AppApiResponse.UserNotice[]) {
      const notificationsIconCount = notifications.filter(
        (notice: any) => notice.is_read === 0
      );
      return notificationsIconCount.length;
    },
    async fetchTasksData() {
      try {
        const { data } = await fetchUserTasks();
        this.tasks = data.data;
      } catch (e) {
        console.log(e);
      }
    },
    async putTasksData(task: AppApiResponse.UserTask) {
      try {
        await putUserTask(task.uuid);
      } catch (e) {
        console.log(e);
      }
    },
    async fetchNotificationsData(): Promise<void> {
      try {
        const newRes = await fetchUserNotifications({
          limit: 50,
          type: 'new',
        });
        this.notices = newRes.data.data;

        const importantRes = await fetchUserNotifications({
          limit: 50,
          type: 'important',
        });
        this.notices.push(...importantRes.data.data);
      } catch (e) {
        console.log(e);
      }
    },
    async putUserNotice(notice: AppApiResponse.UserNotice) {
      try {
        await putUserNotice(notice.uuid);
      } catch (e) {
        console.log(e);
      }
    },
    async fetchPopupsData(): Promise<void> {
      try {
        const { data } = await fetchUserPopups();
        this.popups = data;
        this.activePopupType =
          this.popups[0] && this.popups[0].popup_type
            ? this.popups[0].popup_type
            : '';
      } catch (e) {
        console.log(e);
      }
    },
    changeActivePopupType(type: string) {
      this.activePopupType = type;
    },
    async fetchUnreadMessagesCount() {
      try {
        const { data } = await unreadMessagesCount();
        this.unreadMessagesCountNotice = data.unread_messages;
      } catch (e) {
        console.log(e);
      }
    },
    closePopupModal() {
      this.popups = [];
    },
    closeInterviewRoomModal() {
      this.interviewRoomModal = false;
      this.interviewRoomClosed = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.right-side-navigation-container {
  display: flex;
  height: 100vh;
  width: 354px;
  top: 0;
  position: fixed;
  right: -282px;
  overflow: hidden;
  transition-timing-function: ease;
  transition-duration: 0.5s;
  z-index: 11;
}

.right-side-navigation-show-list {
  right: 0;
}

.right-side-navigation-wrap {
  background-color: $icon_gray;
  display: flex;
  flex-direction: column;
  width: 72px;
  min-height: 100vh;
  height: max-content;
}

.right-side-navigation-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 72px;
  height: 72px;
  cursor: pointer;
}

.right-side-navigation-list-container {
  background-color: #707389;
  display: flex;
  flex-direction: column;
  width: 282px;
  padding: 24px 16px 0 20px;
  min-height: 100vh;
  height: max-content;
}

.right-side-navigation-list-back {
  margin: 0 0 24px;
  line-height: 1;
  cursor: pointer;
}

.right-side-navigation-list-back--notice {
  margin: 0 0 8px;
  line-height: 1;
  cursor: pointer;
}

.todo-icon {
  position: relative;
}

.todo-counter {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: $danger_color;
  color: $true_white;
  font-size: 10px;
  position: absolute;
  top: -5px;
  right: -15px;
}
</style>
