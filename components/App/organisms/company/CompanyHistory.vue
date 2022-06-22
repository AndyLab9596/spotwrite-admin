<template>
  <div
    v-if="organizationHistories && organizationHistories.length > 0"
    class="history"
  >
    <div
      v-for="(item, index) in organizationHistories"
      :key="index + item.uuid"
      class="history__item"
    >
      <quote-date
        :date="item.date"
        :is-last="organizationHistories.length - 1 === index"
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
import QuoteBox from '../../atoms/textFields/QuoteBox.vue';
import QuoteDate from '../../molecules/company/QuoteDate.vue';

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
    organizationHistories() {
      if (!this.histories) {
        return [];
      }
      return [...this.histories].sort((a: Types.History, b: Types.History) => {
        if (a.date > b.date) {
          return 1;
        }
        return -1;
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.history {
  padding: 24px 0 0;
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
