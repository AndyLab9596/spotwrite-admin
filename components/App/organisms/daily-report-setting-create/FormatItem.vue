<template>
  <div class="format-wrapper">
    <title-item :title="title" />
    <template v-for="item in formats">
      <div :key="item.uuid" class="format-contents">
        <p class="format-name">{{ item.name }}</p>
        <div class="format-right-contents">
          <p class="preview-text" @click="clickPreview(item.uuid)">
            プレビュー
          </p>
          <BaseButton
            inverse
            size="large"
            class="edit-button"
            @click="clickEdit(item.uuid)"
          >
            編集
          </BaseButton>
          <BaseButton
            inverse
            size="large"
            class="select-button"
            :class="{
              'select-button-active': selectedFormatUuid === item.uuid,
            }"
            @click="clickSelect(item.uuid)"
          >
            {{ selectText(item.uuid) }}
          </BaseButton>
        </div>
      </div>
    </template>
    <format-item-preview-modal
      v-if="formatItemPreviewModal"
      :preview="preview"
      :is-loading="previewLoading"
      @close="closeFormatItemPreviewModal"
    />
    <format-edit-modal
      v-if="formatEditModal"
      :uuid="editUuid"
      @close="toggleFormatEditModal"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import TitleItem from '@/components/App/organisms/daily-report-setting-create/common-items/TitleItem.vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import FormatItemPreviewModal from '@/components/App/organisms/daily-report-setting-create/FormatItemPreviewModal.vue';
import FormatEditModal from '@/components/App/organisms/daily-report-settings/Modal/FormatEditModal.vue';
import { fetchDailyReportFormat } from '@/libs/api/app';

type Preview = {
  is_achievement_rate_required: boolean;
  items: AppApiResponse.FormatItem[];
};

export default Vue.extend({
  components: {
    TitleItem,
    BaseButton,
    FormatItemPreviewModal,
    FormatEditModal,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    formats: {
      type: Array as PropType<AppApiResponse.DailyReportFormat[]>,
      required: true,
    },
    selectedFormatUuid: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    format: {} as AppApiResponse.DailyReportDetailFormat,
    formatItemPreviewModal: false as boolean,
    previewInput: {} as AppApiRequest.DailyReport,
    editUuid: '' as string,
    formatEditModal: false as boolean,
    preview: {} as Preview,
    previewLoading: false as boolean,
  }),
  methods: {
    toggleFormatEditModal() {
      this.formatEditModal = !this.formatEditModal;
    },
    clickEdit(uuid: string) {
      this.editUuid = uuid;
      this.fetchDailyReportFormat(uuid);
      this.toggleFormatEditModal();
    },
    clickSelect(uuid: string) {
      this.$emit('select', uuid);
    },
    async clickPreview(uuid: string) {
      this.previewLoading = true;
      this.openFormatItemPreviewModal();
      await this.fetchDailyReportFormat(uuid);
      await this.setPreviewItem();
      this.previewLoading = false;
    },
    selectText(uuid: string): string {
      return this.selectedFormatUuid === uuid ? '選択中' : '選択';
    },
    openFormatItemPreviewModal() {
      this.formatItemPreviewModal = true;
    },
    closeFormatItemPreviewModal() {
      this.formatItemPreviewModal = false;
    },
    async fetchDailyReportFormat(uuid: string): Promise<void> {
      try {
        const { data } = await fetchDailyReportFormat(uuid);
        this.format = data;
      } catch (e) {
        console.log(e);
      }
    },
    setPreviewItem() {
      this.preview = {
        is_achievement_rate_required: this.format.is_achievement_rate_required,
        items: this.format.items.map((item: AppApiResponse.FormatItem) => {
          return {
            uuid: item.uuid,
            name: item.name,
            content: '',
          };
        }),
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.format-contents {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 40px;
  border-bottom: 1px solid $ruled_line;
}

.format-name {
  font-size: 15px;
  color: $main_color;
  font-weight: 300;
}

.format-right-contents {
  display: flex;
  align-items: center;
}

.preview-text {
  font-size: 13px;
  color: $link_color;
  font-weight: 300;
  cursor: pointer;
  margin: 0 16px 0 0;
}

.select-button {
  &-active {
    background-color: $link_color;
    color: $true-white;
    border: none;
  }
}

.edit-button {
  margin: 0 8px 0 0;
}

.select-button,
.edit-button {
  height: 32px;
  width: 80px;
}
</style>
