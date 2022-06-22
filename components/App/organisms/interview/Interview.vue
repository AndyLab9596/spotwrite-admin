<template>
  <div>
    <post-detail-title
      :date="post.date"
      :type="post.type"
      :title="post.title"
      class="title"
    />
    <div class="interview-card" :class="pattern">
      <image-select-box
        class="image"
        :pattern="pattern"
        :src="selectImageSrc"
        :images="getMediaOfPost"
        :select-image-src="selectImageSrc"
        :select-button-color="`#89d3ca`"
        :frame-name="postTypes.INTERVIEW"
        @onChange="changeImage"
      />
      <p class="member-text">MEMBER</p>
      <div v-if="hasInterviewee" class="interview-member-profile-wrapper">
        <template v-for="item in post.interview.interviewees">
          <interview-member-profile
            :key="item.uuid"
            :uuid="item.uuid"
            :icon="item.user_icon"
            :name="item.name"
            :organization="item.organization_name"
            :type="isInterviewer(item.uuid)"
            :joined-year="item.joined_year"
            :joined-month="item.joined_month"
            :is-visitor="isVisitor"
            :preview-mode="previewMode"
            class="profile-item"
            :class="{ 'preview-mode': previewMode }"
          />
        </template>
      </div>
      <p class="card-description-text">
        {{ post.content }}
      </p>
    </div>
    <div class="background-interview" :class="pattern"></div>
    <div class="interview-contents" :class="{ 'preview-mode': previewMode }">
      <div class="interview-contents-top-wrapper">
        <img src="/app/icon/Icon-interview.svg" class="interview-icon" alt="" />
        <div class="interview-text">INTERVIEW</div>
        <template v-if="hasInterviewContents">
          <template v-for="(item, index) in post.interview.contents">
            <interview-title
              v-if="item.content_type === 'heading'"
              :key="item.body"
              :title="item.body"
              :pattern="pattern"
              class="interview-title"
            />
            <user-talk-item
              v-if="displayUserTalkItem(item)"
              :key="index"
              :uuid="item.interviewee.uuid"
              :icon="item.interviewee.user_icon"
              :name="item.interviewee.name"
              :content="item.body"
              :comment-position="item.comment_position"
              :is-visitor="isVisitor"
              :pattern="pattern"
              class="interview-user-talk-item"
            />
          </template>
        </template>
      </div>
    </div>
    <post-profile
      :icon="post.user.icon"
      :name="post.user.name"
      :user-uuid="post.user.uuid"
      :organization="post.user.organization"
      :is-liked="post.is_liked"
      :like-count="post.like_count"
      :comment-count="totalCount"
      :is-favorite="post.is_favorite"
      :preview-mode="previewMode"
      class="post-profile"
      :is-visitor="isVisitor"
      @onChange="changeLike"
      @onChangeFavorite="changeFavorite"
    />

    <related-posts
      v-if="!previewMode"
      :related-posts="relatedPosts"
      :preview-mode="previewMode"
      @onCreateRelatedPost="$emit('onCreateRelatedPost')"
    />

    <comment
      v-if="!previewMode"
      :total-count="totalCount"
      :comments="comments"
      :is-visitor="isVisitor"
      @onClickComment="clickComment"
      @onClickReply="clickCommentReply"
      @onClickReplyToReply="clickCommentReplyToReply"
      @onChangeCommentLike="changeCommentLike"
      @onChangeCommentReplyLike="changeCommentReplyLike"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { enumPostTypes } from '@/libs/definition';
import PostDetailTitle from '../post/PostDetailTitle.vue';
import ImageSelectBox from '../../molecules/images/ImageSelectBox.vue';
import InterviewMemberProfile from '../../molecules/interview/InterviewMemberProfile.vue';
import InterviewTitle from '../../molecules/interview/InterviewTitle.vue';
import UserTalkItem from '../../molecules/talk/UserTalkItem.vue';
import RelatedPosts from '../post/RelatedPosts.vue';
import PostProfile from '../post/PostProfile.vue';
import Comment from '../comment/Comment.vue';

type Media = {
  src: string;
  type: string;
};

export default Vue.extend({
  components: {
    PostDetailTitle,
    ImageSelectBox,
    InterviewMemberProfile,
    InterviewTitle,
    UserTalkItem,
    PostProfile,
    RelatedPosts,
    Comment,
  },
  props: {
    post: {
      type: Object as PropType<AppApiResponse.Post>,
      required: true,
    },
    comments: {
      type: Array as PropType<AppApiResponse.Comment[]>,
      required: true,
    },
    totalCount: {
      type: Number,
      required: true,
    },
    src: {
      type: String,
      required: false,
      default: null,
    },
    selectImageSrc: {
      type: String,
      required: false,
      default: null,
    },
    previewMode: {
      type: Boolean,
      required: false,
      default: false,
    },
    relatedPosts: {
      type: Array as PropType<AppApiResponse.Post[]>,
      default: null,
    },
    isVisitor: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      postMedia: [] as Media[],
      classPatterns: ['pattern1', 'pattern2', 'pattern3'],
      pattern: '' as string,
      postTypes: enumPostTypes,
    };
  },
  computed: {
    hasInterviewee(): boolean {
      return (
        this.post.interview != null &&
        this.post.interview.interviewees.length > 0
      );
    },
    hasInterviewContents(): boolean {
      return (
        this.post.interview !== null && this.post.interview.contents.length > 0
      );
    },
    getMediaOfPost(): Media[] {
      if (this.post.videos.length > 0) {
        this.post.videos.map((value: string) => {
          return this.postMedia.push({ src: value, type: 'video' });
        });
      }
      if (this.post.images.length > 0) {
        this.post.images.map((value: string) => {
          return this.postMedia.push({ src: value, type: 'image' });
        });
      }
      return this.postMedia;
    },
  },
  created() {
    this.pattern = this.getClassPatternRandom();
  },
  methods: {
    getClassPatternRandom(): string {
      const randomIndex = Math.floor(Math.random() * this.classPatterns.length);
      const classPattern = this.classPatterns[randomIndex];
      return classPattern;
    },
    isInterviewer(uuid: string): string {
      return this.post.user.uuid === uuid ? 'インタビュアー' : '';
    },
    displayUserTalkItem(item: AppApiResponse.InterviewContent): boolean {
      return item.interviewee != null
        ? item.content_type === 'comment' &&
            Object.keys(item.interviewee).length > 0
        : false;
    },
    changeImage(src: string) {
      this.$emit('onChangeImage', src);
    },
    changeLike(boolean: boolean) {
      this.$emit('onChangeLike', boolean);
    },
    changeFavorite(boolean: boolean) {
      this.$emit('onChangeFavorite', boolean);
    },
    clickAnswer(uuid: string) {
      this.$emit('onClickAnswer', uuid);
    },
    clickComment(comment: string) {
      this.$emit('onClickComment', comment);
    },
    clickCommentReply(reply: Types.Reply) {
      this.$emit('onClickReply', reply);
    },
    clickCommentReplyToReply(reply: Types.Reply) {
      this.$emit('onClickReplyToReply', reply);
    },
    changeCommentLike(comment: Types.LikeComment) {
      this.$emit('onChangeCommentLike', comment);
    },
    changeCommentReplyLike(comment: Types.LikeComment) {
      this.$emit('onChangeCommentReplyLike', comment);
    },
  },
});
</script>

<style lang="scss" scoped>
.title {
  margin: 0 0 24px 0;
}

.interview-card {
  padding: 40px;
  margin: 0 0 40px 0;
  border-radius: 0 0 16px 16px;

  &.pattern1 {
    background-color: $background_color_pattern_1;
  }

  &.pattern2 {
    background-color: $background_color_pattern_2;
  }

  &.pattern3 {
    background-color: $background_color_pattern_3;
  }
}

.image {
  margin: 0 0 16px 0;
}

.member-text {
  font-family: 'Lato', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: $gentle_bluish_purple;
  padding: 0 0 24px 0;
}

.interview-member-profile-wrapper {
  display: flex;
  align-items: flex-end;
  overflow-x: auto;
  margin: 0 0 25px 0;
}

.profile-item {
  flex-shrink: 0;
  margin: 0 59px 0 0;

  &:last-of-type {
    margin: 0%;
  }

  &.preview-mode {
    pointer-events: none;
  }
}

.card-description-text {
  font-size: 15px;
  font-weight: 300;
  color: $gentle_bluish_purple;
  width: 720px;
  background-color: $true_white;
  padding: 8px;
  border-radius: 8px;
}

.interview-contents {
  display: flex;
  justify-content: center;
}

.interview-contents-top-wrapper {
  width: 100%;
  text-align: center;
  margin: 0 40px 40px;
}

.interview-icon {
  height: 28px;
  width: 28px;
  margin: 0 0 12px 0;
}

.interview-text {
  font-family: 'Lato', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: $sub_color;
  margin: 0 0 16px 0;
}

.interview-title {
  margin: 0 0 40px 0;
}

.interview-user-talk-item {
  margin: 0 0 23px 0;

  &:last-of-type {
    margin: 0;
  }
}

.post-profile {
  margin: 0 40px 40px;
}

.preview-mode {
  pointer-events: none;
}

.background-interview {
  width: 880px;
  height: 1404px;
  position: absolute;
  z-index: -1;
  margin-left: -35px;
  margin-top: 60px;

  &.pattern1 {
    background: url('/app/image/interview-background-pattern1.svg') no-repeat;
  }

  &.pattern2 {
    background: url('/app/image/interview-background-pattern2.svg') no-repeat;
  }

  &.pattern3 {
    background: url('/app/image/interview-background-pattern3.svg') no-repeat;
  }
}
</style>
