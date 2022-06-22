<template>
  <div>
    <div class="filemove-container" @click.self="onClose">
      <div class="filemove">
        <header>
          <h3 class="filemove__title">移動先のフォルダーを選択</h3>
          <div class="breadcrumb-container">
            <div class="breadcrumb-image">
              <img
                src="/icon/icon-inner-folder.svg"
                class="breadcrumb-item"
                @click="resetPath($event)"
              />
            </div>
            <span class="caret"></span>
            <a
              v-for="item in moveModalInBreadcrumb"
              :key="item.index"
              class="breadcrumb-item"
              @click.prevent="breadcrumbNavigation($event)"
            >
              {{ item }}
            </a>
          </div>
        </header>
        <div v-if="!isLoading">
          <div v-if="directoriesOnly.length > 0" class="filelist">
            <div
              v-for="file in directoriesOnly"
              :key="file.name"
              class="filelist__file"
              :class="{
                'filelist__file--selected': addSelectClass(file.name),
              }"
              @click="selectFile(file.name)"
            >
              <file-icon :file-type="file.type" />
              <span v-if="file.name === ''" class="input-container">
                <input
                  v-model="newDirectoryName"
                  type="text"
                  label="フォルダー名"
                  name="フォルダー名"
                  class="input"
                  placeholder="新しいフォルダー"
                  :class="{ 'input-error': newDirectoryName === '' }"
                  @keyup.enter="$emit('folder-create', newDirectoryName)"
                  @blur="setDefaultNameInput"
                />
              </span>
              <span v-else class="filelist__file-name">{{ file.name }}</span>
              <img
                class="filelist__caret"
                src="/icon/icon-arrow_right_grey.svg"
                @click="fileNavigation(file)"
              />
            </div>
          </div>
          <div class="file-actions">
            <contained-button-with-icon
              src="/icon/icon_plus_pink.svg"
              inverse
              @click="handleCreateDirectory"
              >フォルダーを作成</contained-button-with-icon
            >
            <div class="file-buttons">
              <base-button size="large" @click="move">移動する</base-button>
              <base-button size="large" inverse @click="onClose"
                >キャンセル</base-button
              >
            </div>
          </div>
        </div>
        <vue-loading
          v-if="isLoading"
          type="spin"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import ContainedButtonWithIcon from '@/components/Admin/Modules/Button/ContainedButtonWithIcon.vue';
import FileIcon from '@/components/Admin/Pages/CompanyFile/FileIcon.vue';
import dayjs from '@/libs/dayjs';
import { VueLoading } from 'vue-loading-template';
import { fetchFiles, createDirectory } from '@/libs/api';

type FileType = 'files' | 'directory';

export default Vue.extend({
  components: {
    BaseButton,
    ContainedButtonWithIcon,
    FileIcon,
    VueLoading,
  },
  props: {
    fileList: {
      type: Array as PropType<ApiResponse.File[]>,
      default: () => [],
    },
    directory: {
      type: Array as PropType<ApiResponse.File[]>,
      default: () => [],
    },
    breadcrumb: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    currentCompanyUuid: {
      type: String,
      required: true,
    },
    currentPath: {
      type: String,
      required: true,
    },
    sourcePath: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedDirectory: [] as ApiResponse.File[],
      moveModalInCurrentPath: '' as string,
      moveModalInBreadcrumb: [] as string[],
      newDirectoryName: '' as string,
      isLoading: false as boolean,
      files: [] as ApiResponse.File[],
      isAddedDirectory: false as boolean,
    };
  },
  computed: {
    directoriesOnly(): ApiResponse.File[] {
      return this.files.filter(
        (file: ApiResponse.File) => file.type === 'directory'
      );
    },
    fileNames(): string[] {
      return this.files.map((file: ApiResponse.File) => file.name);
    },
  },
  async created() {
    this.moveModalInCurrentPath = this.currentPath;
    this.moveModalInBreadcrumb = this.breadcrumb;
    this.fetchFilesData();
  },
  methods: {
    handleCreateDirectory() {
      this.files.push({
        name: '',
        type: 'directory',
        updated_at: dayjs().unix(),
      });
    },
    selectFile(filename: String) {
      this.selectedDirectory = this.files.filter(
        (file: any) => file.name === filename
      );
    },
    resetSelectedDirectory() {
      this.selectedDirectory = [];
    },
    async setDefaultNameInput() {
      const newName = this.setNewName();
      this.files = this.setDefaultName(newName);
      await this.createDirectory(newName);
      this.isAddedDirectory = true;
      this.newDirectoryName = '';
    },
    setNewName(): string {
      const defaultName = `新しいフォルダー`;

      // 入力されたファイル名が既にある場合
      if (
        this.newDirectoryName !== '' &&
        this.fileNames.includes(this.newDirectoryName)
      ) {
        return this.searchDefaultName(this.newDirectoryName);
      }
      // 入力されたファイル名がない場合
      if (
        this.newDirectoryName !== '' &&
        !this.fileNames.includes(this.newDirectoryName)
      ) {
        return this.newDirectoryName;
      }
      // 「新しいフォルダー」が無い場合追加
      if (
        !this.fileNames.includes(defaultName) &&
        this.newDirectoryName === ''
      ) {
        return defaultName;
      }
      // 「新しいフォルダー」の連番付きverが無い場合追加
      if (
        this.fileNames.includes(defaultName) &&
        this.newDirectoryName === ''
      ) {
        return this.searchDefaultName(defaultName);
      }
      return '';
    },
    setDefaultName(name: string): ApiResponse.File[] {
      return this.files.map((file: ApiResponse.File) => {
        if (file.name === '') {
          return { ...file, name };
        }
        return file;
      });
    },
    searchDefaultName(defaultName: string): string {
      let newName = '';

      for (let i = 1; i < 1000; i += 1) {
        if (
          !this.fileNames.includes(`${defaultName}(${i})`) &&
          newName === ''
        ) {
          newName = `${defaultName}(${i})`;
          break;
        }
      }
      return newName;
    },
    onClose() {
      this.$emit('close-modal', this.isAddedDirectory);
      this.resetSelectedDirectory();
    },
    isClickable(file: ApiResponse.File) {
      return file.type === 'directory';
    },
    breadcrumbNavigation($event: any) {
      if (
        $event.target.outerText.trim() !==
        this.moveModalInBreadcrumb[this.breadcrumb.length - 1]
      ) {
        const currentFolder = $event.target.outerText.trim();
        const currentPathLength = currentFolder.length;
        const currentPathIndex = this.moveModalInCurrentPath.indexOf(
          currentFolder
        );
        this.moveModalInCurrentPath = this.moveModalInCurrentPath.slice(
          0,
          currentPathIndex + currentPathLength
        );

        // パンクズ
        const currentIndex = this.breadcrumb.indexOf(currentFolder);
        const breadLength = this.breadcrumb.length;
        this.breadcrumb.splice(currentIndex + 1, breadLength - 1);
      }
      this.fetchFilesData();
    },
    fileNavigation(file: ApiResponse.File) {
      if (this.isClickable(file)) {
        if (this.moveModalInCurrentPath === '') {
          this.moveModalInCurrentPath = file.name;
          this.breadcrumb.push(this.moveModalInCurrentPath);
        } else {
          this.moveModalInCurrentPath = `${this.moveModalInCurrentPath}/${file.name}`.trim();
          this.breadcrumb.push(file.name);
        }
        this.fetchFilesData();
      }
    },
    move() {
      if (this.fileList.length > 0) this.moveFiles();
      if (this.directory.length > 0) this.moveDirectory();
    },
    moveDirectory() {
      const directory =
        this.selectedDirectory.length > 0 ? this.selectedDirectory[0].name : '';

      const sourceFolder = this.sourcePath.slice(
        this.sourcePath.lastIndexOf('/') + 1
      );

      const payload = {
        source_path: this.sourcePath,
        destination_path: `${this.moveModalInCurrentPath}/${directory}/${sourceFolder}`,
      };
      this.$emit('move-directory', payload);
    },
    moveFiles() {
      const directory =
        this.selectedDirectory.length > 0 ? this.selectedDirectory[0].name : '';
      const payload = {
        current_path: this.currentPath,
        destination_path: `${this.moveModalInCurrentPath}/${directory}`,
        files: this.fileList.map((item: ApiResponse.File) => ({
          name: item.name,
        })),
      };
      this.$emit('move-files', payload);
    },
    addSelectClass(fileName: string): boolean {
      return (
        this.selectedDirectory.length > 0 &&
        fileName === this.selectedDirectory[0].name
      );
    },
    async resetPath() {
      this.isLoading = true;
      this.moveModalInCurrentPath = '';
      this.moveModalInBreadcrumb = [];
      await this.fetchFilesData();
      this.isLoading = false;
    },
    async fetchFilesData() {
      this.isLoading = true;
      try {
        const { data } = await fetchFiles(this.currentCompanyUuid, {
          current_path: this.moveModalInCurrentPath,
        });
        this.files = data.files;
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    async createDirectory(name: string) {
      try {
        await createDirectory(this.currentCompanyUuid, {
          current_path: this.moveModalInCurrentPath,
          name,
        });
      } catch (error) {
        console.error(error.message);
      }
    },
  },
});
</script>

<style scoped lang="scss">
.filemove-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

.filemove {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 50;
  background: $true_white;
  width: 600px;
  height: 671px;
  border-radius: 4px;
  box-shadow: 0 0 3px $light_gray;
  padding: 20px 30px 30px;

  header {
    padding: 0 0 18px;
  }

  &__title {
    font-size: 15px;
    line-height: 1;
    margin: 0 0 19px;
  }
}

.breadcrumb-container {
  position: relative;
  display: flex;
  align-items: center;
  font-weight: 600;
  flex-wrap: wrap;

  .breadcrumb-item {
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .breadcrumb-image {
    display: flex;
  }

  .breadcrumb-item,
  .caret {
    color: $gray_blue_4;
  }

  .breadcrumb-item:last-of-type {
    color: $main_color;
  }

  .breadcrumb-item:not(:last-of-type)::after,
  .caret::after {
    content: '>';
    margin: 0 10px;
    color: $gray_blue_4;
    font-size: 18px;
    font-weight: 600;
  }
}

.filelist {
  width: 540px;
  height: 450px;
  margin: 0 auto;
  border-top: 2px solid $button_background_color;
  border-bottom: 2px solid $button_background_color;
  overflow: scroll;

  &__file {
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 20px 0 10px;
    border-bottom: 1px solid $button_background_color;
    cursor: pointer;
    position: relative;

    &--selected {
      background: $powder_blue;
    }
  }

  &__file-name {
    text-decoration: underline;
  }

  &__caret {
    position: absolute;
    top: 15px;
    right: 20px;
    width: 8px;
    height: 12px;
  }
}

.input-container {
  width: 90%;
}

.input {
  height: 30px;
  width: 100%;
  background-color: $extra_light_gray;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  color: $gray_blue_4;
  padding: 0 11px;
}

.input-error {
  background-color: $light_pink;
  border: 1px solid $valid_pink;
}

.file-actions {
  margin: 8px 0 0;
}

.file-buttons {
  margin: 25px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    width: 200px;
  }

  & button:last-child {
    margin: 0 0 0 20px;
  }
}
</style>
