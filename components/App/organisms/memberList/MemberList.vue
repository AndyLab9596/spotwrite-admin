<template>
  <div>
    <template v-if="isTotalTab">
      <member-list-item
        v-for="company in selectedTabCompanies"
        :key="company.uuid"
        :company-name="company.name"
        :users="company.users"
        class="list"
      />
    </template>
    <template v-else>
      <member-list-item
        :key="selectedTabCompanies.uuid"
        :users="selectedTabCompanies"
        class="list"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import MemberListItem from '../../molecules/memberList/MemberListItem.vue';

type Company = ApiResponse.MemberListCompany;
type User = ApiResponse.CompanyUser;

export default Vue.extend({
  components: {
    MemberListItem,
  },
  props: {
    companies: {
      type: Array as PropType<Company[]>,
      required: true,
    },
    selectedTabId: {
      type: String,
      required: true,
    },
    totalTabId: {
      type: String,
      required: true,
    },
  },
  computed: {
    isTotalTab(): boolean {
      return this.selectedTabId === this.totalTabId;
    },
    selectedTabCompanies(): Company[] | User[] {
      if (this.selectedTabId === this.totalTabId) return this.companies;

      const company = this.companies.find(
        (item: Company) => this.selectedTabId === item.uuid
      );
      return company ? company.users : [];
    },
  },
});
</script>

<style lang="scss" scoped>
.member-list-company-name {
  display: flex;
  align-items: center;
  color: $gentle_bluish_purple;
  background-color: $white_1;
  font-weight: 600;
  font-size: 15px;
  height: 64px;
  padding: 0 0 0 16px;
  border-top: 1px solid $ruled_line;
}

.member-list-profile {
  display: flex;
  align-items: center;
  height: 58px;
  width: 100%;
  border-top: 1px solid $ruled_line;
  padding: 0 32px;
}

.list {
  &:last-of-type {
    border-bottom: 1px solid $ruled_line;
  }
}
</style>
