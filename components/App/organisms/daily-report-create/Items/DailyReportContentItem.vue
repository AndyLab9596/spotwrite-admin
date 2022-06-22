<template>
  <div>
    <p class="title">
      {{ item.name }}
    </p>
    <textarea
      :value="item.content"
      class="textarea"
      placeholder="本文を入力"
      @input="changeContent"
    ></textarea>
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
    changeContent(event: { target: HTMLInputElement }) {
      const item = {
        ...this.item,
        content: event.target.value,
      };
      this.$emit('change', item);
    },
  },
});
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $white_1;
  padding: 18px 24px 17px;
  width: 100%;
  border-radius: 4px 4px 0 0;
  font-weight: 600;
  color: $gentle_bluish_purple;
  border-top: 1px solid $ruled_line;
  border-bottom: 1px solid $ruled_line;
}

.textarea {
  min-height: 166px;
  padding: 23px 44px;
  width: 100%;
  border: none;
}
</style>
