<template>
  <div class="quote-container">
    <div v-if="isBefore" class="is-before"></div>
    <div
      v-if="message && message.length > 0"
      class="leader-quote"
      :class="{ 'before-radius': isBefore }"
    >
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    message: {
      default: null,
      type: String,
    },
    isBefore: {
      default: false,
      type: Boolean,
    },
  },
});
</script>

<style lang="scss" scoped>
.quote-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
}

.leader-quote {
  width: 100%;
  margin: 0 0 24px;
  padding: 17px 22px 15px 21px;
  background: $gradient_3;
  color: $quote_color;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.6;
  border-radius: 15px;
  text-align: center;
}

.before-radius {
  border-radius: 0 8px 8px 8px;
}

.is-before {
  margin: 0 -3px 0 0;
  border-left: 20px solid transparent;
  border-top: 20px solid $sand_color;
  border-bottom: 20px solid transparent;
  background-color: transparent;
}
</style>
