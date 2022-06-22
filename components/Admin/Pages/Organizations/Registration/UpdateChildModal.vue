<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div
        class="modal-window"
        :style="{ top: offsetTop + 75 + 'px', left: offsetLeft + 75 + 'px' }"
      >
        <div class="modal-header">
          <img src="/icon/icon-close.svg" class="icon-cross" @click="onClose" />
        </div>
        <validation-observer v-slot="{ valid, passes }">
          <div class="modal-content">
            <div class="modal-main">
              <label class="sub-title sub-title--organization"
                >組織（BOX）名</label
              >
              <validation-provider
                v-slot="{ errors }"
                rules="required"
                name="子BOX名"
              >
                <input
                  id="name"
                  ref="name"
                  v-model="input.name"
                  type="text"
                  class="input input--name"
                  :class="{ 'input-error-back': !input.name }"
                  placeholder="名前を入力"
                  @keyup.enter="passes(onEnterSubmit)"
                  @keypress="setCanSubmit"
                />
                {{ inputNameError(errors) }}
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                rules="isHiraganaAscii"
                name="ふりがな"
              >
                <input
                  id="kana"
                  ref="kana"
                  v-model="input.kana"
                  type="text"
                  class="input"
                  :class="{ 'input-error-back': Boolean(errors.length) }"
                  placeholder="ふりがなを入力"
                  @keyup.enter="passes(onEnterSubmit)"
                  @keypress="setCanSubmit"
                />
                {{ inputKanaError(errors) }}
              </validation-provider>
              <p class="kana-tips">
                ※ふりがなを入力すると並び替えに利用できます。
              </p>

              <label class="sub-title  sub-title--type">属性</label>
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
              <div class="footer">
                <button
                  type="button"
                  class="footer-buttons footer-buttons-save"
                  :disabled="!valid"
                  @click="onSubmit"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </validation-observer>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default Vue.extend({
  components: {
    ValidationObserver,
    ValidationProvider,
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
    child: {
      type: Object as PropType<Types.GroupOrganization>,
      required: true,
    },
    sameCompanyParents: {
      type: Array as PropType<Types.GroupOrganization[]>,
      required: true,
    },
    /* convertBuilder: {
      type: Object,
      required: true,
    }, */
  },
  data() {
    return {
      destinationUuid: this.child.relations.parent,
      input: { ...this.child },
      published: (this.child.status === 'public') as boolean,
      disabled: false as boolean,
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
    existDetail(): boolean {
      return !(Object.keys(this.child.detail).length === 0);
    },
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
    // this.transKana();
    // @ts-ignore
    this.$refs.name.select();
  },
  methods: {
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
      this.$emit('click', {
        organization: this.input,
        status: this.published ? 'public' : 'private',
      });
    },
    onSubmit() {
      this.$emit('click', {
        organization: this.input,
        status: this.published ? 'public' : 'private',
      });
    },
    toDetail() {
      if (this.child.type === 'department') {
        this.$router.push({
          path: `/admin/organization-management/organizations/departments/${this.child.uuid}`,
        });
      } else if (this.child.type === 'management') {
        this.$router.push({
          path: `/admin/organization-management/organizations/managements/${this.child.uuid}`,
        });
      } else {
        this.$router.push({
          path: `/admin/organization-management/organizations/shops/${this.child.uuid}`,
        });
      }
    },
    /* triggerChangeEvent(): void {
      this.transKana();
    },
    async transKana() {
      this.input.kana = await this.convertBuilder
        .convert(this.input.name, {
          to: 'hiragana',
        })
        .then((str: string) => {
          return this.kanaToHira(str);
        });
    },
    kanaToHira(str: string) {
      return str.replace(/[\u30A1-\u30F6]/g, function(match: any) {
        const chr = match.charCodeAt(0) - 0x60;
        return String.fromCharCode(chr);
      });
    }, */
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
}

.modal-window {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  background: $true_white;
  border-radius: 4px;
  padding: 10px 15px 20px;
  box-shadow: 0 0 3px #b8c7d8;
  width: 216px;
  height: 317px;
  box-sizing: border-box;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: row;
}

.modal-main {
  display: flex;
  flex-direction: column;
  width: 186px;
}

.input {
  height: 30px;
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
    top: -80px;
  }

  &-error {
    margin: 5px 10px;
  }

  &-error-back {
    border: 1px solid $valid_pink;
    background-color: $light_pink;
  }

  &--name {
    margin-bottom: 15px;
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
  appearance: none;
  background-image: url('/icon/icon_pulldown.svg');
  background-repeat: no-repeat;
  background-size: 10px 8px;
  background-position: right 8px center;

  &-error-back {
    border: 1px solid $valid_pink;
    background-color: $light_pink;
  }
}

.icon-cross {
  width: 12px;
  height: 12px;
  object-fit: cover;
  cursor: pointer;
}

@keyframes leftFadeIn {
  0% {
    transform: translateX(-10px);
  }

  100% {
    transform: translateX(0);
  }
}

.footer {
  margin-top: 20px;
  text-align: center;
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

  &:hover {
    background-color: $gray_blue_4;
  }

  &:disabled {
    color: $gray;
    background-color: $white_2;
    cursor: not-allowed;
  }
}

.sub-title {
  color: #2e303e;
  font-size: 15px;
  font-weight: bold;
  line-height: 1;

  &--organization {
    margin-top: 13px;
    margin-bottom: 12px;
  }

  &--type {
    margin-top: 25px;
    margin-bottom: 12px;
  }
}

.kana-tips {
  margin-top: 2px;
  font-size: 11px;
  line-height: 1.3em;
}
</style>
