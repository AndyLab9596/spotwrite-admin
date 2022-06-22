<template>
  <transition name="modal" appear>
    <div v-scroll-lock="true" class="modal modal-overlay" @click.self="onClose">
      <div
        class="modal-window"
        :style="{ top: offsetTop + 'px', left: offsetLeft + 'px' }"
      >
        <validation-observer v-slot="{ valid, passes }">
          <div class="modal-content">
            <div class="modal-main">
              <toggle-button
                v-model="published"
                class="switch-button"
                name="switch-button"
                :contents="[
                  { label: '公開', value: 'public' },
                  { label: '非公開', value: 'private' },
                ]"
              />
              <validation-provider
                v-slot="{ errors }"
                rules="required"
                name="親BOX名"
              >
                <input
                  id="name"
                  ref="name"
                  v-model="input.name"
                  type="text"
                  class="input"
                  :class="{ 'input-error-back': !input.name }"
                  placeholder="名前を入力"
                  @input="onNameInput"
                  @keyup.enter="passes(onEnterSubmit)"
                  @keypress="setCanSubmit"
                />
                {{ inputNameError(errors) }}
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                rules="required|isHiragana"
                name="ふりがな"
              >
                <input
                  id="kana"
                  ref="kana"
                  v-model="input.kana"
                  type="text"
                  class="input"
                  :class="{ 'input-error-back': !input.kana }"
                  placeholder="ふりがなを入力"
                  @keyup.enter="passes(onEnterSubmit)"
                  @keypress="setCanSubmit"
                />
                {{ inputKanaError(errors) }}
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                rules="required"
                name="属性"
              >
                <select
                  v-model="input.type"
                  name="type"
                  class="select"
                  :class="{ 'select-error-back': !input.type }"
                  @keyup.enter="passes(onEnterSubmit)"
                  @keypress="setCanSubmit"
                >
                  <option disabled value="">属性を選択</option>
                  <option
                    v-for="organizationType in organizationTypes"
                    :key="organizationType.type"
                    :value="organizationType.type"
                  >
                    {{ organizationType.name }}
                  </option>
                </select>
                {{ selectTypeError(errors) }}
              </validation-provider>
              <div class="main-bottom">
                <span class="detail-unregistered">詳細未登録</span>
                <div class="footer">
                  <button
                    type="button"
                    class="footer-buttons footer-buttons-save"
                    :disabled="!valid"
                    @click="onSubmit"
                  >
                    保存
                  </button>
                  <button type="button" class="footer-buttons">削除</button>
                </div>
              </div>
            </div>
            <div class="modal-side">
              <button class="side-button" :disabled="true">
                詳細情報を登録
                <img
                  src="/icon/icon_external-link.png"
                  class="icon-external-link"
                />
              </button>
              <button class="side-button" :disabled="true">
                子BOXを追加
              </button>
              <div class="side-error">
                <div class="side-error-body">
                  ※左記のボタンはBOX登録後、メンバーを登録して頂くとクリック可能になります。
                </div>
              </div>
            </div>
          </div>
        </validation-observer>
        <div
          v-show="nameError || kanaError || selectError"
          class="input-errors"
        >
          <p v-show="nameError" class="input-error">
            ※BOX名が未入力です。入力後保存ボタンをクリックしてください。
          </p>
          <p v-show="kanaError" class="input-error">
            ※ふりがなの入力内容に誤りがあります。入力後保存ボタンをクリックしてください。
          </p>
          <p v-show="selectError" class="input-error">
            ※属性が未選択です。選択後保存ボタンをクリックしてください。
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import * as AutoKana from 'vanilla-autokana';
import { ToggleButton } from '@/components/Admin/Modules/Button';

export default Vue.extend({
  components: {
    ValidationProvider,
    ValidationObserver,
    ToggleButton,
  },
  props: {
    offsetTop: {
      type: Number,
      required: false,
      default: 0,
    },
    offsetLeft: {
      type: Number,
      required: false,
      default: 0,
    },
    company: {
      type: Object as PropType<Types.GroupOrganization>,
      required: true,
    },
  },
  data() {
    return {
      autokana: undefined as AutoKana.AutoKana | undefined,
      input: {
        name: '' as string,
        kana: '' as string,
        type: '' as string,
      },
      published: 'private' as string,
      nameError: false as boolean,
      kanaError: false as boolean,
      selectError: false as boolean,
      canSubmit: false as boolean,
      organizationTypes: [
        { type: 'department', name: '部署' },
        { type: 'shop', name: '店舗' },
        { type: 'branch', name: '支店' },
        { type: 'management', name: '経営陣' },
        { type: 'other', name: 'その他' },
      ],
    };
  },
  computed: {
    inputNameError() {
      return (errors: []) => {
        this.nameError = Boolean(errors.length);
      };
    },
    inputKanaError() {
      return (errors: []) => {
        this.kanaError = Boolean(errors.length);
      };
    },
    selectTypeError() {
      return (errors: []) => {
        this.selectError = Boolean(errors.length);
      };
    },
  },
  mounted() {
    this.autokana = AutoKana.bind('#name', '#kana');
    // @ts-ignore
    this.$refs.name.select();
  },
  methods: {
    onNameInput(): void {
      if (this.autokana === undefined) {
        return;
      }
      this.input.kana = this.autokana.getFurigana();
    },
    setCanSubmit() {
      this.canSubmit = true;
    },
    onClose() {
      this.$emit('close');
    },
    onEnterSubmit() {
      if (!this.canSubmit) {
        return;
      }
      const value = {
        name: this.input.name,
        kana: this.input.kana,
        type: this.input.type,
        parent_uuid: this.company.uuid,
      };
      this.$emit('click', value);
    },
    onSubmit() {
      const value = {
        name: this.input.name,
        kana: this.input.kana,
        type: this.input.type,
        parent_uuid: this.company.uuid,
      };
      this.$emit('click', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  display: flex;
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
  justify-content: space-between;
  position: absolute;
  border-radius: 6px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.icon-cross {
  cursor: pointer;
}

.modal-content {
  position: relative;
}

.modal-main {
  display: flex;
  flex-direction: column;
  width: 200px;
  background: $true_white;
  border: solid 2px $true_white;
  border-radius: 6px;
  padding: 20px 15px;
}

.input {
  height: 30px;
  margin: 2px 0 8px;
  width: 100%;
  padding: 0 10px;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  color: $gray_blue_4;
  background-color: $extra_light_gray;

  &-errors {
    background-color: $true_white;
    position: absolute;
    font-size: 12px;
    font-weight: bold;
    color: $red;
    top: -48px;
    width: 424px;
    padding: 13px 10px;
  }

  &-error-back {
    border: 1px solid $valid_pink;
    background-color: $light_pink;
  }
}

.select {
  height: 28px;
  width: 100%;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  color: $gray_blue_4;
  padding: 0 6px;
  background-color: $extra_light_gray;

  &-error-back {
    border: 1px solid $valid_pink;
    background-color: $light_pink;
  }
}

.main-bottom {
  margin-top: 2px;
}

.detail-unregistered {
  font-size: 12px;
  color: #666;
  padding-left: 2px;
}

.modal-side {
  position: absolute;
  top: 0;
  left: 210px;
  width: 150px;
  height: inherit;
}

.side-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #000;
  color: $true_white;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  padding: 0 14px;
  margin-bottom: 10px;
  animation: leftFadeIn 0.1s;
  height: 30px;

  &:disabled {
    color: rgba(204, 204, 204, 0.5);
    background-color: rgba(0, 0, 0, 0.5);
    cursor: auto;
  }
}

.side-error {
  position: absolute;
  top: 0;
  left: 160px;

  &-body {
    position: relative;
    display: inline-block;
    background-color: $true_white;
    font-size: 10px;
    color: $dark_blue;
    border: 1px solid #707070;
    border-radius: 4px;
    padding: 10px;
    width: 150px;
  }

  &-body::before {
    content: '';
    position: absolute;
    top: 60%;
    left: -15px;
    margin-top: -10px;
    border: 5px solid transparent;
    border-right: 15px solid $true_white;
  }
}

@keyframes leftFadeIn {
  0% {
    transform: translateX(-10px);
  }

  100% {
    transform: translateX(0);
  }
}

.icon-external-link {
  width: 14px;
  height: 14px;
  object-fit: cover;
  margin-left: 4px;
}

.footer {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.footer-buttons {
  width: 80px;
  height: 30px;
  font-size: 13px;
  border: none;
  background-color: $gray_blue_3;
  border-radius: 4px;
  font-weight: bold;
  color: $true_white;
}

.switch-button {
  margin-bottom: 20px;

  & /deep/ div {
    width: 80px;

    & > label {
      text-align: center;
    }
  }
}
</style>
