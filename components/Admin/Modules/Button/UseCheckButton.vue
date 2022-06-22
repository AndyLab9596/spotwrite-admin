<template>
  <div
    class="access-count-button-wrapper"
    :class="{ 'is-active': isActive }"
    @click="$emit('click')"
  >
    <p class="category-count__name">
      {{ name }}
    </p>
    <p class="category-count__count">
      <span class="text-pink"> {{ count }} </span>{{ unit }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  components: {},
  props: {
    isActive: {
      type: Boolean,
      required: false,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: false,
      default: '回',
    },
  },
});
</script>

<style lang="scss" scoped>
.access-count-button-wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 120px;
  height: 52px;
  border-radius: 6px;
  background-color: $true_white;
  border: 1px solid $light_gray_blue_3;
  cursor: pointer;
  color: $gray_blue_4;

  &:hover {
    background-color: $light_gray_blue_5;
  }
}

.text-pink {
  color: $pink;
  font-size: 15px;
  font-family: 'Lato', sans-serif;
  line-height: 1em;
}

.category-count__name {
  font-weight: bold;
  line-height: 1em;
  margin: 11px 0 3px;
  font-size: 13px;
}

.category-count__count {
  line-height: 1em;
}

.is-active {
  background-color: $light_gray_blue_5;
  border: none;
  border-radius: 4px;
  color: $main_color;
}
</style>
