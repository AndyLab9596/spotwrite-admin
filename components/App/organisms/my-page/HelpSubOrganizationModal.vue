<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <div class="icon-cross__wrapper" @click="onClose">
            <img src="/app/icon/cross.svg" class="icon-cross" />
          </div>
        </div>
        <div class="modal-content">
          <img class="icon-help" src="/icon/icon_help_rectangle.png" />
          <div class="info-text">
            <p class="title">サブ組織とは</p>
            <span>
              サブ組織は、自分が所属している組織のほかに兼任で所属している組織がある場合に設定します。</span
            ><br />
            <span>サブ組織は何個でも設定できます。</span><br />
            <span>
              設定すると、その組織のメンバーリストにサブメンバーとして表示されます。</span
            >
          </div>
        </div>
        <div class="modal-footer"></div>
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
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 999;
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
  width: 460px;
  background: $true-white;
  border-radius: 6px;
  padding: 20px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.icon-cross__wrapper {
  display: inline-block;

  .icon-cross {
    cursor: pointer;
    width: 12px;
    height: 12px;
  }
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;

  .title {
    margin-bottom: 22px;
    font-weight: 600;
  }
}

.modal-footer {
  display: flex;
  flex-direction: row;
  padding: 5px 20px 10px;
}
</style>
