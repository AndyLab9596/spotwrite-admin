/* 組織情報の登録画面 */
import ScheduleAndData from './Organizations/ScheduleAndData.vue';
import ScheduleAccordion from './Organizations/ScheduleAccordion.vue';
/* 会社情報の登録画面 */
import CompanyProfile from './Organizations/Company/CompanyProfile.vue';
import CompanyData from './Organizations/Company/CompanyData.vue';
import CompanyHistory from './Organizations/Company/CompanyHistory.vue';
/* 部署情報の登録画面 */
import DepartmentProfile from './Organizations/Department/DepartmentProfile.vue';
/* 支店・店舗情報の登録画面 */
import StoreProfile from './Organizations/Shop/ShopProfile.vue';
/* 経営陣情報の登録画面 */
import ManagementProfile from './Organizations/Management/ManagementProfile.vue';
/* その他BOX情報の登録画面 */
import OtherProfile from './Organizations/Other/OtherProfile.vue';
/* BOXグループ化画面 */
import GroupManagementModal from './Grouping/GroupManagementModal.vue';
import AddGroupMemberModal from './Grouping/AddGroupMemberModal.vue';
import OrganizationTable from './Grouping/OrganizationTable.vue';
import AllOrganizationTable from './Grouping/AllOrganizationTable.vue';
import AddGroupModal from './Grouping/AddGroupModal.vue';
import BulkAddGroupModal from './Grouping/BulkAddGroupModal.vue';
import DeleteGroupModal from './Grouping/DeleteGroupModal.vue';
import NoGroupModal from './Grouping/NoGroupModal.vue';
/* 組織図管理画面 */
import UpdateCompanyModal from './Organizations/Registration/UpdateCompanyModal.vue';
import AddParentModal from './Organizations/Registration/AddParentModal.vue';
import UpdateParentModal from './Organizations/Registration/UpdateParentModal.vue';
import ChildrenBoxModal from './Organizations/Registration/ChildrenBoxModal.vue';
import AddChildModal from './Organizations/Registration/AddChildModal.vue';
import UpdateChildModal from './Organizations/Registration/UpdateChildModal.vue';
import CompanyEditModal from './Organizations/Registration/CompanyEditModal.vue';
import OrganizationEditModal from './Organizations/Registration/OrganizationEditModal.vue';
import ChildOrganizationEditModal from './Organizations/Registration/ChildOrganizationEditModal.vue';
import CompanyHeader from './Organizations/Registration/CompanyHeader.vue';
import OrganizationBox from './Organizations/Registration/OrganizationBox.vue';
import OrganizationChartHeader from './Organizations/Registration/OrganizationChartHeader.vue';

/* 従業員メンバー登録画面 */
import OrganizationMembers from './Employees/OrganizationMembers.vue';
/* 従業員メンバー一覧画面 */
import UserFilterModal from './Employees/UserFilterModal.vue';
import BulkUserSettingModal from './Employees/BulkUserSettingModal.vue';
import PositionRegisterModal from './Employees/PositionRegisterModal.vue';
/* メンバー情報の登録画面 */
import OptionSettingModal from './Employees/OptionSettingModal.vue';
import AuthorityModal from './Employees/AuthorityModal.vue';
import BusinessData from './Employees/BusinessData.vue';
import Profile from './Employees/Profile.vue';
import AddAffiliationHistoryModal from './Employees/AddAffiliationHistoryModal.vue';
import QAndA from './Employees/QAndA.vue';
import ChangePassword from './Employees/ChangePassword.vue';
/* コミュニティ管理画面 */
import CommunityAddMemberModal from './Community/CommunityAddMemberModal.vue';
import IntegratedSwitchButton from './CommunityManagement/IntegratedSwitchButton.vue';
import SortMenu from './CommunityManagement/SortMenu.vue';
import AddButton from './CommunityManagement/AddButton.vue';
import CompanyNameWithIcon from './CommunityManagement/CompanyNameWithIcon.vue';
import OrganizationMemberTable from './CommunityManagement/OrganizationMemberTable.vue';
/* 組織一覧画面 */
import OrganizationList from './OrganizationManagement/OrganizationList.vue';
import OrganizationListRow from './OrganizationManagement/OrganizationListRow.vue';
/* 投稿ルール */
import SelectAlert from './PostRule/SelectAlert.vue';
import SelectPostRule from './PostRule/SelectPostRule.vue';
import SelectPostRuleMember from './PostRule/SelectPostRuleMember.vue';
import GroupPostRuleModal from './PostRule/GroupPostRuleModal.vue';
import BulkGroupPostRuleModal from './PostRule/BulkGroupPostRuleModal.vue';
import RuleTableModal from './PostRule/RuleTableModal.vue';
import CommunityPostRuleModal from './PostRule/CommunityPostRuleModal.vue';
import CommunityRuleTableModal from './PostRule/CommunityRuleTableModal.vue';
import BulkCommunityPostRuleModal from './PostRule/BulkCommunityPostRuleModal.vue';
import BulkCommunityPostRuleSettingModal from './PostRule/BulkCommunityPostRuleSettingModal.vue';
import BulkPostRuleSettingModal from './PostRule/BulkPostRuleSettingModal.vue';
import BulkBasicPostRuleModal from './PostRule/BulkBasicPostRuleModal.vue';
/* 記事テーマ */
import StarRating from './ArticleTheme/StarRating.vue';
import EditableThemeCard from './ArticleTheme/EditableThemeCard.vue';
import ArticleSampleModal from './ArticleTheme/AtricleSampleModal.vue';
import SelectThemePriorityModal from './ArticleTheme/SelectThemePriorityModal.vue';
import LoadingOverlay from './ArticleTheme/LoadingOverlay.vue';
import PostSampleButton from './ArticleTheme/PostSampleButton.vue';
/* 機能追加 */
import Extension from './Extensions/extension.vue';
/* アカウント一覧 */
import OrganizationAccountsBox from './AccountManagement/OrganizationAccountsBox.vue';
/* マスタ設定 */
import PostingRulesAndAlert from './MasterSetting/PostingRulesAndAlert.vue';
import EmploymentStatusAndPosition from './MasterSetting/EmploymentStatusAndPosition.vue';
import Occupation from './MasterSetting/Occupation.vue';
import ProfileSetting from './MasterSetting/ProfileSetting.vue';
import InventoryBulletinBoardModal from './MasterSetting/InventoryBulletinBoardModal.vue';
/* 社内連絡一覧画面 */
import InternalCommunicationSearchModal from './InternalCommunications/InternalCommunicationSearchModal.vue';
import DestinationUserListModal from './InternalCommunications/DestinationUserListModal.vue';
/* 利用度チェック */
import Chart from './Analysis/chart.vue';

export {
  CompanyProfile,
  CompanyData,
  CompanyHistory,
  DepartmentProfile,
  ManagementProfile,
  OtherProfile,
  ScheduleAndData,
  ScheduleAccordion,
  StoreProfile,
  GroupManagementModal,
  NoGroupModal,
  AddGroupMemberModal,
  OrganizationTable,
  AddGroupModal,
  BulkAddGroupModal,
  DeleteGroupModal,
  AllOrganizationTable,
  UpdateCompanyModal,
  AddParentModal,
  UpdateParentModal,
  ChildrenBoxModal,
  AddChildModal,
  UpdateChildModal,
  CompanyEditModal,
  OrganizationEditModal,
  ChildOrganizationEditModal,
  CompanyHeader,
  OrganizationBox,
  OrganizationChartHeader,
  OrganizationMembers,
  UserFilterModal,
  BulkUserSettingModal,
  BulkPostRuleSettingModal,
  BulkBasicPostRuleModal,
  PositionRegisterModal,
  OptionSettingModal,
  AuthorityModal,
  BusinessData,
  Profile,
  AddAffiliationHistoryModal,
  QAndA,
  ChangePassword,
  CommunityAddMemberModal,
  OrganizationList,
  OrganizationListRow,
  SelectAlert,
  SelectPostRule,
  SelectPostRuleMember,
  GroupPostRuleModal,
  BulkGroupPostRuleModal,
  RuleTableModal,
  CommunityPostRuleModal,
  CommunityRuleTableModal,
  BulkCommunityPostRuleModal,
  BulkCommunityPostRuleSettingModal,
  StarRating,
  EditableThemeCard,
  ArticleSampleModal,
  SelectThemePriorityModal,
  LoadingOverlay,
  PostSampleButton,
  Extension,
  OrganizationAccountsBox,
  PostingRulesAndAlert,
  EmploymentStatusAndPosition,
  Occupation,
  ProfileSetting,
  InventoryBulletinBoardModal,
  InternalCommunicationSearchModal,
  DestinationUserListModal,
  Chart,
  IntegratedSwitchButton,
  SortMenu,
  AddButton,
  CompanyNameWithIcon,
  OrganizationMemberTable,
};
