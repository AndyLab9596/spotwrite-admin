declare module AppTypes {
  interface MessageRoom {
    room_uuid: string;
    name: string | null;
    display_name: string;
    room_icon: string | null;
    users: { name: string; uuid: string }[];
    is_dm: boolean;
    created_at: number | null;
    latest_message_date: number | null;
    latest_message: string | null;
    unread_message_count: number;
  }

  interface uploadFile {
    file_url: string;
  }

  interface uploadImageFile {
    main_image: string;
    thumbnail: string;
  }

  interface uploadFiles {
    files: Array<uploadImageFile | uploadFile>;
    roomUuid: string;
  }

  type TabItem = {
    id: string;
    name: string;
  };

  type Date = {
    name: number;
    value: number;
  };

  type JobType = {
    name: string;
    value: string;
  };

  type Organization = {
    company: string;
    subOrganization: string;
  };

  type TotalCount = {
    questionCount: number;
    answerdCount: number;
  };

  type UserInfoSelectedTab = 'profile' | 'qa' | 'my-episode' | 'communities';

  type CommunityType = 'general' | 'business';
  type CommunityStatus = 'private' | 'public';

  type LikeComment = {
    uuid: string;
    is_liked: boolean;
  };

  type Reply = {
    commentUuid: string;
    content: string;
  };
}

declare module 'vue-css-donut-chart';
