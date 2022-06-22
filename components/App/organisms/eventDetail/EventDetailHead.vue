<template>
  <div class="head">
    <div class="title-wrapper">
      <div class="icon">
        <img src="/app/icon/event.svg" class="event-icon" alt="" />
      </div>
      <p class="title">イベントについての記事を書く</p>
    </div>
    <div class="input" @click="showPostCreateModal = true">
      <p class="placeholder">イベントについて書いてみよう</p>

      <img class="icon-write" src="/app/icon/Icon-write.svg" alt="" />
    </div>
    <post-create-modal
      v-if="showPostCreateModal"
      :related-post-uuid="relatedPostUuid"
      :current-related-post="currentRelatedPost"
      @close="showPostCreateModal = false"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import PostCreateModal from '../modal/PostCreateModal.vue';

export default Vue.extend({
  components: {
    PostCreateModal,
  },
  props: {
    relatedPostUuid: {
      type: String,
      required: false,
      default: '',
    },
    currentRelatedPost: {
      type: Object as PropType<AppApiResponse.Post>,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      showPostCreateModal: false,
    };
  },
});
</script>

<style lang="scss" scoped>
.head {
  width: 100%;
  background-color: $background_color;
  padding: 26px 40px 23px;
}

.title {
  color: $main_color;
  font-size: 15px;
  font-weight: 300;
  line-height: 1em;
}

.input {
  display: flex;
  align-items: center;
  height: 52px;
  background-color: $true_white;
  border-radius: 4px;
  box-shadow: 0 1px 2px $box-shadow;
  position: relative;
  cursor: pointer;
}

.placeholder {
  color: $sub_color;
  font-size: 15px;
  line-height: 1em;
  font-weight: 300;
  font-family: 'Hiragino Sans CNS', sans-serif;
  margin-left: 16px;
}

.icon-write {
  position: absolute;
  top: 10px;
  right: 13px;
  width: 16px;
}

.event-icon {
  width: 16px;
}

.icon {
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $event_icon_color;
  margin: 0 14px 0 0;
}

.title-wrapper {
  display: flex;
  align-items: center;
  margin: 0 0 24px 0;
}
</style>
