<template>
  <transition name="modal" appear>
    <div class="link-copy-wrapper">
      <div class="link-copy-container">
        <div class="link-copy-container__contents">
          リンクがコピーされました。
        </div>
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

<style scoped lang="scss">
.link-copy-container {
  padding: 30px 0 26px;
  width: 800px;
  background-color: $gray_blue_3;
  display: flex;
  justify-content: center;
  align-items: center;

  &__contents {
    color: $true-white;
    font-size: 15px;
    font-weight: 300;
  }
}

// モーダルウィンドウのトランジション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
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
