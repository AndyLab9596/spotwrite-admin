<template>
  <div class="setting-title-wrapper">
    <p class="setting-title">日報設定の作成</p>
    <input
      :value="title"
      class="setting-input"
      type="text"
      placeholder="日報名を入力"
      @input="onChange"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    onChange(event: { target: HTMLInputElement }) {
      this.$emit('title', event.target.value);
    },
  },
});
</script>

<style lang="scss" scoped>
.setting-title-wrapper {
  padding: 31px 40px;
}

.setting-title {
  font-size: 15px;
  color: $main-color;
  line-height: 1em;
  margin: 0 0 34px 0;
  font-family: 'Lato', 'Hiragino Kaku Gothic Pro', sans-serif;
  font-weight: bold;
}

.setting-input {
  width: 100%;
  font-size: 15px;
  line-height: 1em;
  font-weight: 300;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid $ruled_line;
  padding: 0 0 20px 0;
}

::placeholder {
  color: $sub-color;
}
</style>
