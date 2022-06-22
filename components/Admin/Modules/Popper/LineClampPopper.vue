<template>
  <popper
    trigger="hover"
    :disabled="showPopper"
    :options="{ placement: 'bottom' }"
  >
    <div class="popper-full">
      {{ text }}
    </div>
    <span
      slot="reference"
      ref="lineClampPopperRef"
      :class="isRuby ? 'ruby' : 'text'"
      :style="{ '-webkit-line-clamp': lineClamp }"
    >
      {{ text }}
    </span>
  </popper>
</template>

<script lang="ts">
import Vue from 'vue';
import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';

export default Vue.extend({
  name: 'LineClampPopper',
  components: {
    Popper,
  },
  props: {
    text: {
      type: String,
      required: true,
    },
    isRuby: {
      type: Boolean,
      required: false,
      default: false,
    },
    lineClamp: {
      type: Number,
      required: false,
      default: 2,
    },
  },
  data() {
    return {
      showPopper: false as boolean,
    };
  },
  watch: {
    text() {
      const ref = this.$refs.lineClampPopperRef;
      // @ts-ignore
      this.showPopper = ref.scrollHeight > ref.offsetHeight;
    },
  },
  mounted() {
    const ref = this.$refs.lineClampPopperRef;
    // @ts-ignore
    this.showPopper = ref.scrollHeight <= ref.offsetHeight;
  },
});
</script>

<style lang="scss" scoped>
.ruby {
  color: $gray_blue_1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 11px;
  word-break: break-all;
}

.text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 15px;
  line-height: 18px;
  word-break: break-all;
}

.popper-full {
  width: 300px;
  word-break: break-all;
  background-color: $true_white;
  font-size: 13px;
  color: $dark_blue;
  border: 1px solid $light_gray_blue_3;
  padding: 10px;
}
</style>
