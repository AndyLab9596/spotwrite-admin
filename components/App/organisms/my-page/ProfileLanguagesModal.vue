<template>
  <transition name="modal" appear>
    <div class="modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="icon-cross-wrapper" @click="onClose">
          <img src="/app/icon/cross-white.svg" class="icon-cross" />
        </div>
        <div class="modal-contents">
          <p class="language-title">言語を選択</p>
          <div class="language-wrapper">
            <template v-for="item in languages">
              <div
                :key="item.code"
                class="language-item"
                :class="{
                  'selected-language-item': isSelectedLanguage(item.code),
                }"
                :disabled="item.disabled"
                @click="clickLanguage(item)"
              >
                <p class="language-item-text">
                  {{ item.name }}
                </p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    languages: {
      type: Array as PropType<AppApiResponse.Language[]>,
      required: true,
    },
    selectedLanguages: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  data() {
    return {
      radioButton: false as boolean,
    };
  },
  methods: {
    onClose() {
      this.$emit('onClose');
    },
    clickLanguage(item: AppApiResponse.Language) {
      if (!item.disabled) {
        this.$emit('clickLanguage', item.code);
      }
    },
    isSelectedLanguage(value: string) {
      return this.selectedLanguages.includes(value);
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
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  width: 700px;
  height: 40%;
  background: $true_white;
  border-radius: 4px;
  position: relative;
}

.modal-contents {
  height: 100%;
  overflow-y: scroll;
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

.icon-cross-wrapper {
  position: absolute;
  top: 0;
  right: calc(-25px + -25px);
}

.icon-cross {
  cursor: pointer;
  width: 25px;
}

.language-wrapper {
  border-radius: 4px;
  padding: 0 0 30px 0;
  height: calc(100% - 55px);
  overflow-y: scroll;
}

.language-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px;
  border-top: 1px solid $ruled_line;
  cursor: pointer;

  &:last-of-type {
    border-bottom: 1px solid $ruled_line;
  }
}

.selected-language-item {
  background: $gradient_3;
}

[disabled] {
  cursor: default;
  background: #f3f3f3;
  color: #bebebe;
}

.language-title {
  font-size: 15px;
  line-height: 1em;
  font-weight: 600;
  color: $main_color;
  margin: 20px 0 20px 10px;
}

.language-item-text {
  font-size: 15px;
  line-height: 1em;
  font-weight: 300;
  color: $main_color;
}
</style>
