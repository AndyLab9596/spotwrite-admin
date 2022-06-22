<template>
  <div class="chat-container">
    <div
      v-if="clickReactionMenuMessageId"
      class="modal-overlay-transparent"
      @click.self="onClose"
    ></div>
    <message-input
      :current-room="currentRoom"
      :new-group-employee-uuids="newGroupEmployeeUuids"
      :can-not-post-new-room-message="canNotPostNewRoomMessage"
      :files="files"
      :has-null-id-message="hasNullIdMessage"
      :duplicate-dm-room="duplicateDmRoom"
      :active-room-users="activeRoomUsers"
      @messageAdded="onMessageAdded"
      @messageFailure="onMessageFailure"
      @fileChange="onFileChange"
      @selectNewRoom="onSelectNewRoom"
      @messageAddedFail="clearTempMessages"
      @retryGetAllMessages="retryGetAllMessages"
    ></message-input>
    <div
      id="chat-contents"
      ref="chatContents"
      class="msg__contents"
      :class="{
        'drop-area-over-border': dragEntered,
      }"
      @dragenter="onDragEnter"
      @dragover="onDragEnter"
      @dragleave="onDragLeave"
      @dragover.prevent
      @drop.prevent="onFileChange($event)"
      @scroll="onScroll($event)"
    >
      <VueLoading
        v-if="isAddMessageLoading"
        type="spin"
        color="#CCC"
        :size="{ width: '50px', height: '50px' }"
      />
      <div class="msg__contents__messages">
        <div v-for="groupedDate in messagesList" :key="groupedDate">
          <div class="grouped-date">
            <div class="messages-date">{{ groupedDate }}</div>
          </div>
          <div v-for="msg in messagesList[groupedDate]" :key="msg.id">
            <div v-if="msg.type === 'info'" class="message-item-info">
              <div
                class="message-item-info-content"
                :style="{ whiteSpace: 'normal' }"
              >
                <p>
                  {{ formatDate(Number(msg.id.split('_')[0].slice(0, 10))) }}
                </p>
                <p>{{ messageInfoContent(msg) }}</p>
              </div>
            </div>
            <div v-else>
              <div v-if="!isSelfMessage(msg)" class="chat-message-top">
                <div v-if="!isSelfMessage(msg)" class="other-user-icon">
                  <a v-if="!isVisitor" :href="`/users/${msg.user_info.uuid}`">
                    <img
                      :src="msg.user_info.icon"
                      class="other-user-icon-size"
                    />
                  </a>
                  <span v-else>
                    <img
                      :src="msg.user_info.icon"
                      class="other-user-icon-size"
                    />
                  </span>
                </div>
                <span class="user-name">{{ msg.user_info.name }}</span>
              </div>
              <div
                v-else
                :class="{ 'chat-message-top-self': isSelfMessage(msg) }"
              >
                <a :href="`/users/${msg.user_info.uuid}`">
                  <img :src="msg.user_info.icon" class="other-user-icon-size" />
                </a>
              </div>
              <div
                :class="[
                  isSelfMessage(msg)
                    ? 'msg__contents__item'
                    : 'msg__contents__item__other',
                ]"
              >
                <div
                  :class="[
                    isSelfMessage(msg)
                      ? 'message-container-self'
                      : 'message-container-others',
                  ]"
                  @mouseover="mouseOverAction(msg.id)"
                  @mouseleave="mouseleaveAction"
                >
                  <message-option-menu
                    v-if="currentMouseOverMessageId === msg.id"
                    class="message-option-menu"
                    :message="msg"
                    @clickReactionMenu="clickReactionMenu"
                    @delete="onMessageDelete"
                  ></message-option-menu>
                  <div :ref="`message_${msg.id}`" class="chat-message">
                    <div
                      class="chat-message-content"
                      :class="{
                        'chat-message-top': isSelfMessage(msg),
                      }"
                    >
                      <read-count
                        v-if="isSelfMessage(msg)"
                        :count="msg.read_count"
                      />
                      <p
                        v-if="msg.type === `text`"
                        class="p-word-break"
                        v-text="messageTextContent(msg)"
                      ></p>
                      <div v-if="msg.type === `roger`">
                        <img
                          src="@/assets/image/roger.png"
                          class="roger-size"
                        />
                      </div>
                      <div v-if="msg.type === `images`" class="grid">
                        <div
                          v-if="msg.content.length < 1"
                          class="image-uploading"
                        ></div>
                        <div
                          v-for="(image, i) in msg.content"
                          :key="i"
                          :class="columnSize(msg)"
                        >
                          <a :href="image.main_image" target="_blank">
                            <img :src="image.thumbnail" alt="" />
                          </a>
                        </div>
                      </div>
                      <div v-if="msg.type === `files`">
                        <div class="">
                          <div
                            v-if="msg.content.length < 1"
                            class="image-uploading"
                          ></div>
                          <div
                            v-if="msg.content.length > 0"
                            :class="{
                              'file-message-layout-self': isSelfMessage(msg),
                            }"
                            class="file-layout"
                          >
                            <div
                              :class="[
                                isSelfMessage(msg) === true
                                  ? 'msg__contents__item__file__message'
                                  : 'msg__contents__item__other__file__message',
                              ]"
                            >
                              <div v-for="(file, i) in msg.content" :key="i">
                                <a
                                  :class="{
                                    'file-message-color-others': !isSelfMessage(
                                      msg
                                    ),
                                  }"
                                  class="file-link"
                                  :href="file"
                                  target="_blank"
                                  >{{ filename(file) }}</a
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-if="msg.type === `videos`">
                        <div class="">
                          <div
                            v-if="msg.content.length < 1"
                            class="image-uploading"
                          ></div>
                          <div
                            v-for="(video, i) in msg.content"
                            :key="i"
                            :class="{
                              'file-message-layout-self': isSelfMessage(msg),
                            }"
                            class="file-layout"
                          >
                            <div
                              :class="[
                                isSelfMessage(msg) === true
                                  ? 'msg__contents__item__file__message'
                                  : 'msg__contents__item__other__file__message',
                              ]"
                            >
                              <a
                                :class="{
                                  'file-message-color-others': !isSelfMessage(
                                    msg
                                  ),
                                }"
                                class="file-link"
                                :href="video"
                                target="_blank"
                                >{{ filename(video) }}</a
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- <reaction
                      v-if="msg.reaction_info && msg.reaction_info.count > 0"
                      :message="Object.assign({}, msg)"
                      :reaction-icons="reactionIcons"
                      :class="[
                        'reaction-position',
                        isSelfMessage(msg)
                          ? 'reaction-position__self'
                          : 'reaction-position__others',
                      ]"
                      @click="toggleReactionListModal"
                    ></reaction> -->
                    <div
                      :class="[
                        isSelfMessage(msg)
                          ? 'message-date-container-position'
                          : 'message-date-container-position-others',
                        isSelfMessage(msg)
                          ? 'message-date-container-self'
                          : 'message-date-container-others',
                      ]"
                    >
                      <div v-if="msg.id != null" class="message-date">
                        {{
                          formatDate(Number(msg.id.split('_')[0].slice(0, 10)))
                        }}
                      </div>
                      <div v-else class="message-date">
                        {{ formatDate(currentRoom.latest_message_date) }}
                      </div>
                    </div>
                    <!-- <reaction-menu
                      v-show="clickReactionMenuMessageId === msg.id"
                      :message="msg"
                      :reaction-icons="reactionIcons"
                      :class="[
                        'reaction-menu-position',
                        isSelfMessage(msg)
                          ? 'reaction-menu-position__self'
                          : 'reaction-menu-position__others',
                      ]"
                      @clickReaction="clickReaction"
                    ></reaction-menu> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <reaction-list
      v-if="reactionListModal"
      :message="reactionListOfCurrentMessage"
      :reaction-icons="reactionIcons"
      @close="toggleReactionListModal"
    >
    </reaction-list>
    <confirm-message
      v-if="isDeleteMessageModalVisible"
      @click="onDeleteMessageModalClick"
      @close="onDeleteMessageModalClose"
    >
      本当に削除してよろしいですか？
    </confirm-message>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import {
  messageRoomAll,
  messageReaction,
  masterReactionIcons,
  deleteMessage,
  readAllMessage,
} from '@/libs/api/app';
import { splitChatMessageIdentifier } from '@/libs/message/message';
import cloneDeep from 'lodash/cloneDeep';
import { VueLoading } from 'vue-loading-template';
import ReadCount from '@/components/App/atoms/messages/ReadCount.vue';
// import Reaction from '@/components/App/molecules/messages/Reaction.vue';
// import ReactionMenu from '@/components/App/molecules/messages/ReactionMenu.vue';
import MessageOptionMenu from '@/components/App/molecules/messages/MessageOptionMenu.vue';
import ConfirmMessage from '@/components/App/atoms/modals/ConfirmMessage.vue';
import dayjs from 'dayjs';
import MessageInput from './MessageInput.vue';
import ReactionList from '../modal/messages/ReactionList.vue';

type MessageEvent = {
  body: string;
  roomUuid: string;
  loginUser: {
    uuid: string;
  };
};

export default Vue.extend({
  components: {
    ReadCount,
    // Reaction,
    ReactionList,
    // ReactionMenu,
    MessageOptionMenu,
    MessageInput,
    ConfirmMessage,
    VueLoading,
  },
  props: {
    currentRoom: {
      type: Object as PropType<Types.MessageRoom>,
      required: true,
    },
    newGroupEmployeeUuids: {
      type: Array as PropType<String[]>,
      required: false,
      default: () => [],
    },
    duplicateDmRoom: {
      type: Object as PropType<Types.MessageRoom>,
      required: false,
      default: () => {
        return {
          room_uuid: '',
          name: '',
          display_name: '',
          room_icon: '',
          user_uuids: [],
          is_dm: false,
        };
      },
    },
    activeRoomUsers: {
      type: Array as PropType<AppApiResponse.RoomUser[]>,
      required: true,
    },
    isVisitor: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      images: [] as { image: File; thumbnail: string }[],
      items: [],
      reactionListModal: false as boolean,
      currentMouseOverMessageId: '' as string,
      clickReactionMenuMessageId: '' as string,
      reactionIcons: [] as Array<AppApiResponse.ReactionIcon>,
      reactionListOfCurrentMessage: {} as AppApiResponse.MessageItem,
      propUploadedImage: '' as string,
      scrollY: 0 as number,
      isAddMessageLoading: false,
      dragEntered: false as boolean,
      files: [] as File[],
      isDeleteMessageModalVisible: false as boolean,
      messageIdToDelete: undefined as string | undefined,
      hasNullIdMessage: false,
      unReadMessageIds: [] as string[],
      lastMessageFetchKey: '' as string,
      lastPageFetched: false as boolean,
      isScrollToEnd: true as boolean,
      visitedRooms: [] as string[],
    };
  },
  computed: {
    messageInfoContent() {
      return (message: AppApiResponse.MessageItem): string | undefined => {
        if (!message.source_language_code) return;
        if (!this.isContentText(message.content)) return;
        // 翻訳できない場合と原文とユーザーのメイン言語が一致してる場合は原文のみ表示
        if (
          !this.canTranslatedMessage(message.content) ||
          this.isSameLanguage(message)
        ) {
          return message.content[message.source_language_code];
        }
        return message.content[this.$store.state.userProfile.language.code];
      };
    },
    messageTextContent() {
      return (message: AppApiResponse.MessageItem) => {
        if (message.id == null) {
          return message.content;
        }
        if (!message.source_language_code) return;
        if (!this.isContentText(message.content)) return;
        // 翻訳できない場合と原文とユーザーのメイン言語が一致してる場合は原文のみ表示
        if (
          !this.canTranslatedMessage(message.content) ||
          this.isSameLanguage(message)
        ) {
          return message.content[message.source_language_code];
        }
        const translatedMessage =
          this.$store.state.userProfile.language.code &&
          message.content[this.$store.state.userProfile.language.code]
            ? `${message.content[this.$store.state.userProfile.language.code]}`
            : '';
        const originalMessage = `----------------------- \n${
          message.content[message.source_language_code]
        }`;

        return `${translatedMessage} \n ${originalMessage}`;
      };
    },
    canNotPostNewRoomMessage(): boolean {
      return (
        this.currentRoom.room_uuid === '' &&
        this.newGroupEmployeeUuids.length === 0
      );
    },
    messagesList() {
      const mess = [...this.messages].reduce((newList: any[], item: any) => {
        let timestamp = this.currentRoom.latest_message_date;
        if (item.id !== null) {
          timestamp = Number(item.id.split('_')[0].slice(0, 10));
        }
        const dateTime = dayjs.unix(timestamp).format('YYYY年MM月DD日(dd)');
        if (!newList.includes(dateTime)) {
          newList.push(dateTime);
        }
        if (!newList[dateTime]) {
          // eslint-disable-next-line no-param-reassign
          newList[dateTime] = [];
        }
        newList[dateTime].push(item);
        return newList;
      }, []);
      return mess;
    },
    messages: {
      // getter 関数
      get(): AppApiResponse.MessageItem[] {
        if (this.duplicateDmRoom.room_uuid) {
          return this.$accessor.message.content[this.duplicateDmRoom.room_uuid];
        }
        if (
          this.$accessor.message.content[this.$accessor.message.room_uuid] ==
          null
        ) {
          return [];
        }
        return this.$accessor.message.content[this.$accessor.message.room_uuid];
      },
      // setter 関数
      set(newValue: AppApiResponse.MessageItem[]) {
        const content = { ...this.$accessor.message.content };
        content[this.currentRoom.room_uuid] = newValue;
        this.$accessor.message.setContent(content);
      },
    },
  },
  watch: {
    unReadMessageIds(newValue: [], oldValue: []): void {
      if (newValue.length !== oldValue.length && this.currentRoom.room_uuid) {
        this.readMessage(newValue, this.currentRoom.room_uuid);
      }
    },
    messages(): void {
      this.setHasNullIdMessage();
      this.unReadMessageIds = this.messages
        .filter(
          (m: AppApiResponse.MessageItem) =>
            m.id !== null &&
            !m.is_read &&
            m.user_info.uuid !== this.$accessor.userProfile.uuid
        )
        .map((message: AppApiResponse.MessageItem) => message.id) as string[];
      if (this.isScrollToEnd) {
        this.scrollToEnd();
      }
    },
    currentRoom(
      newValue: Types.MessageRoom,
      oldValue: Types.MessageRoom
    ): void {
      if (newValue.room_uuid === oldValue.room_uuid) return;
      this.$accessor.message.setRoomUuid(newValue.room_uuid);
      if (newValue.room_uuid) {
        this.getAllMessages(newValue.room_uuid);
      }
      if (this.duplicateDmRoom.room_uuid) {
        this.getAllMessages(this.duplicateDmRoom.room_uuid);
      }
      this.addVisitedRoom(newValue.room_uuid);
      this.addVisitedRoom(this.duplicateDmRoom.room_uuid);

      // @ts-ignore
      this.$echo
        .channel(`message.${newValue.room_uuid}`)
        .stopListening('MessageReceived')
        .stopListening('MessageTranslated')
        .stopListening('MessageReaction')
        .stopListening('MessageRead')
        .stopListening('MessageDeleted');

      // @ts-ignore
      this.$echo
        .channel(`message.${newValue.room_uuid}`)
        .listen('MessageReceived', (e: MessageEvent) => {
          const content = { ...this.$accessor.message.content };
          const body = JSON.parse(e.body);
          // フロント側で先に表示してたメッセージはidが振られてないので二重で表示されないようにするため削除
          content[e.roomUuid] = content[e.roomUuid].filter(
            (message: AppApiResponse.MessageItem) => message.id !== null
          );
          const messageIndex = content[e.roomUuid].findIndex(
            (message: AppApiResponse.MessageItem) => message.id === body.id
          );
          if (messageIndex > -1) {
            // indexが存在する場合はリアクションつけた際に発生したイベントなのでメッセージ置き換える
            content[e.roomUuid][messageIndex] = body;
          } else {
            // 存在しない場合は追加
            content[e.roomUuid][content[e.roomUuid].length] = body;
            this.scrollToEnd();
          }
          this.setHasNullIdMessage();
          this.$accessor.message.setContent(content);

          // Only trigger when user is staying in the same room of the received message and the message is from another user
          // eslint-disable-next-line prettier/prettier
          const shouldMessageReaded = e.roomUuid === this.currentRoom.room_uuid && this.$accessor.userProfile.uuid !== e.loginUser.uuid;
          if (shouldMessageReaded) {
            setTimeout(() => {
              readAllMessage(this.currentRoom.room_uuid);
            }, 1500);
            this.$emit('messageReaded', this.currentRoom.room_uuid, []);
          }
        })
        .listen('MessageTranslated', (e: MessageEvent) => {
          const content = { ...this.$accessor.message.content };
          const body = JSON.parse(e.body);
          // フロント側で先に表示してたメッセージはidが振られてないので二重で表示されないようにするため削除
          content[e.roomUuid] = content[e.roomUuid].filter(
            (message: AppApiResponse.MessageItem) => message.id !== null
          );
          const messageIndex = content[e.roomUuid].findIndex(
            (message: AppApiResponse.MessageItem) => message.id === body.id
          );
          if (messageIndex > -1) {
            content[e.roomUuid][messageIndex] = body;
            this.setHasNullIdMessage();
            this.$accessor.message.setContent(content);
          }
        })
        .listen('MessageReaction', (e: MessageEvent) => {
          const content = { ...this.$accessor.message.content };
          const body = JSON.parse(e.body);
          const messageIndex = content[e.roomUuid].findIndex(
            (message: AppApiResponse.MessageItem) => message.id === body.id
          );
          if (messageIndex > -1) {
            // indexが存在する場合はリアクションつけた際に発生したイベントなのでメッセージ置き換える
            content[e.roomUuid][messageIndex] = body;
          }
          this.setHasNullIdMessage();
          this.$accessor.message.setContent(content);
        })
        .listen('MessageRead', (e: MessageEvent) => {
          const body = JSON.parse(e.body);
          this.handleMessageRead(body);
        })
        .listen('MessageDeleted', (e: MessageEvent) => {
          const content = cloneDeep(this.$accessor.message.content);
          const body = JSON.parse(e.body);
          // フロント側で先に表示してたメッセージはidが振られてないので二重で表示されないようにするため削除
          content[this.currentRoom.room_uuid] = content[
            this.currentRoom.room_uuid
          ].filter(
            (message: AppApiResponse.MessageItem) => message.id !== null
          );
          const messageIndex = content[this.currentRoom.room_uuid].findIndex(
            (message: AppApiResponse.MessageItem) => message.id === body.id
          );
          if (messageIndex === -1) return;
          content[this.currentRoom.room_uuid].splice(messageIndex, 1);
          this.$accessor.message.setContent(content);
        });
    },
  },
  async mounted() {
    const content = { ...this.$accessor.message.content };
    content[this.currentRoom.room_uuid] = [];
    this.$accessor.message.setContent(content);
    await this.getAllMessages(this.currentRoom.room_uuid);
    this.getReactionIcons();
    const container = this.$refs.chatContents as HTMLElement;
    if (container) {
      container.addEventListener('scroll', this.handleScroll);
    }
  },
  destroyed() {
    this.messages = [];
    this.visitedRooms.forEach((uuid: string) => {
      // @ts-ignore
      this.$echo
        .channel(`message.${uuid}`)
        .stopListening('MessageReceived')
        .stopListening('MessageTranslated')
        .stopListening('MessageReaction')
        .stopListening('MessageRead')
        .stopListening('MessageDeleted');
    });
  },
  methods: {
    formatDate(time: number) {
      return dayjs.unix(time).format('HH:mm');
    },
    isSameLanguage(message: AppApiResponse.MessageItem): boolean {
      if (!this.$store.state.userProfile.language) return false;
      return (
        this.$store.state.userProfile.language.code ===
        message.source_language_code
      );
    },
    canTranslatedMessage(content: AppApiResponse.ContentText): boolean {
      return (
        this.$store.state.userProfile.language &&
        content[this.$store.state.userProfile.language.code]
      );
    },
    isContentText(arg: any): arg is AppApiResponse.ContentText {
      return arg.file_url === undefined && arg.thumbnail === undefined;
    },
    setHasNullIdMessage(): void {
      if (this.messages == null) return;
      this.hasNullIdMessage =
        this.messages.findIndex(
          (message: AppApiResponse.MessageItem) => message.id === null
        ) !== -1;
    },
    handleMessageRead(data: AppApiResponse.MessageItem[]): void {
      data.forEach((body: AppApiResponse.MessageItem) => {
        const content = { ...this.$accessor.message.content };
        if (body.id === null) {
          return;
        }
        const { user_uuid } = splitChatMessageIdentifier(body.id);
        if (user_uuid !== this.$accessor.userProfile.uuid) {
          return;
        }
        const i = content[this.currentRoom.room_uuid].findIndex(
          (message: AppApiResponse.MessageItem) => message.id === body.id
        );
        if (i === -1) {
          return;
        }
        // 自分の投稿したメッセージのみ既読数を更新する
        if (
          content[this.currentRoom.room_uuid][i].user_info.uuid !==
          this.$accessor.userProfile.uuid
        ) {
          return;
        }
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(content[this.currentRoom.room_uuid][i].read_count)) {
          content[this.currentRoom.room_uuid][i] = {
            ...content[this.currentRoom.room_uuid][i],
            read_count: 0,
          };
          // Vue.set(content[this.currentRoom.room_uuid][i], 'read_count', 0);
        }
        // eslint-disable-next-line prettier/prettier
        content[this.currentRoom.room_uuid][i] = {
          ...content[this.currentRoom.room_uuid][i],
          read_count: body.read_count,
        };
        // Vue.set(content[this.currentRoom.room_uuid][i], 'read_count', body.read_count);
        this.$accessor.message.setContent(content);
      });
    },
    readMessage(messageIds: string[], roomUuid: string): void {
      if (
        messageIds.length === 0 ||
        this.currentRoom.room_uuid === null ||
        this.currentRoom.unread_message_count === 0
      ) {
        return;
      }
      readAllMessage(this.currentRoom.room_uuid).then(() => {
        this.$emit('messageReaded', roomUuid, []);
      });
    },
    filename(value: string) {
      if (!value) return '';
      const array = value.split('/');
      return array[array.length - 1];
    },
    async getAllMessages(
      room_uuid: string,
      message_id?: string
    ): Promise<void> {
      this.$accessor.setLoading(true);
      this.$emit('closeSideMenu');
      try {
        this.lastPageFetched = true;
        if (!this.currentRoom.room_uuid && !this.duplicateDmRoom.room_uuid)
          return;
        const {
          data: { messages },
        } = await messageRoomAll(
          {
            room_uuid,
          },
          {
            count: 20,
            message_id,
          }
        );
        if (messages.length < 20) {
          if (this.currentRoom.unread_message_count !== 0) {
            setTimeout(() => {
              this.updatedAllMessageReaded();
            }, 500);
          }
        } else {
          this.lastPageFetched = false;
        }
        const content = { ...this.$accessor.message.content };
        content[this.currentRoom.room_uuid] = [...messages];
        this.$accessor.message.setContent(content);
        this.lastMessageFetchKey = this.getLastKeyOfMessageDataResult(messages);
        this.scrollToEnd();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
      this.$accessor.setLoading(false);
    },
    async addMessages(message_id?: string): Promise<void> {
      try {
        this.isAddMessageLoading = true;
        if (!this.currentRoom.room_uuid) return;
        if (this.lastPageFetched) return;
        const messages = (
          await messageRoomAll(
            {
              room_uuid: this.currentRoom.room_uuid,
            },
            {
              count: 10,
              message_id,
            }
          )
        ).data.messages as AppApiResponse.MessageItem[];
        if (messages.length < 10) {
          this.lastPageFetched = true;
          if (this.currentRoom.unread_message_count !== 0) {
            setTimeout(() => {
              this.updatedAllMessageReaded();
            }, 500);
          }
        }
        const content = { ...this.$accessor.message.content };
        content[this.currentRoom.room_uuid] = [
          ...messages,
          ...content[this.currentRoom.room_uuid],
        ];
        this.lastMessageFetchKey = this.getLastKeyOfMessageDataResult(messages);
        this.$accessor.message.setContent(content);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isAddMessageLoading = false;
      }
    },
    async getReactionIcons() {
      this.reactionIcons = (await masterReactionIcons()).data;
    },
    async clickReaction(reaction_uuid: string) {
      this.addReactionToMessage(reaction_uuid);
      await messageReaction({
        uuid: this.currentRoom.room_uuid,
        id: this.clickReactionMenuMessageId,
        reaction_uuid,
      });
      this.clickReactionMenuMessageId = '';
    },
    addReactionToMessage(reaction_uuid: string) {
      const reaction = {
        user_info: {
          uuid: this.$accessor.userProfile.uuid,
          icon: this.$accessor.userProfile.icon,
          name: this.$accessor.userProfile.name,
        },
        reaction_uuid,
      };
      const message = this.messages.find(
        (messageItem: AppApiResponse.MessageItem) =>
          messageItem.id === this.clickReactionMenuMessageId
      ) as AppApiResponse.MessageItem | undefined;
      if (!message) {
        return;
      }
      // リアクションが一度もついてない場合の処理
      if (!message.reaction_info) {
        Object.assign(message, {
          reaction_info: { count: 1, reactions: [reaction] },
        });
        return;
      }
      // 対象のメッセージにログインユーザーが付けたリアクションを取得
      const addedReaction = message.reaction_info.reactions.find(
        (reactionItem: AppApiResponse.ReactionItem) =>
          reactionItem.user_info.uuid === this.$accessor.userProfile.uuid
      );
      const addedReactionIndex = message.reaction_info.reactions.findIndex(
        (reactionItem: AppApiResponse.ReactionItem) =>
          reactionItem.user_info.uuid === this.$accessor.userProfile.uuid
      );

      if (addedReaction) {
        // すでにリアクションを付けてて、同じリアクションアイコンをクリックした場合リストから削除
        if (addedReaction.reaction_uuid === reaction_uuid) {
          message.reaction_info.count -= 1;
          message.reaction_info.reactions.splice(addedReactionIndex, 1);
          return;
        }
        // すでにリアクションを付けてて、別のリアクションアイコンをクリックした場合別のリアクションに上書き
        addedReaction.reaction_uuid = reaction_uuid;
      } else {
        // リアクションを付けてない場合、リストにリアクションを追加
        message.reaction_info.count += 1;
        message.reaction_info.reactions.push(reaction);
      }
    },
    isSelfMessage(msg: AppApiResponse.MessageItem): boolean {
      return msg.user_info.uuid === this.$accessor.userProfile.uuid;
    },
    columnSize(msg: AppApiResponse.MessageItem) {
      if (!msg.content) return;
      if (msg.content.length >= 3) {
        return 'column-3';
      }
      if (msg.content.length === 2) {
        return 'column-2';
      }
      if (msg.content.length === 1 && this.isSelfMessage(msg)) {
        return 'column-1-others';
      }
      return 'column-1';
    },
    onScroll(event: any) {
      const scrollTop = Math.ceil(event.target.scrollTop);
      const clientHeight = Math.ceil(event.target.clientHeight);
      const { scrollHeight } = event.target;
      if (scrollTop + clientHeight >= scrollHeight) {
        this.isScrollToEnd = true;
      } else {
        this.isScrollToEnd = false;
      }
    },
    scrollToEnd() {
      this.$nextTick(() => {
        const container = this.$el.querySelector('#chat-contents');
        if (container) {
          container.scrollTop = container.scrollHeight;
          this.isScrollToEnd = true;
        }
      });
    },
    toggleReactionListModal(message: AppApiResponse.MessageItem) {
      this.reactionListOfCurrentMessage = message;
      this.reactionListModal = !this.reactionListModal;
    },
    mouseOverAction(messageUuid: string) {
      this.currentMouseOverMessageId = messageUuid;
    },
    mouseleaveAction() {
      this.currentMouseOverMessageId = '';
    },
    clickReactionMenu(messageUuid: string) {
      if (this.clickReactionMenuMessageId === messageUuid) {
        this.clickReactionMenuMessageId = '';
        return;
      }
      this.clickReactionMenuMessageId = messageUuid;
    },
    onMessageDelete(messageId: string) {
      this.isDeleteMessageModalVisible = true;
      this.messageIdToDelete = messageId;
    },
    onDeleteMessageModalClose() {
      this.isDeleteMessageModalVisible = false;
      this.messageIdToDelete = undefined;
    },
    async onDeleteMessageModalClick() {
      if (this.messageIdToDelete === undefined) {
        return;
      }
      const content = cloneDeep(this.$accessor.message.content);

      const idx = content[this.currentRoom.room_uuid].findIndex(
        (m: AppApiResponse.MessageItem) => m.id === this.messageIdToDelete
      );
      if (idx === -1) {
        return;
      }
      const deleteMessageItem = content[this.currentRoom.room_uuid][idx];
      const beforeDeleteMessageItem =
        idx === 0 ? null : content[this.currentRoom.room_uuid][idx - 1];
      try {
        content[this.currentRoom.room_uuid].splice(idx, 1);
        this.isDeleteMessageModalVisible = false;
        await deleteMessage(this.currentRoom.room_uuid, this.messageIdToDelete);
        this.$accessor.message.setContent(content);
      } catch (e) {
        console.error('onMessageDelete', { e });
        if (e.response && e.response.status === 409) {
          window.alert('メッセージを削除できませんでした。');
          this.undo(beforeDeleteMessageItem, deleteMessageItem);
        }
      } finally {
        this.messageIdToDelete = undefined;
      }
    },
    undo(
      beforeDeleteMessageItem: AppApiResponse.MessageItem | null,
      deleteMessageItem: AppApiResponse.MessageItem
    ) {
      const content = cloneDeep(this.$accessor.message.content);
      if (!beforeDeleteMessageItem) {
        content[this.currentRoom.room_uuid].unshift(deleteMessageItem);
      } else {
        const idx = this.messages.findIndex(
          (m: AppApiResponse.MessageItem) => m.id === beforeDeleteMessageItem.id
        );
        content[this.currentRoom.room_uuid].splice(
          idx + 1,
          0,
          deleteMessageItem
        );
      }
      this.$accessor.message.setContent(content);
    },
    clearFiles() {
      this.files = [];
    },
    clearTempMessages() {
      const content = { ...this.$accessor.message.content };
      content[this.currentRoom.room_uuid] = content[
        this.currentRoom.room_uuid
      ].filter((message: AppApiResponse.MessageItem) => message.id !== null);
      this.$accessor.message.setContent(content);
    },
    /** handlers */
    onDragEnter() {
      if (this.canNotPostNewRoomMessage) return;
      this.dragEntered = true;
    },
    onDragLeave() {
      if (this.canNotPostNewRoomMessage) return;
      this.dragEntered = false;
    },
    onFileChange(event: any): void {
      if (this.canNotPostNewRoomMessage) return;
      this.clearFiles();
      const files =
        (event.target as HTMLInputElement).files ||
        (event.dataTransfer as DataTransfer).files;
      if (Array.from(files).some((n: File) => n.size > 26214400)) {
        alert('アップロードできるファイルサイズの上限は25MBです');
        return;
      }
      this.files.push(...Array.from(files));
      this.dragEntered = false;
    },
    onClose() {
      this.clickReactionMenuMessageId = '';
    },
    onMessageAdded(data: {
      message: AppApiResponse.MessageItem;
      room_uuid: string;
    }) {
      const content = cloneDeep(this.$accessor.message.content);

      if (content[data.room_uuid] == null) {
        content[data.room_uuid] = [data.message];
      } else {
        content[data.room_uuid].push(data.message);
      }
      this.$emit('messageAdded', data);
      this.$accessor.message.setContent(content);
      this.scrollToEnd();
    },
    onMessageFailure() {
      this.clearTempMessages();
    },
    onSelectNewRoom(roomUuid: string) {
      this.$emit('selectNewRoom', roomUuid);
    },
    retryGetAllMessages() {
      this.getAllMessages(this.currentRoom.room_uuid);
    },
    async handleScroll() {
      const element = this.$refs.chatContents as HTMLElement;
      if (!element) return;
      if (element.scrollTop === 0 && !this.lastPageFetched) {
        await this.addMessages(this.lastMessageFetchKey);
        element.scrollTop = 10;
      }
    },
    getLastKeyOfMessageDataResult(message: AppApiResponse.MessageItem[]) {
      if (message.length > 0) {
        const lastElement = message[0];
        return lastElement.id ? lastElement.id : '';
      }
      return '';
    },
    async updatedAllMessageReaded() {
      await readAllMessage(this.currentRoom.room_uuid);
      this.$emit('messageReaded', this.currentRoom.room_uuid, []);
    },
    addVisitedRoom(roomUUID: string) {
      if (roomUUID && !this.visitedRooms.includes(roomUUID)) {
        this.visitedRooms.push(roomUUID);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay-transparent {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 30;
}

.msg {
  &__contents {
    height: 100%;
    padding: 10px;
    position: relative;
    overflow-y: scroll;

    &__messages {
      padding: 10px 10px 10px;
      margin-top: auto;
      white-space: pre-line;
    }

    &__date {
      margin-bottom: 20px;
      color: #ababab;
      text-align: center;
    }

    &__item {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
      margin-top: -43px;
      margin-right: 45px;

      p {
        position: relative;
        display: inline-block;
        padding: 16px 13px 17px 16px;
        font-weight: 300;
        border-radius: 8px;
        color: $chart_text;
        background: $gradient_6;
        font-size: 15px;
        line-height: 1;
      }

      p::after {
        content: '';
        border-right: 23px solid #f9e6ec;
        border-top: 0;
        border-bottom: 21px solid #ebecf500;
        background-color: transparent;
        position: absolute;
        top: -11px;
        transform: rotate(136deg);
        right: -4px;
      }

      &__file__message {
        max-width: 100%;
        display: inline-block;
        padding: 16px 13px 17px 16px;
        font-weight: 300;
        border-radius: 8px;
        color: $chart_text;
        background: $gradient_6;
        font-size: 15px;
      }

      &__file__message::after {
        content: '';
        border-right: 23px solid #f9e6ec;
        border-top: 0;
        border-bottom: 21px solid #ebecf500;
        background-color: transparent;
        position: absolute;
        top: -8px;
        transform: rotate(136deg);
        right: -4px;
      }

      & + & {
        margin-top: 10px;
      }
    }

    &__item__other {
      display: flex;
      justify-content: flex-start;
      margin: 3.8px 0 5px 40px;

      p {
        position: relative;
        display: inline-block;
        padding: 16px 13px 17px 16px;
        font-weight: 300;
        border-radius: 8px;
        color: $chart_text;
        background: $gradient_6;
        font-size: 15px;
        line-height: 1;
      }

      p::after {
        content: '';
        border-right: 17px solid #ebecf5;
        border-top: 0;
        border-bottom: 13px solid #ebecf500;
        background-color: transparent;
        position: absolute;
        top: 0;
        left: -10px;
      }

      &__file__message {
        max-width: 100%;
        display: inline-block;
        padding: 16px 13px 17px 16px;
        font-weight: 300;
        border-radius: 8px;
        color: $chart_text;
        background: $gradient_6;
        font-size: 15px;
      }

      &__file__message::after {
        content: '';
        border-right: 17px solid #ebecf5;
        border-top: 0;
        border-bottom: 13px solid #ebecf500;
        background-color: transparent;
        position: absolute;
        top: 0;
        left: -10px;
      }

      & + & {
        margin-top: 10px;
      }
    }
  }
}

.error {
  margin: 10px 0;
  font-weight: bold;
  color: red;
}

.other-user-icon {
  margin-right: 8px;
}

.other-user-icon-size {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}

.grid {
  display: flex;
  flex-wrap: wrap;
}

.column-3 {
  border-radius: 50px;
  box-sizing: border-box;
  flex: 0 0 calc(100% / 3);
  max-width: calc(100% / 3);
  min-width: 0;
  word-wrap: break-word;
  padding: 1px;

  img {
    border-radius: 10px;
    width: 100%;
    height: 120px;
    object-fit: cover;
  }
}

.column-2 {
  border-radius: 50px;
  box-sizing: border-box;
  flex: 0 0 50%;
  max-width: 50%;
  min-width: 0;
  word-wrap: break-word;
  padding: 1px;

  img {
    border-radius: 10px;
    width: 100%;
    height: 120px;
    object-fit: cover;
  }
}

.column-1 {
  display: block;
  border-radius: 50px;
  box-sizing: border-box;
  flex: 0 0 100%;
  max-width: 100%;
  min-width: 0;
  word-wrap: break-word;
  padding: 1px;

  img {
    display: block;
    border-radius: 10px;
    height: 120px;
    object-fit: contain;
    object-position: 100% 0;
  }
}

.column-1-others {
  display: block;
  border-radius: 50px;
  box-sizing: border-box;
  flex: 0 0 100%;
  max-width: 100%;
  min-width: 0;
  word-wrap: break-word;
  padding: 1px;

  img {
    display: block;
    border-radius: 10px;
    height: 120px;
    object-fit: contain;
    object-position: 0 0;
  }
}

.image-uploading {
  display: block;
  border-radius: 10px;
  box-sizing: border-box;
  flex: 0 0 100%;
  height: 120px;
  width: 180px;
  word-wrap: break-word;
  padding: 1px;
  background-color: #f2f3f7;
  position: relative;

  &::after {
    content: ' ';
    display: block;
    height: 32px;
    width: 32px;
    // TODO: 素材がなかったため適当に用意したアイコンなので、デザインに合わせて置き換えてください
    background: url('~assets/image/icon/loading.gif');
    background-repeat: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.drop-area {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 0, 0, 0.3);
  opacity: 0;
  z-index: 9999;
}

.drop-area-over-border {
  border: 1px solid blue;
  z-index: 9999;
}

.drop-area-over {
  top: 0;
  width: 100%;
  height: 100vh;
  opacity: 0;
}

.file-message-layout-self {
  display: flex;
  justify-content: flex-end;

  a {
    color: #367ab3;
  }
}

.file-layout {
  margin-bottom: -2px;
}

.file-link {
  word-break: break-all;
}

.file-message-color-others {
  color: #367ab3;
}

.arrow {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  color: #4099ff;
  padding-left: 2px;
}

.msg__contents__height__attached__file {
  height: calc(100% - 170px);
}

ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.roger-size {
  height: 40px;
}

.chat-container {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
}

.chat-message {
  position: relative;
  max-width: 50%;
}

.chat-message-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.chat-message-top-self {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
  top: 20px;
}

.chat-message-top {
  display: flex;
  flex-direction: row;
  margin-top: 25px 0 3.8px;
  padding-top: 3px;
}

.reaction-position {
  position: absolute;
  bottom: -20px;
  z-index: 2;
  cursor: pointer;

  &__self {
    right: 2px;
  }

  &__others {
    left: 2px;
  }
}

.p-word-break {
  word-break: break-word;
}

.reaction-menu {
  margin-top: 20px;
  display: flex;
  width: 100px;
  align-items: center;
}

.menu-img-size {
  width: 20px;
}

.svg-icon {
  transform: scale(-1, 1);
}

.reaction-menu-position {
  position: absolute;
  z-index: 40;
  cursor: pointer;
  top: -72px;
  bottom: 0;
  margin: auto;
  height: 56px;

  &__self {
    right: 95%;
  }

  &__others {
    left: 95%;
  }
}

.message-container-self {
  width: 100%;
  min-width: 300px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.message-container-others {
  width: 100%;
  min-width: 300px;
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  margin-top: -23px;
  margin-left: 8px;
}

.user-name {
  font-size: 11px;
  font-weight: 600;
  color: #9c9da5;
}

.loading-style {
  position: absolute;
  top: 50%;
  left: 50%;
}

.message-item-info {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  padding: 10px;
}

.message-date-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.message-date-container-self {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  margin-top: -11px;
  margin-right: -34px;
}

.message-date-container-others {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  margin-top: -11px;
  margin-left: 2px;
}

.message-date-container-position {
  position: absolute;
  white-space: nowrap;
  right: 100%;
}

.message-date-container-position-others {
  position: absolute;
  white-space: nowrap;
  left: 100%;
}

.message-date {
  font-size: 11px;
  line-height: 1;
  color: $sub_color;
}

.message-item-info-date {
  text-align: center;
}

.message-item-info-content {
  justify-content: center;
  align-items: center;
  background-color: #e4e6e782;
  border-radius: 8px;
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;

  .item-center {
    text-align: center;
  }
}

.grouped-date {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;

  .messages-date {
    background-color: #e4e5e68a;
    color: #2e303e;
    width: 126px;
    font-size: 11px;
    border-radius: 8px;
    height: 16px;
    line-height: 1.5;
  }
}
</style>
