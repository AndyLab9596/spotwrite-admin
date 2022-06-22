<template>
  <div>
    <DatePicker :value-type="type" :value="dateValue" @input="onInput" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

export default Vue.extend({
  components: {
    DatePicker,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    value: {
      type: [Date, String],
      default: () => new Date(),
    },
  },
  computed: {
    dateValue(): Date | number | undefined {
      if (this.type === 'timestamp' && typeof this.value === 'string') {
        return parseInt(this.value, 10) * 1000;
      }
      if (typeof this.value === 'string' && this.value !== '') {
        return new Date(this.value);
      }
      if (this.value instanceof Date) {
        return this.value;
      }
      return undefined;
    },
  },
  methods: {
    onInput(value: Date) {
      this.$emit('input', value);
    },
  },
});
</script>
