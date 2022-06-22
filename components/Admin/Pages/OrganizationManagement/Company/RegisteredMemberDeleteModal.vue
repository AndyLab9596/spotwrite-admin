<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay">
      <div class="modal-window">
        <div class="modal-header">
          <img src="/icon/icon_cross.svg" class="icon-cross" @click="onClose" />
        </div>
        <div class="modal-content">
          <p>
            チェックを入れたメンバーをまとめて
            <base-button class="submit-button" @click="onClick">
              削除
            </base-button>
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: { BaseButton },
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
  position: fixed;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: auto;
  border-radius: 4px;
  border: none;
  box-shadow: 0 0 3px $light_gray;
}

.modal-window {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: fit-content;
  background: $true_white;
  border-radius: 6px;
  padding: 16px 10px 30px;
  font-size: 15px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.icon-cross {
  cursor: pointer;
}

.modal-content {
  display: flex;
  flex-direction: row;
  padding: 0 20px;
}

.submit-button {
  width: 56px;
  height: 30px;
}
</style>
