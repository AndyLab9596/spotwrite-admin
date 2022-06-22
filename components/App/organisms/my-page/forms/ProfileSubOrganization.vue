<template>
  <div>
    <div class="sub-organization-lable">
      <p class="form-label">サブ組織</p>
      <img
        class="icon-help"
        src="/icon/icon_help.png"
        @click="showModalHelpSubOrganization"
      />
    </div>
    <p class="form-sub-label">会社</p>
    <normal-select-box
      v-model="selectedCompanyUuid"
      placeholder="選択してください"
      name="select-box"
      large-font
      :display-pull-down="true"
      :items="companies"
      class="select-box"
      @change="changeCompany"
    />
    <p class="form-sub-label">部署・支店・店舗</p>
    <button class="dummy-select" @click="switchProfileDivisionsModal">
      選択してください
    </button>
    <div class="divisions">
      <div
        v-for="division in selectedDivisions"
        :key="division.uuid"
        class="division"
      >
        <div class="division-text">
          <span v-if="division.layer === 2" class="parent-division-name">{{
            parentDivisionName(division)
          }}</span>
          <span class="division-name">{{ division.name }}</span>
        </div>
        <img
          src="/app/icon/Icon-delete.svg"
          alt=""
          class="delete-icon"
          @click="deleteDivision(division.uuid)"
        />
      </div>
    </div>
    <profile-divisions-modal
      v-if="profileDivisionsModal"
      :divisions="divisions"
      :selected-divisions-uuids="selectedDivisionUuids"
      @clickDivision="clickDivision"
      @onClose="switchProfileDivisionsModal"
    />
    <help-sub-organization-modal
      v-if="helpSubOrgModal"
      @close="closeMoldalHelpSubOrganization"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import NormalSelectBox from '../../../atoms/selectBox/NormalSelectBox.vue';
import ProfileDivisionsModal from '../ProfileDivisionsModal.vue';
import HelpSubOrganizationModal from '../HelpSubOrganizationModal.vue';

type Organization = {
  value: string;
  name: string;
};

export default Vue.extend({
  components: {
    ProfileDivisionsModal,
    NormalSelectBox,
    HelpSubOrganizationModal,
  },
  props: {
    organizations: {
      type: Array as PropType<ApiResponse.Organization[]>,
      required: true,
    },
    mainOrganization: {
      type: Object as PropType<ApiResponse.Organization>,
      default: null,
    },
    selectedDivisionUuids: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  data() {
    return {
      selectedCompanyUuid: '' as string,
      profileDivisionsModal: false as boolean,
      helpSubOrgModal: false as boolean,
    };
  },
  computed: {
    companies(): Organization[] {
      return this.organizations
        .filter((item: ApiResponse.Organization) => item.layer === 0)
        .map((item: ApiResponse.Organization) => {
          return { value: item.uuid, name: item.name };
        });
    },
    divisions(): ApiResponse.Organization[] {
      return this.organizations.filter(
        (item: ApiResponse.Organization) =>
          item.relations?.company === this.selectedCompanyUuid &&
          item.uuid !== this.mainOrganization?.uuid
      );
    },
    selectedDivisions(): ApiResponse.Organization[] {
      return this.organizations.filter((o: ApiResponse.Organization) =>
        this.selectedDivisionUuids.includes(o.uuid)
      );
    },
    parentDivisionName() {
      return (division: ApiResponse.Organization) => {
        if (!division?.relations.parent) return;
        // @ts-ignore
        const parrent = this.organizations.find(
          (o: ApiResponse.Organization) => o.uuid === division.relations.parent
        );
        // @ts-ignore
        return parrent ? parrent.name : '';
      };
    },
  },
  methods: {
    switchProfileDivisionsModal() {
      this.profileDivisionsModal = !this.profileDivisionsModal;
    },
    changeCompany(value: string) {
      this.selectedCompanyUuid = value;
    },
    clickDivision(uuid: string) {
      this.$emit('clickDivision', uuid);
    },
    deleteDivision(uuid: string) {
      this.$emit('deleteDivision', uuid);
    },
    showModalHelpSubOrganization() {
      this.helpSubOrgModal = true;
    },
    closeMoldalHelpSubOrganization() {
      this.helpSubOrgModal = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.select-box {
  margin: 0 0 24px 0;

  &:last-of-type {
    margin: 0;
  }
}

.form-label {
  font-size: 15px;
  line-height: 1em;
  font-weight: 600;
  color: $main_color;
  margin: 0 0 16px 0;
}

.form-sub-label {
  font-size: 15px;
  line-height: 1em;
  font-weight: 300;
  color: $sub_color;
  margin: 0 0 8px 0;
}

.dummy-select {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 8px 0 0;
  width: 100%;
  height: 40px;
  font-size: 15px;
  color: $gentle_bluish_purple;
  background-color: $extra_light_gray;
  outline: none;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  padding-left: 12px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('/app/icon/Icon-pulldown.svg');
  background-repeat: no-repeat;
  background-size: 10px 8px;
  background-position: center right 10px;
  cursor: pointer;
}

.divisions {
  display: flex;
  flex-wrap: wrap;
  margin: 16px 0 6px 0;
}

.division {
  display: flex;
  align-items: center;
  font-size: 15px;
  color: $gray_blue_6;
  line-height: 1em;
  border: 1px solid $job_type_border;
  height: 44px;
  padding: 0 9px;
  border-radius: 4px;
  margin: 0 8px 10px 0;
}

.division-text {
  display: flex;
  flex-direction: column;
}

.parent-division-name {
  font-size: 11px;
}

.division-name {
  font-size: 13px;
}

.delete-icon {
  width: 16px;
  margin: 0 0 0 8px;
  cursor: pointer;
}

.sub-organization-lable {
  display: flex;

  .icon-help {
    width: 16px;
    height: 16px;
    margin-left: 22px;
    cursor: pointer;
  }
}
</style>
