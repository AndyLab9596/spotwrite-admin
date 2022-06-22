<template>
  <div class="bottom-container" :class="{ 'preview-mode': previewMode }">
    <div
      class="profile-wrapper"
      :class="{ link: userUuid && !isVisitor }"
      @click="goToUserProfile"
    >
      <img :src="icon" class="icon" alt="" />
      <div>
        <p class="name">{{ name }}</p>
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
    userUuid: {
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
    isVisitor: {
      type: Boolean,
      default: false,
    },
    previewMode: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    changeLike(boolean: boolean) {
      this.$emit('onChange', boolean);
    },
    changeFavorite(boolean: boolean) {
      this.$emit('onChangeFavorite', boolean);
    },
    goToUserProfile(): void {
      if (!this.userUuid || this.isVisitor) {
        return;
      }
      this.$router.push(`/users/${this.userUuid}`);
    },
  },
});
</script>

<style lang="scss" scoped>
.icon {
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
