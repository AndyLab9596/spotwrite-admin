<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="コミュニティ登録">
        <template #tutorial>
          <TutorialButtonIcon
            :url="`/admin/tutorial/community-registration.html`"
          />
        </template>
        <template #description>
          <div class="header">
            <span>
              誰でもコミュニティを登録することができます。
            </span>
            <contained-button-with-icon
              src="/icon/icon-arrow_right_white.svg"
              :icon-width="8"
              :icon-margin-right="11"
              class="button"
              @click="goToCommunityManagementPage"
            >
              コミュニティ一覧を見る
            </contained-button-with-icon>
          </div>
        </template>
      </page-header>
      <div class="l-contents">
        <div class="flex item-row">
          <div class="label">
            公式ラベル
          </div>
          <div class="official-checkbox-wrapper">
            <base-checkbox
              label="公式"
              value="true"
              class="official-checkbox"
              @change="onChangeOfficialLabel"
            />
            <p class="warning">
              会社公認のコミュニティのみに付与できるフラグです
            </p>
          </div>
        </div>
        <validation-observer v-slot="{ invalid, passes }">
          <validation-provider
            v-slot="type"
            rules="required"
            name="コミュニティタイプ"
          >
            <div class="flex item-row">
              <div class="label">
                コミュニティタイプ
                <span class="require">※必須</span>
              </div>
              <div>
                <base-select
                  v-model="newCommunity.type"
                  :items="communityTypes"
                  class="type-select-box"
                  :class="{
                    'input-error': type.errors[0] || !newCommunity.type,
                  }"
                />
              </div>
            </div>
          </validation-provider>
          <validation-provider
            v-slot="name"
            rules="required|max:100"
            name="コミュニティ名"
          >
            <div class="flex item-row">
              <div class="label">
                コミュニティ名
                <span class="require">※必須</span>
              </div>
              <input
                id="name"
                v-model="newCommunity.name"
                :class="{ 'input-error': name.errors[0] || !newCommunity.name }"
                type="text"
                placeholder="例）○○プロジェクト、バスケットボールクラブなど"
                @input="onNameInput"
              />
            </div>
          </validation-provider>
          <validation-provider
            v-slot="kana"
            rules="required|isHiragana|max:100"
            name="かな"
          >
            <div class="flex item-row--last">
              <div class="label">
                ふりがな
                <span class="require">※必須</span>
              </div>
              <input
                id="kana"
                v-model="newCommunity.kana"
                :class="{ 'input-error': kana.errors[0] || !newCommunity.kana }"
                type="text"
                placeholder="例）○○ぷろじぇくと，ばすけっとぼーるくらぶなど"
              />
            </div>
          </validation-provider>
          <div>
            <p class="description">
              登録ボタンをクリックするとコミュニティ一覧に作成したコミュニティが表示されますが未公開です。<br />
              代表者など必須項目の入力とメンバー登録を行い、公開スイッチをONにすることで公開されます。<br />
              コミュニティ作成者は仮登録の時点でメンバーとして登録されます。<br />
              作成者がコミュニティに参加しない場合、他のメンバーを登録後に削除をしてください。
            </p>
            <div class="add">
              <base-button
                class="add-button"
                size="large"
                :disabled="invalid || createLoading"
                @click="passes(createCommunity)"
              >
                コミュニティを登録する
              </base-button>
            </div>
          </div>
        </validation-observer>
      </div>
    </div>
    <created-alert
      v-if="createdAlertModal"
      @yes="openAddUserModal = true"
      @no="$router.push(`/admin/community-management`)"
      @close="createdAlertModal = false"
    />
    <CommunityAddMemberModal
      v-if="openAddUserModal"
      community-id="dummy"
      @close="openAddUserModal = false"
      @submit="submitFromAddMemberModal"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import { ContainedButtonWithIcon } from '@/components/Admin/Modules/Button';
import * as AutoKana from 'vanilla-autokana';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import { addCommunityUser, createCommunity } from '@/libs/api';
import CreatedAlert from '@/components/Admin/Pages/Community/CreatedAlert.vue';
import { CommunityAddMemberModal } from '@/components/Admin/Pages';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';

export type NewCommunity = {
  name: string;
  kana: string;
  type: string;
  is_official: boolean;
};

export default Vue.extend({
  layout: 'admin/default',
  components: {
    PageHeader,
    ContainedButtonWithIcon,
    ValidationObserver,
    ValidationProvider,
    BaseButton,
    BaseCheckbox,
    CreatedAlert,
    CommunityAddMemberModal,
    BaseSelect,
    TutorialButtonIcon,
  },
  data() {
    return {
      autokana: undefined as AutoKana.AutoKana | undefined,
      newCommunity: {
        type: '',
        name: '',
        kana: '',
        is_official: false,
      } as ApiRequest.NewCommunity,
      createLoading: false as boolean,
      openAddUserModal: false,
      createdAlertModal: false,
      createdCommunity: null as Object | null,
    };
  },
  computed: {
    communityTypes() {
      return [
        { name: '一般コミュニティ', value: 'general' },
        { name: 'ビジネスコミュニティ', value: 'business' },
      ];
    },
  },
  mounted() {
    this.autokana = AutoKana.bind('#name', '#kana');
  },
  methods: {
    goToCommunityManagementPage() {
      this.$router.push({
        path: '/admin/community-management',
      });
    },
    onChangeOfficialLabel(value: string) {
      const [bool] = value;
      this.newCommunity.is_official = Boolean(bool);
    },
    onNameInput(): void {
      if (this.autokana === undefined) {
        return;
      }
      this.newCommunity.kana = this.autokana.getFurigana();
    },
    async createCommunity() {
      try {
        this.createLoading = true;
        const { data } = await createCommunity(this.newCommunity);
        this.createdCommunity = data;
        this.createLoading = false;
        this.createdAlertModal = true;
      } catch (e) {
        console.error(e);
      }
    },
    async submitFromAddMemberModal(userUuidList: string[]) {
      try {
        await addCommunityUser(this.createdCommunity.uuid, {
          users: userUuidList,
        });
      } catch (error) {
        console.error(error);
      }
      window.location.href = '/admin/community-management';
    },
  },
});
</script>

<style lang="scss" scoped>
.button {
  padding-left: 11px;
  padding-right: 13px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex {
  display: flex;
}

.item-row {
  margin-bottom: 30px;

  &--last {
    margin-bottom: 40px;
  }
}

.label {
  font-size: 15px;
  font-weight: 600;
  width: 230px;
  color: $dark_blue;
  flex-shrink: 0;
}

.require {
  font-size: 13px;
  font-weight: 300;
  color: $gray_blue_1;
}

.input-error {
  background-color: $light_pink;
  border: solid 1px $valid_pink;
}

.warning {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  color: $true_white;
  background-color: #797fa8;
  padding: 0 10px;
  height: 26px;
  border-radius: 4px;
  position: relative;
  margin-left: 9px;

  &::before {
    content: '';
    position: absolute;
    left: -9px;
    top: 6px;
    display: block;
    width: 0;
    height: 0;
    border-top: 7px solid transparent;
    border-right: 9px solid #797fa8;
    border-bottom: 7px solid transparent;
  }
}

.description {
  font-size: 15px;
  color: $gray_blue_4;
  background-color: $white_1;
  border: none;
  margin-top: 20px;
  padding: 16px;
}

.add {
  display: flex;
  justify-content: center;
  margin-top: 50px;

  .add-button {
    width: 200px;
  }
}

select,
input {
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  color: $gray_blue_4;
  background-color: $true_white;
  height: 40px;
  padding: 0 4px;
}

select {
  width: 230px;
}

input {
  width: 100%;
}

.l-contents {
  margin-top: 30px;
  padding: 25px 50px 30px 30px;
}

.type-select-box {
  width: 230px;
}

.official-checkbox-wrapper {
  display: flex;
  align-items: center;

  .official-checkbox {
    margin-right: 20px;
  }
}
</style>
