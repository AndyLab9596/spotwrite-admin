<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="icon-cross-wrapper" role="button" @click="onClose">
          <img src="/app/icon/cross-white.svg" class="icon-cross" alt="close" />
        </div>

        <div
          v-if="!isFirst"
          class="circle-button left"
          role="button"
          @click="prev"
        >
          <img src="/app/icon/arrow_left.svg" alt="prev" />
        </div>
        <div
          v-if="!isLast"
          class="circle-button right"
          role="button"
          @click="next"
        >
          <img src="/app/icon/arrow_right.svg" alt="next" />
        </div>

        <div class="modal-content">
          <div v-if="Object.keys(dailyReport).length > 0 && !isLoading">
            <daily-report-detail :daily-report="dailyReport" :preview="true" />
          </div>
          <div v-if="isLoading" class="loading">
            <vue-loading type="spin" color="#333" :size="{ width: '50px' }" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { VueLoading } from 'vue-loading-template';
import { fetchDailyReportDetail } from '@/libs/api/app';
import DailyReportDetail from '@/components/App/organisms/daily-report-detail/DailyReportDetail.vue';

export default Vue.extend({
  components: {
    DailyReportDetail,
    VueLoading,
  },
  props: {
    dailyReportUuid: {
      type: String,
      required: true,
    },
    dailyReportUuidList: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  data() {
    return {
      dailyReportIndex: 0,
      dailyReport: {} as AppApiResponse.DailyReportDetail,
      isLoading: false as boolean,
    };
  },
  computed: {
    currentUuid(): string {
      return this.dailyReportUuidList[this.dailyReportIndex];
    },
    isFirst(): boolean {
      return this.dailyReportIndex === 0;
    },
    isLast(): boolean {
      return this.dailyReportIndex === this.dailyReportUuidList.length - 1;
    },
  },
  created() {
    this.dailyReportIndex = this.dailyReportUuidList.indexOf(
      this.dailyReportUuid
    );
    this.fetchDailyReportDetail();
  },
  methods: {
    async fetchDailyReportDetail() {
      this.isLoading = true;
      const { data } = await fetchDailyReportDetail(this.currentUuid);
      this.dailyReport = data;
      this.isLoading = false;
    },
    onClose() {
      this.$emit('close');
    },
    prev() {
      if (this.dailyReportIndex >= 0) {
        this.dailyReportIndex -= 1;
        this.fetchDailyReportDetail();
      }
    },
    next() {
      if (this.dailyReportIndex < this.dailyReportUuidList.length) {
        this.dailyReportIndex += 1;
        this.fetchDailyReportDetail();
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
  height: 100%;
  overflow-y: scroll;
}

.content-header {
  padding: 40px 40px 0;

  .modal-title {
    color: $dark_blue;
    font-size: 15px;
    font-weight: bold;
    font-family: 'Lato', sans-serif;
  }
}

.circle-button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 40px;
  width: 40px;
  background-color: $true_white;
  border-radius: 50px;
  top: 40%;
  cursor: pointer;

  &.left {
    left: -66px;
  }

  &.right {
    right: -66px;
  }
}

.daily-report-contents {
  margin-top: 32px;
}

.loading {
  display: flex;
  align-items: center;
  height: 800px;
}
</style>
