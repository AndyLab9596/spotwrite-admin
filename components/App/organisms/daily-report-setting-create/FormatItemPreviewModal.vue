<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="icon-cross-wrapper" @click="onClose">
          <img src="/app/icon/cross-white.svg" class="icon-cross" />
        </div>
        <div v-if="!isLoading" class="modal-content">
          <div class="none-event-content">
            <daily-report-select
              :is-preview-mode="true"
              class="daily-report-select"
            />

            <daily-report-date
              :selected-posted-at="today"
              class="daily-report-date"
            />

            <template v-if="preview.is_achievement_rate_required">
              <div class="border"></div>
              <daily-report-achievement-level
                :value="0"
                label="達成度"
                class="daily-report-achievement-level"
              />
            </template>

            <daily-report-content-item
              v-for="item in preview.items"
              :key="item.uuid"
              :item="item"
              class="daily-report-content-item"
            />
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
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DailyReportSelect from '@/components/App/organisms/daily-report-create/Items/DailyReportSelect.vue';
import DailyReportDate from '@/components/App/organisms/daily-report-create/Items/DailyReportDate.vue';
import DailyReportAchievementLevel from '@/components/App/organisms/daily-report-create/Items/DailyReportAchievementLevel.vue';
import DailyReportContentItem from '@/components/App/organisms/daily-report-create/Items/DailyReportContentItem.vue';
import dayjs from '@/libs/dayjs';
import { VueLoading } from 'vue-loading-template';

type Preview = {
  is_achievement_rate_required: boolean;
  items: AppApiResponse.FormatItem[];
};

export default Vue.extend({
  components: {
    DailyReportSelect,
    DailyReportDate,
    DailyReportAchievementLevel,
    DailyReportContentItem,
    VueLoading,
  },
  props: {
    preview: {
      type: Object as PropType<Preview>,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    today(): number {
      return dayjs().unix();
    },
  },
  methods: {
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
  padding: 40px 40px;
  height: 100%;
  overflow-y: scroll;
}

.none-event-content {
  pointer-events: none;
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
