<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <p class="title">サブ組織を設定</p>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div class="modal-contents">
          <p class="description">
            メイン以外に所属している組織、もしくは関わっている組織を登録出来ます。
          </p>
          <scrollable-tabs
            class="tabs"
            :companies="[...Object.values(companies)]"
            :current-id="defaultOrganization.uuid"
            :company-count-threshold="3"
            @change-tab="organizationsTabChange($event)"
          />
          <div class="organizations">
            <div :key="`second-${defaultOrganization.uuid}`" class="parents">
              <template
                v-for="parent in parentsByCompanyUuid(defaultOrganization.uuid)"
              >
                <label
                  :key="parent.uuid"
                  class="label"
                  :class="{
                    disabled: isDisabled(parent.uuid),
                  }"
                >
                  <base-checkbox v-model="checked" :value="parent.uuid" />
                  {{ parent.name }}
                </label>
                <div :key="`second-${parent.uuid}`" class="children">
                  <label
                    v-for="child in childrenByParentUuid(parent.uuid)"
                    :key="child.uuid"
                    class="label"
                    :class="{
                      disabled: isDisabled(child.uuid),
                    }"
                  >
                    <base-checkbox v-model="checked" :value="child.uuid" />
                    <span class="ruby">{{ parent.name }}</span
                    >{{ child.name }}
                  </label>
                </div>
              </template>
            </div>
          </div>
          <p class="select-items-title">選択したサブ組織（BOX）</p>
          <div class="select-items">
            <span v-for="value in checked" :key="value" class="select-item">
              {{ companyNameByChild(value) }}
              {{ organizationByUuid(value).name }}
              <a role="button" @click="deleteOrganization(value)">
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
          <div class="button-box">
            <base-button size="large" type="button" @click="update"
              >保存する</base-button
            >
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import ScrollableTabs from '@/components/Admin/Pages/EmployeeManagement/UpdateSubOrganizationScrollableTabs.vue';

export default Vue.extend({
  components: { BaseButton, BaseCheckbox, ScrollableTabs },
  props: {
    organizations: {
      type: Array as PropType<Types.GroupOrganization[]>,
      required: true,
    },
    selectedMember: {
      type: Object as PropType<ApiResponse.User>,
      required: true,
    },
  },
  data() {
    return {
      checked: [] as string[],
      defaultOrganization: {} as object,
    };
  },
  computed: {
    organizationByUuid() {
      return (uuid: string) => {
        return this.organizations.find((o: Types.GroupOrganization) => {
          return o.uuid === uuid;
        });
      };
    },
    companies() {
      return this.organizations.filter((o: Types.GroupOrganization) => {
        return o.layer === 0;
      });
    },
    parentsByCompanyUuid() {
      return (companyUuid: string) => {
        return this.organizations.filter((o: Types.GroupOrganization) => {
          return o.layer === 1 && o.relations.company === companyUuid;
        });
      };
    },
    childrenByParentUuid() {
      return (parentUuid: string) => {
        return this.organizations.filter((o: Types.GroupOrganization) => {
          return o.layer === 2 && o.relations.parent === parentUuid;
        });
      };
    },
    companyNameByChild() {
      return (childUuid: string) => {
        if (!childUuid) {
          return '';
        }
        if (
          this.companies.filter(
            (c: Types.GroupOrganization) => c.uuid === childUuid
          ).length
        ) {
          return '';
        }
        const companyUuid = this.organizations.find(
          (o: Types.GroupOrganization) => {
            return o.uuid === childUuid;
          }
        ).relations.company;
        const organizationName = this.organizations
          .find((o: Types.GroupOrganization) => {
            return o.uuid === companyUuid;
          })
          .name.concat('｜');
        return organizationName;
      };
    },
  },
  created() {
    this.checked = this.selectedMember.sub_organizations ?? [];
    if (this.checked && this.checked.length > 0) {
      const companyID = this.organizations.find(
        (o: Types.GroupOrganization) => {
          return o.uuid === this.checked[0];
        }
      ).relations.company;
      this.defaultOrganization = this.organizations.find(
        (o: Types.GroupOrganization) => {
          return o.uuid === companyID;
        }
      );
    } else {
      const masterOrganization = this.organizations.filter(
        (o: Types.GroupOrganization) => {
          return o.layer === 0;
        }
      );
      this.defaultOrganization =
        masterOrganization[Object.keys(masterOrganization)[0]];
    }
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    organizationsTabChange(organizationUuid: string) {
      this.defaultOrganization = this.organizations.find(
        (o: Types.GroupOrganization) => {
          return o.uuid === organizationUuid;
        }
      );
    },
    update() {
      const data: ApiResponse.User = {
        ...this.selectedMember,
        sub_organizations: this.checked,
      };
      this.$emit('update', data);
      this.checked = [];
      this.$emit('close');
    },
    deleteOrganization(organizationUuid: string) {
      this.checked = this.checked.filter(
        (uuid: string) => uuid !== organizationUuid
      );
    },
    isDisabled(uuid: string) {
      return uuid === this.selectedMember.organization_uuid;
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
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(126, 129, 149, 0.8);
}

.modal-window {
  display: flex;
  flex-direction: column;
  width: 634px;
  background: $true_white;
  border-radius: 6px;
  padding: 18px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.description {
  font-size: 13px;
  padding-bottom: 18px;
}

.title {
  font-size: 15px;
  font-weight: bold;
}

.icon-cross {
  cursor: pointer;
}

.modal-contents {
  display: flex;
  flex-direction: column;
  padding-top: 18px;
}

.organizations {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 100%;
  height: 250px;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  padding: 20px;
}

.label {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 21px;
  padding-top: 16px;
  line-height: 1;
  cursor: pointer;

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.parents {
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;
}

.children {
  display: flex;
  flex-direction: column;
}

.ruby {
  color: $gray_blue_1;
  font-size: 11px;
  height: 100%;
  margin-right: 4px;
}

.select-items {
  margin-top: 10px;
  background-color: $white_1;
  word-break: keep-all;
  padding: 18px 15px;
  border-radius: 4px;
  height: 90px;
  overflow: scroll;
}

.select-item {
  color: $gray_blue_4;
  margin-right: 23px;
}

.delete-button {
  padding-top: 3px;
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

.button-box {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  button {
    width: 200px;
  }
}

.checkbox-wrapper {
  margin-right: 10px;
}

.select-items-title {
  font-size: 15px;
  font-weight: bold;
  margin-top: 20px;
}
</style>
