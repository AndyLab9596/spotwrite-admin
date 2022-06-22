<template>
  <div>
    <img
      v-if="!isMoreIcon"
      class="icon"
      :class="{ link: !isVisitor }"
      :src="src"
      alt=""
      @click="goToUserProfile"
    />
    <more-icon v-else :src="src" @onClick="onClick" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MoreIcon from '../../atoms/icons/MoreIcon.vue';

export default Vue.extend({
  components: {
    MoreIcon,
  },
  props: {
    src: {
      type: String,
      required: true,
    },
    darkIconNumber: {
      type: Number,
      required: false,
      default: 7,
    },
    index: {
      type: Number,
      required: false,
      default: 7,
    },
    userUuid: {
      type: String,
      required: true,
    },
    isVisitor: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    isMoreIcon(): boolean {
      return this.index === this.darkIconNumber;
    },
  },
  methods: {
    onClick() {
      this.$emit('onClick');
    },
    goToUserProfile(): void {
      if (!this.isVisitor) {
        this.$router.push(`/users/${this.userUuid}`);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.mask {
  background-color: $true_black;
  border-radius: 12px;
  position: relative;
}

.icon {
  height: 32px;
  width: 32px;
  border-radius: 12px;
  box-shadow: 0 1px 2px $box-shadow;
  object-fit: cover;

  &.link {
    cursor: pointer;
  }
}

.opacity {
  opacity: 0.4;
}

.icon-other {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 17px;
}
</style>
