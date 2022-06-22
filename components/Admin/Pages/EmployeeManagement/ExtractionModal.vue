<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <h3 class="modal-header-title">組織（BOX）で絞り込む</h3>
          <base-checkbox
            v-model="isAllChecked"
            label="チェックを外す"
            :disabled="selectedValues.length === 0"
            @change="toggleAllCheck"
          />
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div class="modal-content">
          <scrollable-small-tabs
            class="base-tabs"
            :companies="companyOfMyOrganizations"
            :current-id="currentCompanyUuid"
            :company-count-threshold="3"
            @change-tab="changeCompanyTab($event)"
          />
          <div class="choices choices__radiobox">
            <p
              v-for="(organization, index) in selectedCompanyOrganizations"
              :key="`filter${index}`"
            >
              <template v-if="childOrganizations(organization.uuid)">
                <label class="organization-name">
                  <base-checkbox
                    :selected-values="selectedValues"
                    :value="organization.uuid"
                    class="checkbox"
                    @change="changeSelectedValues"
                  />
                  <p class="parent-name">
                    {{ parentOrganizationName(organization.uuid) }}
                  </p>
                  <p class="checkbox-label">{{ organization.name }}</p>
                </label>
              </template>
              <base-checkbox
                v-else
                :selected-values="selectedValues"
                :value="organization.uuid"
                :label="organization.name"
                @change="changeSelectedValues"
              />
            </p>
          </div>
          <h3 class="select-items-title">選択した組織（BOX）</h3>
          <div class="select-items">
            <span
              v-for="value in selectedValues"
              :key="value"
              class="select-item"
            >
              {{ companyName(value) + ' | ' + organizationName(value) }}
              <a
                role="button"
                class="delete-item"
                @click="deleteOrganization(value)"
              >
                <svg
                  class="delete-button"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <circle
                    id="Ellipse_215"
                    data-name="Ellipse 215"
                    cx="8"
                    cy="8"
                    r="8"
                    fill="#7e8195"
                  />
                  <g
                    id="Group_1338"
                    data-name="Group 1338"
                    transform="translate(5 5)"
                  >
                    <line
                      id="Line_356"
                      data-name="Line 356"
                      x2="6"
                      y2="6"
                      fill="none"
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-miterlimit="10"
                      stroke-width="1.114"
                    />
                    <line
                      id="Line_357"
                      data-name="Line 357"
                      x1="6"
                      y2="6"
                      fill="none"
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-miterlimit="10"
                      stroke-width="1.114"
                    />
                  </g>
                </svg>
              </a>
            </span>
          </div>
          <div class="button-area">
            <button class="button" @click="extract">絞り込む</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import ScrollableSmallTabs from '@/components/Admin/Modules/Tab/ScrollableSmallTabs.vue';

type TabMenu = {
  name: string;
  uuid: string;
};

export default Vue.extend({
  components: {
    BaseCheckbox,
    ScrollableSmallTabs,
  },
  props: {
    organizations: {
      type: Array as PropType<Types.GroupOrganization[]>,
      required: true,
    },
    selectedOrganizations: {
      type: Array as PropType<Types.GroupOrganization[]>,
      required: true,
    },
  },
  data() {
    return {
      selectedValues: [] as string[],
      isAllChecked: [] as string[],
      companyOfMyOrganizations: [] as TabMenu[],
      currentCompanyUuid: '' as string,
      organizationsExceptCompany: [] as Types.GroupOrganization[],
    };
  },
  computed: {
    selectedCompanyOrganizations(): ApiResponse.Organization[] {
      return this.organizations.filter(
        (organization: Types.GroupOrganization) =>
          organization.layer !== 0 &&
          organization.relations.company === this.currentCompanyUuid &&
          organization.type !== null &&
          organization.name
      );
    },
  },
  created() {
    this.companyOfMyOrganizations = this.organizations
      .filter((o: Types.GroupOrganization) => {
        return (
          o.layer === 0 && this.getOrganizationsByCompanyUuid(o.uuid).length > 0
        );
      })
      .map((item: ApiResponse.Organization) => ({
        uuid: item.uuid,
        name: item.name,
      }));
    this.currentCompanyUuid = this.companyOfMyOrganizations[0].uuid;

    this.organizationsExceptCompany = this.organizations.filter(
      (o: Types.GroupOrganization) => {
        return o.layer !== 0;
      }
    );

    this.selectedValues = this.selectedOrganizations
      .filter((o: Types.GroupOrganization) => {
        return o.layer !== 0;
      })
      .map((o: ApiResponse.GroupOrganization) => {
        return o.uuid;
      });

    if (this.selectedValues.length === 0) {
      this.isAllChecked = ['default'];
    }
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    extract() {
      this.$emit('extract', this.selectedValues);
      this.onClose();
    },
    changeSelectedValues(updateValues: string[]) {
      this.selectedValues = updateValues;
      this.isAllChecked = [];
      const company = this.organizations.filter(
        (item: Types.GroupOrganization) => item.layer === 0
      );
      const organization = this.organizations.filter(
        (item: Types.GroupOrganization) => item.layer !== 0
      );

      if (this.selectedValues.length - company.length === organization.length) {
        this.isAllChecked = ['default'];
      }
    },
    toggleAllCheck(arr: string[]) {
      this.selectedValues =
        arr.length === 0
          ? this.organizationsExceptCompany.map(
              (item: Types.GroupOrganization) => item.uuid
            )
          : (this.selectedValues = []);
    },
    childOrganizations(uuid: string): boolean {
      const childrens = this.organizations.filter(
        (item: Types.GroupOrganization) => item.layer === 2
      );
      const children = childrens.find(
        (item: Types.GroupOrganization) => item.uuid === uuid
      );
      return children != null;
    },
    parentOrganizationName(uuid: string): string {
      const childrens = this.organizations.filter(
        (item: Types.GroupOrganization) => item.layer === 2
      );
      const children = childrens.find(
        (item: Types.GroupOrganization) => item.uuid === uuid
      );
      if (children != null && children.relations.parent) {
        const parent = this.organizations.find(
          (item: Types.GroupOrganization) =>
            item.uuid === children.relations.parent
        );

        if (parent != null) {
          return parent.name;
        }
      }
      return '';
    },
    organizationName(uuid: string): string {
      return this.organizations.find((o: Types.GroupOrganization) => {
        return o.uuid === uuid;
      }).name;
    },
    companyName(uuid: string): string {
      const companyUuid = this.organizations.find(
        (o: Types.GroupOrganization) => {
          return o.uuid === uuid;
        }
      ).relations.company;
      return this.companyOfMyOrganizations.find((c: TabMenu) => {
        return c.uuid === companyUuid;
      }).name;
    },
    changeCompanyTab(uuid: string) {
      this.currentCompanyUuid = uuid;
    },
    deleteOrganization(uuid: string) {
      this.selectedValues = this.selectedValues.filter((v: string) => {
        return v !== uuid;
      });
    },
    getOrganizationsByCompanyUuid(
      company: string
    ): ApiResponse.GroupOrganization[] {
      return this.organizations.filter(
        (organization: ApiResponse.GroupOrganization) =>
          organization.layer !== 0 &&
          organization.relations.company === company &&
          organization.name &&
          organization.type
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
}

.modal-window {
  display: flex;
  flex-direction: column;
  width: 634px;
  height: auto;
  background: $true_white;
  padding: 20px 30px;
  border: none;
  box-shadow: 0 0 3px #b8c7d8;
  border-radius: 4px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  margin-bottom: 25px;
  position: relative;

  img {
    object-fit: contain;
  }
}

.modal-header-title {
  margin-right: 30px;
  line-height: 1;
}

.icon-cross {
  position: absolute;
  top: -4px;
  right: -14px;
  cursor: pointer;
}

// オーバーレイのトランジション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  // オーバーレイに包含されているモーダルウィンドウのトランジション
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

// ディレイを付けるとモーダルウィンドウが消えた後にオーバーレイが消える
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.modal-enter {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.modal-content {
  font-size: 15px;
  color: #2e303e;
}

.choices {
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid #e4e5ed;
  border-radius: 4px;

  &__radiobox {
    height: 250px;
    border-radius: 0 0 4px 4px;
    padding: 10px 21px;
    line-height: 30px;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: #7e8195 white;
  }

  &__radiobox::-webkit-scrollbar {
    width: 4px;
    height: 0;
  }

  &__radiobox::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #7e8195;
  }
}

.check-box {
  & /deep/ .checkbox-text {
    font-size: 15px;
    margin-left: 5px;
  }
}

.button-area {
  text-align: center;
}

.button {
  background-color: $gray_blue_3;
  border-radius: 4px;
  color: $true_white;
  font-weight: bold;
  border: none;
  width: 200px;
  height: 40px;

  &:hover {
    background-color: $gray_blue_4;
  }
}

.checkbox {
  margin: 0 6px 0 0;
}

.organization-name {
  display: flex;
  align-items: center;
}

.parent-name {
  font-size: 11px;
  color: #9c9da5;
  font-weight: 300;
  margin: 0 3px 0 0;
}

.checkbox-label {
  font-size: 13px;
  cursor: pointer;
  color: $dark_blue;
}

.base-tabs {
  margin-bottom: 16px;
}

.select-items {
  height: 90px;
  overflow: auto;
  margin: 10px 0 20px;
  background-color: $white_1;
  word-break: keep-all;
  padding: 18px 15px;
  border-radius: 4px;
  scrollbar-width: thin;
  scrollbar-color: #7e8195 white;
}

.select-items::-webkit-scrollbar {
  width: 4px;
  height: 0;
}

.select-items::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #7e8195;
}

.select-items-title {
  font-weight: bold;
  font-size: 13px;
}

.select-item {
  color: $gray_blue_4;
  margin-right: 16px;
  font-size: 13px;
}

.delete-button {
  padding-top: 3px;
}

.delete-item {
  cursor: pointer;
}
</style>
