<template>
  <div>
    <base-tabs
      :items="tabItems"
      :selected-tab="selectedTabId"
      :item-count-threshold="2"
      class="base-tabs"
      @change-tab="selectTab"
    />
    <profile
      v-if="selectedTabId === '1'"
      :tab-items="tabItems"
      :selected-tab-id="selectedTabId"
      :profile="profile"
      :languages="languages"
      :organizations="organizations"
      @onCangeTab="selectTab"
      @onProfileSave="onProfileSave"
      @onClose="onClose"
      @clickQAndAContinued="clickQAndAContinued"
    />
    <q-and-a
      v-if="selectedTabId === '2'"
      :tab-items="tabItems"
      :profile-qa="profileQa"
      :profile="profile"
      :organizations="organizations"
      :job-types="jobTypes"
      @onCangeTab="selectTab"
      @onQAndASave="onQAndASave"
      @onClose="onClose"
      @clickContinued="clickProfileContinued"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseTabs from '../../molecules/tabs/BaseTabs.vue';
import Profile from './ProfileContents.vue';
import QAndA from './QAndAContents.vue';

export default Vue.extend({
  components: {
    BaseTabs,
    Profile,
    QAndA,
  },
  props: {
    tabItems: {
      type: Array as PropType<AppTypes.TabItem[]>,
      required: true,
    },
    selectedTabId: {
      type: String,
      required: true,
    },
    profile: {
      type: Object as PropType<AppApiResponse.Profile>,
      required: true,
    },
    languages: {
      type: Array as PropType<AppApiResponse.Language[]>,
      required: true,
    },
    jobTypes: {
      type: Array as PropType<AppApiResponse.Job[]>,
      required: true,
    },
    organizations: {
      type: Array as PropType<AppApiResponse.Organization[]>,
      required: true,
    },
    profileQa: {
      type: Object as PropType<AppApiResponse.ProfileQuestionAndAnswers>,
      required: true,
    },
  },
  methods: {
    onClose() {
      this.$emit('onClose');
    },
    selectTab(id: string) {
      this.$emit('onCangeTab', id);
    },
    onProfileSave(item: AppApiRequest.Profile) {
      this.$emit('onProfileSave', item);
    },
    onQAndASave({
      qaPayload,
      profilePayload,
    }: {
      qaPayload: AppApiRequest.ProfileQuestionAndAnswers;
      profilePayload: AppApiRequest.Profile;
    }) {
      this.$emit('onQAndASave', {
        qaPayload,
        profilePayload,
      });
    },
    clickProfileContinued({
      qaPayload,
      profilePayload,
    }: {
      qaPayload: AppApiRequest.ProfileQuestionAndAnswers;
      profilePayload: AppApiRequest.Profile;
    }) {
      this.$emit('clickProfileContinued', { qaPayload, profilePayload });
    },
    clickQAndAContinued(value: AppApiRequest.Profile) {
      this.$emit('clickQAndAContinued', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.title {
  font-size: 20px;
  font-weight: 600;
  line-height: 1em;
  color: $gentle_bluish_purple;
  margin: 37px 0 32px 40px;
}

.profile-edit-contents {
  padding: 32px 48px 40px 46px;
}

.button-wrapper {
  padding: 72px 0 0;
  display: flex;
}

.close-button {
  width: 350px;
  background-color: $button_background_color;
  color: $gentle_bluish_purple;
  height: 44px;
  margin: 0 20px 0 0;
}

.save-button {
  width: 350px;
  background-color: $button_background_color;
  color: $gentle_bluish_purple;
  height: 44px;
}

.base-tabs {
  border-bottom: 1px solid $ruled_line;
}

.base-tabs /deep/ .tab {
  padding: 32px 0 24px;
}

.form-label {
  font-size: 15px;
  line-height: 1em;
  font-weight: 600;
  color: $main_color;
  margin: 0 0 16px 0;

  &:first-of-type {
    margin: 32px 0 16px;
  }
}

.form-sub-label {
  font-size: 15px;
  line-height: 1em;
  font-weight: 300;
  color: $sub_color;
  margin: 0 0 8px 0;
}

.select-box {
  margin: 0 0 24px 0;
}

.select-box /deep/ select {
  height: 44px;
}

.answer-rate {
  margin: 0 0 32px 0;
}

.form-textarea {
  width: 100%;
  color: $gentle_bluish_purple;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.7em;
  border-radius: 4px;
  background-color: $input_text_background_color;
  padding: 15px 16px;
  resize: vertical;
  border: 1px solid $ruled_line;
  min-height: 180px;
}

.form-input /deep/ .outline-label {
  padding: 0;
}

.form-input /deep/ .outline-input {
  color: $gentle_bluish_purple;
}

.birth-place-wrapper {
  display: flex;
  width: 100%;

  .select-box {
    margin: 0 24px 0 0;
    width: 50%;
  }

  .form-input {
    width: 50%;
  }
}

.birthday-wrapper {
  display: flex;
  align-items: flex-end;
  margin: 0 0 24px 0;

  .select-box {
    width: 100%;
    margin: 0 22px 0 0;
    color: $main-color;
    line-height: 1em;
  }
}

.join-wrapper {
  display: flex;
  align-items: flex-end;
  margin: 0 0 24px 0;

  .select-box {
    width: 100%;
    margin: 0 22px 0 0;
  }
}

.join-text,
.birthday-text {
  font-size: 15px;
  color: $main-color;
  line-height: 1em;
  margin: 0 23px 0 0;

  &:last-of-type {
    margin: 0;
  }
}

.profile-sub-organization {
  margin: 0 0 24px 0;
}
</style>
