<template>
  <section class="member-group-container">
    <header>
      <img src="/app/icon/icon-trio.svg" />
      <h2 class="member-header">メンバー数</h2>
    </header>
    <div class="member-key">
      <div class="member-key__count">
        {{ totalMembers }}名（男{{ maleMemberCount }}名 / 女{{
          femaleMemberCount
        }}名 / その他{{ otherGenderCount }}名）
      </div>
      <div class="member-key__submember">
        <span class="submember-bar">|</span
        ><span class="submember-dot"></span>サブメンバー
      </div>
    </div>
    <div
      v-for="group in groupedMembers"
      :key="group.employment_position_uuid"
      class="member-group"
    >
      <div v-if="group.users.length > 0">
        <h3 class="member-group__position">
          {{ group.employment_position_name }}
        </h3>
        <div class="member-group__list">
          <div
            v-for="member in group.users"
            :key="member.user_uuid"
            class="member-group__item"
          >
            <span v-if="member.priority === 'sub'" class="submember-dot"></span>
            <nuxt-link v-if="!isVisitor" :to="`/users/${member.user_uuid}`"
              ><img :src="member.user_icon" class="icon" width="44" height="44"
            /></nuxt-link>
            <img
              v-else
              :src="member.user_icon"
              class="icon"
              width="44"
              height="44"
            />
            <div class="name">{{ member.user_name }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    groupedMembers: {
      default: () => [],
      type: Array as PropType<AppApiResponse.GroupedOrganizationMember[]>,
    },
    isVisitor: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    allUsers(): any {
      return this.groupedMembers
        .map((e: AppApiResponse.GroupedOrganizationMember) => e.users)
        .flat();
    },
    totalMembers(): number {
      return this.allUsers.length;
    },
    maleMemberCount(): number {
      return this.allUsers
        ? this.allUsers.filter(
            (member: AppApiResponse.OrganizationMember) =>
              member.gender === 'man'
          ).length
        : 0;
    },
    femaleMemberCount(): number {
      return this.allUsers
        ? this.allUsers.filter(
            (member: AppApiResponse.OrganizationMember) =>
              member.gender === 'woman'
          ).length
        : 0;
    },
    otherGenderCount(): number {
      return this.totalMembers
        ? this.totalMembers - this.maleMemberCount - this.femaleMemberCount
        : 0;
    },
  },
});
</script>

<style lang="scss" scoped>
.member-group-container {
  margin: 25px 0 0 0;
  background: #fafbfc;
  padding: 0 12px;

  header {
    display: flex;
    align-items: center;

    img {
      margin: 0 7px 0 0;
    }
  }
}

.member-key {
  display: flex;
  justify-content: space-between;
  margin: 0 0 18px;

  &__count {
    margin: 7px 0 0 0;
    padding: 0 0 0 34px;
    line-height: 1;
  }

  &__submember {
    display: flex;
    justify-content: center;
    align-items: center;

    .submember-bar {
      color: $sub_color;
    }

    .submember-dot {
      display: block;
      margin: 0 5px 0 12px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: $marigold;
    }
  }
}

.member-group {
  padding: 0 0 0 30px;

  &:not(:last-of-type) {
    margin: 0 0 18px;
  }
}

.member-group__position {
  width: fit-content;
  margin: 0 0 3px;
  padding: 4px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 300;
  color: $chart_text;
  background: $gradient_6;
}

.member-group__list {
  padding: 5px 8px 0 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, 40px);
  gap: 16px 16px;
}

.member-group__item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  .submember-dot {
    position: absolute;
    top: 0;
    left: 3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: $marigold;
  }

  .icon {
    border-radius: 17px;
  }

  .name {
    margin: 10px 0 0 0;
    font-size: 11px;
    font-weight: 600;
    color: $main_color;
    text-align: center;
    padding: 0 0 4px;
  }
}
</style>
