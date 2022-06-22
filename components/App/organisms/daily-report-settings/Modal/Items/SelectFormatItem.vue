<template>
  <div
    class="format-button"
    :class="{ 'format-button-active': isActive }"
    @click="clickButton"
  >
    {{ item.name }}
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    item: {
      type: Object as PropType<AppApiResponse.FormatItem>,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    clickButton() {
      this.$emit('select', this.item);
    },
  },
});
</script>

<style lang="scss" scoped>
.format-button {
  display: flex;
  align-items: center;
  font-size: 13px;
  border: 1px solid $job_type_border;
  border-radius: 4px;
  padding: 16px 48px;
  line-height: 1em;
  color: $dark_blue;
  cursor: pointer;
  width: fit-content;
  background-color: $white_1;

  &-active {
    background-color: $true_white;
  }
}
</style>
