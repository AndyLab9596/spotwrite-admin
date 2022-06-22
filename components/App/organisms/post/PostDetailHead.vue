<template>
  <div class="head">
    <p class="title">週末どこへ行きましたか？</p>
    <div class="input" @click="showPostCreateModal = true">
      <p class="placeholder">できごとを共有しましょう！</p>
      <img src="/app/icon/Icon-write.svg" alt="" />
    </div>
    <post-create-modal
      v-if="showPostCreateModal"
      @close="showPostCreateModal = false"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import PostCreateModal from '../modal/PostCreateModal.vue';

export default Vue.extend({
  components: {
    PostCreateModal,
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
  margin-bottom: 24px;
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

img {
  position: absolute;
  top: 10px;
  right: 13px;
  width: 16px;
}
</style>
