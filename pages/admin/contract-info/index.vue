<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="契約情報"> </page-header>
      <h2>会社情報</h2>
      <div class="l-contents">
        <div class="edit-button-box">
          <base-button class="edit-button" @click="showCompanyInfoModal">
            編集
          </base-button>
        </div>
        <div class="info-row">
          <p class="label">会社名</p>
          <p class="content">{{ owner.name }}</p>
        </div>
        <div class="info-row">
          <p class="label">代表者名</p>
          <p class="content">{{ owner.representative_name }}</p>
        </div>
        <div class="info-row">
          <p class="label address">住所</p>
          <div>
            <p>〒 {{ owner.postal_code }}</p>
            <p>{{ owner.address1 }}</p>
            <p>{{ owner.address2 }}</p>
          </div>
        </div>
        <div class="info-row">
          <p class="label">電話番号</p>
          <p class="content">{{ owner.tel }}</p>
        </div>
        <div class="info-row">
          <p class="label">会社規模</p>
          <p class="content">{{ owner.size }}名</p>
        </div>
        <div class="info-row">
          <p class="label">会社ロゴ</p>
          <p class="content logo">
            <img v-if="owner.logo" :src="owner.logo.url" />
          </p>
        </div>
      </div>

      <h2 class="heading">契約プラン</h2>
      <div class="l-contents">
        <div class="edit-button-box">
          <base-button
            v-if="$accessor.userProfile.is_account_holder"
            class="edit-button"
            @click="changeContractPlan"
          >
            プラン変更
          </base-button>
        </div>
        <div class="info-row">
          <div v-if="contractStatusMessage && !isOverPlan" class="sentence">
            {{ contractStatusMessage }}
          </div>
          <div v-else-if="isOverPlan" class="downgrade-warning">
            <p>
              変更予定の「{{ contractStatus.downgrading.plan.name
              }}{{ memberAdd }}{{ storageAdd }}」の条件を満たしておりません。
            </p>
            <p>
              次回契約更新日（{{
                changeAt
              }}）までに条件を満たすよう調整をお願いします。
            </p>
            <p>
              期日までに条件が満たされない場合はプラン変更の予約はキャンセルとなります。
            </p>
            <ul>
              <li v-if="contractStatus.downgrading.over.member">
                最大利用人数 ・・・
                {{
                  contractStatus.downgrading.plan.max_member
                }}人まで（現在の人数{{
                  contractStatus.downgrading.over.member
                }}人）
              </li>
              <li v-if="contractStatus.downgrading.over.storage">
                ストレージ利用量 ・・・
                {{
                  contractStatus.downgrading.plan.max_storage
                }}GBまで（現在の利用量：{{
                  contractStatus.downgrading.over.storage
                }}GB）
              </li>
            </ul>
          </div>
        </div>
        <div class="info-row">
          <p class="label">利用プラン</p>
          <p class="content">
            {{ plan.name }}
            {{ memberAddCurrentPlan }}
            {{ storageAddCurrentPlan }}
          </p>
        </div>
        <div v-if="planChangedOn" class="info-row">
          <p class="label">次回更新日</p>
          <p class="content">{{ planChangedOn }}</p>
        </div>
      </div>

      <h2 class="heading">支払い情報</h2>
      <div class="l-contents">
        <ul class="credit-cards">
          <li v-for="(card, i) in creditCards" :key="card.id">
            <div class="credit-cart-box">
              <base-button
                v-if="$accessor.userProfile.is_account_holder"
                class="edit-button"
                @click="showPaymentMethodModal(i)"
              >
                変更
              </base-button>
              <div class="info-row">
                <p class="label label_long">
                  保存済みカード{{ i + 1 }}
                  <span v-if="i === 0" class="small">
                    （こちらのカード情報で自動決済を行います）
                  </span>
                </p>
              </div>
              <div class="info-row credit-card">
                <p class="label">クレジットカード</p>
                <p class="content">{{ card.brand }}</p>
              </div>
              <div class="info-row">
                <p class="label">カード番号</p>
                <p class="content">****-****-{{ card.last4 }}</p>
              </div>
              <div class="info-row">
                <p class="label">カード名義</p>
                <p class="content">{{ card.name }}</p>
              </div>
              <div class="info-row">
                <p class="label">有効期限</p>
                <p class="content">{{ card.exp_year }}/{{ card.exp_month }}</p>
              </div>
            </div>
          </li>
        </ul>
        <div v-if="creditCards.length < 2" class="button-box">
          <base-button
            v-if="$accessor.userProfile.is_account_holder"
            @click="showPaymentMethodModal"
          >
            クレジットカードを追加
          </base-button>
        </div>
      </div>
    </div>
    <company-info-modal
      v-if="companyInfoModal.show"
      :owner="clonedOwner()"
      @save="onOwnerSave"
      @close="closeCompanyInfoModal()"
    />
    <plan-change
      v-if="hasPlanChanged"
      :is-upgrading="isUpgrading"
      :changed-on="planChangedOn"
      @close="closePlanChangeModal()"
    />
    <payment-method-modal
      v-if="paymentMethodModal.show && selectedCard"
      :card="selectedCard"
      @save="onPaymentMethodSave"
      @close="closePaymentMethodModal()"
    />
    <alert-message
      v-if="planModal.alert"
      button-text="契約情報画面に戻る"
      @close="onPlanAlertMessageClose"
      ><div>
        <div class="error-message">
          ダウングレードに必要な条件を満たしていないためプラン変更をおこなうことができません。
        </div>
        <div class="text">
          次の条件を満たしたうえで、再度お手続きしてください。
        </div>
        <div class="info">
          <img class="icon-exclamation" src="/icon/icon_exclamation.png" />
          <p v-if="usage.members">
            ・最大利用人数 ・・・ {{ usage.members.limit }}人まで（現在の人数{{
              usage.members.usage
            }}人）
          </p>
          <p v-if="usage.storage">
            ・ストレージ利用量 ・・・
            {{ usage.storage.limit | bytoToGigaByte | chopZero }}GBまで
            （現在の利用量：
            {{ usage.storage.usage | bytoToGigaByte | chopZero }}GB）
          </p>
        </div>
      </div></alert-message
    >
    <alert-message
      v-if="paymentMethodModal.alert"
      class="alert"
      button-text="閉じる"
      @close="paymentMethodModal.alert = false"
      ><div class="center">
        クレジットカード情報が保存されました。
      </div></alert-message
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import AlertMessage from '@/components/Admin/Pages/ContractInfo/AlertMessage.vue';
import CompanyInfoModal from '@/components/Admin/Pages/ContractInfo/CompanyInfoModal.vue';
import PlanChange from '@/components/Admin/Pages/ContractInfo/PlanChange.vue';
import PaymentMethodModal from '@/components/Admin/Pages/ContractInfo/PaymentMethodModal.vue';
import dayjs from '@/libs/dayjs';
import {
  fetchMyOwner,
  fetchContractPlan,
  fetchContractStatus,
  fetchCreditCards,
} from '@/libs/api';

type NewCard = {
  name: string;
};
type CreditCard = ApiResponse.CreditCard | NewCard;

const emptyCard = {
  name: '',
};
type Owner = ApiResponse.Owner;
type ContractPlan = ApiResponse.ContractPlan;
type ContractStatus = ApiResponse.ContractStatus;
type Usage = {
  members: {
    limit: number;
    usage: number;
  };
  storage: {
    limit: number;
    usage: number;
  };
};

export default Vue.extend({
  layout: 'admin/default',
  components: {
    CompanyInfoModal,
    PaymentMethodModal,
    PageHeader,
    BaseButton,
    AlertMessage,
    PlanChange,
  },
  filters: {
    bytoToGigaByte(byte: number): string {
      const v = Math.round((byte / 1024 / 1024 / 1024) * 1000) / 1000;
      return v.toFixed(2);
    },
    chopZero(s: string): string {
      const chars = s.split('').reverse();
      while (chars.length > 0) {
        if (chars[0] === '.') {
          chars.shift();
          break;
        }
        if (chars[0] !== '0') {
          break;
        }
        chars.shift();
      }
      return chars.reverse().join('');
    },
  },
  data() {
    return {
      owner: {
        name: '',
        representative_name: '',
        postal_code: '',
        address1: '',
        address2: '',
        tel: '',
        size: '',
      } as Owner,
      plan: {
        name: '',
        contract_plan_owner: {
          max_member: 0,
          max_storage: 0,
        },
      } as ContractPlan,
      contractStatus: undefined as ContractStatus | undefined,
      usage: undefined as Usage | undefined,
      creditCards: [] as CreditCard[],
      selectedCard: undefined as CreditCard | undefined,
      companyInfoModal: {
        show: false,
      },
      planModal: {
        show: false,
        alert: false,
      },
      paymentMethodModal: {
        show: false,
        alert: false,
      },
      hasPlanChanged: false as boolean,
    };
  },
  computed: {
    storageAdd(): string {
      if (this.contractStatus.downgrading.plan.storage_add != null) {
        return `、追加容量${this.contractStatus.downgrading.plan.storage_add}GB`;
      }
      return '';
    },
    memberAdd(): string {
      if (this.contractStatus.downgrading.plan.type !== 'free') {
        return `、ご利用人数${this.contractStatus.downgrading.plan.max_member}人`;
      }
      return '';
    },
    planChangedOn(): string {
      if (!this.nextPlan) {
        return '';
      }
      return this.nextPlan.change_at
        ? dayjs.unix(this.nextPlan.change_at).format('YYYY年MM月DD日')
        : '';
    },
    isUpgrading(): boolean | undefined {
      if (!this.contractStatus) {
        return undefined;
      }

      if ('upgrading' in this.contractStatus) {
        return true;
      }

      if ('downgrading' in this.contractStatus) {
        return false;
      }

      return undefined;
    },
    nextPlan(): { name: string; change_at: number } | undefined {
      if (!this.contractStatus) {
        return undefined;
      }
      if ('upgrading' in this.contractStatus) {
        return {
          ...this.contractStatus.upgrading.plan,
          change_at: this.contractStatus.upgrading.change_at,
        };
      }
      if ('downgrading' in this.contractStatus) {
        return {
          ...this.contractStatus.downgrading.plan,
          change_at: this.contractStatus.downgrading.change_at,
        };
      }
      return undefined;
    },
    changeAt(): string {
      if (this.nextPlan) {
        return dayjs.unix(this.nextPlan.change_at).format('YYYY年MM月DD日');
      }
      return '';
    },
    contractStatusMessage(): string {
      if (!this.nextPlan) {
        return '';
      }
      if ('upgrading' in this.contractStatus) {
        return this.changeAt
          ? `次回契約更新日（${this.changeAt}）から新しいプラン料金にてお支払いとなります。`
          : '';
      }
      const planName = this.nextPlan.name;
      const maxMemberStr =
        this.nextPlan.type !== 'free'
          ? `、ご利用人数${this.nextPlan.max_member}人`
          : '';
      const maxStorageStr =
        this.nextPlan.storage_add != null
          ? `、追加容量${this.nextPlan.storage_add}GB`
          : '';
      return this.changeAt
        ? `次回契約更新日（${this.changeAt}）に「${planName}${maxMemberStr}${maxStorageStr}」にプラン変更されます。`
        : '';
    },
    isOverPlan(): boolean | undefined {
      if (!this.contractStatus) {
        return undefined;
      }

      if ('downgrading' in this.contractStatus) {
        if (this.contractStatus.downgrading.over) {
          return Object.keys(this.contractStatus.downgrading.over).length > 0;
        }
      }
      return undefined;
    },
    planModalMessage(): string {
      if (!this.nextPlan) {
        return '';
      }
      const planName = this.nextPlan.name;
      return this.changeAt && planName
        ? `次回契約更新日（${this.changeAt}）に「${planName}」にプラン変更されます。`
        : '';
    },
    memberAddCurrentPlan(): string {
      if (this.plan.type === 'group') {
        let memberAddLable = '';
        switch (this.plan.member_add) {
          case 50:
            memberAddLable = `、ご利用人数41～50人`;
            break;
          case 70:
            memberAddLable = `、ご利用人数51～70人`;
            break;
          case 100:
            memberAddLable = `、ご利用人数71～100人`;
            break;
          case 150:
            memberAddLable = `、ご利用人数101～150人`;
            break;
          case 200:
            memberAddLable = `、ご利用人数151～200人`;
            break;
          case 250:
            memberAddLable = `、ご利用人数201～250人`;
            break;
          case 320:
            memberAddLable = `、ご利用人数251～320人`;
            break;
          case 400:
            memberAddLable = `、ご利用人数321～400人`;
            break;
          case 500:
            memberAddLable = `、ご利用人数401～500人`;
            break;
          default:
            break;
        }
        return memberAddLable;
      }
      return this.plan.member_add > 0
        ? `、ご利用人数${this.plan.member_add}人`
        : '';
    },
    storageAddCurrentPlan(): string {
      return this.plan.storage_add > 0
        ? `、追加容量${this.plan.storage_add}G`
        : '';
    },
  },
  async created() {
    await this.fetchOwner();
    await this.fetchContractPlan();
    await this.fetchContractStatus();
    await this.fetchCreditCards();
    if ('changePlan' in this.$route.query) {
      if (this.$route.query.changePlan === 'success') {
        this.planModal.alert = false;
        this.hasPlanChanged = true;
      }
      if (this.$route.query.changePlan === 'error') {
        const usage = this.$accessor.contract?.changePlanResponse.data;
        this.planModal.alert = true;
        this.usage = usage;
      }
    }
  },
  methods: {
    async fetchOwner() {
      const { data } = await fetchMyOwner();
      this.owner = data;
    },
    async fetchCreditCards(): Promise<void> {
      try {
        const { data } = await fetchCreditCards();
        this.creditCards = data;
      } catch (e) {
        console.error(e);
      }
    },
    async fetchContractPlan() {
      const { data } = await fetchContractPlan();
      this.plan = data;
    },
    async fetchContractStatus() {
      const { data } = await fetchContractStatus();
      this.contractStatus = data;
      if ('downgrading' in data) {
        this.$accessor.contract.storeDowngradingStatus(data.downgrading);
      } else if (this.$accessor.contract.downgradingStatus) {
        this.$accessor.contract.storeDowngradingStatus(null);
      }
    },
    clonedOwner(): Owner {
      return cloneDeep<Owner>(this.owner);
    },
    showCompanyInfoModal() {
      this.companyInfoModal.show = true;
    },
    closeCompanyInfoModal() {
      this.companyInfoModal.show = false;
    },
    onOwnerSave(owner: Owner) {
      this.owner = owner;
      this.closeCompanyInfoModal();
    },
    showPaymentMethodModal(index?: number) {
      if (index !== undefined) {
        this.selectedCard = this.creditCards[index];
      } else {
        this.selectedCard = { ...emptyCard };
      }
      this.paymentMethodModal.show = true;
    },
    onPaymentMethodSave(): void {
      this.fetchCreditCards();
      this.paymentMethodModal.alert = true;
      this.closePaymentMethodModal();
    },
    onPlanAlertMessageClose(): void {
      this.planModal.alert = false;
      this.$router.replace({ query: {} });
    },
    closePaymentMethodModal() {
      this.paymentMethodModal.show = false;
    },
    closePlanChangeModal() {
      this.$router.replace({ query: {} });
      this.hasPlanChanged = false;
    },
    changeContractPlan() {
      this.$router.push('/admin/contract-info/change-plan');
    },
  },
});
</script>

<style lang="scss" scoped>
.l-page-container {
  color: $dark_blue;
}

.l-contents {
  padding: 33px 30px 30px 30px;
}

.heading {
  margin-top: 43px;
}

.edit-button {
  position: absolute;
  top: 0;
  right: 0;
  width: 95px;
}

.logo {
  height: 160px;
  width: 160px;
  border: 1px solid $light_gray_blue_3;
  border-radius: 6px;

  img {
    max-width: 100%;
    max-height: 100%;
  }
}

.info-row {
  display: flex;
  flex-direction: row;
  align-items: center;

  .label {
    width: 180px;
    font-weight: bold;

    &_long {
      width: 100%;
    }

    .small {
      font-size: 13px;
    }
  }

  .address {
    height: 40px;
  }

  & + & {
    margin-top: 35px;

    &.credit-card {
      margin-top: 15px;
    }
  }
}

.button-box {
  display: flex;
  justify-content: center;
  margin-top: 51px;

  .button {
    transform: translateX(-64px);
  }
}

.content {
  font-size: 15px;
}

.sentence {
  background-color: $white_1;
  padding: 14px 20px;
  margin-top: -13px;
  border-radius: 4px;
  color: $red;
}

.error-message {
  border-radius: 4px;
  color: $red;
  background-color: $light_pink;
  padding: 33px 56px;
}

.text {
  margin-top: 32px;
  font-size: 15px;
}

.info {
  position: relative;
  margin-top: 12px;
  padding: 20px 20px 20px 58px;
  border-radius: 4px;
  font-size: 15px;
  color: $gray_blue_4;
  background-color: $white_1;
}

.icon-exclamation {
  position: absolute;
  top: 20px;
  left: 20px;
}

.edit-button-box,
.credit-cart-box {
  position: relative;
}

.credit-cards {
  li:not(:last-child) {
    padding-bottom: 33px;
    margin: 33px auto;
    border-bottom: 1px solid $light_gray_blue_3;
  }
}

.credit-cart-box + .credit-cart-box {
  margin-top: 33px;
}

.separator {
  margin: 33px 0;
  height: 1px;
  background-color: $light_gray_blue_3;
  border: none;
  color: $light_gray_blue_3;
}

.downgrade-warning {
  background: $light_pink;
  color: $red;
  width: 85%;
  border-radius: 4px;
  padding: 15px;

  ul {
    list-style: disc inside none;
    padding: 0 0 0 5px;
  }
}
</style>
