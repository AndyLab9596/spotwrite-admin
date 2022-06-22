<template>
  <div class="leader-profile">
    <div v-if="leaderIcon && leaderIcon.length > 0">
      <div
        class="leader-image"
        :style="{
          backgroundImage: 'url(' + leaderIcon + ')',
        }"
      ></div>
    </div>
    <div
      v-else
      class="leader-image"
      style="background-image: url('/static/image/no-image.png');"
    ></div>

    <div class="leader-title">リーダー</div>

    <div class="leader-details">
      <div v-if="leaderName && leaderName.length > 0" class="leader-name">
        {{ leaderName }}
      </div>
      <div
        v-if="leaderPosition && leaderPosition.length > 0"
        class="leader-position"
      >
        {{ leaderPosition }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    leaderIcon: {
      default: null,
      type: String,
    },
    leaderName: {
      default: null,
      type: String,
    },
    leaderPosition: {
      default: null,
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped>
.leader-profile {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
}

.leader-image {
  width: 72px;
  min-height: 72px;
  height: auto;
  border-radius: 27px;
  background-position: center;
  background-repeat: none;
  background-size: cover;
}

.leader-title {
  margin: 17px 12px 0 24px;
  font-size: 15px;
  font-weight: 600;
}

.leader-details {
  margin: 17px 0 0;
}

.leader-name {
  font-size: 15px;
  font-weight: 600;
  border-bottom: 1px solid $link_color;
}

.leader-position {
  color: $gentle_bluish_purple;
  font-size: 11px;
  line-height: 1;
  margin: 7.5px 0 0 0;
  font-weight: 300;
}
</style>
