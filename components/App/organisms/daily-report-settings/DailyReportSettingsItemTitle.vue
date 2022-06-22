<template>
  <div class="daily-report-settings-title-wrapper">
    <p class="daily-report-settings-title-text">
      {{ formatCreatedAt }}作成（{{ title }}）
    </p>
    <BaseButton inverse size="large" class="create-button" @click="clickCreate">
      日報を編集
    </BaseButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import dayjs from '@/libs/dayjs';

export default Vue.extend({
  components: {
    BaseButton,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Number,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
  },
  computed: {
    formatCreatedAt(): string {
      return dayjs.unix(this.createdAt).format('YYYY/HH/DD HH:mm');
    },
  },
  methods: {
    clickCreate() {
      this.$router.push(`/daily-reports-settings/${this.uuid}`);
    },
  },
});
</script>

<style lang="scss" scoped>
.daily-report-settings-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88px;
  padding: 0 40px;
  background-color: $white_1;
  border-top: 1px solid $ruled_line;
  border-bottom: 1px solid $ruled_line;
}

.daily-report-settings-title-text {
  font-size: 15px;
  font-weight: 600;
  color: $gentle_bluish_purple;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.create-button {
  height: 28px;
  width: 136px;
  font-size: 12px;
  flex-shrink: 0;
}
</style>
