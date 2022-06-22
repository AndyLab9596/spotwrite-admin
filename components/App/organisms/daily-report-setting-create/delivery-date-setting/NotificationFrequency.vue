<template>
  <div class="notification-frequency-wrapper">
    <title-with-index title="頻度を設定" index="1" class="title" />
    <radio-button
      id="select-everyday"
      name="frequency-radio-button-"
      value="everyday"
      label="毎日"
      :checked="frequency === 'everyday'"
      class="radio-button"
      @change="changeValue"
    />
    <radio-button
      id="select-weekly"
      name="frequency-radio-button"
      value="weekly"
      label="曜日で指定する"
      :checked="frequency === 'weekly'"
      class="radio-button"
      @change="changeValue"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import RadioButton from '@/components/App/atoms/buttons/RaadioButton.vue';
import TitleWithIndex from '@/components/App/organisms/daily-report-setting-create/delivery-date-setting/common-items/TitleWithIndex.vue';

export default Vue.extend({
  components: {
    RadioButton,
    TitleWithIndex,
  },
  props: {
    frequency: {
      type: String,
      required: true,
    },
  },
  methods: {
    changeValue(value: string) {
      this.$emit('change', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.notification-frequency-wrapper {
  width: 260px;
}

.title {
  margin: 0 0 22px 0;
}

.radio-button {
  display: block;

  &:first-of-type {
    margin: 0 0 22px;
  }

  /deep/ .radio-label {
    font-size: 15px;
    font-weight: 300;
    color: $dark_blue;
  }
}
</style>
