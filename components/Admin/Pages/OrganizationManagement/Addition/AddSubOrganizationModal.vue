<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <p class="title">会社、部署・支店・店舗を追加</p>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div class="modal-contents">
          <div class="organizations">
            <div class="companies">
              <template v-for="company in companies">
                <div :key="company.uuid" class="company">
                  <label
                    class="label label-company"
                    @click="toggleCompanyTab(company.uuid)"
                  >
                    <base-checkbox
                      v-model="checked"
                      :value="company.uuid"
                      :disabled="disabledCheckBox(company.uuid)"
                      @change="companyChange(company.uuid)"
                    />{{ company.name
                    }}<button
                      v-if="parentsByCompanyUuid(company.uuid).length"
                      class="tab-button"
                    >
                      <svg
                        :class="showCompanyTab(company.uuid) ? '' : 'closed'"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <g
                          transform="translate(24 24) rotate(180)"
                          fill="#fff"
                          stroke="#e4e5ed"
                          stroke-width="1"
                        >
                          <rect width="24" height="24" rx="4" stroke="none" />
                          <rect
                            x="0.5"
                            y="0.5"
                            width="23"
                            height="23"
                            rx="3.5"
                            fill="none"
                          />
                        </g>
                        <g transform="translate(10 14) rotate(-90)">
                          <path
                            d="M673.472,750.512l3-2-3-2"
                            transform="translate(-673.472 -746.512)"
                            fill="none"
                            stroke="#f09c9c"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                          />
                        </g>
                      </svg>
                    </button>
                  </label>
                  <div
                    v-if="showCompanyTab(company.uuid)"
                    :key="`second-${company.uuid}`"
                    class="parents"
                  >
                    <template
                      v-for="parent in parentsByCompanyUuid(company.uuid)"
                    >
                      <label :key="parent.uuid" class="label">
                        <base-checkbox
                          v-model="checked"
                          :value="parent.uuid"
                          :disabled="disabledCheckBox(parent.uuid)"
                          @change="parentChange(company.uuid, parent.uuid)"
                        />
                        {{ parent.name }}
                      </label>
                      <div :key="`second-${parent.uuid}`" class="children">
                        <label
                          v-for="child in childrenByParentUuid(parent.uuid)"
                          :key="child.uuid"
                          class="label"
                        >
                          <base-checkbox
                            v-model="checked"
                            :value="child.uuid"
                            :disabled="disabledCheckBox(child.uuid)"
                            @change="
                              childChange(company.uuid, parent.uuid, child.uuid)
                            "
                          /><span class="ruby">{{ parent.name }}</span
                          >{{ child.name }}
                        </label>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <p class="select-items-title">選択したサブ組織（BOX）</p>
          <div class="select-items">
            <span v-for="value in checked" :key="value" class="select-item"
              >{{ organizationByUuid(value).name }}
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
            <base-button size="large" type="button" @click="add"
              >追加する</base-button
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

export default Vue.extend({
  components: { BaseButton, BaseCheckbox },
  props: {
    organizations: {
      type: Array as PropType<Types.GroupOrganization[]>,
      required: true,
    },
    selectedMember: {
      type: Object as PropType<ApiResponse.TempUser>,
      required: true,
    },
  },
  data() {
    return {
      oldChecked: [] as string[],
      checked: [] as string[],
      companyTab: [] as string[],
      parentTab: [] as string[],
    };
  },
  computed: {
    disabledCheckBox() {
      return (uuid: string) => {
        return this.oldChecked.some((o: string) => o === uuid);
      };
    },
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
    showCompanyTab() {
      return (companyUuid: any) => {
        return this.companyTab.some((c: string) => c === companyUuid);
      };
    },
    showParentTab() {
      return (parentUuid: string) => {
        return this.parentTab.some((p: string) => p === parentUuid);
      };
    },
  },
  created() {
    this.checked = this.selectedMember.sub_organizations.map(
      (item: { name: string; uuid: string }) => item.uuid
    );
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    companyChange(companyUuid: string) {
      const toCheck = this.checked.some((c: string) => {
        return c === companyUuid;
      });
      this.interlockingCheck(companyUuid, toCheck);
    },
    parentChange(companyUuid: string, parentUuid: string) {
      const toCheck = this.checked.some((c: string) => {
        return c === parentUuid;
      });
      this.interlockingCheck(parentUuid, toCheck);

      // 同じ階層の要素たち（自分も含む）
      const same: Types.GroupOrganization[] = this.organizations.filter(
        (o: Types.GroupOrganization) => {
          return o.relations.company === companyUuid;
        }
      );
      // 会社が既にチェックされているか
      const companyChecked = this.checked.some(
        (ch: string) => ch === companyUuid
      );
      // チェックをする（すべて含まれる場合のみtrue）
      const include: boolean = this.includedInChecked(same);
      if (toCheck) {
        if (include && !companyChecked) {
          // 親が全てチェックされるかつ会社がまだチェックされていなかったらチェックする
          this.checked.push(companyUuid);
        }
      } else if (!include && companyChecked) {
        // 親が1つでもチェックが外れているかつ会社がすでにチェックされていたらチェックを外す
        this.checked = this.checked.filter((ch: string) => {
          return !(ch === companyUuid);
        });
      }
    },
    childChange(companyUuid: string, parentUuid: string, childUuid: string) {
      const toCheck = this.checked.some((ch: string) => {
        return ch === childUuid;
      });
      // 同じ階層の要素たち（自身も含む）
      const same: Types.GroupOrganization[] = this.organizations.filter(
        (o: Types.GroupOrganization) => {
          return o.relations.parent === parentUuid;
        }
      );
      // 同じ階層の要素たち（自身も含む）
      const sameParent: Types.GroupOrganization[] = this.organizations.filter(
        (o: Types.GroupOrganization) => {
          return o.relations.company === companyUuid;
        }
      );
      // 会社が既にチェックされているか
      const companyChecked = this.checked.some(
        (ch: string) => ch === companyUuid
      );
      // 親が既にチェックされているか
      const parentChecked = this.checked.some(
        (ch: string) => ch === parentUuid
      );
      // チェックをする（すべて含まれる場合のみtrue）
      const include = this.includedInChecked(same);

      if (toCheck) {
        if (include && !parentChecked) {
          // 子が全てチェックされるかつ親がまだチェックされていなかったらチェックする
          this.checked.push(parentUuid);
          // チェックをする（すべて含まれる場合のみtrue）
          const doubleInclude = this.includedInChecked(sameParent);
          if (doubleInclude && !companyChecked) {
            // 親が全てチェックされるかつ会社がまだチェックされていなかったらチェックする
            this.checked.push(companyUuid);
          }
        }
      } else if (!include && parentChecked) {
        // 子が1つでもチェックが外れているかつ親がすでにチェックされていたらチェックを外す
        this.checked = this.checked.filter((ch: string) => {
          return !(ch === parentUuid);
        });
        // チェックをする（すべて含まれる場合のみtrue）
        const doubleInclude = this.includedInChecked(sameParent);
        if (!doubleInclude && companyChecked) {
          // 親が1つでもチェックが外れているかつ会社がすでにチェックされていたらチェックを外す
          this.checked = this.checked.filter((ch: string) => {
            return !(ch === companyUuid);
          });
        }
      }
    },
    includedInChecked(sameOrganizations: Types.GroupOrganization[]) {
      return sameOrganizations.every((s: Types.GroupOrganization) => {
        return this.checked.some((c: string) => {
          return c === s.uuid;
        });
      });
    },
    interlockingCheck(uuid: string, toCheck: boolean) {
      const organizationUuids: string[] = this.organizations
        .filter((o: Types.GroupOrganization) => {
          return (
            o.uuid === uuid ||
            o.relations.company === uuid ||
            o.relations.parent === uuid
          );
        })
        .map((o: Types.GroupOrganization) => o.uuid);
      if (toCheck) {
        Array.prototype.push.apply(this.checked, organizationUuids);
        this.checked = Array.from(new Set(this.checked));
      } else {
        this.checked = this.checked.filter((ch: string) => {
          return !organizationUuids.some((u: string) => {
            return u === ch;
          });
        });
      }
    },
    toggleCompanyTab(companyUuid: string) {
      const exist = this.companyTab.some((t: string) => t === companyUuid);
      if (exist) {
        this.companyTab = this.companyTab.filter(
          (t: string) => !(t === companyUuid)
        );
      } else {
        this.companyTab.push(companyUuid);
      }
    },
    toggleParentTab(parentUuid: string) {
      const exist = this.parentTab.some((p: string) => p === parentUuid);
      if (exist) {
        this.parentTab = this.parentTab.filter((p: string) => p !== parentUuid);
      } else {
        this.parentTab.push(parentUuid);
      }
    },
    add() {
      const data: ApiRequest.TempRegistrationUsers = {
        ...this.selectedMember,
        sub_organizations: [...this.checked],
      };
      this.$emit('add', data);
      this.checked = [];
      this.$emit('close');
    },
    deleteOrganization(uuid: string) {
      // 削除する組織
      const organization:
        | Types.GroupOrganization
        | undefined = this.organizations.find((o: Types.GroupOrganization) => {
        return o.uuid === uuid;
      });
      if (organization === undefined) return;
      // 会社が既にチェックされているか
      const companyChecked = this.checked.some(
        (ch: string) => ch === organization.relations.company
      );
      // 親が既にチェックされているか
      const parentChecked = this.checked.some(
        (ch: string) => ch === organization.relations.parent
      );
      // 会社を削除
      if (organization.layer === 0) {
        // 削除対象
        const targetOrganizations: Types.GroupOrganization[] = this.organizations.filter(
          (o: Types.GroupOrganization) => {
            return o.uuid === uuid || o.relations.company === uuid;
          }
        );
        // 削除
        this.checked = this.checked.filter((ch: string) => {
          return !targetOrganizations.some(
            (t: Types.GroupOrganization) => t.uuid === ch
          );
        });
      }
      // 親要素を削除
      if (organization.layer === 1) {
        // 削除対象
        const targetOrganizations: Types.GroupOrganization[] = this.organizations.filter(
          (o: Types.GroupOrganization) => {
            return o.uuid === uuid || o.relations.parent === uuid;
          }
        );
        // 削除
        this.checked = this.checked.filter((ch: string) => {
          return !targetOrganizations.some(
            (t: Types.GroupOrganization) => t.uuid === ch
          );
        });
        // 同じ階層の要素たち
        const same = this.organizations.filter((o: Types.GroupOrganization) => {
          return o.relations.company === organization.relations.company;
        });
        const include = this.includedInChecked(same);
        // 親要素がすべてチェックが外れているかつ会社がチェックされていたらチェックを外す
        if (!include && companyChecked) {
          this.checked = this.checked.filter((ch: string) => {
            return !(ch === organization.relations.company);
          });
        }
      }
      // 子要素を削除
      if (organization.layer === 2) {
        // 削除対象
        const targetOrganizations: Types.GroupOrganization[] = this.organizations.filter(
          (o: Types.GroupOrganization) => {
            return o.uuid === uuid;
          }
        );
        // 削除
        this.checked = this.checked.filter((ch: string) => {
          return !targetOrganizations.some(
            (t: Types.GroupOrganization) => t.uuid === ch
          );
        });
        // 同じ階層の要素たち
        const same = this.organizations.filter((o: Types.GroupOrganization) => {
          return o.relations.parent === organization.relations.parent;
        });
        const include = this.includedInChecked(same);
        // 子要素がすべてチェックが外れているかつ親要素がチェックされていたらチェックを外す
        if (!include && parentChecked) {
          this.checked = this.checked.filter((ch: string) => {
            return !(ch === organization.relations.parent);
          });
          // 同じ階層の要素たち
          const sameParent: Types.GroupOrganization[] = this.organizations.filter(
            (o: Types.GroupOrganization) => {
              return o.relations.company === organization.relations.company;
            }
          );
          const doubleInclude = this.includedInChecked(sameParent);
          if (!doubleInclude && parentChecked) {
            this.checked = this.checked.filter((ch: string) => {
              return !(ch === organization.relations.company);
            });
          }
        }
      }
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
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(126, 129, 149, 0.8);
}

.modal-window {
  display: flex;
  flex-direction: column;
  width: 480px;
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
  height: 240px;
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
}

.label-company {
  height: 58px;
  padding-top: 0;
  cursor: pointer;
}

.companies {
  display: flex;
  flex-direction: column;
}

.company {
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  margin-bottom: 10px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.parents {
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;
  border-top: solid 1px $light_gray_blue_3;
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

.tab-button {
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  margin-left: auto;
}

.closed {
  transform: rotateZ(180deg);
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
