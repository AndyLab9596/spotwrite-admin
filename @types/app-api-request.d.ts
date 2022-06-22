declare module AppApiRequest {
  // 汎用設定
  type GeneralSetting = Omit<AppApiResponse.GeneralSetting, 'uuid'> & {
    uuid?: string;
  };

  interface ChatSend {
    message: String;
  }

  interface MessageText {
    room_uuid: String;
    message: String;
  }

  interface RemindText {
    user_uuids: String[];
    message: String;
  }

  interface MessageRoger {
    room_uuid: String;
  }

  interface MessageRoomAll {
    room_uuid: string;
  }

  interface Login {
    email: string;
    password: string;
  }

  interface UploadImage {
    image: File;
  }

  interface PostImages {
    room_uuid: string;
    images: Array<AppApiResponse.uploadImage>;
  }

  interface PostFiles {
    room_uuid: string;
    files: string[];
  }

  interface DailyReport {
    daily_report_setting_uuid: string;
    posted_at: number;
    achievement_rate: number;
    items: DailyReportItem[];
    is_draft: boolean;
  }

  interface DailyReportItem {
    uuid: string;
    content: string;
  }

  interface DailyReportSettingDetail {
    title: string;
    target_user_uuids: string[];
    main_read_user_uuids: string[];
    sub_read_user_uuids: string[];
    expire_time: string; // HH:MM:SS
    start_date: number;
    end_date: number;
    frequency: string[];
    interval_days: number | null;
    is_alert_required: boolean;
    format_uuid: string;
  }

  interface DailyReportFromat {
    is_achievement_rate_required: boolean;
    item_uuids: string[];
  }

  interface Rooms {
    user_uuids: string[];
    organization_uuids?: string[];
  }

  interface RoomUsers {
    uuid: string;
    user?: string;
  }

  interface RoomExit {
    room_uuid: string;
  }

  interface Reaction {
    uuid: string;
    id: string;
    reaction_uuid: string;
  }

  interface EventAnswer {
    answer: string;
  }

  interface UpdateRoomName {
    room_uuid: string;
    room_name: string;
  }

  interface UpdateRoomDescription {
    room_uuid: string;
    description: string;
  }

  interface UpdateRoomIcon {
    room_uuid: string;
    room_icon: string;
  }

  interface MessageRoom {
    limit?: number;
    page?: number;
    search_word?: string;
  }

  interface EnrollmentStatus {
    color_code: string;
    text: string;
    description: string;
  }

  interface AuthenticationCheck {
    token: string;
  }

  interface AuthenticationInformation {
    password: string;
    password_confirmation: string;
    gender: string;
    birthday: number;
    birthplace_country: string;
    birthplace_prefecture?: string;
    birthplace_city: string;
    user_icon: string;
    language: string;
  }

  interface Job {
    uuid: string;
    name: string;
  }

  interface ProfileQuestionAndAnswers {
    company_questions: CompanyQuestionsItem;
    job_types: string[];
    qa_free_questions: QuestionnaireItem[];
  }

  interface CompanyQuestionsItem {
    blood_type?: string | null;
    humanities_or_science?: string | null;
    new_graduate_or_mid_career?: string | null;
    prefectures_where_lived?: string | null;
  }

  interface QuestionnaireItem {
    uuid: string;
    answer: string | null;
  }

  interface Profile {
    gender: string;
    birthday: number;
    published_birthday: boolean;
    birthplace_country: string | null;
    birthplace_prefecture: string;
    birthplace_city: string;
    tel: string;
    company_tel: string;
    internal_tel: string;
    joined_year: number;
    joined_month: string;
    jobs: string[];
    main_job: string | null;
    sub_organizations: string[];
    profile_free_questions: ProfileFreeQuestions[];
    main_language: string;
    sub_languages: string[];
  }

  interface ProfileFreeQuestions {
    uuid: string;
    answer: string | null;
  }

  type AuthenticationRegister = AuthenticationInformation & {
    token: string;
  };

  interface Comment {
    content: string;
  }

  /* BEGIN posts */

  interface MyEpisode {
    uuid: string;
    params?: {
      offset?: string;
      limit?: string;
    };
  }
  interface QuestionAndAnswers {
    uuid: string;
  }
  interface QuestionnaireAnswerUuid {
    item_uuid: string;
  }

  type StoreMyEpisodePost = {
    type: 'my-episode';
    title: string;
    content: string;
    add_image_urls: string[];
    delete_image_urls?: string[];
    add_video_urls: string[];
    delete_video_urls?: string[];
    is_important: boolean;
    is_draft: boolean;
    questionnaire: StorePostQuestionnaire | null;
    event: StorePostEvent | null;
    relational_post_uuid?: string | null;
  };

  type StoreDepartmentNewsPost = {
    type: 'department-news';
    title: string;
    content: string;
    add_image_urls: string[];
    delete_image_urls?: string[];
    add_video_urls: string[];
    delete_video_urls?: string[];
    is_important: boolean;
    is_draft: boolean;
    organization_uuid: string;
    questionnaire: StorePostQuestionnaire | null;
    event: StorePostEvent | null;
    relational_post_uuid?: string | null;
  };

  type StoreCommunityNewsPost = {
    type: 'community-news';
    title: string;
    content: string;
    add_image_urls: string[];
    delete_image_urls?: string[];
    add_video_urls: string[];
    delete_video_urls?: string[];
    is_important: boolean;
    is_draft: boolean;
    community_uuid: string;
    questionnaire: StorePostQuestionnaire | null;
    event: StorePostEvent | null;
    relational_post_uuid?: string | null;
  };

  type StoreInternalCommunicationPost = {
    type: 'internal-communication';
    permission: Permission | null;
    organization_uuid: string | null;
    community_uuid: string | null;
    title: string;
    content: string;
    add_image_urls: string[];
    delete_image_urls?: string[];
    add_video_urls: string[];
    delete_video_urls?: string[];
    relational_post_uuid?: string | null;
    is_draft?: boolean;
    template: 'none' | 'interview' | 'pickup' | 'thankyou';
    awardee_user_uuid: string | null;
    awardee_user_comment: string | null;
    interview_contents?: StoreInterviewItem[];
    room_id?: number;
    publish_setting: PublishSetting | null;
    questionnaire: StorePostQuestionnaire | null;
    event: StorePostEvent | null;
  };

  type Permission = 'member' | 'associate_member' | 'guest';

  type StorePostQuestionnaire = {
    items: Array<AppApiRequest.StoreQuestionnaireItem>;
    organization_uuid: string | null;
    expire_at: number | null;
    is_disclosed_answerers: boolean;
  };

  type StorePostEvent = {
    place: string | null;
    start_at?: number | null;
    end_at?: number | null;
    expire_at: number | null;
    is_required_answer: boolean;
    users: string[];
  };

  type StoreQuestionnaireItem = {
    content: string;
    add_image_url: string | null;
  };

  type StoreInterviewItem = {
    content_type: 'heading' | 'comment';
    body: string;
    interviewee_uuid?: string;
    comment_position?: 'left' | 'right';
    user_icon?: string;
    user_name?: string;
    organization_name?: string;
    id?: number;
  };

  type PublishSetting = {
    users: string[];
    start_at: number | null;
    end_at: number | null;
    is_important: boolean;
  };

  interface UserProfile {
    uuid: string;
  }

  interface Employees {
    limit?: number;
    offset?: number;
    name?: string;
    orders?: 'name' | 'frequency';
  }
  /* END posts */

  interface SearchEmployeeRequestByGeneralSetting {
    general_setting: string;
  }

  interface SearchEmployeeRequestByContents {
    filter: {
      companies?: string[];
      organizations?: string[];
      employment_positions?: string[];
      employment_statuses?: string[];
      job_types?: string[];
      birthday?: number[];
      gender?: string;
      joined_on?: number[];
    };
  }

  interface SearchEmployeeRequestByFreeWord {
    free_word: string;
  }

  type SearchEmployeeRequest =
    | SearchEmployeeRequestByGeneralSetting
    | SearchEmployeeRequestByContents
    | SearchEmployeeRequestByFreeWord;

  type OrganizationType = 'company' | 'department';

  interface FcmPushNotificationToken {
    token: string;
  }

  interface UpdatePassword {
    password: string;
    password_confirmation: string;
  }

  interface CurrentPath {
    current_path: string;
  }

  interface DownloadFile {
    current_path: string;
    name: string;
  }

  type MyPostEvent = {
    isParticipation: number | null;
  };
}
