<template>
  <section class="member-section">
    <header>
      <img src="/app/icon/icon-trio.svg" />
      <h2 class="member-header">メンバー数</h2>
    </header>
    <div class="member-key">
      <div class="member-key__count">
        {{ members.length }}名（男{{ maleMemberCount }}名 / 女{{
          femaleMemberCount
        }}名 / その他{{ otherGenderCount }}名）
      </div>
      <div class="member-key__submember">
        <span class="submember-bar">|</span
        ><span class="submember-dot"></span>サブメンバー
      </div>
    </div>
    <div class="member-list">
      <div
        v-for="member in members"
        :key="member.user_uuid"
        class="member-list__item"
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
        <div class="employment-position">
          {{ member.employmentPosition }}
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
    maleMemberCount(): number {
      return this.members
        ? this.members.filter(
            (member: AppApiResponse.GroupedMember) => member.gender === 'man'
          ).length
        : 0;
    },
    femaleMemberCount(): number {
      return this.members
        ? this.members.filter(
            (member: AppApiResponse.GroupedMember) => member.gender === 'woman'
          ).length
        : 0;
    },
    otherGenderCount(): number {
      return this.members
        ? this.members.length - this.maleMemberCount - this.femaleMemberCount
        : 0;
    },
    members(): AppApiResponse.GroupedMember[] {
      return this.groupedMembers.flatMap(
        (item: AppApiResponse.GroupedOrganizationMember) =>
          item.users.map((user: AppApiResponse.GroupedMember) => ({
            ...user,
            employmentPosition: item.employment_position_name,
          }))
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.member-section {
  margin: 25px 0 12px 0;
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
  margin: 0 0 14px;

  &__count {
    margin: 7px 0 0 0;
    padding: 0 0 0 32px;
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

.member-list {
  padding: 5px 8px 0 28px;
  display: grid;
  grid-template-columns: repeat(auto-fit, 40px);
  gap: 16px 16px;
}

.member-list__item {
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
    border-bottom: 1px solid $link_color;
  }

  .employment-position {
    font-size: 11px;
    font-weight: normal;
    text-align: center;
    color: $gentle_bluish_purple;
  }
}
</style>
