<template>
  <div class="select">
    <div class="present" @click="toggleDropdown">
      <div v-if="showPlaceHolder" class="name">{{ placeholder }}</div>
      <div v-else class="name">{{ selectedName }}</div>
      <img class="icon" src="/icon/icon_pulldown.svg" />
    </div>
    <div v-if="show" ref="dropdown" class="dropdown">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="item"
        :class="{ active: item.value === value }"
        @click="onChange(item.value)"
      >
        <div class="name">{{ item.name || item.text }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    value: {
      type: [String, Number, Boolean],
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: [String, Number, Boolean],
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
    showPlaceHolder(): boolean {
      return this.placeholder && this.propedValue === '';
    },
    selectedName(): string {
      const selectedItem = this.items
        .filter((item: object) => item.value === this.propedValue)
        .map((item: object) => (item.name || item.text) ?? null);
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
    onChange(value: string) {
      this.propedValue = value;
      this.$emit('input', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.select {
  position: relative;
  border-radius: 4px;
  width: 100%;
  height: 32px;

  .present {
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    white-space: nowrap;

    .name {
      margin-right: auto;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .icon {
      margin-left: 8px;
      width: 12px;
    }
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: -1px;
    background: #e4e5ed;
    border-radius: 4px;
    min-width: 100%;
    font-size: 13px;
    padding: 20px 25px;
    z-index: 9;

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 100%;
      transform: translateX(-50%);
      border-style: solid;
      border-width: calc(15px / 2) calc(13px / 2);
      border-color: transparent transparent #e4e5ed transparent;
    }

    .item {
      display: flex;
      align-items: center;
      white-space: nowrap;
      cursor: pointer;
      transition: color 0.2s;

      .name {
        margin-right: auto;
      }

      &.active {
        color: #f09c9c;
      }

      &:hover {
        color: #f09c9c;
      }

      & + .item {
        margin-top: 10px;
      }
    }
  }
}
</style>
