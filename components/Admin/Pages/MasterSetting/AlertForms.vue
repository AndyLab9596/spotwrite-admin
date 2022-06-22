<template>
  <div class="wrapper">
    <p class="title">
      <slot name="title"></slot>
    </p>
    <div class="table">
      <div class="table-row">
        <p class="table-row-left">ゆっくり</p>
        <div class="table-row-right">
          <base-select
            v-model="rules.weak"
            :items="choices"
            :large-height="false"
            @input="onChange"
          />
        </div>
      </div>
      <div class="table-row">
        <p class="table-row-left">普通</p>
        <div class="table-row-right">
          <base-select
            v-model="rules.normal"
            :items="choices"
            :large-height="false"
            @input="onChange"
          />
        </div>
      </div>
      <div class="table-row">
        <p class="table-row-left">頻繁</p>
        <div class="table-row-right">
          <base-select
            v-model="rules.strong"
            :items="choices"
            :large-height="false"
            @input="onChange"
          />
        </div>
      </div>
      <div class="table-row last-table-row">
        <p class="table-row-left last-table-row-left">
          催促無し
        </p>
        <div class="table-row-right">
          <p class="no-item">なし</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';

export default Vue.extend({
  components: {
    BaseSelect,
  },
  model: {
    prop: 'rules',
    event: 'change',
  },
  props: {
    rules: {
      type: Object,
      required: true,
    },
    choices: {
      type: Array,
      required: true,
    },
  },
  methods: {
    onChange(event: { target: HTMLSelectElement }) {
      if (event.target instanceof HTMLSelectElement) {
        const rules = {
          ...this.rules,
          [event.target.name]: event.target.value,
        };
        this.$emit('change', rules);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  margin: 0 30px 0 0;
  width: 360px;
}

.title {
  color: $dark_blue;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 1em;
  margin-bottom: 20px;
}

.subtitle {
  color: $dark_blue;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 1em;
  margin-bottom: 12px;
}

.table {
  border: 1px solid $light_gray_blue_3;
}

.table-row {
  display: flex;
  flex-flow: row;
  height: 40px;
  border-bottom: 1px solid $light_gray_blue_3;
}

.table-row-left {
  padding: 0 0 0 11px;
  font-size: 13px;
  font-weight: bold;
  color: $gray_blue_4;
  width: 140px;
  height: 40px;
  line-height: 40px;
  background-color: $white_1;
  border-right: 1px solid $light_gray_blue_3;
  border-bottom: 1px solid $light_gray_blue_3;
}

.last-table-row {
  border: none;
}

.last-table-row-left {
  border-bottom: none;
}

.table-row-right {
  display: flex;
  align-items: center;
  padding: 5px;
  width: 200px;
}

.select {
  min-width: 210px;
  width: 100%;
  height: 30px;
  border-radius: 4px;
  border: 1px solid $light_gray_blue_3;
  font-size: 13px;
  color: $gray_blue_4;
  background-color: $white_1;
  line-height: 1em;
  letter-spacing: 0;
}

.no-item {
  color: $dark_blue;
  margin-left: 6px;
  font-size: 13px;
  letter-spacing: 0;
  line-height: 1em;
}
</style>
