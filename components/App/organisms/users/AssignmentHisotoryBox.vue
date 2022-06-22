<template>
  <div class="assignment-history-container">
    <div
      v-for="(assignmentHistory, index) in assignmentHistories"
      :key="index"
      class="assignment-history-row"
    >
      <div class="date">
        <span class="year">{{ assignmentHistory.joined_year }}</span>
        <span class="month">{{ assignmentHistory.joined_month }}</span>
      </div>
      <div class="balloon">
        <div class="head">
          {{ assignmentHistory.company_name }}
          {{ assignmentHistory.organization_name }}
        </div>
        <div class="content">
          {{ assignmentHistory.note }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  components: {},
  model: {
    prop: 'selectedTab',
    event: 'clicked',
  },
  props: {
    assignmentHistories: {
      type: Array as PropType<ApiResponse.assignmentHistories[]>,
      required: true,
    },
  },
  methods: {
    onTabClicked(clickedTab: string) {
      this.$emit('clicked', clickedTab);
    },
  },
});
</script>

<style lang="scss" scoped>
.assignment-history-container {
  display: flex;
  flex-direction: column;
  min-width: 600px;
  width: 100%;
  padding: 24px 20px 40px 20px;
  background-color: #fff;
  border-top: solid 1px #dce5ef;
}

.date {
  font-size: 13px;
  position: relative;
  width: 58px;
  margin-right: 18px;
  text-align: center;

  .month {
    color: #f09c9c;
    display: block;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      background: url('/app/icon/footprints.svg') no-repeat;
      bottom: -17px;
      width: 20px;
      height: 20px;
      left: 50%;
      transform: translate(-50%);
    }
  }
}

.assignment-history-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 24px;

  &:not(:last-child) {
    .date {
      &::after {
        content: '';
        background: url('/app/icon/dots.svg') no-repeat;
        position: absolute;
        bottom: -4px;
        width: 3px;
        height: 20px;
        left: 50%;
        transform: translate(-50%);
      }
    }
  }
}

.balloon {
  position: relative;
  padding: 16px 16px 19px 16px;
  width: 100%;
  color: #725661;
  font-size: 13px;
  background: linear-gradient(267deg, #fae6eb, #ebecf5);
  border-radius: 10px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -20px;
    border-style: solid;
    border-color: #ebecf5 transparent transparent;
    border-width: 20px;
  }

  .head {
    font-weight: bold;
  }
}
</style>
