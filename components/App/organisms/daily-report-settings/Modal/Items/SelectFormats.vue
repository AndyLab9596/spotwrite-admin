<template>
  <div class="select-formats-wrapper">
    <div class="select-formats-contents">
      <div v-if="isAddButton" class="select-formats-buttons">
        <select-format-item
          v-for="item in items"
          :key="item.uuid"
          :item="item"
          :is-active="isActive(item.uuid)"
          class="select-format-item"
          @select="selectButton"
        />
      </div>
      <add-button @click="addButtonClick" />
    </div>
    <p class="reset-text" @click="clickReset">フォーマットを初期状態に戻す</p>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import AddButton from '@/components/App/organisms/daily-report-settings/Modal/Items/AddButton.vue';
import SelectFormatItem from '@/components/App/organisms/daily-report-settings/Modal/Items/SelectFormatItem.vue';

export default Vue.extend({
  components: {
    AddButton,
    SelectFormatItem,
  },
  props: {
    items: {
      type: Array as PropType<AppApiResponse.FormatItem[]>,
      required: true,
    },
    selectedFormatItemUuids: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  data: () => ({
    isAddButton: false as boolean,
  }),
  methods: {
    addButtonClick() {
      this.isAddButton = !this.isAddButton;
    },
    selectButton(item: AppApiResponse.FormatItem) {
      this.$emit('select', item);
    },
    isActive(uuid: string): boolean {
      return this.selectedFormatItemUuids.includes(uuid);
    },
    clickReset() {
      this.$emit('reset');
    },
  },
});
</script>

<style lang="scss" scoped>
.select-formats-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.select-formats-contents {
  background-color: $white_1;
  border-radius: 4px;
  padding: 16px 32px 18px;
  margin: 0 0 16px;
}

.select-formats-buttons {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.select-format-item {
  margin: 0 16px 8px 0;
}

.reset-text {
  font-size: 15px;
  color: $link_color;
  font-weight: 300;
  text-align: center;
  cursor: pointer;
}
</style>
