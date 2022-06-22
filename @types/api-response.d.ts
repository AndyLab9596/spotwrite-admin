declare module ApiResponse {
  interface Pagination {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  }

  interface AccountHolder {
    uuid: string;
    name: string;
    email: string;
    is_account_holder: boolean;
    has_same_account_holder_email: boolean;
    owner: {
      uuid: string;
    } | null;
  }

  interface ContractPlan {
    uuid: string;
    name: string;
    content_data: string;
    free_memo?: string;
    is_recommended: boolean;
    type?: string;
    products?: {
      uuid: string;
      quantity: number;
    }[];
    total_price?: number;
    storage_add?: number;
    member_add?: number;
  }

  interface ContractPlanPrice {
    uuid: string;
    monthly_price: number;
    max_member: number;
    max_storage: number;
    type: string;
    stripe_price_id: string;
    is_special: boolean;
  }

  interface CreditCard {
    id: string;
    brand: string;
    exp_year: number;
    exp_month: number;
    last4: string;
    name: string;
  }

  /**
   * プラン変更リクエスト
   * plan: リクエストされた
   * changed_at: 更新日時
   */
  type ContractPlanChangeRequest = {
    plan: ContractPlan;
    change_at: number;
  };

  type ContractPlanUpgradingStatusBody = {
    plan: {
      name: string;
      max_member: number;
      max_storage: number;
      storage_add?: number;
      type: string;
    };
    change_at: number;
  };

  type ContractPlanUpgradingStatus = {
    upgrading: ContractPlanUpgradingStatusBody;
  };

  type ContractPlanDowngradingStatusBody = {
    plan: {
      name: string;
      max_member: number;
      max_storage: number;
      storage_add?: number;
      type: string;
    };
    change_at: number;
    can_downgrade: boolean;
    over: {
      member?: number;
      storage?: number;
    };
  };

  type ContractPlanDowngradingStatus = {
    downgrading: ContractPlanDowngradingStatusBody;
  };

  /**
   * アップグレードかダウングレードかどちらか一方
   */
  type ContractStatus =
    | ContractPlanUpgradingStatus
    | ContractPlanDowngradingStatus;

  type PaymentMethod = 'card';

  type PaymentStatus =
    | 'paid' // 支払い済み
    | 'draft' // 次回の請求
    | 'open' // 支払い待ち
    | 'uncollectible' // 回収不能な不良債権
    | 'void'; // キャンセル済み

  interface PaymentHistory {
    id: string;
    amount: number;
    payment_date: number;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
    plan_name: string;
  }

  interface PaymentHistories {
    data: PaymentHistory[];
    meta: Pagination;
  }

  type SubscriptionStatus =
    | 'trialing' // トライアル
    | 'active' // 正常
    | 'incomplete' // 作成時に失敗
    | 'incomplete_expired' // 作成時に失敗し期限切れ
    | 'past_due' // 最新のインボイスの支払いが失敗
    | 'canceled' // キャンセル
    | 'unpaid' // 最新のインボイス未支払いだが、サブスクリプションは有効
    | 'stopped'; // 使用をやめる

  interface CurrentSubscription {
    status: SubscriptionStatus;
    end_at: number;
  }

  interface OwnerFile {
    uuid: string;
    url: string;
  }
  interface Owner {
    uuid: string;
    stripe_customer_id: string;
    name: string;
    representative_name: string;
    postal_code: string;
    address1: string;
    address2?: string;
    tel: string;
    size: string;
    logo?: OwnerFile;
  }

  interface ImageUrl {
    url: string;
  }

  interface NoContent {}

  interface Credentials {
    access_token: string;
    token_type: string;
    expires_in: number;
  }

  interface MyOrganizations {
    organizations: MyOrganization[];
  }

  interface MyOrganization {
    uuid: string;
    name: string;
    parent_name: string | null;
  }

  interface Organization {
    uuid: string;
    name: string;
    kana: string;
    layer: number;
    type: string;
    status: string;
    user_count: number;
    detail: Detail;
    leader: Leader | null;
    relations: {
      company?: string;
      parent?: string;
    };
    latest_access_date: number;
    pos: number;
    is_favorite?: boolean;
    main_image?: string;
    logo_image?: string;
    subordinated_organization_count?: number;
    subordinated_organization_user_count?: {
      free: number;
      man: null;
      woman: number;
      all: null;
    };
    subordinated_organization_users?: {
      uuid: string;
      icon: string;
      name: string;
    }[];
    organization_registered?: boolean;
  }

  interface OrganizationData {
    age_count: DataCount[];
    birth_place_city_count: Array<any>;
    blood_type_count: CountPercent[];
    gender_count: CountPercent[];
    humanities_or_science_count: CountPercent[];
    joined_year_count: DataCount[];
    new_graduate_or_mid_career_count: CountPercent[];
    organization_name: String;
    organization_uuid: String;
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
    count: Number;
    name: String;
    percent: Number;
  }

  interface DataCount {
    count: Number;
    name: String;
  }

  interface Leader {
    uuid: string;
    name: string;
    message: string;
  }

  interface Detail {
    images: Image[];
    main_image: Image;
    logo_image: Image;
    establish_date?: number;
    tel: string;
    url?: string;
    description?: string;
    address?: string;
    histories?: History[];
  }

  interface Image {
    uuid: string | null;
    url: string;
  }

  interface Organizations {
    organizations: Organization[];
  }

  interface Group {
    uuid: string;
    name: string;
  }

  interface GroupOrganization extends Organization {
    groups: Group[];
  }

  interface GroupOrganizations {
    organizations: GroupOrganization[];
  }

  interface OrganizationGroup {
    uuid: string;
    name: string;
    organizations: Organization[];
  }

  interface OrganizationGroups {
    organization_groups: OrganizationGroup[];
  }

  interface OrganizationUsers {
    users: UsersInformation[];
    total_count: number;
    offset: number;
    limit: number;
  }

  interface UsersInformation {
    organization_uuid: string;
    organization_name: string;
    sub_organizations: string[];
    user_uuid: string;
    user_name: string;
    user_kana: string;
    priority: string;
    employment_status_uuid: string;
    employment_status_name: string;
    employment_status_order_number: number;
    employment_position_uuid: string;
    employment_position_name: string;
    employment_position_order_number: number;
    status: string;
    my_episode?: string;
    email: string;
    communities: Community[] | undefined;
    is_active: boolean | string;
    is_sent: boolean;
    joined_year: number;
    joined_month: number;
    enrollment_status: string;
    last_accessed_at: number;
    is_using_smartphone: boolean | string;
    birthday: string;
    gender: string;
    access_permission: string;
    number: number;
  }

  interface History extends Types.History {}

  interface Histories {
    histories: History[];
  }

  interface Workflow {
    uuid: string;
    starting_time: string;
    title: string;
    content: string;
  }

  interface Workflows {
    workflows: Workflow[];
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

  interface User {
    uuid: string;
    name: string;
    name_kana: string;
    company: {
      uuid: string;
      name: string;
    };
    organization: {
      uuid: string;
      name: string;
    };
    sub_organizations: {
      uuid: string;
      name: string;
    }[];
    position: {
      uuid: string;
      name: string;
    };
    status: {
      uuid: string;
      name: string;
    };
    joined_year: number;
    joined_month: number;
    company_tel: string;
    internal_tel: string;
    language: string | null;
    enrollment_color?: string | null;
    enrollment_description?: string | null;
    enrollment_text?: string | null;
    tel?: string | null;
  }

  interface UserInfo {
    uuid: string;
    name: string;
    name_kana: string;
    company: {
      uuid: string;
      name: string;
    };
    organization: {
      uuid: string;
      name: string;
    };
    position: {
      uuid: string;
      name: string;
    };
    status: {
      uuid: string;
      name: string;
    };
  }

  interface CommunityUser {
    uuid: string;
    name: string;
    is_representative: boolean;
    gender: string;
  }

  interface CommunityCompany {
    uuid: string;
    name: string;
    users: CommunityUser[];
  }

  interface Community {
    uuid: string;
    name: string;
    kana: string;
    type: string;
    status: string;
    filled_required: boolean;
    companies: Record<string, CommunityCompany>;
    community_user_count: number;
  }

  interface InternalCommunication {
    uuid: string;
    created_at: number;
    title: string;
    from_user: InternalCommunicationFromUser;
    to_users_count: number;
    read_users_count: number;
  }

  interface InternalCommunicationOrganization {
    uuid: string;
    name: string;
  }

  interface InternalCommunicationFromUser {
    uuid: string;
    name: string;
    organization: InternalCommunicationOrganization;
  }

  interface Communities {
    data: Community[];
    meta: Pagination;
  }

  interface InternalCommunications {
    data: InternalCommunication[];
    meta: Pagination;
  }

  interface InternalCommunicationUser {
    company_name: string;
    company_uuid: number;
    user_name: string;
    user_uuid: string;
    employment_position: string;
    employment_status: string;
    is_read: boolean;
    email?: string;
  }

  interface ConfigStatus {
    bulletin_board: boolean;
    motivation: boolean;
    messenger: boolean;
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

  type CommunityDetail = Community & {
    is_official: boolean;
    description: string;
    user: {
      uuid: string;
      name: string;
    };
    message: string;
    establish_date: number;
    start_date: number;
    end_date: number;
    community_team_episode: Interval;
    publish_organizations: {
      uuid: string;
      name: string;
    }[];
    registeredImages: Types.Image[];
    mainImage: Types.Image | null;
    images: Image[];
    main_image: Image;
    last_news: {
      title: string;
      created_at: string;
    };
  };

  interface Notice {
    uuid: string;
    title: string;
    message: string;
    type: string;
    is_draft: boolean;
    created_at: string;
  }

  interface Notices {
    data: Notice[];
    meta: Pagination;
  }

  interface JobTypeGroups {
    job_type_groups: JobTypeGroup[];
  }

  interface JobTypeGroup {
    name: string;
    job_types: JobType[];
  }

  interface JobType extends Types.JobType {}

  interface MasterProfileFreeQuestion {
    uuid: string;
    content: string;
  }

  interface MasterProfileFreeQuestions {
    free_question: MasterProfileFreeQuestion[];
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
    questions: Question[];
    questionsDeleteUuids?: string[];
  }

  interface FreeInputQuestion {
    uuid: string;
    order: number;
    question: string;
    question_uuid: string;
  }

  interface Question extends Types.Question {}

  interface EnrollmentStatuses {
    color1: EnrollmentColor;
    color2: EnrollmentColor;
    color3: EnrollmentColor;
    color4: EnrollmentColor;
    color5: EnrollmentColor;
    color6: EnrollmentColor;
    color7: EnrollmentColor;
    color8: EnrollmentColor;
    color9: EnrollmentColor;
    color10: EnrollmentColor;
  }

  interface EnrollmentColor {
    name: string;
    color_code: string;
  }

  interface MasterPostThemes {
    post_themes: MasterPostTheme[];
  }

  interface MasterPostTheme {
    uuid: string;
    title: string;
    difficulty_level: number;
    use_count: number;
    pos: number;
    sample_text: string;
  }

  interface PostThemes {
    post_themes: PostTheme[];
  }

  interface PostTheme {
    uuid: string;
    title: string;
    difficulty_level: number;
    use_count: number;
    pos: number;
    sample_text: string;
    master_post_theme_uuid: string;
    start_date: number;
    end_date: number;
  }

  interface OrganizationRules {
    rules: OrganizationRule[];
  }

  interface MyEpisode {
    slowly: string;
    normal: string;
    frequent: string;
  }

  interface ConfigRules {
    my_episode: MyEpisode;
  }

  interface OwnerRule {
    community_team_episode: Interval;
  }

  interface CompanyNotice {
    uuid: string;
    title: string;
    message: string;
    type: string;
    is_draft: boolean;
    created_at: string;
  }

  type Interval = 'normal' | 'slowly' | 'frequent' | 'none';
  type AlertLevel = 'normal' | 'strong' | 'weak';
  type MyEpisodeFrequency = 'three_months' | 'month' | 'week' | 'none' | '';
  type OrganizationRule = {
    uuid: string;
    name: string;
    my_episode: Interval;
    team_episode: Interval;
    profile: Interval;
    alert: AlertLevel;
  };
  type CommunityRule = {
    uuid: string;
    name: string;
    community_team_episode: Interval;
  };

  type MemberProfile = {
    uuid: string;
    name: string;
    user_icon: string;
    gender: string | null;
    birthday: string;
    published_birthday: boolean;
    birthplace_country: string | null;
    birthplace_prefecture: string | null;
    birthplace_city: string | null;
    tel: string;
    company_tel: string;
    internal_tel: string;
    joined_year: number | null;
    joined_month: number | null;
    jobs: {
      uuid: string;
      name: string;
    }[];
    main_job: {
      uuid: string;
      name: string;
    } | null;
    main_organization: {
      uuid: string;
      name: string;
    } | null;
    sub_organizations: {
      uuid: string;
      name: string;
    }[];
    profile_free_questions: Types.ProfileFreeQuestion[];
  };

  type AssignmentHistories = {
    assignment_histories: Types.AssignmentHistory[];
  };

  interface OrganizationRules {
    rules: OrganizationRule[];
  }
  interface CommunityRules {
    rules: CommunityRule[];
    limit?: number;
    offset?: number;
    total_count?: number;
  }

  interface ConfigRules {
    // @ts-ignore
    my_episode: PostRule;
    team_episode: PostRule;
    community_team_episode: PostRule;
    profile: PostRule;
    alert: Alert;
  }

  interface PostRule {
    slowly: MyEpisodeFrequency;
    normal: MyEpisodeFrequency;
    frequent: MyEpisodeFrequency;
    min_word_count?: number;
    min_photo_count?: number;
    inspection_rights?: string;
  }

  interface Alert {
    weak: string;
    normal: string;
    strong: string;
  }

  interface EmploymentStatus {
    uuid: string;
    name: string;
    display_name: string;
    is_deletable: boolean;
    order_number: number;
    is_master: boolean;
    is_default: boolean;
  }

  interface Position {
    uuid: string;
    name: string;
    is_deletable?: boolean;
    order_number: number;
    is_master: boolean;
    is_default: boolean;
  }

  interface Jobtype {
    uuid: string;
    name: string;
    is_deletable?: boolean;
  }

  interface Language {
    code: string;
    name: string;
  }

  interface fetchUser {
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
    email: string;
    language?: string;
    sub_languages?: string[];
    authorities?: Types.UserAuthority[];
  }

  interface MentalCheckTotal {
    excellent: number;
    very_good: number;
    good: number;
    average: number;
    poor: number;
  }

  interface MentalCheckOrganizations {
    company: string;
    parent: string;
    children: string;
  }

  interface MentalCheckTotalCompany {
    total: MentalCheckTotal;
  }

  interface MentalCheckTotalOrganization {
    total: MentalCheckTotal;
    organizations: MentalCheckOrganizations;
    organization_type: string;
    organization_layer: string;
    company_uuid: string;
  }

  interface MentalCheckTotalUser {
    average: number;
    fluctuation: number;
    name: string;
    organizations: MentalCheckOrganizations;
    company_uuid: string;
    user_icon: string;
    last_access: number;
  }

  interface Graph {
    date: number;
    score: number;
  }

  interface Average {
    score: number;
    organization_name: string;
  }

  interface MentalCheckGraphCompany {
    graph: Graph[];
    average: Average;
  }

  interface MentalCheckGraph {
    graph: Graph[];
    average: Average[];
  }

  interface Ranking {
    uuid: string;
    name: string;
    average: number;
    fluctuation: number;
  }

  interface MentalCheckRanking {
    ranking: Ranking[];
  }

  interface UseCheckTotal {
    excellent: number;
    very_good: number;
    good: number;
    average: number;
    poor: number;
  }

  interface UseCheckOrganizations {
    company: string;
    parent: string;
    children: string;
  }

  interface UseCheckTotalCompany {
    total: UseCheckTotal;
  }

  interface UseCheckTotalOrganization {
    total: UseCheckTotal;
    organizations: UseCheckOrganizations;
    organization_type: string;
    organization_layer: string;
    company_uuid: string;
  }

  interface UseCheckTotalUser {
    total: UseCheckTotal;
    average: number;
    fluctuation: number;
    name: string;
    organizations: UseCheckOrganizations;
    company_uuid: string;
    user_icon: string;
    last_access: number;
  }

  interface Graph {
    date: number;
    score: number;
  }

  interface Average {
    score: number;
    organization_name: string;
  }

  interface UseCheckGraphCompany {
    graph: Graph[];
    average: Average;
  }

  interface UseCheckGraph {
    graph: Graph[];
    average: Average[];
  }

  interface Ranking {
    uuid: string;
    name: string;
    average: number;
    fluctuation: number;
  }

  interface UseCheckRanking {
    ranking: Ranking[];
  }

  interface UserQa {
    company_questions: CompanyQuestions;
    job_types: string[];
    qa_free_questions: QaFreeQuestions[];
  }

  interface PostRankings {
    organizations?: PostRanking[];
    users?: PostRanking[];
  }

  interface PostRanking {
    user_name?: string;
    department_name: string;
    company_name: string;
    activity_average: number | string;
    achievement_average: number | string;
    activity_rate: number | string;
    achievement_rate: number | string;
  }

  interface ActivityLogs {
    data: ActivityLog[];
    meta: Pagination;
  }

  interface ActivityLog {
    created_at: number;
    text: string;
  }

  interface CompanyQuestions {
    blood_type?: string | null;
    humanities_or_science?: string | null;
    new_graduate_or_mid_career?: string | null;
    prefectures_where_lived?: string | null;
    job_type?: number | null;
  }

  interface QaFreeQuestions {
    uuid: string;
    content: string;
    order: number;
    answer: string | null;
  }

  interface AdminPostThemes {
    post_themes: AdminPostTheme[];
    size: {
      visible: number;
      invisible: number;
    };
  }

  interface AdminPostTheme {
    uuid: string;
    title: string;
    difficulty_level: number;
    order_count: number;
    use_count: number;
    description: string;
    sample_text: string;
    is_public: boolean;
    owners: Owner[];
  }

  interface PostThemeDetail {
    uuid: string;
    title: string;
    difficulty_level: number;
    use_count: number;
    description: string;
    sample_text: string;
    is_public: number;
  }

  interface ContractCompanies {
    data: ContractCompany[];
    meta: Pagination;
  }

  interface ContractCompany {
    uuid: string;
    name: string;
    payment_method: string;
    status: string;
    user_count: boolean;
    representative_name: string;
    payment_date: number;
    contract_date: number;
  }

  interface Admin {
    uuid: string;
    name: string;
    email: string;
    is_account_holder: boolean;
  }

  interface PaymentHistories {
    data: PaymentHistory[];
    meta: Pagination;
    ownerName: string;
  }

  interface TempRegistrationUsers {
    temp_users: TempUser[];
  }

  interface CheckExistsUserEmail {
    email: string | null;
  }

  interface TempUser {
    uuid: string;
    no: number;
    name: string;
    name_kana: string;
    company: string;
    organization: string;
    sub_organizations: TempUserSubOrganization[];
    employment_position: string;
    employment_status: string;
    access_permission: string;
    email: string;
  }

  interface TempUserSubOrganization {
    name: string;
    uuid: string;
  }

  interface TempRegistrationAddUsers {
    no: number;
    uuid: string;
  }

  interface UsersAuthority {
    data: Types.UserAuthority[];
    meta: Pagination;
  }

  interface MovedUser {
    old_uuid: string;
    new_uuid: string;
  }

  interface MovedUsers {
    data: MovedUser[];
  }
}
