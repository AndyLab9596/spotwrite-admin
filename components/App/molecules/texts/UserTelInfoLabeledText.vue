<template>
  <div class="user-info-labeled-text-container">
    <p class="label">{{ label }}</p>
    <div>
      <p v-show="companyTel" class="text"><span>社用</span> {{ companyTel }}</p>
      <p v-show="tel" class="text"><span>個人</span> {{ tel }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    label: {
      type: String,
      required: true,
    },
    tel: {
      type: String,
      required: true,
    },
    companyTel: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.user-info-labeled-text-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 16px;
  width: 33%;
}

.label {
  background-color: #7e8195;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  color: #fff;
  white-space: nowrap;
}

.text {
  padding: 2px 7px;
  font-size: 12px;
  color: #9c9da5;
  white-space: nowrap;

  span {
    font-size: 10px;
  }
}
</style>
