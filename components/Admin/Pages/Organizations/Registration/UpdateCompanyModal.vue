<template>
  <transition name="modal" appear>
    <div
      v-scroll-lock="false"
      class="modal modal-overlay"
      @click.self="onClose"
    >
      <div
        class="modal-window"
        :style="{ top: offsetTop + 54 + 'px', left: offsetLeft + 400 + 'px' }"
      >
        <div class="modal-main">
          <img src="/icon/icon_cross.png" class="close-icon" @click="onClose" />
          <validation-observer v-slot="{ valid, passes }">
            <validation-provider
              v-slot="{ errors }"
              rules="required"
              name="会社名"
            >
              <input
                id="name"
                ref="name"
                v-model="input.name"
                type="text"
                class="input"
                :class="{ 'input-error-back': !input.name }"
                placeholder="社名を入力してください"
                @keyup.enter="passes(onEnterSubmit)"
                @keypress="setCanSubmit"
              />
              <div>
                {{ inputNameError(errors) }}
              </div>
            </validation-provider>
            <div class="footer">
              <button
                type="button"
                class="footer-buttons footer-buttons-save"
                :class="'button-active-' + valid"
                :disabled="!valid"
                @click="onSubmit"
              >
                保存
              </button>
            </div>
          </validation-observer>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default Vue.extend({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    offsetTop: {
      type: Number,
      required: true,
      default: 0,
    },
    offsetLeft: {
      type: Number,
      required: true,
      default: 0,
    },
    company: {
      type: Object as PropType<Types.GroupOrganization>,
      required: true,
    },
  },
  data() {
    return {
      input: { ...this.company },
      canSubmit: false as boolean,
      nameError: false as boolean,
    };
  },
  computed: {
    inputNameError() {
      return (errors: []) => {
        this.nameError = Boolean(errors.length);
      };
    },
  },
  mounted() {
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
    onDelete() {
      this.$emit('delete', this.company);
    },
    onEnterSubmit() {
      if (!this.canSubmit) {
        return;
      }
      this.$emit('click', this.input);
    },
    onSubmit() {
      this.$emit('click', this.input);
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: scroll;
}

.modal-window {
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

.modal-main {
  box-sizing: border-box;
  padding: 32px 30px 20px;
  position: relative;
  background: $true_white;
  border: none;
  box-shadow: 0 0 3px 0 $light_gray;
  border-radius: 4px;
}

.input {
  width: 400px;
  height: 40px;
  padding: 0 10px 0;
  margin-bottom: 20px;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  color: $gray_blue_4;
  background-color: $extra_light_gray;

  &-errors {
    margin-top: 5px;
    position: absolute;
    margin-left: 110px;
    font-size: 12px;
    color: $red;
    font-weight: bold;
  }

  &-error-back {
    border: 1px solid $valid_pink;
    background-color: $light_pink;
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
  text-align: center;
  margin-right: auto;

  &-buttons {
    width: 80px;
    height: 30px;
    font-size: 13px;
    border: none;
    background-color: $gray_blue_3;
    border-radius: 4px;
    font-weight: bold;
    color: $true_white;

    &:disabled {
      color: $gray;
      background-color: $white_2;
      cursor: not-allowed;
    }
  }
}

.close-icon {
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  width: 12px;
}
</style>
