<template>
  <div>
    <div class="title-content">
      <h1 class="title">{{ title }}</h1>
      <div class="tutorial-button">
        <slot name="tutorial"></slot>
      </div>
    </div>
    <p class="description">
      <slot name="description"></slot>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.title-content {
  display: flex;
  margin-top: 16px;
}

.title {
  font-size: 24px;
  color: $dark_blue;
  line-height: 1;
}

.description {
  margin: 16px 0 0 0;
  font-size: 15px;
  line-height: 24px;
  color: $dark_blue;
}

.tutorial-button {
  margin-left: 30px;
  cursor: pointer;
  margin-top: -2px;
}
</style>
