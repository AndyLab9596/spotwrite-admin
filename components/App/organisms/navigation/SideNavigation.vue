<template>
  <div class="side-navigation-container">
    <div class="small-green">
      <div class="side-navigation-warp">
        <div class="side-navigation-header">
          <img
            src="@/assets/image/logo_s.png"
            class="logo-small-green"
            alt="Logo"
          />
          <bio-profile-small-screen
            class="side-navigation-bio-profile"
            size="small"
            :user-icon="$accessor.userProfile.user_icon"
            link="/my-page"
          />
        </div>
        <div class="side-navigation-link-container">
          <navigation-text-link
            v-for="(sideMenuAbove, index) in availableSideMenuAboveList"
            :key="index"
            class="navigation-text-link"
            :icon="sideMenuAbove.icon"
            :link="sideMenuAbove.link"
            :enable-external-link="!!sideMenuAbove.external"
            :target="sideMenuAbove.target"
            @re-render="reRender"
          />
          <navigation-text-link
            v-for="(sideMenuBelow, index) in availableSideMenuBelowList"
            :key="index + availableSideMenuAboveList.length"
            class="navigation-text-link"
            :icon="sideMenuBelow.icon"
            :link="sideMenuBelow.link"
            :enable-external-link="!!sideMenuBelow.external"
            :target="sideMenuBelow.target"
            @re-render="reRender"
          />
        </div>
      </div>
    </div>
    <div class="large-green">
      <div class="side-navigation-warp">
        <div class="side-navigation-header">
          <logo class="side-navigation-logo" />
          <bio-profile
            class="side-navigation-bio-profile"
            size="medium"
            :user-icon="$accessor.userProfile.user_icon"
            :user-name="$accessor.userProfile.name"
            :user-organization-name="$accessor.userProfile.organization_name"
            :user-position-name="$accessor.userProfile.position_name"
            :user-enrollment-text="$accessor.userProfile.enrollment_text"
            :user-enrollment-color="$accessor.userProfile.enrollment_color"
            :user-enrollment-description="
              $accessor.userProfile.enrollment_description
            "
            :bulletin-board="isBulletinBoard"
            link="/my-page"
          />
        </div>
        <div class="side-navigation-link-container">
          <navigation-text-link
            v-for="(sideMenuAbove, index) in availableSideMenuAboveList"
            :key="index"
            class="navigation-text-link"
            :icon="sideMenuAbove.icon"
            :text="sideMenuAbove.text"
            :link="sideMenuAbove.link"
            :enable-external-link="!!sideMenuAbove.external"
            :target="sideMenuAbove.target"
            @re-render="reRender"
          />
          <p class="navigation-text-sub-text">Company Data</p>
          <navigation-text-link
            v-for="(sideMenuBelow, index) in availableSideMenuBelowList"
            :key="index + availableSideMenuAboveList.length"
            class="navigation-text-link"
            :icon="sideMenuBelow.icon"
            :text="sideMenuBelow.text"
            :link="sideMenuBelow.link"
            :enable-external-link="!!sideMenuBelow.external"
            :target="sideMenuBelow.target"
            @re-render="reRender"
          />
          <span class="logout-button" @click="logout">ログアウト</span>
          <nuxt-link to="/admin" target="_blank">
            <img
              class="admin-button"
              :src="require(`@/assets/image/icon/menu-admin-button.svg`)"
            />
          </nuxt-link>
        </div>
        <small>&copy; 2021 Spotwrite</small>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { logout, fetchUser } from '@/libs/api/app';
import { mapGetters } from 'vuex';
import { enumUserPermissions } from '@/libs/definition';
import Logo from '../../atoms/images/Logo.vue';
import NavigationTextLink from '../../molecules/link/NavigationTextLink.vue';
import BioProfile from '../../molecules/profile/BioProfile.vue';
import BioProfileSmallScreen from '../../molecules/profile/BioProfileSmallScreen.vue';

type MenuItem = {
  text: string;
  icon: string;
  link: string;
  external?: boolean;
  target?: string;
};

export default Vue.extend({
  components: {
    Logo,
    NavigationTextLink,
    BioProfile,
    BioProfileSmallScreen,
  },
  props: {
    accessPermission: {
      type: String,
      default: 'all',
    },
  },
  data() {
    return {
      sideMenuAboveList: [
        {
          text: 'HOME',
          icon: 'home',
          link: '/',
        },
        {
          text: 'マイページ',
          icon: 'people',
          link: '/my-page',
        },
        {
          text: '社内連絡',
          icon: 'Internalcontact2',
          link: '/internal-communications',
          external: true,
        },
        {
          text: '社内PICK UP',
          icon: 'pickup',
          link: '/internal-communications-pickup',
          external: true,
        },
        // {
        //   text: '日報投稿',
        //   icon: 'dailyreport',
        //   link: '/app/daily-report-create',
        // },
        // {
        //   text: '日報管理',
        //   icon: 'dailyreport',
        //   link: '/app/daily-reports',
        // },
        {
          text: '分析ツール',
          icon: 'analysis',
          link: '/admin/analysis/useCheck',
          external: true,
          target: '_blank',
        },
        {
          text: '在籍掲示板',
          icon: 'board',
          link: '/bulletin-board',
        },
      ] as MenuItem[],
      sideMenuBelowList: [
        {
          text: '組織図',
          icon: 'chart',
          link: '/organizations',
        },
        {
          text: '会社データ',
          icon: 'data',
          link: '/company',
        },
        {
          text: 'イベント',
          icon: 'event3',
          link: '/events',
        },
        {
          text: 'コミュニティ',
          icon: 'community',
          link: '/communities',
        },
        /* {
          text: '社内ファイル',
          icon: 'folder',
          link: '/app/internal-files',
        }, */
      ] as MenuItem[],
      isBulletinBoard: false as boolean,
      authorities: null,
    };
  },
  computed: {
    ...mapGetters(['isEnableBulletinBoard', 'isEnableMotivation']),
    availableSideMenuAboveList(): MenuItem[] {
      return this.sideMenuAboveList.filter(
        (item: MenuItem) =>
          !this.isDisabledItem(item) &&
          (item.link !== '/bulletin-board' || this.isEnableBulletinBoard) &&
          (item.link !== '/admin/analysis/mentalCheck' ||
            this.isEnableMotivation)
      );
    },
    availableSideMenuBelowList(): MenuItem[] {
      return this.sideMenuBelowList.filter(
        (item: MenuItem) =>
          !this.isDisabledItem(item) &&
          (item.link !== '/bulletin-board' || this.isEnableBulletinBoard) &&
          (item.link !== '/admin/analysis/mentalCheck' ||
            this.isEnableMotivation)
      );
    },
    enumUserPermissions(): object {
      return enumUserPermissions;
    },
  },
  async created() {
    const { data } = await fetchUser(this.$accessor.userProfile.uuid);
    this.authorities = data.authorities;
    this.$emit('change-access-permission', data.access_permission);
    this.isBulletinBoard = this.isEnableBulletinBoard;
    const payload = {
      color_code: data.enrollment_color,
      text: data.enrollment_text,
      description: data.enrollment_description,
    } as AppApiRequest.EnrollmentStatus;
    this.$accessor.setEnrollmentStatus(payload);
  },
  async mounted() {
    // @ts-ignore
    this.$echo
      .channel(`updateUser.${this.$accessor.userProfile.uuid}`)
      .listen('UpdateProfile', (e: any) => {
        const body = JSON.parse(e.body);
        if (body.uuid === this.$accessor.userProfile.uuid) {
          this.$accessor.setUserProfile(body.user_info);
        }
      });
  },
  async destroyed() {
    // @ts-ignore
    this.$echo
      .channel(`updateUser.${this.$accessor.userProfile.uuid}`)
      .stopListening('UpdateProfile');
  },
  methods: {
    async logout() {
      try {
        await logout();
        this.$accessor.clearAccessToken();
      } catch (err) {
        console.error(err);
      } finally {
        this.$router.push({ path: '/login' });
      }
    },
    isDisabledItem(item: MenuItem) {
      if (!item.link) {
        return true;
      }
      if (['/admin/analysis/useCheck'].includes(item.link)) {
        if (
          !this.authorities?.read_motivation_analytics?.length &&
          !this.authorities?.read_usage_check?.length &&
          !this.authorities?.admin?.length
        ) {
          return true;
        }
        return false;
      }
      if (
        this.enumUserPermissions['access-permission'].all.includes(item.link)
      ) {
        return false;
      }
      return !this.enumUserPermissions['access-permission'][
        this.accessPermission
      ].includes(item.link);
    },
    reRender() {
      this.$emit('re-render');
    },
  },
});
</script>

<style lang="scss" scoped>
.side-navigation-container {
  display: flex;
  flex-direction: column;
  margin-left: 80px;
  min-width: 130px;
  width: fit-content;
  position: sticky;
  height: 100vh;
  top: 0;
  z-index: 10;
}

.side-navigation-warp {
  min-height: 100vh;
  height: max-content;
}

.side-navigation-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
}

.side-navigation-logo {
  margin-top: 40px;
  margin-bottom: 32px;
}

.side-navigation-bio-profile {
  margin-left: 44px;
}

.navigation-text-link {
  margin-bottom: 8px;
}

.navigation-text-link:last-child {
  margin-bottom: 64px;
}

.navigation-text-sub-text {
  color: $sub_color;
  margin-top: 22px;
  margin-bottom: 24px;
}

small {
  color: $sub_color;
  font-size: 11px;
  margin-bottom: 12px;
}

.logout-button {
  display: flex;
  cursor: pointer;
}

.large-green {
  display: block;
}

.small-green {
  display: none;
}

.admin-button {
  margin-top: 31px;
  margin-bottom: 11px;
}

@media screen and (max-width: 1080px) {
  .large-green {
    display: none;
  }

  .small-green {
    display: block;
  }

  .side-navigation-container {
    display: flex;
    flex-direction: column;
    margin-left: 1px;
    min-width: 66px;
    position: sticky;
    height: 100vh;
    top: 0;
    z-index: 10;
    border-right: 1px solid #e4e5ed;
  }

  .side-navigation-bio-profile {
    margin-left: 10px;
  }

  .navigation-text-link {
    margin-left: 24px;
    margin-bottom: 29px;
  }

  .logo-small-green {
    margin-top: 40px;
    margin-bottom: 40px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
