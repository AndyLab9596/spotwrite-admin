<template>
  <div class="daily-report-card">
    <div class="user-info" :role="button" @click="goToUserProfile">
      <div>
        <img :src="dailyReport.user.icon" class="profile-icon" alt="icon" />
      </div>

      <div class="user">
        <div class="name">{{ dailyReport.user.name }}</div>
        <div class="organization">{{ dailyReport.user.organization_name }}</div>
      </div>
    </div>
    <div
      v-if="linkToDetailEnabled && !preview"
      class="daily-report"
      role="button"
      @click="$emit('show-detail')"
    >
      <div class="date">{{ date }}</div>
      <div class="title">{{ dailyReport.title }}</div>
    </div>
    <div v-else class="daily-report">
      <div class="date">{{ date }}</div>
      <div class="title">{{ dailyReport.title }}</div>
    </div>

    <div class="chat-button" :role="button" @click="chatTo">
      <img src="/app/icon/chat.svg" alt="chat" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from '@/libs/dayjs';

export default Vue.extend({
  props: {
    dailyReport: {
      type: Object as PropType<
        AppApiResponse.DailyReport | AppApiResponse.NotSubmittedDailyReport
      >,
      required: true,
    },
    linkToDetailEnabled: {
      type: Boolean,
      default: false,
    },
    preview: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    date(): string {
      const postedAt =
        'posted_at' in this.dailyReport
          ? this.dailyReport.posted_at
          : this.dailyReport.submission_date;
      return dayjs.unix(postedAt).format('YYYY/M/D (dd) HH:mm');
    },
    button(): string {
      return this.preview ? '' : 'button';
    },
  },
  methods: {
    chatTo() {
      // TODO: チャットのAPIを後々繋ぎ込む
      if (this.preview) this.$router.push(`/message`);
    },
    goToUserProfile() {
      if (this.preview)
        this.$router.push(`/users/${this.dailyReport.user.uuid}`);
    },
  },
});
</script>

<style lang="scss" scoped>
.daily-report-card {
  display: flex;
}

.user-info {
  display: flex;

  &[role='button'] {
    cursor: pointer;
  }
}

.user {
  margin-left: 15px;

  .name {
    font-size: 15px;
    font-weight: 600;
    color: $dark_blue;
  }

  .organization {
    color: $gray_blue_1;
    font-size: 11px;
  }
}

.daily-report {
  flex-grow: 1;
  margin-left: 68px;

  .date {
    font-size: 11px;
    color: $gray_blue_1;
  }

  .title {
    font-size: 15px;
    color: $dark_blue;
  }

  &[role='button'] {
    cursor: pointer;
  }
}

.chat-button {
  height: 40px;
  width: 40px;
  background-color: #89d3ca;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  &[role='button'] {
    cursor: pointer;
  }
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
}
</style>
