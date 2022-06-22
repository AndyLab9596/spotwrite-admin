<template>
  <div class="container">
    <div class="close-icon" @click="onCloseIconClick">
      <CrossIcon :size="16" background-color="none" color="#fff" />
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CrossIcon from '@/components/Admin/Modules/Icons/CrossIcon.vue';

export default Vue.extend({
  components: {
    CrossIcon,
  },
  methods: {
    onCloseIconClick(): void {
      this.$emit('close');
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background-color: $gray_blue_3;
  opacity: 0.8;
  color: $true_white;
  padding: 18px 217px;
  z-index: 100;

  .close-icon {
    cursor: pointer;
    position: absolute;
    right: 96px;
  }
}
</style>
