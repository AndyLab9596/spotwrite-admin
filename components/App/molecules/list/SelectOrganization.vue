<template>
  <div class="component-container">
    <ul>
      <li
        v-for="organization in organizations"
        :key="organization.uuid"
        :class="{
          selected: selected(organization),
        }"
        @click="onListItemClick(organization)"
      >
        <div class="item-container">
          <div class="organization">
            {{ organization.name }}
          </div>
        </div>
      </li>
      <InfiniteLoading spinner="spiral" @infinite="onInfinite">
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </InfiniteLoading>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import InfiniteLoading, { StateChanger } from 'vue-infinite-loading';
import { organizations } from '@/libs/api/app';

type Organization = AppApiResponse.Organization;

export default Vue.extend({
  components: {
    InfiniteLoading,
  },
  props: {
    items: {
      type: Array as PropType<Organization[]>,
      required: true,
    },
  },
  data: () => ({
    selectedOrganization: undefined as Organization | undefined,
    appendedOrganizations: [] as Organization[],
  }),
  computed: {
    organizations(): Organization[] {
      return this.items.concat(this.appendedOrganizations);
    },
    offset(): number {
      return this.organizations.length;
    },
  },
  methods: {
    onListItemClick(organization: Organization): void {
      this.selectedOrganization = organization;
      this.$emit('select', organization);
    },
    async onInfinite($state: StateChanger): Promise<void> {
      const { data } = await organizations({ offset: this.offset });
      if (data.organizations.length) {
        this.appendedOrganizations.push(...data.organizations);
        $state.loaded();
      } else {
        $state.complete();
      }
    },
    selected(organization: Organization): boolean {
      return (
        !!this.selectedOrganization &&
        organization.uuid === this.selectedOrganization.uuid
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.component-container {
  background-color: $true_white;
}

li {
  border-bottom: 1px solid $ruled_line;
  cursor: pointer;

  &.disabled {
    cursor: not-allowed;
    color: $text_gray;
  }
}

.item-container {
  display: flex;
  padding: 13px 23px;
}

.organization {
  font-size: 13px;
}
</style>
