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
      決定
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
  background-color: $true-white;
  padding: 24px 0 0;
  border-top: 1px solid $ruled_line;

  .cancel-button,
  .post-button {
    width: 350px;
  }
}
</style>
