<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="spotwrite運営会社からお知らせ">
        <template #description>
          アップデートなどspotwrite運営会社からご利用企業様へお知らせです。
        </template>
      </page-header>
      <p class="top">
        <label class="type" :class="'type__' + notice.type">{{
          changeTypeName(notice.type)
        }}</label>
        <span class="created_at">{{ notice.created_at }}</span>
      </p>
      <h1 class="page-title">{{ notice.title }}</h1>
      <div class="contents">{{ notice.message }}</div>
      <nuxt-link :to="`/admin/notice`">
        <button class="button-back">
          <span class="button-back__text">お知らせ一覧に戻る</span>
        </button>
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { fetchCompanyNotice } from '@/libs/api';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';

type Notice = ApiResponse.CompanyNotice;

export default Vue.extend({
  layout: 'admin/default',
  components: {
    PageHeader,
  },
  data() {
    return {
      notice: {} as Notice,
    };
  },
  computed: {
    uuid(): string {
      return this.$route.params.id;
    },
  },
  async created() {
    await this.fetchNotice(this.uuid);
  },
  methods: {
    async fetchNotice(uuid: string): Promise<void> {
      try {
        this.$accessor.setLoading(true);
        const { data } = await fetchCompanyNotice(uuid);
        this.notice = data;
      } catch (e) {
        console.error(e);
      } finally {
        this.$accessor.setLoading(false);
      }
    },
    changeTypeName(type: string): string {
      let name = '';
      switch (type) {
        case 'notice':
          name = 'お知らせ';
          break;
        case 'update':
          name = 'アップデート';
          break;
        default:
          break;
      }
      return name;
    },
  },
});
</script>

<style lang="scss" scoped>
.contents {
  background-color: $true_white;
  border: 1px solid $light_gray_blue_3;
  padding: 32px 30px;
  margin-top: 14px;
  font-size: 13px;
  white-space: break-spaces;
}

.top {
  margin-top: 32px;
}

.type {
  border: 1px solid $gray_blue_3;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: $gray_blue_4;

  &__notice {
    background-color: $light_gray_blue_4;
    padding: 6px 16px;
  }

  &__update {
    background-color: $true_white;
    padding: 6px 4px;
  }
}

.created_at {
  font-size: 13px;
}

.page-title {
  margin-top: 14px;
  font-size: 15px;
}

.button-back {
  background-color: $light_gray_blue_4;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  font-size: 13px;
  font-weight: bold;
  color: $gray_blue_4;
  margin-top: 34px;
  width: 161px;
  height: 30px;
  background-image: url('/icon/arrow_left.svg');
  background-position: 11px;
  background-repeat: no-repeat;

  &__icon {
    float: left;
    width: 8px;
    height: 12px;
  }

  &__text {
    margin-left: 22px;
  }

  &:hover {
    background-color: $light_gray_blue_1;
  }
}
</style>
