declare module ApiRequest {
  interface Login {
    email: string;
    password: string;
  }

  interface ResetPassword {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
  }

  interface CreateOwner {
    name: string;
    representative_name: string;
    postal_code: string;
    address1: string;
    address2?: string;
    tel: string;
    size: string;
    contract_plan?: {
      uuid: string;
      products: {
        uuid: string;
        quantity: number;
      }[];
    };
    stripe_credit_card_token: string;
  }

  type UpdateOwner = Omit<
    CreateOwner,
    'contract_plan_uuid' | 'stripe_credit_card_token'
  > & {
    logo_file_uuid?: string;
  };

  interface CreateOrganization {
    name: string;
    kana: string;
    type: string | null;
    parent_uuid?: string;
    pos: number;
  }

  interface CreateChild {
    name: string;
    type: string;
    parent_uuid?: string;
  }

  interface UpdateOrganization {
    name: string;
    kana: string;
    type: string;
    parent_uuid?: string;
    pos: number;
  }

  interface Image {
    uuid: string | null;
    url: string;
  }

  interface DeleteOrganization {
    uuid: string;
  }

  interface CreateOrganizationGroup {
    name: string;
  }

  interface DeleteOrganizationGroups {
    organization_group_uuids: string[];
  }

  interface DeleteOrganizationFromOrganizationGroups {
    organization_groups: DeleteOrganizationFromOrganizationGroup[];
  }

  interface DeleteOrganizationFromOrganizationGroup {
    organization_uuids: string[];
  }

  interface OrganizationGroup {
    uuid: string;
    organization_uuids: string[];
  }

  interface OrganizationGroups {
    organization_groups: OrganizationGroup[];
  }

  interface CreateHistory {
    content: string;
    date: number;
  }

  interface UpdateHistory {
    title: string;
    content: string;
    date: number;
  }

  interface UpdateHistory {
    title: string;
    content: string;
    date: number;
  }

  interface OrganizationDataConfig {
    age: boolean;
    birth_place: boolean;
    blood_type: boolean;
    gender: boolean;
    humanities_or_science: boolean;
    joined_year: boolean;
    new_graduate_or_mid_career: boolean;
    prefectures_where_lived: boolean;
  }

  // 組織詳細更新（会社・部署・支店・店舗）
  interface UpdateOrganizationProfile {
    name: string;
    kana: string;
    description?: string;
    leader_uuid?: string;
    message?: string;
    establish_date?: number;
    address?: string;
    tel?: string;
    homepage?: string;
    main_image_uuid?: string;
    logo_image_url?: string;
    add_image_urls?: AddImageUrl[];
    delete_image_uuids?: string[];
  }

  interface AddImageUrl {
    url: string;
    is_main: boolean;
  }

  interface Workflow {
    uuid: string;
    starting_time: string;
    title: string;
    content: string;
  }

  interface NewCommunity {
    name: string;
    kana: string;
    type: string;
    is_official: boolean;
  }

  type CommunityUser = string;

  type CommunityUsers = {
    users: CommunityUser[];
  };

  type InternaleCommunicationSendRemindToEmail = {
    internal_communication_uuid: string;
    users: RemindUsers[];
  };
  type RemindUsers = {
    name: string;
    uuid: string;
    email: string;
  };

  // 運営管理者ログイン
  interface AdminLogin {
    email: string;
    password: string;
  }
  interface Notice {
    title?: string;
    message?: string;
    type: string;
    is_draft?: number;
  }
  interface UpdateCommunity {
    name: string;
    kana: string;
    type: string;
    is_official: boolean;
    description: string;
    owner_uuid: string;
    message: string;
    establish_date: number;
    start_date: number;
    end_date: number;
    community_team_episode: Interval;
    publish_organizations: string[];
    main_image_uuid: string;
    add_image_urls: AddImageUrl[];
    delete_image_uuids: string[];
  }

  interface JobTypes {
    job_types: string[];
  }

  interface MasterProfile {
    free_input_question: FreeInputQuestion[];
    company_configs: {
      uuid: string;
      blood_type: boolean;
      humanities_or_science: boolean;
      new_graduate_or_mid_career: boolean;
      prefectures_where_lived: boolean;
    };
    questions: Types.Question[];
    questionsDeleteUuids?: string[];
  }

  interface FreeInputQuestion {
    uuid: string;
    question_uuid: string;
  }

  interface EnrollmentStatuses {
    color1: string;
    color2: string;
    color3: string;
    color4: string;
    color5: string;
    color6: string;
    color7: string;
    color8: string;
    color9: string;
    color10: string;
  }

  interface InternalCommunicationQuery {
    page: number;
    orders?: string;
    limit?: number;
    company_organization_uuid?: string | null;
    department_organization_uuid?: string | null;
    user_uuid?: string | null;
    start_date?: number | null;
    end_date?: number | null;
    word?: string | null;
  }

  type Interval = 'normal' | 'slowly' | 'frequent' | 'none';
  type AlertLevel = 'normal' | 'strong' | 'weak';
  type MemberProfile = {
    name: string;
    user_icon: string;
    gender: string | null;
    birthday: string | null;
    published_birthday: boolean;
    birthplace_country: string | null;
    birthplace_prefecture: string | null;
    birthplace_city: string | null;
    tel: string;
    company_tel: string;
    internal_tel: string;
    joined_year: number | null;
    joined_month: number | null;
    sub_organizations: string[];
    profile_free_questions: {
      uuid: string;
      answer: string;
    }[];
    sub_languages?: string[];
    language?: string;
  };

  type AssignmentHistory = {
    joined_year: number | null;
    joined_month: number | null;
    company_name: string;
    organization_name: string;
    note: string;
  };

  interface OrganizationRule {
    uuid: string;
    my_episode: Interval;
    team_episode: Interval;
    profile: Interval;
    alert: AlertLevel;
  }

  interface OrganizationRules {
    rules: OrganizationRule[];
  }
  interface OrganizationUserRules {
    rules: OrganizationRule;
  }

  interface CommunityRule {
    uuid: string;
    community_team_episode: Interval;
  }

  interface CommunityRules {
    rules: CommunityRule[];
  }
  interface CommunityUserRules {
    rules: CommunityRule;
  }

  interface ConfigRules {
    my_episode: PostRule;
    team_episode: PostRule;
    community_team_episode: PostRule;
    profile: PostRule;
    alert: Alert;
  }

  interface OwnerRule {
    community_team_episode: Interval;
  }

  interface PostRule {
    slowly: string;
    normal: string;
    frequent: string;
    min_word_count?: number;
    min_photo_count?: number;
    inspection_rights?: string;
  }

  interface Alert {
    weak: string;
    normal: string;
    strong: string;
  }

  interface UpdateOrganizationPostTheme {
    title: string;
    sample_text: string;
    difficulty_level: number;
    start_date: number;
    end_date: number;
    master_post_theme_uuid: string;
  }

  interface CreateOrganizationPostTheme {
    master_post_theme_uuid: string;
    title: string;
    sample_text: string;
    difficulty_level: number;
    start_date: number;
    end_date: number;
  }

  interface EmploymentStatus {
    name: string;
  }

  interface Position {
    name: string;
  }

  interface JobType {
    name: string;
  }

  interface Language {
    code: string;
    name: string;
    is_other?: boolean;
  }

  interface PostUser {
    name: string;
    name_kana: string;
    organization: string;
    employment_position: string;
    employment_status: string;
    company_tel?: string;
    internal_tel?: string;
    joined_year?: number;
    joined_month?: number;
    sub_organizations: string[];
    enrollment_status: string;
    access_permission: string;
    is_registered_additional?: boolean;
    language: string;
    sub_languages?: string[];
    authorities?: Types.UserAuthority[];
  }

  interface Email {
    email: string;
  }

  interface UpdateEmail {
    email: string;
    email_confirmation: string;
  }

  interface UpdateSubOrganizations {
    sub_organizations: string[];
  }

  interface UpdatePassword {
    password: string;
    password_confirmation: string;
  }

  interface PostMember {
    users: string[];
    organization?: string;
    employment_position_uuid?: string;
    employment_status_uuid?: string;
    authority?: string;
    my_episode?: string;
    enrollment_statuses?: string;
    community?: string | undefined;
    used_smartphone?: string;
    gender?: string;
    access_permission?: string;
    is_active?: string;
  }

  interface OrganizationUsersParams {
    limit?: number;
    offset?: number;
    name?: string;
    organization?: string;
    position?: string;
    status?: string;
    my_episode?: string;
    is_active?: string;
    community?: string;
    gender?: string;
    enrollment_statuses?: string;
    used_smartphone?: string;
  }

  interface UserQa {
    company_questions?: CompanyQuestions;
    birthplace_country: string;
    birthplace_prefecture: string;
    birthplace_city: string;
    job_types?: string[];
    qa_free_questions?: QaFreeQuestions[];
  }

  interface CompanyQuestions {
    blood_type?: string | null;
    humanities_or_science?: string | null;
    new_graduate_or_mid_career?: string | null;
  }

  interface QaFreeQuestions {
    uuid: string;
    answer: string | null;
  }

  interface PostTheme {
    title?: string;
    description?: string;
    sample_text?: string;
    difficulty_level?: number;
    is_public?: number;
  }

  interface AdminContractCompanyParams {
    limit?: number;
    page?: number;
    name?: string;
    contract_plan?: string;
    status?: string;
    orders?: string;
  }

  interface AdminContractPlan {
    name?: string;
    monthly_fee?: number;
    description?: string;
    max_members?: number;
    max_storage?: number;
    free_memo?: string;
  }

  interface PaymentHistoryParams {
    page?: number;
  }

  interface TempRegistrationUsers {
    name?: string;
    name_kana?: string;
    company?: string;
    organization?: string;
    sub_organizations?: string[];
    employment_position?: string;
    employment_status?: string;
    access_permission?: string;
    email?: string;
  }

  interface MoveTempRegistrationUsersToUsers {
    temp_users: [{ uuid: string }];
  }

  interface UserParams {
    is_registered_additional: boolean;
  }

  interface CurrentPath {
    current_path: string;
  }

  interface SearchFile {
    current_path: string;
    search_word: string;
  }

  interface DownloadFile {
    current_path: string;
    name: string;
  }

  interface UploadFile {
    current_path: string;
    file: any;
  }

  interface DeleteFile {
    current_path: string;
    name: string;
  }

  interface PutFileName {
    current_path: string;
    destination_name: string;
    source_name: string;
  }

  interface MoveFile {
    current_path: string;
    destination_name: string;
    files: File[];
  }

  interface File {
    name: string;
  }

  interface MoveDirectory {
    source_path: string;
    destination_path: string;
  }

  interface ContactEmailForm {
    company_name: string;
    curator: string;
    email: string;
    content: string;
    type: string;
    is_account_holder: boolean;
    extend_storage: boolean;
  }

  interface RegisterPlanContact {
    company_name: string;
    curator: string;
    representative_name: string;
    email: string;
    size: string;
    address1: string;
    address2: string;
    postal_code: string;
    phone_number: string;
    extend_storage: boolean;
  }

  interface ChangeContracPlan {
    uuid: string;
    products?: {
      uuid: string;
      quantity: number;
    }[];
  }
}
