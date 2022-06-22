<template>
  <div class="main__contents">
    <div v-if="!currentRoom.room_uuid" class="chat-title-new-group grid">
      <div class="chat-title__name column col-title">宛先：</div>
      <v-select
        v-model="newGroupEmployeeUuids"
        multiple
        :options="employeesWithOutLoginUser"
        label="name"
        :reduce="
          (employeesWithOutLoginUser) => employeesWithOutLoginUser.user_uuid
        "
        class="column"
        :disabled="this.$accessor.loading"
      >
        <template slot="option" slot-scope="employee">
          <div class="select-list">
            <img :src="employee.user_icon" class="select-list-image" />
            <div>{{ employee.name }}</div>
          </div>
        </template>
      </v-select>
      <div class="column col-button">
        <button
          class="add-organization-button"
          @click="toggleOrganizationListModal"
        >
          組織から一括ユーザー追加
        </button>
        <button class="logout-button" @click="logout">ログアウト</button>
      </div>
    </div>

    <div v-else class="chat-title">
      <template v-if="currentRoom.room_uuid">
        <a
          href="#"
          class="chat-exit"
          @click.prevent="toggleExitGroupModal(currentRoom.room_uuid)"
        >
          <img src="/app/icon/icon-exit.svg" class="chat-exit__icon" />
          <span class="chat-exit__text">チャットを退出</span>
        </a>
        <div class="chat-title-inner">
          <div class="chat-title__name" v-text="displayRoomName"></div>
          <div v-if="currentRoom.users.length > 2" class="chat-title__count">
            {{ '(' + currentRoom.users.length + '人)' }}
          </div>
        </div>
        <div class="header-left">
          <a href="#" class="info-link" @click.prevent="clickRoomInfo">
            <img src="/app/icon/icon-info.svg" class="info-img" />
          </a>
          <button class="grey-button" @click="logout">
            ログアウト
          </button>
        </div>
      </template>
    </div>

    <div class="main-container">
      <div
        :class="[
          isDisplaySideMenu ? 'messages_isDisplaySideMenu' : 'ly-chat-messages',
        ]"
      >
        <main-chat-messages
          :current-room="currentRoom"
          :duplicate-dm-room="duplicateDmRoom"
          :new-group-employee-uuids="newGroupEmployeeUuids"
          :active-room-users="activeRoomUsers"
          :is-visitor="isVisitor"
          @selectNewRoom="selectNewRoom"
          @closeSideMenu="closeSideMenu"
          @getSelectRoom="getSelectRoom"
          @messageAdded="onMessageAdded"
          @messageReaded="onMessageReaded"
        ></main-chat-messages>
      </div>

      <div v-if="isDisplaySideMenu" class="msg-side">
        <div class="group-info-container">
          <div class="group-info-bg">
            <img src="/app/icon/room.svg" class="room-icon" alt="" />
            <img
              src="/app/icon/icon-edit.svg"
              class="edit-icon"
              alt=""
              @click="switchRoomInfo"
            />
            <div
              class="group-info-icon"
              @mouseover="mouseOverAction()"
              @mouseleave="mouseleaveAction()"
            >
              <label>
                <input
                  ref="imageInput"
                  class="group-info-icon-input"
                  type="file"
                  accept="image/jpeg, image/png, image/heic, image/heic-sequence, image/heif, image/heif-sequence, image/gif"
                  multiple
                  :disabled="isUploading || currentRoom.is_dm"
                  @change="onFileChange($event)"
                />
                <room-icon
                  class="room-icon-group-info-section"
                  :class="{
                    'room-icon-group-info-section-mouse-over':
                      isDisplayRoomIconEdit && !currentRoom.is_dm,
                  }"
                  :src="currentRoom.room_icon"
                  :is-uploading="isUploading"
                >
                </room-icon>
              </label>
              <div v-if="!toggleUserInfo">
                <p class="room-name">
                  {{ currentRoom.is_dm ? dmRoomName : newGroupName }}
                </p>
                <div v-if="description" class="room-description-container">
                  <p class="room-description">
                    {{ description }}
                  </p>
                </div>
              </div>
              <div v-if="toggleUserInfo" class="edit-info">
                <ValidationObserver v-slot="{ invalid }">
                  <ValidationProvider
                    v-slot="name"
                    rules="max:50"
                    name="ルーム名"
                  >
                    <input
                      id="name"
                      v-model="newGroupName"
                      class="group-info-name-input-size"
                      name="room-name"
                    />
                    <div v-if="name.errors[0]" class="error">
                      <span>{{ name.errors[0] }}</span>
                    </div>
                  </ValidationProvider>
                  <ValidationProvider
                    v-slot="roomDescription"
                    rules="max:50"
                    name="ルーム名"
                  >
                    <textarea
                      id="description"
                      v-model="description"
                      class="group-info-name-textarea-size"
                      name="description"
                    >
                    </textarea>
                    <div v-if="roomDescription.errors[0]" class="error">
                      <span>{{ roomDescription.errors[0] }}</span>
                    </div>
                  </ValidationProvider>
                  <div class="group-info-bottoms">
                    <div class="group-info-bottom" @click="switchRoomInfo">
                      キャンセル
                    </div>
                    <div
                      v-if="!invalid"
                      class="group-info-bottom"
                      @click="clickRoomInfoUpdate(newGroupName, description)"
                    >
                      保存
                    </div>
                  </div>
                </ValidationObserver>
              </div>
            </div>
          </div>
        </div>
        <div class="member-container">
          <button
            v-if="!currentRoom.is_dm"
            class="add-member-button"
            @click="toggleUserListModal"
          >
            <div class="add-member-text">
              メンバーを追加する
            </div>
            <img
              src="/app/icon/Icon-plus-pink.svg"
              class="add-member-icon"
              alt=""
            />
          </button>
          <div class="member-header">
            <div class="member-title">グループメンバー</div>
            <div class="member-count">{{ userCount }}人</div>
          </div>
          <div class="member-list">
            <div
              v-for="activeRoomUser in activeRoomUsers"
              :key="activeRoomUser.uuid"
            >
              <div
                class="msg__rooms__item"
                @mouseover="mouseOverUserListAction(activeRoomUser.uuid)"
              >
                <div class="room-title">
                  <img class="member-img" :src="activeRoomUser.user_icon" />
                  <div class="msg__rooms__item__users">
                    {{ activeRoomUser.name }}
                  </div>
                  <img
                    v-if="
                      mouseOverUserUuid === activeRoomUser.uuid &&
                        !currentRoom.is_dm
                    "
                    src="@/assets/image/icon-menu.svg"
                    class="user-list-sub-menu-img"
                    @click="clickUserMenu(activeRoomUser.uuid)"
                  />
                  <div
                    v-if="active(activeRoomUser.uuid)"
                    class="user-menu-overlay"
                    @click="clickUserMenu(activeRoomUser.uuid)"
                  ></div>
                  <div
                    class="user-list-menu"
                    :class="{
                      'user-list-menu-active': active(activeRoomUser.uuid),
                    }"
                    @mouseleave="mouseLeaveUserListAction()"
                  >
                    <ul>
                      <li @click="toggleRemoveChatRoomMemberModal">
                        グループから削除
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <select-member-modal
      v-if="userListModal"
      :room-users="activeRoomUsers"
      @close="userListModal = false"
      @submit="submitSelectMember"
    />
    <add-member-modal
      v-if="addMemberModal"
      :selected-companies="selectedCompanies"
      :selected-organization-uuids="selectedOrganizationUuids"
      @close="addMemberModal = false"
      @submit="submitAddUser"
      @remove-selected-organization-uuid="removeSelectedOrganizationUuid"
      @remove-organization="removeSelectedOrganization"
      @remove-employee="removeSelectedEmployee"
    />

    <RemoveUserConfirmModal
      v-if="removeChatRoomMemberModal"
      :room-uuid="currentRoom.room_uuid"
      :button-text="`グループから削除`"
      @click="removeChatRoomMember"
      @toggleModal="toggleRemoveChatRoomMemberModal"
      @onCloseModal="closeRemoveChatRoomMemberModal"
    >
      <div class="modal-message">
        <div class="modal-message-title">グループから削除しますか？</div>
        <p>
          削除したユーザーは このスレッドからメッセージが届かなくなります。
        </p>
      </div>
    </RemoveUserConfirmModal>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import vSelect from 'vue-select';
import { getResizedImage, uploadToS3 } from '@/libs/message/message';
import {
  roomAddUsers,
  roomRemoveUsers,
  employees,
  getS3PresignedPostData,
} from '@/libs/api/app';
import RoomIcon from '@/components/App/atoms/messages/RoomIcon.vue';
import AddMemberModal from '@/components/App/organisms/messages/AddMemberModal.vue';
import SelectMemberModal from '@/components/App/organisms/messages/SelectMemberModal.vue';
import MainChatMessages from './MainChatMessages.vue';
import 'vue-select/dist/vue-select.css';
// eslint-disable-next-line import/order
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import RemoveUserConfirmModal from '../modal/messages/RemoveUserConfirmModal.vue';

export default Vue.extend({
  components: {
    RoomIcon,
    MainChatMessages,
    vSelect,
    RemoveUserConfirmModal,
    ValidationObserver,
    ValidationProvider,
    AddMemberModal,
    SelectMemberModal,
  },
  props: {
    currentRoom: {
      type: Object as PropType<Types.MessageRoom>,
      required: true,
    },
    activeRoomUsers: {
      type: Array as PropType<AppApiResponse.RoomUser[]>,
      required: true,
    },
    checkedOrganizations: {
      type: Array as PropType<ApiResponse.Organization[]>,
      required: true,
    },
    rooms: {
      type: Array as PropType<Types.MessageRoom[]>,
      required: true,
    },
    isVisitor: {
      type: Boolean,
      required: false,
      default: false,
    },
    loadEmployee: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      newGroupEmployeeUuids: [] as Array<string>,
      employees: [] as Array<AppApiResponse.Employee>,
      isDisplaySideMenu: false as boolean,
      toggleUserInfo: false,
      newGroupName: '' as string | null,
      groupName: '' as string | null,
      description: '' as string | null,
      isDisplayRoomIconEdit: false as boolean,
      userListModal: false as boolean,
      mouseOverUserUuid: '' as string,
      clickUserUuid: '' as string,
      removeChatRoomMemberModal: false as boolean,
      preparedImage: null as File | null,
      uploadedImage: null as AppApiResponse.uploadImage | null,
      errorMessage: '' as string,
      isUploading: false,
      selectedOrganizationUuids: [] as string[],
      duplicateDmRoom: {
        room_uuid: '',
        name: '',
        display_name: '',
        description: '',
        room_icon: '',
        is_dm: false,
        users: [],
        created_at: null,
        latest_message_date: null,
        latest_message: null,
        unread_message_count: 0,
      } as Types.MessageRoom,
      selectedCompanies: [] as AppApiResponse.Organization[],
      addMemberModal: false as boolean,
    };
  },
  computed: {
    active() {
      return (uuid: string): boolean => {
        return this.clickUserUuid === uuid;
      };
    },
    isDisplayGroupInfoBottom(): boolean {
      return this.newGroupName !== this.groupName;
    },
    dmRoomName(): string {
      return this.activeRoomUsers.filter(
        (roomUser: AppApiResponse.RoomUser) =>
          roomUser.uuid !== this.$accessor.userProfile.uuid
      )[0].name;
    },
    employeesWithOutLoginUser(): AppApiResponse.Employee[] {
      return this.employees.filter((n: { user_uuid: string; name: string }) => {
        return n.user_uuid !== this.$accessor.userProfile.uuid;
      });
    },
    userCount(): number {
      return this.activeRoomUsers.length;
    },
    displayRoomName() {
      const loginUser = this.$accessor.userProfile;
      if (this.currentRoom.is_dm) {
        const { users } = this.currentRoom;
        return users.filter(
          (user: { name: string; uuid: string }) =>
            user.uuid !== loginUser?.uuid
        )[0].name;
      }
      return this.currentRoom.display_name;
    },
  },
  watch: {
    newGroupEmployeeUuids(newValue: Array<string>) {
      if (newValue.length === 1) {
        [this.duplicateDmRoom] = this.rooms.filter(
          (room: Types.MessageRoom) =>
            room.is_dm &&
            room.users.some((user: any) => newValue[0] === user.uuid)
        ) ?? {
          room_uuid: '',
          name: '',
          display_name: '',
          room_icon: '',
          is_dm: false,
          user_uuids: [],
          created_at: null,
        };
      } else {
        this.duplicateDmRoom = {
          room_uuid: '',
          name: '',
          display_name: '',
          room_icon: '',
          is_dm: false,
          users: [],
          created_at: null,
        };
      }
    },
    currentRoom(newValue: Types.MessageRoom) {
      this.newGroupName = newValue.name;
      this.groupName = newValue.name;
      this.description = newValue.description;
      if (!newValue.room_uuid) {
        this.isDisplaySideMenu = false;
      }
      this.duplicateDmRoom = {
        room_uuid: '',
        name: '',
        display_name: '',
        room_icon: '',
        is_dm: false,
        users: [],
        created_at: null,
      };
      this.newGroupEmployeeUuids = [];
    },
    checkedOrganizations(newValue: AppApiResponse.Organization[]) {
      newValue.forEach((n: AppApiResponse.Organization) => {
        const userUuids = n.subordinated_organization_users
          .map(
            (employeeUser: { uuid: string; icon: string; name: string }) =>
              employeeUser.uuid
          )
          .filter((uuid: string) => {
            return uuid !== this.$accessor.userProfile.uuid;
          });
        this.newGroupEmployeeUuids = Array.from(
          new Set([...userUuids, ...this.newGroupEmployeeUuids])
        );
      });
    },
    employees(
      newValue: AppApiResponse.Employee[],
      oldValue: AppApiResponse.Employee[]
    ) {
      if (newValue.length > oldValue.length) {
        this.getEmployees(newValue.length);
      }
    },
    loadEmployee() {
      if (this.loadEmployee) {
        this.getEmployees();
      }
    },
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
    async submitAddUser(room: AppApiRequest.Rooms) {
      const user_uuids = room.user_uuids.filter(
        (uuid: string) =>
          !this.activeRoomUsers.some(
            (r: AppApiResponse.RoomUser) => r.uuid === uuid
          )
      );
      if (user_uuids.length === 0) {
        this.addMemberModal = false;
        return;
      }
      try {
        await roomAddUsers({
          room_uuid: this.currentRoom.room_uuid,
          user_uuids,
        });
        const users = this.employees
          .filter((f: AppApiResponse.Employee) =>
            user_uuids.some((s: string) => s === f.user_uuid)
          )
          .map((m: AppApiResponse.Employee) => {
            return {
              uuid: m.user_uuid,
              name: m.name,
              user_icon: m.user_icon,
            };
          });
        await this.$emit('addUserCurrentRoom', users);

        this.addMemberModal = false;
      } catch (e) {
        console.log(e);
      }
    },
    submitSelectMember(
      companies: AppApiResponse.Organization[],
      selectedOrganizationUuids: string[]
    ) {
      this.selectedCompanies = companies;
      this.selectedOrganizationUuids = selectedOrganizationUuids;
      this.userListModal = false;
      this.addMemberModal = true;
    },
    logout() {
      this.$emit('logout');
    },
    toggleRemoveChatRoomMemberModal() {
      this.removeChatRoomMemberModal = !this.removeChatRoomMemberModal;
    },
    closeRemoveChatRoomMemberModal() {
      this.removeChatRoomMemberModal = false;
      this.clickUserUuid = '';
    },
    async removeChatRoomMember() {
      await this.removeUser(this.clickUserUuid);
      if (this.clickUserUuid === this.$accessor.userProfile.uuid) {
        this.isDisplaySideMenu = false;
      }
      this.clickUserUuid = '';
      this.removeChatRoomMemberModal = !this.removeChatRoomMemberModal;
    },
    mouseOverUserListAction(userUuid: string) {
      this.mouseOverUserUuid = userUuid;
    },
    mouseLeaveUserListAction() {
      this.mouseOverUserUuid = '';
    },
    clickUserMenu(userUuid: string) {
      if (this.clickUserUuid === userUuid) {
        this.clickUserUuid = '';
        return;
      }
      this.clickUserUuid = userUuid;
    },
    selectNewRoom(roomUuid: string) {
      this.$emit('selectNewRoom', roomUuid);
      this.newGroupEmployeeUuids = [];
      this.getEmployees();
    },
    async getEmployees(offset: number = 0) {
      try {
        const { users } = (
          await employees({
            limit: 50,
            offset,
          })
        ).data;
        this.employees = offset === 0 ? users : [...this.employees, ...users];
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    clickRoomInfo() {
      this.isDisplaySideMenu = !this.isDisplaySideMenu;
    },
    switchRoomInfo() {
      this.toggleUserInfo = !this.toggleUserInfo;
    },
    clickRoomInfoUpdate(newGroupName: string, description: string) {
      this.$emit('clickRoomInfoUpdate', { newGroupName, description });
      this.switchRoomInfo();
      this.groupName = this.newGroupName;
      if (this.newGroupName) {
        this.currentRoom.display_name = this.newGroupName;
      } else {
        this.currentRoom.display_name = this.activeRoomUsers
          .map((u: AppApiResponse.RoomUser) => u.name)
          .sort((x: string, y: string) => x.localeCompare(y, 'ja'))
          .join(',');
      }
      this.currentRoom.description = this.description;
    },
    mouseOverAction() {
      this.isDisplayRoomIconEdit = true;
    },
    mouseleaveAction() {
      this.isDisplayRoomIconEdit = false;
    },
    async onFileChange(event: any) {
      const files =
        (event.target as HTMLInputElement).files ||
        (event.dataTransfer as DataTransfer).files;
      if (Array.from(files).some((n: File) => n.size > 26214400)) {
        alert('アップロードできるファイルサイズの上限は25MBです');
        return;
      }
      [this.preparedImage] = Array.from(files);
      this.postIconImage();
    },
    toggleOrganizationListModal() {
      this.$emit('toggleOrganizationListModal');
    },
    toggleUserListModal() {
      this.userListModal = !this.userListModal;
    },
    async removeUser(userUuid: string) {
      await roomRemoveUsers({
        room_uuid: this.currentRoom.room_uuid,
        user_uuids: [userUuid],
      });
      if (userUuid === this.$accessor.userProfile.uuid) {
        const user = {
          uuid: this.$accessor.userProfile.uuid,
          name: this.$accessor.userProfile.name,
          user_icon: this.$accessor.userProfile.icon,
        };
        await this.$emit('removeUserCurrentRoom', user);
      } else {
        const employee = this.employees.find(
          (n: AppApiResponse.Employee) => n.user_uuid === userUuid
        );
        if (!employee) return;
        const user = {
          uuid: employee.user_uuid,
          name: employee.name,
          user_icon: employee.user_icon,
        };
        await this.$emit('removeUserCurrentRoom', user);
      }
    },
    closeSideMenu() {
      this.isDisplaySideMenu = false;
    },
    async postIconImage() {
      if (!this.preparedImage) return;
      this.isUploading = true;
      try {
        const { data } = await getS3PresignedPostData();
        const key = data.form_inputs.key.replace(/^uploads\//g, 'public/');
        this.uploadedImage = {
          thumbnail: `${data.form_attributes.action}/${key}_s`,
          main_image: `${data.form_attributes.action}/${key}`,
        };

        await uploadToS3(this.preparedImage, data);

        if (!this.uploadedImage) return;
        // 全ての画像がリサイズされるのを待つ
        await getResizedImage(this.uploadedImage.thumbnail);
        await getResizedImage(this.uploadedImage.main_image);

        this.$emit('clickRoomIconUpdate', this.uploadedImage.thumbnail);
        this.currentRoom.room_icon = this.uploadedImage.thumbnail;
      } catch (e) {
        // TODO: メッセージは仮
        this.errorMessage =
          '画像投稿に失敗しました。お手数ですが再度お試しください。';
        this.$emit('messageFailure');
        throw e;
      }
      this.isUploading = false;
    },
    getSelectRoom(room_uuid: string) {
      this.$emit('getSelectRoom', room_uuid);
    },
    onMessageAdded(data: {
      message: AppApiResponse.MessageItem;
      room_uuid: string;
    }) {
      this.$emit('messageAdded', data);
    },
    toggleExitGroupModal(roomUuid: string) {
      this.$emit('toggleModal', roomUuid);
    },
    onMessageReaded(roomUuid: string, messageIds: string[]) {
      this.$emit('messageReaded', roomUuid, messageIds);
    },
  },
});
</script>

<style lang="scss" scoped>
.user-menu-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 6;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
}

.main__contents {
  height: 100vh;
  width: 100%;
  padding: 40px 0 0;
  border-radius: 4px;
  box-shadow: 0 1px 2px $box-shadow;
  margin-right: 96px;
}

.main-container {
  display: flex;
  background-color: $true_white;
  height: calc(100vh - 103px);
}

.msg-side {
  width: 391px;
  height: calc(100% - 60px);
  border-left: 1px solid #ccc;
  overflow-y: scroll;
}

.room-icon {
  width: 41px;
  position: absolute;
  top: 30px;
  left: 32px;
}

.edit-icon {
  position: absolute;
  top: 30px;
  right: 32px;
}

.chat-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  height: 63px;
  background-color: #fff;
  border-radius: 4px;

  &__name {
    font-size: 15px;
    font-weight: 600;
    max-width: 450px;
    color: $main_color;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__count {
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }
}

.chat-title-inner {
  display: flex;
  align-items: center;
  padding: 25px 0 0 0;
  max-width: 480px;
  min-width: 50px;
}

.chat-exit {
  display: flex;
  align-items: center;
  text-decoration: none;

  &__icon {
    width: 16px;
    height: 16px;
    margin: 0 6px 0 0;
  }

  &__text {
    font-size: 11px;
    color: $dark_blue;
  }
}

.chat-title-new-group {
  padding: 14px;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  position: fixed;
  top: 0;
  background-color: #fff;
  z-index: 1;
  min-height: 60px;

  &__name {
    margin-left: 5px;
    font-size: 14px;
    white-space: nowrap;
  }
}

ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ly-chat-messages {
  // width: calc(100% - 326px);
  width: 100%;
}

.messages_isDisplaySideMenu {
  flex: 1;
}

.group-info-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  padding: 24px;
  position: relative;
}

.group-info-bg {
  width: 100%;
  background: linear-gradient(267deg, #ffe0ba, #cddcfe);
  padding: 24px 24px 20px;
  border-radius: 8px;
}

.group-info-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.room-name {
  font-size: 15px;
  font-weight: 600;
  padding-bottom: 7.5px;
  border-bottom: $link_color 1px solid;
  margin-top: 8.5px;
}

.room-description-container {
  width: 240px;
  background-color: $message_gray_blue_5;
  opacity: 0.5;
  padding: 8px 10px 7px;
  margin: 8px 0 10px;
}

.room-description {
  font-size: 15px;
  font-weight: 300;
}

.edit-info {
  width: 236px;
}

.member-container {
  padding: 10px;
  overflow-y: scroll;
  height: calc(100% - 180px);
}

.employee-list-container {
  background-color: white;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  width: 200px;
  max-height: 200px;
  padding: 10px;
  margin-top: 60px;
  position: absolute;
  top: -5px;
  left: 20px;
  overflow-y: scroll;
  border-radius: 10px;
  z-index: 9;
  cursor: pointer;
}

.employee-list {
  display: flex;
  height: 30px;
  font-size: 13px;
  margin-bottom: 5px;
}

.employee-list > img {
  width: 30px;
  margin-right: 5px;
  object-fit: cover;
  border-radius: 50%;
}

.chat-title > input {
  border: none;
}

.new-group-employees {
  display: flex;
  flex-wrap: wrap;
  margin-right: 5px;
}

.new-group-employee {
  border: 1px solid #4099ff;
  font-size: 12px;
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 3px;
  border-radius: 5px;
  color: #0084ff;
  background-color: #cbe6fe;
  white-space: nowrap;
}

.tab-active {
  color: white;
  background-color: #0084ff;
}

.info-link {
  display: flex;
}

.info-img {
  width: 16px;
  height: 16px;
}

.member-header {
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 40px;
}

.member-title {
  font-size: 16px;
  font-weight: bold;
  margin-right: 12px;
}

.member-count {
  color: #9c9da5;
  font-size: 16;
  font-weight: bold;
}

.add-member {
  height: 40px;
  padding: 5px;
  cursor: pointer;
}

.member-img {
  width: 30px;
  height: 30px;
  object-fit: cover;
  margin-right: 5px;
  border-radius: 50%;
}

.member {
  display: flex;
  height: 50px;
  padding: 10px;
  cursor: pointer;
}

.room-icon-group-info-section {
  position: relative;
  width: 80px;
  height: 80px;
}

.room-icon-group-info-section-mouse-over {
  position: relative;
  width: 80px;
  height: 80px;
  cursor: pointer;
  opacity: 0.8;
}

.room-icon-group-info-section-mouse-over::after {
  position: absolute;
  top: 30px;
  left: 25px;
  content: '編集';
  color: white;
  font-weight: 900;
}

.group-info-bottoms {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.group-info-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  height: 28px;
  font-size: 13px;
  font-weight: 600;
  color: $gray_blue_4;
  cursor: pointer;
  background-color: $light_gray_blue_3;
  border: $true_white solid 0.5px;
  border-radius: 4px;
}

.group-info-name-input-size {
  height: 40px;
  width: 236px;
  border-radius: 4px;
  margin-top: 16px;
  border-style: none;
  padding: 12px 16px;
}

.group-info-name-textarea-size {
  height: 96px;
  width: 236px;
  border-radius: 4px;
  margin-top: 16px;
  border-style: none;
  padding: 12px 16px;
}

.group-info-icon-input {
  position: absolute;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  z-index: 10;
}

.add-organization-button {
  margin-left: 5px;
  font-size: 12px;
  width: 170px;
  height: 35px;
  white-space: nowrap;
}

.select-list {
  display: flex;
  align-items: center;
}

.select-list-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.v-select-width {
  width: 80%;
}

.room-title {
  display: flex;
  align-items: center;
  width: 100%;
}

.msg {
  &__rooms {
    &__item {
      position: relative;
      display: flex;
      height: 50px;
      padding: 10px;
      border-radius: 5px;
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
  }
}

.room-icon-size {
  width: 30px;
  height: 30px;
}

.user-list-sub-menu-img {
  margin-left: 10px;
  width: 14px;
  z-index: 7;
}

.user-list-menu {
  display: none;
}

.user-list-menu-active {
  display: block;
  position: absolute;
  top: 50px;
  left: 5px;
  font-size: 14px;
  border: 1px solid #ccc;
  height: 70px;
  width: 180px;
  text-align: center;
  background-color: white;
  padding: 10px 10px;
  z-index: 6;
}

.user-list-menu-active::before {
  content: '';
  position: absolute;
  top: -30px;
  left: 20px;
  margin-left: -15px;
  border: 15px solid transparent;
  border-bottom: 15px solid #ccc;
}

.user-list-menu-active::after {
  content: '';
  position: absolute;
  top: -28px;
  left: 20px;
  margin-left: -15px;
  border: 15px solid transparent;
  border-bottom: 15px solid white;
}

.user-list-menu-active > ul > li {
  cursor: pointer;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left > button {
  margin-left: 7px;
}

.error {
  text-align: center;
  color: red;
  margin-top: 10px;
}

.logout-button {
  min-width: 100px;
  height: 35px;
}

.grey-button {
  background-color: $button_background_color;
  min-width: 110px;
  height: 28px;
  line-height: 28px;
  color: $gentle_bluish_purple;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  border-radius: 4px;
  border: none;
}

.add-member-button {
  background-color: $button_background_color;
  color: $gentle_bluish_purple;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  border: none;
  height: 42px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.add-member-text {
  display: flex;
  flex-grow: 1;
  justify-content: center;
}

.add-member-icon {
  margin-right: 12px;
}

.grid {
  display: flex;
  width: calc(100% - 656px);

  .column {
    flex: 1;
    min-width: 0;
    word-wrap: break-word;
  }

  .col-title {
    max-width: 70px;
  }

  .col-button {
    max-width: 300px;
    padding-left: 20px;
  }
}
</style>
