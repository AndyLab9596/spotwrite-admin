<template>
  <transition name="authority-modal-wrapper" appear>
    <div class="modal-window">
      <div class="modal-header">
        <h3 class="modal-header-title">利用権限一覧</h3>
        <img src="/icon/icon-close.svg" class="icon-cross" alt="閉じるボタン" />
      </div>
      <div class="modal-content">
        <table>
          <tr>
            <th class="column--header"></th>
            <th class="column--view">閲覧</th>
            <th class="column--post">投稿</th>
          </tr>
          <tr>
            <th class="text-left">メンバー（通常）</th>
            <td>全ての記事</td>
            <td class="column--post__td">投稿可</td>
          </tr>
          <tr>
            <th class="text-left">準メンバー</th>
            <td>メンバー限定以外の記事</td>
            <td class="column--post__td">投稿可</td>
          </tr>
          <tr>
            <th class="text-left">ビジター</th>
            <td>メンバー・準メンバー限定以外の記事</td>
            <td class="column--post__td">投稿不可</td>
          </tr>
        </table>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  methods: {
    onClose() {
      this.$emit('close');
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-window {
  display: flex;
  flex-direction: column;
  width: 478px;
  height: 239px;
  background: $true_white;
  border-radius: 6px;
  padding: 20px;
  box-shadow: 0 0 3px 0 $light_gray;
  color: $gray_blue_4;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;

  img {
    object-fit: contain;
  }
}

.modal-header-title {
  font-size: 15px;
  font-weight: 600;
  margin-right: 25px;
}

.icon-cross {
  cursor: pointer;
}

.modal-content {
  h3 {
    margin-right: 20px;
  }
}

.select {
  flex: 1;
  width: 230px;
  height: 40px;
}

.modal-footer {
  display: flex;
  flex-direction: row;
  padding: 0 20px 10px;
}

.cancel-button {
  flex: 1;
}

// オーバーレイのトランジション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  // オーバーレイに包含されているモーダルウィンドウのトランジション
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

// ディレイを付けるとモーダルウィンドウが消えた後にオーバーレイが消える
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.modal-enter {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

table,
tr,
td,
th {
  border: 1px solid $light_gray_blue_3;
}

th,
td {
  padding: 0 15px 0 10px;
  vertical-align: middle;
}

th {
  text-align: center;
  background-color: $white_1;
  height: 40px;
}

td {
  color: $dark-blue;
}

.text-left {
  text-align: left;
}

.column--header {
  width: 120px;
}

.column--view {
  width: 180px;
}

.column--post {
  width: 140px;

  .column--post__td {
    text-align: center;
  }
}
</style>
