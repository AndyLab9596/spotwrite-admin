<template>
  <div class="component-container">
    <Modal width="1100" :no-header="false" @close="$emit('close')">
      <div class="inner-container">
        <div class="left-pane">
          <div class="header">
            <div class="title">コミュニティにメンバーを追加</div>
            <div class="freeword-form">
              <input
                v-model="freeWord"
                class="freeword"
                placeholder="フリーワードで検索"
              />
              <SearchIcon
                color="#7E8195"
                class="icon"
                @click="onSearchIconClick"
              />
            </div>
          </div>
          <div class="content">
            <div class="settings">
              <div class="row group">
                メイン設定
                <BaseButton
                  class="reset-button"
                  inverse
                  @click="resetMainSetting()"
                >
                  リセット
                </BaseButton>
              </div>
              <div
                class="row"
                :class="openCompanySelect ? 'row--no-border' : ''"
                @click="toggleCompanyMenu"
              >
                <div class="label">会社</div>
                <div class="selection">
                  <div class="value">
                    <popper
                      trigger="hover"
                      :disabled="selectedCompaniesName.length <= 8"
                      :options="{
                        placement: 'bottom-start',
                        modifiers: { offset: { offset: '0,3px' } },
                      }"
                    >
                      <div class="popper-full">
                        {{ selectedCompaniesName }}
                      </div>
                      <span slot="reference">
                        {{ limitedString(selectedCompaniesName, 8) }}
                      </span>
                    </popper>
                  </div>
                  <img class="pink-arrow" src="/icon/arrow_right_pink.svg" />
                </div>
              </div>
              <div
                v-show="openCompanySelect"
                class="row row--selectbox-wrapper"
              >
                <select
                  v-model="selectedCompanyUuid"
                  class="selectbox"
                  @change="changeCompanySelect"
                >
                  <option value="" selected>会社名で絞り込む</option>
                  <option
                    v-for="company in companies"
                    :key="company.uuid"
                    :value="company.uuid"
                  >
                    {{ company.name }}
                  </option>
                </select>
              </div>

              <div
                class="row"
                :class="openOrganizationSelect ? 'row--no-border' : ''"
                @click="toggleOrganizationMenu"
              >
                <div class="label">組織</div>
                <div class="selection">
                  <div class="value">
                    <popper
                      trigger="hover"
                      :disabled="selectedOrganizationNames().length <= 8"
                      :options="{
                        placement: 'bottom-start',
                        modifiers: { offset: { offset: '0,3px' } },
                      }"
                    >
                      <div class="popper-full">
                        {{ selectedOrganizationNames() }}
                      </div>
                      <span slot="reference">
                        {{ limitedString(selectedOrganizationNames(), 8) }}
                      </span>
                    </popper>
                  </div>
                  <img class="pink-arrow" src="/icon/arrow_right_pink.svg" />
                </div>
              </div>
              <div
                v-show="openOrganizationSelect"
                class="row row--checkbox-wrapper"
              >
                <div
                  v-for="organization in organizations"
                  :key="organization.uuid"
                  class="organization-checkbox"
                >
                  <base-checkbox
                    v-model="selectedOrganizationUuids"
                    :value="organization.uuid"
                  />
                  <label>
                    <span v-if="organization.parent_name" class="small">
                      {{ organization.parent_name }}
                    </span>
                    {{ organization.name }}
                  </label>
                </div>
              </div>
              <div class="row group">
                詳細設定
                <BaseButton
                  class="reset-button"
                  inverse
                  @click="resetAdvancedSetting()"
                >
                  リセット
                </BaseButton>
              </div>

              <div
                class="row"
                :class="openPositionSelect ? 'row--no-border' : ''"
                @click="togglePositionMenu"
              >
                <div class="label">役職</div>
                <div class="selection">
                  <div class="value">
                    <popper
                      trigger="hover"
                      :disabled="selectedPositionName.length <= 8"
                      :options="{
                        placement: 'bottom-start',
                        modifiers: { offset: { offset: '0,3px' } },
                      }"
                    >
                      <div class="popper-full">
                        {{ selectedPositionName }}
                      </div>
                      <span slot="reference">
                        {{ limitedString(selectedPositionName, 8) }}
                      </span>
                    </popper>
                  </div>
                  <img class="pink-arrow" src="/icon/arrow_right_pink.svg" />
                </div>
              </div>
              <div
                v-show="openPositionSelect"
                class="row row--selectbox-wrapper"
              >
                <select v-model="selectedPositionUuid" class="selectbox">
                  <option value="" selected>役職で絞り込む</option>
                  <option
                    v-for="position in employment_positions"
                    :key="position.uuid"
                    :value="position.uuid"
                  >
                    {{ position.name }}
                  </option>
                </select>
              </div>

              <div
                class="row"
                :class="openStatusSelect ? 'row--no-border' : ''"
                @click="toggleEmploymentStatusMenu"
              >
                <div class="label">雇用形態</div>
                <div class="selection">
                  <div class="value">
                    <popper
                      trigger="hover"
                      :disabled="selectedStatusName.length <= 8"
                      :options="{
                        placement: 'bottom-start',
                        modifiers: { offset: { offset: '0,3px' } },
                      }"
                    >
                      <div class="popper-full">
                        {{ selectedStatusName }}
                      </div>
                      <span slot="reference">
                        {{ limitedString(selectedStatusName, 8) }}
                      </span>
                    </popper>
                  </div>
                  <img class="pink-arrow" src="/icon/arrow_right_pink.svg" />
                </div>
              </div>
              <div v-show="openStatusSelect" class="row row--selectbox-wrapper">
                <select
                  v-model="selectedEmploymentStatusUuid"
                  class="selectbox"
                >
                  <option value="" selected>雇用形態で絞り込む</option>
                  <option
                    v-for="status in employment_statuses"
                    :key="status.uuid"
                    :value="status.uuid"
                  >
                    {{ status.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="members">
              <div class="members__row members__row_select-all">
                <label for="select-all">全員を選択</label>
                <BaseCheckbox
                  id="select-all"
                  value="check-all"
                  :selected-values="selectedAll"
                  @change="onAllCheck($event)"
                />
              </div>
              <div v-if="organizationGroups.length">
                <div
                  v-for="organizationGroup in organizationGroups"
                  :key="organizationGroup.uuid"
                  class="members__group"
                >
                  <div class="members__row organization">
                    <div class="inner">
                      <div class="member">
                        <div class="left">
                          <img src="/icon/icon_nyusya.svg" class="icon" />
                        </div>
                        <div class="right">
                          <span class="small">
                            {{ organizationGroup.parent_name }}
                          </span>
                          {{ organizationGroup.name }}
                        </div>
                      </div>
                      <div>
                        <div
                          v-if="
                            isCheckedOrganizationGroup(organizationGroup.uuid)
                          "
                          class="checked-icon"
                          @click="
                            checkAllInOrganizationGroup(organizationGroup.uuid)
                          "
                        ></div>
                        <div
                          v-else
                          class="unchecked-icon"
                          @click="
                            checkAllInOrganizationGroup(organizationGroup.uuid)
                          "
                        ></div>
                      </div>
                      <button
                        class="button"
                        @click="
                          toggleOrganizationGroups(organizationGroup.uuid)
                        "
                      >
                        <img
                          v-if="
                            !organizationGroupUuids.includes(
                              organizationGroup.uuid
                            )
                          "
                          src="/icon/icon_open@2x.png"
                        />
                        <img
                          v-if="
                            organizationGroupUuids.includes(
                              organizationGroup.uuid
                            )
                          "
                          src="/icon/icon_hide@2x.png"
                        />
                      </button>
                    </div>
                  </div>
                  <template
                    v-if="
                      organizationGroupUuids.includes(organizationGroup.uuid)
                    "
                  >
                    <div
                      v-for="employee in organizationGroupEmployees(
                        organizationGroup.uuid
                      )"
                      :key="employee.uuid"
                      class="members__row"
                    >
                      <div class="member">
                        <div class="left">
                          <img :src="employee.user_icon" class="icon" />
                        </div>
                        <div class="right">
                          <div class="name">{{ employee.name }}</div>
                          <div class="org">
                            {{ employee.company_name }} |
                            {{ employee.organization_name }}
                          </div>
                        </div>
                      </div>
                      <div>
                        <BaseCheckbox
                          v-model="checkedEmployeeUuids"
                          :value="employee.uuid"
                        />
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <div
                v-for="employee in withoutGroupEmployees"
                :key="employee.uuid"
                class="members__row"
              >
                <div class="member">
                  <div class="left">
                    <img :src="employee.user_icon" class="icon" />
                  </div>
                  <div class="right">
                    <div class="name">{{ employee.name }}</div>
                    <div class="org">
                      {{ employee.company_name }} |
                      {{ employee.organization_name }}
                    </div>
                  </div>
                </div>
                <div>
                  <BaseCheckbox
                    v-model="checkedEmployeeUuids"
                    :value="employee.uuid"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right-pane">
          <div class="header">
            <span class="count">
              追加するメンバー（{{ selectedMembers.length }}名）
            </span>
          </div>
          <div class="content">
            <div class="right-pane__row right-pane__row--end">
              <BaseButton
                class="reset-button"
                inverse
                @click="onResetMembersButtonClick"
              >
                リセット
              </BaseButton>
            </div>
            <div v-if="selectedOrganizationGroups.length">
              <div
                v-for="organizationGroup in selectedOrganizationGroups"
                :key="organizationGroup.uuid"
                class="right-pane__group"
              >
                <div class="right-pane__row organization">
                  <div class="inner">
                    <div class="member">
                      <div class="left">
                        <img src="/icon/icon_nyusya.svg" class="icon" />
                      </div>
                      <div class="right">
                        <span class="small">
                          {{ organizationGroup.parent_name }}
                        </span>
                        {{ organizationGroup.name }}
                      </div>
                    </div>
                    <div
                      class="delete"
                      @click="
                        removeTargetOrganizationGroup(organizationGroup.uuid)
                      "
                    >
                      <svg
                        id="Group_7643"
                        data-name="Group 7643"
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
                        <line
                          id="Line_356"
                          data-name="Line 356"
                          x2="6"
                          y2="6"
                          transform="translate(5 5)"
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
                          transform="translate(5 5)"
                          fill="none"
                          stroke="#fff"
                          stroke-linecap="round"
                          stroke-miterlimit="10"
                          stroke-width="1.114"
                        />
                      </svg>
                    </div>
                    <button
                      class="button"
                      @click="
                        toggleSelectedOrganizationGroups(organizationGroup.uuid)
                      "
                    >
                      <img
                        v-if="
                          !selectedOrganizationGroupUuids.includes(
                            organizationGroup.uuid
                          )
                        "
                        src="/icon/icon_open@2x.png"
                      />
                      <img
                        v-if="
                          selectedOrganizationGroupUuids.includes(
                            organizationGroup.uuid
                          )
                        "
                        src="/icon/icon_hide@2x.png"
                      />
                    </button>
                  </div>
                </div>
                <template
                  v-if="
                    selectedOrganizationGroupUuids.includes(
                      organizationGroup.uuid
                    )
                  "
                >
                  <div
                    v-for="employee in selectedOrganizationGroupEmployees(
                      organizationGroup.uuid
                    )"
                    :key="employee.uuid"
                    class="right-pane__row"
                  >
                    <div class="member">
                      <div class="left">
                        <img :src="employee.user_icon" class="icon" />
                      </div>
                      <div class="right">
                        <div class="name">{{ employee.name }}</div>
                        <div class="org">
                          {{ employee.company_name }} |
                          {{ employee.organization_name }}
                        </div>
                      </div>
                    </div>
                    <div class="delete" @click="removeTargetUser(employee)">
                      <svg
                        id="Group_7643"
                        data-name="Group 7643"
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
                        <line
                          id="Line_356"
                          data-name="Line 356"
                          x2="6"
                          y2="6"
                          transform="translate(5 5)"
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
                          transform="translate(5 5)"
                          fill="none"
                          stroke="#fff"
                          stroke-linecap="round"
                          stroke-miterlimit="10"
                          stroke-width="1.114"
                        />
                      </svg>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div
              v-for="employee in withoutGroupSelectedMembers"
              :key="employee.uuid"
              class="right-pane__row"
            >
              <div class="member">
                <div class="left">
                  <img :src="employee.user_icon" class="icon" />
                </div>
                <div class="right">
                  <div class="name">{{ employee.name }}</div>
                  <div class="org">
                    {{ employee.company_name }} |
                    {{ employee.organization_name }}
                  </div>
                </div>
              </div>
              <div class="delete" @click="removeTargetUser(employee)">
                <svg
                  id="Group_7643"
                  data-name="Group 7643"
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
                  <line
                    id="Line_356"
                    data-name="Line 356"
                    x2="6"
                    y2="6"
                    transform="translate(5 5)"
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
                    transform="translate(5 5)"
                    fill="none"
                    stroke="#fff"
                    stroke-linecap="round"
                    stroke-miterlimit="10"
                    stroke-width="1.114"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <div class="footer">
          <div class="footer__settings">
            <BaseButton
              size="large"
              class="submit-setting-button"
              inverse
              @click="onSearchButtonClick"
            >
              設定する
            </BaseButton>
          </div>
          <div class="footer__members">
            <BaseButton
              :disabled="checkedEmployeeUuids.length === 0"
              size="large"
              inverse
              class="add-members-button"
              @click="onAddMembersButtonClick"
            >
              選択したメンバーを追加
            </BaseButton>
          </div>
          <div class="footer__right-pane">
            <BaseButton
              size="large"
              class="button cancel-button"
              @click="$emit('close')"
            >
              キャンセル
            </BaseButton>
            <BaseButton
              size="large"
              class="button submit-button"
              :disabled="selectedMembers.length === 0"
              @click="onOk"
            >
              追加する
            </BaseButton>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Popper from 'vue-popperjs';
import cloneDeep from 'lodash/cloneDeep';
import reject from 'lodash/reject';
import Modal from '@/components/App/atoms/modals/Modal.vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import BaseCheckbox from '@/components/App/atoms/buttons/BaseCheckbox.vue';
import SearchIcon from '@/components/App/atoms/icons/SearchIcon.vue';
import { fetchOrganizations } from '@/libs/api';
import {
  fetchEmploymentPositions,
  fetchEmploymentStatuses,
  organizations,
  searchEmployees,
} from '@/libs/api/app';

type OptionItem = {
  value: string;
  text: string;
};

const settingItemNames = [
  'companies',
  'organizations',
  'employment_positions',
  'employment_statuses',
] as const;

type SettingItemName = typeof settingItemNames[number];

const settingItemNamesMain: SettingItemName[] = ['companies', 'organizations'];
const settingItemNamesSub: SettingItemName[] = reject<SettingItemName>(
  settingItemNames,
  (n: SettingItemName) => settingItemNamesMain.includes(n)
);

type SettingItems = {
  [key in SettingItemName]: OptionItem[];
};

type SearchEmployeeRequest = AppApiRequest.SearchEmployeeRequest;
type Employee = AppApiResponse.User;

const emptyItems = {
  companies: [],
  organizations: [],
  employment_positions: [],
  employment_statuses: [],
};

type TargetTypeConfig = {
  [key: string]: { title: string; visibilities: string[] | undefined };
};

const targetTypeConfig: TargetTypeConfig = {
  publish: { title: '公開', visibilities: undefined },
};

type TargetType = keyof typeof targetTypeConfig;

export default Vue.extend({
  components: {
    Modal,
    BaseButton,
    BaseCheckbox,
    SearchIcon,
    Popper,
  },
  props: {
    type: {
      type: String as PropType<TargetType>,
      default: 'publish',
    },
  },
  data: () => ({
    isLoading: false as boolean,
    freeWord: '' as string,
    selectedCount: 0 as number,
    settingItem: undefined as SettingItemName | undefined,
    settingItemIndex: 0 as number,
    organizationsRelatedCompany: [] as [],
    companies: [] as { uuid: string; name: string }[],
    organizations: [] as {
      uuid: string;
      name: string;
      parent_name?: string;
    }[],
    employment_positions: [] as { uuid: string; name: string }[],
    employment_statuses: [] as { uuid: string; name: string }[],
    employees: [] as Employee[],
    selectedAll: [] as string[],
    checkedEmployeeUuids: [] as string[],
    selectedMembers: [] as Employee[],
    selectedCompanyUuid: '' as string,
    selectedOrganizationUuids: [] as string[],
    selectedPositionUuid: '' as string,
    selectedEmploymentStatusUuid: '' as string,
    organizationGroups: [] as {
      uuid: string;
      name: string;
      parent_name?: string;
    }[],
    organizationGroupUuids: [] as string[],
    selectedOrganizationGroups: [] as {
      uuid: string;
      name: string;
      parent_name?: string;
    }[],
    selectedOrganizationGroupUuids: [] as string[],
    openCompanySelect: false,
    openOrganizationSelect: false,
    openPositionSelect: false,
    openStatusSelect: false,
  }),
  computed: {
    visibilities(): string[] {
      const visibilities =
        this.type in targetTypeConfig
          ? targetTypeConfig[this.type].visibilities
          : undefined;
      if (visibilities === undefined) {
        return Object.keys(emptyItems);
      }
      return visibilities;
    },
    settingItemNamesMain(): SettingItemName[] {
      return settingItemNamesMain;
    },
    settingItemNamesSub(): SettingItemName[] {
      return settingItemNamesSub;
    },
    emptyItems(): SettingItems {
      return cloneDeep(emptyItems);
    },
    selectedCompaniesName(): string {
      if (this.selectedCompanyUuid === '') {
        return '選択なし';
      }
      const selectedCompany = this.companies.filter((company: object) => {
        return this.selectedCompanyUuid === company.uuid;
      });
      return selectedCompany[0].name;
    },
    selectedPositionName(): string {
      const selectedPosition = this.employment_positions.filter(
        (position: object) => {
          return this.selectedPositionUuid === position.uuid;
        }
      );
      return selectedPosition.length >= 1
        ? selectedPosition[0].name
        : '選択なし';
    },
    selectedStatusName(): string {
      const selectedStatus = this.employment_statuses.filter(
        (status: object) => {
          return this.selectedEmploymentStatusUuid === status.uuid;
        }
      );
      return selectedStatus.length >= 1 ? selectedStatus[0].name : '選択なし';
    },
    withoutGroupEmployees(): Employee[] {
      if (this.organizationGroups.length) {
        return this.employees.filter(
          (employee: Employee) =>
            !this.organizationGroups.filter(
              (organizationGroup: object) =>
                organizationGroup.uuid === employee.organization_uuid
            ).length
        );
      }
      return this.employees;
    },
    withoutGroupSelectedMembers(): Employee[] {
      if (this.selectedOrganizationGroups.length) {
        return this.selectedMembers.filter(
          (employee: Employee) =>
            !this.selectedOrganizationGroups.filter(
              (organizationGroup: object) =>
                organizationGroup.uuid === employee.organization_uuid
            ).length
        );
      }
      return this.selectedMembers;
    },
  },
  watch: {
    checkedEmployeeUuids(values: string[]) {
      if (
        this.employees.length !== 0 &&
        values.length === this.employees.length
      ) {
        this.selectedAll = ['check-all'];
      } else {
        this.selectedAll = [];
      }
    },
    organizations() {
      this.selectedOrganizationUuids = [];
    },
  },
  created(): void {
    this.fetchCompanies();
    this.fetchEmploymentPositions();
    this.fetchEmploymentStatuses();
  },
  methods: {
    onOk(): void {
      const uuidList = this.selectedMembers.map((user: object) => {
        return user.uuid;
      });
      this.$emit('submit', uuidList);
    },
    onSearchIconClick(): void {
      this.searchEmployees({ free_word: this.freeWord });
    },
    onAddMembersButtonClick(): void {
      this.selectedMembers = this.employees.filter((employee: Employee) =>
        this.checkedEmployeeUuids.includes(employee.uuid)
      );
      this.selectedOrganizationGroups = this.organizationGroups.filter(
        (organizationGroup: object) =>
          this.isCheckedOrganizationGroup(organizationGroup.uuid)
      );
      this.checkedEmployeeUuids = [];
      this.employees = [];
      this.selectedAll = [];
      this.organizationGroups = [];
      this.organizationGroupUuids = [];
    },
    resetMainSetting(): void {
      this.selectedCompanyUuid = '';
      this.organizations = [];
      this.openOrganizationSelect = false;
    },
    resetAdvancedSetting(): void {
      this.selectedPositionUuid = '';
      this.selectedEmploymentStatusUuid = '';
    },
    onSearchButtonClick(): void {
      this.searchEmployees(this.createRequestBody());
    },
    createRequestBody(): SearchEmployeeRequest {
      const filter = {
        companies:
          this.selectedCompanyUuid !== ''
            ? [this.selectedCompanyUuid]
            : undefined,
        organizations:
          this.selectedOrganizationUuids.length >= 1
            ? this.selectedOrganizationUuids
            : undefined,
        employment_positions:
          this.selectedPositionUuid !== ''
            ? [this.selectedPositionUuid]
            : undefined,
        employment_statuses:
          this.selectedEmploymentStatusUuid !== ''
            ? [this.selectedEmploymentStatusUuid]
            : undefined,
      };
      return { filter };
    },
    onAllCheck(values: string[]): void {
      if (values.length > 0) {
        this.checkedEmployeeUuids = this.employees.map((e: Employee) => e.uuid);
      } else {
        this.checkedEmployeeUuids = [];
      }
    },
    onResetMembersButtonClick(): void {
      this.checkedEmployeeUuids = [];
      this.selectedOrganizationGroups = [];
      this.selectedMembers = [];
    },
    selectedOrganizationNames(): string {
      if (this.selectedOrganizationUuids.length === 0) {
        return '選択なし';
      }
      const organizationObjects = this.organizations.filter(
        (o: organization) => {
          return this.selectedOrganizationUuids.includes(o.uuid);
        }
      );
      return organizationObjects.map((o: organization) => o.name).join('、');
    },
    organizationGroupEmployees(organizationUuid: string): Employee[] {
      return this.employees.filter(
        (employee: Employee) => employee.organization_uuid === organizationUuid
      );
    },
    selectedOrganizationGroupEmployees(organizationUuid: string): Employee[] {
      return this.selectedMembers.filter(
        (employee: Employee) => employee.organization_uuid === organizationUuid
      );
    },
    toggleOrganizationGroups(uuid: string): void {
      if (this.organizationGroupUuids.includes(uuid)) {
        this.organizationGroupUuids = this.organizationGroupUuids.filter(
          (organizationUuid: string) => organizationUuid !== uuid
        );
      } else {
        this.organizationGroupUuids = [...this.organizationGroupUuids, uuid];
      }
    },
    toggleSelectedOrganizationGroups(uuid: string): void {
      if (this.selectedOrganizationGroupUuids.includes(uuid)) {
        this.selectedOrganizationGroupUuids = this.selectedOrganizationGroupUuids.filter(
          (organizationUuid: string) => organizationUuid !== uuid
        );
      } else {
        this.selectedOrganizationGroupUuids = [
          ...this.selectedOrganizationGroupUuids,
          uuid,
        ];
      }
    },
    isCheckedOrganizationGroup(uuid: string): boolean {
      const totalEmployees = this.employees.filter(
        (employee: Employee) => employee.organization_uuid === uuid
      );
      const checkedEmployees = totalEmployees.filter((employee: Employee) =>
        this.checkedEmployeeUuids.includes(employee.uuid)
      );
      return totalEmployees.length === checkedEmployees.length;
    },
    checkAllInOrganizationGroup(uuid: string): boolean {
      const totalEmployees = this.employees.filter(
        (employee: Employee) => employee.organization_uuid === uuid
      );
      if (this.isCheckedOrganizationGroup(uuid)) {
        totalEmployees.forEach((employee: Employee) => {
          if (this.checkedEmployeeUuids.includes(employee.uuid)) {
            this.checkedEmployeeUuids = this.checkedEmployeeUuids.filter(
              (checkedUuid: string) => checkedUuid !== employee.uuid
            );
          }
        });
      } else {
        totalEmployees.forEach((employee: Employee) => {
          if (!this.checkedEmployeeUuids.includes(employee.uuid)) {
            this.checkedEmployeeUuids = [
              ...this.checkedEmployeeUuids,
              employee.uuid,
            ];
          }
        });
      }
    },
    async fetchCompanies(): Promise<void> {
      this.isLoading = true;
      try {
        const { data } = await organizations({ type: 'company' });
        this.companies = data.organizations;
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchOrganizations(uuid: string): Promise<void> {
      if (uuid === '') {
        this.organizations = [];
        return;
      }
      this.isLoading = true;
      try {
        const { data } = await fetchOrganizations({
          independent: 'true',
          company_uuid: uuid,
        });
        this.organizations = data.organizations;
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchEmploymentPositions(): Promise<void> {
      this.isLoading = true;
      try {
        const { data } = await fetchEmploymentPositions();
        this.employment_positions = data.employment_positions;
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchEmploymentStatuses(): Promise<void> {
      this.isLoading = true;
      try {
        const { data } = await fetchEmploymentStatuses();
        this.employment_statuses = data.employment_statuses;
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
    async searchEmployees(payload: SearchEmployeeRequest): Promise<void> {
      this.checkedEmployeeUuids = [];
      this.employees = [];
      this.selectedAll = [];
      this.organizationGroups = [];
      this.organizationGroupUuids = [];
      try {
        const { data } = await searchEmployees(payload);
        this.employees = data.users;
        if (payload.filter.companies || payload.filter.organizations) {
          const filterOrganizations = payload.filter.companies
            ? this.organizations.map((o: any) => o.uuid)
            : payload.filter.organizations;
          this.organizationGroups = this.organizations.filter(
            (o: organization) =>
              filterOrganizations.includes(o.uuid) &&
              this.employees.filter(
                (employee: Employee) => employee.organization_uuid === o.uuid
              ).length
          );
        }
      } catch (e) {
        console.error(e);
      }
    },
    removeTargetUser(user: object) {
      const targetOrganizationGroup = this.selectedOrganizationGroups.filter(
        (organizationGroup: object) =>
          organizationGroup.uuid === user.organization_uuid &&
          this.selectedOrganizationGroupEmployees(organizationGroup.uuid)
            .length <= 1
      );
      if (targetOrganizationGroup.length) {
        this.removeTargetOrganizationGroup(targetOrganizationGroup[0].uuid);
        return;
      }
      this.selectedMembers = this.selectedMembers.filter(
        (employee: Employee) => employee.uuid !== user.uuid
      );
    },
    removeTargetOrganizationGroup(organizationUuid: string) {
      this.selectedMembers = this.selectedMembers.filter(
        (employee: Employee) => employee.organization_uuid !== organizationUuid
      );
      this.selectedOrganizationGroups = this.selectedOrganizationGroups.filter(
        (organizationGroup: object) => {
          return organizationGroup.uuid !== organizationUuid;
        }
      );
    },
    async changeCompanySelect(): void {
      if (!this.selectedCompanyUuid) {
        this.openOrganizationSelect = false;
      }
      this.organizationsRelatedCompany = await this.fetchOrganizations(
        this.selectedCompanyUuid
      );
    },
    toggleCompanyMenu(): void {
      this.openCompanySelect = !this.openCompanySelect;
    },
    toggleOrganizationMenu(): void {
      if (this.openOrganizationSelect || this.organizations.length) {
        this.openOrganizationSelect = !this.openOrganizationSelect;
      }
    },
    togglePositionMenu(): void {
      this.openPositionSelect = !this.openPositionSelect;
    },
    toggleEmploymentStatusMenu(): void {
      this.openStatusSelect = !this.openStatusSelect;
    },
    limitedString(input: string, limit: number = 8): string {
      let output = input;
      if (output.length > limit) {
        output = output.slice(0, limit).concat('...');
      }
      return output;
    },
  },
});
</script>

<style lang="scss" scoped>
.component-container {
  color: $main_color;
}

.inner-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 200px);
  font-size: 15px;
}

.link,
.em-on-hover:hover,
.em-on-hover.is-open {
  color: $link_color;
  cursor: pointer;
}

.member {
  display: flex;

  .left {
    width: 32px;
    height: 32px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 12px;

      &.icon {
        object-fit: cover;
      }
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    margin-left: 8px;

    .name {
      font-size: 13px;
      line-height: 1;
      margin-bottom: 5px;
    }

    .org {
      font-size: 11px;
      color: $sub_color;
      line-height: 1;
    }
  }
}

.left-pane {
  display: flex;
  flex-direction: column;

  .header {
    flex-shrink: 0;
    display: flex;
    border-bottom: 1px solid $ruled_line;
    height: 87px;
    align-items: center;
    border-right: 1px solid $light_gray_blue_6;

    .title {
      font-size: 15px;
      font-weight: 600;
      color: $main_color;
      margin-left: 32px;
    }

    .freeword-form {
      position: relative;

      .freeword {
        width: 360px;
        height: 52px;
        margin-left: 32px;
        padding: 0 44px 0 18px;
        border: 1px solid $light_gray_blue_6;
        border-radius: 4px;
        font-size: 15px;

        &::placeholder {
          color: rgba($placeholder_gray_2, 0.5);
        }
      }

      .icon {
        position: absolute;
        top: 18px;
        right: 18px;
        cursor: pointer;
      }
    }
  }

  .content {
    flex-grow: 1;
    display: flex;
    overflow: hidden;

    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 32px;
      border-bottom: 1px solid $ruled_line;
      height: 65px;

      &.group {
        padding-left: 16px;
        background-color: $white_1;
        font-weight: 600;
        color: $gentle_bluish_purple;
      }

      .selection {
        display: flex;
        align-items: center;

        img {
          margin-left: 9px;
        }

        .value {
          .popper-full {
            background-color: $true_white;
            font-size: 13px;
            line-height: 1.8;
            color: $dark_blue;
            border: 1px solid $light_gray_blue_3;
            padding: 10px;
            pointer-events: none;
            max-width: 350px;
          }
        }
      }

      &--no-border {
        border: none;
      }

      &--selectbox-wrapper {
        height: 85px;
        align-items: start;
      }

      &--checkbox-wrapper {
        display: block;
        height: 170px;
        overflow-y: auto;
      }
    }
  }
}

.settings {
  width: 324px;
  border-right: 1px solid #e8ebed;
  overflow-y: auto;
}

.members {
  width: 324px;
  border-right: 1px solid #e8ebed;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #7e8195 white;

  .members__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    border-bottom: 1px solid $ruled_line;
    height: 56px;

    &_select-all {
      justify-content: flex-end;

      label {
        margin-right: 8px;
      }
    }
  }
}

.members::-webkit-scrollbar {
  width: 4px;
  height: 0;
}

.members::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #7e8195;
}

.right-pane {
  display: flex;
  flex-direction: column;
  width: 448px;
  background-color: rgba($ruled_line, 0.3);

  .header {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid $ruled_line;
    height: 87px;

    .count {
      font-weight: bold;
      color: $gray_blue_4;
    }
  }

  .right-pane__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    border-bottom: 1px solid $ruled_line;
    height: 56px;

    &_select-all {
      justify-content: flex-end;

      label {
        margin-right: 8px;
      }
    }

    &--end {
      flex-shrink: 0;
      display: flex;
      justify-content: flex-end;
    }

    .delete {
      cursor: pointer;

      svg {
        display: block;
      }
    }
  }

  .content {
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #7e8195 white;
  }

  .content::-webkit-scrollbar {
    width: 4px;
    height: 0;
  }

  .content::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #7e8195;
  }
}

.footer {
  display: flex;
  align-items: center;
  width: 100%;
  height: 92px;

  .footer__settings {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 324px;
    border-right: 1px solid $ruled_line;
  }

  .footer__members {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 324px;
    border-right: 1px solid $ruled_line;
  }

  .footer__right-pane {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 448px;

    .cancel-button {
      width: 200px;
      margin-right: 10px;
      background: $true_white;
      color: $gray_blue_4;
      border: 1px solid $light_gray_blue_6;

      &:hover {
        background-color: $light_gray_blue_8;
      }
    }

    .submit-button {
      width: 200px;

      &:hover {
        background-color: $gray_blue_4;
      }
    }
  }
}

.submit-setting-button {
  width: 250px;
  height: 40px;

  &:hover {
    background-color: $light_gray_blue_8;
  }
}

.add-members-button {
  width: 250px;

  &:hover {
    background-color: $light_gray_blue_8;
  }
}

.modal /deep/ .modal-footer {
  padding: 0;
}

.selectbox {
  width: 100%;
  height: 40px;
  color: #6a6d83;
  border: 1px solid #e4e5ed;
  border-radius: 4px;
  appearance: none;
  background: url('/icon/icon_pulldown.svg') no-repeat right 8px center;
  background-size: 10px 8px;
  padding: 0 8px;
  margin-top: 15px;
}

.organization-checkbox {
  height: 30px;

  .small {
    font-size: 11px;
    color: $gray_blue_1;
  }
}

.pink-arrow {
  transform: rotate(90deg);
}

.reset-button {
  &:hover {
    background-color: $light_gray_blue_8;
  }
}

.members__group .members__row.organization {
  padding: 12px;
  height: unset;
}

.members__group .members__row.organization .inner {
  display: flex;
  align-items: center;
  flex-grow: 1;
  position: relative;
  height: 56px;
  padding: 0 15px;
  background: #edeff7;
  border-radius: 4px;
}

.members__group .members__row.organization .member {
  flex-grow: 1;
}

.members__group .members__row.organization .left {
  padding: 5px;
  border-radius: 50%;
  background: $true_white;
}

.members__group .members__row.organization .left img {
  border-radius: unset;
}

.members__group .members__row.organization .right {
  flex-direction: unset;
  flex-grow: 1;
  align-items: center;
  margin-right: 10px;
  font-weight: bold;
}

.members__group .members__row.organization .right .small {
  font-size: 11px;
  color: $gray_blue_1;
  margin-right: 3px;
}

.members__group .members__row.organization .button {
  position: absolute;
  left: 50%;
  top: 100%;
  padding: 0;
  transform: translate(-50%, -50%);
  background: transparent;
  border: none;
}

.members__group .members__row.organization .checked-icon {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: $link_color;
  position: relative;
  cursor: pointer;
}

.members__group .members__row.organization .unchecked-icon {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: $true_white;
  border: 1px solid $button_background_color;
  cursor: pointer;
}

.members__group .members__row.organization .checked-icon::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 3px;
  width: 6px;
  height: 2px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  transform: rotate(45deg);
  background: $true_white;
}

.members__group .members__row.organization .checked-icon::after {
  content: '';
  position: absolute;
  top: 7px;
  left: 6px;
  width: 8px;
  height: 2px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  transform: rotate(-45deg);
  background: $true_white;
}

.right-pane__group .right-pane__row.organization {
  padding: 12px;
  height: unset;
}

.right-pane__group .right-pane__row.organization .inner {
  display: flex;
  align-items: center;
  flex-grow: 1;
  position: relative;
  height: 56px;
  padding: 0 15px;
  background: #edeff7;
  border-radius: 4px;
}

.right-pane__group .right-pane__row.organization .member {
  flex-grow: 1;
}

.right-pane__group .right-pane__row.organization .left {
  padding: 5px;
  border-radius: 50%;
  background: $true_white;
}

.right-pane__group .right-pane__row.organization .left img {
  border-radius: unset;
}

.right-pane__group .right-pane__row.organization .right {
  flex-direction: unset;
  flex-grow: 1;
  align-items: center;
  margin-right: 10px;
  font-weight: bold;
}

.right-pane__group .right-pane__row.organization .right .small {
  font-size: 11px;
  color: $gray_blue_1;
  margin-right: 3px;
}

.right-pane__group .right-pane__row.organization .button {
  position: absolute;
  left: 50%;
  top: 100%;
  padding: 0;
  transform: translate(-50%, -50%);
  background: transparent;
  border: none;
}

.right-pane__group .right-pane__row.organization .checked-icon {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: $link_color;
  position: relative;
  cursor: pointer;
}
</style>
