<template>
  <div class="container">
    <side-view
      :current-room="currentRoom"
      :rooms="rooms"
      :is-loading="isRoomsLoading"
      @getSelectRoom="getSelectRoom"
      @createNewGroup="selectMemberModal = true"
      @addRooms="addRooms"
      @searchWord="searchWord"
    />
    <main-view
      :current-room="currentRoom"
      :active-room-users="activeRoomUsers"
      :checked-organizations="checkedOrganizations"
      :rooms="rooms"
      :is-visitor="isVisitor"
      :load-employee="loadEmployee"
      @selectNewRoom="selectNewRoom"
      @clickRoomInfoUpdate="updateRoomInfo"
      @clickRoomIconUpdate="updateRoomIcon"
      @addUserCurrentRoom="addUserCurrentRoom"
      @removeUserCurrentRoom="removeUserCurrentRoom"
      @toggleOrganizationListModal="toggleOrganizationListModal"
      @logout="logout"
      @getSelectRoom="getSelectRoom"
      @toggleModal="toggleExitGroupModal"
      @messageAdded="onMessageAdded"
      @messageReaded="onMessageReaded"
    />
    <CheckExit
      v-if="exitGroupModal"
      :room-uuid="propRoomUuid"
      :button-text="`退出する`"
      @click="exitRoom"
      @toggleModal="toggleExitGroupModal"
    >
      <div class="modal-message">
        <div class="modal-message-title">スレッドから退出しますか？</div>
        <p>
          このスレッドからメッセージが届かなくなります。
        </p>
      </div>
    </CheckExit>
    <organization-list
      v-if="organizationListModal"
      @addOrganizations="addOrganizations"
      @toggleModal="toggleOrganizationListModal"
    >
      <div class="modal-message">
        <div>
          <div v-for="organization in organizations" :key="organization.uuid">
            <label class="label">
              <input
                v-model="checkedOrganizationUuids"
                type="checkbox"
                :value="organization.uuid"
              />{{ organization.name }}
            </label>
          </div>
        </div>
      </div>
    </organization-list>
    <new-group-modal
      v-if="newGroupModal"
      :selected-companies="selectedCompanies"
      :selected-organization-uuids="selectedOrganizationUuids"
      @close="closeNewGroupModal"
      @submit="submitNewGroup"
      @remove-selected-organization-uuid="removeSelectedOrganizationUuid"
      @remove-organization="removeSelectedOrganization"
      @remove-employee="removeSelectedEmployee"
    />
    <select-member-modal
      v-if="selectMemberModal"
      @close="closeSelectMemberModal"
      @submit="submitSelectMember"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import MainView from '@/components/App/organisms/messages/MainView.vue';
import SideView from '@/components/App/organisms/messages/SideView.vue';
import NewGroupModal from '@/components/App/organisms/messages/NewGroupModal.vue';
import SelectMemberModal from '@/components/App/organisms/messages/SelectMemberModal.vue';
import CheckExit from '@/components/App/organisms/modal/messages/CheckExit.vue';
import OrganizationList from '@/components/App/organisms/modal/messages/OrganizationList.vue';
import {
  logout,
  messageRooms,
  rooms,
  organizations,
  roomExit,
  roomUsers,
  updateRoomIcon,
  updateRoomName,
  updateRoomDescription,
  fetchUserNotifications,
  putUserNotice,
} from '@/libs/api/app';

export default Vue.extend({
  layout: 'app-message',
  components: {
    MainView,
    CheckExit,
    SideView,
    NewGroupModal,
    SelectMemberModal,
    OrganizationList,
  },
  data() {
    return {
      currentRoom: {
        room_uuid: '' as string,
        name: null as string | null,
        description: null as string | null,
        display_name: '' as string,
        room_icon: '' as string | null,
        is_dm: false,
        users: [],
        created_at: null,
        latest_message_date: null,
        latest_message: null,
        unread_message_count: 0,
      } as Types.MessageRoom,
      rooms: [] as Types.MessageRoom[],
      clickRoomId: '' as string,
      currentMouseOverRoomId: '' as string,
      selectMemberModal: false as boolean,
      newGroupModal: false as boolean,
      selectedCompanies: [] as AppApiResponse.Organization[],
      selectedOrganizationUuids: [] as string[],
      exitGroupModal: false as boolean,
      organizationListModal: false as boolean,
      propRoomUuid: '' as string,
      organizations: [] as AppApiResponse.Organization[],
      activeRoomUsers: [] as AppApiResponse.RoomUser[],
      checkedOrganizationUuids: [] as string[],
      checkedOrganizations: [] as AppApiResponse.Organization[],
      addRoomOrganizationUuids: [] as string[],
      isLoading: false,
      roomCurrentPage: null as number | null,
      roomLastPage: null as number | null,
      isRoomsLoading: false as boolean,
      isRoomsLoadingEcho: false as boolean,
      accessPermission: 'all' as string,
      notices: [] as AppApiResponse.UserNotice[],
      loadEmployee: false as boolean,
    };
  },
  computed: {
    isVisitor(): boolean {
      return ['visitor'].includes(this.accessPermission);
    },
  },
  watch: {
    currentRoom(newValue: Types.MessageRoom) {
      if (!newValue.room_uuid) {
        return;
      }
      if (
        this.activeRoomUsers.length !== newValue.users.length ||
        // eslint-disable-next-line @typescript-eslint/typedef
        this.activeRoomUsers.every(function(value, index) {
          return value.uuid !== newValue.users[index].uuid;
        })
      ) {
        this.getCurrentRoomUsers();
      }
      // update notice
      const updateNotifications: any = [...this.notices].filter(
        (item: any) =>
          !item.is_read &&
          item.params &&
          item.params.includes(newValue.room_uuid)
      );
      if (updateNotifications) {
        updateNotifications.forEach((notification: any) => {
          this.putUserNotice(notification);
        });
      }
    },
    organizations(
      newValue: AppApiResponse.Organization[],
      oldValue: AppApiResponse.Organization[]
    ) {
      if (newValue.length > oldValue.length) {
        this.getOrganizations(newValue.length);
      }
    },
    rooms(newValue: Types.MessageRoom[]) {
      const currentRoom = newValue.find(
        (room: Types.MessageRoom) =>
          room.room_uuid === this.currentRoom.room_uuid
      );
      if (currentRoom) {
        this.currentRoom = currentRoom;
      }
    },
  },
  async mounted() {
    this.$accessor.setLoading(true);
    this.accessPermission = this.$accessor.userProfile.access_permission;
    await this.getAllRooms();
    if (this.rooms.length !== 0 && !this.$route.query.room_uuid) {
      [this.currentRoom] = this.rooms;
    }

    if (this.rooms.length !== 0 && this.$route.query.room_uuid) {
      this.currentRoom =
        this.rooms.find(
          (room: Types.MessageRoom) =>
            room.room_uuid === this.$route.query.room_uuid
        ) || this.rooms[0];
    }

    if (this.rooms.length === 0) {
      this.loadEmployee = true;
      await this.getOrganizations();
    }

    this.$accessor.message.setRoomUuid(this.currentRoom.room_uuid);
    await this.getCurrentRoomUsers();
    this.$accessor.setLoading(false);

    // @ts-ignore
    this.$echo
      .channel(`room.${this.$accessor.userProfile.uuid}`)
      .listen('Room', async () => {
        this.isRoomsLoadingEcho = true;
        await this.getAllRooms();
        this.isRoomsLoadingEcho = false;
      })
      .listen('RoomHasMessageDeleted', () => {
        this.getAllRooms();
      });
    await this.fetchNotificationsData();
  },
  destroyed() {
    // @ts-ignore
    this.$echo
      .channel(`room.${this.$accessor.userProfile.uuid}`)
      .stopListening('Room')
      .stopListening('RoomHasMessageDeleted');
  },
  methods: {
    removeSelectedOrganizationUuid(uuid: string) {
      this.selectedOrganizationUuids = this.selectedOrganizationUuids.filter(
        (selectedOrganizationUuid: string) => selectedOrganizationUuid !== uuid
      );
    },
    removeSelectedOrganization(uuid: string) {
      this.selectedCompanies = this.selectedCompanies
        .map((company: AppApiResponse.Organization) => {
          if (company.uuid === uuid) {
            return {
              ...company,
              subordinated_organization_users: [],
            };
          }
          return {
            ...company,
            parents: company.parents
              .map((parent: AppApiResponse.Organization) => {
                if (parent.uuid === uuid) {
                  return {
                    ...parent,
                    subordinated_organization_users: [],
                  };
                }
                return {
                  ...parent,
                  children: parent.children
                    .map((child: AppApiResponse.Organization) => {
                      if (child.uuid === uuid) {
                        return {
                          ...child,
                          subordinated_organization_users: [],
                        };
                      }
                      return child;
                    })
                    .filter(
                      (child: AppApiResponse.Organization) =>
                        child.subordinated_organization_users.length > 0
                    ),
                };
              })
              .filter(
                (parent: AppApiResponse.Organization) =>
                  parent.subordinated_organization_users.length > 0 ||
                  parent.children.length > 0
              ),
          };
        })
        .filter(
          (company: AppApiResponse.Organization) =>
            company.subordinated_organization_users.length > 0 ||
            company.parents.length > 0
        );
    },
    removeSelectedEmployee(uuid: string) {
      this.selectedCompanies = this.selectedCompanies
        .map((company: AppApiResponse.Organization) => {
          const companyItem = { ...company };
          companyItem.subordinated_organization_users = companyItem.subordinated_organization_users.filter(
            (employee: object) => {
              if (employee.uuid === uuid)
                this.removeSelectedOrganizationUuid(companyItem.uuid);
              return employee.uuid !== uuid;
            }
          );
          companyItem.parents = companyItem.parents
            .map((parent: AppApiResponse.Organization) => {
              const parentItem = { ...parent };
              parentItem.subordinated_organization_users = parentItem.subordinated_organization_users.filter(
                (employee: object) => {
                  if (employee.uuid === uuid)
                    this.removeSelectedOrganizationUuid(parentItem.uuid);
                  return employee.uuid !== uuid;
                }
              );
              parentItem.children = parentItem.children
                .map((child: AppApiResponse.Organization) => {
                  const childItem = { ...child };
                  childItem.subordinated_organization_users = childItem.subordinated_organization_users.filter(
                    (employee: object) => {
                      if (employee.uuid === uuid)
                        this.removeSelectedOrganizationUuid(childItem.uuid);
                      return employee.uuid !== uuid;
                    }
                  );
                  return childItem;
                })
                .filter(
                  (child: AppApiResponse.Organization) =>
                    child.subordinated_organization_users.length
                );
              return parentItem;
            })
            .filter(
              (parent: AppApiResponse.Organization) =>
                parent.subordinated_organization_users.length +
                parent.children.length
            );
          return companyItem;
        })
        .filter(
          (company: AppApiResponse.Organization) =>
            company.subordinated_organization_users.length +
            company.parents.length
        );
    },
    closeNewGroupModal() {
      this.newGroupModal = false;
      this.selectedOrganizationUuids = [];
    },
    closeSelectMemberModal() {
      this.selectMemberModal = false;
      this.selectedOrganizationUuids = [];
    },
    async selectNewRoom(roomUuid: string) {
      await this.getAllRooms();
      this.currentRoom = this.rooms.find(
        (n: Types.MessageRoom) => n.room_uuid === roomUuid
      ) as Types.MessageRoom;
      this.$accessor.message.setRoomUuid(roomUuid);
    },
    getSelectRoom(room_uuid: string) {
      const selectedRoom = this.rooms.find(
        (room: Types.MessageRoom) => room.room_uuid === room_uuid
      ) as Types.MessageRoom;
      if (selectedRoom) {
        this.currentRoom = this.rooms.find(
          (room: Types.MessageRoom) => room.room_uuid === room_uuid
        ) as Types.MessageRoom;
      }
      this.$accessor.message.setRoomUuid(room_uuid);
    },
    onMessageAdded(data: {
      message: AppApiResponse.MessageItem;
      room_uuid: string;
    }) {
      let currentRoomIndex = 0;

      this.rooms = this.rooms.map((r: Types.MessageRoom, index: number) => {
        const room = { ...r };
        if (room.room_uuid === data.room_uuid) {
          switch (data.message.type) {
            case 'roger':
              room.latest_message = 'スタンプを送信しました';
              break;
            case 'images':
              room.latest_message = '画像を送信しました';
              break;
            case 'files':
              room.latest_message = 'ファイルを送信しました';
              break;
            default:
              room.latest_message = data.message.content;
          }
          room.latest_message_date = dayjs().unix();

          currentRoomIndex = index;
        }
        return room;
      });

      // Update current room to the first of room list
      this.rooms.unshift(this.rooms.splice(currentRoomIndex, 1)[0]);
    },
    async getAllRooms(page: number = 1, searchWord?: string) {
      if (
        this.roomCurrentPage !== null &&
        page <= this.roomCurrentPage &&
        page !== 1
      )
        return;
      // 次のページロードするたびにローディングでてたら使いずらそうなのでいったんローディング出すのは初回だけにした
      // echoのイベントのたびにルーム一覧をfetchしているがその間にローディング出るのも使いずらそうなのでフラグ立てた
      if (page === 1 && !this.isRoomsLoadingEcho) {
        this.isRoomsLoading = true;
      }
      try {
        const res = (
          await messageRooms({ page, limit: 50, search_word: searchWord })
        ).data;
        this.roomCurrentPage = res.meta.current_page;
        this.roomLastPage = res.meta.last_page;
        // TODO: 検索ワードを含む場合で条件にヒットしない場合アラート出すようにしているが必要に応じて修正が必要なら対応する
        if (res.data.length === 0 && !!searchWord) {
          alert('条件に当てはまるルームはありませんでした');
        }
        if (res.data.length > 0) {
          const resRooms = res.data.map(
            (messageRoom: AppApiResponse.MessageRoom): Types.MessageRoom => {
              const name = messageRoom.name ? messageRoom.name : null;
              const roomName = messageRoom.is_dm
                ? messageRoom.users
                    .filter(
                      (user: { name: string; uuid: string }) =>
                        user.uuid !== this.$accessor.userProfile.uid
                    )
                    .map((user: { name: string; uuid: string }) => user.name)[0]
                : messageRoom.users
                    .map((user: { name: string; uuid: string }) => user.name)
                    .sort((x: string, y: string) => x.localeCompare(y, 'ja'))
                    .join(',');
              const display_name = messageRoom.name
                ? messageRoom.name
                : roomName;
              return {
                room_uuid: messageRoom.room_uuid,
                name,
                display_name,
                description: messageRoom.description,
                room_icon: messageRoom.room_icon,
                users: messageRoom.users,
                is_dm: messageRoom.is_dm,
                created_at: messageRoom.created_at,
                latest_message_date: messageRoom.latest_message_date,
                latest_message: messageRoom.latest_message,
                // Don't update unread_message_count for the current room
                // eslint-disable-next-line prettier/prettier
                unread_message_count: this.currentRoom.room_uuid === messageRoom.room_uuid ? 0 : messageRoom.unread_message_count,
              };
            }
          );
          this.rooms =
            page === 1 ? [...resRooms] : [...this.rooms, ...resRooms];
          return;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isRoomsLoading = false;
      }
    },
    async logout() {
      try {
        await logout();
        this.$accessor.clearAccessToken();
      } catch (err) {
        console.error(err);
      } finally {
        this.$router.push({ path: '/login' });
      }
    },
    async getCurrentRoomUsers() {
      try {
        if (!this.currentRoom.room_uuid) return;
        this.activeRoomUsers = (
          await roomUsers({
            uuid: this.currentRoom.room_uuid,
          })
        ).data;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    async getOrganizations(offset: number = 0) {
      try {
        const res = (
          await organizations({
            limit: 100,
            offset,
          })
        ).data;

        this.organizations =
          offset === 0
            ? res.organizations
            : [...this.organizations, ...res.organizations];
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    submitSelectMember(
      companies: AppApiResponse.Organization[],
      selectedOrganizationUuids: string[]
    ) {
      this.selectedCompanies = companies;
      this.selectMemberModal = false;
      this.newGroupModal = true;
      this.selectedOrganizationUuids = selectedOrganizationUuids;
    },
    async submitNewGroup(room: AppApiRequest.Rooms) {
      const params = {
        ...room,
        organization_uuids: this.selectedOrganizationUuids,
      };
      try {
        const res = await rooms(params);
        this.selectNewRoom(res.data.room_uuid);
        this.newGroupModal = false;
      } catch (e) {
        if (e.response != null && e.response.status === 422) {
          const [userUuid] = room.user_uuids;
          const [existedRoom] = this.rooms.filter(
            (r: any) => r.is_dm && r.users.some((s: any) => s.uuid === userUuid)
          );
          this.newGroupModal = false;
          if (existedRoom.room_uuid != null) {
            this.currentRoom = existedRoom;
          }
          alert(e.response.data.errors.field[0]);
        }
        console.log(e);
      }
    },
    toggleExitGroupModal(roomUuid: string) {
      this.propRoomUuid = roomUuid;
      this.exitGroupModal = !this.exitGroupModal;
    },
    toggleOrganizationListModal() {
      this.organizationListModal = !this.organizationListModal;
      this.checkedOrganizationUuids = [];
    },
    async exitRoom(roomUuid: string) {
      await roomExit({
        room_uuid: roomUuid,
      });
      this.rooms = this.rooms.filter(
        (n: Types.MessageRoom) => n.room_uuid !== roomUuid
      );
      this.toggleExitGroupModal(roomUuid);
      this.setCurrentRoom();
    },
    setCurrentRoom() {
      if (this.rooms.length > 0) {
        [this.currentRoom] = this.rooms;
      } else {
        this.currentRoom = {
          room_uuid: '',
          name: '',
          display_name: '',
          room_icon: '',
          users: [],
          is_dm: false,
          created_at: null,
          latest_message_date: null,
          latest_message: null,
          unread_message_count: 0,
        };
        this.activeRoomUsers = [];
      }
    },
    addOrganizations() {
      this.checkedOrganizations = [];
      this.checkedOrganizationUuids.forEach(
        (checkedOrganizationUuid: string) => {
          const checkedOrganization = this.organizations.find(
            (organization: AppApiResponse.Organization) =>
              organization.uuid === checkedOrganizationUuid
          );
          if (checkedOrganization !== undefined)
            return this.checkedOrganizations.push(checkedOrganization);
        }
      );
      this.toggleOrganizationListModal();
    },
    async updateRoomInfo({
      newGroupName,
      description,
    }: {
      newGroupName: string;
      description: string;
    }) {
      try {
        await updateRoomName({
          room_uuid: this.currentRoom.room_uuid,
          room_name: newGroupName,
        });
        await updateRoomDescription({
          room_uuid: this.currentRoom.room_uuid,
          description,
        });
        this.currentRoom.name = newGroupName;
        this.currentRoom.description = description;
      } catch (error) {
        if (error.response.status === 422) {
          alert(error.response.data.errors.name[0]);
        }
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    async updateRoomIcon(iconUrl: string) {
      try {
        await updateRoomIcon({
          room_uuid: this.currentRoom.room_uuid,
          room_icon: iconUrl,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    async addUserCurrentRoom(users: AppApiResponse.RoomUser[]) {
      users.map((m: AppApiResponse.RoomUser) => this.activeRoomUsers.push(m));
    },
    async removeUserCurrentRoom(user: ApiResponse.User) {
      if (user.uuid === this.$accessor.userProfile.uid) {
        this.rooms = this.rooms.filter(
          (n: Types.MessageRoom) => n.room_uuid !== this.currentRoom.room_uuid
        );
        this.setCurrentRoom();
        return;
      }
      this.activeRoomUsers = this.activeRoomUsers.filter(
        (f: AppApiResponse.RoomUser) => f.uuid !== user.uuid
      );
    },
    addRooms() {
      if (this.roomCurrentPage === null || this.roomLastPage === null) return;
      if (this.roomCurrentPage < this.roomLastPage) {
        this.getAllRooms(this.roomCurrentPage + 1);
      }
    },
    searchWord(searchWord: string) {
      this.getAllRooms(1, searchWord);
    },
    onMessageReaded(roomUuid: string, messageIds: string[]) {
      if (this.currentRoom.room_uuid === roomUuid) {
        if (messageIds.length === 0) {
          this.currentRoom.unread_message_count = 0;
        } else {
          this.currentRoom.unread_message_count =
            this.currentRoom.unread_message_count - messageIds.length > 0
              ? this.currentRoom.unread_message_count - messageIds.length
              : 0;
        }
      }
    },
    async fetchNotificationsData(): Promise<void> {
      try {
        const { data } = await fetchUserNotifications();
        this.notices = data.data;
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
  },
});
</script>

<style lang="scss" scoped>
.container {
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  background: $main_background_color;
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

.modal-message {
  display: flex;
  flex-direction: column;
}

.modal-message-title {
  margin-bottom: 20px;
}

.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
</style>
