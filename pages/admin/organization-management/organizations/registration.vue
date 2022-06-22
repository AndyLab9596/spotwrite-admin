<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="組織（BOX）登録" class="page-header">
        <template #tutorial>
          <TutorialButtonIcon
            :url="`/admin/tutorial/organization-registration.html`"
          />
        </template>
        <template #description>
          部署・支店・店舗に関する情報を一覧で確認することができます。
        </template>
      </page-header>
      <div class="contents">
        <div class="organization-chart">
          <organization-chart-header
            :companies="companies"
            @changeSelectedCompany="changeSelectedCompany"
          />
          <div
            id="organization-chart-container"
            class="organization-chart-container"
          >
            <div
              v-if="!organizations.length"
              ref="add-company"
              class="organization-chart-contents-empty"
            >
              <add-company-button @click="addEmptyCompany" />
            </div>
            <draggable
              v-if="organizations.length"
              :list="nestedOrganizations"
              :animation="200"
              handle=".company"
              class="organization-chart-contents"
              @end="draggableEnd($event, nestedOrganizations.length)"
            >
              <div
                v-for="company in nestedOrganizations"
                :key="company.uuid"
                class="organization"
                @dragstart="dragStart(company)"
                @dragend="dragEnd"
              >
                <company-header
                  :prop-company="company"
                  :other-organization-names="
                    otherOrganizationNames(company.uuid)
                  "
                  :flag-show-hide-children="true"
                  @changeOrganizationPublishStatus="
                    ChangeOrganizationPublishStatus
                  "
                  @togglePublishStatus="togglePublishStatus"
                  @goToDetail="goToCompanyDetail"
                  @toggleDeleteOrganizationModal="toggleDeleteOrganizationModal"
                  @updateCompany="updateCompany"
                  @toggle-company-box="toggleCompanyBox"
                  @updateDisplayChildCompany="updateDisplayChildCompany"
                />
                <draggable
                  v-if="!companyBoxUuids.includes(company.uuid)"
                  class="parents"
                  :list="company.parents"
                  :animation="200"
                  draggable=".draggable-item"
                  @end="
                    draggableEnd(
                      $event,
                      company.parents.length,
                      company.parents
                    )
                  "
                >
                  <div
                    v-for="(parent, index) in company.parents"
                    :key="parent.uuid"
                    :class="{
                      'draggable-item':
                        parent.type !== 'management' && parent.type !== null,
                    }"
                    :style="{
                      display: checkDisplayChildCompany(company.uuid)
                        ? 'contents'
                        : '',
                    }"
                    @dragstart="dragStart(parent)"
                    @dragend="dragEnd"
                  >
                    <div :class="'parent parent--' + parent.type">
                      <organization-box
                        :parent="parent"
                        :organizations="organizations"
                        :item-number="index + 1"
                        :display-children-company="displayChildrenCompany"
                        :nested-organizations="company.parents"
                        @togglePublishStatus="togglePublishStatus"
                        @goToDetail="goToOrganizationDetail"
                        @toggleChildrenBoxModal="toggleChildrenBoxModal"
                        @toggleDeleteOrganizationModal="
                          toggleDeleteOrganizationModal
                        "
                        @addMember="addMember"
                        @delete="toggleDeleteOrganizationModal"
                        @moveOrganization="moveOrganization"
                        @updateParent="updateParent"
                        @toggleCheckUpdateModal="toggleCheckUpdateModal"
                        @updateOrganizationWithCheckDuplicate="
                          updateOrganizationWithCheckDuplicate
                        "
                      />
                      <div
                        v-if="
                          parent.children.length > 0 &&
                            checkDisplayChildCompany(company.uuid)
                        "
                        :class="
                          getClassLineBoxParent(
                            parent.type,
                            getParentIndex(company.uuid, parent)
                          )
                        "
                      />
                    </div>
                    <div
                      v-if="
                        parent.children.length > 0 &&
                          checkDisplayChildCompany(company.uuid)
                      "
                      :style="{ display: 'contents' }"
                    >
                      <div
                        v-for="(children, idx) in parent.children"
                        :key="children.uuid"
                        :class="'parent parent--' + parent.type"
                      >
                        <div
                          v-if="checkDisplayChildCompany(company.uuid)"
                          :class="
                            getChildrenIndex(company.uuid, parent, children) %
                              4 ===
                            0
                              ? 'linerelation linerelation--' +
                                parent.type +
                                ' first_line'
                              : ''
                          "
                        />
                        <organization-box
                          :parent="children"
                          :item-number="idx + 1"
                          :is-child="true"
                          :organizations="organizations"
                          :nested-organizations="parent.children"
                          @togglePublishStatus="togglePublishStatus"
                          @goToDetail="goToOrganizationDetail"
                          @toggleChildrenBoxModal="toggleChildrenBoxModal"
                          @toggleDeleteOrganizationModal="
                            toggleDeleteOrganizationModal
                          "
                          @addMember="addMember"
                          @delete="toggleDeleteOrganizationModal"
                          @moveOrganization="moveOrganization"
                          @updateParent="updateParent"
                          @toggleCheckUpdateModal="toggleCheckUpdateModal"
                          @updateOrganizationWithCheckDuplicate="
                            updateOrganizationWithCheckDuplicate
                          "
                        />
                        <div
                          v-if="
                            checkDisplayChildCompany(company.uuid) &&
                              idx < parent.children.length - 1
                          "
                          :class="
                            getChildrenIndex(company.uuid, parent, children) %
                              4 ===
                            3
                              ? 'linerelation linerelation--' +
                                parent.type +
                                ' end_line'
                              : ''
                          "
                        />
                        <div
                          v-if="
                            checkDisplayChildCompany(company.uuid) &&
                              getChildrenIndex(company.uuid, parent, children) %
                                4 !==
                                0
                          "
                          :class="
                            'linerelation linerelation--' +
                              parent.type +
                              ' last_line'
                          "
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    :ref="'add-parent' + company.uuid"
                    class="parent add-parent"
                    draggable="false"
                    @click="clickAddParentBox(company)"
                  >
                    <div class="add-parent-text">
                      <div class="add-parent-icon" />
                      組織（BOX）追加
                    </div>
                  </div>
                </draggable>
              </div>
            </draggable>
            <div
              v-if="organizations.length && !selectedCompany"
              ref="add-company"
              class="add-company-button-wrapper"
            >
              <add-company-button @click="addEmptyCompany" />
            </div>
          </div>
        </div>
        <button class="app-preview" @click="toggleApplicationPreviewModal">
          <img
            class="app-preview__icon"
            src="/icon/icon_mobile.svg"
            alt=""
          />アプリプレビュー
        </button>
      </div>
    </div>
    <application-preview
      v-if="applicationPreviewModal"
      :organizations="organizations"
      :nested-organizations="nestedOrganizations"
      @click="toggleApplicationPreviewModal"
    />
    <children-box-modal
      v-if="childrenBoxModal"
      :parent="propParent"
      :organizations="organizations"
      @close="toggleChildrenBoxModal"
      @end="childDraggableEnd"
      @togglePublishStatus="togglePublishStatus"
      @addMember="addMember"
      @goToDetail="goToOrganizationDetail"
      @move="moveOrganization"
      @delete="toggleDeleteOrganizationModal"
      @updateChild="updateOrganizationWithCheckDuplicate"
      @toggleCheckUpdateModal="toggleCheckUpdateModal"
    />

    <check-delete
      v-if="deleteOrganizationModal"
      delete-button-text="完全に削除"
      class="check-delete"
      @close="toggleDeleteOrganizationModal"
      @click="deleteOrganization(deleteOrganizationUuid)"
    >
      <div v-if="deleteOrganizationLayer === 0">
        この会社を完全に削除しますか？
        <p class="attention">
          所属している組織とメンバーの情報は完全に削除されてしまうため、<br />
          削除したくないメンバーの所属先を他の会社に変更してください。
        </p>
      </div>
      <div v-else>
        この{{ deleteOrganizationType }}を完全に削除しますか？
        <p class="attention">
          削除した場合、登録している情報を元に戻すことはできません。<br />
          所属しているメンバーは無所属に変更になります。
        </p>
      </div>
    </check-delete>
    <check-update
      v-if="checkUpdateModal"
      @close="toggleCheckUpdateModal"
      @click="
        updateOrganizationWithCheckDuplicate(
          updateOrganization,
          updateOrganizationStatus,
          UpdateOldOrganization
        )
      "
    >
      属性を変更しますか？<br />
      属性を変更した場合、入力済みの詳細情報は破棄され<br />
      新たに詳細情報を登録する必要があります。
    </check-update>
    <check-update
      v-if="isShowPublishModal"
      update-button-text="変更"
      @click="updatePublishStatus"
      @close="closePublishModal"
    >
      <template v-if="selectedOrganizationToChangeStatus.status === 'public'">
        公開に変更しますか？<br />このBOXに紐づく子BOXが公開設定になっている場合、自動的に公開されます。
      </template>
      <template v-else>
        非公開に変更しますか？<br />変更した場合、このBOXに紐づく子BOXが公開設定と<br />なっていてもSpotwrite上で非公開になります。
      </template>
    </check-update>
    <check-update
      v-if="isShowPublishModalForChild"
      update-button-text="変更"
      @click="updatePublishStatus"
      @close="closePublishModal"
    >
      <template v-if="selectedOrganizationToChangeStatus.status === 'public'">
        公開に変更しますか？<br />変更した場合、spotwriteに表示されます。
      </template>
      <template v-else>
        非公開に変更しますか？<br />変更した場合、spotwriteには表示されません。
      </template>
    </check-update>
    <check-update
      v-if="isShowPublishModalForCompany"
      update-button-text="変更"
      @click="updatePublishStatus"
      @close="closePublishModal"
    >
      <template v-if="selectedOrganizationToChangeStatus.status === 'public'">
        公開に変更しますか？<br />このBOXに紐づく組織（BOX）が公開設定になっている場合、自動的に公開されます。
      </template>
      <template v-else>
        非公開に変更しますか？<br />変更した場合、この会社に紐づく組織（BOX）が公開設定となっていてもSpotwrite上で非公開になります。
      </template>
    </check-update>
    <alert-message
      v-if="addParentBoxAlertModal"
      button-text="閉じる"
      :gray-button="true"
      class="add-parent-box-alert-modal"
      @close="toggleAddParentBoxAlertModal"
    >
      組織（BOX）の追加には会社名の登録が必要です。<br />
      「未定」をクリックで表示されるポップアップから<br />会社名を登録して下さい。
    </alert-message>
    <alert-message
      v-if="addMemberAlertModal"
      class="alert-modal-height-211 add-member-alert-modal"
      button-text="閉じる"
      :gray-button="true"
      @close="toggleAddMemberAlertModal"
    >
      メンバー追加には組織（BOX）名と属性の登録が必要です。<br />
      「未定」をクリックで表示されるポップアップから<br />
      組織（BOX）名と属性を登録して下さい。<br />
    </alert-message>
    <alert-message
      v-if="addChildBoxAlertModal"
      class="alert-modal-height-211 add-child-box-alert-modal"
      button-text="閉じる"
      :gray-button="true"
      @close="toggleAddChildBoxAlertModal"
    >
      子BOXの追加には組織（BOX）名と属性の登録が必要です。<br />
      「未定」をクリックで表示されるポップアップから<br />
      組織（BOX）名と属性を登録して下さい。<br />
    </alert-message>
    <alert-message
      v-if="publishParentBoxAlertModal"
      class="alert-modal-height-211 publish-parent-box-alert-modal"
      button-text="閉じる"
      :gray-button="true"
      @close="togglePublishParentBoxAlertModal(false)"
    >
      <template v-if="selectedOrganizationToChangeStatus.type === 'company'">
        会社の公開には会社名の登録が必要です。<br />
        「未定」をクリックで表示されるポップアップから<br />
        会社名を登録して下さい。
      </template>
      <template v-else>
        組織（BOX）の公開には組織（BOX）名と属性の<br />
        登録が必要です。<br />
        組織（BOX）名と属性を登録して下さい。
      </template>
    </alert-message>
    <alert-message
      v-if="goToCompanyDetailModal"
      class="alert-modal-height-211 go-to-company-detail-modal"
      button-text="閉じる"
      :gray-button="true"
      @close="toggleGoToCompanyDetailAlertModal"
    >
      詳細情報の登録には会社名と代表者の登録が必要です。<br />
      社名を変更し、メンバーを追加して下さい。
    </alert-message>
    <alert-message
      v-if="goToOrganizationDetailModal"
      class="alert-modal-height-211 go-to-company-detail-modal"
      button-text="閉じる"
      :gray-button="true"
      @close="toggleGoToOrganizationDetailAlertModal"
    >
      詳細情報の登録には組織（BOX）名及び属性の登録が必要です。<br />
      組織（BOX）名及び属性を登録して下さい。
    </alert-message>
    <check-update
      v-if="checkDuplicateModal"
      update-button-text="登録する"
      @close="toggleCheckDuplicateModal"
      @click="
        distributionUpdateOrganization(
          updateOrganization,
          updateOrganizationStatus,
          UpdateOldOrganization
        )
      "
    >
      その組織（BOX）名はすでに登録されています。登録しますか？
    </check-update>
    <alert-message
      v-if="messageCompanyNotRegister"
      class="alert-modal-height-211 go-to-company-detail-modal"
      button-text="閉じる"
      :gray-button="true"
      @close="toggleMessageCompanyNotRegister"
    >
      詳細情報の登録には会社名と代表者の登録が必要です。<br />
      社名を変更し、メンバーを追加して下さい。
    </alert-message>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';
import {
  createOrganization,
  deleteOrganization,
  fetchOrganizations,
  updateOrganization,
  publishOrganization,
  unpublishOrganization,
} from '@/libs/api';
import {
  AlertMessage,
  CheckDelete,
  CheckUpdate,
} from '@/components/Admin/Modules/Modal';
import {
  ChildrenBoxModal,
  CompanyHeader,
  OrganizationBox,
  OrganizationChartHeader,
} from '@/components/Admin/Pages';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import draggable from 'vuedraggable';
import AddCompanyButton from '@/components/Admin/Pages/OrganizationManagement/Organizations/AddCompanyButton.vue';
import ApplicationPreview from '@/components/Admin/Pages/OrganizationManagement/Organizations/ApplicationPreview.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';
/* import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'; */

export default Vue.extend({
  layout: 'admin/default',
  components: {
    AddCompanyButton,
    draggable,
    ApplicationPreview,
    CheckDelete,
    CheckUpdate,
    AlertMessage,
    ChildrenBoxModal,
    PageHeader,
    OrganizationChartHeader,
    CompanyHeader,
    OrganizationBox,
    TutorialButtonIcon,
  },
  async asyncData({ error }: any) {
    try {
      const res = await fetchOrganizations();
      return res.data;
    } catch (err) {
      error({
        statusCode: err.response.status,
        message: err.response.data.message,
      });
    }
  },
  data() {
    return {
      applicationPreviewModal: false as boolean,
      childrenBoxModal: false as boolean,
      deleteOrganizationModal: false as boolean,
      checkUpdateModal: false as boolean,
      addParentBoxAlertModal: false as boolean,
      publishParentBoxAlertModal: false as boolean,
      addMemberAlertModal: false as boolean,
      addChildBoxAlertModal: false as boolean,
      goToCompanyDetailModal: false as boolean,
      goToOrganizationDetailModal: false as boolean,
      messageCompanyNotRegister: false as boolean,
      organizations: [] as Types.GroupOrganization[],
      propParent: {} as Types.NestedParent,
      propSameCompanyParents: [] as Types.GroupOrganization[],
      propSubordinatedChildrenExist: false as boolean,
      propChild: {} as Types.GroupOrganization,
      propParentStatus: '' as string,
      deleteOrganizationLayer: '' as string,
      deleteOrganizationUuid: '' as string,
      deleteOrganizationType: '組織' as string,
      updateOrganization: {} as Types.GroupOrganization,
      updateOrganizationStatus: '' as string,
      UpdateOldOrganization: {} as Types.GroupOrganization,
      offsetTop: 0 as number,
      offsetLeft: 0 as number,
      dragOrganization: {} as
        | Types.NestedCompany
        | Types.NestedParent
        | Types.GroupOrganization,
      draggable: false as boolean,
      nestedChildren: [] as Types.GroupOrganization[],
      selectedCompany: '' as string,
      isShowPublishModal: false as boolean,
      isShowPublishModalForChild: false as boolean,
      isShowPublishModalForCompany: false as boolean,
      selectedOrganizationToChangeStatus: {} as {
        uuid: string;
        status: string;
        type: string;
      },
      companyBoxUuids: [] as string[],
      checkDuplicateModal: false as boolean,
      builder: {},
      /* initBuilder: false as boolean, */
      displayChildren: false as boolean,
      displayChildrenCompany: [] as any[],
      listIndexDisplay: [] as any[],
    };
  },
  /* async created() {
    const kuroshiro = new Kuroshiro();
    await kuroshiro
      .init(
        new KuromojiAnalyzer({
          dictPath: '/dict/',
        })
      )
      .then(() => {
        this.builder = kuroshiro;
        this.initBuilder = true;
      });
  }, */
  computed: {
    nestedOrganizations(): Types.NestedCompany[] | Types.NestedParent[] {
      // @ts-ignore
      return this.organizations
        .filter((o: Types.GroupOrganization) => {
          if (this.selectedCompany === '') {
            return o.layer === 0;
          }
          return o.layer === 0 && o.uuid.includes(this.selectedCompany);
        })
        .map((o: Types.GroupOrganization) => {
          const parents = this.organizations
            .filter(
              (op: Types.GroupOrganization) =>
                op.layer === 1 && op.relations.company === o.uuid
            )
            .map((op: Types.GroupOrganization) => {
              const children = this.organizations
                .filter(
                  (oc: Types.GroupOrganization) =>
                    oc.layer === 2 && oc.relations.parent === op.uuid
                )
                .sort(
                  (a: Types.GroupOrganization, b: Types.GroupOrganization) => {
                    if (a.type === 'management' && b.type === 'management') {
                      return a.pos - b.pos;
                    }
                    if (a.type === 'management') {
                      return -1;
                    }
                    if (b.type === 'management') {
                      return 1;
                    }
                    if (a.type === 'null' && b.type === 'null') {
                      return a.pos - b.pos;
                    }
                    if (a.type === null) {
                      return 1;
                    }
                    if (b.type === null) {
                      return -1;
                    }
                    return a.pos - b.pos;
                  }
                );
              return {
                ...op,
                children,
              };
            })
            .sort((a: Types.NestedParent, b: Types.NestedParent) => {
              if (a.type === 'management' && b.type === 'management') {
                return a.pos - b.pos;
              }
              if (a.type === 'management') {
                return -1;
              }
              if (b.type === 'management') {
                return 1;
              }
              if (a.type === null && b.type === null) {
                return a.pos - b.pos;
              }
              if (a.type === null) {
                return 1;
              }
              if (b.type === null) {
                return -1;
              }
              return a.pos - b.pos;
            });
          return {
            ...o,
            parents,
          };
        })
        .sort((a: Types.NestedCompany, b: Types.NestedCompany) => {
          return a.pos - b.pos;
        });
    },
    companies(): Types.GroupOrganization[] {
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
    initialOrganizationName(): string {
      return '組織名';
    },
    initialOrganizationKana(): string {
      return 'そしきめい';
    },
    initialCompanyName(): string {
      return '会社名';
    },
    initialCompanyKana(): string {
      return 'かいしゃめい';
    },
  },
  methods: {
    toggleApplicationPreviewModal() {
      this.applicationPreviewModal = !this.applicationPreviewModal;
    },
    // @ts-ignore
    toggleChildrenBoxModal(parent: Types.NestedParent = {}) {
      if (!this.isSetOrganizationNameAndType(parent)) {
        this.toggleAddChildBoxAlertModal();
        return;
      }
      if (!this.childrenBoxModal) {
        this.propParent = parent;
      }
      this.childrenBoxModal = !this.childrenBoxModal;
    },
    // @ts-ignore
    toggleDeleteOrganizationModal(organization: Types.GroupOrganization = {}) {
      if (!this.deleteOrganizationModal) {
        this.deleteOrganizationLayer = organization.layer;
        this.deleteOrganizationUuid = organization.uuid;

        switch (organization.type) {
          case 'department':
            this.deleteOrganizationType = '部署';
            break;
          case 'branch':
            this.deleteOrganizationType = '支店';
            break;
          case 'shop':
            this.deleteOrganizationType = '店舗';
            break;
          case 'management':
            this.deleteOrganizationType = '経営陣';
            break;
          case 'other':
            this.deleteOrganizationType = 'その他';
            break;
          default:
            this.deleteOrganizationType = '組織';
            break;
        }
      }
      this.deleteOrganizationModal = !this.deleteOrganizationModal;
    },
    toggleCheckUpdateModal(
      // @ts-ignore
      organization: Types.GroupOrganization = {},
      status: string = '',
      oldOrganization: Types.GroupOrganization = {}
    ) {
      if (!this.checkUpdateModal) {
        this.updateOrganization = organization;
        this.updateOrganizationStatus = status;
        this.UpdateOldOrganization = oldOrganization;
      }
      this.checkUpdateModal = !this.checkUpdateModal;
    },
    toggleAddParentBoxAlertModal() {
      this.addParentBoxAlertModal = !this.addParentBoxAlertModal;
    },
    togglePublishStatus(organization: Types.NestedParent) {
      this.selectedOrganizationToChangeStatus = {
        uuid: organization.uuid,
        status: organization.status,
        type: organization.type,
      };

      if (!this.isSetOrganizationNameAndType(organization)) {
        this.togglePublishParentBoxAlertModal(true);
        return;
      }

      if (organization.layer === 0) {
        this.isShowPublishModalForCompany = !this.isShowPublishModalForCompany;
      } else if (organization.layer === 2) {
        this.isShowPublishModalForChild = !this.isShowPublishModalForChild;
      } else {
        this.isShowPublishModal = !this.isShowPublishModal;
      }
    },
    toggleAddMemberAlertModal() {
      this.addMemberAlertModal = !this.addMemberAlertModal;
    },
    toggleAddChildBoxAlertModal() {
      this.addChildBoxAlertModal = !this.addChildBoxAlertModal;
    },
    togglePublishParentBoxAlertModal(display: boolean) {
      if (!display) {
        this.maintainPublishStatus();
      }
      this.publishParentBoxAlertModal = !this.publishParentBoxAlertModal;
    },
    pickSameCompanyParents(parent: Types.NestedParent) {
      // 自分以外の同じ会社内の親BOX
      return this.organizations.filter((o: Types.GroupOrganization) => {
        return (
          o.uuid !== parent.uuid &&
          o.layer === 1 &&
          o.relations.company === parent.relations.company
        );
      });
    },
    countSubordinatedChildren(parent: Types.NestedParent) {
      // 移動する親組織の子組織の数
      const subordinatedChildrenCount: number = this.organizations.filter(
        (o: Types.GroupOrganization) => {
          return o.layer === 2 && o.relations.parent === parent.uuid;
        }
      ).length;
      return subordinatedChildrenCount > 0;
    },
    closePublishModal() {
      this.maintainPublishStatus();

      this.isShowPublishModalForCompany = false;
      this.isShowPublishModalForChild = false;
      this.isShowPublishModal = false;
    },
    maintainPublishStatus() {
      this.organizations = this.organizations.map(
        (o: Types.GroupOrganization) => {
          if (o.uuid === this.selectedOrganizationToChangeStatus.uuid) {
            return {
              ...o,
              status:
                this.selectedOrganizationToChangeStatus.status === 'public'
                  ? 'private'
                  : 'public',
            };
          }
          return o;
        }
      );
      this.selectedOrganizationToChangeStatus = {
        uuid: '',
        status: '',
        type: '',
      };
    },
    distributionUpdateOrganization(
      organization: Types.GroupOrganization,
      status: string
    ) {
      this.checkUpdateModal = false;
      this.checkDuplicateModal = false;
      if (organization.layer === 1) {
        // 親要素の場合
        this.updateParent(organization, status);
      } else if (organization.layer === 2) {
        // 子要素の場合
        this.updateChild(organization, status);
      }
    },
    async addEmptyCompany() {
      // 一番posが大きい会社に(2^16)加える
      const companies = this.organizations.filter(
        (o: Types.GroupOrganization) => o.layer === 0
      );
      let pos: number = 0;
      if (companies.length > 0) {
        // @ts-ignore
        pos = _.maxBy(companies, 'pos').pos + 2 ** 16;
      } else {
        pos = 2 ** 16;
      }
      const payload: ApiRequest.CreateOrganization = {
        name: this.initialCompanyName,
        kana: this.initialCompanyKana,
        type: 'company',
        pos,
      };
      await this.CreateOrganization(payload);
    },
    updateCompany(company: Types.GroupOrganization) {
      const index = this.organizations.findIndex(
        (o: Types.GroupOrganization) => o.uuid === company.uuid
      );
      const payload: ApiRequest.UpdateOrganization = {
        name: this.resolveDuplicateName(company),
        kana: company.kana,
        type: company.type,
        pos: company.pos,
      };
      this.organizations.splice(index, 1, company);
      this.UpdateOrganization(company.uuid, payload, index);
    },
    toggleCompanyBox(uuid: string) {
      if (this.companyBoxUuids.includes(uuid)) {
        this.companyBoxUuids = this.companyBoxUuids.filter(
          (companyBoxUuid: string) => companyBoxUuid !== uuid
        );
      } else {
        this.companyBoxUuids = [...this.companyBoxUuids, uuid];
      }
    },
    clickAddParentBox(company: Types.GroupOrganization) {
      if (!this.isSetCompanyName(company)) {
        this.toggleAddParentBoxAlertModal();
        return;
      }
      this.addParentBox(company.uuid);
    },
    addParentBox(parentUuid: string) {
      // 一番posが大きい親組織に(2^16)加える
      const parents = this.organizations.filter(
        (o: Types.GroupOrganization) =>
          o.layer === 1 && o.relations.company === parentUuid
      );
      let pos: number = 0;
      if (parents.length > 0) {
        pos = _.maxBy(parents, 'pos').pos + 2 ** 16;
      } else {
        pos = 2 ** 16;
      }
      const payload: ApiRequest.CreateOrganization = {
        name: this.initialOrganizationName,
        kana: this.initialOrganizationKana,
        type: null,
        parent_uuid: parentUuid,
        pos,
      };
      this.CreateOrganization(payload);
    },
    updateParent(parent: Types.GroupOrganization, status: string) {
      const index = this.organizations.findIndex(
        (o: Types.GroupOrganization) => o.uuid === parent.uuid
      );
      const payload: ApiRequest.UpdateOrganization = {
        name: this.resolveDuplicateName(parent),
        kana: parent.kana,
        type: parent.type,
        pos: parent.pos,
      };
      this.organizations.splice(index, 1, parent);
      // 公開設定
      this.organizations = this.organizations.map(
        (o: Types.GroupOrganization) => {
          if (o.uuid === parent.uuid) {
            return {
              ...o,
              ...payload,
              status,
            };
          }
          if (o.relations.parent === parent.uuid) {
            return {
              ...o,
              status,
            };
          }
          return o;
        }
      );
      this.ChangeOrganizationPublishStatus(parent.uuid, status);
      this.UpdateOrganization(parent.uuid, payload, index);
    },
    async moveOrganization({
      organization,
      destinationUuid,
    }: {
      organization: Types.GroupOrganization;
      destinationUuid: string;
    }) {
      const oldOrganizations = [...this.organizations];
      const index = this.organizations.findIndex(
        (o: Types.GroupOrganization) => o.uuid === organization.uuid
      );
      if (destinationUuid) {
        this.organizations = this.organizations.map(
          (o: Types.GroupOrganization) => {
            if (o.uuid === organization.uuid) {
              return {
                ...o,
                layer: 2,
                relations: {
                  ...o.relations,
                  parent: destinationUuid,
                },
              };
            }
            return o;
          }
        );
      } else {
        this.organizations = this.organizations.map(
          (o: Types.GroupOrganization) => {
            if (o.uuid === organization.uuid) {
              return {
                ...o,
                layer: 1,
                relations: {
                  company: destinationUuid,
                },
              };
            }
            return o;
          }
        );
      }
      const payload = {
        name: organization.name,
        kana: organization.kana,
        type: organization.type,
        pos: organization.pos,
        parent_uuid: destinationUuid || organization.relations.company,
      };
      try {
        await this.UpdateOrganization(organization.uuid, payload, index);
      } catch (e) {
        this.organizations = oldOrganizations;
      }

      if (this.childrenBoxModal) {
        this.toggleChildrenBoxModal();
      }
    },
    updateChild(child: Types.GroupOrganization, status: string) {
      const index = this.organizations.findIndex(
        (o: Types.GroupOrganization) => o.uuid === child.uuid
      );
      const payload: ApiRequest.UpdateOrganization = {
        name: this.resolveDuplicateName(child),
        kana: child.kana,
        type: child.type,
        pos: child.pos,
      };
      this.organizations.splice(index, 1, child);
      this.ChangeOrganizationPublishStatus(child.uuid, status);
      this.UpdateOrganization(child.uuid, payload, index);
    },
    setOffset(element: HTMLInputElement) {
      this.offsetTop = element.getBoundingClientRect().top;
      this.offsetLeft = element.getBoundingClientRect().left;
    },
    dragStart(organization: Types.NestedParent) {
      if (!this.draggable) {
        this.dragOrganization = organization;
      }
      this.draggable = true;
    },
    dragEnd() {
      this.draggable = false;
    },
    draggableEnd(e: any, index: number) {
      if (e.newIndex === index) return;

      if (e.oldIndex !== e.newIndex) {
        this.switchPosition(e.newIndex);
      }
    },
    childDraggableEnd({
      newIndex,
      dragOrganization,
      nestedChildren,
    }: {
      newIndex: number;
      dragOrganization: Types.GroupOrganization;
      nestedChildren: Types.GroupOrganization[];
    }) {
      this.dragOrganization = dragOrganization;
      this.nestedChildren = nestedChildren;
      this.switchPosition(newIndex);
    },
    switchPosition(itemNewIndex: number) {
      let targets:
        | Types.NestedCompany[]
        | Types.NestedParent[]
        | Types.GroupOrganization[] = this.nestedOrganizations;
      if (this.dragOrganization.layer === 1) {
        // @ts-ignore
        targets = this.nestedOrganizations.find((n: Types.NestedCompany) => {
          return n.uuid === this.dragOrganization.relations.company;
        }).parents;
      }
      if (this.dragOrganization.layer === 2) {
        targets = this.nestedChildren;
      }
      const itemsTypeManagement = [...targets].filter(
        (item: Type.GroupOrganization) => item.type === 'management'
      );
      const itemsTypeNotNull = [...targets].filter(
        (item: Type.GroupOrganization) => item.type !== null
      );
      // Move top, case has box type management (begin index item is itemsTypeManagement.length)
      if (itemNewIndex === itemsTypeManagement.length) {
        targets = targets.filter(
          (item: Type.GroupOrganization) => item.type !== 'management'
        );
        this.moveTopPosition(targets);
        return;
      }
      // Move bottom case has box type is null
      if (itemNewIndex === itemsTypeNotNull.length - 1) {
        this.moveBottomPosition(itemsTypeNotNull);
        return;
      }
      // 最上部に移動の場合
      if (itemNewIndex === 0) {
        this.moveTopPosition(targets);
        return;
      }
      // 最下部に移動の場合
      if (itemNewIndex === targets.length - 1) {
        this.moveBottomPosition(targets);
        return;
      }
      // 中間部に移動の場合
      this.movePosition(targets, itemNewIndex);
    },
    moveTopPosition(
      targets:
        | Types.NestedCompany[]
        | Types.NestedParent[]
        | Types.GroupOrganization[]
    ) {
      const minTarget = targets[1];
      this.organizations = this.organizations.map(
        (o: Types.GroupOrganization) => {
          if (o.uuid === this.dragOrganization.uuid) {
            const pos = minTarget.pos / 2;
            this.UpdateOrganizationPos(pos);
            return {
              ...o,
              pos,
            };
          }
          return o;
        }
      );
    },
    moveBottomPosition(
      targets:
        | Types.NestedCompany[]
        | Types.NestedParent[]
        | Types.GroupOrganization[]
    ) {
      const maxTarget = targets[targets.length - 2];
      if (maxTarget === undefined) {
        return;
      }
      this.organizations = this.organizations.map(
        (o: Types.GroupOrganization) => {
          if (o.uuid === this.dragOrganization.uuid) {
            const pos = maxTarget.pos + 2 ** 16;
            this.UpdateOrganizationPos(pos);
            return {
              ...o,
              pos,
            };
          }
          return o;
        }
      );
    },
    movePosition(
      targets:
        | Types.NestedCompany[]
        | Types.NestedParent[]
        | Types.GroupOrganization[],
      newIndex: number
    ) {
      const beforeTarget = targets[newIndex - 1];
      const afterTarget = targets[newIndex + 1];
      if (beforeTarget === undefined || afterTarget === undefined) {
        return;
      }
      this.organizations = this.organizations.map(
        (o: Types.GroupOrganization) => {
          if (o.uuid === this.dragOrganization.uuid) {
            const pos: number = (beforeTarget.pos + afterTarget.pos) / 2;
            this.UpdateOrganizationPos(pos);
            return {
              ...o,
              pos,
            };
          }
          return o;
        }
      );
    },
    async CreateOrganization(payload: ApiRequest.CreateOrganization) {
      try {
        await createOrganization(payload);
        const {
          data: { organizations },
        } = await fetchOrganizations();
        this.organizations = organizations;
      } catch (err) {
        console.error(err);
      }
    },
    async UpdateOrganization(
      uuid: string,
      payload: ApiRequest.UpdateOrganization,
      index: number
    ) {
      try {
        const res = await updateOrganization(uuid, payload);
        const organization: ApiResponse.GroupOrganization = res.data;
        // @ts-ignore
        this.organizations.splice(index, 1, organization);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    async UpdateOrganizationPos(pos: number) {
      try {
        const payload = {
          name: this.dragOrganization.name,
          kana: this.dragOrganization.kana,
          type: this.dragOrganization.type ?? null,
          pos,
        };
        await updateOrganization(this.dragOrganization.uuid, payload);
      } catch (err) {
        console.error(err);
      }
    },
    async deleteOrganization(uuid: string) {
      try {
        await deleteOrganization(uuid);
        this.organizations = this.organizations.filter(
          (organization: Types.GroupOrganization) =>
            organization.uuid !== uuid &&
            organization.relations.parent !== uuid &&
            organization.relations.company !== uuid
        );
        if (this.deleteOrganizationModal) {
          this.toggleDeleteOrganizationModal();
        }
      } catch (err) {
        console.error(err);
      }
    },
    async ChangeOrganizationPublishStatus(uuid: string, status: string) {
      try {
        if (status === 'public') {
          await publishOrganization(uuid);
        } else {
          await unpublishOrganization(uuid);
        }
      } catch (err) {
        this.organizations = this.organizations.map(
          (o: Types.GroupOrganization) => {
            if (o.uuid === uuid || o.relations.parent === uuid) {
              return {
                ...o,
                status: status === 'public' ? 'private' : 'public',
              };
            }
            return o;
          }
        );
        console.error(err);
      }
    },
    // @ts-ignore
    addMember(organization: Types.GroupOrganization) {
      if (!this.isSetOrganizationNameAndType(organization)) {
        this.toggleAddMemberAlertModal();
        return;
      }
      this.$router.push({
        path: `/admin/employee-management/registration?organization=${organization.uuid}`,
      });
    },
    isSetCompanyName(company: Types.GroupOrganization) {
      return company.name !== this.initialCompanyName;
    },
    isSetOrganizationNameAndType(organization: Types.GroupOrganization) {
      return (
        organization.name !== this.initialOrganizationName &&
        organization.type !== null
      );
    },
    isSetOrganizationName(organizationName: string) {
      return organizationName !== this.initialOrganizationName;
    },
    updatePublishStatus() {
      this.ChangeOrganizationPublishStatus(
        this.selectedOrganizationToChangeStatus.uuid,
        this.selectedOrganizationToChangeStatus.status
      );

      this.isShowPublishModalForCompany = false;
      this.isShowPublishModalForChild = false;
      this.isShowPublishModal = false;
    },
    goToCompanyDetail(company: Types.GroupOrganization) {
      // その組織にユーザが存在するか
      let isOrganizationsUserExists = false;

      // この会社ボックスの組織だけをフィルタリングする
      const filteredOrganizations = this.organizations.filter(
        (oc: Types.GroupOrganization) => oc.relations.company === company.uuid
      );

      filteredOrganizations.map((organization: Types.GroupOrganization) => {
        if (organization.user_count > 0) {
          isOrganizationsUserExists = true;
        }
        return organization;
      });

      // その会社の組織にユーザが１人以上存在していない場合
      if (!isOrganizationsUserExists) {
        this.toggleMessageCompanyNotRegister();
        return;
      }

      // 会社名が変更されていない場合
      if (!this.isSetCompanyName(company.name)) {
        this.toggleGoToCompanyDetailAlertModal();
        return;
      }
      this.$router.push({
        path: `/admin/organization-management/organizations/companies/${company.uuid}`,
      });
    },
    goToOrganizationDetail(organization: Types.GroupOrganization) {
      if (!this.isSetOrganizationNameAndType(organization)) {
        this.toggleGoToOrganizationDetailAlertModal();
        return;
      }

      switch (organization.type) {
        case 'department':
          this.$router.push({
            path: `/admin/organization-management/organizations/departments/${organization.uuid}`,
          });
          break;
        case 'shop':
        case 'branch':
          this.$router.push({
            path: `/admin/organization-management/organizations/shops/${organization.uuid}`,
          });
          break;
        case 'management':
          this.$router.push({
            path: `/admin/organization-management/organizations/managements/${organization.uuid}`,
          });
          break;
        case 'other':
          this.$router.push({
            path: `/admin/organization-management/organizations/others/${organization.uuid}`,
          });
          break;
        default:
      }
    },
    toggleGoToCompanyDetailAlertModal() {
      this.goToCompanyDetailModal = !this.goToCompanyDetailModal;
    },
    toggleMessageCompanyNotRegister() {
      this.messageCompanyNotRegister = !this.messageCompanyNotRegister;
    },
    toggleGoToOrganizationDetailAlertModal() {
      this.goToOrganizationDetailModal = !this.goToOrganizationDetailModal;
    },
    changeSelectedCompany(companyUuid: string) {
      this.selectedCompany = companyUuid;
    },
    otherOrganizationNames(organizationUuid: string) {
      return this.organizations
        .filter(
          (organization: Types.GroupOrganization) =>
            organization.uuid !== organizationUuid
        )
        .map((organization: Types.GroupOrganization) => organization.name);
    },
    resolveDuplicateName(organization: Types.GroupOrganization) {
      const organizationNames = this.organizations
        .filter((o: Types.GroupOrganization) => o.uuid !== organization.uuid)
        .map((o: Types.GroupOrganization) => o.name);
      if (!organizationNames.includes(organization.name)) {
        return organization.name;
      }
      for (let i = 1; organizationNames.length; i += 1) {
        if (!organizationNames.includes(organization.name.concat(`（${i}）`))) {
          return organization.name.concat(`（${i}）`);
        }
      }
    },
    toggleCheckDuplicateModal(
      organization: Types.GroupOrganization,
      status: string,
      oldOrganization: Types.GroupOrganization
    ) {
      if (!this.checkUpdateModal) {
        this.updateOrganization = organization;
        this.updateOrganizationStatus = status;
        this.UpdateOldOrganization = oldOrganization;
      }
      this.checkDuplicateModal = !this.checkDuplicateModal;
    },
    checkDuplicateName(organizationName: string) {
      const duplicateList = this.organizations.filter(
        (o: Types.GroupOrganization) => {
          return o.name.trim() === organizationName.trim();
        }
      );
      if (duplicateList.length > 0) {
        return true;
      }
      return false;
    },
    updateOrganizationWithCheckDuplicate(
      organization: Types.GroupOrganization,
      status: string,
      oldOrganization: Types.GroupOrganization
    ) {
      if (
        this.checkDuplicateName(organization.name) &&
        organization.name !== oldOrganization.name
      ) {
        this.checkUpdateModal = false;
        this.toggleCheckDuplicateModal(organization, status, oldOrganization);
      } else {
        if (
          oldOrganization.type === null &&
          this.checkDuplicateNameNotIncludeUuid(
            organization.uuid,
            organization.name
          )
        ) {
          this.checkUpdateModal = false;
          this.toggleCheckDuplicateModal(organization, status, oldOrganization);
          return;
        }
        this.distributionUpdateOrganization(organization, status);
      }
    },
    checkDuplicateNameNotIncludeUuid(uuid: string, organizationName: string) {
      const duplicateList = this.organizations.filter(
        (o: Types.GroupOrganization) => {
          return o.uuid !== uuid && o.name.trim() === organizationName.trim();
        }
      );
      if (duplicateList.length > 0) {
        return true;
      }
      return false;
    },
    updateDisplayChildCompany(displayData: any) {
      if (displayData.checked) {
        const findCompanyDisplayChild = [...this.displayChildrenCompany].find(
          (o: Types.NestedCompany) => o.uuid === displayData.company.uuid
        );
        if (!findCompanyDisplayChild) {
          this.displayChildrenCompany.push(displayData.company);
        }
      } else {
        this.displayChildrenCompany = this.displayChildrenCompany.filter(
          (item: Types.NestedCompany) => item.uuid !== displayData.company.uuid
        );
      }
    },
    checkDisplayChildCompany(uuid: string) {
      const findCompanyDisplayChild = [...this.displayChildrenCompany].find(
        (o: Types.NestedCompany) => o.uuid === uuid
      );
      if (!findCompanyDisplayChild) {
        return false;
      }
      return true;
    },
    getParentIndex(comany_uuid: string, parent: Types.GroupOrganization) {
      const targets = [...this.nestedOrganizations].find(
        (n: Types.NestedParent[]) => {
          return n.uuid === comany_uuid;
        }
      ).parents;
      let parentIndex = 0;
      parentIndex = targets.indexOf(parent);
      let position = 0;
      for (let i = 0; i < parentIndex; i += 1) {
        const childrenItem = targets[i].children ?? [];
        position += 1 + childrenItem.length;
      }
      return position;
    },
    getChildrenIndex(
      comany_uuid: string,
      parent: Types.GroupOrganization,
      children: Types.GroupOrganization
    ) {
      const parentIndex = this.getParentIndex(comany_uuid, parent);
      const childIndex = parentIndex + parent.children.indexOf(children) + 1;
      return childIndex;
    },
    getClassLineBoxParent(type: string, index: number) {
      const cls = 'linerelation--';
      const classLine = index % 4 === 3 ? '--inside' : '--outside';
      return cls + type + classLine;
    },
  },
});
</script>

<style lang="scss" scoped>
$color_department: $blue;
$color_branch: $light_blue_green;
$color_shop: $purple;
$color_management: $wild_blue_yonder;
$color_other: $hopbush;
$color_null: $gray_blue_2;

* {
  color: $dark_blue;
}

.l-page {
  position: relative;
}

.contents {
  margin-top: 30px;
}

.organization-chart {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: $true_white;
}

.organization-chart-container {
  display: block;
  margin-top: 40px;
}

.organization-chart-contents-empty {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24% 0 30%;
}

.organization {
  min-width: 640px;
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid $light_gray_blue_3;
  padding: 20px 30px;
  border-radius: 4px;
}

.parents {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-gap: 12px;
  width: 100%;
  margin-top: 12px;

  .closed + & {
    display: none;
  }
}

.childOrganizationBox {
  display: contents;
}

.parent {
  height: 130px;
  min-width: 216px;
  font-size: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;

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

.add-parent {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 15px;
  background-color: $true_white;
  border: solid 1px $light_gray_blue_3;
  cursor: pointer;
  padding: 7px;
  color: $dark_blue;

  &:hover {
    background-color: $light_gray_blue_3;
  }

  &-icon {
    width: 20px;
    height: 20px;
    background-color: $pink;
    border-radius: 50%;
    background-position: center;
    background-image: url('/icon/icon_plus_white.svg');
    background-repeat: no-repeat;
    display: inline-block;
    margin-right: 20px;
    vertical-align: text-bottom;
  }
}

.add-company-button-wrapper {
  display: block;
  width: 100%;
  text-align: center;
  padding-top: 40px; /* refを取得するのでmarginはNG */
  padding-bottom: 80px; /* refを取得するのでmarginはNG */
}

.app-preview {
  font-weight: bold;
  color: $true_white;
  background-color: $gray_blue_3;
  border: none;
  border-radius: 4px;
  width: 250px;
  height: 44px;
  padding: 0 18px;
  position: absolute;
  top: 20px;
  right: 0;

  &__icon {
    float: left;
    width: 9px;
    height: 16px;
  }

  &:hover {
    background-color: $gray_blue_4;
  }
}

.check-delete {
  & /deep/ .modal-window {
    width: 540px;

    .attention {
      color: $red;
    }
  }
}

.add-member-alert-modal {
  & /deep/ .modal-content {
    padding-left: 28px;
    padding-bottom: 32px;
  }
}

.add-child-box-alert-modal {
  & /deep/ .modal-content {
    padding-left: 26px;
    padding-bottom: 32px;
  }
}

.publish-parent-box-alert-modal {
  & /deep/ .modal-content {
    padding-left: 52px;
    padding-bottom: 32px;
  }
}

.go-to-company-detail-modal {
  & /deep/ .modal-content {
    padding-left: 12px;
    padding-bottom: 56px;
  }
}

.go-to-organization-detail-modal {
  & /deep/ .modal-content {
    padding-left: 29px;
    padding-bottom: 56px;
  }
}

.alert-modal-height-211 {
  & /deep/ .modal-window {
    height: 211px;
  }
}

.add-parent-box-alert-modal {
  & /deep/ .modal-content {
    margin: 0 20px 0 30px;
  }
}

.linerelation {
  width: 12px;
  margin-left: -12px;
  margin-top: 65px;
  position: absolute;

  &--department {
    border-bottom: 4px solid #7aa7cc;

    &--inside {
      margin-left: 204px;
      background-color: #7aa7cc;
      width: 12px;
      height: 4px;
      margin-top: 65px;
    }

    &--outside {
      margin-left: 216px;
      background-color: #7aa7cc;
      width: 12px;
      height: 4px;
      margin-top: 65px;
    }
  }

  &--branch {
    border-bottom: 4px solid #abd6d2;

    &--inside {
      margin-left: 204px;
      background-color: #abd6d2;
      width: 12px;
      height: 4px;
      margin-top: 65px;
    }

    &--outside {
      margin-left: 216px;
      background-color: #abd6d2;
      width: 12px;
      height: 4px;
      margin-top: 65px;
    }
  }

  &--shop {
    border-bottom: 4px solid #b5a3d4;

    &--inside {
      margin-left: 204px;
      background-color: #b5a3d4;
      width: 12px;
      height: 4px;
      margin-top: 65px;
    }

    &--outside {
      margin-left: 216px;
      background-color: #b5a3d4;
      width: 12px;
      height: 4px;
      margin-top: 65px;
    }
  }

  &--management {
    border-bottom: 4px solid #a3aacc;

    &--inside {
      margin-left: 204px;
      background-color: #a3aacc;
      width: 12px;
      height: 4px;
      margin-top: 65px;
    }

    &--outside {
      margin-left: 216px;
      background-color: #a3aacc;
      width: 12px;
      height: 4px;
      margin-top: 65px;
    }
  }

  &--other {
    border-bottom: 4px solid #d9a0b9;
  }

  &--null {
    border-bottom: 4px solid $color_null;

    &--inside {
      margin-left: 204px;
      background-color: $color_null;
      width: 12px;
      height: 4px;
      margin-top: 65px;
    }

    &--outside {
      margin-left: 216px;
      background-color: $color_null;
      width: 12px;
      height: 4px;
      margin-top: 65px;
    }
  }
}

.linerelation--other--inside {
  margin-left: 204px;
  background-color: #d9a0b9;
  width: 12px;
  height: 4px;
  margin-top: 65px;
}

.linerelation--other--outside {
  margin-left: 216px;
  background-color: #d9a0b9;
  width: 12px;
  height: 4px;
  margin-top: 65px;
}

.first_line {
  margin-left: 1px;
}

.end_line {
  margin-left: 204px;
}
</style>
