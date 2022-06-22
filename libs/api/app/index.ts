// eslint-disable-next-line import/no-extraneous-dependencies
import simpleAxios, { AxiosPromise } from 'axios';
import { axios } from '@/plugins/axios';
import FormData from 'form-data';

export const logout = (): AxiosPromise<void> => {
  return axios.post('/signout');
};

export const fetchUser = (): AxiosPromise<AppApiResponse.User> => {
  return axios.get('/me');
};

export const fetchPosts = (payload?: {
  limit?: number;
  offset?: number;
}): AxiosPromise<AppApiResponse.Posts> => {
  const query = {
    limit: payload?.limit ?? 20,
    offset: payload?.offset ?? 0,
  };
  return axios.get('/posts', {
    params: query,
  });
};

export const updateMyEpisodePosts = (
  uuid: string,
  payload: AppApiRequest.StoreMyEpisodePost
): AxiosPromise<AppApiResponse.Posts> => {
  return axios.patch(`/posts/${uuid}`, payload);
};

export const updateDepartmentNewsPosts = (
  uuid: string,
  payload: AppApiRequest.StoreDepartmentNewsPost
): AxiosPromise<AppApiResponse.Posts> => {
  return axios.patch(`/posts/${uuid}`, payload);
};

export const updateCommunityNewsPosts = (
  uuid: string,
  payload: AppApiRequest.StoreCommunityNewsPost
): AxiosPromise<AppApiResponse.Posts> => {
  return axios.patch(`/posts/${uuid}`, payload);
};

export const updateInternalCommunicationPosts = (
  uuid: string,
  payload: AppApiRequest.StoreInternalCommunicationPost
): AxiosPromise<AppApiResponse.Posts> => {
  return axios.patch(`/posts/${uuid}`, payload);
};

export const fetchPost = (uuid: string): AxiosPromise<AppApiResponse.Post> => {
  return axios.get(`/posts/${uuid}`);
};

export const fetchPostTargetUsers = (
  uuid: string
): AxiosPromise<AppApiResponse.InternalTargetUser> => {
  return axios.get(`/posts/${uuid}`, { params: { target_users: true } });
};

export const fetchMyPosts = (params: {
  limit?: number;
  offset?: number;
}): AxiosPromise<AppApiResponse.Posts> => {
  return axios.get('/my-posts', { params });
};

export const fetchInvitedEvents = (
  params: AppApiRequest.MyPostEvent = {
    isParticipation: null,
  }
): AxiosPromise<AppApiResponse.Posts> => {
  return axios.get('/my-post-events', {
    params,
  });
};

export const fetchFavoritePosts = (params: {
  limit?: number;
  offset?: number;
}): AxiosPromise<AppApiResponse.Posts> => {
  return axios.get('/favorite-posts', { params });
};

export const postLike = (uuid: string): AxiosPromise<void> => {
  return axios.post(`/posts/${uuid}/like`);
};

export const postUnLike = (uuid: string): AxiosPromise<void> => {
  return axios.post(`/posts/${uuid}/unlike`);
};

export const postFavorite = (uuid: string): AxiosPromise<void> => {
  return axios.post(`/posts/${uuid}/favorite`);
};

export const postUnFavorite = (uuid: string): AxiosPromise<void> => {
  return axios.post(`/posts/${uuid}/unfavorite`);
};

export const fetchEnrollmentStatus = (): AxiosPromise<AppApiResponse.EnrollmentStatus> => {
  return axios.get(`/enrollment-status`);
};

export const updateEnrollmentStatus = (
  uuid: string,
  payload: AppApiRequest.EnrollmentStatus
): AxiosPromise => {
  return axios.patch(`/user/${uuid}/bulletin_board`, payload);
};

export const fetchOrganizations = (params: {
  limit?: number;
  offset?: number;
  users_list?: boolean;
  users_count?: boolean;
}): AxiosPromise<AppApiResponse.Organizations> => {
  const defaults = {
    limit: 10000,
    offset: 0,
    ...params,
  };
  return axios.get(`/organizations`, {
    params: { ...defaults },
  });
};

export const fetchUserOrganizations = (
  uuid: string
): AxiosPromise<AppApiResponse.MyOrganizations> => {
  return axios.get(`/user/${uuid}/organizations`);
};

export const fetchMainAndSubUsers = (
  uuid: string,
  params: {
    limit?: number;
    offset?: number;
    first_organization?: boolean;
  }
): AxiosPromise<{
  users: Array<AppApiResponse.OrganizationUser>;
  total_count: number;
  offset: number;
  limit: number;
}> => {
  return axios.get(`/owner/organizations/${uuid}/users-list`, {
    params,
  });
};

export const fetchOrganizationMembers = (payload: {
  uuid: string;
  limit?: number;
  offset?: number;
  is_translation: boolean;
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
  return axios.get(`/organizations/${payload.uuid}/users`, {
    params: query,
  });
};

export const fetchGroupedOrganizationMembers = (payload: {
  uuid: string;
  limit?: number;
  is_translation: boolean;
}): AxiosPromise<AppApiResponse.GroupedOrganizationMembers> => {
  return axios.get(`/organizations/${payload.uuid}/grouped-users`);
};

export const fetchFavoriteOrganizations = (params: {
  users_list?: boolean;
  users_count?: boolean;
}): AxiosPromise<AppApiResponse.Organizations> => {
  return axios.get(`/favorite-organizations`, { params });
};

export const organizationFavorite = (uuid: string): AxiosPromise<void> => {
  return axios.post(`/organizations/${uuid}/favorite`);
};

export const organizationUnFavorite = (uuid: string): AxiosPromise<void> => {
  return axios.post(`/organizations/${uuid}/unfavorite`);
};

export const fetchOrganizationGroups = (): AxiosPromise<AppApiResponse.OrganizationGroups> => {
  return axios.get('/organization-groups');
};

export const fetchCompanyFiles = (
  uuid: string,
  payload: AppApiRequest.CurrentPath
): AxiosPromise<AppApiResponse.Files> => {
  return axios.get(`/organizations/${uuid}/files`, {
    params: payload,
  });
};

export const fetchPreviewFile = (
  uuid: string,
  payload: AppApiResponse.PreviewFile
): AxiosPromise<AppApiResponse.PreviewUrl> => {
  return axios.get(`/organizations/${uuid}/files/preview`, {
    params: payload,
  });
};

export const downloadCompanyFile = (
  uuid: string,
  payload: AppApiRequest.DownloadFile
): AxiosPromise => {
  return axios.get(`/organizations/${uuid}/files/download`, {
    params: payload,
    responseType: 'blob',
  });
};

export const votePostQuestionnaires = (
  uuid: string,
  payload: AppApiRequest.QuestionnaireAnswerUuid
): AxiosPromise<void> => {
  return axios.post(`/post-questionnaires/${uuid}/vote`, payload);
};

export const postEventAnswer = (
  uuid: string,
  payload: AppApiRequest.EventAnswer
): AxiosPromise<void> => {
  return axios.post(`/post-events/${uuid}/answer`, payload);
};

export const sendMessage = (
  payload: AppApiRequest.ChatSend
): AxiosPromise<any> => {
  return axios.post(`/message/store`, payload);
};

export const getAllMessages = (): AxiosPromise<AppApiResponse.Messages> => {
  return axios.get(`/message`);
};

export const getS3PresignedPostData = (
  fileName?: String
): AxiosPromise<AppApiResponse.PresignedPost> => {
  const query = fileName ? `?file_name=${fileName}` : '';
  return axios.get(`/message/presigned_post${query}`);
};

export const uploadFileToS3 = (
  url: string,
  formData: FormData,
  headers: object
) => {
  return simpleAxios.post(url, formData, { headers });
};

export const uploadImage = (
  payload: FormData
): AxiosPromise<AppApiResponse.ImageUrl> => {
  return axios.post('/upload-image', payload, {
    'content-type': 'multipart/form-data',
  });
};

export const uploadFile = (
  payload: FormData
): AxiosPromise<AppApiResponse.uploadFile> => {
  const config: object = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };
  return axios.post(`/message/uploadFile`, payload, config);
};

export const postImages = (
  payload: AppApiRequest.PostImages
): AxiosPromise<any> => {
  return axios.post(`/message/images`, payload);
};

export const postFiles = (
  payload: AppApiRequest.PostFiles
): AxiosPromise<any> => {
  return axios.post(`/message/files`, payload);
};

export const messageText = (
  payload: AppApiRequest.MessageText
): AxiosPromise<AppApiResponse.MessageText> => {
  return axios.post('/message/text', payload);
};

export const remindText = (
  payload: AppApiRequest.RemindText
): AxiosPromise<any> => {
  return axios.post('/message/remind', payload);
};

export const messageRoger = (
  param: AppApiRequest.MessageRoger
): AxiosPromise<AppApiResponse.MessageRoger> => {
  return axios.post('/message/roger', param);
};

export const messageRoomAll = (
  param: AppApiRequest.MessageRoomAll,
  query?: {
    message_id?: string;
    count?: number;
  }
): AxiosPromise<AppApiResponse.MessageRoomAll> => {
  return axios.get(`/message/rooms/${param.room_uuid}/messages`, {
    params: query,
  });
};

export const messageRooms = (
  params: AppApiRequest.MessageRoom
): AxiosPromise<AppApiResponse.MessageRooms> => {
  return axios.get('/message/rooms', {
    params,
  });
};

export const readMessage = (
  roomId: string,
  messageIds: string[]
): AxiosPromise<void> => {
  return axios.post(`/message/rooms/${roomId}/message-read`, {
    message_ids: messageIds,
  });
};

export const deleteMessage = (
  roomId: string,
  messageId: string
): AxiosPromise<void> => {
  return axios.delete(`/message/rooms/${roomId}/messages/${messageId}`);
};

export const readAllMessage = (roomId: string): AxiosPromise<void> => {
  return axios.put(`/message/rooms/${roomId}/message-read-all`);
};

export const employees = (
  req: AppApiRequest.Employees
): AxiosPromise<AppApiResponse.Employees> => {
  return axios.get(`/employees`, {
    params: {
      offset: req.offset ?? 0,
      name: req.name ? req.name : undefined,
      limit: req.limit ? req.limit : 10,
      orders: req.orders ? req.orders : 'name',
    },
  });
};

export const searchEmployees = (
  payload: AppApiRequest.SearchEmployeeRequest
): AxiosPromise<AppApiResponse.Users> => {
  return axios.post('/employees/search', payload);
};

export const fetchGeneralSettings = (): AxiosPromise<AppApiResponse.GeneralSettings> => {
  return axios.get('/general-settings');
};

export const fetchGeneralSetting = (
  uuid: string
): AxiosPromise<AppApiResponse.GeneralSetting> => {
  return axios.get(`/general-settings/${uuid}`);
};

export const storeGeneralSetting = (payload: AppApiRequest.GeneralSetting) => {
  return axios.post('/general-settings', payload);
};

export const updateGeneralSetting = (
  uuid: string,
  payload: AppApiRequest.GeneralSetting
) => {
  return axios.patch(`/general-settings/${uuid}`, payload);
};

export const fetchEmploymentPositions = (): AxiosPromise<AppApiResponse.EmploymentPositions> => {
  return axios.get('/employment-positions');
};

export const fetchEmploymentStatuses = (): AxiosPromise<AppApiResponse.EmploymentStatuses> => {
  return axios.get('/employment-statuses');
};

export const rooms = (
  payload: AppApiRequest.Rooms
): AxiosPromise<AppApiResponse.Rooms> => {
  return axios.post(`/message/rooms`, payload);
};

export const unreadMessagesCount = (): AxiosPromise<{
  unread_messages: number;
}> => {
  return axios.get(`/message/unread-count`);
};

export const roomUsers = (
  payload: AppApiRequest.RoomUsers
): AxiosPromise<AppApiResponse.RoomUser[]> => {
  return axios.get(`/message/rooms/${payload.uuid}/users`, payload);
};

export const roomAddUsers = (payload: {
  room_uuid: string;
  user_uuids: Array<string>;
}): AxiosPromise<{}> => {
  return axios.post(`/message/rooms/${payload.room_uuid}/add-users`, payload);
};

export const roomRemoveUsers = (payload: {
  room_uuid: string;
  user_uuids: Array<string>;
}): AxiosPromise<{}> => {
  return axios.post(
    `/message/rooms/${payload.room_uuid}/remove-users`,
    payload
  );
};

export const organizations = (payload?: {
  limit?: number;
  offset?: number;
  type?: AppApiRequest.OrganizationType;
  orders?: string;
}): AxiosPromise<{
  organizations: Array<any>;
}> => {
  const defaults = {
    limit: 20,
    offset: 0,
  };
  return axios.get(`/organizations`, {
    params: { ...defaults, ...payload },
  });
};

export const organizationUsers = (payload: {
  uuid: string;
  limit?: number;
  offset?: number;
}): AxiosPromise<{
  users: Array<AppApiResponse.EmployeeUser>;
  total_count: number;
  offset: number;
  limit: number;
}> => {
  const query = {
    limit: payload.limit ?? 10,
    offset: payload.offset ?? 0,
  };
  return axios.get(`/organizations/${payload.uuid}/users`, {
    params: query,
  });
};

export const roomExit = (
  payload: AppApiRequest.RoomExit
): AxiosPromise<AppApiResponse.RoomExit> => {
  return axios.post(`/message/rooms/${payload.room_uuid}/exit`);
};

export const masterReactionIcons = (): AxiosPromise<Array<
  AppApiResponse.ReactionIcon
>> => {
  return axios.get(`/message/reactions`);
};

export const messageReaction = (
  payload: AppApiRequest.Reaction
): AxiosPromise<AppApiResponse.Reaction> => {
  return axios.put(
    `/message/rooms/${payload.uuid}/messages/${payload.id}/reactions`,
    { reaction_uuid: payload.reaction_uuid }
  );
};

export const updateRoomName = (
  payload: AppApiRequest.UpdateRoomName
): AxiosPromise => {
  return axios.put(`/message/rooms/${payload.room_uuid}/name`, {
    name: payload.room_name,
  });
};

export const updateRoomDescription = (
  payload: AppApiRequest.UpdateRoomDescription
): AxiosPromise => {
  return axios.put(`/message/rooms/${payload.room_uuid}/description`, {
    description: payload.description,
  });
};

export const updateRoomIcon = (
  payload: AppApiRequest.UpdateRoomIcon
): AxiosPromise => {
  return axios.put(`/message/rooms/${payload.room_uuid}/icon`, {
    icon: payload.room_icon,
  });
};

export const isMentalChecked = (): AxiosPromise<AppApiResponse.MentalIsChecked> => {
  return axios.get('/mental-check');
};

export const postMentalType = (type: string): AxiosPromise => {
  return axios.post('/mental-check', {
    type,
  });
};

export const authenticationCheck = (
  payload: AppApiRequest.AuthenticationCheck
): AxiosPromise<AppApiResponse.AuthenticationUserInformation> => {
  return axios.post('/authentication-url/check', payload);
};

export const authenticationRegister = (
  payload: AppApiRequest.AuthenticationRegister
): AxiosPromise => {
  return axios.post('/authentication-url/register', payload);
};

/* BEGIN DailyReport */

export const fetchDailyReports = (payload: {
  setting_uuid: string | null;
  read_type: string | null;
  from: number;
  to: number;
  free_word: string | null;
}): AxiosPromise<AppApiResponse.DailyReports> => {
  return axios.get('/readable-daily-reports', { params: payload });
};

export const fetchDailyReportsSettings = (): AxiosPromise<AppApiResponse.DailyReportsSettings> => {
  return axios.get(`/daily-reports/settings`);
};

export const fetchDailyReportDetail = (
  uuid: string
): AxiosPromise<AppApiResponse.DailyReportDetail> => {
  return axios.get(`/daily-reports/${uuid}`);
};

export const postDailyReport = (
  payload: AppApiRequest.DailyReport
): AxiosPromise<AppApiResponse.DailyReportDetail> => {
  return axios.post(`/daily-reports`, payload);
};

export const deleteDailyReport = (
  uuid: string
): AxiosPromise<AppApiResponse.UuidOnly> => {
  return axios.delete(`/daily-reports/${uuid}`);
};

export const fetchDraftDailyReports = (): AxiosPromise<AppApiResponse.DraftDailyReports> => {
  return axios.get(`/draft-daily-reports`);
};

export const updateDailyReport = (
  uuid: string,
  payload: AppApiRequest.DailyReport
): AxiosPromise<AppApiResponse.DailyReportDetail> => {
  return axios.patch(`/daily-reports/${uuid}`, payload);
};

export const fetchChooseableDailyReportSettings = (): AxiosPromise<AppApiResponse.DailyReportSettings> => {
  return axios.get(`/daily-reports/settings`);
};

export const fetchDailyReportSettings = (): AxiosPromise<AppApiResponse.DailyReportsRequired> => {
  return axios.get(`/daily-report-settings`);
};

export const fetchDailyReportSetting = (
  uuid: string
): AxiosPromise<AppApiResponse.DailyReportSetting> => {
  return axios.get(`/daily-report-settings/${uuid}`);
};

export const postDailyReportSettings = (
  payload: AppApiRequest.DailyReportSettingDetail
): AxiosPromise<AppApiResponse.DailyReportSettingsDetail> => {
  return axios.post(`/daily-report-settings`, payload);
};

export const fetchDailyReportFormats = (): AxiosPromise<AppApiResponse.DailyReportFormats> => {
  return axios.get(`/daily-report-formats`);
};

export const fetchDailyReportFormat = (
  uuid: string
): AxiosPromise<AppApiResponse.DailyReportDetailFormat> => {
  return axios.get(`/daily-report-formats/${uuid}`);
};

export const updateDailyReportSetting = (
  uuid: string,
  payload: AppApiRequest.DailyReportSettingDetail
): AxiosPromise<AppApiResponse.DailyReportSettingsDetail> => {
  return axios.patch(`/daily-report-settings/${uuid}`, payload);
};

export const fetchDailyReportFormatItems = (): AxiosPromise<AppApiResponse.DailyReportSettingFromatItems> => {
  // return axios.get(`/daily-report-format-items`);
  return Promise.resolve({
    data: {
      daily_report_format_items: [
        { uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx11', name: '業務内容' },
        { uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx12', name: '報告' },
        { uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx13', name: 'まとめ' },
        { uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx14', name: '進捗報告' },
        { uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx15', name: '目標' },
        { uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx16', name: '今日の一言' },
      ],
    },
  } as any);
};

export const updateDailyReportFormat = (
  uuid: string,
  payload: AppApiRequest.DailyReportFromat
): AxiosPromise<AppApiResponse.DailyReportDetailFormat> => {
  console.log(uuid, payload);
  // return axios.get(`/daily-report-formats/${uuid}, payload`);
  return Promise.resolve({
    data: {
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2',
      name: '新人研修日報',
      is_achievement_rate_required: true,
      items: [
        { uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx11', name: '業務内容' },
        { uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx12', name: '報告' },
        { uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx13', name: 'まとめ' },
      ],
    },
  } as any);
};

/* END DailyReport */

/* BEGIN posts */

export const fetchNewsPosts = (payload?: {
  is_top_content?: boolean;
  order?: string;
}): AxiosPromise<AppApiResponse.Posts> => {
  const query = {
    is_top_content: payload?.is_top_content ?? false,
    order: payload?.order ?? '-created_at',
  };
  return axios.get(`/post-news`, {
    params: query,
  });
};

export const fetchNewsPickUpPosts = (payload?: {
  is_top_content?: boolean;
  order?: string;
}): AxiosPromise<AppApiResponse.Posts> => {
  const query = {
    is_top_content: payload?.is_top_content ?? false,
    order: payload?.order ?? '-created_at',
    is_pickup: true,
  };
  return axios.get(`/post-news`, {
    params: query,
  });
};

export const fetchOrganization = (
  uuid: string
): AxiosPromise<AppApiResponse.Organization> => {
  return axios.get(`/organizations/${uuid}`);
};

export const fetchOrganizationData = (
  uuid: string
): AxiosPromise<AppApiResponse.OrganizationData> => {
  return axios.get(`/organizations/${uuid}/data`);
};

export const fetchEvent = (): AxiosPromise<AppApiResponse.Posts> => {
  return axios.get('/post-events');
};

export const fetchEventUsers = (
  uuid: string
): AxiosPromise<AppApiResponse.MemberList> => {
  return axios.get(`/post-events/${uuid}/users`);
};

export const fetchMyEpisodes = (
  payload: AppApiRequest.MyEpisode
): AxiosPromise<AppApiResponse.MyEpisode> => {
  return axios.get(`/user/${payload.uuid}/post-my-episode`, payload);
};

export const fetchQuestionAndAnswers = (): AxiosPromise<AppApiResponse.ProfileQuestionAndAnswers> => {
  return axios.get(`/profile/qa`);
};

export const postQuestionAndAnswers = (
  payload: AppApiRequest.ProfileQuestionAndAnswers
): AxiosPromise => {
  return axios.patch(`/profile/qa`, payload);
};

export const fetchMyQuestionAndAnswers = (
  payload: AppApiRequest.QuestionAndAnswers
): AxiosPromise<AppApiResponse.QuestionAndAnswers> => {
  return axios.get(`/user/${payload.uuid}/qa`, payload);
};
export const fetchCurrentTheme = (): AxiosPromise<AppApiResponse.PostTheme> => {
  return axios.get('/current-theme');
};

export const fetchPostRules = (): AxiosPromise<AppApiResponse.PostRules> => {
  return axios.get('/post-rules');
};

export const fetchPostEdit = (
  uuid: string
): AxiosPromise<AppApiResponse.PostEdit> => {
  return axios.get(`/posts/${uuid}/edit`);
};

export const fetchComment = (
  uuid: string
): AxiosPromise<AppApiResponse.Comments> => {
  return axios.get(`/posts/${uuid}/comments`);
};

export const postComment = (
  uuid: string,
  payload: AppApiRequest.Comment
): AxiosPromise<AppApiResponse.Comment> => {
  return axios.post(`/posts/${uuid}/comment`, payload);
};

export const postCommentReply = (
  uuid: string,
  payload: AppApiRequest.Comment
): AxiosPromise<AppApiResponse.Comment> => {
  return axios.post(`/comments/${uuid}/reply`, payload);
};

export const postCommentLike = (uuid: string): AxiosPromise => {
  return axios.post(`/comments/${uuid}/like`);
};

export const postCommentUnLike = (uuid: string): AxiosPromise => {
  return axios.post(`/comments/${uuid}/unlike`);
};

export const postCommentReplyLike = (uuid: string): AxiosPromise => {
  return axios.post(`/comment-replies/${uuid}/like`);
};

export const postCommentReplyUnLike = (uuid: string): AxiosPromise => {
  return axios.post(`/comment-replies/${uuid}/unlike`);
};

export const storeMyEpisodePost = (
  payload: AppApiRequest.StoreMyEpisodePost
): AxiosPromise => {
  return axios.post('/posts', payload);
};

export const storeInternalCommunicationPost = (
  payload: AppApiRequest.StoreInternalCommunicationPost
): AxiosPromise => {
  return axios.post('/posts', payload);
};

export const updateInternalCommunicationPost = (
  uuid: string,
  payload: AppApiRequest.StoreInternalCommunicationPost
): AxiosPromise => {
  return axios.patch(`/posts/${uuid}`, payload);
};

export const storeDepartmentNewsPost = (
  payload: AppApiRequest.StoreDepartmentNewsPost
): AxiosPromise => {
  return axios.post('/posts', payload);
};

export const storeCommunityNewsPost = (
  payload: AppApiRequest.StoreCommunityNewsPost
): AxiosPromise => {
  return axios.post('/posts', payload);
};

export const fetchJobTypes = (): AxiosPromise<AppApiResponse.JobTypes> => {
  return axios.get(`/job-types`);
};

export const fetchProfile = (): AxiosPromise<AppApiResponse.Profile> => {
  return axios.get(`/profile`);
};

export const postProfile = (payload: AppApiRequest.Profile): AxiosPromise => {
  return axios.patch(`/profile`, payload);
};

export const fetchUserProfile = (
  payload: AppApiRequest.UserProfile
): AxiosPromise<AppApiResponse.UserProfile> => {
  return axios.get(`/user/${payload.uuid}/profile`, payload);
};

export const deletePost = (uuid: string): AxiosPromise<void> => {
  return axios.delete(`/posts/${uuid}`);
};

export const fetchRelatedPosts = (
  uuid: string
): AxiosPromise<AppApiResponse.Posts> => {
  return axios.get(`/posts/${uuid}/relational-posts`);
};

/* END posts */

export const fetchCommunities = (payload?: {
  type?: AppTypes.CommunityType;
  limit?: number;
  page?: number;
}): AxiosPromise<AppApiResponse.Communities> => {
  const query = {
    type: payload?.type ?? null,
    limit: payload?.limit ?? 4,
    page: payload?.page ?? 1,
  };
  return axios.get('/communities', {
    params: query,
  });
};

export const fetchMyCommunities = (
  uuid: string
): AxiosPromise<AppApiResponse.MyCommunities> => {
  return axios.get(`/user/${uuid}/communities`);
};

export const communityFavorite = (uuid: string): AxiosPromise<void> => {
  return axios.post(`/communities/${uuid}/favorite`);
};

export const communityUnFavorite = (uuid: string): AxiosPromise<void> => {
  return axios.post(`/communities/${uuid}/unfavorite`);
};

export const fetchCommunityDetail = (
  uuid: string
): AxiosPromise<AppApiResponse.CommunityDetail> => {
  return axios.get(`/communities/${uuid}`);
};

export const fetchCommunityMembers = (
  uuid: string
): AxiosPromise<AppApiResponse.CommunityMembers> => {
  return axios.get(`/communities/${uuid}/users`);
};

export const fetchCommunityPosts = (
  uuid: string
): AxiosPromise<AppApiResponse.Posts> => {
  return axios.get(`/communities/${uuid}/posts`);
};

export const fcmPushNotificationSubscribe = (
  payload: AppApiRequest.FcmPushNotificationToken
): AxiosPromise => {
  return axios.post('/fcm-push-notification/subscribe', {
    token: payload.token,
  });
};

export const fcmPushNotificationUnsubscribe = (
  payload: AppApiRequest.FcmPushNotificationToken
): AxiosPromise => {
  return axios.post('/fcm-push-notification/unsubscribe', {
    token: payload.token,
  });
};

export const fetchDraftPosts = (): AxiosPromise<AppApiResponse.Posts> => {
  return axios.get(`/draft-posts`, {
    params: {
      with_templates: true,
    },
  });
};

export const storeDraftMyEpisodePost = (
  payload: AppApiRequest.StoreMyEpisodePost
): AxiosPromise<AppApiResponse.Posts> => {
  return axios.post(`/draft-posts`, payload);
};

export const storeDraftInternalCommunicationPost = (
  payload: AppApiRequest.StoreInternalCommunicationPost
): AxiosPromise<AppApiResponse.Posts> => {
  return axios.post(`/draft-posts`, payload);
};

export const updateDraftPost = (
  uuid: string,
  payload: AppApiRequest.StoreInternalCommunicationPost
): AxiosPromise => {
  return axios.patch(`/draft-posts/${uuid}`, payload);
};

export const storeDraftDepartmentNewsPost = (
  payload: AppApiRequest.StoreDepartmentNewsPost
): AxiosPromise<AppApiResponse.Posts> => {
  return axios.post(`/draft-posts`, payload);
};

export const storeDraftCommunityNewsPost = (
  payload: AppApiRequest.StoreCommunityNewsPost
): AxiosPromise<AppApiResponse.Posts> => {
  return axios.post(`/draft-posts`, payload);
};

export const deleteDraftPost = (uuid: string): AxiosPromise<void> => {
  return axios.delete(`/draft-posts/${uuid}`);
};

export const postPassword = (
  input: AppApiRequest.UpdatePassword
): AxiosPromise => {
  return axios.patch(`/profile/password`, input);
};

export const fetchUserTasks = (): AxiosPromise<AppApiResponse.UserTasks> => {
  return axios.get('/tasks');
};

export const putUserTask = (
  uuid: string
): AxiosPromise<AppApiResponse.UserTask> => {
  return axios.put(`/tasks/${uuid}`);
};

export const fetchUserNotifications = (payload?: {
  limit: number;
  page?: number;
  type?: string;
}): AxiosPromise<AppApiResponse.UserNotifications> => {
  const params = payload ?? {
    limit: 10,
  };
  return axios.get('/notifications', {
    params,
  });
};

export const putUserNotice = (
  uuid: string
): AxiosPromise<AppApiResponse.UserNotice> => {
  return axios.put(`/notifications/${uuid}`);
};

export const fetchUserPopups = (): AxiosPromise<AppApiResponse.UserPopup> => {
  return axios.get('/popups');
};

export const readUserPopup = (popup_uuids: string): AxiosPromise => {
  return axios.post(`/popups`, { popup_uuids });
};

export const readAllUserNotices = (notice_type: string): AxiosPromise => {
  return axios.get(`/notice-read-all`, {
    params: {
      notice_type,
    },
  });
};

export const fetchAdditionalFunctionStatuses = (): AxiosPromise<AppApiResponse.AdditionalFunctionStatuses> => {
  return axios.get(`/owner/configs/status`);
};

export const fetchUserActivities = (): AxiosPromise<AppApiResponse.UserActivities> => {
  return axios.get('/activities');
};

export const fetchLanguages = (): AxiosPromise => {
  return axios.get(`/owner/languages`);
};

export const fetchEmployeeLanguages = (): AxiosPromise => {
  return axios.get(`/languages`);
};

export const updateProfileIcon = (
  formData: FormData
): AxiosPromise<{ user_icon: string }> => {
  return axios.post('/profile/icon', formData, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

export const accessCount = (name: string): AxiosPromise => {
  const params = {
    path: name,
  };
  return axios.post('/access-counts', params);
};

export const createRoomInterview = (
  params: AppApiResponse.CreateRoomInteview
): AxiosPromise<AppApiResponse.CreateRoomResponse> => {
  return axios.post('/interview-room/create', params);
};

export const addMessageInterview = (
  params: AppApiResponse.CreateMessageInteview
): AxiosPromise<AppApiResponse.CreateMessageResponse> => {
  return axios.post('/interview-room/text', params);
};

export const editMessageInterview = (
  message_id: number,
  params: AppApiResponse.EditMessageInteview
): AxiosPromise<AppApiResponse.EditMessageInteviewResponse> => {
  return axios.put(`/interview-room/${message_id}/edit`, params);
};

export const deleteMessageInterview = (
  message_id: number
): AxiosPromise<any> => {
  return axios.delete(`/interview-room/${message_id}/delete`);
};

export const getRoomInterview = (
  room_id: number
): AxiosPromise<AppApiResponse.RoomInteviewResponse> => {
  return axios.get(`/interview-room/${room_id}`);
};

export const deleteRoomInterview = (room_id: number): AxiosPromise<any> => {
  return axios.delete(`/interview-room/${room_id}`);
};
