declare module Types {
  interface Organization {
    uuid: string;
    name: string;
    kana: string;
    layer: number;
    is_favorite?: boolean;
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
    subordinated_organization_user_count: {
      free: number;
      man: null;
      woman: number;
      all: null;
    };
  }

  interface Leader {
    uuid: string;
    name: string;
    message: string;
  }

  interface Detail {
    image_uuids: string[];
    main_image_uuid: string | null;
    logo_image_uuid: string | null;
    establish_date?: string;
    tel: string;
    url?: string;
    description?: string;
  }

  interface Group {
    uuid: string;
    name: string;
  }

  interface GroupOrganization extends Organization {
    groups: Group[];
  }

  interface OrganizationDetail {
    establish_date?: string;
    tel: string;
    homepage?: string;
    logo?: string;
    description?: string;
  }

  interface OrganizationGroup {
    uuid: string;
    name: string;
    organizations: Organization[];
  }

  // BOXグループ化画面 グループ一覧
  interface CheckedGroupOrganization {
    group_uuid: string;
    organization: Organization;
  }

  interface CompanyDisplayPosition {
    uuid: string;
    distanceFromTopPosition: number;
    distanceFromLeftPosition: number;
    order: number;
  }

  interface ParentDisplayPosition {
    uuid: string;
    company_uuid: string | null;
    distanceFromTopPosition: number;
    distanceFromLeftPosition: number;
    order: number;
  }

  interface ChildDisplayPosition {
    uuid: string;
    parent_uuid: string | null;
    distanceFromTopPosition: number;
    distanceFromLeftPosition: number;
    order: number;
  }

  interface History {
    uuid: string;
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

  interface OrganizationUsers {
    users: UsersInformation[];
    total_count: number;
    offset: number;
    limit: number;
  }

  interface UsersInformation {
    organization_uuid: string;
    organization_name: string;
    user_uuid: string;
    user_name: string;
    priority: string;
    employment_status_uuid: string;
    employment_status_name: string;
    employment_position_uuid: string;
    employment_position_name: string;
    status: string;
  }
  // draggableで使用
  interface NestedCompany extends GroupOrganization {
    parents: NestedParent[];
  }

  interface NestedParent extends GroupOrganization {
    children: GroupOrganization[];
  }

  interface Image {
    uuid: string | null;
    url: string;
  }

  interface Workflow {
    uuid: string;
    starting_time: string;
    title: string;
    content: string;
  }

  type AccessPermissions = {
    key: string;
    name: string;
  };

  type TabName = {
    organization: string;
    company: string;
  };

  type AccountFilterMethod =
    | 'all'
    | 'unactive'
    | 'sent'
    | 'active'
    | 'suspected';

  interface Question {
    uuid: string;
    order: number;
    question: string;
  }

  interface JobType {
    name: string;
    uuid: string;
  }

  type ProfileFreeQuestion = {
    uuid: string;
    content: string;
    answer: string;
  };

  type AssignmentHistory = {
    uuid: string;
    joined_year: number;
    joined_month: number;
    company_name: string;
    organization_name: string;
    note: string;
  };

  interface MessageRoom {
    room_uuid: string;
    name: string | null;
    display_name: string;
    description: string | null;
    room_icon: string | null;
    users: { name: string; uuid: string; icon_url: string }[];
    is_dm: boolean;
    created_at: number | null;
    latest_message_date: number | null;
    latest_message: string | null;
    unread_message_count: number;
  }

  type AuthorityTypes =
    | 'admin'
    | 'read_motivation_analytics'
    | 'read_usage_check';

  type UserAuthorities = Record<AuthorityTypes, string[]> & {
    read_personal_information: boolean;
  };

  type UserAuthority = {
    uuid: string;
    name: string;
    name_kana: string;
    organization: string;
    number: number;
    authorities: Types.UserAuthorities;
  };

  type Authorities = {
    admin: string[];
    readMotivationAnalytics: string[];
    readUsageCheck: string[];
    readPersonalInformation: string[];
  };

  type Orders = 'asc' | 'desc' | 'default' | '';
}

declare module 'vue-popperjs';
declare module 'vue-google-charts';
