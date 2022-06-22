<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="マスタ設定">
        <template #tutorial>
          <TutorialButtonIcon :url="tutorialUrl"></TutorialButtonIcon>
        </template>
        <template #description>
          投稿ルールなどspotwriteを利用するさいに必要な設定ができます。
        </template>
      </page-header>

      <base-tabs
        :items="[
          { id: '1', name: '投稿ルール・アラート' },
          { id: '2', name: '雇用形態・役職' },
          { id: '3', name: '職種' },
          { id: '4', name: 'プロフィール' },
          { id: '5', name: '在籍掲示板' },
        ]"
        :current-id="currentId"
        @change-tab="changeTab"
      />

      <posting-rules-and-alert v-if="currentId === '1'" />
      <employment-status-and-position v-if="currentId === '2'" />
      <occupation v-if="currentId === '3'" />
      <profile-setting v-if="currentId === '4'" />
      <inventory-bulletin-board-modal v-if="currentId === '5'" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  PostingRulesAndAlert,
  EmploymentStatusAndPosition,
  Occupation,
  ProfileSetting,
  InventoryBulletinBoardModal,
} from '@/components/Admin/Pages/';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import BaseTabs from '@/components/Admin/Modules/Tab/BaseTabs.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    PostingRulesAndAlert,
    EmploymentStatusAndPosition,
    Occupation,
    ProfileSetting,
    InventoryBulletinBoardModal,
    PageHeader,
    BaseTabs,
    TutorialButtonIcon,
  },
  data() {
    return {
      currentId: '1',
    };
  },
  computed: {
    tutorialUrl() {
      let url = '';
      switch (this.currentId) {
        case '1':
          url = '/admin/tutorial/master-setting.html';
          break;
        case '2':
          url = '/admin/tutorial/master-setting-employment.html';
          break;
        case '3':
          url = '/admin/tutorial/master-setting-job.html';
          break;
        case '4':
          url = '/admin/tutorial/master-setting-profile.html';
          break;
        case '5':
          url = '/admin/tutorial/master-setting-enrollment.html';
          break;
        default:
          break;
      }
      return url;
    },
  },
  methods: {
    changeTab(id: string) {
      this.currentId = id;
    },
  },
});
</script>

<style lang="scss" scoped>
.l-page-container {
  padding-bottom: 40px;
}

.toggle-procedure {
  font-weight: bold;
  cursor: pointer;
}

.procedure {
  height: 200px;
  background-color: $true_white;
  padding: 16px;

  &-title {
    font-size: 16px;
    font-weight: bold;
  }
}

.other-means {
  margin-top: 30px;
}

.base-tabs {
  margin-top: 28px;
  margin-bottom: 15px;
}

.tab-active {
  background-color: $true_white;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  font-weight: bold;
  color: $dark_blue;
}

.contents {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $true_white;
  margin-top: 14px;
  padding: 14px 30px;
}
</style>
