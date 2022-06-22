<template>
  <div class="user-info-tabs-container">
    <div
      class="tab"
      :class="selectedClass('profile')"
      @click="$emit('clicked', 'profile')"
    >
      プロフィール・配属履歴
    </div>
    <div
      class="tab"
      :class="selectedClass('qa')"
      @click="$emit('clicked', 'qa')"
    >
      Q&A
    </div>
    <div
      class="tab"
      :class="selectedClass('my-episode')"
      @click="$emit('clicked', 'my-episode')"
    >
      マイエピソード
    </div>
    <div
      class="tab"
      :class="selectedClass('communities')"
      @click="$emit('clicked', 'communities')"
    >
      参加コミュニティ
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  model: {
    prop: 'selectedTab',
    event: 'clicked',
  },
  props: {
    selectedTab: {
      type: String as PropType<Types.UserInfoSelectedTab>,
      required: true,
    },
  },
  computed: {
    selectedClass(): (name: string) => string {
      return (name: string): string => {
        if (name === this.selectedTab) {
          return 'selected';
        }
        return '';
      };
    },
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.user-info-tabs-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  .tab {
    font-size: 12px;
    color: #888;
    padding: 8px 0;
    flex-grow: 1;
    text-align: center;
    cursor: pointer;

    &.selected {
      font-weight: 500;
      color: #f88;
      border-bottom: solid 4px #f88;
    }
  }
}
</style>
