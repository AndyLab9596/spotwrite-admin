<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <p class="title">グループを選択</p>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div class="modal-contents">
          <div class="groups">
            <template v-for="group in groups">
              <base-checkbox
                :key="group.uuid"
                v-model="checked"
                class="checkbox"
                type="checkbox"
                :value="group.uuid"
                :label="group.name"
              />
            </template>
          </div>
          <div class="button-box">
            <base-button @click="onClick">登録する</base-button>
          </div>
          <div class="create-button-box">
            <a
              class="create-group-button"
              role="button"
              @click="$emit('go-to-registered-group')"
              >新しいグループを登録する</a
            >
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: {
    BaseCheckbox,
    BaseButton,
  },
  props: {
    groups: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      checked: [] as string[],
    };
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onClick() {
      this.$emit('click', this.checked);
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
  width: 480px;
  background: $true_white;
  border-radius: 6px;
  padding: 18px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.title {
  color: $dark_blue;
  font-size: 15px;
  font-weight: bold;
}

.icon-cross {
  cursor: pointer;
}

.modal-contents {
  color: $dark_blue;
  display: flex;
  flex-direction: column;
  padding-top: 15px;
}

.groups {
  display: flex;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
  height: 240px;
}

.label {
  display: flex;
  flex-direction: row;
  align-items: center;
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

.checkbox + .checkbox {
  margin-top: 10px;
}

.button-box {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  button {
    width: 200px;
  }
}

.create-button-box {
  text-align: center;
}

.create-group-button {
  margin-top: 12px;
  color: $pink;
  font-size: 15px;
  text-decoration: none;
  cursor: pointer;
}
</style>
