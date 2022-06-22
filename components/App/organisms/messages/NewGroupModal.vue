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
            <div class="modal-header-title">選択したユーザー</div>
            <div class="modal-header-count">{{ selectedUserCount }}人</div>
          </div>
          <div class="modal-body">
            <template v-for="company in companies">
              <div :key="company.uuid" class="group-box parent">
                <div class="user-title">{{ company.name }}</div>
              </div>
              <div
                v-for="employee in company.subordinated_organization_users"
                :key="employee.uuid"
                class="group-box"
              >
                <img :src="employee.icon" class="user-icon" />
                <div class="user-title">
                  <div class="user-name">{{ employee.name }}</div>
                  <div v-if="company.name" class="user-organization-name">
                    {{ company.name }}
                  </div>
                </div>
                <img
                  src="/app/icon/Icon-delete.svg"
                  class="user-remove-icon"
                  @click="removeEmployee(employee.uuid)"
                />
              </div>
              <template v-for="parent in company.parents">
                <div
                  v-if="
                    parent.subordinated_organization_users.length !== 0 &&
                      isDisplayParentOrganizationName(parent)
                  "
                  :key="parent.uuid"
                  class="group-box collapse"
                  :class="{
                    'parent-organization-selected': isDisplayParentOrganizationName(
                      parent
                    ),
                  }"
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
                    src="/app/icon/Icon-delete.svg"
                    class="user-remove-icon"
                    @click="removeOrganization(parent.uuid)"
                  />
                </div>
                <div
                  v-for="employee in parent.subordinated_organization_users"
                  v-show="
                    expandList.includes(parent.uuid) ||
                      !selectedOrganizationUuids.includes(parent.uuid)
                  "
                  :key="employee.uuid"
                  class="group-box"
                  :class="{
                    'parent-organization-selected': isDisplayParentOrganizationName(
                      parent
                    ),
                  }"
                >
                  <img :src="employee.icon" class="user-icon" />
                  <div class="user-title">
                    <div class="user-name">{{ employee.name }}</div>
                    <div v-if="parent.name" class="user-organization-name">
                      {{ parent.name }}
                    </div>
                  </div>
                  <img
                    src="/app/icon/Icon-delete.svg"
                    class="user-remove-icon"
                    @click="removeEmployee(employee.uuid)"
                  />
                </div>
                <template v-for="child in parent.children">
                  <div
                    v-if="isDisplayChildOrganizationName(child)"
                    :key="child.uuid"
                    class="group-box level-1 collapse"
                    :class="{
                      'child-organization-selected level-1': isDisplayChildOrganizationName(
                        child
                      ),
                    }"
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
                      src="/app/icon/Icon-delete.svg"
                      class="user-remove-icon"
                      @click="removeOrganization(child.uuid)"
                    />
                  </div>
                  <div
                    v-for="employee in child.subordinated_organization_users"
                    v-show="
                      expandList.includes(child.uuid) ||
                        !selectedOrganizationUuids.includes(child.uuid)
                    "
                    :key="employee.uuid"
                    class="group-box"
                    :class="{
                      'child-organization-selected level-1': isDisplayChildOrganizationName(
                        child
                      ),
                    }"
                  >
                    <img :src="employee.icon" class="user-icon" />
                    <div class="user-title">
                      <div class="user-name">{{ employee.name }}</div>
                      <div v-if="child.name" class="user-organization-name">
                        {{ child.name }}
                      </div>
                    </div>
                    <img
                      src="/app/icon/Icon-delete.svg"
                      class="user-remove-icon"
                      @click="removeEmployee(employee.uuid)"
                    />
                  </div>
                </template>
              </template>
            </template>
          </div>
          <div class="modal-footer">
            <button type="button" class="button" @click="onClose">
              キャンセル
            </button>
            <button
              v-if="companies.length"
              type="button"
              class="button"
              @click="onSubmit"
            >
              決定
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    selectedCompanies: {
      type: Array as PropType<AppApiResponse.Organization[]>,
      default: () => [],
    },
    selectedOrganizationUuids: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  data() {
    return {
      isLoading: true as boolean,
      room: {} as AppApiRequest.Rooms,
      expandList: [] as string[],
      companies: this.selectedCompanies as AppApiResponse.Organization[],
    };
  },
  computed: {
    selectedUserCount(): number {
      const userCount = this.companies.reduce(
        (acc: number, company: AppApiResponse.Organization) => {
          const parentUserCount = company.parents.reduce(
            (parentAcc: number, parent: AppApiResponse.Organization) => {
              const childUserCount = parent.children.reduce(
                (childAcc: number, child: AppApiResponse.Organization) =>
                  childAcc + child.subordinated_organization_users.length,
                0
              );
              return (
                childUserCount +
                parentAcc +
                parent.subordinated_organization_users.length
              );
            },
            0
          );
          return parentUserCount + acc;
        },
        0
      );
      return userCount;
    },
  },
  watch: {
    selectedCompanies() {
      this.companies = this.selectedCompanies;
    },
  },
  methods: {
    isDisplayParentOrganizationName(parent: any): boolean {
      return this.selectedOrganizationUuids.includes(parent.uuid);
    },
    isDisplayChildOrganizationName(child: any): boolean {
      return this.selectedOrganizationUuids.includes(child.uuid);
    },
    onClose() {
      this.$emit('close');
    },
    onSubmit() {
      this.room.user_uuids = [];
      this.companies.map((company: AppApiResponse.Organization) => {
        this.room.user_uuids = this.room.user_uuids.concat(
          company.subordinated_organization_users.map(
            (employee: object) => employee.uuid
          )
        );
        company.parents.map((parent: AppApiResponse.Organization) => {
          this.room.user_uuids = this.room.user_uuids.concat(
            parent.subordinated_organization_users.map(
              (employee: object) => employee.uuid
            )
          );
          parent.children.map((child: AppApiResponse.Organization) => {
            this.room.user_uuids = this.room.user_uuids.concat(
              child.subordinated_organization_users.map(
                (employee: object) => employee.uuid
              )
            );
            return child;
          });
          return parent;
        });
        return company;
      });
      this.$emit('submit', this.room);
    },
    removeOrganization(uuid: string) {
      this.$emit('remove-selected-organization-uuid', uuid);
      this.$emit('remove-organization', uuid);
    },
    removeEmployee(uuid: string) {
      this.$emit('remove-employee', uuid);
    },
    expandOrganization(uuid: AppApiResponse.Organization) {
      if (this.expandList.includes(uuid)) {
        this.expandList.splice(this.expandList.indexOf(uuid), 1);
      } else {
        this.expandList.push(uuid);
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
    align-items: center;
    display: flex;
    flex-direction: row;
    padding: 35px 40px 20px;
  }

  .modal-header-title {
    font-size: 20px;
    margin-right: 16px;
  }

  .modal-header-count {
    color: #9c9da5;
    font-size: 16px;
    font-weight: bold;
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
      }

      & + .parent {
        margin-top: 40px;
        border-top: solid 1px #e8ebed;
      }

      &.collapse {
        cursor: pointer;
      }

      .user-icon {
        height: 32px;
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

      .user-remove-icon {
        height: 16px;
        cursor: pointer;
      }
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
    opacity: 1;
    margin-bottom: 15px;

    &:disabled {
      color: rgba(204, 204, 204, 0.5);
      background-color: rgba(0, 0, 0, 0.5);
      cursor: auto;
    }
  }

  .modal-footer {
    display: flex;
    height: 110px;
    padding: 25px 40px 40px;
    background: #f7f8fd;

    .button {
      width: calc((100% - 15px) / 2);

      & + .button {
        margin-left: auto;
      }
    }
  }

  .parent-organization-selected {
    background-color: #f9f5f5;
  }

  .child-organization-selected {
    background-color: #f9f5f5;
    padding-left: 50px;
  }
}
</style>
