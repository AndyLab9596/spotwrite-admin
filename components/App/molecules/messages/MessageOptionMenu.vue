<template>
  <div class="reaction-menu">
    <div v-if="canDelete" class="reaction-menu-img" @click="onDeleteIconClick">
      <tooltip>
        <template v-slot:activator>
          <img src="@/assets/image/icon-menu.svg" />
        </template>
        <span>削除</span>
      </tooltip>
    </div>
    <!--    <div class="reaction-menu-img">-->
    <!--      <img src="@/assets/image/reply.svg" class="menu-img-size svg-icon" />-->
    <!--    </div>-->
    <!-- <div class="reaction-menu-img" @click="clickReactionMenu">
      <img src="@/assets/image/ei-smiling_face.svg" class="menu-img-size" />
    </div> -->
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from '@/libs/dayjs';
import Tooltip from '../../atoms/Tooltip.vue';

export default Vue.extend({
  components: {
    Tooltip,
  },
  props: {
    message: {
      type: Object as PropType<ApiResponse.MessageItem>,
      required: true,
    },
  },
  computed: {
    canDelete(): boolean {
      return this.isOwnMessage(this.message) && this.isNotExpired(this.message);
    },
  },
  methods: {
    async onDeleteIconClick() {
      if (this.message.id === null) {
        return;
      }
      await this.$emit('delete', this.message.id);
    },
    async clickReactionMenu() {
      const message_uuid = this.message.id;
      await this.$emit('clickReactionMenu', message_uuid);
    },
    isOwnMessage(message: AppApiResponse.MessageItem): boolean {
      return message.user_info.uuid === this.$accessor.userProfile.uuid;
    },
    isNotExpired(message: AppApiResponse.MessageItem): boolean {
      if (message.id === null) {
        return true;
      }
      const createdAt = parseInt(message.id.split('_')[0], 10);
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(createdAt)) {
        return true;
      }
      return dayjs.unix(createdAt).diff(dayjs(), 'minute') >= -60;
    },
  },
});
</script>

<style lang="scss" scoped>
.reaction-menu-img {
  display: inline-block;
  width: 14px;
  margin: 0 10px;
  cursor: pointer;
}

.reaction-menu {
  margin: 20px 5px 0;
  display: flex;
  width: 100px;
  align-items: center;
}

.menu-img-size {
  width: 20px;
}

.svg-icon {
  transform: scale(-1, 1);
}

.reaction-menu-position-self {
  position: absolute;
  top: -1em;
  right: 95%;
  z-index: 2;
  cursor: pointer;
}

.reaction-menu-position-others {
  position: absolute;
  top: -1em;
  left: 95%;
  z-index: 2;
  cursor: pointer;
}
</style>
