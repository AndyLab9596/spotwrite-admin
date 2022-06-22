<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <LoadingOverlay v-if="isLoadingOverlay"></LoadingOverlay>
      <div class="modal-window">
        <ValidationObserver v-slot="{ invalid, passes }">
          <div class="modal-header">
            <p class="title">支払い情報</p>
            <img
              src="/icon/icon_cross.png"
              class="icon-cross"
              @click="onClose"
            />
          </div>
          <div>
            <img class="icon-credit-cards" src="/icon/icon_credit-cards.png" />
          </div>
          <div v-if="hasError" class="error-summary">
            {{ errorMessage }}
          </div>
          <div class="input-form">
            <div class="input-row">
              <p class="label">クレジットカード</p>
              <p>{{ card.brand }}</p>
            </div>
            <div class="input-row">
              <p class="label">カード番号</p>
              <div class="pseudo-input-text w300">
                <div ref="cardNumber"></div>
              </div>
            </div>
            <span v-if="numberError.length > 0" class="error-message">
              {{ numberError }}
            </span>
            <div class="input-row">
              <p class="label">カード名義</p>
              <ValidationProvider
                v-slot="name"
                rules="required|alpha_spaces"
                name="カード名義"
              >
                <BaseInputText v-model="form.name" class="content" />
                <div class="error-text">{{ name.errors[0] }}</div>
              </ValidationProvider>
            </div>
            <div class="input-row">
              <p class="label">有効期限</p>
              <div class="pseudo-input-text w300">
                <div ref="cardExpiry"></div>
              </div>
            </div>
            <span v-if="expiryError.length > 0" class="error-message">
              {{ expiryError }}
            </span>
            <div class="input-row">
              <p class="label">セキュリティーコード</p>
              <div class="pseudo-input-text w300">
                <div ref="cardCvc"></div>
              </div>
            </div>
            <span v-if="cvcError.length > 0" class="error-message">
              {{ cvcError }}
            </span>
          </div>
          <div class="button-box">
            <base-button
              v-if="card.id"
              size="large"
              :disabled="invalid || hasStripeError"
              @click="passes(onUpdate)"
              >変更する</base-button
            >
            <base-button
              v-else
              size="large"
              :disabled="invalid || hasStripeError || isSaving"
              @click="passes(onCreate)"
              >登録する</base-button
            >
            <base-button size="large" :disabled="isSaving" @click="onClose">
              キャンセル
            </base-button>
          </div>
        </ValidationObserver>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import {
  loadStripe,
  Stripe,
  StripeCardNumberElement,
  StripeCardExpiryElement,
  StripeCardCvcElement,
  StripeElementChangeEvent,
} from '@stripe/stripe-js';
import BaseInputText from '@/components/Admin/Modules/Input/BaseInputText.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import { createCreditCards, updateCreditCard } from '@/libs/api';
import { LoadingOverlay } from '@/components/Admin/Pages/';

type CreditCard = ApiResponse.CreditCard;
type CardForm = Pick<CreditCard, 'name'>;
type StripeError = {
  code: string;
  message: string;
};

const stripeElementStyles = {
  base: {
    color: '#6a6d83', // gray_blue_4
    backgroundColor: '#fafbff', // extra_light_gray
    ':-webkit-autofill': {
      color: '#6a6d83',
    },
    '::placeholder': {
      color: '#c3c4ce', // placeholder_gray
    },
  },
  complete: {
    backgroundColor: '#fff',
  },
};

type StripeEvent = {
  complete: boolean;
  elementType: string;
  empty: boolean;
  error: StripeError | undefined;
  value: string | undefined;
};

export default Vue.extend({
  components: {
    ValidationObserver,
    ValidationProvider,
    BaseInputText,
    BaseButton,
    LoadingOverlay,
  },
  props: {
    card: {
      type: Object as PropType<CreditCard>,
      required: true,
    },
  },
  data: () => ({
    form: {
      name: '',
    },
    isSaving: false as boolean,
    error: {} as StripeError | {},
    stripe: null as Stripe | null,
    cardNumberElement: undefined as StripeCardNumberElement | undefined,
    cardExpiryElement: undefined as StripeCardExpiryElement | undefined,
    cardCvcElement: undefined as StripeCardCvcElement | undefined,
    // 初期状態では各フォームが空なのでエラー扱いにする
    stripeElementErrors: {
      card_number: true,
      expiry: true,
      cvc: true,
    } as { [key: string]: boolean },
    // エラー
    numberError: '' as string,
    expiryError: '' as string,
    cvcError: '' as string,
    // カードの入力チェック
    cardError: {
      cvc: false,
      number: false,
      expiry: false,
    },
    isLoadingOverlay: false as boolean,
  }),
  computed: {
    expiry(): string {
      if (!this.card.exp_month) {
        return '';
      }
      const expYear2Digits = String(this.card.exp_year).substring(2);
      return `${this.card.exp_month}/${expYear2Digits}`;
    },
    hasStripeError(): boolean {
      return Object.values(this.stripeElementErrors).some((v: boolean) => v);
    },
    hasError(): boolean {
      return Object.keys(this.error).length > 0;
    },
    errorMessage(): string {
      if (
        this.hasError &&
        this.isStripeError(this.error) &&
        this.error.code === 'invalid_expiry_month_past'
      ) {
        return this.error.message;
      }
      return 'カード情報が正しくありません。正しい情報をご入力ください。';
    },
  },
  watch: {
    form: {
      handler() {
        this.error = {};
      },
      deep: true,
    },
  },
  created() {
    this.form = { ...this.card };
  },
  async mounted() {
    const stripeApiKey = process.env.StripeApiKey;
    if (!stripeApiKey) {
      throw new Error('invalid configuration.');
    }
    this.stripe = await loadStripe(stripeApiKey, { locale: 'ja' });

    if (this.stripe === null) {
      return;
    }

    const onStripeElementChange = (el: string) => {
      return (event: StripeElementChangeEvent) => {
        this.stripeElementErrors[el] = event.error !== undefined || event.empty;

        if (
          !['visa', 'mastercard', 'jcb', 'amex', 'diners'].includes(
            event.brand
          ) &&
          el === 'card_number' &&
          !this.stripeElementErrors[el]
        ) {
          this.stripeElementErrors[el] = true;
        }
      };
    };
    const elements = this.stripe.elements();

    this.cardNumberElement = elements.create('cardNumber', {
      style: stripeElementStyles,
      placeholder: this.card.last4 ? `****${this.card.last4}` : '',
    });
    this.cardNumberElement.on('change', onStripeElementChange('card_number'));
    this.cardExpiryElement = elements.create('cardExpiry', {
      style: stripeElementStyles,
      placeholder: this.expiry,
    });
    this.cardExpiryElement.on('change', onStripeElementChange('expiry'));
    this.cardCvcElement = elements.create('cardCvc', {
      style: stripeElementStyles,
    });
    this.cardCvcElement.on('change', onStripeElementChange('cvc'));
    this.cardNumberElement.mount(this.$refs.cardNumber as HTMLElement);
    this.cardExpiryElement.mount(this.$refs.cardExpiry as HTMLElement);
    this.cardCvcElement.mount(this.$refs.cardCvc as HTMLElement);

    this.listenForErrors();
  },
  methods: {
    isStripeError(error: StripeError | {}): error is StripeError {
      return 'code' in error;
    },
    listenForErrors(): void {
      const vm = this;

      if (this.cardNumberElement) {
        this.cardNumberElement.addEventListener(
          'change',
          (event: StripeEvent) => {
            this.toggleError(event, 'numberError');
            vm.cardError.number = !!event.complete;
          }
        );
      }

      if (this.cardExpiryElement) {
        this.cardExpiryElement.addEventListener(
          'change',
          (event: StripeEvent) => {
            this.toggleError(event, 'expiryError');
            vm.cardError.expiry = !!event.complete;
          }
        );
      }

      if (this.cardCvcElement) {
        this.cardCvcElement.addEventListener('change', (event: StripeEvent) => {
          this.toggleError(event, 'cvcError');
          vm.cardError.cvc = !!event.complete;
        });
      }
    },
    toggleError(event: StripeEvent, target: string): void {
      // エラーが起きたら、メッセージを設定する
      this.error = {};
      if (event.error) {
        if (target === 'numberError') {
          this.numberError = event.error.message;
        }

        if (target === 'expiryError') {
          this.expiryError = event.error.message;
        }

        if (target === 'cvcError') {
          this.cvcError = event.error.message;
        }
      }
      // エラーメッセージをリセット
      else {
        if (target === 'numberError') {
          if (
            !['visa', 'mastercard', 'jcb', 'amex', 'diners'].includes(
              event.brand
            )
          ) {
            this.numberError = `カードに問題があります。他のカードをご登録ください。`;
          } else {
            this.numberError = '';
          }
        }

        if (target === 'expiryError') {
          this.expiryError = '';
        }

        if (target === 'cvcError') {
          this.cvcError = '';
        }
      }
    },
    onClose() {
      this.$emit('close');
    },
    async onUpdate() {
      this.isSaving = true;
      this.isLoadingOverlay = true;
      try {
        await this.save(async (token: string) => {
          try {
            await updateCreditCard(this.card.id, token);
            this.$emit('save');
          } catch (ex) {
            this.isLoadingOverlay = false;
            setTimeout(() => {
              if (ex.response != null && ex.response.status === 422) {
                alert(ex.response?.data.message);
              }
              this.$emit('close');
            }, 200);
          }
        });
      } catch (e) {
        this.isLoadingOverlay = false;
        alert('クレジットカードの更新に失敗しました。');
      } finally {
        this.isSaving = false;
        this.isLoadingOverlay = false;
      }
    },
    async onCreate(): Promise<void> {
      this.isSaving = true;
      this.isLoadingOverlay = true;
      try {
        await this.save(async (token: string) => {
          try {
            await createCreditCards(token);
            this.$emit('save');
          } catch (ex) {
            this.isLoadingOverlay = false;
            setTimeout(() => {
              if (ex.response != null && ex.response.status === 422) {
                alert(ex.response?.data.message);
              }
              this.$emit('close');
            }, 200);
          }
        });
      } catch (e) {
        this.isLoadingOverlay = false;
        alert('クレジットカードの登録に失敗しました。');
      } finally {
        this.isLoadingOverlay = false;
        this.isSaving = false;
      }
    },
    async save(callback: Function) {
      this.error = {};
      if (this.stripe === null || this.cardNumberElement === undefined) {
        return;
      }
      const result = await this.stripe.createToken(this.cardNumberElement, {
        name: this.form.name,
      });
      if (result.error) {
        this.error = result.error;
        return;
      }
      if (!result.token) {
        this.error = 'トークンの取得に失敗しました。';
        return;
      }
      const token = result.token.id;
      return callback(token);
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
}

.modal-window {
  display: flex;
  flex-direction: column;
  background: $true_white;
  border-radius: 6px;
  padding: 20px 30px 30px 30px;
  box-shadow: 0 0 3px 0 $light_gray;
  width: 600px;
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
}

.icon-cross {
  cursor: pointer;
}

.text-red {
  color: red;
}

.button-box {
  display: flex;
  justify-content: center;

  button {
    width: 200px;

    &:nth-child(1) {
      margin-right: 20px;
    }
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

.error-summary {
  margin-top: 13px;
  color: $red;
  font-size: 15px;
  font-weight: 600;
}

.input-form {
  margin-top: 22px;
}

.input-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 32px;

  .label {
    width: 180px;
    font-size: 15px;
    font-weight: 600;

    &_long {
      width: 100%;
    }
  }

  .content {
    width: 300px;
    height: 40px;
    line-height: 40px;
    background-color: $extra_light_gray;
    border-radius: 4px;
    border: solid 1px $light_gray_blue_3;
    color: $gray_blue_4;
    padding-right: 8px;
    padding-left: 8px;
  }
}

.pseudo-input-text {
  padding: 11px;
  border-radius: 4px;
  background-color: $extra_light_gray;
  border: 1px solid $light_gray_blue_3;
  height: 40px;
}

.w300 {
  width: 300px;
}

.icon-credit-cards {
  margin-top: 19px;
}

.error-message {
  grid-column-start: 2;
  grid-column-end: -1;
  margin: 0;
  font-weight: 600;
  color: $red;
  clear: both;
  position: relative;
  top: -25px;
}
</style>
