<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        <div class="title">フォルダーを作成</div>
        <div class="form">
          <div class="label">フォルダー名</div>
          <input
            v-model="name"
            class="form-input"
            type="text"
            placeholder="フォルダー01"
          />
        </div>
        <div class="button-box">
          <base-button
            class="button"
            size="large"
            :disabled="name.length === 0"
            @click="onSubmit"
            >作成する</base-button
          >
          <base-button class="button" inverse size="large" @click="onClose"
            >キャンセル</base-button
          >
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
  data() {
    return {
      name: '' as string,
    };
  },
  methods: {
    onClose() {
      this.$emit('onClose');
    },
    onSubmit() {
      this.$emit('onSubmit', this.name);
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
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.modal-window {
  display: flex;
  flex-direction: column;
  width: 600px;
  background: $true_white;
  border-radius: 6px;
  padding: 20px 30px 20px;
  box-shadow: 0 0 3px 0 $light_gray;
  position: relative;
}

.icon-cross {
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
}

.title {
  font-size: 15px;
  font-weight: bold;
}

.form {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    font-size: 15px;
    font-weight: bold;
  }

  .form-input {
    margin-top: 7px;
    padding: 8px;
    width: 360px;
    height: 40px;
    background-color: $extra_light_gray;
    border: solid 1px $light_gray_blue_3;
    border-radius: 4px;
    color: $gray_blue_4;
  }
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

.button-box {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.button {
  width: 200px;
  margin: 0 10px;
}
</style>
