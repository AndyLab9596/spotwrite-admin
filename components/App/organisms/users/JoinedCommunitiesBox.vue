<template>
  <div class="joined-communities-container">
    <community-cards
      :items="joinedCommunities"
      @favorite="favorite"
      @unfavorite="unfavorite"
    />
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';
import CommunityCards from '../list/CommunityCards.vue';

export default Vue.extend({
  components: {
    CommunityCards,
  },
  model: {
    prop: 'selectedTab',
    event: 'clicked',
  },
  props: {
    joinedCommunities: {
      type: Array as PropType<ApiResponse.Community[]>,
      required: true,
    },
  },
  methods: {
    favorite(uuid: string) {
      this.$emit('favoriteCommunity', uuid);
    },
    unfavorite(uuid: string) {
      this.$emit('unfavoriteCommunity', uuid);
    },
  },
});
</script>

<style lang="scss" scoped>
.joined-communities-container {
  padding: 30px 0;
  background-color: $main_background_color;
}
</style>
