<template>
  <div>
    <BaseButton inverse size="large" class="add-button" @click="clickButton">
      追加する
      <img src="/app/icon/plus_circle_accent.svg" class="add-icon" alt="" />
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
  methods: {
    clickButton(): void {
      this.$emit('click');
    },
  },
});
</script>

<style lang="scss" scoped>
.add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  border: none;
  margin: 8px 0 0;

  .add-icon {
    position: absolute;
    top: 14px;
    right: 13px;
    width: 16px;
  }

  &::before {
    content: '';
    position: absolute;
    top: -11px;
    left: 0;
    right: 0;
    border-style: solid;
    border-color: transparent transparent $button_background_color transparent;
    border-width: 0 9px 15px;
    width: 0;
    margin: 0 auto;
  }
}
</style>
