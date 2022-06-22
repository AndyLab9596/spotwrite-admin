<template>
  <div class="answer-rate-box" @click="onClick">
    <div class="progress-bar-box">
      <div class="progress-bar-label">
        <div class="label">{{ label }}</div>
        <div class="comment">{{ comment }}</div>
      </div>
      <div class="meter">
        <span :style="`width: ${value}%;`"></span>
      </div>
    </div>
    <div class="answer-rate">
      <div class="item" :class="{ 'high-rate': isHighRate }">
        <span class="percentage">{{ value }}</span
        ><span class="mark">%</span>
      </div>
      <div v-if="!hasTotalCount" role="button" class="item answer-link">
        <div>回答する</div>
        <div>
          <icon name="arrow_r_o" style="width: 8px; height: 12px;" />
        </div>
      </div>
      <div v-else class="answer-item">
        {{ totalCount.answerdCount }} / {{ totalCount.questionCount }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Icon from '../../atoms/images/Icon.vue';

export default Vue.extend({
  components: {
    Icon,
  },
  props: {
    value: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    totalCount: {
      type: Object as PropType<Types.TotalCount>,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      highRateBorder: 80,
      comments: ['もう少し頑張ろう！', 'あともう少し！'],
    };
  },
  computed: {
    isHighRate(): boolean {
      return this.value >= this.highRateBorder;
    },
    comment(): string {
      // TODO: 仕様が不明なため適当に実装
      return this.comments[Number(this.isHighRate)];
    },
    hasTotalCount(): boolean {
      return Object.keys(this.totalCount).length > 0;
    },
  },
  methods: {
    onClick() {
      this.$emit('onClick');
    },
  },
});
</script>

<style lang="scss" scoped>
.answer-rate-box {
  display: flex;
  padding: 16px 24px;
  width: 100%;
  background-color: #f7f8fd;
  border-radius: 4px;

  + .answer-rate-box {
    margin-top: 8px;
  }

  .answer-rate {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;

    .item {
      line-height: 12px;
      color: $main_color;
    }

    .percentage {
      margin-left: 22px;
      font-size: 28px;
      font-family: 'Lato', sans-serif;
    }

    .mark {
      margin-left: 7px;
      font-size: 15px;
    }

    .high-rate {
      .percentage,
      .mark {
        color: $link_color;
      }
    }

    .answer-link {
      display: flex;
      flex-grow: 1;
      justify-content: space-between;
      margin-left: 28px;
      color: $gentle_bluish_purple;
      font-size: 13px;
      font-weight: 600;
    }

    .answer-item {
      font-family: 'Lato', sans-serif;
      color: $gentle_bluish_purple;
      font-size: 13px;
      font-weight: 400;
      white-space: nowrap;
      margin: 0 0 0 55px;
    }
  }

  .progress-bar-box {
    display: flex;
    flex-direction: column;
    width: 500px;
  }

  .progress-bar-label {
    display: flex;
    justify-content: space-between;

    .label,
    .comment {
      font-size: 13px;
      font-weight: 600;
    }

    .label {
      color: $gentle_bluish_purple;
    }

    .comment {
      color: $link_color;
    }
  }

  .meter {
    box-sizing: content-box;
    height: 8px;
    position: relative;
    background: $true_white;
    border-radius: 25px;
    padding: 4px;
    box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);
  }

  .meter > span {
    display: block;
    height: 100%;
    border-radius: 20px;
    background-color: rgb(43, 194, 83);
    position: relative;
    overflow: hidden;
    background-image: $gradient_5;
  }
}
</style>
