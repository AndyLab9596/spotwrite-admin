<template>
  <popper
    trigger="hover"
    :options="{
      placement: 'bottom-end',
    }"
    :style="{ maxWidth: maxWidth + 'px' }"
    class="popper-item"
  >
    <div class="popper">
      {{ text }}
    </div>

    <span
      slot="reference"
      :style="{ maxWidth: maxWidth + 'px' }"
      class="displayed-text"
    >
      {{ text }}
    </span>
  </popper>
</template>

<script>
import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';

export default {
  components: {
    popper: Popper,
  },
  props: {
    text: {
      default: '',
      type: String,
    },
    maxWidth: {
      default: '',
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.popper-item {
  display: flex;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.popper {
  width: 350px;
  display: flex;
  align-items: center;
  white-space: initial;
  word-break: break-all;
  background-color: $true_white;
  font-size: 13px;
  color: $dark_blue;
  border: 1px solid $light_gray_blue_3;
  padding: 10px;
  box-shadow: none;
}

.displayed-text {
  display: inline;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.popper__arrow {
  visibility: none;
}
</style>
