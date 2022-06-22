<template>
  <div class="date-wrapper" @click="onClick">
    <p class="date-text">
      {{ dateFilter }}
      <img class="icon" src="/app/icon/Icon-calendar-clear.svg" />
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from '@/libs/dayjs';

export default Vue.extend({
  layout: 'admin/default',
  props: {
    date: {
      type: Number,
      required: false,
      default: null,
    },
  },
  computed: {
    dateFilter() {
      if (this.date) {
        return dayjs.unix(this.date).format('YYYY/MM/DD');
      }
      return null;
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
});
</script>

<style lang="scss" scoped>
.date-wrapper {
  background: $light_gray_blue_3;
  color: $main_color;
  font-size: 13px;
  position: relative;
  margin-right: 7px;
  font-family: 'Lato', sans-serif;
  height: 30px;
  font-weight: 400;
  padding: 7px 35px 7px 12px;
  background-color: #e4e5ed;
  border-radius: 16px;
  width: 118px;
  cursor: pointer;

  .date-text {
    position: absolute;
    top: 50%;
    transform: translate(0%, -50%);
    display: flex;
    align-items: center;
  }

  .icon {
    width: 16px;
    margin: 0 0 0 8px;
  }
}
</style>
