<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-layout">
        <div class="modal-layout-inner">
          <div class="modal-window" :style="{ top: `${top}px` }">
            <img
              src="/icon/icon_cross.png"
              class="icon-cross"
              @click="onClose"
            />
            <div class="sentence">
              <p>グループが未登録です。</p>
              <p>下記リンク先よりグループを <br />登録してよりください。</p>
            </div>
            <a
              class="button"
              role="button"
              @click.prevent="showGroupManagementModal"
              >グループを登録する</a
            >
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    top: {
      type: Number,
      required: true,
    },
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    showGroupManagementModal() {
      this.$emit('close');
      this.$emit('show-group-management-modal');
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
  background: rgba(126, 129, 149, 0.8);
}

.modal-layout {
  padding-left: 200px;
  width: 100%;
  height: 100%;
}

.modal-layout-inner {
  position: relative;
  width: 960px;
  min-height: calc(100% - 128px);
  margin: 0 auto;
}

.modal-window {
  position: absolute;
  right: 30px;
  display: flex;
  flex-direction: column;
  width: 255px;
  height: 115px;
  background: $true_white;
  border-radius: 6px;
  padding: 16px;
  color: $dark_blue;
  box-shadow: 0 0 3px 0 $light_gray;
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

.icon-cross {
  position: absolute;
  top: 16px;
  right: 16px;
  height: 16px;
  width: 16px;
}

.sentence {
  color: $gray_blue_4;
  font-size: 13px;
}

.button {
  color: $pink;
  font-size: 13px;
  margin-top: 10px;
  cursor: pointer;
}

@media screen and (max-width: 1133px) {
  .modal-layout-inner {
    width: 100%;
  }
}
</style>
