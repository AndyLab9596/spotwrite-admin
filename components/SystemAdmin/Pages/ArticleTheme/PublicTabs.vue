<template>
  <div class="scrollable-tabs">
    <div ref="wrapper">
      <div ref="tabs" class="tabs">
        <button
          class="tab"
          :class="{ active: isPublic }"
          @click="$emit('change-tab', 1)"
        >
          テーマ一覧に表示中
        </button>
        <button
          class="tab"
          :class="{ active: !isPublic }"
          @click="$emit('change-tab', 0)"
        >
          非表示
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    isPublic: {
      type: Number,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.scrollable-tabs {
  position: relative;

  .arrow-left {
    height: 100%;
    position: absolute;
    left: 3px;
    top: 12.5px;
    z-index: 10;
  }

  .arrow-right {
    height: 100%;
    position: absolute;
    right: 3px;
    top: 12.5px;
    z-index: 10;
  }

  .arrow-button {
    border: 0;
    cursor: pointer;
  }

  .wrapper {
    position: relative;
    height: 50px;
    margin: 0 40px;
    overflow-x: hidden;
  }

  .tabs {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: max-content;
  }

  .tab {
    height: 50px;
    line-height: 1;
    width: 200px;
    border: solid 1px transparent;
    border-radius: 4px;
    padding: 0 20px;
    cursor: pointer;
    outline: none;
    margin-right: 10px;
    background-color: #e9eaf2;
    color: #6a6d83;
    text-align: center;
    font-size: 15px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.active {
      background-color: #fff;
      border-color: #e4e5ed;
    }
  }
}
</style>
