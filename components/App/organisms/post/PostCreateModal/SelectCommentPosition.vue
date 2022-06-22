<template>
  <div>
    <div class="comment-position">
      <div>
        参加種別
      </div>
      <div class="toggles">
        <div
          class="toggle"
          :class="{ selected: value === 'left' }"
          value="left"
          @click="onClick('left')"
        >
          インタビュアー
        </div>
        <div
          class="toggle"
          :class="{ selected: value === 'right' }"
          value="right"
          @click="onClick('right')"
        >
          参加者
        </div>
      </div>
    </div>
    <div class="text-description">
      <span>※インタビュアーは発言が左寄せで表示されます</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    value: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    onClick(position: string) {
      if (this.$props.disabled) return;
      this.$emit('input', position);
    },
  },
});
</script>

<style lang="scss" scoped>
.comment-position {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.toggles {
  display: flex;
  margin-left: 16px;
}

.toggle {
  width: 120px;
  height: 44px;
  border: 1px solid $ruled_line;
  border-radius: 4px;
  background-color: $true_white;
  color: rgba($text_gray, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &.selected {
    background-color: $gentle_bluish_purple;
    color: $true_white;
  }
}

.text-description {
  text-align: right;
  font-size: 10px;
  margin-right: 20px;
  font-weight: 300;
  margin-top: 12px;
}
</style>
