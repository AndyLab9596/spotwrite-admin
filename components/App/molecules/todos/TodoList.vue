<template>
  <div class="task-list">
    <div v-if="tasks && tasks.length > 0">
      <div
        v-for="task in tasks"
        :key="task.uuid"
        class="task"
        @click="onSave(task)"
      >
        <div class="task__read">
          <check-icon :checked="!task.is_read" class="notice__check-icon" />
          <span v-if="!task.is_read" class="unread-task"></span>
          <span v-else class="read-task"></span>
        </div>
        <div class="task-inner">
          <div class="task-inner__content">{{ task.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CheckIcon from '@/components/App/atoms/icons/CheckIcon.vue';

export default Vue.extend({
  components: {
    CheckIcon,
  },
  props: {
    tasks: {
      type: Array,
      required: true,
    },
  },
  methods: {
    onSave(task: AppApiResponse.UserTask) {
      this.$emit('onSave', task);
    },
  },
});
</script>

<style lang="scss" scoped>
.task-list {
  height: 600px;
  overflow-x: scroll;
  margin-top: 10px;
}

.task {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 13px 0 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;

  &:nth-of-type(1) {
    padding: 0;
  }

  &:last-of-type {
    border-bottom: none;
  }
}

.task__read {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 0 auto;
  min-width: 15px;
  margin: 0 5px 0 0;
  font-size: 15px;
  line-height: 1;
}

.unread-task {
  color: $link_color;
}

.read-task {
  color: $true_white;
  opacity: 0.6;
}

.task__check-icon {
  margin: 5px 18px 0 0;
}

.task-inner__content {
  color: $true_white;
  font-size: 12px;
  line-height: 21px;
  margin-bottom: 20px;
}

.task-buttons {
  margin: 13px 0;
  display: flex;
  justify-content: space-between;
}
</style>
