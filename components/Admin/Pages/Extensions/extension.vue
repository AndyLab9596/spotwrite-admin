<template>
  <div class="wrapper">
    <h2 class="title">{{ title }}</h2>
    <div class="detail">
      <div class="description">
        {{ description }}
      </div>
      <div class="toggle">
        <toggle-button
          :value="toggleValue"
          class="button"
          :name="name"
          :contents="[
            { label: '表示', value: 'on' },
            { label: '非表示', value: 'off' },
          ]"
          @input="(val) => (toggleValue = val)"
          @change="onChange"
        ></toggle-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ToggleButton } from '@/components/Admin/Modules/Button';

export default Vue.extend({
  components: {
    ToggleButton,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    active: { type: Boolean, required: true },
  },
  computed: {
    toggleValue(): string {
      return this.active ? 'on' : 'off';
    },
  },
  methods: {
    onChange() {
      if (this.active) {
        this.$emit('off');
      } else {
        this.$emit('on');
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  & + & {
    margin: 30px 0 0 0;
  }
}

.title {
  font-size: 15px;
  font-weight: bold;
  color: $dark_blue;
  line-height: 15px;
}

.detail {
  display: flex;
  justify-content: space-between;
  background-color: $white_1;
  border-radius: 4px;
  padding: 5px 5px 5px 15px;
  margin: 17px 0 0;
}

.description {
  font-size: 15px;
  color: $gray_blue_4;
  line-height: 40px;
}

.toggle {
  background-color: $true_white;
  border-radius: 4px;
  padding: 5px;
}
</style>
