<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="組織（BOX）グループ化">
        <template #description>
          会社やBOXをプロジェクトや目的に応じてグループにまとめることができます。
        </template>
      </page-header>
      <div class="scrollable-tabs-wrapper">
        <scrollable-tabs
          :companies="forTabItem.concat(companies)"
          :current-id="currentCompanyUuid"
          :company-count-threshold="3"
          @change-tab="changeCompanyTab($event)"
        />
        <add-button @click="toggleGroupManagementModal">
          グループを登録
        </add-button>
      </div>
      <div class="settings">
        <div class="bulk-add">
          <p class="bulk-add-description">
            チェックを入れた会社、部署・支店・店舗にまとめてグループを設定できます。<br />
            右のボタンをクリックしてポップアップからグループを選択してください。
          </p>
          <base-button class="bulk-add-button" @click="toggleBulkAddGroupModal">
            まとめて設定する
          </base-button>
        </div>
        <base-button
          class="group-list-button"
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
          グループ一覧を表示
        </base-button>
      </div>
      <div class="contents">
        <div v-if="currentCompanyUuid === 'all'">
          <organization-table
            :organizations="organizations"
            :groups="groups"
            :checked-organization-uuids="checkedOrganizationUuids"
            all
            @add="toggleAddGroupModal"
            @delete="toggleDeleteGroupModal"
            @change="changeSelect"
          />
        </div>
        <template v-for="company in companies">
          <div v-if="currentCompanyUuid === company.uuid" :key="company.uuid">
            <organization-table
              :organizations="organizationsByCompanyUuid(company.uuid)"
              :groups="groups"
              :checked-organization-uuids="checkedOrganizationUuids"
              @add="toggleAddGroupModal"
              @delete="toggleDeleteGroupModal"
              @change="changeSelect"
            />
          </div>
        </template>
      </div>
    </div>
    <group-management-modal
      v-if="groupManagementModal"
      :groups="groups"
      @close="toggleGroupManagementModal"
      @create="CreateOrganizationGroup"
      @delete="toggleCheckDeleteGroupModal"
    />
    <add-group-modal
      v-if="addGroupModal"
      :groups="groups"
      :select-organization="selectOrganization"
      @close="closeAddGroupModal"
      @click="addGroups"
      @go-to-registered-group="goToRegisteredGroup"
    />
    <bulk-add-group-modal
      v-if="bulkAddGroupModal"
      :groups="groups"
      @close="toggleBulkAddGroupModal"
      @click="bulkAddGroup"
      @go-to-registered-group="goToRegisteredGroup"
    />
    <delete-group-modal
      v-if="deleteGroupModal"
      :groups="groups"
      :select-organization="selectOrganization"
      @close="toggleDeleteGroupModal"
      @click="removeGroups"
    />
    <check-delete
      v-if="checkDeleteGroupModal"
      :index="deleteGroupUuids"
      @click="deleteOrganizationGroups"
      @close="toggleCheckDeleteGroupModal"
    >
      BOXからこのグループは削除されます。<br />グループを削除されますか？
    </check-delete>
    <no-group-modal
      v-if="noGroupModal"
      :top="noGroupModalTop"
      @close="noGroupModal = false"
      @show-group-management-modal="groupManagementModal = true"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';
import { CheckDelete } from '@/components/Admin/Modules/Modal';
import {
  GroupManagementModal,
  OrganizationTable,
  AddGroupModal,
  BulkAddGroupModal,
  DeleteGroupModal,
  AddButton,
  NoGroupModal,
} from '@/components/Admin/Pages';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import { Context } from '@nuxt/types';
import {
  addOrganizationsToOrganizationGroups,
  createOrganizationGroup,
  deleteOrganizationGroups,
  deleteOrganizationsFromOrganizationGroups,
  fetchOrganizationGroups,
  fetchOrganizations,
} from '@/libs/api';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import ScrollableTabs from '@/components/Admin/Modules/Tab/ScrollableTabs.vue';

interface d {
  organizations: Types.GroupOrganization[];
  groups: Types.OrganizationGroup[];
}

export default Vue.extend({
  layout: 'admin/default',
  components: {
    GroupManagementModal,
    OrganizationTable,
    AddGroupModal,
    BulkAddGroupModal,
    DeleteGroupModal,
    CheckDelete,
    PageHeader,
    BaseButton,
    AddButton,
    NoGroupModal,
    ScrollableTabs,
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
      noGroupModal: false,
      noGroupModalTop: 0,
      currentCompanyUuid: 'all',
      groupManagementModal: false as boolean,
      checkDeleteGroupModal: false as boolean,
      addGroupModal: false as boolean,
      deleteGroupModal: false as boolean,
      bulkAddGroupModal: false as boolean,
      groups: [] as Types.OrganizationGroup[],
      organizations: [] as Types.GroupOrganization[],
      selectOrganization: {},
      checkedOrganizationUuids: [] as string[],
      selectGroups: [] as Types.Group[],
      deleteGroupUuids: [] as string[],
      forTabItem: [
        {
          uuid: 'all',
          name: '全てを表示',
        },
      ],
    };
  },
  computed: {
    companies(): Types.GroupOrganization[] {
      return this.organizations.filter((o: Types.GroupOrganization) => {
        return o.layer === 0;
      });
    },
    organizationsByCompanyUuid() {
      return (companyUuid: string) => {
        return this.organizations.filter((o: Types.GroupOrganization) => {
          return o.uuid === companyUuid || o.relations.company === companyUuid;
        });
      };
    },
    active() {
      return (id: string): boolean => {
        return this.currentCompanyUuid === id;
      };
    },
  },
  methods: {
    changeDisplay() {
      this.$router.push({
        path: '/admin/organization-management/grouping/groups',
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
    closeAddGroupModal() {
      this.addGroupModal = false;
    },
    closeBulkAddGroupModal() {
      this.bulkAddGroupModal = false;
    },
    toggleAddGroupModal(
      selectOrganization: Types.GroupOrganization | {} = {},
      event: MouseEvent
    ) {
      if (!this.groups.length) {
        this.noGroupModal = true;
        this.noGroupModalTop = event.clientY + 10;
        return;
      }
      this.selectOrganization = selectOrganization;
      this.addGroupModal = !this.addGroupModal;
    },
    toggleDeleteGroupModal(
      selectOrganization: Types.GroupOrganization | {} = {}
    ) {
      this.selectOrganization = selectOrganization;
      this.deleteGroupModal = !this.deleteGroupModal;
    },
    toggleBulkAddGroupModal() {
      this.bulkAddGroupModal = !this.bulkAddGroupModal;
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
    addGroups({
      organization,
      checkedGroupUuids,
      groupUuids,
    }: {
      organization: Types.GroupOrganization;
      checkedGroupUuids: string[];
      groupUuids: string[];
    }) {
      // 会社
      const company = this.organizations.find(
        (o: Types.GroupOrganization) =>
          o.uuid === organization.relations.company
      );
      // 親要素
      const parent = this.organizations.find(
        (o: Types.GroupOrganization) => o.uuid === organization.relations.parent
      );
      // 配下の組織すべてにグループを追加
      // 組織にグループを追加
      const groups: Types.Group[] = groupUuids.map((d: string) => {
        // @ts-ignore
        const group: Types.OrganizationGroup = this.groups.find(
          (g: Types.OrganizationGroup) => g.uuid === d
        );
        return {
          uuid: group.uuid,
          name: group.name,
        };
      });
      this.organizations = this.organizations.map(
        (o: Types.GroupOrganization) => {
          if (
            o.uuid === organization.uuid ||
            o.relations.company === organization.uuid ||
            o.relations.parent === organization.uuid
          ) {
            return {
              ...o,
              groups: _.unionBy([...o.groups, ...groups], 'uuid'),
            };
          }
          return o;
        }
      );
      const organizationUuids: string[] = [];
      // グループに組織を追加
      this.groups = this.groups.map((g: Types.OrganizationGroup) => {
        if (groupUuids.some((d: string) => d === g.uuid)) {
          const organizations: Types.Organization[] = this.organizations
            .filter((o: Types.GroupOrganization) => {
              return (
                o.uuid === organization.uuid ||
                o.relations.parent === organization.uuid ||
                o.relations.company === organization.uuid
              );
            })
            .map((o: Types.GroupOrganization) => this.deleteGroupProperty(o));
          const groupOrganizationUuids = g.organizations.map(
            (o: Types.Organization) => o.uuid
          );
          const addOrganizationUuids: string[] = organizations
            .map((o: Types.Organization) => o.uuid)
            .filter((o: string) => {
              return !groupOrganizationUuids.some((go: string) => go === o);
            });
          organizationUuids.push(...addOrganizationUuids);
          return {
            ...g,
            organizations: _.unionBy(
              [...g.organizations, ...organizations],
              'uuid'
            ),
          };
        }
        return g;
      });
      // 親要素にグループ追加されてすべての親要素にグループが追加されたら会社にも追加する
      if (organization.layer === 1 && company !== undefined) {
        groups.forEach((gr: Types.Group) => {
          // 同じ階層の要素たち
          const same: Types.GroupOrganization[] = this.organizations.filter(
            (o: Types.GroupOrganization) => {
              return o.relations.company === company.uuid;
            }
          );
          // 会社に既にグループが追加されているか
          const companyHas = company.groups.some(
            (g: Types.Group) => g.uuid === gr.uuid
          );
          // チェックをする（すべて含まれる場合のみtrue）
          const include: boolean = this.includedInGroup(same, gr);
          // 親要素がすべてグループに追加されているかつ親にグループが追加されていないから追加する
          if (include && !companyHas) {
            // 組織にグループを追加
            organizationUuids.push(company.uuid);
            this.addGroupToOrganization(company, gr);
            // グループに組織を追加
            this.addOrganizationToGroup(company, gr);
          }
        });
      }
      // 子要素にグループ追加されてすべての子要素にグループが追加されたら親要素にも追加する
      if (
        organization.layer === 2 &&
        company !== undefined &&
        parent !== undefined
      ) {
        groups.forEach((gr: Types.Group) => {
          // 同じ階層の要素たち
          const same: Types.GroupOrganization[] = this.organizations.filter(
            (o: Types.GroupOrganization) => {
              return o.relations.parent === parent.uuid;
            }
          );
          // 親要素に既にグループが追加されているか
          const parentHas = parent.groups.some(
            (g: Types.Group) => g.uuid === gr.uuid
          );
          // チェックをする（すべて含まれる場合のみtrue）
          const include: boolean = this.includedInGroup(same, gr);
          // 親要素がすべてグループに追加されているかつ親にグループが追加されていないから追加する
          if (include && !parentHas) {
            // 組織にグループを追加
            organizationUuids.push(parent.uuid);
            this.addGroupToOrganization(parent, gr);
            // グループに組織を追加
            this.addOrganizationToGroup(parent, gr);
            // 同じ階層の要素たち
            const sameParent: Types.GroupOrganization[] = this.organizations.filter(
              (o: Types.GroupOrganization) => {
                return o.relations.company === company.uuid;
              }
            );
            // 会社に既にグループが追加されているか
            const companyHas = company.groups.some(
              (g: Types.Group) => g.uuid === gr.uuid
            );
            // チェックをする（すべて含まれる場合のみtrue）
            const doubleInclude: boolean = this.includedInGroup(sameParent, gr);
            if (doubleInclude && !companyHas) {
              // 組織にグループを追加
              organizationUuids.push(company.uuid);
              this.addGroupToOrganization(company, gr);
              // グループに組織を追加
              this.addOrganizationToGroup(company, gr);
            }
          }
        });
      }
      const addGroupUuids = groupUuids.filter((g: string) => {
        return !checkedGroupUuids.some((c: string) => c === g);
      });
      this.AddOrganizationsToOrganizationGroups(
        addGroupUuids,
        organizationUuids
      );
      // 子要素にグループ追加されてすべての親要素にグループが追加されて、すべての親要素にグループが追加されたら会社にもグループを追加する
      // this.toggleAddGroupModal();
      this.closeAddGroupModal();
    },
    includedInGroup(
      sameOrganizations: Types.GroupOrganization[],
      group: Types.Group
    ) {
      return sameOrganizations.every((s: Types.GroupOrganization) => {
        return s.groups.some((g: Types.Group) => g.uuid === group.uuid);
      });
    },
    addGroupToOrganization(
      organization: Types.GroupOrganization,
      group: Types.Group
    ) {
      this.organizations = this.organizations.map(
        (o: Types.GroupOrganization) => {
          if (o.uuid === organization.uuid) {
            return {
              ...o,
              groups: _.unionBy([...o.groups, group], 'uuid'),
            };
          }
          return o;
        }
      );
    },
    addOrganizationToGroup(
      organization: Types.GroupOrganization,
      group: Types.Group
    ) {
      const addOrganization = this.deleteGroupProperty(organization);
      this.groups = this.groups.map((g: Types.OrganizationGroup) => {
        if (g.uuid === group.uuid) {
          return {
            ...g,
            organizations: _.unionBy(
              [...g.organizations, addOrganization],
              'uuid'
            ),
          };
        }
        return g;
      });
    },
    removeGroups({
      organization,
      groupUuids,
    }: {
      organization: Types.GroupOrganization;
      groupUuids: string[];
    }) {
      const oldGroups = [...this.groups];
      // 会社
      const company = this.organizations.find(
        (o: Types.GroupOrganization) =>
          o.uuid === organization.relations.company
      );
      // 親要素
      const parent = this.organizations.find(
        (o: Types.GroupOrganization) => o.uuid === organization.relations.parent
      );
      // 配下の組織すべてからグループを削除
      // 組織からグループを削除
      const groups = groupUuids.map((d: string) => {
        // @ts-ignore
        const group: Types.GroupOrganization = this.groups.find(
          (g: Types.OrganizationGroup) => g.uuid === d
        );
        return {
          uuid: group.uuid,
          name: group.name,
        };
      });
      this.organizations = this.organizations.map(
        (o: Types.GroupOrganization) => {
          if (
            o.uuid === organization.uuid ||
            o.relations.company === organization.uuid ||
            o.relations.parent === organization.uuid
          ) {
            return {
              ...o,
              groups: _.differenceBy(o.groups, groups, 'uuid'),
            };
          }
          return o;
        }
      );
      // グループから組織を削除
      this.groups = this.groups.map((g: Types.OrganizationGroup) => {
        if (groupUuids.some((d: string) => d === g.uuid)) {
          const organizations: Types.Organization[] = this.organizations
            .filter((o: Types.GroupOrganization) => {
              return (
                o.uuid === organization.uuid ||
                o.relations.company === organization.uuid ||
                o.relations.company === organization.uuid
              );
            })
            .map((o: Types.GroupOrganization) => this.deleteGroupProperty(o));
          return {
            ...g,
            organizations: _.differenceBy(
              g.organizations,
              organizations,
              'uuid'
            ),
          };
        }
        return g;
      });
      if (organization.layer === 1 && company !== undefined) {
        // 同じ階層の要素たち
        const same: Types.GroupOrganization[] = this.organizations.filter(
          (o: Types.GroupOrganization) => {
            return o.relations.company === company.uuid;
          }
        );
        groups.forEach((gr: Types.Group) => {
          // 会社に既にグループが追加されているか
          const companyHas = company.groups.some(
            (g: Types.Group) => g.uuid === gr.uuid
          );
          // チェックをする（すべて含まれる場合のみtrue）
          const include: boolean = this.includedInGroup(same, gr);
          // 1つでも親要素からグループが削除されたとき会社がグループに入っていたら削除する
          if (!include && companyHas) {
            // 組織からグループを削除
            this.deleteGroupFromOrganization(company, gr);
            // グループから組織を削除
            this.deleteOrganizationFromGroup(company, gr);
          }
        });
      }
      // 親に既にグループが追加されているか（組織のグループの中にgroupUuidがすべて含まれている）
      if (
        organization.layer === 2 &&
        company !== undefined &&
        parent !== undefined
      ) {
        // 同じ階層の要素たち
        const same: Types.GroupOrganization[] = this.organizations.filter(
          (o: Types.GroupOrganization) => {
            return o.relations.parent === parent.uuid;
          }
        );
        groups.forEach((gr: Types.Group) => {
          // 親要素に既にグループが追加されているか
          const parentHas = parent.groups.some(
            (g: Types.Group) => g.uuid === gr.uuid
          );
          // チェックをする（すべて含まれる場合のみtrue）
          const include: boolean = this.includedInGroup(same, gr);
          // 1つでも親要素が削除されているかつ、親にグループが追加されているとき削除する
          if (!include && parentHas) {
            // 組織からグループを削除
            this.deleteGroupFromOrganization(parent, gr);
            // グループから組織を削除
            this.deleteOrganizationFromGroup(parent, gr);
            // 同じ階層の要素たち
            const sameParent: Types.GroupOrganization[] = this.organizations.filter(
              (o: Types.GroupOrganization) => {
                return o.relations.company === company.uuid;
              }
            );
            // 会社に既にグループが追加されているか
            const companyHas = company.groups.some(
              (g: Types.Group) => g.uuid === gr.uuid
            );
            // チェックをする（すべて含まれる場合のみtrue）
            const doubleInclude: boolean = this.includedInGroup(sameParent, gr);
            if (!doubleInclude && companyHas) {
              // 組織にグループを追加
              this.deleteGroupFromOrganization(company, gr);
              // グループに組織を追加
              this.deleteOrganizationFromGroup(company, gr);
            }
          }
        });
      }
      const payload: ApiRequest.OrganizationGroups = {
        organization_groups: [],
      };
      this.groups.forEach((g: Types.OrganizationGroup) => {
        if (groupUuids.includes(g.uuid)) {
          // @ts-ignore
          const oldGroup: Types.OrganizationGroup = oldGroups.find(
            (o: Types.OrganizationGroup) => o.uuid === g.uuid
          );
          const diffOrganizationUuids = _.differenceBy(
            oldGroup.organizations,
            g.organizations,
            'uuid'
          ).map((o: Types.Organization) => o.uuid);
          payload.organization_groups.push({
            uuid: g.uuid,
            organization_uuids: diffOrganizationUuids,
          });
        }
      });
      this.DeleteOrganizationsToOrganizationGroups(payload);

      this.toggleDeleteGroupModal();
    },
    deleteGroupFromOrganization(
      organization: Types.GroupOrganization,
      group: Types.Group
    ) {
      this.organizations = this.organizations.map(
        (o: Types.GroupOrganization) => {
          if (o.uuid === organization.uuid) {
            return {
              ...o,
              groups: _.differenceBy(o.groups, [group], 'uuid'),
            };
          }
          return o;
        }
      );
    },
    deleteOrganizationFromGroup(
      organization: Types.GroupOrganization,
      group: Types.Group
    ) {
      const deleteOrganization = this.deleteGroupProperty(organization);
      this.groups = this.groups.map((g: Types.OrganizationGroup) => {
        if (g.uuid === group.uuid) {
          return {
            ...g,
            organizations: _.differenceBy(
              g.organizations,
              [deleteOrganization],
              'uuid'
            ),
          };
        }
        return g;
      });
    },
    changeSelect(checked: []) {
      this.checkedOrganizationUuids = checked;
    },
    bulkAddGroup(groupUuids: string[]) {
      const oldGroups = [...this.groups];
      const groups = groupUuids.map((g: string) => {
        // @ts-ignore
        const group: Types.Group = this.groups.find(
          (gr: Types.OrganizationGroup) => gr.uuid === g
        );
        return {
          uuid: group.uuid,
          name: group.name,
        };
      });
      // 組織にグループを追加
      this.organizations = this.organizations.map(
        (o: Types.GroupOrganization) => {
          if (this.checkedOrganizationUuids.some((s: string) => s === o.uuid)) {
            return {
              ...o,
              groups: _.unionBy([...o.groups, ...groups], 'uuid'),
            };
          }
          return o;
        }
      );
      const organizations: Types.Organization[] = this.checkedOrganizationUuids.map(
        (c: string) => {
          const organization = this.organizations.find(
            (o: Types.GroupOrganization) => o.uuid === c
          );
          // @ts-ignore
          return this.deleteGroupProperty(organization);
        }
      );
      // グループに組織を追加
      this.groups = this.groups.map((g: Types.OrganizationGroup) => {
        if (groupUuids.some((gr: string) => gr === g.uuid)) {
          return {
            ...g,
            organizations: _.unionBy(
              [...g.organizations, ...organizations],
              'uuid'
            ),
          };
        }
        return g;
      });
      const payload: ApiRequest.OrganizationGroups = {
        organization_groups: [],
      };
      this.groups.forEach((g: Types.OrganizationGroup) => {
        if (groupUuids.includes(g.uuid)) {
          // @ts-ignore
          const oldGroup: Types.OrganizationGroup = oldGroups.find(
            (o: Types.OrganizationGroup) => o.uuid === g.uuid
          );
          const diffOrganizationUuids = _.differenceBy(
            g.organizations,
            oldGroup.organizations,
            'uuid'
          ).map((o: Types.Organization) => o.uuid);
          payload.organization_groups.push({
            uuid: g.uuid,
            organization_uuids: diffOrganizationUuids,
          });
        }
      });
      this.BulkAddOrganizationsToOrganizationGroups(payload);
      this.checkedOrganizationUuids = [];
      this.toggleBulkAddGroupModal();
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
    async AddOrganizationsToOrganizationGroups(
      uuids: string[],
      organizationUuids: string[]
    ) {
      try {
        const organizationGroups = uuids.map((u: string) => {
          return {
            uuid: u,
            organization_uuids: organizationUuids,
          };
        });
        const payload: ApiRequest.OrganizationGroups = {
          organization_groups: [...organizationGroups],
        };
        await addOrganizationsToOrganizationGroups(payload);
      } catch (err) {
        console.error(err);
      }
    },
    async BulkAddOrganizationsToOrganizationGroups(
      payload: ApiRequest.OrganizationGroups
    ) {
      try {
        await addOrganizationsToOrganizationGroups(payload);
      } catch (err) {
        console.error(err);
      }
    },
    async DeleteOrganizationsToOrganizationGroups(
      payload: ApiRequest.OrganizationGroups
    ) {
      try {
        await deleteOrganizationsFromOrganizationGroups(payload);
      } catch (err) {
        console.error(err);
      }
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
    changeCompanyTab(uuid: string) {
      this.currentCompanyUuid = uuid;
    },
    goToRegisteredGroup() {
      // INFO: 似たようなモーダルが2つあるのでいっぺんにcloseしてる。できれば一つのmodalにまとめたい。
      this.closeAddGroupModal();
      this.closeBulkAddGroupModal();
      this.toggleGroupManagementModal();
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
}

.procedure-title {
  font-size: 16px;
  font-weight: bold;
}

.settings {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
}

.bulk-add {
  display: flex;
  flex-direction: row;
  padding: 14px 20px;
  background-color: $true_white;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
}

.bulk-add-button {
  margin-left: 100px;
  width: 132px;
  margin-top: 4px;
}

.bulk-add-description {
  color: $dark_blue;
  width: 500px;
  font-size: 13px;
}

.contents {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $true_white;
  margin-top: 14px;
  max-height: 642px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #7e8195 white;
  margin-right: -14px;
  padding-right: 10px;
}

.contents::-webkit-scrollbar {
  width: 4px;
  height: 0;
}

.contents::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #7e8195;
}

.change-display-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  font-size: 13px;
  background-color: $true_white;
  border: solid 1px #707070;
  border-radius: 20px;
  padding: 0 14px;
}

.icon-external-link {
  width: 14px;
  height: 14px;
  object-fit: cover;
  margin-right: 6px;
}

.group-list-button {
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

.scrollable-tabs-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;

  .scrollable-tabs {
    width: 774px;
  }
}
</style>
