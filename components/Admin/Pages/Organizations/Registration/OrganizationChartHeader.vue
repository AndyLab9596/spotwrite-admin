<template>
  <div class="organization-chart-heading">
    <div class="organization-chart-heading-left">
      <color-sample-list />
    </div>
    <div class="">
      <select v-model="selectedCompany" class="selectbox" @change="change">
        <option value="" selected>会社名で絞り込む</option>
        <option
          v-for="company in companies"
          :key="company.uuid"
          :value="company.uuid"
        >
          {{ company.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ColorSampleList from '@/components/Admin/Pages/OrganizationManagement/Organizations/ColorSampleList.vue';

export default Vue.extend({
  components: {
    ColorSampleList,
  },
  props: {
    companies: {
      type: Array as PropType<Types.GroupOrganization[]>,
      required: true,
    },
  },
  data() {
    return {
      selectedCompany: '' as string,
    };
  },
  computed: {},
  methods: {
    change() {
      this.$emit('changeSelectedCompany', this.selectedCompany);
    },
  },
});
</script>

<style lang="scss" scoped>
.organization-chart {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: $true_white;

  &-heading {
    display: flex;
    flex-direction: row;
    justify-items: center;
    justify-content: space-between;

    &-left {
      display: flex;
      flex-direction: row;
      justify-items: center;
    }

    &-right {
      display: flex;
      flex-direction: row;
      justify-items: center;
    }
  }
}

.selectbox {
  width: 250px;
  height: 40px;
  color: #6a6d83;
  border: 1px solid #e4e5ed;
  border-radius: 4px;
  appearance: none;
  background: #fafbff url('/icon/icon_pulldown.svg') no-repeat right 8px center;
  background-size: 10px 8px;
  padding: 0 8px;
}
</style>
