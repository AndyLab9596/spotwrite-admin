<template>
  <div v-if="post.event">
    <div class="post-detail-container">
      <event-detail-contents
        :date="post.date"
        :type="post.type"
        :title="post.title"
        :content="post.content"
        :start-at="post.event.start_at"
        :end-at="post.event.end_at"
        class="post-contents"
      />
      <div class="event-contents">
        <image-select-box
          class="image"
          :src="selectImageSrc"
          :images="getMediaOfPost"
          :select-image-src="selectImageSrc"
          :height="270"
          @onChange="changeImage"
        />
        <div :class="{ 'preview-mode': previewMode }">
          <event-detail-map class="map" :place="post.event.place" />
          <event-detail-invitation
            :invitation-count="post.event.invitation_count"
            :participation-count="post.event.participation_count"
            :non-participation-count="post.event.non_participation_count"
            :undecided-count="post.event.undecided_count"
            :unanswered-count="post.event.unanswered_count"
            :end-at="post.event.end_at"
            :is-required-answer="post.event.is_required_answer"
            :answer="post.event.answer"
            :participation-users="post.event.participation_users"
            :invitation-users="post.event.invitation_users"
            @onClick="changeAnswer"
          />
        </div>
      </div>
      <event-profile
        :icon="post.user.icon"
        :name="post.user.name"
        :organization="post.user.organization"
        :is-liked="post.is_liked"
        :like-count="post.like_count"
        :comment-count="post.comment_count"
        :is-favorite="post.is_favorite"
        :user-uuid="post.user.uuid"
        :preview-mode="previewMode"
        @onChange="changeLike"
        @onChangeFavorite="changeFavorite"
      />
    </div>
    <div v-if="hasQuestionnaire" class="questionnaire-container">
      <questionnaire
        :questionnaire="post.questionnaire"
        :event="post.event"
        :user-uuid="post.user.uuid"
        :preview-mode="previewMode"
        @onClick="clickAnswer"
      />
    </div>
    <div class="post-related-container">
      <event-detail-related-posts :event="post.event" />
    </div>
    <comment
      v-if="!previewMode"
      :total-count="totalCount"
      :comments="comments"
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
import ImageSelectBox from '../../molecules/images/ImageSelectBox.vue';
import EventDetailMap from './EventDetailMap.vue';
import EventProfile from './EventProfile.vue';
import EventDetailContents from './EventDetailContents.vue';
import EventDetailInvitation from './EventDetailInvitation.vue';
import EventDetailRelatedPosts from './EventDetailRelatedPosts.vue';
import Questionnaire from '../../molecules/questionnaire/Questionnaire.vue';
import Comment from '../comment/Comment.vue';

type Media = {
  src: string;
  type: string;
};

export default Vue.extend({
  components: {
    ImageSelectBox,
    EventDetailContents,
    EventDetailMap,
    EventProfile,
    EventDetailInvitation,
    EventDetailRelatedPosts,
    Questionnaire,
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
  },
  data() {
    return {
      postMedia: [] as Media[],
    };
  },
  computed: {
    hasQuestionnaire() {
      return this.post.questionnaire != null;
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
  methods: {
    changeImage(src: string) {
      this.$emit('onChangeImage', src);
    },
    changeLike(boolean: boolean) {
      this.$emit('onChangeLike', boolean);
    },
    changeFavorite(boolean: boolean) {
      this.$emit('onChangeFavorite', boolean);
    },
    changeAnswer(uuid: string) {
      this.$emit('onChangeEventAnswer', uuid);
    },
    clickAnswer(uuid: string) {
      this.$emit('onClickAnswer', uuid);
    },
    clickComment(comment: string) {
      this.$emit('onClickComment', comment);
    },
    clickCommentReply(reply: AppTypes.Reply) {
      this.$emit('onClickReply', reply);
    },
    clickCommentReplyToReply(reply: AppTypes.Reply) {
      this.$emit('onClickReplyToReply', reply);
    },
    changeCommentLike(comment: AppTypes.LikeComment) {
      this.$emit('onChangeCommentLike', comment);
    },
    changeCommentReplyLike(comment: AppTypes.LikeComment) {
      this.$emit('onChangeCommentReplyLike', comment);
    },
  },
});
</script>

<style lang="scss" scoped>
.header {
  margin: 0 0 16px 0;
  border-radius: 4px;
}

.post-detail-container {
  padding: 40px 40px;
  border-radius: 4px;
}

.title {
  margin: 0 0 24px 0;
}

.image {
  width: 360px;
}

.post-contents {
  margin: 0 0 40px 0;
}

.map {
  width: 315px;
  margin: 0 0 24px 0;
}

.event-contents {
  display: flex;
  justify-content: space-between;
  margin: 0 0 15px 0;
}

.post-related-container {
  padding: 0 40px 40px;
  border-top: 1px solid $ruled_line;
}

.questionnaire-container {
  padding: 32px 40px 40px;
  border-top: 1px solid $ruled_line;
}

.preview-mode {
  pointer-events: none;
}
</style>
