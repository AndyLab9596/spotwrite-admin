<template>
  <div class="container">
    <div class="heading">
      <label class="label"
        >出身地<span class="required-label">※必須</span></label
      >
    </div>
    <div class="content">
      <div class="top">
        <div class="form-item-radio">
          <base-radio-button
            id="country1"
            label="日本"
            name="country"
            value="japan"
            :checked="isJapanChecked"
            :disabled="disabled"
            @change="checkJapan"
          />
        </div>
        <div class="form-item-radio">
          <base-radio-button
            id="country2"
            label="海外"
            name="country"
            value="overseas"
            :checked="!isJapanChecked"
            :disabled="disabled"
            @change="checkOverseas"
          />
        </div>
      </div>
      <div v-if="isJapanChecked" class="bottom">
        <validation-provider
          v-slot="slotPrefecture"
          rules="required"
          name="都道府県"
        >
          <div class="form-item form-item--prefecture">
            <label class="sub-label">都道府県</label>
            <base-select
              v-model="selectedPrefecture"
              :items="prefecturesForBaseSelect"
              class="select"
              :class="{
                'select-error': slotPrefecture.errors[0] || !selectedPrefecture,
              }"
              :disabled="disabled"
            />
          </div>
        </validation-provider>
        <div class="form-item">
          <label class="sub-label">市区町村</label>
          <input
            v-model="inputCity"
            type="text"
            class="input"
            :disabled="disabled"
          />
        </div>
      </div>
      <div v-else class="bottom">
        <validation-provider
          v-slot="slotCountry"
          rules="required"
          name="出身国"
        >
          <div class="form-item form-item--country">
            <label class="sub-label">出身国</label>
            <base-select
              v-model="selectedCountry"
              :items="countriesForBaseSelect"
              class="select"
              :class="{
                'select-error': slotCountry.errors[0] || !selectedCountry,
              }"
              :disabled="disabled"
            />
          </div>
        </validation-provider>
        <div class="form-item">
          <label class="sub-label">州・地域</label>
          <input
            v-model="inputCity"
            type="text"
            class="input"
            :disabled="disabled"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ValidationProvider } from 'vee-validate';
import type { EnumCountry } from '@/libs/definition/enumCountries'
import BaseRadioButtons from '@/components/Admin/Modules/Button/BaseRadioButtons.vue';
import { EnumPrefecture } from '@/libs/definition/enumPrefectures';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';

type Data = {
  isJapanChecked: boolean;
  selectedCountry: string;
  selectedPrefecture: string;
  inputCity: string;
};

export default Vue.extend({
  name: 'BirthplaceFormItem',
  components: {
    ValidationProvider,
    BaseRadioButton: BaseRadioButtons,
    BaseSelect,
  },
  props: {
    country: {
      type: String,
      default: '',
    },
    prefecture: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    countries: {
      type: Array as PropType<EnumCountry[]>,
      default: () => [],
    },
    prefectures: {
      type: Array as PropType<EnumPrefecture[]>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    savedProfileBirthCountry: {
      type: String,
      default: '',
    },
    savedProfileBirthPrefecture: {
      type: String,
      default: '',
    },
  },
  data(): Data {
    return {
      isJapanChecked: true,
      selectedCountry: '',
      selectedPrefecture: '',
      inputCity: '',
    };
  },
  computed: {
    prefecturesForBaseSelect(): { name: string, value: string }[] {
      return this.prefectures.map((item: EnumPrefecture) => ({ name: item.name, value: item.name }));
    },
    countriesForBaseSelect(): { name: string, value: string }[] {
      const withoutJapan = this.countries.filter((item: EnumCountry) => item.name !== '日本');
      return withoutJapan.map((item: EnumCountry) => ({ name: item.name, value: item.name }));
    },
  },
  watch: {
    country() {
      this.selectedCountry = this.country;
      if (this.selectedCountry !== '日本') {
        this.isJapanChecked = false;
      }
    },
    prefecture() {
      this.selectedPrefecture = this.prefecture;
    },
    city() {
      this.inputCity = this.city;
    },
    selectedCountry() {
      this.$emit('onChangeCountry', this.selectedCountry);
    },
    selectedPrefecture() {
      this.$emit('onChangePrefecture', this.selectedPrefecture);
    },
    inputCity() {
      this.$emit('onChangeCity', this.inputCity);
    },
  },
  methods: {
    checkJapan() {
      this.isJapanChecked = true;
      this.$emit('onChangeCountry', '日本');
      if (this.savedProfileBirthPrefecture !== this.selectedPrefecture) {
        this.$emit('onChangePrefecture', this.savedProfileBirthPrefecture);
      }
    },
    checkOverseas() {
      this.isJapanChecked = false;
      this.$emit('onChangePrefecture', '');
      if (this.savedProfileBirthCountry !== this.selectedCountry && this.savedProfileBirthCountry !== '日本') {
        this.$emit('onChangeCountry', this.savedProfileBirthCountry);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
}

.heading {
  display: flex;
  min-width: 180px;
}

.content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.top {
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
}

.bottom {
  display: flex;
  flex-direction: row;
}

.label {
  font-weight: bold;
}

.sub-label {
  margin-right: 10px;
}

.form-item-radio {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
}

.form-item {
  display: flex;
  flex-direction: row;
  align-items: center;

  &--prefecture {
    margin-right: 15px;
  }

  &--country {
    margin-right: 15px;
  }
}

.select {
  flex: 1;
  font-size: 13px;
  font-weight: 300;
  max-width: 300px;
  background-color: $extra_light_gray;
  color: $gray_blue_4;
  border-radius: 4px;
  height: 40px;
  border: solid 1px $light_gray_blue_3;
}

.input {
  flex: 1;
  font-size: 13px;
  font-weight: 300;
  border-radius: 4px;
  background-color: $extra_light_gray;
  color: $gray_blue_4;
  border: solid 1px $light_gray_blue_3;
  padding: 0 10px;
  height: 40px;
  max-width: 300px;
  width: 100%;
}

.error {
  font-size: 0.8em;
  color: red;
}

.select-error {
  background-color: $light_pink;
  border-color: $pink;
}

.required-label {
  color: #9c9da5;
  font-size: 13px;
  font-weight: normal;
  margin-left: 9px;
}
</style>
