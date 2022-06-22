<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <p class="title">グループを管理</p>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div class="modal-contents">
          <div class="create">
            <p class="content-title">グループを登録</p>
            <div class="content-box">
              <input
                v-model="groupName"
                placeholder="グループ名を入力してください"
                type="text"
                class="input"
              /><base-button
                size="large"
                type="button"
                :disabled="addButtonDisabled"
                @click="onCreate"
              >
                登録する
              </base-button>
            </div>
          </div>
          <hr class="separator1" />
          <div class="delete">
            <p class="content-title">グループを削除</p>
            <div class="content-box">
              <p class="label">チェックを入れたグループをまとめて</p>
              <base-button
                size="large"
                type="button"
                class="delete-button button"
                @click="onDelete"
              >
                削除する
              </base-button>
            </div>
          </div>
          <hr class="separator2" />
          <div class="created">
            <p class="content-title">登録済みグループ</p>
            <div class="groups">
              <base-checkbox
                v-for="group in groups"
                :key="group.name"
                v-model="checked"
                class="checkbox"
                :label="group.name"
                :value="group.uuid"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';

export default Vue.extend({
  components: { BaseButton, BaseCheckbox },
  props: {
    groups: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      checked: [] as string[],
      groupName: '' as string,
    };
  },
  computed: {
    addButtonDisabled(): boolean {
      return !this.groupName;
    },
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onCreate() {
      this.$emit('create', this.groupName);
      this.groupName = '';
    },
    onDelete() {
      this.$emit('delete', this.checked);
      this.checked = [];
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
  height: 486px;
  background: $true_white;
  border-radius: 6px;
  padding: 18px;
  color: $dark_blue;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.icon-cross {
  cursor: pointer;
}

.modal-contents {
  display: flex;
  flex-direction: column;
  padding-top: 18px;
}

.content-title {
  color: $dark_blue;
  font-size: 15px;
  font-weight: bold;
}

.content-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .label {
    font-size: 15px;
  }
}

.button {
  height: 40px;
  margin-left: 10px;
}

.delete-button {
  background-color: $true_white;
  color: $gray_blue_4;
  border: solid 1px $light_gray_blue_3;
}

.input {
  flex: 1;
  height: 40px;
  color: $gray_blue_4;
  border: solid 1px $light_gray_blue_3;
  background-color: $extra_light_gray;
  border-radius: 4px;
  padding: 0 11px;

  &::placeholder {
    color: $placeholder_gray;
  }
}

.groups {
  overflow: scroll;
  width: 100%;
  max-height: 153px;
  margin-top: 10px;
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

.separator1 {
  margin-top: 20px;
  margin-bottom: 23px;
  height: 1px;
  border: none;
  background-color: $light_gray_blue_3;
}

.separator2 {
  margin-top: 10px;
  margin-bottom: 23px;
  height: 1px;
  border: none;
  background-color: $light_gray_blue_3;
}

.checkbox {
  display: inline-block;
  width: 194px;
}
</style>
