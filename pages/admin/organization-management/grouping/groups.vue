<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="組織（BOX）グループ化">
        <template #description>
          会社やBOXをプロジェクトや目的に応じてグループにまとめることができます。
        </template>
      </page-header>
      <div class="l-contents">
        <div class="top">
          <h2 class="contents-title">グループ一覧</h2>
          <div class="top-right">
            <span class="bulk-delete"
              >チェックした項目をグループから<button
                class="bulk-delete-button"
                @click="toggleDeleteOrganizationModal"
              >
                削除
              </button></span
            >

            <div class="separator"></div>

            <base-button
              class="organization-list-button"
              type="button"
              @click="changeDisplay"
            >
              <svg
                class="caret-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="9.2"
                height="13.4"
                viewBox="0 0 9.2 13.4"
              >
                <g
                  id="Icon_arrow_right_white"
                  data-name="Icon/arrow_right_white"
                  transform="translate(0.7 0.7)"
                >
                  <path
                    id="Path_566"
                    data-name="Path 566"
                    d="M682.972,746.512l8,6-8,6"
                    transform="translate(-682.972 -746.512)"
                    fill="none"
                    stroke="#6a6d83"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                  />
                </g>
              </svg>
              組織一覧を表示
            </base-button>
          </div>
        </div>
        <div v-if="!groups.length" class="content-empty">
          <p class="sentence">
            最初に、下記ボタンをクリックしてグループを作成してください。<br />
            作成したグループはグループ管理ボタンから確認や追加ができます。
          </p>
          <button
            class="create-group-button"
            @click="toggleGroupManagementModal"
          >
            <svg
              id="Icon_plus_pink"
              data-name="Icon/plus_pink"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
            グループを作成する
          </button>
        </div>
        <div v-if="groups.length">
          <add-button type="button" @click="toggleGroupManagementModal">
            グループを追加する
          </add-button>
          <div class="groups">
            <div v-for="group in groups" :key="group.uuid" class="group">
              <div class="group-top">
                <h3 class="group-title">{{ group.name }}</h3>
                <add-button
                  type="button"
                  @click="toggleAddGroupMemberModal(group.uuid)"
                >
                  追加
                </add-button>
              </div>
              <hr class="separator2" />
              <div class="group-companies">
                <div
                  v-for="groupBelongToCompany in groupBelongToCompanies(group)"
                  :key="groupBelongToCompany.uuid"
                  class="group-company"
                >
                  <company-name-with-icon>
                    {{ groupBelongToCompany.name }}
                  </company-name-with-icon>
                  <ul class="group-list">
                    <li
                      v-for="groupCompany in groupOrganizationByUuid(
                        group,
                        groupBelongToCompany.uuid
                      )"
                      :key="groupCompany.uuid"
                      class="list-item"
                    >
                      <label class="label">
                        <input
                          v-model="checked"
                          type="checkbox"
                          :value="{
                            group_uuid: group.uuid,
                            organization: groupCompany,
                          }"
                          class="input-checkbox"
                          @change="companyChange(group, groupCompany.uuid)"
                        />
                        <div class="organization">
                          <span class="organization-name">{{
                            groupCompany.name
                          }}</span>
                          <a
                            role="button"
                            @click="deleteCompany(group, groupCompany)"
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
                        </div>
                      </label>
                    </li>
                    <li
                      v-for="groupParent in groupParentsByCompanyUuid(
                        group,
                        groupBelongToCompany.uuid
                      )"
                      :key="groupParent.uuid"
                      class="list-item"
                    >
                      <label class="label">
                        <input
                          v-model="checked"
                          type="checkbox"
                          :value="{
                            group_uuid: group.uuid,
                            organization: groupParent,
                          }"
                          class="input-checkbox"
                          @change="parentChange(group, groupParent)"
                        />
                        <div class="organization">
                          <span class="organization-name">{{
                            groupParent.name
                          }}</span>
                          <a
                            role="button"
                            @click="deleteParent(group, groupParent)"
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
                        </div>
                      </label>
                    </li>
                    <li
                      v-for="groupChild in groupChildrenByCompanyUuid(
                        group,
                        groupBelongToCompany.uuid
                      )"
                      :key="groupChild.uuid"
                      class="list-item"
                    >
                      <label class="label">
                        <input
                          v-model="checked"
                          type="checkbox"
                          :value="{
                            group_uuid: group.uuid,
                            organization: groupChild,
                          }"
                          class="input-checkbox"
                          @change="childChange(group, groupChild)"
                        />
                        <div class="organization">
                          <div class="organization-names">
                            <span class="organization-name-sub">
                              {{ parentNameByChild(groupChild) }}
                            </span>
                            <span class="organization-name">{{
                              groupChild.name
                            }}</span>
                          </div>
                          <a
                            role="button"
                            @click="deleteChild(group, groupChild)"
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
                        </div>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <group-management-modal
      v-if="groupManagementModal"
      :groups="groups"
      @close="toggleGroupManagementModal"
      @create="createOrganizationGroup"
      @delete="toggleCheckDeleteGroupModal"
    />
    <add-group-member-modal
      v-if="addGroupMemberModal"
      :organizations="organizations"
      :props-group="propsGroup"
      @close="toggleAddGroupMemberModal"
      @add="addGroupMember"
    />
    <check-delete
      v-if="checkDeleteGroupModal"
      :index="deleteGroupUuids"
      @click="deleteOrganizationGroups"
      @close="toggleCheckDeleteGroupModal"
    >
      BOXからこのグループは削除されます。<br />グループを削除されますか？
    </check-delete>
    <check-delete
      v-if="deleteOrganizationModal"
      delete-button-text="削除"
      @click="bulkDelete"
      @close="toggleDeleteOrganizationModal"
    >
      選択した会社、部署・店舗をグループから削除しますか？
    </check-delete>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {
  fetchOrganizations,
  fetchOrganizationGroups,
  createOrganizationGroup,
  deleteOrganizationGroups,
  addOrganizationsToOrganizationGroups,
  deleteOrganizationsFromOrganizationGroups,
} from '@/libs/api';
import { CheckDelete } from '@/components/Admin/Modules/Modal';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import {
  GroupManagementModal,
  AddGroupMemberModal,
  AddButton,
  CompanyNameWithIcon,
} from '@/components/Admin/Pages';
import _ from 'lodash';
import { Context } from '@nuxt/types';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    GroupManagementModal,
    AddGroupMemberModal,
    CheckDelete,
    PageHeader,
    AddButton,
    BaseButton,
    CompanyNameWithIcon,
  },
  async asyncData(context: Context) {
    const { error } = context;
    try {
      // 組織一覧取得
      const organizations = await fetchOrganizations();
      // グループ一覧取得
      const organizationGroups = await fetchOrganizationGroups();
      return {
        organizations: organizations.data.organizations,
        groups: organizationGroups.data.organization_groups,
      };
    } catch (err) {
      error({
        statusCode: err.response.status,
        message: err.response.data.message,
      });
    }
  },
  data() {
    return {
      groupManagementModal: false as boolean,
      checkDeleteGroupModal: false as boolean,
      addGroupMemberModal: false as boolean,
      deleteOrganizationModal: false as boolean,
      propsGroup: {} as Types.OrganizationGroup,
      checked: [] as Types.CheckedGroupOrganization[],
      deleteGroupUuids: [] as string[],
      groups: [] as Types.OrganizationGroup[],
      organizations: [] as Types.GroupOrganization[],
    };
  },
  computed: {
    groupBelongToCompanies() {
      // 組織たちが所属するすべての会社
      return (group: Types.OrganizationGroup) => {
        return this.organizations.filter((o: Types.GroupOrganization) => {
          return group.organizations.some((go: Types.Organization) => {
            return (
              (go.layer === 0 && go.uuid === o.uuid) ||
              go.relations.company === o.uuid
            );
          });
        });
      };
    },
    groupOrganizationByUuid() {
      return (group: Types.OrganizationGroup, uuid: string) => {
        return group.organizations.filter((o: Types.Organization) => {
          return o.uuid === uuid;
        });
      };
    },
    groupParentsByCompanyUuid() {
      return (group: Types.OrganizationGroup, companyUuid: string) => {
        return group.organizations.filter((o: Types.Organization) => {
          return o.layer === 1 && o.relations.company === companyUuid;
        });
      };
    },
    groupChildrenByCompanyUuid() {
      return (group: Types.OrganizationGroup, companyUuid: string) => {
        return group.organizations.filter((o: Types.Organization) => {
          return o.layer === 2 && o.relations.company === companyUuid;
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
  },
  methods: {
    changeDisplay() {
      this.$router.push({
        path: '/admin/organization-management/grouping/organizations',
      });
    },
    toggleGroupManagementModal() {
      this.groupManagementModal = !this.groupManagementModal;
    },
    toggleCheckDeleteGroupModal(deleteGroupUuids: string[] = []) {
      if (!this.checkDeleteGroupModal) {
        this.deleteGroupUuids = deleteGroupUuids;
      }
      this.checkDeleteGroupModal = !this.checkDeleteGroupModal;
    },
    toggleAddGroupMemberModal(groupUuid: string) {
      if (!this.addGroupMemberModal) {
        // @ts-ignore
        this.propsGroup = this.groups.find(
          (g: Types.OrganizationGroup) => g.uuid === groupUuid
        );
      }
      this.addGroupMemberModal = !this.addGroupMemberModal;
    },
    toggleDeleteOrganizationModal() {
      this.deleteOrganizationModal = !this.deleteOrganizationModal;
    },
    createOrganizationGroup(goupName: string) {
      this.CreateOrganizationGroup(goupName);
    },
    deleteOrganizationGroups(deleteGroupUuids: string[]) {
      this.DeleteOrganizationGroups(deleteGroupUuids);
      const groups = deleteGroupUuids.map((g: string) => {
        // @ts-ignore
        const group: Types.Group = this.groups.find(
          (gr: Types.OrganizationGroup) => gr.uuid === g
        );
        return {
          uuid: group.uuid,
          name: group.name,
        };
      });
      // 組織からグループを削除
      this.organizations = this.organizations.map(
        (o: Types.GroupOrganization) => {
          return {
            ...o,
            groups: _.differenceBy(o.groups, groups, 'uuid'),
          };
        }
      );
      // グループを削除
      this.groups = this.groups.filter((g: Types.OrganizationGroup) => {
        return !deleteGroupUuids.some((d: string) => d === g.uuid);
      });
      this.toggleCheckDeleteGroupModal();
    },
    addGroupMember({
      group,
      checkedOrganizationUuids,
      organizationUuids,
    }: {
      group: Types.OrganizationGroup;
      checkedOrganizationUuids: string[];
      organizationUuids: string[];
    }) {
      this.AddOrganizationsToOrganizationGroup(group.uuid, organizationUuids);

      const organizations: Types.Organization[] = this.organizations
        .map((o: Types.GroupOrganization) => this.deleteGroupProperty(o))
        .filter((o: Types.Organization) => {
          return checkedOrganizationUuids.some((u: string) => u === o.uuid);
        });

      // グループに組織を
      this.groups = this.groups.map((g: Types.OrganizationGroup) => {
        if (g.uuid === group.uuid) {
          return {
            ...g,
            organizations,
          };
        }
        return g;
      });

      // 組織にグループを追加
      this.organizations = this.organizations.map(
        (o: Types.GroupOrganization) => {
          const exist = checkedOrganizationUuids.some(
            (u: string) => u === o.uuid
          );
          if (exist) {
            return {
              ...o,
              groups: [...o.groups, { uuid: group.uuid, name: group.name }],
            };
          }
          return o;
        }
      );
    },
    companyChange(group: Types.OrganizationGroup, companyUuid: string) {
      const toCheck = this.checked.some(
        (ch: Types.CheckedGroupOrganization) => {
          return ch.organization.uuid === companyUuid;
        }
      );
      this.interlockingCheck(companyUuid, toCheck, group);
    },
    parentChange(group: Types.OrganizationGroup, parent: Types.Organization) {
      const company: Types.Organization = this.deleteGroupProperty(
        // @ts-ignore
        this.organizations.find(
          (o: Types.GroupOrganization) =>
            o.layer === 0 && o.uuid === parent.relations.company
        )
      );
      const toCheck = this.checked.some(
        (ch: Types.CheckedGroupOrganization) => {
          return ch.organization.uuid === parent.uuid;
        }
      );
      this.interlockingCheck(parent.uuid, toCheck, group);

      // 同じ階層の要素たち（自分も含む）
      const same: Types.Organization[] = group.organizations.filter(
        (o: Types.Organization) => {
          return o.relations.company === company.uuid;
        }
      );

      // 会社が既にチェックされているか
      const companyChecked = this.checked.some(
        (ch: Types.CheckedGroupOrganization) => {
          return ch.organization.uuid === company.uuid;
        }
      );

      if (toCheck) {
        // チェックをする
        const include: boolean = this.includedInChecked(same);
        if (include && !companyChecked) {
          // 親が全てチェックされるかつ会社がまだチェックされていなかったらチェックする
          this.checked.push({
            group_uuid: group.uuid,
            organization: company,
          });
        }
      } else {
        const include: boolean = this.includedInChecked(same);
        if (!include && companyChecked) {
          // 親が全てチェックが外されるかつ会社がすでにチェックされていたらチェックを外す
          this.checked = this.checked.filter(
            (ch: Types.CheckedGroupOrganization) => {
              return !(ch.organization.uuid === company.uuid);
            }
          );
        }
      }
    },
    childChange(group: Types.OrganizationGroup, child: Types.Organization) {
      const company: Types.Organization = this.deleteGroupProperty(
        // @ts-ignore
        this.organizations.find(
          (o: Types.GroupOrganization) =>
            o.layer === 0 && o.uuid === child.relations.company
        )
      );
      const parent: Types.Organization = this.deleteGroupProperty(
        this.organizations.filter(
          (o: Types.GroupOrganization) =>
            o.layer === 1 && o.uuid === child.relations.parent
        )[0]
      );
      const toCheck = this.checked.some(
        (ch: Types.CheckedGroupOrganization) => {
          return ch.organization.uuid === child.uuid;
        }
      );

      // 同じ階層の要素たち（自身も含む）
      const same: Types.Organization[] = group.organizations.filter(
        (o: Types.Organization) => {
          return o.relations.parent === parent.uuid;
        }
      );
      // 同じ階層の要素たち（自身も含む）
      const sameParent: Types.Organization[] = group.organizations.filter(
        (o: Types.Organization) => {
          return o.relations.company === company.uuid;
        }
      );

      // 会社が既にチェックされているか
      const companyChecked = this.checked.some(
        (ch: Types.CheckedGroupOrganization) =>
          ch.organization.uuid === company.uuid
      );

      // 親が既にチェックされているか
      const parentChecked = this.checked.some(
        (ch: Types.CheckedGroupOrganization) =>
          ch.organization.uuid === parent.uuid
      );

      if (toCheck) {
        // チェックをする
        const include = this.includedInChecked(same);
        if (include && !parentChecked) {
          // 子が全てチェックされるかつ親がまだチェックされていなかったらチェックする
          this.checked.push({
            group_uuid: group.uuid,
            organization: parent,
          });
          const doubleInclude = this.includedInChecked(sameParent);
          if (doubleInclude && !companyChecked) {
            // 親が全てチェックされるかつ会社がまだチェックされていなかったらチェックする
            this.checked.push({
              group_uuid: group.uuid,
              organization: company,
            });
          }
        }
      } else {
        const include = this.includedInChecked(same);
        if (!include && parentChecked) {
          // 子が全てチェックが外されるかつ親がすでにチェックされていたらチェックを外す
          this.checked = this.checked.filter(
            (ch: Types.CheckedGroupOrganization) => {
              return !(ch.organization.uuid === parent.uuid);
            }
          );
          const doubleInclude = this.includedInChecked(sameParent);
          if (!doubleInclude && companyChecked) {
            // 親が全てチェックが外れているかつ会社がまだチェックされていたらチェックを外す
            this.checked = this.checked.filter(
              (ch: Types.CheckedGroupOrganization) => {
                return !(ch.organization.uuid === company.uuid);
              }
            );
          }
        }
      }
    },
    interlockingCheck(
      uuid: string,
      toCheck: boolean,
      group: Types.OrganizationGroup
    ) {
      const organizations: Types.Organization[] = group.organizations.filter(
        (o: Types.Organization) => {
          return (
            o.uuid === uuid ||
            o.relations.company === uuid ||
            o.relations.parent === uuid
          );
        }
      );
      if (toCheck) {
        // チェックをする（既にチェックされているものは除く）
        const check: Types.CheckedGroupOrganization[] = organizations
          .filter((o: Types.Organization) => {
            return !this.checked.some((ch: Types.CheckedGroupOrganization) => {
              return ch.organization.uuid === o.uuid;
            });
          })
          .map((o: Types.Organization) => {
            return {
              group_uuid: group.uuid,
              organization: o,
            };
          });
        Array.prototype.push.apply(this.checked, check);
      } else {
        // チェックを外す（既にチェックが外れているものは除）
        const uncheck: Types.Organization[] = organizations.filter(
          (o: Types.Organization) => {
            return this.checked.some((ch: Types.CheckedGroupOrganization) => {
              return ch.organization.uuid === o.uuid;
            });
          }
        );
        this.checked = this.checked.filter(
          (ch: Types.CheckedGroupOrganization) => {
            return !uncheck.some((u: Types.Organization) => {
              return u.uuid === ch.organization.uuid;
            });
          }
        );
      }
    },
    includedInChecked(sameOrganizations: Types.Organization[]) {
      return sameOrganizations.every((s: Types.Organization) => {
        return this.checked.some((ch: Types.CheckedGroupOrganization) => {
          return ch.organization.uuid === s.uuid;
        });
      });
    },
    deleteGroupProperty(organization: Types.GroupOrganization) {
      return {
        uuid: organization.uuid,
        name: organization.name,
        kana: organization.kana,
        layer: organization.layer,
        type: organization.type,
        status: organization.status,
        user_count: organization.user_count,
        detail: organization.detail,
        leader: organization.leader,
        relations: organization.relations,
        latest_access_date: organization.latest_access_date,
        pos: organization.pos,
      };
    },
    deleteCompany(group: Types.OrganizationGroup, company: Types.Organization) {
      // 削除対象
      const targetOrganizations: Types.Organization[] = group.organizations.filter(
        (o: Types.Organization) => {
          return (
            o.uuid === company.uuid || o.relations.company === company.uuid
          );
        }
      );

      const targetOrganizationUuids: string[] = targetOrganizations.map(
        (t: Types.Organization) => t.uuid
      );
      this.DeleteOrganizationsFromOrganizationGroup(
        group.uuid,
        targetOrganizationUuids
      );

      // グループから組織を削除
      this.deleteOrganizationsFromGroups(group, targetOrganizations);

      // 組織からグループを削除
      this.deleteGroupFromOrganizations(group, targetOrganizations);
    },
    deleteParent(group: Types.OrganizationGroup, parent: Types.Organization) {
      // 会社が既に削除されているか
      const companyExist = group.organizations.some(
        (o: Types.Organization) =>
          o.layer === 0 && o.uuid === parent.relations.company
      );
      // 削除対象
      const targetOrganizations: Types.Organization[] = group.organizations.filter(
        (o: Types.Organization) => {
          return o.uuid === parent.uuid || o.relations.parent === parent.uuid;
        }
      );

      const targetOrganizationUuids: string[] = targetOrganizations.map(
        (t: Types.Organization) => t.uuid
      );

      const deleteParentUuids: string[] = [...targetOrganizationUuids];

      // グループから組織を削除
      this.deleteOrganizationsFromGroups(group, targetOrganizations);
      // 組織からグループを削除
      this.deleteGroupFromOrganizations(group, targetOrganizations);
      // 同じ階層の要素たち
      const same = this.organizations
        .filter((o: Types.GroupOrganization) => {
          return (
            o.layer === 1 &&
            o.uuid &&
            o.relations.company === parent.relations.company
          );
        })
        .map((o: Types.GroupOrganization) => {
          return this.deleteGroupProperty(o);
        });
      // 親要素がひとつもグループに属していない
      const notInclude = same.every((s: Types.Organization) => {
        // @ts-ignore
        return !this.groups
          .find((g: Types.OrganizationGroup) => g.uuid === group.uuid)
          .organizations.some((o: Types.Organization) => {
            return o.uuid === s.uuid;
          });
      });
      // 親要素がひとつもグループに属さないかつ会社がグループに属していたらグループを外す
      if (notInclude && companyExist) {
        if (parent.relations.company) {
          // グループから組織を削除
          deleteParentUuids.push(parent.relations.company);
          this.deleteOrganizationFromGroups(group, parent.relations.company);

          // 組織からグループを削除
          this.deleteGroupFromOrganization(group, parent.relations.company);
        }
      }
      this.DeleteOrganizationsFromOrganizationGroup(
        group.uuid,
        deleteParentUuids
      );
    },
    deleteChild(group: Types.OrganizationGroup, child: Types.Organization) {
      const deleteUuids: string[] = [];
      // 会社が既に削除されているか
      const companyExist = group.organizations.some(
        (o: Types.Organization) =>
          o.layer === 0 && o.uuid === child.relations.company
      );
      // 親要素が既に削除されているか
      const parentExist = group.organizations.some(
        (o: Types.Organization) =>
          o.layer === 1 && o.uuid === child.relations.parent
      );
      // グループから組織を削除
      deleteUuids.push(child.uuid);
      this.deleteOrganizationFromGroups(group, child.uuid);
      // 組織からグループを削除
      this.deleteGroupFromOrganization(group, child.uuid);
      // 同じ階層の要素たち
      const same = this.organizations
        .filter((o: Types.GroupOrganization) => {
          return (
            o.layer === 2 &&
            o.uuid &&
            o.relations.parent === child.relations.parent
          );
        })
        .map((o: Types.GroupOrganization) => {
          return this.deleteGroupProperty(o);
        });
      // 子要素がひとつもグループに属していない
      const notInclude = same.every((s: Types.Organization) => {
        // @ts-ignore
        return !this.groups
          .find((g: Types.OrganizationGroup) => g.uuid === group.uuid)
          .organizations.some((o: Types.Organization) => {
            return o.uuid === s.uuid;
          });
      });
      // 子要素がひとつもグループに属さないかつ会社がグループに属していたらグループを外す
      if (notInclude && parentExist) {
        if (child.relations.parent) {
          // グループから組織を削除
          deleteUuids.push(child.relations.parent);
          this.deleteOrganizationFromGroups(group, child.relations.parent);
          // 組織からグループを削除
          this.deleteGroupFromOrganization(group, child.relations.parent);
        }
        // 同じ階層の要素たち
        const sameParent = this.organizations
          .filter((o: Types.GroupOrganization) => {
            return (
              o.layer === 1 &&
              o.uuid &&
              o.relations.company === child.relations.company
            );
          })
          .map((o: Types.GroupOrganization) => {
            return this.deleteGroupProperty(o);
          });
        // 子要素がひとつもグループに属していない
        const doubleNotInclude = sameParent.every((s: Types.Organization) => {
          // @ts-ignore
          return !this.groups
            .find((g: Types.OrganizationGroup) => g.uuid === group.uuid)
            .organizations.some((o: Types.Organization) => {
              return o.uuid === s.uuid;
            });
        });
        // 親要素がひとつもグループに属さないかつ会社がグループに属していたらグループを外す
        if (doubleNotInclude && companyExist && child.relations.company) {
          // グループから組織を削除
          deleteUuids.push(child.relations.company);
          this.deleteOrganizationFromGroups(group, child.relations.company);
          // 組織からグループを削除
          this.deleteGroupFromOrganization(group, child.relations.company);
        }
      }
      this.DeleteOrganizationsFromOrganizationGroup(group.uuid, deleteUuids);
    },
    deleteOrganizationsFromGroups(
      group: Types.OrganizationGroup,
      deleteOrganizations: Types.Organization[]
    ) {
      // グループから組織（複数）を削除
      // @ts-ignore
      const organizations: Types.Organization[] = this.groups
        .find((g: Types.OrganizationGroup) => g.uuid === group.uuid)
        .organizations.filter((o: Types.Organization) => {
          return !deleteOrganizations.some(
            (t: Types.Organization) => t.uuid === o.uuid
          );
        });
      this.groups = this.groups.map((g: Types.OrganizationGroup) => {
        if (g.uuid === group.uuid) {
          return {
            ...g,
            organizations,
          };
        }
        return g;
      });
    },
    deleteOrganizationFromGroups(
      group: Types.OrganizationGroup,
      deleteOrganizationUuid: string
    ) {
      // グループから組織（1つ）を削除
      // @ts-ignore
      const organizations: Types.Organization[] = this.groups
        .find((g: Types.OrganizationGroup) => g.uuid === group.uuid)
        .organizations.filter((o: Types.Organization) => {
          return !(o.uuid === deleteOrganizationUuid);
        });
      this.groups = this.groups.map((g: Types.OrganizationGroup) => {
        if (g.uuid === group.uuid) {
          return {
            ...g,
            organizations,
          };
        }
        return g;
      });
    },
    deleteGroupFromOrganizations(
      deleteGroup: Types.OrganizationGroup,
      organizations: Types.Organization[]
    ) {
      // 組織（複数）からグループを削除
      this.organizations = this.organizations.map(
        (o: Types.GroupOrganization) => {
          if (
            organizations.some((t: Types.Organization) => t.uuid === o.uuid)
          ) {
            const groups: Types.Group[] = o.groups.filter((g: Types.Group) => {
              return !(g.uuid === deleteGroup.uuid);
            });
            return {
              ...o,
              groups,
            };
          }
          return o;
        }
      );
    },
    deleteGroupFromOrganization(
      deleteGroup: Types.OrganizationGroup,
      organizationUuid: string
    ) {
      // 組織（1つ）からグループを削除
      this.organizations = this.organizations.map(
        (o: Types.GroupOrganization) => {
          if (o.uuid === organizationUuid) {
            const groups: Types.Group[] = o.groups.filter((g: Types.Group) => {
              return !(g.uuid === deleteGroup.uuid);
            });
            return {
              ...o,
              groups,
            };
          }
          return o;
        }
      );
    },
    async bulkDelete() {
      const duplicatedOrganizationGroupUuids: string[] = this.checked.map(
        (c: Types.CheckedGroupOrganization) => c.group_uuid
      );
      const organizationGroupUuids: string[] = Array.from(
        new Set(duplicatedOrganizationGroupUuids)
      );
      const organizationGroups: ApiRequest.OrganizationGroup[] = organizationGroupUuids.map(
        (o: string) => {
          const organizationUuids = this.checked
            .filter((ch: Types.CheckedGroupOrganization) => ch.group_uuid === o)
            .map((ch: Types.CheckedGroupOrganization) => ch.organization.uuid);
          return {
            uuid: o,
            organization_uuids: organizationUuids,
          };
        }
      );
      deleteOrganizationsFromOrganizationGroups({
        organization_groups: organizationGroups,
      });
      // グループから組織を削除
      this.groups = this.groups.map((g: Types.OrganizationGroup) => {
        const organizations = g.organizations.filter(
          (o: Types.Organization) => {
            return !this.checked.some((ch: Types.CheckedGroupOrganization) => {
              return (
                g.uuid === ch.group_uuid && o.uuid === ch.organization.uuid
              );
            });
          }
        );
        return {
          ...g,
          organizations,
        };
      });
      this.toggleDeleteOrganizationModal();
    },
    async CreateOrganizationGroup(groupName: string) {
      try {
        const { data } = await createOrganizationGroup({ name: groupName });
        this.groups.push({ ...data, organizations: [] });
      } catch (err) {
        console.error(err);
      }
    },
    async DeleteOrganizationGroups(uuids: string[]) {
      try {
        const payload: ApiRequest.DeleteOrganizationGroups = {
          organization_group_uuids: uuids,
        };
        await deleteOrganizationGroups(payload);
      } catch (err) {
        console.error(err);
      }
    },
    async AddOrganizationsToOrganizationGroup(
      uuid: string,
      organizationUuids: string[]
    ) {
      try {
        const payload: ApiRequest.OrganizationGroups = {
          organization_groups: [
            {
              uuid,
              organization_uuids: organizationUuids,
            },
          ],
        };
        await addOrganizationsToOrganizationGroups(payload);
      } catch (err) {
        console.error(err);
      }
    },
    async DeleteOrganizationsFromOrganizationGroup(
      groupUuid: string,
      organizationUuids: string[]
    ) {
      try {
        const payload: ApiRequest.OrganizationGroups = {
          organization_groups: [
            {
              uuid: groupUuid,
              organization_uuids: organizationUuids,
            },
          ],
        };
        await deleteOrganizationsFromOrganizationGroups(payload);
      } catch (err) {
        console.error(err);
      }
    },
    // TODO: あとで消す
    generateUuid() {
      const chars = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('');
      for (let i = 0, len = chars.length; i < len; i += 1) {
        // eslint-disable-next-line default-case
        switch (chars[i]) {
          case 'x':
            chars[i] = Math.floor(Math.random() * 16).toString(16);
            break;
          case 'y':
            chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
            break;
        }
      }
      return chars.join('');
    },
  },
});
</script>

<style lang="scss" scoped>
.toggle-procedure {
  font-weight: bold;
  cursor: pointer;
}

.procedure {
  height: 200px;
  background-color: $true_white;
  padding: 16px;

  &-title {
    font-size: 16px;
    font-weight: bold;
  }
}

.top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: $dark_blue;
}

.contents-title {
  font-size: 20px;
}

.top-right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.bulk-delete {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 8px;
  margin-right: 24px;
  font-size: 13px;
}

.bulk-delete-button {
  margin-left: 24px;
  border: solid 1px $gray_blue_4;
  border-radius: 4px;
  color: $gray_blue_4;
  background-color: $true_white;
  height: 30px;
  width: 56px;
  font-size: 13px;
  font-weight: 600;

  &:hover {
    background-color: $light_gray_blue_3;
  }
}

.change-display-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  font-size: 13px;
  background-color: $true_white;
  border: solid 1px $light_gray_blue_3;
  border-radius: 20px;
  padding: 0 14px;
}

.icon-external-link {
  width: 14px;
  height: 14px;
  object-fit: cover;
  margin-right: 6px;
}

.content-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24% 0 30%;
}

.groups {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  grid-gap: 40px;
  width: 100%;
  margin-top: 14px;
}

.group-companies {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  grid-gap: 20px;
  color: $dark_blue;
  max-height: 450px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #7e8195 white;
  margin-right: -14px;
  padding-right: 10px;
}

.group-companies::-webkit-scrollbar {
  width: 4px;
  height: 0;
}

.group-companies::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #7e8195;
}

.group-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.group-title {
  color: $dark_blue;
  font-size: 15px;
}

.group-company-title {
  position: relative;
  font-size: 15px;
  padding-left: 14px;

  &::before {
    position: absolute;
    content: '';
    width: 10px;
    height: 100%;
    background-color: blue;
    top: 0;
    left: 0;
  }
}

.group-list {
  width: 100%;
  min-height: 200px;
  margin-top: 16px;
  border-top: solid 1px $light_gray_blue_3;
}

.list-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  border-bottom: solid 1px $light_gray_blue_3;
  border-right: solid 1px $light_gray_blue_3;
  border-left: solid 1px $light_gray_blue_3;
}

.label {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding-left: 6px;
}

.organization {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  height: 40px;
  border-left: solid 1px $light_gray_blue_3;
  border-bottom: solid 1px $light_gray_blue_3;
  margin-left: 6px;
  padding: 0 12px;

  .delete-button {
    vertical-align: text-bottom;
  }
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

.create-group-button {
  position: relative;
  height: 44px;
  width: 300px;
  margin-top: 66px;
  border: none;
  border-radius: 4px;
  background-color: $gray_blue_3;
  color: $true-white;
  font-size: 12px;
  font-weight: 600;

  svg {
    position: absolute;
    top: 12px;
    left: 14px;
  }
}

.separator {
  display: inline-block;
  border-left: 1px solid $light_gray_blue_3;
  height: 30px;
}

.separator2 {
  margin-top: 20px;
  margin-bottom: 30px;
  height: 1px;
  border: none;
  background-color: $light_gray_blue_3;
}

.organization-list-button {
  color: $gray_blue_4;
  background-color: $light_gray_blue_4;
  border: solid 1px $light_gray_blue_3;
  padding: 5px 14px 5px 11px;
  margin-left: 26px;

  &:hover {
    background-color: $light_gray_blue_1;
  }

  .caret-icon {
    padding-top: 3px;
  }
}

.sentenct {
  font-size: 15px;
  color: $dark_blue;
}
</style>
