<template>
  <div class="container">
    <div class="community-name-bar">
      <div v-if="community.is_official" class="official-label">公式</div>
      <div class="community-name">
        {{ community.name }}
      </div>
      <a class="favorite" role="button" @click="handleFavorite">
        <icon
          style="width: 12px;"
          :name="community.is_favorite ? 'favorite_y' : 'favorite'"
        />
      </a>
    </div>

    <div class="community">
      <div class="contents">
        <div class="item summary">
          <div v-if="community.main_image" class="item image">
            <img
              class="thumbnail"
              width="360"
              height="270"
              :src="community.main_image.url"
              alt="main image"
            />
          </div>
          <div v-else class="item image">
            <img
              class="thumbnail"
              width="360"
              height="270"
              src="/app/image/no-image.png"
              alt="main image"
            />
          </div>
          <div class="description">{{ community.description }}</div>
        </div>
        <div class="item profile">
          <div class="element">
            <div class="label-with-icon">
              <div class="icon-wrapper">
                <icon name="person" style="width: 10px;" />
              </div>
              <div class="label">
                {{ community.leader_user_organization }}
              </div>
            </div>
            <div class="data">{{ community.leader_user_name }}</div>
          </div>
          <div class="separator"></div>
          <div class="element">
            <div class="label-with-icon">
              <div class="icon-wrapper">
                <icon name="buildings" style="width: 18px;" />
              </div>
              <div class="label">
                設立
              </div>
            </div>
            <div class="data">{{ establishDate }}</div>
          </div>
        </div>
        <div class="item members">
          <div class="element">
            <div class="label-with-icon">
              <div class="icon-wrapper">
                <icon name="buildings" style="width: 18px;" />
              </div>
              <div class="label">
                メンバー数
              </div>
            </div>
            <div class="data">
              {{ community.member_count.all }}名<span class="member-details"
                >（男{{ community.member_count.man }}名 / 女{{
                  community.member_count.woman
                }}名 / 未回答{{ community.member_count.free }}名）</span
              >
            </div>
            <div>
              <div class="users">
                <div
                  v-for="member in chunkedMembers"
                  :key="member.uuid"
                  class="user"
                  :class="{ link: !isVisitor }"
                  @click="goToUserProfile(member.uuid)"
                >
                  <img class="icon" :src="member.icon" alt="user icon" />
                  <div class="name">{{ member.name }}</div>
                </div>
              </div>
              <div
                v-if="!isShowAllMembers"
                class="button"
                role="button"
                @click="isShowAllMembers = true"
              >
                もっと見る
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="community-post">{{ community.name }}の投稿</div>

    <post-cards
      class="posts"
      :is-loading="isLoading"
      :items="posts"
      @onClickDeletePost="clickDeletePost"
      @onClickEditPost="clickEditPost"
    />
    <post-create-modal
      v-if="showPostCreateModal"
      :edit-post-uuid="editPostUuid"
      @close="closeModal"
      @re-render="reRender"
    />

    <vue-loading
      v-if="isLoading"
      type="spin"
      class="loading"
      color="#333"
      :size="{ width: '50px', height: '110px' }"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { VueLoading } from 'vue-loading-template';
import Icon from '@/components/App/atoms/images/Icon.vue';
import { Context } from '@nuxt/types';
import PostCards from '@/components/App/organisms/list/PostCards.vue';
import PostCreateModal from '@/components/App/organisms/modal/PostCreateModal.vue';
import dayjs from '@/libs/dayjs';
import {
  fetchCommunityDetail,
  fetchCommunityMembers,
  fetchCommunityPosts,
  communityFavorite,
  communityUnFavorite,
  fetchUser,
  fetchUserNotifications,
  putUserNotice,
  deletePost,
} from '@/libs/api/app';

export default Vue.extend({
  layout: 'app/default',
  components: {
    VueLoading,
    Icon,
    PostCards,
    PostCreateModal,
  },
  async asyncData(ctx: Context) {
    try {
      const { data: community } = await fetchCommunityDetail(ctx.params.id);
      const {
        data: { companies: communityCompanies },
      } = await fetchCommunityMembers(ctx.params.id);
      return {
        community,
        communityCompanies,
      };
    } catch (err) {
      console.log(err);
      ctx.error({
        statusCode: err.response.status,
        message: err.response.data.message,
      });
    }
  },
  data() {
    return {
      isLoading: true as boolean,
      community: {} as AppApiResponse.CommunityDetail,
      communityCompanies: [] as AppApiResponse.CommunityCompany[],
      posts: [] as AppApiResponse.Post[],
      isShowAllMembers: false as boolean,
      accessPermission: 'all' as string,
      notices: [] as AppApiResponse.UserNotice[],
      showPostCreateModal: false,
      editPostUuid: '' as string,
    };
  },
  computed: {
    establishDate(): string {
      return dayjs.unix(this.community.created_at).format(`YYYY年`);
    },
    chunkedMembers(): AppApiResponse.CommunityMember[] {
      const users = this.communityCompanies.flatMap(
        (item: AppApiResponse.CommunityCompany) => item.users
      );
      const chunked = users.slice(0, 10);
      return this.isShowAllMembers ? users : chunked;
    },
    isVisitor(): boolean {
      return ['visitor'].includes(this.accessPermission);
    },
  },
  async created(): Promise<void> {
    const {
      data: { access_permission },
    } = await fetchUser(this.$accessor.userProfile.uuid);
    this.accessPermission = access_permission;
    await this.fetchPostsData();
    // update notice
    await this.fetchNotificationsData().then(() => {
      const updateNotifications: any = [...this.notices].filter(
        (item: any) =>
          !item.is_read &&
          item.params &&
          item.params.includes(this.$route.params.id)
      );
      if (updateNotifications) {
        updateNotifications.forEach((notification: any) => {
          this.putUserNotice(notification);
        });
      }
    });
  },
  methods: {
    async fetchPostsData(): Promise<void> {
      this.isLoading = true;
      const { data } = await fetchCommunityPosts(this.$route.params.id);
      this.posts = data.posts;
      this.isLoading = false;
    },
    handleFavorite(): void {
      if (this.community.is_favorite) {
        this.unfavorite();
        return;
      }
      this.favorite();
    },
    async favorite() {
      await communityFavorite(this.community.uuid);
      this.changeFavoriteIcon(true);
    },
    async unfavorite() {
      await communityUnFavorite(this.community.uuid);
      this.changeFavoriteIcon(false);
    },
    changeFavoriteIcon(isFavorite: boolean) {
      this.$data.community = {
        ...this.$data.community,
        is_favorite: isFavorite,
      };
    },
    goToUserProfile(uuid: string): void {
      if (!this.isVisitor) {
        this.$router.push(`/users/${uuid}`);
      }
    },
    async fetchNotificationsData(): Promise<void> {
      try {
        const { data } = await fetchUserNotifications();
        this.notices = data.data;
      } catch (e) {
        console.log(e);
      }
    },
    async putUserNotice(notice: AppApiResponse.UserNotice) {
      try {
        await putUserNotice(notice.uuid);
      } catch (e) {
        console.log(e);
      }
    },
    async clickDeletePost(uuid: string) {
      try {
        await deletePost(uuid);
        window.location.reload();
      } catch (e) {
        alert('記事を削除できませんでした。');
      }
    },
    clickEditPost(uuid: string) {
      this.editPostUuid = uuid;
      this.showPostCreateModal = true;
    },
    async reRender() {
      this.posts = [];
      this.showPostCreateModal = false;
      await this.fetchPostsData();
      this.isLoading = false;
    },
    closeModal() {
      this.showPostCreateModal = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.community-name-bar {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 64px;

  .community-name {
    color: $main_color;
    font-size: 26px;
    font-weight: 600;
    flex-grow: 1;
    margin-left: 8px;
  }

  .favorite {
    cursor: pointer;
  }
}

.community {
  margin-top: 64px;
  padding: 40px;
  box-shadow: 0 3px 6px $box-shadow;
  border-radius: 4px 4px 0 0;
}

.official-label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 17px;
  border-radius: 4px;
  color: $true_white;
  background-color: #89d3ca;
  font-size: 10px;
  font-weight: 600;
}

.thumbnail {
  border-radius: 4px;
  object-fit: cover;
}

.image {
  width: 360px;
  height: 270px;
}

.summary {
  display: flex;
}

.description {
  flex-grow: 1;
  margin-left: 40px;
  font-size: 15px;
}

.element {
  padding: 16px 0;
}

.profile {
  margin-top: 24px;
  display: flex;
  border-top: dotted 1px $icon_gray;
  border-bottom: dotted 1px $icon_gray;

  .element {
    width: 360px;
  }
}

.members {
  .element {
    width: 100%;
  }
}

.separator + .element {
  padding-left: 16px;
}

.data {
  margin-left: 34px;
  color: $main_color;
  font-size: 15px;
}

.label {
  font-size: 15px;
  margin-left: 6px;
  font-weight: 600;
  line-height: 28px;
}

.separator {
  border-left: dotted 1px $icon_gray;
  margin: 16px 0;
}

.icon-wrapper {
  width: 28px;
  height: 28px;
  background: $gradient_2;
  border-radius: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.label-with-icon {
  display: flex;
}

.users {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  margin-top: 18px;
  padding: 0 20px;

  .user {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin: 0 21px 5px 0;

    &.link {
      cursor: pointer;
    }

    &:nth-of-type(10) {
      margin: 0;
    }

    .icon {
      border-radius: 17px;
      width: 44px;
      height: 44px;
      align-self: center;
      object-fit: cover;
    }

    .name {
      margin-top: 10px;
      font-size: 11px;
      font-weight: 600;
      align-self: center;
    }
  }
}

.button {
  width: 100%;
  margin-top: 19px;
  background-color: $button_background_color;
  padding: 15px;
  color: $gentle_bluish_purple;
  font-size: 15px;
  font-weight: 600;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
}

.community-post {
  width: 100%;
  background-color: $white_1;
  padding: 24px 16px;
  font-size: 13px;
  color: $gentle_bluish_purple;
  border-top: solid 1px $ruled_line;
  border-bottom: solid 1px $ruled_line;
}

.posts {
  margin-top: 60px;
}
</style>
