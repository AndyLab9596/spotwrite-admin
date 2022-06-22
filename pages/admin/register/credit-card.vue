<template>
  <div class="page-container">
    <ValidationObserver v-slot="{ invalid, passes }">
      <Register :current="3">
        <template v-slot:header>
          <h2>お支払い情報の入力</h2>
        </template>
        <LoadingOverlay v-if="isLoadingOverlay"></LoadingOverlay>
        <div class="form">
          <div class="form__top">
            <div v-if="hasError" class="error-summary">
              {{ errorMessage }}
            </div>
            <ul class="logos">
              <li><img src="/image/logo_visa.svg" /></li>
              <li><img src="/image/logo_master.svg" /></li>
              <li><img src="/image/logo_jcb.svg" /></li>
              <li><img src="/image/logo_amex.svg" /></li>
              <li><img src="/image/logo_diners.svg" /></li>
            </ul>
          </div>
          <label>カード番号</label>
          <div
            class="pseudo-input-text w400"
            :class="{ 'input-error': numberError.length > 0 }"
          >
            <div ref="cardNumber"></div>
          </div>
          <div v-if="numberError.length > 0" class="error-message">
            {{ numberError }}
          </div>

          <label>カード名義</label>
          <div>
            <ValidationProvider
              v-slot="name"
              rules="required|alpha_spaces"
              name="カード名義"
            >
              <BaseInputText
                v-model="form.name"
                class="card-holder-name w400"
                :class="{ 'input-error': name.errors[0] }"
                placeholder="カード記載のお名前をご入力ください。"
              />
              <div class="validation-error">{{ name.errors[0] }}</div>
            </ValidationProvider>
          </div>

          <label>有効期限</label>
          <div
            class="pseudo-input-text w200"
            :class="{ 'input-error': expiryError.length > 0 }"
          >
            <div ref="cardExpiry"></div>
          </div>
          <div v-if="expiryError.length > 0" class="error-message">
            {{ expiryError }}
          </div>

          <label>セキュリティコード</label>
          <div
            class="pseudo-input-text w200"
            :class="{ 'input-error': cvcError.length > 0 }"
          >
            <div ref="cardCvc"></div>
          </div>
          <div v-if="cvcError.length > 0" class="error-message">
            {{ cvcError }}
          </div>
        </div>

        <template v-slot:footer>
          <div class="actions">
            <OutlinedButton
              size="large"
              class="button"
              @click="onBackButtonClick"
            >
              戻る
            </OutlinedButton>
            <BaseButton
              size="large"
              class="button decide-button"
              :disabled="
                invalid || hasError || !isComplete || numberError !== ''
              "
              @click="passes(onDecideButtonClick)"
            >
              入力内容を決定する
            </BaseButton>
          </div>
        </template>
      </Register>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import {
  loadStripe,
  Stripe,
  StripeCardNumberElement,
  StripeCardExpiryElement,
  StripeCardCvcElement,
} from '@stripe/stripe-js';
import { LoadingOverlay } from '@/components/Admin/Pages/';
import Register from '@/components/Admin/Templates/Register.vue';
import BaseInputText from '@/components/Admin/Modules/Input/BaseInputText.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import OutlinedButton from '@/components/Admin/Modules/Button/OutlinedButton.vue';
import { CreditCard } from '@/store/contract';

const stripeElementStyles = {
  base: {
    color: '#6a6d83', // gray_blue_4
    ':-webkit-autofill': {
      color: '#6a6d83',
    },
    '::placeholder': {
      color: '#c3c4ce', // placeholder_gray
    },
  },
  invalid: {
    color: '#6a6d83',
  },
};

type StripeEvent = {
  complete: boolean;
  elementType: string;
  empty: boolean;
  error: StripeError | undefined;
  value: string | undefined;
};

type StripeError = {
  code: string;
  message: string;
};

export default Vue.extend({
  layout: 'clean',
  components: {
    ValidationObserver,
    ValidationProvider,
    Register,
    BaseInputText,
    BaseButton,
    OutlinedButton,
    LoadingOverlay,
  },
  data: () => ({
    form: {
      name: '' as string,
    },
    error: {} as StripeError | {},
    stripe: null as Stripe | null,
    cardNumberElement: undefined as StripeCardNumberElement | undefined,
    cardExpiryElement: undefined as StripeCardExpiryElement | undefined,
    cardCvcElement: undefined as StripeCardCvcElement | undefined,
    // 入力完成
    card: {
      cvc: false,
      number: false,
      expiry: false,
    },
    // エラー
    numberError: '' as string,
    expiryError: '' as string,
    cvcError: '' as string,
    stripeError: '' as string,
    isLoadingOverlay: false as boolean,
  }),
  computed: {
    storedCard(): CreditCard | undefined {
      return this.$accessor.contract.card;
    },
    hasError(): boolean {
      return Object.keys(this.error).length > 0;
    },
    errorMessage(): string {
      if (this.hasError && this.isStripeError(this.error)) {
        return this.error.message;
      }
      return 'カード情報が正しくありません。正しい情報をご入力ください。';
    },
    isComplete(): boolean {
      return this.card.cvc && this.card.expiry && this.card.number;
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
  async mounted() {
    const stripeApiKey = process.env.StripeApiKey;
    if (!stripeApiKey) {
      throw new Error('invalid configuration.');
    }
    this.stripe = await loadStripe(stripeApiKey, { locale: 'ja' });

    if (this.stripe === null) {
      return;
    }
    const elements = this.stripe.elements();
    this.cardNumberElement = elements.create('cardNumber', {
      style: stripeElementStyles,
    });
    this.cardExpiryElement = elements.create('cardExpiry', {
      style: stripeElementStyles,
    });
    this.cardCvcElement = elements.create('cardCvc', {
      style: stripeElementStyles,
    });
    this.cardNumberElement.mount(this.$refs.cardNumber as HTMLElement);
    this.cardExpiryElement.mount(this.$refs.cardExpiry as HTMLElement);
    this.cardCvcElement.mount(this.$refs.cardCvc as HTMLElement);

    this.listenForErrors();
  },
  methods: {
    isStripeError(error: StripeError | {}): error is StripeError {
      return 'code' in error;
    },
    onBackButtonClick(): void {
      this.$router.push('/admin/register/company');
    },
    onDecideButtonClick(): void {
      this.error = {};
      if (this.stripe === null || this.cardNumberElement === undefined) {
        return;
      }
      this.isLoadingOverlay = true;
      this.stripe
        .createToken(this.cardNumberElement, { name: this.form.name })
        .then((result: any) => {
          if (result.error) {
            this.error = result.error;
            this.isLoadingOverlay = false;
            return;
          }
          const card: CreditCard = {
            token: result.token.id,
            name: result.token.card.name,
            brand: result.token.card.brand,
            last4: result.token.card.last4,
            exp_year: result.token.card.exp_year,
            exp_month: result.token.card.exp_month,
          };
          this.$accessor.contract.saveCard(card);
          this.$router.push('/admin/register/confirm');
        });
    },
    listenForErrors(): void {
      const vm = this;

      if (this.cardNumberElement) {
        this.cardNumberElement.addEventListener(
          'change',
          (event: StripeEvent) => {
            this.toggleError(event, 'numberError');
            vm.card.number = !!event.complete;
          }
        );
      }

      if (this.cardExpiryElement) {
        this.cardExpiryElement.addEventListener(
          'change',
          (event: StripeEvent) => {
            this.toggleError(event, 'expiryError');
            vm.card.expiry = !!event.complete;
          }
        );
      }

      if (this.cardCvcElement) {
        this.cardCvcElement.addEventListener('change', (event: StripeEvent) => {
          this.toggleError(event, 'cvcError');
          vm.card.cvc = !!event.complete;
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
  },
});
</script>
<style lang="scss" scoped>
.page-container {
  font-size: 15px;
}

.form {
  margin: 10px 40px 30px 40px;
  padding: 30px 45px;
  background-color: rgba(255, 255, 255, 0.4);
  width: 920px;
  display: grid;
  row-gap: 20px;
  grid-template-rows: auto auto;
  grid-template-columns: 180px auto;

  &__top {
    grid-column-start: 2;
    grid-column-end: -1;
  }

  .error-summary {
    color: $red;
    font-weight: 600;
  }

  .logos {
    display: flex;
    align-items: center;
    background-color: $true_white;
    border-radius: 4px;
    padding: 3px 10px;
    width: 300px;

    > li:not(:first-child) {
      margin-left: 20px;
    }
  }

  label {
    line-height: 40px;
    font-weight: 600;
  }

  .pseudo-input-text {
    padding: 11px;
    border-radius: 4px;
    background-color: $extra_light_gray;
    height: 40px;
  }

  .input-error {
    background-color: $light_pink;
    border: 1px solid $valid_pink;
  }

  .w400 {
    width: 400px;
  }

  .w200 {
    width: 200px;
  }
}

.error-message {
  grid-column-start: 2;
  grid-column-end: -1;
  margin: -10px 0;
  font-weight: 600;
  color: $red;
}

.validation-error {
  padding: 10px 0 0 0;
  font-weight: 600;
  color: $red;
}

.actions {
  .button {
    line-height: 40px;
    width: 232px;
    margin: auto 40px;
  }
}
</style>
