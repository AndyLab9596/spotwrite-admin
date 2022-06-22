declare module AppApiResponse {
  interface Credentials {
    access_token: string;
    token_type: string;
    expires_in: number;
  }

  interface AuthenticationUserInformation {
    email: string;
    user_name: string;
    can_register?: boolean;
  }

  interface User {
    uuid: string;
    name: string;
    icon: string;
    company_uuid: string;
    company_name: string;
    organization_uuid: string;
    organization_name: string;
    position_name: string;
    enrollment_text: string;
    enrollment_color: string;
    enrollment_description?: string;
    access_permission: string;
    has_new_post_theme: number | null;
  }

  interface EmployeeUser {
    organization_uuid: string;
    organization_name: string;
    user_uuid: string;
    user_name: string;
    user_icon: string;
    priority: string;
    employment_status_uuid: string;
    employment_status_name: string;
    employment_position_uuid: string;
    employment_position_name: string;
    enrollment_text: string;
    enrollment_color: string;
    enrollment_description: string;
    enrollment_updated_at: string;
    internal_tel: string;
    company_tel: string;
    tel: string;
  }

  interface OrganizationUser extends EmployeeUser {
    status: string;
    user_kana: string;
    number: number;
    email: string;
    my_episode: string;
    communities: [
      {
        uuid: string;
        name: string;
        kana: string;
        type: string;
        status: string;
      }
    ];
    is_active: boolean;
    is_sent: boolean;
    joined_year: number;
    joined_month: number;
    enrollment_status: string;
    last_accessed_at: number;
    is_using_smartphone: boolean;
    birthday: string;
    gender: string;
    access_permission: string;
  }

  interface OrganizationMember extends EmployeeUser {
    gender: string;
    jobs: JobName[];
  }

  interface JobName {
    name: string;
  }

  interface GroupedOrganizationMembers {
    employment_positions: GroupedOrganizationMember[];
  }
  interface GroupedOrganizationMember {
    employment_position_uuid: string;
    employment_position_name: string;
    users: GroupedMember[];
  }

  interface GroupedMember {
    user_uuid: string;
    user_name: string;
    user_icon: string;
    priority: string;
    gender: string;
  }

  interface Employee {
    user_uuid: string;
    name: string;
    user_icon: string;
    organization_uuid: string;
    organization_name: string;
    company_uuid: string;
    company_name: string;
    joined_year?: number;
    joined_month?: number;
  }

  interface EmploymentPosition {
    uuid: string;
    name: string;
  }

  interface EmploymentPositions {
    employment_positions: EmploymentPosition[];
  }

  interface EmploymentStatus {
    uuid: string;
    name: string;
    display_name: string;
  }

  interface EmploymentStatuses {
    employment_statuses: EmploymentStatus[];
  }

  interface GeneralSettingContent {
    company?: string;
    organizations?: string[];
    employment_positions?: string[];
    employment_statuses?: string[];
    job_types?: string[];
    birthday?: number[];
    gender?: string;
    latest_access?: string;
    joined_on?: number[];
    post_rule?: string;
  }

  interface GeneralSettingSummary {
    uuid: string;
    name: string;
  }

  type GeneralSetting = GeneralSettingSummary & {
    content: GeneralSettingContent;
  };

  interface GeneralSettings {
    general_settings: GeneralSettingSummary[];
  }

  interface Posts {
    posts: Post[];
  }

  interface PostUser {
    uuid: string;
    icon: string;
    name: string;
    organization: string | null;
  }

  interface ContentText {
    [languageCode: string]: string;
  }

  interface MessageItem {
    user_info: {
      uuid: string;
      icon: string;
      name: string;
    };
    type: string;
    content: ContentText | uploadImage[] | { file_url: string }[] | null;
    id: string | null;
    reaction_info?: ReactionInfo;
    is_read: boolean;
    read_count: number;
    source_language_code?: string;
  }

  interface ReactionInfo {
    count: number;
    reactions: Array<ReactionItem>;
  }

  interface ReactionItem {
    user_info: {
      uuid: string;
      icon: string;
      name: string;
    };
    reaction_uuid: string;
  }

  interface PostUser {
    uuid: string;
    icon: string;
    name: string;
    organization: string | null;
  }
  interface MessageRoomAll {
    messages: Array<MessageItem>;
  }

  interface MessageRoom {
    room_uuid: string;
    name: string | null;
    description: string | null;
    room_icon: string | null;
    is_dm: boolean;
    users: { name: string; uuid: string }[];
    created_at: number;
    latest_message_date: number | null;
    latest_message: string | null;
    unread_message_count: number;
  }

  interface MessageRooms {
    data: MessageRoom[];
    meta: Pagination;
  }

  interface MessageText {}

  interface MessageRoger {}

  interface Messages {}

  interface PresignedPost {
    form_attributes: {
      action: string;
      method: string;
      enctype: string;
    };
    form_inputs: {
      acl: string;
      key: string;
    };
  }

  interface MentalIsChecked {
    is_checked: boolean;
  }

  interface Reaction {}

  interface uploadImage {
    type?: string;
    thumbnail: string;
    main_image: string;
  }

  interface uploadFile {
    file_url: string;
  }

  interface Files {
    files: File[];
  }

  interface File {
    type: string;
    name: string;
    path?: string;
    updated_at: number | null;
  }
  interface PreviewFile {
    current_path: string;
    name: string;
  }
  interface PreviewUrl {
    url: string;
  }
  interface Users {
    users: Array<User>;
  }

  interface Employees {
    users: Array<Employee>;
  }

  interface Rooms {
    room_uuid: string;
  }

  interface RoomExit {}

  interface ReactionIcon {
    reactions_uuid: string;
    content: string;
    order: number;
  }

  interface Pagination {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  }

  interface ImageUrl {
    url: string;
  }

  /* BEGIN posts */
  interface NewsPosts {
    posts: NewsPost[];
  }

  interface NewsPost {
    uuid: string;
    date: number;
    type: string;
    title: string;
    content: string;
    thumbnail: string;
    images: ImageUrl[];
    videos: string[];
    like_count: number;
    is_read: boolean;
    is_liked: boolean;
    is_favorite: boolean;
    user: {
      uuid: string;
      icon: string;
      name: string;
      organization: string | null;
    };
    start_at: number;
    end_at: number;
    event: Event | null;
    questionnaire: Questionnaire | null;
  }

  interface PostEdit {
    uuid: string | null;
    type: PostType;
    organization_uuid: string;
    community_uuid: string;
    title: string;
    content: string;
    is_draft: boolean;
    add_image_urls: string[];
    add_video_urls: string[];
    template: PostTemplate;
    relational_post_uuid: string | null;
    awardee_user_uuid: string | null;
    awardee_user_comment: string | null;
    awardee: any;
    permission: Permission | null;
    publish_setting: PostCreatePublishSetting | null;
    event: PostCreateEvent | null;
    questionnaire: PostCreateQuestionnaire | null;
    interview: PostCreateInterview | null;
    interview_room_users?: any;
  }

  type PostType =
    | 'my-episode'
    | 'internal-communication'
    | 'department-news'
    | 'community-news';

  type Permission = 'member' | 'associate_member' | 'guest';

  type PostTemplate = 'none' | 'interview' | 'pickup' | 'thankyou';

  interface PostCreatePublishSetting {
    users: string[];
    start_at: number | null;
    end_at: number | null;
    is_important: boolean;
  }

  interface PostCreateEvent {
    place: string | null;
    start_at: number | null;
    end_at: number | null;
    expire_at: number | null;
    is_required_answer: boolean;
    users: string[];
  }

  interface PostCreateQuestionnaireItem {
    content: string;
    add_image_url: string | null;
  }

  interface PostCreateQuestionnaire {
    items: PostCreateQuestionnaireItem[];
    organization_uuid: string | null;
    expire_at: number | null;
    is_disclosed_answerers: boolean;
  }

  interface PostCreateInterview {
    interviewees: string[];
    contents: InterviewContent[];
  }

  interface InterviewContent {
    content_type: 'comment' | 'heading';
    body: string;
    interviewee?: Interviewee;
    comment_position?: 'left' | 'right';
  }

  interface Post {
    uuid: string;
    date: number;
    type: string;
    permission?: string;
    title: string;
    content: string;
    template: 'none' | 'interview' | 'pickup' | 'thankyou' | null;
    thumbnail: string;
    images: string[];
    videos: string[];
    like_count: number;
    comment_count: number;
    is_read: boolean;
    is_liked: boolean;
    is_favorite: boolean;
    user: PostUser;
    awardee: Awardee | null;
    publish_setting: PublishSetting | null;
    event: Event | null;
    questionnaire: Questionnaire | null;
    interview: Interview | null;
  }

  interface InternalTargetUser {
    uuid?: string;
    target_users: string[];
  }

  interface Event {
    uuid: string;
    place: string;
    start_at: number | null;
    end_at: number | null;
    expire_at: number;
    relation_post_count: number;
    invitation_count: number;
    participation_count: number;
    non_participation_count: number;
    undecided_count: number;
    unanswered_count: number;
    answer: string;
    is_required_answer: boolean;
    is_invitation: boolean;
    participation_users: EventUser[];
    invitation_users: EventUser[];
  }

  interface EventUser {
    uuid: string;
    name: string;
    icon: string;
  }

  interface PublishSetting {
    users: string[];
    start_at: number | null;
    end_at: number | null;
    is_important: boolean;
  }

  interface Questionnaire {
    uuid: string;
    can_answer: boolean;
    vote_count: number;
    expire_at: number | null;
    vote: Vote;
    items: QuestionnaireItem[];
  }

  interface Vote {
    uuid: string;
    content: string;
    vote_at: number;
  }

  interface QuestionnaireItem {
    uuid: string;
    content: string;
    image: string | null;
    vote_count: number;
    users: { uuid: string; icon: string }[];
  }

  interface Interview {
    interviewees: Interviewee[];
    contents: InterviewContent[];
  }

  interface InterviewContent {
    content_type: 'comment' | 'heading';
    body: string;
    interviewee?: Interviewee;
    comment_position?: 'left' | 'right';
    user_icon?: string;
    user_name?: string;
  }

  interface Interviewee {
    uuid: string;
    name: string;
    email: string;
    user_icon: string;
    company_uuid: string;
    company_name: string;
    organization_uuid: string;
    organization_name: string;
    position_text: string;
    enrollment_text: string;
    enrollment_color: string;
    joined_year: number;
    joined_month: number;
  }

  interface Awardee {
    uuid: string;
    name: string;
    email: string;
    user_icon: string;
    company_uuid: string;
    company_name: string;
    organization_uuid: string;
    organization_name: string;
    position_text: string;
    enrollment_text: string;
    enrollment_color: string;
    joined_year: number;
    joined_month: number;
  }

  interface Organization {
    uuid: string;
    name: string;
    kana: string;
    type: string;
    layer: number;
    pos: number;
    is_favorite: boolean;
    images: OrganizationImage[];
    main_image: string;
    logo_image: string;
    leader: Leader;
    detail: Detail;
    subordinated_organization_user_count: {
      free: number;
      man: null;
      woman: number;
      all: null;
    };
  }

  interface OrganizationImage {
    uuid: string;
    url: string;
  }

  interface Leader {
    name: string;
    message: string;
    user_icon: string;
    position_name: string;
  }

  interface Detail {
    url: string;
    establish_date: number;
    tel: string;
    histories: History[];
  }

  interface History {
    title: string;
    content: string;
    date: number;
    uuid: string;
  }

  interface OrganizationData {
    age_count: DataCount[];
    birth_place_city_count: Array<any>;
    blood_type_count: CountPercent[];
    gender_count: CountPercent[];
    humanities_or_science_count: CountPercent[];
    joined_year_count: DataCount[];
    new_graduate_or_mid_career_count: CountPercent[];
    organization_name: string;
    organization_uuid: string;
    prefecture_count: PrefectureCount;
  }

  interface PrefectureCount {
    chubu: CountPercent;
    chugoku: CountPercent;
    foreign_countries: CountPercent;
    hokkaido: CountPercent;
    kanto: CountPercent;
    kinki: CountPercent;
    kyushu: CountPercent;
    shikoku: CountPercent;
    tohoku: CountPercent;
  }

  interface CountPercent {
    count: number;
    name: string;
    percent: number;
  }

  interface DataCount {
    count: number;
    name: string;
  }
  interface CompanyQuestionsItem {
    blood_type?: string | null;
    humanities_or_science?: string | null;
    new_graduate_or_mid_career?: string | null;
    prefectures_where_lived?: string | null;
  }
  interface MyEpisode {
    posts: Post[];
  }
  interface QuestionAndAnswers {
    company_questions: CompanyQuestionsItem;
    qa_free_questions: QuestionnaireItem[];
  }

  interface ProfileQuestionAndAnswers {
    company_questions: CompanyQuestionsItem;
    job_types: Job[];
    qa_free_questions: ProfileQuestionnaireItem[];
  }

  interface ProfileQuestionnaireItem {
    uuid: string;
    content: string;
    answer: QuestionnaireAnswer;
  }

  interface QuestionnaireAnswer {
    uuid: string;
    content: string | null;
  }

  interface Comments {
    comments: Comment[];
    total_count: number;
  }

  interface Comment {
    uuid: string;
    post_uuid: string;
    date: number;
    content: string;
    user_uuid: string;
    user_name: string;
    user_icon: string;
    like_count: number;
    is_liked: boolean;
    replies: CommentReply[];
  }

  interface CommentReply {
    uuid: string;
    comment_uuid: string;
    date: number;
    content: string;
    user_uuid: string;
    user_name: string;
    user_icon: string;
    like_count: number;
    is_liked: boolean;
  }

  interface PostTheme {
    title: string;
    example: string;
    end_date?: number;
  }

  interface PostRule {
    min_word_count: number;
    min_photo_count: number;
  }

  interface PostRules {
    my_episode: PostRule;
    team_episode: PostRule;
    community_team_episode: PostRule;
  }
  interface Job {
    uuid: string;
    name: string;
  }
  interface QuestionnaireItem {
    uuid: string;
    content: string;
    image: string | null;
    vote_count: number;
    users: { uuid: string; icon: string }[];
  }

  interface JobTypes {
    job_types: Job[];
  }

  interface Profile {
    uuid: string;
    name: string;
    user_icon: string;
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
    jobs: Job[];
    main_job: Job | null;
    main_organization: ProfileOrganization | null;
    sub_organizations: ProfileOrganization[];
    profile_free_questions: profileFreeQuestions[];
    main_language: string;
    sub_languages: string[];
  }

  interface ProfileOrganization {
    uuid: string;
    name: string;
  }
  interface UserProfile {
    uuid: string;
    name: string;
    user_icon: string;
    gender: string;
    birthday: number;
    tel: string;
    company_tel: string;
    internal_tel: string;
    joined_year: number;
    birthplace_city: string;
    joined_month: string;
    main_job: Job | null;
    profile_free_questions: profileFreeQuestions[];
    assignment_histories: assignmentHistories[];
  }
  interface profileFreeQuestions {
    uuid: string;
    content: string;
    answer: {
      uuid: string;
      content: string | null;
    }[];
  }
  interface assignmentHistories {
    uuid: string;
    joined_year: number;
    joined_month: number;
    company_name: string;
    organization_name: string;
    note: string;
  }

  interface MemberList {
    companies: MemberListCompany[];
  }

  interface MemberListCompany {
    uuid: string;
    name: string;
    users: CompanyUser[];
  }

  interface CompanyUser {
    uuid: string;
    name: string;
    icon: string;
    organization_uuid: string;
    organization_name: string;
    answer: string;
  }

  interface EnrollmentStatus {
    color1: Color;
    color2: Color;
    color3: Color;
    color4: Color;
    color5: Color;
    color6: Color;
    color7: Color;
    color8: Color;
    color9: Color;
    color10: Color;
  }

  interface Color {
    name: string;
    color_code: string;
  }

  interface Organizations {
    organizations: Organization[];
  }

  interface Organization {
    uuid: string;
    name: string;
    kana: string;
    type: string;
    pos: number;
    layer: number;
    is_favorite: boolean;
    main_image: string;
    logo_image: string;
    relations: {
      company: string;
      parent: string;
    };
    subordinated_organization_count: number;
    subordinated_organization_user_count: {
      free: number;
      man: null;
      woman: number;
      all: null;
    };
    subordinated_organization_users: {
      uuid: string;
      icon: string;
      name: string;
      organization_uuid?: string;
      priority?: string;
    }[];
  }

  interface OrganizationGroups {
    organization_groups: OrganizationGroup[];
  }
  interface OrganizationGroup {
    uuid: string;
    name: string;
    organizations: Organization[];
  }

  interface MyOrganizations {
    organizations: MyOrganization[];
  }

  interface MyOrganization {
    uuid: string;
    name: string;
    parent_name: string | null;
  }

  /* END posts */

  interface Community {
    uuid: string;
    name: string;
    thumbnail: string | null;
    description: string | null;
    is_official: boolean;
    is_favorite: boolean;
    type: AppTypes.CommunityType;
    establish_date: number | null;
    leader_user_name: string | null;
    member_count: MemberCount;
    latest_community_news: LatestCommunityNews | null;
  }

  interface Communities {
    data: Community[];
    meta: Pagination;
  }

  interface MyCommunities {
    communities: Community[];
  }

  interface LatestCommunityNews {
    uuid: string;
    date: number;
    title: string;
    thumbnail: string;
  }

  interface CommunityDetail {
    uuid: string;
    name: string;
    kana: string;
    type: AppTypes.CommunityType;
    description: string;
    thumbnail: string | null;
    leader_user_name: string | null;
    leader_user_organization: string;
    member_count: MemberCount;
    created_at: number;
    status: AppTypes.CommunityStatus;
    companies: [
      {
        uuid: string;
        name: string;
        users: [
          {
            name: string;
            uuid: string;
            organization_name: string;
            organization_uuid: string;
            organization_position: string;
            is_representative: boolean;
          }
        ];
      }
    ];
    is_official: boolean;
    is_favorite: boolean;
  }

  interface MemberCount {
    all: number;
    man: number;
    woman: number;
    free: number;
  }

  interface UuidOnly {
    uuid: string;
  }

  interface DailyReports {
    daily_reports: DailyReport[];
    not_submitted_daily_reports: NotSubmittedDailyReport[];
  }

  interface DailyReport {
    uuid: string;
    title: string;
    read_type: ReadType;
    posted_at: number;
    user: DailyReportsUser;
  }

  interface NotSubmittedDailyReport {
    uuid: string;
    title: string;
    read_type: ReadType;
    submission_date: number;
    user: DailyReportsUser;
  }

  type ReadType = 'main' | 'sub';

  interface DailyReportsSettings {
    target_settings: DailyReportSettingItem[];
    read_only_main_settings: DailyReportSettingItem[];
    read_only_sub_settings: DailyReportSettingItem[];
  }

  interface DailyReportsRequired {
    daily_report_settings: DailyReportRequired[];
  }

  interface DailyReportRequired {
    uuid: string;
    title: string;
    target_user_count: number;
    main_read_user_count: number;
    sub_read_user_count: number;
    created_at: number;
    expire_time: string;
    frequency: string[];
    start_date: number;
    end_date: number;
    is_alert_required: boolean;
  }

  interface DailyReportSettings {
    target_settings: DailyReportSettingItem[];
    read_only_main_settings: DailyReportSettingItem[];
    read_only_sub_settings: DailyReportSettingItem[];
  }

  interface DailyReportSettingItem {
    uuid: string;
    title: string;
    is_achievement_rate_required: boolean;
    format_items: FormatItem[];
  }

  interface DraftDailyReports {
    draft_daily_reports: DraftDailyReport[];
  }

  interface DailyReportDetail {
    uuid: string;
    title: string;
    daily_report_setting_uuid: string;
    posted_at: number;
    user: DailyReportsUser;
    achievement_rate: number;
    items: DailyReportItem[];
  }

  interface DailyReportsUser {
    uuid: string;
    name: string;
    icon: string;
    organization_uuid: string;
    organization_name: string;
  }

  interface DailyReportItem {
    uuid: string;
    name: string;
    content: string;
  }

  interface DraftDailyReport {
    uuid: string;
    title: string;
    drafted_at: number;
  }

  interface FormatItem {
    uuid: string;
    name: string;
  }

  interface DailyReportDetailFormat {
    uuid: string;
    name: string;
    is_achievement_rate_required: boolean;
    items: FormatItem[];
  }

  interface DailyReportSettingsDetail {
    uuid: string;
    title: string;
    target_users: DailyReportsUser[];
    created_at: number;
    expire_time: string; // HH:MM:SS
    start_date: number;
    end_date: number;
    frequency: string[];
    is_alert_required: boolean;
    format: FormatItem[];
  }

  interface DailyReportFormats {
    daily_report_formats: DailyReportFormat[];
  }

  interface DailyReportFormat {
    uuid: string;
    name: string;
  }

  interface DailyReportSetting {
    uuid: string;
    title: string;
    target_users: DailyReportsUser[];
    main_read_users: DailyReportsUser[];
    sub_read_users: DailyReportsUser[];
    created_at: number;
    expire_time: string; // HH:mm:SS
    start_date: number;
    end_date: number;
    frequency: string[];
    interval_days: number | null;
    is_alert_required: boolean;
    format: FormatItem;
  }

  interface DailyReportSettingFromatItems {
    daily_report_format_items: FormatItem[];
  }

  interface CommunityMember {
    uuid: string;
    name: string;
    icon_url: string;
    organization_uuid: string;
    organization_name: string;
  }
  interface CommunityMembers {
    companies: CommunityCompany[];
  }

  interface CommunityCompany {
    uuid: string;
    name: string;
    users: CommunityMember[];
  }

  type RoomUser = {
    name: string;
    uuid: string;
    user_icon: string;
  };

  interface UserTasks {
    data: UserTask[];
    meta: Pagination;
  }

  interface UserTask {
    uuid: string;
    is_read: boolean;
    content: string;
    app_url: string;
    web_url: string;
    action_type: string;
    created_at: number;
  }

  interface UserNotifications {
    data: UserNotice[];
    meta: Pagination;
  }

  interface UserNotice {
    uuid: string;
    is_read: boolean;
    content: string;
    app_url: string;
    web_url: string;
    type: string;
    action_type: string;
    created_at: number;
  }

  interface PopupMultiContent {
    single: string;
    multiple: {
      content: string;
    };
  }

  interface UserPopup {
    uuid: string;
    prefix: string;
    date: string;
    content: string | PopupMultiContent;
    popup_type: string;
    items: UserPopup[];
  }

  interface AdditionalFunctionStatuses {
    bulletin_board: boolean;
    motivation: boolean;
    messenger: boolean;
  }

  interface Activity {
    total_posts: number;
    department_news_posts: number;
    total_likes: number;
    favorite_posts: number;
    favorite_departments: number;
    draft_posts: number;
    join_communities: number;
  }

  interface UserActivities {
    activities: Activity;
  }

  interface Language {
    code: string;
    name: string;
    is_other: number;
  }

  interface UserInterview {
    interview_uuid: string;
    comment_position: string; // left | right
  }

  interface CreateRoomInteview {
    interviewees: UserInterview[];
  }

  interface CreateRoomResponse {
    room_url: string;
  }

  interface MessagesInterview {
    id: number;
    room_id: number;
    interviewee_id: number;
    message: any; // {ja:'message'}
    souce_language_code: string;
    content_type: string;
    comment_position: string;
    created_at: any;
    updated_at: any;
    interviewee: Interviewee;
  }

  interface RoomInteviewResponse {
    messages: MessagesInterview[];
    user_infos: any;
    user_positions?: any;
  }

  interface CreateMessageInteview {
    message: string;
    room_id: number;
    content_type: string;
    comment_position: string;
    interview_uuid?: string;
  }

  interface CreateMessageResponse {
    body: any;
  }

  interface EditMessageInteview {
    message: string;
    content_type: string;
  }

  interface EditMessageInteviewResponse {
    body: any;
  }
}
