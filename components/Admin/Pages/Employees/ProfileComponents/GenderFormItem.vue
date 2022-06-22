<template>
  <div class="container">
    <div class="heading">
      <label class="label">性別<span class="required-label">※必須</span></label>
    </div>
    <validation-provider v-slot="gender" rules="required" name="性別">
      <div class="content">
        <div class="form-item">
          <radio-button
            id="gender1"
            class="gender-radio"
            :class="{ error: gender.errors[0] || !value }"
            label="男性"
            name="gender"
            value="man"
            :checked="isManChecked"
            :disabled="disabled"
            @change="changeGender"
          />
        </div>
        <div class="form-item">
          <radio-button
            id="gender2"
            class="gender-radio"
            :class="{ error: gender.errors[0] || !value }"
            label="女性"
            value="woman"
            name="gender"
            :checked="isWomanChecked"
            :disabled="disabled"
            @change="changeGender"
          />
        </div>
        <div class="form-item">
          <radio-button
            id="gender3"
            class="gender-radio"
            :class="{ error: gender.errors[0] || !value }"
            label="回答しない"
            value="free"
            name="gender"
            :checked="isFreeChecked"
            :disabled="disabled"
            @change="changeGender"
          />
        </div>
      </div>
    </validation-provider>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationProvider } from 'vee-validate';
import RadioButton from '@/components/Admin/Pages/Employees/ProfileComponents/RadioButton.vue';

export default Vue.extend({
  name: 'GenderFormItem',
  components: {
    ValidationProvider,
    RadioButton,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isManChecked(): boolean {
      return this.value === 'man';
    },
    isWomanChecked(): boolean {
      return this.value === 'woman';
    },
    isFreeChecked(): boolean {
      return this.value === 'free';
    },
  },
  methods: {
    changeGender(value: string) {
      this.$emit('onChange', value);
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
}

.heading {
  display: flex;
  min-width: 180px;
}

.content {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.form-item {
  margin-right: 40px;

  &:last-child {
    margin-right: 0;
  }
}

.error {
  font-size: 0.8em;
  color: red;
}

.hidden {
  display: none;
}

.required-label {
  color: #9c9da5;
  font-size: 13px;
  font-weight: normal;
  margin-left: 9px;
}

.label {
  font-weight: bold;
}
</style>
