<template>
  <div class="news-cards-container">
    <img
      v-if="showLeftButton"
      class="news-cards-button-left"
      src="@/assets/image/btn/news-left.png"
      alt="news-cards-left-button"
      @click="subIndex"
    />
    <img
      v-if="showRightButton"
      class="news-cards-button-right"
      src="@/assets/image/btn/news-right.png"
      alt="news-cards-right-button"
      @click="addIndex"
    />
    <news-card
      v-for="item in filterItems(items)"
      :key="item.uuid"
      class="news-card"
      :date="item.date"
      :title="item.title"
      :is-read="item.is_read"
      :end="item.publish_setting ? item.publish_setting.end_at : null"
      :uuid="item.uuid"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import NewsCard from '../../molecules/card/NewsCard.vue';

export default Vue.extend({
  components: {
    NewsCard,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      index: 0,
    };
  },
  computed: {
    filterItems() {
      return (items: Array<ApiResponse.Posts>): Array<ApiResponse.Posts> => {
        return items.slice(this.index, this.index + 4);
      };
    },
    showLeftButton(): boolean {
      return this.index !== 0;
    },
    showRightButton(): boolean {
      return this.index !== this.items.length - 1;
    },
  },
  methods: {
    addIndex(): void {
      if (this.index === this.items.length - 1) return;
      this.index += 1;
    },
    subIndex(): void {
      if (this.index === 0) return;
      this.index -= 1;
    },
  },
});
</script>

<style lang="scss" scoped>
$gap-col: calc(25% - 6px);

.news-cards-container {
  display: grid;
  column-gap: 8px;
  grid-template-columns: $gap-col $gap-col $gap-col $gap-col;
  width: 100%;
  min-width: 600px;
  position: relative;
  cursor: pointer;
}

.news-cards-button-left {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 35px;
  left: -24px;
  border-radius: 50%;
  box-shadow: 0 1px 2px 0 #dce5ef;
  cursor: pointer;
}

.news-cards-button-right {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 35px;
  right: -24px;
  border-radius: 50%;
  box-shadow: 0 1px 2px 0 #dce5ef;
  cursor: pointer;
}
</style>
