<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <h3 class="modal-header-title">雇用形態を登録</h3>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div class="modal-content">
          <div class="button-box">
            <input
              v-model="employmentStatusName"
              type="text"
              placeholder="雇用形態を入力してください"
            />
            <base-button size="large" class="button" @click="onExecute()"
              >登録する</base-button
            >
          </div>

          <div class="attention">
            雇用形態は、サイドメニューのマスター設定で確認、追加登録ができます。
          </div>

          <hr class="separator" />

          <h3 class="heading">登録済み雇用形態</h3>

          <div class="employment-status">
            <div v-for="item in employmentStatuses" :key="item.name">
              <div class="employment-status-row">
                <p>{{ item.name }}</p>
                <img
                  class="button__close"
                  src="/icon/icon_close_b.svg"
                  :class="{ 'button__close--disabled': !item.is_deletable }"
                  @click="selectEmploymentStatus(item)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <check-delete
        v-if="checkDeleteModal"
        delete-button-text="削除"
        class="alert-message"
        @close="closeCheckDeleteModal"
        @click="deleteEmploymentStatus"
      >
        <div class="alert-message__text">
          雇用形態を削除しますか？<br />
          削除した場合、この雇用形態のメンバーは「未定」となります。
        </div>
      </check-delete>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import { CheckDelete } from '@/components/Admin/Modules/Modal';

export default Vue.extend({
  components: { BaseButton, CheckDelete },
  props: {
    employmentStatuses: {
      type: Array as PropType<ApiResponse.EmploymentStatus[]>,
      required: true,
    },
  },
  data() {
    return {
      employmentStatusName: '',
      selectEmploymentStatusItem: '',
      checkDeleteModal: false as boolean,
    };
  },
  methods: {
    onExecute() {
      if (this.employmentStatusName === '') {
        return;
      }
      if (
        this.employmentStatuses.find((p: any) => {
          return p.name === this.employmentStatusName;
        })
      ) {
        return;
      }
      this.$emit('register-employment-status', {
        name: this.employmentStatusName,
      });
      this.onClose();
    },
    onClose() {
      this.$emit('close');
    },
    selectEmploymentStatus(item: ApiResponse.EmploymentStatus) {
      if (!item.is_deletable) return;
      this.selectEmploymentStatusItem = item.uuid;
      this.openCheckDeleteModal();
    },
    deleteEmploymentStatus() {
      this.$emit('delete', this.selectEmploymentStatusItem);
      this.selectEmploymentStatusItem = '';
      this.closeCheckDeleteModal();
    },
    closeCheckDeleteModal() {
      this.checkDeleteModal = false;
    },
    openCheckDeleteModal() {
      this.checkDeleteModal = true;
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
  right: 0;
  width: 100%;
  height: 100%;
}

.modal-window {
  display: flex;
  flex-direction: column;
  width: auto;
  height: auto;
  background: $true_white;
  border-radius: 6px;
  padding: 26px;
  box-shadow: 0 0 3px 0 $light_gray;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;

  img {
    object-fit: contain;
  }
}

.modal-header-title {
  font-size: 15px;
  font-weight: 600;
  margin-right: 25px;
}

.icon-cross {
  cursor: pointer;
}

.modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 468px;
  background-color: $true_white;
  margin-top: 14px;
  color: $dark_blue;
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

.button-box {
  display: flex;
  text-align: center;

  input {
    flex-grow: 1;
    padding: 8px;
    width: 164px;
    height: 40px;
    background-color: $extra_light_gray;
    border: solid 1px $light_gray_blue_3;
    border-radius: 4px;
  }

  .button {
    width: 140px;
    margin-left: 10px;
  }
}

.attention {
  color: red;
  font-size: 13px;
  margin-top: 5px;
}

.employment-status {
  margin-top: 10px;
  height: 105px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #7e8195 white;

  &-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 5px;
  }
}

.employment-status::-webkit-scrollbar {
  width: 4px;
  height: 0;
}

.employment-status::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #7e8195;
}

.heading {
  margin-top: 10px;
  font-size: 15px;
  font-weight: 600;
}

.separator {
  border: none;
  background-color: $light_gray_blue_3;
  height: 1px;
  margin-top: 25px;
  margin-bottom: 20px;
}

.alert-message {
  & /deep/ .modal-window {
    height: auto;
  }

  & /deep/ .modal-content {
    margin-top: 10px;
  }

  & /deep/ .cancel-button {
    &:hover {
      background-color: $true_white;
      color: $gray_blue_4;
      border: 1px solid $light_gray_blue_3;
    }
  }
}

.button__close {
  cursor: pointer;

  &--disabled {
    cursor: not-allowed;
  }
}
</style>
