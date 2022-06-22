<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-content">
          <div class="title-wrapper">
            <p class="public-setting-title">期限</p>
            <img
              src="/icon/icon-close.svg"
              class="icon-cross"
              @click="onClose"
            />
          </div>
          <public-deadline
            class="public-deadline"
            :start-at="publishSetting.start_at"
            :end-at="publishSetting.end_at"
            :selected-settings="selectedSettings"
            @changeStartDate="changeStartDate"
            @changeEndDate="changeEndDate"
            @changeSetting="changeSetting"
          />

          <div class="title-wrapper">
            <p class="public-setting-title">記事設定</p>
          </div>

          <public-article-important
            :is-important="publishSetting.is_important"
            class="public-article-important"
            @changeArticleImportant="changeArticleImportant"
          />
        </div>
        <div class="modal-footer">
          <base-button size="large" class="button" inverse @click="onClose">
            キャンセル
          </base-button>
          <base-button
            size="large"
            class="button"
            inverse
            :disabled="hasValidationError || hasSettingError"
            @click="clickPost"
          >
            投稿
          </base-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import PublicDeadline from '@/components/Admin/Pages/InternalCommunications/Post/PublicDeadline.vue';
import PublicArticleImportant from '@/components/Admin/Pages/InternalCommunications/Post/PublicArticleImportant.vue';
import dayjs from 'dayjs';

export default Vue.extend({
  components: {
    BaseButton,
    PublicDeadline,
    PublicArticleImportant,
  },
  props: {
    hasValidationError: {
      type: Boolean,
      required: true,
    },
    publishSetting: {
      type: Object as PropType<AppApiRequest.PublishSetting>,
      required: true,
    },
  },
  data() {
    return {
      selectedSettings: 'off',
    };
  },
  computed: {
    hasSettingError(): boolean {
      if (this.selectedSettings === 'off') {
        return false;
      }
      return (
        !this.publishSetting.start_at ||
        !this.publishSetting.end_at ||
        Number(this.publishSetting.start_at) > dayjs(new Date()).unix() ||
        Number(this.publishSetting.end_at) < dayjs(new Date()).unix()
      );
    },
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    clickPost() {
      this.$emit('post');
    },
    changeArticleImportant(value: boolean) {
      this.$emit('changeArticleImportant', value);
    },
    changeStartDate(value: string | null) {
      this.$emit('changeStartDate', value);
    },
    changeEndDate(value: string | null) {
      this.$emit('changeEndDate', value);
    },
    changeSetting(value: string) {
      this.selectedSettings = value;
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
  justify-content: space-between;
  width: 800px;
  background: $true_white;
  border-radius: 4px;
}

.icon-cross {
  cursor: pointer;
}

.modal-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 30px 20px;
}

.button {
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  background-color: $light_gray_blue_7;
  font-weight: bold;
  color: $gray_blue_4;
  width: 100%;
  height: 40px;

  &:first-of-type {
    margin: 0 10px 0 0;
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

.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $white_1;
  padding: 18px 24px 17px;
  margin: 0 0 30px;
  width: 100%;
  border-radius: 4px 4px 0 0;
}

.public-setting-title {
  font-size: 15px;
  font-weight: 600;
  color: $gray_blue_4;
}

.public-deadline {
  margin: 0 40px 41px;
}

.public-article-important {
  margin: 0 0 40px 0;
}
</style>
