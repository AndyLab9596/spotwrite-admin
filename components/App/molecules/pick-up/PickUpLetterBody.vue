<template>
  <div class="pick-up-letter-body-wrapper">
    <p class="pick-up-letter">{{ letterBody }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    letterBody: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.pick-up-letter-body-wrapper {
  padding: 25px 0;
  border-top: 1px dotted $icon_gray;
  border-bottom: 1px dotted $icon_gray;
  overflow-wrap: break-word;
  width: 655px;
  max-width: 100%;
}

.pick-up-letter {
  color: $main_color;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}
</style>
