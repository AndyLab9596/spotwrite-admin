<template>
  <div class="container">
    <daily-report-create-modal v-if="createModal" @close="closeModal" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import DailyReportCreateModal from '@/components/App/organisms/daily-report-create/Modal/DailyReportCreateModal.vue';

export default Vue.extend({
  layout: 'app/default',
  components: {
    DailyReportCreateModal,
  },
  data: () => ({
    createModal: true as boolean,
  }),
  methods: {
    closeModal() {
      this.createModal = false;
      this.$router.push(`/`);
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
}
</style>
