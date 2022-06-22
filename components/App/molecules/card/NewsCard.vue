<template>
  <div class="news-card-container" @click="goToArticle()">
    <div v-if="isNew" class="header-container">
      <div class="header-new">
        <img src="@/assets/image/new.png" alt="new post" />
      </div>
    </div>
    <div class="news-card-start-date">{{ startFormat }}</div>
    <div class="news-card-title">{{ title }}</div>
    <div class="news-card-end-datetime-container">
      <icon class="news-card-end-datetime-icon" name="time_white" />
      <div class="news-card-end-datetime-text">{{ endFormat }}まで</div>
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
    date: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      required: true,
    },
    end: {
      type: Number,
      required: false,
      default: null,
    },
    uuid: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    startFormat(): string {
      return dayjs.unix(this.date).format('YYYY/M/D');
    },
    endFormat(): string {
      return this.end ? dayjs.unix(this.end).format('M/D H:mm') : '';
    },
    isNew(): boolean {
      return !this.isRead;
    },
  },
  methods: {
    goToArticle(): void {
      this.$router.push(`/posts/${this.uuid}`);
    },
  },
});
</script>

<style lang="scss" scoped>
.news-card-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 110px;
  width: 100%;
  border-radius: 8px;
  background-color: #7e8195;
  color: #fff;
  box-shadow: 0 1px 2px #dce5ef;
  padding: 16px;
}

.news-card-start-date {
  font-size: 11px;
}

.news-card-title {
  font-size: 15px;
  line-height: 120%;
  height: 36px;
  overflow: hidden;
  position: relative;
}

.news-card-end-datetime-container {
  display: flex;
}

.news-card-end-datetime-icon {
  margin-right: 8px;
}

.news-card-end-datetime-text {
  font-size: 11px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.header-container {
  height: 0;
  margin: -3px;
}

.header-new {
  position: relative;
  top: -26.5px;
  right: 13px;

  img {
    width: 24px;
    height: 18px;
  }
}
</style>
