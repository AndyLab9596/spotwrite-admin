<template>
  <transition name="modal" appear>
    <div class="modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <PostDraftModalHeader title="下書き" />
        <div class="content-body">
          <post-draft-item
            v-for="(post, index) in posts"
            :key="index"
            :title="post.title"
            :drafted-at="post.drafted_at"
            :post-uuid="post.uuid"
            :disabled="post.uuid === draftPostUuid"
            @trash="clickTrashButton"
            @click="clickItem"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';
import PostDraftItem from '@/components/App/organisms/post/PostDraftModal/PostDraftItem.vue';
import PostDraftModalHeader from '@/components/App/organisms/post/PostDraftModal/Header.vue';
import { fetchDraftPosts, deleteDraftPost } from '@/libs/api/app';

export default Vue.extend({
  filters: {
    dateTimeFilter(unixTime: string) {
      if (unixTime) {
        return dayjs.unix(Number(unixTime)).format('YYYY/MM/DD hh:mm');
      }
      return null;
    },
  },
  components: {
    PostDraftModalHeader,
    PostDraftItem,
  },
  props: {
    isInternalCommunicationsPage: {
      type: Boolean,
      required: false,
      default: false,
    },
    roomId: {
      type: Number,
      required: false,
      default: 0,
    },
    draftPostUuid: {
      type: String,
      required: false,
      default: '',
    },
  },
  data: () => ({
    posts: [] as AppApiResponse.Post[],
  }),
  created() {
    this.fetchDraftPosts();
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    clickItem(uuid: string) {
      this.$emit('click', uuid);
    },
    async fetchDraftPosts(): Promise<void> {
      const { data } = await fetchDraftPosts();
      if (this.isInternalCommunicationsPage) {
        this.posts = this.setInternalCommunicationsData(data.posts);
      } else {
        this.posts = data.posts;
      }
    },
    setInternalCommunicationsData(
      posts: AppApiResponse.Post[]
    ): AppApiResponse.Post[] {
      return posts.filter(
        (item: AppApiResponse.Post) => item.type === 'internal-communication'
      );
    },
    async clickTrashButton(uuid: string): Promise<void> {
      try {
        await deleteDraftPost(uuid);
        if (this.$props.roomId > 0) {
          window.location.reload();
        }
        // FIXME: 挙動の仕様が決まってないので、一旦、全画面リロード
        this.fetchDraftPosts();
      } catch (e) {
        alert('記事を削除できませんでした。');
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  width: 800px;
  overflow-y: scroll;
  height: 100%;
  padding-bottom: 80px;
  background-color: $true_white;
}

// オーバーレイのトランジション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  // オーバーレイに包含されているモーダルウィンドウのトランジション
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

// ディレイを付けるとモーダルウィンドウが消えた後にオーバーレイが消える
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.modal-enter {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.content-body {
  padding: 0 40px;

  .draft-list {
    background: $white_1;
    border: $ruled_line 1px solid;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    height: 80px;
    align-items: center;
    margin-top: 18px;
    padding: 0 24px;

    .content-left {
      display: flex;

      .title {
        font-size: 15px;
        padding-right: 26px;
        padding-left: 15px;
        font-weight: bold;
      }

      .date {
        color: $sub_color;
      }
    }

    .delete-button {
      width: 119px;

      &:hover {
        background-color: $light_gray_blue_8;
      }

      img {
        vertical-align: middle;
      }
    }
  }
}

.category-box {
  padding-top: 18px;
  padding-bottom: 18px;

  .heading {
    font-size: 13px;
    font-weight: 600;
  }

  .categories {
    margin-top: 8px;
    display: flex;
    font-size: 13px;
    color: $link_color;

    li {
      border: 1px solid $link_color;
      border-radius: 14px;
      // width: 130px;
      height: 28px;
      padding: 0 28px;
      text-align: center;
      line-height: 28px;
      cursor: pointer;
    }

    li:not(:last-child) {
      margin-right: 16px;
    }

    .active {
      color: $true_white;
      background-color: $link_color;
    }
  }
}
</style>
