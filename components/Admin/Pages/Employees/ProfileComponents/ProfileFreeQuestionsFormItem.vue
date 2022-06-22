<template>
  <div class="container">
    <div v-for="item in questions" :key="item.uuid" class="row">
      <div class="heading">
        <label class="label">{{ item.content }}</label>
      </div>
      <div class="content">
        <textarea
          :value="answer(item.uuid)"
          class="textarea"
          :placeholder="`${item.content}を入力してください`"
          :disabled="disabled"
          @input="changeAnswer($event, item.uuid)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'ProfileFreeQuestionsFormItem',
  props: {
    answers: {
      type: Array as PropType<{ uuid: string; answer: string }[]>,
      default: () => [],
    },
    questions: {
      type: Array as PropType<{ uuid: string; content: string }[]>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    answer(uuid: string) {
      return (
        this.answers.find((item: { uuid: string }) => item.uuid === uuid)
          ?.answer ?? ''
      );
    },
    changeAnswer(event: { target: HTMLInputElement }, uuid: string) {
      this.$emit('onChange', { uuid, answer: event.target.value });
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 4px;
  margin-right: -15px;
  margin-left: -15px;
  padding: 15px 84px 16px 15px;
  background-color: $white_1;
  width: 930px;
}

.heading {
  display: flex;
  min-width: 180px;
}

.content {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 30px;
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
}

.label {
  font-weight: bold;
}

.textarea {
  flex: 1;
  border-radius: 4px;
  width: 100%;
  height: 120px;
  border: solid 1px $light_gray_blue_3;
  padding: 13px 11px;

  &::placeholder {
    color: $placeholder_gray;
  }
}
</style>
