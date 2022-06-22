<template>
  <div v-if="organizations.length > 1" class="organization-table-container">
    <div class="table-row">
      <div class="table-item table-title table-center">
        <base-checkbox
          class="checkbox"
          :checked="allSelected"
          @change="toggleAllSelect"
        />
      </div>
      <div class="table-item table-title">BOX名</div>
      <div class="table-item table-title">人数</div>
      <div class="table-item table-title">グループ</div>
    </div>
    <template v-for="company in companies">
      <div
        v-if="all"
        :key="company.uuid"
        class="table-row"
        :class="{ company: company.type === 'company' }"
      >
        <div class="table-item table-center">
          <base-checkbox
            v-model="checked"
            class="checkbox"
            :value="company.uuid"
            @change="companyChange(company.uuid)"
          />
        </div>
        <div class="table-item company-name">
          {{ company.name }}
        </div>
        <div class="table-item table-center user-count">
          {{ company.user_count }}名
        </div>
        <div class="table-item">
          <div class="table-group-contents">
            <span
              v-for="group in company.groups"
              :key="group.uuid"
              class="table-group-contents-item"
              >・{{ group.name }}</span
            >
          </div>
          <div class="table-group-buttons">
            <a role="button" @click="addGroup(company, $event)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <circle
                  id="Ellipse_216"
                  data-name="Ellipse 216"
                  cx="8"
                  cy="8"
                  r="8"
                  fill="#f09c9c"
                />
                <g
                  id="Group_1350"
                  data-name="Group 1350"
                  transform="translate(5 5)"
                >
                  <line
                    id="Line_373"
                    data-name="Line 373"
                    y2="6"
                    transform="translate(3)"
                    fill="#fff"
                    stroke="#fff"
                    stroke-linecap="round"
                    stroke-miterlimit="10"
                    stroke-width="1"
                  />
                  <line
                    id="Line_374"
                    data-name="Line 374"
                    x2="6"
                    transform="translate(0 3)"
                    fill="#fff"
                    stroke="#fff"
                    stroke-linecap="round"
                    stroke-miterlimit="10"
                    stroke-width="1"
                  />
                </g>
              </svg>
            </a>
            <a role="button" @click="deleteGroup(company)">
              <svg
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
          </div>
        </div>
      </div>
      <template v-for="parent in parentsByCompanyUuid(company.uuid)">
        <div :key="parent.uuid" class="table-row">
          <div class="table-item table-center">
            <base-checkbox
              v-model="checked"
              class="checkbox"
              :value="parent.uuid"
              @change="parentChange(company.uuid, parent.uuid)"
            />
          </div>
          <div class="table-item">
            {{ parent.name }}
          </div>
          <div class="table-item table-center user-count">
            {{ parent.user_count }}名
          </div>
          <div class="table-item">
            <div class="table-group-contents">
              <span
                v-for="group in parent.groups"
                :key="group.uuid"
                class="table-group-contents-item"
                >・{{ group.name }}</span
              >
            </div>
            <div class="table-group-buttons">
              <a role="button" @click="addGroup(parent, $event)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <circle
                    id="Ellipse_216"
                    data-name="Ellipse 216"
                    cx="8"
                    cy="8"
                    r="8"
                    fill="#f09c9c"
                  />
                  <g
                    id="Group_1350"
                    data-name="Group 1350"
                    transform="translate(5 5)"
                  >
                    <line
                      id="Line_373"
                      data-name="Line 373"
                      y2="6"
                      transform="translate(3)"
                      fill="#fff"
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-miterlimit="10"
                      stroke-width="1"
                    />
                    <line
                      id="Line_374"
                      data-name="Line 374"
                      x2="6"
                      transform="translate(0 3)"
                      fill="#fff"
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-miterlimit="10"
                      stroke-width="1"
                    />
                  </g>
                </svg>
              </a>
              <a role="button" @click="deleteGroup(parent)">
                <svg
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
            </div>
          </div>
        </div>
        <div
          v-for="child in childrenByParentUuid(parent.uuid)"
          :key="child.uuid"
          class="table-row"
        >
          <div class="table-item table-center">
            <base-checkbox
              v-model="checked"
              class="checkbox"
              :value="child.uuid"
              @change="childChange(company.uuid, parent.uuid, child.uuid)"
            />
          </div>
          <div class="table-item">
            <div class="organization-names">
              <span class="organization-name-sub">
                {{ parentNameByChild(child) }}
              </span>
              <span class="organization-name">{{ child.name }}</span>
            </div>
          </div>
          <div class="table-item table-center user-count">
            {{ child.user_count }}名
          </div>
          <div class="table-item">
            <div class="table-group-contents">
              <span
                v-for="group in child.groups"
                :key="group.uuid"
                class="table-group-contents-item"
                >・{{ group.name }}</span
              >
            </div>
            <div class="table-group-buttons">
              <a role="button" @click="addGroup(child, $event)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <circle
                    id="Ellipse_216"
                    data-name="Ellipse 216"
                    cx="8"
                    cy="8"
                    r="8"
                    fill="#f09c9c"
                  />
                  <g
                    id="Group_1350"
                    data-name="Group 1350"
                    transform="translate(5 5)"
                  >
                    <line
                      id="Line_373"
                      data-name="Line 373"
                      y2="6"
                      transform="translate(3)"
                      fill="#fff"
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-miterlimit="10"
                      stroke-width="1"
                    />
                    <line
                      id="Line_374"
                      data-name="Line 374"
                      x2="6"
                      transform="translate(0 3)"
                      fill="#fff"
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-miterlimit="10"
                      stroke-width="1"
                    />
                  </g>
                </svg>
              </a>
              <a role="button" @click="deleteGroup(child)">
                <svg
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
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';

export default Vue.extend({
  components: { BaseCheckbox },
  props: {
    organizations: {
      type: Array as PropType<Types.GroupOrganization[]>,
      required: true,
    },
    checkedOrganizationUuids: {
      type: Array as PropType<string[]>,
      required: true,
    },
    all: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      checked: [] as string[],
    };
  },
  computed: {
    companies() {
      return this.organizations.filter(
        (o: Types.GroupOrganization) => o.layer === 0
      );
    },
    parentsByCompanyUuid() {
      return (companyUuid: string) => {
        return this.organizations.filter((o: Types.GroupOrganization) => {
          return o.layer === 1 && o.relations.company === companyUuid;
        });
      };
    },
    parentNameByChild() {
      return (child: Types.Organization) => {
        const parent = this.organizations.find((o: Types.GroupOrganization) => {
          return o.uuid === child.relations.parent;
        });
        if (parent !== undefined) {
          return parent.name;
        }
      };
    },
    childrenByParentUuid() {
      return (parentUuid: string) => {
        return this.organizations.filter((o: Types.GroupOrganization) => {
          return o.layer === 2 && o.relations.parent === parentUuid;
        });
      };
    },
    allSelected(): boolean {
      return this.checked.length === this.organizations.length;
    },
  },
  watch: {
    checkedOrganizationUuids() {
      this.checked = [...this.checkedOrganizationUuids];
    },
  },
  methods: {
    addGroup(selectOrganization: Types.GroupOrganization, event: MouseEvent) {
      this.$emit('add', selectOrganization, event);
    },
    deleteGroup(selectOrganization: {}) {
      this.$emit('delete', selectOrganization);
    },
    toggleAllSelect() {
      const selected: boolean =
        this.checked.length === this.organizations.length;
      if (selected) {
        this.checked = [];
      } else {
        this.checked = this.organizations.map(
          (o: Types.GroupOrganization) => o.uuid
        );
      }
      this.$emit('change', this.checked);
    },
    companyChange(companyUuid: string) {
      const toCheck = this.checked.some((c: string) => {
        return c === companyUuid;
      });
      this.interlockingCheck(companyUuid, toCheck);
      this.$emit('change', this.checked);
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
      this.$emit('change', this.checked);
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
      this.$emit('change', this.checked);
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
    includedInChecked(sameOrganizations: Types.GroupOrganization[]) {
      return sameOrganizations.every((s: Types.GroupOrganization) => {
        return this.checked.some((c: string) => {
          return c === s.uuid;
        });
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.organization-table-container {
  border-top: solid 1px $light_gray_blue_3;
  border-left: solid 1px $light_gray_blue_3;
  color: $dark_blue;
}

.table-row {
  display: grid;
  grid-template-columns: 30px 310px 84px 1fr;
  grid-template-rows: auto auto;

  &.company {
    background-color: $light_gray_blue_4;

    .company-name {
      font-weight: 600;
    }
  }
}

.table-item {
  border-right: solid 1px $light_gray_blue_3;
  border-bottom: solid 1px $light_gray_blue_3;
  display: flex;
  align-items: center;
  min-height: 60px;
  padding-left: 10px;
  font-size: 15px;
}

.table-center {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: initial;
}

.user-count {
  font-size: 13px;
}

.table-item.table-title {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  background-color: $white_1;
  color: $gray_blue_4;
  font-size: 13px;
  font-weight: 600;
}

.table-group-contents {
  flex: 1;
}

.table-group-contents-item {
  display: inline-block;
  padding: 2px 4px;
  margin: 2px;
}

.table-group-buttons {
  display: flex;
  flex-direction: row;
}

.organization-names {
  display: flex;
  flex-direction: column;
}

.organization-name {
  font-size: 15px;
  line-height: 15px;

  &-sub {
    font-size: 10px;
    color: $gray_blue_1;
  }
}

.checkbox {
  margin-left: 2px;
}

a > svg {
  margin-right: 14px;
}
</style>
