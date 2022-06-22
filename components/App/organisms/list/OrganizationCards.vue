<template>
  <div v-if="items.length === 0 && !isLoading">
    データがありません。
  </div>
  <div v-else class="organization-cards-container">
    <organization-card
      v-for="item in items"
      :key="item.uuid"
      class="organization-card"
      :class="item.latest_item_news ? '' : 'no-news'"
      :uuid="item.uuid"
      :is-favorite="item.is_favorite"
      :name="item.name"
      :thumbnail="item.main_image ? item.main_image : randomImage()"
      :description="item.description"
      :leader-user-name="item.leader_user_name"
      :establish-date="establishDate(item.establish_date)"
      :member-count="item.subordinated_organization_user_count"
      :latest-organization-news="item.latest_organization_news"
      @favorite="(uuid) => $emit('favorite', uuid)"
      @unfavorite="(uuid) => $emit('unfavorite', uuid)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';
import OrganizationCard from '../../molecules/card/OrganizationCard.vue';

export default Vue.extend({
  components: {
    OrganizationCard,
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
  data() {
    return {
      randomImages: [
        '/app/image/random/random1.png',
        '/app/image/random/random2.png',
        '/app/image/random/random3.png',
        '/app/image/random/random4.png',
        '/app/image/random/random5.png',
        '/app/image/random/random6.png',
        '/app/image/random/random7.png',
        '/app/image/random/random8.png',
        '/app/image/random/random9.png',
        '/app/image/random/random10.png',
        '/app/image/random/random11.png',
        '/app/image/random/random12.png',
        '/app/image/random/random13.png',
      ],
    };
  },
  methods: {
    establishDate(timestamp: number | null) {
      if (timestamp == null) {
        return '';
      }
      return dayjs.unix(timestamp).format('YYYY年');
    },
    randomImage() {
      const randomIndex = Math.floor(Math.random() * this.randomImages.length);
      const randomImage = this.randomImages[randomIndex];

      return randomImage;
    },
  },
});
</script>

<style lang="scss" scoped>
.organization-cards-container {
  width: 100%;
}

.organization-card {
  width: 100%;
  padding: 24px 24px 13px 24px;
  border-radius: 4px;
  box-shadow: 0 0 4px 0 $box-shadow;

  & + & {
    margin-top: 16px;
  }

  &.no-news {
    padding: 24px;
  }
}
</style>
