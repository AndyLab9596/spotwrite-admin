<template>
  <table border class="table">
    <thead>
      <tr>
        <th class="organization-name">
          <div class="head-inner">
            <button class="sort-toggle-button" @click="toggleSortMenu('name')">
              会社名<img src="/icon/icon_caret-down.svg" />
            </button>
            <sort-menu
              v-if="sortMenuName === 'name'"
              class="sort-menu"
              :items="[
                { text: 'あ→ん の順', value: 'name' },
                { text: 'ん→あ の順', value: '-name' },
                { text: '順番を元に戻す', value: '' },
              ]"
              :selected="getSelected('name')"
              @input="sortBy"
            />
          </div>
        </th>
        <th class="name">プラン名</th>
        <th class="position">アカウント数</th>
        <th class="position">支払い方法</th>
        <th class="position">ステータス</th>
        <th class="position">
          <div class="head-inner">
            <button
              class="sort-toggle-button"
              @click="toggleSortMenu('payment_date')"
            >
              最終決済日<img src="/icon/icon_caret-down.svg" />
            </button>
            <sort-menu
              v-if="sortMenuName === 'payment_date'"
              class="sort-menu"
              :items="[
                { text: '日付が新しい順', value: '-payment_date' },
                { text: '日付が古い順', value: 'payment_date' },
                { text: '順番を元に戻す', value: '' },
              ]"
              :selected="getSelected('payment_date')"
              @input="sortBy"
            />
          </div>
        </th>
        <th class="position">
          <div class="head-inner">
            <button
              class="sort-toggle-button"
              @click="toggleSortMenu('contract_date')"
            >
              契約開始日<img src="/icon/icon_caret-down.svg" />
            </button>
            <sort-menu
              v-if="sortMenuName === 'contract_date'"
              class="sort-menu"
              :items="[
                { text: '日付が新しい順', value: '-contract_date' },
                { text: '日付が古い順', value: 'contract_date' },
                { text: '順番を元に戻す', value: '' },
              ]"
              :selected="getSelected('contract_date')"
              @input="sortBy"
            />
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(contractCompany, ukey) in contractCompanies" :key="ukey">
        <td>
          <nuxt-link
            :to="
              `/system-admin/contract-company/detail/${contractCompany.uuid}`
            "
          >
            {{ contractCompany.name }}
          </nuxt-link>
        </td>
        <td>
          <span
            v-if="
              contractCompany.contract_plan.is_upgrading ||
                contractCompany.contract_plan.is_downgrading
            "
            class="changed-label"
            >変更</span
          >{{ contractCompany.contract_plan.name
          }}{{ maxMember(contractCompany) }}{{ storageAdd(contractCompany) }}
        </td>
        <td>{{ contractCompany.user_count }}</td>
        <td class="center">{{ contractCompany.payment_method }}</td>
        <td class="center">{{ statusToJapanese(contractCompany.status) }}</td>
        <td class="center">{{ formatedDate(contractCompany.payment_date) }}</td>
        <td class="center">
          {{ formatedDate(contractCompany.contract_date) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from 'dayjs';
import SortMenu from './SortMenu.vue';

type ContractCompany = ApiResponse.ContractCompany;

export default Vue.extend({
  components: { SortMenu },
  props: {
    contractCompanies: {
      type: Array as PropType<ApiResponse.ContractCompany[]>,
      required: true,
    },
    orders: {
      type: Array as string[],
      required: true,
    },
  },
  data() {
    return {
      sortMenuName: '' as String,
    };
  },
  computed: {
    selectedOrder: {
      get(): string[] {
        return this.orders;
      },
      set(v: string[]) {
        this.$router.push({
          path: '/system-admin/contract-company',
          query: { page: 1, orders: v },
        });
      },
    },
    storageAdd(): string {
      return (contractCompany: ApiResponse.ContractCompany) => {
        if (contractCompany.contract_plan.pivot.storage_add) {
          return `、追加容量${contractCompany.contract_plan.pivot.storage_add}GB`;
        }
        return '';
      };
    },
    maxMember(): string {
      return (contractCompany: ApiResponse.ContractCompany) => {
        if (contractCompany.contract_plan.type !== 'free') {
          return `、ご利用人数${contractCompany.contract_plan.pivot.max_member}人`;
        }
        return '';
      };
    },
  },
  async created() {
    (document as HTMLElement).onclick = (e: any) => {
      // @ts-ignore
      const classList = `,${e.path
        .map((item: any) => {
          return item.className;
        })
        .join(',')
        .replace(/\s/g, ',')},`;
      if (
        !classList.includes(',sort-toggle-button,') &&
        !classList.includes(',sort-menu,')
      ) {
        this.sortMenuName = '';
      }
    };
  },
  methods: {
    toggleSortMenu(name: string) {
      if (this.sortMenuName === name) {
        this.sortMenuName = '';
      } else {
        this.sortMenuName = name;
      }
    },
    sortBy(order: string = '') {
      if (order !== '') {
        this.selectedOrder = [order];
      } else {
        this.selectedOrder = [];
      }
    },
    getSelected(field: any) {
      if (this.selectedOrder.includes(field)) {
        return field;
      }
      if (this.selectedOrder.includes(`-${field}`)) {
        return `-${field}`;
      }
      return '';
    },
    formatedDate(time: number) {
      return dayjs(time).format('YYYY-MM-DD');
    },
    statusToJapanese(status: string) {
      switch (status) {
        case 'unsettled':
          return '未決済';
        case 'payment_completed':
          return '決済完了';
        case 'stopping':
          return '停止中';
        case 'withdraw':
          return '退会';
        default:
          return '-';
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  border: solid 1px $light_gray_blue_3;

  th,
  td {
    border: solid 1px $light_gray_blue_3;
    vertical-align: middle;

    a {
      color: inherit;
      text-decoration: underline;
    }

    &.center {
      text-align: center;
    }

    &.organization-name {
      width: 300px;
    }

    &.name {
      width: 360px;
    }

    &.position {
      width: 243px;
    }
  }

  th {
    color: $gray_blue_4;
    background-color: $white_1;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    padding: 8px;

    .head-inner {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      .sort-toggle-button {
        display: contents;

        img {
          margin-left: 7px;
        }
      }

      .sort-menu {
        position: absolute;
        top: 100%;
        left: -3px;
        min-width: calc(100% + 6px);
      }
    }
  }

  td {
    color: $dark_blue;
    background-color: $true_white;
    font-size: 15px;
    font-weight: 300;
    padding: 10px;
  }

  .changed-label {
    display: inline-block;
    position: relative;
    top: -1px;
    width: 40px;
    height: 18px;
    line-height: 18px;
    font-size: 13px;
    text-align: center;
    border-radius: 4px;
    margin-right: 5px;
    color: $true_white;
    background: $gray_1;
  }
}
</style>
