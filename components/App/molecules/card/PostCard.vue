<template>
  <div class="post-card-container" :class="frameType !== none ? frameType : ''">
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
      <div
        class="header-title-text"
        :class="frameType !== none ? frameType : ''"
      >
        {{ contentType }}
      </div>
      <div
        v-if="isMyPostAndWithin1Hour && !isVisitor"
        class="header-more-button"
        @click="isButtons = !isButtons"
      >
        <img src="@/assets/image/btn/more.png" alt="more" />
      </div>
      <div v-if="isNew" class="header-new">
        <img src="@/assets/image/new.png" alt="new post" />
      </div>
    </div>

    <div class="image-container" @click="videoCount > 0 ? '' : goToArticle()">
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
      <div v-else-if="imageCount > 0 || videoCount > 0" class="image-label">
        <div class="image-count">{{ imageCount + videoCount }}</div>
      </div>
      <video
        v-if="videoCount > 0"
        controls
        class="video"
        :class="frameType !== none ? frameType : ''"
        :src="thumbnail"
        alt="post video"
        :style="{
          'background-color': backgroundColorPalette,
        }"
      />
      <img
        v-else
        class="image"
        :class="frameType !== none ? frameType : ''"
        :src="thumbnail"
        alt="post image"
        onerror="this.src = '/image/no-image.png'"
      />
      <template-frame
        v-if="frameType !== none"
        :height="292"
        :type="frameType"
      />
    </div>
    <div
      class="show-mask-icon"
      :class="frameType !== none ? frameType : ''"
    ></div>
    <div v-if="isButtons" class="buttons-container">
      <div class="buttons-container-item" @click="isButtons = !isButtons">
        <img src="/app/icon/close.svg" alt="close" />
      </div>
      <div class="buttons-container-item">
        <img
          src="/app/icon/write.svg"
          alt="write"
          @click="clickEditButton(uuid)"
        />
      </div>
      <div class="buttons-container-item">
        <img
          src="/app/icon/trash.svg"
          alt="trash"
          @click="clickTrashButton(uuid)"
        />
      </div>
    </div>
    <div
      class="content-container"
      :class="frameType !== none ? frameType : ''"
      @click="goToArticle"
    >
      <div v-if="frameType !== none">
        <div
          class="content-title"
          :class="frameType !== none ? frameType : 'none'"
        >
          <div class="line-top"></div>
          <div class="title-box">
            <img
              v-if="flowerLeftUrl"
              :src="flowerLeftUrl"
              class="flower-left"
            />
            <img
              v-if="iconCenterUrl"
              :src="iconCenterUrl"
              class="clapping-hands"
            />
            <div class="title-content">
              <span class="content-title-text">{{ title }}</span>
            </div>
            <img
              v-if="flowerRightUrl"
              :src="flowerRightUrl"
              class="flower-right"
            />
          </div>
          <div class="line-bottom"></div>
        </div>
      </div>

      <div v-if="frameType === none">
        <div class="content-title" :class="contentTitleColor">
          <span class="content-title-text">{{ title }}</span>
        </div>
      </div>
      <div class="flex-parent-content">
        <div
          ref="contentPost"
          class="flex-child-content long-and-truncated"
          :class="frameType !== none ? frameType : ''"
        >
          {{ content }}
        </div>
        <div v-if="hiddenContentHeight > 48" class="flex-child short-and-fixed">
          <div :class="frameType !== none ? frameType : ''">...もっと見る</div>
        </div>
      </div>
    </div>
    <div v-if="isEvent" class="footer-event">
      <div class="footer-place">{{ event.place }}</div>
      <div class="footer-date">{{ dateAndTime }}</div>
    </div>
    <div
      v-else-if="
        !isEvent &&
          !isQuestionnaire &&
          type === 'internal-communication' &&
          publishSettingDateAndTime
      "
      class="footer-event"
    >
      <div class="footer-date">{{ publishSettingDateAndTime }}</div>
    </div>
    <div v-else-if="isQuestionnaire" class="footer-questionnaire">
      <div class="footer-voting">{{ questionnaire.vote_count }}票</div>
      <div class="footer-date">{{ questionnaireEndDate }}</div>
    </div>
    <div v-else class="footer-default">
      <div
        class="footer-bio-profile"
        :class="{ pointer: user.uuid && !isVisitor }"
        @click="goToUserProfile"
      >
        <bio-profile
          size="small"
          :user-icon="user.icon"
          :user-name="user.name"
          :user-organization-name="user.organization"
          :number-of-name="18"
          :number-of-organization-name="14"
          :posts-profile="true"
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
import { enumPostTypes } from '@/libs/definition';
import Vibrant from 'node-vibrant';
import BioProfile from '../profile/BioProfile.vue';
import TemplateFrame from './frame/TemplateFrame.vue';

export default Vue.extend({
  components: {
    BioProfile,
    TemplateFrame,
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
    thumbnailType: {
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
      type: Object as PropType<AppApiResponse.PostUser>,
      required: false,
      default: () => {},
    },
    event: {
      type: Object as PropType<AppApiResponse.Event>,
      required: false,
      default: () => {},
    },
    questionnaire: {
      type: Object as PropType<AppApiResponse.Questionnaire>,
      required: false,
      default: () => {},
    },
    uuid: {
      type: String,
      required: true,
    },
    enrollmentStatus: {
      type: Object as PropType<AppApiResponse.EnrollmentStatus>,
      required: true,
    },
    isVisitor: {
      type: Boolean,
      default: false,
    },
    publishSetting: {
      type: Object,
      required: false,
      default: () => {},
    },
    template: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      isButtons: false,
      thankYou: enumPostTypes.THANKYOU as string,
      none: enumPostTypes.DEFAULT as string,
      flowerLeft: '' as string,
      flowerRight: '' as string,
      iconCenter: '' as string,
      hiddenContentHeight: 0 as number,
      backgroundColorPalette: `rgba(255, 255, 255, 0.2)`,
    };
  },
  computed: {
    frameType(): string {
      let type = 'none';
      if (
        this.template === 'thankyou' ||
        this.template === 'pickup' ||
        this.template === 'interview'
      ) {
        type = this.template;
      }
      return type;
    },
    flowerLeftUrl(): string {
      switch (this.template) {
        case 'thankyou':
          return '/app/image/flower-left.svg';
        case 'pickup':
          return '/app/icon/leaf-left.svg';
        case 'interview':
          return '/app/image/star-left.svg';
        default:
          return '';
      }
    },
    flowerRightUrl(): string {
      switch (this.template) {
        case 'thankyou':
          return '/app/image/flower-right.svg';
        case 'pickup':
          return '/app/icon/leaf-right.svg';
        case 'interview':
          return '/app/image/star-right.svg';
        default:
          return '';
      }
    },
    iconCenterUrl(): string {
      switch (this.template) {
        case 'thankyou':
          return '/app/image/clapping-hands.svg';
        case 'pickup':
          return '/app/icon/icon-medan-small.svg';
        case 'interview':
          return '/app/icon/icon-micro-small.svg';
        default:
          return '';
      }
    },
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
    videoCount(): number {
      if (this.videos) return this.videos.length;
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
          return 'コミュニティ';
        default:
          return '';
      }
    },
    dateAndTime(): string {
      if (this.event) {
        const startAt = dayjs
          .unix(this.event.start_at)
          .format('M/D（ddd）HH:mm');
        const endAt = dayjs.unix(this.event.end_at).format('HH:mm');
        return `${startAt} 〜 ${endAt}`;
      }
      return '';
    },
    publishSettingDateAndTime(): string {
      if (this.publishSetting) {
        if (!this.publishSetting.start_at) {
          return '';
        }
        const startAt = dayjs
          .unix(this.publishSetting.start_at)
          .format('M/D（ddd）HH:mm');
        const endAt = dayjs.unix(this.publishSetting.end_at).format('HH:mm');
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
    isMyPostAndWithin1Hour(): boolean {
      if (this.user && this.date) {
        const now = dayjs();
        return (
          this.$store.state.userProfile.uuid === this.user.uuid &&
          now.diff(dayjs.unix(this.date), 'minute') <= 60
        );
      }
      return false;
    },
    isNew(): boolean {
      const newCondition = dayjs().subtract(3, 'day');
      const date = dayjs.unix(this.date);
      return date.isAfter(newCondition) || !this.isRead;
    },
  },
  async created() {
    setTimeout(() => {
      const element: any = this.$refs.contentPost;
      this.hiddenContentHeight = element.scrollHeight;
    }, 0);
    if (this.videoCount > 0) {
      this.backgroundColorPalette = await Vibrant.from(
        `${this.thumbnail}-thumb?x-request=xhr`
      )
        .getPalette()
        .then(
          // eslint-disable-next-line @typescript-eslint/typedef
          (palette) => {
            const vibrantRbgArr =
              !palette || !palette.Vibrant || !palette.Vibrant.rgb
                ? [255, 255, 255]
                : palette.Vibrant.rgb;
            return `rgba(${vibrantRbgArr.join()}, 0.2)`;
          },
          () => {
            return `rgba(255, 255, 255, 0.2)`;
          }
        );
    }
  },
  methods: {
    goToArticle(): void {
      this.$router.push(`/posts/${this.uuid}`);
    },
    goToUserProfile(): void {
      if (!this.user.uuid || this.isVisitor) {
        return;
      }
      if (this.user) this.$router.push(`/users/${this.user.uuid}`);
    },
    clickTrashButton(uuid: string) {
      this.$emit('onClickDeletePost', uuid);
    },
    clickEditButton(uuid: string) {
      this.$emit('onClickEditPost', uuid);
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
  margin-left: 10px;
  background-color: $true_white;

  &.thankyou {
    background-color: #faf1e8;
  }

  &.pickup {
    background: linear-gradient(to bottom, #fae6eb, #ebecf5);
  }

  &.interview {
    background-color: #eff0f7;
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

  &.pickup {
    padding: 3px;
    background-color: #998863;
    color: $true_white;
    border-radius: 2px;
    padding-left: 6px;
    padding-right: 6px;
  }
}

.header-more-button {
  margin-left: auto;
  cursor: pointer;
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
  cursor: pointer;
  margin: 28px 0 0;

  &:first-child {
    margin: 0;
  }
}

.image-container {
  cursor: pointer;
  position: relative;
  text-align: center;
  width: 384px;
  height: 291px;
  justify-content: space-between;
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
    background: url('/app/icon/image.svg') no-repeat;
    display: inline-block;
    width: 16px;
    height: 13px;
    vertical-align: middle;
    margin: 0 4px 0 0;
  }
}

.image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 290px;
  object-fit: cover;
}

.video {
  width: 100%;
  height: 291px;
}

.content-container {
  padding: 0 24px;
  cursor: pointer;
  margin: 15px 0 12px 0;
}

.content-title {
  width: 100%;
  max-width: fit-content;
  margin-bottom: 30px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  border-bottom: solid 2px $link_color;

  &.interview,
  &.thankyou,
  &.pickup {
    width: 340px;
    height: 66px;
    background-color: $true_white;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border-bottom: none;
    margin-bottom: 1px;

    .title-box {
      height: 56px;
      width: 100%;
      display: flex;

      .flower-right {
        width: 23px;
        margin-right: 8px;
      }

      .flower-left {
        width: 23px;
        margin-left: 8px;
      }

      .title-content {
        width: 244px;
        margin: auto;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }

  .line-bottom,
  .line-top {
    height: 1px;
    width: 307px;
    border-width: 0;
  }

  .line-top {
    margin-top: 5px;
  }

  .line-bottom {
    margin-bottom: 5px;
  }

  &.thankyou {
    .clapping-hands {
      width: 28px;
      margin-right: 5px;
    }

    .line-top,
    .line-bottom {
      background-color: #f99559;
    }
  }

  &.pickup {
    .clapping-hands {
      width: 26px;
      margin-right: 5px;
      margin-bottom: 5px;
    }

    .line-top,
    .line-bottom {
      background-color: #998863;
    }
  }

  &.interview {
    .clapping-hands {
      width: 26px;
      margin-right: 5px;
      margin-bottom: 5px;
    }

    .line-top,
    .line-bottom {
      background-color: #89dcee;
    }
  }
}

.content-title-text {
  font-size: 15px;
  font-weight: 600;
  line-height: 26px;
}

.content-color-event {
  border-bottom: solid 2px $event_color;
}

.content-color-questionnaire {
  border-bottom: solid 2px $questionnaire_color;
}

.content-content {
  width: 100%;
  height: 48px;
  overflow: hidden;

  &.thankyou {
    color: #c1772d;
    margin-top: 10px;
  }

  &.pickup,
  &.interview {
    margin-top: 10px;
  }
}

.content-content-text {
  font-size: 15px;
  line-height: 24px;
  color: $sub_color;

  &.thankyou {
    color: #c1772d;
  }
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
  padding: 0 24px 5px;
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

.footer-bio-profile {
  &.pointer {
    cursor: pointer;
  }
}

.flex-parent-content {
  display: flex;
  align-items: center;
  padding: 2px;
  width: 100%;
  height: 48px;
  margin-top: 7px;
}

.long-and-truncated {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: block;
  display: -webkit-box;
  font-size: 15px;
  height: 48px;
  line-height: 24px;
  color: #9c9da5;

  &.thankyou {
    color: #c1772d;
  }
}

.short-and-fixed {
  white-space: nowrap;

  > div {
    border-radius: 1px;
    display: inline-block;
    width: 90px;
    position: absolute;
    margin-left: -90px;
    font-size: 15px;
    line-height: 24px;
    background-color: $true_white;
    color: #9c9da5;

    &.thankyou {
      background-color: #faf1e8;
      color: #c1772d;
    }

    &.pickup {
      background-color: #edebf4;
    }

    &.interview {
      background-color: #eff0f7;
    }
  }
}

.show-mask-icon {
  width: 100%;
  position: absolute;
  pointer-events: none;

  &.thankyou {
    margin-top: 25px;
    height: 315px;
    background: url('/app/icon/mark-icon-thankyou.png') no-repeat;
  }

  &.pickup {
    height: 335px;
    margin-top: 2px;
    background: url('/app/icon/mark-icon-pickup.png') no-repeat;
  }

  &.interview {
    margin-top: 25px;
    height: 315px;
    background: url('/app/icon/mark-icon-interview.png') no-repeat;
  }
}
</style>
