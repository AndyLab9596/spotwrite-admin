<template>
  <div class="interview-select-option">
    <div class="interview-select-button">
      <button
        v-for="item in templateInterview"
        :key="item.id"
        :disabled="memberConfirmed || selectTemplateInterview === item.id"
        class="template-button"
        :class="{
          'template-button-active': item.id === selectTemplateInterview,
        }"
        @click="clickTemplateInterview(item.id)"
      >
        {{ item.name }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    selectTemplate: {
      type: String,
      required: true,
    },
    selectTemplateInterview: {
      type: String,
      required: true,
    },
    memberConfirmed: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabledClick: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    templateInterview: [
      {
        id: 'normal',
        name: '普通に作る',
      },
      {
        id: 'message',
        name: 'メッセージで作る',
      },
    ],
  }),
  methods: {
    clickTemplateInterview(value: string) {
      if (this.$props.disabledClick) return;
      this.$emit('onChangeTemplateInterview', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.interview-select-option {
  height: 62px;
  background-color: #f7f8fd;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 25px;

  .interview-select-button {
    display: flex;
    align-items: center;

    .template-button {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      width: 120px;
      border: 1px solid $link_color;
      border-radius: 50px;
      height: 28px;
      text-align: center;
      cursor: pointer;
      color: $link_color;
      background-color: $true_white;
      flex-shrink: 0;

      &:not(:last-child) {
        margin-right: 16px;
      }

      &-active {
        color: $true_white;
        background-color: $link_color;
      }
    }
  }
}
</style>
