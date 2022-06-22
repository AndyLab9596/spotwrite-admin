<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay">
      <div class="modal-window">
        <div class="modal-header">
          <p class="title">人数帯に応じた料金・容量一覧</p>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <table>
          <tr class="table-header">
            <td class="first">人数帯</td>
            <td class="first">ご利用料金（税込）</td>
            <td class="first">ご利用容量</td>
          </tr>
          <tr v-for="(item, index) in groupPrice" :key="index">
            <td class="first">{{ item.numberMembers }}</td>
            <td>{{ item.price }}円</td>
            <td>{{ item.storage }}GB</td>
          </tr>
        </table>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    groupPrice: {
      type: Array as any,
      default: () => [],
    },
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
  },
});
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.modal-window {
  display: flex;
  flex-direction: column;
  background: $true_white;
  border-radius: 6px;
  padding: 20px 30px 30px 30px;
  box-shadow: 0 0 3px 0 $light_gray;
  width: 520px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 15px;
  font-weight: 600;
}

table {
  width: 100%;
  border: 1px solid #e4e5ed;
  color: #6a6d83;
  margin-top: 20px;
}

table tr td {
  border: 1px solid #e4e5ed;
  height: 40px;
  vertical-align: middle;
  text-align: right;
  padding-right: 10px;
}

.table-header {
  td {
    font-size: 13px;
    font-weight: 600;
    text-align: center;
  }
}

.first {
  background-color: #f7f8fd;
  text-align: left;
  font-size: 13px;
  padding-left: 10px;
  font-weight: 600;
}
</style>
