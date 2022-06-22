<template>
  <div class="l-page-container">
    <div class="l-page">
      <div class="announce">
        <button class="button__announce" @click="goToRegistrationPage">
          <img
            class="button__announce-image"
            src="/icon/arrow_right_black.svg"
          />
          必須項目に戻る
        </button>
      </div>

      <page-header title="メンバー登録（追加項目）">
        <template #tutorial>
          <TutorialButtonIcon
            :url="`/admin/tutorial/member-registration-addition.html`"
          />
        </template>
        <template #description>
          追加項目は
          <router-link
            :to="'/admin/employee-management/employees/list/1'"
            class="name"
          >
            <span class="page-header-pink">
              メンバー一覧
            </span>
          </router-link>
          や各メンバーの詳細ページからも登録できます。
        </template>
      </page-header>

      <div class="contents">
        <searchable-tab
          :first-tab-name="'追加項目'"
          :tab-name="tabName"
          :selected-organization-name="selectedOrganizationName"
          :attention="'※管理者とメンバー双方から入力可能な項目です'"
          :is-type="'addition'"
          :is-search="true"
          @click="openExtractionModal"
          @search="search"
        />
        <div v-show="allOrganizations.length > 0">
          <template v-if="!isSearchEmptyMember">
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
                      :is-addition="true"
                      :member-count="organizationUserLength(parent.uuid)"
                      :parent-name="checkParentName(parent)"
                      :border="!!getChild(company.uuid, parent.uuid).length"
                      class="company-header"
                    />
                    <addition-member-table
                      :uuid="parent.uuid"
                      :users="members"
                      :selected-organizations="selectedOrganizations"
                      :all-organizations="allOrganizations"
                      :checked="checked"
                      :last="
                        isParentsLast(
                          getChild(company.uuid, parent.uuid).length
                        )
                      "
                      :type="parent.type"
                      :languages="languages"
                      :search-word="searchWord"
                      @updateUser="updateUser"
                      @removeMember="removeMember"
                      @checked="changeChecked"
                      @standbyRegistered="standbyRegistered"
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
                      :is-addition="true"
                      :member-count="organizationUserLength(child.uuid)"
                      :parent-name="findParentName(child.relations.parent)"
                      class="company-header"
                    />
                    <addition-member-table
                      :uuid="child.uuid"
                      :users="members"
                      :selected-organizations="selectedOrganizations"
                      :all-organizations="allOrganizations"
                      :checked="checked"
                      :languages="languages"
                      :search-word="searchWord"
                      @updateUser="updateUser"
                      @removeMember="removeMember"
                      @checked="changeChecked"
                      @standbyRegistered="standbyRegistered"
                    />
                  </div>
                </div>
              </div>
              <div v-if="showBorder(company.uuid)" class="border"></div>
            </div>
          </template>
          <template v-if="isSearchEmptyMember && searchWord !== ''">
            <p class="empty-message">
              {{ searchWord }} は追加項目未登録者の中にはいません。
            </p>
          </template>
          <template v-if="isSearchEmptyMember && searchWord === ''">
            <p class="empty-message">
              追加項目未登録者はいません。
            </p>
          </template>
          <div class="add-all">
            <p class="add-all__text">
              チェックを入れたメンバーを
            </p>
            <button
              class="button__add-all"
              :disabled="checked.length === 0"
              @click="toggleDeleteModal"
            >
              まとめて登録
            </button>
          </div>
        </div>
      </div>
    </div>
    <extraction-modal
      v-if="extractionModal"
      :organizations="allOrganizations"
      :selected-organizations="selectedOrganizations"
      @close="toggleExtractionModal"
      @extract="extract"
    />
    <check-delete
      v-if="deleteModal"
      delete-button-text="はい"
      class="check-delete-modal"
      @close="cancelRegistered"
      @click="clickRegister"
    >
      <div class="check-delete">
        登録すると、こちらの一覧から削除されます。よろしいですか？
      </div>
    </check-delete>
    <alert-message
      v-if="alertMessageModal"
      button-text="閉じる"
      class="alert-message"
      @close="toggleAlertMessageModal"
    >
      <div class="alert-message__text">
        追加情報の登録が完了しました。<br />
        情報に変更がある場合、メニューのメンバー一覧から変更して下さい。
      </div>
    </alert-message>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import ExtractionModal from '@/components/Admin/Pages/EmployeeManagement/ExtractionModal.vue';
import CompanyHeader from '@/components/Admin/Pages/OrganizationManagement/Company/CompanyHeader.vue';
import AdditionMemberTable from '@/components/Admin/Pages/OrganizationManagement/Table/AdditionMemberTable.vue';
import { AlertMessage, CheckDelete } from '@/components/Admin/Modules/Modal';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';
import {
  fetchLanguages,
  fetchOrganizations,
  fetchOrganizationsPositions,
  fetchUsers,
  updateMembers,
  updateUser,
} from '@/libs/api';
import SearchableTab from '~/components/Admin/Pages/OrganizationManagement/Tab/SearchableTab.vue';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    PageHeader,
    ExtractionModal,
    CheckDelete,
    AlertMessage,
    CompanyHeader,
    AdditionMemberTable,
    SearchableTab,
    TutorialButtonIcon,
  },
  async asyncData({ error }: any) {
    try {
      const users = await fetchUsers({ is_registered_additional: false });
      const allOrganizations = await fetchOrganizations({
        independent: 'true',
      });
      const positions = await fetchOrganizationsPositions();
      const languages = await fetchLanguages();

      return {
        members: users.data,
        originalMembers: users.data,
        allOrganizations: allOrganizations.data.organizations,
        positions: positions.data,
        languages: languages.data,
      };
    } catch (err) {
      error({
        statusCode: err.response.status,
        message: err.response.data.message,
      });
    }
  },
  data() {
    return {
      alertMessageModal: false as boolean,
      deleteModal: false as boolean,
      extractionModal: false as boolean,
      allOrganizations: [] as ApiResponse.GroupOrganization[],
      positions: [] as ApiResponse.Position[],
      languages: [] as ApiResponse.Language[],
      members: [] as ApiResponse.User[],
      originalMembers: [] as ApiResponse.User[], // 並べ替え戻し用
      allChecked: false,
      checked: [] as string[],
      searchWord: '' as string,
      targetUser: null as ApiResponse.User | null,
      addSubOrganizationModal: false as boolean,
      selectedMember: {} as ApiRequest.PostUser,
      hoverSubOrganization: false,
      selectedOrganizations: [] as ApiResponse.GroupOrganization[],
      tabName: {
        organization: '組織(BOX)で絞り込む',
        company: '',
      } as Types.TabName,
      selectedOrganizationName: [] as string[],
      alertAddMembersModal: false as boolean,
      isPosted: false as boolean,
      requestOrganizationUuid: this.$route.query.organization as string,
    };
  },
  computed: {
    companies(): ApiResponse.GroupOrganization[] {
      return this.allOrganizations.filter(
        (organization: ApiResponse.GroupOrganization) =>
          organization.layer === 0
      );
    },
    isSearchEmptyMember(): boolean {
      type Organization = ApiResponse.GroupOrganization;
      let count = 0;

      this.companies.forEach((company: Organization) =>
        this.getParent(company.uuid).forEach((parent: Organization) => {
          count += this.organizationUserLength(parent.uuid);
          this.getChild(company.uuid, parent.uuid).forEach(
            (children: Organization) => {
              count += this.organizationUserLength(children.uuid);
            }
          );
        })
      );
      return count === 0;
    },
  },
  created() {
    if (this.requestOrganizationUuid) {
      this.extract([this.requestOrganizationUuid]);
    } else {
      this.extract(
        new Set(
          this.members.map(
            (member: ApiResponse.User): string => member.organization.uuid
          )
        )
      );
    }
  },
  methods: {
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
          organization.relations.company === uuid && organization.layer === 1
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
          organization.layer === 2
      );
    },
    showBorder(companyUuid: string): boolean {
      if (this.selectedOrganizations.length > 0) {
        const o = this.selectedOrganizations.find(
          (item: ApiResponse.GroupOrganization) => item.uuid === companyUuid
        );
        return o != null;
      }
      return true;
    },
    organizationUserLength(uuid: string): number {
      if (this.searchWord === '') {
        return this.defaultOrganizationUserLength(uuid);
      }
      return this.searchOrganizationUserLength(uuid);
    },
    defaultOrganizationUserLength(uuid: string) {
      return this.members.filter((member: ApiResponse.User) => {
        return member.organization.uuid === uuid;
      }).length;
    },
    searchOrganizationUserLength(uuid: string): number {
      return this.members.filter(
        (member: ApiResponse.User) =>
          member.organization.uuid === uuid &&
          member.name.includes(this.searchWord)
      ).length;
    },
    isParentsLast(childrensLength: number): boolean {
      return childrensLength === 0;
    },
    isChildrensLast(index: number, childrensLength: number): boolean {
      return index + 1 === childrensLength;
    },
    async removeMember(user: ApiResponse.fetchUser) {
      this.members = this.members.filter(
        (member: ApiResponse.fetchUser) => member.uuid !== user.uuid
      );
      await this.updateUser(user, true);
    },
    async updateMembers(userUuid: string, payload: ApiRequest.PostMember) {
      await updateMembers(userUuid, payload);
    },
    allCheck() {
      this.toggleAllChecked();
      if (this.allChecked) {
        this.checked = this.members.map((item: any) => item.uuid);
        return;
      }
      this.checked = [];
    },
    openExtractionModal() {
      this.extractionModal = true;
    },
    toggleExtractionModal() {
      this.extractionModal = !this.extractionModal;
    },
    toggleDeleteModal() {
      this.deleteModal = !this.deleteModal;
    },
    toggleAlertMessageModal() {
      this.alertMessageModal = !this.alertMessageModal;
    },
    standbyRegistered(member: ApiResponse.fetchUser) {
      this.targetUser = member;
      this.toggleDeleteModal();
    },
    standbyMultipleRegistered(member: ApiResponse.fetchUser) {
      this.targetUser = member;
      this.toggleDeleteModal();
    },
    cancelRegistered() {
      this.targetUser = null;
      this.toggleDeleteModal();
    },
    async clickRegister() {
      this.toggleDeleteModal();
      this.searchWord = '';

      // 単一で登録した場合
      if (this.targetUser != null) {
        await this.updateUser(this.targetUser, true);
        if (this.isPosted) {
          this.members = this.members.filter(
            (member: ApiResponse.User) => member.uuid !== this.targetUser?.uuid
          );
          this.toggleAlertMessageModal();
        }
      }

      // まとめて登録した場合
      if (this.targetUser === null && this.checked.length > 0) {
        const targetUsers = this.members.filter(
          (member: ApiResponse.fetchUser) => this.checked.includes(member.uuid)
        );

        for (let i = 0; i < targetUsers.length; i += 1) {
          // eslint-disable-next-line
          await this.updateUser(targetUsers[i], true);
          if (this.isPosted) {
            this.members = this.members.filter(
              (member: ApiResponse.User) => member.uuid !== targetUsers[i].uuid
            );
          }
        }
        if (this.isPosted) this.toggleAlertMessageModal();
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
    toggleAllChecked() {
      this.allChecked = !this.allChecked;
    },
    goToRegistrationPage() {
      this.$router.push({
        path: '/admin/employee-management/registration',
      });
    },
    async updateUser(
      user: ApiResponse.fetchUser,
      isRegisteredAdditional: boolean = false
    ) {
      try {
        await updateUser(user.uuid, {
          name: user.name,
          name_kana: user.name_kana,
          email: user.email,
          organization: user.organization.uuid,
          employment_position: user.position.uuid,
          employment_status: user.status.uuid,
          // FIXME sub_organizationsにランダムで同じ値を挿入しているが、仕様が決まるまでの暫定対応
          sub_organizations: user.sub_organizations || [],
          joined_year: user.joined_year || undefined,
          joined_month: user.joined_month || undefined,
          company_tel: user.company_tel || undefined,
          internal_tel: user.internal_tel || undefined,
          // FIXME enrollment_statusに固定値を挿入しているが、仕様が決まるまでの暫定対応
          enrollment_status: 'currently_enrolled',
          // FIXME access_permissionに固定値を挿入しているが、仕様が決まるまでの暫定対応
          access_permission: 'member',
          authorities: user.authorities,
          is_registered_additional: isRegisteredAdditional,
          language: user.language,
        } as ApiRequest.PostUser);
        this.isPosted = true;
      } catch (err) {
        alert('ユーザの登録ができませんでした。');
      }
    },
    search(value: string) {
      this.searchWord = value;
    },
    toggleAddSubOrganizationModal(member: ApiResponse.fetchUser) {
      this.addSubOrganizationModal = !this.addSubOrganizationModal;
      this.selectedMember = member;
    },
    addSubOrganization(selectedMember: ApiResponse.fetchUser) {
      this.updateUser(selectedMember);
      this.members = this.members.map((member: ApiResponse.fetchUser) => {
        if (member.uuid === selectedMember.uuid) {
          return {
            ...selectedMember,
          };
        }
        return member;
      });
    },
    toggleOptionAuthorityModal(member: ApiResponse.fetchUser) {
      this.addSubOrganizationModal = !this.addSubOrganizationModal;
      this.selectedMember = member;
    },
    toggleAlertAddMembersModal() {
      this.alertAddMembersModal = !this.alertAddMembersModal;
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

.l-page-container {
  padding-bottom: 130px;
}

.page-header-pink {
  color: #f09c9c;
}

.contents {
  position: relative;
  height: 100%;
  min-height: 1200px;
  background-color: $true_white;
  margin-top: 15px;
}

.link {
  color: #f09c9c;
}

.announce {
  width: 1090px;
  margin-bottom: 33px;
  position: absolute;
  top: 17px;
}

.search {
  display: flex;
  justify-content: flex-end;
  margin: auto 0 auto auto;
}

.tab {
  width: 1206px;
  border-bottom: 1px solid #e4e5ed;
  font-size: 15px;
  text-align: center;
  display: flex;
  margin-top: 35px;

  &__main {
    font-weight: bold;
    width: 180px;
    height: 50px;
    background: #f7f8fd;
    border: 1px solid #e4e5ed;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    line-height: 50px;
  }

  &__sub {
    font-size: 15px;
    color: #f09c9c;
    font-weight: bold;
    height: 46px;
    line-height: 46px;
    background: $true_white;
    border: 1px solid #e4e5ed;
    border-radius: 4px;
    margin-left: 20px;
    padding: 0 15px;
  }

  &__attention {
    margin-left: 20px;
    margin-bottom: 0;
    height: 46px;
    line-height: 75px;
  }
}

.sort-icon {
  margin-bottom: 5px;
  margin-left: 3px;
  cursor: pointer;
}

.sort-menu {
  position: absolute;
  z-index: 1;
  top: 150px;
}

.table {
  width: 1206px;
  margin-top: 15px;

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
    color: #2e303e;
    height: 40px;

    &--empty {
      background-color: #f0f7fe;
    }

    &-check {
      width: 30px;
      text-align: center;
    }

    &-name {
      width: 90px;
      max-width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      background-color: #f5f5f5;
    }

    &-company {
      width: 90px;
      max-width: 110px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      background-color: #f5f5f5;
    }

    &-organization {
      width: 90px;
      max-width: 110px;
      background-color: #f5f5f5;
    }

    &-language {
      width: 90px;
      max-width: 100px;
    }

    &-sub-organization {
      width: 200px;
      min-width: 250px;
    }

    &-join-year {
      text-align: center;
      width: 150px;
    }

    &-tel {
      width: 130px;
      text-align: center;
    }

    &-inner-tel {
      width: 70px;
      text-align: center;
    }

    &-option {
      width: 100px;
      text-align: center;
    }

    &-update {
      width: 87px;
      text-align: right;
      border: solid 1px transparent;
    }
  }
}

.select {
  font-family: 'Hiragino Kaku Gothic Pro', sans-serif;
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

  &__year {
    width: 50px;
    padding-right: 15px;
  }

  &__month {
    width: 35px;
    padding-right: 15px;
  }
}

.button {
  &__announce {
    color: #6a6d83;
    border-radius: 4px;
    background: $light_gray_blue_7;
    border: none;
    font-size: 13px;
    font-weight: bold;
    padding: 4px 14px;

    &:hover {
      background: $light_gray_blue_8;
    }

    &-image {
      margin-bottom: 4px;
      margin-right: 11px;
    }
  }

  &__close {
    margin-bottom: 6px;
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
      color: #bebebe;
      background: #f3f3f3;
      border-radius: 4px;
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
    margin-top: 14px;

    &:hover {
      background-color: $gray_blue_4;
    }

    &:disabled {
      color: $gray;
      background-color: $white_2;
      cursor: not-allowed;
      border: none;
    }
  }

  &__setting {
    width: 80px;
    height: 30px;
    background-color: $light_gray_blue_7;
    border: 1px solid #e4e5ed;
    border-radius: 4px;
    color: #6a6d83;
    font-weight: bold;
    padding: 3px 12px;

    &:hover {
      background-color: $light_gray_blue_8;
    }
  }

  &__search {
    font-weight: bold;
    color: $true_white;
    font-size: 13px;
    background: $gray_blue_3;
    border-radius: 4px;
    border: none;
    padding: 5px 12px 4px;
    margin-left: 8px;
    margin-right: 31px;

    &:hover {
      background: $gray_blue_4;
    }
  }
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

.input {
  &__text {
    border: none;
    background-color: transparent;
    width: 100%;
    color: #2e303e;
    font-family: 'Hiragino Kaku Gothic Pro', sans-serif;
    text-align: center;
  }

  &__search {
    width: 160px;
    height: 30px;
    border: 1px solid $light_gray_blue_3;
    background-color: $extra_light_gray;
    border-radius: 4px;
    color: $gray_blue_4;
    font-size: 13px;
    font-weight: 300;
    padding: 0 0 0 8px;
    font-family: 'Hiragino Kaku Gothic Pro', sans-serif;
  }

  ::placeholder {
    color: $placeholder_gray;
  }
}

.alert-message {
  & /deep/ .modal-window {
    height: auto;
  }

  & /deep/ .modal-content {
    margin-top: 10px;
  }

  & /deep/ .cancel-button {
    color: $true_white;
    background: $gray_blue_3;
    border: none;
    margin-top: 25px;
  }

  &__text {
    margin: 0 35px;
  }
}

.empty-message {
  font-size: 15px;
  margin-top: 30px;
}

.sub-organization__flex {
  display: flex;
  align-items: center;
}

.sub-organization__names {
  width: 180px;
}

.sub-organization__button {
  width: 60px;
  height: 25px;
  position: relative;

  &::before {
    content: '';
    display: inline-block;
    width: 1px;
    height: 25px;
    background-color: $light_gray_blue_3;
    position: absolute;
    top: 0;
    left: -5px;
  }
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

.border {
  margin: 15px 0;
  width: 1220px;
  border-bottom: 1px solid $light_gray_blue_3;
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

.company-header {
  margin: 16px 0 0;
}

.check-delete-modal {
  /deep/ .cancel-button {
    &:hover {
      background-color: $button_background_color;
    }
  }

  .check-delete {
    margin: 28px 0;
  }
}
</style>
