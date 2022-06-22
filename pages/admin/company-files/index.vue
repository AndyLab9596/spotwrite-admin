<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="社内ファイル">
        <template #tutorial>
          <TutorialButtonIcon :url="`/admin/tutorial/internal-files.html`" />
        </template>
        <template #description>
          社内に共有したいファイルを、会社ごとにアップロードできます。
        </template>
      </page-header>
      <scrollable-tabs
        class="base-tabs"
        :companies="[
          { name: '全社', uuid: 'all' },
          ...companyOfMyOrganizations,
        ]"
        :current-id="currentCompanyUuid"
        :company-count-threshold="4"
        @change-tab="changeCompanyTab($event)"
      />
      <div v-if="!isLoading" class="contents">
        <h2 v-if="notSearchingBaseTitle" class="contents-title">
          社内ファイル
        </h2>
        <h2 v-else-if="isSearch" class="contents-title">
          {{ files.length }}件の検索結果
        </h2>
        <div v-else class="contents-title breadcrumb-container">
          <div
            class="breadcrumb-contents"
            @mouseenter="handlePopperEnter"
            @mouseleave="handlePopperExit"
          >
            <div class="breadcrumb-image">
              <img
                src="/icon/icon-inner-folder.svg"
                class="breadcrumb-item"
                @click="resetPath($event)"
              />
            </div>
            <transition name="fade">
              <div v-if="showPopper" class="breadcrumb-popper">
                <div>社内ファイル</div>
                <a
                  v-for="item in popperBreadcrumbs"
                  :key="item.index"
                  class="breadcrumb-popper__crumb"
                  @click.prevent="breadcrumbNavigation($event)"
                >
                  {{ item }}
                </a>
              </div>
            </transition>
          </div>
          <span class="caret"></span>
          <span v-if="breadcrumbTooLong" class="breadcrumb-row">
            <a
              v-for="item in displayedBreadcrumbs"
              :key="item.index"
              class="breadcrumb-item"
              @click.prevent="breadcrumbNavigation($event)"
            >
              {{ item }}
            </a>
          </span>
          <span v-else ref="breadcrumbRow" class="breadcrumb-row">
            <a
              v-for="item in breadcrumb"
              :key="item.index"
              class="breadcrumb-item"
              @click.prevent="breadcrumbNavigation($event)"
            >
              {{ item }}
            </a>
          </span>
        </div>

        <div class="button-container">
          <div class="button-container--left">
            <div>
              <contained-button-with-icon
                src="/icon/icon_plus_pink.svg"
                inverse
                :disabled="isSearch"
                @click="openDirectoryCreateModal = true"
                >フォルダーを作成</contained-button-with-icon
              >
            </div>
            <div>
              <contained-button-with-icon
                src="/icon/icon_file-upload.svg"
                size="small"
                :disabled="isSearch"
                @click="openFileUpload = true"
                >ファイルをアップロード</contained-button-with-icon
              >
            </div>
            <div v-if="isSearch">
              <base-button
                class="search-button"
                size="small"
                @click="fetchFilesData()"
                >検索をリセットする</base-button
              >
            </div>
          </div>
          <div class="button-container--right">
            <label v-show="false" for="searchFileName">ファイル名</label>
            <base-input-text
              id="searchFileName"
              v-model="searchWord"
              placeholder="ファイル名"
              size="small"
              class="search-input"
              name="searchFileName"
            />
            <base-button
              class="search-button"
              size="small"
              @click="handleSearch()"
              >検索</base-button
            >
          </div>
        </div>

        <table class="table">
          <tr>
            <th class="table__title check">
              <base-checkbox v-model="isAllChecked" @change="toggleAllCheck" />
            </th>
            <th class="table__title">ファイル名</th>
            <th class="table__title sort-header">
              <span>更新日</span>
              <svg
                id="Icon_pulldown"
                class="sort"
                data-name="Icon/pulldown"
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="8"
                viewBox="0 0 10 8"
                @click="isSortVisible = !isSortVisible"
              >
                <path
                  id="Path_845"
                  data-name="Path 845"
                  d="M450.361,106.779l-4.549,7.06a.44.44,0,0,1-.746,0l-4.549-7.06a.471.471,0,0,1,.373-.733h9.1A.471.471,0,0,1,450.361,106.779Z"
                  transform="translate(-440.439 -106.046)"
                  fill="#7e8195"
                />
              </svg>
              <transition name="fast-fade">
                <ul v-if="isSortVisible" class="sort-menu">
                  <li
                    class="sort-menu__item"
                    :class="{ selected: selectedSort === 'desc' }"
                    @click.prevent="sortByDate('desc')"
                  >
                    日付が新しい順
                  </li>
                  <li
                    class="sort-menu__item"
                    :class="{ selected: selectedSort === 'asc' }"
                    @click.prevent="sortByDate('asc')"
                  >
                    日付が古い順
                  </li>
                  <li
                    class="sort-menu__item"
                    :class="{ selected: selectedSort === 'reset' }"
                    @click.prevent="sortByDate('reset')"
                  >
                    順番を元に戻す
                  </li>
                </ul>
              </transition>
            </th>
            <th class="table__title"></th>
          </tr>
          <tr
            v-for="file in files"
            :key="file.name"
            class="table__detail table__border"
          >
            <td class="table__detail--check">
              <base-checkbox
                v-model="selectGroup"
                class="checkbox"
                :value="file.name"
                @change="onClickCheckbox"
              />
            </td>
            <td
              class="table__detail--name"
              :class="{ 'table-clickable': isClickable(file) }"
              @click="fileNavigation(file, $event)"
            >
              <file-icon :file-type="file.type" />
              <div class="filename-row">
                <input
                  v-if="displayFileRenaming(file.name)"
                  ref="renameInput"
                  v-model="editedName"
                  type="text"
                  class="file-rename"
                  @keyup.enter="enteredRenameInput(file.type)"
                  @keyup.esc="handleBlur"
                  @blur="handleBlur"
                />
                <file-popper
                  v-else-if="file.name.length > 45"
                  class="file-popper"
                  :text="file.name"
                  max-width="625"
                ></file-popper>
                <span v-else class="file-name-text" @click="openPreview(file)">
                  {{ file.name }}
                </span>
                <div v-if="isSearch" class="table__detail--path">
                  場所：{{ file.path }}
                </div>
              </div>
            </td>
            <td class="table__detail--date">
              {{ file.updated_at | dateFilter }}
            </td>
            <td
              class="table__detail--actions table-clickable"
              @click="toggleSubItem(file.name)"
            >
              <img src="/icon/icon_triple_dot.svg" />
              <div class="menubox">
                <transition name="fade">
                  <div
                    v-show="file.name === activeItem.name && isActiveSubmenu"
                    class="submenu-container"
                  >
                    <directory-submenu
                      v-if="file.type === 'directory'"
                      :name="file.name"
                      :type="file.type"
                      @download="downloadDirectory(file.name)"
                      @move-directory="handleMove()"
                      @toggle-name-edit="handleNameChange"
                      @delete="clickDelete"
                    />

                    <other-submenu
                      v-else
                      :name="file.name"
                      :type="file.type"
                      @download="downloadFile(file.name)"
                      @move-file="handleMove()"
                      @toggle-name-edit="handleNameChange"
                      @preview="showPreview(file.name)"
                      @link-copy="handleLinkCopy"
                      @delete="clickDelete"
                    />
                  </div>
                </transition>
              </div>
            </td>
            <div
              v-if="isActiveSubmenu"
              class="submenu-clickout"
              @click="closeSubmenu"
            ></div>
          </tr>
        </table>
      </div>
      <DirectoryCreateModal
        v-if="openDirectoryCreateModal"
        @onClose="openDirectoryCreateModal = false"
        @onSubmit="directoryCreate"
      />
      <bulk-post-rule-setting-modal
        v-if="openBulkPostRuleSettingModal"
        :selected-items="selectGroup"
        :download-validation="downloadValidation"
        :move-validation="moveValidation"
        :edit-validation="editValidation"
        @onClose="openBulkPostRuleSettingModal = false"
        @onDownload="bulkDownload"
        @onMove="bulkMove"
        @onDelete="bulkDelete"
        @onEdit="bulkPostRuleSettingHandleNameChange"
      />
      <file-upload
        v-if="openFileUpload"
        @create="upload"
        @on-close="openFileUpload = false"
      ></file-upload>
      <file-move-modal
        v-if="isFileMoveVisible"
        :file-list="selectedFiles"
        :directory="selectedDirectories"
        :breadcrumb="breadcrumb"
        :current-company-uuid="currentCompanyUuid"
        :current-path="currentPath"
        :source-path="sourcePath"
        @move-directory="moveDirectoryLocation"
        @move-files="moveFileLocation"
        @folder-create="handleCreateDirectory"
        @close-modal="closeFileMoveVisibleModal"
      >
      </file-move-modal>
      <preview-file-modal
        v-if="previewFileModal"
        :url="previewUrl"
        :is-fetch-preview-file="isFetchPreviewFile"
        @onClose="previewFileModal = false"
      />
      <delete-file-modal
        v-if="deleteFileModal"
        :delete-type="deleteFile"
        @close="deleteFileModal = false"
        @delete="deleteFileOrDirectory"
      />
      <file-upload-progress-bar
        v-if="progressBarModal"
        :file-name="uploadFileName"
        :loaded-size="progressStatusValue"
        class="progress-bar"
        @close="progressBarModal = false"
      />
      <link-copy-modal v-if="isCopyModalVisible" class="link-copy-modal" />
      <FixedAlert v-if="isAlertVisible" @close="onCloseAlert">
        <p v-for="error in uploadFileErrors" :key="error.index">{{ error }}</p>
      </FixedAlert>
      <vue-loading
        v-if="isLoading"
        type="spin"
        color="#333"
        :size="{ width: '50px', height: '50px' }"
      ></vue-loading>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';
import { VueLoading } from 'vue-loading-template';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import ContainedButtonWithIcon from '@/components/Admin/Modules/Button/ContainedButtonWithIcon.vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import BaseInputText from '@/components/Admin/Modules/Input/BaseInputText.vue';
import FilePopper from '@/components/Admin/Pages/CompanyFile/FilePopper.vue';
import ScrollableTabs from '@/components/Admin/Modules/Tab/ScrollableTabs.vue';
import {
  fetchOrganizations,
  fetchUserOrganizations,
  fetchFiles,
  downloadOrganizationFile,
  downloadOrganizationDirectory,
  uploadFile,
  searchFiles,
  createDirectory,
  deleteOrganizationFile,
  deleteOrganizationDirectory,
  changeOrganizationFileName,
  changeOrganizationDirectoryName,
  moveDirectory,
  moveFile,
  fetchPreviewFile,
} from '@/libs/api';
import FileUpload from '@/components/Admin/Pages/CompanyFile/FileUpload.vue';
import FileIcon from '@/components/Admin/Pages/CompanyFile/FileIcon.vue';
import BulkPostRuleSettingModal from '@/components/Admin/Pages/CompanyFile/BulkPostRuleSettingModal.vue';
import DirectoryCreateModal from '@/components/Admin/Pages/CompanyFile/DirectoryCreateModal.vue';
import FileMoveModal from '@/components/Admin/Pages/CompanyFile/FileMoveModal.vue';
import DirectorySubmenu from '@/components/Admin/Pages/CompanyFile/DirectorySubmenu.vue';
import OtherSubmenu from '@/components/Admin/Pages/CompanyFile/OtherSubmenu.vue';
import PreviewFileModal from '@/components/Admin/Pages/CompanyFile/PreviewFileModal.vue';
import DeleteFileModal from '@/components/Admin/Pages/CompanyFile/DeleteFileModal.vue';
import FileUploadProgressBar from '@/components/Admin/Pages/CompanyFile/FileUploadProgressBar.vue';
import { Route } from 'vue-router';
import LinkCopyModal from '@/components/Admin/Pages/CompanyFile/LinkCopyModal.vue';
import FixedAlert from '@/components/Admin/Modules/Alerts/FixedAlert.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';

type TabMenu = {
  name: string;
  uuid: string;
};

export default Vue.extend({
  layout: 'admin/default',
  components: {
    VueLoading,
    PageHeader,
    BaseButton,
    ContainedButtonWithIcon,
    BaseInputText,
    BaseCheckbox,
    FilePopper,
    FileIcon,
    ScrollableTabs,
    FileUpload,
    BulkPostRuleSettingModal,
    DirectoryCreateModal,
    FileMoveModal,
    DirectorySubmenu,
    OtherSubmenu,
    PreviewFileModal,
    DeleteFileModal,
    FileUploadProgressBar,
    LinkCopyModal,
    FixedAlert,
    TutorialButtonIcon,
  },
  filters: {
    dateFilter(date: number) {
      if (date) {
        return dayjs.unix(date).format('YYYY-MM-DD');
      }
    },
  },
  data() {
    return {
      isLoading: true as boolean,
      currentCompanyUuid: 'all' as string,
      organizations: [] as ApiResponse.Organization[],
      files: [] as ApiResponse.File[],
      currentPath: '' as string,
      breadcrumb: [] as string[],
      breadcrumbWidth: 0 as number,
      checked: [] as string[],
      isAllChecked: [] as string[],
      searchFileName: '' as string,
      editingFile: null as unknown,
      editedName: '' as string,
      isEditing: false as boolean,
      showSubItem: false as boolean,
      searchWord: '' as string,
      isSearch: false as boolean,
      selectGroup: [] as string[],
      openBulkPostRuleSettingModal: false as boolean,
      openFileUoLoad: false as boolean,
      showPopper: false as boolean,
      openDirectoryCreateModal: false as boolean,
      isFileMoveVisible: false as boolean,
      openFileUpload: false as boolean,
      isSortVisible: false as boolean,
      selectedSort: '' as string,
      activeItem: {} as ApiResponse.File,
      isActiveSubmenu: false as boolean,
      isRenamingFile: false as boolean,
      isFetchPreviewFile: false as boolean,
      previewUrl: '' as string,
      previewFileModal: false as boolean,
      uploadFileName: '' as string,
      progressStatusValue: 0 as number,
      progressBarModal: false as boolean,
      deleteFileModal: false as boolean,
      deleteItem: { name: '', type: '' },
      isCopyModalVisible: false as boolean,
      isAlertVisible: false as boolean,
      uploadFileErrors: [] as string[],
      userOrganizations: [] as MyOrganization[],
    };
  },
  computed: {
    companies(): ApiResponse.Organization[] {
      return this.organizations.filter(
        (o: ApiResponse.Organization) => o.layer === 0
      );
    },
    selectedFiles(): ApiResponse.File[] {
      return this.files.filter((file: ApiResponse.File) => {
        return (
          file.type !== 'directory' && this.selectGroup.includes(file.name)
        );
      });
    },
    selectedDirectories(): ApiResponse.File[] {
      return this.files.filter((file: ApiResponse.File) => {
        return (
          file.type === 'directory' && this.selectGroup.includes(file.name)
        );
      });
    },
    sourcePath(): string {
      if (this.currentPath === '') return `/${this.selectGroup[0]}`;
      return `${this.currentPath}/${this.selectGroup[0]}`;
    },
    downloadValidation(): boolean {
      return this.selectedDirectories.length > 0;
    },
    moveValidation(): boolean {
      // ファイルとディレクトリが選択されている or ディレクトリが1以上選択されている
      return (
        (this.selectedFiles.length > 0 &&
          this.selectedDirectories.length > 0) ||
        this.selectedDirectories.length > 1
      );
    },
    editValidation(): boolean {
      // ファイル or フォルダが1つ以上選択されている
      return (
        (this.selectedFiles.length > 0 &&
          this.selectedDirectories.length > 0) ||
        this.selectedFiles.length > 1 ||
        this.selectedDirectories.length > 1
      );
    },
    breadcrumbTooLong(): boolean {
      return this.breadcrumbWidth > 915;
    },
    halfBreadcrumb(): number {
      return this.breadcrumb.length > 4
        ? Math.ceil(this.breadcrumb.length / 2) + 1
        : Math.floor(this.breadcrumb.length / 2);
    },
    popperBreadcrumbs(): string[] {
      return [...this.breadcrumb.slice(0, this.halfBreadcrumb)];
    },
    displayedBreadcrumbs(): string[] {
      return [...this.breadcrumb.slice(this.halfBreadcrumb)];
    },
    notSearchingBaseTitle(): Boolean {
      return this.currentPath === '' && !this.isSearch;
    },
    myBelongToOrganizationUuids(): string[] {
      return this.userOrganizations.map(
        (item: ApiResponse.Organization) => item.uuid
      );
    },
    myOrganizationsCompanyUuids(): string[] {
      return this.organizations
        .filter((item: ApiResponse.Organization) =>
          this.myBelongToOrganizationUuids.includes(item.uuid)
        )
        .map((item: ApiResponse.Organization) => {
          if (item.relations.company != null) {
            return item.relations.company;
          }
          return '';
        });
    },
    companyOfMyOrganizations(): TabMenu[] {
      return this.companies
        .filter((item: ApiResponse.Organization) =>
          this.myOrganizationsCompanyUuids.includes(item.uuid)
        )
        .map((item: ApiResponse.Organization) => ({
          uuid: item.uuid,
          name: item.name,
        }));
    },
  },
  async created() {
    this.$router.push('/admin');
    this.currentCompanyUuid =
      !('companyUuid' in this.$route.query) ||
      typeof this.$route.query.companyUuid !== 'string'
        ? 'all'
        : this.$route.query.companyUuid;

    this.currentPath =
      !('currentPath' in this.$route.query) ||
      typeof this.$route.query.currentPath !== 'string'
        ? ''
        : this.$route.query.currentPath;

    await this.fetchOrganizationsData();
    await this.fetchFilesData();
    await this.fetchUserOrganizations();
    this.isLoading = false;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async beforeRouteUpdate(to: Route, from: Route, next: Function) {
    this.isLoading = true;
    this.currentCompanyUuid = to.query.companyUuid ?? 'all';
    this.currentPath = to.query.currentPath ?? '';
    this.breadcrumb =
      to.query.currentPath !== '' ? this.currentPath.split('/') : [''];
    await this.fetchFilesData();
    this.isLoading = false;
    next();
  },
  updated() {
    this.getBreadcrumbWidth();
  },
  methods: {
    async changeCompanyTab(uuid: string) {
      this.isLoading = true;
      this.currentCompanyUuid = uuid;
      this.clearData();
      this.pushPage();
      this.isLoading = false;
    },
    pushPage() {
      this.$router.push({
        path: '/admin/company-files',
        query: {
          companyUuid: this.currentCompanyUuid,
          currentPath: this.currentPath,
        },
      });
    },
    async resetPath() {
      this.isLoading = true;
      this.clearData();
      this.pushPage();
      this.isLoading = false;
    },
    clearData() {
      this.currentPath = '';
      this.breadcrumb = [];
      this.selectGroup = [];
      this.editedName = '';
    },
    async fetchOrganizationsData() {
      const res = await fetchOrganizations();
      this.organizations = res.data.organizations;
    },
    async fetchUserOrganizations() {
      const { data } = await fetchUserOrganizations(
        this.$accessor.userProfile.uuid
      );
      this.userOrganizations = data.organizations;
    },
    displayFileRenaming(fileName: string): Boolean {
      return this.isRenamingFile && fileName === this.activeItem.name;
    },
    bulkPostRuleSettingHandleNameChange(name: string) {
      this.isRenamingFile = true;
      this.editedName = name;
      const selectedFile = this.files.filter(
        (e: ApiResponse.File) => e.name === name
      );
      const [selectedContents] = selectedFile;
      this.activeItem = selectedContents;
      this.openBulkPostRuleSettingModal = false;
    },
    async enteredRenameInput(fileType: string) {
      if (fileType === 'directory') {
        await this.changeDirectoryName(this.activeItem.name, this.editedName);
        this.clearData();
        return;
      }
      await this.changeFileName(this.activeItem.name, this.editedName);
      this.clearData();
    },
    async fetchFilesData() {
      this.isLoading = true;
      this.isSearch = false;
      this.searchWord = '';
      this.breadcrumbWidth = 0;
      try {
        const res = await fetchFiles(this.currentCompanyUuid, {
          current_path: this.currentPath,
        });
        this.files = res.data.files;
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    toggleSubItem(name: String) {
      this.isActiveSubmenu = !this.isActiveSubmenu;
      const selectedFile = this.files.filter(
        (e: ApiResponse.File) => e.name === name
      );
      const [selectedContents] = selectedFile;
      this.activeItem = selectedContents;
    },
    async handleSearch() {
      this.isLoading = true;
      try {
        const res = await searchFiles(this.currentCompanyUuid, {
          current_path: this.currentPath,
          search_word: this.searchWord,
        });
        this.files = res.data.files;
        this.isSearch = true;
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    closeSubmenu() {
      this.activeItem = {};
      this.isActiveSubmenu = false;
    },
    handleNameChange() {
      this.isRenamingFile = true;
      this.editedName = this.activeItem.name;
    },
    sortByDate(sort: 'asc' | 'desc' | 'reset'): void {
      // 日付古い順
      if (sort === 'asc' && this.selectedSort !== 'asc') {
        this.selectedSort = 'asc';
        this.files = this.files.sort(
          (a: ApiResponse.File, b: ApiResponse.File): number => {
            if (a.updated_at === null) {
              return 1;
            }
            if (b.updated_at === null) {
              return -1;
            }
            return a.updated_at > b.updated_at ? 1 : -1;
          }
        );
      }

      // 日付新しい順
      if (sort === 'desc' && this.selectedSort !== 'desc') {
        this.selectedSort = 'desc';
        this.files = this.files.sort(
          (a: ApiResponse.File, b: ApiResponse.File) => {
            if (a.updated_at === null) {
              return 1;
            }
            if (b.updated_at === null) {
              return -1;
            }
            return a.updated_at > b.updated_at ? -1 : 1;
          }
        );
      }

      if (sort === 'reset') {
        this.selectedSort = 'reset';
        this.fetchFilesData();
        this.isSortVisible = false;
      }
    },
    openPreview(item: ApiResponse.File) {
      if (item.type === 'directory') return;
      this.showPreview(item.name);
    },
    toggleAllCheck(selectedList: string[]) {
      this.selectGroup = selectedList.length
        ? this.files.map((file: any) => file.name)
        : [];

      if (this.selectGroup.length > 0) {
        this.openBulkPostRuleSettingModal = true;
      } else {
        this.openBulkPostRuleSettingModal = false;
      }
    },
    onClickCheckbox(selectGroup: string[]) {
      this.isAllChecked =
        selectGroup.length === this.files.length ? ['default'] : [];

      if (selectGroup.length > 0) {
        this.openBulkPostRuleSettingModal = true;
      } else {
        this.openBulkPostRuleSettingModal = false;
      }
    },
    isClickable(file: ApiResponse.File) {
      if (!this.isRenamingFile) {
        return file.type === 'directory';
      }
      return false;
    },
    closeFileMoveVisibleModal(isAddedDirectory: boolean) {
      this.isFileMoveVisible = false;
      if (isAddedDirectory) {
        this.clearData();
        this.pushPage();
      }
    },
    fileNavigation(file: ApiResponse.File, $event: any) {
      if (this.isClickable(file)) {
        if (this.currentPath === '') {
          this.currentPath = $event.target.outerText;
          this.breadcrumb.push(this.currentPath);
        } else {
          this.currentPath = `${this.currentPath}/${$event.target.outerText}`.trim();
          this.breadcrumb.push($event.target.outerText);
        }
        this.pushPage();
      }
    },
    breadcrumbNavigation($event: any) {
      if (
        $event.target.outerText.trim() !==
        this.breadcrumb[this.breadcrumb.length - 1]
      ) {
        this.currentPath = $event.target.outerText.trim();
        this.pushPage();
        // currentPath
        const currentFolder = $event.target.outerText.trim();
        const currentFolderLength = currentFolder.length;
        const currentFolderPathIndex = this.currentPath.indexOf(currentFolder);
        this.currentPath = this.currentPath.slice(
          0,
          currentFolderPathIndex + currentFolderLength
        );

        // パンクズ
        const currentFolderBreadcrumbIndex = this.breadcrumb.indexOf(
          currentFolder
        );
        const breadLength = this.breadcrumb.length;
        this.breadcrumb.splice(
          currentFolderBreadcrumbIndex + 1,
          breadLength - 1
        );
      }
    },
    getBreadcrumbWidth() {
      if (this.currentPath !== '' && this.$refs.breadcrumbRow) {
        this.breadcrumbWidth = this.$refs.breadcrumbRow.clientWidth;
      }
    },
    handlePopperEnter() {
      if (this.breadcrumbTooLong) {
        this.showPopper = true;
      }
    },
    handlePopperExit() {
      this.showPopper = false;
    },
    directoryCreate(name: string) {
      this.handleCreateDirectory(name);
    },
    async downloadFile(fileName: string) {
      const response = await downloadOrganizationFile(this.currentCompanyUuid, {
        current_path: this.currentPath,
        name: fileName,
      });

      const blob = new Blob([response.data], { type: response.data.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', fileName);
      link.click();
    },
    async downloadDirectory(fileName: string) {
      const response = await downloadOrganizationDirectory(
        this.currentCompanyUuid,
        {
          current_path: this.currentPath,
          name: fileName,
        }
      );

      if (!response.data.size) return;
      const blob = new Blob([response.data], { type: response.data.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', fileName);
      link.click();
    },
    bulkDownload() {
      this.selectedFiles.forEach((file: ApiResponse.File) => {
        this.downloadFile(file.name);
      });
      this.selectedDirectories.forEach((file: ApiResponse.File) => {
        this.downloadDirectory(file.name);
      });
    },
    bulkMove() {
      this.isFileMoveVisible = true;
      this.openBulkPostRuleSettingModal = false;
    },
    bulkDelete() {
      try {
        this.selectedFiles.forEach((file: ApiResponse.File) => {
          this.deleteFile(file.name);
        });
        this.selectedDirectories.forEach((file: ApiResponse.File) => {
          this.deleteDirectory(file.name);
        });
      } catch (error) {
        console.error(error.message);
      }
    },
    onUpload(e: ProgressEvent) {
      this.progressStatusValue = Math.floor((e.loaded * 100) / e.total);
    },
    clickDelete(item: { name: string; type: string }) {
      this.deleteFileModal = true;
      this.deleteItem = item;
    },
    async upload(file: File) {
      this.uploadFileName = file.name;
      this.progressBarModal = true;
      this.isLoading = true;
      this.openFileUpload = false;
      try {
        const formData = new FormData() as any;
        formData.append('file', file);
        formData.append('current_path', this.currentPath);
        await uploadFile(this.currentCompanyUuid, formData, this.onUpload);
        await this.fetchFilesData();
      } catch (error) {
        if (error.response) {
          if (error.response.data.errors?.file) {
            this.uploadFileErrors = error.response.data.errors.file;
            this.isAlertVisible = true;
          } else if (error.response.data.message === 'exceeded max storage.') {
            this.uploadFileErrors = [
              '契約している利用容量をオーバーします。アップロードを続けるためにはプラン変更で利用容量を増やす必要があります。管理者にお問い合わせ下さい。',
            ];
            this.isAlertVisible = true;
          }
        }
        this.isLoading = false;
      } finally {
        this.progressBarModal = false;
        this.uploadFileName = '';
        this.progressStatusValue = 0;
      }
    },
    async handleCreateDirectory(name: string) {
      try {
        await createDirectory(this.currentCompanyUuid, {
          current_path: this.currentPath,
          name,
        });
      } catch (error) {
        console.error(error.message);
      }
      this.openDirectoryCreateModal = false;
      await this.fetchFilesData();
    },
    deleteFileOrDirectory() {
      this.isLoading = true;
      if (this.deleteItem.type === 'directory') {
        this.deleteDirectory(this.deleteItem.name);
        this.deleteFileModal = false;
      }
      this.deleteFile(this.deleteItem.name);
      this.deleteFileModal = false;
    },
    async deleteFile(fileName: string) {
      await deleteOrganizationFile(this.currentCompanyUuid, {
        current_path: this.currentPath,
        name: fileName,
      });
      await this.fetchFilesData();
    },
    async deleteDirectory(fileName: string) {
      await deleteOrganizationDirectory(this.currentCompanyUuid, {
        current_path: this.currentPath,
        name: fileName,
      });
      await this.fetchFilesData();
    },
    showPreview(name: string) {
      this.fetchPreviewFile({
        current_path: this.currentPath,
        name,
      } as ApiResponse.PreviewFile);
      this.previewFileModal = true;
    },
    handleBlur() {
      this.editingFile = null;
      this.isRenamingFile = false;
    },
    handleLinkCopy() {
      // TODO https環境になったら変える
      const element = document.createElement('input');
      element.value = window.location.href;
      document.body.appendChild(element);
      element.select();
      document.execCommand('copy');
      document.body.removeChild(element);

      // TODO https環境になったら変える
      // navigator.clipboard.writeText(window.location.href);
      this.isCopyModalVisible = true;
      setTimeout(() => {
        this.isCopyModalVisible = false;
      }, 3000);
    },
    async fetchPreviewFile(payload: ApiResponse.PreviewFile) {
      this.isFetchPreviewFile = true;
      try {
        const { data } = await fetchPreviewFile(
          this.currentCompanyUuid,
          payload
        );
        this.previewUrl = data.url;
      } catch (e) {
        console.log(e);
      } finally {
        this.isFetchPreviewFile = false;
      }
    },
    async changeFileName(fileName: string, destinationName: string) {
      await changeOrganizationFileName(this.currentCompanyUuid, {
        current_path: this.currentPath,
        source_name: fileName,
        destination_name: destinationName,
      });
      await this.fetchFilesData();
    },
    async changeDirectoryName(fileName: string, destinationName: string) {
      await changeOrganizationDirectoryName(this.currentCompanyUuid, {
        current_path: this.currentPath,
        source_name: fileName,
        destination_name: destinationName,
      });
      await this.fetchFilesData();
    },
    handleMove() {
      this.selectGroup.push(this.activeItem.name);
      this.sourcePath = `${this.currentPath}/${this.activeItem.name}`;
      this.isFileMoveVisible = true;
    },
    async moveFileLocation(payload: ApiRequest.MoveFile) {
      try {
        await moveFile(this.currentCompanyUuid, payload);
        this.isFileMoveVisible = false;
        this.fetchFilesData();
        this.selectGroup = [];
      } catch (error) {
        alert('ファイルの移動ができませんでした');
        console.error(error.message);
      }
    },
    async moveDirectoryLocation(payload: ApiRequest.MoveDirectory) {
      try {
        await moveDirectory(this.currentCompanyUuid, payload);
        this.isFileMoveVisible = false;
        this.clearData();
        this.pushPage();
        this.fetchFilesData();
        this.selectGroup = [];
      } catch (error) {
        alert('フォルダの移動ができませんでした');
        console.error(error.message);
      }
    },
    onCloseAlert() {
      this.isAlertVisible = false;
      this.uploadFileErrors = [];
    },
  },
});
</script>

<style lang="scss" scoped>
.contents-top {
  display: flex;
  justify-content: space-between;
}

.contents-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 18px;
}

.base-tabs {
  margin: 32px 0 18px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-container--left,
.button-container--right {
  display: flex;
  align-items: center;
}

.button-container--left div {
  padding: 0 25px;

  &:not(:last-child) {
    border-right: 1px solid $light_gray_blue_3;
  }
}

.search-button {
  white-space: nowrap;
}

.search-input {
  width: 200px;
  margin: 0 10px 0 0;
}

.table {
  width: 100%;
  margin: 16px 0 0;

  th {
    text-align: center;
    vertical-align: inherit;
    padding: 5px;
    border-top: 1px solid $light_gray_blue_3;
    border-bottom: 1px solid $light_gray_blue_3;

    &.check {
      width: 30px;
    }

    &.name {
      width: 670px;
    }

    &.date {
      width: 160px;
    }

    &.actions {
      width: 100px;
    }

    & > .sort {
      cursor: pointer;
    }
  }

  &__title {
    color: #6a6d83;
    font-size: 13px;
    height: 38px;
    background: #f7f8fd;
  }

  td {
    vertical-align: inherit;
    padding: 5px;
    white-space: nowrap;
  }

  &__border {
    border-bottom: 1px solid $light_gray_blue_3;
  }

  &__detail {
    font-size: 13px;
    color: $dark_blue;
    height: 44px;

    &--check {
      text-align: center;
      width: 30px;
    }

    &--name {
      display: flex;
      align-items: center;
      height: 42px;
      text-align: left;
      width: 670px;
    }

    &--date {
      text-align: center;
      width: 160px;
    }

    &--actions {
      text-align: center;
      width: 100px;

      & > img {
        display: block;
        margin: 0 auto;
      }
    }
  }
}

.file-popper {
  cursor: pointer;
}

.filename-row {
  width: 100%;
}

.file-rename {
  width: 100%;
  height: 30px;
  padding: 11px;
  color: $gray_blue_4;
  appearance: none;
  background-color: $extra_light_gray;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;

  &:disabled {
    color: $gray;
    background-color: $white_2;
    cursor: not-allowed;
  }

  &::placeholder {
    color: $placeholder_gray;
  }
}

.table-clickable {
  cursor: pointer;
}

.breadcrumb-container {
  position: relative;
  display: flex;
  align-items: center;

  .breadcrumb-contents {
    position: relative;
  }

  .breadcrumb-row {
    display: flex;
    white-space: nowrap;
  }

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

  .breadcrumb-popper {
    z-index: 10;
    position: absolute;
    top: 28px;
    left: 0;
    background: $true_white;
    border: 1px solid $button_background_color;
    border-radius: 4px;
    color: $main_color;
    font-size: 13px;
    font-weight: 300;
    padding: 17px 15px 10px;
    min-width: 110px;
    width: fit-content;
    height: auto;
    min-height: 65px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    &__crumb {
      cursor: pointer;
    }
  }
}

.sort-header {
  position: relative;
}

.sort-menu {
  position: absolute;
  top: 28px;
  left: 0;
  background: $true_white;
  border: 1px solid $button_background_color;
  border-radius: 4px;
  padding: 10px 15px;
  width: 140px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  &__item {
    position: relative;
    cursor: pointer;
    text-decoration: none;
    color: $main_color;
    font-size: 13px;
    font-weight: 300;
    margin: 2.5px 0;
    letter-spacing: 0;

    &.selected::before {
      content: '●';
      position: absolute;
      top: 0;
      left: -11px;
      transform: scale(0.5);
      color: $dark_blue;
    }
  }
}

// Submenu
.menubox {
  width: 100%;
  height: 100%;
}

.menu {
  cursor: pointer;
}

.submenu-container {
  position: relative;
}

.submenu-clickout {
  position: fixed;
  width: 100vw;
  height: 100vw;
  top: 0;
  left: 0;
}

.submenu {
  z-index: 1;
  border-radius: 5px;
  border: 1px solid #e4e5ed;
  background-color: $true_white;
  width: 150px;
  min-height: 140px;
  position: absolute;
  top: 5px;
  left: 35px;
  text-align: left;

  &__button {
    border: none;
    display: block;
    width: 100%;
    text-align: left;
    background-color: $true_white;
    color: #7e8195;
    padding: 10px;

    &:hover {
      background-color: $light_gray_blue_1;
    }
  }
}

.file-name-text {
  cursor: pointer;
}

.progress-bar {
  position: fixed;
  display: flex;
  width: 960px;
  justify-content: center;
  align-items: center;
  bottom: 0;
}

.link-copy-modal,
.progress-bar {
  display: flex;
  width: 960px;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
}

.fade-enter,
.fade-leave-to {
  transition: opacity 0.8s;
}

.fast-fade-enter,
.fast-fade-leave-to {
  transition: opacity 0.1s;
}
</style>
