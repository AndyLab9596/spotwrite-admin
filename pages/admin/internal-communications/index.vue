<template>
  <div class="l-page-container">
    <ValidationObserver tag="div">
      <div class="l-page">
        <page-header title="社内連絡の投稿" class="page-header">
          <template #tutorial>
            <TutorialButtonIcon
              :url="`/admin/tutorial/posting-Internalcontact.html`"
            />
          </template>
          <template #description>
            <div class="heading-wrapper">
              <p>公開設定をして、社内連絡を投稿できます。</p>
              <base-button
                size="large"
                class="history-button"
                @click="goToHistry"
              >
                <img
                  src="/icon/Icon-arrow_right_white.svg"
                  class="arrow-left"
                  alt=""
                />
                送信履歴
              </base-button>
            </div>
          </template>
        </page-header>
        <div>
          <div
            v-show="
              !showInterviewRoom ||
                selectedInternalCommunicationTemplate !== 'interview' ||
                selectedInterviewTemplate === 'normal'
            "
            class="content-body"
          >
            <p class="public-setting-title">公開設定</p>
            <public-range
              class="public-range"
              :selected-permission="selectedPermission"
              @select="selectPublicRange"
            />
            <public-target
              class="public-target"
              :select-public-members="publishSetting.users"
              :employees="availableEmployees"
              :all-organizations="organizations"
              @select="selectPublicTarget"
            />
            <select-template
              class="select-template"
              :templates="internalCommunicationTemplates"
              :select-template="selectedInternalCommunicationTemplate"
              :select-template-interview="selectedInterviewTemplate"
              @onChangeTemplate="changeTemplate"
              @onChangeTemplateInterview="changeTypeInterview"
            />
            <FileUpload
              :edit-file-urls="editFileUrls"
              :internal-communication-template="
                selectedInternalCommunicationTemplate
              "
              @upload="onFileUpload"
              @videoUpload="onVideoUpload"
              @removeVideo="removeVideo"
              @removeFile="removeFile"
              @changeSort="changeSort"
              @changeIsLoadingFile="changeIsLoadingFile"
            />
            <div class="post-box">
              <ValidationProvider rules="required">
                <input
                  v-model="form.title"
                  class="input"
                  placeholder="タイトルを入力"
                />
              </ValidationProvider>
              <ValidationProvider rules="required">
                <textarea
                  v-model="form.content"
                  class="input"
                  rows="20"
                  placeholder="本文を入力"
                ></textarea>
              </ValidationProvider>
              <template v-if="displaySelectEmployee">
                <p class="selected-employee">{{ selectedType }}対象社員</p>
                <SelectEmployee
                  :items="availableEmployees"
                  :selected-item="selectedAwardee"
                  @select="pickUpEmployee"
                  @delete="deletePickUpEmployee"
                />
              </template>
              <template v-if="displaySelectEmployee" class="awardee-comment">
                <div class="triangle">
                  <div class="triangle-below"></div>
                  <div class="triangle-inner"></div>
                </div>
                <textarea
                  v-model="form.awardee_user_comment"
                  class="input-awardee-comment"
                  rows="20"
                  placeholder="コメントを入力してみましょう（任意）"
                ></textarea>
              </template>
            </div>
            <!-- 付帯コンテンツ -->
            <AdditionalContentEnquete
              v-if="showAdditionalPost && showAdditionalContentEnquete"
              :questionnaire="question"
              :organizations="addOrganizations"
              :after-today-expier-at="afterTodayExpierAt"
              :selected-interview-template="selectedInterviewTemplate"
              @onEnqueteClose="onEnqueteClose"
              @onQuestionSelect="questionSelect"
              @changeOrganization="changeOrganization"
              @changeExpireAt="changeExpireAt"
              @changeDisclosedAnswerers="changeDisclosedAnswerers"
            >
            </AdditionalContentEnquete>
            <AdditionalContentEvent
              v-if="showAdditionalPost && showAdditionalContentEvent"
              :event-contents="event"
              :organizations="addOrganizations"
              @onEventClose="onAdditionalContentEvent"
              @onEventSelected="eventSelected"
            >
            </AdditionalContentEvent>
            <div v-if="showAdditionalPost" class="additional-post">
              <PostAddContentsButton
                v-if="!showAdditionalContentEnquete"
                inverse
                size="large"
                class="post-button"
                @click="onAdditionalContentEnquete"
              >
                アンケート
              </PostAddContentsButton>
              <PostAddContentsButton
                v-if="!showAdditionalContentEvent"
                inverse
                size="large"
                class="post-button"
                @click="onAdditionalContentEvent"
              >
                イベント設定
              </PostAddContentsButton>
            </div>

            <AdditionalContentInterview
              v-if="selectedInternalCommunicationTemplate === 'interview'"
              :interviewee="selectedInterviewees"
              :interview-contents="draftFetchInterviewContents"
              :add-interview-flag="addInterviewFlag"
              :end-add-interview-flag="endAddInterviewFlag"
              :request-interview-contents="interviewContents"
              :interview-template="selectedInterviewTemplate"
              :post-title="form.title"
              :member-confirmed="interviewMemberConfirmed"
              is-admin
              @selectEmployee="addEmployee"
              @changeContents="changeInterviewContents"
              @addInterview="addInterview"
              @editInterviewContent="editInterviewContents"
              @interviewMemberConfirmed="interviewConfirmed"
            />
          </div>
          <InterviewMessageRoom
            v-show="
              showInterviewRoom &&
                selectedInternalCommunicationTemplate === 'interview' &&
                selectedInterviewTemplate !== 'normal'
            "
            class="content-body"
            :selected-interviewees="selectedInterviewees"
            :interview-message-room-contents="interviewMessageRoomContents"
            :room-id="roomId"
            :show-interview-room="showInterviewRoom"
            is-admin
            @submit="endInterviewButtonClick"
            @sendMessage="sendMessage"
            @editMessage="editMessage"
            @deleteMessage="deleteMessage"
            @changeMessageType="changeMessageType"
            @receiveEventMessage="receiveEventMessage"
          />
        </div>
        <div v-if="!addInterviewFlag" class="bottom-menu">
          <AppBaseButton
            inverse
            size="large"
            class="post-button button-small"
            @click="showDraft"
          >
            下書き一覧
          </AppBaseButton>
          <AppBaseButton
            inverse
            size="large"
            class="post-button button-small"
            :disabled="
              form.title === '' ||
                isLoadingFile ||
                (draftPostUuid !== '' &&
                  selectedCategory !== 'internal-communication')
            "
            @click="saveDraftPost"
          >
            下書き保存
          </AppBaseButton>
          <AppBaseButton
            inverse
            size="large"
            class="post-button button-large"
            :disabled="isLoadingFile"
            @click="onPreviewButtonClick"
          >
            プレビュー
          </AppBaseButton>
          <AppBaseButton
            inverse
            size="large"
            class="post-button button-large"
            @click="publicationDeadlineModal = true"
          >
            記事の設定をする
          </AppBaseButton>
        </div>
        <div
          v-else-if="
            endAddInterviewFlag ||
              selectedInternalCommunicationTemplate !== 'interview' ||
              selectedInterviewTemplate === 'normal'
          "
          class="bottom-menu"
        >
          <AppBaseButton
            inverse
            size="large"
            class="post-button button-large interview"
            @click="endInterviewButtonClick"
          >
            インタビューを終了
          </AppBaseButton>
        </div>
      </div>
      <PublicationDeadlineModal
        v-if="publicationDeadlineModal"
        :publish-setting="publishSetting"
        :has-validation-error="thisRuleFailed"
        @close="publicationDeadlineModal = false"
        @post="onPostButtonClick"
        @changeStartDate="onStartDateChange"
        @changeEndDate="onEndDateChange"
        @changeArticleImportant="changeArticleImportant"
      />
      <PostPreviewModal
        v-if="showPreviewModal"
        :post="previewPost"
        :selected-image-src="selectImageSrc"
        :selected-image-src-type="thumbnailType"
        @closePreviewModal="closePreviewModal"
      />
      <PostDraftModal
        v-if="showDraftModal"
        :is-internal-communications-page="true"
        :room-id="roomId"
        :draft-post-uuid="draftPostUuid"
        @close="closeDraftModal"
        @click="clickItem"
      />
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import dayjs from '@/libs/dayjs';
import {
  storeDraftInternalCommunicationPost,
  updateDraftPost,
  storeInternalCommunicationPost,
  updateInternalCommunicationPost,
  employees,
  fetchPostEdit,
  fetchPost,
  fetchPostTargetUsers,
  createRoomInterview,
  addMessageInterview,
  editMessageInterview,
  deleteMessageInterview,
  getRoomInterview,
  deleteRoomInterview,
} from '@/libs/api/app';
import { fetchOrganizations } from '@/libs/api';
import PostAddContentsButton from '@/components/App/atoms/buttons/PostAddContentsButton.vue';
import FileUpload from '@/components/App/organisms/post/FileUpload.vue';
import AdditionalContentEnquete from '@/components/App/organisms/post/PostCreateModal/AdditionalContentEnquete.vue';
import AdditionalContentInterview from '@/components/App/organisms/post/PostCreateModal/AdditionalContentInterview.vue';
import InterviewMessageRoom from '@/components/App/organisms/post/PostCreateModal/InterviewMessageRoom.vue';
import AdditionalContentEvent from '@/components/App/organisms/post/PostCreateModal/AdditionalContentEvent.vue';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import AppBaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import PublicRange from '@/components/Admin/Pages/InternalCommunications/Post/PublicRange.vue';
import PublicTarget from '@/components/Admin/Pages/InternalCommunications/Post/PublicTarget.vue';
import SelectTemplate from '@/components/Admin/Pages/InternalCommunications/Post/SelectTemplate.vue';
import SelectEmployee from '@/components/Admin/Pages/InternalCommunications/Post/SelectEmployee.vue';
import PublicationDeadlineModal from '@/components/Admin/Pages/InternalCommunications/Post/Modal/PublicationDeadlineModal.vue';
import PostDraftModal from '@/components/App/organisms/modal/PostDraftModal.vue';
import PostPreviewModal from '@/components/App/organisms/modal/PostPreviewModal.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';
import cloneDeep from 'lodash/cloneDeep';

const postCategories = [
  'my-episode',
  'internal-communication',
  'department-news',
  'community-news',
] as const;

type PostCategory = typeof postCategories[number];

const internalCommunicationTemplates = [
  'none',
  'interview',
  'pickup',
  'thankyou',
] as const;

type Templates = 'none' | 'interview' | 'pickup' | 'thankyou';

type PostTheme = AppApiResponse.PostTheme;

type InternalCommunicationTemplate = typeof internalCommunicationTemplates[number];

type PostCategoryKeyValue = {
  [key in PostCategory]: string;
};

type Employee = AppApiResponse.Employee & {
  comment_position?: CommentPosition;
};

type CommentPosition = 'left' | 'right';

type Contents = {
  kind: 'comment' | 'heading';
  commenter?: string;
  body: string;
  user_icon: string;
  content_type?: string;
  comment_position?: string;
  id?: number;
  user_name?: string;
  organization_name?: string;
  created_at?: string;
};

type Awardee = AppApiResponse.Interviewee;
type InterviewText = Contents;

type StorePostInterview = AppApiRequest.StoreInternalCommunicationPost;

type StorePostQuestionnaire = AppApiRequest.StorePostQuestionnaire;
type StorePostEvent = AppApiRequest.StorePostEvent;
type StorePostInterviewItem = AppApiRequest.StoreInterviewItem;

type UploadImage = AppApiResponse.uploadImage;

export default Vue.extend({
  layout: 'admin/default',
  components: {
    ValidationObserver,
    ValidationProvider,
    BaseButton,
    PostAddContentsButton,
    AdditionalContentInterview,
    InterviewMessageRoom,
    FileUpload,
    AdditionalContentEnquete,
    AdditionalContentEvent,
    PageHeader,
    PublicRange,
    PublicTarget,
    SelectTemplate,
    AppBaseButton,
    SelectEmployee,
    PublicationDeadlineModal,
    PostDraftModal,
    PostPreviewModal,
    TutorialButtonIcon,
  },
  data: () => ({
    selectedCategory: 'my-episode' as PostCategory,
    internalCommunicationTemplates: {
      none: '選択なし',
      interview: 'インタビュー',
      pickup: 'PICK UP',
      thankyou: 'ありがとう',
    },
    selectedInternalCommunicationTemplate: 'none' as InternalCommunicationTemplate,
    selectedInterviewTemplate: 'normal' as string,
    theme: {
      title: '',
      example: '',
    } as PostTheme,
    editFileUrls: [] as UploadImage[],
    fileUrls: [] as string[],
    videoUrls: [] as string[],
    defaultImages: [] as string[],
    defaultVideos: [] as string[],
    form: {
      title: '',
      content: '',
      awardee_user_comment: '',
    },
    publishSetting: {
      users: [],
      start_at: null,
      end_at: null,
      is_important: false,
    } as AppApiRequest.PublishSetting | null,
    selectedPermission: 'member' as AppApiRequest.Permission | null,
    selectedOrganization: null as AppApiResponse.Organization | null,
    selectedCommunity: null as AppApiResponse.Community | null,
    organizations: [] as AppApiResponse.Organization[],
    addOrganizations: [{ name: '全員', uuid: null }] as [{}],
    showAdditionalPost: true as boolean,
    showAdditionalContentEnquete: false as boolean,
    question: null as StorePostQuestionnaire | null,
    showAdditionalContentEvent: false as boolean,
    event: null as StorePostEvent | null,
    requestInterviewContents: [] as StorePostInterviewItem[],
    interviewMessageRoomContents: [] as StorePostInterviewItem[],
    previewInterviewContents: [] as AppApiResponse.InterviewContent[],
    draftFetchInterviewContents: [] as InterviewText[],
    selectedInterviewees: [] as Employee[],
    publicationDeadlineModal: false as boolean,
    showDraftModal: false as boolean,
    showPreviewModal: false as boolean,
    previewPost: {} as AppApiResponse.Post,
    selectImageSrc: '' as string,
    selectedAwardee: null as Employee | null,
    availableEmployees: [] as Employee[],
    relationalPostUuid: '' as string | null,
    targetUsersByPostUuid: [] as AppApiResponse.Users | [],
    thumbnailType: '' as string,
    isLoadingFile: false as boolean,
    addInterviewFlag: false as boolean,
    endAddInterviewFlag: false as boolean,
    showInterviewRoom: false as boolean,
    showMemberList: false as boolean,
    roomId: 0 as number,
    interviewMemberConfirmed: false as boolean,
    handler: null as any,
    draftPostUuid: '' as string,
  }),
  computed: {
    currentWordCount(): number {
      return this.form.content.length;
    },
    currentFileCount(): number {
      return this.fileUrls.length;
    },
    hasQuestionExpireAtError(): boolean {
      let expireAtError = false;

      if (this.question) {
        // 回答期限が今日未満で設定されている場合バリデーションエラーを出す
        if (
          Number(this.question.expire_at) <= dayjs(dayjs(new Date())).unix()
        ) {
          expireAtError = true;
        }
      }
      return expireAtError;
    },
    hasAwardee(): boolean {
      if (
        this.selectedInternalCommunicationTemplate === 'pickup' ||
        this.selectedInternalCommunicationTemplate === 'thankyou'
      ) {
        return this.selectedAwardee == null;
      }
      return false;
    },
    hasTitle(): boolean {
      return this.form.title === '';
    },
    hasContent(): boolean {
      return this.form.content === '';
    },
    hasInterview(): boolean {
      if (this.selectedInternalCommunicationTemplate === 'interview') {
        if (this.selectedInterviewTemplate === 'normal') {
          const comment = this.requestInterviewContents.filter(
            (item: StorePostInterviewItem) => item.content_type === 'comment'
          );
          return this.selectedInterviewees.length < 1 || comment.length < 1;
        }
        const comment = this.interviewMessageRoomContents.filter(
          (item: StorePostInterviewItem) => item.content_type === 'comment'
        );
        return comment.length < 1;
      }
      return false;
    },
    hasQestion(): boolean {
      return this.question != null ? this.afterTodayExpierAt : false;
    },
    thisRuleFailed(): boolean {
      if (
        this.selectedInternalCommunicationTemplate === 'interview' &&
        this.selectedInterviewTemplate === 'normal'
      ) {
        return false;
      }
      return (
        this.hasTitle ||
        this.hasContent ||
        this.hasInterview ||
        this.hasAwardee ||
        this.hasQestion ||
        this.isLoadingFile
      );
    },
    selectedType(): string {
      return this.selectedInternalCommunicationTemplate === 'pickup'
        ? 'PICK UP'
        : 'ありがとう';
    },
    displaySelectEmployee(): boolean {
      return (
        this.selectedInternalCommunicationTemplate === 'pickup' ||
        this.selectedInternalCommunicationTemplate === 'thankyou'
      );
    },
    hasImages(): string[] {
      return this.fileUrls.length === 0 ? [] : this.fileUrls;
    },
    removedFileUrls(): string[] {
      return [...this.defaultImages];
    },
    removedVideoUrls(): string[] {
      return [...this.defaultVideos];
    },
    hasThumbnail(): string {
      if (this.hasVideo) {
        return this.videoUrls[0];
      }
      if (this.hasFile) {
        return this.fileUrls[0];
      }
      return '';
    },
    afterTodayExpierAt(): boolean {
      // 日付が現在時刻以降でない場合バリデーションエラー
      if (this.question != null) {
        return (
          this.question.expire_at == null ||
          this.question.expire_at < dayjs().unix()
        );
      }
      return false;
    },
    hasVideo(): boolean {
      return this.videoUrls.length > 0;
    },
    hasFile(): boolean {
      return this.fileUrls.length > 0;
    },
    interviewContents(): InterviewText[] {
      if (this.selectedInterviewTemplate === 'normal') {
        return this.requestInterviewContents;
      }
      return this.interviewMessageRoomContents;
    },
  },
  watch: {
    editFileUrls(newValue: any): void {
      this.editFileUrls = newValue;
    },
    selectedCategory(): void {
      this.showAdditionalPost = true;
      if (this.selectedCategory === 'internal-communication') {
        if (
          this.selectedInternalCommunicationTemplate === 'interview' ||
          this.selectedInternalCommunicationTemplate === 'pickup' ||
          this.selectedInternalCommunicationTemplate === 'thankyou'
        ) {
          this.showAdditionalPost = false;
        }
      }
    },
    selectedInternalCommunicationTemplate(): void {
      if (
        this.selectedInternalCommunicationTemplate === 'interview' ||
        this.selectedInternalCommunicationTemplate === 'pickup' ||
        this.selectedInternalCommunicationTemplate === 'thankyou'
      ) {
        this.showAdditionalPost = false;
      } else {
        this.showAdditionalPost = true;
      }
    },
    async $route(newRoute: object, oldRoute: object): void {
      if (
        newRoute.path === oldRoute.path &&
        JSON.stringify(newRoute.query) !== JSON.stringify(oldRoute.query)
      ) {
        await this.fetchEmployees(10000);
        const conditionalTarget = newRoute.query?.conditional_target || null;
        if (conditionalTarget) {
          if (
            this.$accessor.internalTargetUsers &&
            this.$accessor.internalTargetUsers[conditionalTarget]
          ) {
            this.publishSetting.users = this.$accessor.internalTargetUsers[
              conditionalTarget
            ];
          } else {
            this.fetchPostTargetUsers(conditionalTarget);
          }
        }
      }
    },
    showInterviewRoom(value: boolean) {
      if (value) {
        window.scrollTo(0, 0);
      }
    },
    roomId(value: number) {
      this.$echo
        .channel(`message.interview.${value}`)
        .stopListening('MessageInterviewTranslated');
      if (value > 0) {
        this.$echo
          .channel(`message.interview.${value}`)
          .listen('MessageInterviewTranslated', (e: any) => {
            const body = JSON.parse(e.body);
            if (body.content_type === 'position') {
              return;
            }
            const userSend = this.selectedInterviewees.find(
              (u: any) => u.user_uuid === body.user_info.uuid
            );
            const mess: any = {
              id: body.id,
              content_type: body.content_type,
              body: body.content ? body.content.origin : '',
              kind: body.content_type,
              comment_position: body.comment_position,
              user_name: userSend.name,
              user_icon: userSend.user_icon,
              organization_name: userSend.organization_name,
              created_at: body.created_at,
              interviewee_uuid: body.user_info.uuid,
            };
            if (
              body.action_type === 'store.text' &&
              !this.interviewMessageRoomContents.find(
                (m: any) => m.id === body.id
              )
            ) {
              this.interviewMessageRoomContents.push(mess);
            }
            if (body.action_type === 'delete.text') {
              for (
                let i = 0;
                i < this.interviewMessageRoomContents.length;
                i += 1
              ) {
                if (body.id === this.interviewMessageRoomContents[i].id) {
                  this.interviewMessageRoomContents.splice(i, 1);
                  break;
                }
              }
            }
            if (body.action_type === 'edit.text') {
              for (
                let i = 0;
                i < this.interviewMessageRoomContents.length;
                i += 1
              ) {
                if (this.interviewMessageRoomContents[i].id === body.id) {
                  this.interviewMessageRoomContents.splice(i, 1, mess);
                  break;
                }
              }
            }
          });
      }
    },
    interviewMessageRoomContents(value: StorePostInterviewItem[]): void {
      this.previewInterviewContents = value.map(
        (item: StorePostInterviewItem) => {
          if (item.interviewee_uuid) {
            const selectUser = this.selectedInterviewees.find(
              (user: Employee) => user.user_uuid === item.interviewee_uuid
            );
            if (selectUser) {
              return {
                content_type: item.content_type,
                body: item.body,
                interviewee: {
                  uuid: selectUser.user_uuid,
                  name: selectUser.name,
                  email: '',
                  user_icon: selectUser.user_icon,
                  company_uuid: '',
                  company_name: '',
                  organization_uuid: '',
                  organization_name: selectUser.organization_name,
                  position_text: '',
                  enrollment_text: '',
                  enrollment_color: '',
                  joined_year: 0,
                  joined_month: 0,
                },
                comment_position: selectUser.comment_position,
              };
            }
          }
          return {
            content_type: item.content_type,
            body: item.body,
          };
        }
      ) as AppApiResponse.InterviewContent[];
    },
    selectedInterviewees(value: any) {
      this.selectedInterviewees = value;
    },
  },
  mounted() {
    this.$echo
      .channel(`notice.${this.$accessor.userProfile.uuid}`)
      .listen('UserHasNewNotice', (e: NoticeEvent) => {
        const body = JSON.parse(e.body);
        if (
          body.notice_type === 'end_interview_room' &&
          body.from_user_uuid === this.$accessor.userProfile.uuid &&
          body.room_id === this.roomId
        ) {
          window.location.reload();
        }
      });
    document.addEventListener('click', this.infiniteHandler);
  },
  async created() {
    const relational = this.$route.query?.relational || null;
    const conditionalTarget = this.$route.query?.conditional_target || null;
    await this.fetchEmployees(10000);
    if (conditionalTarget) {
      if (
        this.$accessor.internalTargetUsers &&
        this.$accessor.internalTargetUsers[conditionalTarget]
      ) {
        this.publishSetting.users = this.$accessor.internalTargetUsers[
          conditionalTarget
        ];
      } else {
        await this.fetchPostTargetUsers(conditionalTarget);
      }
    }
    this.fetchOrganizations();
    if (relational) {
      this.fetchRelationalPost(relational);
    }
  },
  async destroyed() {
    // @ts-ignore
    this.$echo
      .channel(`notice.${this.$accessor.userProfile.uuid}`)
      .stopListening('UserHasNewNotice');
  },
  methods: {
    clearPost() {
      this.form.title = '';
      this.form.content = '';
      this.form.awardee_user_comment = '';
      this.fileUrls = [];
      this.editFileUrls = [] as UploadImage[];
      this.publishSetting = {
        users: [],
        start_at: null,
        end_at: null,
        is_important: false,
      } as AppApiRequest.PublishSetting;
      this.selectedPermission = 'member';
      this.question = null;
      this.showAdditionalContentEnquete = false;
      this.event = null;
      this.showAdditionalContentEvent = false;
      this.requestInterviewContents = [] as StorePostInterviewItem[];
      this.interviewMessageRoomContents = [] as InterviewText[];
      this.previewInterviewContents = [] as AppApiResponse.InterviewContent[];
      this.draftFetchInterviewContents = [] as InterviewText[];
      this.selectedInterviewees = [] as Employee[];
      this.selectedInterviewees.push({
        user_uuid: this.$store.state.userProfile.uuid,
        name: this.$store.state.userProfile.name,
        user_icon: this.$store.state.userProfile.user_icon,
        organization_name: this.$store.state.userProfile.organization_name,
        comment_position: 'left',
      });
      this.previewPost = {} as AppApiResponse.Post;
      this.selectedAwardee = null;
      this.showAdditionalContentEnquete = false;
      this.showAdditionalContentEvent = false;
      this.selectedInterviewTemplate = 'normal';

      this.addInterviewFlag = false;
      this.endAddInterviewFlag = false;
      this.showInterviewRoom = false;
      this.interviewMemberConfirmed = false;
    },
    clearInternalCommunicationPost() {
      this.requestInterviewContents = [] as StorePostInterviewItem[];
      this.interviewMessageRoomContents = [] as InterviewText[];
      this.selectedInterviewees = [] as Employee[];
      this.selectedInterviewees.push({
        user_uuid: this.$store.state.userProfile.uuid,
        name: this.$store.state.userProfile.name,
        user_icon: this.$store.state.userProfile.user_icon,
        organization_name: this.$store.state.userProfile.organization_name,
        comment_position: 'left',
      });
      this.selectedInterviewTemplate = 'normal';
      this.addInterviewFlag = false;
      this.endAddInterviewFlag = false;
      this.showInterviewRoom = false;
      this.interviewMemberConfirmed = false;
    },
    onFileUpload(url: string): void {
      this.fileUrls = [...this.fileUrls, url];
      this.editFileUrls = [
        ...this.editFileUrls,
        {
          thumbnail: url,
          main_image: url,
          type: 'image',
        },
      ];
    },
    onVideoUpload(url: string) {
      this.videoUrls = [...this.videoUrls, url];
      this.editFileUrls = [
        ...this.editFileUrls,
        {
          thumbnail: url,
          main_image: url,
          type: 'video',
        },
      ];
    },
    removeFile(url: string) {
      this.fileUrls.splice(this.fileUrls.indexOf(url), 1);
    },
    removeVideo(url: string) {
      this.videoUrls = this.videoUrls.filter((item: string) => item !== url);
      this.editFileUrls = [
        ...this.editFileUrls,
        {
          thumbnail: url,
          main_image: url,
          type: 'video',
        },
      ];
    },
    changeSort(sortedAllEditFileUrls: AppApiResponse.uploadImage[]): void {
      this.fileUrls = sortedAllEditFileUrls
        .filter((f: AppApiResponse.uploadImage) => f.type === 'image')
        .map((f: AppApiResponse.uploadImage) => f.main_image);
      this.videoUrls = sortedAllEditFileUrls
        .filter((f: AppApiResponse.uploadImage) => f.type === 'video')
        .map((f: AppApiResponse.uploadImage) => f.main_image);
    },
    changeIsLoadingFile(isLoadingFile: boolean): void {
      this.isLoadingFile = isLoadingFile;
    },
    onPostButtonClick(): void {
      this.onPostButtonClickForInternalCommunication();
    },
    async onPostButtonClickForInternalCommunication(): Promise<void> {
      const payload = this.buildRequestForInternalCommunication();
      if (
        payload.title.trim().length &&
        payload.content.trim().length &&
        this.selectedInternalCommunicationTemplate === 'interview' &&
        this.selectedInterviewTemplate === 'normal'
      ) {
        const interviewContentGroups = payload.interview_contents.reduce(
          (result: any, item: any) => {
            if (item.body?.trim()?.length) {
              if (item.content_type === 'heading') {
                result.heading.push(item);
              }
              if (item.content_type === 'comment') {
                result.comment.push(item);
                if (!item.interviewee_uuid) {
                  result.emptyUser.push(item);
                }
              }
            } else {
              result.emptyBody.push(item);
            }
            return result;
          },
          {
            heading: [],
            comment: [],
            emptyBody: [],
            emptyUser: [],
          }
        );
        if (interviewContentGroups.emptyBody.length) {
          alert(
            '「未入力の見出しもしくはコメントがあります。記入もしくは削除したあと、投稿してください。」'
          );
          return;
        }
        if (
          !interviewContentGroups.heading.length ||
          !interviewContentGroups.comment.length
        ) {
          alert(
            '「インタビューの見出しやコメントが追加されていません。見出しやコメントを登録したあと、投稿してください。」'
          );
          return;
        }
        if (interviewContentGroups.emptyUser.length) {
          alert(
            '「発言者が選択されていないコメントがあります。選択後に再度投稿してください。」'
          );
          return;
        }
      }
      if (this.relationalPostUuid) {
        payload.relational_post_uuid = this.relationalPostUuid;
      }
      try {
        if (this.draftPostUuid) {
          await updateInternalCommunicationPost(this.draftPostUuid, payload);
          this.draftPostUuid = '';
        } else {
          await storeInternalCommunicationPost(payload);
        }
        await this.closeInterviewRoom(this.roomId);
        this.clearPost();
        this.publicationDeadlineModal = false;
        alert('記事の投稿に成功しました。');
        window.location.reload();
      } catch (e) {
        alert('記事の投稿に失敗しました。');
      }
    },
    async postDraftWhenCreateInterviewRoom(
      payload: StorePostInterview
    ): Promise<void> {
      try {
        await storeDraftInternalCommunicationPost(payload);
      } catch (e) {
        alert('下書き保存に失敗しました');
      }
    },
    async postDraftPosts(payload: StorePostInterview): Promise<void> {
      try {
        if (this.draftPostUuid) {
          await updateDraftPost(this.draftPostUuid, payload);
        } else {
          await storeDraftInternalCommunicationPost(payload);
        }
        this.clearPost();
        alert('下書き保存に成功しました。');
        window.location.reload();
      } catch (e) {
        alert('下書き保存に失敗しました');
      }
    },
    buildRequestDraftPostForInternalCommunication(): StorePostInterview {
      let requestInterview: any = cloneDeep(this.requestInterviewContents);
      let stepConfirmInterview = this.interviewMemberConfirmed
        ? 'confirmed'
        : 'new';
      if (this.addInterviewFlag || this.endAddInterviewFlag) {
        stepConfirmInterview = 'created';
      }
      if (
        this.interviewMessageRoomContents.length > 0 &&
        this.selectedInterviewTemplate !== 'normal'
      ) {
        const interviewContent = [] as any[];
        this.interviewMessageRoomContents.forEach((item: any) => {
          if (item.content_type === 'heading') {
            interviewContent.push({
              content_type: 'heading',
              body: item.body,
            });
          }
          let intervieweeUuid = item.interviewee_uuid;
          if (item.interviewee) {
            intervieweeUuid = item.interviewee.uuid;
          }
          if (item.content_type === 'comment') {
            interviewContent.push({
              content_type: 'comment',
              body: item.body,
              interviewee_uuid: intervieweeUuid,
              comment_position: item.comment_position,
            });
          }
        });
        requestInterview = interviewContent;
      }
      if (this.selectedInterviewees.length > 0) {
        this.selectedInterviewees.forEach((item: any) => {
          const interviewContentType =
            this.selectedInterviewTemplate === 'normal'
              ? 'MAKE_NORMALLY'
              : 'MAKE_MESSAGE';
          const makeBody = JSON.stringify({
            interview_type: interviewContentType,
            step: stepConfirmInterview,
          });
          requestInterview.push({
            content_type: 'position',
            body: makeBody,
            interviewee_uuid: item.user_uuid ?? null,
            comment_position: item.comment_position,
          });
        });
      }
      return {
        type: 'internal-communication' as const,
        permission: this.selectedPermission,
        organization_uuid: null,
        community_uuid: null,
        ...this.form,
        add_image_urls: this.hasImages,
        add_video_urls: this.videoUrls,
        delete_image_urls: this.removedFileUrls || [],
        delete_video_urls: this.removedVideoUrls || [],
        template: this.selectedInternalCommunicationTemplate,
        awardee_user_uuid:
          this.selectedAwardee != null ? this.selectedAwardee.user_uuid : null,
        publish_setting:
          this.publishSetting != null
            ? {
                ...this.publishSetting,
              }
            : null,
        questionnaire: this.question,
        event: this.event,
        interview_contents: requestInterview,
        room_id: this.roomId,
      };
    },
    buildRequestForInternalCommunication(): StorePostInterview {
      let requestInterview = cloneDeep(this.requestInterviewContents);
      if (
        this.interviewMessageRoomContents.length > 0 &&
        this.selectedInterviewTemplate !== 'normal'
      ) {
        const interviewContent = [] as any[];
        this.interviewMessageRoomContents.forEach((item: any) => {
          if (item.content_type === 'heading') {
            interviewContent.push({
              content_type: 'heading',
              body: item.body,
            });
          }
          let intervieweeUuid = item.interviewee_uuid;
          if (item.interviewee) {
            intervieweeUuid = item.interviewee.uuid;
          }
          if (item.content_type === 'comment') {
            interviewContent.push({
              content_type: 'comment',
              body: item.body,
              interviewee_uuid: intervieweeUuid,
              comment_position: item.comment_position,
            });
          }
        });
        requestInterview = interviewContent;
      }
      if (this.selectedInterviewees.length > 0) {
        let stepConfirmInterview = this.interviewMemberConfirmed
          ? 'confirmed'
          : 'new';
        if (this.addInterviewFlag || this.endAddInterviewFlag) {
          stepConfirmInterview = 'created';
        }
        this.selectedInterviewees.forEach((item: any) => {
          const interviewContentType =
            this.selectedInterviewTemplate === 'normal'
              ? 'MAKE_NORMALLY'
              : 'MAKE_MESSAGE';
          const makeBody = JSON.stringify({
            interview_type: interviewContentType,
            step: stepConfirmInterview,
          });
          requestInterview.push({
            content_type: 'position',
            body: makeBody,
            interviewee_uuid: item.user_uuid ?? null,
            comment_position: item.comment_position,
          });
        });
      }
      let isDraft = false;
      if (this.draftPostUuid) {
        isDraft = true;
      }
      return {
        type: 'internal-communication' as const,
        permission: this.selectedPermission,
        organization_uuid: null,
        community_uuid: null,
        ...this.form,
        add_image_urls: this.hasImages,
        add_video_urls: this.videoUrls,
        template: this.selectedInternalCommunicationTemplate,
        awardee_user_uuid:
          this.selectedAwardee != null ? this.selectedAwardee.user_uuid : null,
        publish_setting:
          this.publishSetting != null
            ? {
                ...this.publishSetting,
              }
            : null,
        questionnaire: this.question,
        event: this.event,
        interview_contents: requestInterview,
        is_draft: isDraft,
        room_id: this.roomId,
      };
    },
    onAdditionalContentEnquete(): void {
      this.showAdditionalContentEnquete = !this.showAdditionalContentEnquete;
    },
    selectPublicRange(value: AppApiRequest.Permission) {
      this.selectedPermission = value;
    },
    questionSelect(items: AppApiRequest.StoreQuestionnaireItem[]): void {
      if (this.question != null) {
        this.question.items = items;
      } else {
        this.question = {
          items,
          organization_uuid: '',
          expire_at: null,
          is_disclosed_answerers: false,
        };
      }
    },
    changeOrganization(uuid: string) {
      if (this.question != null) {
        this.question.organization_uuid = uuid;
      } else {
        this.question = {
          items: [],
          organization_uuid: uuid,
          expire_at: null,
          is_disclosed_answerers: false,
        };
      }
    },
    changeExpireAt(number: number) {
      if (this.question != null) {
        this.question.expire_at = number;
      } else {
        this.question = {
          items: [],
          organization_uuid: '',
          expire_at: null,
          is_disclosed_answerers: false,
        };
      }
    },
    changeDisclosedAnswerers(value: boolean) {
      if (this.question != null) {
        this.question.is_disclosed_answerers = value;
      } else {
        this.question = {
          items: [],
          organization_uuid: '',
          expire_at: null,
          is_disclosed_answerers: value,
        };
      }
    },
    onEnqueteClose() {
      this.question = null;
      this.showAdditionalContentEnquete = false;
    },
    onAdditionalContentEvent(): void {
      this.showAdditionalContentEvent = !this.showAdditionalContentEvent;
    },
    eventSelected(event: StorePostEvent): void {
      this.event = event;
    },
    addEmployee(value: Employee[]) {
      this.selectedInterviewees = value;
    },
    pickUpEmployee(value: Employee) {
      this.selectedAwardee = value;
    },
    deletePickUpEmployee() {
      this.selectedAwardee = null;
    },
    selectPublicTarget(uuids: string[]) {
      this.publishSetting.users = uuids;
    },
    interviewConfirmed(value: boolean) {
      this.interviewMemberConfirmed = value;
    },
    changeInterviewContents(value: InterviewText[]) {
      const request = value.map((item: InterviewText) => {
        if (item.commenter) {
          const selectUser = this.selectedInterviewees.find(
            (user: Employee) => user.user_uuid === item.commenter
          );
          if (selectUser) {
            return {
              content_type: item.content_type,
              body: item.body,
              interviewee_uuid: selectUser.user_uuid,
              comment_position: selectUser.comment_position,
              user_icon: selectUser.user_icon,
              user_name: selectUser.name,
            };
          }
        }
        return {
          content_type: item.content_type,
          body: item.body,
        };
      }) as StorePostInterviewItem[];

      const response = value.map((item: InterviewText) => {
        if (item.commenter) {
          const selectUser = this.selectedInterviewees.find(
            (user: Employee) => user.user_uuid === item.commenter
          );
          if (selectUser) {
            return {
              content_type: item.content_type,
              body: item.body,
              interviewee: {
                uuid: selectUser.user_uuid,
                name: selectUser.name,
                email: '',
                user_icon: selectUser.user_icon,
                company_uuid: '',
                company_name: '',
                organization_uuid: '',
                organization_name: selectUser.organization_name,
                position_text: '',
                enrollment_text: '',
                enrollment_color: '',
                joined_year: 0,
                joined_month: 0,
              },
              comment_position: selectUser.comment_position,
            };
          }
        }
        return {
          content_type: item.content_type,
          body: item.body,
        };
      }) as AppApiResponse.InterviewContent[];
      this.requestInterviewContents = request;
      this.previewInterviewContents = response;
    },
    async addInterview(value: boolean) {
      this.addInterviewFlag = value;
      this.showInterviewRoom = value;
      const interviewees = this.selectedInterviewees.map((item: any) => ({
        interview_uuid: item.user_uuid,
        comment_position: item.comment_position,
      }));
      if (this.selectedInterviewTemplate !== 'normal') {
        const { data } = await createRoomInterview({ interviewees });
        this.roomId = this.getRoomId(data.room_url);
        // @ts-ignore
        interviewees.forEach((item: any) => {
          const params = {
            message: '',
            room_id: this.roomId,
            content_type: 'position',
            comment_position: item.comment_position,
            interview_uuid: item.interview_uuid,
          };
          addMessageInterview(params);
        });
        const post = this.buildRequestDraftPostForInternalCommunication();
        if (this.draftPostUuid) {
          await updateDraftPost(this.draftPostUuid, post);
        } else {
          this.postDraftWhenCreateInterviewRoom(post);
        }
      }
    },
    getRoomId(room_url: string): number {
      const arr = room_url.split('/');
      return parseInt(arr[arr.length - 1], 10);
    },
    createQuestionnaire(): AppApiResponse.Questionnaire | null {
      const items = [] as AppApiResponse.QuestionnaireItem[];
      let createQuestionnaire = null as AppApiResponse.Questionnaire | null;
      if (this.question != null) {
        for (let index = 0; index < this.question.items.length; index += 1) {
          items.push({
            uuid: '',
            vote_count: 0,
            users: [],
            content: this.question.items[index].content as string,
            image:
              this.question.items[index].add_image_url === ''
                ? null
                : this.question.items[index].add_image_url,
          });
        }
        createQuestionnaire = {
          uuid: '',
          can_answer: false,
          vote_count: 0,
          expire_at: this.question.expire_at,
          vote: {} as AppApiResponse.Vote,
          items,
        };
      }

      return createQuestionnaire;
    },
    createEvent(): AppApiResponse.Event | null {
      let createEvent = null as AppApiResponse.Event | null;
      if (this.event != null) {
        createEvent = {
          uuid: '',
          place: this.event.place,
          start_at: this.event.start_at,
          end_at: this.event.end_at,
          expire_at: this.event.expire_at,
          relation_post_count: 0,
          invitation_count: this.event.users.length,
          participation_count: 0,
          non_participation_count: 0,
          undecided_count: this.event.users.length,
          unanswered_count: 0,
          answer: '',
          is_required_answer: this.event.is_required_answer,
          is_invitation: true,
          participation_users: [],
        } as AppApiResponse.Event;
      }

      return createEvent;
    },
    createPreviewInterviewees(): AppApiResponse.Interviewee[] {
      return this.selectedInterviewees.map((item: Employee) => {
        return {
          uuid: item.user_uuid,
          name: item.name,
          email: '',
          user_icon: item.user_icon,
          company_uuid: '',
          company_name: '',
          organization_uuid: '',
          organization_name: item.organization_name,
          position_text: '',
          enrollment_text: '',
          enrollment_color: '',
          joined_year: 0,
          joined_month: 0,
        };
      }) as AppApiResponse.Interviewee[];
    },
    createInterview(): AppApiResponse.Interview | null {
      let createInterview = null as AppApiResponse.Interview | null;
      const interviewees = this.createPreviewInterviewees();

      if (interviewees.length > 0 || this.previewInterviewContents.length > 0)
        createInterview = {
          interviewees,
          contents: this.previewInterviewContents,
        };

      return createInterview;
    },
    createAwardee(): AppApiResponse.Awardee | null {
      let createAwardee = null as AppApiResponse.Awardee | null;

      if (this.selectedAwardee != null) {
        createAwardee = {
          uuid: this.selectedAwardee.user_uuid,
          name: this.selectedAwardee.name,
          email: '',
          user_icon: this.selectedAwardee.user_icon,
          company_uuid: '',
          company_name: '',
          organization_uuid: '',
          organization_name: this.selectedAwardee.organization_name,
          position_text: '',
          enrollment_text: '',
          enrollment_color: '',
          joined_year:
            this.selectedAwardee.joined_year ?? Number(dayjs().format('YYYY')),
          joined_month:
            this.selectedAwardee.joined_month ?? Number(dayjs().format('MM')),
        };
      }

      return createAwardee;
    },
    createPublishSetting(): AppApiResponse.PublishSetting | null {
      return this.publishSetting != null
        ? {
            ...this.publishSetting,
          }
        : null;
    },
    createPost(): AppApiResponse.Post {
      const questionnaire = this.createQuestionnaire();
      const event = this.createEvent();
      const interview = this.createInterview();
      const awardee = this.createAwardee();
      const publishSetting = this.createPublishSetting();

      const post = {
        uuid: '',
        date: dayjs().unix(),
        type: 'internal-communication' as const,
        ...this.form,
        images: this.hasImages,
        videos: this.videoUrls,
        thumbnail: this.hasThumbnail,
        like_count: 0,
        comment_count: 0,
        is_read: false,
        is_liked: false,
        is_favorite: false,
        publish_setting: publishSetting,
        user: {
          uuid: this.$accessor.userProfile.uuid,
          icon: this.$accessor.userProfile.user_icon,
          name: this.$accessor.userProfile.name,
          organization: this.$accessor.userProfile.organization_name,
        } as AppApiResponse.PostUser,
        template: this.selectedInternalCommunicationTemplate,
        event,
        questionnaire,
        interview,
        awardee,
      } as AppApiResponse.Post;

      return post;
    },
    onPreviewButtonClick(): void {
      const post = this.createPost();
      this.showPreview(post);
    },
    goToHistry() {
      this.$router.push('/admin/internal-communications/history');
    },
    showPreview(post: AppApiResponse.Post) {
      this.selectImageSrc = post.thumbnail;
      if (this.hasVideo) {
        this.thumbnailType = 'video';
      } else if (this.hasFile) {
        this.thumbnailType = 'image';
      }
      this.previewPost = post;
      this.showPreviewModal = !this.showPreviewModal;
    },
    closePreviewModal() {
      this.showPreviewModal = false;
    },
    closeDraftModal() {
      this.showDraftModal = false;
    },
    showDraft() {
      this.showDraftModal = !this.showDraftModal;
      this.fetchEmployees(10000);
    },
    saveDraftPost() {
      const post = this.buildRequestDraftPostForInternalCommunication();
      this.postDraftPosts(post);
    },
    changeStartDate(value: number) {
      if (this.publishSetting != null) this.publishSetting.start_at = value;
    },
    changeEndDate(value: number) {
      if (this.publishSetting != null) this.publishSetting.end_at = value;
    },
    async fetchEmployees(limit: number): Promise<void> {
      if (!this.$accessor.employees?.length) {
        const { data } = await employees({ limit });
        this.$accessor.setEmployees(data.users);
      }
      this.availableEmployees = this.$accessor.employees;
      if (!this.$route.query?.conditional_target) {
        this.publishSetting.users = this.availableEmployees.map(
          (user: AppApiResponse.User) => user.user_uuid
        );
      }
    },
    changeArticleImportant(value: boolean) {
      if (this.publishSetting != null) this.publishSetting.is_important = value;
    },
    onStartDateChange(value: number | null) {
      if (this.publishSetting != null) this.publishSetting.start_at = value;
    },
    onEndDateChange(value: number | null) {
      if (this.publishSetting != null) this.publishSetting.end_at = value;
    },
    async fetchPostEdit(uuid: string): Promise<void> {
      const { data } = await fetchPostEdit(uuid);
      this.defaultImages = [...data.add_image_urls];
      this.defaultVideos = [...data.add_video_urls];
      this.setForInternalCommunication(data);
      this.closeDraftModal();
    },
    clickItem(uuid: string) {
      this.draftPostUuid = uuid;
      this.fetchPostEdit(uuid);
    },
    async setForInternalCommunication(data: AppApiResponse.PostEdit) {
      this.form.title = data.title;
      this.form.content = data.content;
      this.form.awardee_user_comment = data.awardee_user_comment;
      this.fileUrls = data.add_image_urls;
      this.videoUrls = data.add_video_urls;
      const files = this.fileUrls.map((item: string) => ({
        thumbnail: item,
        main_image: item,
        type: 'image',
      }));
      const videos = this.videoUrls.map((item: string) => ({
        thumbnail: item,
        main_image: item,
        type: 'video',
      }));
      this.editFileUrls = [...files, ...videos];
      this.selectedPermission = data.permission;
      this.publishSetting = cloneDeep(data.publish_setting);
      this.question = cloneDeep(data.questionnaire);
      if (data.questionnaire != null) {
        this.showAdditionalContentEnquete = true;
      } else {
        this.showAdditionalContentEnquete = false;
      }
      this.event = cloneDeep(data.event);
      if (data.event != null) {
        this.showAdditionalContentEvent = true;
      } else {
        this.showAdditionalContentEvent = false;
      }
      this.selectedInternalCommunicationTemplate = data.template;
      this.relationalPostUuid = data.relational_post_uuid;
      this.draftFetchInterviewContents =
        data.interview != null
          ? this.setInterviewContents(data.interview.contents)
          : ([] as InterviewText[]);
      this.requestInterviewContents =
        data.interview != null
          ? this.setRequestInterviewContents(data.interview.contents)
          : ([] as AppApiResponse.InterviewContent[]);
      this.roomId = 0;
      if (data.template === 'interview') {
        if (data.room_id && data.room_id > 0) {
          this.selectedInterviewees = data.interview_room_users.room_users;
          this.roomId = data.room_id;
          this.selectedInterviewTemplate = 'message';
          this.addInterviewFlag = false;
          await this.fetchRoom(data.room_id);
        }
        const interviewUserPositions =
          typeof data.interview.user_positions === 'object'
            ? Object.values(data.interview.user_positions)
            : data.interview.user_positions;
        const interviewContents =
          typeof data.interview.contents === 'object'
            ? Object.values(data.interview.contents)
            : data.interview.contents;
        if (
          interviewContents.length === 0 &&
          interviewUserPositions.length > 0
        ) {
          const interviewContentData = interviewUserPositions[0];
          const interviewType = interviewContentData.body;
          this.selectedInterviewTemplate = 'normal';
          this.interviewMemberConfirmed = false;
          if (interviewType.interview_type === 'MAKE_MESSAGE') {
            this.selectedInterviewTemplate = 'message';
          }
          if (interviewType.step === 'confirmed') {
            this.interviewMemberConfirmed = true;
            this.addInterviewFlag = false;
            this.endAddInterviewFlag = false;
          } else if (interviewType.step === 'created') {
            this.interviewMemberConfirmed = true;
            this.addInterviewFlag = false;
            this.endAddInterviewFlag = true;
            this.showInterviewRoom = false;
          } else {
            this.interviewMemberConfirmed = false;
          }
        } else {
          this.selectedInterviewTemplate = 'normal';
          this.interviewMemberConfirmed = true;
          this.addInterviewFlag = false;
          this.endAddInterviewFlag = true;
          this.showInterviewRoom = false;
          if (data.room_id > 0) {
            this.selectedInterviewTemplate = 'message';
          }
        }
        this.selectedInterviewees = interviewUserPositions;
        if (this.selectedInterviewTemplate === 'normal') {
          this.previewInterviewContents = interviewContents;
        }
      }
      this.selectedAwardee = data.awardee
        ? this.setAwardee(data.awardee.uuid)
        : null;
      if (this.selectedInterviewees > 0) {
        this.selectedInternalCommunicationTemplate = 'interview';
      }
      this.selectedCategory = data.type;
    },
    async fetchRoom(roomId: number) {
      const { data } = await getRoomInterview(roomId);
      const mess = data.messages
        .map((item: any) => {
          const user = this.selectedInterviewees.find(
            (u: any) => u.user_uuid === item.interviewee.uuid
          );
          return Object.assign(item, {
            interviewee_uuid: user.user_uuid,
            body: item.message.origin,
            user_name: user.name,
            user_icon: user.user_icon,
            organization_name: user.organization_name,
          });
        })
        .sort((a: any, b: any) => a.created_at - b.created_at);
      this.interviewMessageRoomContents = mess;
    },
    setRequestInterviewContents(
      data: AppApiResponse.InterviewContent[]
    ): StorePostInterviewItem[] {
      const contents = [] as StorePostInterviewItem[];
      data.forEach((item: AppApiResponse.InterviewContent) => {
        if (item.content_type === 'heading') {
          contents.push({
            content_type: 'heading',
            body: item.body,
          });
        }
        if (item.content_type === 'comment' && item.interviewee != null) {
          contents.push({
            content_type: 'comment',
            body: item.body,
            interviewee_uuid: item.interviewee.uuid,
            comment_position: item.comment_position,
            user_icon: item.interviewee.user_icon,
            organization_name: item.interviewee.organization_name,
          });
        }
      });
      return contents;
    },
    setInterviewContents(
      data: AppApiResponse.InterviewContent[]
    ): InterviewText[] {
      const contents = [] as InterviewText[];
      data.forEach((item: AppApiResponse.InterviewContent) => {
        if (item.content_type === 'heading') {
          contents.push({
            kind: 'heading',
            content_type: 'heading',
            body: item.body,
          });
        }
        if (item.content_type === 'comment' && item.interviewee != null) {
          contents.push({
            kind: 'comment',
            content_type: 'comment',
            body: item.body,
            commenter: item.interviewee.uuid,
          });
        }
      });
      return contents;
    },
    setInterviewee(data: AppApiResponse.InterviewContent[] | null): Employee[] {
      const interviewLists = [] as Employee[];

      if (data != null) {
        const comments = data.filter(
          (item: AppApiResponse.InterviewContent) =>
            item.content_type === 'comment'
        );

        comments.forEach((item: AppApiResponse.InterviewContent) => {
          if (item.interviewee != null && item.comment_position != null) {
            interviewLists.push({
              user_uuid: item.interviewee.uuid,
              name: item.interviewee.name,
              user_icon: item.interviewee.user_icon,
              organization_uuid: item.interviewee.organization_uuid,
              organization_name: item.interviewee.organization_name,
              joined_year: item.interviewee.joined_year,
              joined_month: item.interviewee.joined_year,
              comment_position: item.comment_position,
            });
          }
        });
        return interviewLists;
      }
      return interviewLists;
    },
    setAwardee(uuid: string | null): Employee | null {
      if (uuid != null) {
        const user = this.availableEmployees.find(
          (item: Employee) => uuid === item.user_uuid
        );
        return user != null ? user : null;
      }
      return null;
    },
    endInterviewButtonClick() {
      this.addInterviewFlag = false;
      this.endAddInterviewFlag = true;
      this.showInterviewRoom = false;
    },
    editInterviewContents(value: boolean) {
      this.endAddInterviewFlag = value;
      this.addInterviewFlag = true;
      if (this.selectedInterviewTemplate === 'message') {
        this.showInterviewRoom = true;
      }
    },
    async fetchRelationalPost(uuid: string) {
      try {
        const { data } = await fetchPost(uuid);
        this.relationalPostUuid = data.uuid;
      } catch (e) {
        alert('記事詳細の取得に失敗しました。');
      }
    },
    async fetchPostTargetUsers(uuid: string) {
      try {
        const { data } = await fetchPostTargetUsers(uuid);
        // if (!this.availableEmployees || !this.availableEmployees.length) {
        //   this.availableEmployees = data.target_users;
        // }
        this.publishSetting.users = data.target_users;
        const internalTargetUsers = {
          ...this.$accessor.internalTargetUsers,
        };
        internalTargetUsers[uuid] = data.target_users;
        this.$accessor.setInternalTargetUsers(internalTargetUsers);
      } catch (e) {
        alert('記事詳細の取得に失敗しました。');
      }
    },
    async fetchOrganizations(): Promise<void> {
      const { data } = await fetchOrganizations({
        independent: true,
      });
      this.organizations = data.organizations;
      this.addOrganizations.push(...data.organizations);
    },
    async sendMessage(mess: InterviewText): void {
      if (mess.body.trim() === '') {
        return;
      }
      const params = {
        message: mess.body.trim(),
        room_id: this.roomId,
        content_type: mess.content_type,
        comment_position: mess.comment_position,
      };
      await addMessageInterview(params);
    },
    receiveEventMessage(messageData: any) {
      if (messageData.type === 'add') {
        this.interviewMessageRoomContents.push(messageData.data);
      }
    },
    async editMessage(index: number, message: object): void {
      const newMessage = {
        ...this.interviewMessageRoomContents[index],
        ...message,
      };
      if (newMessage.body.trim() === '') {
        return;
      }
      const params = {
        message: newMessage.body.trim(),
        content_type: newMessage.content_type,
      };
      if (!newMessage.id) {
        return;
      }
      editMessageInterview(newMessage.id, params);
    },
    async deleteMessage(index: number): void {
      const message = this.interviewMessageRoomContents[index];
      if (!message.id) {
        return;
      }
      deleteMessageInterview(message.id);
    },
    async changeMessageType(index: number): void {
      const oldType = this.interviewMessageRoomContents[index].content_type;
      this.interviewMessageRoomContents[index].content_type =
        oldType === 'heading' ? 'comment' : 'heading';
      const newMessage = this.interviewMessageRoomContents[index];
      const params = {
        message: newMessage.body,
        content_type: newMessage.content_type,
      };
      if (!newMessage.id) {
        return;
      }
      await editMessageInterview(newMessage.id, params);
    },
    async closeInterviewRoom(roomId: number) {
      if (roomId > 0) {
        this.roomId = 0;
        await deleteRoomInterview(roomId);
      }
    },
    async changeTemplate(event: string) {
      await this.closeInterviewRoom(this.roomId);
      this.clearInternalCommunicationPost();
      this.selectedInternalCommunicationTemplate = event;
    },
    async changeTypeInterview(event: string) {
      await this.closeInterviewRoom(this.roomId);
      this.clearInternalCommunicationPost();
      this.selectedInterviewTemplate = event;
    },
  },
});
</script>

<style lang="scss" scoped>
.content-body {
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  padding: 0 40px;
}

.public-setting-title {
  background-color: $white_1;
  padding: 18px 24px 17px;
  font-size: 15px;
  font-weight: 600;
  margin: 0 -40px 31px;
  color: $gray_blue_4;
}

.category-box {
  padding-top: 18px;
  padding-bottom: 18px;

  .heading {
    font-size: 13px;
    font-weight: 600;
  }

  .categories {
    margin-top: 8px;
    display: flex;
    font-size: 13px;
    color: $link_color;

    li {
      border: 1px solid $link_color;
      border-radius: 14px;
      height: 28px;
      padding: 0 28px;
      text-align: center;
      line-height: 28px;
      cursor: pointer;
    }

    li:not(:last-child) {
      margin-right: 16px;
    }

    .active {
      color: $true_white;
      background-color: $link_color;
    }
  }
}

.upload-files-box {
  margin-top: 6px;
}

.post-box {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  border-bottom: solid 1px $ruled_line;
  padding-bottom: 30px;
  margin-bottom: 24px;

  .input {
    width: 100%;
    appearance: none;
    border: none;
    padding: 20px 0;
    color: $main_color;
  }

  input.input {
    border-top: 1px solid $ruled_line;
    border-bottom: 1px solid $ruled_line;
  }

  .input::placeholder {
    color: #585a69;
    opacity: 0.5;
    font-weight: 300;
  }

  .input-awardee-comment {
    width: 100%;
    height: 239px;
    appearance: none;
    padding: 20px;
    color: $main_color;
    border: 1px solid #e4e5ed;
    border-radius: 4px;
  }

  .selected-employee {
    font-size: 15px;
    font-weight: 600;
    color: $main_color;
    margin: 14px 0;
  }
}

.bottom-menu {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 3px $light_gray;
  width: 150%;
  padding: 15px 0 0 241px;
  height: 70px;
  word-spacing: 11px;

  .post-button {
    background-color: $light_gray_blue_7;
    color: $gray_blue_4;
    height: 40px;

    &:hover {
      background-color: $light_gray_blue_8;
    }
  }

  .button-large {
    width: 260px;

    &.interview {
      margin-left: 345px;
    }
  }

  .button-small {
    width: 197px;
  }
}

.additional-post {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 120px;

  button {
    min-width: 350px;

    &:hover {
      background-color: $light_gray_blue_3;
    }

    &:only-child {
      width: 100%;
    }
  }
}

.heading-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .history-button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -40px 0 0;
    width: 200px;
    height: 44px;
    position: relative;
  }

  .arrow-left {
    position: absolute;
    left: 19px;
    width: 8px;
  }
}

.page-header {
  margin: 0 0 33px;
}

.public-range {
  margin: 0 0 30px;
}

.public-target {
  margin: 0 0 40px;
}

.select-template {
  margin: 0 -40px 30px;
}

.awardee-comment {
  margin-top: 22px;
}

.triangle {
  margin-left: 445px;
  margin-top: 5px;
}

.triangle-below {
  width: 0;
  height: 0;
  border-left: 7.5px solid transparent;
  border-right: 7.5px solid transparent;
  border-bottom: 11.5px solid #e4e5ed;
}

.triangle-inner {
  width: 0;
  height: 0;
  margin-top: -9.7px;
  position: absolute;
  z-index: 9;
  margin-bottom: -2px;
  border-left: 7.5px solid transparent;
  border-right: 7.5px solid transparent;
  border-bottom: 11.5px solid white;
}
</style>
