<template>
  <div class="org-workflow">
    <div
      v-for="(workflow, index) in workflows"
      :key="workflow.uuid"
      class="workflow-item"
    >
      <div v-if="workflow.title.length > 0" class="quote-container">
        <div>
          <workflow-time
            :time="workflow.starting_time"
            :is-last="workflows.length - 1 === index"
          />
        </div>
        <div>
          <quote-box is-before>
            <div class="workflow-title">{{ workflow.title }}</div>
            <div class="workflow-content">{{ workflow.content }}</div>
          </quote-box>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import QuoteBox from '@/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/QuoteBox.vue';
import WorkflowTime from '@/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/QuoteTime.vue';

export default Vue.extend({
  components: {
    QuoteBox,
    WorkflowTime,
  },
  props: {
    workflows: {
      type: Array,
      default: null,
    },
  },
});
</script>

<style lang="scss" scoped>
.workflow-item {
  display: flex;

  &:first-child {
    margin-top: 16px;
  }
}

.quote-container {
  display: flex;
  min-width: 260px;
}

.workflow-title {
  font-size: 15px;
  font-weight: 600;
  color: $chart_text;
}

.workflow-content {
  font-size: 13px;
  font-weight: 300;
  color: $chart_text;
  white-space: pre-wrap;
}
</style>
