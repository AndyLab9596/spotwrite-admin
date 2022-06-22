<template>
  <div class="button" @click="onClick">
    <div v-if="index > 0" class="button-index">{{ index + '.' }}</div>
    {{ answer }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    answer: {
      type: String,
      required: false,
      default: '',
    },
    uuid: {
      type: String,
      required: false,
      default: '',
    },
    index: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  methods: {
    onClick() {
      this.$emit('onClick', this.uuid);
    },
  },
});
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 44px;
  border: 1px solid $link_color;
  border-radius: 22px;
  background-color: $true_white;
  color: $link_color;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  position: relative;
}

.button-index {
  position: absolute;
  left: 57px;
}
</style>
