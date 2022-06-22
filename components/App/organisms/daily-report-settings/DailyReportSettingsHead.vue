<template>
  <div class="daily-report-settings-head-wrapper">
    <p class="daily-report-settings-head-text">日報設定</p>
    <BaseButton inverse size="large" class="create-button" @click="clickCreate">
      日報を新規追加
    </BaseButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';

export default Vue.extend({
  components: {
    BaseButton,
  },
  methods: {
    clickCreate() {
      this.$router.push('/daily-reports-settings-create');
    },
  },
});
</script>

<style lang="scss" scoped>
.daily-report-settings-head-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 0 40px;
  background-color: $true-white;
  border-radius: 4px 4px 0 0;
}

.daily-report-settings-head-text {
  font-family: 'Lato', sans-serif;
  font-size: 15px;
  font-weight: bold;
  color: $main_color;
}

.create-button {
  height: 28px;
  width: 136px;
  font-size: 12px;
}
</style>
