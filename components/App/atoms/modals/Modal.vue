<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window" :style="{ width }">
        <div class="modal-header" :class="{ 'no-header': noHeader }">
          <template v-if="!noHeader">
            <div class="icon-cross__wrapper">
              <icon name="cross" class="icon-cross" @click.native="onClose" />
            </div>
          </template>
          <div v-else class="outer-close-icon">
            <img
              src="/icon/icon_cross-white.svg"
              class="icon-cross"
              @click="onClose"
            />
          </div>
        </div>
        <div class="modal-content">
          <slot />
        </div>
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '@/components/App/atoms/images/Icon.vue';

export default Vue.extend({
  components: {
    Icon,
  },
  props: {
    width: {
      type: String,
      default: '500px',
    },
    noHeader: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
    onClose() {
      this.$emit('close');
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

.modal-window {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  border-radius: 6px;
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

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  &.no-header {
    position: relative;
  }
}

.icon-cross__wrapper {
  display: inline-block;
  position: relative;

  .icon-cross {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }
}

.outer-close-icon {
  .icon-cross {
    position: absolute;
    top: 0;
    right: -50px;
    width: 25px;
    cursor: pointer;
  }
}

.modal-content {
  display: flex;
  flex-direction: row;
}

.modal-footer {
  display: flex;
  flex-direction: row;
  padding: 0 20px 10px;
}
</style>
