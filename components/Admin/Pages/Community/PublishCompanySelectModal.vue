<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <p class="title">公開対象の設定</p>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div class="modal-container">
          <div class="check-box">
            <div
              v-for="(companiesRow, index) in chunkedCompanies"
              :key="`row-${index}`"
              class="company-row"
            >
              <base-checkbox
                v-for="company in companiesRow"
                :key="company.uuid"
                v-model="values"
                class="checkbox"
                :label="company.name"
                :value="company.uuid"
              >
              </base-checkbox>
            </div>
          </div>
          <div v-if="error" class="error">
            ※公開対象を選択してください。
          </div>
          <div class="button-box">
            <base-button
              :disabled="error"
              class="button"
              size="large"
              @click="add"
              >追加する</base-button
            >
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import { chunk } from 'lodash';

export default Vue.extend({
  components: {
    BaseButton,
    BaseCheckbox,
  },
  props: {
    companies: {
      type: Array as PropType<ApiResponse.Organization[]>,
      required: true,
    },
    selected: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  data() {
    return {
      values: [],
    };
  },
  computed: {
    chunkedCompanies(): string[][] {
      return chunk(this.companies, 3);
    },
    error(): boolean {
      return this.values.length === 0;
    },
  },
  mounted() {
    this.values = this.selected;
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    add() {
      this.$emit('add', this.values);
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
  width: 600px;
  background: $true_white;
  border-radius: 6px;
  padding: 18px 30px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.icon-cross {
  cursor: pointer;
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

select,
input {
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  color: $gray_blue_4;
  background-color: $true_white;
  height: 40px;
  width: 254px;
  padding: 0 4px;
}

input {
  width: 410px;
}

.check-box {
  margin-top: 32px;

  .company-row {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding-right: 30px;
  }

  /deep/ .checkbox-text {
    font-size: 15px;
  }
}

.button-box {
  display: flex;
  justify-content: center;
  margin-top: 60px;
}

.button {
  width: 200px;
}

.error {
  margin-top: 20px;
  font-size: 13px;
  font-weight: 600;
  color: $red;
}
</style>
