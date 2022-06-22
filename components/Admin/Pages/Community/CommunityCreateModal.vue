<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <p class="title">新規コミュニティ登録</p>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div class="modal-container">
          <div class="flex mb-4">
            <div class="label">
              公式ラベル
            </div>
            <div>
              <base-checkbox
                label="公式"
                value="true"
                @change="onChangeOfficialLabel"
              />
              <p class="warning">
                ！会社公式のコミュニティは管理者のみ作成できます。
              </p>
            </div>
          </div>
          <validation-observer v-slot="{ invalid, passes }">
            <validation-provider
              v-slot="type"
              rules="required"
              name="コミュニティタイプ"
            >
              <div class="flex mb-4">
                <div class="label">
                  コミュニティタイプ
                  <span class="require">※必須</span>
                </div>
                <div>
                  <select
                    v-model="newCommunity.type"
                    :class="{
                      'input-error-back': type.errors[0] || !newCommunity.type,
                    }"
                  >
                    <option value="">選択してください</option>
                    <option value="general">一般コミュニティ</option>
                    <option value="business">ビジネスコミュニティ</option>
                  </select>
                  <p class="warning">
                    目的を問わない一般コミュニティとプロジェクトなど仕事で<br />
                    利用するビジネスコミュニティから選択できます。
                  </p>
                  <span class="error">{{ type.errors[0] }}</span>
                </div>
              </div>
            </validation-provider>
            <validation-provider
              v-slot="name"
              rules="required|max:100"
              name="コミュニティ名"
            >
              <div class="flex mb-4">
                <div class="label">
                  コミュニティ名
                  <span class="require">※必須</span>
                </div>
                <div>
                  <input
                    id="name"
                    v-model="newCommunity.name"
                    :class="{
                      'input-error-back': name.errors[0] || !newCommunity.name,
                    }"
                    type="text"
                    placeholder="例）○○プロジェクト、バスケットボールクラブなど"
                    @input="onNameInput"
                  />
                  <div class="error">{{ name.errors[0] }}</div>
                </div>
              </div>
            </validation-provider>
            <validation-provider
              v-slot="kana"
              rules="required|isHiragana|max:100"
              name="かな"
            >
              <div class="flex mb-4">
                <div class="label">
                  ふりがな
                  <span class="require">※必須</span>
                </div>
                <div>
                  <input
                    id="kana"
                    v-model="newCommunity.kana"
                    :class="{
                      'input-error-back': kana.errors[0] || !newCommunity.kana,
                    }"
                    type="text"
                    placeholder="例）○○ぷろじぇくと，ばすけっとぼーるくらぶなど"
                  />
                  <div class="error">{{ kana.errors[0] }}</div>
                </div>
              </div>
            </validation-provider>
            <div>
              <p class="description">
                登録ボタンをクリック後、作成したコミュニティがコミュニティ一覧に表示されますがまだ公開されていない状態です。<br />
                代表者など必須項目やメンバー登録を行い、公開スイッチをONにすることで公開となります。<br />
                コミュニティ作成者は仮登録時点でメンバーとして登録されます。<br />
                作成者がコミュニティに参加しない場合、他のメンバーを登録後に削除してください。
              </p>
              <div class="add">
                <base-button
                  class="add-button"
                  :disabled="invalid || loading"
                  @click="passes(onSubmit)"
                >
                  コミュニティを仮登録する
                </base-button>
              </div>
            </div>
          </validation-observer>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import * as AutoKana from 'vanilla-autokana';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import dayjs from '@/libs/dayjs';

export default Vue.extend({
  components: {
    ValidationObserver,
    ValidationProvider,
    BaseButton,
    BaseCheckbox,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      autokana: undefined as AutoKana.AutoKana | undefined,
      newCommunity: {
        name: '',
        kana: '',
        type: '',
        is_official: false,
        establish_date: dayjs().unix(),
        start_date: dayjs().unix(),
      } as ApiRequest.NewCommunity,
    };
  },
  mounted() {
    this.autokana = AutoKana.bind('#name', '#kana');
  },
  methods: {
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
    onClose() {
      this.$emit('close');
    },
    onSubmit() {
      this.$emit('submit', this.newCommunity);
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
  background: rgba(126, 129, 149, 0.8);
}

.modal-window {
  display: flex;
  flex-direction: column;
  width: 700px;
  background: $true_white;
  border-radius: 6px;
  padding: 18px 30px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.icon-cross {
  cursor: pointer;
}

.flex {
  display: flex;
}

.mb-4 {
  margin-bottom: 32px;
}

.label {
  font-size: 15px;
  font-weight: 600;
  width: 230px;
  color: $dark_blue;
}

.require {
  font-size: 13px;
  font-weight: 300;
  color: $gray_blue_1;
}

.error {
  font-size: 0.8em;
  font-weight: bold;
  color: red;
}

.input-error-back {
  background-color: $light_pink;
  border: solid 1px $valid_pink;
}

.warning {
  font-size: 14px;
  color: red;
}

.modal-container {
  margin-top: 18px;
}

.modal-contents {
  display: flex;
  flex-direction: column;
  padding-top: 18px;
}

.description {
  font-size: 13px;
  color: $gray_blue_4;
  background-color: $white_1;
  border: none;
  margin-top: 20px;
  padding: 16px;
}

.add {
  display: flex;
  justify-content: center;
  margin-top: 20px;
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

select,
input {
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  color: $gray_blue_4;
  background-color: $true_white;
  height: 40px;
  width: 254px;
  padding: 0 4px;
}

input {
  width: 410px;
}
</style>
