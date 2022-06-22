<template>
  <div class="files-container">
    <h1>社内ファイル</h1>

    <vue-loading
      v-if="isLoading"
      type="spin"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    ></vue-loading>

    <div v-else class="inner-container">
      <base-tabs
        :items="[{ name: '全社', id: 'all' }, ...companies]"
        :selected-tab="currentCompanyUuid"
        @change-tab="changeCompanyTab($event)"
      />

      <div
        v-if="currentPath !== ''"
        class="contents-title breadcrumb-container"
      >
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

      <div class="file-list">
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
            <th class="table__title table__title--none"></th>
          </tr>
          <tr
            v-for="file in files"
            :key="file.name"
            class="table__detail table__border"
          >
            <td class="table__detail--check">
              <base-checkbox
                v-if="file.type !== 'directory'"
                v-model="selectGroup"
                class="checkbox"
                :value="file.name"
                @change="onClickCheckbox"
              />
            </td>
            <td
              class="table__detail--name"
              :class="file.type === 'directory' ? 'clickable' : ''"
              @click="fileNavigation(file, $event)"
            >
              <file-icon :file-type="file.type" />
              <div class="filename-row">
                <file-popper
                  v-if="file.name.length > 45"
                  class="clickable"
                  :text="file.name"
                  max-width="510"
                ></file-popper>
                <span v-else class="clickable" @click="openPreview(file)">
                  {{ file.name }}
                </span>
              </div>
            </td>
            <td class="table__detail--date">
              {{ file.updated_at | dateFilter }}
            </td>
            <td
              class="table__detail--actions table-clickable"
              :class="file.type === 'directory' ? 'no-touch' : 'clickable'"
              @click="toggleSubItem(file.name)"
            >
              <img
                v-if="file.type !== 'directory'"
                src="/icon/icon_triple_dot.svg"
              />
              <div class="menubox">
                <transition name="fade">
                  <div
                    v-show="file.name === activeItem.name && isActiveSubmenu"
                    class="submenu-container"
                  >
                    <file-submenu
                      :name="file.name"
                      :type="file.type"
                      @download="downloadFile(file.name)"
                      @preview="showPreview(file.name)"
                      @link-copy="handleLinkCopy"
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
    </div>
    <preview-file-modal
      v-if="previewFileModal"
      :url="previewUrl"
      :is-fetch-preview-file="isFetchPreviewFile"
      @onClose="previewFileModal = false"
    />
    <download-modal
      v-if="isDownloadModalVisible"
      :selected-items="selectGroup"
      :download-validation="downloadValidation"
      @onClose="isDownloadModalVisible = false"
      @onDownload="bulkDownload"
    />
    <link-copy-modal v-if="isCopyModalVisible" class="link-copy-modal" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';
import { VueLoading } from 'vue-loading-template';
import BaseCheckbox from '@/components/App/atoms/buttons/BaseCheckbox.vue';
import BaseTabs from '@/components/App/molecules/tabs/BaseTabs.vue';
import FileIcon from '@/components/Admin/Pages/CompanyFile/FileIcon.vue';
import FilePopper from '@/components/Admin/Pages/CompanyFile/FilePopper.vue';
import PreviewFileModal from '@/components/Admin/Pages/CompanyFile/PreviewFileModal.vue';
import FileSubmenu from '@/components/App/molecules/company-file/FileSubmenu.vue';
import LinkCopyModal from '@/components/Admin/Pages/CompanyFile/LinkCopyModal.vue';
import DownloadModal from '@/components/App/molecules/company-file/DownloadModal.vue';

import {
  fetchUserOrganizations,
  fetchCompanyFiles,
  fetchPreviewFile,
  downloadCompanyFile,
} from '@/libs/api/app';

export default Vue.extend({
  layout: 'app/default',
  components: {
    VueLoading,
    BaseCheckbox,
    BaseTabs,
    FileIcon,
    FilePopper,
    PreviewFileModal,
    FileSubmenu,
    LinkCopyModal,
    DownloadModal,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async beforeRouteUpdate(to: Route, from: Route, next: Function) {
    this.isLoading = true;
    this.currentCompanyUuid = to.query.companyUuid ?? 'all';
    this.currentPath = to.query.currentPath ?? '';
    this.breadcrumb =
      to.query.currentPath !== '' ? this.currentPath.split('/') : [''];
    await this.fetchCompanyFileData();
    next();
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
      isLoading: true as Boolean,
      currentCompanyUuid: 'all',
      currentPath: '' as string,
      companies: [] as AppApiResponse.MyOrganization[],
      tabs: [],
      files: [] as AppApiResponse.File[],
      baseFetchFilesList: [] as AppApiResponse.File[],
      breadcrumb: [],
      breadcrumbWidth: 0 as number,
      showPopper: false as boolean,
      isAllChecked: [] as string[],
      selectGroup: [] as string[],
      isSortVisible: false as boolean,
      isActiveSubmenu: false as boolean,
      activeItem: {} as AppApiResponse.File,
      isFetchPreviewFile: false as boolean,
      previewUrl: '' as string,
      previewFileModal: false as boolean,
      isCopyModalVisible: false as boolean,
      selectedSort: '' as string,
      isDownloadModalVisible: false as boolean,
    };
  },
  computed: {
    selectedFiles(): AppApiResponse.File[] {
      return this.files.filter((file: AppApiResponse.File) => {
        return (
          file.type !== 'directory' && this.selectGroup.includes(file.name)
        );
      });
    },
    downloadValidation(): boolean {
      return this.selectGroup.length === 0;
    },
    breadcrumbTooLong(): boolean {
      // 約４０文字
      return this.breadcrumbWidth > 746;
    },
    halfBreadcrumb(): number {
      return this.breadcrumb.length > 3
        ? Math.ceil(this.breadcrumb.length / 2) + 1
        : Math.floor(this.breadcrumb.length / 2);
    },
    displayedBreadcrumbs(): string[] {
      const lastIndex = this.breadcrumb.length - 1;
      const secondToLastIndex = this.breadcrumb.length - 2;
      const lastCrumb = this.breadcrumb[lastIndex];
      const secondToLastCrumb = this.breadcrumb[secondToLastIndex];

      if (lastCrumb.length + secondToLastCrumb.length > 40) {
        return [...this.breadcrumb.slice(lastIndex)];
      }
      return [...this.breadcrumb.slice(secondToLastIndex)];
    },
    popperBreadcrumbs(): string[] {
      const sliceIndex = this.breadcrumb.indexOf(this.displayedBreadcrumbs[0]);
      return [...this.breadcrumb.slice(0, sliceIndex)];
    },
  },
  created() {
    this.$router.push('/');
    this.isLoading = true;
    try {
      this.fetchCompanies();
      this.currentCompanyUuid =
        !('companyUuid' in this.$route.query) ||
        typeof this.$route.query.companyUuid !== 'string'
          ? 'all'
          : this.$route.query.companyUuid;
      this.fetchCompanyFileData();
    } catch (e) {
      console.log(e);
    }
  },
  updated() {
    this.getBreadcrumbWidth();
  },
  methods: {
    async fetchCompanies() {
      this.isLoading = true;
      const res = await fetchUserOrganizations(this.$accessor.userProfile.uuid);
      this.companies = res.data.organizations;
      this.addId();
      this.isLoading = false;
    },
    async fetchCompanyFileData() {
      this.isLoading = true;
      this.isLoading = true;
      this.breadcrumbWidth = 0;

      const res = await fetchCompanyFiles(this.currentCompanyUuid, {
        current_path: this.currentPath,
      });
      this.files = res.data.files;
      this.baseFetchFilesList = res.data.files;
      this.isLoading = false;
    },
    async fetchPreviewUrl(payload: AppApiResponse.PreviewFile) {
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
    async downloadFile(fileName: string) {
      const response = await downloadCompanyFile(this.currentCompanyUuid, {
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
    async changeCompanyTab(uuid: string) {
      this.isLoading = true;
      this.currentCompanyUuid = uuid;
      this.clearData();
      this.pushPage();
      this.selectGroup = [];
      this.isDownloadModalVisible = false;
      this.isAllChecked = [];
      this.isSortVisible = false;
      this.isLoading = false;
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
    clearData() {
      this.currentPath = '';
    },
    pushPage() {
      this.$router.push({
        path: '/internal-files',
        query: {
          companyUuid: this.currentCompanyUuid,
          currentPath: this.currentPath,
        },
      });
    },
    addId() {
      this.companies.forEach(function adder(
        e: AppApiResponse.MyOrganization
      ): string {
        e.id = e.uuid;
      });
    },
    toggleAllCheck(selectedList: string[]) {
      this.selectGroup = selectedList.length
        ? this.files.map((file: any) => file.name)
        : [];

      if (this.selectGroup.length > 0) {
        this.isDownloadModalVisible = true;
      } else {
        this.isDownloadModalVisible = false;
      }
    },
    onClickCheckbox(selectGroup: string[]) {
      this.isAllChecked =
        selectGroup.length === this.files.length ? ['default'] : [];

      if (selectGroup.length > 0) {
        this.isDownloadModalVisible = true;
      } else {
        this.isDownloadModalVisible = false;
      }
    },
    toggleSubItem(name: String) {
      this.isActiveSubmenu = !this.isActiveSubmenu;
      const selectedFile = this.files.filter(
        (e: AppApiResponse.File) => e.name === name
      );
      const [selectedContents] = selectedFile;
      this.activeItem = selectedContents;
    },
    closeSubmenu() {
      this.activeItem = {
        type: '',
        name: '',
        updated_at: null,
      };
      this.isActiveSubmenu = false;
    },
    openPreview(item: AppApiResponse.File) {
      if (item.type === 'directory') return;
      this.showPreview(item.name);
    },
    showPreview(name: string) {
      this.fetchPreviewUrl({
        current_path: this.currentPath,
        name,
      } as AppApiResponse.PreviewFile);
      this.previewFileModal = true;
    },
    fileNavigation(file: AppApiResponse.File, $event: any) {
      if (file.type === 'directory') {
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
    sortByDate(sort: 'asc' | 'desc' | 'reset'): void {
      // 日付古い順
      if (sort === 'asc' && this.selectedSort !== 'asc') {
        this.selectedSort = 'asc';
        this.files = [...this.baseFetchFilesList].sort(
          (a: AppApiResponse.File, b: AppApiResponse.File): number => {
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
        this.files = [...this.baseFetchFilesList].sort(
          (a: AppApiResponse.File, b: AppApiResponse.File) => {
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
        this.fetchCompanyFileData();
        this.isSortVisible = false;
      }
    },
    bulkDownload() {
      this.selectedFiles.forEach((file: AppApiResponse.File) => {
        this.downloadFile(file.name);
      });
    },
    breadcrumbNavigation($event: any) {
      if (
        $event.target.outerText.trim() !==
        this.breadcrumb[this.breadcrumb.length - 1]
      ) {
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
        this.pushPage();
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
    async resetPath() {
      this.isLoading = true;
      this.clearData();
      this.pushPage();
      this.isLoading = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.files-container {
  margin: 64px auto 206px;
  min-width: 800px;
  max-width: 800px;
  width: 800px;
  // background-color: $main_background_color;

  h1 {
    font-size: 28px;
    font-weight: 600;
    color: $main_color;
    line-height: 1;
    letter-spacing: 0;
  }
}

.inner-container {
  *[role='button'] {
    cursor: pointer;
  }

  background-color: $true_white;
  margin: 68px auto 120px auto;
  border-radius: 4px;
}

.file-list {
  min-width: 800px;
  max-width: 800px;
  width: 800px;
  box-shadow: 0 1px 4px $box-shadow;
  border-radius: 4px;
}

.table {
  width: 100%;
  margin: 25px 0 0;

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
      width: 510px;
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

    &--none {
      width: 100px;
    }
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
      width: 510px;
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

.no-touch {
  pointer-events: none;
}

.clickable {
  cursor: pointer;
}

.sort-header,
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

.breadcrumb-container {
  position: relative;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  margin: 18px 0 0;

  .breadcrumb-contents {
    position: relative;
  }

  .breadcrumb-row {
    display: flex;
    white-space: nowrap;

    a {
      max-width: 746px;
      text-overflow: ellipsis;
      overflow: hidden;
      display: block;
    }
  }

  .breadcrumb-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    text-overflow: ellipsis;
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

.fade-enter,
.fade-leave-to {
  transition: opacity 0.8s;
}

.filename-row {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.link-copy-modal {
  display: flex;
  width: 800px;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
}
</style>
