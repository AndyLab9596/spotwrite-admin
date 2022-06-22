<template>
  <div class="registerd-box" :style="displayTablePadding">
    <div class="title-wrapper">
      <div class="sub-title">
        <p class="sub-title-text">この組織（BOX）の登録済みメンバー</p>
        <p class="sub-title-member">{{ addedMemberCount + '名' }}</p>
      </div>
      <div
        class="toggle-icon"
        :class="box ? 'toggle-icon--open' : 'toggle-icon--close'"
        @click="toggleBox"
      />
    </div>
    <div v-show="box" class="table-wrapper" :style="displayHeight">
      <table class="table">
        <thead>
          <tr>
            <th class="table__border table__title">
              <base-checkbox @change="allCheck" />
            </th>
            <th class="table__border table__title">NO</th>
            <th class="table__border table__title">氏名</th>
            <th class="table__border table__title">ふりがな</th>
            <th class="table__border table__title">会社</th>
            <th class="table__border table__title">所属組織</th>
            <th class="table__border table__title">サブ組織</th>
            <th class="table__border table__title">役職</th>
            <th class="table__border table__title">雇用形態</th>
            <th class="table__border table__title">利用権限</th>
            <th class="table__empty"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(member, index) in addedMembers"
            :key="member.no"
            :ref="member.no"
            class="table__detail"
          >
            <td class="table__border table__detail-check table__added">
              <base-checkbox
                v-model="check"
                class="checkbox"
                :value="member.uuid"
              />
            </td>
            <td class="table__border table__detail-no table__added">
              {{ index + 1 }}
            </td>
            <td class="table__border table__detail-name table__added">
              <router-link
                :to="`/admin/employee-management/employees/${member.uuid}`"
                class="link-name"
              >
                {{ member.name }}
              </router-link>
            </td>
            <td class="table__border table__detail-kana table__added">
              <p>{{ member.name_kana }}</p>
            </td>
            <td class="table__border table__detail-company table__added">
              <p>{{ getCompany }}</p>
            </td>
            <td class="table__border table__detail-organization table__added">
              <p>{{ getOrganizations(member.organization) }}</p>
            </td>
            <td
              class="table__border table__detail-sub-organization table__added"
            >
              <div class="sub-organization-wrapper">
                <!-- TODO: サブ組織レスポンス追加されたら修正する -->
                <p class="sub-organization-name">
                  {{ getOrganizationNames(member.sub_organizations) }}
                </p>
                <div class="right-content">
                  <div class="line"></div>
                  <base-button class="disabled-delete-button" inverse disabled>
                    設定
                  </base-button>
                </div>
              </div>
            </td>
            <td class="table__border table__detail-position table__added">
              <p>{{ getPositions(member.employment_position) }}</p>
            </td>
            <td class="table__border table__detail-status table__added">
              {{ getEmploymentStatuses(member.employment_status) }}
            </td>
            <td class="table__border table__detail-authority table__added">
              {{ getAccessPermissions(member.access_permission) }}
            </td>
            <td class="table__detail-close table__added">
              <img src="/icon/icon_close_b.svg" @click="onDelete(member)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <check-delete
      v-if="alertDeleteUserModal"
      delete-button-text="完全に削除"
      class="alert-message"
      @close="toggleAlertDeleteUserModal"
      @click="deleteUser"
    >
      <div class="alert-message__text">
        このメンバーを完全に削除しますか？<br />
        <p class="red">
          削除した場合、登録している情報を元に戻すことはできません。
        </p>
      </div>
    </check-delete>
    <registered-member-delete-modal
      v-if="registeredMemberDeleteModal"
      class="registered-member-delete"
      @close="closeRegisteredMemberDeleteModal"
      @click="deleteUsers"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { CheckDelete } from '@/components/Admin/Modules/Modal';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import RegisteredMemberDeleteModal from '@/components/Admin/Pages/OrganizationManagement/Company/RegisteredMemberDeleteModal.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

type Check = {
  uuid: string;
  organization_uuid: string;
};

export default Vue.extend({
  layout: 'admin/default',
  components: {
    CheckDelete,
    BaseCheckbox,
    RegisteredMemberDeleteModal,
    BaseButton,
  },
  props: {
    addedMembers: {
      type: Array as PropType<ApiResponse.TempUser[]>,
      required: true,
    },
    organizations: {
      type: Array as PropType<ApiResponse.GroupOrganization[]>,
      required: true,
    },
    positions: {
      type: Array as PropType<ApiResponse.Position[]>,
      required: true,
    },
    employmentStatuses: {
      type: Array as PropType<ApiResponse.EmploymentStatus[]>,
      required: true,
    },
    accessPermissions: {
      type: Array as PropType<Types.AccessPermissions[]>,
      required: true,
    },
    addedMemberCount: {
      type: Number,
      required: true,
    },
    companyUuid: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    height: 0 as number,
    alertDeleteUserModal: false as boolean,
    deleteMember: {} as ApiResponse.TempUser,
    box: true as boolean,
    allChecked: false as boolean,
    check: [] as string[],
    registeredMemberDeleteModal: false as boolean,
  }),
  computed: {
    getCompany(): string {
      const organization = this.organizations.find(
        (item: ApiResponse.GroupOrganization) => item.uuid === this.companyUuid
      );
      return organization != null ? organization.name : '';
    },
    displayTablePadding(): { [key: string]: string } {
      return this.box
        ? { padding: '10px 30px 20px' }
        : { padding: '10px 30px 0' };
    },
    displayHeight(): { [key: string]: string } {
      return this.height === 0
        ? { maxHeight: 'fit-content' }
        : { maxHeight: `${this.height}px` };
    },
  },
  watch: {
    check() {
      if (this.check.length === 0) {
        this.closeRegisteredMemberDeleteModal();
        return;
      }
      this.openRegisteredMemberDeleteModal();
    },
  },
  mounted() {
    const height = this.getDisplayTableHeight();
    this.setHeight(height);
  },
  methods: {
    allCheck() {
      this.allChecked = !this.allChecked;

      if (this.allChecked) {
        this.check = this.addedMembers.map(
          (item: ApiResponse.TempUser) => item.uuid
        );
        return;
      }
      this.check = [];
    },
    getDisplayTableHeight(): number {
      let totalHeight = 0 as number;

      if (this.addedMembers.length >= 6) {
        for (let i = 0; i <= 5; i += 1) {
          const e = this.$refs[this.addedMembers[i].no] as HTMLElement[];
          totalHeight += e[0].clientHeight;
        }
      }
      return totalHeight;
    },
    getOrganizations(uuid: string): string {
      const organization = this.organizations.find(
        (item: ApiResponse.GroupOrganization) => item.uuid === uuid
      );
      return organization != null ? organization.name : '';
    },
    getPositions(uuid: string): string {
      const position = this.positions.find(
        (item: ApiResponse.Position) => item.uuid === uuid
      );
      return position != null ? position.name : '';
    },
    getEmploymentStatuses(uuid: string): string {
      const statuses = this.employmentStatuses.find(
        (item: ApiResponse.EmploymentStatus) => item.uuid === uuid
      );
      return statuses != null ? statuses.display_name : '';
    },
    getAccessPermissions(name: string): string {
      const permissions = this.accessPermissions.find(
        (item: Types.AccessPermissions) => item.key === name
      );
      return permissions != null ? permissions.name : '';
    },
    setHeight(value: number): void {
      this.height = value;
    },
    deleteUser() {
      this.$emit('deleteUser', this.deleteMember);
      this.toggleAlertDeleteUserModal();
    },
    deleteUsers() {
      const users = this.addedMembers.filter((item: ApiResponse.TempUser) =>
        this.check.includes(item.uuid)
      );
      this.$emit('deleteUsers', users);
      this.check = [];
      this.closeRegisteredMemberDeleteModal();
    },
    onDelete(user: ApiResponse.TempUser) {
      this.deleteMember = user;
      this.toggleAlertDeleteUserModal();
    },
    toggleAlertDeleteUserModal() {
      this.alertDeleteUserModal = !this.alertDeleteUserModal;
    },
    toggleBox() {
      this.box = !this.box;
    },
    openRegisteredMemberDeleteModal() {
      this.registeredMemberDeleteModal = true;
    },
    closeRegisteredMemberDeleteModal() {
      this.registeredMemberDeleteModal = false;
    },
    getOrganizationNames(subOrganizations: any): string {
      if (!subOrganizations.length) {
        return 'なし';
      }
      const uuidList = subOrganizations.map((item: any) => {
        if (typeof item === 'object' && item !== null) {
          return item.uuid;
        }
        return item;
      });
      return this.organizations
        .filter((organization: any) => uuidList.includes(organization.uuid))
        .map((organization: any) => organization.name)
        .join(' ');
    },
  },
});
</script>

<style lang="scss" scoped>
$color_department: $blue;
$color_branch: $light_blue_green_1;
$color_shop: $purple_1;
$color_management: $wild_blue_yonder;
$color_other: $hopbush;
$color_independent: $gray_blue_1;

.registerd-box {
  position: relative;
  background-color: $white_5;
}

.sub-title {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: bold;
  color: $dark_blue;
  margin: 0 0 10px 0;

  &-text {
    margin: 0 10px 0 0;
  }

  &-member {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    color: $true-white;
    font-size: 13px;
    font-weight: 600;
    background-color: $gray_1;
    margin: 0 10px 0 0;
    border-radius: 4px;
  }
}

.table-wrapper {
  height: 100%;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: #7e8195 white;
}

.table-wrapper::-webkit-scrollbar {
  width: 4px;
  height: 0;
}

.table-wrapper::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #7e8195;
}

.table {
  width: 100%;
  text-align: center;
  vertical-align: inherit;
  padding: 5px;

  th {
    text-align: center;
    vertical-align: inherit;
    padding: 5px;
    position: sticky;
    top: -1px;
    z-index: 10;
  }

  &__title {
    color: #6a6d83;
    font-size: 13px;
    height: 40px;
    background: $white_6;
  }

  td {
    vertical-align: inherit;
    padding: 5px;
  }

  &__empty {
    border-top: 1px solid $white_5;
    background-color: $white_5;
  }

  &__border {
    border: 1px solid $light_gray_blue_3;
  }

  &__detail {
    color: $dark_blue;
    height: 40px;

    &-check {
      text-align: center;
      width: 30px;
    }

    &-no {
      text-align: center;
      width: 22px;
    }

    &-name {
      width: 100px;
    }

    &-kana {
      width: 100px;
    }

    &-company {
      width: 130px;
    }

    &-organization {
      width: 130px;
    }

    &-sub-organization {
      width: 250px;
    }

    &-position {
      width: 80px;
    }

    &-status {
      width: 80px;
    }

    &-authority {
      width: 80px;
    }

    &-update {
      width: 105px;
    }

    &-close {
      width: 16px;
      cursor: pointer;
      padding: 0 0 0 8px;
    }
  }

  &__added {
    background: $white_7;
  }
}

.sub-organization-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .sub-organization-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 160px;
  }

  .right-content {
    display: flex;
    align-items: center;
    width: fit-content;
    border-left: 1px solid $light_gray_blue_3;
    margin: 0 0 0 5px;
  }

  .disabled-delete-button {
    margin: 0 0 0 5px;
    height: 30px;
    width: 60px;

    &:disabled {
      cursor: default;

      &:hover {
        background-color: $white_2;
        color: $gray;
      }
    }
  }
}

.red {
  color: $red;
}

.title-wrapper {
  display: flex;
  justify-content: space-between;
}

.toggle-icon {
  width: 24px;
  height: 24px;
  background-color: $true_white;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  background-position: center;
  transform: scale(-1, 1);
  background-repeat: no-repeat;
  display: inline-block;
  cursor: pointer;

  &--open {
    background-image: url('/icon/icon_switching.svg');
  }

  &--close {
    background-image: url('/icon/icon_switching-down.svg');
  }
}

.link-name {
  color: $dark_blue;
  border-bottom: 1px solid $dark_blue;

  &:visited {
    color: $dark_blue;
  }

  &:hover {
    color: $dark_blue;
  }
}

.alert-message /deep/ .cancel-button {
  &:hover {
    background-color: $button_background_color;
  }
}

.registered-member-delete {
  z-index: 99;
}
</style>
