<template>
  <div class="interview-message-container">
    <BaseButton
      class="message-content-back-button"
      greyed
      @click="$emit('submit')"
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
    <div id="message-list-item" class="message-content-body">
      <template v-for="(content, index) in interviewMessageRoomContents">
        <div
          v-if="content.content_type === 'heading'"
          :key="index"
          class="heading"
        >
          {{ content.body }}
          <img
            src="/app/icon/icon-dots-circle.svg"
            class="heading-action-icon"
            @click="showActionPanel = index"
          />
          <div
            class="heading-action-panel"
            :class="{ shown: index === showActionPanel }"
          >
            <div class="action-item" @click="onEditMessage(index)">
              テキストを編集
            </div>
            <div class="action-item" @click="onDeleteMessage(index)">
              削除する
            </div>
            <div class="action-item" @click="onChangeMessageType(index)">
              発言にする
            </div>
          </div>
        </div>
        <div v-else :key="index" :class="`comment ${content.comment_position}`">
          <div class="user-info">
            <img :src="content.user_icon" />
            <span
              >{{ content.user_name }}（{{ content.organization_name }}）</span
            >
          </div>
          <div :class="`comment-content ${content.comment_position}`">
            <div class="comment-body">
              <span>{{ content.body }}</span>
            </div>
            <img
              src="/app/icon/icon-dots-circle.svg"
              class="comment-action-icon"
              @click="showActionPanel = index"
            />
            <div
              class="comment-action-panel"
              :class="{ shown: index === showActionPanel }"
            >
              <div class="action-item edit" @click="onEditMessage(index)">
                テキストを編集
              </div>
              <div class="action-item delete" @click="onDeleteMessage(index)">
                削除する
              </div>
              <div class="action-item" @click="onChangeMessageType(index)">
                見出しにする
              </div>
            </div>
          </div>
          <div class="comment-date">{{ dateFormat(content.created_at) }}</div>
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
      <div class="input-type">
        見出しに設定する
        <BaseCheckbox v-model="input.is_heading" value="true" />
      </div>
      <img src="/app/icon/icon-send.svg" class="message-send-icon" disabled />
      <img
        src="/app/icon/icon-send-pink.svg"
        class="message-send-icon"
        :class="{ disabled: !input.message }"
        @click="onSendMessage"
      />
    </div>
    <div
      class="message-content-member"
      :class="{ shown: showMemberList, userPage: !isAdmin }"
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
            <div class="item-box">{{ member.organization_name }}</div>
          </div>
        </div>
      </div>
    </div>
    <Modal
      v-if="editIndex > -1"
      class="edit-message-modal"
      @close="editIndex = -1"
    >
      <div class="modal-body">
        <textarea
          v-model="editInput.message"
          class="message-content-edit-input"
          placeholder="コメントをしてみよう！"
          rows="5"
        ></textarea>
        <div class="input-type">
          見出しに設定する
          <BaseCheckbox v-model="editInput.is_heading" value="true" />
        </div>
        <div class="message-content-edit-button">
          <span class="button" @click="editIndex = -1">CLOSE</span>
          <span class="button" @click="onSubmitEditMessage">OK</span>
        </div>
      </div>
      <div class="modal-footer">
        Footer
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from '@/libs/dayjs';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import Modal from '@/components/App/atoms/modals/Modal.vue';

export default Vue.extend({
  components: {
    BaseButton,
    BaseCheckbox,
    Modal,
  },
  props: {
    selectedInterviewees: {
      type: Array as PropType<Employee[]>,
      required: true,
    },
    interviewMessageRoomContents: {
      type: Array as AppApiRequest.StoreInterviewItem[],
      required: true,
    },
    roomId: {
      type: Number,
      required: true,
    },
    showInterviewRoom: {
      type: Boolean,
      required: false,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    showMemberList: false as boolean,
    showActionPanel: -1 as number,
    input: {
      message: '' as string,
      is_heading: [] as boolean[],
    },
    editIndex: -1 as number,
    editInput: {
      message: '' as string,
      is_heading: [] as boolean[],
    },
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
      }, 200);
    },
    showInterviewRoom(value: boolean) {
      if (value) {
        setTimeout(() => {
          this.scrollEnd();
        }, 200);
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.infiniteHandler);
    setTimeout(() => {
      this.scrollEnd();
    }, 200);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.infiniteHandler);
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
      const container = this.$el.querySelector('#message-list-item');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    onSendMessage(): void {
      if (this.flagSending) {
        return;
      }
      this.flagSending = true;
      const author = this.$props.selectedInterviewees.find(
        (u: any) => u.user_uuid === this.$accessor.userProfile.uuid
      );
      const authorCommentPosition = author ? author.comment_position : 'left';
      this.$emit('sendMessage', {
        content_type: this.input.is_heading.length ? 'heading' : 'comment',
        body: this.input.message,
        interviewee_uuid: this.$accessor.userProfile.uuid,
        comment_position: authorCommentPosition,
        user_icon: this.$accessor.userProfile.user_icon,
        user_name: this.$accessor.userProfile.name,
        organization_name: this.$accessor.userProfile.organization_name,
        created_at: dayjs().unix(),
      });
      this.flagSending = false;
      this.input = {
        message: '',
        is_heading: [],
      };
    },
    onEditMessage(index: number): void {
      this.showActionPanel = -1;
      this.editIndex = index;
      const { body, content_type } = this.interviewMessageRoomContents[index];
      this.editInput = {
        message: body.trim(),
        is_heading: content_type === 'heading' ? ['true'] : [],
      };
    },
    onSubmitEditMessage(): void {
      this.$emit('editMessage', this.editIndex, {
        content_type: this.editInput.is_heading.length ? 'heading' : 'comment',
        body: this.editInput.message,
      });
      this.editIndex = -1;
      this.editInput = {
        message: '',
        is_heading: [],
      };
    },
    onDeleteMessage(index: number): void {
      this.showActionPanel = -1;
      this.$emit('deleteMessage', index);
    },
    onChangeMessageType(index: number): void {
      this.showActionPanel = -1;
      this.$emit('changeMessageType', index);
    },
    infiniteHandler({ path }: object) {
      if (
        this.showMemberList &&
        path.findIndex(
          (target: object) =>
            target.matches && target.matches('.member-list-toggle')
        ) === -1 &&
        path.findIndex(
          (target: object) =>
            target.matches && target.matches('.message-content-member')
        ) === -1
      ) {
        this.showMemberList = false;
      }
      if (
        this.showActionPanel > -1 &&
        path.findIndex(
          (target: object) =>
            target.matches && target.matches('.heading-action-icon')
        ) === -1 &&
        path.findIndex(
          (target: object) =>
            target.matches && target.matches('.heading-action-panel')
        ) === -1 &&
        path.findIndex(
          (target: object) =>
            target.matches && target.matches('.comment-action-icon')
        ) === -1 &&
        path.findIndex(
          (target: object) =>
            target.matches && target.matches('.comment-action-panel')
        ) === -1
      ) {
        this.showActionPanel = -1;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
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
    box-shadow: 1px 0 2px #dce5ef;
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
      padding-right: 50px;
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
    position: fixed;
    height: calc(100vh - 66px);

    &.userPage {
      position: absolute;
      height: 100%;
    }

    top: 0;
    right: 0;
    width: 392px;
    background: $true_white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
    padding: 62px 24px 15px;
    text-align: center;
    display: none;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 500ms;
    z-index: 3;

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
          width: 32px;
          height: 32px;
          object-fit: cover;
          margin-right: 5px;
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
      z-index: 3;
      display: block;
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

      .heading-action-icon {
        position: absolute;
        top: 97%;
        right: 7px;
        transform: translateY(-50%);
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
      }

      .heading-action-panel {
        position: absolute;
        top: calc(100% + 20px);
        right: 0;
        width: 132px;
        font-size: 13px;
        border-radius: 6px;
        color: $true_white;
        background: #979aaa;
        z-index: 3;
        opacity: 0;
        pointer-events: none;

        .action-item {
          padding: 0 15px;
          height: 40px;
          line-height: 40px;
          cursor: pointer;
          box-sizing: content-box;
          white-space: initial;

          &:hover {
            background: #7e8195;
          }

          & + .action-item {
            border-top: solid 1px $true_white;
          }
        }

        &.shown {
          opacity: 1;
          pointer-events: unset;
        }

        &::before,
        &::after {
          content: '';
          position: absolute;
        }

        &::before {
          right: 8px;
          bottom: 100%;
          border-right: solid 7px transparent;
          border-bottom: solid 10px #979aaa;
          border-left: solid 7px transparent;
        }

        &::after {
          top: -20px;
          right: 0;
          left: 0;
          height: 20px;
        }
      }

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
          flex-direction: row;
          float: right;
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

        .comment-action-icon {
          margin-bottom: 5px;
          cursor: pointer;
          opacity: 0;
          pointer-events: none;
        }

        .comment-action-panel {
          position: absolute;
          top: calc(100% + 17px);
          width: 132px;
          font-size: 13px;
          border-radius: 6px;
          color: $true_white;
          background: #979aaa;
          z-index: 3;
          opacity: 0;
          pointer-events: none;

          .action-item {
            padding: 0 15px;
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            box-sizing: content-box;
            transition: background 500ms;

            &:hover {
              background: #7e8195;
            }

            & + .action-item {
              border-top: solid 1px $true_white;
            }
          }

          &.shown {
            opacity: 1;
            pointer-events: unset;
          }

          &::before {
            content: '';
            position: absolute;
            bottom: 100%;
            border-right: solid 7px transparent;
            border-bottom: solid 10px #979aaa;
            border-left: solid 7px transparent;
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
</style>
