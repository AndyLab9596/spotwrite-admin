<template>
  <transition name="modal" appear>
    <div
      v-scroll-lock="false"
      class="modal modal-overlay"
      @click.self="onClose"
    >
      <div
        class="modal-window"
        :style="{ top: offsetTop + 'px', left: offsetLeft + 900 + 'px' }"
      >
        <div class="modal-header">
          <img
            src="/icon/icon_cross-white.png"
            class="icon-cross"
            @click="onClose"
          />
        </div>
        <div class="modal-content">
          <div class="modal-main">
            <button class="button" @click="goToDetail(company)">
              詳細情報を登録
              <img
                src="/icon/icon_external-link.svg"
                class="icon-external-link"
              />
            </button>
            <button type="button" class="button" @click="onDelete">
              この会社を削除する
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    offsetTop: {
      type: Number,
      required: true,
      default: 0,
    },
    offsetLeft: {
      type: Number,
      required: true,
      default: 0,
    },
    company: {
      type: Object as PropType<Types.GroupOrganization>,
      required: true,
    },
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onDelete() {
      this.$emit('delete', this.company);
    },
    goToDetail(company: Types.GroupOrganization) {
      this.$emit('goToDetail', company);
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  display: flex;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: scroll;
}

.modal-window {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  background: #7e8195;
  opacity: 0.8;
  box-shadow: 0 0 3px #b8c7d829;
  border-radius: 4px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 8px;
}

.icon-cross {
  cursor: pointer;
}

.icon-external-link {
  margin-top: 2px;
  margin-left: 8px;
  display: block;
  float: right;
}

.modal-content {
  display: flex;
  flex-direction: row;
}

.modal-main {
  padding: 0 15px;
  position: relative;
  border: none;
}

.button {
  display: block;
  flex-direction: row;
  align-items: center;
  background-color: #28292f;
  color: $true_white;
  font-size: 13px;
  border: none;
  border-radius: 6px;
  height: 30px;
  width: 140px;
  font-weight: bold;
  opacity: 1;
  margin-bottom: 15px;

  &:disabled {
    color: rgba(204, 204, 204, 0.5);
    background-color: rgba(0, 0, 0, 0.5);
    cursor: auto;
  }
}

.side-error {
  position: absolute;
  top: 35px;
  left: 0;

  &-body {
    position: relative;
    display: inline-block;
    background-color: $true_white;
    font-size: 10px;
    color: $dark_blue;
    border: 1px solid #707070;
    border-radius: 4px;
    padding: 10px;
    width: 150px;
  }

  &-body::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 30%;
    margin-left: -15px;
    border: 5px solid transparent;
    border-bottom: 5px solid $true_white;
  }
}
</style>
