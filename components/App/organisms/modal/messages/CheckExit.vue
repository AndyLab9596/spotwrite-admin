<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-content">
          <slot />
        </div>
        <div class="modal-footer">
          <div class="cancel" @click="onClose">キャンセル</div>
          <div class="submit" @click="onClick">
            {{ buttonText }}
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
    buttonText: {
      type: String,
      default: '',
    },
    roomUuid: {
      type: String,
      required: false,
      default: '',
    },
  },
  methods: {
    onClick() {
      this.$emit('click', this.roomUuid);
    },
    onClose() {
      this.$emit('toggleModal');
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
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 500px;
  height: 200px;
  background: #fff;
  padding: 20px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.modal-content {
  display: flex;
  flex-direction: row;
  padding: 0 20px;
}

.modal-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0 20px 10px;
}

.submit {
  width: 30%;
  color: #f03d25;
  cursor: pointer;
}

.cancel {
  width: 30%;
  margin-right: 10px;
  color: #0084ff;
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
</style>
