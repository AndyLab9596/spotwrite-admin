<template>
  <div v-if="!isLoading" class="my-activity-container">
    <div class="activity-container">
      <activity-board :activities="activities" />
    </div>

    <div class="invited-event-container">
      <invited-event-header
        :is-participation-event="isPaticipationEvent"
        @onChangeParticipationEvent="changeParticipationEvent"
      />
      <invited-event-list
        :posts="posts"
        :is-participation-event="isPaticipationEvent"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';
import ActivityBoard from './user-activity/ActivityBoard.vue';
import InvitedEventList from './user-activity/InvitedEventList.vue';
import InvitedEventHeader from './user-activity/InvitedEventHeader.vue';

export default Vue.extend({
  components: {
    ActivityBoard,
    InvitedEventList,
    InvitedEventHeader,
  },
  props: {
    activities: {
      type: Object as PropType<AppApiResponse.Activity>,
      required: true,
      default: [],
    },
    posts: {
      type: Array as PropType<AppApiResponse.Post[]>,
      required: true,
      default: [],
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isPaticipationEvent: false as boolean,
    };
  },
  methods: {
    changeParticipationEvent(boolean: boolean) {
      this.isPaticipationEvent = boolean;
    },
  },
});
</script>

<style lang="scss" scoped>
.invited-event-container {
  margin: 40px auto 120px;
}
</style>
