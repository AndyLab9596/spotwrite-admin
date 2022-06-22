<template>
  <div>
    <form v-if="!isLoading" class="form l-contents" @submit.prevent="onSubmit">
      <div class="contents-container">
        <div class="contents-row">
          <limit-forms
            :rules="rules.my_episode"
            :min-words="minWords"
            :inspection-rights="inspectionRights"
            :min-photos="minPhotos"
            title="マイエピソード"
          ></limit-forms>
        </div>
        <div class="contents-row">
          <limit-forms
            :rules="rules.team_episode"
            :min-words="minWords"
            :inspection-rights="inspectionRights"
            :min-photos="minPhotos"
            title="チームエピソード"
          ></limit-forms>
        </div>
        <div class="contents-row">
          <limit-forms
            :rules="rules.community_team_episode"
            :min-words="minWords"
            :inspection-rights="inspectionRights"
            :min-photos="minPhotos"
            title="コミュニティ チームエピソード"
          ></limit-forms>
        </div>
      </div>
      <base-button
        size="large"
        :disabled="isSending"
        class="submit-button"
        @click="onSubmit"
      >
        保存する
      </base-button>
    </form>
    <vue-loading
      v-if="isLoading"
      type="spin"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    ></vue-loading>
    <success-message
      v-if="successMessageModal"
      @close="toggleSuccessMessageModal"
    >
      入力された情報が保存されました。
    </success-message>
    <alert-message
      v-if="alertMessageModal"
      button-text="OK"
      @close="closeAlertMessageModal"
    >
      投稿頻度が正しく設定されていません。 もう一度選択し直してください。
    </alert-message>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { fetchConfigRules, updateConfigRules } from '@/libs/api';
import { VueLoading } from 'vue-loading-template';
import SuccessMessage from '@/components/Admin/Modules/Modal/SuccessMessage.vue';
import AlertMessage from '@/components/Admin/Modules/Modal/AlertMessage.vue';
import LimitForms from '@/components/Admin/Pages/MasterSetting/LimitForms.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: {
    VueLoading,
    SuccessMessage,
    AlertMessage,
    LimitForms,
    BaseButton,
  },
  data() {
    return {
      isSending: false,
      isLoading: false,
      responseValue: {},
      alertMessageModal: false as boolean,
      successMessageModal: false as boolean,
      rules: {
        my_episode: {
          slowly: '',
          normal: '',
          frequent: '',
          min_word_count: 0,
          min_photo_count: 0,
          inspection_rights: '',
        },
        team_episode: {
          slowly: '',
          normal: '',
          frequent: '',
          min_word_count: 0,
          min_photo_count: 0,
          inspection_rights: '',
        },
        community_team_episode: {
          slowly: '',
          normal: '',
          frequent: '',
          min_word_count: 0,
          min_photo_count: 0,
          inspection_rights: '',
        },
        profile: {
          slowly: '',
          normal: '',
          frequent: '',
        },
        alert: {
          weak: '',
          normal: '',
          strong: '',
        },
      } as ApiResponse.ConfigRules,
      choices: [
        { id: 1, text: '3ヶ月', value: 'three_months' },
        { id: 2, text: '1ヶ月', value: 'month' },
        { id: 3, text: '一週間', value: 'week' },
        { id: 4, text: 'なし', value: 'none' },
      ],
      profileChoices: [
        { id: 1, text: '2年', value: 'two_years' },
        { id: 2, text: '1年', value: 'year' },
        { id: 3, text: '6ヶ月', value: 'six_months' },
        { id: 4, text: 'なし', value: 'none' },
      ],
      minWords: [
        { id: 1, text: '制限なし', value: 0 },
        { id: 2, text: '100', value: 100 },
        { id: 3, text: '150', value: 150 },
        { id: 4, text: '200', value: 200 },
        { id: 5, text: '250', value: 250 },
        { id: 6, text: '300以上', value: 300 },
      ],
      minPhotos: [
        { id: 1, text: '制限なし', value: 0 },
        { id: 2, text: '1枚', value: 1 },
        { id: 3, text: '2枚', value: 2 },
        { id: 4, text: '3枚以上', value: 3 },
      ],
      inspectionRights: [
        { id: 1, text: 'メンバー以上', value: 'member' },
        { id: 2, text: '準メンバー以上', value: 'associate_member' },
        { id: 3, text: 'ビジター以上', value: 'visitor' },
      ],
      alertChoices: [
        {
          id: 1,
          text: '期限切れの一週間前から毎日',
          value: 'everyday_one_week_before',
        },
        {
          id: 2,
          text: '期限切れの一週間前に1度',
          value: 'once_one_week_before',
        },
        { id: 3, text: '期限が切れた時に1度', value: 'once' },
      ],
      frequencyLabel: {
        three_months: 31 * 3,
        month: 31,
        week: 7,
        two_years: 365 * 2,
        year: 365,
        six_months: Math.floor(365 / 2),
      } as { [key: string]: number },
      alertLabel: {
        once: 1,
        once_one_week_before: 50,
        everyday_one_week_before: 100,
      } as { [key: string]: number },
    };
  },
  async mounted() {
    try {
      this.isLoading = true;
      const { data } = await fetchConfigRules();
      this.rules = data;
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    async onSubmit() {
      try {
        this.isSending = true;
        this.validateRules();
        if (!this.alertMessageModal) {
          await updateConfigRules(this.rules);
          this.toggleSuccessMessageModal();
        }
      } catch (err) {
        alert('更新に失敗しました');
      }
      this.isSending = false;
    },
    toggleSuccessMessageModal() {
      this.successMessageModal = !this.successMessageModal;
    },
    async closeAlertMessageModal() {
      try {
        const { data } = await fetchConfigRules();
        this.rules = data;
      } catch (err) {
        console.error(err);
      }
      this.alertMessageModal = false;
    },
    validateRules() {
      const myEpisodeFrequent = this.frequencyLabel[
        this.rules.my_episode.frequent
      ];
      const myEpisodeNormal = this.frequencyLabel[this.rules.my_episode.normal];
      const myEpisodeSlowly = this.frequencyLabel[this.rules.my_episode.slowly];
      const teamEpisodeEpisodeFrequent = this.frequencyLabel[
        this.rules.team_episode.frequent
      ];
      const teamEpisodeNormal = this.frequencyLabel[
        this.rules.team_episode.normal
      ];
      const teamEpisodeSlowly = this.frequencyLabel[
        this.rules.team_episode.slowly
      ];
      const communityTeamEpisodeEpisodeFrequent = this.frequencyLabel[
        this.rules.community_team_episode.frequent
      ];
      const communityTeamEpisodeNormal = this.frequencyLabel[
        this.rules.community_team_episode.normal
      ];
      const communityTeamEpisodeSlowly = this.frequencyLabel[
        this.rules.community_team_episode.slowly
      ];
      const profileEpisodeFrequent = this.frequencyLabel[
        this.rules.profile.frequent
      ];
      const profileNormal = this.frequencyLabel[this.rules.profile.normal];
      const profileSlowly = this.frequencyLabel[this.rules.profile.slowly];
      const alertStrong = this.alertLabel[this.rules.alert.strong];
      const alertNormal = this.alertLabel[this.rules.alert.normal];
      const alertWeak = this.alertLabel[this.rules.alert.weak];

      if (
        myEpisodeFrequent >= myEpisodeNormal ||
        myEpisodeNormal >= myEpisodeSlowly ||
        myEpisodeFrequent >= myEpisodeSlowly
      ) {
        this.alertMessageModal = true;
      }

      if (
        teamEpisodeEpisodeFrequent >= myEpisodeNormal ||
        teamEpisodeNormal >= teamEpisodeSlowly ||
        teamEpisodeEpisodeFrequent >= teamEpisodeSlowly
      ) {
        this.alertMessageModal = true;
      }

      if (
        communityTeamEpisodeEpisodeFrequent >= communityTeamEpisodeNormal ||
        communityTeamEpisodeNormal >= communityTeamEpisodeSlowly ||
        communityTeamEpisodeEpisodeFrequent >= communityTeamEpisodeSlowly
      ) {
        this.alertMessageModal = true;
      }

      if (
        profileEpisodeFrequent >= profileNormal ||
        profileNormal >= profileSlowly ||
        profileEpisodeFrequent >= profileSlowly
      ) {
        this.alertMessageModal = true;
      }

      if (
        alertStrong <= alertNormal ||
        alertNormal <= alertWeak ||
        alertStrong <= alertWeak
      ) {
        this.alertMessageModal = true;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.l-contents {
  padding: 34px 30px 30px;
}

.contents-container {
  display: flex;
  flex-flow: column;
}

.contents-row {
  display: flex;
  flex-flow: row;

  & + .contents-row {
    margin-top: 74px;
  }
}

.dotted-line {
  width: 100%;
  border: 1px solid $light_gray_blue_3;
  margin: -10px 0 14px 0;
}

.submit-button {
  width: 200px;
  margin: 10px auto 0;
}
</style>
