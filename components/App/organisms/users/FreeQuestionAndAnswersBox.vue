<template>
  <div class="free-question-answer-container">
    <div
      v-for="(qa, index) in freeQuestionAndAnswers"
      :key="index"
      class="free-question-answer-row"
    >
      <div class="header">
        <img src="@/assets/image/question.png" alt="question" />
      </div>
      <div class="question">
        {{ (index + 1) | zeropadding }}. {{ qa.content }}
      </div>
      <div class="answer">
        <span>A.</span>
        <span class="content">{{ getAnswer(qa) }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  filters: {
    zeropadding(value: number) {
      if (!value) return 0;
      const no = `00${value}`.slice(-2);
      return no;
    },
  },
  model: {
    prop: 'selectedTab',
    event: 'clicked',
  },
  props: {
    freeQuestionAndAnswers: {
      type: Array as PropType<AppApiResponse.ProfileQuestionnaireItem[]>,
      required: true,
    },
  },
  methods: {
    onTabClicked(clickedTab: string) {
      this.$emit('clicked', clickedTab);
    },
    getAnswer(qa: AppApiResponse.ProfileQuestionnaireItem): string {
      return qa.answer != null && qa.answer.content
        ? (qa.answer.content as string)
        : '未回答';
    },
  },
});
</script>

<style lang="scss" scoped>
.free-question-answer-row {
  &:first-child {
    margin-top: 29px;
  }

  .header {
    position: relative;
    top: 10px;
  }
}

.free-question-answer-container {
  display: flex;
  flex-direction: column;
  min-width: 600px;
  width: 100%;
  padding: 5px 20px;
  background-color: #fff;
  border-top: solid 1px #dce5ef;
  border-bottom: solid 1px #dce5ef;
}

.question {
  color: #725661;
  background: linear-gradient(267deg, #fae6eb, #ebecf5);
  border-radius: 4px;
  font-weight: bold;
  padding: 12px;
}

.answer {
  padding: 12px;
  position: relative;

  span {
    color: #f09c9c;
    font-weight: bold;
  }

  .content {
    color: black;
    font-weight: normal;
  }

  &::before {
    content: '\00a0 ';
    background: url('~assets/image/brackets-left.png') no-repeat;
    height: 31px;
    background-size: contain;
    position: absolute;
    left: 1px;
  }

  &::after {
    content: '\00a0 ';
    background: url('~assets/image/brackets-right.png') no-repeat;
    height: 31px;
    background-size: contain;
    position: absolute;
    right: 1px;
  }
}

.company-question-answer-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: dotted 2px #ccc;
}

.company-question-answer-item {
  flex-grow: 1;
  margin: 16px 0;
}

.free-input-first-content {
  display: flex;
  flex-direction: row;
}

.free-input-first-heading {
  font-size: 13px;
  font-weight: 700;
  text-align: center;
}

.baloon-wrapper {
  width: 100%;
  margin-left: 20px;
}

.balloon {
  position: relative;
  padding: 7px 10px;
  width: 100%;
  color: #973;
  font-size: 13px;
  background: #fce9bf;
  border-radius: 10px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -20px;
    border-style: solid;
    border-color: #efeebb transparent transparent;
    border-width: 20px;
  }
}
</style>
