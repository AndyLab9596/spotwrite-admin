<template>
  <div class="select-community-container">
    <div class="select-community-box">
      <div class="button" @click="onSelectCommunityButtonClick">
        <slot></slot>
      </div>
      <ul v-if="isCommunitiesOpen" class="select">
        <li
          v-for="(org, i) in communities"
          :key="i"
          @click="onCommunitySelect(org)"
        >
          {{ org.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

type Employee = AppApiResponse.Employee;

export default Vue.extend({
  props: {
    communities: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    isCommunitiesOpen: false as boolean,
  }),
  methods: {
    onSelectCommunityButtonClick(): void {
      this.isCommunitiesOpen = !this.isCommunitiesOpen;
    },
    onCommunitySelect(community: object): void {
      this.$emit('select', community);
      this.onSelectCommunityButtonClick();
    },
  },
});
</script>

<style lang="scss" scoped>
.select-community-box {
  position: relative;

  .button {
    width: 100%;
    background-color: $true_white;
    padding: 15px 0;
    color: rgba(46, 48, 62, 0.6);
    cursor: pointer;
    font-size: 13px;
  }

  .select {
    position: absolute;
    width: 100%;
    max-height: calc(55px * 5);
    overflow-y: scroll;
    z-index: 10;

    li {
      width: 100%;
      background-color: $true_white;
      border: 1px solid $button_background_color;
      padding: 15px 0;
      cursor: pointer;
      color: rgba(46, 48, 62, 0.6);
      font-size: 13px;

      &:hover {
        background-color: $link_color;
        color: $true_white;
      }
    }
  }
}
</style>
