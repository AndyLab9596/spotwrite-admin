<template>
  <div>
    <div class="community-name-bar">
      <div v-if="isOfficial" class="official-label">公式</div>
      <div class="community-name">
        {{ name }}
      </div>
      <a class="favorite" role="button" @click="handleFavorite">
        <icon
          style="width: 12px;"
          :name="isFavorite ? 'favorite_y' : 'favorite'"
        />
      </a>
    </div>
    <div class="contents">
      <div v-if="thumbnail" class="item image">
        <nuxt-link tag="a" :to="`/communities/${uuid}`">
          <img
            class="thumbnail"
            :src="thumbnail"
            alt="main image"
            width="364"
            height="200"
          />
        </nuxt-link>
      </div>
      <div v-else class="item image">
        <nuxt-link tag="a" :to="`/communities/${uuid}`">
          <img
            class="thumbnail"
            width="364"
            height="200"
            src="/app/image/no-image.png"
            alt="main image"
          />
        </nuxt-link>
      </div>
      <div class="item about">
        <div class="description">{{ description }}</div>
        <div class="details-table">
          <div class="row">
            <div class="header">部長</div>
            <div class="body">{{ leaderUserName }}</div>
          </div>
          <div class="row">
            <div class="header">設立</div>
            <div class="body">{{ establishDate }}</div>
          </div>
          <div class="row">
            <div class="header">メンバー数</div>
            <div class="body">
              {{ memberCount.all }}名<span class="member-details"
                >（男{{ memberCount.man }}名 / 女{{ memberCount.woman }}名 /
                未回答{{ memberCount.free }}名）</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="latestCommunityNews"
      class="news"
      role="button"
      @click="$router.push(`/communities/${uuid}`)"
    >
      <div class="item icon-wrapper">
        <icon name="newspaper" />
      </div>
      <div class="item date">
        {{ date }}
      </div>
      <div class="item title">{{ latestCommunityNews.title }}</div>
      <icon name="arrow_r_o" style="width: 12px; height: 16px;" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';
import Icon from '../../atoms/images/Icon.vue';

export default Vue.extend({
  components: {
    Icon,
  },
  props: {
    isOfficial: {
      type: Boolean,
      required: true,
    },
    isFavorite: {
      type: Boolean,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    leaderUserName: {
      type: String,
      default: null,
    },
    establishDate: {
      type: String,
      default: null,
    },
    memberCount: {
      type: Object,
      required: true,
    },
    latestCommunityNews: {
      type: Object,
      default: null,
    },
    uuid: {
      type: String,
      required: true,
    },
  },
  computed: {
    date() {
      return dayjs.unix(this.latestCommunityNews.date).format('YYYY/M/D');
    },
  },
  methods: {
    handleFavorite() {
      if (this.$props.isFavorite) {
        this.$emit('unfavorite', this.$props.uuid);
        return;
      }
      this.$emit('favorite', this.$props.uuid);
    },
  },
});
</script>

<style lang="scss" scoped>
.community-name-bar {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 4px;
  background: $gradient_2;

  .community-name {
    color: #725661;
    font-size: 15px;
    font-weight: 600;
    flex-grow: 1;
    margin-left: 8px;
  }

  .favorite {
    cursor: pointer;
  }
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

.contents {
  display: flex;
  margin-top: 24px;

  .item + .item {
    margin-left: 24px;
  }

  .thumbnail {
    border-radius: 4px;
    object-fit: cover;
  }

  .image {
    width: 364px;
    height: 200px;
  }

  .about {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .description {
      flex-grow: 1;
    }

    .member-details {
      font-size: 11px;
    }

    .details-table {
      padding: 14px;
      border-radius: 8px;
      border-top: dotted 1px $icon_gray;
      border-bottom: dotted 1px $icon_gray;

      .row {
        display: flex;
        align-items: center;

        .header {
          color: $sub_color;
          font-size: 11px;
          width: 100px;
        }

        .body {
          font-size: 13px;
        }
      }

      .row + .row {
        margin-top: 8px;
      }
    }

    &.no-thumbnail {
      display: flex;
      flex-direction: row;
    }
  }
}

.news {
  display: flex;
  align-items: center;
  margin-top: 24px;
  padding-top: 9px;
  border-top: solid 1px $ruled_line;
  cursor: pointer;

  .item + .item {
    margin-left: 8px;
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

  .date {
    color: $link_color;
    font-size: 13px;
    font-family: 'Lato', sans-serif;
  }

  .title {
    color: $main_color;
    flex-grow: 1;
    font-size: 13px;
    font-weight: 600;
    line-height: 19px;
  }
}
</style>
