<template>
  <Modal @close="$emit('close')">
    <div class="inner-container">
      <ul>
        <li>
          <BaseButton @click="onResetItemClick(resetValue)">
            リセット
          </BaseButton>
        </li>
        <li v-if="multiple === true">
          <input
            id="select-all-options"
            v-model="allSelected"
            type="checkbox"
            @click="checkAll()"
          />
          <label for="select-all-options">全てチェックする</label>
        </li>
        <li v-for="option in options" :key="option.value">
          <input
            v-if="multiple"
            :id="`item_${option.value}`"
            v-model="selectedValues"
            :value="option.value"
            type="checkbox"
            :checked="selected(option)"
            @click="onItemClick(option)"
            @change="updateCheckAll()"
          />
          <input
            v-if="!multiple"
            :id="`item_${option.value}`"
            :value="option.value"
            type="radio"
            :checked="selected(option)"
            @click="onItemClick(option)"
          />
          <label :for="`item_${option.value}`">
            <span v-if="option.label">{{ option.label }}</span>
            {{ option.text }}
          </label>
        </li>
      </ul>
    </div>
    <template v-if="multiple" v-slot:footer>
      <div class="buttons">
        <BaseButton large inverse @click="$emit('close')">
          キャンセル
        </BaseButton>
        <BaseButton large inverse @click="onOkButtonClick">
          決定
        </BaseButton>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Modal from '@/components/App/atoms/modals/Modal.vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';

type OptionItem = {
  value: string;
  text: string;
  label?: string;
};

export default Vue.extend({
  components: {
    Modal,
    BaseButton,
  },
  props: {
    value: {
      type: Array as PropType<OptionItem[]>,
      default: () => [],
    },
    options: {
      type: Array as PropType<OptionItem[]>,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    resetValue: {
      type: [Array, String, Object],
      default: undefined,
    },
  },
  data: () => ({
    selectedOptions: [] as OptionItem[],
    allSelected: false as boolean,
    selectedValues: [] as string[],
  }),
  created() {
    if (this.value) {
      this.value.forEach((o: OptionItem) => {
        this.selectedOptions.push(o);
        if (this.multiple) {
          this.selectedValues.push(o.value);
        }
      });
      if (this.selectedValues.length === [...this.$props.options].length) {
        this.allSelected = true;
      }
    }
  },
  methods: {
    onResetItemClick(option: OptionItem | undefined): void {
      this.onItemClick(option, true);
    },
    onItemClick(
      option: OptionItem | undefined,
      isReset: boolean = false
    ): void {
      // リセット
      if (isReset || !option) {
        this.$emit('input', option);
        this.$emit('close');
        return;
      }
      if (!this.multiple) {
        this.$emit('input', [option]);
        this.$emit('close');
      } else {
        const i = this.selectedOptions.findIndex(
          (o: OptionItem) => o.value === option.value
        );
        if (i !== -1) {
          this.selectedOptions.splice(i, 1);
        } else {
          this.selectedOptions.push(option);
        }
      }
    },
    updateCheckAll(): void {
      if (!this.multiple) {
        return;
      }
      if (this.selectedValues.length === [...this.$props.options].length) {
        this.allSelected = true;
      } else {
        this.allSelected = false;
      }
    },
    onOkButtonClick(): void | Error {
      if (!this.multiple) {
        return Error('must be multiple.');
      }
      this.$emit('input', this.selectedOptions);
      this.$emit('close');
    },
    selected(option: OptionItem): boolean {
      if (!this.value) {
        return false;
      }
      const found = this.value.find(
        (item: OptionItem) => item.value === option.value
      );
      return found !== undefined;
    },
    checkAll(): void {
      this.allSelected = !this.allSelected;
      this.selectedValues = [];
      this.selectedOptions = [];
      if (this.allSelected) {
        this.selectedValues = [...this.$props.options].map(
          (o: OptionItem) => o.value
        );
        [...this.$props.options].forEach((o: OptionItem) =>
          this.onItemClick(o)
        );
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.inner-container {
  padding: 32px;
  width: 100%;
  max-height: calc(100vh - 200px);
  overflow-y: scroll;

  label {
    span {
      font-size: 11px;
      color: #9c9da5;
    }
  }
}

ul {
  width: 100%;
}

li {
  padding: 16px;
  border-bottom: 1px solid $ruled_line;
}

.buttons {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  button:not(:first-child) {
    margin-left: 1em;
  }
}
</style>
