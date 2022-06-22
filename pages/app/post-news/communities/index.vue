<template>
  <div class="container">
    <div class="page-title">コミュニティ</div>
    <div class="tab">
      <div
        class="item"
        :class="currentCommunityType === 'general' ? 'selected' : ''"
        @click="changeCommunityType('general')"
      >
        <a role="button">
          一般
        </a>
      </div>
      <div
        class="item"
        :class="currentCommunityType === 'business' ? 'selected' : ''"
        @click="changeCommunityType('business')"
      >
        <a role="button">
          ビジネス
        </a>
      </div>
    </div>

    <community-cards
      :items="communities"
      @favorite="favorite"
      @unfavorite="unfavorite"
    />

    <div v-if="communities.length === 0 && !isLoading">
      コミュニティーが見つかりませんでした。
    </div>

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

export default Vue.extend({
  layout: 'app/default',
});
</script>

<script lang="ts">
import Vue from 'vue';
import { VueLoading } from 'vue-loading-template';
import { fetchCommunities } from '@/libs/api/app';
import { throttle } from 'lodash';
import CommunityCards from '@/components/App/organisms/list/CommunityCards.vue';

export default Vue.extend({
  layout: 'app/default',
  components: {
    VueLoading,
    CommunityCards,
  },
  data() {
    return {
      isLoading: true,
      currentCommunityType: 'general' as Types.CommunityType,
      communities: [] as ApiResponse.Community[],
      pagination: {} as ApiResponse.Pagination,
    };
  },
  async created(): Promise<void> {
    await this.getCommunities();
  },
  mounted() {
    window.addEventListener('scroll', throttle(this.infiniteHandler, 500));
  },
  beforeDestroy() {
    window.removeEventListener('scroll', throttle(this.infiniteHandler, 500));
  },
  methods: {
    favorite(uuid: string) {
      this.changeFavoriteIcon(uuid, true);
      // FIXME: 一旦保留
      // communityFavorite(uuid);
    },
    unfavorite(uuid: string) {
      this.changeFavoriteIcon(uuid, false);
      // FIXME: 一旦保留
      // communityUnFavorite(uuid);
    },
    changeFavoriteIcon(uuid: string, isFavorite: boolean) {
      this.communities = this.communities.map((c: ApiResponse.Community) => {
        if (c.uuid === uuid) {
          return { ...c, is_favorite: isFavorite };
        }
        return c;
      });
    },
    async getCommunities(page: number = 1) {
      this.isLoading = true;
      const {
        data: { data: communities, meta },
      } = await fetchCommunities({ page, type: this.currentCommunityType });
      this.communities = [...this.communities, ...communities];
      this.pagination = meta;
      this.isLoading = false;
    },
    async infiniteHandler() {
      if (this.isLoading) {
        return;
      }
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      ) {
        return;
      }
      if (this.pagination.current_page === this.pagination.last_page) {
        return;
      }
      await this.getCommunities(this.pagination.current_page + 1);
    },
    changeCommunityType(type: Types.CommunityType) {
      this.currentCommunityType = type;
      this.communities = [];
      this.getCommunities(1);
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

.page-title {
  margin-top: 50px;
  font-size: 28px;
  font-weight: 600;
}

.tab {
  margin-top: 68px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-around;
  height: 64px;
  width: 800px;
  border-radius: 4px;
  box-shadow: 0 2px 5px 1px $box-shadow;
  font-size: 13px;
  font-weight: 600;

  .item {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: $sub_color;

    &.selected {
      color: $link_color;
      border-bottom: 4px solid;
      border-image: $gradient_5;
      border-image-slice: 1;
    }
  }
}

.loading {
  margin: auto;
  padding: 30px 0;
}
</style>
