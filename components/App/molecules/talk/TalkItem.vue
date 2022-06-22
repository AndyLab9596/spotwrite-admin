<template>
  <div :style="{ width: '100%' }">
    <div v-if="profileName" :class="`${commentPosition}-profile-name`">
      {{ profileName }}
    </div>
    <div :class="`${commentPosition}-talk-wrapper ${pattern}`">
      <div class="talk-content">
        {{ content }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    content: {
      type: String,
      required: true,
    },
    commentPosition: {
      type: String,
      required: true,
    },
    profileName: {
      type: String,
      required: false,
      default: '',
    },
    pattern: {
      type: String,
      required: false,
      default: '',
    },
  },
});
</script>

<style lang="scss" scoped>
.left-talk-wrapper {
  position: relative;
  padding: 16px;
  width: 100%;
  color: $chart_text;
  font-size: 13px;
  border-radius: 8px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -20px;
  }

  &.pattern1 {
    background: $gradient_7;

    &::before {
      border-style: solid;
      border-color: $baby_blue transparent transparent;
      border-width: 20px;
    }
  }

  &.pattern2 {
    background-color: #fdf0f0;

    &::before {
      border-style: solid;
      border-color: #fdf0f0 transparent transparent;
      border-width: 20px;
    }
  }

  &.pattern3 {
    background-color: #faf1e8;

    &::before {
      border-style: solid;
      border-color: #faf1e8 transparent transparent;
      border-width: 20px;
    }
  }
}

.right-talk-wrapper {
  position: relative;
  padding: 16px;
  width: 100%;
  color: $chart_text;
  font-size: 13px;
  border-radius: 8px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: -20px;
  }

  &.pattern1 {
    background: $gradient_7;

    &::before {
      border-style: solid;
      border-color: $powder_pink transparent transparent;
      border-width: 20px;
    }
  }

  &.pattern2 {
    background-color: #fdf0f0;

    &::before {
      border-style: solid;
      border-color: #fdf0f0 transparent transparent;
      border-width: 20px;
    }
  }

  &.pattern3 {
    background-color: #faf1e8;

    &::before {
      border-style: solid;
      border-color: #faf1e8 transparent transparent;
      border-width: 20px;
    }
  }
}

.talk-content {
  font-size: 15px;
  color: $chart_text;
  font-weight: 300;
  line-height: 1em;
  width: 100%;
  text-align: left;
}

.left-profile-name {
  text-align: left;
  margin-top: 4px;
  margin-left: -20px;
  margin-bottom: 4px;
  font-size: 11px;
  color: #6a6d83;
  font-weight: 600;
  line-height: 1em;
}

.right-profile-name {
  text-align: right;
  margin-top: 4px;
  margin-right: -20px;
  margin-bottom: 4px;
  font-size: 11px;
  color: #6a6d83;
  font-weight: 600;
  line-height: 1em;
}
</style>
