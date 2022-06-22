<template>
  <div class="contents">
    <div
      v-for="company in currentCompanies(currentCompanyId)"
      :key="company.uuid"
    >
      <div class="tab-header">
        <div class="tab-header__title-icon">
          <img src="/icon/icon_company_label.svg" alt="" />
        </div>
        <h3
          class="tab-header__title"
          @click="clickGoToCompanyDetail(company.uuid)"
        >
          {{ company.name }}
        </h3>
      </div>
      <div class="type-tag-counters">
        <div class="type-tag-counters__title">
          属性別組織（BOX）数
        </div>
        <div class="type-tag-counter">
          <span class="type-tag type-tag--department">部署</span
          ><span class="type-tag-counter__count">{{
            currentCompanyBelongedOrganizationCount(company.uuid, 'department')
          }}</span>
        </div>
        <div class="type-tag-counter">
          <span class="type-tag type-tag--branch">支店</span>
          <span class="type-tag-counter__count">{{
            currentCompanyBelongedOrganizationCount(company.uuid, 'branch')
          }}</span>
        </div>
        <div class="type-tag-counter">
          <span class="type-tag type-tag--shop">店舗</span>
          <span class="type-tag-counter__count">{{
            currentCompanyBelongedOrganizationCount(company.uuid, 'shop')
          }}</span>
        </div>
        <div class="type-tag-counter">
          <span class="type-tag type-tag--management">経営陣</span>
          <span class="type-tag-counter__count">{{
            currentCompanyBelongedOrganizationCount(company.uuid, 'management')
          }}</span>
        </div>
        <div class="type-tag-counter">
          <span class="type-tag type-tag--other">その他</span>
          <span class="type-tag-counter__count">{{
            currentCompanyBelongedOrganizationCount(company.uuid, 'other')
          }}</span>
        </div>
        <div class="type-tag-counter">
          <span class="type-tag type-tag--null">未属性</span>
          <span class="type-tag-counter__count">{{
            currentCompanyBelongedOrganizationCount(company.uuid, null)
          }}</span>
        </div>
      </div>
      <div
        v-if="currentCompanyBelongedOrganizations(company.uuid).length !== 0"
        class="organization-list-container"
      >
        <div class="wrapper">
          <table class="table">
            <thead>
              <tr>
                <th rowspan="2"></th>
                <th rowspan="2">属性</th>
                <th rowspan="2">組織（BOX)</th>
                <th rowspan="2">詳細</th>
                <th rowspan="2">代表者</th>
                <th rowspan="2">メンバー</th>
                <th rowspan="2">グループ</th>
                <th colspan="4">投稿ルール</th>
                <th rowspan="2">最終アクセス</th>
                <th rowspan="2"></th>
              </tr>
              <tr>
                <th>マイエピソード</th>
                <th>チームエピソード</th>
                <th>投稿アラート</th>
                <th>プロフィール更新</th>
              </tr>
            </thead>
            <tbody>
              <organization-list-row
                v-for="(companyBelongedOrganization,
                index) in currentCompanyBelongedOrganizations(company.uuid)"
                :key="companyBelongedOrganization.uuid"
                :organization="companyBelongedOrganization"
                :parent-organization-name="
                  parentNameByOrganization(companyBelongedOrganization)
                "
                :parent-organization-type="
                  parentTypeByOrganization(companyBelongedOrganization)
                "
                :config-rules="configRules"
                :is-last-child="
                  isLastChildOfParent(
                    index,
                    currentCompanyBelongedOrganizations(company.uuid)
                  )
                "
                @changePublic="execChangePublicSelectTag"
                @delete="execDeleteOrganization"
              ></organization-list-row>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import OrganizationListRow from '@/components/Admin/Pages/OrganizationManagement/OrganizationListRow.vue';

export default Vue.extend({
  components: {
    OrganizationListRow,
  },
  props: {
    currentCompanyId: {
      type: String,
      required: true,
      default: 'all',
    },
    organizations: {
      type: Array,
      required: true,
      default: [] as Types.GroupOrganization[],
    },
    configRules: {
      type: Object,
      default: () => ({} as ApiResponse.ConfigRules),
    },
  },
  computed: {
    currentCompanies() {
      return (id: string): Types.Organization => {
        if (id === 'all') {
          return this.$props.organizations.filter(
            (n: Types.Organization) => n.type === 'company'
          );
        }
        return this.$props.organizations.filter(
          (n: Types.Organization) => n.uuid === id
        );
      };
    },
    currentCompanyBelongedOrganizations() {
      return (id: string): Types.GroupOrganization[] => {
        const managements = this.$props.organizations.filter(
          (organization: Types.GroupOrganization) =>
            organization.relations.company === id &&
            organization.type === 'management'
        );

        const withoutManagementLayer1 = this.$props.organizations.filter(
          (organization: Types.GroupOrganization) =>
            organization.relations.company === id &&
            organization.type !== 'management' &&
            organization.layer === 1
        );

        const withoutManagementLayer2 = this.$props.organizations.filter(
          (organization: Types.GroupOrganization) =>
            organization.relations.company === id &&
            organization.type !== 'management' &&
            organization.layer === 2
        );

        const nestedWithoutManagement = withoutManagementLayer1.map(
          (organization: Types.GroupOrganization) => {
            return [
              organization,
              withoutManagementLayer2.filter(
                (c: Types.GroupOrganization) =>
                  organization.uuid === c.relations.parent
              ),
            ];
          }
        );
        return managements.concat(nestedWithoutManagement.flat(2));
      };
    },
    currentCompanyBelongedOrganizationCount() {
      return (id: string, type: string): number => {
        return this.$props.organizations.filter(
          (n: Types.Organization) =>
            n.relations.company === id && n.type === type
        ).length;
      };
    },
    parentNameByOrganization() {
      return (organization: Types.GroupOrganization) => {
        if (organization.layer === 2) {
          const parent: Types.GroupOrganization = this.$props.organizations.find(
            (o: Types.GroupOrganization) =>
              o.uuid === organization.relations.parent
          );
          return parent.name;
        }
        return '';
      };
    },
    parentTypeByOrganization() {
      return (organization: Types.GroupOrganization) => {
        if (organization.layer === 2) {
          const parent: Types.GroupOrganization = this.$props.organizations.find(
            (o: Types.GroupOrganization) =>
              o.uuid === organization.relations.parent
          );
          return parent.type;
        }
        return '';
      };
    },
    isLastChildOfParent() {
      return (currentIndex: number, organization: Types.GroupOrganization) => {
        const nextIndex = currentIndex + 1;
        const currentElement = organization[currentIndex];
        const nextElement = organization[nextIndex];
        if (
          nextElement &&
          !!currentElement.relations &&
          !!nextElement.relations &&
          !!currentElement.relations.parent &&
          !!nextElement.relations.parent &&
          currentElement.relations.parent === nextElement.relations.parent
        ) {
          return false;
        }
        return true;
      };
    },
  },
  methods: {
    clickGoToCompanyDetail(uuid: string) {
      this.$router.push({
        path: `/admin/organization-management/organizations/companies/${uuid}`,
      });
    },
    execChangePublicSelectTag(uuid: string, status: string) {
      this.$emit('changePublic', uuid, status);
    },
    execDeleteOrganization(uuid: string) {
      this.$emit('delete', uuid);
    },
  },
});
</script>
<style lang="scss" scoped>
$color_department: $blue;
$color_branch: $light_blue_green_1;
$color_shop: $purple_1;
$color_management: $wild_blue_yonder;
$color_null: $gray_blue_1;
$color_other: $hopbush;

* {
  color: $dark_blue;
}

.contents {
  min-width: 1596px;
}

.type-tag {
  &--department {
    background-color: $color_department;
  }

  &--branch {
    background-color: $color_branch;
  }

  &--shop {
    background-color: $color_shop;
  }

  &--management {
    background-color: $color_management;
  }

  &--other {
    background-color: $color_other;
  }

  &--null {
    background-color: $color_null;
  }
}

.tab-header {
  margin: 15px 0 5px;
  display: flex;
  align-items: center;

  &__title {
    font-size: 18px;
    width: 100%;
    text-decoration: underline;
    cursor: pointer;
  }

  &__title-icon {
    margin-right: 15px;
    width: 40px;
    height: 40px;
    border: none;
    background: $white_1;
    border-radius: 15px;
    text-align: center;
    display: flex;
    justify-content: center;
  }
}

.type-tag-counters {
  display: flex;
  align-items: center;
  background-color: $true_white;
  border-radius: 6px;
  width: 100%;
  height: 24px;
  margin-bottom: 15px;

  &__title {
    font-size: 14px;
    margin-right: 20px;
  }

  .type-tag {
    padding: 6px 8px;
    margin-right: 10px;
    font-size: 13px;
    color: $true_white;
    font-weight: bold;
    border-radius: 4px;
    line-height: 1;
  }

  .type-tag-counter {
    display: flex;
    align-items: center;
  }

  .type-tag-counter__count {
    margin-right: 20px;
    font-weight: bold;
    vertical-align: middle;
    line-height: 1;
  }
}

.organization-list-container {
  margin-bottom: 25px;
  font-size: 12px;
  max-height: 296px;
  overflow-y: auto;
  padding-right: 10px;
  width: 1666px;
  box-sizing: border-box;
  scrollbar-width: thin;
  scrollbar-color: #7e8195 white;
}

.organization-list-container::-webkit-scrollbar {
  width: 4px;
  height: 0;
}

.organization-list-container::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #7e8195;
}

.table {
  width: 1756px;
  border: 1px solid $light_gray_blue_3;
  max-width: 100%;

  th {
    background-color: $white_1;
    border: 1px solid $light_gray_blue_3;
    font-weight: bold;
    text-align: center;
    vertical-align: middle;
    color: $gray_blue_4;
  }
}
</style>
