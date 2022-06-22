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
          <div v-if="community.thumbnail" class="item image">
            <img
              class="thumbnail"
              width="360"
              :src="community.thumbnail"
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
              <div
                v-for="(members, index) in chunkedMembers"
                :key="`members${index}`"
                class="users"
              >
                <div v-for="member in members" :key="member.uuid" class="user">
                  <img class="icon" :src="member.icon_url" alt="user icon" />
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

    <post-cards class="posts" :items="posts" />

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
import {
  fetchCommunityDetail,
  fetchCommunityMembers,
  fetchCommunityPosts,
} from '@/libs/api/app';
import Icon from '@/components/App/atoms/images/Icon.vue';
import { chunk } from 'lodash';
import dayjs from '@/libs/dayjs';
import { Context } from '@nuxt/types';
import PostCards from '@/components/App/organisms/list/PostCards.vue';

export default Vue.extend({
  layout: 'app/default',
  components: {
    VueLoading,
    Icon,
    PostCards,
  },
  async asyncData(ctx: Context) {
    try {
      const { data: community } = await fetchCommunityDetail(ctx.params.id);
      const {
        data: { members: communityMembers },
      } = await fetchCommunityMembers(ctx.params.id);
      return {
        community,
        communityMembers,
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
      community: {} as ApiResponse.CommunityDetail,
      communityMembers: [] as ApiResponse.CommunityMember[],
      posts: [] as ApiResponse.Post[],
      isShowAllMembers: false as boolean,
    };
  },
  computed: {
    establishDate(): string {
      return dayjs.unix(this.$data.community.created_at).format(`YYYY年`);
    },
    chunkedMembers(): unknown[][] {
      const chunked = chunk(this.$data.communityMembers, 10);
      return this.$data.isShowAllMembers ? chunked : chunked.slice(0, 1);
    },
  },
  async created(): Promise<void> {
    await this.fetchPostsData();
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
    favorite(): void {
      this.changeFavoriteIcon(true);
      // FIXME: 一旦保留
      // communityFavorite(this.community.uuid);
    },
    unfavorite(): void {
      this.changeFavoriteIcon(false);
      // FIXME: 一旦保留
      // communityUnFavorite(this.community.uuid);
    },
    changeFavoriteIcon(isFavorite: boolean) {
      this.$data.community = {
        ...this.$data.community,
        is_favorite: isFavorite,
      };
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
  box-shadow: 0 1px 2px #dce5ef;
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
  justify-content: space-between;
  margin-top: 18px;
  padding: 0 36px;

  .user {
    display: flex;
    flex-direction: column;

    .icon {
      border-radius: 17px;
      width: 44px;
      align-self: center;
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
  margin-top: 24px;
  background-color: $button_background_color;
  padding: 15px;
  color: $gentle_bluish_purple;
  font-size: 15px;
  font-weight: 600;
  border-radius: 4px;
  text-align: center;
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
