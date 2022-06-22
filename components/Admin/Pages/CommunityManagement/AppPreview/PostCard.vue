<template>
  <div class="post-card-container">
    <div class="header-date-container">
      <div class="header-date-month">{{ dateMFormat }}</div>
      <div
        class="header-date-slash"
        :style="{
          width: `${Math.sqrt(2) * 46}px`,
          left: `${-(Math.sqrt(2) * 46 - 46) / 2}px`,
        }"
      />
    </div>
    <div class="header-container">
      <div class="header-date-day">{{ dateDFormat }}</div>
      <div class="header-title-text">{{ contentType }}</div>
      <div v-if="isNew" class="header-new">
        <img src="@/assets/image/new.png" alt="new post" />
      </div>
    </div>
    <div class="image-container">
      <div v-if="categoryName" class="category-label">
        <div class="category-icon" :class="categoryColor">
          <img :src="categoryIconPath" alt="category icon" />
        </div>
        <div
          class="category-name"
          :class="categoryColor"
          v-html="categoryName"
        ></div>
      </div>
      <div v-else-if="imageCount > 0" class="image-label">
        <div class="image-count">{{ imageCount }}</div>
      </div>
      <video
        v-if="videos.length > 0"
        controls
        class="image"
        :src="thumbnail"
        alt="post video"
      />
      <img v-else class="image" :src="imgThumbnail" alt="post image" />
    </div>
    <div class="content-container">
      <div class="content-title" :class="contentTitleColor">
        <span class="content-title-text">{{ title }}</span>
      </div>
      <div class="content-content">
        <span class="content-content-text">{{ content }}</span>
      </div>
    </div>
    <div v-if="isEvent" class="footer-event">
      <div class="footer-place">{{ event.place }}</div>
      <div class="footer-date">{{ dateAndTime }}</div>
    </div>
    <div v-else-if="isQuestionnaire" class="footer-questionnaire">
      <div class="footer-voting">{{ questionnaire.vote_count }}票</div>
      <div class="footer-date">{{ questionnaireEndDate }}</div>
    </div>
    <div v-else class="footer-default">
      <div class="footer-bio-profile">
        <bio-profile
          size="small"
          :user-icon="user.icon"
          :user-name="user.name"
          :user-organization-name="user.organization"
          :number-of-name="18"
          :number-of-organization-name="14"
        />
      </div>
      <div class="footer-button">
        <img class="footer-icon-like" :src="likeIconPath" alt="like" />
        <div class="footer-count-like">{{ likeCount }}</div>
        <img
          class="footer-icon-comment"
          src="/app/icon/comment.svg"
          alt="comment"
        />
        <div class="footer-count-comment">{{ commentCount }}</div>
        <img
          class="footer-icon-bookmark"
          :src="favoriteIconPath"
          alt="bookmark"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from '@/libs/dayjs';
import BioProfile from '~/components/Admin/Pages/CommunityManagement/AppPreview/BioProfile.vue';

export default Vue.extend({
  components: {
    BioProfile,
  },
  props: {
    date: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: false,
      default: '',
    },
    images: {
      type: Array as PropType<String[]>,
      required: false,
      default: () => [],
    },
    videos: {
      type: Array as PropType<String[]>,
      required: false,
      default: () => [],
    },
    likeCount: {
      type: Number,
      required: true,
    },
    commentCount: {
      type: Number,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
    },
    isLiked: {
      type: Boolean,
      required: true,
    },
    isFavorite: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object as PropType<ApiResponse.PostUser>,
      required: false,
      default: () => {},
    },
    event: {
      type: Object as PropType<ApiResponse.Event>,
      required: false,
      default: () => {},
    },
    questionnaire: {
      type: Object as PropType<ApiResponse.Questionnaire>,
      required: false,
      default: () => {},
    },
    uuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isButtons: false,
    };
  },
  computed: {
    dateMFormat(): string {
      return dayjs.unix(this.date).format('M');
    },
    dateDFormat(): string {
      return dayjs.unix(this.date).format('D');
    },
    isEvent(): boolean {
      return !!this.event;
    },
    isQuestionnaire(): boolean {
      return !!this.questionnaire;
    },
    contentTitleColor(): object {
      if (this.isEvent) return { 'content-color-event': true };
      if (this.isQuestionnaire) return { 'content-color-questionnaire': true };
      return {};
    },
    imageCount(): number {
      if (this.images) return this.images.length;
      return 0;
    },
    categoryName(): string {
      if (this.isEvent && this.isQuestionnaire) return 'イベント<br>アンケート';
      if (this.isEvent) return 'イベント';
      if (this.isQuestionnaire) return 'アンケート';
      return '';
    },
    categoryColor(): object {
      if (this.isEvent && this.isQuestionnaire)
        return { 'category-color-event-questionnaire': true };
      if (this.isEvent) return { 'category-color-event': true };
      if (this.isQuestionnaire) return { 'category-color-questionnaire': true };
      return {};
    },
    categoryIconPath(): string {
      if (this.isEvent && this.isQuestionnaire)
        return '/app/icon/event_questionnaire.svg';
      if (this.isEvent) return '/app/icon/event.svg';
      if (this.isQuestionnaire) return '/app/icon/questionnaire.svg';
      return '';
    },
    contentType(): string {
      switch (this.type) {
        case 'my-episode':
          return 'マイエピソード';
        case 'internal-communication':
          return '社内連絡';
        case 'department-news':
          return '組織ニュース';
        case 'community-news':
          return 'コミュニティニュース';
        default:
          return '';
      }
    },
    dateAndTime(): string {
      if (this.event) {
        const startAt = dayjs(this.event.start_at).format('M/D（ddd）H:m');
        const endAt = dayjs(this.event.end_at).format('H:m');
        return `${startAt} 〜 ${endAt}`;
      }
      return '';
    },
    questionnaireEndDate(): string {
      if (this.questionnaire) {
        return dayjs(this.questionnaire?.expire_at).format('M/D（ddd）H:mまで');
      }
      return '';
    },
    likeIconPath(): string {
      if (this.isLiked) return '/app/icon/like_on.svg';
      return '/app/icon/like_off.svg';
    },
    favoriteIconPath(): string {
      if (this.isFavorite) return '/app/icon/bookmark_on.svg';
      return '/app/icon/bookmark_off.svg';
    },
    isMyPost(): boolean {
      if (this.user) {
        return this.$store.state.user.uuid === this.user.uuid;
      }
      return false;
    },
    isNew(): boolean {
      const newCondition = dayjs().subtract(3, 'day');
      const date = dayjs.unix(this.date);
      return date.isAfter(newCondition) || !this.isRead;
    },
    imgThumbnail(): string {
      if (!this.thumbnail) {
        return '/image/no-image.png';
      }
      return this.thumbnail;
    },
  },
});
</script>

<style lang="scss" scoped>
.post-card-container {
  display: flex;
  flex-direction: column;
  height: 535px;
  min-width: 290px;
  width: 100%;
  border-radius: 4px;
  box-shadow: 0 1px 2px #dce5ef;
  position: relative;
  margin-top: -15px;
  background-color: $true_white;

  & + .post-card-container {
    margin-top: 43px;
  }
}

.header-date-container {
  position: absolute;
  top: -15px;
  left: -10px;
  height: 46px;
  width: 46px;
}

.header-date-month {
  font-size: 15px;
}

.header-date-slash {
  position: absolute;
  transform: rotate(-45deg);
  border-bottom: solid 1px $date_division_line;
}

.header-container {
  display: flex;
  align-items: center;
  height: 44px;
  width: 100%;
  padding: 0 14px 0 0;
}

.header-date-day {
  font-size: 22px;
  margin: 0 12px 0 15px;
  line-height: 1;
}

.header-title-text {
  font-size: 11px;
  color: $sub_color;
}

.header-more-button {
  margin-left: auto;
}

.header-new {
  position: absolute;
  top: -15px;
  right: 3px;
}

.buttons-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 44px;
  padding: 14px;
  border-radius: 22px;
  background-color: $icon_gray;
}

.buttons-container-item {
  text-align: center;
  line-height: 1;
  margin: 28px 0 0;

  &:first-child {
    margin: 0;
  }
}

.image-container {
  width: 100%;
  height: 291px;
  margin-bottom: 30px;
  position: relative;
}

.category-label {
  position: absolute;
  top: -12px;
  right: 2px;
}

.category-color-event {
  background-color: rgba(42, 204, 61, 0.8);
}

.category-color-questionnaire {
  background-color: rgba(227, 178, 66, 0.8);
}

.category-color-event-questionnaire {
  background-color: rgba(42, 173, 204, 0.8);
}

.category-icon {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  line-height: 28px;
  text-align: center;
  margin: 0 auto;
}

.category-name {
  color: $true_white;
  font-size: 11px;
  font-weight: bold;
  width: 69px;
  margin: 8px 0 0 0;
  padding: 3px 0;
  line-height: 1;
  text-align: center;
  border-radius: 8px;
}

.image-label {
  position: absolute;
  top: 8px;
  right: 8px;
}

.image-count {
  color: $true_white;
  font-size: 12px;
  padding: 4px 8px;
  text-align: center;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.5);

  &::before {
    content: '';
    background: url('/icon/image.svg') no-repeat;
    display: inline-block;
    width: 16px;
    height: 13px;
    vertical-align: middle;
    margin: 0 4px 0 0;
  }
}

.image {
  width: 100%;
  height: 291px;
  object-fit: fill;
}

.content-container {
  padding: 0 24px;
  margin: 0 0 12px 0;
}

.content-title {
  width: 100%;
  max-width: fit-content;
  margin-bottom: 30px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  border-bottom: solid 1px $link_color;
}

.content-color-event {
  border-bottom: solid 1px $event_color;
}

.content-color-questionnaire {
  border-bottom: solid 1px $questionnaire_color;
}

.content-title-text {
  font-size: 15px;
  font-weight: 600;
  line-height: 26px;
}

.content-content {
  width: 100%;
  height: 48px;
  overflow: hidden;
}

.content-content-text {
  font-size: 15px;
  line-height: 24px;
  color: $sub_color;
}

.footer-event {
  padding: 0 24px 16px;
}

.footer-place {
  color: $main_color;
  font-size: 13px;

  &::before {
    content: '';
    background: url('/app/icon/pin.svg') no-repeat;
    display: inline-block;
    width: 12px;
    height: 16px;
    vertical-align: middle;
    margin: 0 16px 0 0;
  }
}

.footer-date {
  font-size: 13px;
  margin: 4px 0 0 -2px;

  &::before {
    content: '';
    background: url('/app/icon/clock.svg') no-repeat;
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin: 0 14px 0 0;
  }
}

.footer-questionnaire {
  padding: 0 24px 16px;
}

.footer-voting {
  font-size: 13px;
  margin: 0 0 0 -2px;

  &::before {
    content: '';
    background: url('/app/icon/voting.svg') no-repeat;
    display: inline-block;
    width: 18px;
    height: 18px;
    vertical-align: middle;
    margin: 0 14px 0 0;
  }
}

.footer-default {
  display: flex;
  justify-content: space-between;
  padding: 0 24px 16px;
  position: relative;
  overflow: hidden;
}

.footer-button {
  display: flex;
  align-items: center;
  font-size: 15px;
  line-height: 1;
  height: fit-content;
  position: absolute;
  right: 24px;
  bottom: 16px;
}

.footer-icon-like {
  margin: 0 6px 0 0;
}

.footer-count-like {
  margin: 0 15px 0 0;
}

.footer-icon-comment {
  margin: 0 6px 0 0;
}

.footer-count-comment {
  margin: 0 15px 0 0;
}
</style>
