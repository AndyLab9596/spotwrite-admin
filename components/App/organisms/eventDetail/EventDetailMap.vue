<template>
  <div class="map-wrapper">
    <!--TODO: イベント開催場所の住所については確認中のため、決定次第実装に反映する-->
    <img src="/app/icon/Icon-place.svg" class="icon" />
    <div class="map-contents">
      <p class="title">{{ place }}</p>
      <!--      TODO: アドレス入力欄がないので場所名だけ表示させておく-->
      <!--      <p class="description">{{ address }}</p>-->
      <base-button class="button" @click="openMap">
        Google Mapはこちら
      </base-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '../../atoms/buttons/BaseButton.vue';

export default Vue.extend({
  components: {
    BaseButton,
  },
  props: {
    place: {
      type: String,
      default: null,
    },
    // address: {
    //   type: String,
    //   required: true,
    // },
  },
  methods: {
    openMap() {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${this.place}`,
        '_blank'
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.map-wrapper {
  display: flex;
  align-items: flex-start;
}

.icon {
  width: 12px;
  margin: 0 10px 0 0;
}

.title {
  color: $main_color;
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;
  margin: 0 0 6px 0;
}

.description {
  color: $sub_color;
  font-size: 13px;
  font-weight: 300;
  line-height: 1.6em;
  margin: 0 0 16px 0;
}

.button {
  height: 28px;
  width: 100%;
  background-color: $button_background_color;
  color: $gentle_bluish_purple;
  font-size: 12px;
}
</style>
