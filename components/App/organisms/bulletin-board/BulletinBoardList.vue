<template>
  <div>
    <bulletin-board-list-item
      v-for="user in users"
      :key="user.uuid"
      :user="user"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BulletinBoardListItem from '@/components/App/organisms/bulletin-board/BulletinBoardListItem.vue';

export default Vue.extend({
  components: {
    BulletinBoardListItem,
  },
  props: {
    users: {
      type: Array as PropType<AppApiResponse.EmployeeUser[]>,
      required: true,
    },
  },
});
</script>
