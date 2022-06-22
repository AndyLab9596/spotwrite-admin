<template>
  <div
    class="room-container"
    :class="[isCurrentRoom ? 'current-room' : 'other-room']"
    @click="getSelectRoom()"
  >
    <room-icon class="room-icon-size" :src="displayRoomIcon"></room-icon>
    <div class="room-text">
      <div class="room-text-top">
        <div class="room-name">{{ displayRoomName }}</div>
        <!-- 自分と相手以上の人数を表示する -->
        <div v-if="Object.keys(room.users).length > 2" class="room-user-count">
          {{ Object.keys(room.users).length + '人' }}
        </div>
        <div class="latest-message-date-style">
          {{ formatDate(room.latest_message_date) }}
        </div>
      </div>
      <div class="latest-message-text">{{ room.latest_message }}</div>
    </div>
    <div v-if="room.unread_message_count !== 0" class="unread-count-container">
      <div class="unread-count-container-text">
        {{ room.unread_message_count }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import RoomIcon from '@/components/App/atoms/messages/RoomIcon.vue';
import dayjs from 'dayjs';

export default Vue.extend({
  components: {
    RoomIcon,
  },
  props: {
    isCurrentRoom: {
      type: Boolean,
      required: true,
      default: false,
    },
    room: {
      type: Object as PropType<Types.MessageRoom>,
      required: true,
    },
  },
  computed: {
    displayRoomName() {
      const loginUser = this.$accessor.userProfile;
      if (this.room.is_dm) {
        const { users } = this.room;
        const otherUser = users.filter(
          (user: { name: string; uuid: string }) =>
            user.uuid !== loginUser?.uuid
        );
        return otherUser[0] && otherUser[0].name ? otherUser[0].name : '';
      }
      return this.room.display_name;
    },
    displayRoomIcon() {
      const loginUser = this.$accessor.userProfile;
      if (this.room.is_dm) {
        const { users } = this.room;
        const otherUser = users.filter(
          (user: { name: string; uuid: string; icon_url: string }) =>
            user.uuid !== loginUser?.uuid
        );
        return otherUser[0] && otherUser[0].icon_url
          ? otherUser[0].icon_url
          : '';
      }
      return this.room.room_icon;
    },
  },
  methods: {
    getSelectRoom(room_uuid: string) {
      this.$emit('getSelectRoom', room_uuid);
    },
    formatDate(time: number) {
      return dayjs.unix(time).format('YYYY/MM/DD (dd) HH:mm');
    },
  },
});
</script>
<style lang="scss" scoped>
.room-container {
  position: relative;
  display: flex;
  height: 65px;
  width: 326px;
  padding: 13px 13px;
  border-top: 1px solid $ruled_line;
  cursor: pointer;
  box-sizing: border-box;
  flex-direction: row;
}

.current-room {
  background: #f4f4f4;
}

.other-room {
  background: $true_white;
}

.room-name {
  max-width: 90px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.room-user-count {
  padding: 3px 4px;
  background: $ruled_line;
  border-radius: 2px;
  font-size: 9px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
}

.room-icon-size {
  min-width: 40px;
  min-height: 40px;
  width: 40px;
  height: 40px;
}

.room-text {
  display: flex;
  flex-direction: column;
  padding-left: 8px;
  width: 100%;
}

.room-text-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.latest-message-date-style {
  width: 130px;
  color: #9c9da5;
  font-size: 11px;
}

.latest-message-text {
  font-size: 11px;
  max-width: 221px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.unread-count-container {
  height: 24px;
  width: auto;
  padding: 0 8px;
  border-radius: 40px;
  background-color: $link_color;
  position: absolute;
  right: 16px;
  bottom: 9px;
  display: flex;
  justify-content: center;
}

.unread-count-container-text {
  color: $true_white;
  font-size: 13px;
  line-height: 24px;
}
</style>
