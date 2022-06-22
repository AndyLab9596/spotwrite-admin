<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="メンバー情報の登録" class="page-title">
        <template #tutorial>
          <TutorialButtonIcon :url="tutorialUrl" />
        </template>
      </page-header>
      <base-tabs
        :items="[
          { id: '1', name: 'ビジネスデータ' },
          { id: '2', name: `プロフィール<br/>配属先履歴` },
          { id: '3', name: 'Q & A' },
          { id: '4', name: 'メンタルデータ' },
          { id: '5', name: 'ログイン情報の変更' },
        ]"
        :current-id="currentId"
        :disabled-items="disabledMentalCheck"
        @change-tab="changeTab"
      />
      <business-data
        v-if="currentId === '1'"
        :company-uuid="companyUuid"
        :user-uuid="userUuid"
        :user-authorities="userAuthorities"
      />
      <profile
        v-if="currentId === '2'"
        :company-uuid="companyUuid"
        :user-authorities="userAuthorities"
      />
      <q-and-a
        v-if="currentId === '3'"
        :user-uuid="userUuid"
        :user-authorities="userAuthorities"
      />
      <change-password
        v-if="currentId === '5'"
        :user-uuid="userUuid"
        :user-authorities="userAuthorities"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  BusinessData,
  Profile,
  QAndA,
  ChangePassword,
} from '@/components/Admin/Pages/';
import { fetchUser } from '@/libs/api';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import BaseTabs from '@/components/Admin/Pages/Employees/BaseTabs.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    BusinessData,
    Profile,
    QAndA,
    ChangePassword,
    PageHeader,
    BaseTabs,
    TutorialButtonIcon,
  },
  data() {
    return {
      currentId: '1',
      companyUuid: this.$route.query.uuid,
      userUuid: this.$route.params.id === 'create' ? '' : this.$route.params.id,
      userAuthorities: [] as string[],
    };
  },
  computed: {
    active() {
      return (id: number): boolean => {
        return this.$data.currentId === id;
      };
    },
    disabledMentalCheck() {
      const disabledItems = [];
      if (!this.userAuthorities.includes('read_personal_information')) {
        disabledItems.push('4');
      }
      return disabledItems;
    },
    tutorialUrl() {
      let url = '';
      switch (this.currentId) {
        case '1':
          url = '/admin/tutorial/member-information-registration.html';
          break;
        case '2':
          url = '/admin/tutorial/member-information-profile.html';
          break;
        case '3':
          url = '/admin/tutorial/member-information-question.html';
          break;
        case '4':
          url = '/admin/tutorial/member-information-motivation.html';
          break;
        case '5':
          url = '/admin/tutorial/member-information-login.html';
          break;
        default:
          break;
      }
      return url;
    },
  },
  async created() {
    if (!this.$accessor.userProfile.is_account_holder) {
      const {
        data: { authorities },
      } = await fetchUser(this.$accessor.userProfile.uuid);
      this.userAuthorities = Object.keys(authorities).filter(
        (authorityKey: string) =>
          authorities[authorityKey] &&
          (authorityKey === 'read_personal_information' ||
            authorities[authorityKey].length)
      );
    }
  },
  methods: {
    async changeCompanyTab($event: string) {
      // @ts-ignore
      this.currentUuid = $event;
    },
    moveToMentalCheck() {
      this.$router.push(
        `/admin/analysis/mentalCheck/employees/${this.userUuid}`
      );
    },
    changeTab(id: string) {
      if (id === '4') {
        this.moveToMentalCheck();
      }
      this.currentId = id;
    },
  },
});
</script>

<style lang="scss" scoped>
.page-title {
  margin-bottom: 35px;
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

.tabs {
  margin-top: 28px;
  padding-bottom: 4px;
}
</style>
