<template>
  <div class="container">
    <div class="tab">
      <base-tabs
        :items="tabs"
        :selected-tab="selectedTab"
        :auto-scroll="false"
        @change-tab="selectTab($event)"
      ></base-tabs>
    </div>

    <vue-loading
      v-if="isLoading"
      type="spin"
      class="loading"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    />

    <main v-else>
      <transition name="fade">
        <div v-if="selectedTab === 'all'">
          <section
            v-for="organization in filterOrganizationsByLayer(topLayer)"
            :key="organization.uuid"
            class="list"
          >
            <img
              class="company__logo"
              :src="`${organization.logo_image}`"
              :onerror="
                `document.getElementById('name-${organization.uuid}').style.display = null; this.remove();`
              "
            />
            <div
              :id="`name-${organization.uuid}`"
              class="company__logo--placeholder"
              :style="{ display: 'none' }"
            >
              {{ organization.name }}
            </div>
            <div class="company">
              <div
                class="company__favorite favorite"
                :class="'favorite--' + organization.is_favorite"
                @click.stop="updateFavorite(organization)"
              />
              <div class="company__box" @click="goToDetail(organization.uuid)">
                <img
                  class="company__image"
                  :src="getImageUrl(organization.main_image)"
                  :onerror="`this.src='${randomImage()}'`"
                />
                <div class="company__title">
                  <p class="company__group-name"></p>
                  <p class="company__name">{{ organization.name }}</p>
                </div>
                <div class="company__chips chips">
                  <div
                    v-if="
                      organization.subordinated_organization_count - 1 > 0 &&
                        organization.layer !== 0
                    "
                    class="kobusyo-num"
                  >
                    <img class="kobusyo-num__icon" src="/icon/kobusyo.svg" />
                    <span class="kobusyo-num__text">子BOX</span>
                    <span class="kobusyo-num__number">{{
                      organization.subordinated_organization_count - 1
                    }}</span>
                  </div>
                  <div
                    v-if="
                      organization.subordinated_organization_user_count.all > 0
                    "
                    class="people-num"
                  >
                    <span class="people-num__number">{{
                      limitedUserCount(organization)
                    }}</span
                    ><span class="people-num__unit">名</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="organization">
              <div
                v-for="childOrganization in getChildOrganizations(
                  organization.uuid,
                  subLayer
                )"
                :key="childOrganization.name"
                class="organization__box"
                @click="
                  fetchSubOrganizations(
                    childOrganization.name,
                    childOrganization.uuid
                  )
                "
              >
                <div
                  class="organization__favorite favorite"
                  :class="'favorite--' + childOrganization.is_favorite"
                  @click.stop="updateFavorite(childOrganization)"
                />
                <img
                  class="organization__image"
                  :src="getImageUrl(childOrganization.main_image)"
                  :onerror="`this.src='${randomImage()}'`"
                />
                <p class="organization__name">{{ childOrganization.name }}</p>
                <div class="organization__chips chips">
                  <div
                    v-if="
                      childOrganization.subordinated_organization_count - 1 > 0
                    "
                    class="kobusyo-num"
                  >
                    <img class="kobusyo-num__icon" src="/icon/kobusyo.svg" />
                    <span class="kobusyo-num__text">子BOX</span>
                    <span class="kobusyo-num__number">{{
                      childOrganization.subordinated_organization_count - 1
                    }}</span>
                  </div>
                  <div
                    v-if="
                      childOrganization.subordinated_organization_user_count
                        .all > 0
                    "
                    class="people-num"
                  >
                    <span class="people-num__number">{{
                      limitedUserCount(childOrganization)
                    }}</span
                    ><span class="people-num__unit">名</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </transition>
      <transition name="fade">
        <favorite-organizations
          v-if="selectedTab === 'favorite-organizations'"
          :organizations="organizations"
          :top-layer="topLayer"
          :sub-layer="subLayer"
          @update-favorite="updateFavorite($event)"
        />
      </transition>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Route } from 'vue-router';
import { VueLoading } from 'vue-loading-template';
import BaseTabs from '@/components/App/molecules/tabs/BaseTabs.vue';
import FavoriteOrganizations from '@/components/App/organisms/organizations/FavoriteOrganizations.vue';

import {
  fetchOrganizations,
  organizationFavorite,
  organizationUnFavorite,
} from '@/libs/api/app';

export default Vue.extend({
  layout: 'app/default',
  components: {
    VueLoading,
    BaseTabs,
    FavoriteOrganizations,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeRouteUpdate(to: Route, from: Route, next: Function) {
    this.selectedTab = to.query.tab ? String(to.query.tab) : 'all';
    next();
  },
  data() {
    return {
      isLoading: true as boolean,
      selectedTab: 'all' as string,
      organizations: [] as AppApiResponse.Organization[],
      topLayer: 0 as number,
      subLayer: 1 as number,
      isSubOrganization: false as boolean,
      tabs: [
        {
          id: 'all',
          name: 'すべて',
        },
        {
          id: 'favorite-organizations',
          name: 'お気に入り組織',
        },
      ],
      randomImages: [
        '/app/image/random/random1.png',
        '/app/image/random/random2.png',
        '/app/image/random/random3.png',
        '/app/image/random/random4.png',
        '/app/image/random/random5.png',
        '/app/image/random/random6.png',
        '/app/image/random/random7.png',
        '/app/image/random/random8.png',
        '/app/image/random/random9.png',
        '/app/image/random/random10.png',
        '/app/image/random/random11.png',
        '/app/image/random/random12.png',
        '/app/image/random/random13.png',
      ],
    };
  },
  async mounted() {
    this.isLoading = true;
    await this.fetchOrganizationData();
    this.isLoading = false;
  },
  methods: {
    selectTab(key: string) {
      this.selectedTab = key;
    },
    goToDetail(uuid: string) {
      this.$router.push({
        path: `/organizations/${uuid}`,
      });
    },
    async fetchOrganizationData() {
      try {
        const organizations = await fetchOrganizations({
          users_count: false,
        });
        this.organizations = organizations.data.organizations;
      } catch (e) {
        console.log(e);
      }
    },
    fetchSubOrganizations(name: string, uuid: string) {
      if (!this.isSubOrganization) {
        this.isLoading = true;
        this.isSubOrganization = true;

        this.organizations = this.organizations.filter(
          (e: AppApiResponse.Organization) => {
            if (e.name === '役員') {
              return e.relations.parent === uuid;
            }
            return e.relations.parent === uuid || e.name === name;
          }
        );

        // 子ボックスがない場合・組織詳細に移動
        if (this.organizations.length <= 1) {
          this.goToDetail(uuid);
        } else {
          this.topLayer = this.organizations[0].layer;
          this.subLayer = this.topLayer + 1;
        }

        this.isLoading = false;
      } else {
        this.goToDetail(uuid);
      }
    },
    filterOrganizationsByLayer(layer: number) {
      if (!this.isSubOrganization) {
        return this.organizations.filter(
          (organization: AppApiResponse.Organization) =>
            organization.layer === layer
        );
      }
      return this.organizations.filter(
        (organization: AppApiResponse.Organization) =>
          organization.layer === layer
      );
    },
    getSubOrganizations(uuid: string, layer: number) {
      return this.organizations.filter(
        (organization: AppApiResponse.Organization) =>
          organization.relations.parent === uuid &&
          organization.layer === layer &&
          organization.type !== 'independent'
      );
    },
    getChildOrganizations(uuid: string, layer: number) {
      if (!this.isSubOrganization) {
        return this.organizations.filter(
          (organization: AppApiResponse.Organization) =>
            organization.relations.company === uuid &&
            organization.layer === layer &&
            organization.type !== 'independent'
        );
      }
      return this.organizations.filter(
        (organization: AppApiResponse.Organization) =>
          organization.relations.parent === uuid &&
          organization.layer === layer &&
          organization.type !== 'independent'
      );
    },
    async updateFavorite(organization: AppApiResponse.Organization) {
      const getUpdatedOrganizatonOfFavorite = (
        uuid: string,
        isFavorite: boolean
      ) =>
        this.organizations.map((item: AppApiResponse.Organization) => {
          if (item.uuid === uuid) {
            return {
              ...item,
              is_favorite: isFavorite,
            };
          }
          return item;
        });

      if (organization.is_favorite) {
        this.organizations = getUpdatedOrganizatonOfFavorite(
          organization.uuid,
          false
        );
        await organizationUnFavorite(organization.uuid);
      } else {
        this.organizations = getUpdatedOrganizatonOfFavorite(
          organization.uuid,
          true
        );
        await organizationFavorite(organization.uuid);
      }
    },
    limitedUserCount(organization: AppApiResponse.Organization) {
      if (organization.type === 'company') {
        return organization.subordinated_organization_user_count.all
          .toString()
          .substring(0, 4);
      }
      return organization.subordinated_organization_user_count.all
        .toString()
        .substring(0, 3);
    },
    randomImage() {
      const randomIndex = Math.floor(Math.random() * this.randomImages.length);
      const randomImage = this.randomImages[randomIndex];

      return randomImage;
    },
    getImageUrl(url: string) {
      if (url) {
        return url;
      }

      return this.randomImage();
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  width: 800px;
  margin-top: 41px;
}

.loading {
  padding: 20px 0;
}

.tab {
  box-shadow: 0 3px 6px #dce5ef;
  margin-top: 16px;
}

.base-tabs {
  display: flex;
  color: #9c9da5;
}

.base-tabs::-webkit-scrollbar {
  width: 4px;
  height: 0;
}

.base-tabs::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #7e8195;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter,
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.list {
  box-shadow: 0 3px 6px #dce5ef;
  margin-top: 16px;
  padding-top: 20px;
  padding-bottom: 40px;
  text-align: center;
}

.favorite {
  background-repeat: no-repeat;
  background-size: 12px 16px;
  height: 16px;
  width: 12px;
  cursor: pointer;

  &--true {
    background-image: url('/app/icon/favorite_yellow.svg');
  }

  &--false {
    background-image: url('/app/icon/favorite_white.svg');
  }
}

.people-num {
  display: flex;
  align-items: center;
  font-size: 10px;
  color: #fff;
  background-color: #f09c9c;
  border-radius: 20px;
  height: 20px;
  min-width: 39px;
  margin-left: 5px;
  cursor: inherit;

  &__number {
    flex-grow: 1;
    font-size: 10px;
    font-weight: bold;
    padding-left: 4px;
  }

  &__unit {
    font-size: 10px;
    padding-right: 4px;
    -webkit-transform: scale(0.6);
  }
}

.kobusyo-num {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #fff;
  background-color: #7e8195;
  border-radius: 20px;
  padding: 0 4px 0 3px;
  height: 20px;
  min-width: 34px;
  cursor: inherit;

  &__number {
    font-size: 10px;
    font-weight: 600;
    margin-left: 3px;
  }

  &__text {
    font-size: 9px;
    font-weight: 600;
    margin-left: 2px;
  }
}

.logo {
  height: 24px;
  margin: 20px 0;
}

.company {
  text-align: center;
  margin: 0 40px;
  position: relative;

  &__favorite {
    position: absolute;
    top: 0;
    right: 0;
    margin: 16px;
    z-index: 1;
  }

  &__image {
    width: 720px;
    height: 180px;
    border-radius: 4px;
    display: block;
    object-fit: cover;
    object-position: center center;
  }

  &__box {
    position: relative;
    background: linear-gradient(to right, #f09c9c 0%, #b2b7d8 100%);
    border-radius: 4px;
    margin-top: 20px;
    z-index: 0;
    cursor: pointer;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.3),
        rgba(0, 0, 0, 0.1)
      );
    }
  }

  &__title {
    padding: 8px 0 14px 16px;
    position: absolute;
    bottom: 0;
    text-align: left;
  }

  &__group-name {
    font-size: 11px;
    color: #fff;
  }

  &__name {
    font-size: 15px;
    color: #fff;
    font-weight: bold;
  }

  &__chips {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 16px;
    display: flex;
    align-items: center;
  }
}

.organization {
  width: 720px;
  display: flex;
  flex-wrap: wrap;
  margin: 0 40px;
  position: relative;

  &__box {
    cursor: pointer;
    width: 174px;
    height: 115px;
    margin-top: 20px;
    position: relative;
    margin-right: 8px;
    background: linear-gradient(to right, #f09c9c 0%, #b2b7d8 100%);
    border-radius: 4px;
    z-index: 0;

    &:nth-of-type(4n) {
      margin-right: 0;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.3);
    }
  }

  &__favorite {
    position: absolute;
    top: 0;
    right: 0;
    margin: 17px;
    z-index: 1;
    cursor: pointer;
  }

  &__image {
    display: block;
    width: 174px;
    height: 115px;
    border-radius: 4px;
  }

  &__name {
    font-size: 12px;
    font-weight: bold;
    color: #fff;
    position: absolute;
    top: 0;
    display: flex;
    width: 100%;
    height: 100%;
    margin: 0;
    align-items: center;
    justify-content: center;
    padding: 0 25px;
  }

  &__chips {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 8px;
    display: flex;
    align-items: center;
  }
}

.company__logo {
  max-height: 24px;

  &--placeholder {
    font-size: 15px;
    font-weight: bold;
  }
}
</style>
