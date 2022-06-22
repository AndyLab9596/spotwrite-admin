<template>
  <img
    class="icon"
    :src="require(`@/assets/image/icon/${name}.png`)"
    :style="{ width: `${size}px`, height: `${size}px` }"
    alt="Icon"
  />
</template>

<script lang="ts">
import Vue from 'vue';

const icons = [
  'Internalcontact2',
  'analysis',
  'board',
  'chart',
  'check_w',
  'community',
  'cross',
  'cross_w',
  'dailyreport',
  'data',
  'event3',
  'folder',
  'help_w',
  'home',
  'search_w',
  'talk_w',
  'write',
  'time_white',
  'favorite',
  'favorite_y',
  'like_n',
  'talk',
  'arrow_r',
  'arrow_r_o',
  'plus',
  'camera',
  'newspaper',
  'person',
  'buildings',
  'members',
  'people',
  'pencil',
  'rock',
];

export default Vue.extend({
  props: {
    name: {
      type: String,
      default: 'home',
      validator: (v: string) => icons.includes(v),
    },
    size: {
      type: Number,
      required: false,
      default: 16,
    },
  },
});
</script>

<style lang="scss" scoped>
.icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}
</style>
