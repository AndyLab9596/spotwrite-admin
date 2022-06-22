<template>
  <div :style="{ position: 'relative' }">
    <div class="select-template-wrapper">
      <p class="select-template-title">社内連絡投稿テンプレート</p>
      <div class="select-template-button-wrapper">
        <button
          v-for="(name, key) in templates"
          :key="key"
          class="template-button"
          :class="{ 'template-button-active': key === selectTemplate }"
          @click="clickTemplate(key)"
        >
          {{ name }}
        </button>
      </div>
    </div>
    <div v-if="selectTemplate === 'interview'" class="triangle">
      <div class="triangle-below"></div>
      <div class="triangle-inner"></div>
    </div>
    <div v-if="selectTemplate === 'interview'" class="interview-select-option">
      <div class="interview-select-button">
        <button
          v-for="item in templateInterview"
          :key="item.id"
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  layout: 'admin/default',
  props: {
    templates: {
      type: Object,
      required: true,
    },
    selectTemplate: {
      type: String,
      required: true,
    },
    selectTemplateInterview: {
      type: String,
      required: true,
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
    clickTemplate(value: string) {
      this.$emit('onChangeTemplate', value);
    },
    clickTemplateInterview(value: string) {
      this.$emit('onChangeTemplateInterview', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.select-template-wrapper {
  display: flex;
  align-items: center;
  padding: 15px 30px;
  background-color: $white_1;
}

.select-template-title {
  font-size: 15px;
  font-weight: 600;
  color: $gray_blue_4;
  margin: 0 50px 0 0;
}

.select-template-button-wrapper {
  display: flex;
  align-items: center;
}

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

.interview-select-option {
  height: 74px;
  border: 1px solid #e4e5ed;
  margin-left: 40px;
  margin-right: 40px;
  border-radius: 4px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.interview-select-button {
  display: flex;
  align-items: center;
  margin-right: 50px;
}

.triangle {
  margin-left: 445px;
  margin-top: 5px;
}

.triangle-below {
  width: 0;
  height: 0;
  border-left: 7.5px solid transparent;
  border-right: 7.5px solid transparent;
  border-bottom: 11.5px solid #e4e5ed;
}

.triangle-inner {
  width: 0;
  height: 0;
  margin-top: -9.7px;
  position: absolute;
  z-index: 2;
  margin-bottom: -2px;
  border-left: 7.5px solid transparent;
  border-right: 7.5px solid transparent;
  border-bottom: 11.5px solid white;
}
</style>
