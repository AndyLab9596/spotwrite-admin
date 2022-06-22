<template>
  <div v-if="show" class="sidebar">
    <div class="logo">
      <nuxt-link tag="a" to="/system-admin/">
        <img src="/image/logo.svg" />
      </nuxt-link>
    </div>
    <smail class="description">For operating company</smail>
    <div class="accordion-wrapper">
      <p class="accordion-wrapper-title">Menu</p>
      <Accordion
        v-for="(sideMenu, index) in sideMenuList"
        :key="index"
        :title="sideMenu.title"
        :icon-path="sideMenu.iconPath"
        :body="sideMenu.body"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Accordion from '~/components/Admin/Modules/Accordion/Accordion.vue';

export default Vue.extend({
  components: {
    Accordion,
  },
  data() {
    const hiddenHeaderPages = ['register', 'login'];
    return {
      sideMenuList: [
        {
          title: 'spotwrite運用管理',
          iconPath: '/icon/icon_pyramid-structure.png',
          body: [
            {
              name: '記事テーマ登録',
              path: '/system-admin/article-theme',
            },
            {
              name: 'お知らせ管理',
              path: '/system-admin/notice',
            },
          ],
        },
        {
          title: '契約会社管理',
          iconPath: '/icon/icon_graph.png',
          body: [
            { name: '契約会社一覧', path: '/system-admin/contract-company/' },
          ],
        },
      ],
      show: !hiddenHeaderPages.includes(
        this.$router.currentRoute.name as string
      ),
    };
  },
  watch: {
    $route() {
      const hiddenHeaderPages = ['register', 'login'];
      this.$data.show = !hiddenHeaderPages.includes(
        this.$router.currentRoute.name as string
      );
    },
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

.sidebar {
  width: 200px;
  border-right: solid 1px $light_gray_blue_3;
  background-color: $white_1;
  font-family: 'Hiragino Kaku Gothic Pro', sans-serif;
}

img {
  object-fit: contain;
}

.logo {
  display: flex;
  align-items: center;
  height: 100px;
  padding-left: 40px;

  img {
    width: 100px;
    height: 41.63px;
  }
}

.description {
  display: flex;
  align-items: center;
  text-align: center;
  height: 10px;
  color: $pink;
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  font-size: 10px;
  margin: 0 20px 20px 35px;
}

.top-buttons {
  flex-flow: column;
  margin: 0 0 25px 0;
}

.button-item {
  margin: 0 20px 10px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.icon-logout {
  height: 14px;
  margin: 0 16px 0 0;
}

.accordion-wrapper-title {
  color: $pink;
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  font-size: 10px;
  margin: 0 0 15px 20px;
}

.copyright {
  text-align: center;
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 400;
  font-size: 10px;
  line-height: 1em;
  color: $pastel_blue;
  margin: 43px 0 71px;
  white-space: nowrap;
}

.logout {
  display: flex;
  flex-flow: row;
  align-items: center;
  border: none;
  background-color: transparent;
  margin: 0 0 20px 20px;

  p {
    font-family: 'Noto Sans JP', sans-serif;
    font-weight: 700;
    font-size: 12px;
    line-height: 1em;
    color: $pink;
    white-space: nowrap;
  }
}
</style>
