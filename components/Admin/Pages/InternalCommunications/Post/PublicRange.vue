<template>
  <div class="public-range-wrapper">
    <p class="public-title">公開範囲</p>
    <div class="public-button-wrapper">
      <button
        v-for="item in permissions"
        :key="item.key"
        class="category-button"
        :class="{ 'category-button-active': item.key === selectedPermission }"
        @click="clickButton(item.key)"
      >
        {{ item.name }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { enumAccessPermissions } from '@/libs/definition';

export default Vue.extend({
  layout: 'admin/default',
  props: {
    selectedPermission: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    permissions: enumAccessPermissions,
  }),
  methods: {
    clickButton(value: string) {
      this.$emit('select', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.public-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;
  color: $dark_blue;
  margin: 0 0 16px;
}

.public-button-wrapper {
  display: flex;
  align-items: center;
  width: inherit;
  overflow-x: scroll;
  overflow-y: hidden;
}

.category-button {
  font-size: 13px;
  border: 1px solid $link_color;
  border-radius: 50px;
  height: 38px;
  padding: 0 35px;
  text-align: center;
  line-height: 38px;
  cursor: pointer;
  color: $link_color;
  background-color: $true_white;
  flex-shrink: 0;

  &:not(:last-child) {
    margin-right: 16px;
  }

  &-active {
    color: $true_white;
    background-color: $link_color;
  }
}
</style>
