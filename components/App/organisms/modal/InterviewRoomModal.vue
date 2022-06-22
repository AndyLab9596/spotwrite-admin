<template>
  <transition name="modal" appear>
    <div class="modal-overlay">
      <div ref="modalWindow" class="modal-window">
        <div class="icon-cross-wrapper" @click="onClose">
          <img src="/app/icon/cross-white.svg" class="icon-cross" />
        </div>
        <div class="modal-contents">
          <div v-if="!roomIsClose" class="interview-message-container">
            <BaseButton
              class="message-content-back-button"
              greyed
              @click="onClose"
            >
              インタビューを終了する
            </BaseButton>
            <div class="message-content-title">
              インタビュールーム
              <span>（{{ selectedInterviewees.length }}人）</span>
              <img
                src="/app/icon/icon-info.svg"
                class="member-list-toggle"
                @click="showMemberList = true"
              />
            </div>

            <div ref="messageList" class="message-content-body">
              <template
                v-for="(content, index) in interviewMessageRoomContents"
              >
                <div
                  v-if="content.content_type === 'heading'"
                  :key="index"
                  class="heading"
                >
                  {{ content.body }}
                </div>
                <div
                  v-else
                  :key="index"
                  :class="`comment ${content.comment_position}`"
                >
                  <div class="user-info">
                    <img :src="content.user_icon" />
                    <span>
                      {{ content.user_name }}（{{ content.organization_name }}）
                    </span>
                  </div>
                  <div :class="`comment-content ${content.comment_position}`">
                    <div class="comment-body">
                      <span>{{ content.body }}</span>
                    </div>
                  </div>
                  <div class="comment-date">
                    {{ dateFormat(content.created_at) }}
                  </div>
                </div>
              </template>
            </div>

            <div class="message-content-bottom">
              <textarea
                v-model="input.message"
                type="text"
                class="message-content-input"
                placeholder="コメントをしてみよう！"
                @keydown.prevent.enter.exact="onSendMessage"
                @keydown.enter.shift="keyEnterShift"
              />
              <img
                src="/app/icon/icon-send.svg"
                class="message-send-icon"
                disabled
              />
              <img
                src="/app/icon/icon-send-pink.svg"
                class="message-send-icon"
                :class="{ disabled: !input.message }"
                @click="onSendMessage"
              />
            </div>

            <div
              class="message-content-member"
              :class="{ shown: showMemberList }"
            >
              <div class="member-close" @click="showMemberList = false"></div>
              <div class="member-heading">インタビュー参加社員</div>
              <div class="member-title">
                グループメンバー
                <span>{{ selectedInterviewees.length }}人</span>
              </div>
              <div class="member-item-list">
                <div
                  v-for="member in selectedInterviewees"
                  :key="member.uuid"
                  class="member-item"
                >
                  <img :src="member.user_icon" />
                  <div class="item-heading">
                    <div class="item-name">{{ member.name }}</div>
                    <div class="item-box">{{ member.organization }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="romm-closed">
            「インタビューが削除されたため、ルームを終了します」
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';
import { getRoomInterview, addMessageInterview } from '@/libs/api/app';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

type Contents = {
  kind: 'comment' | 'heading';
  commenter?: string;
  body: string;
  user_icon: string;
  content_type?: string;
  comment_position?: string;
  id?: number;
  user_name?: string;
  organization_name?: string;
  created_at?: string;
  interviewee_uuid?: string;
};
type InterviewText = Contents;

export default Vue.extend({
  components: {
    BaseButton,
  },
  props: {
    roomId: {
      type: Number,
      required: false,
      default: 0,
    },
    roomIsClose: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    selectedInterviewees: [] as any[],
    interviewMessageRoomContents: [] as AppApiRequest.StoreInterviewItem[],
    showMemberList: false as boolean,
    showActionPanel: -1 as number,
    input: {
      message: '' as string,
    },
    currentCommentPositionUser: 'left' as string,
    flagSending: false as boolean,
  }),
  computed: {
    dateFormat(): string {
      return (unix: number) => {
        const date = dayjs.unix(unix);
        let dayOfWeek = date.day();
        if (dayOfWeek === 0) dayOfWeek = '日';
        else if (dayOfWeek === 1) dayOfWeek = '月';
        else if (dayOfWeek === 2) dayOfWeek = '火';
        else if (dayOfWeek === 3) dayOfWeek = '水';
        else if (dayOfWeek === 4) dayOfWeek = '木';
        else if (dayOfWeek === 5) dayOfWeek = '金';
        else if (dayOfWeek === 6) dayOfWeek = '土';
        return date.format(`YYYY/M/D（${dayOfWeek}）H:m`);
      };
    },
  },
  watch: {
    interviewMessageRoomContents() {
      setTimeout(() => {
        this.scrollEnd();
      }, 300);
    },
  },
  mounted() {
    if (this.$props.roomId > 0) {
      // @ts-ignore
      this.$echo
        .channel(`message.interview.${this.$props.roomId}`)
        .listen('MessageInterviewTranslated', (e: any) => {
          const body = JSON.parse(e.body);
          if (
            this.$accessor.userProfile.uuid === body.user_info.uuid &&
            body.action_type !== 'edit.text'
          ) {
            return;
          }
          const userSend = this.userInfo(body.user_info.uuid);
          const index = this.interviewMessageRoomContents.findIndex(
            (item: any) => item.id === body.id
          );
          const mess: InterviewText = {
            id: body.id,
            content_type: body.content_type,
            body: body.content ? body.content.origin : '',
            kind: body.content_type,
            comment_position: body.comment_position,
            user_name: userSend.name,
            user_icon: userSend.user_icon,
            organization_name: userSend.organization,
            created_at: body.created_at,
            interviewee_uuid: body.user_info.uuid,
          };
          if (body.action_type === 'delete.text') {
            this.interviewMessageRoomContents.splice(index, 1);
          } else if (body.action_type === 'store.text') {
            this.interviewMessageRoomContents.push(mess);
          } else if (body.action_type === 'edit.text') {
            this.$set(this.interviewMessageRoomContents, index, mess);
          }
        });
    }
  },
  async destroyed() {
    if (this.$route.query && this.$route.query.room_id) {
      this.$router.replace({ query: undefined });
    }
    // @ts-ignore
    this.$echo
      .channel(`message.interview.${this.$props.roomId}`)
      .stopListening('MessageInterviewTranslated');
  },
  async created() {
    await this.fetchRoom(this.$props.roomId);
  },
  methods: {
    onKeyUp({ keyCode }: object): void {
      if (keyCode === 13 && this.input.message) {
        this.onSendMessage();
      }
    },
    keyEnterShift(): void {
      if (this.flagSending) return;
      this.input.message += '\n';
    },
    scrollEnd(): void {
      const container = this.$refs.messageList;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    async onSendMessage(): void {
      if (this.input.message.trim() === '') {
        this.input.message = '';
        return;
      }
      if (this.flagSending) {
        return;
      }
      this.flagSending = true;
      const params = {
        message: this.input.message.trim(),
        room_id: this.roomId,
        content_type: 'comment',
        comment_position: this.currentCommentPositionUser,
      };
      const { data } = await addMessageInterview(params);
      const mess: InterviewText = {
        content_type: 'comment',
        body: this.input.message,
        comment_position: this.currentCommentPositionUser,
        user_icon: this.$accessor.userProfile.user_icon,
        user_name: this.$accessor.userProfile.name,
        interviewee_uuid: this.$accessor.userProfile.uuid,
        organization_name: this.$accessor.userProfile.organization_name,
        created_at: data.body.created_at,
        id: data.body.id,
      };
      this.interviewMessageRoomContents.push(mess);
      this.flagSending = false;
      this.input = {
        message: '',
      };
      setTimeout(() => {
        this.scrollEnd();
      }, 200);
    },
    userInfo(uuid: string) {
      return this.selectedInterviewees.find((item: any) => item.uuid === uuid);
    },
    async fetchRoom(roomId: number) {
      const { data } = await getRoomInterview(roomId);
      this.selectedInterviewees = data.user_infos;
      const mess = data.messages
        .map((item: any) => {
          const user = this.userInfo(item.interviewee.uuid);
          return Object.assign(item, {
            body: item.message.origin,
            user_name: user.name,
            user_icon: user.user_icon,
            organization_name: user.organization,
          });
        })
        .sort((a: any, b: any) => a.created_at - b.created_at);
      this.interviewMessageRoomContents = mess;
      const currentPosition = data.user_positions.find(
        (item: any) => item.user_uuid === this.$accessor.userProfile.uuid
      );
      if (currentPosition) {
        this.currentCommentPositionUser = currentPosition.comment_position;
      }
      setTimeout(() => {
        this.scrollEnd();
      }, 300);
    },
    onClose() {
      this.$emit('close');
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  width: 800px;
  background-color: $true_white;
  position: relative;
}

.modal-contents {
  .interview-message-container {
    position: relative;
    padding: 40px 0 0 !important;

    .message-content-back-button {
      position: absolute;
      top: 15px;
      right: 15px;
      font-weight: inherit;
    }

    .message-content-title {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;

      span {
        font-size: 11px;
        margin-left: 35px;
      }

      img {
        height: 16px;
        margin-left: 5px;
        cursor: pointer;
      }
    }

    .message-content-bottom {
      position: relative;
      display: flex;
      flex-direction: column;
      background: #f2f3f7;
      padding: 14px 16px 15px;
      opacity: 0.9;

      .message-content-input {
        appearance: none;
        border: none;
        border-radius: 4px;
        background: $true_white;
        color: inherit;
        font-size: 15px;
        height: 52px;
        padding: 0 22px;
        width: 100%;
        resize: none;
        padding-top: 15px;
        padding-right: 45px;
        overflow-y: hidden;

        &::placeholder {
          color: #9c9da5;
        }
      }

      .input-type {
        display: flex;
        align-items: center;
        margin-top: 15px;
        margin-left: auto;
        font-size: 15px;

        .checkbox-wrapper {
          margin-left: 25px;
        }
      }

      .message-send-icon {
        position: absolute;
        top: 40px;
        right: 42px;
        transform: translate(50%, -50%);
        height: 32px;
        cursor: pointer;
        transition: opacity 500ms;

        &[disabled] {
          height: 16px;
          cursor: default;
        }

        &.disabled {
          opacity: 0;
          pointer-events: none;
        }
      }
    }

    .message-content-member {
      position: absolute;
      top: 0;
      right: 0;
      width: 392px;
      height: -webkit-fill-available;
      background: $true_white;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
      padding: 62px 24px 15px;
      text-align: center;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 500ms;
      display: none;

      .member-close {
        position: absolute;
        background: #7e8195;
        top: 10px;
        right: 10px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;

        &::before,
        &::after {
          position: absolute;
          content: '';
          border-top: solid 1px $true_white;
          width: 10px;
          top: 50%;
          left: calc(50% - 5px);
        }

        &::before {
          transform: rotate(45deg);
        }

        &::after {
          transform: rotate(-45deg);
        }
      }

      .member-heading {
        font-size: 15px;
      }

      .member-title {
        display: flex;
        align-items: center;
        font-size: 15px;
        margin-top: 45px;

        span {
          color: $true_white;
          background: #89d3ca;
          border-radius: 2px;
          font-size: 10px;
          padding: 0 7px;
          height: 18px;
          line-height: 18px;
          margin-left: 36px;
        }
      }

      .member-item-list {
        flex-grow: 1;
        overflow: auto;

        .member-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 12px 0;
          border-bottom: solid 1px #e8ebed;

          img {
            height: 32px;
            width: 32px;
            object-fit: cover;
            border-radius: 12px;
          }

          .item-heading {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-left: 8px;

            .item-name {
              font-size: 13px;
            }

            .item-box {
              font-size: 11px;
              color: #9c9da5;
            }
          }
        }
      }

      &.shown {
        transform: translateX(0);
        display: block;
        z-index: 3;
      }
    }

    .message-content-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px 24px;
      height: calc(100vh - 364px);
      overflow: auto;

      .heading {
        position: relative;
        font-size: 15px;
        padding: 0 107px;
        font-weight: 600;
        white-space: pre-line;

        &::before,
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 24px;
          border-top: solid 1px #f09c9c;
        }

        &::before {
          left: 60px;
          transform: rotate(45deg);
        }

        &::after {
          right: 60px;
          transform: rotate(-45deg);
        }

        &:not(:first-child) {
          margin-top: 40px;
        }

        &:hover {
          .heading-action-icon {
            opacity: 1;
            pointer-events: unset;
          }
        }
      }

      .comment {
        max-width: 50%;

        .user-info {
          display: flex;
          align-items: center;
          font-size: 11px;

          img {
            width: 32px;
            height: 32px;
            object-fit: cover;
            border-radius: 12px;
          }
        }

        .comment-content {
          position: relative;
          align-items: flex-end;

          &.left {
            display: flex;
          }

          &.right {
            display: flex;
            flex-direction: column-reverse;
          }

          .comment-body {
            position: relative;
            margin-top: 8px;
            padding: 15px;
            font-size: 15px;
            line-height: 1;
            font-weight: 300;
            color: #725661;
            white-space: pre-line;

            & > * {
              position: relative;
              z-index: 2;
            }

            &::before {
              content: '';
              position: absolute;
              top: -4px;
              width: 24px;
              height: 12px;
              border-top: solid 6px transparent;
              border-bottom: solid 6px #ebecf5;
            }

            &::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 1;
              background: linear-gradient(263deg, #fae6eb 0%, #ebecf5 100%);
            }
          }
        }

        .comment-date {
          margin-top: 8px;
          font-size: 11px;
          color: #9c9da5;
        }

        &:not(:first-child) {
          margin-top: 30px;
        }

        &.left {
          margin-right: auto;

          .user-info {
            span {
              margin-left: 8px;
            }
          }

          .comment-content {
            padding-left: 40px;

            .comment-body {
              &::before {
                left: 0;
                border-left: solid 12px #ebecf5;
                border-right: solid 12px transparent;
              }

              &::after {
                border-radius: 0 8px 8px;
              }
            }

            .comment-action-icon {
              margin-left: 15px;
              margin-right: 7px;
            }

            .comment-action-panel {
              right: 0;

              &::before {
                right: 8px;
              }
            }
          }

          .comment-date {
            padding-left: 40px;
          }
        }

        &.right {
          margin-left: auto;

          .user-info {
            justify-content: flex-end;

            img {
              order: 2;
            }

            span {
              margin-right: 1px;
            }
          }

          .comment-content {
            padding-right: 40px;

            .comment-body {
              order: 1;

              &::before {
                right: 0;
                border-left: solid 12px transparent;
                border-right: solid 12px #fae6eb;
              }

              &::after {
                border-radius: 8px 0 8px 8px;
              }
            }

            .comment-action-icon {
              margin-right: 15px;
              margin-left: 7px;
            }

            .comment-action-panel {
              left: 0;

              &::before {
                left: 8px;
              }
            }
          }

          .comment-date {
            text-align: right;
            padding-right: 40px;
          }
        }

        &:hover {
          .comment-content {
            .comment-action-icon {
              opacity: 1;
              pointer-events: unset;
            }
          }
        }
      }
    }

    .edit-message-modal {
      .modal-body {
        .message-content-edit-input {
          display: block;
          appearance: none;
          border-radius: 4px;
          border: 1px solid $light_gray_blue_3;
          background: $true_white;
          color: inherit;
          font-size: 15px;
          padding: 10px 15px;
          width: 100%;
          resize: none;

          &::placeholder {
            color: #9c9da5;
          }
        }

        .input-type {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: 15px;
          font-size: 15px;

          .checkbox-wrapper {
            margin-left: 10px;
          }
        }

        .message-content-edit-button {
          display: flex;
          justify-content: flex-end;
          margin-top: 15px;
          font-size: 15px;
          color: $pink;

          .button {
            cursor: pointer;

            & + .button {
              margin-left: 20px;
            }
          }
        }
      }

      & /deep/ .modal-content {
        flex-direction: column;
        padding: 30px;
      }

      & /deep/ .modal-header,
      & /deep/ .modal-footer {
        display: none;
      }
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.modal-enter {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.icon-cross-wrapper {
  position: absolute;
  top: 0;
  right: calc(-23px + -23px);
}

.icon-cross {
  cursor: pointer;
  width: 24px;
}

.romm-closed {
  height: 250px;
  text-align: center;
  justify-content: center;
  display: flex;
  align-items: center;
  font-size: 15px;
}
</style>
