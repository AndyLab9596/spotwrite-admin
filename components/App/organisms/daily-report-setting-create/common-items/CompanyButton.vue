<template>
  <button class="company-button">
    <p class="company-name">{{ item.company_name }}</p>
    <p class="company-peaple">{{ item.users.length }}名</p>
    <img
      src="/icon/icon_delete.svg"
      class="delete-icon"
      alt=""
      @click="deleteCompany(item.company_uuid)"
    />
  </button>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

type CompanyMember = {
  company_uuid: string;
  company_name: string;
  users: User[];
};

type User = {
  uuid: string;
  name: string;
};

export default Vue.extend({
  props: {
    item: {
      type: Object as PropType<CompanyMember>,
      required: true,
    },
  },
  methods: {
    deleteCompany(uuid: string) {
      this.$emit('delete', uuid);
    },
  },
});
</script>

<style lang="scss" scoped>
.company-button {
  display: flex;
  align-items: center;
  font-size: 15px;
  border: 1px solid $job_type_border;
  border-radius: 4px;
  height: 44px;
  padding: 0 10px;
  line-height: 1em;
  cursor: pointer;
  color: $dark_blue;
  background-color: $true_white;
  flex-shrink: 0;

  .company-name {
    margin: 0 3px 0 0;
  }

  .company-peaple {
    margin: 0 3px 0 0;
  }

  .delete-icon {
    width: 16px;
  }
}
</style>
