<template>
  <div class="container">
    <div class="card">
      <slot></slot>
    </div>
    <div class="bottom">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: $gradient_pink_blue;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(#fff, 0.2);
  box-shadow: 1px 0 3px #dce5ef;
  border-radius: 8px;
  padding: 30px 20px;
  width: 350px;
}

.bottom {
  margin-top: 17px;
}
</style>
