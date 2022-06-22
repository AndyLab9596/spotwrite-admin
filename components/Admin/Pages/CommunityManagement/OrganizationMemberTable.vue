<template>
  <table border class="table">
    <thead>
      <tr>
        <th>NO</th>
        <th class="name">
          <div class="head-inner">
            氏名<svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="8"
              viewBox="0 0 10 8"
              @click="showSortMenuName = 'name'"
            >
              <path
                id="Path_845"
                data-name="Path 845"
                d="M450.361,106.779l-4.549,7.06a.44.44,0,0,1-.746,0l-4.549-7.06a.471.471,0,0,1,.373-.733h9.1A.471.471,0,0,1,450.361,106.779Z"
                transform="translate(-440.439 -106.046)"
                fill="#7e8195"
              />
            </svg>
            <sort-menu
              v-if="showSortMenuName === 'name'"
              class="sort-menu"
              :items="[
                { text: 'あ→ん の順', value: 'asc' },
                { text: 'ん→あ の順', value: 'desc' },
                { text: '順番を元に戻す', value: 'default' },
              ]"
              :selected="selectedOrder.name"
              @input="sortByName"
            />
          </div>
        </th>
        <th class="company-name">
          <div class="head-inner">
            会社
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="8"
              viewBox="0 0 10 8"
              @click="showSortMenuName = 'company'"
            >
              <path
                id="Path_845"
                data-name="Path 845"
                d="M450.361,106.779l-4.549,7.06a.44.44,0,0,1-.746,0l-4.549-7.06a.471.471,0,0,1,.373-.733h9.1A.471.471,0,0,1,450.361,106.779Z"
                transform="translate(-440.439 -106.046)"
                fill="#7e8195"
              />
            </svg>
            <sort-menu
              v-if="showSortMenuName === 'company'"
              class="sort-menu"
              :items="[
                { text: 'あ→ん の順', value: 'asc' },
                { text: 'ん→あ の順', value: 'desc' },
                { text: '順番を元に戻す', value: 'default' },
              ]"
              :selected="selectedOrder.company"
              @input="sortByCompany"
            />
          </div>
        </th>
        <th class="organization-name">
          <div class="head-inner">
            所属組織（BOX）<svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="8"
              viewBox="0 0 10 8"
              @click="showSortMenuName = 'organization'"
            >
              <path
                id="Path_845"
                data-name="Path 845"
                d="M450.361,106.779l-4.549,7.06a.44.44,0,0,1-.746,0l-4.549-7.06a.471.471,0,0,1,.373-.733h9.1A.471.471,0,0,1,450.361,106.779Z"
                transform="translate(-440.439 -106.046)"
                fill="#7e8195"
              />
            </svg>
            <sort-menu
              v-if="showSortMenuName === 'organization'"
              class="sort-menu"
              :items="[
                { text: '人数が多い順', value: 'desc' },
                { text: '人数が少ない順', value: 'asc' },
                { text: '順番を元に戻す', value: 'default' },
              ]"
              :selected="selectedOrder.organization"
              @input="sortByOrganization"
            />
          </div>
        </th>

        <th class="position">役職</th>
        <th class="delete"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in typedUsers" :key="user.uuid">
        <td class="no">{{ user.number }}</td>
        <td>
          <div class="td-name">
            <span v-if="user.is_representative" class="represent-symbol"
              >代表</span
            >
            <LineClampPopper :text="user.name" />
          </div>
        </td>
        <td>{{ user.company_name }}</td>
        <td>
          <LineClampPopper :text="user.organization_name" />
        </td>
        <td>{{ user.organization_position }}</td>
        <td class="delete" @click="$emit('delete-user', user.uuid)">
          <svg
            id="Group_7643"
            data-name="Group 7643"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <circle
              id="Ellipse_215"
              data-name="Ellipse 215"
              cx="8"
              cy="8"
              r="8"
              fill="#7e8195"
            />
            <line
              id="Line_356"
              data-name="Line 356"
              x2="6"
              y2="6"
              transform="translate(5 5)"
              fill="none"
              stroke="#fff"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1.114"
            />
            <line
              id="Line_357"
              data-name="Line 357"
              x1="6"
              y2="6"
              transform="translate(5 5)"
              fill="none"
              stroke="#fff"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1.114"
            />
          </svg>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';
import { LineClampPopper } from '@/components/Admin/Modules/Popper';
import SortMenu from './SortMenu.vue';

type User = {
  uuid: string;
  name: string;
  company_name: string;
  organization_uuid: string;
  organization_name: string;
  organization_position: string;
  is_representative: boolean;
  organization_member_count: number;
  number: Number;
};

export default Vue.extend({
  components: { SortMenu, LineClampPopper },
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showSortMenuName: '',
      userList: null as null | User[],
      selectedOrder: {
        organization: '',
        name: '',
        company: '',
      },
    };
  },
  computed: {
    memberCountByOrganization() {
      return _.countBy(this.users, 'organization_uuid');
    },
    typedUsers: {
      get(): User[] {
        const users = (this.userList ??
          _.sortBy(this.users, 'number')) as User[];
        return users.map((user: User) => {
          return {
            ...user,
            organization_member_count: this.memberCountByOrganization[
              user.organization_uuid
            ],
          };
        }) as User[];
      },
      set(v: User[]): void {
        this.userList = v;
      },
    },
  },
  methods: {
    clearMembers() {
      this.userList = null;
    },
    sortByOrganization(order: string) {
      this.selectedOrder = { organization: order, name: '', company: '' };
      if (order === 'default') {
        this.resetSort();
      }
      const result = _.sortBy(this.typedUsers, 'organization_member_count');
      if (order === 'asc') {
        this.typedUsers = result;
      }
      if (order === 'desc') {
        this.typedUsers = result.reverse();
      }
      this.hideSortMenu();
    },
    sortByName(order: string) {
      this.selectedOrder = { name: order, organization: '', company: '' };
      if (order === 'default') {
        this.resetSort();
      }
      if (order === 'asc') {
        this.typedUsers = (this.typedUsers as User[]).sort((a: User, b: User) =>
          a.name.localeCompare(b.name, 'ja')
        );
      }
      if (order === 'desc') {
        this.typedUsers = (this.typedUsers as User[]).sort(
          (a: User, b: User) => -a.name.localeCompare(b.name, 'ja')
        );
      }
      this.hideSortMenu();
    },
    sortByCompany(order: string) {
      this.selectedOrder = { name: '', organization: '', company: order };
      if (order === 'default') {
        this.resetSort();
      }
      if (order === 'asc') {
        this.typedUsers = (this.typedUsers as User[]).sort((a: User, b: User) =>
          a.name.localeCompare(b.organization_name, 'ja')
        );
      }
      if (order === 'desc') {
        this.typedUsers = (this.typedUsers as User[]).sort(
          (a: User, b: User) => -a.name.localeCompare(b.organization_name, 'ja')
        );
      }
      this.hideSortMenu();
    },
    hideSortMenu() {
      this.showSortMenuName = '';
    },
    resetSort() {
      this.userList = this.users as User[];
      this.selectedOrder = {
        organization: '',
        name: '',
        company: '',
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.table {
  width: 960px;
  border: solid 1px $light_gray_blue_3;
  border-collapse: collapse;

  th,
  td {
    border: solid 1px $light_gray_blue_3;
  }

  th {
    color: $gray_blue_4;
    background-color: $white_1;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    padding: 10px;

    .head-inner {
      position: relative;

      svg {
        margin-left: 7px;
      }

      .sort-menu {
        position: absolute;
        top: 20px;
        left: 180px;
      }
    }
  }

  td {
    color: $dark_blue;
    background-color: $true_white;
    font-size: 15px;
    font-weight: 300;
    padding: 0 10px;
    height: 40px;
    line-height: 1em;
    vertical-align: middle;
  }

  thead {
    .organization-name {
      width: 220px;
    }

    .company-name {
      width: 209px;
    }

    .name {
      width: 210px;
    }

    .position {
      width: 200px;
    }

    .delete {
      width: 60px;
    }
  }

  tbody {
    .no {
      text-align: center;
    }

    .delete {
      text-align: center;
      cursor: pointer;
    }
  }
}

.represent-symbol {
  display: inline-block;
  border: none;
  border-radius: 2px;
  background-color: $pink;
  color: $true_white;
  width: 29px;
  height: 16px;
  line-height: 16px;
  font-size: 11px;
  font-weight: 600;
  padding-left: 4px;
  margin-right: 10px;
  vertical-align: text-bottom;
}

.td-name {
  display: flex;
}
</style>
