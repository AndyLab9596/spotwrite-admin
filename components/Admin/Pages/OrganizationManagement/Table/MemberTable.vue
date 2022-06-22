<template>
  <div>
    <table id="table-wrapper" class="table">
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
        <th></th>
      </tr>
      <tr
        v-for="(member, index) in filterOrganizationUser(uuid)"
        :key="member.uuid"
        class="table__detail"
        :show="indexReCalculate(member.uuid)"
      >
        <td class="table__border table__detail-check">
          <base-checkbox
            v-model="check"
            class="checkbox"
            :value="member.uuid"
            :disabled="!checkAllInput(member)"
          />
        </td>
        <td class="table__border table__detail-no">
          {{ index + 1 }}
        </td>
        <td
          class="table__border table__detail-name"
          :class="!member.name ? 'table__detail--empty' : ''"
        >
          <input
            v-model="member.name"
            class="input__text"
            type="text"
            placeholder="例)山田太郎"
            @blur="updateTempUser(member)"
          />
        </td>
        <td
          class="table__border table__detail-kana"
          :class="!member.name_kana ? 'table__detail--empty' : ''"
        >
          <validation-provider
            v-slot="{ errors }"
            rules="isHiragana"
            class="input-box"
          >
            <input
              v-model="member.name_kana"
              class="input__text"
              type="text"
              placeholder="例)やまだたろう"
              @blur="updateTempUser(member)"
            />
            <div v-if="errors[0]" class="name-kana-error-wrapper">
              <div class="name-kana-error">
                ひらがなで入力してください。
              </div>
            </div>
          </validation-provider>
        </td>
        <td
          class="table__border table__detail-company"
          :class="!member.company ? 'table__detail--empty' : ''"
        >
          <select
            v-model="member.company"
            class="select"
            name="company"
            :class="!member.company ? 'select__default' : ''"
            @change="updateTempUser(member)"
          >
            <option
              v-for="value in companies"
              :key="value.uuid"
              :value="value.uuid"
            >
              {{ value.name }}
            </option>
          </select>
        </td>
        <td
          class="table__border table__detail-organization"
          :class="!member.organization ? 'table__detail--empty' : ''"
        >
          <select
            v-model="member.organization"
            class="select"
            name="organization"
            :class="!member.organization ? 'select__default' : ''"
            @change="updateTempUser(member)"
          >
            <option
              v-for="value in organizations(member.company)"
              :key="value.uuid"
              :value="value.uuid"
            >
              {{ value.name }}
            </option>
          </select>
        </td>
        <td
          class="table__border table__detail-sub-organization"
          :class="!member.sub_organizations ? 'table__detail--empty' : ''"
        >
          <div class="sub-organization-wrapper">
            <p class="sub-organization-name">
              <LineClampPopper
                :text="getOrganizationNames(member.sub_organizations)"
                :line-clamp="1"
              />
            </p>
            <div class="right-content">
              <div class="line"></div>
              <base-button
                class="disabled-delete-button"
                greyed
                @click="changeSubOrganizationsUser(member)"
              >
                設定
              </base-button>
            </div>
          </div>
        </td>
        <td
          class="table__border table__detail-position"
          :class="!member.employment_position ? 'table__detail--empty' : ''"
        >
          <custom-select
            v-model="member.employment_position"
            :items="positions"
            position
            @open-position-register-modal="positionRegisterModal = true"
            @change="updateTempUser(member)"
          />
        </td>
        <td
          class="table__border table__detail-status"
          :class="!member.employment_status ? 'table__detail--empty' : ''"
        >
          <custom-select
            v-model="member.employment_status"
            :items="employmentStatuses"
            employment-statuses
            @open-employment-statuses-register-modal="
              employmentStatusRegisterModal = true
            "
            @change="updateTempUser(member)"
          />
        </td>
        <td
          class="table__border table__detail-authority"
          :class="!member.access_permission ? 'table__detail--empty' : ''"
        >
          <select
            v-model="member.access_permission"
            class="select"
            name="authority"
            :class="!member.access_permission ? 'select__default' : ''"
            @change="updateTempUser(member)"
          >
            <option selected value="">選択してください</option>
            <option
              v-for="accessPermission in accessPermissions"
              :key="accessPermission.key"
              :value="accessPermission.key"
            >
              {{ accessPermission.name }}
            </option>
          </select>
        </td>
        <td class="table__detail-update">
          <span>
            <button :class="checkInsert(member)" @click="insertMember(member)">
              登録
            </button>
          </span>
          <span>
            <img
              v-show="!checkLastRecords(member)"
              src="/icon/icon_close_b.svg"
              @click="!checkLastRecords(member) && removeTempUser(member)"
            />
          </span>
        </td>
      </tr>
    </table>

    <position-register-modal
      v-if="positionRegisterModal"
      :positions="positions"
      @close="positionRegisterModal = false"
      @register-position="registerPosition($event)"
      @delete="deletePotision"
    ></position-register-modal>
    <employment-status-register-modal
      v-if="employmentStatusRegisterModal"
      :employment-statuses="employmentStatuses"
      @close="employmentStatusRegisterModal = false"
      @register-employment-status="registerEmploymentStatus($event)"
      @delete="deleteEmploymentStatus"
    ></employment-status-register-modal>
    <add-sub-organization-modal
      v-if="addSubOrganizationModal"
      :organizations="allOrganizations"
      :selected-member="selectedMember"
      @close="toggleAddSubOrganizationModal"
      @add="addSubOrganization"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ValidationProvider } from 'vee-validate';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import AddSubOrganizationModal from '@/components/Admin/Pages/EmployeeManagement/AddSubOrganizationModal.vue';
import CustomSelect from '@/components/Admin/Pages/OrganizationManagement/Select/CustomSelect.vue';
import { PositionRegisterModal } from '@/components/Admin/Pages/';
import EmploymentStatusRegisterModal from '@/components/Admin/Pages/Employees/EmploymentStatusRegisterModal.vue';
import { LineClampPopper } from '@/components/Admin/Modules/Popper';

interface Request {
  uuid?: string;
  no?: number;
  name?: string;
  name_kana?: string;
  company?: string;
  organization?: string;
  sub_organizations?: string[] | { name: string; uuid: string }[];
  employment_position?: string;
  employment_status?: string;
  access_permission?: string;
  email?: string;
}

export default Vue.extend({
  layout: 'admin/default',
  components: {
    BaseCheckbox,
    ValidationProvider,
    BaseButton,
    AddSubOrganizationModal,
    CustomSelect,
    PositionRegisterModal,
    EmploymentStatusRegisterModal,
    LineClampPopper,
  },
  props: {
    uuid: {
      type: String,
      required: true,
    },
    tempUsers: {
      type: Array as PropType<ApiResponse.TempUser[]>,
      required: true,
    },
    selectedOrganizations: {
      type: Array as PropType<ApiResponse.GroupOrganization[]>,
      required: true,
    },
    allOrganizations: {
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
    tempCounterData: {
      type: Array as PropType<string[]>,
      required: true,
    },
    tempCounter: {
      type: Number,
      required: true,
    },
    checked: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  data() {
    return {
      allChecked: false as boolean,
      check: [] as string[],
      addSubOrganizationModal: false as boolean,
      selectedMember: {} as ApiResponse.TempUser,
      positionRegisterModal: false as boolean,
      employmentStatusRegisterModal: false as boolean,
    };
  },
  computed: {
    companies(): ApiResponse.GroupOrganization[] {
      if (this.selectedOrganizations.length > 0) {
        return [
          // 重複を省くためMap型に変換している
          ...new Map(
            this.selectedOrganizations
              .filter((item: ApiResponse.GroupOrganization) => item.layer === 0)
              .map((item: ApiResponse.GroupOrganization) => [item.uuid, item])
          ).values(),
        ];
      }
      return this.allOrganizations.filter(
        (organization: ApiResponse.GroupOrganization) =>
          organization.layer === 0 &&
          this.organizations(organization.uuid).length > 0
      );
    },
    isEmptyOrganizationUsers(): boolean {
      return (
        this.tempUsers.filter(
          (item: ApiResponse.TempUser) => item.organization === this.uuid
        ).length === 0
      );
    },
  },
  watch: {
    checked() {
      this.check = this.checked;
    },
    check() {
      this.$emit('checked', this.check);
    },
    isEmptyOrganizationUsers(): void {
      if (this.isEmptyOrganizationUsers) {
        const organization = this.allOrganizations.filter(
          (item: ApiResponse.GroupOrganization) => item.uuid === this.uuid
        );
        this.$emit('emptyOrganizationUser', {
          organization: organization[0].uuid,
          company: organization[0].relations.company,
        });
      }
    },
  },
  methods: {
    filterOrganizationUser(uuid: string): ApiResponse.TempUser[] {
      return this.tempUsers.filter(
        (item: ApiResponse.TempUser) => item.organization === uuid
      );
    },
    attributeColor(type: string): { [key: string]: boolean } {
      switch (type) {
        case 'department':
          return { department: true };
        case 'branch':
          return { branch: true };
        case 'shop':
          return { shop: true };
        case 'management':
          return { management: true };
        default:
          return { null: true };
      }
    },
    allCheck() {
      this.allChecked = !this.allChecked;

      if (this.allChecked) {
        this.check = this.tempUsers
          .filter((user: ApiResponse.TempUser) => {
            return this.checkAllInput(user);
          })
          .map((user: ApiResponse.TempUser) => {
            return user.uuid;
          });
        this.$emit('checked', this.check);
        return;
      }
      this.check = [];
      this.$emit('checked', this.check);
    },
    removeTempUser(tempUser: ApiResponse.TempUser) {
      this.$emit('removeTempUser', tempUser);
    },
    insertMember(member: ApiResponse.TempUser) {
      this.$emit('insertMember', member);
    },
    checkAllInput(user: ApiResponse.TempUser) {
      return (
        user.name &&
        user.name_kana &&
        user.company &&
        user.organization &&
        user.employment_position &&
        user.employment_status &&
        user.access_permission
      );
    },
    checkInsert(user: ApiResponse.TempUser) {
      if (this.checkAllInput(user)) {
        return 'button__insert';
      }
      return 'button__insert--disabled';
    },
    organizations(company: string): ApiResponse.GroupOrganization[] {
      return this.allOrganizations.filter(
        (organization: ApiResponse.GroupOrganization) =>
          organization.layer !== 0 &&
          organization.relations.company === company &&
          organization.name &&
          organization.type
      );
    },
    updateTempUser(user: Request) {
      this.$emit('updateTempUser', user);
    },
    registeredTempUsers(email: string): boolean {
      const user = this.tempUsers.filter(
        (item: ApiResponse.TempUser) => item.email === email
      );

      return user.length > 1;
    },
    checkLastRecords(user: ApiResponse.TempUser) {
      return this.filterOrganizationUser(user.organization).length === 1;
    },
    indexReCalculate(uuid: string) {
      this.$emit('indexReCalculate', uuid);
    },
    getOrganizationNames(items: { name: string; uuid: string }[]): string {
      if (items.length === 0) {
        return 'なし';
      }

      return this.allOrganizations
        .filter((item: ApiResponse.GroupOrganization) =>
          items
            .map((value: { name: string; uuid: string }) => value.uuid)
            .includes(item.uuid)
        )
        .map((item: ApiResponse.GroupOrganization) => item.name)
        .join(' ');
    },
    changeSubOrganizationsUser(member: ApiResponse.TempUser) {
      this.selectedMember = member;
      this.toggleAddSubOrganizationModal();
    },
    toggleAddSubOrganizationModal() {
      this.addSubOrganizationModal = !this.addSubOrganizationModal;
    },
    addSubOrganization(member: ApiRequest.TempRegistrationUsers) {
      this.updateTempUser({
        uuid: this.selectedMember.uuid,
        no: this.selectedMember.no,
        name: this.selectedMember.name,
        name_kana: this.selectedMember.name_kana,
        company: this.selectedMember.company,
        organization: this.selectedMember.organization,
        sub_organizations: member.sub_organizations,
        employment_position: this.selectedMember.employment_position,
        employment_status: this.selectedMember.employment_status,
        access_permission: this.selectedMember.access_permission,
        email: this.selectedMember.email,
      });
    },
    registerPosition(item: { name: string }) {
      this.$emit('addPosition', item);
    },
    deletePotision(uuid: string) {
      this.$emit('deletePosition', uuid);
    },
    registerEmploymentStatus(item: { name: string }) {
      this.$emit('addEmploymentStatus', item);
    },
    deleteEmploymentStatus(uuid: string) {
      this.$emit('deleteEmploymentStatus', uuid);
    },
  },
});
</script>

<style lang="scss" scoped>
$color_department: $blue;
$color_branch: $light_blue_green_1;
$color_shop: $purple_1;
$color_management: $blue_4;
$color_null: $gray_blue_1;

.table {
  width: 1010px;

  th {
    text-align: center;
    vertical-align: inherit;
    padding: 5px;
  }

  &__title {
    color: #6a6d83;
    font-size: 13px;
    height: 40px;
    background: #f7f8fd;
  }

  td {
    vertical-align: inherit;
    padding: 5px;
  }

  &__border {
    border: 1px solid #e4e5ed;
  }

  &__detail {
    color: $dark_blue;
    height: 40px;

    &--empty {
      background-color: #faf0f0;
    }

    &-check {
      text-align: center;
    }

    &-no {
      text-align: center;
      width: 40px;
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
  }

  &__added {
    background: #f5f5f5;
  }
}

.select {
  height: 100%;
  padding-right: 25px;
  min-height: 30px;
  width: 100%;
  font-size: 13px;
  border: none;
  appearance: none;
  background-image: url('/icon/icon_pulldown.svg');
  background-repeat: no-repeat;
  background-size: 10px 8px;
  background-position: right 4px center;
  background-color: transparent;

  &__default {
    color: #6a6d83;
  }
}

.button {
  &__announce {
    color: $dark_blue;
    border-radius: 4px;
    background-color: $light_gray_blue_7;
    border: none;
    font-size: 15px;
    font-weight: bold;
    padding: 8px 24px;

    &__count {
      color: #f09c9c;
      margin-left: 5px;
    }

    &:hover {
      background-color: $light_gray_blue_8;
    }
  }

  &__close {
    margin-bottom: 6px;

    &--disabled {
      cursor: not-allowed;
    }
  }

  &__insert {
    font-weight: bold;
    color: $true_white;
    font-size: 13px;
    background-color: $gray_blue_3;
    border-radius: 4px;
    border: none;
    padding: 4px 12px;
    margin-right: 5px;

    &:hover {
      background-color: $gray_blue_4;
    }

    &--disabled {
      font-weight: bold;
      color: #bebebe;
      background: #f3f3f3;
      border-radius: 4px;
      border: none;
      padding: 4px 12px;
      margin-right: 5px;
    }
  }
}

.input {
  &__text {
    border: none;
    background-color: transparent;
    width: 100%;
  }
}

.check-delete {
  margin: 28px 0;
}

.input-box {
  display: block;
  position: relative;
}

.email-error-wrapper {
  position: absolute;
  top: 29px;
  left: -6px;
}

.email-error {
  position: relative;
  color: $true-white;
  font-size: 12px;
  font-weight: 600;
  background-color: $gray_blue_5;
  border-radius: 4px;
  padding: 5px 10px;
  white-space: nowrap;

  &::before {
    content: '';
    position: absolute;
    top: -25px;
    left: 29px;
    border-style: solid;
    border-color: transparent transparent $gray_blue_5;
    border-width: 13px;
  }
}

.email-required {
  color: red;
}

.name-kana-error-wrapper {
  position: absolute;
  top: 29px;
  left: -6px;
}

.name-kana-error {
  position: relative;
  color: $true-white;
  font-size: 12px;
  font-weight: 600;
  background-color: $gray_blue_5;
  border-radius: 4px;
  padding: 5px 10px;
  white-space: nowrap;

  &::before {
    content: '';
    position: absolute;
    top: -25px;
    left: 29px;
    border-style: solid;
    border-color: transparent transparent $gray_blue_5;
    border-width: 13px;
  }
}

.sub-organization-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .sub-organization-name {
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
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

    &:hover {
      background-color: $light_gray_blue_8;
    }

    &:disabled {
      cursor: default;

      &:hover {
        background-color: $white_2;
        color: $gray;
      }
    }
  }
}
</style>
