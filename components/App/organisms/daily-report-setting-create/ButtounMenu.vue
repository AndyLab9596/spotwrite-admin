<template>
  <div class="botton-wrapper">
    <BaseButton
      inverse
      size="large"
      class="cancel-button"
      @click="clickCancelButon"
    >
      キャンセル
    </BaseButton>
    <BaseButton
      inverse
      size="large"
      class="post-button"
      :disabled="postValidation"
      @click="clickPostButton"
    >
      {{ buttonText }}
    </BaseButton>
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
    isEdit: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    buttonText(): string {
      return this.isEdit ? '更新' : '作成';
    },
  },
  methods: {
    clickCancelButon(): void {
      this.$emit('cancel');
    },
    clickPostButton(): void {
      this.$emit('post');
    },
  },
});
</script>

<style lang="scss" scoped>
.botton-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 141px;
  background-color: $true-white;
  padding: 24px 40px 0;

  .cancel-button,
  .post-button {
    width: 350px;
  }
}
</style>
