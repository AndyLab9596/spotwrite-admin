<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <h3 class="modal-header-title">配属先履歴を追加</h3>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div class="modal-content">
          <form class="form">
            <div class="select-box form-item">
              <label class="label">開始年月日</label>
              <div class="select-row select-item-small">
                <v-select
                  v-model="input.joined_year"
                  class="select"
                  label="name"
                  :options="years"
                ></v-select>
                <label class="sub-label-right">年</label>
              </div>
              <div class="select-row select-item-small">
                <v-select
                  v-model="input.joined_month"
                  class="select"
                  label="name"
                  :options="months"
                ></v-select>
                <label class="sub-label-right">月</label>
              </div>
            </div>
            <div class="input-box form-item">
              <label class="label">会社名</label>
              <input
                v-model="input.company_name"
                type="text"
                class="input"
                placeholder="例）ワークスメディア"
              />
            </div>
            <div class="input-box form-item">
              <label class="label">配属先</label>
              <input
                v-model="input.organization_name"
                type="text"
                class="input"
                placeholder="例）営業部"
              />
            </div>
            <div class="input-box form-item">
              <label class="label">備考</label>
              <input
                v-model="input.note"
                type="text"
                class="input"
                placeholder="例）マネージャー"
              />
            </div>
            <div class="button-box">
              <base-button
                size="large"
                class="add-button"
                :disabled="!isInputFilled"
                @click="onSubmit"
              >
                追加する
              </base-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

type Data = {
  input: ApiRequest.AssignmentHistory;
};

export default Vue.extend({
  components: { BaseButton },
  props: {
    years: {
      type: Array,
      default: () => [],
    },
    months: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      input: {
        joined_year: null,
        joined_month: null,
        company_name: '',
        organization_name: '',
        note: '',
      },
    };
  },
  computed: {
    isInputFilled(): boolean {
      return (
        this.input.joined_year != null &&
        this.input.joined_month != null &&
        this.input.company_name !== '' &&
        this.input.organization_name !== ''
      );
    },
  },
  methods: {
    clearInput() {
      this.input = {
        joined_year: null,
        joined_month: null,
        company_name: '',
        organization_name: '',
        note: '',
      };
    },
    onClose() {
      this.$emit('onClose');
    },
    onSubmit() {
      // プルダウンの値がそのまま渡っていたので、valueのみに詰め替える
      if (this.input.joined_year) {
        const joinedYear = this.input.joined_year.value;
        this.input.joined_year = joinedYear;
      }

      if (this.input.joined_month) {
        const joinedMonth = this.input.joined_month.value;
        this.input.joined_month = joinedMonth;
      }

      this.$emit('onSubmit', this.input);
      this.clearInput();
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
  margin-right: 25px;
  font-size: 15px;
  font-weight: 600;
}

.icon-cross {
  cursor: pointer;
}

.modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $true_white;
  margin-top: 14px;
}

.select {
  flex: 1;
  width: 230px;
  font-size: 13px;

  & /deep/ .vs__dropdown-toggle {
    background-color: $extra_light_gray;
    border: solid 1px $light_gray_blue_3;
    border-radius: 4px;
    color: $gray_blue_4;
    height: 40px;
  }
}

.modal-footer {
  display: flex;
  flex-direction: row;
  padding: 0 20px 10px;
}

.cancel-button {
  flex: 1;
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

.select-row {
  display: flex;
  flex-direction: row;
}

.form-item {
  margin-top: 15px;
}

.label {
  flex-shrink: 0;
  width: 120px;
  font-size: 15px;
  font-weight: 600;
}

.input {
  flex: 1;
  height: 40px;
  background-color: $extra_light_gray;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  color: $gray_blue_4;
  padding: 0 11px;
}

.input-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.select-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.sub-label-right {
  margin-left: 6px;
  margin-top: 8px;
}

.select-item-small {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-right: 16px;
  width: 172px;

  &:last-child {
    margin-right: 0;
  }
}

.button-box {
  display: flex;
  flex-direction: row;
  margin-top: 30px;
}

.add-button {
  max-width: 200px;
  width: 100%;
  margin: 0 auto;
}
</style>
