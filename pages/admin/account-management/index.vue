<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="アカウント管理">
        <template #tutorial>
          <TutorialButtonIcon
            :url="`/admin/tutorial/account-management.html`"
          />
        </template>
        <template #description>
          登録したメンバーにまとめてアカウント発行ができます。<br />
          アカウント発行後、各メンバーにメールが送られます。
        </template>
      </page-header>
      <vue-loading
        v-if="isLoading"
        type="spin"
        color="#333"
        :size="{ width: '50px', height: '50px' }"
      ></vue-loading>
      <template v-else>
        <div class="tabs">
          <scrollable-tabs
            :companies="companies"
            :current-id="currentUuid"
            :company-count-threshold="4"
            @change-tab="changeCompanyTab($event)"
          />
        </div>
        <div class="contents">
          <div class="display-switch-box">
            <div class="sort-box">
              <span class="label">組織を並び替え :</span>
              <toggle-button
                v-model="sortBy"
                class="button"
                name="member-sort"
                :contents="[
                  { label: '人数順', value: 'user-count' },
                  { label: 'あいうえお順', value: 'aiueo' },
                ]"
                @change="sortList"
              ></toggle-button>
            </div>
            <div class="filter-box">
              <span class="label">メンバーを絞り込む :</span>
              <toggle-button
                v-model="filterBy"
                class="button"
                name="member-filter"
                :contents="[
                  { label: '全メンバー表示', value: 'all' },
                  { label: '未発行', value: 'unactive' },
                  { label: '発行済み', value: 'sent' },
                  { label: '停止中', value: 'suspended' },
                  { label: '本登録完了', value: 'active' },
                ]"
              ></toggle-button>
            </div>
          </div>

          <div class="header">
            <div class="field check">
              <base-checkbox v-model="isAllChecked" @change="toggleAllCheck" />
            </div>
            <div class="field no">
              NO
            </div>
            <div class="field account">
              アカウント
            </div>
            <div class="field name">氏名</div>
            <div class="field email">メールアドレス</div>
          </div>

          <OrganizationAccountsBox
            v-for="organization in parent"
            :key="organization.uuid"
            ref="organizations"
            class="organization-account-box"
            :organization="organization"
            :children="children(organization.uuid)"
            :selected-users="selectedUsers"
            :is-all-user-checked="isAllUserChecked"
            :filter-by="filterBy"
            :email-domains="emailDomains"
            @checked-member="onCheckedMember($event)"
            @unchecked-member="onUncheckedMember($event)"
            @account-fetched="onAccountFetched"
            @fetch-member="fetchMember"
          />

          <div class="submit-box">
            <div class="text">チェックを入れたメンバーをまとめて</div>
            <base-button
              class="account-create-button"
              size="large"
              :disabled="isDisabled"
              @click="onPressGenerateButton()"
            >
              <vue-loading
                v-if="isGenerating"
                type="spin"
                color="#333"
                :size="{ width: '20px', height: '20px' }"
              ></vue-loading>
              <div v-else>
                アカウントを発行
              </div>
            </base-button>
            <div class="selected-members">
              選択中メンバー<span class="selected-count">{{
                selectedUsers.length
              }}</span
              >名
            </div>
          </div>
        </div>
      </template>
    </div>
    <check-delete
      v-if="showModal"
      delete-button-text="メールを送信"
      @close="cancelGenerateUsers()"
      @click="execGenerateUsers()"
    >
      選択したメンバーにspotwriteへの招待メールを送りますか？
    </check-delete>
    <alert-message
      v-if="showAlertModal"
      button-text="元の画面に戻る"
      class="alert-message"
      @close="showAlertModal = false"
    >
      メールアドレスが未入力のメンバーが選択されていました。<br />
      必要事項を入力後、再度メール送信を行ってください。
    </alert-message>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ScrollableTabs from '@/components/Admin/Modules/Tab/ScrollableTabs.vue';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import { OrganizationAccountsBox } from '@/components/Admin/Pages';
import { VueLoading } from 'vue-loading-template';
import { fetchOrganizations, sendInvitationMail } from '@/libs/api';
import { ToggleButton } from '@/components/Admin/Modules/Button';
import { CheckDelete, AlertMessage } from '@/components/Admin/Modules/Modal';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';
import { uniq, sortBy } from 'lodash';

type selectedUsers = string[];
type SortMethod = 'user-count' | 'aiueo';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    CheckDelete,
    ScrollableTabs,
    OrganizationAccountsBox,
    VueLoading,
    ToggleButton,
    PageHeader,
    BaseCheckbox,
    BaseButton,
    AlertMessage,
    TutorialButtonIcon,
  },
  data() {
    return {
      selectedUsers: [] as selectedUsers,
      currentUuid: '1',
      companies: [] as ApiResponse.GroupOrganization[],
      organizationsForCompany: [] as ApiResponse.GroupOrganization[],
      parent: [] as ApiResponse.GroupOrganization[],
      childrenList: [] as {
        parentUuid: string;
        children: ApiResponse.GroupOrganization[];
      }[],
      accountFetchedOrganizationUuids: [] as String[],
      allOrganizations: [] as ApiResponse.GroupOrganization[],
      isLoading: false as boolean,
      isGenerating: false as boolean,
      showModal: false as boolean,
      showAlertModal: false as boolean,
      isAllUserChecked: false as boolean,
      filterBy: 'all' as Types.AccountFilterMethod,
      sortBy: 'user-count' as SortMethod,
      isAllChecked: [] as string[],
      members: [] as ApiResponse.UsersInformation[],
    };
  },
  computed: {
    isDisabled(): boolean {
      return this.selectedUsers.length === 0 || this.isGenerating;
    },
    isAllAccountFetched(): boolean {
      const unfetched = this.organizationsForCompany.find(
        (organization: ApiResponse.GroupOrganization) => {
          return !this.accountFetchedOrganizationUuids.includes(
            organization.uuid
          );
        }
      );
      return unfetched === undefined;
    },
    emailDomains(): string[] {
      if (this.members.length) {
        return sortBy(
          uniq(
            this.members.map((m: ApiResponse.UsersInformation) => {
              const index = m.email.indexOf('@');
              if (index === -1) {
                return '';
              }
              return m.email.substring(index);
            })
          ).filter((m: string) => m.length)
        );
      }
      return [];
    },
  },
  watch: {
    filterBy() {
      // 絞り込みを切り替えた時に全チェックが入っているとUI的にわかりづらいのでチェックを外す
      this.isAllUserChecked = false;
      setTimeout(() => {
        const organizations = this.$refs.organizations as Element[];
        organizations.forEach((o: unknown) => {
          const organization = o as { lineHeightAdjust: () => void };
          organization.lineHeightAdjust();
        });
      }, 400);
    },
  },
  async created() {
    this.isLoading = true;
    const { data } = await fetchOrganizations();
    this.allOrganizations = data.organizations;
    this.companies = this.allOrganizations.filter(
      (n: ApiResponse.Organization) => n.layer === 0
    );
    this.currentUuid = this.companies[0] ? this.companies[0].uuid : '1';

    this.organizationsForCompany = this.findCompanyBy(this.currentUuid);

    this.parent = this.getParents();
    this.childrenList = this.getChildren();
    this.isLoading = false;
  },
  methods: {
    toggleAllCheck(): void {
      this.isAllUserChecked = !this.isAllUserChecked;
      this.checkAllSelect();
    },
    findCompanyBy(uuid: string) {
      return this.allOrganizations.filter(
        (n: ApiResponse.GroupOrganization) => n.relations.company === uuid
      );
    },
    getParents() {
      return this.sort(
        this.organizationsForCompany.filter(
          (o: ApiResponse.GroupOrganization) => o.relations.parent == null
        )
      );
    },
    getChildren() {
      return this.parent
        .map((o: ApiResponse.GroupOrganization) => {
          const children = this.organizationsForCompany.filter(
            (a: ApiResponse.GroupOrganization) =>
              a.relations.parent && o.uuid === a.relations.parent
          );
          return {
            parentUuid: o.uuid,
            children,
          };
        })
        .filter(
          (b: {
            parentUuid: string;
            children: ApiResponse.GroupOrganization[];
          }) => b.children.length
        );
    },
    children(uuid: string): ApiResponse.GroupOrganization[] {
      const obj = this.childrenList.find((item: { parentUuid: string }) => {
        return item.parentUuid === uuid;
      });
      if (!obj) {
        return [];
      }
      return obj.children;
    },
    async changeCompanyTab(uuid: string) {
      this.isLoading = true;
      this.currentUuid = uuid;
      this.organizationsForCompany = this.findCompanyBy(this.currentUuid);
      this.parent = this.getParents();
      this.childrenList = this.getChildren();
      this.isLoading = false;
    },
    async onPressGenerateButton() {
      this.showModal = true;
    },
    cancelGenerateUsers(): void {
      this.showModal = false;
    },
    async execGenerateUsers() {
      this.showModal = false;
      this.isGenerating = true;
      try {
        await sendInvitationMail(this.selectedUsers);
        this.reloadUserLists();
      } catch (e) {
        this.showAlertModal = true;
        this.isGenerating = false;
        return;
      }
      alert('選択したアカウント発行に成功しました');
      this.isGenerating = false;
    },
    sortList(): void {
      this.parent = this.sort(this.parent);
    },
    sort(items: ApiResponse.GroupOrganization[]) {
      if (this.sortBy === 'user-count') {
        return items
          .slice()
          .sort(
            (
              a: ApiResponse.GroupOrganization,
              b: ApiResponse.GroupOrganization
            ) => {
              if (a.user_count < b.user_count) return 1;
              if (a.user_count > b.user_count) return -1;
              return 0;
            }
          );
      }
      if (this.sortBy === 'aiueo') {
        return items
          .slice()
          .sort(
            (
              a: ApiResponse.GroupOrganization,
              b: ApiResponse.GroupOrganization
            ) => {
              if (a.kana < b.kana) return -1;
              if (a.kana > b.kana) return 1;
              return 0;
            }
          );
      }

      return items;
    },
    /** handlers */
    onCheckedMember(uuid: string): void {
      this.selectedUsers.push(uuid);
      this.checkAllSelect();
    },
    onUncheckedMember(uuid: string): void {
      this.selectedUsers = this.selectedUsers.filter((n: string) => n !== uuid);
      this.checkAllSelect();
    },
    onAccountFetched(uuid: String): void {
      this.accountFetchedOrganizationUuids.push(uuid);
    },
    onSelectAllUserChange(event: Event): void {
      const element = event.target as HTMLInputElement;
      if (!element.checked) {
        this.selectedUsers = [];
      }
    },
    checkAllSelect(): void {
      this.isAllChecked =
        this.members.length === this.selectedUsers.length ? ['default'] : [];
    },
    fetchMember(members: ApiResponse.UsersInformation[]) {
      this.members = [...this.members, ...members];
    },
    async reloadUserLists() {
      try {
        this.isLoading = true;
        const { data } = await fetchOrganizations();
        this.allOrganizations = data.organizations;
        this.organizationsForCompany = this.findCompanyBy(this.currentUuid);
        this.selectedUsers = [];
        this.isLoading = false;
      } catch (e) {
        // eslint-disable-next-line no-console
        alert('組織の取得に失敗しました。');
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.tabs {
  margin-top: 30px;
}

.contents {
  position: relative;
  height: 100%;
  min-height: 1200px;
  margin-top: 15px;
}

.display-switch-box {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: $true_white;
  font-size: 13px;
  color: $dark_blue;
  border: solid 1px $light_gray_blue_3;
  border-bottom: none;

  .button-box {
    margin-left: 16px;

    button {
      width: 140px;
      border: 0;
      border-radius: 4px;
      background-color: #e9e9e9;
      padding: 8px 0;

      &.current {
        background-color: $gray;
      }
    }
  }
}

.sort-box,
.filter-box {
  display: flex;
  align-items: center;

  span.label {
    margin-right: 5px;
  }

  .button {
    height: 30px;
  }
}

.sort-box {
  padding-right: 25px;
  border-right: solid 1px $light_gray_blue_3;
}

.filter-box {
  padding-left: 25px;
}

table {
  width: 100%;

  th {
    font-size: 13px;
    height: 30px;
    font-weight: 600;
    background-color: $white_1;
    text-align: center;
    vertical-align: middle;
  }

  td {
    background-color: $true_white;
    font-size: 15px;
    vertical-align: middle;
    height: 38px;
    text-align: center;
  }
}

.check {
  width: 30px;
}

.no {
  font-size: 15px;
  color: $dark_blue;
  width: 60px;
}

.account {
  width: 120px;
}

.name {
  width: 280px;
}

.email {
  flex-grow: 1;
}

.organization-account-box {
  margin-top: 10px;

  & + & {
    margin-top: 30px;
  }
}

.submit-box {
  margin-top: 74px;
  padding: 30px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: $white_1;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  justify-content: center;

  .text {
    font-size: 13px;
    color: $gray_blue_4;
    align-items: center;
    line-height: 1em;
    margin-right: 10px;
  }

  .account-create-button {
    width: 300px;
    margin-right: 30px;

    div {
      color: $true_white;
    }

    &:disabled div {
      color: $gray;
    }
  }

  .selected-members {
    justify-content: center;
    align-items: center;
    color: $pink;
    font-size: 15px;
    font-weight: 600;
    line-height: 1em;

    span {
      font-family: 'Lato', 'Hiragino Kaku Gothic Pro', sans-serif;
      font-size: 20px;
    }
  }
}

.header {
  display: flex;
  align-items: center;
  border: solid 1px $light_gray_blue_3;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  height: 40px;
  width: 100%;
  background-color: $white_1;
  color: $gray_blue_4;

  .field {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 10px);
  }

  .field + .field {
    border-left: solid 1px $light_gray_blue_3;
  }
}

.selected-count {
  margin: 0 6px;
}

// ボタン色がXDのデザインと異なるため追加した
.alert-message /deep/ .cancel-button {
  background-color: $gray_blue_3;
  color: $true_white;
  border: none;
}
</style>
