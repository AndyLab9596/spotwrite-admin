<template>
  <transition name="modal" appear>
    <div class="modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="return-edit">
          <button class="return-button" @click.self="onClose">
            編集に戻る
          </button>
        </div>
        <div class="modal-contents">
          <div class="content-body">
            <div>
              <event-detail-preview
                v-if="isPostType === postTypes.EVENT"
                :post="insertImagePost"
                :comments="comments"
                :total-count="totalCount"
                :src="selectImageSrc"
                :select-image-src="selectImageSrc"
                :preview-mode="true"
                class="default"
                @onChangeImage="changeImage"
              />
              <post-detail-preview
                v-if="isPostType === postTypes.DEFAULT"
                :post="insertImagePost"
                :comments="comments"
                :total-count="totalCount"
                :src="selectImageSrc"
                :select-image-src="selectImageSrc"
                :select-image-src-type="selectImageSrcType"
                :preview-mode="true"
                class="default"
                @onChangeImage="changeImage"
              />
              <interview
                v-if="isPostType === postTypes.INTERVIEW"
                :post="insertImagePost"
                :comments="comments"
                :total-count="totalCount"
                :src="selectImageSrc"
                :select-image-src="selectImageSrc"
                :preview-mode="true"
                :post-type="post.template"
                :related-posts="relatedPosts"
                class="interview"
                @onChangeImage="changeImage"
              />
              <pick-up
                v-if="isPostType === postTypes.PICKUP"
                :post="insertImagePost"
                :comments="comments"
                :total-count="totalCount"
                :src="selectImageSrc"
                :select-image-src="selectImageSrc"
                :preview-mode="true"
                :post-type="post.template"
                :related-posts="relatedPosts"
                class="pick-up"
                @onChangeImage="changeImage"
              />
              <thank-you
                v-if="isPostType === postTypes.THANKYOU"
                :post="insertImagePost"
                :comments="comments"
                :total-count="totalCount"
                :src="selectImageSrc"
                :select-image-src="selectImageSrc"
                :preview-mode="true"
                :related-posts="relatedPosts"
                :post-type="post.template"
                class="thank-you"
                @onChangeImage="changeImage"
              />
            </div>
            <vue-loading
              v-if="isLoading"
              type="spin"
              color="#333"
              class="loading"
              :size="{ width: '50px', height: '110px' }"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { VueLoading } from 'vue-loading-template';
import { enumPostTypes } from '@/libs/definition';
import EventDetailPreview from '../eventDetail/EventDetailPreview.vue';
import PostDetailPreview from '../post/PostDetailPreview.vue';
import Interview from '../interview/Interview.vue';
import PickUp from '../pick-up/PickUp.vue';
import ThankYou from '../thank-you/ThankYou.vue';

export default Vue.extend({
  components: {
    VueLoading,
    EventDetailPreview,
    PostDetailPreview,
    Interview,
    PickUp,
    ThankYou,
  },
  props: {
    post: {
      type: Object as PropType<AppApiResponse.Post>,
      required: true,
    },
    selectedImageSrc: {
      type: String,
      required: true,
    },
    selectedImageSrcType: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    isLoading: false as boolean,
    comments: [] as AppApiResponse.Comment[],
    totalCount: 0 as number,
    isFetchComments: false as boolean,
    selectImageSrc: '/image/no-image.png' as string,
    selectImageSrcType: '' as string,
    postTypes: enumPostTypes,
    relatedPosts: [] as AppApiResponse.Post[],
  }),
  computed: {
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
    insertImagePost() {
      return {
        ...this.post,
        images:
          this.post.images.length > 0 || this.post.videos.length > 0
            ? this.post.images
            : ['/image/no-image.png'],
        thumbnail:
          this.post.thumbnail !== ''
            ? this.post.thumbnail
            : '/image/no-image.png',
      };
    },
  },
  mounted() {
    this.selectImageSrc = this.selectedImageSrc
      ? this.selectedImageSrc
      : '/image/no-image.png';
    this.selectImageSrcType = this.selectedImageSrcType;
  },
  methods: {
    onClose() {
      this.$emit('closePreviewModal');
    },
    changeImage(selectImageSrc: string) {
      const i = this.post.images.indexOf(selectImageSrc) as number;
      if (i >= 0) {
        this.selectImageSrc = this.post.images[i];
        this.selectImageSrcType = 'image';
      } else {
        const j = this.post.videos.indexOf(selectImageSrc) as number;
        if (j >= 0) {
          this.selectImageSrc = this.post.videos[j];
          this.selectImageSrcType = 'video';
        }
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
  min-width: 800px;
  height: 100%;
  padding-bottom: 80px;
  background-color: $true_white;
  margin-top: 92px;
  position: relative;
}

.modal-contents {
  height: 100%;
  overflow-y: scroll;
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

.return-edit {
  position: absolute;
  top: -38px;
  right: calc(-23px + 22px);
}

.return-button {
  width: 136px;
  height: 28px;
  font-size: 12px;
  appearance: none;
  background-color: $button_background_color;
  color: $gentle_bluish_purple;
  border: none;
  box-shadow: none;
  border-radius: 4px;
  cursor: pointer;
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

  .default {
    width: 703px;
  }

  .interview,
  .pick-up,
  .thank-you {
    margin-left: -30px;
    margin-right: -30px;
    overflow: hidden;
    padding: 40px 60px;
    width: 920px;
    position: relative;
    z-index: 1;
  }

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
