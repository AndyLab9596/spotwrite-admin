<template>
  <div class="achievement-of-goals-wrapper">
    <p class="achievement-of-goals-text">目標達成度</p>
    <toggle-button :value="isAchievement" @onChange="changeAchievement" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ToggleButton from '@/components/App/atoms/buttons/ToggleButton.vue';

export default Vue.extend({
  components: {
    ToggleButton,
  },
  props: {
    isAchievement: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    changeAchievement(value: boolean) {
      this.$emit('changeAchievement', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.achievement-of-goals-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 0 12px;
  border-bottom: 1px solid $ruled_line;
}

.achievement-of-goals-text {
  font-size: 15px;
  font-weight: 300;
  color: $sub_color;
}
</style>
