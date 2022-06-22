<template>
  <div class="table-box">
    <table class="table">
      <tr>
        <th class="table__border table__title table__detail-check">
          <base-checkbox @change="allCheck" />
        </th>
        <th class="table__border table__title table__detail-name">
          氏名
          <img
            class="sort-icon"
            src="/icon/icon_pulldown.svg"
            @click="clickSortType('name')"
          />
          <sort-menu
            v-if="showSortMenu === 'name'"
            class="sort-menu name"
            :items="[
              { text: 'あ→ん の順', value: 'asc' },
              { text: 'ん→あ の順', value: 'desc' },
              { text: '順番を元に戻す', value: 'default' },
            ]"
            :selected="selectedOrderType"
            @input="(order) => selectedSortOrderType(order)"
          />
        </th>
        <th class="table__border table__title table__detail-company">
          会社
          <img
            class="sort-icon"
            src="/icon/icon_pulldown.svg"
            @click="clickSortType('company')"
          />
          <sort-menu
            v-if="showSortMenu === 'company'"
            class="sort-menu company"
            :items="[
              { text: 'あ→ん の順', value: 'asc' },
              { text: 'ん→あ の順', value: 'desc' },
              { text: '順番を元に戻す', value: 'default' },
            ]"
            :selected="selectedOrderType"
            @input="(order) => selectedSortOrderType(order)"
          />
        </th>
        <th class="table__border table__title table__detail-organization">
          所属組織
          <img
            class="sort-icon"
            src="/icon/icon_pulldown.svg"
            @click="clickSortType('organization')"
          />
          <sort-menu
            v-if="showSortMenu === 'organization'"
            class="sort-menu organization"
            :selected="selectedOrderType"
            :items="[
              { text: '人数が多い順', value: 'desc' },
              { text: '人数が少ない順', value: 'asc' },
              { text: '順番を元に戻す', value: 'default' },
            ]"
            @input="(order) => selectedSortOrderType(order)"
          />
        </th>
        <th class="table__border table__title table__detail-language">
          使用言語
        </th>
        <th class="table__border table__title table__detail-join-year">
          入社年
          <img
            class="sort-icon"
            src="/icon/icon_pulldown.svg"
            @click="clickSortType('joinedDate')"
          />
          <sort-menu
            v-if="showSortMenu === 'joinedDate'"
            class="sort-menu joined-year"
            :items="[
              { text: '日付が新しい順', value: 'asc' },
              { text: '日付が古い順', value: 'desc' },
              { text: '順番を元に戻す', value: 'default' },
            ]"
            :selected="selectedOrderType"
            @input="(order) => selectedSortOrderType(order)"
          />
        </th>
        <th class="table__border table__title table__detail-tel">
          社用携帯番号
        </th>
        <th class="table__border table__title table__detail-inner-tel">内線</th>
        <th class="table__border table__title table__detail-option">
          オプション権限
        </th>
        <th class="table__detail-update table__detail-update"></th>
      </tr>
      <tr
        v-for="(member, index) in sortedUser"
        :key="index"
        class="table__detail"
      >
        <td class="table__border table__detail-check">
          <base-checkbox
            v-model="check"
            class="checkbox"
            :value="member.uuid"
          />
        </td>
        <td class="table__border table__detail-name">
          {{ member.name }}
        </td>
        <td class="table__border table__detail-company">
          {{ member.company.name }}
        </td>
        <td class="table__border table__detail-organization">
          {{ member.organization.name }}
        </td>
        <td
          class="table__border table__detail-language"
          :class="!member.language ? 'table__detail--empty' : ''"
        >
          <select
            v-model="member.language"
            class="select"
            name="language"
            :class="!member.language ? 'select__default' : ''"
            @change="updateUser(member)"
          >
            <option selected value="">選択してください</option>
            <option
              v-for="value in languages"
              :key="value.code"
              :value="value.code"
            >
              {{ value.name }}
            </option>
          </select>
        </td>
        <td
          class="table__border table__detail-join-year"
          :class="
            !member.joined_year || !member.joined_month
              ? 'table__detail--empty'
              : ''
          "
        >
          <select
            v-model="member.joined_year"
            class="select select__year"
            name="years"
            @change="updateUser(member)"
          >
            <option selected value="">-</option>
            <option v-for="year in years" :key="year">{{ year }}</option>
          </select>
          年
          <select
            v-model="member.joined_month"
            class="select select__month"
            name="month"
            @change="updateUser(member)"
          >
            <option selected value="">-</option>
            <option v-for="month in months" :key="month">{{ month }}</option>
          </select>
          月
        </td>
        <td
          class="table__border table__detail-tel"
          :class="!member.company_tel ? 'table__detail--empty' : ''"
        >
          <input
            v-model="member.company_tel"
            class="input__text"
            type="text"
            placeholder="例)09012345678"
            @blur="updateUser(member)"
          />
        </td>
        <td
          class="table__border table__detail-inner-tel"
          :class="!member.internal_tel ? 'table__detail--empty' : ''"
        >
          <input
            v-model="member.internal_tel"
            class="input__text"
            type="text"
            placeholder="例)1234"
            @blur="updateUser(member)"
          />
        </td>
        <td class="table__border table__detail-option">
          <button class="button__setting" @click="clickSetting(member)">
            設定
          </button>
        </td>
        <td class="table__detail-update">
          <span>
            <button class="button__insert" @click="standbyRegistered(member)">
              登録
            </button>
          </span>
          <span>
            <img
              class="button__close"
              src="/icon/icon_close_b.svg"
              @click="removeMember(member)"
            />
          </span>
        </td>
      </tr>
    </table>

    <option-authority-modal
      v-if="optionSettingModal"
      :organizations="companies"
      :authorities="inputAuthorities"
      class="option-authority-modal"
      @close="optionSettingModal = false"
      @save="saveOptionAuthority"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import { SortMenu } from '@/components/Admin/Pages/';
import dayjs from '@/libs/dayjs';
import OptionAuthorityModal from '@/components/Admin/Pages/AuthoritySetting/OptionAuthorityModal.vue';

type RequestAuthorities = {
  admin: string[];
  read_motivation_analytics: string[];
  read_usage_check: string[];
  read_personal_information: string[];
};

type InputAuthorities = {
  admin: string[];
  readUsageCheck: string[];
  readMotivationAnalytics: string[];
  readPersonalInformation: string[];
};

export default Vue.extend({
  layout: 'admin/default',
  components: {
    BaseCheckbox,
    SortMenu,
    OptionAuthorityModal,
  },
  props: {
    uuid: {
      type: String,
      required: true,
    },
    users: {
      type: Array as PropType<ApiResponse.User[]>,
      required: true,
    },
    allOrganizations: {
      type: Array as PropType<ApiResponse.GroupOrganization[]>,
      required: true,
    },
    languages: {
      type: Array as PropType<ApiResponse.Language[]>,
      required: true,
    },
    checked: {
      type: Array as PropType<string[]>,
      required: true,
    },
    selectedOrganizations: {
      type: Array as PropType<ApiResponse.GroupOrganization[]>,
      required: true,
    },
    searchWord: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      allChecked: false as boolean,
      check: [] as string[],
      positionRegisterModal: false as boolean,
      employmentStatusRegisterModal: false as boolean,
      alertMessageModal: false as boolean,
      deleteModal: false as boolean,
      extractionModal: false as boolean,
      optionSettingModal: false as boolean,
      positions: [] as ApiResponse.Position[],
      showSortMenu: '',
      selectedSortType: '' as string,
      selectedOrderType: '' as 'default' | 'asc' | 'desc' | '',
      selectedMember: {} as ApiResponse.User,
      requestAuthorities: {} as RequestAuthorities,
      inputAuthorities: {} as InputAuthorities,
    };
  },
  computed: {
    companies(): ApiResponse.GroupOrganization[] {
      return this.allOrganizations.filter(
        (organization: ApiResponse.GroupOrganization) =>
          organization.layer === 0
      );
    },
    filterOrganizationUser(): ApiResponse.User[] {
      if (this.searchWord === '') {
        return this.users.filter((member: ApiResponse.User) => {
          return member.organization.uuid === this.uuid;
        });
      }
      return this.users.filter(
        (member: ApiResponse.User) =>
          member.organization.uuid === this.uuid &&
          member.name.includes(this.searchWord)
      );
    },
    sortedUser(): ApiResponse.User[] {
      // 氏名
      if (this.selectedSortType === 'name') {
        if (this.selectedOrderType === 'asc') {
          return this.sortByNameAsc(this.filterOrganizationUser);
        }
        if (this.selectedOrderType === 'desc') {
          return this.sortByNameDesc(this.filterOrganizationUser);
        }
      }
      // 入社日
      if (this.selectedSortType === 'joinedDate') {
        if (this.selectedOrderType === 'asc') {
          return this.sortByJoinedDateAsc(this.filterOrganizationUser);
        }
        if (this.selectedOrderType === 'desc') {
          return this.sortByJoinedDateDesc(this.filterOrganizationUser);
        }
      }
      return this.filterOrganizationUser;
    },
    years(): number[] {
      const years = [];
      const nowYears = dayjs().year();
      for (let i = 1900; i <= nowYears; i += 1) {
        years.push(i);
      }
      return years.reverse();
    },
    months(): number[] {
      const month = [];
      for (let i = 1; i <= 12; i += 1) {
        month.push(i);
      }
      return month;
    },
  },
  watch: {
    checked() {
      this.check = this.checked;
    },
    check() {
      this.$emit('checked', this.check);
    },
  },
  methods: {
    clickSetting(member: ApiResponse.User) {
      this.selectedMember = member;
      this.inputAuthorities = {
        admin: member.authorities.admin,
        readUsageCheck: member.authorities.read_usage_check,
        readMotivationAnalytics: member.authorities.read_motivation_analytics,
        readPersonalInformation: member.authorities.read_personal_information
          ? ['default']
          : [],
      };
      this.openOptionSettingModal();
    },
    openOptionSettingModal() {
      this.optionSettingModal = true;
    },
    updateUser(user: ApiResponse.User) {
      this.$emit('updateUser', user);
    },
    sortByNameAsc(users: ApiResponse.User[]): ApiResponse.User[] {
      return users
        .slice()
        .sort((a: ApiResponse.User, b: ApiResponse.User) =>
          a.name.localeCompare(b.name, 'ja')
        );
    },
    sortByNameDesc(users: ApiResponse.User[]): ApiResponse.User[] {
      return users
        .slice()
        .sort(
          (a: ApiResponse.User, b: ApiResponse.User) =>
            -a.name.localeCompare(b.name, 'ja')
        );
    },
    sortByJoinedDateAsc(users: ApiResponse.User[]): ApiResponse.User[] {
      return users.slice().sort((a: ApiResponse.User, b: ApiResponse.User) => {
        const oneYear = a.joined_year;
        const oneMonth = a.joined_month;
        const twoYear = b.joined_year;
        const twoMonth = b.joined_month;

        if (oneYear < twoYear) {
          return 1;
        }
        if (oneYear > twoYear) {
          return -1;
        }
        if (oneYear === twoYear) {
          if (oneMonth < twoMonth) {
            return 1;
          }
          if (oneMonth > twoMonth) {
            return -1;
          }
          return 0;
        }
        return 0;
      });
    },
    sortByJoinedDateDesc(users: ApiResponse.User[]): ApiResponse.User[] {
      return users.slice().sort((a: ApiResponse.User, b: ApiResponse.User) => {
        const oneYear = a.joined_year;
        const oneMonth = a.joined_month;
        const twoYear = b.joined_year;
        const twoMonth = b.joined_month;

        if (oneYear > twoYear) {
          return 1;
        }
        if (oneYear < twoYear) {
          return -1;
        }
        if (oneYear === twoYear) {
          if (oneMonth > twoMonth) {
            return 1;
          }
          if (oneMonth < twoMonth) {
            return -1;
          }
          return 0;
        }
        return 0;
      });
    },
    clickSortType(type: string) {
      this.showSortMenu = type;
      if (this.selectedSortType !== '' && this.selectedSortType !== type) {
        this.selectedOrderType = '';
      }
      this.selectedSortType = type;
    },
    selectedSortOrderType(order: 'default' | 'asc' | 'desc') {
      this.selectedOrderType = order;
      this.hideSortMenu();
    },
    hideSortMenu() {
      this.showSortMenu = '';
    },
    filteredMembers(): ApiResponse.User[] {
      if (this.searchWord === '') {
        return this.users;
      }
      return this.users.filter((member: ApiResponse.User) =>
        member.name.includes(this.searchWord)
      );
    },
    allCheck() {
      this.allChecked = !this.allChecked;

      if (this.allChecked) {
        this.check = this.filterOrganizationUser.map(
          (user: ApiResponse.User) => {
            return user.uuid;
          }
        );
        this.$emit('checked', this.check);
        return;
      }
      this.check = [];
      this.$emit('checked', this.check);
    },
    removeMember(user: ApiResponse.User) {
      this.$emit('removeMember', user);
    },
    organizations(company: string): ApiResponse.GroupOrganization[] {
      return this.allOrganizations.filter(
        (organization: ApiResponse.GroupOrganization) =>
          organization.layer !== 0 && organization.relations.company === company
      );
    },
    standbyRegistered(user: ApiResponse.TempUser) {
      this.$emit('standbyRegistered', user);
    },
    saveOptionAuthority(authorities: RequestAuthorities) {
      this.inputAuthorities = {
        admin: authorities.admin,
        readUsageCheck: authorities.read_usage_check,
        readMotivationAnalytics: authorities.read_motivation_analytics,
        readPersonalInformation: authorities.read_personal_information,
      };
      try {
        this.selectedMember.authorities = authorities;
        this.optionSettingModal = false;
        this.updateUser(this.selectedMember);
      } catch (e) {
        console.error(e);
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

.table-box {
  position: relative;
  background-color: $white_5;
}

.page-header-pink {
  color: #f09c9c;
}

.contents {
  position: relative;
  height: 100%;
  min-height: 900px;
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
  top: 30px;
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
      width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      background-color: #f5f5f5;
    }

    &-company {
      width: 130px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      background-color: #f5f5f5;
    }

    &-organization {
      width: 130px;
      background-color: #f5f5f5;
    }

    &-language {
      width: 118px;
    }

    &-join-year {
      text-align: center;
      width: 160px;
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
      width: 84px;
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
  width: 1090px;
  background: #f7f8fd;
  border-radius: 4px;
  text-align: center;
  color: #6a6d83;
  padding: 25px;
  margin-top: 40px;
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

.check-delete {
  margin: 28px 0;
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

.option-authority-modal {
  overflow: scroll;
  height: 95%;
  z-index: 99;
}
</style>
