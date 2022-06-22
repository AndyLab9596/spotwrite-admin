<template>
  <div class="mask" @click="onClick">
    <img class="icon" :src="src" alt="" />
    <img src="/app/icon/Icon-other-white.svg" class="icon-other" alt="" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  methods: {
    onClick() {
      this.$emit('onClick');
    },
  },
});
</script>

<style lang="scss" scoped>
.mask {
  background-color: $true_black;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
}

.icon {
  height: 32px;
  width: 32px;
  border-radius: 12px;
  box-shadow: 0 1px 2px $box-shadow;
  opacity: 0.4;
}

.icon-other {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 17px;
}
</style>
