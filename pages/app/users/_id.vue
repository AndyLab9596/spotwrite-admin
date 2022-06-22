<template>
  <div class="container">
    <div class="user-wrapper">
      <user-info-box
        v-show="isLoadingPage == false"
        :user-info="userProfile.uuid === userInfo.uuid ? userProfile : userInfo"
        class="user-info"
        :class="{ 'user-info-communities': selectedTab === 'communities' }"
        :bulletin-board="isBulletinBoard"
        @fresh="freshProfileData"
        @freshQNA="freshQNAData"
      ></user-info-box>
      <base-tabs
        :items="tabs"
        :selected-tab="selectedTab"
        @change-tab="onTabClicked"
      ></base-tabs>
      <div
        class="bottom-contents-container"
        :class="{
          'bottom-contents-container-communities':
            selectedTab === 'communities',
        }"
      >
        <div v-show="selectedTab === 'profile'">
          <div class="heading">プロフィール</div>
          <vue-loading
            v-if="isLoadingPage"
            type="spin"
            class="page-loading"
            color="#333"
            :size="{ width: '50px', height: '110px' }"
          />
          <profile-box
            v-show="isLoadingPage == false"
            :user-info="userInfo"
          ></profile-box>
          <div class="heading">過去の配属履歴</div>
          <vue-loading
            v-if="isLoadingPage"
            type="spin"
            class="page-loading"
            color="#333"
            :size="{ width: '50px', height: '110px' }"
          />
          <assignment-hisotory-box
            v-show="isLoadingPage == false"
            :assignment-histories="assignmentHistories"
          ></assignment-hisotory-box>
        </div>
        <div v-show="selectedTab === 'qa'">
          <div class="heading">会社アンケート</div>
          <vue-loading
            v-if="isLoadingQuestion"
            type="spin"
            class="page-loading"
            color="#333"
            :size="{ width: '50px', height: '110px' }"
          />
          <company-question-and-answers-box
            v-show="isLoadingQuestion == false"
            :company-question-and-answers="myCompanyQuestionAndAnswers"
            :user-info="userInfo"
          ></company-question-and-answers-box>
          <div class="heading">Q&A</div>
          <vue-loading
            v-if="isLoadingQuestion"
            type="spin"
            class="page-loading"
            color="#333"
            :size="{ width: '50px', height: '110px' }"
          />
          <free-question-and-answers-box
            v-show="isLoadingQuestion == false"
            :free-question-and-answers="myFreeQuestionAndAnswers"
          ></free-question-and-answers-box>
        </div>
        <div v-show="selectedTab === 'my-episode'">
          <post-cards
            class="post-cards"
            :items="myEpisodes"
            :is-loading="isLoadingMyEpisode"
            @onClickDeletePost="clickDeletePost"
            @onClickEditPost="clickEditPost"
          />
          <post-create-modal
            v-if="showPostCreateModal"
            :edit-post-uuid="editPostUuid"
            @close="closeModal"
            @re-render="reRender"
          />
          <vue-loading
            v-if="isLoadingMyEpisode || !myEpisodesIsLastPage"
            type="spin"
            class="page-loading"
            color="#333"
            :size="{ width: '50px', height: '110px' }"
          />
        </div>
        <div v-show="selectedTab === 'communities'">
          <vue-loading
            v-if="isLoadingCommunities"
            type="spin"
            class="page-loading"
            color="#333"
            :size="{ width: '50px', height: '110px' }"
          />
          <joined-communities-box
            v-show="isLoadingCommunities === false"
            :joined-communities="myCommunities"
            @favoriteCommunity="favoriteCommunity"
            @unfavoriteCommunity="unfavoriteCommunity"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import BaseTabs from '@/components/App/molecules/tabs/BaseTabs.vue';
import UserInfoBox from '@/components/App/organisms/users/UserInfoBox.vue';
import ProfileBox from '@/components/App/organisms/users/ProfileBox.vue';
import CompanyQuestionAndAnswersBox from '@/components/App/organisms/users/CompanyQuestionAndAnswersBox.vue';
import FreeQuestionAndAnswersBox from '@/components/App/organisms/users/FreeQuestionAndAnswersBox.vue';
import AssignmentHisotoryBox from '@/components/App/organisms/users/AssignmentHisotoryBox.vue';
import JoinedCommunitiesBox from '@/components/App/organisms/users/JoinedCommunitiesBox.vue';
import PostCreateModal from '@/components/App/organisms/modal/PostCreateModal.vue';
import { VueLoading } from 'vue-loading-template';

import PostCards from '@/components/App/organisms/list/PostCards.vue';
import { fetchUserProfile as fetchUserProfileAPI } from '@/libs/api';
import {
  fetchMyCommunities,
  fetchMyEpisodes,
  fetchMyQuestionAndAnswers,
  fetchUserProfile,
  fetchUserNotifications,
  putUserNotice,
  deletePost,
} from '../../../libs/api/app';

export default Vue.extend({
  layout: 'app/default',
  components: {
    BaseTabs,
    UserInfoBox,
    ProfileBox,
    PostCards,
    CompanyQuestionAndAnswersBox,
    FreeQuestionAndAnswersBox,
    AssignmentHisotoryBox,
    JoinedCommunitiesBox,
    VueLoading,
    PostCreateModal,
  },
  data() {
    return {
      tabs: [
        {
          id: 'profile',
          name: 'プロフィール・配属履歴',
        },
        {
          id: 'qa',
          name: 'Q&A',
        },
        {
          id: 'my-episode',
          name: 'マイエピソード',
        },
        {
          id: 'communities',
          name: '参加コミュニティ',
        },
      ],
      isOpenModal: false,
      isLoadingPage: true,
      isLoadingQuestion: true,
      isLoadingCommunities: true,
      isLoadingMyEpisode: true,
      userInfo: {} as AppApiResponse.Profile,
      myEpisodes: null as Array<ApiResponse.Post>,
      myEpisodesOffset: 0 as number,
      myEpisodesLimit: 20 as number,
      myEpisodesIsFetching: false,
      myEpisodesIsLastPage: true,
      selectedTab: 'profile' as Types.UserInfoSelectedTab,
      myCompanyQuestionAndAnswers: {} as ApiResponse.CompanyQuestionsItem,
      myFreeQuestionAndAnswers: [] as Array<ApiResponse.QuestionnaireItem>,
      assignmentHistories: [] as Array<ApiResponse.assignmentHistories>,
      myCommunities: [] as Array<ApiResponse.Community>,
      notices: [] as AppApiResponse.UserNotice[],
      isBulletinBoard: false as boolean,
      editPostUuid: '' as string,
      showPostCreateModal: false,
    };
  },
  computed: {
    ...mapGetters(['userProfile', 'isEnableBulletinBoard']),
    uuid(): string {
      return this.$route.params.id;
    },
  },
  watch: {
    async selectedTab(value: string) {
      if (value === 'my-episode' && !this.myEpisodes) {
        this.myEpisodes = [];
        this.isLoadingMyEpisode = true;
        await this.fetchMyEpisodes({ uuid: this.uuid });
        this.isLoadingMyEpisode = false;
        if (this.myEpisodes.length >= this.myEpisodesLimit) {
          this.myEpisodesIsLastPage = false;
          document.addEventListener('scroll', this.onMyEpisodesScroll);
        }
      }
    },
  },
  async created(): Promise<void> {
    await this.fetchUserProfile({ uuid: this.uuid });
    this.fetchMyQuestionAndAnswers({ uuid: this.uuid });
    this.fetchMyCommunities(this.uuid);
    this.isBulletinBoard = this.isEnableBulletinBoard;

    // update notice
    this.fetchNotificationsData().then(() => {
      const updateNotifications: any = [...this.notices].filter(
        (item: any) =>
          !item.is_read && item.params && item.params.includes(this.uuid)
      );
      if (updateNotifications) {
        updateNotifications.forEach((notification: any) => {
          this.putUserNotice(notification);
        });
      }
    });
  },
  methods: {
    openModal() {
      this.isOpenModal = true;
    },
    async onMyEpisodesScroll() {
      const { scrollTop, scrollHeight } = document.documentElement;
      const { innerHeight } = window;
      if (
        this.selectedTab === 'my-episode' &&
        !this.myEpisodesIsLastPage &&
        !this.myEpisodesIsFetching &&
        Math.ceil(scrollTop) + innerHeight + 110 >= scrollHeight
      ) {
        this.myEpisodesIsFetching = true;
        await this.fetchMyEpisodes();
        document.documentElement.scrollTop = scrollTop + 1;
      }
    },
    async fetchUserProfile() {
      const { data: userInfo } = await fetchUserProfile({ uuid: this.uuid });
      this.userInfo = userInfo;
      this.assignmentHistories = userInfo.assignment_histories;
      this.isLoadingPage = false;
    },
    async freshProfileData() {
      const { data: userProfile } = await fetchUserProfileAPI();
      this.$accessor.setUserProfile(userProfile);
      await this.fetchUserProfile();
    },
    async freshQNAData() {
      await this.fetchMyQuestionAndAnswers();
    },
    async fetchMyEpisodes() {
      const { data } = await fetchMyEpisodes({
        uuid: this.uuid,
        params: {
          limit: this.myEpisodesLimit,
          offset: this.myEpisodesOffset,
        },
      });
      if (data.posts.length < this.myEpisodesLimit) {
        this.myEpisodesIsLastPage = true;
        document.removeEventListener('scroll', this.onMyEpisodesScroll);
      }
      this.myEpisodesOffset += this.myEpisodesLimit;
      this.myEpisodes = [...this.myEpisodes, ...data.posts];
      this.myEpisodesIsFetching = false;
    },
    async fetchMyQuestionAndAnswers() {
      const { data: MyQuestionAndAnswers } = await fetchMyQuestionAndAnswers({
        uuid: this.uuid,
      });
      this.isLoadingQuestion = false;
      this.myCompanyQuestionAndAnswers = MyQuestionAndAnswers.company_questions;
      this.myFreeQuestionAndAnswers = MyQuestionAndAnswers.qa_free_questions;
    },
    async fetchMyCommunities() {
      const { data } = await fetchMyCommunities(this.uuid);
      this.isLoadingCommunities = false;
      this.myCommunities = data.communities;
    },
    favoriteCommunity(uuid: string) {
      this.changeFavoriteIcon(uuid, true);
      // this.updateCommunityFavorite(uuid, true);
    },
    unfavoriteCommunity(uuid: string) {
      this.changeFavoriteIcon(uuid, false);
      // this.updateCommunityFavorite(uuid, false);
    },
    // async updateCommunityFavorite(uuid: string, isFavorite: boolean) {
    //   // FIXME: APIがlikeなのかfavoriteなのかわからないので一旦保留
    // },
    changeFavoriteIcon(uuid: string, isFavorite: boolean) {
      this.myCommunities = this.myCommunities.map(
        (c: ApiResponse.Community) => {
          if (c.uuid === uuid) {
            return { ...c, is_favorite: isFavorite };
          }
          return c;
        }
      );
    },
    async fetchNotificationsData(): Promise<void> {
      try {
        const { data } = await fetchUserNotifications();
        this.notices = data.data;
      } catch (e) {
        console.log(e);
      }
    },
    async putUserNotice(notice: AppApiResponse.UserNotice) {
      try {
        await putUserNotice(notice.uuid);
      } catch (e) {
        console.log(e);
      }
    },
    onTabClicked(clickedTab: string) {
      this.selectedTab = clickedTab;
    },
    async clickDeletePost(uuid: string) {
      try {
        await deletePost(uuid);
        window.location.reload();
      } catch (e) {
        alert('記事を削除できませんでした。');
      }
    },
    clickEditPost(uuid: string) {
      this.editPostUuid = uuid;
      this.showPostCreateModal = true;
    },
    async reRender() {
      this.myEpisodes = null;
      this.selectedTab = 'profile';
      this.myEpisodesOffset = 0;
      this.myEpisodesLimit = 20;
      this.showPostCreateModal = false;
      this.isLoadingMyEpisode = false;
    },
    closeModal() {
      this.showPostCreateModal = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  margin-top: 40px;
}

.post-cards {
  margin-bottom: 40px;
  margin-top: 54px;
}

.user-wrapper {
  display: flex;
  flex-direction: column;
  color: #6a6d83;
}

.user-info {
  box-shadow: 0 0 2px 0 #dce5ef;

  &-communities {
    box-shadow: 0 1px 2px 0 #dce5ef;
  }
}

.bottom-contents-container {
  box-shadow: 0 0 2px 0 #dce5ef;
  background-color: #f2f3f7;

  &-communities {
    box-shadow: none;
    background-color: transparent;
  }
}

.heading {
  font-size: 13px;
  font-weight: 700;
  margin: 27px 10px 24px 10px;
}

.dummy-image {
  width: 800px;
}

.page-loading {
  margin: auto;
  padding: 30px 0;
}
</style>
