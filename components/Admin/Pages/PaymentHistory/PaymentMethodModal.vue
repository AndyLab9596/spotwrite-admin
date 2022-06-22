<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <LoadingOverlay v-if="isLoadingOverlay"></LoadingOverlay>
      <div class="modal-window">
        <ValidationObserver v-slot="{ invalid }">
          <div class="modal-header">
            <p class="title">支払い情報</p>
            <img
              src="/icon/icon_cross.png"
              class="icon-cross"
              @click="onClose"
            />
          </div>
          <div class="select-credit-card-box">
            <label v-for="card in cards" :key="card.id" class="radio-item"
              ><input
                v-model="selectedCard"
                :value="card"
                type="radio"
                checked
              /><span class="name">{{ card.brand }}</span
              ><span class="number">************{{ card.last4 }}</span></label
            >
            <label class="radio-item"
              ><input v-model="selectedCard" type="radio" :value="form" /><span
                class="name"
                >上記以外のカードで決済する</span
              >
            </label>
          </div>
          <div v-if="hasError" class="error-summary">
            {{ errorMessage }}
          </div>
          <div>
            <img class="icon-credit-cards" src="/icon/icon_credit-cards.png" />
          </div>
          <div class="input-form">
            <div
              v-if="form.brand || (selectedCard && selectedCard !== form)"
              class="input-row"
            >
              <p class="label">クレジットカード</p>
              <p v-if="selectedCard === form">{{ form.brand }}</p>
              <p v-else>{{ selectedCard.brand }}</p>
            </div>
            <div class="input-row">
              <p class="label">カード番号</p>
              <div class="pseudo-input-text w300">
                <div ref="cardNumber"></div>
                <div
                  v-if="selectedCard && selectedCard !== form"
                  class="input-overlay"
                >
                  **** **** **** {{ selectedCard.last4 }}
                </div>
              </div>
            </div>
            <span
              v-if="numberError.length > 0 && selectedCard === form"
              class="error-message"
            >
              {{ numberError }}
            </span>
            <div class="input-row">
              <p class="label">カード名義</p>
              <ValidationProvider
                v-slot="name"
                rules="required|alpha_spaces"
                name="カード名義"
                tag="div"
                class="w300"
              >
                <BaseInputText
                  v-model="form.name"
                  class="content"
                  placeholder="お名前をご入力ください。"
                  :readonly="selectedCard !== form"
                />
                <div
                  v-if="selectedCard && selectedCard !== form"
                  class="input-overlay pseudo-input-text"
                >
                  {{ selectedCard.name }}
                </div>
                <div v-if="selectedCard === form" class="error-text">
                  {{ name.errors[0] }}
                </div>
              </ValidationProvider>
            </div>
            <div class="input-row">
              <p class="label">有効期限</p>
              <div class="pseudo-input-text w300">
                <div ref="cardExpiry"></div>
                <div
                  v-if="selectedCard && selectedCard !== form"
                  class="input-overlay"
                >
                  {{ selectedCard.exp_month }} /
                  {{ selectedCard.exp_year % 100 }}
                </div>
              </div>
            </div>
            <span
              v-if="expiryError.length > 0 && selectedCard === form"
              class="error-message"
            >
              {{ expiryError }}
            </span>
            <div class="input-row">
              <p class="label">セキュリティーコード</p>
              <div class="pseudo-input-text w300">
                <div ref="cardCvc"></div>
                <div
                  v-if="selectedCard && selectedCard !== form"
                  class="input-overlay"
                >
                  ***
                </div>
              </div>
            </div>
            <span
              v-if="cvcError.length > 0 && selectedCard === form"
              class="error-message"
            >
              {{ cvcError }}
            </span>
          </div>
          <div class="button-box">
            <base-button
              size="large"
              :disabled="
                (selectedCard === form && (invalid || hasStripeError)) ||
                  isSaving
              "
              @click="onPay"
              >決済する</base-button
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
} from '@stripe/stripe-js';
import BaseInputText from '@/components/Admin/Modules/Input/BaseInputText.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import { paymentRetry } from '@/libs/api';
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
    cards: {
      type: Array as PropType<CreditCard>[],
      required: true,
    },
    invoiceId: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    selectedCard: null as CreditCard,
    form: {
      brand: '',
      name: '',
    } as CreditCard,
    isSaving: false as boolean,
    error: {} as StripeError | {},
    stripe: null as Stripe | null,
    cardNumberElement: undefined as StripeCardNumberElement | undefined,
    cardExpiryElement: undefined as StripeCardExpiryElement | undefined,
    cardCvcElement: undefined as StripeCardCvcElement | undefined,
    numberError: '' as string,
    expiryError: '' as string,
    cvcError: '' as string,
    stripeErrors: {
      numberError: true,
      expiryError: true,
      cvcError: true,
    },
    paymentRetryError: '' as string,
    isLoadingOverlay: false as boolean,
  }),
  computed: {
    hasStripeError(): boolean {
      return Object.values(this.stripeErrors).some((v: boolean) => v);
    },
    hasError(): boolean {
      return Object.keys(this.error).length > 0 || this.paymentRetryError;
    },
    isStripeError(): boolean {
      return (error: StripeError | {}) => {
        return 'code' in error;
      };
    },
    errorMessage(): string {
      if (
        this.hasError &&
        this.isStripeError(this.error) &&
        this.error.code === 'invalid_expiry_month_past'
      ) {
        return this.error.message;
      }
      if (this.paymentRetryError) {
        return this.paymentRetryError;
      }
      return 'カード情報が正しくありません。正しい情報をご入力ください。';
    },
  },
  watch: {
    form: {
      handler() {
        this.error = {};
        this.paymentRetryError = '';
      },
      deep: true,
    },
    selectedCard() {
      this.paymentRetryError = '';
      if (this.selectedCard === this.form) {
        this.cardNumberElement.focus();
      }
    },
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

    const defaultCardIndex = this.cards.findIndex((card: CreditCard) => {
      return card.is_default;
    });
    if (defaultCardIndex > -1) {
      this.selectedCard = this.cards[defaultCardIndex];
    } else if (this.cards.length) {
      [this.selectedCard] = this.cards;
    } else {
      this.selectedCard = this.form;
    }

    this.initElements();
  },
  methods: {
    initElements(): void {
      const elements = this.stripe.elements();

      this.cardNumberElement = elements.create('cardNumber', {
        style: stripeElementStyles,
        placeholder: '**** _ **** _ ***',
      });
      this.cardExpiryElement = elements.create('cardExpiry', {
        style: stripeElementStyles,
        placeholder: '−-/-−',
      });
      this.cardCvcElement = elements.create('cardCvc', {
        style: stripeElementStyles,
      });

      this.cardNumberElement.mount(this.$refs.cardNumber as HTMLElement);
      this.cardExpiryElement.mount(this.$refs.cardExpiry as HTMLElement);
      this.cardCvcElement.mount(this.$refs.cardCvc as HTMLElement);

      this.cardNumberElement.on('change', (event: StripeEvent) => {
        if (event.brand !== 'unknown') {
          this.form.brand = event.brand;
        } else {
          this.form.brand = '';
        }
        this.toggleError(event, 'numberError');
      });
      this.cardExpiryElement.on('change', (event: StripeEvent) => {
        this.toggleError(event, 'expiryError');
      });
      this.cardCvcElement.on('change', (event: StripeEvent) => {
        this.toggleError(event, 'cvcError');
      });
    },
    toggleError(event: StripeEvent, target: string): void {
      this.error = {};
      this.paymentRetryError = '';
      this.stripeErrors[target] = event.error !== undefined || event.empty;
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
      } else {
        if (target === 'numberError') {
          if (
            event.complete &&
            !['visa', 'mastercard', 'jcb', 'amex', 'diners'].includes(
              event.brand
            )
          ) {
            this.stripeErrors[target] = true;
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
    async onPay(): Promise<void> {
      this.isSaving = true;
      this.isLoadingOverlay = true;
      if (this.selectedCard === this.form) {
        try {
          await this.save(async (token: string) => {
            try {
              await paymentRetry({
                invoice_id: this.invoiceId,
                token,
              });
              this.$emit('pay');
            } catch (ex) {
              this.isLoadingOverlay = false;
              setTimeout(() => {
                if (ex.response != null && ex.response.status === 422) {
                  this.paymentRetryError = ex.response?.data.message;
                } else {
                  this.$emit('close');
                }
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
      } else {
        try {
          await paymentRetry({
            invoice_id: this.invoiceId,
            card_id: this.selectedCard.id,
          });
          this.$emit('pay');
        } catch (ex) {
          this.isLoadingOverlay = false;
          setTimeout(() => {
            if (ex.response != null && ex.response.status === 422) {
              this.paymentRetryError = ex.response?.data.message;
            } else {
              this.$emit('close');
            }
          }, 200);
        } finally {
          this.isLoadingOverlay = false;
          this.isSaving = false;
        }
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
  color: $red;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 5px;
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
  position: relative;
  width: 300px;

  .input-overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #fafbff;
    color: #6a6d83;
    font-size: 15px;
    padding: calc(10.5px) 10px 0;
    font-family: sans-serif;
  }
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

.select-credit-card-box {
  margin-top: 15px;
  margin-bottom: 5px;
}

.name {
  margin-left: 15px;
  font-size: 15px;
  color: $dark_blue;
}

.number {
  margin-left: 3px;
  font-size: 15px;
  color: $dark_blue;
}

.radio-item {
  display: block;

  & + .radio-item {
    margin-top: 15px;
  }
}
</style>
