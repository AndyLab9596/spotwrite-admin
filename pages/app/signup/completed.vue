<template>
  <div class="page-container">
    <div class="inner">
      <img class="logo" src="/image/logo_white@2x.png" />
      <p class="download-text">アプリをダウンロード</p>
      <a href="https://apps.apple.com/us/app/spotwrite/id1518737572">
        <img class="logo" src="/image/apple.png" />
      </a>
      <br />
      <a
        href="https://play.google.com/store/apps/details?id=jp.worksmedia.spotwrite"
      >
        <img
          class="logo"
          src="/image/google-play-badge.png"
          width="152"
          height="64"
        />
      </a>
      <br />
      <br />
      <p class="bottom-text">PCではブラウザ版がご利用いただけます。</p>
      <p class="bottom-text">
        スマートフォンでのご利用は<a
          href="https://apps.apple.com/us/app/spotwrite/id1518737572"
          >こちら</a
        >から。
      </p>
      <p class="bottom-text">
        PC版ログイン画面は<a href="/login">こちら</a>から。
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  layout: 'clean',
});
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(45deg, #e39999, #8a8faf);
}

.inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
  padding: 27px 30px 31px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
}

.download-text {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 40px;
}

.bottom-text {
  color: #fff;
  font-size: 15px;
  font-weight: 300;
}
</style>
