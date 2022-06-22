<template>
  <button class="add-company-button" @click="onClick">
    <div class="add-company-icon"><img src="/icon/icon_plus_pink.svg" /></div>
    新しい会社を追加する
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
});
</script>

<style lang="scss" scoped>
.add-company-button {
  width: 300px;
  height: 44px;
  background-color: $gray_blue_3;
  border: none;
  border-radius: 4px;
  color: $true_white;
  font-weight: bold;
  padding: 0 18px;

  &:hover {
    background-color: $gray_blue_4;
  }
}

.add-company-icon {
  position: absolute;
}
</style>
