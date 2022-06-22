<template>
  <div class="page-container">
    <ValidationObserver v-slot="{ invalid, passes }">
      <Register :current="2">
        <template v-slot:header>
          <h2>会社情報の入力</h2>
          <div>
            ご入力頂いた情報は登録完了後に管理画面で変更することができます。
          </div>
        </template>
        <div class="form">
          <label>会社名</label>
          <ValidationProvider
            v-slot="name"
            rules="required|max:20"
            name="会社名"
          >
            <BaseInputText
              v-model="form.name"
              placeholder="例）ワークスメディア"
              :class="{ 'input-error': name.errors[0] }"
            />
            <span class="error">{{ name.errors[0] }}</span>
          </ValidationProvider>

          <label>代表者氏名</label>
          <ValidationProvider
            v-slot="representative_name"
            rules="required|max:30"
            name="代表者氏名"
          >
            <BaseInputText
              v-model="form.representative_name"
              class="w50p"
              :class="{ 'input-error': representative_name.errors[0] }"
              placeholder="例）山田太郎"
            />
            <div class="error">{{ representative_name.errors[0] }}</div>
          </ValidationProvider>

          <label>電話番号</label>
          <ValidationProvider
            v-slot="tel"
            rules="required|phone"
            name="電話番号"
          >
            <BaseInputText
              v-model="form.tel"
              class="w50p"
              :class="{ 'input-error': tel.errors[0] }"
              placeholder="例）090-0000-0000"
            />
            <div class="error">{{ tel.errors[0] }}</div>
          </ValidationProvider>

          <label>郵便番号</label>
          <div>
            <ValidationProvider
              v-slot="postal_code"
              rules="required|postalCode"
              name="郵便番号"
            >
              <BaseInputText
                v-model="form.postal_code"
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
              v-model="form.address1"
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
              v-model="form.address2"
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
                v-model="form.size"
                class="w33p"
                :class="{ 'input-error': size.errors[0] }"
                placeholder="例）100"
              />
              <span class="unit">人</span>
            </div>
            <span class="error">{{ size.errors[0] }}</span>
          </ValidationProvider>
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
import YubinBango from 'yubinbango-core2';
import Register from '@/components/Admin/Templates/Register.vue';
import BaseInputText from '@/components/Admin/Modules/Input/BaseInputText.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import OutlinedButton from '@/components/Admin/Modules/Button/OutlinedButton.vue';
import { CompanyForm } from '@/store/contract';

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
  },
  data: () => ({
    yubinBango: undefined as YubinBango.Core | undefined,
    form: {
      name: '',
      representative_name: '',
      postal_code: '',
      address1: '',
      address2: '',
      tel: '',
      size: '',
    } as CompanyForm,
  }),
  computed: {
    isEdit(): boolean {
      return 'edit' in this.$route.query;
    },
    storedCompany(): CompanyForm | undefined {
      return this.$accessor.contract.company;
    },
  },
  created() {
    if (this.storedCompany !== undefined) {
      this.form = { ...this.storedCompany };
    }
  },
  methods: {
    fetchAddress(): void {
      if (!this.form.postal_code) {
        return;
      }
      // eslint-disable-next-line no-new
      new YubinBango.Core(this.form.postal_code, (addr: YubinBangoAddress) => {
        if (addr.region === '') {
          alert('正しい郵便番号を入力してください');
        } else {
          Vue.set(
            this.form,
            'address1',
            `${addr.region}${addr.locality}${addr.street}`
          );
        }
      });
    },
    onBackButtonClick(): void {
      this.$router.push('/admin/register/select-plan');
    },
    onDecideButtonClick(): void {
      this.$accessor.contract.saveCompany(this.form);
      if (this.isEdit) {
        this.$router.push('/admin/register/confirm');
      } else {
        this.$router.push('/admin/register/credit-card');
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
</style>
