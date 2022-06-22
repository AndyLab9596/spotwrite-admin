<template>
  <div class="sub-organization-form-item-wrapper">
    <div class="container">
      <div class="heading">
        <label class="label">サブ組織（BOX）</label>
      </div>
      <div class="content">
        <div class="left">
          <div class="form-item">
            <label class="sub-label">会社</label>
            <base-select
              v-model="selectedCompany"
              class="select-box"
              :items="companiesForBaseSelect"
            />
          </div>
          <div class="form-item">
            <label class="sub-label">組織<br />(BOX)</label>
            <base-select
              v-model="selectedSubOrganization"
              class="select-box"
              :items="subOrganizations"
            />
          </div>
          <div class="add-button-row">
            <add-button
              class="add-button"
              :disabled="
                selectedCompany === '' || selectedSubOrganization === ''
              "
              :is-disabled="
                selectedCompany === '' || selectedSubOrganization === ''
              "
              @click="addSubOrganization"
            >
              追加
            </add-button>
          </div>
        </div>
        <hr data-v-9413ca8c="" class="vertical" />
        <div class="right">
          <p class="list-title">選択したサブ組織（BOX）</p>
          <ul class="list-box">
            <li
              v-for="item in selectedSubOrganizations"
              :key="item.uuid"
              class="list-item"
            >
              {{ getCompanyByUuid(item.relations.company).name }} |
              {{ item.name }}
              <img
                class="remove-button"
                src="/icon/icon_delete.svg"
                @click="removeSubOrganization(item)"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="note">
      ※メイン以外に所属している組織、もしくは関わっている組織を登録出来ます。
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import AddButton from '@/components/Admin/Pages/CommunityManagement/AddButton.vue';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';

type Data = {
  selectedCompany: string;
  selectedSubOrganization: string;
};

export default Vue.extend({
  name: 'SubOrganizationFormItem',
  components: {
    AddButton,
    BaseSelect,
  },
  props: {
    value: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    organizations: {
      type: Array as PropType<ApiResponse.GroupOrganization[]>,
      default: () => [],
    },
    mainOrganization: {
      type: String,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data(): Data {
    return {
      selectedCompany: '',
      selectedSubOrganization: '',
    };
  },
  computed: {
    organizationsWithoutMain(): ApiResponse.GroupOrganization[] {
      return this.organizations.filter(
        (item: ApiResponse.GroupOrganization) =>
          item.uuid !== this.mainOrganization
      );
    },
    companies(): ApiResponse.GroupOrganization[] {
      return this.organizationsWithoutMain.filter(
        (item: ApiResponse.GroupOrganization) => item.layer === 0
      );
    },
    subOrganizations(): { name: string; value: string }[] {
      const filteredOrganizations = this.organizationsWithoutMain.filter(
        (item: ApiResponse.GroupOrganization) =>
          item.relations.company === this.selectedCompany
      );
      return filteredOrganizations.map(
        (organization: ApiResponse.GroupOrganization) => {
          return {
            name: organization.name,
            value: organization.uuid,
          };
        }
      );
    },
    selectedSubOrganizations(): ApiResponse.GroupOrganization[] {
      return this.organizationsWithoutMain.filter(
        (item: ApiResponse.GroupOrganization) => this.value.includes(item.uuid)
      );
    },
    companiesForBaseSelect(): { name: string; value: string }[] {
      const filteredOrganizations = this.organizationsWithoutMain.filter(
        (item: ApiResponse.GroupOrganization) => item.layer === 0
      );
      return filteredOrganizations.map(
        (organization: ApiResponse.GroupOrganization) => {
          return {
            name: organization.name,
            value: organization.uuid,
          };
        }
      );
    },
  },
  methods: {
    isFormFilled(): boolean {
      return this.selectedSubOrganization !== '';
    },
    addSubOrganization() {
      if (!this.isFormFilled()) return;

      if (this.selectedSubOrganization === this.mainOrganization) {
        alert('メイン組織と同じ組織はサブ組織に追加できません');
        return;
      }

      if (this.value.includes(this.selectedSubOrganization)) {
        alert('既に追加済みのサブ組織は追加できません');
        return;
      }
      this.$emit('add', this.selectedSubOrganization);
    },
    getCompanyByUuid(uuid: string) {
      return (
        this.companies
          .filter(
            (company: ApiResponse.GroupOrganization) => company.uuid === uuid
          )
          .pop() ?? {}
      );
    },
    removeSubOrganization(organization: ApiResponse.GroupOrganization) {
      this.$emit('remove', organization.uuid);
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
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

.left {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.vertical {
  border-color: #e4e5ed;
  border-width: 0 1px 0 0;
  margin-left: 20px;
  margin-right: 20px;
}

.right {
  flex: 1;
}

.label {
  font-weight: bold;
}

.sub-label {
  font-size: 15px;
  color: $dark_blue;
  font-weight: 300;
  display: inline-block;
  width: 92px;
}

.form-item {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
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

.add-button-row {
  display: flex;
  justify-content: flex-end;
}

.add-button {
  width: 70px;

  &[disabled] {
    background: #f3f3f3;
    border-color: #e4e5ed;
    color: #bebebe;
  }
}

.list-box {
  width: 324px;
  height: 140px;
  box-sizing: border-box;
  overflow-y: scroll;
  border: 1px solid $light_gray_blue_3;
  border-radius: 10px;
  padding: 14px 17px;
  scrollbar-width: thin;
  scrollbar-color: #7e8195 white;
}

.list-box::-webkit-scrollbar {
  width: 4px;
  height: 0;
}

.list-box::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #7e8195;
}

.list-title {
  font-weight: bold;
}

.list-item {
  font-weight: normal;
  position: relative;
  padding-right: 20px;
  line-height: 24px;

  .remove-button {
    position: absolute;
    top: 4px;
    right: 0;
    height: 16px;
    cursor: pointer;
  }
}

.note {
  margin-top: 10px;
  margin-left: 180px;
  margin-bottom: 30px;
  width: 100%;
  font-size: 13px;
}

.select-box {
  width: 200px;
}
</style>
