<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="icon-cross-wrapper" @click="onClose">
          <img src="/app/icon/cross-white.svg" class="icon-cross" />
        </div>
        <div v-if="displayContents" class="modal-content-wrapper">
          <p class="modal-title">フォーマットの編集</p>
          <div class="modal-content">
            <achievement-of-goals
              :is-achievement="input.is_achievement_rate_required"
              class="achievement"
              @changeAchievement="changeAchievement"
            />
            <div class="scroll-contents">
              <select-format-item-with-icon
                v-for="item in selectedFormatItems"
                :key="item.uuid"
                :item="item"
                class="format-button"
                @delete="deleteFormatItem"
              />
              <select-formats
                :items="formatItems"
                :selected-format-item-uuids="selectedFormatItemUuids"
                @select="selectFormat"
                @reset="resetSelectFormat"
              />
            </div>
          </div>
          <button-menu
            class="button-menu"
            :post-validation="hasPostValidationError"
            @cancel="onClose"
            @post="clickPostButton"
          />
        </div>
        <vue-loading
          v-if="isLoading"
          type="spin"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import ButtonMenu from '@/components/App/organisms/daily-report-settings/Modal/Items/ButtounMenu.vue';
import SelectFormatItemWithIcon from '@/components/App/organisms/daily-report-settings/Modal/Items/SelectFormatItemWithIcon.vue';
import SelectFormats from '@/components/App/organisms/daily-report-settings/Modal/Items/SelectFormats.vue';
import AchievementOfGoals from '@/components/App/organisms/daily-report-settings/Modal/Items/AchievementOfGoals.vue';
import { VueLoading } from 'vue-loading-template';
import {
  fetchDailyReportFormat,
  updateDailyReportFormat,
  fetchDailyReportFormatItems,
} from '@/libs/api/app';

export default Vue.extend({
  components: {
    ButtonMenu,
    SelectFormatItemWithIcon,
    SelectFormats,
    VueLoading,
    AchievementOfGoals,
  },
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    input: {} as AppApiRequest.DailyReportFromat,
    selectedFormatItems: [] as AppApiResponse.FormatItem[],
    firstSelectedFormatItems: [] as AppApiResponse.FormatItem[],
    formatItems: [] as AppApiResponse.FormatItem[],
    isLoading: false as boolean,
  }),
  computed: {
    displayContents(): boolean {
      return this.hasInput && !this.isLoading;
    },
    hasInput(): boolean {
      return Object.keys(this.input).length > 0;
    },
    selectedFormatItemUuids(): string[] {
      return this.selectedFormatItems.map(
        (item: AppApiResponse.FormatItem) => item.uuid
      );
    },
    hasPostValidationError(): boolean {
      return this.selectedFormatItems.length === 0;
    },
  },
  async created() {
    this.isLoading = true;
    try {
      await Promise.all([
        this.fetchDailyReportFormat(),
        this.fetchDailyReportFormatItems(),
      ]);
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
    clickPostButton() {
      this.updateDailyReportFormat();
      this.onClose();
    },
    changeAchievement(value: boolean) {
      this.input.is_achievement_rate_required = value;
    },
    deleteFormatItem(deleteUuid: string) {
      this.input.item_uuids = this.input.item_uuids.filter(
        (uuid: string) => uuid !== deleteUuid
      );
      this.selectedFormatItems = this.selectedFormatItems.filter(
        (item: AppApiResponse.FormatItem) => item.uuid !== deleteUuid
      );
    },
    selectFormat(value: AppApiResponse.FormatItem) {
      const uuids = this.selectedFormatItemUuids;

      if (uuids.includes(value.uuid)) {
        this.selectedFormatItems = this.selectedFormatItems.filter(
          (item: AppApiResponse.FormatItem) => item.uuid !== value.uuid
        );
        return;
      }
      this.selectedFormatItems = [...this.selectedFormatItems, value];
    },
    resetSelectFormat() {
      this.selectedFormatItems = this.firstSelectedFormatItems;
    },
    async fetchDailyReportFormat() {
      try {
        const { data } = await fetchDailyReportFormat(this.uuid);
        this.input = {
          is_achievement_rate_required: data.is_achievement_rate_required,
          item_uuids: data.items.map(
            (item: AppApiResponse.FormatItem) => item.uuid
          ),
        };
        this.selectedFormatItems = data.items;
        this.firstSelectedFormatItems = data.items;
      } catch (e) {
        console.log(e);
      }
    },
    async fetchDailyReportFormatItems() {
      try {
        const { data } = await fetchDailyReportFormatItems();
        this.formatItems = data.daily_report_format_items;
      } catch (e) {
        console.log(e);
      }
    },
    async updateDailyReportFormat() {
      try {
        // TODO:  API連携お願いします
        await updateDailyReportFormat(this.uuid, this.input);
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
  background: $true_white;
  border-radius: 4px;
  position: relative;
  height: 522px;
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

.modal-content-wrapper {
  padding: 40px 40px;
}

.scroll-contents {
  height: 264px;
  overflow-y: scroll;
}

.modal-title {
  color: $main_color;
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 24px 0;
}

.none-text {
  margin: 32% auto;
}

.format-button {
  margin: 0 0 8px 0;
}

.achievement {
  margin: 0 0 17px;
}
</style>
