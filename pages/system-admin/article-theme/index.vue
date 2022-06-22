<template>
  <div class="page-container">
    <div class="page">
      <h1 class="page-title">
        <img class="icon-gear-dark" src="/icon/icon_gear-dark.svg" />
        記事テーマ登録・作成済みテーマ一覧
      </h1>
      <div class="contents">
        <div class="tab-navigations">
          <public-tabs :is-public="isPublic" @change-tab="changeTab($event)" />
          <add-button class="button add" @click="openCreateModal = true">
            記事テーマを新規で登録
          </add-button>
        </div>
        <div class="tab-contents">
          <vue-loading
            v-if="isLoading"
            type="spin"
            color="#333"
            :size="{ width: '50px', height: '50px' }"
          />
          <div v-else>
            <div
              v-for="rating in [1, 2, 3, 4, 5]"
              :key="`rating-${rating}`"
              class="theme-group"
            >
              <div v-if="ratingCount(rating)">
                <star-rating :rating="rating" />
                <div
                  v-for="articleTheme in ratingArticleThemeList(rating)"
                  :key="`theme-${articleTheme.uuid}`"
                  class="theme-card"
                  :class="{ 'free-theme': articleTheme.is_free_theme }"
                >
                  <div class="heading">
                    <button
                      v-if="articleTheme.order_count"
                      class="order-count"
                      @click="openOwnerListModal(articleTheme)"
                    >
                      {{ articleTheme.order_count }}社利用中
                    </button>
                    <div v-else class="order-count empty">
                      利用なし
                    </div>
                    <div class="title">{{ articleTheme.title }}</div>
                    <div class="used-count">
                      採用回数：{{ articleTheme.use_count }}回
                    </div>
                    <button
                      class="button edit"
                      @click="openUpdatePostThemeModal(articleTheme.uuid)"
                    >
                      編集
                    </button>
                    <button
                      v-if="articleTheme.is_public"
                      class="button invisible"
                      @click="
                        updatePostTheme(articleTheme.uuid, { is_public: 0 })
                      "
                    >
                      非表示
                    </button>
                    <button
                      v-else
                      class="button visible"
                      @click="
                        updatePostTheme(articleTheme.uuid, { is_public: 1 })
                      "
                    >
                      表示
                    </button>
                  </div>
                  <hr class="line" />
                  <div class="note">{{ articleTheme.description }}</div>
                  <button
                    class="sample-text-link"
                    @click="toggleSampleText(articleTheme.uuid)"
                  >
                    記事サンプルを表示
                    <span
                      :class="{
                        opened:
                          themeSampleTextShowList.indexOf(articleTheme.uuid) >=
                          0,
                      }"
                    >
                      <img src="/icon/icon_open@2x.png" />
                    </span>
                  </button>
                  <div
                    v-if="
                      themeSampleTextShowList.indexOf(articleTheme.uuid) >= 0
                    "
                    class="sample-text-body"
                  >
                    {{ articleTheme.sample_text }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <owner-list-modal
      v-if="ownerListModalShow"
      :owner-list="ownerListModalItems"
      @close="ownerListModalShow = false"
    />
    <create-modal
      v-if="openCreateModal"
      @close="openCreateModal = false"
      @fresh="callRefresh"
    />
    <update-modal
      v-if="openUpdateModal"
      :uuid="currentUpdatePostThemeUuid"
      @close="openUpdateModal = false"
      @fresh="callRefresh"
    />
    <loading-overlay v-if="isLoadingOverlay" />
    <alert-message v-if="alertMessageShow == 1" @close="alertMessageShow = 0">
      この記事テーマを利用中企業があります。<br />記事テーマを一覧から非表示することはできません。
    </alert-message>
    <alert-message
      v-else-if="alertMessageShow == 2"
      @close="alertMessageShow = 0"
    >
      一覧に表示中のテーマは上限の1〇件に達しています。<br />この記事テーマを一覧に表示することができません。
    </alert-message>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { VueLoading } from 'vue-loading-template';

import { LoadingOverlay, AddButton } from '@/components/Admin/Pages';

import PublicTabs from '@/components/SystemAdmin/Pages/ArticleTheme/PublicTabs.vue';
import StarRating from '@/components/SystemAdmin/Pages/ArticleTheme/StarRating.vue';
import AlertMessage from '@/components/SystemAdmin/Pages/ArticleTheme/AlertMessage.vue';
import CreateModal from '@/components/SystemAdmin/Pages/ArticleTheme/ArticleThemeCreateModal.vue';
import UpdateModal from '@/components/SystemAdmin/Pages/ArticleTheme/ArticleThemeUpdateModal.vue';
import OwnerListModal from '@/components/SystemAdmin/Pages/ArticleTheme/OwnerListModal.vue';

import { fetchAdminPostTheme, updateAdminPostTheme } from '@/libs/api';

type AdminPostTheme = ApiResponse.AdminPostTheme;

type PostTheme = ApiRequest.PostTheme;

type Owner = {
  uuid: string;
  name: string;
};

export default Vue.extend({
  layout: 'system-admin/default',
  components: {
    VueLoading,
    LoadingOverlay,
    PublicTabs,
    AddButton,
    StarRating,
    AlertMessage,
    CreateModal,
    UpdateModal,
    OwnerListModal,
  },
  data() {
    return {
      isLoading: true,
      isLoadingOverlay: false,
      isPublic: 1,
      articleThemeSize: {
        invisible: 0,
        visible: 0,
      },
      articleThemeList: [] as null | AdminPostTheme[],
      themeSampleTextShowList: [] as string[],
      ownerListModalItems: [] as null | Owner[],
      currentUpdatePostThemeUuid: '',
      ownerListModalShow: false,
      openCreateModal: false,
      openUpdateModal: false,
      updateLoading: false,
      alertMessageShow: 0,
    };
  },
  async created() {
    await this.refreshTheme();
    this.isLoading = false;
    this.$router.push('/system-admin/article-theme');
  },
  methods: {
    async updatePostTheme(uuid: string, updatePostTheme: PostTheme) {
      if (updatePostTheme.is_public === 0 && this.themeIsUse(uuid)) {
        this.alertMessageShow = 1;
      } else if (
        updatePostTheme.is_public === 1 &&
        this.articleThemeSize.visible >= 10
      ) {
        this.alertMessageShow = 2;
      } else {
        try {
          this.isLoadingOverlay = true;
          await updateAdminPostTheme(uuid, updatePostTheme);
        } catch (e) {
          throw new Error(e);
        } finally {
          this.isLoadingOverlay = false;
          this.refreshTheme();
        }
      }
    },
    async refreshTheme() {
      this.isLoading = true;
      const {
        data: { post_themes: adminPostThemes, size: postThemeSize },
      } = await fetchAdminPostTheme(this.isPublic);
      this.articleThemeList = adminPostThemes;
      this.articleThemeSize = postThemeSize;
      this.ownerListModalShow = false;
      this.isLoading = false;
    },
    getThemeByUuid(uuid: string) {
      if (this.articleThemeList) {
        const theme = this.articleThemeList.filter(
          (articleTheme: AdminPostTheme) => {
            return articleTheme.uuid === uuid;
          }
        );
        if (theme.length) {
          return theme[0];
        }
        return false;
      }
      return false;
    },
    themeIsUse(uuid: string) {
      const theme: false | AdminPostTheme = this.getThemeByUuid(uuid);
      if (theme !== false) {
        return !!(theme.order_count + theme.use_count);
      }
      return false;
    },
    changeTab(isPublic: number) {
      this.isPublic = isPublic;
      this.refreshTheme();
    },
    ratingCount(rating: number) {
      return this.ratingArticleThemeList(rating).length;
    },
    ratingArticleThemeList(rating: number) {
      if (this.articleThemeList) {
        const filteredArticleThemeList = this.articleThemeList.filter(
          (articleTheme: AdminPostTheme) => {
            return articleTheme.difficulty_level === rating;
          }
        );
        // フリーテーマを一番上にする
        return filteredArticleThemeList.sort((a: any, b: any) => {
          if (a.is_free_theme < b.is_free_theme) {
            return 1;
          }
          return -1;
        });
      }
      return [];
    },
    toggleSampleText(uuid: string) {
      const index = this.themeSampleTextShowList.indexOf(uuid);
      if (index >= 0) {
        this.themeSampleTextShowList.splice(index);
      } else {
        this.themeSampleTextShowList.push(uuid);
      }
    },
    openOwnerListModal(theme: AdminPostTheme) {
      this.ownerListModalItems = theme.owners;
      this.ownerListModalShow = true;
    },
    openUpdatePostThemeModal(uuid: string) {
      this.currentUpdatePostThemeUuid = uuid;
      this.openUpdateModal = true;
    },
    callRefresh() {
      this.refreshTheme();
    },
  },
});
</script>

<style lang="scss" scoped>
.page-container {
  background-color: #fff;
  padding-bottom: 40px;
}

.page {
  width: 960px;
  min-height: calc(100% - 128px);
  margin-left: 40px;

  &-title {
    font-size: 24px;
    padding: 10px;
    margin-bottom: 18px;
    color: #2e303e;
    font-weight: normal;

    .icon-gear-dark {
      height: 36px;
      margin-right: 34px;
    }
  }
}

.contents {
  position: relative;
  height: 100%;
  min-height: 800px;

  .tab-navigations {
    display: -ms-flex;
    display: -moz-flex;
    display: -webkit-flex;
    display: flex;
    -ms-align-items: center;
    align-items: center;
    margin-bottom: 15px;

    .button.add {
      margin-left: auto;
    }
  }

  .tab-contents {
    background: #fff;
    border: solid 1px #e4e5ed;
    border-radius: 4px;
    padding: 30px 30px 40px 30px;

    .theme-group {
      &:not(:last-child) {
        margin-bottom: 40px;
      }

      .star-rating {
        margin-bottom: 15px;
      }

      .theme-card {
        border: solid 1px #e4e5ed;
        border-radius: 4px;
        padding: 15px 20px;
        font-size: 15px;

        .heading {
          display: -ms-flex;
          display: -moz-flex;
          display: -webkit-flex;
          display: flex;
          -ms-align-items: center;
          align-items: center;

          > * {
            line-height: 20px;

            &.order-count {
              color: #fff;
              border: none;
              border-radius: 4px;
              min-width: 90px;
              height: 30px;
              text-align: center;

              &.empty {
                line-height: 28px;
                border: solid 1px #7e8195;
                background: #fff;
                color: #2e303e;
              }

              &:not(.empty) {
                background: #7e8195;
              }
            }

            &.title {
              margin-left: 10px;
              margin-right: 57px;
              color: #2e303e;
            }

            &.used-count {
              color: #2e303e;
              white-space: nowrap;
              margin-right: 10px;
            }

            &.button {
              color: #6a6d83;
              border-radius: 4px;
              padding: 2px 5px;
              min-width: 100px;
              height: 30px;
              text-align: center;

              &.edit {
                margin-left: auto;
                border: solid 1px #e4e5ed;
                background: #eee;
              }

              &.invisible,
              &.visible {
                margin-left: 10px;
                background: #fff;
                border: solid 1px #7e8195;
              }
            }
          }
        }

        .line {
          border: solid #e4e5ed;
          border-width: 1px 0 0 0;
          margin: 10px 0;
        }

        .sample-text-link {
          margin-top: 10px;
          background: #fff;
          border: none;
          padding: 0;
          height: 24px;
          line-height: 14px;

          span {
            border: solid 1px #e4e5ed;
            padding: 4px 3px;
            border-radius: 4px;
            margin-left: 25px;

            img {
              width: 16px;
              height: 16px;
            }

            &.opened {
              img {
                transform: rotate(180deg);
              }
            }
          }
        }

        .sample-text-body {
          margin-top: 10px;
        }

        & + .theme-card {
          margin-top: 20px;
        }

        &.free-theme {
          border: solid 3px #e4e5ed;
        }
      }
    }
  }
}
</style>
