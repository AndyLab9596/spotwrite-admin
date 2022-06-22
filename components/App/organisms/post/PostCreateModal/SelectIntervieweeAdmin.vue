<template>
  <div class="select-employee-container">
    <img
      v-if="!confirmedMember"
      class="icon"
      src="/app/icon/cross.svg"
      @click="$emit('delete')"
    />
    <div class="select-employee-box">
      <div
        v-if="!selectedItem.user_uuid"
        class="button"
        @click="onSelectEmployeeButtonClick"
      >
        社員を選択して自動入力
      </div>
      <SelectEmployeeModal
        v-if="isEmployeesOpen"
        :items="items"
        :unavailable-items="selectedItems"
        @select="onEmployeeSelect($event)"
        @close="isEmployeesOpen = !isEmployeesOpen"
      />
    </div>
    <div class="form">
      <div class="photo-box">
        <img
          v-if="selectedItem && selectedItem.user_icon"
          :src="selectedItem.user_icon"
          class="icon"
        />
        <template v-else>
          <img
            class="icon-plus-circle"
            src="/app/icon/plus_circle.svg"
            @click="onSelectEmployeeButtonClick"
          />
          <div class="label">社員の顔写真を追加</div>
        </template>
      </div>
      <div class="employee-attributes-box">
        <div class="row">
          <div class="label">
            部署
          </div>
          <div class="value">
            <span v-if="selectedItem && selectedItem.organization_name">
              {{ selectedItem.organization_name }}
            </span>
            <span v-else class="placeholder">
              （例）営業部
            </span>
          </div>
        </div>
        <div class="row">
          <div class="label">
            社員氏名
          </div>
          <div class="value">
            <span v-if="selectedItem && selectedItem.name">
              {{ selectedItem.name }}
            </span>
            <span v-else class="placeholder">
              （例）中村綾子
            </span>
          </div>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from '@/libs/dayjs';
import SelectEmployeeModal from '../../../molecules/modals/SelectEmployeeModal.vue';

type Employee = ApiResponse.Employee;

export default Vue.extend({
  components: {
    SelectEmployeeModal,
  },
  props: {
    selectedItem: {
      type: Object as PropType<Employee>,
      default: null,
    },
    items: {
      type: Array as PropType<Employee[]>,
      required: true,
    },
    selectedItems: {
      type: Array as PropType<Employee[]>,
      required: true,
    },
    deletable: {
      type: Boolean,
      default: true,
    },
    confirmedMember: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isEmployeesOpen: false as boolean,
  }),
  methods: {
    onSelectEmployeeButtonClick(): void {
      this.isEmployeesOpen = !this.isEmployeesOpen;
    },
    onEmployeeSelect(employee: Employee): void {
      this.$emit('select', employee);
      this.onSelectEmployeeButtonClick();
    },
    careerYear(joinedOn: { year?: number; month?: number }): string {
      if (!joinedOn.year || !joinedOn.month) {
        return '';
      }
      const n = dayjs().diff(
        dayjs(`${joinedOn.year}-${joinedOn.month}-01`),
        'year'
      );
      return `入社${n}年目`;
    },
  },
});
</script>

<style lang="scss" scoped>
.select-employee-container {
  position: relative;
  padding: 32px 40px;
  background-color: $white_1;
  font-size: 15px;

  > .icon {
    position: absolute;
    right: 16px;
    top: 16px;
    cursor: pointer;
  }

  .icon-add-people {
    margin-bottom: 5px;
    margin-right: 20px;
    width: 14px;
  }
}

.select-employee-box {
  position: relative;

  .button {
    width: 100%;
    background-color: $true_white;
    border: 1px solid $button_background_color;
    border-radius: 4px;
    padding: 15px 0;
    color: $gentle_bluish_purple;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
  }

  .select {
    position: absolute;
    width: 100%;
    text-align: center;
    max-height: calc(55px * 5);
    overflow-y: scroll;

    li {
      width: 100%;
      background-color: $true_white;
      border: 1px solid $button_background_color;
      border-radius: 4px;
      padding: 15px 0;
      cursor: pointer;

      &:hover,
      &.selected {
        background-color: $link_color;
        color: $true_white;
      }

      &.disabled {
        cursor: not-allowed;
        background-color: $true_white;
        color: $text_gray;
      }
    }
  }
}

.form {
  display: flex;
  margin-top: 24px;
}

.photo-box {
  width: 147px;
  height: 147px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: $true_white;
  border: 1px solid $ruled_line;
  border-radius: 4px;

  img {
    max-width: 100%;
    max-height: 100%;

    &.icon {
      object-fit: cover;
    }
  }

  .label {
    margin-top: 10px;
    font-size: 11px;
    font-weight: 600;
    color: $text_gray;
  }
}

.employee-attributes-box {
  margin-left: 30px;
  width: 610px;

  .row {
    padding: 16px 0;
    display: flex;
    border-bottom: 1px solid $ruled_line;
  }

  .label {
    width: 90px;
  }

  .placeholder {
    color: rgba(#585a69, 0.5);
  }
}

.icon-plus-circle {
  width: 40px;
  height: 40px;
  cursor: pointer;
}
</style>
