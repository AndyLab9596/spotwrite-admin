<template>
  <div class="page-container">
    <Register :current="4">
      <template v-slot:header>
        <h2>ご入力内容の確認</h2>
      </template>
      <LoadingOverlay v-if="isLoadingOverlay"></LoadingOverlay>
      <div class="plan card">
        <div>
          {{ plan.name }}：
          <span class="plan-item__amount">
            <span class="unit">¥</span>
            <span class="amount">
              {{ plan.total_price.toLocaleString() }}
            </span>
          </span>
        </div>
        <OutlinedButton
          size="large"
          class="button change-plan-button"
          @click="onChangePlanButtonClick"
        >
          プランを変更
        </OutlinedButton>
      </div>
      <div class="company_card card">
        <div class="section">
          <div class="heading">
            <h3>会社情報</h3>
            <OutlinedButton
              size="large"
              class="button change-company-button"
              @click="onChangeCompanyButtonClick"
            >
              会社情報を変更
            </OutlinedButton>
          </div>
          <div class="content">
            <label>会社名</label>
            {{ company.name }}
            <label>代表者氏名</label>
            {{ company.representative_name }}
            <label>電話番号</label>
            {{ company.tel }}
            <label>郵便番号</label>
            {{ company.postal_code }}
            <label>住所</label>
            <div>
              <div>{{ company.address1 }}</div>
              <div>{{ company.address2 }}</div>
            </div>
            <label>会社規模</label>
            {{ company.size }}人
          </div>
        </div>
        <div class="section">
          <div class="heading">
            <h3>お支払い情報の入力</h3>
            <OutlinedButton
              size="large"
              class="button change-card-button"
              @click="onChangeCardButtonClick"
            >
              お支払い情報を変更
            </OutlinedButton>
          </div>
          <div class="content">
            <label>クレジットカード</label>
            {{ card.brand }}
            <label>カード番号</label>
            {{ `****_****_****_${card.last4}` }}
            <label>カード名義</label>
            {{ card.name }}
            <label>有効期限</label>
            {{ `${card.exp_year}年${card.exp_month}月` }}
            <label>セキュリティコード</label>
            ***
          </div>
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
            @click="onDecideButtonClick"
          >
            入力内容を決定する
          </BaseButton>
        </div>
      </template>
    </Register>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Register from '@/components/Admin/Templates/Register.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import OutlinedButton from '@/components/Admin/Modules/Button/OutlinedButton.vue';
import { ContractPlan, CompanyForm, CreditCard } from '@/store/contract';
import { createOwner } from '@/libs/api';
import { LoadingOverlay } from '@/components/Admin/Pages/';

export default Vue.extend({
  layout: 'clean',
  components: {
    Register,
    BaseButton,
    OutlinedButton,
    LoadingOverlay,
  },
  data: () => ({
    isLoadingOverlay: false as boolean,
  }),
  computed: {
    plan(): ContractPlan {
      return this.$accessor.contract.selectedPlan;
    },
    company(): CompanyForm {
      return this.$accessor.contract.company;
    },
    card(): CreditCard {
      return this.$accessor.contract.card;
    },
  },
  methods: {
    onChangePlanButtonClick(): void {
      this.$router.push('/admin/register/select-plan?edit');
    },
    onChangeCompanyButtonClick(): void {
      this.$router.push('/admin/register/company?edit');
    },
    onChangeCardButtonClick(): void {
      this.$router.push('/admin/register/credit-card?edit');
    },
    onBackButtonClick(): void {
      this.$router.push('/admin/register/credit-card');
    },
    async onDecideButtonClick(): Promise<void> {
      this.isLoadingOverlay = true;
      const planProducts = this.plan.products;
      const contract_plan = {
        uuid: this.plan.uuid,
        products: planProducts,
      };
      try {
        await createOwner({
          ...this.company,
          contract_plan,
          stripe_credit_card_token: this.card.token,
        });
        this.$accessor.contract.flush();
        this.$router.push('/admin/register/completed');
      } catch (e) {
        this.isLoadingOverlay = false;
        setTimeout(() => {
          if (e.response.status === 422) {
            if (
              e.response.data.type !== undefined &&
              e.response.data.type === 'card-error'
            ) {
              // eslint-disable-next-line
              alert(e.response.data.message);
            } else {
              // eslint-disable-next-line
              alert('入力情報に誤りがあります。登録内容を見直してください。');
            }
          } else {
            // eslint-disable-next-line
            alert('契約情報の登録に失敗しました。最初からやり直してください。');
          }
        }, 200);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.page-container {
  font-size: 15px;
}

.card {
  margin: 10px 40px 30px 40px;
  padding: 30px 45px;
  background-color: rgba(255, 255, 255, 0.4);
  width: 920px;
  border-radius: 4px;
}

.plan {
  padding: 15px 45px;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.company_card {
  .section {
    .heading {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: 18px;
      }
    }

    .content {
      margin-top: 10px;
      display: grid;
      row-gap: 20px;
      grid-template-columns: 180px auto;

      label {
        font-weight: 600;
      }
    }
  }

  .section:not(:first-child) {
    margin-top: 30px;
  }
}

.back-button {
  border: solid 1px $light_gray_blue_3;
}

.change-plan-button {
  width: 120px;
}

.actions {
  .button {
    line-height: 40px;
    width: 232px;
    margin: auto 40px;
  }
}
</style>
