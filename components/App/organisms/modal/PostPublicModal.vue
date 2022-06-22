<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-content">
          <div class="icon-cross-wrapper" @click="onClose">
            <img src="/app/icon/cross-white.svg" class="icon-cross" />
          </div>
          <div class="title-wrapper">
            <p class="public-setting-title">
              公開設定<span
                >社内連絡のみ、その記事を公開する対象や期間を設定することができます。</span
              >
            </p>
          </div>

          <public-range
            class="public-range"
            :selected-permission="selectedPermission"
            @select="selectPublicRange"
          />
          <public-target
            class="public-target"
            :select-public-members="publishSetting.users"
            :employees="employees"
            @select="selectPublicTarget"
          />

          <div class="border"></div>

          <public-deadline
            class="public-deadline"
            :public-title="true"
            :start-at="publishSetting.start_at"
            :end-at="publishSetting.end_at"
            :selected-settings="selectedSettings"
            @changeStartDate="changeStartDate"
            @changeEndDate="changeEndDate"
            @changeSetting="changeSetting"
          />

          <public-article-important
            :public-title="true"
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
            v-if="editPostUuid === ''"
            size="large"
            class="button"
            inverse
            :disabled="
              veeValidateInvalid || hasValidationError || hasSettingError
            "
            @click="clickPost"
          >
            投稿
          </base-button>
          <BaseButton
            v-if="editPostUuid !== ''"
            inverse
            size="large"
            class="button"
            :disabled="
              veeValidateInvalid || hasValidationError || hasSettingError
            "
            @click="clickEditPost"
          >
            更新
          </BaseButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import PublicRange from '@/components/Admin/Pages/InternalCommunications/Post/PublicRange.vue';
import PublicTarget from '@/components/Admin/Pages/InternalCommunications/Post/PublicTarget.vue';
import PublicDeadline from '@/components/Admin/Pages/InternalCommunications/Post/PublicDeadline.vue';
import PublicArticleImportant from '@/components/Admin/Pages/InternalCommunications/Post/PublicArticleImportant.vue';

export default Vue.extend({
  components: {
    BaseButton,
    PublicRange,
    PublicTarget,
    PublicDeadline,
    PublicArticleImportant,
  },
  props: {
    hasValidationError: {
      type: Boolean,
      required: true,
    },
    veeValidateInvalid: {
      type: Boolean,
      required: true,
    },
    publishSetting: {
      type: Object as PropType<AppApiRequest.PublishSetting>,
      required: true,
    },
    selectedPermission: {
      type: String as PropType<AppApiRequest.Permission>,
      required: true,
    },
    employees: {
      type: Array as PropType<AppApiResponse.Employee[]>,
      required: true,
    },
    editPostUuid: {
      type: String,
      required: false,
      default: '',
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
      return !this.publishSetting.start_at || !this.publishSetting.end_at;
    },
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    changeArticleImportant(value: boolean) {
      this.$emit('changeArticleImportant', value);
    },
    selectPublicRange(value: AppApiRequest.Permission) {
      this.$emit('selectPublicRange', value);
    },
    selectPublicTarget(uuids: string[]) {
      this.$emit('selectPublicTarget', uuids);
    },
    changeStartDate(value: string | null) {
      this.$emit('changeStartDate', value);
    },
    changeEndDate(value: string | null) {
      this.$emit('changeEndDate', value);
    },
    clickPost() {
      this.$emit('post');
    },
    clickEditPost() {
      this.$emit('editPost');
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
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 800px;
  background: $true_white;
  border-radius: 4px;
  position: relative;
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

.modal-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 30px 20px;
  padding: 24px 0 0;
  border-top: 1px solid $ruled_line;
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
  background-color: $white_1;
  padding: 18px 24px 17px;
  margin: 0 0 30px;
  width: 100%;
  border-radius: 4px 4px 0 0;

  .public-setting-title {
    display: flex;
    align-items: center;
    font-size: 15px;
    color: $gray_blue_4;

    span {
      font-size: 13px;
      margin-left: 10px;
      color: $dark_blue;
    }
  }
}

.public-range {
  margin: 0 40px 30px;
}

.public-target {
  margin: 0 40px 40px;
}

.border {
  margin: 0 0 33px;
  border-bottom: 1px solid $ruled_line;
  width: 100%;
}

.public-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;
  color: $dark_blue;
  margin: 0 0 16px;
}

.public-deadline {
  margin: 0 40px 41px;
}

.public-article-important {
  margin: 0 0 40px 0;
}
</style>
