<template>
  <div class="page-container">
    <ValidationObserver v-slot="{ invalid, passes }">
      <Register :current="1">
        <template v-slot:header>
          <h2>プランを選択 - 大企業サポートプランお問い合わせ</h2>
          <div>
            担当者より折り返しご連絡させていただます。
          </div>
        </template>
        <div class="form">
          <label class="label">メールアドレス</label>
          <div class="email-text">{{ loginEmail }}</div>

          <label class="label">会社名</label>
          <ValidationProvider
            v-slot="companyName"
            rules="required"
            name="会社名"
            class="full"
          >
            <BaseInputText
              v-model="input.company_name"
              type="text"
              class="input"
              :class="{ 'validate-error': companyName.errors[0] }"
              placeholder="例）ワークスメディア"
            />
            <div class="error">{{ companyName.errors[0] }}</div>
          </ValidationProvider>

          <label class="label">代表者氏名</label>
          <ValidationProvider
            v-slot="representativeName"
            rules="required"
            name="代表者氏名"
            class="full"
          >
            <BaseInputText
              v-model="input.representative_name"
              type="text"
              class="input"
              :class="{ 'validate-error': representativeName.errors[0] }"
              placeholder="例）山田太郎"
            />
            <div class="error">{{ representativeName.errors[0] }}</div>
          </ValidationProvider>

          <label class="label">ご担当者名</label>
          <ValidationProvider
            v-slot="curatorName"
            rules="required"
            name="ご担当者名"
          >
            <BaseInputText
              v-model="input.curator"
              type="text"
              :class="{ 'validate-error': curatorName.errors[0] }"
              placeholder="例）山田太郎"
            />
            <div class="error">{{ curatorName.errors[0] }}</div>
          </ValidationProvider>

          <label>
            電話番号
          </label>
          <ValidationProvider
            v-slot="phoneNumber"
            rules="required|phone"
            name="電話番号"
          >
            <BaseInputText
              v-model="input.phone_number"
              type="text"
              :class="{ 'validate-error': phoneNumber.errors[0] }"
              placeholder="例）090-0000-0000"
            />
            <div class="error">{{ phoneNumber.errors[0] }}</div>
          </ValidationProvider>

          <label>郵便番号</label>
          <div>
            <ValidationProvider
              v-slot="postal_code"
              rules="required|postalCode"
              name="郵便番号"
            >
              <BaseInputText
                v-model="input.postal_code"
                class="w33p"
                :class="{ 'input-error': postal_code.errors[0] }"
                placeholder="例）000-0000"
              />
              <BaseButton
                size="large"
                class="postal-code-button"
                @click="fetchAddress"
              >
                郵便番号から検索
              </BaseButton>
              <div class="error">{{ postal_code.errors[0] }}</div>
            </ValidationProvider>
          </div>

          <label>住所</label>
          <ValidationProvider
            v-slot="address1"
            rules="required|max:200"
            name="住所（都道府県市区町村）"
          >
            <BaseInputText
              v-model="input.address1"
              :class="{ 'input-error': address1.errors[0] }"
              placeholder="例）東京都中央区晴海〇〇ー〇〇ー〇"
            />
            <span class="error">{{ address1.errors[0] }}</span>
          </ValidationProvider>
          <div></div>
          <ValidationProvider
            v-slot="address2"
            rules="max:200"
            name="住所（建物名など）"
          >
            <BaseInputText
              v-model="input.address2"
              :class="{ 'input-error': address2.errors[0] }"
              placeholder="例）△△ビル 3F"
            />
            <span class="error">{{ address2.errors[0] }}</span>
          </ValidationProvider>

          <label>会社規模</label>
          <ValidationProvider
            v-slot="size"
            rules="required|numeric|max:9"
            name="会社規模"
          >
            <div>
              <BaseInputText
                v-model="input.size"
                class="w33p"
                :class="{ 'input-error': size.errors[0] }"
                placeholder="例）100"
              />
              <span class="unit">人</span>
            </div>
            <span class="error">{{ size.errors[0] }}</span>
          </ValidationProvider>

          <label class="label">
            利用容量の追加
          </label>
          <div class="extend-store">
            <base-checkbox
              class="extend-storage-required"
              label="検討している"
              @change="selectExtendStorage"
            />
          </div>
        </div>
        <template v-slot:footer>
          <div class="actions">
            <OutlinedButton
              size="large"
              class="button back-button"
              @click="onBackButtonClick"
            >
              戻る
            </OutlinedButton>
            <BaseButton
              size="large"
              class="button decide-button"
              :disabled="invalid"
              @click="passes(sendMail)"
            >
              問い合わせをする
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
import YubinBango from 'yubinbango-core2';
import Register from '@/components/Admin/Templates/Register.vue';
import BaseInputText from '@/components/Admin/Modules/Input/BaseInputText.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import OutlinedButton from '@/components/Admin/Modules/Button/OutlinedButton.vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import { sendRegisterPlanContact } from '@/libs/api';

type YubinBangoAddress = {
  region: string;
  locality: string;
  street: string;
  extended: string;
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
    BaseCheckbox,
  },
  data: () => ({
    yubinBango: undefined as YubinBango.Core | undefined,
    input: {
      company_name: '',
      curator: '',
      representative_name: '',
      email: '',
      size: '',
      address1: '',
      address2: '',
      postal_code: '',
      phone_number: '',
      extend_storage: false,
    },
  }),
  computed: {
    loginEmail(): string {
      return this.$store.getters.userProfile.email;
    },
  },
  mounted() {
    if (this.$store.getters.isAccountHolderWithoutOwner === false) {
      this.$router.push({ path: '/admin' });
    }
    if (!this.$store.getters.userProfile) {
      this.$router.push('/admin/login');
    }
    this.input.email = this.loginEmail;
  },
  methods: {
    fetchAddress(): void {
      if (!this.input.postal_code) {
        return;
      }
      // eslint-disable-next-line no-new
      new YubinBango.Core(this.input.postal_code, (addr: YubinBangoAddress) => {
        if (addr.region === '') {
          alert('正しい郵便番号を入力してください');
        } else {
          Vue.set(
            this.input,
            'address1',
            `${addr.region}${addr.locality}${addr.street}`
          );
        }
      });
    },
    onBackButtonClick(): void {
      this.$router.push('/admin/register/select-plan');
    },
    async sendMail() {
      try {
        await sendRegisterPlanContact(this.input);
      } catch (e) {
        alert('システムエラー');
      } finally {
        this.$router.push('/admin/register/special-plan-contact-complete');
      }
    },
    selectExtendStorage() {
      this.input.extend_storage = !this.input.extend_storage;
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
  border-radius: 4px;
  display: grid;
  row-gap: 20px;
  grid-template-rows: auto auto;
  grid-template-columns: 180px auto;

  label {
    line-height: 40px;
    font-weight: 600;
  }
}

.unit {
  margin-left: 5px;
}

.postal-code-button {
  width: 160px;
}

.actions {
  .button {
    line-height: 40px;
    width: 232px;
    margin: auto 40px;
  }

  .back-button {
    border: solid 1px $light_gray_blue_3;
  }
}

.w50p {
  width: 50%;
}

.w33p {
  width: 33.3%;
}

.error {
  font-weight: 600;
  color: $red;
}

.input-error {
  background-color: $light_pink;
  border: 1px solid $valid_pink;
}

.validate-error {
  background-color: $light_pink;
  border: 1px solid $valid_pink;
}

.extend-storage-required {
  vertical-align: -webkit-baseline-middle;
}

.email-text {
  padding-top: 10px;
}
</style>
