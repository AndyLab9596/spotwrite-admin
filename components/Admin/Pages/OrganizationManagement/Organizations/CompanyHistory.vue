<template>
  <div v-if="filteredHistories.length > 0" class="history">
    <div
      v-for="(item, index) in filteredHistories"
      :key="index + item.uuid"
      class="history__item"
    >
      <quote-date
        :time="item.starting_time"
        :is-last="filteredHistories.length - 1 === index"
      />
      <quote-box is-before>
        <div class="item__title">{{ item.title }}</div>
        <div class="item__content">{{ item.content }}</div>
      </quote-box>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import QuoteBox from '@/components/Admin/Pages/OrganizationManagement/Organizations/QuoteBox.vue';
import QuoteDate from '@/components/Admin/Pages/OrganizationManagement/Organizations/QuoteDate.vue';

export default Vue.extend({
  components: {
    QuoteBox,
    QuoteDate,
  },
  props: {
    histories: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    filteredHistories() {
      return this.histories.filter(
        (history: Types.Workflow) =>
          history.title !== '' && history.content !== ''
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.history {
  padding: 24px 15px 0 15px;
}

.history__item {
  display: flex;
}

.item__title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  margin: 0 0 8px;
}

.item__content {
  font-size: 13px;
  line-height: 1;
}
</style>
