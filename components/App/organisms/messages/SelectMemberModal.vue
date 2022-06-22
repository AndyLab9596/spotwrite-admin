<template>
  <transition name="modal" appear>
    <div v-scroll-lock="true" class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-content">
          <img
            src="/icon/icon_cross-white.svg"
            class="icon-cross"
            @click="onClose"
          />
          <div class="modal-header">
            <div class="title-container">
              <span class="title">ユーザーを選択</span>
              <search-input class="search-input" @input="filterByString" />
            </div>
            <div class="sort-container">
              <sort-select
                class="sort-select"
                :value="order"
                :items="orders"
                :placeholder="'ユーザーの並び替え'"
                @input="changeOrder"
              />
              <div class="switch-title">組織で絞り込む</div>
              <img
                v-if="groupType !== 'organization'"
                src="/icon/icon_switch-off.svg"
                class="switch-icon off"
                @click="groupType = 'organization'"
              />
              <img
                v-else
                src="/icon/icon_switch-on.svg"
                class="switch-icon on"
                @click="groupType = 'member'"
              />
            </div>
          </div>
          <VueLoading
            v-if="isLoading"
            type="spin"
            color="#CCC"
            :size="{ width: '100px', height: '100px' }"
            class="loading-style"
          ></VueLoading>
          <div v-else-if="groupType !== 'organization'" class="modal-body">
            <div class="group-box parent" @click="selectAllEmployee">
              <div class="user-title">メンバー</div>
              <img
                v-if="selectedEmployees.length === filteredEmployees.length"
                src="/app/icon/icon-check-pink.svg"
                class="user-check-icon"
              />
              <img
                v-else
                src="/app/icon/icon-check-gray.svg"
                class="user-check-icon"
              />
            </div>
            <div
              v-for="employee in filteredEmployees"
              :key="employee.uuid"
              class="group-box"
              @click="selectEmployee(employee.user_uuid)"
            >
              <div
                class="user-icon-bg"
                :style="{
                  'background-image': 'url(' + employee.user_icon + ')',
                }"
              ></div>
              <div class="user-title">
                <div class="user-name">{{ employee.name }}</div>
                <div
                  v-if="employee.organization_name"
                  class="user-organization-name"
                >
                  {{ employee.organization_name }}
                </div>
              </div>
              <img
                v-if="selectedEmployeeUuids.includes(employee.user_uuid)"
                src="/app/icon/icon-check-pink.svg"
                class="user-check-icon"
              />
              <img
                v-else
                src="/app/icon/icon-check-gray.svg"
                class="user-check-icon"
              />
            </div>
          </div>
          <div v-else class="modal-body">
            <template v-for="company in filteredCompanies">
              <div :key="company.uuid" class="group-box parent">
                <div class="user-title">{{ company.name }}</div>
              </div>
              <div
                v-for="employee in company.subordinated_organization_users"
                :key="employee.uuid"
                class="group-box"
                @click="selectOEmployee(employee.uuid)"
              >
                <img :src="employee.icon" class="user-icon" />
                <div class="user-title">
                  <div class="user-name">{{ employee.name }}</div>
                  <div v-if="company.name" class="user-organization-name">
                    {{ company.name }}
                  </div>
                </div>
                <img
                  v-if="selectedOEmployeeUuids.includes(employee.uuid)"
                  src="/app/icon/icon-check-pink.svg"
                  class="user-check-icon"
                />
                <img
                  v-else
                  src="/app/icon/icon-check-gray.svg"
                  class="user-check-icon"
                />
              </div>
              <template v-for="parent in company.parents">
                <div
                  :key="parent.uuid"
                  class="group-box"
                  @click="expandOrganization(parent.uuid)"
                >
                  <img
                    src="/app/icon/icon-building-pink.svg"
                    class="user-icon"
                  />
                  <div class="user-title">{{ parent.name }}</div>
                  <img
                    v-if="
                      parent.subordinated_organization_users.length &&
                        expandList.includes(parent.uuid)
                    "
                    src="/app/icon/icon-arrow_up_pink.svg"
                    class="user-arrow-icon"
                  />
                  <img
                    v-else-if="parent.subordinated_organization_users.length"
                    src="/app/icon/icon-arrow_down_pink.svg"
                    class="user-arrow-icon"
                  />
                  <img
                    v-if="isSelectedParent(parent)"
                    src="/app/icon/icon-check-pink.svg"
                    class="user-check-icon"
                    @click.stop="selectAllParentEmployees(parent)"
                  />
                  <img
                    v-else
                    src="/app/icon/icon-check-gray.svg"
                    class="user-check-icon"
                    @click.stop="selectAllParentEmployees(parent)"
                  />
                </div>
                <div
                  v-for="employee in parent.subordinated_organization_users"
                  v-show="expandList.includes(parent.uuid)"
                  :key="employee.uuid"
                  class="group-box"
                  @click="selectOEmployee(employee.uuid)"
                >
                  <img :src="employee.icon" class="user-icon" />
                  <div class="user-title">
                    <div class="user-name">{{ employee.name }}</div>
                    <div v-if="parent.name" class="user-organization-name">
                      {{ parent.name }}
                    </div>
                  </div>
                  <img
                    v-if="selectedOEmployeeUuids.includes(employee.uuid)"
                    src="/app/icon/icon-check-pink.svg"
                    class="user-check-icon"
                  />
                  <img
                    v-else
                    src="/app/icon/icon-check-gray.svg"
                    class="user-check-icon"
                  />
                </div>
                <template v-for="child in parent.children">
                  <div
                    :key="child.uuid"
                    class="group-box level-1"
                    @click="expandOrganization(child.uuid)"
                  >
                    <img
                      src="/app/icon/icon-building-pink.svg"
                      class="user-icon"
                    />
                    <div class="user-title">{{ child.name }}</div>
                    <img
                      v-if="
                        child.subordinated_organization_users.length &&
                          expandList.includes(child.uuid)
                      "
                      src="/app/icon/icon-arrow_up_pink.svg"
                      class="user-arrow-icon"
                    />
                    <img
                      v-else-if="child.subordinated_organization_users.length"
                      src="/app/icon/icon-arrow_down_pink.svg"
                      class="user-arrow-icon"
                    />
                    <img
                      v-if="isSelectedChild(child)"
                      src="/app/icon/icon-check-pink.svg"
                      class="user-check-icon"
                      @click.stop="selectAllChildEmployees(child)"
                    />
                    <img
                      v-else
                      src="/app/icon/icon-check-gray.svg"
                      class="user-check-icon"
                      @click.stop="selectAllChildEmployees(child)"
                    />
                  </div>
                  <div
                    v-for="employee in child.subordinated_organization_users"
                    v-show="expandList.includes(child.uuid)"
                    :key="employee.uuid"
                    class="group-box level-1"
                    @click="selectOEmployee(employee.uuid)"
                  >
                    <img :src="employee.icon" class="user-icon" />
                    <div class="user-title">
                      <div class="user-name">{{ employee.name }}</div>
                      <div v-if="child.name" class="user-organization-name">
                        {{ child.name }}
                      </div>
                    </div>
                    <img
                      v-if="selectedOEmployeeUuids.includes(employee.uuid)"
                      src="/app/icon/icon-check-pink.svg"
                      class="user-check-icon"
                    />
                    <img
                      v-else
                      src="/app/icon/icon-check-gray.svg"
                      class="user-check-icon"
                    />
                  </div>
                </template>
              </template>
            </template>
          </div>
          <div v-show="checkSelected" class="modal-footer">
            <button type="button" class="button" @click="onSubmit">
              追加
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import SearchInput from '@/components/App/organisms/messages/SearchInput.vue';
import SortSelect from '@/components/App/organisms/messages/SortSelect.vue';
import { VueLoading } from 'vue-loading-template';
import { employees, organizations } from '@/libs/api/app';

export default Vue.extend({
  components: {
    SearchInput,
    SortSelect,
    VueLoading,
  },
  props: {
    roomUsers: {
      type: Array as PropType<AppApiResponse.RoomUser[]>,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      isLoading: true as boolean,
      employees: [] as AppApiResponse.Employee[],
      organizations: [] as AppApiResponse.Organization[],
      keyword: '' as string,
      order: 'name' as string,
      orders: [
        {
          value: 'name',
          name: 'あいうえお順',
        },
        {
          value: 'frequency',
          name: '最近やりとりした順',
        },
      ],
      groupType: 'member' as string,
      selectedEmployeeUuids: [] as string[],
      selectedOEmployeeUuids: [] as string[],
      selectedOrganizationUuids: [] as string[],
      expandList: [] as string[],
    };
  },
  computed: {
    filteredEmployees() {
      return this.employees.filter(
        (employee: AppApiResponse.Employee) =>
          employee.name.includes(this.keyword) &&
          employee.user_uuid !== this.$accessor.userProfile.uuid &&
          !this.roomUsers.some(
            (r: AppApiResponse.RoomUser) => r.uuid === employee.user_uuid
          )
      );
    },
    filteredOrganizations() {
      return this.organizations.map((o: AppApiResponse.Organization) => {
        const organization = { ...o };
        organization.subordinated_organization_users = organization.subordinated_organization_users.filter(
          (employee: object) =>
            employee.uuid !== this.$accessor.userProfile.uuid &&
            employee.name.includes(this.keyword) &&
            employee.organization_uuid === organization.uuid &&
            employee.priority === 'main' &&
            !this.roomUsers.some(
              (r: AppApiResponse.RoomUser) => r.uuid === employee.uuid
            )
        );
        return organization;
      });
    },
    filteredCompanies() {
      return this.filteredOrganizations
        .map((company: AppApiResponse.Organization) => {
          const companyItem = { ...company };
          companyItem.parents = this.filteredOrganizations
            .map((parent: AppApiResponse.Organization) => {
              const parentItem = { ...parent };
              parentItem.children = this.filteredOrganizations.filter(
                (child: AppApiResponse.Organization) =>
                  child.layer === 2 &&
                  child.relations.parent === parentItem.uuid &&
                  child.subordinated_organization_users.length
              );
              return parentItem;
            })
            .filter(
              (parent: AppApiResponse.Organization) =>
                parent.layer === 1 &&
                parent.relations.company === companyItem.uuid &&
                parent.children.length +
                  parent.subordinated_organization_users.length
            );
          return companyItem;
        })
        .filter(
          (company: AppApiResponse.Organization) =>
            company.layer === 0 &&
            company.type === 'company' &&
            company.parents.length +
              company.subordinated_organization_users.length
        );
    },
    selectedEmployees() {
      return this.filteredEmployees.filter(
        (employee: AppApiResponse.Employee) =>
          this.selectedEmployeeUuids.includes(employee.user_uuid)
      );
    },
    selectedCompanies() {
      return this.filteredCompanies
        .map((company: AppApiResponse.Organization) => {
          const companyItem = { ...company };
          companyItem.subordinated_organization_users = companyItem.subordinated_organization_users.filter(
            (employee: object) =>
              (this.groupType === 'member' &&
                this.selectedEmployeeUuids.includes(employee.uuid)) ||
              (this.groupType === 'organization' &&
                this.selectedOEmployeeUuids.includes(employee.uuid))
          );
          companyItem.parents = companyItem.parents
            .map((parent: AppApiResponse.Organization) => {
              const parentItem = { ...parent };
              parentItem.subordinated_organization_users = parentItem.subordinated_organization_users.filter(
                (employee: object) =>
                  (this.groupType === 'member' &&
                    this.selectedEmployeeUuids.includes(employee.uuid)) ||
                  (this.groupType === 'organization' &&
                    this.selectedOEmployeeUuids.includes(employee.uuid))
              );
              parentItem.children = parentItem.children
                .map((child: AppApiResponse.Organization) => {
                  const childItem = { ...child };
                  childItem.subordinated_organization_users = childItem.subordinated_organization_users.filter(
                    (employee: object) =>
                      (this.groupType === 'member' &&
                        this.selectedEmployeeUuids.includes(employee.uuid)) ||
                      (this.groupType === 'organization' &&
                        this.selectedOEmployeeUuids.includes(employee.uuid))
                  );
                  return childItem;
                })
                .filter(
                  (child: AppApiResponse.Organization) =>
                    child.subordinated_organization_users.length
                );
              return parentItem;
            })
            .filter(
              (parent: AppApiResponse.Organization) =>
                parent.subordinated_organization_users.length +
                parent.children.length
            );
          return companyItem;
        })
        .filter(
          (company: AppApiResponse.Organization) =>
            company.subordinated_organization_users.length +
            company.parents.length
        );
    },
    checkSelected() {
      if (this.groupType === 'member') {
        return this.selectedEmployees.length;
      }
      return this.filteredCompanies.filter(
        (company: AppApiResponse.Organization) => {
          return (
            company.subordinated_organization_users.filter((employee: object) =>
              this.selectedOEmployeeUuids.includes(employee.uuid)
            ).length +
            company.parents.filter((parent: AppApiResponse.Organization) => {
              return (
                parent.subordinated_organization_users.filter(
                  (employee: object) =>
                    this.selectedOEmployeeUuids.includes(employee.uuid)
                ).length +
                parent.children.filter((child: AppApiResponse.Organization) => {
                  return child.subordinated_organization_users.filter(
                    (employee: object) =>
                      this.selectedOEmployeeUuids.includes(employee.uuid)
                  ).length;
                }).length
              );
            }).length
          );
        }
      ).length;
    },
  },
  watch: {
    employees(
      newValue: AppApiResponse.Employee[],
      oldValue: AppApiResponse.Employee[]
    ) {
      if (
        newValue.length > oldValue.length &&
        (oldValue.length === 0 || newValue.length % oldValue.length === 0)
      ) {
        this.getEmployees(newValue.length);
      } else if (newValue.length && this.groupType === 'member') {
        this.isLoading = false;
      }
    },
    organizations(
      newValue: AppApiResponse.Organization[],
      oldValue: AppApiResponse.Organization[]
    ) {
      if (
        newValue.length > oldValue.length &&
        (oldValue.length === 0 || newValue.length % oldValue.length === 0)
      ) {
        this.getOrganizations(newValue.length);
      } else if (newValue.length && this.groupType === 'organization') {
        this.isLoading = false;
      }
    },
  },
  async mounted() {
    this.getEmployees();
    this.getOrganizations();
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onSubmit() {
      this.keyword = '';
      this.$emit(
        'submit',
        this.selectedCompanies,
        this.selectedOrganizationUuids,
        this.groupType
      );
    },
    filterByString(keyword: string) {
      this.keyword = keyword;
    },
    changeOrder(order: string) {
      this.order = order;
      this.employees = [];
      this.organizations = [];
      this.isLoading = true;
      this.getEmployees();
      this.getOrganizations();
    },
    selectEmployee(uuid: string) {
      if (this.selectedEmployeeUuids.includes(uuid)) {
        this.selectedEmployeeUuids.splice(
          this.selectedEmployeeUuids.indexOf(uuid),
          1
        );
      } else {
        this.selectedEmployeeUuids.push(uuid);
      }
    },
    selectOEmployee(uuid: string) {
      if (this.selectedOEmployeeUuids.includes(uuid)) {
        this.selectedOEmployeeUuids.splice(
          this.selectedOEmployeeUuids.indexOf(uuid),
          1
        );
      } else {
        this.selectedOEmployeeUuids.push(uuid);
      }
    },
    removeAllOEmployees(removeOrganizations: AppApiResponse.Organization[]) {
      removeOrganizations.map((organization: AppApiResponse.Organization) => {
        this.selectedOEmployeeUuids = this.selectedOEmployeeUuids.filter(
          (uuid: string) =>
            !organization.subordinated_organization_users.filter(
              (employee: object) => employee.uuid === uuid
            ).length
        );
        if (organization.parents) {
          this.removeAllOEmployees(organization.parents);
        }
        return organization;
      });
    },
    selectAllEmployee() {
      if (this.selectedEmployees.length === this.filteredEmployees.length) {
        this.selectedEmployeeUuids = [];
      } else {
        this.selectedEmployeeUuids = this.filteredEmployees.map(
          (employee: AppApiResponse.Employee) => employee.user_uuid
        );
      }
    },
    selectAllCompanyEmployees(company: AppApiResponse.Organization) {
      if (!this.isSelectedCompany(company)) {
        this.removeAllOEmployees([company]);
      }
      company.subordinated_organization_users.map((employee: object) =>
        this.selectOEmployee(employee.uuid)
      );
      company.parents.map((parent: object) =>
        this.selectAllParentEmployees(parent)
      );
    },
    selectAllParentEmployees(parent: AppApiResponse.Organization) {
      if (!this.isSelectedParent(parent)) {
        this.removeAllOEmployees([parent]);
      }
      parent.subordinated_organization_users.map((employee: object) =>
        this.selectOEmployee(employee.uuid)
      );
    },
    selectAllChildEmployees(child: AppApiResponse.Organization) {
      if (!this.isSelectedChild(child)) {
        this.removeAllOEmployees([child]);
      }
      child.subordinated_organization_users.map((employee: object) =>
        this.selectOEmployee(employee.uuid)
      );
    },
    expandOrganization(uuid: AppApiResponse.Organization) {
      if (this.expandList.includes(uuid)) {
        this.expandList.splice(this.expandList.indexOf(uuid), 1);
      } else {
        this.expandList.push(uuid);
      }
    },
    isSelectedCompany(company: AppApiResponse.Organization) {
      const isSelected =
        company.subordinated_organization_users.filter((employee: object) =>
          this.selectedOEmployeeUuids.includes(employee.uuid)
        ).length === company.subordinated_organization_users.length &&
        company.parents.filter((parent: AppApiResponse.Organization) =>
          this.isSelectedParent(parent)
        ).length === company.parents.length;
      if (
        isSelected &&
        !this.selectedOrganizationUuids.includes(company.uuid)
      ) {
        this.selectedOrganizationUuids = [
          company.uuid,
          ...this.selectedOrganizationUuids,
        ];
      } else if (
        !isSelected &&
        this.selectedOrganizationUuids.includes(company.uuid)
      ) {
        this.selectedOrganizationUuids = this.selectedOrganizationUuids.filter(
          (selectedOrganizationUuid: string) =>
            selectedOrganizationUuid !== company.uuid
        );
      }
      return isSelected;
    },
    isSelectedParent(parent: AppApiResponse.Organization) {
      const isSelected =
        parent.subordinated_organization_users.filter((employee: object) =>
          this.selectedOEmployeeUuids.includes(employee.uuid)
        ).length === parent.subordinated_organization_users.length;
      if (isSelected && !this.selectedOrganizationUuids.includes(parent.uuid)) {
        this.selectedOrganizationUuids = [
          parent.uuid,
          ...this.selectedOrganizationUuids,
        ];
      } else if (
        !isSelected &&
        this.selectedOrganizationUuids.includes(parent.uuid)
      ) {
        this.selectedOrganizationUuids = this.selectedOrganizationUuids.filter(
          (selectedOrganizationUuid: string) =>
            selectedOrganizationUuid !== parent.uuid
        );
      }
      return isSelected;
    },
    isSelectedChild(child: AppApiResponse.Organization) {
      const isSelected =
        child.subordinated_organization_users.filter((employee: object) =>
          this.selectedOEmployeeUuids.includes(employee.uuid)
        ).length === child.subordinated_organization_users.length;
      if (isSelected && !this.selectedOrganizationUuids.includes(child.uuid)) {
        this.selectedOrganizationUuids = [
          child.uuid,
          ...this.selectedOrganizationUuids,
        ];
      } else if (
        !isSelected &&
        this.selectedOrganizationUuids.includes(child.uuid)
      ) {
        this.selectedOrganizationUuids = this.selectedOrganizationUuids.filter(
          (selectedOrganizationUuid: string) =>
            selectedOrganizationUuid !== child.uuid
        );
      }
      return isSelected;
    },
    async getEmployees(offset: number = 0) {
      try {
        const { users } = (
          await employees({
            limit: 50,
            offset,
            orders: this.order,
          })
        ).data;
        this.employees = offset === 0 ? users : [...this.employees, ...users];
      } catch (error) {
        console.error(error);
      }
    },
    async getOrganizations(offset: number = 0) {
      try {
        const res = (
          await organizations({
            limit: 100,
            offset,
            orders: this.order,
          })
        ).data;

        this.organizations =
          offset === 0
            ? res.organizations
            : [...this.organizations, ...res.organizations];
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  display: flex;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: scroll;
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  position: absolute;
  background: $true_white;
  border-radius: 4px;
  width: 700px;
  height: 900px;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
}

.icon-cross {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: calc(100% + 25px);
  width: 24px;
  height: 24px;
}

.modal-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  position: relative;

  .modal-header {
    margin-bottom: 25px;
    padding: 15px 15px 10px;

    .title-container {
      display: flex;
      align-items: center;
      margin-bottom: 25px;

      .title {
        font-size: 20px;
        margin-right: auto;
        padding: 0 20px;
      }

      .search-input {
        flex-shrink: 0;
        width: 360px;
        height: 52px;
      }
    }

    .sort-container {
      display: flex;
      align-items: center;
      font-size: 15px;

      .sort-select {
        width: 162px;
        height: 32px;
        flex-shrink: 0;
        margin-left: auto;
      }

      .switch-title {
        margin-left: 40px;
      }

      .switch-icon {
        width: 52px;
        height: 32px;
        margin-left: 25px;
        cursor: pointer;
      }
    }
  }

  .modal-body {
    flex-grow: 1;
    overflow: auto;
    border-top: solid 1px #e8ebed;

    .group-box {
      display: flex;
      align-items: center;
      height: 58px;
      padding-left: 30px;
      padding-right: 40px;
      cursor: pointer;
      user-select: none;
      border-bottom: solid 1px #e8ebed;

      &.parent {
        height: 64px;
        background: #eff0f7;
        font-size: 15px;
        padding-left: 15px;
      }

      &.level-1 {
        padding-left: 50px;
        background: #f7f8fd;
      }

      & + .parent {
        margin-top: 40px;
        border-top: solid 1px #e8ebed;
      }

      .user-icon {
        width: 32px;
        height: 32px;
        object-fit: cover;
        border-radius: 12px;
        margin-right: 8px;
      }

      .user-title {
        display: flex;
        flex-direction: column;
        margin-right: auto;
        line-height: 1;

        .user-organization-name {
          color: #9c9da5;
          font-size: 11px;
          margin-top: 5px;
        }
      }

      .user-arrow-icon {
        height: 28px;
        margin-right: 20px;
      }

      .user-check-icon {
        height: 16px;
        cursor: pointer;
      }

      .user-icon-bg {
        width: 32px;
        height: 32px;
        border-radius: 5px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        margin-right: 8px;
      }
    }
  }

  .modal-footer {
    height: 110px;
    padding: 25px 40px 40px;
    background: #f7f8fd;
  }
}

.button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #e4e5ed;
  color: #6a6d83;
  font-size: 15px;
  border: none;
  border-radius: 4px;
  height: 100%;
  width: 100%;
  opacity: 1;
  margin-bottom: 15px;

  &:disabled {
    color: rgba(204, 204, 204, 0.5);
    background-color: rgba(0, 0, 0, 0.5);
    cursor: auto;
  }
}
</style>
