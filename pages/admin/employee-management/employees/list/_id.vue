<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="メンバー一覧・編集">
        <template #tutorial>
          <TutorialButtonIcon :url="`/admin/tutorial/member-list.html`" />
        </template>
        <template #description>
          表の項目はご利用に応じてカスタマイズができます。
        </template>
      </page-header>
      <vue-loading
        v-if="isLoading"
        type="spin"
        color="#333"
        :size="{ width: '50px', height: '50px' }"
      ></vue-loading>
      <template v-else>
        <scrollable-tabs
          :companies="companies"
          :current-id="currentUuid"
          :company-count-threshold="4"
          @change-tab="changeCompanyTab($event)"
        />
        <div v-if="!isChangingCompany">
          <div class="contents">
            <div class="contents-inner">
              <div class="accordion">
                <div class="accordion__header">
                  <div class="contents-inner-header">
                    <h3 class="contents-inner-header-headline">
                      表示する項目をまとめて選択
                    </h3>
                    <div class="contents-inner-header-info">
                      ※ 下の一覧に反映されます
                    </div>
                    <button class="tab-button" @click="toggleDisplayFields()">
                      <svg
                        :class="{ closed: !isOpened }"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <g
                          id="長方形_3776"
                          data-name="長方形 3776"
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
                        <g
                          id="Icon_arrow_r"
                          data-name="Icon/arrow_r"
                          transform="translate(10 14) rotate(-90)"
                        >
                          <path
                            id="パス_351"
                            data-name="パス 351"
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
                  </div>
                </div>
                <div v-if="isOpened" class="children">
                  <div class="bulk-selection">
                    <div class="left">用途別で一括チェック</div>
                    <div class="right">
                      <single-check-box
                        :selected-value="displayGroup"
                        value="default"
                        title="基本情報をみる"
                        label="（組織（BOX）/ 役職 / 雇用形態 / サブ組織）"
                        class="checkbox"
                        @change="selectGrouping"
                      />
                      <single-check-box
                        :selected-value="displayGroup"
                        value="personal-information"
                        title="個人情報を見る"
                        label="（入社日 / 生年月日 / 性別 / 参加コミュニティ）"
                        class="checkbox"
                        @change="selectGrouping"
                      />
                      <single-check-box
                        :selected-value="displayGroup"
                        value="account"
                        title="アカウント状況をみる"
                        label="（組織（BOX） / 役職 / 雇用形態 / アカウント）"
                        class="checkbox"
                        @change="selectGrouping"
                      />
                      <single-check-box
                        :selected-value="displayGroup"
                        value="authority-and-post-rule"
                        title="権限・投稿ルールを確認する"
                        label="（利用権限 / 投稿頻度）"
                        class="checkbox"
                        @change="selectGrouping"
                      />
                    </div>
                  </div>
                  <div class="display-fields">
                    <checkbox
                      v-model="displayFields"
                      class="checkbox"
                      value="organization"
                      label="所属組織（BOX）"
                      @change="selectField('organization')"
                    />
                    <checkbox
                      v-model="displayFields"
                      class="checkbox"
                      value="subOrganization"
                      label="サブ組織 "
                      @change="selectField('subOrganization')"
                    />
                    <checkbox
                      v-model="displayFields"
                      class="checkbox"
                      value="position"
                      label="役職"
                      @change="selectField('position')"
                    />
                    <checkbox
                      v-model="displayFields"
                      class="checkbox"
                      value="status"
                      label="雇用形態"
                      @change="selectField('status')"
                    />
                    <checkbox
                      v-model="displayFields"
                      class="checkbox"
                      value="authority"
                      label="利用権限"
                      @change="selectField('authority')"
                    />
                    <checkbox
                      v-model="displayFields"
                      class="checkbox"
                      value="postFrequence"
                      label="投稿頻度"
                      @change="selectField('postFrequence')"
                    />
                    <checkbox
                      v-model="displayFields"
                      class="checkbox"
                      value="accountStatus"
                      label="アカウント"
                      @change="selectField('accountStatus')"
                    />
                    <checkbox
                      v-model="displayFields"
                      class="checkbox"
                      value="hireDate"
                      label="入社日"
                      @change="selectField('hireDate')"
                    />
                  </div>
                  <div class="display-fields">
                    <checkbox
                      v-model="displayFields"
                      class="checkbox"
                      value="joinedCommunity"
                      label="参加コミュニティ"
                      @change="selectField('joinedCommunity')"
                    />
                    <checkbox
                      v-model="displayFields"
                      class="checkbox"
                      value="birthDay"
                      label="生年月日"
                      @change="selectField('birthDay')"
                    />
                    <checkbox
                      v-model="displayFields"
                      class="checkbox"
                      value="gender"
                      label="性別"
                      @change="selectField('gender')"
                    />
                    <checkbox
                      v-model="displayFields"
                      class="checkbox"
                      value="enrollmentStatus"
                      label="在籍状況"
                      @change="selectField('enrollmentStatus')"
                    />
                    <checkbox
                      v-model="displayFields"
                      class="checkbox"
                      value="lastAccess"
                      label="最終アクセス"
                      @change="selectField('lastAccess')"
                    />
                    <checkbox
                      v-model="displayFields"
                      class="checkbox"
                      value="smartPhone"
                      label="スマホ利用"
                      @change="selectField('smartPhone')"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="filter-box">
            <base-button @click="showUserFilterModal = true">
              メンバーを絞り込む</base-button
            >
            <hr class="vertical-separator" />
            <div>表示件数 :</div>
            <BaseSelect
              v-model="limit"
              class="display-count"
              :items="filterSelectOption"
              @input="sortNumberPerPage"
            />
          </div>
          <div id="table-wrapper" class="table-wrapper">
            <div v-if="isChecked" class="table-action">
              チェックを入れたメンバーをまとめて
              <base-button @click="showBulkUserSettingModal = true">
                設定
              </base-button>
              <base-button
                class="delete-button"
                @click="showCheckDeleteModal = true"
              >
                削除
              </base-button>
            </div>
            <table v-if="!isLoadingTable" class="member-list-table" border>
              <tr>
                <th class="mini">
                  <checkbox v-model="isAllChecked" @change="toggleAllCheck" />
                </th>
                <th class="number-column">NO</th>
                <th class="relative name-column">
                  <div>
                    氏名
                    <svg
                      id="Icon_pulldown"
                      class="sort"
                      data-name="Icon/pulldown"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      @click="openSortDialog('name')"
                    >
                      <path
                        id="Path_845"
                        data-name="Path 845"
                        d="M450.361,106.779l-4.549,7.06a.44.44,0,0,1-.746,0l-4.549-7.06a.471.471,0,0,1,.373-.733h9.1A.471.471,0,0,1,450.361,106.779Z"
                        transform="translate(-440.439 -106.046)"
                        fill="#7e8195"
                      />
                    </svg>
                  </div>
                  <div v-if="showSortDialog.name" class="sort-dialog">
                    <ul>
                      <li
                        :class="{ selected: 'asc' === orderStates.name }"
                        @click="sortByName()"
                      >
                        あ→んの順
                      </li>
                      <li
                        :class="{ selected: 'desc' === orderStates.name }"
                        @click="sortByName('desc')"
                      >
                        ん→あの順
                      </li>
                      <li @click="resetOrder({ ...orderStates, name: '' })">
                        順番を元に戻す
                      </li>
                    </ul>
                  </div>
                </th>
                <th class="additional-column">
                  <span class="small">追加項目</span>
                </th>
                <th
                  v-if="displayColumns.organization"
                  class="relative organization-box-column"
                >
                  <div class="vertical-border"></div>
                  <div>
                    所属組織（BOX）
                    <svg
                      id="Icon_pulldown"
                      class="sort"
                      data-name="Icon/pulldown"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      @click="openSortDialog('organization')"
                    >
                      <path
                        id="Path_845"
                        data-name="Path 845"
                        d="M450.361,106.779l-4.549,7.06a.44.44,0,0,1-.746,0l-4.549-7.06a.471.471,0,0,1,.373-.733h9.1A.471.471,0,0,1,450.361,106.779Z"
                        transform="translate(-440.439 -106.046)"
                        fill="#7e8195"
                      />
                    </svg>
                  </div>
                  <div v-if="showSortDialog.organization" class="sort-dialog">
                    <ul>
                      <li
                        :class="{
                          selected: 'desc' === orderStates.organization,
                        }"
                        @click="sortByUserCount('desc')"
                      >
                        人数が多い順
                      </li>
                      <li
                        :class="{
                          selected: 'asc' === orderStates.organization,
                        }"
                        @click="sortByUserCount('asc')"
                      >
                        人数が少ない順
                      </li>
                      <li
                        @click="
                          resetOrder({ ...orderStates, organization: '' })
                        "
                      >
                        順番を元に戻す
                      </li>
                    </ul>
                  </div>
                </th>
                <th
                  v-if="displayColumns.subOrganization"
                  class="relative organization-box-column"
                >
                  サブ組織
                  <div
                    v-if="showSortDialog.subOrganization"
                    class="sort-dialog"
                  >
                    <ul>
                      <li
                        :class="{
                          selected: 'desc' === orderStates.subOrganization,
                        }"
                        @click="sortByUserCount('desc')"
                      >
                        人数が多い順
                      </li>
                      <li
                        :class="{
                          selected: 'asc' === orderStates.subOrganization,
                        }"
                        @click="sortByUserCount('asc')"
                      >
                        人数が少ない順
                      </li>
                      <li
                        @click="
                          resetOrder({ ...orderStates, subOrganization: '' })
                        "
                      >
                        順番を元に戻す
                      </li>
                    </ul>
                  </div>
                </th>
                <th
                  v-if="displayColumns.position"
                  class="relative position-column"
                >
                  <div>
                    役職
                    <svg
                      id="Icon_pulldown"
                      class="sort"
                      data-name="Icon/pulldown"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      @click="openSortDialog('position')"
                    >
                      <path
                        id="Path_845"
                        data-name="Path 845"
                        d="M450.361,106.779l-4.549,7.06a.44.44,0,0,1-.746,0l-4.549-7.06a.471.471,0,0,1,.373-.733h9.1A.471.471,0,0,1,450.361,106.779Z"
                        transform="translate(-440.439 -106.046)"
                        fill="#7e8195"
                      />
                    </svg>
                  </div>
                  <div v-if="showSortDialog.position" class="sort-dialog">
                    <ul>
                      <li
                        :class="{
                          selected: 'asc' === orderStates.position,
                        }"
                        @click="sortByPositionOrder('asc')"
                      >
                        高い順
                      </li>
                      <li
                        :class="{
                          selected: 'desc' === orderStates.position,
                        }"
                        @click="sortByPositionOrder('desc')"
                      >
                        低い順
                      </li>
                      <li @click="resetOrder({ ...orderStates, position: '' })">
                        順番を元に戻す
                      </li>
                    </ul>
                  </div>
                </th>
                <th v-if="displayColumns.status" class="relative status-column">
                  <div>
                    雇用形態
                    <svg
                      id="Icon_pulldown"
                      class="sort"
                      data-name="Icon/pulldown"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      @click="openSortDialog('status')"
                    >
                      <path
                        id="Path_845"
                        data-name="Path 845"
                        d="M450.361,106.779l-4.549,7.06a.44.44,0,0,1-.746,0l-4.549-7.06a.471.471,0,0,1,.373-.733h9.1A.471.471,0,0,1,450.361,106.779Z"
                        transform="translate(-440.439 -106.046)"
                        fill="#7e8195"
                      />
                    </svg>
                  </div>
                  <div v-if="showSortDialog.status" class="sort-dialog">
                    <ul>
                      <li
                        :class="{
                          selected: 'asc' === orderStates.status,
                        }"
                        @click="sortByStatusOrder('asc')"
                      >
                        高い順
                      </li>
                      <li
                        :class="{
                          selected: 'desc' === orderStates.status,
                        }"
                        @click="sortByStatusOrder('desc')"
                      >
                        低い順
                      </li>
                      <li @click="resetOrder({ ...orderStates, status: '' })">
                        順番を元に戻す
                      </li>
                    </ul>
                  </div>
                </th>
                <th v-if="displayColumns.authority" class="authority-column">
                  <div class="popper">
                    <img src="/icon/icon_help-outline.png" />
                    <span class="text" @click="showAuthorityDialog = true"
                      >権限について</span
                    >
                    <div v-if="showAuthorityDialog" class="dialog">
                      <div class="top-box">
                        <div class="title">利用権限一覧</div>
                        <div>
                          <img
                            src="/icon/icon_cross.png"
                            @click="showAuthorityDialog = false"
                          />
                        </div>
                      </div>
                      <div>
                        <table border class="authority">
                          <tr>
                            <th></th>
                            <th>閲覧</th>
                            <th>投稿</th>
                          </tr>
                          <tr>
                            <th class="text-left">メンバー（通常）</th>
                            <td>全ての記事</td>
                            <td class="center">投稿可</td>
                          </tr>
                          <tr>
                            <th class="text-left">準メンバー</th>
                            <td>メンバー限定以外の記事</td>
                            <td class="center">投稿可</td>
                          </tr>
                          <tr>
                            <th class="text-left">ビジター</th>
                            <td>メンバー・準メンバー限定<br />以外の記事</td>
                            <td class="center">投稿不可</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>

                  <span slot="reference" class="left">
                    利用権限
                  </span>
                </th>
                <th
                  v-if="displayColumns.postFrequence"
                  class="post-frequence-column"
                >
                  投稿頻度
                </th>
                <th v-if="displayColumns.accountStatus" class="account-column">
                  アカウント
                </th>
                <th
                  v-if="displayColumns.hireDate"
                  class="relative hire-date-column"
                >
                  <div>
                    入社日
                    <svg
                      id="Icon_pulldown"
                      class="sort"
                      data-name="Icon/pulldown"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      @click="openSortDialog('hireDate')"
                    >
                      <path
                        id="Path_845"
                        data-name="Path 845"
                        d="M450.361,106.779l-4.549,7.06a.44.44,0,0,1-.746,0l-4.549-7.06a.471.471,0,0,1,.373-.733h9.1A.471.471,0,0,1,450.361,106.779Z"
                        transform="translate(-440.439 -106.046)"
                        fill="#7e8195"
                      />
                    </svg>
                  </div>
                  <div v-if="showSortDialog.hireDate" class="sort-dialog">
                    <ul>
                      <li
                        :class="{ selected: 'desc' === orderStates.hireDate }"
                        @click="sortByhireDate('desc')"
                      >
                        日付が新しい順
                      </li>
                      <li
                        :class="{ selected: 'asc' === orderStates.hireDate }"
                        @click="sortByhireDate('asc')"
                      >
                        日付が古い順
                      </li>
                      <li @click="resetOrder({ ...orderStates, hireDate: '' })">
                        順番を元に戻す
                      </li>
                    </ul>
                  </div>
                </th>
                <th
                  v-if="displayColumns.joinedCommunity"
                  class="joined-community-column"
                >
                  参加コミュニティ
                </th>
                <th
                  v-if="displayColumns.birthDay"
                  class="relative birth-day-column"
                >
                  <div>
                    生年月日
                    <svg
                      id="Icon_pulldown"
                      class="sort"
                      data-name="Icon/pulldown"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      @click="openSortDialog('birthDay')"
                    >
                      <path
                        id="Path_845"
                        data-name="Path 845"
                        d="M450.361,106.779l-4.549,7.06a.44.44,0,0,1-.746,0l-4.549-7.06a.471.471,0,0,1,.373-.733h9.1A.471.471,0,0,1,450.361,106.779Z"
                        transform="translate(-440.439 -106.046)"
                        fill="#7e8195"
                      />
                    </svg>
                  </div>
                  <div v-if="showSortDialog.birthDay" class="sort-dialog">
                    <ul>
                      <li
                        :class="{ selected: 'desc' === orderStates.birthDay }"
                        @click="sortByBirthDay('desc')"
                      >
                        日付が新しい順
                      </li>
                      <li
                        :class="{ selected: 'asc' === orderStates.birthDay }"
                        @click="sortByBirthDay('asc')"
                      >
                        日付が古い順
                      </li>
                      <li @click="resetOrder({ ...orderStates, birthDay: '' })">
                        順番を元に戻す
                      </li>
                    </ul>
                  </div>
                </th>
                <th v-if="displayColumns.gender" class="gender-column">性別</th>
                <th
                  v-if="displayColumns.enrollmentStatus"
                  class="enrollment-status-column"
                >
                  在籍状況
                </th>
                <th
                  v-if="displayColumns.lastAccess"
                  class="relative last-access-column"
                >
                  <div>
                    最終アクセス
                    <svg
                      id="Icon_pulldown"
                      class="sort"
                      data-name="Icon/pulldown"
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      @click="openSortDialog('lastAccessDate')"
                    >
                      <path
                        id="Path_845"
                        data-name="Path 845"
                        d="M450.361,106.779l-4.549,7.06a.44.44,0,0,1-.746,0l-4.549-7.06a.471.471,0,0,1,.373-.733h9.1A.471.471,0,0,1,450.361,106.779Z"
                        transform="translate(-440.439 -106.046)"
                        fill="#7e8195"
                      />
                    </svg>
                  </div>
                  <div v-if="showSortDialog.lastAccessDate" class="sort-dialog">
                    <ul>
                      <li
                        :class="{
                          selected: 'desc' === orderStates.lastAccessDate,
                        }"
                        @click="sortByLastAccessDate('desc')"
                      >
                        日付が新しい順
                      </li>
                      <li
                        :class="{
                          selected: 'asc' === orderStates.lastAccessDate,
                        }"
                        @click="sortByLastAccessDate('asc')"
                      >
                        日付が古い順
                      </li>
                      <li
                        @click="
                          resetOrder({ ...orderStates, lastAccessDate: '' })
                        "
                      >
                        順番を元に戻す
                      </li>
                    </ul>
                  </div>
                </th>
                <th v-if="displayColumns.smartPhone" class="smart-phone-column">
                  スマホ利用
                </th>
              </tr>
              <tr v-for="(user, index) in users" :key="user.uuid">
                <td>
                  <checkbox
                    v-model="selectGroup"
                    :value="user.user_uuid"
                    @change="onClickCheckbox"
                  />
                </td>
                <td>{{ totalUserCount - (offset + index) }}</td>
                <td class="name-column">
                  <router-link
                    :to="
                      `/admin/employee-management/employees/${user.user_uuid}`
                    "
                    class="name"
                  >
                    {{ user.user_name }}
                  </router-link>
                </td>
                <td class="additional-column">
                  <div
                    v-if="user.is_registered_additional"
                    class="additional-btn additional-btn--registered"
                  >
                    登録済
                  </div>
                  <div
                    v-else
                    class="additional-btn additional-btn--unregistered"
                    @click="goToAdditional(user.organization_uuid)"
                  >
                    未登録
                  </div>
                </td>
                <!-- 所属組織（BOX） -->
                <td
                  v-show="displayColumns.organization"
                  class="organization-box-column"
                >
                  <div
                    v-if="
                      filterOrganizationUuid !== '' &&
                        user.organization_uuid !== filterOrganizationUuid &&
                        user.sub_organizations.includes(filterOrganizationUuid)
                    "
                    class="sub-organization__flex"
                  >
                    <div class="sub-organization__with-tag">
                      <span>
                        {{ getOrganizationNameByID(filterOrganizationUuid) }}
                      </span>
                      <svg
                        class="sub-organization__sub-tag"
                        xmlns="http://www.w3.org/2000/svg"
                        width="41.021"
                        height="19"
                        viewBox="0 0 41.021 19"
                      >
                        <g
                          id="icon_tag"
                          data-name="icon/tag"
                          transform="translate(0.521 0.5)"
                        >
                          <path
                            id="Subtraction_16"
                            data-name="Subtraction 16"
                            d="M37.94,18H5.7A1.988,1.988,0,0,1,3.99,16.853L.175,9.711a1.549,1.549,0,0,1,0-1.427L3.99,1.143A1.987,1.987,0,0,1,5.7,0H37.94A2.361,2.361,0,0,1,40,2.57V15.427A2.361,2.361,0,0,1,37.94,18ZM7,7A2,2,0,1,0,9,9,2,2,0,0,0,7,7Z"
                            transform="translate(-0.001 0.002)"
                            fill="#f5bc49"
                            stroke="rgba(0,0,0,0)"
                            stroke-miterlimit="10"
                            stroke-width="1"
                          />
                          <g
                            id="sub"
                            transform="translate(-269.363 -410.25)"
                            style="isolation: isolate;"
                          >
                            <path
                              id="Path_3635"
                              data-name="Path 3635"
                              d="M283.145,421.259c.221.884.7,1.234,1.716,1.234.962,0,1.56-.377,1.56-.988a.794.794,0,0,0-.338-.649c-.247-.169-.325-.183-1.365-.416a7.9,7.9,0,0,1-1.872-.56,1.859,1.859,0,0,1-1.144-1.728,1.934,1.934,0,0,1,.4-1.209,3.135,3.135,0,0,1,2.6-1.015,3.547,3.547,0,0,1,2.444.755,2.527,2.527,0,0,1,.7,1.286l-1.716.222c-.143-.715-.585-1.027-1.43-1.027-.806,0-1.352.364-1.352.91a.7.7,0,0,0,.4.611,5.475,5.475,0,0,0,1.3.39,5.572,5.572,0,0,1,2.288.793,1.847,1.847,0,0,1,.754,1.612,2.088,2.088,0,0,1-.637,1.468,3.833,3.833,0,0,1-2.691.845,3.434,3.434,0,0,1-2.9-1.156,2.937,2.937,0,0,1-.507-1.157Z"
                              fill="#fff"
                            />
                            <path
                              id="Path_3636"
                              data-name="Path 3636"
                              d="M296.522,416.136a9.43,9.43,0,0,0-.1,1.691v4.082a10.7,10.7,0,0,0,.1,1.69h-1.768v-.69c0-.2,0-.233.013-.558a3.3,3.3,0,0,1-4.225,1.013,2.424,2.424,0,0,1-1.053-2.248v-3.289a11.975,11.975,0,0,0-.1-1.691h1.885a11.649,11.649,0,0,0-.091,1.691v2.885a1.586,1.586,0,0,0,.6,1.482,1.617,1.617,0,0,0,.715.182c.936,0,1.677-.636,2.262-1.923v-2.626a13.745,13.745,0,0,0-.1-1.691Z"
                              fill="#fff"
                            />
                            <path
                              id="Path_3637"
                              data-name="Path 3637"
                              d="M298.146,423.6a13.667,13.667,0,0,0,.091-1.755v-6.851a15.189,15.189,0,0,0-.091-1.743h1.833a13.446,13.446,0,0,0-.09,1.755v1.3c0,.208-.013.533-.027.976a3.034,3.034,0,0,1,2.679-1.314c2.184,0,3.471,1.417,3.471,3.835a4.257,4.257,0,0,1-1.066,3.043,3.333,3.333,0,0,1-2.5.935,2.831,2.831,0,0,1-2.588-1.287c.014.169.014.313.014.468v.638Zm4.2-6.266a2.323,2.323,0,0,0-1.768.714,2.8,2.8,0,0,0-.638,1.808,2.71,2.71,0,0,0,.859,2.054,2.271,2.271,0,0,0,1.365.481c1.313,0,2.158-1.015,2.158-2.588C304.322,418.308,303.542,417.333,302.346,417.333Z"
                              fill="#fff"
                            />
                          </g>
                        </g>
                      </svg>
                    </div>
                  </div>
                  <CustomSelect
                    v-else-if="divisions.length"
                    v-model="user.organization_uuid"
                    :items="divisions"
                    class="organization-box-select"
                    @change="updateMemberInfo(user)"
                  />
                </td>
                <td
                  v-if="displayColumns.subOrganization"
                  class="table__border table__detail-sub-organization"
                >
                  <div class="sub-organization__flex">
                    <div class="sub-organization__names">
                      <popper
                        trigger="hover"
                        :disabled="
                          selectedSubOrganizationNames(user.sub_organizations)
                            .length <= 10
                        "
                        :options="{
                          placement: 'bottom-start',
                          modifiers: { offset: { offset: '0,3px' } },
                        }"
                      >
                        <div class="popper-full">
                          {{
                            selectedSubOrganizationNames(user.sub_organizations)
                          }}
                        </div>
                        <span slot="reference">
                          {{
                            limitedString(
                              selectedSubOrganizationNames(
                                user.sub_organizations
                              ),
                              10
                            )
                          }}
                        </span>
                      </popper>
                    </div>
                    <button
                      class="sub-organization__setting sub-organization__button"
                      @click="toggleUpdateSubOrganizationModal(user)"
                    >
                      設定
                    </button>
                  </div>
                </td>
                <!-- 役職 -->
                <td v-show="displayColumns.position" class="position-column">
                  <CustomSelect
                    v-if="divisions.length"
                    v-model="user.employment_position_uuid"
                    :items="positions"
                    position
                    class="position-select"
                    @open-position-register-modal="
                      togglePositionRegisterModal(user)
                    "
                    @change="updateMemberInfo(user)"
                  />
                </td>
                <!-- 雇用形態 -->
                <td v-show="displayColumns.status" class="status-column">
                  <CustomSelect
                    v-if="divisions.length"
                    v-model="user.employment_status_uuid"
                    :items="statuses"
                    employment-status
                    class="position-select"
                    @open-employment-status-register-modal="
                      toggleStatusRegisterModal(user)
                    "
                    @change="updateMemberInfo(user)"
                  />
                </td>
                <!-- 利用権限 -->
                <td v-show="displayColumns.authority" class="authority-column">
                  <BaseSelect
                    v-model="user.access_permission"
                    class="middle authority-select"
                    :items="accessPermissionOptions(enumAccessPermissions)"
                    :large-height="false"
                    @input="updateMemberInfo(user)"
                  />
                </td>
                <!-- 投稿頻度（マイエピソード） -->
                <td
                  v-show="displayColumns.postFrequence"
                  class="post-frequence-column"
                >
                  <BaseSelect
                    v-model="user.my_episode"
                    :items="postRuleWithLabels(configRules.my_episode)"
                    :large-height="false"
                    @input="updateMemberInfo(user)"
                  />
                </td>
                <!-- アカウント -->
                <td v-if="displayColumns.accountStatus" class="account-column">
                  {{ accountStatus(user) }}
                </td>
                <!-- 入社日 -->
                <td v-if="displayColumns.hireDate" class="hire-date-column">
                  {{ user.joined_year }}年 {{ user.joined_month }}月
                </td>
                <!-- 参加コミュニティ -->
                <td
                  v-if="displayColumns.joinedCommunity"
                  class="joined-community-column"
                >
                  <LineClampPopper
                    :text="
                      user.communities.map((community) => community.name).join()
                    "
                  />
                </td>
                <!-- 生年月日 -->
                <td v-if="displayColumns.birthDay" class="birth-day-column">
                  {{ formattedDate(user.birthday) }}
                </td>
                <!-- 性別 -->
                <td v-if="displayColumns.gender" class="gender-column">
                  {{ gender(user.gender) }}
                </td>
                <!-- 在籍状況 -->
                <td
                  v-show="displayColumns.enrollmentStatus"
                  class="enrollment-status-column"
                >
                  <BaseSelect
                    v-model="user.enrollment_status"
                    class="middle enrollment-status-select"
                    :items="selectItems.enrollmentStatus"
                    :large-height="false"
                    @input="updateMemberInfo(user)"
                  />
                </td>
                <!-- 最終アクセス -->
                <td v-if="displayColumns.lastAccess" class="last-access-column">
                  {{ formattedDateToTimestamp(user.last_accessed_at) }}
                </td>
                <!-- スマホ利用 -->
                <td v-if="displayColumns.smartPhone" class="smart-phone-column">
                  {{ isUsingSmartphoneToJapanese(user) }}
                </td>
              </tr>
            </table>
          </div>
          <div class="pagination-box">
            <BasePagination
              v-model="pagination"
              @go-to-page="goToPage($event)"
            />
          </div>
        </div>
        <vue-loading
          v-if="isChangingCompany"
          type="spin"
          color="#333"
          :size="{ width: '50px', height: '50px' }"
        ></vue-loading>
      </template>
    </div>
    <vue-loading
      v-if="isLoadingTable"
      type="spin"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    ></vue-loading>
    <UserFilterModal
      v-if="showUserFilterModal"
      v-model="filterParams"
      :display-columns="displayColumns"
      :communities="communities"
      :organizations="divisions"
      :positions="positions"
      :statuses="statuses"
      :enrollments="selectItems.enrollmentStatus"
      :frequencies="selectItems.postFrequence"
      @filter="filter"
      @close="showUserFilterModal = false"
    />
    <BulkUserSettingModal
      v-if="showBulkUserSettingModal"
      :display-columns="displayColumns"
      :divisions="divisions"
      :positions="positions"
      :statuses="statuses"
      :enrollments="selectItems.enrollmentStatus"
      :frequencies="selectItems.postFrequence"
      :communities="communities"
      @bulk-update="bulkUpdateMembersInfo($event)"
      @close="showBulkUserSettingModal = false"
    />
    <PositionRegisterModal
      v-if="showPositionRegisterModal"
      :positions="positions"
      @close="togglePositionRegisterModal"
      @register-position="registerPosition($event)"
      @delete="deletePosition($event)"
    ></PositionRegisterModal>
    <check-delete
      v-if="showCheckDeleteModal"
      delete-button-text="完全に削除"
      @click="bulkDeleteMembers"
      @close="showCheckDeleteModal = false"
    >
      <div>
        <div>このメンバーを完全に削除しますか？</div>
        <div class="red">
          削除した場合、登録している情報を元に戻すことはできません。
        </div>
      </div>
    </check-delete>
    <update-sub-organization-modal
      v-if="updateSubOrganizationModal"
      :organizations="organizations"
      :selected-member="selectedMember"
      @close="toggleUpdateSubOrganizationModal"
      @update="updateSubOrganizations"
    />
    <LoadingOverlay v-if="isLoadingOverlay"></LoadingOverlay>
    <employment-status-register-modal
      v-if="showEmploymentStatusRegisterModal"
      :employment-statuses="statuses"
      @close="toggleStatusRegisterModal"
      @register-employment-status="registerEmploymentStatus($event)"
      @delete="deleteEmploymentStatus"
    ></employment-status-register-modal>
    <alert-message v-if="showAlertMessage" @close="showAlertMessage = false"
      >所属組織とサブ組織は同じものにすることはできません。</alert-message
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';
import {
  UserFilterModal,
  BulkUserSettingModal,
  PositionRegisterModal,
  LoadingOverlay,
} from '@/components/Admin/Pages/';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import { CheckDelete, AlertMessage } from '@/components/Admin/Modules/Modal';
import ScrollableTabs from '@/components/Admin/Modules/Tab/ScrollableTabs.vue';
import CustomSelect from '@/components/Admin/Modules/Input/CustomSelect.vue';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';
import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';
import { VueLoading } from 'vue-loading-template';
import {
  fetchOrganizations,
  fetchOrganizationUsers,
  fetchOrganizationPositions,
  fetchEmploymentStatus,
  updateMembers,
  deleteMembers,
  createPositions,
  deletePositions,
  fetchCommunities,
  fetchConfigRules,
  updateUserSubOrganizations,
  createOrganizationsEmploymentStatuses,
  deleteOrganizationsEmploymentStatuses,
} from '@/libs/api';
import dayjs from '@/libs/dayjs';
import moment from 'moment';
import Checkbox from '@/components/Admin/Pages/EmployeeManagement/Checkbox.vue';
import SingleCheckBox from '@/components/Admin/Pages/EmployeeManagement/SingleCheckBox.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BasePagination from '@/components/Admin/Modules/Pagination/BasePagination.vue';
import { LineClampPopper } from '@/components/Admin/Modules/Popper';
import { enumAccessPermissions } from '@/libs/definition';
import UpdateSubOrganizationModal from '@/components/Admin/Pages/EmployeeManagement/UpdateSubOrganizationModal.vue';
import EmploymentStatusRegisterModal from '@/components/Admin/Pages/Employees/EmploymentStatusRegisterModal.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';

type selectGroup = string[];
type User = ApiResponse.UsersInformation;
type Division = {
  uuid: string;
  name: string;
  user_count: number;
  upperOrganization?: string;
};
type UpdatePayload = ApiRequest.PostMember;
type OrderState = 'asc' | 'desc' | '';
type OrderStates = {
  name: OrderState;
  organization: OrderState;
  birthDay: OrderState;
  hireDate: OrderState;
  lastAccessDate: OrderState;
};
type Pagination = {
  number: number;
  offset: number;
  limit: number;
  total: number;
};

export default Vue.extend({
  layout: 'admin/default',
  components: {
    ScrollableTabs,
    UserFilterModal,
    BulkUserSettingModal,
    PositionRegisterModal,
    CheckDelete,
    Popper,
    CustomSelect,
    VueLoading,
    PageHeader,
    BasePagination,
    Checkbox,
    BaseButton,
    LineClampPopper,
    BaseSelect,
    UpdateSubOrganizationModal,
    LoadingOverlay,
    SingleCheckBox,
    EmploymentStatusRegisterModal,
    AlertMessage,
    TutorialButtonIcon,
  },
  data() {
    return {
      limit: 20,
      offset: 0,
      page: 1,
      totalUserCount: 0,
      showUserFilterModal: false,
      showBulkUserSettingModal: false,
      positionRegisterUser: null as ApiResponse.UsersInformation,
      statusRegisterUser: null as ApiResponse.UsersInformation,
      showPositionRegisterModal: false,
      showEmploymentStatusRegisterModal: false as boolean,
      showCheckDeleteModal: false,
      showAuthorityDialog: false,
      showProcedure: false as boolean,
      showSortDialog: {
        name: false as boolean,
        organization: false as boolean,
        subOrganization: false as boolean,
        birthDay: false as boolean,
        hireDate: false as boolean,
        lastAccessDate: false as boolean,
        position: false as boolean,
        status: false as boolean,
      },
      displayColumns: {
        checkbox: true,
        no: true,
        name: true,
        organization: true, // 部署・支店・店舗
        subOrganization: true,
        position: true, // 役職
        status: true, // 雇用形態
        authority: false, // 利用権限
        postFrequence: false, // 投稿頻度
        accountStatus: false, // アカウント
        hireDate: false, // 入社日
        joinedCommunity: false, // 参加コミュニティ
        birthDay: false, // 生年月日
        gender: false, // 性別
        enrollmentStatus: false, // 在籍状況
        lastAccess: false, // 最終アクセス
        smartPhone: false, // スマホ利用
      },
      filterParams: {
        name: '',
        organization: '',
        position: '',
        status: '',
        authority: '',
        my_episode: '',
        is_active: '',
        community: '',
        gender: '',
        enrollment_statuses: '',
        used_smartphone: '',
      },
      orderStates: {
        name: '',
        organization: '',
        subOrganization: '',
        birthDay: '',
        hireDate: '',
        lastAccessDate: '',
        position: '',
        status: '',
      } as OrderStates,
      numberOfUserBelongToOrganization: {} as { [key: string]: number },
      selectItems: {
        postFrequence: [
          { uuid: '1', name: 'ゆっくり', value: 'slowly' },
          { uuid: '2', name: '普通', value: 'normal' },
          { uuid: '3', name: '頻繁', value: 'frequent' },
        ],
        enrollmentStatus: [
          { uuid: '1', value: 'currently_enrolled', name: '在籍中' },
          { uuid: '2', value: 'on_leave', name: '休職中' },
          { uuid: '3', value: 'retirement', name: '退職' },
        ],
      },
      communities: [] as Pick<ApiResponse.Community, 'uuid' | 'name'>[],
      organizations: [] as ApiResponse.GroupOrganization[],
      companies: [] as ApiResponse.GroupOrganization[],
      divisions: [] as Division[],
      currentUuid: this.$route.params.id as string,
      users: [] as ApiResponse.UsersInformation[],
      lock: false,
      positions: [] as ApiResponse.Position[],
      statuses: [] as ApiResponse.EmploymentStatus[],
      rules: [] as ApiResponse.OrganizationRule[],
      selectGroup: [] as selectGroup,
      displayGroup: 'default' as string,
      isLoading: false as boolean,
      isLoadingTable: false as boolean,
      isChangingCompany: false as boolean,
      displayFields: ['organization', 'subOrganization', 'position', 'status'],
      isAllChecked: [] as string[],
      isOpened: true,
      configRules: {} as ApiResponse.ConfigRules,
      updateSubOrganizationModal: false as boolean,
      selectedMember: {} as ApiRequest.PostUser,
      filterOrganizationUuid: '' as string,
      isLoadingOverlay: false as boolean,
      postRules: [
        {
          value: 'slowly',
          name: 'ゆっくり',
        },
        {
          value: 'normal',
          name: '普通',
        },
        {
          value: 'frequent',
          name: '頻繁',
        },
      ],
      postRuleLabelMap: {
        three_months: '3ヶ月',
        month: '1ヶ月',
        week: '一週間',
        two_years: '2年',
        year: '1年',
        six_months: '6ヶ月',
      } as { [key: string]: string },
      filterSelectOption: [
        {
          value: 20,
          name: '20件',
        },
        {
          value: 50,
          name: '50件',
        },
        {
          value: 100,
          name: '100件',
        },
        {
          value: 200,
          name: '200件',
        },
      ],
      showAlertMessage: false as boolean,
    };
  },
  computed: {
    pagination: {
      set(value: Pagination) {
        this.page = value.number;
        this.offset = value.offset;
      },
      get(): Pagination {
        return {
          number: this.page,
          offset: this.offset,
          limit: this.limit,
          total: this.totalUserCount,
        };
      },
    },
    isChecked(): boolean {
      return !!this.$data.selectGroup.length;
    },
    active() {
      return (id: string): boolean => {
        return this.$data.currentUuid === id;
      };
    },
    accountStatus() {
      return (user: ApiResponse.UsersInformation) => {
        if (user.is_active === 'false') {
          return '停止中';
        }
        if (user.is_active) {
          return '本登録完了';
        }
        if (user.is_sent) {
          return '発行済み';
        }
        return '未発行';
      };
    },
    gender() {
      return (gender: string) => {
        if (gender === 'man') {
          return '男性';
        }
        if (gender === 'woman') {
          return '女性';
        }
        if (gender === 'free') {
          return '回答なし';
        }
        return '';
      };
    },
    enumAccessPermissions(): object {
      return enumAccessPermissions;
    },
    selectedSubOrganizationNames() {
      return (organizationIds: string[]): string => {
        if (!organizationIds) return '';
        return this.organizations
          .filter((organization: ApiResponse.Organization) => {
            return organizationIds.includes(organization.uuid);
          })
          .flatMap(
            (organization: ApiResponse.Organization) => organization.name
          )
          .join(' ');
      };
    },
    getOrganizationNameByID() {
      return (organizationId: string) => {
        if (!organizationId) return '';
        return this.organizations.find(
          (organization: ApiResponse.Organization) =>
            organization.uuid === organizationId
        )!.name;
      };
    },
  },
  watch: {
    displayFields() {
      if (this.displayGroup === '') return;

      if (this.displayGroup === 'account') {
        if (
          !this.displayFields.includes('organization') ||
          !this.displayFields.includes('position') ||
          !this.displayFields.includes('status') ||
          !this.displayFields.includes('accountStatus')
        ) {
          this.displayGroup = '';
        }
      }
      if (this.displayGroup === 'personal-information') {
        if (
          !this.displayFields.includes('birthDay') ||
          !this.displayFields.includes('hireDate') ||
          !this.displayFields.includes('gender') ||
          !this.displayFields.includes('joinedCommunity')
        ) {
          this.displayGroup = '';
        }
      }
      if (this.displayGroup === 'authority-and-post-rule') {
        if (
          !this.displayFields.includes('postFrequence') ||
          !this.displayFields.includes('authority')
        ) {
          this.displayGroup = '';
        }
      }
      if (this.displayGroup === 'default') {
        if (
          !this.displayFields.includes('organization') ||
          !this.displayFields.includes('subOrganization') ||
          !this.displayFields.includes('position') ||
          !this.displayFields.includes('status')
        ) {
          this.displayGroup = '';
        }
      }
    },
  },
  async created() {
    this.isLoading = true;
    const allPromise = Promise.all([
      fetchCommunities(1, [], 100),
      fetchOrganizations({ independent: 'true' }),
      fetchConfigRules(),
      fetchOrganizationPositions(),
      fetchEmploymentStatus(),
    ]);
    const [
      {
        data: { data: communities },
      },
      { data: organizationData },
      { data: configRules },
      { data: positionsData },
      { data: statuses },
    ] = await allPromise;

    this.organizations = organizationData.organizations;
    this.companies = organizationData.organizations.filter(
      (n: ApiResponse.Organization) => n.layer === 0
    );
    if (
      !this.companies
        .map((company: ApiResponse.Organization) => company.uuid)
        .includes(this.currentUuid)
    ) {
      this.currentUuid = this.companies[0] ? this.companies[0].uuid : '';
    }
    this.divisions = this.getDivisions();

    // 投稿ルール
    this.configRules = configRules;

    // ユーザー一覧取得
    this.users = await this.getUsers();

    // 組織に所属するユーザ数のハッシュマップを作成
    this.numberOfUserBelongToOrganization = this.getUserCountHashMap();

    // 役職一覧取得
    this.positions = positionsData;

    this.statuses = statuses;

    this.communities = communities.map((c: ApiResponse.Community) => ({
      uuid: c.uuid,
      name: c.name,
    }));

    this.isLoading = false;
  },
  methods: {
    selectField(field: string) {
      // @ts-ignore
      this.displayColumns[field] = this.displayFields.includes(field);
    },
    sortByName(order: OrderState = 'asc') {
      if (order === 'asc') {
        this.users.sort((a: User, b: User) =>
          a.user_kana.localeCompare(b.user_kana, 'ja')
        );
      }

      if (order === 'desc') {
        this.users.sort(
          (a: User, b: User) => -a.user_kana.localeCompare(b.user_kana, 'ja')
        );
      }

      this.orderStates = {
        organization: '',
        birthDay: '',
        hireDate: '',
        lastAccessDate: '',
        position: '',
        status: '',
        name: order,
      };
    },
    sortByUserCount(order: OrderState = 'asc') {
      if (order === 'asc') {
        this.users = _.sortBy(this.users, ['organization_name']);
        this.users.sort((a: User, b: User) => {
          const c = this.numberOfUserBelongToOrganization[a.organization_uuid];
          const d = this.numberOfUserBelongToOrganization[b.organization_uuid];
          if (c > d) return -1;
          if (c < d) return 1;
          return 0;
        });
      }

      if (order === 'desc') {
        this.users.sort((a: User, b: User) => {
          const c = this.numberOfUserBelongToOrganization[a.organization_uuid];
          const d = this.numberOfUserBelongToOrganization[b.organization_uuid];
          if (c < d) return -1;
          if (c > d) return 1;
          return 0;
        });
      }

      this.orderStates = {
        name: '',
        birthDay: '',
        hireDate: '',
        lastAccessDate: '',
        position: '',
        status: '',
        organization: order,
      };
    },
    sortByBirthDay(order: OrderState = 'asc') {
      if (order === 'asc') {
        this.users.sort((a: User, b: User) => {
          const c = moment(a.birthday, 'YYYY-MM-DD').unix();
          const d = moment(b.birthday, 'YYYY-MM-DD').unix();
          if (c > d) return 1;
          if (c < d) return -1;
          return 0;
        });
      }

      if (order === 'desc') {
        this.users.sort((a: User, b: User) => {
          const c = moment(a.birthday, 'YYYY-MM-DD').unix();
          const d = moment(b.birthday, 'YYYY-MM-DD').unix();
          if (c < d) return 1;
          if (c > d) return -1;
          return 0;
        });
      }

      this.orderStates = {
        name: '',
        hireDate: '',
        lastAccessDate: '',
        organization: '',
        position: '',
        status: '',
        birthDay: order,
      };
    },
    sortByhireDate(order: OrderState = 'asc') {
      if (order === 'asc') {
        this.users.sort((a: User, b: User) => {
          const c = this.toTimestamp(a.joined_year, a.joined_month);
          const d = this.toTimestamp(b.joined_year, b.joined_month);
          if (c > d) return 1;
          if (c < d) return -1;
          return 0;
        });
      }

      if (order === 'desc') {
        this.users.sort((a: User, b: User) => {
          const c = this.toTimestamp(a.joined_year, a.joined_month);
          const d = this.toTimestamp(b.joined_year, b.joined_month);
          if (c < d) return 1;
          if (c > d) return -1;
          return 0;
        });
      }

      this.orderStates = {
        name: '',
        lastAccessDate: '',
        organization: '',
        birthDay: '',
        position: '',
        status: '',
        hireDate: order,
      };
    },
    sortByLastAccessDate(order: OrderState = 'asc') {
      if (order === 'asc') {
        this.users.sort((a: User, b: User) => {
          const c = a.last_accessed_at;
          const d = b.last_accessed_at;
          if (c > d) return 1;
          if (c < d) return -1;
          return 0;
        });
      }

      if (order === 'desc') {
        this.users.sort((a: User, b: User) => {
          const c = a.last_accessed_at;
          const d = b.last_accessed_at;
          if (c < d) return 1;
          if (c > d) return -1;
          return 0;
        });
      }

      this.orderStates = {
        name: '',
        organization: '',
        birthDay: '',
        hireDate: '',
        position: '',
        status: '',
        lastAccessDate: order,
      };
    },
    sortByPositionOrder(order: OrderState = 'asc') {
      if (order === 'asc') {
        this.users.sort((a: User, b: User) => {
          const c = a.employment_position_order_number;
          const d = b.employment_position_order_number;
          if (c > d) return 1;
          if (c < d) return -1;
          return 0;
        });
      }

      if (order === 'desc') {
        this.users.sort((a: User, b: User) => {
          const c = a.employment_position_order_number;
          const d = b.employment_position_order_number;
          if (c < d) return 1;
          if (c > d) return -1;
          return 0;
        });
      }

      this.orderStates = {
        name: '',
        organization: '',
        birthDay: '',
        hireDate: '',
        lastAccessDate: '',
        status: '',
        position: order,
      };
    },
    sortByStatusOrder(order: OrderState = 'asc') {
      if (order === 'asc') {
        this.users.sort((a: User, b: User) => {
          const c = a.employment_status_order_number;
          const d = b.employment_status_order_number;
          if (c > d) return 1;
          if (c < d) return -1;
          return 0;
        });
      }

      if (order === 'desc') {
        this.users.sort((a: User, b: User) => {
          const c = a.employment_status_order_number;
          const d = b.employment_status_order_number;
          if (c < d) return 1;
          if (c > d) return -1;
          return 0;
        });
      }

      this.orderStates = {
        name: '',
        organization: '',
        birthDay: '',
        hireDate: '',
        lastAccessDate: '',
        position: '',
        status: order,
      };
    },
    resetOrder(states: OrderStates) {
      this.users = _.orderBy(this.users, 'number', 'desc');
      this.orderStates = states;
    },
    toTimestamp(y: number, m: number) {
      return moment(`${y}-${m}`, 'YYYY-MM').unix();
    },
    async getUsers() {
      if (this.currentUuid) {
        const { data: usersData } = await fetchOrganizationUsers(
          this.currentUuid,
          {
            limit: this.limit,
            offset: this.offset,
            ...this.filterParams,
          }
        );
        this.totalUserCount = usersData.total_count;
        this.selectGroup = [];
        return usersData.users;
      }
      return [];
    },
    async goToPage(page: number) {
      this.offset = this.limit * (page - 1);
      this.isLoadingTable = true;
      this.users = await this.getUsers();
      this.isLoadingTable = false;
      this.page = page;
    },
    async sortNumberPerPage() {
      this.offset = 0;
      this.page = 1;
      this.filter();
    },
    async filter() {
      this.isLoadingTable = true;
      this.filterOrganizationUuid = this.filterParams.organization;
      this.offset = 0;
      this.page = 1;
      this.users = await this.getUsers();
      this.showUserFilterModal = false;
      this.isAllChecked = [];

      this.isLoadingTable = false;
    },
    async bulkDeleteMembers() {
      await deleteMembers(this.currentUuid, {
        users: this.selectGroup,
      });
      this.users = await this.getUsers();
      this.showCheckDeleteModal = false;
    },
    async updateMemberInfo(user: ApiResponse.UsersInformation) {
      if (user.sub_organizations.includes(user.organization_uuid)) {
        this.showAlertMessage = true;
        return;
      }
      const data = _.pick(user, [
        'organization_uuid',
        'employment_position_uuid',
        'employment_status_uuid',
        'my_episode',
        'enrollment_status',
        'access_permission',
      ]);
      // if (data.organization_uuid === user.sub_organizations)
      try {
        await updateMembers(this.currentUuid, {
          users: [user.user_uuid],
          organization: data.organization_uuid,
          enrollment_statuses: data.enrollment_status,
          ...data,
        });
      } catch (e) {
        console.error(e);
      }
    },
    async bulkUpdateMembersInfo(payload: Omit<UpdatePayload, 'users'>) {
      const data = _.pickBy(payload);
      try {
        await updateMembers(this.currentUuid, {
          users: this.selectGroup,
          ...data,
        });
        this.users = this.users.map((user: ApiResponse.UsersInformation) => {
          const u = user;
          if (this.selectGroup.includes(u.user_uuid)) {
            u.organization_uuid = payload.organization || u.organization_uuid;
            u.employment_position_uuid =
              payload.employment_position_uuid || u.employment_position_uuid;
            u.employment_status_uuid =
              payload.employment_status_uuid || u.employment_status_uuid;
            u.my_episode = payload.my_episode || u.my_episode;
            u.enrollment_status =
              payload.enrollment_statuses || u.enrollment_status;
            u.gender = payload.gender || u.gender;
            u.access_permission =
              payload.access_permission || u.access_permission;
            u.is_using_smartphone =
              payload.used_smartphone || u.is_using_smartphone;
            u.is_active = payload.is_active || u.is_active;
            u.communities = payload.community
              ? this.mapCommunityInfo(payload.community)
              : u.communities;
          }
          return u;
        });
        this.showBulkUserSettingModal = false;
      } catch (e) {
        console.error(e);
      }
    },
    selectGrouping(groupName: string) {
      const target = {
        organization: false,
        subOrganization: false,
        position: false,
        status: false,
        authority: false,
        postFrequence: false,
        accountStatus: false,
        hireDate: false,
        joinedCommunity: false,
        birthDay: false,
        gender: false,
        enrollmentStatus: false,
      };

      if (this.displayGroup === groupName) {
        this.displayGroup = '';
        this.displayColumns = {
          checkbox: true,
          no: true,
          name: true,
          lastAccess: false,
          smartPhone: false,
          ...target,
        };
        this.displayFields = [];
        return;
      }

      this.displayGroup = groupName;

      switch (groupName) {
        case 'account':
          target.organization = true;
          target.position = true;
          target.status = true;
          target.accountStatus = true;
          this.displayFields = [
            'organization',
            'position',
            'status',
            'accountStatus',
          ];
          break;
        case 'authority-and-post-rule':
          target.postFrequence = true;
          target.authority = true;
          this.displayFields = ['postFrequence', 'authority'];
          break;
        case 'personal-information':
          target.birthDay = true;
          target.hireDate = true;
          target.gender = true;
          target.joinedCommunity = true;
          this.displayFields = [
            'birthDay',
            'hireDate',
            'gender',
            'joinedCommunity',
          ];
          break;
        case 'default':
        default:
          target.organization = true;
          target.subOrganization = true;
          target.position = true;
          target.status = true;
          this.displayFields = [
            'organization',
            'subOrganization',
            'position',
            'status',
          ];
          break;
      }

      this.displayColumns = {
        ...this.displayColumns,
        ...target,
      };
    },
    toggleAllCheck(arr: string[]) {
      this.selectGroup = arr.length
        ? this.users.map(
            (member: ApiResponse.UsersInformation) => member.user_uuid
          )
        : (this.selectGroup = []);
    },
    async registerPosition(payload: { name: string }) {
      const { data } = await createPositions(payload);
      this.positions.push(data[0]);
      const userIndex = this.users.indexOf(this.positionRegisterUser);
      this.users[userIndex].employment_position_uuid = data[0].uuid;
      await this.updateMemberInfo(this.users[userIndex]);
      this.positionRegisterUser = null;
    },
    async deletePosition(uuid: string) {
      await deletePositions(uuid);
      const defaultPosition = this.positions.filter(
        (item: ApiResponse.Position) => item.is_default
      )[0];
      this.users = this.users.map((user: ApiResponse.UsersInformation) => {
        if (user.employment_position_uuid === uuid) {
          return {
            ...user,
            employment_position_uuid: defaultPosition.uuid,
          };
        }
        return user;
      });
      this.positions = this.positions.filter(
        (position: ApiResponse.Position) => position.uuid !== uuid
      );
    },
    toggleProcedure() {
      this.showProcedure = !this.showProcedure;
    },
    openSortDialog(title: string) {
      switch (title) {
        case 'name':
          this.showSortDialog.name = true;
          break;
        case 'organization':
          this.showSortDialog.organization = true;
          break;
        case 'birthDay':
          this.showSortDialog.birthDay = true;
          break;
        case 'hireDate':
          this.showSortDialog.hireDate = true;
          break;
        case 'lastAccessDate':
          this.showSortDialog.lastAccessDate = true;
          break;
        case 'position':
          this.showSortDialog.position = true;
          break;
        case 'status':
          this.showSortDialog.status = true;
          break;
        default:
          return;
      }

      this.lock = true;
      setTimeout(() => {
        this.lock = false;
        if (document == null) {
          return;
        }
        const d: any = document;
        d.getElementById('__nuxt').addEventListener(
          'click',
          this.closeSortDialog,
          false
        );
      }, 250);
    },
    closeSortDialog() {
      if (this.lock || document == null) {
        return;
      }
      this.showSortDialog = {
        name: false,
        organization: false,
        birthDay: false,
        hireDate: false,
        lastAccessDate: false,
        position: false,
        status: false,
      };
      const d: any = document;
      d.getElementById('__nuxt').removeEventListener(
        'click',
        this.closeSortDialog,
        false
      );
    },
    async changeCompanyTab(uuid: string) {
      this.filterOrganizationUuid = '';
      this.filterParams = {
        name: '',
        organization: '',
        position: '',
        status: '',
        authority: '',
        my_episode: '',
        is_active: '',
        community: '',
        gender: '',
        enrollment_statuses: '',
        used_smartphone: '',
      };
      this.isChangingCompany = true;
      this.currentUuid = uuid;
      this.limit = 20;
      this.offset = 0;
      this.page = 1;
      // 組織一覧取得
      this.divisions = this.getDivisions();
      // 組織に所属するユーザ数のハッシュマップを作成
      this.numberOfUserBelongToOrganization = this.getUserCountHashMap();
      // ユーザー取得
      this.users = await this.getUsers();
      this.isChangingCompany = false;
    },
    getUserCountHashMap() {
      return _.mapValues(
        _.keyBy(
          this.divisions.map((d: Division) => {
            return {
              uuid: d.uuid,
              user_count: this.users.filter(
                (u: User) => u.organization_uuid === d.uuid
              ).length,
            };
          }),
          'uuid'
        ),
        'user_count'
      );
    },
    isUsingSmartphoneToJapanese(user: any) {
      if (user.is_using_smartphone === '') {
        return '選択してください。';
      }
      if (user.is_using_smartphone === 'false') {
        return '利用なし';
      }
      return user.is_using_smartphone ? '利用あり' : '利用なし';
    },
    formattedDate(birthday: string) {
      if (!birthday) {
        return '';
      }
      return dayjs(birthday).format('YYYY年MM月DD日');
    },
    formattedDateToTimestamp(timestamp: number) {
      if (!timestamp) return '';
      return moment
        .unix(timestamp)
        .utc()
        .format('YYYY年MM月DD日');
    },
    getDivisions() {
      const divisions = this.organizations.filter(
        (n: ApiResponse.Organization) =>
          n.relations.company === this.currentUuid &&
          (n.layer === 1 || n.layer === 2)
      );

      const independentIndex = divisions.findIndex(
        (n: ApiResponse.Organization) => n.type === 'independent'
      );
      if (independentIndex > -1) {
        const independent = divisions[independentIndex];
        divisions.splice(independentIndex, 1);
        divisions.push(independent);
      }

      return divisions.map((division: ApiResponse.GroupOrganization) => {
        const d: Division = division;
        if (division.relations.parent) {
          d.upperOrganization = this.organizations.find(
            (o: ApiResponse.GroupOrganization) =>
              o.uuid === division.relations.parent
          )!.name;
        }
        return d;
      });
    },
    onClickCheckbox(selectGroup: string[]) {
      this.isAllChecked =
        selectGroup.length === this.users.length ? ['true'] : [];
    },
    toggleDisplayFields() {
      this.isOpened = !this.isOpened;
    },
    postRuleWithLabels(configRules: object): object[] {
      return this.postRules.map((postRule: object) => {
        const label = this.postRuleLabelMap[configRules[postRule.value]] ?? '';
        const name = `${postRule.name}（${label}）`;
        return { ...postRule, name };
      });
    },
    statusesOptions(statuses: object): object[] {
      return statuses.map((status: object) => {
        const value = status.uuid;
        const name = status.display_name;
        return { value, name };
      });
    },
    accessPermissionOptions(ojb: object): object[] {
      return ojb.map((o: object) => {
        const value = o.key;
        return { ...o, value };
      });
    },
    goToAdditional(organizationUuid: string) {
      this.isLoadingOverlay = true;
      this.$router.push({
        path: `/admin/employee-management/addition?organization=${organizationUuid}`,
      });
    },
    toggleUpdateSubOrganizationModal(member: ApiResponse.fetchUser) {
      this.updateSubOrganizationModal = !this.updateSubOrganizationModal;
      this.selectedMember = member;
    },
    updateSubOrganizations(selectedMember: ApiResponse.fetchUser) {
      const updateSelectedMember = { ...selectedMember };
      this.updateUserSubOrganizations(updateSelectedMember);
      this.users = this.users.map((member: ApiResponse.fetchUser) => {
        if (member.user_uuid === updateSelectedMember.user_uuid) {
          updateSelectedMember.sub_organizations = updateSelectedMember.sub_organizations.filter(
            (uuid: string) => member.organization_uuid !== uuid
          );
          return updateSelectedMember;
        }
        return member;
      });
    },
    async updateUserSubOrganizations(user: ApiResponse.fetchUser) {
      try {
        await updateUserSubOrganizations(user.user_uuid, {
          sub_organizations: user.sub_organizations,
        } as ApiRequest.UpdateSubOrganizations);
      } catch (err) {
        console.log(err);
      }
    },
    limitedString(input: string, limit: number = 10): string {
      let output = input;
      if (output.length > limit) {
        output = output.slice(0, limit).concat('...');
      }
      return output;
    },
    async registerEmploymentStatus(payload: { name: string }) {
      const { data } = await createOrganizationsEmploymentStatuses(payload);
      this.statuses = [...this.statuses, data];
      const userIndex = this.users.indexOf(this.statusRegisterUser);
      this.users[userIndex].employment_status_uuid = data[0].uuid;
      await this.updateMemberInfo(this.users[userIndex]);
      this.statusRegisterUser = null;
    },
    async deleteEmploymentStatus(uuid: string) {
      await deleteOrganizationsEmploymentStatuses(uuid);
      const defaultStatus = this.statuses.filter(
        (item: ApiResponse.EmploymentStatus) => item.is_default
      )[0];
      this.users = this.users.map((user: ApiResponse.UsersInformation) => {
        if (user.employment_status_uuid === uuid) {
          return {
            ...user,
            employment_status_uuid: defaultStatus.uuid,
          };
        }
        return user;
      });
      this.statuses = this.statuses.filter(
        (item: ApiResponse.EmploymentStatus) => item.uuid !== uuid
      );
    },
    mapCommunityInfo(uuid: string) {
      return this.communities.filter(
        (c: ApiResponse.Community) => c.uuid === uuid
      );
    },
    togglePositionRegisterModal(user: ApiResponse.UsersInformation = null) {
      if (user) {
        this.positionRegisterUser = user;
      }
      this.showPositionRegisterModal = !this.showPositionRegisterModal;
    },
    toggleStatusRegisterModal(user: ApiResponse.UsersInformation = null) {
      if (user) {
        this.statusRegisterUser = user;
      }
      this.showEmploymentStatusRegisterModal = !this
        .showEmploymentStatusRegisterModal;
    },
  },
});
</script>

<style lang="scss" scoped>
.contents {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 18px 10px 16px;
  background-color: $white_1;
  margin-top: 15px;
  color: $gray_blue_4;

  .contents-inner-header-headline {
    font-size: 15px;
  }

  .contents-inner-header-info {
    line-height: 1;
    margin-left: 25px;
  }
}

.table-wrapper {
  position: relative;
  overflow-x: visible;
  overflow-y: visible;
  width: 100vw;
  margin-top: 15px;
}

th {
  padding: 8px 6px;
  white-space: nowrap;
}

td,
th {
  font-size: 13px;
  font-weight: 600;
  height: 40px;
  text-align: center;
  background-color: $white_1;
  border: solid 1px $light_gray_blue_3;
  color: $gray_blue_4;
}

td {
  vertical-align: middle;
  background-color: $true_white;
  padding: 4px;
  color: $dark_blue;
  font-weight: 300;
}

.name-cell {
  display: flex;
  align-items: center;
}

.name {
  display: -webkit-box;
  overflow: hidden;
  text-align: left;
  color: inherit;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 15px;
  text-decoration: underline;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

.display-fields {
  margin-left: 15px;
  margin-top: 17px;
  display: flex;
  flex-wrap: wrap;

  + .display-fields {
    margin-top: 13px;
  }

  .checkbox {
    + .checkbox {
      margin-left: 20px;
    }

    /deep/ .checkbox-text {
      font-size: 15px;
      color: $gray_blue_4;
    }
  }
}

.bulk-selection {
  display: flex;
  margin-top: 15px;
  padding: 10px;
  background: #fff;
  border: solid 1px #e4e5ed;
  border-radius: 4px;
  color: $gray_blue_4;

  .left {
    padding: 5px;
    margin-right: 10px;
    white-space: nowrap;
    font-weight: bold;
  }

  .right {
    flex-grow: 1;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    .checkbox {
      & + .checkbox + .checkbox {
        margin-top: 10px;
      }

      /deep/ .checkbox-text {
        color: $gray_blue_4;
      }
    }
  }
}

.popper {
  position: relative;
  display: flex;
  align-items: center;

  .text {
    margin-left: 5px;
    text-decoration: underline;
    cursor: pointer;
  }

  .dialog {
    position: absolute;
    top: 30px;
    right: 0;
    padding: 20px;
    background-color: $true_white;
    box-shadow: 0 0 3px 0 $light_gray;
    border-radius: 6px;

    .top-box {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      .title {
        font-size: 15px;
        font-weight: bold;
        color: $gray_blue_4;
      }
    }

    .authority {
      tr > td {
        padding: 5px;
        text-align: left;
      }

      .center {
        text-align: center;
      }
    }
  }
}

.red {
  color: red;
}

.member-list-table {
  border: solid 1px $light_gray_blue_3;
  table-layout: fixed;

  .relative {
    position: relative;
  }

  .mini {
    width: 28px;
  }

  .number-column {
    width: 46px;
  }

  > tr > th {
    border: solid 1px $light_gray_blue_3;
    vertical-align: middle;
  }

  th > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  th.emphasis {
    background-color: $light_pink_1;
  }

  td select {
    background-color: $extra_light_gray;
    border: solid 1px $light_gray_blue_3;
    border-radius: 4px;
    height: 30px;
    width: 100%;
    padding: 5px;
  }

  .sort {
    cursor: pointer;
    margin-left: 7px;
  }

  .sort-dialog {
    position: absolute;
    right: 0;
    z-index: 10;
    padding: 4px 15px;
    text-align: left;
    background-color: $true_white;
    border: solid 1px $light_gray_blue_3;
    border-radius: 4px;

    ul {
      list-style: none;

      li {
        position: relative;
        color: $gray_blue_4;
        cursor: pointer;
      }
    }

    .selected::before {
      content: '●';
      position: absolute;
      left: -10px;
      transform: scale(0.5, 0.5);
    }
  }

  .long {
    width: 230px;
  }

  .select {
    width: 100%;
    font-size: inherit;
  }

  .middle {
    width: 100%;
    font-size: inherit;
  }

  .short {
    width: 60px;
  }
}

.delete-button {
  color: $gray_blue_4;
  background-color: $true_white;
  border: solid 1px $gray_blue_3;

  &.disabled {
    border: none;
  }

  &:hover {
    color: $true_white;
  }
}

.filter-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  color: $dark_blue;

  .button {
    margin-left: 74px;
    margin-right: auto;
  }

  .display-count {
    background-color: $extra_light_gray;
    border: solid 1px $light_gray_blue_3;
    border-radius: 4px;
    height: 30px;
    width: 128px;
    margin-left: 8px;
    color: $gray_blue_4;
  }
}

.vertical-separator {
  border: none;
  border-left: solid 1px $light_gray_blue_3;
  height: 30px;
  width: 1px;
  margin-left: 25px;
  margin-right: 25px;
}

.pagination-box {
  margin-top: 25px;
}

.text-left {
  text-align: left;
}

@-moz-document url-prefix() {
  .vertical-border {
    position: absolute;
    height: 40px;
    border-left: solid 1px $light_gray_blue_3;
    top: 0;
    left: -1px;
  }
}

.scrollable-tabs {
  margin-top: 30px;
}

.tab-button {
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  padding: 0;
  margin-right: 3px;
  margin-left: auto;

  svg {
    width: 24px;
    height: 24px;
  }
}

.contents-inner {
  width: 100%;
}

.contents-inner-header {
  display: flex;
  align-items: center;
  padding-left: 15px;
}

.closed {
  transform: rotateZ(180deg);
}

.name-column {
  width: 176px;
}

.additional-column {
  width: 55px;

  .small {
    font-size: 11px;
  }

  .additional-btn {
    text-align: center;
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding: 0;
    border: solid 1px $light_gray_blue_3;
    border-radius: 15px;
    font-size: 13px;
    white-space: nowrap;
    font-weight: bold;

    &--registered {
      color: $gray_blue_4;
      background-color: $white_1;
    }

    &--unregistered {
      color: $true_white;
      border: none;
      background-color: $pink;
      cursor: pointer;
    }
  }
}

.organization-box-column {
  width: 200px;

  .organization-box-select {
    color: $gray_blue_4;
    font-size: 15px;
  }
}

.position-column {
  width: 130px;

  .position-select {
    color: $gray_blue_4;
    font-size: 15px;
  }
}

.status-column {
  width: 120px;

  .status-select {
    color: $gray_blue_4;
    font-size: 15px;
  }
}

.authority-column {
  width: 160px;

  .popper {
    width: 96px;
    font-size: 11px;
    top: -19px;
    z-index: 1;
    position: absolute;
    margin-left: 50px;
    box-shadow: none;
    background-color: #fff;
    border: 1px solid #707070;
  }

  .popper::before {
    content: '';
    position: absolute;
    bottom: -24px;
    left: 50%;
    margin-left: -15px;
    border: 12px solid transparent;
    border-top: 12px solid #707070;
  }

  .popper::after {
    content: '';
    position: absolute;
    bottom: -23px;
    left: 50%;
    margin-left: -15px;
    border: 12px solid transparent;
    border-top: 12px solid #fff;
  }

  .authority-select {
    color: $gray_blue_4;
    font-size: 15px;
  }
}

.post-frequence-column {
  width: 149px;

  .post-frequence-select {
    color: $gray_blue_4;
  }
}

.account-column {
  width: 100px;
}

.hire-date-column {
  width: 100px;
}

.joined-community-column {
  width: 200px;
}

.birth-day-column {
  width: 133px;
}

.gender-column {
  width: 69px;
}

.enrollment-status-column {
  width: 80px;

  .enrollment-status-select {
    color: $gray_blue_4;
  }
}

.last-access-column {
  width: 133px;
}

.smart-phone-column {
  width: 85px;
}

.table-action {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 9;
  top: 50%;
  left: 50%;
  width: 390px;
  height: 90px;
  background: $true_white;
  box-shadow: 0 0 3px #b8c7d8;
  border-radius: 4px;
  transform: translate(-50%, -50%);

  .button {
    margin-left: 10px;
  }
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #7e8195;
}

.sub-organization {
  &__setting {
    width: 84px;
    background-color: $light_gray_blue_7;
    border: 1px solid #e4e5ed;
    border-radius: 4px;
    color: #6a6d83;
    font-weight: bold;
    padding: 3px 12px;

    &:hover {
      background-color: $light_gray_blue_8;
    }
  }

  &__names {
    width: 140px;
    font-size: 15px;
  }

  &__flex {
    display: flex;
    align-items: center;
  }

  &__button {
    width: 60px;
    height: 25px;
    position: relative;

    &::before {
      content: '';
      display: inline-block;
      width: 1px;
      height: 25px;
      background-color: $light_gray_blue_3;
      position: absolute;
      top: 0;
      left: -5px;
    }
  }

  &__with-tag {
    font-size: 15px;
    padding-left: 6px;
    padding-right: 8px;
    display: flex;
    align-items: flex-start;
  }

  &__sub-tag {
    margin-top: 1px;
    margin-left: 8px;
    flex-shrink: 0;
  }
}

.popper-full {
  background-color: $true_white;
  font-size: 15px;
  line-height: 1.5;
  color: $dark_blue;
  border: 1px solid $light_gray_blue_3;
  padding: 10px;
  pointer-events: none;
  z-index: 9;
  border-radius: 4px;
  max-width: 300px;
  position: relative;
}
</style>
