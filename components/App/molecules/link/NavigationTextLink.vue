<template>
  <nuxt-link
    class="navigation-text-link-container"
    event=""
    :to="link"
    :target="target"
    @click.native="clickEvent()"
  >
    <icon class="navigation-text-link-icon" :name="icon" />
    <span class="navigation-text-link-text">
      {{ text }}
    </span>
  </nuxt-link>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '../../atoms/images/Icon.vue';

export default Vue.extend({
  components: {
    Icon,
  },
  props: {
    icon: {
      type: String,
      default: 'home',
    },
    text: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '/',
    },
    target: {
      type: String,
      default: null,
    },
  },
  methods: {
    clickEvent() {
      if (this.$router.currentRoute.path === this.link) {
        const bodyScrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (bodyScrollTop === 0) {
          this.$emit('re-render');
        } else {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
          });
        }
      } else {
        this.$router.push({
          path: this.link,
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.navigation-text-link-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: inherit;
}

.navigation-text-link-icon {
  margin-right: 25px;
}

.navigation-text-link-text {
  font-size: 15px;
  white-space: nowrap;
}
</style>
