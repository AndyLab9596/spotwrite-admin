<template>
  <div class="bottom-container" :class="{ 'preview-mode': previewMode }">
    <div
      class="profile-wrapper"
      :class="{ link: !isVisitor }"
      @click="goToUserProfile"
    >
      <img class="profile-icon" :src="icon" alt="" />
      <div>
        <span class="name">{{ name }}</span>
        <span class="name main-name">主催者</span>
        <p v-if="organization" class="organization">{{ organization }}</p>
      </div>
    </div>
    <div class="action-wrapper">
      <like-button
        class="like-button"
        :is-liked="isLiked"
        :like-count="likeCount"
        @onChange="changeLike"
      />
      <comment-button class="comment-button" :comment-count="commentCount" />
      <favorite-button
        class="favorite-button"
        :is-favorite="isFavorite"
        @onChange="changeFavorite"
      />
      <div v-if="isMyPost" class="edit-button-wrapper">
        <img
          src="/app/icon/Icon-other.svg"
          class="icon-other"
          @click="isOtherButton = true"
        />
        <div v-if="isOtherButton" class="buttons-container">
          <div class="buttons-container-item">
            <img
              src="/app/icon/close.svg"
              alt="close"
              @click="isOtherButton = false"
            />
          </div>
          <div class="buttons-container-item">
            <img
              src="/app/icon/write.svg"
              alt="write"
              @click="clickEditButton"
            />
          </div>
          <div class="buttons-container-item">
            <img
              src="/app/icon/trash.svg"
              alt="trash"
              @click="clickTrashButton"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LikeButton from '../../atoms/buttons/LikeButton.vue';
import CommentButton from '../../atoms/buttons/CommentButton.vue';
import FavoriteButton from '../../atoms/buttons/FavoriteButton.vue';

export default Vue.extend({
  components: {
    LikeButton,
    CommentButton,
    FavoriteButton,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: false,
      default: null,
    },
    isLiked: {
      type: Boolean,
      required: true,
    },
    likeCount: {
      type: Number,
      required: true,
    },
    commentCount: {
      type: Number,
      required: true,
    },
    isFavorite: {
      type: Boolean,
      required: true,
    },
    userUuid: {
      type: String,
      required: true,
    },
    isVisitor: {
      type: Boolean,
      required: false,
    },
    previewMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOtherButton: false as boolean,
    };
  },
  computed: {
    isMyPost(): boolean {
      return this.$store.state.userProfile.u === this.userUuid;
    },
  },
  methods: {
    changeLike(boolean: boolean) {
      this.$emit('onChange', boolean);
    },
    changeFavorite(boolean: boolean) {
      this.$emit('onChangeFavorite', boolean);
    },
    clickTrashButton() {
      // TODO: 記事削除の実装お願いします
    },
    clickEditButton() {
      // TODO: 記事編集の実装お願いします
    },
    goToUserProfile(): void {
      if (!this.isVisitor) {
        this.$router.push(`/users/${this.userUuid}`);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.profile-icon {
  height: 40px;
  width: 40px;
  border-radius: 15px;
  box-shadow: 0 1px 2px $box-shadow;
  margin: 0 15px 0 0;
  object-fit: cover;
}

.name {
  color: $main_color;
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;
  margin: 0 0 6px 0;
}

.main-name {
  color: $link_color;
}

.organization {
  color: $sub_color;
  font-size: 11px;
  font-weight: 300;
  line-height: 1em;
}

.bottom-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.action-wrapper {
  display: flex;
}

.like-button,
.comment-button {
  margin: 0 16px 0 0;
}

.icon-other {
  width: 16px;
  cursor: pointer;
  margin: 0 0 0 24px;
}

.buttons-container {
  position: absolute;
  top: -15px;
  right: -15px;
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

.edit-button-wrapper {
  position: relative;
  display: flex;
}

.profile-wrapper {
  display: flex;
  align-items: center;

  &.link {
    cursor: pointer;
  }
}

.preview-mode {
  pointer-events: none;
}
</style>
