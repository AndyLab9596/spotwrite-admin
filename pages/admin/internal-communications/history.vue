<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="社内連絡履歴">
        <template #tutorial>
          <TutorialButtonIcon
            :url="`/admin/tutorial/posting-Internalcontact-history.html`"
          />
        </template>
        <template #description>
          <div class="heading-wrapper">
            <p>投稿済み社内連絡を確認することができます。</p>
            <base-button size="large" class="post-button" @click="goToPost">
              <img
                src="/icon/Icon-arrow_right_white.svg"
                class="arrow-left"
                alt=""
              />
              社内連絡の投稿
            </base-button>
          </div>
        </template>
      </page-header>
      <div class="contents">
        <div class="contents-header">
          <base-button
            size="small"
            class="search-button"
            @click="openSearchModal = true"
          >
            絞り込みで検索
          </base-button>
        </div>
        <div class="contents-main">
          <vue-loading
            v-if="isLoading"
            type="spin"
            color="#333"
            :size="{ width: '50px', height: '50px' }"
            class="vue-loading"
          ></vue-loading>
          <table v-if="!isLoading" class="vertical-table__inner">
            <thead class="vertical-table__headers">
              <tr class="vertical-table__header-row">
                <th class="vertical-table__header" width="100px">
                  <div class="date-column" @click="toggleSortList">
                    <span>日付</span>
                    <img
                      src="/icon/icon_pulldown.svg"
                      class="sort-img"
                      alt=""
                    />
                  </div>
                </th>
                <th class="vertical-table__header" width="260px">タイトル</th>
                <th class="vertical-table__header" width="263px">送信対象</th>
                <th class="vertical-table__header" width="144px">送信者</th>
                <th class="vertical-table__header" width="78px">既読数</th>
                <th class="vertical-table__header" width="120px"></th>
              </tr>
            </thead>
            <tbody class="vertical-table__body">
              <tr
                v-for="internalCommunication in internalCommunications"
                :key="internalCommunication.uuid"
                class="vertical-table__body-row"
              >
                <td class="vertical-table__text">
                  <div class="text-date">
                    {{ formattedDate(internalCommunication.created_at) }}
                  </div>
                </td>
                <td class="vertical-table__text">
                  <div class="text-title">
                    <popper
                      trigger="hover"
                      :disabled="internalCommunication.title.length <= 28"
                      :options="{
                        placement: 'bottom-start',
                        modifiers: { offset: { offset: '0,3px' } },
                      }"
                    >
                      <div class="popper-full">
                        {{ internalCommunication.title }}
                      </div>
                      <span slot="reference">
                        <router-link
                          v-slot="{ href }"
                          :to="`/posts/${internalCommunication.uuid}`"
                          custom
                        >
                          <a :href="href" target="_blank">
                            {{ limitedString(internalCommunication.title, 28) }}
                          </a>
                        </router-link>
                      </span>
                    </popper>
                  </div>
                </td>
                <td class="vertical-table__text">
                  <div class="send-column">
                    <div class="send-name">
                      <popper
                        trigger="hover"
                        :disabled="
                          toOrganizationsName(internalCommunication).length <=
                            4 ||
                            toOrganizationsStringName(internalCommunication)
                              .length <= 35
                        "
                        :options="{
                          placement: 'bottom-start',
                          modifiers: { offset: { offset: '0,3px' } },
                        }"
                      >
                        <div class="popper-full">
                          <button
                            v-for="(item, index) in toOrganizationsName(
                              internalCommunication
                            )"
                            :key="index"
                            class="organization-button"
                          >
                            <p class="organization-name">{{ item.name }}</p>
                          </button>
                        </div>
                        <span slot="reference">
                          <span
                            v-for="(item, index) in toOrganizationsName(
                              internalCommunication
                            )"
                            :key="index"
                          >
                            <button
                              v-if="index <= 3"
                              class="organization-button"
                            >
                              <p class="organization-name">{{ item.name }}</p>
                            </button>
                          </span>
                          <span
                            v-if="
                              toOrganizationsName(internalCommunication)
                                .length > 4 ||
                                toOrganizationsStringName(internalCommunication)
                                  .length >= 35
                            "
                          >
                            ...
                          </span>
                        </span>
                      </popper>
                    </div>
                    <div class="send-column-buttons">
                      <base-button
                        size="small"
                        class="column-button"
                        :disabled="
                          !internalCommunication.uuid ||
                            isLoadingEmployees ||
                            isLoadingTargetUsers
                        "
                        @click="
                          goToPost({
                            conditional_target: internalCommunication.uuid,
                          })
                        "
                      >
                        この対象に送る
                      </base-button>
                      <base-button
                        size="small"
                        class="column-button"
                        :disabled="isLoadingEmployees || isLoadingTargetUsers"
                        @click="openModal(internalCommunication)"
                      >
                        この条件を保存
                      </base-button>
                    </div>
                  </div>
                </td>
                <td class="vertical-table__text">
                  <div class="from-user-info">
                    <div class="from-user-name">
                      {{ internalCommunication.from_user.name }}
                    </div>
                    <div class="from-user-organization-name">
                      {{ internalCommunication.from_user.organization.name }}
                    </div>
                  </div>
                </td>
                <td class="vertical-table__text">
                  <div class="read-user-count-wrapper">
                    <span
                      class="read-user-count"
                      @click="
                        fetchInternalCommunicationUsers(internalCommunication)
                      "
                    >
                      {{ internalCommunication.read_users_count }} /
                      {{ internalCommunication.to_users_count }}
                    </span>
                  </div>
                </td>
                <td class="vertical-table__text write-button-cell">
                  <base-button
                    size="small"
                    class="post-link-container"
                    :disabled="!internalCommunication.uuid"
                    @click="
                      goToPost({ relational: internalCommunication.uuid })
                    "
                  >
                    関連記事を書く
                  </base-button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="openSortList" class="sort-list">
            <ul>
              <li
                :class="{ selected: selected === 'desc' }"
                @click="sortByDate('desc')"
              >
                日付が新しい順
              </li>
              <li
                :class="{ selected: selected === 'asc' }"
                @click="sortByDate('asc')"
              >
                日付が古い順
              </li>
              <li
                :class="{ selected: selected === 'reset' }"
                @click="sortByDate('reset')"
              >
                順番を元に戻す
              </li>
            </ul>
          </div>
        </div>
        <div v-if="internalCommunications.length > 0" class="pagination-layout">
          <base-pagination
            :value="{
              number: pagination.current_page,
              offset: pagination.from - 1,
              limit: Number(pagination.per_page),
              total: pagination.total,
            }"
            class="pagination-layout"
            @go-to-page="page"
          />
        </div>

        <InternalCommunicationSearchModal
          v-if="openSearchModal"
          @close="openSearchModal = false"
          @submit="searchInternalCommunicationPosts"
        />
        <DestinationUserListModal
          v-if="openDestinationUserListModal"
          :users="propUsers"
          @close="openDestinationUserListModal = false"
          @submit="reSend"
        />
      </div>
    </div>
    <LoadingOverlay v-if="isLoadingOverlay"></LoadingOverlay>
    <Modal
      v-if="isSaveSettingModalVisible"
      no-header
      class="save-setting-modal"
      @close="isSaveSettingModalVisible = false"
    >
      <ValidationObserver v-slot="{ invalid, passes }" class="inner-container">
        <template>
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
import Vue from 'vue';
import {
  InternalCommunicationSearchModal,
  DestinationUserListModal,
  LoadingOverlay,
} from '@/components/Admin/Pages/';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import dayjs from 'dayjs';
import {
  fetchInternalCommunications,
  fetchInternalTargetUsers,
  fetchInternalCommunicationUsers,
  internaleCommunicationSendRemindToEmail,
} from '@/libs/api';
import { storeGeneralSetting, remindText, employees } from '@/libs/api/app';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BasePagination from '@/components/Admin/Modules/Pagination/BasePagination.vue';
import { Route } from 'vue-router/types/router';
import { VueLoading } from 'vue-loading-template';
import Popper from 'vue-popperjs';
import Modal from '@/components/App/atoms/modals/Modal.vue';
import { ValidationObserver } from 'vee-validate';
import OutlinedTextField from '@/components/App/atoms/textFields/OutlinedTextField.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';

type GeneralSettingForm = {
  name: string;
  type: string;
  content: GeneralSettingContent;
};
type GeneralSettingContent = AppApiResponse.GeneralSettingContent & {
  [key: string]: string[] | number[] | string | undefined;
};
type SortType = 'desc' | 'asc' | 'reset' | '';
type Employee = AppApiResponse.Employee & {
  comment_position?: CommentPosition;
};

export default Vue.extend({
  layout: 'admin/default',
  components: {
    InternalCommunicationSearchModal,
    DestinationUserListModal,
    PageHeader,
    BaseButton,
    BasePagination,
    VueLoading,
    LoadingOverlay,
    Popper,
    Modal,
    ValidationObserver,
    OutlinedTextField,
    TutorialButtonIcon,
  },
  data() {
    return {
      internalCommunications: [] as Array<ApiResponse.InternalCommunication>,
      selectedInternalCommunication: {} as ApiResponse.InternalCommunication,
      openSortList: false as boolean,
      openSearchModal: false as boolean,
      openDestinationUserListModal: false as boolean,
      pagination: {} as ApiResponse.Pagination,
      isLoading: false as boolean,
      isLoadingOverlay: false as boolean,
      isLoadingEmployees: false as boolean,
      isLoadingTargetUsers: false as boolean,
      selected: '' as SortType,
      propUsers: {} as any,
      isSaveSettingModalVisible: false as boolean,
      generalSettingForm: {
        name: '',
        type: '',
        content: {},
      } as GeneralSettingForm,
      type: 'publish' as string,
      organizationsTarget: [] as Array<
        ApiResponse.InternalCommunicationOrganization
      >,
      internalCommunicationSelected: '' as string,
      employees: [] as Employee[],
      internalTargetUsers: [] as AppApiResponse.InternalTargetUser[],
    };
  },
  computed: {
    internalOrganizations() {
      return (internalCommunication: ApiResponse.InternalCommunication) => {
        let allEmployees = this.employees;
        if (!this.employees.length) {
          allEmployees = this.$accessor.employees ?? [];
        }
        if (!internalCommunication.to_users_count || !allEmployees?.length) {
          return [];
        }
        const internalTargetUser = this.internalTargetUsers.find(
          (i: AppApiResponse.InternalTargetUser) =>
            i.uuid === internalCommunication.uuid
        );
        if (!internalTargetUser) {
          return [];
        }
        const organizations = internalTargetUser.target_users.map(
          (uuid: string) => {
            const employee = allEmployees.find(
              (e: Employee) => e.user_uuid === uuid
            );
            if (!employee) {
              return null;
            }
            return {
              uuid: employee.organization_uuid,
              name: employee.organization_name,
            };
          }
        );
        return organizations.filter(
          (organization: ApiResponse.OrganizationGroup, index: number) =>
            organization &&
            organizations.findIndex(
              (o: ApiResponse.OrganizationGroup) =>
                o?.uuid === organization.uuid
            ) === index
        );
      };
    },
    toOrganizationsName() {
      return (
        internalCommunication: ApiResponse.InternalCommunication
      ): any => {
        return this.internalOrganizations(internalCommunication)
          .map((o: ApiResponse.InternalCommunicationOrganization) => o)
          .sort((x: Object, y: Object) => x.name.localeCompare(y.name, 'ja'));
      };
    },
    toOrganizationsStringName() {
      return (
        internalCommunication: ApiResponse.InternalCommunication
      ): any => {
        return this.internalOrganizations(internalCommunication)
          .map((o: ApiResponse.InternalCommunicationOrganization) => o.name)
          .sort((x: string, y: string) => x.localeCompare(y, 'ja'))
          .join('、');
      };
    },
    currentPage: {
      get(): number {
        const { page } = this.$route.query;
        if (typeof page !== 'string') {
          return 1;
        }
        return page ? parseInt(page, 10) : 1;
      },
      set(v: number) {
        this.$router.push({
          path: '/admin/internal-communications/history',
          query: { page: `${v}` },
        });
      },
    },
    currentSetting(): GeneralSettingContent {
      return {
        company: undefined,
        organizations: this.organizationsTarget,
        employment_positions: [],
        employment_statuses: [],
        job_types: [],
        birthday: [],
        gender: undefined,
        latest_access: undefined,
        joined_on: [],
        post_rule: undefined,
      };
    },
  },
  watch: {
    async $route(route: Route) {
      const page =
        !('page' in route.query) || typeof route.query.page !== 'string'
          ? 1
          : parseInt(route.query.page, 10);
      if (!this.$accessor.employees?.length) {
        this.isLoadingEmployees = true;
      }
      this.isLoadingTargetUsers = true;
      await this.fetchInternalCommunications({ page });
      if (this.selected !== '') {
        this.sortByDate(this.selected);
      }
    },
  },
  async mounted(): Promise<void> {
    if (!this.$accessor.employees?.length) {
      this.isLoadingEmployees = true;
    }
    this.isLoadingTargetUsers = true;
    await this.fetchInternalCommunications({ page: this.currentPage });
    this.fetchEmployees(10000);
  },
  methods: {
    toggleSortList() {
      this.openSortList = !this.openSortList;
    },
    async fetchInternalCommunications(
      payload: ApiRequest.InternalCommunicationQuery
    ): Promise<void> {
      this.isLoading = true;
      try {
        const { data } = await fetchInternalCommunications(payload);
        this.internalCommunications = data.data;
        this.pagination = data.meta;
        this.fetchInternalTargetUsers(payload);
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchInternalTargetUsers(
      payload: ApiRequest.InternalCommunicationQuery
    ) {
      const { data } = await fetchInternalTargetUsers(payload);
      this.internalTargetUsers = data.data;
      this.isLoadingTargetUsers = false;
    },
    searchInternalCommunicationPosts(
      searchPrams: ApiRequest.InternalCommunicationQuery
    ) {
      this.fetchInternalCommunications(searchPrams);
    },
    async reSend(...args: any) {
      this.isLoadingOverlay = true;
      const [resendUserUuids, unReadUser] = args;
      const { selectedInternalCommunication } = this;

      const userList = unReadUser.map((u: any) => {
        return {
          name: u.name,
          uuid: u.uuid,
          email: u.email,
        };
      });

      try {
        await remindText({
          user_uuids: resendUserUuids,
          message: `リマインド ${dayjs().format(
            `YYYY年MM月DD日（木）HH:mm`
          )}タイトル「${
            selectedInternalCommunication.title
          }」の社内連絡を確認してください。`,
        });

        await internaleCommunicationSendRemindToEmail({
          internal_communication_uuid: this.selectedInternalCommunication.uuid,
          users: userList,
        });
        alert('社内連絡を再送信しました。');
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoadingOverlay = false;
      }
    },
    formattedDate(unixTime: number): string {
      return dayjs.unix(unixTime).format('YYYY-MM-DD');
    },
    sortByDate(sort: `desc` | `asc` | `reset`): void {
      if (sort === `desc`) {
        this.selected = `desc`;
        this.internalCommunications = this.internalCommunications.sort(
          (
            n: ApiResponse.InternalCommunication,
            m: ApiResponse.InternalCommunication
          ) => (n.created_at > m.created_at ? -1 : 1)
        );
      }
      if (sort === `asc`) {
        this.selected = `asc`;
        this.internalCommunications = this.internalCommunications.sort(
          (
            n: ApiResponse.InternalCommunication,
            m: ApiResponse.InternalCommunication
          ) => (n.created_at < m.created_at ? -1 : 1)
        );
      }
      if (sort === `reset`) {
        this.selected = `reset`;
        this.fetchInternalCommunications({ page: 1 });
      }
      this.toggleSortList();
    },
    takePages(n: number): number[] {
      const min = 1;
      const max = this.pagination.last_page;
      let center = this.currentPage;
      if (center > max - 2) {
        center = max - 2;
      } else if (center < min + 2) {
        center = min + 2;
      }

      if (this.pagination.last_page > n) {
        const offset = center - 2;
        return Array.from(Array(n), (_v: any, k: number) => k + offset);
      }

      return Array.from(
        Array(this.pagination.last_page),
        (_v: any, k: number) => k + 1
      );
    },
    hasPrev(n: number): boolean {
      return n - 1 >= 1;
    },
    hasNext(n: number): boolean {
      return n + 1 <= this.pagination.last_page;
    },
    isCurrentPage(n: number): boolean {
      return n === this.currentPage;
    },
    page(page: number): void {
      this.currentPage = page;
    },
    goToPost(params: object = {}) {
      if (!params) {
        this.$router.push('/admin/internal-communications');
      } else {
        if (params.conditional_target) {
          const conditionalTarget = this.internalTargetUsers.find(
            (target: AppApiResponse.InternalTargetUser) =>
              target.uuid === params.conditional_target
          );

          const internalTargetUsers = { ...this.$accessor.internalTargetUsers };
          internalTargetUsers[conditionalTarget.uuid] =
            conditionalTarget.target_users;
          this.$accessor.setInternalTargetUsers(internalTargetUsers);

          if (this.employees?.length) {
            this.$accessor.setEmployees(this.employees);
          }
        }

        this.$router.push({
          path: '/admin/internal-communications',
          query: params,
        });
      }
    },
    async fetchInternalCommunicationUsers(
      internalCommunication: ApiResponse.InternalCommunication
    ): Promise<void> {
      this.isLoadingOverlay = true;
      this.selectedInternalCommunication = internalCommunication;

      try {
        const { data } = await fetchInternalCommunicationUsers(
          internalCommunication.uuid
        );
        const countTotal = data.length;
        const readUsersByCompany: {
          uuid: number;
          name: string;
          users: any;
        }[] = [];
        const unreadUsersByCompany: {
          uuid: number;
          name: string;
          users: any;
        }[] = [];
        let countRead = 0;
        let countUnread = 0;
        data.forEach((user: ApiResponse.InternalCommunicationUser) => {
          const userInfo = {
            uuid: user.user_uuid,
            name: user.user_name,
            main_organization: user.employment_status,
            position: user.employment_position,
            email: user.email,
          };
          if (!user.is_read) {
            if (
              !unreadUsersByCompany.some(
                (f: any) => f.uuid === user.company_uuid
              )
            ) {
              unreadUsersByCompany.push({
                uuid: user.company_uuid,
                name: user.company_name,
                users: [],
              });
            }
            unreadUsersByCompany.find((f: any) => {
              if (f.uuid === user.company_uuid) {
                f.users.push(userInfo);
                countUnread += 1;
                return true;
              }
              return false;
            });
          } else {
            if (
              !readUsersByCompany.some((f: any) => f.uuid === user.company_uuid)
            ) {
              readUsersByCompany.push({
                uuid: user.company_uuid,
                name: user.company_name,
                users: [],
              });
            }
            readUsersByCompany.find((f: any) => {
              if (f.uuid === user.company_uuid) {
                f.users.push(userInfo);
                countRead += 1;
                return true;
              }
              return false;
            });
          }
        });
        this.propUsers = {
          count: countTotal,
          un_read_users: {
            count: countUnread,
            companies: unreadUsersByCompany,
          },
          read_users: {
            count: countRead,
            companies: readUsersByCompany,
          },
        };
        this.openDestinationUserListModal = true;
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoadingOverlay = false;
      }
    },
    limitedString(input: string, limit: number = 10): string {
      let output = input;
      if (output.length > limit) {
        output = output.slice(0, limit).concat('...');
      }
      return output;
    },
    openModal(internalCommunication: ApiResponse.InternalCommunication) {
      this.isSaveSettingModalVisible = true;
      this.organizationsTarget = this.internalOrganizations(
        internalCommunication
      ).map((o: Types.GroupOrganization) => o.uuid);
    },
    closeModal() {
      this.isSaveSettingModalVisible = false;
      this.organizationsTarget = [];
    },
    async onDoSaveSettingButtonClick(): Promise<void> {
      this.generalSettingForm.type = this.type;
      this.generalSettingForm.content = this.currentSetting;
      try {
        await storeGeneralSetting(this.generalSettingForm);
      } catch (e) {
        console.error(e);
      } finally {
        this.isSaveSettingModalVisible = false;
        this.organizationsTarget = [];
        this.generalSettingForm = {} as GeneralSettingForm;
      }
    },
    async fetchEmployees(limit: number) {
      const { data } = await employees({ limit });
      this.employees = data.users;
      this.isLoadingEmployees = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.heading-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .post-button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -40px 0 0;
    width: 200px;
    height: 44px;
    position: relative;
  }

  .arrow-left {
    position: absolute;
    left: 19px;
    width: 8px;
  }
}

.contents-header {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  margin-bottom: 10px;
  align-items: flex-end;
}

.contents-main {
  position: relative;
}

.sort-list {
  position: absolute;
  height: fit-content;
  width: 122px;
  background-color: $true_white;
  border: solid 1px $light_gray_blue_3;
  top: 25px;
  left: 64px;
  padding: 12px 0 10px 10px;
}

.sort-list > ul > li {
  position: relative;
  cursor: pointer;

  &.selected::before {
    content: '●';
    position: absolute;
    top: 0;
    left: -11px;
    transform: scale(0.5);
    color: $dark_blue;
  }
}

.vertical-table__inner {
  border: 1px solid $light_gray_blue_3;
  width: 100%;
}

.vertical-table__header-row {
  background-color: $white_1;
}

.vertical-table__header {
  border-right: 1px solid $light_gray_blue_3;
  border-bottom: 1px solid $light_gray_blue_3;
  font-weight: bold;
  vertical-align: middle;
  text-align: center;
  font-size: 13px;
  background-color: $white_1;
  color: $gray_blue_4;
  height: 40px;
}

.sort-img {
  margin: 0 0 0 7px;
  width: 10px;
}

.vertical-table__text {
  border-right: 1px solid $light_gray_blue_3;
  border-bottom: 1px solid $light_gray_blue_3;
  height: 60px;
  padding: 0 10px;
}

.vertical-table__header:last-child,
.vertical-table__text:last-child {
  border-right-width: 0;
}

.vertical-table__body-row:last-child .vertical-table__text {
  border-bottom-width: 0;
}

.vertical-table__body {
  background-color: $true_white;
}

.send-column {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 7px 0 0;
}

.send-name {
  color: $dark_blue;
  font-weight: 300;
  line-height: 1.2;
  overflow: hidden;
  height: 44px;
  // 1セル全体の横幅 - ボタンと右のmargin数
  width: calc(263px - 95px);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.send-column-buttons {
  display: flex;
  flex-direction: column;

  .button {
    &[disabled] {
      pointer-events: none;
    }
  }
}

.column-button {
  width: 90px;
  height: 20px;
  background-color: $light_gray_blue_4;
  color: $gray_blue_4;
  font-size: 11px;
  margin: 0 0 4px 0;
  border: 1px solid $light_gray_blue_3;
  padding: 0;

  &:nth-of-type(even) {
    margin: 0;
  }

  &:hover {
    background-color: $light_gray_blue_9;
  }
}

.post-link-container {
  display: block;
  margin: 0 auto;
  width: fit-content;
  background-color: $light_gray_blue_4;
  color: $gray_blue_4;
  font-size: 13px;
  border: 1px solid $light_gray_blue_3;
  padding: 0 4px;
  white-space: nowrap;

  &:hover {
    background-color: $light_gray_blue_9;
  }
}

.post-link {
  font-size: 14px;
}

.date-column {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.from-user-info {
  height: 50px;
  white-space: nowrap;
  overflow: hidden;
  padding: 13px 0 0 0;
}

.from-user-name {
  font-weight: 300;
  font-size: 15px;
  line-height: 1;
  color: $dark_blue;
}

.from-user-organization-name {
  font-weight: 300;
  font-size: 12px;
  line-height: 1.3;
  color: $dark_blue;
}

.read-user-count-wrapper {
  text-align: center;
  padding: 14px 0 0 0;
}

.read-user-count {
  cursor: pointer;
  color: $pink;
  font-size: 13px;
  font-weight: 300;
  border-bottom: 1px solid $pink;
}

.search-button {
  width: 180px;
}

.text-date {
  margin: 12px 0 0 0;
  font-size: 13px;
  font-weight: 300;
  color: $dark_blue;
  line-height: 1;
  white-space: nowrap;
}

.text-title {
  margin: 17px 0 0 0;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.3;
}

.write-button-cell {
  vertical-align: middle;
  width: fit-content;
}

.pagination-layout {
  margin: 25px 0 0 0;
  display: flex;
  justify-content: flex-end;
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
  margin-top: 5px;
  word-break: break-all;
}

.organization-button {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  border: 1px solid $job_type_border;
  border-radius: 4px;
  height: 20px;
  padding: 0 4px;
  line-height: 1em;
  cursor: pointer;
  color: $dark_blue;
  background-color: $true_white;
  flex-shrink: 0;
  margin-bottom: 3px;

  &:not(:last-child) {
    margin-right: 3px;
  }

  .organization-name {
    margin: 0 3px 0 0;
  }

  .organization-peaple {
    margin: 0 3px 0 0;
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
</style>
