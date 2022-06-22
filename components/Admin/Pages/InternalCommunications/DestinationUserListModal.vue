<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <div class="title">未読・既読者リスト</div>
          <img src="/icon/icon_cross.svg" class="icon-cross" @click="onClose" />
        </div>
        <div class="modal-container">
          <div class="tabs">
            <div
              class="tab-wrapper"
              :class="{ active: active(`unread`) }"
              @click="selectedTab = `unread`"
            >
              <div class="tab">未読</div>
            </div>
            <div
              class="tab-wrapper"
              :class="{ active: active(`read`) }"
              @click="selectedTab = `read`"
            >
              <div class="tab">既読</div>
            </div>
          </div>
          <div v-show="selectedTab === 'unread'" class="contents">
            <div class="header-row-un-read-users">
              <base-checkbox
                label="全てにチェックを入れる"
                @change="allCheck(checked)"
              />
            </div>
            <div class="user-list-container">
              <div
                v-for="company in to_users.un_read_users.companies"
                :key="company.uuid"
              >
                <div class="company-name">{{ company.name }}</div>
                <div
                  v-for="user in company.users"
                  :key="user.uuid"
                  class="row-un-read-users"
                >
                  <label class="user-checkbox">
                    <base-checkbox
                      v-model="checkedUserUuids"
                      :value="user.uuid"
                    />
                    <div class="user-info">
                      <p class="user-name">{{ user.name }}</p>
                      <p class="user-position">
                        {{ user.main_organization }} | {{ user.position }}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div class="resend-button-container">
              <hr />
              <base-button
                :disabled="checkedUserUuids.length === 0 ? true : false"
                size="large"
                class="resend-button"
                @click="reSend"
              >
                再送信する
              </base-button>
            </div>
          </div>
          <div v-show="selectedTab === 'read'" class="contents read-contents">
            <div class="user-list-container user-list-container-read">
              <div
                v-for="company in to_users.read_users.companies"
                :key="company.uuid"
              >
                <div class="company-name">{{ company.name }}</div>
                <div v-for="user in company.users" :key="user.uuid">
                  <div class="user-info-read">
                    <div class="user-name">{{ user.name }}</div>
                    <div class="user-position">
                      {{ user.main_organization }} | {{ user.position }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

type UnReadUsers = {
  count: number;
  companies: Company[];
};

type ReadUsers = {
  count: number;
  companies: Company[];
};

type Company = {
  uuid: string;
  name: string;
  users: User[];
};

type User = {
  uuid: string;
  name: string;
  main_organization: string;
  position: string;
  email: string;
};

export default Vue.extend({
  components: {
    BaseCheckbox,
    BaseButton,
  },
  props: {
    users: {
      type: Object as any,
      required: true,
    },
  },
  data() {
    return {
      selectedTab: 'unread' as 'read' | 'unread',
      checked: false as boolean,
      checkedUserUuids: [] as Array<string>,
      to_users: {
        count: 0 as number,
        un_read_users: {
          count: 0 as number,
          companies: [] as Array<Company>,
        } as UnReadUsers,
        read_users: {
          count: 0 as number,
          companies: [] as Array<Company>,
        } as ReadUsers,
      } as any,
    };
  },
  computed: {
    active() {
      return (selectedTab: string): boolean => {
        return this.selectedTab === selectedTab;
      };
    },
  },
  mounted() {
    this.to_users = this.users;
  },
  methods: {
    unReadAllUsersChecked() {
      this.checkedUserUuids = this.to_users.un_read_users.companies
        .map((c: Company) => [...c.users])
        .flat()
        .map((n: User) => n.uuid);
    },
    onClose() {
      this.$emit('close');
    },
    reSend() {
      const unReadUsersIds = [...this.checkedUserUuids];
      const unReadUsers = [...this.to_users.un_read_users.companies]
        .map((c: Company) => [...c.users])
        .flat()
        .reduce((newList: any[], item: User) => {
          unReadUsersIds.forEach((uuid: string) => {
            if (item.uuid === uuid) {
              newList.push(item);
            }
          });
          return newList;
        }, []);
      const listCheckedUserUuids = [...this.checkedUserUuids].filter(
        (item: string) => item !== this.$accessor.userProfile.uuid
      );
      this.$emit('submit', listCheckedUserUuids, unReadUsers);
      this.onClose();
    },
    allCheck(isEnable: boolean) {
      if (!isEnable) {
        this.unReadAllUsersChecked();
        this.checked = true;
        return;
      }
      this.checkedUserUuids = [];
      this.checked = false;
    },
  },
});
</script>

<style lang="scss" scoped>
label,
.icon-cross,
.tab-wrapper {
  cursor: pointer;
}

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
  width: 380px;
  height: 650px;
  background: $true_white;
  border-radius: 6px;
  padding: 20px 30px;
  box-shadow: 0 0 3px $light_gray;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 39px;
  position: relative;
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: $dark_blue;
  line-height: 1;
}

.modal-contents {
  display: flex;
  flex-direction: column;
  padding-top: 18px;
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

.w-100 {
  width: 100%;
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}

.tab-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  border-bottom: 3px solid $gray_blue_1;
}

.tab {
  font-size: 15px;
  font-weight: 300;
  margin-bottom: 14px;
  color: $gray_blue_1;
  line-height: 1;
}

.active {
  font-weight: 600;
  border-bottom: 3px solid $pink;

  .tab {
    color: $pink;
  }
}

.icon-cross {
  position: absolute;
  top: -10px;
  right: -20px;
  width: 28px;
}

.header-row-un-read-users {
  display: flex;
  padding-bottom: 11px;
  border-bottom: 1px solid $light_gray_blue_3;
}

.row-un-read-users {
  display: flex;
  margin-bottom: 11px;
}

.row-read-users {
  display: flex;
  margin-bottom: 13px;
}

.user-position {
  font-size: 12px;
  color: $dark_blue;
  font-weight: 300;
  line-height: 1;
}

.user-checkbox {
  display: flex;
  align-items: flex-start;
  margin-right: 20px;
  height: 40px;
}

.company-name {
  font-weight: 600;
  color: $dark_blue;
  font-size: 15px;
  margin: 18px 0 12px 0;
  line-height: 1;
}

.all-checked {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: $gray_blue_4;
  font-weight: 300;
}

.resend-button-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 10px;

  hr {
    border-top: solid $light_gray_blue_3;
    border-width: 1px 0 0;
    margin-top: 5px;
    margin-bottom: 20px;
  }

  .resend-button {
    width: 200px;
    margin: auto;
  }
}

.user-list-container {
  overflow-y: scroll;
  max-height: 420px;

  &::-webkit-scrollbar {
    -webkit-appearance: scrollbarthumb-vertical;
  }
}

.user-list-container-read {
  max-height: 490px;
}

.user-name {
  font-size: 15px;
  font-weight: 300;
  color: $dark_blue;
  margin-bottom: 3px;
  line-height: 1;
}

.user-info {
  margin: 0 0 0 6px;
}

.user-info-read {
  margin: 0 0 13px 0;
}

.checkbox-wrapper /deep/ .checkbox-text {
  color: gray;
}

.checkbox-wrapper /deep/ .checkbox-label {
  padding: 0 0 0 26px;
  font-size: 14px;
  color: $gray_blue_4;
}
</style>
