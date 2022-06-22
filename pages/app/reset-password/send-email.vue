<template>
  <div class="container">
    <SingleColumn class="template">
      <div>
        <img class="logo" src="/image/logo_white@2x.png" />
      </div>
      <h2>パスワード再発行</h2>
      <div class="guide">
        登録済みのメールアドレスにパスワード再発行用のURLを送信します。
      </div>
      <ValidationObserver v-slot="{ handleSubmit }" tag="div" class="full">
        <div class="full">
          <ValidationProvider
            v-slot="email"
            name="メールアドレス"
            rules="required|email"
            class="full"
          >
            <input
              v-model="form.email"
              placeholder="spot@spotwrite.org"
              class="input"
              :class="{ 'input-error': email.errors[0] }"
            />
            <span class="error">{{ email.errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="button-container full">
          <button
            :disabled="isLoading"
            class="button"
            @click="handleSubmit(onSendButtonClick)"
          >
            再発行メールの送信
          </button>
        </div>
      </ValidationObserver>
      <template v-slot:bottom>
        <div>
          <nuxt-link to="/admin/login" class="link">
            ログインはこちら
            <img
              class="arrow-right"
              src="/icon/icon_arrow_right_white@2x.png"
            />
          </nuxt-link>
        </div>
      </template>
    </SingleColumn>
    <SuccessMessage
      v-if="successMessageModal"
      @close="successMessageModal = !successMessageModal"
    >
      パスワード再発行用のリンクを送信しました。メールをご確認ください。
    </SuccessMessage>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import SingleColumn from '@/components/Admin/Templates/SingleColumn.vue';
import SuccessMessage from '@/components/Admin/Modules/Modal/SuccessMessage.vue';
import { sendResetPasswordEmailEmployee } from '@/libs/api';

export default Vue.extend({
  layout: 'clean',
  components: {
    SingleColumn,
    ValidationObserver,
    ValidationProvider,
    SuccessMessage,
  },
  data: () => ({
    form: {
      email: '' as string,
      type: 'employee',
    },
    isLoading: false as boolean,
    successMessageModal: false as boolean,
  }),
  methods: {
    async onSendButtonClick(): Promise<void> {
      try {
        this.isLoading = true;
        await sendResetPasswordEmailEmployee(this.form);
        this.successMessageModal = true;
      } catch (e) {
        alert('メールの送信に失敗しました。');
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.template {
  color: $true_white;
}

.logo {
  padding-left: 32px;
}

h2 {
  font-size: 15px;
  margin: 8px 0;
}

.guide {
  margin: 30px 0;
}

.full {
  width: 100%;

  > * {
    width: 100%;
  }
}

.input {
  height: 40px;
  background-color: $extra_light_gray;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  color: $gray_blue_4;
  padding: 0 11px;
  filter: none;
}

.input-error {
  background-color: $light_pink;
  border: 1px solid $valid_pink;
}

.error {
  color: #e52525;
}

.button-container {
  margin-top: 30px;
}

.button {
  height: 44px;
  text-align: center;
  border: none;
  background-color: $gray_blue_3;
  font-size: 15px;
  font-weight: 600;
  color: $true_white;
  border-radius: 4px;
}

.link {
  color: $true_white;
  display: flex;
  align-items: center;

  img {
    margin-left: 15px;
  }
}
</style>
