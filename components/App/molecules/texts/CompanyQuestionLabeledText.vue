<template>
  <div class="profile-labeled-text-container">
    <icon class="icon" :name="icon" :size="28" />
    <div class="label-and-text">
      <p class="label">{{ label }}</p>
      <p class="text">
        <slot></slot>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '../../atoms/images/Icon.vue';

export default Vue.extend({
  components: {
    Icon,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.profile-labeled-text-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0 16px;
  width: 100%;
}

.icon {
  width: 20px;
  height: 20px;
}

.label-and-text {
  margin-left: 10px;
}

.label {
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 13px;
  font-weight: 700;
  color: #2e303e;
  white-space: nowrap;
}

.text {
  padding: 2px 8px;
  font-size: 13px;
  color: #2e303e;
}
</style>
