<template>
  <transition name="modal" appear>
    <div class="modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <PostDraftModalHeader title="下書き一覧" />
        <div class="content-body">
          <post-draft-item
            v-for="(item, index) in sortDraftDailyReports"
            :key="index"
            :title="item.title"
            :drafted-at="item.drafted_at"
            :post-uuid="item.uuid"
            @trash="clickTrashButton"
            @click="clickItem"
          />
          <p
            v-if="!isLoading && draftDailyReports.length === 0"
            class="none-text"
          >
            表示できる下書きがありません
          </p>
          <vue-loading
            v-if="isLoading"
            type="spin"
            color="#333"
            :size="{ width: '50px', height: '50px' }"
          ></vue-loading>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import PostDraftItem from '@/components/App/organisms/post/PostDraftModal/PostDraftItem.vue';
import PostDraftModalHeader from '@/components/App/organisms/post/PostDraftModal/Header.vue';
import { VueLoading } from 'vue-loading-template';
import { fetchDraftDailyReports, deleteDailyReport } from '@/libs/api/app';

export default Vue.extend({
  components: {
    PostDraftModalHeader,
    PostDraftItem,
    VueLoading,
  },
  data: () => ({
    draftDailyReports: [] as AppApiResponse.DraftDailyReport[],
    isLoading: false as boolean,
  }),
  computed: {
    sortDraftDailyReports(): AppApiResponse.DraftDailyReport[] {
      return this.draftDailyReports
        .slice()
        .sort(
          (
            a: AppApiResponse.DraftDailyReport,
            b: AppApiResponse.DraftDailyReport
          ) => b.drafted_at - a.drafted_at
        );
    },
  },
  created() {
    this.fetchDraftDailyReports();
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    clickItem(uuid: string) {
      this.$emit('click', uuid);
    },
    clickTrashButton(uuid: string) {
      this.deleteDailyReport(uuid);
      this.draftDailyReports = this.draftDailyReports.filter(
        (item: AppApiResponse.DraftDailyReport) => item.uuid !== uuid
      );
    },
    async fetchDraftDailyReports() {
      this.isLoading = true;
      try {
        const { data } = await fetchDraftDailyReports();
        this.draftDailyReports = data.draft_daily_reports;
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteDailyReport(uuid: string) {
      try {
        await deleteDailyReport(uuid);
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
  width: 800px;
  overflow-y: scroll;
  height: 100%;
  padding-bottom: 80px;
  background-color: $true_white;
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

.content-body {
  padding: 0 40px;
}

.none-text {
  margin: 50% auto;
  text-align: center;
}
</style>
