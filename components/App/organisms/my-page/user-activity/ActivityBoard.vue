<template>
  <div class="activity-board">
    <div class="activity-board-body">
      <div class="activity-higher">
        <div
          v-for="(item, index) in higherItems"
          :key="index"
          class="activity-higher-cell"
        >
          <div class="higher__top">
            <img :src="item.icon" />
            <div class="header">{{ item.header }}</div>
          </div>
          <div class="count">{{ item.count }}</div>
          <div class="unit">件</div>
        </div>
      </div>

      <div
        v-for="(row, rowIndex) in lowerRows"
        :key="rowIndex"
        class="activity-lower"
      >
        <div
          v-for="(item, itemIndex) in row"
          :key="itemIndex"
          class="activity-lower-cell"
        >
          <div class="activity-lower-cell--left">
            <span class="header">{{ item.header }}</span>
          </div>
          <div class="activity-lower-cell--right">
            <span class="count">{{ item.count }}</span>
            <span class="unit">件</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    activities: {
      type: Object as PropType<AppApiResponse.Activity>,
      required: true,
    },
  },
  computed: {
    higherItems(): { header: string; count: number; icon: string }[] {
      const {
        total_posts,
        department_news_posts,
        total_likes,
      } = this.activities;
      return [
        {
          header: '総投稿数',
          count: total_posts,
          icon: '/app/icon/icon-newspaper.svg',
        },
        {
          header: '部署ニュース投稿数',
          count: department_news_posts,
          icon: '/app/icon/icon-paper.svg',
        },
        {
          header: '総いいね数',
          count: total_likes,
          icon: '/app/icon/icon-thumbs.svg',
        },
      ];
    },
    lowerRows(): { header: string; count: number }[][] {
      const {
        favorite_posts,
        favorite_departments,
        draft_posts,
        join_communities,
      } = this.activities;
      return [
        // first row
        [
          {
            header: 'お気に入り記事数',
            count: favorite_posts,
          },
          {
            header: 'お気に入り部署数',
            count: favorite_departments,
          },
        ],
        // second row
        [
          {
            header: '下書き記事数',
            count: draft_posts,
          },
          {
            header: '参加コミュニティ数',
            count: join_communities,
          },
        ],
      ];
    },
  },
});
</script>

<style lang="scss" scoped>
.activity-board {
  display: flex;
  background: $true_white 0% 0% no-repeat padding-box;
  box-shadow: 0 1px 3px $box-shadow;
  border-radius: 4px;
}

.activity-board-body {
  flex: 1;
  margin: 24px 23px 8px;
}

.activity-higher {
  display: flex;
}

.activity-lower {
  display: flex;
  flex-wrap: wrap;
  margin: 0 16px;
  border-top: 1px dotted $icon_gray;
  position: relative;
}

.header {
  font-size: 15px;
  font-weight: bold;
}

.count {
  color: $main_color;
  font-size: 28px;
  font-family: 'Lato', sans-serif;
}

.unit {
  color: $sub_color;
}

.activity-higher-cell {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
  margin: 0 0 22px;
  padding: 0 18px;
  position: relative;

  &:not(:last-child) {
    border-right: 1px dotted $icon_gray;
  }

  & .header {
    margin-top: 13px;
  }

  & .count {
    margin: 13px 0 0 0;
  }

  & .unit {
    align-self: flex-end;
  }
}

.higher__top {
  display: flex;

  img {
    margin: 0 8px 0 0;
  }
}

.activity-lower-cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  height: calc(69px - 30px);
  margin: 15px 0;
  padding: 0 14px 0 23px;
  position: relative;

  &:not(:last-child) {
    border-right: 1px dotted $icon_gray;
  }

  & .unit {
    margin-left: 23px;
  }
}
</style>
