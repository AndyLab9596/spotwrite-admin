<template>
  <div>
    <div class="main-image">
      <img
        :src="getImageUrl(organization.detail.main_image)"
        onerror="this.src = '/image/no-image.png'"
      />
    </div>
    <img
      v-if="favorite === true"
      src="@/assets/image/icon/favorite_y.png"
      class="favorite"
    />
    <img
      v-if="favorite === false"
      src="@/assets/image/icon/favorite.png"
      class="favorite"
    />
    <div class="title">{{ organization.name }}</div>
    <div class="description">
      <span>社員数：{{ userCount }}名</span>
      <span v-if="organization.detail.establish_date">
        設立日：{{ establishDate }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';

export default Vue.extend({
  props: {
    organization: {
      type: Object,
      required: true,
      default: {} as Types.GroupOrganization,
    },
    favorite: {
      required: true,
      default: false,
      type: Boolean,
    },
    userCount: {
      default: 0,
      type: Number,
    },
  },
  computed: {
    establishDate(): string {
      return dayjs
        .unix(this.organization.detail.establish_date)
        .format(`YYYY年MM月DD日`);
    },
  },
  methods: {
    getImageUrl(obj: string) {
      if (obj) {
        return obj.url;
      }
      return '';
    },
  },
});
</script>

<style lang="scss" scoped>
.main-image {
  display: flex;
  align-items: center;
  max-height: 139px;
  overflow: hidden;

  img {
    width: 100%;
  }
}

.logo {
  display: block;
  margin: 10px auto 0;
  max-height: 24px;
}

.title {
  margin-top: 5px;
  font-size: 16px;
  font-weight: bold;
  padding-left: 32px;
  padding-right: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description {
  font-size: 13px;
  margin-top: 2px;
}

.favorite {
  position: absolute;
  right: 0;
  margin-right: 10px;
  margin-top: 10px;
  align-self: center;
}
</style>
