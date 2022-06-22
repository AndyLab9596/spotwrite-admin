<template>
  <div class="component-container">
    <Modal width="1100" no-header @close="onCloseSelectModal()">
      <div class="inner-container">
        <div class="left-pane">
          <div class="header">
            <div class="title">{{ title }}設定</div>
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
              <div class="row">
                <div class="label">保存した{{ title }}設定</div>
                <div class="selection" @click="openSelection('settings')">
                  <div class="value">{{ selectedValues('settings') }}</div>
                  <img src="/icon/arrow_right_pink.svg" />
                </div>
              </div>
              <div class="row group">
                メイン設定
                <BaseButton
                  inverse
                  class="button--gray"
                  @click="onResetButtonClick(settingItemNamesMain)"
                >
                  リセット
                </BaseButton>
              </div>
              <div class="row">
                <div class="label">会社</div>
                <div class="selection" @click="openSelection('companies')">
                  <popper
                    trigger="hover"
                    :disabled="selectedValues('companies').length <= 8"
                    :options="{
                      placement: 'bottom-start',
                      modifiers: { offset: { offset: '0,3px' } },
                    }"
                  >
                    <div class="popper-full">
                      {{ selectedValues('companies') }}
                    </div>
                    <div slot="reference" class="value">
                      {{ limitedString(selectedValues('companies'), 8) }}
                    </div>
                  </popper>
                  <img src="/icon/arrow_right_pink.svg" />
                </div>
              </div>
              <div class="row">
                <div class="label">組織</div>
                <div class="selection" @click="openSelection('organizations')">
                  <popper
                    trigger="hover"
                    :disabled="selectedValues('organizations').length <= 8"
                    :options="{
                      placement: 'bottom-start',
                      modifiers: { offset: { offset: '0,3px' } },
                    }"
                  >
                    <div class="popper-full">
                      {{ selectedValues('organizations') }}
                    </div>
                    <div slot="reference" class="value">
                      {{ limitedString(selectedValues('organizations'), 8) }}
                    </div>
                  </popper>
                  <img src="/icon/arrow_right_pink.svg" />
                </div>
              </div>
              <div class="row group">
                詳細設定
                <BaseButton
                  class="button--gray"
                  inverse
                  @click="onResetButtonClick(settingItemNamesSub)"
                >
                  リセット
                </BaseButton>
              </div>
              <div class="row">
                <div class="label">役職</div>
                <!-- eslint-disable-next-line prettier/prettier -->
                <div
                  class="selection"
                  @click="openSelection('employment_positions')"
                >
                  <popper
                    trigger="hover"
                    :disabled="
                      selectedValues('employment_positions').length <= 8
                    "
                    :options="{
                      placement: 'bottom-start',
                      modifiers: { offset: { offset: '0,3px' } },
                    }"
                  >
                    <div class="popper-full">
                      {{ selectedValues('employment_positions') }}
                    </div>
                    <div slot="reference" class="value">
                      {{
                        limitedString(selectedValues('employment_positions'), 8)
                      }}
                    </div>
                  </popper>
                  <img src="/icon/arrow_right_pink.svg" />
                </div>
              </div>
              <div class="row">
                <div class="label">雇用形態</div>
                <div
                  class="selection"
                  @click="openSelection('employment_statuses')"
                >
                  <popper
                    trigger="hover"
                    :disabled="
                      selectedValues('employment_statuses').length <= 8
                    "
                    :options="{
                      placement: 'bottom-start',
                      modifiers: { offset: { offset: '0,3px' } },
                    }"
                  >
                    <div class="popper-full">
                      {{ selectedValues('employment_statuses') }}
                    </div>
                    <div slot="reference" class="value">
                      {{
                        limitedString(selectedValues('employment_statuses'), 8)
                      }}
                    </div>
                  </popper>
                  <img src="/icon/arrow_right_pink.svg" />
                </div>
              </div>
              <div class="row">
                <div class="label">職種</div>
                <div class="selection" @click="openSelection('job_types')">
                  <popper
                    trigger="hover"
                    :disabled="selectedValues('job_types').length <= 8"
                    :options="{
                      placement: 'bottom-start',
                      modifiers: { offset: { offset: '0,3px' } },
                    }"
                  >
                    <div class="popper-full">
                      {{ selectedValues('job_types') }}
                    </div>
                    <div slot="reference" class="value">
                      {{ limitedString(selectedValues('job_types'), 8) }}
                    </div>
                  </popper>
                  <img src="/icon/arrow_right_pink.svg" />
                </div>
              </div>
              <div v-if="visibilities.includes('birthday')" class="row">
                <div class="label">生年月日</div>
                <div class="selection">
                  <div class="value date-range">
                    <div class="form-container">
                      <span
                        class="em-on-hover"
                        :class="{
                          'is-open': isDateRangeModalVisible['birthday'][0],
                        }"
                        @click="onDateClick('birthday', 0)"
                      >
                        {{ selectedDate('birthday', 0) }}
                      </span>
                      <div
                        v-if="isDateRangeModalVisible['birthday'][0]"
                        class="date-picker-container"
                      >
                        <DatePicker
                          type="timestamp"
                          :value="
                            selectedItems['birthday'][0].value !== ''
                              ? selectedItems['birthday'][0].value
                              : undefined
                          "
                          @input="onDatePick('birthday', 0, $event)"
                        />
                      </div>
                    </div>
                    〜
                    <div class="form-container">
                      <span
                        class="em-on-hover"
                        :class="{
                          'is-open': isDateRangeModalVisible['birthday'][1],
                        }"
                        @click="onDateClick('birthday', 1)"
                      >
                        {{ selectedDate('birthday', 1) }}
                      </span>
                      <div
                        v-if="isDateRangeModalVisible['birthday'][1]"
                        class="date-picker-container"
                      >
                        <DatePicker
                          type="timestamp"
                          :value="
                            selectedItems['birthday'][1].value !== ''
                              ? selectedItems['birthday'][1].value
                              : undefined
                          "
                          @input="onDatePick('birthday', 1, $event)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="visibilities.includes('gender')" class="row">
                <div class="label">性別</div>
                <div class="selection" @click="openSelection('gender')">
                  <div class="value">{{ selectedValues('gender') }}</div>
                  <img src="/icon/arrow_right_pink.svg" />
                </div>
              </div>
              <div v-if="visibilities.includes('latest_access')" class="row">
                <div class="label">最終アクセス</div>
                <div class="selection" @click="openSelection('latest_access')">
                  <div class="value">{{ selectedValues('latest_access') }}</div>
                  <img src="/icon/arrow_right_pink.svg" />
                </div>
              </div>
              <div v-if="visibilities.includes('joined_on')" class="row">
                <div class="label">入社日</div>
                <div class="selection">
                  <div class="value date-range">
                    <div class="form-container">
                      <span
                        class="em-on-hover"
                        :class="{
                          'is-open': isDateRangeModalVisible['joined_on'][0],
                        }"
                        @click="onDateClick('joined_on', 0)"
                      >
                        {{ selectedDate('joined_on', 0) }}
                      </span>
                      <div
                        v-if="isDateRangeModalVisible['joined_on'][0]"
                        class="date-picker-container"
                      >
                        <DatePicker
                          type="timestamp"
                          :value="
                            selectedItems['joined_on'][0].value !== ''
                              ? selectedItems['joined_on'][0].value
                              : undefined
                          "
                          @input="onDatePick('joined_on', 0, $event)"
                        />
                      </div>
                    </div>
                    〜
                    <div class="form-container">
                      <span
                        class="em-on-hover"
                        :class="{
                          'is-open': isDateRangeModalVisible['joined_on'][1],
                        }"
                        @click="onDateClick('joined_on', 1)"
                      >
                        {{ selectedDate('joined_on', 1) }}
                      </span>
                      <div
                        v-if="isDateRangeModalVisible['joined_on'][1]"
                        class="date-picker-container"
                      >
                        <DatePicker
                          type="timestamp"
                          :value="
                            selectedItems['joined_on'][1].value !== ''
                              ? selectedItems['joined_on'][1].value
                              : undefined
                          "
                          @input="onDatePick('joined_on', 1, $event)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="visibilities.includes('post_rules')" class="row">
                <div class="label">投稿ルール</div>
                <div class="selection" @click="openSelection('post_rules')">
                  <div class="value">{{ selectedValues('post_rules') }}</div>
                  <img src="/icon/arrow_right_pink.svg" />
                </div>
              </div>
              <div class="row">
                <div class="center">
                  <span class="link" @click="onSaveSettingButtonClick">
                    {{ title }}設定の保存する
                  </span>
                </div>
                <div>
                  <BaseButton
                    class="button--gray"
                    size="large"
                    inverse
                    @click="onSearchButtonClick"
                  >
                    検索
                  </BaseButton>
                </div>
              </div>
            </div>
            <div v-if="!isLoading" class="members">
              <div class="row">
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
                  <div
                    class="members__row organization"
                    :class="{
                      'is-selected': isDisabledGroup(organizationGroup.uuid),
                    }"
                  >
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
                      class="row members__row"
                    >
                      <div
                        class="member"
                        :class="{
                          'is-selected': selectedPublicMembersUUID.includes(
                            employee.uuid
                          ),
                        }"
                      >
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
                          :disabled="
                            selectedPublicMembersUUID.includes(employee.uuid)
                          "
                        />
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <div
                v-for="employee in employeeWithOutOrganizations"
                :key="employee.uuid"
                class="row members__row"
              >
                <div
                  class="member"
                  :class="{
                    'is-selected': selectedPublicMembersUUID.includes(
                      employee.uuid
                    ),
                  }"
                >
                  <div class="left">
                    <img :src="employee.user_icon" class="icon" />
                  </div>
                  <div class="right">
                    <div class="name">{{ employee.name }}</div>
                    <div class="org">
                      {{ employee.organization_name }}
                    </div>
                  </div>
                </div>
                <div>
                  <BaseCheckbox
                    v-model="checkedEmployeeUuids"
                    :value="employee.uuid"
                    :disabled="
                      selectedPublicMembersUUID.includes(employee.uuid)
                    "
                  />
                </div>
              </div>
              <div class="row center">
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
            </div>
            <vue-loading
              v-if="isLoading"
              type="spin"
              color="#333"
              :size="{ width: '50px', height: '50px' }"
              :style="{ marginTop: '100px' }"
            ></vue-loading>
          </div>
        </div>
        <div class="right-pane">
          <div class="header">
            <img src="/icon/icon-invitation_white.svg" />
            <span class="count">
              招待するメンバー（{{ selectedMembers.length }}名）
            </span>
          </div>
          <div class="content">
            <div class="row end">
              <BaseButton
                class="button--gray"
                inverse
                @click="onResetMembersButtonClick"
              >
                リセット
              </BaseButton>
            </div>
            <div class="members">
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
                          toggleSelectedOrganizationGroups(
                            organizationGroup.uuid
                          )
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
                      class="row members__row"
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
                      <div
                        class="delete"
                        @click="removeSelectedUser(employee.uuid)"
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
                    </div>
                  </template>
                </div>
              </div>
              <div
                v-for="employee in withoutGroupSelectedMembers"
                :key="employee.uuid"
                class="row members__row"
              >
                <div class="member">
                  <div class="left">
                    <img :src="employee.user_icon" class="icon" />
                  </div>
                  <div class="right">
                    <div class="name">{{ employee.name }}</div>
                    <div class="org">
                      {{ employee.organization_name }}
                    </div>
                  </div>
                  <div class="remove">
                    <img
                      src="/app/icon/Icon-delete.svg"
                      class="user-remove-icon"
                      @click="removeSelectedUser(employee.uuid)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <div class="footer">
          <BaseButton
            inverse
            size="large"
            class="button button--gray"
            @click="$emit('close')"
          >
            キャンセル
          </BaseButton>
          <BaseButton
            inverse
            size="large"
            class="button button--gray"
            :disabled="selectedMembers.length === 0"
            @click="onOk"
          >
            決定
          </BaseButton>
        </div>
      </template>
    </Modal>
    <OptionModal
      v-if="isSelectionModalVisible && options.length > 0"
      v-model="selectedItems[settingItem]"
      :multiple="isSelectionModalMultiple"
      :options="options"
      :reset-value="emptyItems[settingItem]"
      @close="isSelectionModalVisible = false"
      @input="onOptionsSelect"
    />
    <Modal
      v-if="isSaveSettingModalVisible"
      no-header
      class="save-setting-modal"
      @close="isSaveSettingModalVisible = false"
    >
      <ValidationObserver v-slot="{ invalid, passes }" class="inner-container">
        <template
          v-if="selectedItems.settings && selectedItems.settings.length"
        >
          <OutlinedTextField
            v-model="generalSettingForm.name"
            input-name="generalSettingName"
            class="text-field"
            rules="required"
          />
        </template>
        <template v-else>
          <OutlinedTextField
            v-model="generalSettingForm.name"
            input-name="generalSettingName"
            class="text-field"
            placeholder="名称"
            rules="required"
          />
        </template>
        <BaseButton
          size="large"
          :disabled="invalid"
          @click="passes(onDoSaveSettingButtonClick)"
        >
          保存
        </BaseButton>
      </ValidationObserver>
    </Modal>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import reject from 'lodash/reject';
import { ValidationObserver } from 'vee-validate';
import dayjs from '@/libs/dayjs';
import { VueLoading } from 'vue-loading-template';
import Modal from '@/components/App/atoms/modals/Modal.vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import OptionModal from '@/components/App/organisms/common/SelectMembersModal/OptionsModal.vue';
import DatePicker from '@/components/App/molecules/datepicker/DatePicker.vue';
import BaseCheckbox from '@/components/App/atoms/buttons/BaseCheckbox.vue';
import OutlinedTextField from '@/components/App/atoms/textFields/OutlinedTextField.vue';
import SearchIcon from '@/components/App/atoms/icons/SearchIcon.vue';
import Popper from 'vue-popperjs';
import {
  fetchEmploymentPositions,
  fetchEmploymentStatuses,
  fetchGeneralSetting,
  fetchGeneralSettings,
  fetchJobTypes,
  organizations,
  searchEmployees,
  storeGeneralSetting,
  updateGeneralSetting,
} from '@/libs/api/app';
import { fetchOrganizations } from '@/libs/api';
import { enumGenderTypes } from '@/libs/definition';

type OptionItem = {
  value: string;
  text: string;
  label?: string;
};

const settingItemNames = [
  'settings',
  'companies',
  'organizations',
  'employment_positions',
  'employment_statuses',
  'job_types',
  'birthday',
  'gender',
  'latest_access',
  'joined_on',
  'post_rules',
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

const settingItemNamesDate = ['birthday', 'joined_on'] as const;
type SettingItemNameDate = typeof settingItemNamesDate[number];

type DateRangeModalVisibilities = {
  [K in SettingItemNameDate]: boolean[];
};

type SearchEmployeeRequest = AppApiRequest.SearchEmployeeRequest;
type Employee = AppApiResponse.User;
type GeneralSetting = AppApiResponse.GeneralSetting;
type GeneralSettingContent = AppApiResponse.GeneralSettingContent & {
  [key: string]: string[] | number[] | string | undefined;
};

const emptyItems = {
  settings: [],
  companies: [],
  organizations: [],
  employment_positions: [],
  employment_statuses: [],
  job_types: [],
  birthday: [
    { value: '', text: '' },
    { value: '', text: '' },
  ],
  gender: [],
  latest_access: [],
  joined_on: [
    { value: '', text: '' },
    { value: '', text: '' },
  ],
  post_rules: [],
};

type TargetTypeConfig = {
  [key: string]: { title: string; visibilities: string[] | undefined };
};

const targetTypeConfig: TargetTypeConfig = {
  publish: { title: '公開', visibilities: undefined },
  invitation: {
    title: 'イベント招待',
    visibilities: [
      'companies',
      'departments',
      'employment_statuses',
      'job_types',
      'birthday',
      'gender',
      'joined_on',
    ],
  },
  daily_report: {
    title: '日報対象',
    visibilities: [
      'companies',
      'departments',
      'employment_statuses',
      'job_types',
    ],
  },
  questionnare: {
    title: 'アンケート対象',
    visibilities: [
      'companies',
      'departments',
      'employment_statuses',
      'job_types',
      'birthday',
      'gender',
      'joined_on',
    ],
  },
};

type TargetType = keyof typeof targetTypeConfig;

type GeneralSettingForm = {
  name: string;
  type: string;
  content: GeneralSettingContent;
};

export default Vue.extend({
  components: {
    ValidationObserver,
    Modal,
    BaseButton,
    OptionModal,
    DatePicker,
    BaseCheckbox,
    OutlinedTextField,
    SearchIcon,
    VueLoading,
    Popper,
  },
  props: {
    type: {
      type: String as PropType<TargetType>,
      default: 'publish',
    },
    selectedPublicMembers: {
      type: Array as PropType<AppApiResponse.User[]>,
      default: [],
    },
    allOrganizations: {
      type: Array as PropType<AppApiResponse.Organization[]>,
      default: null,
    },
  },
  data: () => ({
    isLoading: false as boolean,
    freeWord: '' as string,
    selectedCount: 0 as number,
    selectedItems: cloneDeep(emptyItems) as SettingItems,
    settingItem: undefined as SettingItemName | undefined,
    settingItemIndex: 0 as number,
    options: [] as OptionItem[],
    settings: [] as { uuid: string; name: string }[],
    companies: [] as { uuid: string; name: string }[],
    organizations: [] as { uuid: string; name: string; parent_name?: string }[],
    employment_positions: [] as { uuid: string; name: string }[],
    employment_statuses: [] as { uuid: string; name: string }[],
    job_types: [] as { uuid: string; name: string }[],
    genders: cloneDeep(enumGenderTypes) as { value: string; name: string }[],
    latest_accesses: [
      { value: '1 month', text: '1ヶ月以内' },
      { value: '1 week', text: '1週間以内' },
      { value: '3 day', text: '3日以内' },
    ] as { value: string; text: string }[],
    post_rules: [
      { value: 'slowly', text: 'ゆっくり' },
      { value: 'normal', text: '普通' },
      { value: 'frequent', text: '頻繁' },
    ],
    isSelectionModalVisible: false as boolean,
    isSelectionModalMultiple: true as boolean,
    isDateRangeModalVisible: {
      birthday: [false, false],
      joined_on: [false, false],
    } as DateRangeModalVisibilities,
    isSaveSettingModalVisible: false as boolean,
    employees: [] as Employee[],
    selectedAll: [] as string[],
    checkedEmployeeUuids: [] as string[],
    selectedEmployeeUuids: [] as string[],
    generalSettingForm: {
      name: '',
      type: '',
      content: {},
    } as GeneralSettingForm,
    lastPublicMembers: [] as AppApiResponse.User[],
    defaultDataOfSelectedMembers: [] as Employee[],
    childOrganizationOnSearchMember: [] as AppApiResponse.ProfileOrganization[],
    organizationGroupUuids: [] as string[],
    selectedOrganizationGroupUuids: [] as string[],
  }),
  computed: {
    title(): string {
      const typeTitleMap: { [key: string]: string } = {
        publish: '公開',
        invitation: '招待',
        daily_report: '日報対象',
      } as const;
      return this.type in typeTitleMap ? typeTitleMap[this.type] : '';
    },
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
    selectedMembers(): Employee[] {
      if (this.lastPublicMembers.length && !this.employees.length) {
        return this.lastPublicMembers;
      }
      return this.employees.filter((e: Employee) =>
        this.selectedEmployeeUuids.includes(e.uuid)
      );
    },
    currentSetting(): GeneralSettingContent {
      return {
        companies: this.selectedItems.companies.length
          ? this.selectedItems.companies.map((o: OptionItem) => o.value)
          : undefined,
        organizations: this.selectedItems.organizations.map(
          (o: OptionItem) => o.value
        ),
        employment_positions: this.selectedItems.employment_positions.map(
          (o: OptionItem) => o.value
        ),
        employment_statuses: this.selectedItems.employment_statuses.map(
          (o: OptionItem) => o.value
        ),
        job_types: this.selectedItems.job_types.map((o: OptionItem) => o.value),
        birthday: this.selectedItems.birthday
          .map((o: OptionItem) => parseInt(o.value, 10))
          .filter((v: any) => !!v),
        gender:
          this.selectedItems.gender.length > 0
            ? this.selectedItems.gender[0].value
            : undefined,
        latest_access:
          this.selectedItems.latest_access.length > 0
            ? this.selectedItems.latest_access[0].value
            : undefined,
        joined_on: this.selectedItems.joined_on
          .map((o: OptionItem) => parseInt(o.value, 10))
          .filter((v: any) => !!v),
        post_rule:
          this.selectedItems.post_rules.length > 0
            ? this.selectedItems.post_rules[0].value
            : undefined,
      };
    },
    selectedPublicMembersUUID(): string[] {
      const lastSelectedUuids = this.lastPublicMembers.map(
        (item: AppApiResponse.User) => item.uuid
      );
      return [...lastSelectedUuids, ...this.selectedEmployeeUuids];
    },
    organizationGroups() {
      if (this.allOrganizations?.length) {
        return this.allOrganizations
          .filter(
            (o: AppApiResponse.Organization) =>
              this.organizationGroupEmployees(o.uuid).length
          )
          .map((o: AppApiResponse.Organization) => {
            const parentUuid = o.relations?.parent ?? o.relations?.company;
            return {
              uuid: o.uuid,
              name: o.name,
              parent_name:
                this.allOrganizations.filter(
                  (organization: AppApiResponse.Organization) =>
                    organization.uuid === parentUuid
                )[0].name ?? null,
            };
          });
      }
      if (this.organizations?.length) {
        return this.organizations.filter(
          (o: object) => this.organizationGroupEmployees(o.uuid).length
        );
      }
      return [];
    },
    employeeWithOutOrganizations() {
      return this.employees.filter(
        (employee: Employee) =>
          !this.organizationGroups
            .map((o: object) => o.uuid)
            .includes(employee.organization_uuid)
      );
    },
    selectedOrganizationGroups(): object[] {
      if (this.allOrganizations?.length) {
        return this.allOrganizations
          .filter((o: AppApiResponse.Organization) =>
            this.selectedMembers
              .map((e: Employee) => e.organization_uuid)
              .includes(o.uuid)
          )
          .map((o: AppApiResponse.Organization) => {
            const parentUuid = o.relations?.parent ?? o.relations?.company;
            return {
              uuid: o.uuid,
              name: o.name,
              parent_name:
                this.allOrganizations.filter(
                  (organization: AppApiResponse.Organization) =>
                    organization.uuid === parentUuid
                )[0].name ?? null,
            };
          });
      }
      if (this.organizations?.length) {
        return this.organizations.filter((o: AppApiResponse.Organization) =>
          this.selectedMembers
            .map((e: Employee) => e.organization_uuid)
            .includes(o.uuid)
        );
      }
      return [];
    },
    withoutGroupSelectedMembers(): Employee[] {
      return this.selectedMembers.filter(
        (employee: Employee) =>
          !this.selectedOrganizationGroups.filter(
            (organizationGroup: object) =>
              organizationGroup.uuid === employee.organization_uuid
          ).length
      );
    },
  },
  watch: {
    checkedEmployeeUuids(values: string[]) {
      const totalEmployees = this.employees.filter(
        (employee: Employee) =>
          !this.selectedPublicMembersUUID.includes(employee.uuid)
      );
      if (
        this.employees.length !== 0 &&
        values.length === totalEmployees.length
      ) {
        this.selectedAll = ['check-all'];
      } else {
        this.selectedAll = [];
      }
    },
    employees() {
      if (this.lastPublicMembers.length > 0) {
        this.selectedEmployeeUuids = this.lastPublicMembers.map(
          (user: AppApiResponse.User) => user.uuid
        );
      }
    },
    allOrganizations(items: AppApiResponse.Organization) {
      if (items.length && !this.companies.length) {
        this.companies = items
          .filter((o: AppApiResponse.Organization) => o.type === 'company')
          .map((o: AppApiResponse.Organization) => ({
            uuid: o.uuid,
            name: o.name,
          }));
      }
    },
  },
  created(): void {
    this.fetchSettings();
    if (this.allOrganizations && this.allOrganizations.length) {
      this.companies = this.allOrganizations
        .filter((o: AppApiResponse.Organization) => o.type === 'company')
        .map((o: AppApiResponse.Organization) => ({
          uuid: o.uuid,
          name: o.name,
        }));
    } else {
      this.fetchCompanies();
    }
    this.fetchJobTypes();
    this.fetchEmploymentPositions();
    this.fetchEmploymentStatuses();
    if (this.selectedPublicMembers.length > 0) {
      this.lastPublicMembers = this.selectedPublicMembers;
    }
  },
  mounted() {
    this.defaultDataOfSelectedMembers = cloneDeep(this.selectedMembers);
  },
  methods: {
    onOk(): void {
      this.$emit('select', cloneDeep(this.selectedMembers));
      this.$emit('close');
    },
    onCloseSelectModal() {
      if (this.defaultDataOfSelectedMembers.length > 0) {
        this.$emit('select', cloneDeep(this.defaultDataOfSelectedMembers));
      }
      this.$emit('close');
    },
    onSearchIconClick(): void {
      this.searchEmployees({ free_word: this.freeWord });
    },
    onAddMembersButtonClick(): void {
      this.selectedEmployeeUuids = [
        ...this.selectedPublicMembersUUID,
        ...this.checkedEmployeeUuids,
      ];
      this.checkedEmployeeUuids = [];
      const container = this.$el.querySelector('.inner-container');
      if (container) {
        container.scrollTop = 0;
      }
    },
    onResetButtonClick(keys: SettingItemName[]): void {
      keys.forEach((key: SettingItemName) => {
        this.selectedItems[key] = [];
      });
    },
    onSearchButtonClick(): void {
      this.searchEmployees(this.createRequestBody());
    },
    createRequestBody(): SearchEmployeeRequest {
      return { filter: this.currentSetting };
    },
    openSelection(name: SettingItemName): void {
      this.settingItem = name;
      if (name === 'settings') {
        this.isSelectionModalMultiple = false;
        this.options = this.makeOptions(this.settings, ['uuid', 'name']);
      } else if (name === 'companies') {
        this.isSelectionModalMultiple = true;
        this.options = this.makeOptions(this.companies, ['uuid', 'name']);
      } else if (name === 'organizations') {
        this.isSelectionModalMultiple = true;
        this.options = this.makeOptions(
          this.organizations,
          ['uuid', 'name'],
          name
        );
      } else if (name === 'employment_positions') {
        this.isSelectionModalMultiple = true;
        // eslint-disable-next-line prettier/prettier
        this.options = this.makeOptions(this.employment_positions, [
          'uuid',
          'name',
        ]);
      } else if (name === 'employment_statuses') {
        this.isSelectionModalMultiple = true;
        // eslint-disable-next-line prettier/prettier
        this.options = this.makeOptions(this.employment_statuses, [
          'uuid',
          'display_name',
        ]);
      } else if (name === 'job_types') {
        this.isSelectionModalMultiple = true;
        this.options = this.makeOptions(this.job_types, ['uuid', 'name']);
      } else if (name === 'gender') {
        this.isSelectionModalMultiple = false;
        this.options = this.makeOptions(this.genders, ['value', 'name']);
      } else if (name === 'latest_access') {
        this.isSelectionModalMultiple = false;
        this.options = this.makeOptions(this.latest_accesses, [
          'value',
          'text',
        ]);
      } else if (name === 'post_rules') {
        this.isSelectionModalMultiple = false;
        this.options = this.makeOptions(this.post_rules, ['value', 'text']);
      }
      this.isSelectionModalVisible = true;
    },
    onDateClick(name: SettingItemNameDate, index: number): void {
      const current = this.isDateRangeModalVisible[name][index];
      // 他に開いてるコンポーネントがあったら閉じる
      settingItemNamesDate.forEach((key: SettingItemNameDate) => {
        this.$set(this.isDateRangeModalVisible, key, [false, false]);
      });
      this.$set(this.isDateRangeModalVisible[name], index, !current);
    },
    onDatePick(key: SettingItemNameDate, index: number, value: Date): void {
      this.$set(this.selectedItems[key], index, {
        value: value ? `${dayjs(value).unix()}` : '',
        text: value ? dayjs(value).format('YYYY/MM/DD') : '',
      });
      this.$set(this.isDateRangeModalVisible[key], index, false);
    },
    async onOptionsSelect(items: OptionItem[]): Promise<void> {
      if (this.settingItem === 'settings') {
        if (items.length > 0) {
          const { data } = await fetchGeneralSetting(items[0].value);
          this.generalSettingForm.name = data.name;
          this.updateSetting(data);
        } else {
          this.generalSettingForm = { name: '', type: '', content: {} };
        }
      } else if (this.settingItem === 'companies') {
        this.organizations = [];
        if (items.length > 0) {
          this.selectedItems.companies = [...items];
          this.fetchOrganizations(items);
        } else {
          this.selectedItems.organizations = [];
        }
      }
    },
    async updateSetting(setting: GeneralSetting): Promise<void> {
      this.selectedItems.companies = [];
      this.selectedItems.employment_positions = [];
      this.selectedItems.employment_statuses = [];
      this.selectedItems.job_types = [];
      this.selectedItems.gender = [];
      this.selectedItems.latest_access = [];
      this.selectedItems.birthday = [];
      this.selectedItems.joined_on = [];
      this.selectedItems.post_rules = [];
      this.childOrganizationOnSearchMember = [];
      if (setting.content.companies) {
        this.selectedItems.companies = this.makeOptions(this.companies, [
          'uuid',
          'name',
        ]).filter((item: OptionItem) =>
          setting.content.companies.includes(item.value)
        );
        if (this.selectedItems.companies.length > 0) {
          this.organizations = [];
          await this.fetchOrganizations(this.selectedItems.companies);
          if (setting.content.organizations) {
            this.selectedItems.organizations = this.makeOptions(
              this.organizations,
              ['uuid', 'name']
            ).filter((item: OptionItem) =>
              setting.content.organizations?.includes(item.value)
            );
          }
        }
      } else if (setting.content.organizations) {
        const allCompaniesUUID = this.companies.map(
          (c: { uuid: string; name: string }) => c.uuid
        );
        let fetchCount = 0;
        this.isLoading = true;
        if (this.allOrganizations && this.allOrganizations.length) {
          this.childOrganizationOnSearchMember = this.allOrganizations
            .filter((o: AppApiResponse.Organization) =>
              allCompaniesUUID.includes(o.relations?.company)
            )
            .map((o: AppApiResponse.Organization) => ({
              uuid: o.uuid,
              name: o.name,
            }));
          fetchCount = this.companies.length;
        } else {
          allCompaniesUUID.forEach(async (uuid: string) => {
            try {
              const { data } = await fetchOrganizations({
                independent: true,
                company_uuid: uuid,
              });
              this.childOrganizationOnSearchMember = [
                ...this.childOrganizationOnSearchMember,
                ...data.organizations,
              ];
            } catch (e) {
              console.error(e);
            } finally {
              fetchCount += 1;
            }
          });
        }
        const checkInterval = setInterval(() => {
          if (fetchCount === this.companies.length) {
            clearInterval(checkInterval);
            this.isLoading = false;
            this.selectedItems.organizations = this.makeOptions(
              this.childOrganizationOnSearchMember,
              ['uuid', 'name']
            ).filter((item: OptionItem) =>
              setting.content.organizations?.includes(item.value)
            );
          }
        }, 500);
      }
      if (setting.content.employment_positions) {
        this.selectedItems.employment_positions = this.makeOptions(
          this.employment_positions,
          ['uuid', 'name']
        ).filter((item: OptionItem) =>
          setting.content.employment_positions?.includes(item.value)
        );
      }
      if (setting.content.employment_statuses) {
        this.selectedItems.employment_statuses = this.makeOptions(
          this.employment_statuses,
          ['uuid', 'name']
        ).filter((item: OptionItem) =>
          setting.content.employment_statuses?.includes(item.value)
        );
      }
      if (setting.content.job_types) {
        this.selectedItems.job_types = this.makeOptions(this.job_types, [
          'uuid',
          'name',
        ]).filter((item: OptionItem) =>
          setting.content.job_types?.includes(item.value)
        );
      }
      if (setting.content.gender) {
        this.selectedItems.gender = this.makeOptions(this.genders, [
          'value',
          'name',
        ]).filter((item: OptionItem) => setting.content.gender === item.value);
      }
      if (setting.content.latest_access) {
        this.selectedItems.latest_access = this.makeOptions(
          this.latest_accesses,
          ['value', 'text']
        ).filter(
          (item: OptionItem) => setting.content.latest_access === item.value
        );
      }
      if (this.isValidDateRange(setting.content.birthday)) {
        this.selectedItems.birthday = this.makeDateRange(
          setting.content.birthday
        );
      }
      if (this.isValidDateRange(setting.content.joined_on)) {
        this.selectedItems.joined_on = this.makeDateRange(
          setting.content.joined_on
        );
      }
      if (setting.content.post_rule) {
        this.selectedItems.post_rules = this.makeOptions(this.post_rules, [
          'value',
          'text',
        ]).filter(
          (item: OptionItem) => setting.content.post_rule === item.value
        );
      }
    },
    isValidDateRange(dateRange: any): dateRange is number[] {
      return (
        Array.isArray(dateRange) &&
        dateRange.length > 0 &&
        dateRange.every((v: any) => Number.isInteger(v))
      );
    },
    onSaveSettingButtonClick(): void {
      this.isSaveSettingModalVisible = true;
    },
    async onDoSaveSettingButtonClick(): Promise<void> {
      const uuid =
        this.selectedItems.settings && this.selectedItems.settings.length
          ? this.selectedItems.settings[0].value
          : undefined;
      this.generalSettingForm.type = this.type as string;
      this.generalSettingForm.content = this.currentSetting;
      try {
        if (uuid) {
          await updateGeneralSetting(uuid, this.generalSettingForm);
        } else {
          await storeGeneralSetting(this.generalSettingForm);
        }
        await this.fetchSettings();
        if (
          this.selectedItems.settings &&
          this.selectedItems.settings.length > 0
        ) {
          this.$set(
            this.selectedItems,
            'settings',
            this.settings
              .filter(
                (setting: { uuid: string; name: string }) =>
                  setting.uuid === this.selectedItems.settings[0].value
              )
              .map((setting: { uuid: string; name: string }) => ({
                value: setting.uuid,
                text: setting.name,
              }))
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.isSaveSettingModalVisible = false;
      }
    },
    onAllCheck(values: string[]): void {
      if (values.length > 0) {
        this.checkedEmployeeUuids = this.employees
          .filter(
            (e: Employee) => !this.selectedPublicMembersUUID.includes(e.uuid)
          )
          .map((e: Employee) => e.uuid);
      } else {
        this.checkedEmployeeUuids = [];
      }
    },
    onResetMembersButtonClick(): void {
      this.checkedEmployeeUuids = [];
      this.selectedEmployeeUuids = [];
      this.lastPublicMembers = [];
    },
    selectedValues(name: SettingItemName): string {
      return this.selectedItems[name] && this.selectedItems[name].length > 0
        ? this.selectedItems[name].map((v: OptionItem) => v.text).join(',')
        : '選択なし';
    },
    selectedDate(name: SettingItemName, index: number): string {
      const label = index === 0 ? '開始日' : '終了日';
      return this.selectedItems[name] &&
        this.selectedItems[name].length > index &&
        !!this.selectedItems[name][index].value
        ? this.selectedItems[name][index].text
        : `${label}設定`;
    },
    makeOptions(values: any[], keys: string[], type: string): OptionItem[] {
      if (type === 'organizations') {
        return values.map((el: any) => ({
          value: el[keys[0]],
          text: el[keys[1]],
          label: el.parent_name,
        }));
      }
      return values.map((el: any) => ({
        value: el[keys[0]],
        text: el[keys[1]],
      }));
    },
    makeDateRange([from, to]: number[]): OptionItem[] {
      return [
        {
          value: `${from}`,
          text: from ? dayjs.unix(from).format('YYYY/MM/DD') : '',
        },
        {
          value: `${to}`,
          text: from ? dayjs.unix(to).format('YYYY/MM/DD') : '',
        },
      ];
    },
    async fetchSettings(): Promise<void> {
      this.isLoading = true;
      try {
        const { data } = await fetchGeneralSettings();
        this.settings = data.general_settings;
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
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
    async fetchOrganizations(selectedCompanies: OptionItem[]): Promise<void> {
      this.isLoading = true;
      try {
        if (this.allOrganizations && this.allOrganizations.length) {
          const companyUuids = selectedCompanies.map(
            (o: OptionItem) => o.value
          );
          this.organizations = this.allOrganizations
            .filter((o: AppApiResponse.Organization) =>
              companyUuids.includes(o.relations?.company)
            )
            .map((o: AppApiResponse.Organization) => {
              const parentUuid = o.relations?.parent ?? o.relations?.company;
              const parentName = this.allOrganizations.filter(
                (parent: AppApiResponse.Organization) =>
                  parent.uuid === parentUuid
              )[0].name;
              return {
                uuid: o.uuid,
                name: o.name,
                parent_name: parentName,
              };
            });
          this.isLoading = false;
        } else {
          const uuid = selectedCompanies.shift().value;
          const { data } = await fetchOrganizations({
            independent: true,
            company_uuid: uuid,
          });
          this.organizations = [...this.organizations, ...data.organizations];
          if (selectedCompanies.length) {
            await this.fetchOrganizations(selectedCompanies);
          } else {
            this.isLoading = false;
          }
        }
        if (!this.isLoading && this.selectedItems.organizations?.length) {
          this.selectedItems.organizations = this.selectedItems.organizations.filter(
            (option: OptionItem) =>
              this.organizations
                .map((o: object) => o.uuid)
                .includes(option.value)
          );
        }
      } catch (e) {
        console.error(e);
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
    async fetchJobTypes(): Promise<void> {
      this.isLoading = true;
      try {
        const { data } = await fetchJobTypes();
        this.job_types = data.job_types;
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
    async searchEmployees(payload: SearchEmployeeRequest): Promise<void> {
      const container = this.$el.querySelector('.inner-container');
      if (container) {
        container.scrollTop = 0;
      }
      this.isLoading = true;
      this.checkedEmployeeUuids = [];
      this.employees = [];
      try {
        const { data } = await searchEmployees(payload);
        this.employees = data.users;
        this.isLoading = false;
      } catch (e) {
        this.isLoading = false;
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
    removeSelectedUser(uuid: string) {
      this.selectedEmployeeUuids.splice(
        this.selectedEmployeeUuids.indexOf(uuid),
        1
      );
      const userRemoveIndex = this.lastPublicMembers.find(
        (e: Employee) => e.uuid === uuid
      );
      if (userRemoveIndex) {
        this.lastPublicMembers.splice(
          this.lastPublicMembers.indexOf(userRemoveIndex),
          1
        );
      }
    },
    limitedString(input: string, limit: number = 8): string {
      let output = input;
      if (output.length > limit) {
        output = output.slice(0, limit).concat('...');
      }
      return output;
    },
    organizationGroupEmployees(organizationUuid: string): Employee[] {
      return this.employees.filter(
        (employee: Employee) => employee.organization_uuid === organizationUuid
      );
    },
    isCheckedOrganizationGroup(uuid: string): boolean {
      const totalEmployees = this.employees.filter(
        (employee: Employee) =>
          employee.organization_uuid === uuid &&
          !this.selectedPublicMembersUUID.includes(employee.uuid)
      );
      if (!totalEmployees.length) {
        return false;
      }
      const checkedEmployees = totalEmployees.filter((employee: Employee) =>
        this.checkedEmployeeUuids.includes(employee.uuid)
      );
      return totalEmployees.length === checkedEmployees.length;
    },
    checkAllInOrganizationGroup(uuid: string): boolean {
      if (this.isDisabledGroup(uuid)) {
        return;
      }
      const totalEmployees = this.employees.filter(
        (employee: Employee) =>
          employee.organization_uuid === uuid &&
          !this.selectedPublicMembersUUID.includes(employee.uuid)
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
    toggleOrganizationGroups(uuid: string): void {
      if (this.organizationGroupUuids.includes(uuid)) {
        this.organizationGroupUuids = this.organizationGroupUuids.filter(
          (organizationUuid: string) => organizationUuid !== uuid
        );
      } else {
        this.organizationGroupUuids = [...this.organizationGroupUuids, uuid];
      }
    },
    isDisabledGroup(uuid: string) {
      const groupEmployees = this.organizationGroupEmployees(uuid);
      const disabledEmployees = groupEmployees.filter((employee: Employee) =>
        this.selectedPublicMembersUUID.includes(employee.uuid)
      );
      return disabledEmployees.length === groupEmployees.length;
    },
    selectedOrganizationGroupEmployees(organizationUuid: string): Employee[] {
      return this.selectedMembers.filter(
        (employee: Employee) => employee.organization_uuid === organizationUuid
      );
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
    removeTargetOrganizationGroup(organizationUuid: string) {
      const itemToRemove = this.selectedOrganizationGroupEmployees(
        organizationUuid
      );
      itemToRemove.forEach((employee: Employee) => {
        this.removeSelectedUser(employee.uuid);
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.component-container {
  color: $main_color;
}

.modal-overlay {
  z-index: 999999999;
}

.inner-container {
  display: flex;
  width: 100%;
  max-height: calc(100vh - 200px);
  overflow-y: scroll;
  font-size: 15px;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.link,
.em-on-hover:hover,
.em-on-hover.is-open {
  color: $link_color;
  cursor: pointer;

  &:hover {
    color: $pink_hover;
  }
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 26px 32px;
}

.member {
  display: flex;
  width: 100%;

  .left {
    width: 32px;
    height: 32px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 12px;
      object-fit: cover;
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    margin-left: 8px;
    margin-right: auto;

    .name {
      font-size: 13px;
    }

    .org {
      font-size: 11px;
      color: $sub_color;
    }
  }

  .remove {
    height: 16px;
    cursor: pointer;
  }
}

.left-pane {
  width: 774px;

  .header {
    display: flex;
    border-bottom: 1px solid $ruled_line;
    height: 87px;
    justify-content: space-between;

    .title {
      font-size: 15px;
      font-weight: 600;
      color: $main_color;
      padding: 40px 32px 32px 32px;
    }

    .freeword-form {
      position: relative;

      .freeword {
        width: 360px;
        height: 52px;
        margin: 18px;
        padding: 18px 0 18px 20px;
        border: 1px solid $light_gray_blue_6;
        border-radius: 4px;
        box-shadow: 0 1px 2px #dce5ef;
        font-size: 15px;

        &::placeholder {
          color: rgba($placeholder_gray_2, 0.5);
        }
      }

      .icon {
        position: absolute;
        top: 36px;
        right: 36px;
        cursor: pointer;
      }
    }
  }

  .content {
    display: flex;

    .row {
      display: flex;
      justify-content: space-between;
      padding: 26px 32px;

      &.group {
        padding-left: 16px;
        background-color: $white_1;
        font-weight: 600;
        color: $gentle_bluish_purple;
      }

      .selection {
        display: flex;
        align-items: center;
        cursor: pointer;

        img {
          margin-left: 9px;
        }

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

        .value {
          max-width: 230px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          &.date-range {
            overflow: visible;

            .form-container {
              position: relative;
              display: inline-block;

              .date-picker-container {
                position: absolute;
                top: 24px;
                left: 0;
              }
            }
          }
        }
      }
    }

    .settings {
      width: 448px;
    }

    .members {
      width: 324px;

      // .row にしたいが no-descending-specificity で怒られるので
      .members__row {
        &:not(.organization) {
          height: 58px;
          align-items: center;

          // &:first-child {
          //   justify-content: flex-end;
          //   align-items: center;

          //   input {
          //     margin-left: 8px;
          //   }
          // }
        }
      }
    }

    .center {
      display: flex;
      justify-content: center;
    }

    .add-members-button {
      width: 250px;

      &:hover {
        background-color: $light_gray_blue_8;
      }
    }
  }
}

.right-pane {
  width: 326px;
  background-color: rgba($ruled_line, 0.3);

  .header {
    display: flex;
    border-bottom: 1px solid $ruled_line;
    height: 87px;
    align-items: center;
    padding: 36px 45px 36px 52px;

    .count {
      margin-left: 22px;
    }
  }

  .content {
    .end {
      display: flex;
      justify-content: flex-end;
    }

    .members {
      .members__row:not(.organization) {
        height: 58px;
        align-items: center;
      }
    }
  }
}

.footer {
  display: flex;
  justify-content: center;
  width: 100%;
  border-top: 1px solid $ruled_line;
  padding: 24px 0 40px 0;

  .button {
    width: 350px;

    &:last-child {
      margin-left: 20px;
    }
  }
}

.save-setting-modal {
  .inner-container {
    padding: 2em;
    display: flex;
    align-items: baseline;

    .text-field {
      width: 240px;
    }

    .button {
      margin-left: 1em;
    }
  }
}

.button--gray {
  &:hover {
    background-color: $light_gray_blue_8;
  }
}

.is-selected {
  opacity: 0.5;
}

.members__group .members__row.organization {
  margin: 0 17px;
  height: unset;
}

.members__group:not(:first-child) .members__row.organization {
  margin-top: 15px;
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

.right-pane__group .right-pane__row.organization {
  margin: 0 17px;
  height: unset;
}

.right-pane__group:not(:first-child) .right-pane__row.organization {
  margin-top: 15px;
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

.members__group .members__row.organization.is-selected .checked-icon,
.members__group .members__row.organization.is-selected .unchecked-icon {
  cursor: not-allowed;
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
</style>
