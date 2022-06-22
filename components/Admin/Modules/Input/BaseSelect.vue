<template>
  <div
    class="select"
    :class="{
      'large-height': largeHeight,
      'large-text': largeText,
      error: error,
    }"
  >
    <div class="present" @click="toggleDropdown">
      <div v-if="!!selectedName" class="name">
        {{ selectedName }}
      </div>
      <div v-else class="name">
        {{ defaultText }}
      </div>

      <div v-if="selectedLabel" class="label">
        {{ selectedLabel }}
      </div>
      <img class="icon" src="/icon/icon_pulldown.svg" />
    </div>
    <div
      v-if="show"
      ref="dropdown"
      class="dropdown"
      :class="{
        'dropdown-scroll-item': dropdownScrollItem,
      }"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="item"
        :class="{ active: item.value === value }"
        :disabled="item.disabled"
        @click="onChange(item)"
      >
        <div class="name">{{ item.name || item.text }}</div>
        <div v-if="item.label" class="label">
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

type SelectItem = {
  name: string;
  value: number;
  label: string | undefined;
  disabled?: boolean;
};

export default Vue.extend({
  props: {
    value: {
      type: [String, Number, Boolean],
      default: '',
    },
    items: {
      type: Array as PropType<SelectItem[]>,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    largeHeight: {
      type: Boolean,
      default: true,
    },
    largeText: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    defaultText: {
      type: String,
      required: false,
      default: '選択してください。',
    },
    dropdownScrollItem: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      propedValue: this.value as string,
      show: false as boolean,
      lock: false as boolean,
    };
  },
  computed: {
    error(): boolean {
      return this.required !== false && this.propedValue === '';
    },
    selectedName(): string {
      const selectedItem = this.items
        .filter((item: object) => item.value === this.propedValue)
        .map((item: object) => (item.name || item.text) ?? null);
      return selectedItem[0] ?? null;
    },
    selectedLabel(): string {
      const selectedItem = this.items
        .filter((item: object) => item.value === this.propedValue)
        .map((item: object) => item.label ?? null);
      return selectedItem[0] ?? null;
    },
  },
  watch: {
    value(newValue: [String, Number, Boolean]) {
      this.propedValue = newValue;
    },
  },
  methods: {
    open() {
      this.lock = true;
      this.show = true;
      setTimeout(() => {
        this.lock = false;
        const d: any = document;
        d.getElementById('__nuxt').addEventListener('click', this.close, false);
      }, 250);
    },
    close() {
      if (this.lock || document == null) {
        return;
      }
      this.show = false;
      const d: any = document;
      d.getElementById('__nuxt').removeEventListener(
        'click',
        this.close,
        false
      );
    },
    toggleDropdown() {
      if (this.show) {
        this.close();
      } else {
        this.open();
      }
    },
    onChange(item: SelectItem) {
      if (this.propedValue !== item.value && !item.disabled) {
        this.propedValue = item.value;
        this.$emit('input', item.value);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.select {
  position: relative;
  background: $white_1;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  font-size: 13px;
  width: 100%;
  height: 30px;
  padding: 0 8px;

  .present {
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    white-space: nowrap;

    .name {
      color: $gray_blue_4;
      margin-right: auto;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .label {
      margin-left: 8px;
      background: #abb1cc;
      color: $true_white;
      padding: 3px;
      font-weight: bold;
      line-height: 1;
      border-radius: 4px;
    }

    .icon {
      margin-left: 8px;
    }
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: -1px;
    background: $true_white;
    min-width: calc(100% + 2px);
    border: solid 1px $light_gray_blue_3;
    z-index: 9;

    .item {
      display: flex;
      align-items: center;
      white-space: nowrap;
      cursor: pointer;
      padding: 0 8px;
      height: 34px;

      .name {
        margin-right: auto;
      }

      .label {
        margin-left: 8px;
        color: #9c9da5;
      }

      &.active {
        background: $white_1;
      }

      &:hover {
        background: $light_gray_blue_5;
      }

      &[disabled] {
        cursor: default;
        background: #f3f3f3;
        color: #bebebe;
      }
    }
  }

  .dropdown-scroll-item {
    overflow-y: auto;
    max-height: 173px;
  }

  &.large-text {
    font-size: 15px;
  }

  &.large-height {
    height: 40px;
  }

  &.error {
    background-color: $light_pink_1;
    border: solid 1px $pink;
  }
}
</style>
