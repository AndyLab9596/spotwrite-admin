<template>
  <div v-if="users.length">
    <div v-if="selectedCompanyUuid === 'all'" class="company-name">
      {{ title }}
    </div>
    <table>
      <tr>
        <th width="30">
          <base-checkbox
            v-model="allSelectCheckbox"
            value="all"
            @change="allCheckOrUncheck"
          />
        </th>
        <th width="260">
          <div class="head-inner">
            <button class="sort-toggle-button" @click="toggleSortMenu('box')">
              所属組織（BOX)<img src="/icon/icon_caret-down.svg" />
            </button>
            <sort-menu
              v-if="showSortMenuName === 'box'"
              class="sort-menu"
              :items="[
                { text: '人数が多い順', value: 'desc' },
                { text: '人数が少ない順', value: 'asc' },
                { text: '順番を元に戻す', value: 'default' },
              ]"
              :selected="selectedOrder.box"
              @input="sortByBoxMemberCount"
            />
          </div>
        </th>
        <th width="225">
          <div class="head-inner">
            <button class="sort-toggle-button" @click="toggleSortMenu('name')">
              氏名<img src="/icon/icon_caret-down.svg" />
            </button>
            <sort-menu
              v-if="showSortMenuName === 'name'"
              class="sort-menu"
              :items="[
                { text: 'あ→ん の順', value: 'asc' },
                { text: 'ん→あ の順', value: 'desc' },
                { text: '順番を元に戻す', value: 'default' },
              ]"
              :selected="selectedOrder.name"
              @input="sortByUserName"
            />
          </div>
        </th>
        <th width="130">
          <div class="head-inner">
            <button class="sort-toggle-button" @click="toggleSortMenu('admin')">
              管理画面操作権限<img src="/icon/icon_caret-down.svg" />
            </button>
            <sort-menu
              v-if="showSortMenuName === 'admin'"
              class="sort-menu"
              :items="[
                { text: 'あり→なし の順', value: 'desc' },
                { text: 'なし→あり の順', value: 'asc' },
                { text: '順番を元に戻す', value: 'default' },
              ]"
              :selected="selectedOrder.admin"
              @input="sortByAuthority($event, 'admin')"
            />
          </div>
        </th>
        <th width="130">
          <div class="head-inner">
            <button class="sort-toggle-button" @click="toggleSortMenu('usage')">
              利用度チェック<br />閲覧権限<img
                src="/icon/icon_caret-down.svg"
              />
            </button>
            <sort-menu
              v-if="showSortMenuName === 'usage'"
              class="sort-menu"
              :items="[
                { text: 'あり→なし の順', value: 'desc' },
                { text: 'なし→あり の順', value: 'asc' },
                { text: '順番を元に戻す', value: 'default' },
              ]"
              :selected="selectedOrder.usage"
              @input="sortByAuthority($event, 'read_usage_check')"
            />
          </div>
        </th>
        <th width="130">
          <div class="head-inner">
            <button
              class="sort-toggle-button"
              @click="toggleSortMenu('motivation')"
            >
              モチベーショ<br />ン閲覧権限<img
                src="/icon/icon_caret-down.svg"
              />
            </button>
            <sort-menu
              v-if="showSortMenuName === 'motivation'"
              class="sort-menu"
              :items="[
                { text: 'あり→なし の順', value: 'desc' },
                { text: 'なし→あり の順', value: 'asc' },
                { text: '順番を元に戻す', value: 'default' },
              ]"
              :selected="selectedOrder.motivation"
              @input="sortByAuthority($event, 'read_motivation_analytics')"
            />
          </div>
        </th>
      </tr>
      <tr v-for="(user, index) in sortedUsers" :key="user.uuid">
        <td>
          <base-checkbox
            v-model="selectedUsers"
            :value="user.uuid"
            @change="showOptionAuthorityModal($event, user.uuid)"
          />
        </td>

        <td class="box">
          <div v-if="sameName(user.organization, index)"></div>
          <div v-else-if="hasParent(user.organization)">
            <div class="parent-organization">
              {{ getParentName(user.organization) }}
            </div>
            <div>{{ getBoxName(user.organization) }}</div>
          </div>
          <div v-else>
            {{ getBoxName(user.organization) }}
          </div>
        </td>
        <td class="name">{{ user.name }}</td>
        <td>
          <authority-button
            :total-company-count="totalCompanyCount"
            :authority-company-count="
              user.authorities.admin.length ? totalCompanyCount : 0
            "
            :disabled="disabled"
            @click="showOptionAuthorityModalAndSetAuthorities(user)"
          />
        </td>
        <td>
          <authority-button
            :total-company-count="totalCompanyCount"
            :authority-company-count="user.authorities.read_usage_check.length"
            :disabled="disabled"
            @click="showOptionAuthorityModalAndSetAuthorities(user)"
          />
        </td>
        <td>
          <authority-button
            :total-company-count="totalCompanyCount"
            :authority-company-count="
              user.authorities.read_motivation_analytics.length
            "
            :is-accessible-personal-information="
              user.authorities.read_personal_information
            "
            :disabled="disabled"
            @click="showOptionAuthorityModalAndSetAuthorities(user)"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { orderBy } from 'lodash';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import SortMenu from '@/components/Admin/Pages/AuthoritySetting/SortMenu.vue';
import AuthorityButton from '@/components/Admin/Pages/AuthoritySetting/AuthorityButton.vue';

type AuthorityTypes =
  | 'admin'
  | 'read_motivation_analytics'
  | 'read_usage_check';

type UserAuthorities = Record<AuthorityTypes, string[]> & {
  read_personal_information: boolean;
};

type User = {
  uuid: string;
  name: string;
  name_kana: string;
  organization: string;
  number: number;
  authorities: UserAuthorities;
};

type Columns = 'box' | 'name' | 'admin' | 'usage' | 'motivation';

type BoxMemberCount = {
  uuid: string;
  count: number;
};

export default Vue.extend({
  layout: 'admin/default',
  components: {
    BaseCheckbox,
    SortMenu,
    AuthorityButton,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    selectedCompanyUuid: {
      type: String,
      required: true,
    },
    users: {
      type: Array as PropType<User[]>,
      required: true,
    },
    boxes: {
      type: Array as PropType<ApiResponse.Organization[]>,
      required: true,
    },
    companies: {
      type: Array as PropType<ApiResponse.Organization[]>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      allSelectCheckbox: [],
      selectedUsers: [] as string[],
      selectedOrder: {
        box: '',
        name: '',
        admin: '',
        usage: '',
        motivation: '',
      } as Record<Columns, Types.Orders>,
      showSortMenuName: '',
      sortedUsers: [] as User[],
    };
  },
  computed: {
    boxesMemberCount(): BoxMemberCount[] {
      return this.boxes.map((b: ApiResponse.Organization) => ({
        uuid: b.uuid,
        count: this.users.filter((u: User) => u.organization === b.uuid).length,
        name: b.name,
      }));
    },
    totalCompanyCount() {
      return this.companies.length;
    },
  },
  mounted() {
    this.sortedUsers = this.users;
  },
  methods: {
    clearSelectedUsers() {
      this.selectedUsers = [];
      this.allSelectCheckbox = [];
    },
    hasParent(uuid: string) {
      return Boolean(this.getParentUuid(uuid));
    },
    getParentUuid(uuid: string) {
      return this.boxes.find((o: ApiResponse.Organization) => o.uuid === uuid)
        ?.relations?.parent;
    },
    getParentName(uuid: string) {
      const parentUuid = this.getParentUuid(uuid);
      return this.boxes.find(
        (o: ApiResponse.Organization) => o.uuid === parentUuid
      )?.name;
    },
    sortByAuthority(order: Types.Orders, type: AuthorityTypes) {
      const users = this.sortedUsers.map((u: User) => ({
        ...u,
        authority: this.oneOrZero(u.authorities[type].length),
        total:
          this.oneOrZero(u.authorities.admin.length) +
          this.oneOrZero(u.authorities.read_motivation_analytics.length) +
          this.oneOrZero(u.authorities.read_usage_check.length),
      }));
      this.selectedOrder = {
        box: '',
        name: '',
        admin: '',
        usage: '',
        motivation: '',
      };
      switch (type) {
        case 'admin':
          this.selectedOrder.admin = order;
          break;
        case 'read_motivation_analytics':
          this.selectedOrder.motivation = order;
          break;
        case 'read_usage_check':
          this.selectedOrder.usage = order;
          break;
        default:
          throw new Error(type);
      }
      this.showSortMenuName = '';
      switch (order) {
        case 'desc':
          this.sortedUsers = orderBy(
            users,
            ['authority', 'total', 'number'],
            [order, order, 'asc']
          );
          break;
        case 'asc':
          this.sortedUsers = orderBy(
            users,
            ['authority', 'number'],
            [order, 'asc']
          );
          break;
        case '':
        case 'default':
          this.sortedUsers = orderBy(this.sortedUsers, ['number'], ['asc']);
          break;
        default:
          throw new Error(order);
      }
    },
    oneOrZero(n: number) {
      return Number(Boolean(n));
    },
    sortByUserName(order: Types.Orders) {
      this.selectedOrder = {
        box: '',
        name: order,
        admin: '',
        usage: '',
        motivation: '',
      };
      this.showSortMenuName = '';
      switch (order) {
        case 'asc':
          this.sortedUsers.sort((a: User, b: User) =>
            a.name.localeCompare(b.name, 'ja')
          );
          break;
        case 'desc':
          this.sortedUsers.sort(
            (a: User, b: User) => -a.name.localeCompare(b.name, 'ja')
          );
          break;
        case '':
        case 'default':
          this.sortedUsers = orderBy(this.sortedUsers, ['number'], ['asc']);
          break;
        default:
          throw new Error(order);
      }
    },
    sortByBoxMemberCount(order: Types.Orders) {
      const users = this.users.map((u: User) => ({
        ...u,
        memberCount: this.boxesMemberCount.find(
          (b: BoxMemberCount) => b.uuid === u.organization
        )?.count,
      }));
      this.selectedOrder = {
        box: order,
        name: '',
        admin: '',
        usage: '',
        motivation: '',
      };
      this.showSortMenuName = '';
      switch (order) {
        case 'asc':
          this.sortedUsers = orderBy(
            users,
            ['memberCount', 'number'],
            [order, order]
          );
          break;
        case 'desc':
          this.sortedUsers = orderBy(
            users,
            ['memberCount', 'number'],
            [order, 'asc']
          );
          break;
        case '':
        case 'default':
          this.sortedUsers = orderBy(users, ['number'], ['asc']);
          break;
        default:
          throw new Error(order);
      }
    },
    toggleSortMenu(columnName: Columns) {
      if (this.showSortMenuName === '') {
        this.showSortMenuName = columnName;
        return '';
      }
      this.showSortMenuName = '';
    },
    allCheckOrUncheck(arr: string[]) {
      if (arr.length) {
        this.selectedUsers = this.users.flatMap((u: User) => u.uuid);

        this.$emit('add', this.selectedUsers);
        this.$emit('open-bulk-setting-modal', {
          uuid: '',
          authorities: {
            admin: [],
            readUsageCheck: [],
            readMotivationAnalytics: [],
            readPersonalInformation: [],
          },
        });
        return;
      }

      this.$emit('delete', this.selectedUsers);
      this.selectedUsers = [];
      this.$emit('should-close-bulk-setting-modal');
    },
    showOptionAuthorityModal(arr: string[], uuid: string) {
      if (arr.includes(uuid)) {
        this.$emit('add', [uuid]);
        this.$emit('open-bulk-setting-modal', {
          uuid,
          authorities: {
            admin: [],
            readUsageCheck: [],
            readMotivationAnalytics: [],
            readPersonalInformation: [],
          },
        });
      } else {
        this.$emit('delete', [uuid]);
        this.$emit('should-close-bulk-setting-modal');
      }

      if (this.selectedUsers.length === 0) {
        this.allSelectCheckbox = [];
        return;
      }

      if (this.selectedUsers.length === this.users.length) {
        this.allSelectCheckbox = ['all'];
      }
    },
    showOptionAuthorityModalAndSetAuthorities({ uuid, authorities }: User) {
      if (this.disabled) {
        return;
      }
      this.selectedUsers = [uuid];
      this.$emit('open-option-authority-modal', {
        uuid,
        authorities: {
          admin: authorities.admin,
          readUsageCheck: authorities.read_usage_check,
          readMotivationAnalytics: authorities.read_motivation_analytics,
          readPersonalInformation: authorities.read_personal_information
            ? ['default']
            : [],
        },
      });
    },
    getBoxName(uuid: string) {
      return this.boxes.find((o: ApiResponse.Organization) => o.uuid === uuid)
        .name;
    },
    sameName(uuid: string, index: number) {
      return index > 0 && this.sortedUsers[index - 1].organization === uuid;
    },
  },
});
</script>

<style lang="scss" scoped>
table {
  table-layout: fixed;
  width: 100%;
  margin-top: 5px;

  &,
  th,
  td {
    border: 1px solid $light_gray_blue_3;
  }

  th {
    font-size: 13px;
    font-weight: bold;
    color: $gray_blue_4;
    background-color: $white_1;
    text-align: center;
    vertical-align: middle;
    height: 40px;

    .head-inner {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      .sort-menu {
        position: absolute;
        top: 100%;
        right: -3px;
      }

      .sort-toggle-button {
        display: contents;

        img {
          margin-left: 7px;
        }
      }
    }
  }

  td {
    background-color: $true_white;
    font-size: 15px;
    vertical-align: middle;
    height: 40px;
    text-align: center;
  }
}

.parent-organization {
  font-size: 11px;
  color: $gray_blue_1;
}

.box,
.name {
  text-align: left;
  padding: 0 10px;
}

.company-name {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
}
</style>
