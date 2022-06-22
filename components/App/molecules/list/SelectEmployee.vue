<template>
  <div class="component-container">
    <ul>
      <li
        v-for="employee in employees"
        :key="employee.user_uuid"
        :class="{
          selected: selected(employee),
          disabled: !selectable(employee),
        }"
        @click="onListItemClick(employee)"
      >
        <div class="item-container">
          <div class="left">
            <img :src="employee.user_icon" />
          </div>
          <div class="right">
            <div class="name">
              {{ employee.name }}
            </div>
            <div class="organization">
              {{ employee.organization_name }}
            </div>
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
import { employees } from '@/libs/api/app';

type Employee = AppApiResponse.Employee;

export default Vue.extend({
  components: {
    InfiniteLoading,
  },
  props: {
    items: {
      type: Array as PropType<Employee[]>,
      required: true,
    },
    unavailableItems: {
      type: Array as PropType<Employee[]>,
      default: () => [],
    },
  },
  data: () => ({
    selectedEmployee: undefined as Employee | undefined,
    appendedEmployees: [] as Employee[],
  }),
  computed: {
    employees(): Employee[] {
      return this.items.concat(this.appendedEmployees);
    },
    offset(): number {
      return this.employees.length;
    },
  },
  methods: {
    onListItemClick(employee: Employee): void {
      if (!this.selectable(employee)) {
        return;
      }
      this.selectedEmployee = employee;
      this.$emit('select', employee);
    },
    async onInfinite($state: StateChanger): Promise<void> {
      const { data } = await employees({ offset: this.offset });
      if (data.users.length) {
        this.appendedEmployees.push(...data.users);
        $state.loaded();
      } else {
        $state.complete();
      }
    },
    selectable(employee: Employee): boolean {
      const found = this.unavailableItems.find(
        (emp: Employee) => emp.user_uuid === employee.user_uuid
      );
      return found === undefined;
    },
    selected(employee: Employee): boolean {
      return (
        !!this.selectedEmployee &&
        employee.user_uuid === this.selectedEmployee.user_uuid
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

.left {
  width: 32px;
  height: 32px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    object-fit: cover;
  }
}

.right {
  margin-left: 8px;

  .name {
    font-size: 13px;
  }

  .organization {
    font-size: 11px;
    color: $sub_color;
  }
}
</style>
