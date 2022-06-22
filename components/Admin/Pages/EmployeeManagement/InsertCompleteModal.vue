<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div class="modal-content">
          <div class="add-member-text">メンバー登録が完了しました。</div>
          <div class="modal-content-inner">
            <base-button class="ok-button" @click="onClickOk">
              OK
            </base-button>
            <div class="small-message">
              ※<nuxt-link
                class="text-pink"
                tag="a"
                to="/admin/account-management"
                >アカウント管理</nuxt-link
              >から登録したメンバーのアカウント発行してください。
            </div>
          </div>
          <div class="message-box">
            追加項目は再度こちらのページの
            <span class="text-pink">追加項目を入力する</span>
            ボタンか メニューの「追加項目」から再度登録して下さい。
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: {
    BaseButton,
  },
  methods: {
    onClick() {
      this.$router.push('/admin/account-management');
    },
    onClose() {
      this.$emit('close');
    },
    onClickOk() {
      this.$emit('clickOk');
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(126, 129, 149, 0.8);
  z-index: 999;
}

.modal-window {
  display: flex;
  flex-direction: column;
  width: 500px;
  height: auto;
  background: $true_white;
  padding: 20px;
  border: none;
  box-shadow: 0 0 3px #b8c7d8;
  border-radius: 4px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 10px;

  img {
    object-fit: contain;
  }
}

.modal-header-title {
  margin-right: 25px;
  margin-left: 30px;
}

.icon-cross {
  cursor: pointer;
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

.modal-content {
  font-size: 15px;
  color: #2e303e;
  margin: 0 15px;
}

.modal-content-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.announce {
  margin-top: 30px;
}

.choices {
  margin: 12px 30px;
  text-align: center;

  &__organization {
    border-radius: 4px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;

    &--open {
      border-radius: 4px 4px 0 0;
    }
  }

  &__radiobox {
    max-height: 200px;
    border-top: none;
    border-radius: 0 0 4px 4px;
    padding: 10px 21px;
    line-height: 30px;
    overflow: auto;
  }
}

.checkbox {
  &__label {
    margin-left: 10px;
  }
}

.toggle-icon {
  width: 24px;
  height: 24px;
  background-color: $true_white;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  background-position: center;
  transform: scale(-1, 1);
  background-repeat: no-repeat;
  display: inline-block;

  &--open {
    background-image: url('/icon/icon_switching.svg');
  }

  &--close {
    background-image: url('/icon/icon_switching-down.svg');
  }
}

.button-area {
  display: flex;
  flex-direction: row;
}

.button {
  width: 215px;
  height: 40px;
  border-radius: 4px;
  font-weight: bold;
  margin-top: 22px;

  &__submit {
    color: $true_white;
    background: $gray_blue_3;
    border: none;
    margin-right: 10px;
  }

  &__cancel {
    color: $gray_blue_4;
    background-color: $true_white;
    border: solid 1px $light_gray_blue_3;
  }
}

.text-pink {
  color: #f09c9c;
}

.small-message {
  font-size: 13px;
  border-bottom: 1px solid #e4e5ed;
  padding-bottom: 20px;
}

.message-box {
  margin-top: 20px;
  padding: 17px 11px;
  font-weight: bold;
  background-color: #feffda;
}

.ok-button {
  margin: 0 0 12px 0;
}

.add-member-text {
  margin: 0 0 46px 0;
}
</style>
