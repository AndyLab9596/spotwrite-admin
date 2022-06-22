<template>
  <div class="container">
    <div class="header">
      <img class="logo" src="/image/logo_white@2x.png" />
    </div>
    <div class="content">
      <div class="box">
        <ul class="steps">
          <li
            v-for="(step, i) of steps"
            :key="i"
            :class="{ active: current - 1 === i }"
          >
            <span>{{ step }}</span>
          </li>
        </ul>
        <div class="content-body">
          <div class="content-body-header">
            <slot name="header"></slot>
          </div>
          <div class="content-body-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <slot name="footer"></slot>
      <div class="copyright">
        worksmedia Co.,Ltd.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

const steps = [
  'プランを選択',
  '会社情報登録の入力',
  'お支払い情報の入力',
  'ご入力内容の確認',
  '登録完了',
] as const;

export default Vue.extend({
  props: {
    current: {
      type: Number,
      default: 1,
      validator(val: number) {
        return val >= 1 && val <= steps.length;
      },
    },
  },
  data: () => ({
    steps,
  }),
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: $gradient_pink_blue;
}

.header {
  padding: 24px 0;
}

.content {
  padding: 10px 0;
}

.content-body-header > h2 {
  font-size: 18px;
}

.box {
  background-color: rgba(#fff, 0.2);
  box-shadow: 1px 0 3px #dce5ef;
  border-radius: 8px;
  padding: 20px 20px 30px 20px;
  min-width: 1000px;
}

.steps {
  display: flex;
  min-width: 990px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.3);

  li {
    position: relative;
    padding: 18px 52px 18px 52px;
  }

  li.active {
    background-color: #f09c9c;
  }

  /* 左三角（上） */
  li:not(:first-child)::before {
    content: ' ';
    position: absolute;
    top: -4px;
    left: -32px;
    width: 0;
    height: 0;
    border: none;
    border-top: 24px solid transparent;
    border-right: 24px solid transparent;
    border-left: 24px solid transparent;
    transform: rotate(-135deg);
  }

  /* 白枠 */
  li:not(:last-child) > *::after {
    content: ' ';
    position: absolute;
    top: 8px;
    width: 40px;
    height: 40px;
    border: 1px solid;
    border-color: #fff #fff transparent transparent;
    transform: rotate(45deg);
    z-index: 2;
  }

  li.active:not(:last-child) > *::after {
    right: -20px;
  }

  li.active::before {
    border-top: 24px solid #f09c9c;
  }

  /* 左三角（下） */
  li:not(:first-child) > *::before {
    content: ' ';
    position: absolute;
    bottom: -4px;
    left: -32px;
    width: 0;
    height: 0;
    border: none;
    border-top: 24px solid transparent;
    border-right: 24px solid transparent;
    border-left: 24px solid transparent;
    transform: rotate(-45deg);
  }

  li.active > *::before {
    border-top: 24px solid #f09c9c;
  }

  li.active:not(:last-child)::after {
    content: ' ';
    position: absolute;
    top: 14px;
    right: -42px;
    width: 0;
    height: 0;
    border-right: 28px solid transparent;
    border-left: 28px solid transparent;
    border-top: 28px solid #f09c9c;
    transform: rotate(-90deg);
  }
}

.content-body {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-body-header {
  min-height: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $true_white;
}

.footer {
  margin: 40px auto 70px;
}

.copyright {
  margin: 96px auto 0 auto;
  text-align: center;
  color: #fff;
  font-size: 12px;
}
</style>
