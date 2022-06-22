<template>
  <div v-if="show" class="sidebar">
    <div class="logo">
      <nuxt-link tag="a" to="/admin">
        <img src="/image/logo.svg" />
      </nuxt-link>
    </div>
    <div class="top-buttons">
      <!-- TODO: 権限まわりを実装する人へ。「チーム利用度閲覧権限」のみ付与されているメンバーは「分析ツール」ボタンをクリックで利用度チェックページへ遷移させてください。 -->
      <side-menu-outlined-button
        v-for="(sideButton, index) in availableSideButtonList"
        :key="index"
        :text="sideButton.name"
        :icon="sideButton.icon"
        :to="sideButton.path"
        :items="sideButton.items"
        :button-index="index"
        class="button-item"
      />
    </div>

    <div class="accordion-wrapper">
      <p class="accordion-wrapper-title">Menu</p>
      <Accordion
        v-for="(sideMenu, index) in availableSideMenuList"
        :key="index"
        :title="sideMenu.title"
        :icon-path="sideMenu.iconPath"
        :body="sideMenu.items"
      />
      <p class="copyright">&copy; 2021 Spotwrite</p>
      <nuxt-link
        v-if="availableContactButton"
        tag="a"
        to="/admin/send-contact"
        class="sendContact"
      >
        <img src="/icon/Icon-mail_s.png" class="icon-sendmail" />
        <p>お問い合わせ</p>
      </nuxt-link>
      <a href="#" class="logout" @click="onLogout($event)">
        <img src="/icon/icon_login@2x.png" class="icon-logout" />
        <p>Log out</p>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Accordion from '@/components/Admin/Modules/Accordion/Accordion.vue';
import { logout } from '@/libs/api';
import SideMenuOutlinedButton from '@/components/Admin/Modules/Button/SideMenuOutlinedButton.vue';
import { enumUserPermissions } from '@/libs/definition';

const roles = [
  'account-holder',
  'employee-general',
  'employee-analysis',
  'employee-private',
  'employee-admin',
] as const;

type Role = typeof roles[keyof typeof roles];

type MenuButton = {
  name: string;
  path: string;
  icon?: string;
  items?: MenuButton[];
};

type MenuItem = {
  name: string;
  path: string;
  items?: MenuItem[];
};

type MenuGroup = {
  title: string;
  iconPath: string;
  items: MenuItem[];
};

export default Vue.extend({
  components: {
    Accordion,
    SideMenuOutlinedButton,
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
      sideButtonList: [
        {
          name: '初期設定サポート',
          icon: '/icon/icon_beginner.svg',
          path: '/admin',
        },
        {
          name: '社内連絡の投稿',
          icon: '/icon/icon_speaker@2x.png',
          path: '/admin/internal-communications',
        },
        {
          name: '分析ツール',
          icon: '/icon/icon_data.svg',
          items: [
            {
              name: '利用度チェック',
              path: '/admin/analysis/useCheck',
            },
            {
              name: 'モチベーションチェック',
              path: '/admin/analysis/mentalCheck',
            },
          ],
        },
        {
          name: '記事テーマの設定',
          icon: '/icon/icon_pen.svg',
          path: '/admin/article-theme',
        },
        /* {
          name: '社内ファイル',
          icon: '/icon/icon_folder.svg',
          path: '/admin/company-files',
        }, */
      ] as MenuButton[],
      sideMenuList: [
        {
          title: '新規登録',
          iconPath: '/icon/icon_chart.svg',
          items: [
            {
              name: '組織（BOX)登録',
              path: '/admin/organization-management/organizations/registration',
            },
            {
              name: 'メンバー登録',
              path: null,
              items: [
                {
                  name: '必須項目登録',
                  path: '/admin/employee-management/registration',
                },
                {
                  name: '追加項目登録',
                  path: '/admin/employee-management/addition',
                },
              ],
            },
            {
              name: 'コミュニティ登録',
              path: '/admin/community-management/registration',
            },
          ],
        },
        {
          title: '一覧・編集',
          iconPath: '/icon/icon_list.svg',
          items: [
            {
              name: '組織一覧・編集',
              path: '/admin/organization-management/organizations',
            },
            {
              name: 'メンバー一覧・編集',
              path: '/admin/employee-management/employees/list/1',
            },
            {
              name: 'コミュニティ一覧・編集',
              path: '/admin/community-management',
            },
          ],
        },
        {
          title: '設定',
          iconPath: '/icon/icon_setting@2x.png',
          items: [
            {
              name: '投稿ルール一覧',
              path: '/admin/post-rule/organization',
            },
            {
              name: 'オプション権限一覧・設定',
              path: '/admin/authority-setting',
            },
            {
              name: 'マスタ設定',
              path: '/admin/master-setting',
            },
            {
              name: '機能追加',
              path: '/admin/extensions',
            },
          ],
        },
        {
          title: 'CSV一括登録',
          iconPath: '/icon/icon_upload.svg',
          items: [
            {
              name: 'CSV一括登録',
              path: '/admin/employee-management/employees/bulk-registration',
            },
          ],
        },
        {
          title: 'アカウント管理',
          iconPath: '/icon/icon_people.svg',
          items: [
            {
              name: 'アカウント管理',
              path: '/admin/account-management',
            },
          ],
        },
        {
          title: '契約情報管理',
          iconPath: '/icon/icon_pass.svg',
          items: [
            {
              name: '契約情報',
              path: '/admin/contract-info',
            },
            {
              name: '支払い履歴',
              path: '/admin/payment-history',
            },
          ],
        },
      ] as MenuGroup[],
      show: !hiddenHeaderPages.includes(
        this.$router.currentRoute.name as string
      ),
    };
  },
  computed: {
    /**
     * TODO 従業員ユーザーの権限制御を追加してください
     */
    role(): Role {
      return this.$accessor.userProfile.is_account_holder
        ? 'account-holder'
        : 'employee-general';
    },
    availableSideButtonList(): MenuButton[] {
      return this.sideButtonList
        .map((menuButton: MenuButton) => {
          if (menuButton.items && menuButton.items.length) {
            const items = menuButton.items.filter(
              (item: MenuButton) => !this.isDisabledItem(item)
            );
            if (items.length) {
              return { ...menuButton, items, path: items[0].path };
            }
            return { ...menuButton, items };
          }
          return menuButton;
        })
        .filter((menuButton: MenuButton) => {
          return (
            !this.isDisabledItem(menuButton) ||
            (menuButton.items && menuButton.items.length)
          );
        });
    },
    /**
     * TODO MenuItem にも個別にロールによる制御を入れてください
     */
    availableSideMenuList(): MenuGroup[] {
      return this.sideMenuList
        .map((menuGroup: MenuGroup) => {
          const items = menuGroup.items
            .map((item: MenuItem) => {
              if (item.items && item.items.length) {
                const subItems = item.items.filter(
                  (subItem: MenuItem) => !this.isDisabledItem(subItem)
                );
                return { ...item, items: subItems };
              }
              return item;
            })
            .filter((item: MenuItem) => {
              return (
                !this.isDisabledItem(item) || (item.items && item.items.length)
              );
            });
          return { ...menuGroup, items };
        })
        .filter((menuGroup: MenuGroup) => {
          return menuGroup.items && menuGroup.items.length;
        });
    },
    enumUserPermissions(): object {
      return enumUserPermissions;
    },
    availableContactButton(): boolean {
      const adminFlag = !!this.authorities.filter((authority: string) =>
        this.enumUserPermissions[this.role][authority].includes(
          '/admin/send-contact'
        )
      ).length;
      return adminFlag || this.$accessor.userProfile.is_account_holder;
    },
  },
  watch: {
    $route() {
      const hiddenHeaderPages = ['register', 'login'];
      this.$data.show = !hiddenHeaderPages.includes(
        this.$router.currentRoute.name as string
      );
      this.fetchUserAuthorities();
    },
  },
  async created() {
    this.fetchUserAuthorities();
  },
  methods: {
    async onLogout(event: MouseEvent) {
      event.preventDefault();
      try {
        await logout();
        this.$accessor.logout();
      } catch (err) {
        console.error(err);
      } finally {
        this.$router.push({ path: '/admin/login' });
      }
    },
    async fetchUserAuthorities() {
      if (this.role === 'account-holder') {
        return;
      }
      const { authorities } = this.$accessor.userProfile;
      const userAuthorities = Object.keys(authorities).filter(
        (key: string) =>
          authorities[key] &&
          (key === 'read_personal_information' || authorities[key].length)
      );
      this.$emit('change-user-authorities', userAuthorities);
    },
    isDisabledItem(item: MenuItem | MenuButton) {
      if (!item.path) {
        return true;
      }
      if (this.enumUserPermissions[this.role].all.includes(item.path)) {
        return false;
      }
      return !this.authorities.filter((authority: string) =>
        this.enumUserPermissions[this.role][authority].includes(item.path)
      ).length;
    },
  },
});
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

.sidebar {
  width: 200px;
  flex-shrink: 0;
  border-right: solid 1px $light_gray_blue_3;
  background-color: $white_1;
  font-family: 'Hiragino Kaku Gothic Pro', sans-serif;
}

img {
  object-fit: contain;
}

.logo {
  display: flex;
  align-items: center;
  height: 150px;
  padding-left: 50px;

  img {
    width: 100px;
    height: 41.63px;
  }
}

.top-buttons {
  flex-flow: column;
  margin: 0 0 25px 0;
}

.button-item {
  margin: 0 20px 10px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.icon-logout {
  height: 14px;
  margin: 0 16px 0 0;
}

.accordion-wrapper-title {
  color: $pink;
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  font-size: 10px;
  margin: 0 0 10px 20px;
}

.copyright {
  text-align: center;
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 400;
  font-size: 10px;
  line-height: 1em;
  color: $pastel_blue;
  margin: 43px 0 71px;
  white-space: nowrap;
}

.logout {
  display: flex;
  flex-flow: row;
  align-items: center;
  border: none;
  background-color: transparent;
  margin: 0 0 20px 20px;

  p {
    font-family: 'Noto Sans JP', sans-serif;
    font-weight: 700;
    font-size: 12px;
    line-height: 1em;
    color: $pink;
    white-space: nowrap;
  }
}

.sendContact {
  display: flex;
  flex-flow: row;
  align-items: center;
  border: none;
  background-color: transparent;
  margin: 0 0 16px 20px;

  p {
    font-family: 'Noto Sans JP', sans-serif;
    font-weight: 700;
    font-size: 12px;
    line-height: 1em;
    color: $pink;
    white-space: nowrap;
  }
}

.icon-sendmail {
  height: 12px;
  margin: 0 13px 0 0;
}
</style>
