<template>
  <div class="select-organization-container">
    <div class="select-organization-box">
      <div class="button" @click="onSelectOrganizationButtonClick">
        <slot></slot>
      </div>
      <ul v-if="isOrganizationsOpen" class="select">
        <li
          v-for="(org, i) in organizations"
          :key="i"
          @click="onOrganizationSelect(org)"
        >
          {{ org.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

type Employee = ApiResponse.Employee;

export default Vue.extend({
  props: {
    organizations: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    isOrganizationsOpen: false as boolean,
  }),
  computed: {
    offset(): number {
      return this.organizations.length;
    },
  },
  methods: {
    onSelectOrganizationButtonClick(): void {
      this.isOrganizationsOpen = !this.isOrganizationsOpen;
    },
    onOrganizationSelect(organization: object): void {
      this.$emit('select', organization);
      this.onSelectOrganizationButtonClick();
    },
  },
});
</script>

<style lang="scss" scoped>
.select-organization-box {
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
