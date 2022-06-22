<template>
  <div class="botton-wrapper">
    <div class="inner-wrapper">
      <BaseButton
        inverse
        size="large"
        class="draft-all-button"
        @click="clickDraftAllButon"
      >
        下書き一覧
      </BaseButton>
      <BaseButton
        v-if="!isDraft"
        inverse
        size="large"
        :disabled="saveValidation"
        class="draft-save-button"
        @click="clickDraftSaveButton"
      >
        下書き保存
      </BaseButton>
      <BaseButton
        v-if="isDraft"
        inverse
        size="large"
        class="draft-save-button"
        @click="clickDraftUpdateButton"
      >
        下書き更新
      </BaseButton>
      <BaseButton
        inverse
        size="large"
        class="preview-button"
        @click="clickPreviewButton"
      >
        確認
      </BaseButton>
      <BaseButton
        inverse
        size="large"
        :disabled="postValidation"
        class="post-button"
        @click="clickPostButton"
      >
        提出
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';

export default Vue.extend({
  components: {
    BaseButton,
  },
  props: {
    postValidation: {
      type: Boolean,
      required: true,
    },
    saveValidation: {
      type: Boolean,
      required: true,
    },
    isDraft: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    clickDraftAllButon(): void {
      this.$emit('draftAll');
    },
    clickDraftSaveButton(): void {
      this.$emit('draftSave');
    },
    clickDraftUpdateButton() {
      this.$emit('draftUpdate');
    },
    clickPreviewButton(): void {
      this.$emit('preview');
    },
    clickPostButton(): void {
      this.$emit('post');
    },
  },
});
</script>

<style lang="scss" scoped>
.botton-wrapper {
  bottom: 0;
  width: 100%;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 1px 0 2px $box-shadow;
  position: fixed;
  z-index: 999;
  display: flex;
  justify-content: center;

  .inner-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 800px; // モーダルの幅に合わせている
    height: 80px;
  }

  .draft-all-button {
    width: 128px;
  }

  .draft-save-button {
    width: 120px;
  }

  .preview-button,
  .post-button {
    width: 252px;
  }
}
</style>
