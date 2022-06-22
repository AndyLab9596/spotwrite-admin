<template>
  <header v-if="show" class="header">
    <div class="header-inner">
      <div class="left"></div>
      <div class="right">
        <div class="chip">
          <div class="user" @click="openMenu()">
            <span class="user-name">{{ userProfile.email }}</span>
          </div>
          <template v-if="isActiveMenu">
            <transition name="fade" appear>
              <ul class="menu">
                <li><a href="#" @click="onLogout($event)">ログアウト</a></li>
              </ul>
            </transition>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import { adminLogout } from '@/libs/api';
import { mapGetters } from 'vuex';

export default Vue.extend({
  data() {
    const hiddenHeaderPages = ['register', 'login'];
    return {
      show: !hiddenHeaderPages.includes(
        this.$router.currentRoute.name as string
      ),
      isActiveMenu: false,
      lock: false,
    };
  },
  computed: {
    ...mapGetters(['userProfile']),
  },
  watch: {
    $route() {
      const hiddenHeaderPages = ['register', 'login'];
      this.$data.show = !hiddenHeaderPages.includes(
        this.$router.currentRoute.name as string
      );
    },
  },
  methods: {
    async onLogout(event: MouseEvent) {
      event.preventDefault();
      try {
        await adminLogout();
        this.$accessor.clearAccessToken();
      } catch (err) {
        console.error(err);
      } finally {
        this.$router.push({ path: '/system-admin/login' });
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
  },
});
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 64px;
  background-color: $true_white;
}

img {
  position: relative;
  object-fit: contain;
  height: 32px;
}

@media screen and (max-width: 900px) {
  .header-inner {
    color: hotpink;
  }
}

.notifications {
  display: flex;
  align-items: center;
  border: solid 1px #989898;
  border-radius: 50px;
  background-color: $true_white;
  padding: 0 12px;
  cursor: pointer;
  transition: all 0.2s ease-in;

  &:hover {
    background-color: #f0f0f0;
  }

  &:active {
    background-color: $true_white;
  }
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
  }
}

.user-name {
  font-family: 'Lato', sans-serif;
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
  right: 10px;
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
  margin: 0 80px 0 40px;
  height: 100%;

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
</style>
