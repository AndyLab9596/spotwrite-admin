<template>
  <div class="pick-up-head-wrapper">
    <img src="/app/icon/leaf-left.svg" class="icon-leaf-left" />
    <div class="head-center-contents">
      <p class="contents-title">PICK UP</p>
      <div class="contents-shine">
        <img src="/app/icon/icon-shine.svg" class="icon-shine-left" />
        <img src="/app/icon/icon-medal.svg" class="icon-medal" />
        <img src="/app/icon/icon-shine.svg" class="icon-shine-right" />
      </div>
    </div>
    <img src="/app/icon/leaf-right.svg" class="icon-leaf-right" />
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
});
</script>

<style lang="scss" scoped>
.pick-up-head-wrapper {
  display: flex;
  justify-content: space-between;
  width: 220px;
  margin: 0 0 28px;
}

.head-center-contents {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.contents-shine {
  display: flex;
  justify-content: space-between;
  width: 59px;
}

.contents-title {
  font-family: 'Lato', sans-serif;
  font-size: 24px;
  font-weight: bold;
  line-height: 1em;
  margin: 0 0 6px 0;
}

.icon-leaf-left {
  width: 32px;
}

.icon-leaf-right {
  width: 32px;
}

.icon-shine-right {
  align-self: flex-start;
  width: 8px;
}

.icon-shine-left {
  align-self: flex-end;
  width: 8px;
}

.icon-medal {
  width: 20px;
}
</style>
