// eslint-disable-next-line import/no-extraneous-dependencies
import { AxiosPromise } from 'axios';
import { axios } from '@/plugins/axios';

// ログイン
export const loginAccountHolder = (
  payload: ApiRequest.Login
): AxiosPromise<ApiResponse.Credentials> => {
  return axios.post('/owner/signin', payload);
};

export const fetchAccountHolderProfile = (): AxiosPromise<ApiResponse.AccountHolder> => {
  return axios.get('/owner/me');
};

// 従業員ユーザーログイン
export const loginEmployee = (
  payload: ApiRequest.Login
): AxiosPromise<ApiResponse.Credentials> => {
  return axios.post('/signin', payload);
};

// ログアウト
export const logout = (): AxiosPromise<void> => {
  return axios.post('/owner/signout');
};

// 従業員ユーザーパスワードリセットメール送信
export const sendResetPasswordEmailEmployee = (payload: {
  email: string;
  type?: string;
}): AxiosPromise<ApiResponse.NoContent> => {
  return axios.post('/send-reset-password-email', payload);
};

// 従業員ユーザーパスワードリセット
export const resetPasswordEmployee = (
  payload: ApiRequest.ResetPassword
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.post('/reset-password', payload);
};

// アカウントホルダー登録
export const singupAccountHolder = (
  payload: ApiRequest.Login
): AxiosPromise => {
  return axios.post('/owner/signup', payload);
};

// 契約プラン一覧
export const fetchContractPlans = (): AxiosPromise => {
  return axios.get('/owner/contract/contract-plans');
};

export const fetchContractPlanPrices = (type: string): AxiosPromise => {
  return axios.get(`/owner/contract/contract-plan-prices/${type}`);
};

// 現在の契約プラン取得
export const fetchContractPlan = (): AxiosPromise<ApiResponse.ContractPlan> => {
  return axios.get('owner/contract/contract-plan');
};

// 現在の契約プラン変更
export const changeContractPlan = (
  payload: ApiRequest.ChangeContracPlan
): AxiosPromise<ApiResponse.ContractPlanChangeRequest> => {
  return axios.post('owner/contract/contract-plan/request-change', payload);
};

// 現在の契約状態
export const fetchContractStatus = (): AxiosPromise<ApiResponse.ContractStatus> => {
  return axios.get('owner/contract/status');
};

// 会社登録
export const createOwner = (payload: ApiRequest.CreateOwner): AxiosPromise => {
  return axios.post('/owner/contract/owners', payload);
};

// 会社取得
export const fetchMyOwner = (): AxiosPromise<ApiResponse.Owner> => {
  return axios.get('/owner/my-owner');
};

// 会社更新
export const updateMyOwner = (
  payload: ApiRequest.UpdateOwner
): AxiosPromise<ApiResponse.Owner> => {
  return axios.patch('/owner/my-owner', payload);
};

// クレジットカードのリストを取得する
export const fetchCreditCards = (): AxiosPromise<ApiResponse.CreditCard[]> => {
  return axios.get('/owner/credit-cards');
};

// クレジットカードのリストを取得する
export const createCreditCards = (token: string): AxiosPromise<void> => {
  return axios.post('/owner/credit-cards', { token });
};

// クレジットカードを差し替える
export const updateCreditCard = (
  card_id: string,
  token: string
): AxiosPromise<void> => {
  return axios.put('/owner/credit-cards/update', { token, card_id });
};

export const fetchPaymentHistories = (
  page: number
): AxiosPromise<ApiResponse.PaymentHistories> => {
  return axios.get('/owner/payment-histories', { params: { page } });
};

export const paymentRetry = (payload: {
  invoice_id: string;
  token?: string;
  card_id?: string;
}): AxiosPromise<void> => {
  return axios.post('/owner/payment-retry', payload);
};

export const fetchCurrentSubscription = (): AxiosPromise<ApiResponse.CurrentSubscription> => {
  return axios.get('/owner/contract/current-subscription');
};

// オーナに紐づくユーザー一覧
export const fetchUsers = (
  params: ApiRequest.UserParams
): AxiosPromise<ApiResponse.User[]> => {
  return axios.get('/owner/users', { params });
};

// ログインユーザー取得
export const fetchUserProfile = (): AxiosPromise<void> => {
  return axios.get('/me');
};

// アカウントホルダーのユーザー情報取得
export const fetchOwnerProfile = (): AxiosPromise<ApiResponse.AccountHolder> => {
  return axios.get('/owner/me');
};

// 組織一覧取得
export const fetchOrganizations = (
  params: object = {}
): AxiosPromise<ApiResponse.GroupOrganizations> => {
  return axios.get('/owner/organizations', { params });
};

export const fetchEmployeeOrganizations = (
  uuid: string
): AxiosPromise<ApiResponse.Organization> => {
  return axios.get(`/organizations/${uuid}`);
};

// 組織取得
export const fetchOrganization = (
  uuid: string
): AxiosPromise<ApiResponse.GroupOrganization> => {
  return axios.get(`/owner/organizations/${uuid}`);
};

// 自分の所属する組織を取得
export const fetchUserOrganizations = (
  uuid: string
): AxiosPromise<ApiResponse.MyOrganizations> => {
  return axios.get(`/user/${uuid}/organizations`);
};

export const fetchOrganizationData = (
  uuid: string
): AxiosPromise<ApiResponse.OrganizationData> => {
  return axios.get(`owner/organizations/${uuid}/data`);
};

// 組織作成
export const createOrganization = (
  payload: ApiRequest.CreateOrganization
): AxiosPromise<ApiResponse.GroupOrganization> => {
  return axios.post('/owner/organizations', payload);
};

// 組織更新
export const updateOrganization = (
  uuid: string,
  payload: ApiRequest.UpdateOrganization
): AxiosPromise<ApiResponse.GroupOrganization> => {
  return axios.patch(`/owner/organizations/${uuid}`, payload);
};

// 組織削除
export const deleteOrganization = (
  uuid: string
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.delete(`/owner/organizations/${uuid}`);
};

// 組織詳細更新（会社・部署・支店・店舗）
export const updateOrganizationProfile = (
  uuid: string,
  payload: ApiRequest.UpdateOrganizationProfile
): AxiosPromise<ApiResponse.GroupOrganization> => {
  return axios.patch(`/owner/organizations/${uuid}/detail`, payload);
};

// 沿革取得
export const fetchHistories = (
  uuid: string
): AxiosPromise<ApiResponse.Histories> => {
  return axios.get(`/owner/organizations/${uuid}/histories`);
};

// 沿革作成
export const createHistory = (
  uuid: string,
  payload: ApiRequest.CreateHistory
): AxiosPromise<ApiResponse.History> => {
  return axios.post(`/owner/organizations/${uuid}/histories`, payload);
};

// 沿革更新
export const updateHistory = (
  uuid: string,
  historyUuid: string,
  payload: ApiRequest.UpdateHistory
): AxiosPromise<ApiResponse.History> => {
  return axios.put(
    `/owner/organizations/${uuid}/histories/${historyUuid}`,
    payload
  );
};

// 沿革削除
export const deleteHistory = (
  uuid: string,
  historyUuid: string
): AxiosPromise<ApiResponse.History> => {
  return axios.delete(`/owner/organizations/${uuid}/histories/${historyUuid}`);
};

// 仕事の流れ取得
export const fetchWorkFlows = (
  uuid: string
): AxiosPromise<ApiResponse.Workflows> => {
  return axios.get(`/owner/organizations/${uuid}/workflows`);
};

// 仕事の流れ一括更新
export const updateWorkFlows = (
  uuid: string,
  payload: ApiRequest.Workflow[]
): AxiosPromise<ApiResponse.Workflows> => {
  return axios.put(`/owner/organizations/${uuid}/workflows`, payload);
};

// 組織に所属するユーザー覧取得
export const fetchOrganizationUsers = (
  uuid: string,
  params: ApiRequest.OrganizationUsersParams = {}
): AxiosPromise<ApiResponse.OrganizationUsers> => {
  return axios.get(`/owner/organizations/${uuid}/users`, { params });
};

// 組織に所属するユーザー覧取得(代表者を選ぶプルダウンに、サブで所属してるメンバーも表示用)
export const fetchContainSubOrganizationUsers = (
  uuid: string,
  params: ApiRequest.OrganizationUsersParams = {}
): AxiosPromise<ApiResponse.OrganizationUsers> => {
  return axios.get(`owner/organizations/${uuid}/users-list`, { params });
};

// 組織を公開する
export const publishOrganization = (
  uuid: string
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.put(`/owner/organizations/${uuid}/public`);
};

// 組織を非公開にする
export const unpublishOrganization = (
  uuid: string
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.delete(`/owner/organizations/${uuid}/public`);
};

// グループ一覧取得
export const fetchOrganizationGroups = (): AxiosPromise<ApiResponse.OrganizationGroups> => {
  return axios.get('/owner/organization-groups');
};

// グループ作成
export const createOrganizationGroup = (
  payload: ApiRequest.CreateOrganizationGroup
): AxiosPromise<ApiResponse.Group> => {
  return axios.post('/owner/organization-groups', payload);
};

// グループ削除
export const deleteOrganizationGroups = (
  payload: ApiRequest.DeleteOrganizationGroups
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.delete('/owner/organization-groups', { params: payload });
};

// グループに組織を追加
export const addOrganizationsToOrganizationGroups = (
  payload: ApiRequest.OrganizationGroups
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.post(`/owner/organization-groups/add-organizations`, payload);
};

// グループから組織を削除
export const deleteOrganizationsFromOrganizationGroups = (
  payload: ApiRequest.OrganizationGroups
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.post('/owner/organization-groups/remove-organizations', payload);
};

// 画像をアップロード
export const uploadImage = (
  payload: any
): AxiosPromise<ApiResponse.ImageUrl> => {
  return axios.post('/owner/upload-image', payload, {
    'content-type': 'multipart/form-data',
  });
};

// オーナーのファイルをアップロード
export const uploadOwnerFile = (
  payload: any
): AxiosPromise<ApiResponse.OwnerFile> => {
  return axios.post('/owner/files/upload', payload, {
    'content-type': 'multipart/form-data',
  });
};

// コミュニティ一覧取得
export const fetchCommunities = (
  page: number,
  orders: string[],
  limit: number = 3
): AxiosPromise<ApiResponse.Communities> => {
  // TODO 並び替え条件複数指定の詳細が決まったら実装を変更してください
  const dummyOrders = [...orders];
  dummyOrders.push('-created_at');
  return axios.get('/owner/communities', {
    params: { page, orders: dummyOrders.join(','), limit },
  });
};

// コミュニティ新規作成
export const createCommunity = (community: ApiRequest.NewCommunity) => {
  return axios.post('/owner/communities', community);
};

// コミュニティ公開
export const publishCommunity = (uuid: string) => {
  return axios.put(`owner/communities/${uuid}/public`);
};

// コミュニティ非公開
export const unPublishCommunity = (uuid: string) => {
  return axios.delete(`owner/communities/${uuid}/public`);
};

// 在籍掲示板表示
export const turnOnBulletinBoard = () => {
  return axios.put('/owner/configs/bulletin_board');
};

// 非表示
export const turnOffBulletinBoard = () => {
  return axios.delete('/owner/configs/bulletin_board');
};

// モチベーションチェック表示
export const turnOnMotivation = () => {
  return axios.put('/owner/configs/motivation');
};

// 非表示
export const turnOffMotivation = () => {
  return axios.delete('/owner/configs/motivation');
};

// メッセンジャー機能表示
export const turnOnMessenger = () => {
  return axios.put('/owner/configs/messenger');
};

// 非表示
export const turnOffMessenger = () => {
  return axios.delete('/owner/configs/messenger');
};

// 在籍掲示板機能,モチベーションチェック機能,メッセージ機能のステータスを取得する
export const fetchConfigStatus = (): AxiosPromise<ApiResponse.ConfigStatus> => {
  return axios.get('/owner/configs/status');
};

// 投稿ルール・アラートのマスタ設定を取得
export const fetchConfigRules = (): AxiosPromise<ApiResponse.ConfigRules> => {
  return axios.get('/owner/configs/rules');
};

// 投稿ルール・アラートのマスタ設定を更新
export const updateConfigRules = (
  payload: ApiRequest.ConfigRules
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.put('/owner/configs/rules', payload);
};

// オーナーの投稿ルールを取得
export const fetchOwnerRule = (): AxiosPromise<ApiResponse.OwnerRule> => {
  return axios.get('/owner/rules');
};

// オーナーの投稿ルールを更新
export const updateOwnerRule = (
  payload: ApiRequest.OwnerRule
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.post('/owner/rules', payload);
};

// 運営管理者ログイン
export const adminLogin = (
  payload: ApiRequest.AdminLogin
): AxiosPromise<ApiResponse.Credentials> => {
  return axios.post('/admin/signin', payload);
};

// 運営管理者ログアウト
export const adminLogout = (): AxiosPromise<void> => {
  return axios.post('/admin/signout');
};

// 運営管理者お知らせ一覧取得
export const fetchNotices = (
  page: number,
  orders: string[]
): AxiosPromise<ApiResponse.Notices> => {
  const dummyOrders = [...orders];
  dummyOrders.push('-created_at');
  return axios.get('/admin/notices', {
    params: { page, orders: dummyOrders.join(',') },
  });
};

// 運営管理者お知らせ新規作成
export const createNotice = (notice: ApiRequest.Notice) => {
  return axios.post(`/admin/notices`, notice);
};

// 運用管理者通知の更新
export const updateNotice = (uuid: string, notice: ApiRequest.Notice) => {
  return axios.patch(`/admin/notices/${uuid}`, notice);
};

// 運営管理者お知らせ詳細取得
export const fetchNotice = (uuid: string) => {
  return axios.get(`/admin/notices/${uuid}`);
};

// コミュニティ個別取得
export const fetchCommunity = (uuid: string) => {
  return axios.get(`/owner/communities/${uuid}`);
};

export const fetchCommunityPosts = (uuid: string) => {
  return axios.get(`/communities/${uuid}/posts`);
};

// コミュニティ更新
export const updateCommunity = (
  uuid: string,
  payload: ApiRequest.UpdateCommunity
) => {
  return axios.patch(`/owner/communities/${uuid}`, payload);
};

// コミュニティ削除
export const deleteCommunity = (uuid: string) => {
  return axios.delete(`/owner/communities/${uuid}`);
};

// 会社の管理者情報をすべて取得する
export const fetchAllCompanyNotices = (): AxiosPromise<ApiResponse.Notices> => {
  const dummyOrders = [];
  dummyOrders.push('-created_at');
  return axios.get('/owner/notices', {
    params: { page: 'all', orders: dummyOrders.join(',') },
  });
};

// 企業管理者お知らせ一覧取得
export const fetchCompanyNotices = (
  page: number,
  orders: string[]
): AxiosPromise<ApiResponse.Notices> => {
  return axios.get('/owner/notices', {
    params: { page, orders: orders.join(',') },
  });
};

// 企業管理者お知らせ詳細取得
export const fetchCompanyNotice = (uuid: string) => {
  return axios.get(`/owner/notices/${uuid}`);
};

// 社内連絡一覧取得
export const fetchInternalCommunications = (
  payload: ApiRequest.InternalCommunicationQuery
): AxiosPromise<ApiResponse.InternalCommunications> => {
  return axios.get('/owner/internal-communications', {
    params: payload,
  });
};

export const fetchInternalTargetUsers = (
  payload: ApiRequest.InternalCommunicationQuery
): AxiosPromise<AppApiResponse.InternalTargetUser[]> => {
  return axios.get('/owner/internal-communications', {
    params: {
      ...payload,
      target_users: true,
    },
  });
};

// Get list To Users of Internal Communication post
export const fetchInternalCommunicationUsers = (
  uuid: string
): AxiosPromise<ApiResponse.InternalCommunicationUser[]> => {
  return axios.get(`/owner/internal-communications/${uuid}/users`);
};

export const internaleCommunicationSendRemindToEmail = (
  payload: ApiRequest.InternaleCommunicationSendRemindToEmail
) => {
  return axios.post(
    `/owner/internal-communications/send-remind-to-email`,
    payload
  );
};

// コミュニティ投稿ルール取得
export const fetchCommunityRule = (payload?: {
  limit?: number;
  offset?: number;
}): AxiosPromise<ApiResponse.CommunityRules> => {
  const query = {
    limit: payload?.limit ?? 20,
    offset: payload?.offset ?? 0,
  };
  return axios.get(`/owner/communities/rules`, {
    params: query,
  });
};

// 組織ユーザルール取得
export const fetchOrganizationUserRule = (
  uuid: string
): AxiosPromise<ApiResponse.OrganizationRules> => {
  return axios.get(`/owner/organizations/${uuid}/users/rules`);
};

// コミュニティユーザルール取得
export const fetchCommunityUserRule = (
  uuid: string
): AxiosPromise<ApiResponse.CommunityRules> => {
  return axios.get(`/owner/communities/${uuid}/users/rules`);
};

// コミュニティユーザの削除
export const deleteCommunityUser = (
  uuid: string,
  payload: ApiRequest.CommunityUsers
) => {
  return axios.delete(`/owner/communities/${uuid}/users`, { params: payload });
};

// コミュニティユーザの追加
export const addCommunityUser = (
  uuid: string,
  payload: ApiRequest.CommunityUsers
) => {
  return axios.post(`/owner/communities/${uuid}/users`, payload);
};

// 組織ルール更新
export const updateOrganizationRule = (payload: ApiRequest.OrganizationRules) =>
  axios.post(`/owner/organizations/rules`, payload);

// 組織ユーザルール更新
export const updateOrganizationUserRule = (
  uuid: string,
  payload: ApiRequest.OrganizationUserRules
) => axios.post(`/owner/organizations/users/${uuid}/rules`, payload);

// 組織ルールリセット
export const resetOrganizationRules = (uuid: string) =>
  axios.post(`/owner/organizations/${uuid}/reset-rules`);

// コミュニティルール更新
export const updateCommunityRule = (payload: ApiRequest.CommunityRules) =>
  axios.post(`/owner/communities/rules`, payload);

// コミュニティユーザルール更新
export const updateCommunityUserRule = (
  uuid: string,
  payload: ApiRequest.CommunityUserRules
) => axios.post(`/owner/communities/users/${uuid}/rules`, payload);

// オーナーに紐づく全てのコミュニティルールをリセット
export const resetAllCommunityRules = () =>
  axios.post('/owner/communities/reset-rules');

// オーナーに紐づく職種を取得する
export const fetchOrganizationsJobType = (): AxiosPromise<ApiResponse.JobType[]> => {
  return axios.get('/owner/configs/job-types');
};

// オーナーに紐づく職種を追加する
export const createOrganizationsJobType = (payload: ApiRequest.JobType) => {
  return axios.post('/owner/configs/job-types', payload);
};

// オーナーに紐づく職種を削除する
export const deleteOrganizationsJobType = (uuid: string) => {
  return axios.delete(`/owner/configs/job-types/${uuid}`);
};

// 本登録用のURLを発行し、ユーザー宛にメール送信する
export const sendInvitationMail = (uuids: string[]) => {
  return axios.post('/owner/users/authentication-url', {
    users: uuids,
  });
};

// 本登録完了前のユーザーのメールアドレス変更
export const updateUserEmail = (
  uuid: string,
  payload: ApiRequest.Email
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.patch(`/owner/users/${uuid}/email`, payload);
};

// ユーザーを停止する
export const suspendedUser = (
  uuid: string,
  suspendedAt: number
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.post(`/owner/users/${uuid}/suspended`, {
    suspended_at: suspendedAt,
  });
};

export const fetchEnrollmentStatuses = (): AxiosPromise<ApiResponse.EnrollmentStatuses> => {
  return axios.get('/owner/configs/enrollment-status');
};

export const sendEnrollmentStatuses = (
  payload: ApiRequest.EnrollmentStatuses
) => {
  return axios.put('/owner/configs/enrollment-status', payload);
};

// 記事テーマのマスタ取得
export const fetchMasterPostTheme = (
  organization_uuid: string
): AxiosPromise<ApiResponse.MasterPostThemes> => {
  return axios.get('/owner/post-themes', { params: { organization_uuid } });
};

// 組織に紐づくマスタ表示順更新
export const updatePostThemePosition = (
  organizationUuid: string,
  postThemeUuid: string,
  payload: { pos: number }
) => {
  return axios.patch(
    `/owner/organizations/${organizationUuid}/post-themes/${postThemeUuid}/position`,
    payload
  );
};

// 組織記事テーマ作成
export const createPostTheme = (
  uuid: string,
  payload: ApiRequest.CreateOrganizationPostTheme
) => {
  return axios.post(`/owner/organizations/${uuid}/post-themes`, payload);
};

// 組織記事テーマ更新
export const updatePostTheme = (
  uuid: string,
  payload: ApiRequest.UpdateOrganizationPostTheme
): AxiosPromise<ApiResponse.PostThemes> => {
  return axios.patch(`/owner/post-themes/${uuid}`, payload);
};

// 組織記事テーマ削除
export const deletePostTheme = (uuid: string) => {
  return axios.delete(`/owner/post-themes/${uuid}`);
};

// 組織記事テーマ
export const fetchPostTheme = (
  uuid: string
): AxiosPromise<ApiResponse.PostThemes> => {
  return axios.get(`/owner/organizations/${uuid}/post-themes`);
};

// 組織の投稿ルールを取得
export const fetchOrganizationRules = (
  uuid: string
): AxiosPromise<ApiResponse.OrganizationRules> => {
  return axios.get(`/owner/organizations/${uuid}/rules`);
};

// 会社の投稿ルール取得
export const fetchOrganizationRule = (
  uuid: string
): AxiosPromise<ApiResponse.OrganizationRules> => {
  return axios.get(`/owner/organizations/${uuid}/rules`);
};

// 会社の投稿ルール取得(投稿ルールの設定でメンバーがいない組織はレスポンスに含めない)
export const fetchOrganizationRuleHasUser = (
  uuid: string
): AxiosPromise<ApiResponse.OrganizationRules> => {
  return axios.get(`/owner/organizations/${uuid}/rules/has-user`);
};

export const fetchMasterProfileFreeQuestions = (): AxiosPromise<ApiResponse.MasterProfileFreeQuestions> => {
  return axios.get('/owner/configs/profile-free-questions');
};

// マスタ設定画面プロフィール情報取得
export const fetchMasterProfile = (): AxiosPromise<ApiResponse.MasterProfile> => {
  return axios.get('/owner/configs/profile');
};

// マスタ設定画面プロフィール情報更新
export const updateMasterProfile = (
  payload: ApiRequest.MasterProfile
): AxiosPromise<ApiResponse.MasterProfile> => {
  return axios.put('/owner/configs/profile', payload);
};

// 役職一覧を取得
export const fetchOrganizationsPositions = (): AxiosPromise<ApiResponse.Position[]> => {
  return axios.get('/owner/organizations/positions');
};

// 役職を追加する
export const createPositions = (payload: ApiRequest.Position) => {
  return axios.post('/owner/organizations/positions', payload);
};

// 役職を更新する
export const updateOrganizationsEmploymentPositions = (
  payload: ApiResponse.Position
) => {
  return axios.patch('/owner/organizations/positions', payload);
};

// 役職を削除する
export const deletePositions = (uuid: string) => {
  return axios.delete(`/owner/organizations/positions/${uuid}`);
};

// 雇用形態一覧を取得
export const fetchOrganizationsEmploymentStatuses = (): AxiosPromise<ApiResponse.EmploymentStatus[]> => {
  return axios.get('/owner/organizations/employment-statuses');
};

// 雇用形態を追加する
export const createOrganizationsEmploymentStatuses = (
  payload: ApiRequest.EmploymentStatus
) => {
  return axios.post('/owner/organizations/employment-statuses', payload);
};

// 雇用形態を更新する
export const updateOrganizationsEmploymentStatuses = (
  payload: ApiResponse.EmploymentStatus
) => {
  return axios.patch('/owner/organizations/employment-statuses', payload);
};

// 雇用形態を削除する
export const deleteOrganizationsEmploymentStatuses = (uuid: string) => {
  return axios.delete(`/owner/organizations/employment-statuses/${uuid}`);
};

// 役職一覧を取得
export const fetchOrganizationPositions = (): AxiosPromise<ApiResponse.Position[]> =>
  axios.get(`/owner/organizations/positions`);

// 雇用形態を取得
export const fetchEmploymentStatus = () => {
  return axios.get('/owner/organizations/employment-statuses');
};

// 使用言語一覧を取得
export const fetchLanguages = (): AxiosPromise<ApiResponse.Language[]> => {
  return axios.get('/owner/languages');
};

// 言語を作成する
export const createLanguage = (
  payload: ApiRequest.Language
): AxiosPromise<ApiResponse.Language> => {
  return axios.post('/owner/languages', payload);
};

// ユーザーを一人登録する
export const createUser = (
  payload: ApiRequest.PostUser
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.post('/owner/users', payload);
};

// ユーザーを一人取得する
export const fetchUser = (
  uuid: string
): AxiosPromise<ApiResponse.fetchUser> => {
  return axios.get(`/owner/users/${uuid}`);
};

// ユーザーを一人更新する
export const updateUser = (
  uuid: string,
  payload: ApiRequest.PostUser
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.patch(`/owner/users/${uuid}`, payload);
};

// Update User Sub Organization
export const updateUserSubOrganizations = (
  uuid: string,
  payload: ApiRequest.UpdateSubOrganizations
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.patch(`/owner/users/${uuid}/sub-organization`, payload);
};

// ユーザーを一人削除する
export const deleteUser = (
  uuid: string
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.delete(`/owner/users/${uuid}`);
};

// メールを更新する
export const updateEmail = (
  uuid: string,
  payload: ApiRequest.Email
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.patch(`/owner/users/${uuid}/email`, payload);
};

// パスワードを更新する
export const updatePassword = (
  uuid: string,
  payload: ApiRequest.UpdatePassword
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.patch(`/owner/users/${uuid}/password`, payload);
};

// ユーザーのQ&Aを取得する
export const fetchUserQa = (uuid: string): AxiosPromise<ApiResponse.UserQa> => {
  return axios.get(`/owner/users/${uuid}/qa`);
};

// ユーザのQ&Aを更新する
export const putUserQa = (
  uuid: string,
  payload: ApiRequest.UserQa
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.put(`/owner/users/${uuid}/qa`, payload);
};

// メンバーをまとめて更新する
export const updateMembers = (uuid: string, payload: ApiRequest.PostMember) => {
  return axios.patch(`/owner/organizations/${uuid}/users`, payload);
};

// メンバーをまとめて削除する
export const deleteMembers = (uuid: string, payload: { users: string[] }) => {
  return axios.delete(`/owner/organizations/${uuid}/users`, {
    params: payload,
  });
};

// ユーザのプロフィールを取得する
export const fetchMemberProfile = (
  uuid: string
): AxiosPromise<ApiResponse.MemberProfile> => {
  return axios.get(`/owner/users/${uuid}/profile`);
};

// ユーザのプロフィールを更新する
export const updateMemberProfile = (
  uuid: string,
  payload: ApiRequest.MemberProfile
): AxiosPromise<ApiResponse.MemberProfile> => {
  return axios.patch(`/owner/users/${uuid}/profile`, payload);
};

// ユーザの配属履歴を取得する
export const fetchAssignmentHistories = (
  uuid: string
): AxiosPromise<ApiResponse.AssignmentHistories> => {
  return axios.get(`/owner/users/${uuid}/assignment-histories`);
};

// ユーザの配属履歴を追加する
export const addAssignmentHistory = (
  uuid: string,
  payload: ApiRequest.AssignmentHistory
): AxiosPromise<ApiResponse.AssignmentHistories> => {
  return axios.post(`/owner/users/${uuid}/assignment-histories`, payload);
};

// モチベーションチェックのスコア別合計値を取得する（会社）
export const fetchMentalCheckTotalCompany = (
  start_at: number,
  end_at: number,
  company_uuids: string[]
): AxiosPromise<ApiResponse.MentalCheckTotalCompany> => {
  return axios.get('/owner/mental-check/total/company', {
    params: {
      start_at,
      end_at,
      company_uuids,
    },
  });
};

// モチベーションチェックのスコア別合計値を取得する（組織）
export const fetchMentalCheckTotalOrganization = (
  start_at: number,
  end_at: number,
  organization_uuid: string
): AxiosPromise<ApiResponse.MentalCheckTotalOrganization> => {
  return axios.get(
    `/owner/mental-check/total/organizations/${organization_uuid}`,
    {
      params: {
        start_at,
        end_at,
      },
    }
  );
};

// 従業員のモチベーションチェックの平均スコアを取得する
export const fetchMentalCheckTotalUser = (
  start_at: number,
  end_at: number,
  user_uuid: string
): AxiosPromise<ApiResponse.MentalCheckTotalUser> => {
  return axios.get(`/owner/mental-check/total/users/${user_uuid}`, {
    params: {
      start_at,
      end_at,
    },
  });
};

// モチベーションチェックのグラフデータを取得する（会社）
export const fetchMentalCheckGraphCompany = (
  start_at: number,
  end_at: number,
  company_uuids: string[]
): AxiosPromise<ApiResponse.MentalCheckGraphCompany> => {
  return axios.get('/owner/mental-check/graph/company', {
    params: {
      start_at,
      end_at,
      company_uuids,
    },
  });
};

// モチベーションチェックのグラフデータを取得する（組織）
export const fetchMentalCheckGraphOrganization = (
  start_at: number,
  end_at: number,
  organization_uuid: string
): AxiosPromise<ApiResponse.MentalCheckGraph> => {
  return axios.get(
    `/owner/mental-check/graph/organizations/${organization_uuid}`,
    {
      params: {
        start_at,
        end_at,
      },
    }
  );
};

// 従業員のモチベーションチェックのグラフデータを取得する
export const fetchMentalCheckGraphUser = (
  start_at: number,
  end_at: number,
  user_uuid: string
): AxiosPromise<ApiResponse.MentalCheckGraph> => {
  return axios.get(`/owner/mental-check/graph/users/${user_uuid}`, {
    params: {
      start_at,
      end_at,
    },
  });
};

// モチベーションチェックのランキングデータを取得する（会社）
export const fetchMentalCheckRankingCompany = (
  start_at: number,
  end_at: number,
  company_uuids: string[],
  organization_type: string
): AxiosPromise<ApiResponse.MentalCheckRanking> => {
  return axios.get('/owner/mental-check/ranking/company', {
    params: {
      start_at,
      end_at,
      company_uuids,
      organization_type,
    },
  });
};

// モチベーションチェックのランキングデータを取得する（親組織）
export const fetchMentalCheckRankingParent = (
  start_at: number,
  end_at: number,
  organization_type: string,
  organization_uuid: string
): AxiosPromise<ApiResponse.MentalCheckRanking> => {
  return axios.get(
    `/owner/mental-check/ranking/organizations/${organization_uuid}/parent`,
    {
      params: {
        start_at,
        end_at,
        organization_type,
      },
    }
  );
};

// モチベーションチェックのランキングデータを取得する（子組織）
export const fetchMentalCheckRankingChildren = (
  start_at: number,
  end_at: number,
  organization_uuid: string,
  employment_position: string,
  employment_status: string
): AxiosPromise<ApiResponse.MentalCheckRanking> => {
  return axios.get(
    `/owner/mental-check/ranking/organizations/${organization_uuid}/children`,
    {
      params: {
        start_at,
        end_at,
        employment_position,
        employment_status,
      },
    }
  );
};

// 利用度チェックのスコア別合計値を取得する（会社）
export const fetchUseCheckTotalCompany = (
  start_at: number,
  end_at: number,
  company_uuids: string[],
  type: string
): AxiosPromise<ApiResponse.UseCheckTotalCompany> => {
  return axios.get('/owner/use-check/total/company', {
    params: {
      start_at,
      end_at,
      company_uuids,
      type,
    },
  });
};

// 利用度チェックのスコア別合計値を取得する（組織）
export const fetchUseCheckTotalOrganization = (
  start_at: number,
  end_at: number,
  organization_uuid: string
): AxiosPromise<ApiResponse.UseCheckTotalOrganization> => {
  return axios.get(
    `/owner/use-check/total/organizations/${organization_uuid}`,
    {
      params: {
        start_at,
        end_at,
      },
    }
  );
};

// 従業員の利用度チェックの平均スコアを取得する
export const fetchUseCheckTotalUser = (
  start_at: number,
  end_at: number,
  user_uuid: string,
  type: string
): AxiosPromise<ApiResponse.UseCheckTotalUser> => {
  return axios.get(`/owner/use-check/total/users/${user_uuid}`, {
    params: {
      start_at,
      end_at,
      type,
    },
  });
};

// 利用度チェックのグラフデータを取得する（会社）
export const fetchUseCheckGraphCompany = (
  start_at: number,
  end_at: number,
  company_uuids: string[],
  type: string
): AxiosPromise<ApiResponse.UseCheckGraphCompany> => {
  return axios.get('/owner/use-check/graph/company', {
    params: {
      start_at,
      end_at,
      company_uuids,
      type,
    },
  });
};

// 利用度チェックのグラフデータを取得する（組織）
export const fetchUseCheckGraphOrganization = (
  start_at: number,
  end_at: number,
  organization_uuid: string,
  type: string
): AxiosPromise<ApiResponse.UseCheckGraph> => {
  return axios.get(
    `/owner/use-check/graph/organizations/${organization_uuid}`,
    {
      params: {
        start_at,
        end_at,
        type,
      },
    }
  );
};

// 従業員の利用度チェックのグラフデータを取得する
export const fetchUseCheckGraphUser = (
  start_at: number,
  end_at: number,
  user_uuid: string,
  type: string
): AxiosPromise<ApiResponse.UseCheckGraph> => {
  return axios.get(`/owner/use-check/graph/users/${user_uuid}`, {
    params: {
      start_at,
      end_at,
      type,
    },
  });
};

// 利用度チェックのランキングデータを取得する（会社）
export const fetchUseCheckRankingCompany = (
  start_at: number,
  end_at: number,
  company_uuids: string[],
  organization_type: string,
  type: string
): AxiosPromise<ApiResponse.UseCheckRanking> => {
  return axios.get('/owner/use-check/ranking/company', {
    params: {
      start_at,
      end_at,
      company_uuids,
      organization_type,
      type,
    },
  });
};

// 利用度チェックのランキングデータを取得する（親組織）
export const fetchUseCheckRankingParent = (
  start_at: number,
  end_at: number,
  organization_type: string,
  organization_uuid: string,
  type: string
): AxiosPromise<ApiResponse.UseCheckRanking> => {
  return axios.get(
    `/owner/use-check/ranking/organizations/${organization_uuid}/parent`,
    {
      params: {
        start_at,
        end_at,
        organization_type,
        type,
      },
    }
  );
};

// 利用度チェックのランキングデータを取得する（子組織）
export const fetchUseCheckRankingChildren = (
  start_at: number,
  end_at: number,
  organization_uuid: string,
  employment_position: string,
  employment_status: string,
  type: string
): AxiosPromise<ApiResponse.UseCheckRanking> => {
  return axios.get(
    `/owner/use-check/ranking/organizations/${organization_uuid}/children`,
    {
      params: {
        start_at,
        end_at,
        employment_position,
        employment_status,
        type,
      },
    }
  );
};

// 組織別の投稿のランキングデータを取得する
export const fetchPostRankingOrganizations = (
  start_at: number,
  end_at: number,
  type: string
): AxiosPromise<ApiResponse.PostRankings> => {
  return axios.get(`/owner/post-ranking/organizations`, {
    params: {
      start_at,
      end_at,
      type,
    },
  });
};

// ユーザー別の投稿のランキングデータを取得する
export const fetchPostRankingUsers = (
  start_at: number,
  end_at: number,
  type: string
): AxiosPromise<ApiResponse.PostRankings> => {
  return axios.get(`/owner/post-ranking/users`, {
    params: {
      start_at,
      end_at,
      type,
    },
  });
};

// アクティビティログを取得する
export const fetchActivityLogs = (
  type: string
): AxiosPromise<ApiResponse.ActivityLogs> => {
  return axios.get(`/owner/activity-logs`, {
    params: {
      type,
    },
  });
};

// AccountHolderのメールアドレス変更
export const updateAccountHolderEmail = (
  payload: ApiRequest.Email
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.patch(`/owner/account-holders/email`, payload);
};

// AccountHolderのpassword変更
export const updateAccountHolderPassword = (
  payload: ApiRequest.UpdatePassword & { current_password: string }
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.patch(`/owner/account-holders/password`, payload);
};

// 管理者による記事のテーマの取得
export const fetchAdminPostTheme = (
  is_public: number
): AxiosPromise<ApiResponse.AdminPostThemes> => {
  return axios.get('/admin/post-themes', { params: { is_public } });
};

// 記事テーマの登録
export const createAdminPostTheme = (post_theme: ApiRequest.PostTheme) => {
  return axios.post('/admin/post-themes', post_theme);
};

// 記事のテーマの更新
export const updateAdminPostTheme = (
  uuid: string,
  payload: ApiRequest.PostTheme
): AxiosPromise => {
  return axios.patch(`/admin/post-themes/${uuid}`, payload);
};

// 投稿テーマの詳細情報を取得する
export const getPostThemeDetail = (
  uuid: string
): AxiosPromise<ApiResponse.PostThemeDetail> => {
  return axios.get(`/admin/post-themes/${uuid}`);
};

// 記事テーマの削除
export const deleteAdminPostTheme = (
  uuid: string
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.delete(`/admin/post-themes/${uuid}`);
};

// 運営管理者契約会社一覧取得
export const fetchAdminContractCompanies = (
  params: ApiRequest.AdminContractCompanyParams = {}
): AxiosPromise<ApiResponse.ContractCompanies> => {
  return axios.get('/admin/contract-companies', { params });
};

// 運営管理者契約会社詳細取得
export const fetchAdminContractCompany = (uuid: string) => {
  return axios.get(`/admin/contract-companies/${uuid}`);
};

// 運営管理者ログインユーザー取得
export const fetchAdminUserProfile = (): AxiosPromise<ApiResponse.Admin> => {
  return axios.get('/admin/me');
};

// 契約プラン一覧取得
export const fetchAdminContractPlans = (): AxiosPromise => {
  return axios.get('/admin/contract-plans');
};

// 契約プランの更新
export const updateAdminContractPlan = (
  uuid: string,
  ContractPlan: ApiRequest.AdminContractPlan
): AxiosPromise<ApiResponse.ContractPlan> => {
  return axios.patch(`/admin/contract-plans/${uuid}`, ContractPlan);
};

// Payment history for system admin
export const fetchPaymentHistoryOfSystemAdmin = (
  owner: string,
  page: number
): AxiosPromise<ApiResponse.PaymentHistories> => {
  return axios.get(`/admin/payment-histories/${owner}`, {
    params: {
      page,
    },
  });
};

// Payment history for system admin
export const downloadInvoicePDF = (id: string): AxiosPromise => {
  return axios.get(`/owner/payment-histories/download/invoice-${id}`, {
    responseType: 'arraybuffer',
  });
};

// Payment history for system admin
export const downloadReceiptPDF = (id: string): AxiosPromise => {
  return axios.get(`/owner/payment-histories/download/receipt-${id}`, {
    responseType: 'arraybuffer',
  });
};

export const fetchTempRegistrationUsers = (): AxiosPromise<ApiResponse.TempRegistrationUsers> => {
  return axios.get('/owner/temp-registration/users');
};

export const createTempRegistrationUsers = (): AxiosPromise<ApiResponse.TempRegistrationAddUsers> => {
  return axios.post('/owner/temp-registration/add-user');
};

// 組織削除
export const deleteTempRegistrationUser = (
  uuid: string
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.delete(`/owner/temp-registration/user/${uuid}`);
};

export const updateTempRegistrationUser = (
  uuid: string,
  payload: ApiRequest.TempRegistrationUsers
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.patch(`/owner/temp-registration/user/${uuid}`, payload);
};

export const checkExistsUserEmail = (
  email: string
): AxiosPromise<ApiResponse.CheckExistsUserEmail> => {
  return axios.post('/owner/temp-registration/exists', {
    email,
  });
};

export const moveTempRegistrationUsersToUsers = (
  users: ApiRequest.MoveTempRegistrationUsersToUsers
): AxiosPromise<ApiResponse.MovedUsers> => {
  // FIXME APIのエンドポイントは本来~/usersであるが、実装に合わせて一旦userにしている
  return axios.post('/owner/temp-registration/user', users);
};

export const fetchAuthorities = (payload: {
  company: string;
  page: number;
}): AxiosPromise<ApiResponse.UsersAuthority> => {
  return axios.get(`/owner/authorities`, {
    params: payload,
  });
};

export const updateAuthorities = (payload: {
  users: string[];
  authorities: Types.UserAuthorities;
}): AxiosPromise<ApiResponse.NoContent> => {
  return axios.patch(`/owner/authorities`, payload);
};

// 社内ファイル フォルダ・ファイル一覧の取得
export const fetchFiles = (
  uuid: string,
  payload: ApiRequest.CurrentPath
): AxiosPromise<ApiResponse.Files> => {
  return axios.get(`/owner/organizations/${uuid}/files`, {
    params: payload,
  });
};

export const searchFiles = (
  uuid: string,
  payload: ApiRequest.SearchFile
): AxiosPromise<ApiResponse.File[]> => {
  return axios.get(`/owner/organizations/${uuid}/files/search`, {
    params: payload,
  });
};

export const downloadOrganizationFile = (
  uuid: string,
  payload: ApiRequest.DownloadFile
): AxiosPromise => {
  return axios.get(`/owner/organizations/${uuid}/files/download`, {
    params: payload,
    responseType: 'blob',
  });
};

export const downloadOrganizationDirectory = (
  uuid: string,
  payload: ApiRequest.DownloadFile
): AxiosPromise => {
  return axios.get(`/owner/organizations/${uuid}/directories/download`, {
    params: payload,
    responseType: 'blob',
  });
};

export const uploadFile = (
  uuid: string,
  payload: ApiRequest.UploadFile,
  onUpload?: any
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.post(`/owner/organizations/${uuid}/files`, payload, {
    onUploadProgress: onUpload,
    'content-type': 'multipart/form-data',
  });
};

export const createDirectory = (
  uuid: string,
  payload: ApiRequest.DownloadFile
): AxiosPromise => {
  return axios.post(`/owner/organizations/${uuid}/directories`, payload);
};

export const fetchPreviewFile = (
  uuid: string,
  payload: ApiResponse.PreviewFile
): AxiosPromise<ApiResponse.PreviewUrl> => {
  return axios.get(`/owner/organizations/${uuid}/files/preview`, {
    params: payload,
  });
};

export const deleteOrganizationFile = (
  uuid: string,
  payload: ApiRequest.DeleteFile
): AxiosPromise => {
  return axios.delete(`/owner/organizations/${uuid}/files`, {
    params: payload,
  });
};

export const deleteOrganizationDirectory = (
  uuid: string,
  payload: ApiRequest.DeleteFile
): AxiosPromise => {
  return axios.delete(`/owner/organizations/${uuid}/directories`, {
    params: payload,
  });
};

export const changeOrganizationFileName = (
  uuid: string,
  payload: ApiRequest.PutFileName
): AxiosPromise => {
  return axios.put(`/owner/organizations/${uuid}/files/rename`, payload);
};

export const changeOrganizationDirectoryName = (
  uuid: string,
  payload: ApiRequest.PutFileName
): AxiosPromise => {
  return axios.put(`/owner/organizations/${uuid}/directories/rename`, payload);
};

// 社内ファイルのファイルを移動する
export const moveFile = (
  uuid: string,
  payload: ApiRequest.MoveFile
): AxiosPromise => {
  return axios.patch(`/owner/organizations/${uuid}/files/move`, payload);
};

// 社内のフォルダを移動する
export const moveDirectory = (
  uuid: string,
  payload: ApiRequest.MoveDirectory
): AxiosPromise => {
  return axios.patch(`/owner/organizations/${uuid}/directories/move`, payload);
};

// 会社・組織データの公開設定を更新する
export const updateOrganizationDataConfig = (
  uuid: string,
  payload: ApiRequest.OrganizationDataConfig
) => {
  return axios.patch(`/organizations/${uuid}/data-config`, payload);
};

// 会社・組織データの公開設定を取得する
export const fetchOrganizationDataConfig = (
  uuid: string
): AxiosPromise<ApiResponse.OrganizationDataConfig> => {
  return axios.get(`/owner/organizations/${uuid}/data-config`);
};

// アプリプレビュー用
export const fetchPreviewOrganizationMembers = (payload: {
  uuid: string;
  limit?: number;
  offset?: number;
}): AxiosPromise<{
  users: Array<AppApiResponse.OrganizationMember>;
  total_count: number;
  offset: number;
  limit: number;
}> => {
  const query = {
    limit: payload.limit ?? 20,
    offset: payload.offset ?? 0,
  };
  return axios.get(`/owner/organizations/${payload.uuid}/preview-users`, {
    params: query,
  });
};

export const fetchPreviewGroupedOrganizationMembers = (payload: {
  uuid: string;
}): AxiosPromise<AppApiResponse.GroupedOrganizationMembers> => {
  return axios.get(
    `/owner/organizations/${payload.uuid}/preview-grouped-users`
  );
};

export const sendMasterContactEmail = (
  payload: ApiRequest.ContactEmailForm
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.post('/owner/send-master-contact-email', payload);
};

export const sendRegisterPlanContact = (
  payload: ApiRequest.RegisterPlanContact
): AxiosPromise<ApiResponse.NoContent> => {
  return axios.post('/owner/send-register-plan-contact-email', payload);
};
