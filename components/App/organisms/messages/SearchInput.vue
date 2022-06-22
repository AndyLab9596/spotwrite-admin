<template>
  <div class="search-container">
    <input
      v-model="searchWord"
      type="text"
      name="フリーワード"
      class="input place-holder"
      placeholder="フリーワードで検索"
      @input="onInput"
    />
    <img
      v-if="!searchWord.length"
      src="/app/icon/icon-magnifying.svg"
      class="icon-img magnifying"
    />
    <img
      v-else
      src="/icon/icon_cross.svg"
      class="icon-img reset"
      @click="onReset"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      searchWord: '' as string,
    };
  },
  methods: {
    onInput() {
      this.$emit('input', this.searchWord);
    },
    onReset() {
      this.searchWord = '';
      this.onInput();
    },
  },
});
</script>
<style lang="scss" scoped>
.search-container {
  position: relative;
  box-sizing: border-box;
  width: 360px;
  height: 52px;
}

input[type='text'] {
  width: 100%;
  height: 100%;
  padding: 0 40px 0 20px;
  font-size: 15px;
  border-radius: 4px;
  border: 1px solid $ruled_line;
  box-shadow: 0 1px 2px #dce5ef;
}

input[type='text']::placeholder {
  color: #989cb5;
  opacity: 0.5;
}

.icon-img {
  position: absolute;

  &.magnifying {
    width: 16px;
    top: 18px;
    right: 15px;
    pointer-events: none;
  }

  &.reset {
    width: 24px;
    top: 14px;
    right: 11px;
    cursor: pointer;
  }
}
</style>
