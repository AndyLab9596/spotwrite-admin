<template>
  <div>
    <div class="card-wrapper" @click="goToEventDetail">
      <div class="card-item" :style="{ borderLeft: `4px solid ${setColor}` }">
        <div class="left-wrapper">
          <p class="left-date">{{ formattedDate }}</p>
          <p class="left-week">({{ formattedWeek }})</p>
          <p class="left-plans" :style="{ color: setColor }">{{ setAnswer }}</p>
        </div>
        <div class="middle-wrapper">
          <p class="title">{{ posts.title }}</p>
          <p class="description">{{ posts.content }}</p>
          <div class="middle-row">
            <div v-if="posts.event.place" class="row-item">
              <img src="/app/icon/Icon-place.svg" alt="" class="icon-place" />
              <span class="place-text">{{ posts.event.place }}</span>
            </div>
            <div class="row-item">
              <img src="/app/icon/Icon-time.svg" alt="" class="icon-time" />
              <span class="place-text time">
                {{ formattedStartTime }}
                〜
                {{ formattedEndTime }}
              </span>
            </div>
          </div>
          <!--          TODO: 関連記事一覧ページを実装してください-->
          <div
            v-if="posts.event.relation_post_count > 0"
            class="middle-bottom-wrapper"
          >
            <div class="bottom-item">
              <img
                src="/app/icon/Icon-article.svg"
                alt=""
                class="icon-article"
              />
              <span class="article-text">関連記事</span>
              <span class="count-number-text">
                {{ posts.event.relation_post_count }}
              </span>
              <span class="count-text">件</span>
              <img
                src="/app/icon/Icon-arrow_right.svg"
                alt=""
                class="icon-arrow"
              />
            </div>
          </div>
        </div>
        <img
          v-if="!isVisitor"
          src="/app/icon/Icon-write.svg"
          alt=""
          class="icon-write"
          @click="openModal"
        />
      </div>
    </div>
    <post-create-modal
      v-if="showPostCreateModal"
      :related-post-uuid="posts.uuid"
      :current-related-post="posts"
      @close="closeModal"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from '@/libs/dayjs';
import PostCreateModal from '../modal/PostCreateModal.vue';

export default Vue.extend({
  components: {
    PostCreateModal,
  },
  props: {
    posts: {
      type: Object as PropType<ApiResponse.Post>,
      required: true,
    },
    isVisitor: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showPostCreateModal: false as boolean,
    };
  },
  computed: {
    formattedStartTime(): string {
      return this.posts.event
        ? dayjs.unix(this.posts.event.start_at).format('HH:mm')
        : '';
    },
    formattedEndTime(): string {
      return this.posts.event
        ? dayjs.unix(this.posts.event.end_at).format('HH:mm')
        : '';
    },
    formattedDate(): string {
      return this.posts.event
        ? dayjs.unix(this.posts.event.start_at).format('DD')
        : '';
    },
    formattedWeek(): string {
      return this.posts.event
        ? dayjs.unix(this.posts.event.start_at).format('ddd')
        : '';
    },
    setColor(): string {
      switch (this.posts.event && this.posts.event.answer) {
        // 参加する
        case 'participation':
          return '#f09c9c';
        // 不参加
        case 'non-participation':
          return '#f2f3f7';
        // 未定
        case 'undecided':
          return '#f2f3f7';
        default:
          break;
      }
      return 'transparent';
    },
    setAnswer(): string {
      switch (this.posts.event && this.posts.event.answer) {
        case 'participation':
          return '参加';
        case 'non-participation':
          return '不参加';
        case 'undecided':
          return '未定';
        default:
          break;
      }
      return '';
    },
  },
  methods: {
    goToEventDetail(): void {
      this.$router.push(`/posts/${this.posts.uuid}`);
    },
    openModal(e: Event) {
      e.stopPropagation();
      this.showPostCreateModal = true;
    },
    closeModal() {
      this.showPostCreateModal = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.card-wrapper {
  width: 100%;
  box-shadow: 0 1px 4px rgba(220, 229, 239, 1);
  background-color: #fff;
  padding: 16px 14px;
  margin-bottom: 16px;
  cursor: pointer;
}

.card-item {
  display: flex;
  border-radius: 4px;
  margin-left: 14px;
}

.left-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px 24px 0 14px;
  width: 56px;
}

.left-date {
  font-size: 28px;
  color: #2e303e;
  margin-bottom: 8px;
  line-height: 1em;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
}

.left-week {
  font-size: 13px;
  color: #2e303e;
  margin-bottom: 8px;
  font-weight: 300;
  line-height: 1em;
}

.left-plans {
  font-size: 15px;
  color: #f09c9c;
  font-weight: 600;
  line-height: 1em;
}

.middle-wrapper {
  margin: 16px 0 0 0;
  width: 100%;
}

.title {
  color: #2e303e;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  line-height: 1em;
}

.description {
  color: #9c9da5;
  font-size: 15px;
  margin-bottom: 22px;
  line-height: 1.6em;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.middle-row {
  display: flex;
  align-items: center;
  padding-bottom: 13px;
}

.row-item {
  display: flex;
  align-items: center;

  &:first-of-type {
    margin-right: 52px;
  }
}

.place-text {
  font-size: 15px;
  line-height: 1em;
  color: #2e303e;
}

.time {
  font-family: 'Lato', sans-serif;
}

.middle-bottom-wrapper {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e8ebed;
  margin: 12px 0 0 0;
  padding: 18px 0 0 0;
}

.bottom-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.article-text,
.count-text,
.count-number-text {
  color: #2e303e;
  font-size: 15px;
  line-height: 1em;
}

.article-text {
  margin-right: 6px;
}

.count-text {
  margin-right: 16px;
}

.count-number-text {
  font-family: 'Lato', sans-serif;
  margin-right: 3px;
  font-weight: 400;
}

.icon-place {
  width: 12px;
  margin-right: 15px;
}

.icon-time {
  width: 16px;
  margin-right: 14px;
}

.icon-article {
  width: 16px;
  margin-right: 7px;
}

.icon-arrow {
  width: 8px;
}

.icon-write {
  height: 16px;
  margin-top: 8px;
  cursor: pointer;
}
</style>
