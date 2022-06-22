<template>
  <div
    :ref="'card' + company.uuid"
    class="company"
    :class="{ closed: isClosed }"
  >
    <div class="box-header">
      <toggle-button
        v-model="company.status"
        class="switch-button"
        :name="'switch-button-' + company.uuid"
        size="small"
        :contents="[
          { label: '公開', value: 'public' },
          { label: '非公開', value: 'private' },
        ]"
        @change="() => togglePublishStatus(company)"
      />
      <label
        v-if="!isDetailRegistered(company)"
        class="detail-registration"
        @click="goToDetail(company)"
      >
        詳細未登録
      </label>
    </div>
    <img
      src="/icon/icon_setting_l@2x.png"
      class="company-icon-gear"
      @click="toggleCompanyEditModal"
    />
    <div class="company-name">
      <span @click="toggleUpdateCompanyModal">{{ company.name }}</span>
      <img
        v-if="
          flagShowHideChildren &&
            !displayChildren &&
            propCompany.parents.length > 0
        "
        class="button-display-children"
        src="/icon/icon_not_display_children.svg"
        @click="displayChildrenBox(company)"
      />
      <img
        v-if="
          flagShowHideChildren &&
            displayChildren &&
            propCompany.parents.length > 0
        "
        class="button-display-children"
        src="/icon/icon_display_children.svg"
        @click="displayChildrenBox(company)"
      />
    </div>
    <div class="company-arrow" @click="toggleClosed" />
    <update-company-modal
      v-if="updateCompanyModal"
      :offset-top="offsetTop"
      :offset-left="offsetLeft"
      :company="propCompany"
      @close="toggleUpdateCompanyModal"
      @click="updateCompany"
    />
    <company-edit-modal
      v-if="companyEditModal"
      :offset-top="offsetTop"
      :offset-left="offsetLeft"
      :company="propCompany"
      @close="toggleCompanyEditModal"
      @delete="toggleDeleteOrganizationModal"
      @goToDetail="goToDetail"
    />
    <check-update
      v-if="checkDuplicateModal"
      :update-button-text="updateCompanyNameButton"
      @close="toggleCheckDuplicateModal"
      @click="updateDuplicatedModalCompany"
    >
      その組織（BOX）名はすでに登録されています。登録しますか？
    </check-update>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ToggleButton } from '@/components/Admin/Modules/Button';
import { UpdateCompanyModal, CompanyEditModal } from '@/components/Admin/Pages';
import { CheckUpdate } from '@/components/Admin/Modules/Modal';

export default Vue.extend({
  components: {
    ToggleButton,
    UpdateCompanyModal,
    CompanyEditModal,
    CheckUpdate,
  },
  props: {
    propCompany: {
      type: Object as PropType<Types.GroupOrganization>,
      required: true,
    },
    otherOrganizationNames: {
      type: Array,
      default: () => [],
    },
    flagShowHideChildren: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      company: {} as Types.GroupOrganization,
      offsetTop: 0 as number,
      offsetLeft: 0 as number,
      updateCompanyModal: false as boolean,
      companyEditModal: false as boolean,
      checkDuplicateModal: false as boolean,
      duplicateModalCompany: {} as Types.GroupOrganization,
      isClosed: false as boolean,
      updateCompanyNameButton: '登録する' as string,
      displayChildren: false as boolean,
    };
  },
  computed: {},
  watch: {
    propCompany: {
      handler(value: Types.GroupOrganization) {
        this.company = value;
      },
      deep: true,
    },
  },
  created() {
    this.company = this.propCompany;
  },
  methods: {
    setOffset(element: HTMLInputElement) {
      this.offsetTop = element.getBoundingClientRect().top;
      this.offsetLeft = element.getBoundingClientRect().left;

      // 画面幅が狭いときにModalを画面の内側に表示するためのコード
      if (window.innerWidth <= 1370) {
        this.offsetLeft -= 235;
      }
    },
    isDetailRegistered(organization: Types.GroupOrganization) {
      return (
        organization.name !== '会社名' &&
        organization.kana !== 'かいしゃめい' &&
        organization.detail.tel &&
        organization.detail.establish_date
      );
    },
    togglePublishStatus(organization: Types.GroupOrganization) {
      this.$emit('togglePublishStatus', organization);
    },
    goToDetail(organization: Types.GroupOrganization) {
      this.$emit('goToDetail', organization);
    },
    toggleCompanyEditModal() {
      if (!this.companyEditModal) {
        this.setOffset(this.$refs[`card${this.company.uuid}`]);
      }
      this.companyEditModal = !this.companyEditModal;
    },
    toggleDeleteOrganizationModal(company: Types.GroupOrganization) {
      this.toggleCompanyEditModal();
      this.$emit('toggleDeleteOrganizationModal', company);
    },
    toggleUpdateCompanyModal() {
      if (!this.updateCompanyModal) {
        this.setOffset(this.$refs[`card${this.company.uuid}`]);
      }
      this.updateCompanyModal = !this.updateCompanyModal;
    },
    toggleClosed() {
      this.isClosed = !this.isClosed;
    },
    toggleCheckDuplicateModal() {
      this.checkDuplicateModal = !this.checkDuplicateModal;
    },
    updateCompany(company: Types.GroupOrganization) {
      if (this.otherOrganizationNames.includes(company.name)) {
        this.duplicateModalCompany = company;
        this.toggleCheckDuplicateModal();
      } else {
        this.toggleUpdateCompanyModal();
        this.$emit('updateCompany', company);
      }
    },
    updateDuplicatedModalCompany() {
      this.toggleCheckDuplicateModal();
      this.toggleUpdateCompanyModal();
      this.$emit('updateCompany', this.duplicateModalCompany);
    },
    displayChildrenBox(comp: Types.GroupOrganization) {
      this.displayChildren = !this.displayChildren;
      this.$emit('updateDisplayChildCompany', {
        company: comp,
        checked: this.displayChildren,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.box {
  &-header {
    position: absolute;
    top: 5px;
    left: 5px;
  }
}

.company {
  border: none;
  font-weight: bold;
  text-align: center;
  background-color: #f8f8f8;
  border-radius: 4px;
  height: 80px;
  position: relative;

  &-name {
    font-size: 18px;
    text-decoration: underline;
    cursor: pointer;
    position: absolute;
    top: 34px;
    left: 0;
    right: 0;
  }

  &-icon-gear {
    width: 18px;
    height: 18px;
    object-fit: cover;
    margin-bottom: 15px;
    cursor: pointer;
    position: absolute;
    top: 6px;
    right: 6px;

    &:hover {
      opacity: 50%;
    }
  }

  &-arrow {
    width: 16px;
    height: 16px;
    background-color: $true_white;
    border: 1px solid $light_gray_blue_3;
    border-radius: 8px;
    background-image: url('/icon/icon_switching.svg');
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    margin: auto;

    .closed & {
      background-image: url('/icon/icon_switching-down.svg');
    }
  }
}

.switch-button {
  display: inline-flex;
}

.detail-registration {
  color: $true_white;
  font-size: 11px;
  padding: 4px 7px;
  background: #f09c9c;
  border-radius: 15px;
  font-weight: bold;
  cursor: pointer;
}

.button-display-children {
  margin-right: -220px;
  margin-left: 56px;
  position: inherit;
  margin-top: -3px;
}
</style>
