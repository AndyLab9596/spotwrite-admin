<template>
  <div v-if="filteredHistories.length > 0" class="history">
    <div v-show="showTitle" class="history-title">仕事の流れ</div>
    <div
      v-for="(item, index) in filteredHistories"
      :key="index + item.uuid"
      class="history__item"
    >
      <quote-time
        v-if="item.starting_time"
        :time="item.starting_time"
        :is-last="filteredHistories.length - 1 === index"
      />
      <quote-date
        v-else
        :date="item.date"
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
import QuoteBox from '@/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/QuoteBox.vue';
import QuoteTime from '@/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/QuoteTime.vue';
import QuoteDate from '@/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/QuoteDate.vue';

export default Vue.extend({
  components: {
    QuoteBox,
    QuoteTime,
    QuoteDate,
  },
  props: {
    histories: {
      type: Array,
      default: () => [],
    },
    showTitle: {
      type: Boolean,
      default: false,
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
  padding: 24px 15px 8px 15px;
  background: #fafbfc;
}

.history-title {
  display: flex;
  height: 50px;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
  padding: 0 10px;
  margin-bottom: 15px;
  background: #f7f8fd;
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
