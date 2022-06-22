<template>
  <div class="page-container">
    <div class="page">
      <nuxt-link
        tag="a"
        :to="'/system-admin/contract-company'"
        class="back-link"
      >
        ＜ 一覧に戻る
      </nuxt-link>
      <h1 class="page-title">
        <img class="icon-pass" src="/icon/pass.svg" />
        <span>契約会社一覧</span>
      </h1>
      <h2 class="page-subtitle">{{ owner.name }}</h2>
      <div class="block-title">会社情報</div>
      <div class="block-container">
        <vue-loading
          v-if="isLoading"
          type="spin"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
        <div v-else>
          <div class="block-row">
            <div class="label">代表者名</div>
            <div class="text">{{ owner.representative_name }}</div>
          </div>
          <div class="block-row">
            <div class="label address">住所</div>
            <div>
              <div>〒 {{ owner.postal_code }}</div>
              <div>{{ owner.address1 }} {{ owner.address2 }}</div>
            </div>
          </div>
          <div class="block-row">
            <div class="label">電話番号</div>
            <div class="text">{{ owner.tel }}</div>
          </div>
          <div class="block-row">
            <div class="label">会社規模</div>
            <div class="text">{{ owner.size }}名</div>
          </div>
        </div>
      </div>
      <div class="block-title">契約情報</div>
      <div class="block-container">
        <vue-loading
          v-if="isLoading"
          type="spin"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
        <div v-else>
          <div
            v-if="
              owner.contract_plan.is_upgrading ||
                owner.contract_plan.is_downgrading
            "
            class="block-row changed-label"
          >
            <span>
              {{ formatedDate(owner.contract_plan.pivot.end_at) }}に「{{
                contractPlan.name
              }}{{ maxMember(contractPlan)
              }}{{ storageAdd(contractPlan) }}」へ変更されます。
            </span>
          </div>
          <div class="block-row">
            <div class="label">利用プラン</div>
            <div class="text">
              {{ contractPlan.name }}{{ maxMember(contractPlan)
              }}{{ storageAdd(contractPlan) }}
            </div>
            <base-button
              class="payment-history-button"
              @click="$router.push('/system-admin/payment-history/' + uuid)"
            >
              決済履歴一覧をみる
            </base-button>
          </div>
          <div class="block-row">
            <div class="label">料金</div>
            <div class="text">
              ¥{{ formatedNumber(contractPlan.pivot.total_monthly_price) }}
            </div>
          </div>
          <div class="block-row">
            <div class="label">利用状況</div>
            <div class="text">{{ statusToJapanese(owner.status) }}</div>
          </div>
          <div class="block-row">
            <div class="label">支払い方法</div>
            <div class="text">{{ owner.payment_method }}</div>
          </div>
          <div class="block-row">
            <div class="label">次回決済日</div>
            <!-- TODO 契約周りの処理ができたら取得する -->
            <div class="text">
              {{ formatedDate(owner.contract_plan.pivot.end_at) }}
            </div>
          </div>
          <div class="block-row">
            <div class="label">契約開始日</div>
            <div class="text">{{ formatedDate(owner.contract_date) }}</div>
          </div>
          <div class="block-row">
            <div class="label">担当者メールアドレス</div>
            <div class="text">{{ owner.account_holder_email }}</div>
          </div>
        </div>
      </div>
      <div class="block-title">フリーメモ欄</div>
      <div class="block-container form">
        <vue-loading
          v-if="isLoading || isUpdateLoading"
          type="spin"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
        <div v-else>
          <textarea
            v-if="showFreeMemoInput"
            v-model="freeMemoInputValue"
            rows="5"
            placeholder="フリーメモ欄"
          ></textarea>
          <base-button
            v-if="showFreeMemoInput"
            class="save-button"
            @click="updateContractPlan()"
          >
            保存
          </base-button>
          <div v-if="!showFreeMemoInput" class="block-row">
            <div class="text">{{ contractPlan.free_memo }}</div>
            <base-button class="edit-button" @click="showFreeMemoInput = true">
              編集
            </base-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import { VueLoading } from 'vue-loading-template';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import { fetchAdminContractCompany, updateAdminContractPlan } from '@/libs/api';

type Owner = ApiResponse.Owner;
type ContractPlan = ApiRequest.ContractPlan;

export default Vue.extend({
  layout: 'system-admin/default',
  components: {
    VueLoading,
    BaseButton,
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
      contractPlan: {} as ContractPlan,
      isLoading: false,
      isUpdateLoading: false,
      showFreeMemoInput: false,
      freeMemoInputValue: '',
    };
  },
  computed: {
    uuid(): string {
      return this.$route.params.id;
    },
    storageAdd(): string {
      return (contractPlan: ContractPlan) => {
        if (contractPlan.pivot.storage_add) {
          return `、追加容量${contractPlan.pivot.storage_add}GB`;
        }
        return '';
      };
    },
    maxMember(): string {
      return (contractPlan: ContractPlan) => {
        if (contractPlan.type !== 'free') {
          return `、ご利用人数${contractPlan.pivot.max_member}人`;
        }
        return '';
      };
    },
  },
  created() {
    this.fetchOwner();
  },
  methods: {
    async fetchOwner() {
      this.isLoading = true;
      try {
        const { data } = await fetchAdminContractCompany(this.uuid);
        this.owner = data;
        this.contractPlan = data.contract_plan;
        this.freeMemoInputValue = this.contractPlan.free_memo;
      } catch (e) {
        throw new Error(e);
      } finally {
        this.isLoading = false;
      }
    },
    async updateContractPlan() {
      if (this.freeMemoInputValue !== this.contractPlan.free_memo) {
        this.isUpdateLoading = true;
        try {
          const newContractPlan = { free_memo: this.freeMemoInputValue };
          const { data } = await updateAdminContractPlan(
            this.contractPlan.uuid,
            newContractPlan
          );
          this.contractPlan = data;
          this.freeMemoInputValue = this.contractPlan.free_memo;
        } catch (e) {
          throw new Error(e);
        } finally {
          this.isUpdateLoading = false;
        }
      }
      this.showFreeMemoInput = false;
    },
    formatedNumber(number: number) {
      return Number(number).toLocaleString('ja-JP-u-ca-japanese');
    },
    formatedDate(time: number) {
      return dayjs(time).format('YYYY年MM月DD日');
    },
    statusToJapanese(status: string) {
      switch (status) {
        case 'unsettled':
          return '未決済';
        case 'payment_completed':
          return '決済完了';
        case 'stopping':
          return '停止中';
        case 'withdraw':
          return '退会';
        default:
          return '-';
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.page-container {
  background-color: #fff;
  padding-bottom: 40px;
}

.page {
  width: 960px;
  min-height: calc(100% - 128px);
  margin-left: 40px;
  color: #2e303e;

  .back-link {
    margin-bottom: 10px;
    display: table;
    padding: 10px;
    background-color: #f7f8fd;
    border-radius: 4px;
    color: #2f303e;
    font-size: 13px;
  }

  &-title {
    line-height: 36px;
    font-size: 24px;
    padding: 15px;
    color: #2e303e;
    font-weight: normal;

    .icon-pass {
      height: 36px;
      margin-right: 38px;
    }
  }

  &-subtitle {
    font-size: 20px;
    font-weight: normal;
    margin-top: 15px;
  }

  .block-title {
    margin-top: 25px;
    margin-bottom: 15px;
    font-size: 20px;
  }

  .block-container {
    position: relative;
    padding: 30px;
    border: solid 1px #e4e5ed;
    border-radius: 4px;

    & + .block-title {
      margin-top: 40px;
    }

    .block-row {
      display: flex;

      .label {
        width: 180px;
        flex-shrink: 0;
      }

      .text {
        flex-grow: 1;
      }

      .payment-history-button {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 145px;
        height: 30px;
        font-size: 12px;
        font-weight: normal;
      }

      &.changed-label {
        width: calc(100% - 156px);

        span {
          display: flex;
          align-items: center;
          min-width: 688px;
          height: 44px;
          font-size: 15px;
          background: $white_1;
          color: $red;
          padding: 0 20px;
          border-radius: 4px;
        }
      }

      & + .block-row {
        margin-top: 30px;
      }
    }

    &.form {
      padding: 10px;

      textarea {
        padding: 20px 100px 20px 25px;
        border: solid 1px #e4e5ed;
        background: #fafbff;
        border-radius: 4px;
        resize: vertical;
        width: 100%;
        min-height: 120px;

        &::-webkit-scrollbar {
          width: 4px;
          height: 4px;
          background: #fff;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background: #7b8195;
        }
      }

      .save-button {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 80px;
        background: #edeff7;
        border: solid 1px #e4e5ed;
        color: #6c6f84;
      }

      .block-row {
        min-height: 120px;

        .text {
          padding: 21px 10px 21px 26px;
        }

        .edit-button {
          flex-shrink: 0;
          width: 80px;
          margin-top: 10px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
