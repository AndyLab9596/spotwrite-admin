<template>
  <div class="inventory-bulletin-board-Modal">
    <form class="form l-contents" @submit.prevent="onSubmit">
      <p class="bord-title">在籍掲示板の設定</p>
      <p class="bord-sub-title">
        在籍掲示板の設定ができます。<br />
        デフォルトの項目名も編集可能です。また、新規で５件までステータスを追加できます。
      </p>
      <vue-loading
        v-if="isLoading"
        type="spin"
        color="#333"
        :size="{ width: '50px', height: '50px' }"
      ></vue-loading>
      <template v-else>
        <div class="bord-input-wrapper">
          <div class="bord-input-wrapper-left">
            <div class="bord-input-container">
              <div
                :style="{ backgroundColor: response.color1.color_code }"
                class="bord-color"
              ></div>
              <input v-model="response.color1.name" class="bord-input" />
            </div>
            <div class="bord-input-container">
              <div
                :style="{ backgroundColor: response.color2.color_code }"
                class="bord-color"
              ></div>
              <input v-model="response.color2.name" class="bord-input" />
            </div>
            <div class="bord-input-container">
              <div
                :style="{ backgroundColor: response.color3.color_code }"
                class="bord-color"
              ></div>
              <input v-model="response.color3.name" class="bord-input" />
            </div>
            <div class="bord-input-container">
              <div
                :style="{ backgroundColor: response.color4.color_code }"
                class="bord-color"
              ></div>
              <input v-model="response.color4.name" class="bord-input" />
            </div>
            <div class="bord-input-container">
              <div
                :style="{ backgroundColor: response.color5.color_code }"
                class="bord-color"
              ></div>
              <input v-model="response.color5.name" class="bord-input" />
            </div>
          </div>
          <div class="bord-input-wrapper-right">
            <div class="bord-input-container">
              <div
                :style="{ backgroundColor: response.color6.color_code }"
                class="bord-color"
              ></div>
              <input v-model="response.color6.name" class="bord-input" />
            </div>
            <div class="bord-input-container">
              <div
                :style="{ backgroundColor: response.color7.color_code }"
                class="bord-color"
              ></div>
              <input v-model="response.color7.name" class="bord-input" />
            </div>
            <div class="bord-input-container">
              <div
                :style="{ backgroundColor: response.color8.color_code }"
                class="bord-color"
              ></div>
              <input v-model="response.color8.name" class="bord-input" />
            </div>
            <div class="bord-input-container">
              <div
                :style="{ backgroundColor: response.color9.color_code }"
                class="bord-color"
              ></div>
              <input v-model="response.color9.name" class="bord-input" />
            </div>
            <div class="bord-input-container">
              <div
                :style="{ backgroundColor: response.color10.color_code }"
                class="bord-color"
              ></div>
              <input v-model="response.color10.name" class="bord-input" />
            </div>
          </div>
        </div>
        <base-button
          :disabled="isSending"
          type="button"
          class="submit-button"
          size="large"
          @click="onSubmit()"
        >
          保存する
        </base-button>
      </template>
    </form>
    <success-message
      v-if="showSuccessMessageModal"
      @close="closeSuccessMessageModal"
    >
      入力された情報が保存されました。
    </success-message>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { SuccessMessage } from '@/components/Admin/Modules/Modal';
import { fetchEnrollmentStatuses, sendEnrollmentStatuses } from '@/libs/api';
import { VueLoading } from 'vue-loading-template';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: {
    SuccessMessage,
    VueLoading,
    BaseButton,
  },
  data() {
    return {
      isLoading: false,
      isSending: false,
      showSuccessMessageModal: false as boolean,
      response: {
        color1: {},
        color2: {},
        color3: {},
        color4: {},
        color5: {},
        color6: {},
        color7: {},
        color8: {},
        color9: {},
        color10: {},
      } as ApiResponse.EnrollmentStatuses,
    };
  },
  created() {
    this.fetchEnrollmentStatuses();
  },
  methods: {
    onSubmit() {
      this.sendEnrollmentStatuses();
    },
    toggleSuccessMessageModal() {
      this.showSuccessMessageModal = true;
    },
    closeSuccessMessageModal() {
      this.showSuccessMessageModal = false;
    },
    async fetchEnrollmentStatuses() {
      this.isLoading = true;
      const { data } = await fetchEnrollmentStatuses();
      this.response = data;
      this.isLoading = false;
    },
    async sendEnrollmentStatuses() {
      this.isSending = true;
      try {
        await sendEnrollmentStatuses({
          color1: this.response.color1.name,
          color2: this.response.color2.name,
          color3: this.response.color3.name,
          color4: this.response.color4.name,
          color5: this.response.color5.name,
          color6: this.response.color6.name,
          color7: this.response.color7.name,
          color8: this.response.color8.name,
          color9: this.response.color9.name,
          color10: this.response.color10.name,
        });
        this.isSending = false;
        this.toggleSuccessMessageModal();
      } catch (e) {
        alert('在籍掲示板の設定の保存に失敗しました。');
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.bord-title {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 1em;
  margin-bottom: 19px;
}

.bord-sub-title {
  font-size: 13px;
  letter-spacing: 0;
  line-height: 1.7em;
  margin-bottom: 22px;
}

.submit-button {
  width: 200px;
  margin: 0 auto;
}

.bord-color {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  margin: 0 30px 0 0;
}

.bord-input {
  display: flex;
  align-items: center;
  width: 180px;
  height: 40px;
  padding: 0 0 0 21px;
  border-radius: 4px;
  border: 1px solid $light_gray_blue_3;
  color: $gray_blue_4;
  background-color: $extra_light_gray;
}

.bord-input-container {
  display: flex;
  flex-flow: row;
  margin: 0 0 10px 0;
}

.bord-input-wrapper {
  display: flex;
  flex-flow: row;
  margin-bottom: 40px;
}

.bord-input-wrapper-left {
  margin: 0 50px 0 0;
}
</style>
