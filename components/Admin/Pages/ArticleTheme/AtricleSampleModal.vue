<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <p class="title">「{{ title }}」の記事サンプル文</p>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <p v-if="editable" class="description">
          変更した内容は<span class="text-red"
            >今回使用時のみのサンプル文として反映されます</span
          >。 <br />テーマ自体のサンプル文は変更されません。
        </p>
        <textarea
          v-if="editable"
          v-model="temporarySentence"
          class="modal-content"
        ></textarea>
        <div v-else class="modal-content">
          {{ originalSentence }}
        </div>

        <div v-if="editable" class="button-box">
          <base-button size="large" @click="onSave">変更を保存する</base-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: { BaseButton },
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    sentence: {
      type: String,
      required: true,
    },
  },
  data() {
    return { temporarySentence: '' };
  },
  computed: {
    originalSentence: {
      get(): string {
        return this.sentence;
      },
      set(value: string) {
        this.temporarySentence = value;
      },
    },
  },
  mounted() {
    this.originalSentence = this.sentence;
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onSave() {
      this.$emit('save', this.temporarySentence);
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
  width: 464px;
  height: 328px;
  background: $true_white;
  border-radius: 6px;
  padding: 18px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: $dark_blue;
}

.icon-cross {
  cursor: pointer;
}

.modal-content {
  height: 250px;
  margin-top: 19px;
  margin-bottom: 10px;
  padding: 20px;
  border: solid 1px $light_gray_blue_3;
  background-color: $extra_light_gray;
  overflow-y: auto;
  font-size: 15px;
  font-weight: 300;
}

.description {
  font-size: 14px;
  margin-top: 8px;
}

.text-red {
  color: red;
}

.button-box {
  text-align: center;

  button {
    padding: 5px 16px;
  }
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
</style>
