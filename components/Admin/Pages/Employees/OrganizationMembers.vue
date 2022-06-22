<template>
  <div class="organization-members-container">
    {{ companyUuid }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    companyUuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      checked: [],
      organizations: [],
    };
  },
  methods: {
    addGroup(selectOrganization: {}) {
      this.$emit('add', selectOrganization);
    },
    deleteGroup(selectOrganization: {}) {
      this.$emit('delete', selectOrganization);
    },
    onChange() {
      this.$emit('change', this.checked);
    },
  },
});
</script>

<style lang="scss" scoped>
.organization-members-container {
  background-color: white;
}
</style>
