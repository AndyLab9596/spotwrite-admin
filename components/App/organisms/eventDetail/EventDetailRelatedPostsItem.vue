<template>
  <!--  TODO: 関連記事一覧ページのAPI連携時修正お願いします-->
  <div class="item">
    <img src="/app/icon/icon-human.svg" class="image" />
    <div>
      <p class="title">日本酒飲み比べの会・おすすめのお酒ご紹介！</p>
      <p class="description">
        いよいよ日程が迫ってきました。日本酒飲み比べの会！参加を決めて楽しみにしているメンバー、まだ参加を迷っているみなさんに日程が迫ってきました。日本酒飲み比べ…w
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style lang="scss" scoped>
.image {
  width: 100px;
  object-fit: cover;
  object-position: center;
  margin: 0 24px 0 0;
}

.title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;
  color: $main_color;
  margin: 0 0 16px 0;
}

.description {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3em;
  color: $sub_color;
}

.item {
  display: flex;
}
</style>
