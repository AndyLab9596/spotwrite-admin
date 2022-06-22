<template>
  <img
    :class="size"
    :src="userIcon"
    :style="link ? { cursor: 'pointer' } : null"
    alt="Logo"
    @click="clickLink"
  />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    size: {
      type: String,
      default: 'medium',
      validator: (v: string) => ['small', 'medium', 'large'].includes(v),
    },
    userIcon: {
      type: String,
      required: true,
      default: '',
    },
    link: {
      type: String,
      required: false,
      default: '',
    },
  },
  methods: {
    clickLink() {
      this.$router.push(this.link);
    },
  },
});
</script>

<style lang="scss" scoped>
.large {
  width: 120px;
  height: 120px;
  border-radius: 48px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.16);
  object-fit: cover;
}

.medium {
  width: 72px;
  height: 72px;
  border-radius: 28px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.16);
  object-fit: cover;
}

.small {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}
</style>
