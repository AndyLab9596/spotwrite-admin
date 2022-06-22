<template>
  <div class="container">
    <img
      src="https://spotwrite-test.s3-ap-northeast-1.amazonaws.com/assets_dummy/posts/post_create.png"
      alt=""
      class="dummy-image"
    />
    <img
      src="https://spotwrite-test.s3-ap-northeast-1.amazonaws.com/assets_dummy/posts/internal-info.png"
      alt=""
      class="dummy-image"
    />
    <img
      src="https://spotwrite-test.s3-ap-northeast-1.amazonaws.com/assets_dummy/posts/comment.png"
      alt=""
      class="dummy-image"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  layout: 'app/default',
});
</script>

<style lang="scss" scoped>
.tabs {
  cursor: pointer;
}

.dummy-image {
  width: 100%;
  display: block;
}
</style>
