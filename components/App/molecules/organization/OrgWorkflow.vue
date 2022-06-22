<template>
  <div class="org-workflow">
    <div
      v-for="(workflow, index) in workflows"
      :key="workflow.uuid"
      class="workflow-item"
    >
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
</template>

<script lang="ts">
import Vue from 'vue';
import QuoteBox from '../../atoms/textFields/QuoteBox.vue';
import WorkflowTime from './WorkflowTime.vue';

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
.org-workflow {
  padding: 24px 40px;
}

.workflow-item {
  display: flex;
}

.quote-container {
  min-width: 675px;
}

.workflow-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 28px;
  color: $chart_text;
}

.workflow-content {
  font-size: 13px;
  font-weight: 300;
  line-height: 24px;
  color: $chart_text;
  white-space: pre-wrap;
}
</style>
