<template>
  <div v-if="items.length === 0 && !isLoading">
    コミュニティーが見つかりませんでした。
  </div>
  <div v-else class="community-cards-container">
    <community-card
      v-for="community in items"
      :key="community.uuid"
      class="community-card"
      :class="community.latest_community_news ? '' : 'no-news'"
      :uuid="community.uuid"
      :is-official="community.is_official"
      :is-favorite="community.is_favorite"
      :name="community.name"
      :thumbnail="community.thumbnail"
      :description="community.description"
      :leader-user-name="community.leader_user_name"
      :establish-date="establishDate(community.establish_date)"
      :member-count="community.member_count"
      :latest-community-news="community.latest_community_news"
      @favorite="(uuid) => $emit('favorite', uuid)"
      @unfavorite="(uuid) => $emit('unfavorite', uuid)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';
import CommunityCard from '../../molecules/card/CommunityCard.vue';

export default Vue.extend({
  components: {
    CommunityCard,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: false,
    },
  },
  methods: {
    establishDate(timestamp: number | null) {
      if (timestamp == null) {
        return '';
      }
      return dayjs.unix(timestamp).format('YYYY年');
    },
  },
});
</script>

<style lang="scss" scoped>
.community-cards-container {
  width: 100%;
}

.community-card {
  width: 100%;
  padding: 24px 24px 13px 24px;
  border-radius: 4px;
  box-shadow: 0 0 4px 0 $box-shadow;
  background-color: $true-white;

  & + & {
    margin-top: 16px;
  }

  &.no-news {
    padding: 24px;
  }
}
</style>
