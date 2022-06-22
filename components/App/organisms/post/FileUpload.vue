<template>
  <div
    class="image-drop-box-container"
    :class="{ 'drop-area-over_entered': dragEntered }"
    @dragenter="dragEnter"
    @dragleave="dragLeave"
    @dragover.prevent
    @drop.prevent="dropFile"
  >
    <div
      v-if="uploadedFiles.length === 0"
      class="empty-container"
      @click="onClick"
    >
      <img class="icon" src="/app/icon/plus_circle.svg" alt="ファイル追加" />
      <div class="caption">
        <img class="icon" src="/app/icon/camera.svg" />
        <img v-if="canUploadVideo" class="icon" src="/app/icon/video.svg" />
        <span v-if="canUploadVideo">写真・動画を追加</span>
        <span v-if="!canUploadVideo">写真を追加</span>
      </div>
    </div>
    <div v-else class="files-container">
      <draggable
        :list="uploadedFiles"
        :animation="200"
        tag="ul"
        handle=".sortable"
        class="uploaded-files"
      >
        <li
          v-for="(file, i) in uploadedFiles"
          :key="`file_${i}`"
          class="sortable"
        >
          <div class="image-container">
            <template v-if="file.type === 'video'">
              <video
                :src="file.main_image"
                autoplay
                loop
                muted
                width="180"
                height="180"
              />
            </template>
            <template v-else-if="file.type === 'image'">
              <img :src="file.thumbnail" />
            </template>
            <template v-else>
              <img :src="file.thumbnail" class="loading" />
            </template>
            <div class="close">
              <img
                src="/app/icon/cross_circle.svg"
                @click="onCloseIconClick(i)"
              />
            </div>
          </div>
        </li>
      </draggable>
      <div class="add-more-box" @click="onClick">
        <img class="icon" src="/app/icon/plus_circle.svg" alt="ファイル追加" />
        <span>もっと追加</span>
      </div>
    </div>
    <input
      v-if="canUploadVideo"
      ref="inputFile"
      type="file"
      class="hidden"
      multiple
      @change="onFileChange"
    />
    <input
      v-if="!canUploadVideo"
      ref="inputFile"
      type="file"
      class="hidden"
      multiple
      accept="image/*"
      @change="onFileChange"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import draggable from 'vuedraggable';
import { getResizedImage, uploadToS3 } from '@/libs/message/message';
import { getS3PresignedPostData } from '@/libs/api/app';

type UploadImage = AppApiResponse.uploadImage;

export default Vue.extend({
  components: {
    draggable,
  },
  props: {
    editFileUrls: {
      type: Array as PropType<AppApiResponse.uploadImage[]>,
      required: false,
      default: () => [],
    },
    internalCommunicationTemplate: {
      type: String,
      required: false,
      default: 'none',
    },
  },
  data: () => ({
    uploadedFiles: [] as UploadImage[],
    dragEntered: false as boolean,
    acceptVideo: ['video/mp4'] as string[],
  }),
  computed: {
    canUploadVideo() {
      return this.$props.internalCommunicationTemplate === 'none';
    },
  },
  watch: {
    editFileUrls() {
      this.uploadedFiles =
        typeof this.$props.editFileUrls === 'object'
          ? Object.values(this.$props.editFileUrls)
          : this.$props.editFileUrls;
    },
    uploadedFiles(uploadedFiles: UploadImage[]) {
      const noLoadingFiles = uploadedFiles.filter(
        (file: UploadImage) => file.type !== 'loading'
      );
      this.$emit('changeSort', noLoadingFiles);
      const isLoadingFile = uploadedFiles.filter(
        (file: UploadImage) => file.type === 'loading'
      ).length;
      this.$emit('changeIsLoadingFile', !!isLoadingFile);
    },
    internalCommunicationTemplate() {
      const fileUploaded = this.uploadedFiles;
      if (this.$props.internalCommunicationTemplate !== 'none') {
        this.uploadedFiles = fileUploaded.filter(
          (file: UploadImage) => file.type !== 'video'
        );
      }
    },
  },
  created() {
    if (this.$props.editFileUrls) {
      this.uploadedFiles =
        typeof this.$props.editFileUrls === 'object'
          ? Object.values(this.$props.editFileUrls)
          : this.$props.editFileUrls;
    }
  },
  methods: {
    onClick(): void {
      (this.$refs.inputFile as HTMLInputElement).click();
    },
    onCloseIconClick(i: number): void {
      if (this.uploadedFiles[i].type === 'video') {
        this.$emit('removeVideo', this.uploadedFiles[i].main_image);
      } else {
        this.$emit('removeFile', this.uploadedFiles[i].main_image);
      }
      this.uploadedFiles.splice(i, 1);
    },
    async onFileChange(event: Event): Promise<void> {
      const { files } = event.target as HTMLInputElement;
      if (!files || files[0] === undefined) {
        return;
      }
      const errorList = [];
      const progressIndex = this.uploadedFiles.length;
      for (let i = 0; i < files.length; i += 1) {
        if (!this.canUploadVideo && files[i].type.startsWith('video/')) {
          return;
        }
        if (
          files[i].type.startsWith('image/') ||
          this.acceptVideo.includes(files[i].type)
        ) {
          this.uploadedFiles.push({
            thumbnail: `/app/icon/loading.gif`,
            main_image: `/app/icon/loading.gif`,
            type: 'loading',
          });
          this.fileUpload([files[i]], progressIndex + i);
        } else {
          errorList.push(files[i].name);
        }
      }
      (this.$refs.inputFile as HTMLInputElement).value = '';
      if (errorList.length > 0) {
        alert('アップロードできないファイルがありました');
      }
    },
    dragEnter() {
      this.dragEntered = true;
    },
    dragLeave() {
      this.dragEntered = false;
    },
    async dropFile(e: any) {
      const { files } = e.dataTransfer;
      this.dragEntered = false;
      if (!files || files[0] === undefined) {
        return;
      }
      const errorList = [];
      const progressIndex = this.uploadedFiles.length;
      for (let i = 0; i < files.length; i += 1) {
        if (!this.canUploadVideo && files[i].type.startsWith('video/')) {
          return;
        }
        if (
          files[i].type.startsWith('image/') ||
          this.acceptVideo.includes(files[i].type)
        ) {
          this.uploadedFiles.push({
            thumbnail: `/icon/loading.gif`,
            main_image: `/icon/loading.gif`,
            type: 'loading',
          });
          this.fileUpload([files[i]], progressIndex + i);
        } else {
          errorList.push(files[i].name);
        }
      }
      if (errorList.length > 0) {
        alert('アップロードできないファイルがありました');
      }
    },
    async fileUpload(files: FileList, index: number) {
      try {
        if (!this.canUploadVideo && this.acceptVideo.includes(files[0].type)) {
          return;
        }
        const { data } = await getS3PresignedPostData();
        const key = data.form_inputs.key.replace(/^uploads\//g, 'public/');

        // 動画の場合（現状はMP4のみ許容する）
        if (this.acceptVideo.includes(files[0].type)) {
          const uploadedFile = {
            thumbnail: `${data.form_attributes.action}/${key}`,
            main_image: `${data.form_attributes.action}/${key}`,
            type: 'video',
          };
          await uploadToS3(files[0], data);

          // MP4でなければ変換する
          await getResizedImage(uploadedFile.main_image);

          this.uploadedFiles.splice(index, 1, uploadedFile);

          // 動画以外の場合
        } else {
          const uploadedFile = {
            thumbnail: `${data.form_attributes.action}/${key}_s`,
            main_image: `${data.form_attributes.action}/${key}`,
            type: 'image',
          };

          await uploadToS3(files[0], data);

          // 全ての画像がリサイズされるのを待つ
          await getResizedImage(uploadedFile.thumbnail);
          await getResizedImage(uploadedFile.main_image);

          this.uploadedFiles.splice(index, 1, uploadedFile);
        }
      } catch (e) {
        if (e.response?.data?.message === 'exceeded max storage.') {
          alert(
            '契約している利用容量をオーバーします。アップロードを続けるためにはプラン変更で利用容量を増やす必要があります。管理者にお問い合わせ下さい。'
          );
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.empty-container {
  display: flex;
  padding: 56px 0;
  background-color: $white_1;
  border: 1px solid $ruled_line;
  border-radius: 4px;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.files-container {
  display: flex;
  justify-content: space-between;

  .uploaded-files {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    max-width: 616px;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: #7e8195 white;

    li:not(:last-child) {
      margin-right: 8px;
    }

    &::-webkit-scrollbar {
      width: 0;
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: #7e8195;
    }
  }

  .image-container {
    position: relative;
    width: 180px;
    height: 180px;
    border: 1px solid $true_white;
    border-radius: 4px;

    > img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 4px;
    }

    > img.loading {
      width: 40px;
      margin: 0 auto;
    }

    .close {
      position: absolute;
      width: 16px;
      height: 16px;
      right: 8px;
      top: 8px;
      cursor: pointer;

      > img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

  .add-more-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 200px;
    padding: 0 20px;
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
  }
}

.hidden {
  display: none;
}

.caption {
  margin-top: 14px;
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;

  .icon {
    margin-right: 8px;
  }
}

.image-drop-box-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: $extra_light_gray;
  border: dotted 1px $light_gray_blue_3;
  border-radius: 6px;
  color: $gray_blue_4;
  width: 100%;
}

.description {
  font-size: 15px;
  margin-top: 4px;
}

.description-small {
  font-size: 13px;
  margin-top: 4px;
}

.upload-image-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 30px;
  font-size: 13px;
  background-color: $gray_blue_3;
  border-radius: 6px;
  cursor: pointer;
  z-index: 1;
  color: $true_white;
  font-weight: bold;
  margin-top: 8px;
}

.drop-area-over {
  position: absolute;
  width: 100%;
  height: 120px;
  background-color: $true_white;
  opacity: 0;

  &_entered {
    opacity: 0.5;
  }
}
</style>
