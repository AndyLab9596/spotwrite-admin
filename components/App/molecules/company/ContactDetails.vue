<template>
  <div class="contact-details">
    <div>
      <div class="detail-title">電話番号</div>
      <div class="detail-contents">
        <span>{{ tel }}</span>
      </div>
    </div>
    <div>
      <div class="detail-title">ホームページ</div>
      <div class="detail-contents">
        <a v-if="url && url.length > 0" :href="url" target="__blank">
          {{ url }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    tel: {
      default: null,
      type: String,
    },
    url: {
      default: null,
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped>
.contact-details {
  position: relative;
  padding: 19px 15px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  border-radius: 8px;
  flex: 1;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%237E8195FF' stroke-width='3' stroke-dasharray='1 2' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
  min-width: max-content;
}

.contact-details::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 60%;
  top: 20%;
  left: 0;
  background-color: $true_white;
}

.contact-details::before {
  content: '';
  position: absolute;
  width: 10px;
  height: 60%;
  top: 20%;
  right: 0;
  background-color: $true_white;
}

.contact-details > div:first-child {
  margin: 0 21px 0 0;
}

.detail-title {
  font-size: 11px;
  font-weight: 300;
  color: $main_color;
}

.detail-contents {
  font-size: 15px;
  color: $main_color;
  min-height: 22px;
}
</style>
