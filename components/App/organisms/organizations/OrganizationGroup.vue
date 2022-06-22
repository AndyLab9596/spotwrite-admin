<template>
  <div>
    <section
      v-for="organization in filterOrganizationsByLayer(0)"
      :key="organization.uuid"
      class="list"
    >
      <img
        class="company__logo"
        :src="organization.logo_image"
        onerror="this.remove()"
      />
      <div class="company">
        <div
          class="company__favorite favorite"
          :class="'favorite--' + organization.is_favorite"
          @click="$emit('update-favorite', organization)"
        />
        <div class="company__box" @click="goToDetail(organization.uuid)">
          <img
            class="company__image"
            :src="getImageUrl(organization.main_image)"
            onerror="this.remove()"
          />
          <div class="company__title">
            <p class="company__group-name"></p>
            <p class="company__name">{{ organization.name }}</p>
          </div>
          <div class="company__chips chips">
            <label
              v-if="organization.subordinated_organization_count > 0"
              class="kobusyo-num"
            >
              <img class="kobusyo-num__icon" src="/icon/kobusyo.svg" />
              <span class="kobusyo-num__number">{{
                organization.subordinated_organization_count
              }}</span>
            </label>
            <label
              v-if="organization.subordinated_organization_user_count.all > 0"
              class="people-num"
              ><span class="people-num__number">{{
                limitedUserCount(organization)
              }}</span
              >名</label
            >
          </div>
        </div>
      </div>
      <div class="organization">
        <div
          v-for="childOrganization in getChildOrganizations(
            organization.uuid,
            1
          )"
          :key="childOrganization.name"
          class="organization__box"
          @click="goToDetail(childOrganization.uuid)"
        >
          <div
            class="organization__favorite favorite"
            :class="'favorite--' + childOrganization.is_favorite"
            @click="$emit('update-favorite', childOrganization)"
          />
          <img
            class="organization__image"
            :src="getImageUrl(childOrganization.main_image)"
            onerror="this.remove()"
          />
          <p class="organization__name">{{ childOrganization.name }}</p>
          <div class="organization__chips chips">
            <label
              v-if="childOrganization.subordinated_organization_count > 0"
              class="kobusyo-num"
            >
              <img class="kobusyo-num__icon" src="/icon/kobusyo.svg" />
              <span class="kobusyo-num__number">{{
                childOrganization.subordinated_organization_count
              }}</span>
            </label>
            <label
              v-if="
                childOrganization.subordinated_organization_user_count.all > 0
              "
              class="people-num"
            >
              <span class="people-num__number">{{
                limitedUserCount(childOrganization)
              }}</span
              >名
            </label>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    organizations: {
      default: () => [],
      type: Array as PropType<ApiResponse.Organization[]>,
    },
  },
  methods: {
    goToDetail(uuid: string) {
      this.$router.push({
        path: `/organizations/${uuid}`,
      });
    },
    filterOrganizationsByLayer(layer: number) {
      return this.organizations.filter(
        (organization: ApiResponse.Organization) => organization.layer === layer
      );
    },
    getChildOrganizations(uuid: string, layer: number) {
      return this.organizations.filter(
        (organization: ApiResponse.Organization) =>
          organization.relations.company === uuid &&
          organization.layer === layer
      );
    },
    limitedUserCount(organization: ApiResponse.Organization) {
      if (organization.type === 'company') {
        return organization.subordinated_organization_user_count.all
          .toString()
          .substring(0, 4);
      }
      return organization.subordinated_organization_user_count.all
        .toString()
        .substring(0, 3);
    },
    getImageUrl(url: string) {
      if (url) {
        return url;
      }
      return '/app/image/no-image.png';
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  width: 800px;
  margin-top: 41px;
}

.tab {
  box-shadow: 0 3px 6px #dce5ef;
  margin-top: 16px;
  overflow: hidden;
}

.base-tabs {
  display: flex;
  overflow-x: scroll;
  white-space: nowrap;
  color: #9c9da5;
}

.tabs {
  cursor: pointer;
  list-style: none;
  overflow: hidden;
  color: #9c9da5;

  &__selected {
    background: linear-gradient(to right, #f09c9c 0%, #b2b7d8 100%);
    color: #f09c9c;
    font-weight: bold;
  }

  &__menu {
    text-align: center;
    width: 400px;
    float: left;
    height: 64px;

    &--name {
      height: 60px;
      line-height: 60px;
      font-size: 13px;
      background-color: #fff;
    }
  }
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
  justify-content: center;
  font-size: 10px;
  color: #fff;
  background-color: #f09c9c;
  border-radius: 20px;
  padding: 0 7px;
  height: 18px;
  min-width: 34px;
  margin-left: 5px;
  cursor: inherit;

  &__number {
    font-size: 11px;
    margin-right: 2px;
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
  padding: 0 7px;
  height: 18px;
  min-width: 34px;
  cursor: inherit;

  &__number {
    font-size: 11px;
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
        transparent,
        transparent
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
}
</style>
