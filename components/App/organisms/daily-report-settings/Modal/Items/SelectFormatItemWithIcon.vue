<template>
  <div class="format-button-with-icon">
    {{ item.name }}
    <img
      src="/icon/icon_delete.svg"
      class="delete-icon"
      alt=""
      @click="deleteItem(item.uuid)"
    />
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
  },
  methods: {
    deleteItem(uuid: string) {
      this.$emit('delete', uuid);
    },
  },
});
</script>

<style lang="scss" scoped>
.format-button-with-icon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  background-color: $true_white;
  border: 1px solid $job_type_border;
  border-radius: 4px;
  height: 44px;
  padding: 0 8px 0 13px;
  line-height: 1em;
  color: $dark_blue;
  cursor: pointer;
  width: 100%;

  .delete-icon {
    width: 16px;
  }
}
</style>
