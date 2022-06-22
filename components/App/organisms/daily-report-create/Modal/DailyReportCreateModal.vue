<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="icon-cross-wrapper" @click="onClose">
          <img src="/app/icon/cross-white.svg" class="icon-cross" />
        </div>
        <div v-if="!isLoading" class="modal-content">
          <daily-report-select
            :daily-report-settings="dailyReportSettings"
            :selected-daily-report-setting-item="selectedDailyReportSettingItem"
            class="daily-report-select"
            @select="selectedDailyReportSettings"
          />

          <daily-report-date
            :selected-posted-at="input.posted_at"
            class="daily-report-date"
            @change="changePostedAt"
          />

          <template v-if="isAchievementRateRequired">
            <div class="border"></div>
            <daily-report-achievement-level
              :value="input.achievement_rate"
              label="達成度"
              class="daily-report-achievement-level"
              @change="changeAchievementLevel"
            />
          </template>

          <daily-report-content-item
            v-for="item in input.items"
            :key="item.uuid"
            :item="item"
            class="daily-report-content-item"
            @change="changeContent"
          />
        </div>
        <template v-if="!isLoading && !hasInput">
          <p class="none-text">表示できる日報カテゴリがありません</p>
        </template>
        <vue-loading
          v-if="isLoading"
          type="spin"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
      </div>
      <button-menu
        v-if="displayButtonsRule"
        class="button-menu"
        :post-validation="hasEmptyformatContents"
        :save-validation="dailyReportDraftModal"
        :is-draft="input.is_draft"
        @draftAll="clickDraftAllButton"
        @draftSave="clickDraftSaveButton"
        @draftUpdate="clickDraftUpdateButton"
        @preview="clickPreviewButton"
        @post="clickPostButton"
      />
      <daily-report-draft-modal
        v-if="dailyReportDraftModal"
        @click="clickDraftItem"
        @close="closeDailyReportDraftModal"
      />
      <daily-report-preview-modal
        v-if="dailyReportPreviewModal"
        @close="closeDailyReportPreviewModal"
      >
        <daily-report-detail
          :daily-report="dailyReport"
          :achievement-rate-disabled="!isAchievementRate"
          preview
        />
      </daily-report-preview-modal>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import DailyReportSelect from '@/components/App/organisms/daily-report-create/Items/DailyReportSelect.vue';
import DailyReportDate from '@/components/App/organisms/daily-report-create/Items/DailyReportDate.vue';
import DailyReportAchievementLevel from '@/components/App/organisms/daily-report-create/Items/DailyReportAchievementLevel.vue';
import DailyReportContentItem from '@/components/App/organisms/daily-report-create/Items/DailyReportContentItem.vue';
import ButtonMenu from '@/components/App/organisms/daily-report-create/Items/ButtounMenu.vue';
import DailyReportDraftModal from '@/components/App/organisms/daily-report-create/Modal/DailyReportDraftModal.vue';
import DailyReportPreviewModal from '@/components/App/organisms/daily-report-create/Modal/DailyReportPreviewModal.vue';
import DailyReportDetail from '@/components/App/organisms/daily-report-detail/DailyReportDetail.vue';

import dayjs from '@/libs/dayjs';
import { VueLoading } from 'vue-loading-template';
import {
  fetchDailyReportDetail,
  postDailyReport,
  fetchChooseableDailyReportSettings,
  updateDailyReport,
} from '@/libs/api/app';

interface Input extends AppApiRequest.DailyReport {
  items: AppApiResponse.DailyReportItem[];
}

export default Vue.extend({
  components: {
    DailyReportSelect,
    DailyReportDate,
    DailyReportAchievementLevel,
    DailyReportContentItem,
    ButtonMenu,
    DailyReportDraftModal,
    DailyReportPreviewModal,
    DailyReportDetail,
    VueLoading,
  },
  data: () => ({
    dailyReportSettings: [] as AppApiResponse.DailyReportSettingItem[],
    selectedDailyReportSettingItem: '' as string,
    input: {} as Input,
    dailyReportDraftModal: false as boolean,
    dailyReportPreviewModal: false as boolean,
    isLoading: false as boolean,
    editDraftUuid: '' as string,
  }),
  computed: {
    hasInput(): boolean {
      return Object.keys(this.input).length > 0;
    },
    hasDailyReportSettings(): boolean {
      return this.dailyReportSettings.length > 0;
    },
    selectedDailyReportSettingItemDetail():
      | AppApiResponse.DailyReportSettingItem
      | undefined {
      return this.dailyReportSettings.find(
        (item: AppApiResponse.DailyReportSettingItem) =>
          item.uuid === this.selectedDailyReportSettingItem
      );
    },
    isAchievementRateRequired(): boolean {
      const item = this.selectedDailyReportSettingItemDetail;
      if (item != null) {
        return item.is_achievement_rate_required;
      }
      return false;
    },
    displayButtonsRule(): boolean {
      return !(this.dailyReportDraftModal || this.dailyReportPreviewModal);
    },
    hasEmptyformatContents(): boolean {
      if (this.hasInput) {
        const items = this.input.items.map(
          (item: AppApiRequest.DailyReportItem) => item.content === ''
        );
        return items.includes(true);
      }
      return true;
    },
    dailyReport(): AppApiResponse.DailyReportDetail {
      return {
        uuid: '',
        ...this.input,
        title: this.selectedDailyReportSettingItemDetail!.title,
        user: {
          uuid: this.$accessor.userProfile.uuid as string,
          name: this.$accessor.userProfile.name as string,
          icon: this.$accessor.userProfile.user_icon as string,
          organization_name: this.$accessor.userProfile
            .organization_name as string,
          organization_uuid: this.$accessor.userProfile
            .organization_uuid as string,
        },
      };
    },
  },
  async created() {
    this.isLoading = true;
    try {
      await this.fetchChooseableDailyReportSettings();
      if (this.dailyReportSettings.length > 0) {
        this.selectedDailyReportSettingItem = this.dailyReportSettings[0].uuid;
        this.substitutionInput();
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    substitutionInput() {
      const selectedItem = this.selectedDailyReportSettingItemDetail;
      if (selectedItem != null) {
        this.input = {
          daily_report_setting_uuid: this.selectedDailyReportSettingItem,
          posted_at: dayjs().unix(),
          achievement_rate: 0,
          items: selectedItem.format_items.map(
            (formatItem: AppApiResponse.FormatItem) => {
              return {
                uuid: formatItem.uuid,
                name: formatItem.name,
                content: '',
              };
            }
          ),
          is_draft: false,
        };
      }
    },
    selectedDailyReportSettings(uuid: string) {
      this.selectedDailyReportSettingItem = uuid;
      this.substitutionInput();
    },
    changePostedAt(date: number) {
      this.input.posted_at = date;
    },
    openDailyReportDraftModal() {
      this.dailyReportDraftModal = true;
    },
    closeDailyReportDraftModal() {
      this.dailyReportDraftModal = false;
    },
    clickDraftAllButton() {
      this.openDailyReportDraftModal();
    },
    clickDraftSaveButton() {
      this.input.is_draft = true;
      this.postDailyReport();
      this.clearData();
    },
    clickDraftUpdateButton() {
      this.updateDailyReport();
      this.openDailyReportDraftModal();
      this.clearData();
    },
    clickPreviewButton() {
      this.dailyReportPreviewModal = true;
    },
    closeDailyReportPreviewModal() {
      this.dailyReportPreviewModal = false;
    },
    clickPostButton() {
      // 下書き一覧から選択した日報を投稿する
      if (this.editDraftUuid !== '') {
        this.input.is_draft = false;
        this.updateDailyReport();
      }
      // 日報を投稿する
      if (this.editDraftUuid === '') {
        this.postDailyReport();
      }
      this.onClose();
    },
    changeAchievementLevel(value: number) {
      this.input.achievement_rate = value;
    },
    changeContent(value: AppApiResponse.DailyReportItem) {
      const selectedItem = this.selectedDailyReportSettingItemDetail;

      if (selectedItem != null) {
        this.input.items = this.input.items.map(
          (item: AppApiResponse.DailyReportItem) => {
            if (item.uuid === value.uuid) {
              return {
                ...item,
                content: value.content,
              };
            }
            return item;
          }
        );
      }
    },
    clearData() {
      this.input = {
        daily_report_setting_uuid: '',
        posted_at: dayjs().unix(),
        achievement_rate: 0,
        items: this.input.items.map((item: AppApiResponse.DailyReportItem) => {
          return {
            ...item,
            content: '',
          };
        }),
        is_draft: false,
      };

      const [item0, ,] = this.dailyReportSettings;
      this.selectedDailyReportSettingItem = item0.uuid;
      this.editDraftUuid = '';
    },
    clickDraftItem(uuid: string) {
      this.fetchDraftEditItem(uuid);
      this.closeDailyReportDraftModal();
      this.editDraftUuid = uuid;
    },
    async fetchDraftEditItem(uuid: string) {
      try {
        const { data } = await fetchDailyReportDetail(uuid);
        this.input = {
          daily_report_setting_uuid: data.daily_report_setting_uuid,
          posted_at: data.posted_at,
          achievement_rate: data.achievement_rate,
          items: data.items,
          is_draft: true,
        };
      } catch (e) {
        console.log(e);
      }
    },
    async postDailyReport() {
      try {
        await postDailyReport({
          daily_report_setting_uuid: this.input.daily_report_setting_uuid,
          posted_at: this.input.posted_at,
          achievement_rate: this.input.achievement_rate,
          items: this.input.items.map(
            (item: AppApiResponse.DailyReportItem) => ({
              uuid: item.uuid,
              content: item.content,
            })
          ),
          is_draft: this.input.is_draft,
        });
      } catch (e) {
        console.log(e);
      }
    },
    async updateDailyReport() {
      try {
        await updateDailyReport(this.editDraftUuid, {
          daily_report_setting_uuid: this.input.daily_report_setting_uuid,
          posted_at: this.input.posted_at,
          achievement_rate: this.input.achievement_rate,
          items: this.input.items.map(
            (item: AppApiResponse.DailyReportItem) => ({
              uuid: item.uuid,
              content: item.content,
            })
          ),
          is_draft: this.input.is_draft,
        });
      } catch (e) {
        console.log(e);
      }
    },
    async fetchChooseableDailyReportSettings() {
      try {
        const { data } = await fetchChooseableDailyReportSettings();
        this.dailyReportSettings = data.target_settings;
      } catch (e) {
        console.log(e);
      }
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
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 800px;
  height: 96%;
  background: $true_white;
  border-radius: 4px;
  position: relative;
  padding: 0 0 70px 0;
}

.icon-cross-wrapper {
  position: absolute;
  top: 0;
  right: calc(-25px + -25px);
}

.icon-cross {
  cursor: pointer;
  width: 25px;
}

.modal-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 30px 20px;
  padding: 24px 0 0;
  border-top: 1px solid $ruled_line;
}

.button {
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  background-color: $light_gray_blue_7;
  font-weight: bold;
  color: $gray_blue_4;
  width: 100%;
  height: 40px;

  &:first-of-type {
    margin: 0 10px 0 0;
  }
}

// オーバーレイのトランジション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  // オーバーレイに包含されているモーダルウィンドウのトランジション
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

// ディレイを付けるとモーダルウィンドウが消えた後にオーバーレイが消える
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

.modal-content {
  padding: 40px 40px 0;
  height: 100%;
  overflow-y: scroll;
}

.none-text {
  margin: 50% auto;
}

.border {
  margin: 0 0 32px;
  border-bottom: 1px solid $ruled_line;
  width: 100%;
}

.daily-report-select {
  margin: 0 0 23px;
}

.daily-report-date {
  margin: 0 0 20px;
}

.daily-report-achievement-level {
  margin: 0 0 32px;
}

.daily-report-content-item {
  margin: 0 -40px 0;
}
</style>
