<template>
  <div>
    <Modal @click="onClick" @close="onClose">
      <SelectEmployee
        :items="items"
        :unavailable-items="unavailableItems"
        class="select-employee"
        @select="onSelect($event)"
      />
    </Modal>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Modal from '../../atoms/modals/Modal.vue';
import SelectEmployee from '../list/SelectEmployee.vue';

type Employee = ApiResponse.Employee;

export default Vue.extend({
  components: {
    Modal,
    SelectEmployee,
  },
  props: {
    items: {
      type: Array as PropType<Employee[]>,
      required: true,
    },
    unavailableItems: {
      type: Array as PropType<Employee[]>,
      default: () => [],
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
    onClose() {
      this.$emit('close');
    },
    onSelect(employee: Employee): void {
      this.$emit('select', employee);
    },
  },
});
</script>

<style lang="scss" scoped>
.select-employee {
  width: 100%;
  max-height: 500px;
  overflow-y: scroll;
}
</style>
