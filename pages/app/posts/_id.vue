<template>
  <div class="container">
    <div v-if="isFetchComplete">
      <event-detail
        v-if="isPostType === postTypes.EVENT"
        :post="post"
        :comments="comments"
        :total-count="totalCount"
        :src="selectImageSrc"
        :select-image-src="selectImageSrc"
        :is-visitor="isVisitor"
        @onChangeImage="changeImage"
        @onChangeLike="changePostLike"
        @onChangeFavorite="changeFavorite"
        @onClickAnswer="addAnswer"
        @onClickReply="clickCommentReply"
        @onClickReplyToReply="clickCommentReplyToReply"
        @onClickComment="clickComment"
        @onChangeCommentLike="changeCommentLike"
        @onChangeCommentReplyLike="changeCommentReplyLike"
        @onChangeEventAnswer="changeEventAnswer"
      />
      <post-detail
        v-if="isPostType === postTypes.DEFAULT"
        :post="post"
        :comments="comments"
        :total-count="totalCount"
        :src="selectImageSrc"
        :select-image-src="selectImageSrc"
        :related-posts="relatedPosts"
        :is-visitor="isVisitor"
        @onChangeImage="changeImage"
        @onChangeLike="changePostLike"
        @onChangeFavorite="changeFavorite"
        @onClickAnswer="addAnswer"
        @onClickReply="clickCommentReply"
        @onClickReplyToReply="clickCommentReplyToReply"
        @onClickComment="clickComment"
        @onChangeCommentLike="changeCommentLike"
        @onChangeCommentReplyLike="changeCommentReplyLike"
        @onCreateRelatedPost="createRelatedPost"
      />
      <interview
        v-if="isPostType === postTypes.INTERVIEW"
        :post="post"
        :comments="comments"
        :total-count="totalCount"
        :src="selectImageSrc"
        :select-image-src="selectImageSrc"
        :related-posts="relatedPosts"
        class="interview"
        :is-visitor="isVisitor"
        @onChangeImage="changeImage"
        @onChangeLike="changePostLike"
        @onChangeFavorite="changeFavorite"
        @onClickAnswer="addAnswer"
        @onClickReply="clickCommentReply"
        @onClickReplyToReply="clickCommentReplyToReply"
        @onClickComment="clickComment"
        @onChangeCommentLike="changeCommentLike"
        @onChangeCommentReplyLike="changeCommentReplyLike"
        @onCreateRelatedPost="createRelatedPost"
      />
      <pick-up
        v-if="isPostType === postTypes.PICKUP"
        :post="post"
        :comments="comments"
        :total-count="totalCount"
        :src="selectImageSrc"
        :select-image-src="selectImageSrc"
        :related-posts="relatedPosts"
        class="pick-up"
        :is-visitor="isVisitor"
        :post-type="post.template"
        @onChangeImage="changeImage"
        @onClickReply="clickCommentReply"
        @onClickReplyToReply="clickCommentReplyToReply"
        @onClickComment="clickComment"
        @onCreateRelatedPost="createRelatedPost"
      />
      <thank-you
        v-if="isPostType === postTypes.THANKYOU"
        :post="post"
        :comments="comments"
        :total-count="totalCount"
        :src="selectImageSrc"
        :select-image-src="selectImageSrc"
        :related-posts="relatedPosts"
        class="thank-you"
        :is-visitor="isVisitor"
        :post-type="post.template"
        @onChangeImage="changeImage"
        @onClickReply="clickCommentReply"
        @onClickReplyToReply="clickCommentReplyToReply"
        @onClickComment="clickComment"
        @onChangeCommentLike="changeCommentLike"
        @onChangeCommentReplyLike="changeCommentReplyLike"
        @onCreateRelatedPost="createRelatedPost"
      />
    </div>
    <vue-loading
      v-if="isLoading"
      type="spin"
      color="#333"
      class="loading"
      :size="{ width: '50px', height: '110px' }"
    />
    <post-create-modal
      v-if="showPostCreateModal"
      :related-post-uuid="relatedPostsUuid"
      :current-related-post="post"
      @close="closeModal"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { VueLoading } from 'vue-loading-template';
import EventDetail from '@/components/App/organisms/eventDetail/EventDetail.vue';
import PostDetail from '@/components/App/organisms/post/PostDetail.vue';
import Interview from '@/components/App/organisms/interview/Interview.vue';
import PickUp from '@/components/App/organisms/pick-up/PickUp.vue';
import ThankYou from '@/components/App/organisms/thank-you/ThankYou.vue';
import PostCreateModal from '@/components/App/organisms/modal/PostCreateModal.vue';
import {
  fetchPost,
  fetchRelatedPosts,
  postFavorite,
  postLike,
  postUnFavorite,
  postUnLike,
  votePostQuestionnaires,
  postEventAnswer,
  fetchComment,
  postCommentLike,
  postCommentUnLike,
  postCommentReplyLike,
  postCommentReplyUnLike,
  postCommentReply,
  postComment,
  fetchUser,
  fetchUserTasks,
  putUserTask,
  fetchUserNotifications,
  putUserNotice,
} from '@/libs/api/app';
import { enumPostTypes } from '@/libs/definition';

type Media = {
  src: string;
  type: string;
};

export default Vue.extend({
  layout: 'app/default',
  components: {
    VueLoading,
    EventDetail,
    PostDetail,
    Interview,
    PickUp,
    ThankYou,
    PostCreateModal,
  },
  data() {
    return {
      isLoading: false as boolean,
      selectImageSrc: '/image/no-image.png' as string,
      post: {} as AppApiResponse.Post,
      comments: [] as AppApiResponse.Comment[],
      totalCount: 0 as number,
      isFetchComments: false as boolean,
      postTypes: enumPostTypes,
      relatedPosts: [] as AppApiResponse.Post[],
      postMedia: [] as Media[],
      accessPermission: 'all' as string,
      showPostCreateModal: false,
      relatedPostsUuid: '' as string,
      tasks: [] as AppApiResponse.UserTask[],
      notices: [] as AppApiResponse.UserNotice[],
    };
  },
  computed: {
    uuid(): string {
      return this.$route.params.id;
    },
    isPostType(): string {
      if (this.post.event != null) {
        return this.postTypes.EVENT;
      }

      switch (this.post.template) {
        case this.postTypes.INTERVIEW:
          return this.postTypes.INTERVIEW;
        case this.postTypes.PICKUP:
          return this.postTypes.PICKUP;
        case this.postTypes.THANKYOU:
          return this.postTypes.THANKYOU;
        default:
          return this.postTypes.DEFAULT;
      }
    },
    isFetchComplete(): boolean {
      return Object.keys(this.post).length > 0 && this.isFetchComments;
    },
    isVisitor(): boolean {
      return ['visitor'].includes(this.accessPermission);
    },
  },
  async created() {
    this.isLoading = true;
    try {
      const {
        data: { access_permission },
      } = await fetchUser(this.$accessor.userProfile.uuid);
      this.accessPermission = access_permission;
      this.fetchPost();
      this.fetchComment();
      this.fetchRelatedPostsData();
    } catch (e) {
      // eslint-disable-next-line no-console
      alert('記事詳細の取得に失敗しました。');
    } finally {
      this.isLoading = false;
    }
    // update notice
    await Promise.all([
      this.fetchTasksData(),
      this.fetchNotificationsData(),
    ]).then(() => {
      const updateTasks: any = [...this.tasks].filter(
        (item: any) =>
          !item.is_read && item.params && item.params.includes(this.uuid)
      );
      if (updateTasks) {
        updateTasks.forEach((task: any) => {
          this.putTasksData(task);
        });
      }

      const updateNotifications: any = [...this.notices].filter(
        (item: any) =>
          !item.is_read && item.params && item.params.includes(this.uuid)
      );
      if (updateNotifications) {
        updateNotifications.forEach((notification: any) => {
          this.putUserNotice(notification);
        });
      }
    });
  },
  methods: {
    async fetchPost() {
      try {
        const { data } = await fetchPost(this.uuid);
        this.post = data;
        if (this.post.videos.length > 0) {
          this.post.videos.map((value: string) => {
            return this.postMedia.push({ src: value, type: 'video' });
          });
        }
        if (this.post.images.length > 0) {
          const [firstImage] = this.post.images;
          this.selectImageSrc = firstImage;
          this.post.images.map((value: string) => {
            return this.postMedia.push({ src: value, type: 'image' });
          });
        }
        if (this.post.videos.length > 0) {
          const [firstElement] = this.post.videos;
          this.selectImageSrc = firstElement;
        }
        if (this.post.images.length === 0 && this.post.videos.length === 0) {
          this.selectImageSrc = '/image/no-image.png';
          this.post.images = ['/image/no-image.png'];
          this.postMedia = [{ src: '/image/no-image.png', type: 'image' }];
        }
        if (this.post.permission === 'system') {
          this.selectImageSrc = '/app/image/welcome-thumbnail.jpg';
          this.post.user = {
            uuid: '',
            icon: '/app/image/welcome-user-icon.jpg',
            name: 'Spotwrite運営',
          };
        } else if (!this.post.user.uuid || !this.post.user.icon) {
          this.post.user = {
            uuid: '',
            icon: '/app/image/default-user-icon.jpg',
            name: '存在しないユーザー',
          };
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        alert('記事詳細の取得に失敗しました。');
      }
    },
    async fetchComment() {
      try {
        const { data } = await fetchComment(this.uuid);
        this.comments = data.comments;
        this.totalCount = data.total_count;
        this.isFetchComments = true;
      } catch (e) {
        // eslint-disable-next-line no-console
        alert('コメントの取得に失敗しました。');
      }
    },
    async fetchRelatedPostsData() {
      try {
        const { data } = await fetchRelatedPosts(this.uuid);
        this.relatedPosts = data.posts;
      } catch (e) {
        // eslint-disable-next-line no-console
        alert('関連記事の取得に失敗しました。');
      }
    },
    changeImage(selectImageSrc: string) {
      const i = this.postMedia.findIndex((f: any) => f.src === selectImageSrc);
      this.selectImageSrc = this.postMedia[i].src;
    },
    changePostLike(boolean: boolean) {
      if (boolean) this.addPostLike();
      if (!boolean) this.removePostLike();
    },
    changeFavorite(boolean: boolean) {
      if (boolean) this.addFavorite();
      if (!boolean) this.removeFavorite();
    },
    clickCommentReplyToReply(reply: AppTypes.Reply) {
      // コメントの返信の返信はできない為、コメントの返信を行っている
      this.clickCommentReply(reply);
    },
    changeCommentLike(comment: AppTypes.LikeComment) {
      if (comment.is_liked) this.addCommentLike(comment);
      if (!comment.is_liked) this.removeCommentLike(comment);
    },
    changeCommentReplyLike(comment: AppTypes.LikeComment) {
      if (comment.is_liked) this.addCommentReplyLike(comment);
      if (!comment.is_liked) this.removeCommentReplyLike(comment);
    },
    addPostLike() {
      try {
        postLike(this.uuid);
        this.post.is_liked = true;
        this.post.like_count += 1;
      } catch (e) {
        alert('いいねができませんでした。');
      }
    },
    removePostLike() {
      try {
        postUnLike(this.uuid);
        this.post.is_liked = false;
        this.post.like_count -= 1;
      } catch (e) {
        alert('いいねが解除できませんでした。');
      }
    },
    addCommentLike(comment: AppTypes.LikeComment) {
      try {
        postCommentLike(comment.uuid);
        this.insertCommentLike(comment.uuid, true);
      } catch (e) {
        alert('いいねができませんでした。');
      }
    },
    removeCommentLike(comment: AppTypes.LikeComment) {
      try {
        postCommentUnLike(comment.uuid);
        this.insertCommentLike(comment.uuid, false);
      } catch (e) {
        alert('いいねが解除できませんでした。');
      }
    },
    addCommentReplyLike(comment: AppTypes.LikeComment) {
      try {
        postCommentReplyLike(comment.uuid);
        this.insertCommentReplyLike(comment.uuid, true);
      } catch (e) {
        alert('いいねができませんでした。');
      }
    },
    removeCommentReplyLike(comment: AppTypes.LikeComment) {
      try {
        postCommentReplyUnLike(comment.uuid);
        this.insertCommentReplyLike(comment.uuid, false);
      } catch (e) {
        alert('いいねが解除できませんでした。');
      }
    },
    insertCommentLike(uuid: string, boolean: boolean) {
      this.comments = this.comments.map((item: AppApiResponse.Comment) => {
        return item.uuid === uuid ? { ...item, is_liked: boolean } : item;
      });
    },
    insertCommentReplyLike(uuid: string, boolean: boolean) {
      this.comments = this.comments.map((comment: AppApiResponse.Comment) => {
        return {
          ...comment,
          replies: comment.replies.map((reply: AppApiResponse.CommentReply) => {
            return reply.uuid === uuid
              ? {
                  ...reply,
                  is_liked: boolean,
                }
              : reply;
          }),
        };
      });
    },
    addFavorite() {
      try {
        postFavorite(this.uuid);
        this.post.is_favorite = true;
      } catch (e) {
        alert('ブックマークできませんでした。');
      }
    },
    removeFavorite() {
      try {
        postUnFavorite(this.uuid);
        this.post.is_favorite = false;
      } catch (e) {
        alert('ブックマークの解除ができませんでした。');
      }
    },
    addAnswer(uuid: string) {
      if (this.post.questionnaire) {
        const questionnaireUuid = this.post.questionnaire.uuid;
        const payload = {
          item_uuid: uuid,
        } as AppApiRequest.QuestionnaireAnswerUuid;
        try {
          votePostQuestionnaires(questionnaireUuid, payload);
          this.insertQuestionnaire(uuid);
        } catch (e) {
          alert('アンケートに投票できませんでした。');
        }
      }
    },
    insertQuestionnaire(uuid: string) {
      if (this.post.questionnaire) {
        this.post.questionnaire.vote = {
          uuid: '',
          content: '',
          vote_at: 0,
        };
        this.post.questionnaire.vote_count += 1;
        this.post.questionnaire.items = this.post.questionnaire.items.map(
          (item: AppApiResponse.QuestionnaireItem) =>
            item.uuid === uuid
              ? {
                  ...item,
                  vote_count: item.vote_count + 1,
                  users: item.users.concat({
                    uuid: this.$store.state.userProfile.uuid,
                    icon: this.$store.state.userProfile.user_icon,
                  }),
                }
              : item
        );
      }
    },
    changeEventAnswer(value: string) {
      if (this.post.event) {
        const eventUuid = this.post.event.uuid;
        const payload = { answer: value } as AppApiRequest.EventAnswer;
        try {
          postEventAnswer(eventUuid, payload);
          this.post.event.answer = value;
        } catch (e) {
          alert('イベントに回答できませんでした。');
        }
      }
    },
    async clickComment(comment: string) {
      const payload = {
        content: comment,
      } as AppApiRequest.Comment;

      try {
        const { data } = await postComment(this.post.uuid, payload);
        this.comments.push(data);
        this.totalCount += 1;
        this.post.comment_count += 1;
      } catch (e) {
        alert('コメントを送信できませんでした。');
      }
    },
    async clickCommentReply(reply: AppTypes.Reply) {
      const payload = {
        content: reply.content,
      } as AppApiRequest.Comment;

      try {
        const { data } = await postCommentReply(reply.commentUuid, payload);
        this.insertReply(reply, data);
      } catch (e) {
        alert('返信コメントを送信できませんでした。');
      }
    },
    insertReply(reply: AppTypes.Reply, data: AppApiResponse.Comment) {
      this.comments = this.comments.map((comment: AppApiResponse.Comment) => {
        return reply.commentUuid === comment.uuid
          ? {
              ...comment,
              replies: [
                // 重複したuuidを省くためにMap型を使用している
                ...new Map(
                  comment.replies
                    .concat(data.replies)
                    .map((item: AppApiResponse.CommentReply) => [
                      item.uuid,
                      item,
                    ])
                ).values(),
              ],
            }
          : { ...comment };
      });
      this.totalCount += 1;
    },
    openModal() {
      this.showPostCreateModal = true;
    },
    closeModal() {
      this.showPostCreateModal = false;
    },
    createRelatedPost() {
      this.relatedPostsUuid = this.uuid;
      this.showPostCreateModal = true;
    },
    async fetchTasksData() {
      try {
        const { data } = await fetchUserTasks();
        this.tasks = data.data;
      } catch (e) {
        console.log(e);
      }
    },
    async putTasksData(task: AppApiResponse.UserTask) {
      try {
        await putUserTask(task.uuid);
      } catch (e) {
        console.log(e);
      }
    },
    async fetchNotificationsData(): Promise<void> {
      try {
        const { data } = await fetchUserNotifications();
        this.notices = data.data;
      } catch (e) {
        console.log(e);
      }
    },
    async putUserNotice(notice: AppApiResponse.UserNotice) {
      try {
        await putUserNotice(notice.uuid);
      } catch (e) {
        console.log(e);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.interview {
  margin: 40px 0 0 0;
}

.pick-up,
.thank-you {
  margin: 80px 0 0;
  position: relative;
}
</style>
