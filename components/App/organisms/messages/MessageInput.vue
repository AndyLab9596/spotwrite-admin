<template>
  <div>
    <div class="message-input-container">
      <p v-if="errorMessage != ''" class="error-message">
        {{ errorMessage }}
      </p>
      <div
        v-if="preparedFilesForCurrentRoom.length"
        class="image__list file-list"
        :style="fileListStyle"
      >
        <div
          v-for="(file, index) in preparedFilesForCurrentRoom"
          :key="index"
          class="image__item"
        >
          <template>
            <div class="upload-file">
              <div class="upload-file-left">
                <div class="upload-file-icon">
                  <div class="border-1"></div>
                  <div class="border-2"></div>
                  <div class="border-3"></div>
                </div>
              </div>
              <div class="upload-file-right">
                <div class="upload-file-name">
                  <span>
                    {{ file.name }}
                  </span>
                </div>
              </div>
              <div class="image__delete" @click="onDeleteFileClicked(index)">
                <div class="delete-icon">
                  <span class="dli-close"></span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div v-if="preparedImagesForCurrentRoom.length" class="image__list">
        <div
          v-for="(image, index) in preparedImagesForCurrentRoom"
          :key="index"
          class="image__item"
        >
          <div class="image__thumbnail">
            <img :src="blobUrl(image)" class="upload-image" />
            <div class="image__delete" @click="onDeleteImageClicked(index)">
              <div class="delete-icon">
                <span class="dli-close"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="msg__contents__input">
        <label class="msg__contents__input--image">
          <input
            id="imageInput"
            ref="imageInput"
            type="file"
            accept="image/jpeg, image/png, image/heic, image/heic-sequence, image/heif, image/heif-sequence, image/gif"
            multiple
            @change="onFileChange($event)"
          />
          <img src="/app/icon/icon-camera.svg" alt />
        </label>
        <label class="msg__contents__input--file">
          <input
            id="fileInput"
            ref="fileInput"
            type="file"
            accept="txt"
            multiple
            @change="onFileChange($event)"
          />
          <img src="/app/icon/icon-document.svg" alt="" />
        </label>
        <ValidationProvider
          v-slot="name"
          rules="max:9000"
          name="メッセージ文字数"
          class="width100"
        >
          <Mentionable
            :keys="['@']"
            :items="roomUsers"
            offset="10"
            insert-space
            :limit="roomUsers.length"
            class="mentionable"
            @open="toggleMentionFlag(true)"
            @close="toggleMentionFlag(false)"
          >
            <textarea
              v-model="inputMessage"
              type="text"
              placeholder="コメントをしてみよう！"
              class="msg__contents__input--text width100"
              @keydown.prevent.enter.exact="onSubmit"
              @keydown.enter.shift="keyEnterShift"
            ></textarea>
            <template #no-result>
              <div class="dim">
                No result
              </div>
            </template>
            <template #item-@="{ item }">
              <div class="user">
                <img class="member-img" :src="item.user_icon" />
                {{ item.value }}
              </div>
            </template>
          </Mentionable>
          <div class="error">
            <span>{{ name.errors[0] }}</span>
          </div>
        </ValidationProvider>
        <div class="msg__contents__input--actions">
          <label class="msg__contents__input--emoji">
            <!-- TODO 絵文字実装 -->
            <img
              src="/app/icon/icon-emoji.svg"
              :class="{ disabled: $accessor.loading || isPosting }"
              @click="roger"
            />
          </label>
          <label class="msg__contents__input--send">
            <!-- <img
              v-if="
                !inputMessage &&
                  preparedFilesForCurrentRoom.length === 0 &&
                  preparedImagesForCurrentRoom.length === 0
              "
              src="@/assets/image/icon-like@2x.png"
              alt
              @click="roger"
            /> -->
            <img
              v-if="
                (!inputMessage &&
                  preparedFilesForCurrentRoom.length === 0 &&
                  preparedImagesForCurrentRoom.length === 0) ||
                  $accessor.loading ||
                  isPosting
              "
              src="/app/icon/icon-send.svg"
              class="msg-send"
            />
            <img
              v-else
              src="/app/icon/icon-send-pink.svg"
              class="msg-send--pink"
              @click="onSubmit"
            />
          </label>
        </div>
      </div>
    </div>
    <pick-up-image
      v-if="imageModal"
      :uploaded-image="propUploadedImage"
      @click="toggleImageModal"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ValidationProvider } from 'vee-validate';
import { getResizedImage, presignedPost } from '@/libs/message/message';
import { Mentionable } from 'vue-mention';

import {
  postImages,
  postFiles,
  messageText,
  messageRoger,
  rooms,
} from '../../../../libs/api/app';
import PickUpImage from '../modal/messages/PickUpImage.vue';

type FileForRoom = {
  roomUuid: String;
  file: File;
};

type FileListStyle = {
  'max-width': String;
};

export default Vue.extend({
  components: {
    PickUpImage,
    ValidationProvider,
    Mentionable,
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
    canNotPostNewRoomMessage: {
      type: Boolean,
      required: true,
    },
    files: {
      type: Array as PropType<File[]>,
      required: true,
    },
    hasNullIdMessage: {
      type: Boolean,
      required: true,
      default: false,
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
  },
  data() {
    return {
      inputMessage: '' as string,
      preparedImages: [] as FileForRoom[],
      preparedFiles: [] as FileForRoom[],
      uploadedImages: [] as Array<AppApiResponse.uploadImage>,
      uploadedFiles: [] as Array<AppApiResponse.uploadFile>,
      imageModal: false as boolean,
      propUploadedImage: '' as string,
      errorMessage: '' as string,
      isPosting: false as boolean,
      items: [],
      users: [
        {
          value: 'akryum',
          firstName: 'Guillaume',
        },
        {
          value: 'posva',
          firstName: 'Eduardo',
        },
        {
          value: 'atinux',
          firstName: 'Sébastien',
        },
      ],
      fileListStyle: {} as FileListStyle,
      mentionOpen: false as boolean,
    };
  },
  computed: {
    blobUrl() {
      return (file: File) => window.URL.createObjectURL(file);
    },
    preparedImagesForCurrentRoom(): File[] {
      return this.preparedImages
        .filter((n: FileForRoom) => {
          return this.currentRoom.room_uuid === n.roomUuid;
        })
        .map((n: FileForRoom) => {
          return n.file;
        });
    },
    preparedFilesForCurrentRoom(): File[] {
      return this.preparedFiles
        .filter((n: FileForRoom) => {
          return this.currentRoom.room_uuid === n.roomUuid;
        })
        .map((n: FileForRoom) => {
          return n.file;
        });
    },
    roomUsers(): { value: string; user_icon: string }[] {
      return this.activeRoomUsers.map((n: AppApiResponse.RoomUser) => {
        return {
          value: `${n.name} `,
          user_icon: n.user_icon,
        };
      });
    },
  },
  watch: {
    files(): void {
      const element: HTMLInputElement = this.$refs
        .imageInput as HTMLInputElement;
      element.value = '';
      const elementFile: HTMLInputElement = this.$refs
        .fileInput as HTMLInputElement;
      elementFile.value = '';

      if (this.files.length === 0) {
        return;
      }

      // ファイル数を取得
      const fileCount =
        this.preparedImagesForCurrentRoom.length +
        this.preparedFilesForCurrentRoom.length +
        this.files.length;

      // ファイル数上限バリデーション;
      if (
        this.files.length > Number(process.env.messageMaxImageFiles) ||
        fileCount > Number(process.env.messageMaxImageFiles)
      ) {
        this.errorMessage = `1度に${process.env.messageMaxImageFiles} 枚のファイルしか選択できません。`;
        return;
      }

      this.addFiles();
    },
    // エラーメッセージ3秒たったら消えるようにした
    errorMessage(newValue: string): void {
      if (!newValue) return;
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleFileListResize);
  },
  created() {
    this.handleFileListResize();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleFileListResize);
  },
  methods: {
    async createRoom() {
      try {
        const params = Array.from(new Set(this.newGroupEmployeeUuids));
        const { room_uuid } = (
          await rooms({
            user_uuids: params as string[],
          })
        ).data;
        this.currentRoom.room_uuid = room_uuid;
        await this.$emit('selectNewRoom', room_uuid);
        this.$accessor.message.setRoomUuid(room_uuid);
      } catch (e) {
        if (e.response != null && e.response.status === 422) {
          alert(e.response.data.errors.field[0]);
        }
      }
    },
    toggleImageModal(item: string = '') {
      if (!this.imageModal) {
        this.propUploadedImage = item;
      }
      this.imageModal = !this.imageModal;
    },
    filename(value: string) {
      if (!value) return '';
      const array = value.split('/');
      return array[array.length - 1];
    },
    async roger() {
      if (this.$accessor.loading) return;
      if (this.isPosting) return;
      this.isPosting = true;
      this.$accessor.setLoading(true);
      if (this.hasNullIdMessage) return;
      if (this.canNotPostNewRoomMessage) return;
      if (!this.currentRoom.room_uuid && !this.duplicateDmRoom.room_uuid) {
        await this.createRoom();
      }
      const m = {
        content: null,
        id: null,
        type: 'roger',
        user_info: {
          uuid: this.$accessor.userProfile.uuid,
          icon: this.$accessor.userProfile.icon,
          name: this.$accessor.userProfile.name,
        },
      };
      this.$emit('messageAdded', {
        message: m,
        room_uuid: this.$accessor.message.room_uuid,
      });
      try {
        const room_uuid = this.duplicateDmRoom.room_uuid
          ? this.duplicateDmRoom.room_uuid
          : this.currentRoom.room_uuid;
        await messageRoger({ room_uuid });
      } catch (e) {
        this.errorMessage = 'スタンプの送信に失敗しました。';
        this.$emit('messageFailure');
        if (e.response != null && e.response.status === 422) {
          this.$emit('messageAddedFail');
          alert(e.response.data.errors.message[0]);
        }
      }
      this.isPosting = false;
      this.$accessor.setLoading(false);
    },
    async postText(): Promise<void> {
      const message = this.inputMessage;
      this.inputMessage = '';
      if (message && message.match(/\S/g)) {
        if (!this.currentRoom.room_uuid && !this.duplicateDmRoom.room_uuid) {
          await this.createRoom();
        }
        const roomUuid = this.currentRoom.room_uuid
          ? this.currentRoom.room_uuid
          : this.duplicateDmRoom.room_uuid;
        const m = {
          content: message,
          id: null,
          type: 'text',
          user_info: {
            uuid: this.$accessor.userProfile.uuid,
            icon: this.$accessor.userProfile.icon,
            name: this.$accessor.userProfile.name,
          },
        };
        this.$emit('messageAdded', {
          message: m,
          room_uuid: roomUuid,
        });
        try {
          messageText({
            message,
            room_uuid: roomUuid,
          });
          this.$accessor.message.setRoomUuid(roomUuid);
        } catch (e) {
          this.errorMessage = 'メッセージ送信に失敗しました。';
          this.$emit('messageFailure');
          if (e.response != null && e.response.status === 422) {
            this.$emit('messageAddedFail');
            alert(e.response.data.errors.message[0]);
          }
        }
      }
    },
    preparedFilesAndImagesRoomUuidChange(): void {
      if (
        this.preparedImages.some(
          (preparedImage: FileForRoom) => !preparedImage.roomUuid
        )
      ) {
        this.preparedImages = this.preparedImages
          .filter((preparedImage: FileForRoom) => !preparedImage.roomUuid)
          .map((preparedImage: FileForRoom) => {
            return {
              roomUuid: this.currentRoom.room_uuid,
              file: preparedImage.file,
            };
          });
      }
      if (
        this.preparedFiles.some(
          (preparedFile: FileForRoom) => !preparedFile.roomUuid
        )
      ) {
        this.preparedFiles = this.preparedFiles
          .filter((preparedFile: FileForRoom) => !preparedFile.roomUuid)
          .map((preparedFile: FileForRoom) => {
            return {
              roomUuid: this.currentRoom.room_uuid,
              file: preparedFile.file,
            };
          });
      }
    },
    async postImages() {
      if (this.preparedImagesForCurrentRoom.length === 0) return;
      if (!this.currentRoom.room_uuid && !this.duplicateDmRoom.room_uuid) {
        await this.createRoom();
        // 新規ルーム作成で画像/添付ファイルを送信する際にroomUuidの変換が必要なため
        this.preparedFilesAndImagesRoomUuidChange();
      }

      // メッセージウィンドウにアップロード中UIを表示するため先にイベントを emit
      const imageUrls: string[] = [];
      const m = {
        content: imageUrls,
        id: null,
        type: 'images',
        user_info: {
          uuid: this.$accessor.userProfile.uuid,
          icon: this.$accessor.userProfile.icon,
          name: this.$accessor.userProfile.name,
        },
      };
      this.$emit('messageAdded', {
        message: m,
        room_uuid: this.currentRoom.room_uuid,
      });

      try {
        // 同時に複数アップロード
        const uploadPromises = [];
        for (let i = 0; i < this.preparedImagesForCurrentRoom.length; i += 1) {
          uploadPromises.push(
            presignedPost(this.preparedImagesForCurrentRoom[i], false)
          );
        }
        this.clearImages();
        const fileUrls = await Promise.all(uploadPromises);
        this.uploadedImages = fileUrls.map((fileUrl: string) => {
          return {
            thumbnail: `${fileUrl}_s`,
            main_image: fileUrl,
          };
        });

        // 全ての画像がリサイズされるのを待つ
        const getImagePromises = [];
        for (let i = 0; i < this.uploadedImages.length; i += 1) {
          getImagePromises.push(
            getResizedImage(this.uploadedImages[i].thumbnail)
          );
          getImagePromises.push(
            getResizedImage(this.uploadedImages[i].main_image)
          );
        }
        await Promise.all(getImagePromises);
        const room_uuid = this.duplicateDmRoom.room_uuid
          ? this.duplicateDmRoom.room_uuid
          : this.currentRoom.room_uuid;
        postImages({
          room_uuid,
          images: this.uploadedImages,
        });
        this.uploadedImages = [];
      } catch (e) {
        if (e.response != null && e.response.status === 422) {
          alert(e.response.data.errors.images[0]);
        } else if (e.response?.data?.message === 'exceeded max storage.') {
          alert(
            '契約している利用容量をオーバーします。アップロードを続けるためにはプラン変更で利用容量を増やす必要があります。管理者にお問い合わせ下さい。'
          );
        }
        // TODO: メッセージは仮
        this.errorMessage =
          '画像投稿に失敗しました。お手数ですが再度お試しください。';
        this.$emit('messageFailure');
        this.uploadedImages = [];
        throw e;
      }
    },
    async postFiles() {
      if (this.preparedFilesForCurrentRoom.length === 0) return;
      if (!this.currentRoom.room_uuid && !this.duplicateDmRoom.room_uuid) {
        await this.createRoom();
        // 新規ルーム作成で画像/添付ファイルを送信する際にroomUuidの変換が必要なため
        this.preparedFilesAndImagesRoomUuidChange();
      }

      // メッセージウィンドウにアップロード中UIを表示するため先にイベントを emit
      const imageUrls: string[] = [];
      const m = {
        content: imageUrls,
        id: null,
        type: 'files',
        user_info: {
          uuid: this.$accessor.userProfile.uuid,
          icon: this.$accessor.userProfile.icon,
          name: this.$accessor.userProfile.name,
        },
      };
      this.$emit('messageAdded', {
        message: m,
        room_uuid: this.currentRoom.room_uuid,
      });

      try {
        const room_uuid = this.duplicateDmRoom.room_uuid
          ? this.duplicateDmRoom.room_uuid
          : this.currentRoom.room_uuid;
        // 同時に複数アップロード
        const uploadPromises = [];
        for (let i = 0; i < this.preparedFilesForCurrentRoom.length; i += 1) {
          uploadPromises.push(
            presignedPost(this.preparedFilesForCurrentRoom[i], true)
          );
        }
        this.clearFiles();
        const fileUrls = await Promise.all(uploadPromises);
        this.uploadedFiles = fileUrls.map((fileUrl: string) => {
          return { file_url: fileUrl };
        });

        // 全てのファイルが public に移動されるのを待つ
        const getFilePromises = [];
        for (let i = 0; i < this.uploadedFiles.length; i += 1) {
          getFilePromises.push(getResizedImage(this.uploadedFiles[i].file_url));
        }
        await Promise.all(getFilePromises);
        postFiles({
          room_uuid,
          files: fileUrls,
        });
        this.uploadedFiles = [];
      } catch (e) {
        if (e.response != null && e.response.status === 422) {
          alert(e.response.data.errors.files[0]);
        } else if (e.response?.data?.message === 'exceeded max storage.') {
          alert(
            '契約している利用容量をオーバーします。アップロードを続けるためにはプラン変更で利用容量を増やす必要があります。管理者にお問い合わせ下さい。'
          );
        }
        // TODO: メッセージは仮
        this.errorMessage =
          'ファイル投稿に失敗しました。お手数ですが再度お試しください。';
        this.$emit('messageFailure');
        this.uploadedFiles = [];
        throw e;
      }
    },
    async addFiles() {
      this.files.map(async (file: File) => {
        if (this.isFileTypeImage(file)) {
          this.preparedImages.push({
            roomUuid: this.currentRoom.room_uuid,
            file,
          });
        } else {
          // zipファイルは送信できない
          if (file.type === 'application/zip') {
            this.errorMessage = `zipファイルは選択できません。`;
            return;
          }
          this.preparedFiles.push({
            roomUuid: this.currentRoom.room_uuid,
            file,
          });
        }
      });
    },
    isFileTypeImage(file: File): boolean {
      return (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/heic' ||
        file.type === 'image/heic-sequence' ||
        file.type === 'image/heif' ||
        file.type === 'image/heif-sequence' ||
        file.type === 'image/gif'
      );
    },
    clearFiles() {
      this.preparedFiles = this.preparedFiles.filter((n: FileForRoom) => {
        return this.currentRoom.room_uuid !== n.roomUuid;
      });
    },
    clearImages() {
      this.preparedImages = this.preparedImages.filter((n: FileForRoom) => {
        return this.currentRoom.room_uuid !== n.roomUuid;
      });
    },
    /** handlers */
    onFileChange(event: Event): void {
      this.$emit('fileChange', event);
    },
    onDeleteFileClicked(index: number) {
      this.preparedFiles.splice(index, 1);
    },
    onDeleteImageClicked(index: number) {
      this.preparedImages.splice(index, 1);
    },
    keyEnterShift() {
      if (this.$accessor.loading) return;
      this.inputMessage += '\n';
    },
    async onSubmit(event: any) {
      // 日本語入力中のEnterキー操作は無視する
      if (event.type === 'keydown' && event.keyCode !== 13) return;

      if (this.mentionOpen) return;

      if (this.hasNullIdMessage) {
        this.$emit('retryGetAllMessages');
      }
      if (this.$accessor.loading) return;
      // 投稿中の場合return
      if (this.isPosting) return;
      this.isPosting = true;
      this.inputMessage = this.inputMessage.trim();
      if (
        !this.inputMessage &&
        this.preparedFiles.length === 0 &&
        this.preparedImages.length === 0
      ) {
        this.isPosting = false;
        return;
      }
      // 文字数の上限値が9000のため
      if (this.inputMessage.length > 9000) {
        this.isPosting = false;
        return;
      }

      event.preventDefault();

      if (this.canNotPostNewRoomMessage) {
        this.isPosting = false;
        return;
      }
      try {
        this.postText();
        if (this.preparedImages.length !== 0) {
          await this.postImages();
        }
        if (this.preparedFiles.length !== 0) {
          await this.postFiles();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isPosting = false;
      }
    },
    handleFileListResize(): void {
      const windowWidth = window.innerWidth;
      const menuWidth = document.getElementsByClassName(
        'side-navigation-container'
      )[0]?.offsetWidth;
      const roomListWidth = document.getElementsByClassName('left-contents')[0]
        ?.offsetWidth;
      const iconListWidth = document.getElementsByClassName(
        'right-side-navigation-wrap'
      )[0]?.offsetWidth;
      this.fileListStyle = {
        'max-width': `${windowWidth -
          130 -
          (menuWidth + roomListWidth + iconListWidth)}px`,
      };
    },
    toggleMentionFlag(status: boolean) {
      this.mentionOpen = status;
    },
  },
});
</script>

<style lang="scss" scoped>
.message-input-container {
  width: 100%;
  padding: 14px 17px;
  background-color: $background_color;
}

.height-attached-file {
  height: 170px;
}

.msg {
  &__contents {
    &__input {
      position: relative;
      flex-direction: row;
      display: flex;
      align-items: center;
      width: 100%;
    }

    &__input--image {
      display: flex;
      cursor: pointer;
      margin: 0 16px 0 0;

      input {
        position: absolute;
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        z-index: -1;
      }
    }

    &__input--file {
      display: flex;
      cursor: pointer;
      margin: 0 20px 0 0;

      input {
        position: absolute;
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        z-index: -1;
      }
    }

    &__input--text {
      font-family: 'Hiragino Kaku Gothic Pro', sans-serif;
      flex-grow: 1;
      height: 52px;
      font-size: 15px;
      line-height: 15px;
      padding: 18px 90px 18px 20px;
      border: none;
      border-radius: 4px;
      background: $true_white;
      resize: none;
    }

    &__input--actions {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
    }

    &__input--emoji,
    &__input--send {
      display: flex;
      cursor: pointer;

      &.disabled {
        opacity: 0.5;
        pointer-events: none;
      }
    }

    &__input--emoji > img {
      width: 16px;
      height: 16px;
      margin: 0 16px 0 0;
    }
  }
}

.msg-send {
  width: 16px;
  height: 16px;
}

.msg-send--pink {
  width: 32px;
  height: 32px;
}

.mentionable {
  display: flex;

  /deep/ .v-popover {
    visibility: hidden;
  }
}

.image {
  &__list {
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      height: 4px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: #7e8195;
    }
  }

  &__item {
    flex-direction: row;
    display: flex;
    align-items: center;
    padding-right: 6px;
    height: 80px;
  }

  &__thumbnail {
    width: 100px;
    position: relative;

    img {
      width: 100%;
    }
  }

  &__delete {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 14px;
    color: white;
    cursor: pointer;
    margin-right: 3px;
  }
}

.upload-file {
  display: flex;
  position: relative;
  border-radius: 10px;
  height: 55px;
  border: 1px solid #ccc;
  width: 270px;
}

.upload-file-left {
  width: 20%;
  border-right: 1px solid #ccc;
  background-color: rgb(0, 132, 255);
  border-radius: 10px 0 0 10px;
  align-items: center;
  justify-content: center;
  display: flex;
}

.upload-file-right {
  width: 80%;
  background-color: white;
  border-radius: 0 10px 10px 0;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding-left: 2%;
  flex: 1;
  word-wrap: break-word;
  min-width: 40%;
}

.upload-file-name {
  font-size: 10px;
}

.upload-file-icon {
  background-color: white;
  height: 60%;
  width: 50%;
  border-radius: 10%;
  padding-top: 5%;
  padding-right: 10%;
  padding-left: 10%;
}

.upload-image {
  border-radius: 10px;
  height: 80px;
  object-fit: cover;
}

.border-1 {
  height: 20%;
  border-bottom: 1px solid rgb(0, 132, 255);
}

.border-2 {
  height: 20%;
  border-bottom: 1px solid rgb(0, 132, 255);
}

.border-3 {
  height: 20%;
  width: 50%;
  border-bottom: 1px solid rgb(0, 132, 255);
}

.delete-icon {
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 50%;
  background-color: gray;
  height: 20px;
  width: 20px;
  padding-left: 3px;
  margin-top: 3px;
}

.dli-close {
  display: inline-block;
  vertical-align: middle;
  color: white;
  line-height: 1;
  width: 1em;
  height: 0.1em;
  background: currentColor;
  border-radius: 0.1em;
  position: relative;
  transform: rotate(45deg);
}

.dli-close::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  border-radius: inherit;
  transform: rotate(90deg);
}

.error-message {
  font-size: 12px;
  color: #f03d25;
  margin-bottom: 10px;
}

.error {
  color: red;
}

.width100 {
  width: 100%;
}

.resizeNone {
  resize: none;
}

.member-img {
  width: 20px;
  height: 20px;
  object-fit: cover;
  margin-right: 5px;
  border-radius: 50%;
}

.file-list {
  min-width: 276px;
}
</style>
