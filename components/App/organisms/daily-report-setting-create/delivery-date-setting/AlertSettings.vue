<template>
  <div class="alert-settings-wrapper">
    <title-with-index title="アラートの設定" index="4" class="title" />
    <div class="setting-row">
      <div class="setting-item">
        <radio-button
          id="setting-on"
          name="alert-radio-button"
          value="on"
          label="設定あり"
          :checked="selectedValue === 'on'"
          class="radio-button"
          @change="changeSetting"
        />
      </div>
      <div class="setting-item">
        <radio-button
          id="setting-off"
          name="alert-radio-button"
          value="off"
          label="設定なし"
          :checked="selectedValue === 'off'"
          class="radio-button"
          @change="changeSetting"
        />
      </div>
    </div>
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
    isAlert: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    selectedValue(): string {
      return this.isAlert === true ? 'on' : 'off';
    },
  },
  methods: {
    changeSetting(value: string) {
      if (value === 'on') {
        this.$emit('change', true);
        return;
      }
      this.$emit('change', false);
    },
  },
});
</script>

<style lang="scss" scoped>
.alert-settings-wrapper {
  border-bottom: 1px solid $ruled_line;
  height: inherit;
}

.title {
  margin: 0 0 22px 0;
}

.setting-row {
  display: flex;
  align-items: center;

  .setting-item {
    display: flex;
    align-items: center;
    margin: 0 20px 0 0;
  }

  .radio-button {
    margin: 0 10px 0 0;
  }

  .radio-button /deep/ .radio-label {
    font-size: 15px;
    font-weight: 300;
    color: $dark_blue;
  }
}
</style>
