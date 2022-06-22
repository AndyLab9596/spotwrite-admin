<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <div class="icon-cross__wrapper" @click="onClose">
            <icon name="cross" class="icon-cross" />
          </div>
        </div>
        <div class="modal-content">
          <slot />
        </div>
        <div class="modal-footer">
          <button class="submit-button" @click="onClick">
            {{ submitButtonText }}
          </button>
          <button class="cancel-button" @click="onClose">キャンセル</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '../images/Icon.vue';

export default Vue.extend({
  components: {
    Icon,
  },
  props: {
    deleteButtonText: {
      type: String,
      default: 'はい',
    },
    index: {
      type: [Number, Array, String],
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      submitButtonText: this.deleteButtonText,
    };
  },
  methods: {
    onClick() {
      this.$emit('click', this.index);
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
  width: 500px;
  height: 200px;
  background: #fff;
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
  }
}

.modal-content {
  display: flex;
  flex-direction: row;
  padding: 0 20px;
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

.submit-button {
  flex: 1;
  margin-right: 10px;
}

.cancel-button {
  flex: 1;
}
</style>
