<template>
  <div>
    <div class="l-page-container">
      <div class="l-page">
        <page-header title="メンバー登録（必須項目）">
          <template #tutorial>
            <TutorialButtonIcon
              :url="`/admin/tutorial/member-registration-required.html`"
            />
          </template>
          <template #description>
            CSVから登録する場合はこちらから
            <nuxt-link
              class="link"
              tag="a"
              to="/admin/employee-management/employees/bulk-registration"
            >
              CSV一括登録
            </nuxt-link>
            。
          </template>
        </page-header>
        <button class="button__announce" @click="goToAdditionalPage">
          追加項目を入力する
          <span class="button__announce__count">
            未登録{{ notRegisteredAdditionalUsers.length }}名</span
          >
        </button>

        <div v-if="!isLoading" class="contents">
          <searchable-tab
            :first-tab-name="'必須項目'"
            :tab-name="tabName"
            :selected-organization-name="selectedOrganizationName"
            :attention="'※管理者のみ入力できる項目です。'"
            :is-type="'register'"
            @click="toggleExtractionModal"
          />

          <div v-show="allOrganizations.length === 0">
            <p class="register-organization">
              メンバーを登録するためには組織（BOX）の登録が必要です。
            </p>
            <p class="register-organization">
              <nuxt-link
                class="link"
                to="/admin/organization-management/organizations/registration"
              >
                組織登録画面
              </nuxt-link>
              から会社・組織（BOX）を登録してください。
            </p>
          </div>

          <div v-show="allOrganizations.length > 0">
            <div v-for="company in companies" :key="company.uuid">
              <div
                v-for="parent in getParent(company.uuid)"
                :key="parent.uuid"
                class="parent-wrapper"
              >
                <div
                  class="parent-contents"
                  :class="attributeColor(parent.type)"
                >
                  <div
                    class="parent-box"
                    :class="{
                      'has-child': getChild(company.uuid, parent.uuid).length,
                    }"
                  >
                    <company-header
                      :company-name="company.name"
                      :type="parent.type"
                      :display-name="parent.name"
                      :parent-name="checkParentName(parent)"
                      :border="!!getChild(company.uuid, parent.uuid).length"
                      class="company-header"
                    />
                    <member-table
                      :uuid="parent.uuid"
                      :temp-users="tempUsers"
                      :selected-organizations="selectedOrganizations"
                      :all-organizations="allOrganizations"
                      :positions="positions"
                      :employment-statuses="employmentStatuses"
                      :access-permissions="accessPermissions"
                      :temp-counter-data="tempCounterData"
                      :temp-counter="tempCounter"
                      :checked="checked"
                      :selected-sub-organizations="selectedSubOrganizations"
                      @updateTempUser="updateTempUser"
                      @insertMember="selectMember"
                      @removeTempUser="removeTempUser"
                      @indexReCalculate="indexReCalculate"
                      @checked="changeChecked"
                      @addPosition="addPosition"
                      @deletePosition="deletePosition"
                      @addEmploymentStatus="addEmploymentStatus"
                      @deleteEmploymentStatus="deleteEmploymentStatus"
                      @emptyOrganizationUser="emptyOrganizationUser"
                    />
                    <div class="add-line">
                      <button
                        class="button__add-line"
                        @click="addMember(company.uuid, parent.uuid)"
                      >
                        <img
                          class="button__add-line-image"
                          src="/icon/icon_add_pink.svg"
                        />
                        登録枠を追加
                      </button>
                    </div>
                    <registered-table
                      :added-members="users[parent.uuid]"
                      :company-uuid="company.uuid"
                      :organizations="allOrganizations"
                      :positions="positions"
                      :employment-statuses="employmentStatuses"
                      :access-permissions="accessPermissions"
                      :added-member-count="users[parent.uuid].length"
                      :type="parent.type"
                      :last="
                        isParentsLast(
                          getChild(company.uuid, parent.uuid).length
                        )
                      "
                      @deleteUser="deleteUser"
                      @deleteUsers="deleteUsers"
                    />
                  </div>

                  <div
                    v-for="(child, index) in getChild(
                      company.uuid,
                      parent.uuid
                    )"
                    :key="child.uuid"
                    class="child-box"
                    :class="{
                      'last-child': isChildrensLast(
                        index,
                        getChild(company.uuid, parent.uuid).length
                      ),
                    }"
                  >
                    <company-header
                      :company-name="company.name"
                      :type="parent.type"
                      :display-name="child.name"
                      :parent-name="findParentName(child.relations.parent)"
                      class="company-header"
                    />
                    <member-table
                      :uuid="child.uuid"
                      :temp-users="tempUsers"
                      :selected-organizations="selectedOrganizations"
                      :all-organizations="allOrganizations"
                      :positions="positions"
                      :employment-statuses="employmentStatuses"
                      :access-permissions="accessPermissions"
                      :temp-counter-data="tempCounterData"
                      :temp-counter="tempCounter"
                      :checked="checked"
                      :selected-sub-organizations="selectedSubOrganizations"
                      @updateTempUser="updateTempUser"
                      @insertMember="selectMember"
                      @removeTempUser="removeTempUser"
                      @indexReCalculate="indexReCalculate"
                      @checked="changeChecked"
                      @addPosition="addPosition"
                      @deletePosition="deletePosition"
                      @addEmploymentStatus="addEmploymentStatus"
                      @deleteEmploymentStatus="deleteEmploymentStatus"
                    />

                    <div class="add-line">
                      <button
                        class="button__add-line"
                        @click="addMember(company.uuid, child.uuid)"
                      >
                        <img
                          class="button__add-line-image"
                          src="/icon/icon_add_pink.svg"
                        />
                        登録枠を追加
                      </button>
                    </div>
                    <registered-table
                      :added-members="users[child.uuid]"
                      :company-uuid="company.uuid"
                      :organizations="allOrganizations"
                      :positions="positions"
                      :employment-statuses="employmentStatuses"
                      :access-permissions="accessPermissions"
                      :added-member-count="users[child.uuid].length"
                      @deleteUser="deleteUser"
                      @deleteUsers="deleteUsers"
                    />
                  </div>
                </div>
              </div>
              <div v-if="!showBorder(company.uuid)" class="border"></div>
            </div>

            <div class="add-all">
              <p class="add-all__text">チェックを入れたメンバーを</p>
              <button
                class="button__add-all"
                :disabled="isSend"
                @click="toggleAlertAddMembersModal"
              >
                まとめて登録
              </button>
            </div>
          </div>
        </div>
        <vue-loading
          v-if="isLoading"
          type="spin"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
      </div>
      <extraction-modal
        v-if="extractionModal"
        :organizations="allOrganizations"
        :selected-organizations="selectedOrganizations"
        @close="toggleExtractionModal"
        @extract="extract"
      />
      <alert-message
        v-if="alertOrganizationEmptyModal"
        button-text="閉じる"
        class="alert-message"
        @close="toggleAlertOrganizationEmptyModal"
      >
        <div class="alert-message__text">
          会社・組織（BOX）が登録されていません。<br />
          メニューの「組織（BOX）登録」から最初に登録して下さい
        </div>
      </alert-message>
      <alert-message
        v-if="alertPositionEmptyModal"
        button-text="閉じる"
        class="alert-message"
        @close="toggleAlertPositionEmptyModal"
      >
        <div class="alert-message__text">
          役職が登録されていません。<br />
          「マスタ設定」から先に役職を登録して下さい。
        </div>
      </alert-message>
      <alert-message
        v-if="alertExistsUserEmail"
        button-text="はい"
        class="alert-message"
        @close="toggleAlertExistsUserEmail"
      >
        <div class="alert-message__text">
          {{ alertExistsUserEmailData }}
          は既に同じメールアドレスが登録されているため、登録できません。
        </div>
      </alert-message>
      <insert-complete-modal
        v-if="insertCompleteModal"
        @close="toggleInsertCompleteModal"
        @clickOk="toggleInsertCompleteModal"
      />
      <check-delete
        v-if="alertAddMembersModal"
        delete-button-text="はい"
        class="alert-message-add"
        @close="toggleAlertAddMembersModal"
        @click="addUsers"
      >
        <div class="alert-message__text">
          選択したメンバーを登録しても良いですか？
        </div>
      </check-delete>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import ExtractionModal from '@/components/Admin/Pages/EmployeeManagement/ExtractionModal.vue';
import InsertCompleteModal from '@/components/Admin/Pages/EmployeeManagement/InsertCompleteModal.vue';
import { AlertMessage, CheckDelete } from '@/components/Admin/Modules/Modal';
import {
  fetchTempRegistrationUsers,
  fetchOrganizations,
  fetchOrganizationsPositions,
  fetchOrganizationsEmploymentStatuses,
  createTempRegistrationUsers,
  deleteTempRegistrationUser,
  fetchOrganizationUsers,
  updateTempRegistrationUser,
  moveTempRegistrationUsersToUsers,
  fetchUsers,
  deleteUser,
  createPositions,
  deletePositions,
  createOrganizationsEmploymentStatuses,
  deleteOrganizationsEmploymentStatuses,
} from '@/libs/api';
import { enumAccessPermissions } from '@/libs/definition';
import registeredTable from '@/components/Admin/Pages/OrganizationManagement/Table/RegisterdTable.vue';
import CompanyHeader from '@/components/Admin/Pages/OrganizationManagement/Company/CompanyHeader.vue';
import SearchableTab from '@/components/Admin/Pages/OrganizationManagement/Tab/SearchableTab.vue';
import MemberTable from '@/components/Admin/Pages/OrganizationManagement/Table/MemberTable.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';
import { cloneDeep } from 'lodash';
import { VueLoading } from 'vue-loading-template';

interface Request {
  uuid: string;
  no: number;
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

type RegisteredUser = {
  uuid: string;
  no: number;
  name: string;
  name_kana: string;
  organization: string;
  employment_position: string;
  employment_status: string;
  access_permission: string;
  email: string;
};

type movedUser = {
  old_uuid: string;
  new_uuid: string;
};

export default Vue.extend({
  layout: 'admin/default',
  components: {
    PageHeader,
    ExtractionModal,
    InsertCompleteModal,
    AlertMessage,
    registeredTable,
    CompanyHeader,
    SearchableTab,
    MemberTable,
    VueLoading,
    CheckDelete,
    TutorialButtonIcon,
  },
  data() {
    return {
      alertPositionEmptyModal: false as boolean,
      alertOrganizationEmptyModal: false as boolean,
      alertExistsUserEmail: false as boolean,
      alertExistsUserEmailData: '' as string,
      deleteModal: false as boolean,
      extractionModal: false as boolean,
      insertCompleteModal: false as boolean,
      allOrganizations: [] as ApiResponse.GroupOrganization[],
      positions: [] as ApiResponse.Position[],
      employmentStatuses: [] as ApiResponse.EmploymentStatus[],
      allChecked: false,
      checked: [] as string[],
      tempUsers: [] as ApiResponse.TempUser[],
      accessPermissions: enumAccessPermissions,
      selectedOrganizations: [] as ApiResponse.GroupOrganization[],
      tempUsersCompany: [] as ApiResponse.GroupOrganization[],
      tabName: {
        organization: '組織(BOX)で絞り込む',
        company: '',
      } as Types.TabName,
      selectedOrganizationName: [] as string[],
      notRegisteredAdditionalUsers: [] as ApiResponse.User[],
      requestOrganizationUuid: this.$route.query.organization as string,
      tempCounter: 0 as number,
      tempCounterData: [] as string[],
      isLoading: false as boolean,
      users: {} as { [key: string]: RegisteredUser[] },
      alertAddMembersModal: false as boolean,
      selectedSubOrganizations: [] as string[],
      selectInsertMember: {} as ApiResponse.TempUser,
      isRegistred: false as boolean,
      selectedOrganizationUuid: [] as string[],
      checkLoading: true as boolean,
    };
  },
  computed: {
    filteredMembers(): ApiResponse.TempUser[] {
      return this.tempUsers;
    },
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
    isSend(): boolean {
      const user = this.tempUsers.filter((member: ApiResponse.TempUser) =>
        this.checked.includes(member.uuid)
      );
      return user.length === 0 || this.allOrganizations.length === 0;
    },
  },
  watch: {
    tempUsers: {
      handler(val: ApiResponse.TempUser[]) {
        if (!val) {
          return;
        }
        this.checked = val
          .filter((user: ApiResponse.TempUser) =>
            this.checked.includes(user.uuid)
          )
          .filter((user: ApiResponse.TempUser) => this.checkAllInput(user))
          .map((user: ApiResponse.TempUser) => user.uuid);
      },
      deep: true,
    },
  },
  async mounted() {
    window.addEventListener('scroll', this.onScroll);
  },
  async created() {
    this.isLoading = true;
    try {
      const allPromise = Promise.all([
        this.fetchTempRegistrationUsers(),
        this.fetchOrganizations(),
        this.fetchOrganizationsPositions(),
        this.fetchOrganizationsEmploymentStatuses(),
        this.fetchUsers(),
      ]);

      const [
        tempUsers,
        organizations,
        organizationsPositions,
        employmentStatuses,
        usersData,
      ] = await allPromise;

      this.tempUsers = tempUsers;
      this.allOrganizations = organizations;
      this.positions = organizationsPositions;
      this.employmentStatuses = employmentStatuses;
      this.notRegisteredAdditionalUsers = usersData;

      const users = {} as { [key: string]: RegisteredUser[] };
      const filterOrganizations = this.allOrganizations.filter(
        (item: ApiResponse.GroupOrganization) => {
          return item.type !== 'company';
        }
      );
      filterOrganizations.map((item: ApiResponse.GroupOrganization) => {
        users[item.uuid] = [];
        if (item.user_count > 0) {
          this.selectedOrganizationUuid.push(item.uuid);
        }
        return this.selectedOrganizationUuid;
      });

      await Promise.all(
        this.selectedOrganizationUuid.slice(0, 5).map(async (item: string) => {
          users[item] = await this.getRegisteredOrganizationUsers(item);
          this.selectedOrganizationUuid.splice(
            this.selectedOrganizationUuid.indexOf(item),
            1
          );
        })
      );
      this.users = cloneDeep(users);
      this.createEmptyUser();
      if (this.requestOrganizationUuid) {
        this.extract([this.requestOrganizationUuid]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    async onScroll() {
      if (
        this.selectedOrganizationUuid.length > 0 &&
        this.checkLoading === true
      ) {
        this.checkLoading = false;
        await Promise.all(
          this.selectedOrganizationUuid.map(async (item: string) => {
            this.users[item] = await this.getRegisteredOrganizationUsers(item);
            this.selectedOrganizationUuid.splice(
              this.selectedOrganizationUuid.indexOf(item),
              1
            );
          })
        );
      }
    },
    checkParentName(item: ApiResponse.GroupOrganization): string {
      if (item.layer === 2 && item.relations.parent) {
        return this.findParentName(item.relations.parent);
      }
      return '';
    },
    findParentName(uuid: string): string {
      const parent = this.allOrganizations.find(
        (item: ApiResponse.GroupOrganization) => item.uuid === uuid
      );
      if (parent != null) return parent.name;
      return '';
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
        case 'other':
          return { other: true };
        default:
          return { independent: true };
      }
    },
    changeChecked(item: string[]) {
      this.checked = item;
    },
    // 空のユーザが存在しなければ空データを追加する
    createEmptyUser() {
      const defaultUsers = this.tempUsers.filter(
        (user: ApiResponse.TempUser) => {
          return (
            !user.name &&
            !user.name_kana &&
            !user.employment_position &&
            !user.employment_status &&
            !user.email
          );
        }
      );

      const defaultUserOrganizations = defaultUsers.map(
        (item: ApiResponse.TempUser) => item.organization
      );

      const organizations = this.allOrganizations.filter(
        (item: ApiResponse.GroupOrganization) =>
          !defaultUserOrganizations.includes(item.uuid)
      );

      organizations.forEach((item: ApiResponse.GroupOrganization) => {
        if (item.relations.company) {
          this.addMember(item.relations.company, item.uuid);
        }
      });
    },
    showBorder(companyUuid: string): boolean {
      const member = this.tempUsers.find(
        (item: ApiResponse.TempUser) => item.company === companyUuid
      );
      return member == null;
    },
    filterOrganizationUser(uuid: string): ApiResponse.TempUser[] {
      return this.tempUsers.filter(
        (item: ApiResponse.TempUser) => item.organization === uuid
      );
    },
    isEnrolled(organizationUuid: string): boolean {
      return this.filterOrganizationUser(organizationUuid).length > 0;
    },
    async getRegisteredOrganizationUsers(organizationUuid: string) {
      const data = await this.fetchOrganizationUsers(organizationUuid);
      return data.users
        .map((item: ApiResponse.UsersInformation) => {
          return {
            uuid: item.user_uuid,
            no: item.number,
            name: item.user_name,
            name_kana: item.user_kana,
            organization: item.organization_uuid,
            sub_organizations: item.sub_organizations,
            employment_position: item.employment_position_uuid,
            employment_status: item.employment_status_uuid,
            access_permission: item.access_permission,
            email: item.email,
          };
        })
        .filter(
          (u: ApiResponse.UsersInformation) =>
            u.organization === organizationUuid
        );
    },
    getParent(uuid: string): ApiResponse.GroupOrganization[] {
      if (this.selectedOrganizations.length > 0) {
        const parentOrganizationSelected = this.selectedOrganizations.filter(
          (parent: ApiResponse.GroupOrganization) =>
            this.selectedOrganizations.filter(
              (child: ApiResponse.GroupOrganization) =>
                child.layer === 2 &&
                child.relations.parent === parent.uuid &&
                parent.layer === 1
            ).length
        );
        if (parentOrganizationSelected.length > 0) {
          return this.selectedOrganizations.filter(
            (organization: ApiResponse.GroupOrganization) =>
              organization.relations.company === uuid &&
              organization.layer === 1
          );
        }
        return this.selectedOrganizations.filter(
          (organization: ApiResponse.GroupOrganization) => {
            if (
              organization.relations.company === uuid &&
              (organization.layer === 1 || organization.layer === 2)
            ) {
              return organization;
            }
            return false;
          }
        );
      }

      return this.allOrganizations.filter(
        (organization: ApiResponse.GroupOrganization) =>
          organization.relations.company === uuid &&
          organization.layer === 1 &&
          organization.name &&
          organization.type
      );
    },
    getChild(
      companyUuid: string,
      parentUuid: string
    ): ApiResponse.GroupOrganization[] {
      if (this.selectedOrganizations.length > 0) {
        return this.selectedOrganizations.filter(
          (organization: ApiResponse.GroupOrganization) =>
            organization.relations.company === companyUuid &&
            organization.relations.parent === parentUuid &&
            organization.layer === 2
        );
      }

      return this.allOrganizations.filter(
        (organization: ApiResponse.GroupOrganization) =>
          organization.relations.company === companyUuid &&
          organization.relations.parent === parentUuid &&
          organization.layer === 2 &&
          organization.name &&
          organization.type
      );
    },
    isParentsLast(childrensLength: number): boolean {
      return childrensLength === 0;
    },
    isChildrensLast(index: number, childrensLength: number): boolean {
      return index + 1 === childrensLength;
    },
    async fetchTempRegistrationUsers() {
      const { data } = await fetchTempRegistrationUsers();
      return data.temp_users;
    },
    async fetchOrganizations() {
      const { data } = await fetchOrganizations();
      return data.organizations;
    },
    async fetchOrganizationsPositions() {
      const { data } = await fetchOrganizationsPositions();
      return data;
    },
    async fetchOrganizationsEmploymentStatuses() {
      const { data } = await fetchOrganizationsEmploymentStatuses();
      return data;
    },
    async createTempRegistrationUsers() {
      const { data } = await createTempRegistrationUsers();
      return data;
    },
    async deleteTempRegistrationUser(uuid: string) {
      await deleteTempRegistrationUser(uuid);
    },
    async fetchOrganizationUsers(organizationUuid: string) {
      const { data } = await fetchOrganizationUsers(organizationUuid, {
        organization: organizationUuid,
      });
      return data;
    },
    nextItemCount(): number {
      return this.tempUsers.length + 1;
    },
    async addMember(conpanyUuid: string, organizationUuid: string) {
      const newUser = await this.createTempRegistrationUsers();

      this.tempUsers = [
        ...this.tempUsers,
        {
          no: newUser.no,
          uuid: newUser.uuid,
          name: '',
          name_kana: '',
          company: conpanyUuid,
          organization: organizationUuid,
          sub_organizations: [],
          employment_position: '',
          employment_status: '',
          access_permission: this.accessPermissions[0].key,
          email: '',
        },
      ];

      await this.updateTempUser({
        uuid: newUser.uuid,
        no: newUser.no,
        company: conpanyUuid,
        organization: organizationUuid,
      } as ApiResponse.TempUser);
    },
    removeTempUser(tempUser: ApiResponse.TempUser) {
      this.tempUsers.splice(this.tempUsers.indexOf(tempUser), 1);
      this.deleteTempRegistrationUser(tempUser.uuid);
    },
    async insertCheckedMembers() {
      const checkedMember = this.tempUsers.filter(
        (member: ApiResponse.TempUser) => this.checked.includes(member.uuid)
      );
      const movedUserData: Array<movedUser> = await this.pushAddedMembers(
        checkedMember
      );

      if (this.isRegistred) {
        const checkedMemberDatas: {
          company: string;
          organization: string;
        }[] = [];
        const checkedMemberToAdd: Array<ApiResponse.TempUser> = [];
        this.tempUsers.forEach((member: ApiResponse.TempUser) => {
          if (this.checked.includes(member.uuid)) {
            checkedMemberToAdd.push(member);
            const data = {
              company: member.company,
              organization: member.organization,
            };
            const exists = checkedMemberDatas.some(
              (field: { company: string; organization: string }) => {
                return (
                  field.company === data.company &&
                  field.organization === data.organization
                );
              }
            );
            if (!exists) {
              checkedMemberDatas.push(data);
            }
          }
        });

        this.tempUsers = this.tempUsers.filter(
          (member: ApiResponse.TempUser) => !this.checked.includes(member.uuid)
        );
        checkedMemberDatas.forEach(
          (checkedData: { company: string; organization: string }) => {
            if (
              this.filterOrganizationUser(checkedData.organization).length === 0
            ) {
              this.addMember(checkedData.company, checkedData.organization);
            }
          }
        );

        checkedMemberToAdd.forEach((member: ApiResponse.TempUser) => {
          const tempUser = cloneDeep(member);
          movedUserData.forEach((item: any) => {
            if (item.old_uuid === tempUser.uuid) {
              tempUser.uuid = item.new_uuid;
            }
          });
          this.users[member.organization] = [
            tempUser,
            ...this.users[member.organization],
          ];
        });
        // 現在の未登録ユーザ数を更新する
        this.notRegisteredAdditionalUsers = await this.fetchUsers();
        this.isRegistred = false;
      }
    },
    selectMember(member: ApiResponse.TempUser) {
      if (!this.checkAllInput(member)) {
        return;
      }
      this.selectInsertMember = member;
      this.toggleAlertAddMembersModal();
    },
    async insertMember() {
      const movedUserData: Array<movedUser> = await this.pushAddedMembers([
        this.selectInsertMember,
      ]);
      if (this.isRegistred) {
        this.tempUsers = this.tempUsers.filter(
          (member: ApiResponse.TempUser) =>
            this.selectInsertMember.uuid !== member.uuid
        );
        movedUserData.forEach((item: any) => {
          if (item.old_uuid === this.selectInsertMember.uuid) {
            this.selectInsertMember.uuid = item.new_uuid;
          }
        });
        this.users[this.selectInsertMember.organization] = [
          this.selectInsertMember,
          ...this.users[this.selectInsertMember.organization],
        ];

        // 現在の未登録ユーザ数を更新する
        this.notRegisteredAdditionalUsers = await this.fetchUsers();
        if (
          this.filterOrganizationUser(this.selectInsertMember.organization)
            .length === 0
        ) {
          this.addMember(
            this.selectInsertMember.company,
            this.selectInsertMember.organization
          );
        }
        this.selectInsertMember = {} as ApiResponse.TempUser;
        this.isRegistred = false;
      }
    },
    async pushAddedMembers(users: ApiResponse.TempUser[]) {
      const param = users.map((user: ApiResponse.TempUser) => {
        return {
          uuid: user.uuid,
        };
      });
      try {
        const { data } = await moveTempRegistrationUsersToUsers({
          temp_users: param,
        } as ApiRequest.MoveTempRegistrationUsersToUsers);
        this.isRegistred = true;
        this.toggleInsertCompleteModal();
        return data;
      } catch (e) {
        alert('メンバー登録ができませんでした。');
      }
    },
    toggleExtractionModal() {
      this.extractionModal = !this.extractionModal;
    },
    toggleAlertPositionEmptyModal() {
      this.alertPositionEmptyModal = !this.alertPositionEmptyModal;
    },
    toggleAlertExistsUserEmail() {
      this.alertExistsUserEmail = !this.alertExistsUserEmail;
    },
    toggleAlertOrganizationEmptyModal() {
      this.alertOrganizationEmptyModal = !this.alertOrganizationEmptyModal;
    },
    toggleInsertCompleteModal() {
      this.insertCompleteModal = !this.insertCompleteModal;
    },
    goToAdditionalPage() {
      this.$router.push({
        path: '/admin/employee-management/addition',
      });
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
    checkLastRecords(user: ApiResponse.TempUser) {
      return this.filterOrganizationUser(user.organization).length === 1;
    },
    extract(selectOrganizationUuid: string[]) {
      const selectedCompanies = [] as ApiResponse.GroupOrganization[];
      const selectedOrganizationies = [] as ApiResponse.GroupOrganization[];

      selectOrganizationUuid.forEach((selectItem: string) => {
        const organization = this.allOrganizations.find(
          (item: ApiResponse.GroupOrganization) => item.uuid === selectItem
        );
        if (organization != null) {
          selectedOrganizationies.push(organization);

          const company = this.allOrganizations.find(
            (item: ApiResponse.GroupOrganization) =>
              organization.relations.company === item.uuid
          );

          if (company != null) {
            selectedCompanies.push(company);
          }
        }
      });

      const mergeOrganizations = [
        ...selectedCompanies,
        ...selectedOrganizationies,
      ];
      this.selectedOrganizations = mergeOrganizations;

      if (selectedOrganizationies.length === 0) {
        this.tabName.company = '';
        this.tabName.organization = '組織(BOX)で絞り込む';
      }

      if (selectedOrganizationies.length === 1) {
        const organization = this.allOrganizations.find(
          (item: ApiResponse.GroupOrganization) =>
            item.uuid === selectOrganizationUuid[0]
        );

        if (organization != null) {
          const company = this.companies.find(
            (item: ApiResponse.GroupOrganization) =>
              item.uuid === organization.relations.company
          );

          if (company != null) {
            this.tabName.company = company.name;
            this.tabName.organization = organization.name;
            this.selectedOrganizationName = [];
          }
        }
      }

      if (selectedOrganizationies.length > 1) {
        this.tabName.company = '';
        this.tabName.organization = `${selectedOrganizationies.length}組織（BOX）選択中`;
        this.selectedOrganizationName = selectedOrganizationies.map(
          (item: ApiResponse.GroupOrganization) => item.name
        );
      }
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
    findOrganization(uuid: string): ApiResponse.GroupOrganization | undefined {
      return this.allOrganizations.find(
        (organization: ApiResponse.GroupOrganization) =>
          organization.uuid === uuid
      );
    },
    serchOrganizationName(uuid: string): string {
      const element = this.allOrganizations.find(
        (organization: ApiResponse.GroupOrganization) =>
          organization.uuid === uuid
      );
      if (element != null) {
        return element.name;
      }
      return '';
    },
    async updateTempUser(user: Request) {
      try {
        this.tempUsers = this.tempUsers.map((item: ApiResponse.TempUser) => {
          if (item.uuid === user.uuid && user.sub_organizations != null) {
            return {
              ...item,
              sub_organizations: user.sub_organizations.map(
                (value: string | { name: string; uuid: string }) => {
                  // サブ組織を選択しなかった場合はオブジェクトが渡される為そのまま返す
                  if (typeof value !== 'string') {
                    return value;
                  }
                  // サブ組織を選択した場合はuuidが渡される為、型を合わせる
                  return {
                    name: this.serchOrganizationName(value),
                    uuid: value,
                  };
                }
              ),
            };
          }
          return item;
        });

        await updateTempRegistrationUser(user.uuid, {
          name: user.name || undefined,
          name_kana: user.name_kana || undefined,
          company: user.company || undefined,
          organization: user.organization || undefined,
          sub_organizations:
            user.sub_organizations?.map(
              (item: string | { name: string; uuid: string }) => {
                if (typeof item !== 'string') {
                  return item.uuid;
                }
                return item;
              }
            ) || undefined,
          employment_position: user.employment_position || undefined,
          employment_status: user.employment_status || undefined,
          access_permission: user.access_permission || undefined,
          email: user.email || undefined,
        });
      } catch (err) {
        console.log(err);
      }
    },
    registeredTempUsers(email: string): boolean {
      const user = this.tempUsers.filter(
        (item: ApiResponse.TempUser) => item.email === email
      );

      return user.length > 1;
    },
    async fetchUsers() {
      const users = await fetchUsers({ is_registered_additional: false });
      return users.data;
    },
    indexReCalculate(uuid: string) {
      if (!Object.keys(this.tempCounterData).includes(uuid)) {
        this.tempCounter += 1;
        Vue.set(this.tempCounterData, uuid, this.tempCounter);
        return this.tempCounter;
      }
      return this.tempCounterData[uuid];
    },
    resetCounter() {
      this.tempCounter = 0;
      this.tempCounterData = [];
    },
    async deleteUser(user: ApiResponse.TempUser) {
      try {
        deleteUser(user.uuid);
        this.users[user.organization] = this.users[user.organization].filter(
          (item: RegisteredUser) => item.uuid !== user.uuid
        );
      } catch (e) {
        console.error(e);
      }
    },
    deleteUsers(users: ApiResponse.TempUser[]) {
      users.forEach((item: ApiResponse.TempUser) => this.deleteUser(item));
    },
    toggleAlertAddMembersModal() {
      this.alertAddMembersModal = !this.alertAddMembersModal;
    },
    addUsers() {
      this.toggleAlertAddMembersModal();
      if (Object.keys(this.selectInsertMember).length > 0) {
        this.insertMember();
        return;
      }
      this.insertCheckedMembers();
    },
    async addPosition(payload: { name: string }) {
      const { data } = await createPositions(payload);
      this.positions = [...this.positions, data[0]];
    },
    deletePosition(uuid: string) {
      deletePositions(uuid);
      this.positions = this.positions.filter(
        (item: ApiResponse.Position) => item.uuid !== uuid
      );
    },
    async addEmploymentStatus(payload: { name: string }) {
      const { data } = await createOrganizationsEmploymentStatuses(payload);
      this.employmentStatuses = [...this.employmentStatuses, data];
    },
    deleteEmploymentStatus(uuid: string) {
      deleteOrganizationsEmploymentStatuses(uuid);
      this.employmentStatuses = this.employmentStatuses.filter(
        (item: ApiResponse.EmploymentStatus) => item.uuid !== uuid
      );
    },
    emptyOrganizationUser(
      value: { organization: string; company: string } | null
    ) {
      if (value != null) {
        this.addMember(value.company, value.organization);
      }
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

.contents {
  position: relative;
  height: 100%;
  min-height: 1200px;
  background-color: $true_white;
  margin-top: 14px;
}

.link {
  color: #f09c9c;
}

.l-page {
  position: relative;
}

.border {
  margin: 25px 0 15px 0;
  width: 1014px;
  border-bottom: 1px solid $light_gray_blue_3;
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
    position: absolute;
    top: -4px;
    right: 0;

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

  &__add-line {
    background-color: $true_white;
    border: 1px solid #e4e5ed;
    border-radius: 4px;
    color: #6a6d83;
    font-weight: bold;
    padding: 10px 13px;

    &-image {
      line-height: 12px;
      padding-bottom: 3px;
      padding-right: 6px;
    }

    &:hover {
      background-color: $light_gray_blue_3;
    }
  }

  &__add-all {
    width: 296px;
    height: 44px;
    background-color: $gray_blue_3;
    border-radius: 4px;
    line-height: 44px;
    color: $true_white;
    font-weight: bold;
    font-size: 15px;
    border: none;

    &:hover {
      background-color: $gray_blue_4;
    }

    &:disabled {
      color: $gray;
      background-color: $white_2;
      cursor: not-allowed;
      border: 1px solid $light_gray_blue_6;
    }
  }
}

.add-line {
  width: 923px;
  text-align: right;
  margin: 15px 0 15px;
}

.add-all {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #f7f8fd;
  border-radius: 4px;
  text-align: center;
  color: #6a6d83;
  padding: 25px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 29;

  &__text {
    margin: 0 10px 0 0;
  }
}

.alert-message,
.alert-message-add {
  & /deep/ .modal-window {
    height: auto;
  }

  & /deep/ .modal-content {
    margin-top: 10px;
  }

  & /deep/ .cancel-button {
    &:hover {
      background-color: $true_white;
      color: $gray_blue_4;
      border: 1px solid $light_gray_blue_3;
    }
  }
}

.alert-message {
  &__text {
    margin: 0 35px;
  }
}

.alert-message-add {
  & /deep/ .alert-message__text {
    margin: 0;
  }
}

.email-required {
  color: red;
}

.register-organization {
  font-size: 15px;
  line-height: 1.7;

  &:first-of-type {
    margin: 50px 0 0 0;
  }
}

.company-header {
  margin: 15px 0 0;
}

.parent-wrapper {
  position: relative;
}

.parent-contents {
  .parent-box {
    position: relative;
    padding-left: 14px;

    &.has-child {
      &::before {
        position: absolute;
        content: '';
        height: calc(100% + 14px);
        width: 2px;
        left: 0;
        top: 21px;
        background: #a5a8b6;
      }
    }
  }
}

.child-box {
  padding-left: 14px;

  & /deep/ .border {
    border-radius: 0 0 0 2px;
  }

  &:not(.last-child) {
    position: relative;

    &::before {
      position: absolute;
      content: '';
      height: calc(100% + 14px);
      width: 2px;
      left: 0;
      top: 21px;
      background: #a5a8b6;
    }

    & /deep/ .border {
      border-radius: 0;
    }
  }
}
</style>
