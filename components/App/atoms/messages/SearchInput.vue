<template>
  <div class="search-container">
    <input
      v-model="searchWord"
      type="text"
      name="フリーワード"
      class="input place-holder"
      placeholder="フリーワードで検索"
      @keydown.prevent.enter.exact="onSubmit"
    />
    <a href="#" class="icon-container" @click.prevent="onSubmit">
      <img src="/app/icon/icon-magnifying.svg" class="icon-img" />
    </a>
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
    getSelectRoom(room_uuid: string) {
      this.$emit('getSelectRoom', room_uuid);
    },
    onSubmit() {
      this.$emit('onSubmit', this.searchWord);
    },
  },
});
</script>
<style lang="scss" scoped>
.search-container {
  position: relative;
  display: flex;
  height: 52px;
  width: 326px;
  padding: 10px 18px 10px 16px;
  border-radius: 5px;
  background: #fff;
  cursor: pointer;
  box-sizing: border-box;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

input[type='text'] {
  width: 263px;
  max-width: 263px;
  height: 32px;
  padding: 11px 0 8px 16px;
  border-radius: 20px;
  border: 1px solid $ruled_line;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  color: #2e303e;
  font-size: 13px;
  background: $input_text_background_color;
}

input[type='text']::placeholder {
  opacity: 0.3;
}

.icon-container {
  display: flex;
}

.icon-img {
  width: 16px;
  height: 16px;
}
</style>
