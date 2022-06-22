<template>
  <header v-if="show" class="header">
    <FixedAlert v-if="isVisibleAlert && downgradingAlert" @close="onCloseAlert">
      <p>
        変更予定の「{{ downgradingAlert.plan.name }}{{ memberAdd
        }}{{ storageAdd }}」の条件を満たしておりません。
      </p>
      <p>
        次回契約更新日（{{
          downgradingAlert.change_at | dateFormat
        }}）までに条件を満たすよう調整をお願いします。
      </p>
      <p>
        期日までに条件が満たされない場合はプラン変更の予約はキャンセルとなります。
      </p>
      <ul>
        <li v-if="downgradingAlert.over.member">
          最大利用人数 ・・・
          {{ downgradingAlert.plan.max_member }}人まで（現在の人数{{
            downgradingAlert.over.member
          }}人）
        </li>
        <li v-if="downgradingAlert.over.storage">
          ストレージ利用量 ・・・
          {{ downgradingAlert.plan.max_storage }}GBまで（現在の利用量：{{
            downgradingAlert.over.storage
          }}GB）
        </li>
      </ul>
    </FixedAlert>
    <FixedAlert v-if="isVisibleAlert && hasFailedPayment" @close="onCloseAlert">
      <p>
        あと<span class="red">{{ paymentDeadline }}日で利用停止</span
        >となります。
      </p>
      <p>
        再決済をお願いします。
      </p>
    </FixedAlert>
    <FixedAlert v-if="isVisibleAlert && isStopStatus" @close="onCloseAlert">
      <p>
        期日までに決済が確認できなかったため、spotwriteは利用停止中です。
      </p>
      <p>
        再決済をお願いします。
      </p>
    </FixedAlert>
    <div class="header-inner">
      <div class="left">
        <nuxt-link
          v-if="userProfile.is_account_holder && !hideButtonSetting"
          tag="a"
          to="/admin/account-holder/settings"
        >
          <div class="setting">
            <img src="/icon/icon_pass.svg" />
            アカウントホルダー設定
          </div>
        </nuxt-link>
      </div>
      <div class="right">
        <div class="chip">
          <div class="user" @click="openMenu()">
            <span v-if="userProfile.is_account_holder" class="user-name">
              {{ userProfile.email }}
            </span>
            <span v-else class="user-name">
              {{ userProfile.name }}
            </span>
            <img
              v-if="userProfile.is_account_holder"
              src="/icon/icon_people_l@2x.svg"
            />
            <img
              v-else
              class="user-icon"
              :src="$accessor.userProfile.user_icon"
            />
          </div>
          <template v-if="isActiveMenu">
            <transition name="fade" appear>
              <ul class="menu">
                <li v-if="!userProfile.is_account_holder">
                  <nuxt-link
                    tag="a"
                    :to="
                      `/admin/employee-management/employees/${userProfile.uuid}`
                    "
                    >プロフィールを編集</nuxt-link
                  >
                </li>
                <li><a href="#" @click="onLogout($event)">ログアウト</a></li>
              </ul>
            </transition>
          </template>
        </div>
        <div
          v-if="!isDisabledItem('/admin/notice')"
          ref="notifications"
          class="notifications"
        >
          <nuxt-link to="/admin/notice">
            <img src="/icon/icon_rinrin@2x.png" />
          </nuxt-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import { timestampToDateString } from '@/libs/dayjs';
import dayjs from 'dayjs';
import { logout, fetchCurrentSubscription } from '@/libs/api';
import { mapGetters } from 'vuex';
import FixedAlert from '@/components/Admin/Modules/Alerts/FixedAlert.vue';
import { enumUserPermissions } from '@/libs/definition';

type ContractPlanDowngradingStatusBody = ApiResponse.ContractPlanDowngradingStatusBody;
const hiddenButtonSetting: any = ['admin-contract-info-change-plan'];

export default Vue.extend({
  components: {
    FixedAlert,
  },
  filters: {
    dateFormat(timestamp: number): string {
      return timestampToDateString(timestamp, 'YYYY年MM月DD日');
    },
  },
  props: {
    authorities: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const hiddenHeaderPages = ['register', 'login'];
    return {
      show: !hiddenHeaderPages.includes(
        this.$router.currentRoute.name as string
      ),
      hideButtonSetting: hiddenButtonSetting.includes(
        this.$router.currentRoute.name as string
      ),
      isActiveMenu: false,
      lock: false,
      isVisibleAlert: true,
    };
  },
  computed: {
    ...mapGetters(['userProfile']),
    downgradingAlert(): ContractPlanDowngradingStatusBody | undefined {
      if (this.$accessor.contract.downgradingStatus?.can_downgrade) {
        return undefined;
      }
      return this.$accessor.contract.downgradingStatus;
    },
    role(): Role {
      return this.$accessor.userProfile.is_account_holder
        ? 'account-holder'
        : 'employee-general';
    },
    enumUserPermissions(): object {
      return enumUserPermissions;
    },
    hasFailedPayment(): boolean {
      return this.$accessor.contract?.subscription?.status === 'past_due';
    },
    isStopStatus(): boolean {
      return this.$accessor.contract?.subscription?.status === 'stopped';
    },
    paymentDeadline(): number {
      if (this.$accessor.contract?.subscription?.end_at) {
        const dueDate = dayjs
          .unix(this.$accessor.contract?.subscription?.end_at)
          .startOf('D');
        return dueDate.diff(dayjs().startOf('D'), 'd');
      }
      return 0;
    },
    storageAdd(): string {
      if (this.downgradingAlert.plan.storage_add != null) {
        return `、追加容量${this.downgradingAlert.plan.storage_add}GB`;
      }
      return '';
    },
    memberAdd(): string {
      if (this.downgradingAlert.plan.type !== 'free') {
        return `、ご利用人数${this.downgradingAlert.plan.max_member}人`;
      }
      return '';
    },
  },
  watch: {
    $route() {
      const hiddenHeaderPages = ['register', 'login'];
      this.$data.show = !hiddenHeaderPages.includes(
        this.$router.currentRoute.name as string
      );
      this.$data.hideButtonSetting = hiddenButtonSetting.includes(
        this.$router.currentRoute.name as string
      );
    },
  },
  mounted() {
    // TODO: 最新の通知の件数をスタイルの反映するようにする。API側の修正が必要なため一旦コメントアウト
    // const targetElement = this.$refs.notifications as HTMLElement;
    // const notificationCount = 1;
    // targetElement.setAttribute('data-title', notificationCount.toString());

    setTimeout(() => {
      this.refreshStatus();
    }, 200);
  },
  methods: {
    async onLogout(event: MouseEvent) {
      event.preventDefault();
      const isAccountHolder = this.userProfile.is_account_holder;
      try {
        await logout();
        this.$accessor.logout();
      } catch (err) {
        console.error(err);
      } finally {
        // アカウントホルダーだった場合
        if (isAccountHolder) {
          this.$router.push({ path: '/admin/account-holder/login' });
        } else {
          this.$router.push({ path: '/admin/login' });
        }
      }
    },
    async refreshStatus() {
      if (
        !this.isStopStatus &&
        Number(this.$accessor.contract?.subscription?.end_at) <= dayjs().unix()
      ) {
        const { data } = await fetchCurrentSubscription();
        this.$accessor.contract.storeSubscription(data);
      }
    },
    openMenu() {
      this.isActiveMenu = true;
      this.lock = true;
      setTimeout(() => {
        this.lock = false;
        if (document == null) {
          return;
        }
        const d: any = document;
        d.getElementById('__nuxt').addEventListener(
          'click',
          this.closeMenu,
          false
        );
      }, 250);
    },
    closeMenu() {
      if (this.lock || document == null) {
        return;
      }
      this.isActiveMenu = false;
      const d: any = document;
      d.getElementById('__nuxt').removeEventListener(
        'click',
        this.closeMenu,
        false
      );
    },
    onCloseAlert(): void {
      this.isVisibleAlert = false;
    },
    isDisabledItem(fullPath: string) {
      if (!fullPath) {
        return true;
      }
      if (this.enumUserPermissions[this.role].all.includes(fullPath)) {
        return false;
      }
      return !this.authorities.filter((authority: string) =>
        this.enumUserPermissions[this.role][authority].includes(fullPath)
      ).length;
    },
  },
});
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 64px;
  background-color: $true_white;
}

.notifications {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  cursor: pointer;
  transition: all 0.2s ease-in;

  img {
    position: relative;
    object-fit: contain;
    height: 32px;
  }

  // TODO: 最新の通知の件数を出すようにするが、API側の修正が必要なため一旦コメントアウト
  //  &::after {
  //    content: attr(data-title);
  //    position: absolute;
  //    top: 16px;
  //    right: 0;
  //    width: 15px;
  //    height: 15px;
  //    background-color: $red_1;
  //    border-radius: 50%;
  //    color: $true_white;
  //    font-family: 'Lato', sans-serif;
  //    font-size: 11px;
  //    letter-spacing: 0;
  //    line-height: 1em;
  //    display: flex;
  //    align-items: center;
  //    justify-content: center;
  //  }
}

.user {
  display: flex;
  align-items: center;
  margin: 0 8px 0 0;
  cursor: pointer;
  height: 100%;
  transition: all 0.2s ease-in;

  img {
    border-radius: 12px;
    border: 1px solid $light_gray_blue_3;
    object-fit: contain;
    width: 32px;
    height: 32px;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.16);

    &.user-icon {
      object-fit: cover;
    }
  }
}

.user-name {
  font-size: 11px;
  letter-spacing: 0;
  line-height: 1em;
  color: $pink;
  font-weight: 700;
  margin: 0 10px 0 0;
  white-space: nowrap;
}

.chip {
  position: relative;
}

.menu {
  position: absolute;
  width: 190px;
  top: 55px;
  right: 8px;
  padding: 17px 15px 13px 15px;
  border: solid 1px $light_gray_blue_3;
  background-color: $true_white;
  border-radius: 4px;
  z-index: 1;

  li {
    margin: 13px 0 0 0;

    &:first-of-type {
      margin: 0 0 0 0;
    }
  }

  a {
    display: block;
    font-family: 'Hiragino Kaku Gothic Pro', sans-serif;
    font-size: 13px;
    font-weight: 300;
    line-height: 1em;
    color: $pink;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.header-inner {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  max-width: 1000px;
  margin-left: 40px;

  @media screen and (min-width: 1200px) {
    margin-right: 20px;
  }

  .left {
    display: flex;
    flex-direction: row;
    align-items: center;

    .setting {
      display: flex;
      align-items: center;
      width: 184px;
      height: 30px;
      color: $gray_blue_4;
      background-color: $light_gray_blue_4;
      border: 1px solid $light_gray_blue_3;
      border-radius: 4px;
    }
  }

  .right {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
}

.red {
  color: red;
}
</style>
