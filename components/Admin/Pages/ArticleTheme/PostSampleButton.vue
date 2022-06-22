<template>
  <button class="withIcon" @click="$emit('click')">
    <svg
      height="17"
      viewBox="0 0 17 17"
      width="17"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m451.735 299.716a1.619 1.619 0 0 1 1.577 1.658v6.826a2.7 2.7 0 0 1 -2.629 2.766h-11.626a1.792 1.792 0 0 1 -1.745-1.836v-13.076a1.056 1.056 0 0 1 1.028-1.083h12.367a1.056 1.056 0 0 1 1.028 1.083v11.87"
        fill="none"
        stroke="#fff"
        stroke-linecap="round"
        stroke-miterlimit="10"
        transform="translate(-436.812 -294.471)"
      />
      <rect
        fill="#fff"
        height="5.535"
        rx="1.055"
        width="10.446"
        x="2.356"
        y="2.26"
      />
      <g
        fill="#898c9e"
        stroke="#fff"
        stroke-linecap="round"
        stroke-miterlimit="10"
      >
        <path d="m2.861 9.793h9.536" />
        <path d="m2.861 11.975h9.536" />
        <path d="m2.861 14.156h9.536" />
      </g></svg
    >記事サンプル
  </button></template
>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PostSampleButton',
});
</script>

<style lang="scss" scoped>
button.withIcon {
  color: $true_white;
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  width: 100px;
  background-color: $gray_blue_3;
  border: none;
  border-radius: 4px;
  padding: 4px 5px;

  &:hover {
    background-color: $gray_blue_4;
  }

  svg {
    margin-right: 5px;
  }
}
</style>
