<template>
  <div class="profile-container">
    <div class="profile-row">
      <profile-labeled-text
        label="生年月日"
        class="profile-item"
        icon="birthday"
        >{{ birthday }}</profile-labeled-text
      >
      <profile-labeled-text label="性別" class="profile-item" icon="gender">{{
        genderName
      }}</profile-labeled-text>
    </div>
    <div class="profile-row">
      <profile-labeled-text label="出身地" class="profile-item" icon="gender">{{
        birthplace
      }}</profile-labeled-text>
      <profile-labeled-text
        v-if="userInfo.jobs"
        label="使用言語"
        class="profile-item"
        icon="human"
        >{{ languageNames }}</profile-labeled-text
      >
    </div>
    <div class="profile-row">
      <div class="profile-item">
        <div
          v-if="
            userInfo.profile_free_questions &&
              userInfo.profile_free_questions.length > 0
          "
          class="free-input-first-content"
        >
          <div>
            <avatar size="medium" :user-icon="userInfo.user_icon"></avatar>
            <p
              v-if="userInfo.profile_free_questions"
              class="free-input-first-heading"
            >
              {{ userInfo.profile_free_questions[0].content }}
            </p>
          </div>
          <div class="baloon-wrapper">
            <div v-if="userInfo.profile_free_questions" class="balloon">
              {{ userInfo.profile_free_questions[0].answer.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="
        userInfo.profile_free_questions &&
          userInfo.profile_free_questions.length > 0
      "
      class="profile-row"
    >
      <profile-labeled-text
        v-if="userInfo.profile_free_questions[1]"
        :label="userInfo.profile_free_questions[1].content"
        class="profile-item"
        icon="human"
      >
        {{ userInfo.profile_free_questions[1].answer.content }}
      </profile-labeled-text>
      <profile-labeled-text
        v-if="userInfo.profile_free_questions[2]"
        :label="userInfo.profile_free_questions[2].content"
        class="profile-item"
        icon="motto"
        >{{
          userInfo.profile_free_questions[2].answer.content
        }}</profile-labeled-text
      >
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { enumGenderTypes } from '@/libs/definition';
import dayjs from '@/libs/dayjs';
import ProfileLabeledText from '../../molecules/texts/ProfileLabeledText.vue';
import Avatar from '../../atoms/images/Avatar.vue';

type GenderType = {
  value: string;
  name: string;
};

export default Vue.extend({
  components: {
    ProfileLabeledText,
    Avatar,
  },
  model: {
    prop: 'selectedTab',
    event: 'clicked',
  },
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      enumGenderTypes: enumGenderTypes as GenderType[],
    };
  },
  computed: {
    birthday(): string {
      if (!this.userInfo.published_birthday) {
        return '非公開';
      }
      return dayjs.unix(this.userInfo.birthday).format('YYYY年MM月DD日');
    },
    jobNames(): string {
      return this.userInfo.jobs.map((job: any) => job.name).join(', ');
    },
    genderName(): string {
      const filteredGenderType = this.enumGenderTypes.find(
        (i: GenderType) => i.value === this.userInfo.gender
      );
      if (filteredGenderType) {
        return filteredGenderType.name;
      }
      return '';
    },
    birthplace(): string {
      if (this.userInfo.birthplace_country !== '日本') {
        return (
          (this.userInfo.birthplace_country || '') +
          (this.userInfo.birthplace_city || '')
        );
      }
      return [
        this.userInfo.birthplace_prefecture,
        this.userInfo.birthplace_city,
      ]
        .filter(
          (item: string | null) =>
            item !== 'null' && item != null && item.length > 0
        )
        .join(', ');
    },
    languageNames(): string {
      return [this.userInfo.main_language, ...this.userInfo.sub_languages]
        .filter((item: string | null) => item != null && item.length > 0)
        .join(', ');
    },
  },
  methods: {
    onTabClicked(clickedTab: string) {
      this.$emit('clicked', clickedTab);
    },
  },
});
</script>

<style lang="scss" scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  min-width: 600px;
  width: 100%;
  padding: 5px 20px;
  background-color: #fff;
  border-top: solid 1px #dce5ef;
  border-bottom: solid 1px #dce5ef;
}

.profile-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  &:not(:last-child) {
    border-bottom: dotted 2px #ccc;
  }
}

.profile-item {
  flex-grow: 1;
  margin: 16px 0;

  &:not(:last-child) {
    border-right: dotted 2px #ccc;
  }
}

.free-input-first-content {
  display: flex;
  flex-direction: row;
}

.free-input-first-heading {
  font-size: 13px;
  font-weight: 700;
  text-align: center;
}

.baloon-wrapper {
  width: 100%;
  margin-left: 20px;
}

.balloon {
  position: relative;
  padding: 7px 10px;
  width: 100%;
  color: #973;
  font-size: 13px;
  background: #fce9bf;
  border-radius: 10px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -20px;
    border-style: solid;
    border-color: #fce9bf transparent transparent;
    border-width: 20px;
  }
}
</style>
