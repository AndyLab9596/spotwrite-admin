<template>
  <div>
    <base-button class="button" @click="cLickButton">
      もっと見る
    </base-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from './BaseButton.vue';

export default Vue.extend({
  components: {
    BaseButton,
  },
  methods: {
    cLickButton() {
      this.$emit('onClickButton', true);
    },
  },
});
</script>

<style lang="scss" scoped>
.button {
  width: 100%;
  height: 44px;
  background-color: $button_background_color;
  color: $gentle_bluish_purple;
}
</style>
