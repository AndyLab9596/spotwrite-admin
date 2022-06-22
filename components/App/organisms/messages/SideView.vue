<template>
  <div class="left-contents">
    <header class="left-contents-head">
      <img
        src="/icon/arrow_left.svg"
        class="arrow-left"
        alt=""
        @click="onGoBack"
      />
      <div class="left-header-inner">
        <h1 class="left-header-inner__title">メッセージ一覧</h1>
        <a href="#" class="create-new" @click.prevent="createNewGroup">
          <img src="/app/icon/icon-new-chat.svg" alt="新しいメッセージ" />
        </a>
      </div>
    </header>
    <div ref="msgRooms" class="msg__rooms">
      <SearchInput @onSubmit="onSubmit" />
      <div v-if="isLoading">
        <vue-loading
          type="spin"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
      </div>
      <div v-else class="msg__rooms__scroll">
        <div
          v-for="(room, index) in rooms"
          :key="room.room_uuid"
          :class="{ 'last-room': index === rooms.length - 1 }"
        >
          <RoomItem
            :is-current-room="room.room_uuid === currentRoom.room_uuid"
            :room="room"
            @getSelectRoom="getSelectRoom(room.room_uuid)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import RoomItem from '@/components/App/atoms/messages/RoomItem.vue';
import SearchInput from '@/components/App/atoms/messages/SearchInput.vue';
import { VueLoading } from 'vue-loading-template';

export default Vue.extend({
  components: {
    RoomItem,
    SearchInput,
    VueLoading,
  },
  props: {
    rooms: {
      type: Array as PropType<Types.MessageRoom[]>,
      required: true,
    },
    currentRoom: {
      type: Object as PropType<Types.MessageRoom>,
      required: true,
    },
    isLoading: {
      type: Boolean as PropType<Boolean>,
      required: true,
    },
  },
  data() {
    return {
      currentMouseOverRoomId: '' as string,
      clickRoomId: '' as string,
    };
  },
  computed: {
    active() {
      return (id: string): boolean => {
        return this.clickRoomId === id;
      };
    },
  },
  mounted(): void {
    const container = this.$refs.msgRooms as HTMLElement;
    if (container) {
      container.addEventListener('scroll', this.handleScroll);
    }
  },
  methods: {
    mouseOverAction(roomUuid: string) {
      this.currentMouseOverRoomId = roomUuid;
    },
    mouseleaveAction() {
      this.clickRoomId = '';
      this.currentMouseOverRoomId = '';
    },
    createNewGroup() {
      this.$emit('createNewGroup');
    },
    getSelectRoom(room_uuid: string) {
      this.$emit('getSelectRoom', room_uuid);
      this.$router.push(`/message`);
    },
    clickRoomMenu(roomUuid: string) {
      if (this.clickRoomId === roomUuid) {
        this.clickRoomId = '';
        return;
      }
      this.clickRoomId = roomUuid;
    },
    toggleExitGroupModal(roomUuid: string) {
      this.$emit('toggleModal', roomUuid);
    },
    async handleScroll() {
      const element = this.$refs.msgRooms as HTMLElement;
      if (!element) return;
      const { clientHeight } = element;
      const { scrollHeight } = element;
      if (scrollHeight - (clientHeight + element.scrollTop) === 0) {
        this.$emit('addRooms');
      }
    },
    onSubmit(searchWord: string) {
      this.$emit('searchWord', searchWord);
    },
    onGoBack() {
      this.$router.back();
    },
  },
});
</script>

<style lang="scss" scoped>
.left-contents {
  width: 326px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $main_background_color;
  box-shadow: 0 3px 6px $box-shadow-dark;
  margin: 0 24px 0 0;
}

.left-contents-head {
  padding: 0 17px 7.5px 16px;
}

.arrow-left {
  width: 10px;
  height: 16px;
  margin-top: 42px;
  margin-bottom: 24px;
  cursor: pointer;
}

.left-header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-header-inner__title {
  color: $dark_blue;
  font-size: 13px;
  font-weight: 600;
}

.msg {
  &__rooms {
    // height: calc(100vh - 60px);
    display: flex;
    align-items: 1;
    flex-direction: column;
    overflow: hidden;

    &__scroll {
      overflow: auto;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &__item {
      position: relative;
      display: flex;
      height: 50px;
      padding: 10px;
      border-radius: 5px;
      background: $true_white;
      justify-content: space-between;
      cursor: pointer;

      &__users {
        max-width: 180px;
        margin-left: 5px;
        font-size: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    &__item__other__room {
      position: relative;
      display: flex;
      height: 50px;
      padding: 10px;
      border-radius: 5px;
      background: #fff;
      justify-content: space-between;
      cursor: pointer;

      &__users {
        margin-left: 5px;
        font-size: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }

  &__users {
    display: flex;
    align-items: center;
    padding: 14px;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    max-height: 7%;
    position: fixed;
    top: 0;
    width: 100%;
    max-width: 50%;
    background-color: #fff;
    z-index: 1;

    &__name {
      margin-left: 5px;
      font-size: 14px;
    }
  }
}

.last-room {
  border-bottom: 1px solid $ruled_line;
}

.error {
  margin: 10px 0;
  font-weight: bold;
  color: red;
}

ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.new-message-img {
  cursor: pointer;
  width: 22px;
}

.room-sub-menu-img {
  width: 14px;
  z-index: 7;
}

.room-title {
  display: flex;
  align-items: center;
  width: 100%;
}

.room-menu {
  display: none;
}

.room-menu-active {
  display: block;
  position: absolute;
  top: 50px;
  right: -5px;
  font-size: 12px;
  border: 1px solid #ccc;
  height: 70px;
  background-color: white;
  padding: 5px 10px;
  z-index: 6;
}

.room-menu-active::before {
  content: '';
  position: absolute;
  top: -30px;
  left: 75%;
  margin-left: -15px;
  border: 15px solid transparent;
  border-bottom: 15px solid #ccc;
}

.room-menu-active::after {
  content: '';
  position: absolute;
  top: -28px;
  left: 75%;
  margin-left: -15px;
  border: 15px solid transparent;
  border-bottom: 15px solid white;
}

.room-menu-active > ul > li {
  cursor: pointer;
}

.modal-message {
  display: flex;
  flex-direction: column;
}

.modal-message-title {
  margin-bottom: 20px;
}

.room-icon-size {
  width: 30px;
  height: 30px;
}
</style>
