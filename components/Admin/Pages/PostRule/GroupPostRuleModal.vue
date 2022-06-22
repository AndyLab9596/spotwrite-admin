<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <p class="title">{{ positionName }}メンバーの投稿ルール</p>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div class="table-container">
          <div v-if="isLoaded && users.length <= 0" class="has-no-member">
            <p>メンバーが存在しません。</p>
          </div>
          <table v-if="users.length" border>
            <tr>
              <th class="relative">
                <div>
                  氏名
                  <svg
                    id="Icon_pulldown"
                    class="sort"
                    data-name="Icon/pulldown"
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    @click="showSortDialog = true"
                  >
                    <path
                      id="Path_845"
                      data-name="Path 845"
                      d="M450.361,106.779l-4.549,7.06a.44.44,0,0,1-.746,0l-4.549-7.06a.471.471,0,0,1,.373-.733h9.1A.471.471,0,0,1,450.361,106.779Z"
                      transform="translate(-440.439 -106.046)"
                      fill="#7e8195"
                    />
                  </svg>
                </div>
                <div v-if="showSortDialog" class="sort-dialog">
                  <ul>
                    <li
                      :class="{ selected: 'asc' === orderStates }"
                      @click="sortByName()"
                    >
                      あ→んの順
                    </li>
                    <li
                      :class="{ selected: 'desc' === orderStates }"
                      @click="sortByName('desc')"
                    >
                      ん→あの順
                    </li>
                    <li @click="sortByName()">
                      順番を元に戻す
                    </li>
                  </ul>
                </div>
              </th>
              <th class="post-rule">マイエピソード</th>
              <th class="post-rule">チームエピソード</th>
              <th class="post-rule">プロフィール更新</th>
              <th class="alert">投稿アラート</th>
            </tr>
            <tr v-for="(user, i) in users" :key="i">
              <td>{{ user.name }}</td>
              <td>
                <SelectPostRuleMember
                  v-model="user.my_episode"
                  :rule="configRules.my_episode"
                  :has-rule="user.has_rule"
                  @input="updateOrganizationUserRule(user)"
                />
              </td>
              <td>
                <SelectPostRuleMember
                  v-model="user.team_episode"
                  :has-rule="user.has_rule"
                  :rule="configRules.team_episode"
                  @input="updateOrganizationUserRule(user)"
                />
              </td>
              <td>
                <SelectPostRuleMember
                  v-model="user.profile"
                  :has-rule="user.has_rule"
                  :rule="configRules.profile"
                  @input="updateOrganizationUserRule(user)"
                />
              </td>
              <td>
                <SelectAlert
                  v-model="user.alert"
                  :has-rule="user.has_rule"
                  :rule="configRules.alert"
                  @input="updateOrganizationUserRule(user)"
                />
              </td>
            </tr>
          </table>

          <vue-loading
            v-if="!isLoaded"
            type="spin"
            color="#333"
            :size="{ width: '50px', height: '50px' }"
          ></vue-loading>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import { SelectAlert, SelectPostRuleMember } from '@/components/Admin/Pages/';
import {
  fetchOrganizationUserRule,
  updateOrganizationUserRule,
} from '@/libs/api';
import { VueLoading } from 'vue-loading-template';

type OrderState = 'asc' | 'desc' | '';
type Interval = 'normal' | 'slowly' | 'frequent';
type AlertLevel = 'normal' | 'strong' | 'weak';
type Rule = {
  my_episode: Interval;
  team_episode: Interval;
  profile: Interval;
  alert: AlertLevel;
};
type OrganizationRule = {
  uuid: string;
  name: string;
  my_episode: Interval;
  team_episode: Interval;
  profile: Interval;
  alert: AlertLevel;
  has_rule: boolean;
};

export default Vue.extend({
  components: {
    SelectAlert,
    SelectPostRuleMember,
    VueLoading,
  },
  props: {
    uuid: {
      type: String,
      required: true,
    },
    positionName: {
      type: String,
      required: true,
    },
    configRules: {
      type: Object,
      default: () => ({} as ApiResponse.ConfigRules),
    },
  },
  data() {
    return {
      users: [] as OrganizationRule[],
      showSortDialog: false,
      orderStates: '',
      isLoaded: false,
    };
  },
  async mounted() {
    await this.fetchUserRule();
    this.isLoaded = true;
  },
  methods: {
    sortByName(order: OrderState = 'asc') {
      if (order === 'asc') {
        this.users.sort((a: OrganizationRule, b: OrganizationRule) =>
          a.name.localeCompare(b.name, 'ja')
        );
      }

      if (order === 'desc') {
        this.users.sort(
          (a: OrganizationRule, b: OrganizationRule) =>
            -a.name.localeCompare(b.name, 'ja')
        );
      }

      this.orderStates = order;
      this.showSortDialog = false;
    },
    onClose() {
      this.$emit('onClose');
    },
    async fetchUserRule() {
      const {
        data: { rules },
      } = await fetchOrganizationUserRule(this.uuid);
      // @ts-ignore
      this.users = rules;
    },
    async updateOrganizationUserRule(user: OrganizationRule) {
      const rules = { ...user, uuid: this.uuid };
      await updateOrganizationUserRule(user.uuid, { rules });
      this.fetchUserRule();
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.modal-window {
  display: flex;
  flex-direction: column;
  width: 970px;
  height: 500px;
  background: $true_white;
  border-radius: 6px;
  padding: 18px;
  box-shadow: 0 0 3px 0 $light_gray;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
}

.icon-cross {
  cursor: pointer;
}

.table-container {
  overflow-y: auto;
  max-height: 400px;
}

table {
  width: 100%;
  background-clip: padding-box;
  border: solid 1px $light_gray_blue_3;

  th,
  td {
    border: solid 1px $light_gray_blue_3;
  }

  th {
    color: $gray_blue_4;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    z-index: 1;
    top: 0;
    background-color: $white_1;
    vertical-align: middle;
  }

  td {
    height: 40px;
    vertical-align: middle;
  }

  .post-rule {
    width: 150px;
    height: 40px;
  }

  .alert {
    width: 260px;
    height: 40px;
  }
}

// オーバーレイのトランジション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  // オーバーレイに包含されているモーダルウィンドウのトランジション
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

// ディレイを付けるとモーダルウィンドウが消えた後にオーバーレイが消える
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.modal-enter {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.relative {
  position: relative;
  width: 220px;
}

th > div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.sort {
  cursor: pointer;
}

.sort-dialog {
  position: absolute;
  right: 0;
  z-index: 10;
  padding: 4px 15px;
  text-align: left;
  background-color: $true_white;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;

  ul {
    list-style: none;

    li {
      position: relative;
      color: $gray_blue_4;
      cursor: pointer;
    }
  }

  .selected::before {
    content: '●';
    position: absolute;
    left: -10px;
    transform: scale(0.5, 0.5);
  }
}

.has-no-member {
  display: flex;
  width: 100%;
  height: 400px;
  justify-content: center;
  align-items: center;
}
</style>
