<template>
  <div>
    <div :class="selected ? 'name-active' : 'name'">
      <span>{{ name }}</span>
    </div>
    <div class="description">
      <!-- Type group -->
      <div v-if="type === 'group'" class="heading">
        <div class="heading-icon" :style="[{ height: '0px' }]">
          <img src="/app/image/contract-plan/icon_recommended.svg" />
        </div>
        <div class="heading-text">
          <span v-html="heading">/</span>
        </div>
      </div>
      <!-- *** Type free, single, special *** -->
      <div v-else class="heading">
        <span v-html="heading">/</span>
      </div>
      <div class="title">
        <div class="plan-title" v-html="title"></div>
      </div>
      <div class="body" v-html="body"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.name {
  width: 300px;
  height: 40px;
  margin-left: 40px;
  background-color: #ffeae0;
  border: 1px solid #face96;
  border-radius: 12px;
  margin-top: -20px;
  color: #ad6e53;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  padding-top: 7px;
  position: relative;
}

.name-active {
  width: 300px;
  height: 40px;
  margin-left: 40px;
  background-color: #ffeae0;
  border: 1px solid #face96;
  border-radius: 12px;
  margin-top: -20px;
  color: #ad6e53;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  padding-top: 7px;
  position: relative;
}

.name-active::before {
  content: '';
  position: absolute;
  left: -2px;
  top: -1px;
  height: 60%;
  width: 100%;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-top: 4px solid $pink;
  border-left: 4px solid $pink;
  border-right: 4px solid $pink;
}

.description {
  height: 175px;
  margin-left: 30px;

  .heading {
    font-size: 18px;
    font-weight: 600;
    padding-top: 10px;
  }

  .heading-icon {
    margin-left: -38px;

    img {
      margin-top: 6px;
    }
  }

  .heading-text {
    margin-left: 40px;
  }

  .title {
    width: 110px;
    height: 110px;
    margin-top: -116px;
    float: right;
    margin-right: -25px;
    background-image: url(/app/image/contract-plan/icon-plan-title.svg);
    display: flex;
    position: relative;

    .plan-title {
      margin: auto;
      transform-origin: 0 1;
      transform: rotate(10deg);
      font-weight: 600;
      color: $true_white;
      text-align-last: center;
    }
  }

  .body {
    font-size: 14px;
    white-space: pre-line;
    margin-right: 30px;
    margin-top: 10px;
    font-weight: 300;
    max-height: 85px;
  }
}
</style>
