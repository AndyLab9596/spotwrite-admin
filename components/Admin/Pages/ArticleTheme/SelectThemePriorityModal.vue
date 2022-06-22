<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <p class="title">テーマを利用するタイミングを選ぶ</p>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>

        <div class="modal-content">
          <base-radio-button
            id="1"
            class="radio"
            value="1"
            label="利用中のテーマに選ぶ"
            :checked="priority === '1'"
            name="priority"
            @change="select"
          ></base-radio-button>
          <base-radio-button
            id="2"
            class="radio"
            value="2"
            label="次回のテーマに選ぶ"
            :checked="priority === '2'"
            name="priority"
            @change="select"
          ></base-radio-button>
          <base-radio-button
            id="3"
            class="radio"
            value="3"
            label="次回以降の予約済みテーマに選ぶ"
            :checked="priority === '3'"
            name="priority"
            @change="select"
          ></base-radio-button>
        </div>

        <div v-if="isError" class="error">
          <div>
            すでに予約可能な件数に達しています。<br />削除してから選択してください。
          </div>
        </div>

        <div class="button-box">
          <base-button class="button" :disabled="isError" @click="onSubmit"
            >決定する</base-button
          >
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BaseRadioButtons from '@/components/Admin/Modules/Button/BaseRadioButtons.vue';

export default Vue.extend({
  components: { BaseButton, BaseRadioButton: BaseRadioButtons },
  props: {
    selectedReservedThemeCount: {
      type: Number,
      required: true,
    },
  },
  data() {
    return { priority: '0' };
  },
  computed: {
    isError(): boolean {
      return this.priority === '3' && this.selectedReservedThemeCount >= 3;
    },
  },
  methods: {
    select(value: string) {
      this.priority = value;
    },
    onClose() {
      this.$emit('close');
    },
    onSubmit() {
      if (this.isError) {
        return;
      }
      switch (this.priority) {
        case '1':
        case '2':
          this.$emit('replace-theme', Number(this.priority));
          break;
        case '3':
          this.$emit('reserve-theme');
          break;
        default:
          break;
      }
      this.onClose();
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
  width: 464px;
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
  font-size: 15px;
  font-weight: 600;
  color: $dark_blue;
}

.icon-cross {
  cursor: pointer;
}

.modal-content {
  display: flex;
  flex-direction: column;
  margin-top: 21px;

  .radio /deep/ .radio-label {
    font-size: 15px;
    font-weight: 300;
  }

  label > input {
    margin-right: 5px;
  }

  .item + .item {
    margin-top: 8px;
  }
}

.error {
  color: red;
  margin-top: 14px;
  display: flex;
  justify-content: center;
  font-size: 15px;
  font-weight: 300;
}

.button-box {
  margin-top: 16px;
  text-align: center;

  button {
    padding: 5px 16px;
  }
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

.button {
  width: 200px;
}
</style>
