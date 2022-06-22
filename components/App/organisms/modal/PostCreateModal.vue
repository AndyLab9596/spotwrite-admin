<template>
  <transition name="modal" appear @enter="onEnterModal" @leave="onLeaveModal">
    <ValidationObserver v-slot="{ invalid, passes }" tag="div">
      <div class="modal-overlay" @click.self="onClose">
        <div
          v-show="
            !showInterviewRoom ||
              selectedInternalCommunicationTemplate !== 'interview' ||
              selectedInterviewTemplate === 'normal'
          "
          ref="modalWindow"
          class="modal-window"
        >
          <div class="icon-cross-wrapper" @click="onClose">
            <img src="/app/icon/cross-white.svg" class="icon-cross" />
          </div>
          <div class="modal-contents">
            <div>
              <PostCreateModalHeader
                :category="selectedCategory"
                :theme="theme"
                :internal-communication-templates="
                  internalCommunicationTemplates
                "
                :template="selectedInternalCommunicationTemplate"
                :disabledClickTemplateInterviewThankYouPickup="
                  disabledTemplateInterviewThankYouPickup
                "
                :disabledClick="disabledTemplateAndCategory"
                @update-template="changeTemplate"
              />
              <div class="content-body">
                <div class="category-box">
                  <div class="heading">
                    カテゴリ選択
                  </div>
                  <ul class="categories">
                    <li
                      v-for="(category, key) in categories"
                      :key="`category_${key}`"
                      :class="{ active: key === selectedCategory }"
                      @click="onCategoryClick(key)"
                    >
                      {{ category }}
                    </li>
                  </ul>
                  <select-type-interview
                    v-if="
                      selectedCategory === 'internal-communication' &&
                        selectedInternalCommunicationTemplate === 'interview'
                    "
                    :member-confirmed="interviewMemberConfirmed"
                    :select-template="selectedCategory"
                    :select-template-interview="selectedInterviewTemplate"
                    :disabled-click="disabledTemplateAndCategory"
                    @onChangeTemplateInterview="changeTypeInterview"
                  />
                </div>
                <div class="upload-files-box">
                  <FileUpload
                    :edit-file-urls="editFileUrls"
                    :internal-communication-template="
                      selectedInternalCommunicationTemplate
                    "
                    @upload="onFileUpload"
                    @videoUpload="onVideoUpload"
                    @removeFile="onFileRemove"
                    @removeVideo="onVideoRemove"
                    @changeSort="onChangeSort"
                    @changeIsLoadingFile="onChangeIsLoadingFile"
                  />
                </div>
                <div class="post-box">
                  <ValidationProvider
                    v-if="selectedCategory === 'department-news'"
                    rules="required"
                  >
                    <!-- INFO: vee-validateで検査するためにコンポーネント内で利用はしていないがv-modelで変数を渡している -->
                    <SelectOrganization
                      v-model="selectedOrganization"
                      :organizations="organizations"
                      @select="onOrganizationSelect"
                      >{{ selectedOrganizationName }}</SelectOrganization
                    >
                  </ValidationProvider>
                  <ValidationProvider
                    v-if="selectedCategory === 'community-news'"
                    rules="required"
                  >
                    <!-- INFO: vee-validateで検査するためにコンポーネント内で利用はしていないがv-modelで変数を渡している -->
                    <SelectCommunity
                      v-model="selectedCommunity"
                      :communities="communities"
                      @select="onCommunitySelect"
                    >
                      {{ selectedCommunityName }}</SelectCommunity
                    >
                  </ValidationProvider>
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
                  <template v-if="shouldDisplaySelectedAwardee">
                    <p class="selected-employee">{{ selectedType }}対象社員</p>
                    <ValidationProvider
                      ref="selectEmployeeValidatorRef"
                      v-slot="{ errors, validate }"
                      immediate
                      rules="required"
                    >
                      <SelectEmployee
                        :items="availableEmployees"
                        :selected-item="selectedAwardee"
                        @select="pickUpEmployee($event, validate)"
                        @delete="deletePickUpEmployee(validate)"
                      />
                      <div v-if="errors.length > 0" class="error-text">
                        社員を選択してください。
                      </div>
                    </ValidationProvider>
                  </template>
                  <template
                    v-if="shouldDisplaySelectedAwardee"
                    class="awardee-comment"
                  >
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
                  <div class="post-rules-box">
                    <div
                      v-if="thisRule && thisRule.min_word_count"
                      class="validation word-count"
                    >
                      <span :class="{ 'error-text': hasWordCountError }">{{
                        currentWordCount
                      }}</span
                      ><span class="divider">/</span
                      ><span>{{ thisRule.min_word_count }}</span>
                      文字以上の文章
                      <CheckIcon :checked="!hasWordCountError" class="icon" />
                    </div>
                    <div
                      v-if="thisRule && thisRule.min_photo_count"
                      class="validation photo-count"
                    >
                      <span :class="{ 'error-text': hasFileCountError }">{{
                        currentFileCount
                      }}</span
                      ><span class="divider">/</span
                      ><span>{{ thisRule.min_photo_count }}</span
                      >枚以上の写真
                      <CheckIcon :checked="!hasFileCountError" class="icon" />
                    </div>
                  </div>
                </div>
                <!-- 付帯コンテンツ -->
                <AdditionalContentEnquete
                  v-if="showAdditionalPost && showAdditionalContentEnquete"
                  :questionnaire="question"
                  :organizations="addOrganizations"
                  :edit-post-uuid="editPostUuid"
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
                  :edit-post-uuid="editPostUuid"
                  :employees-list="availableEmployees"
                  :organizations="addOrganizations"
                  @onEventClose="onAdditionalContentEvent"
                  @onEventSelected="eventSelected"
                >
                </AdditionalContentEvent>
                <div
                  v-if="showAdditionalPost"
                  class="additional-post questionnare-event"
                >
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
                    icon-src="/app/icon/Icon-add-event.svg"
                    @click="onAdditionalContentEvent"
                  >
                    イベント設定
                  </PostAddContentsButton>
                </div>
                <div v-if="selectedCategory === 'internal-communication'">
                  <AdditionalContentInterview
                    v-if="selectedInternalCommunicationTemplate === 'interview'"
                    :interviewee="selectedInterviewees"
                    :interview-contents="draftFechInterviewContents"
                    :add-interview-flag="addInterviewFlag"
                    :end-add-interview-flag="endAddInterviewFlag"
                    :request-interview-contents="interviewContents"
                    :interview-template="selectedInterviewTemplate"
                    :post-title="form.title"
                    :member-confirmed="interviewMemberConfirmed"
                    :disabled-resume-interview="disabledEditInterviewMessage"
                    @selectEmployee="addEmployee"
                    @changeContents="changeInterviewContents"
                    @addInterview="addInterview"
                    @editInterviewContent="editInterviewContents"
                    @interviewMemberConfirmed="interviewConfirmed"
                  />
                </div>
              </div>
              <div v-if="Object.keys(relatedPost).length" class="related-post">
                <div class="related-post__leftpanel">
                  <span v-if="relatedPost.event">関連イベント</span>
                  <span v-else>関連記事</span>
                </div>
                <div class="related-post__inner">
                  <div v-if="relatedPost.event" class="related-post__header">
                    <div class="related-post__event-date">
                      {{
                        formattedDateTitle(
                          relatedPost.event.start_at,
                          relatedPost.event.end_at
                        )
                      }}
                    </div>
                  </div>
                  <div class="related-post__content">
                    {{ relatedPost.title }}
                  </div>
                </div>
                <BaseButton class="close" @click="removeRelationPost">
                  <svg
                    id="Icon_close_w"
                    data-name="Icon/close_w"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                  >
                    <circle
                      id="Ellipse_215"
                      data-name="Ellipse 215"
                      cx="8"
                      cy="8"
                      r="8"
                      fill="#fff"
                    />
                    <g
                      id="Group_1338"
                      data-name="Group 1338"
                      transform="translate(5 5)"
                    >
                      <line
                        id="Line_356"
                        data-name="Line 356"
                        x2="6"
                        y2="6"
                        fill="none"
                        stroke="#7e8195"
                        stroke-linecap="round"
                        stroke-miterlimit="10"
                        stroke-width="1.114"
                      />
                      <line
                        id="Line_357"
                        data-name="Line 357"
                        x1="6"
                        y2="6"
                        fill="none"
                        stroke="#7e8195"
                        stroke-linecap="round"
                        stroke-miterlimit="10"
                        stroke-width="1.114"
                      />
                    </g>
                  </svg>
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
        <div
          v-show="
            showInterviewRoom &&
              selectedInternalCommunicationTemplate === 'interview' &&
              selectedInterviewTemplate !== 'normal'
          "
          class="modal-window-interview"
        >
          <div class="icon-cross-wrapper" @click="onClose">
            <img src="/app/icon/cross-white.svg" class="icon-cross" />
          </div>
          <div class="modal-contents-interview">
            <InterviewMessageRoom
              v-show="
                showInterviewRoom &&
                  selectedInternalCommunicationTemplate === 'interview' &&
                  selectedInterviewTemplate !== 'normal'
              "
              class="content-body-interview"
              :selected-interviewees="selectedInterviewees"
              :interview-message-room-contents="interviewMessageRoomContents"
              :room-id="roomId"
              :show-interview-room="showInterviewRoom"
              @submit="endInterviewButtonClick"
              @sendMessage="sendMessage"
              @editMessage="editMessage"
              @deleteMessage="deleteMessage"
              @changeMessageType="changeMessageType"
              @receiveEventMessage="receiveEventMessage"
            />
          </div>
        </div>
        <div
          v-show="
            !showInterviewRoom ||
              selectedInternalCommunicationTemplate !== 'interview' ||
              selectedInterviewTemplate === 'normal'
          "
          ref="bottomMenu"
          class="bottom-menu"
        >
          <div v-if="!showButtonEndInterview">
            <BaseButton
              inverse
              size="large"
              class="post-button"
              @click="showDraft"
            >
              下書き一覧
            </BaseButton>
            <BaseButton
              v-show="!postEditFlag"
              inverse
              size="large"
              class="post-button"
              :disabled="form.title === '' || isLoadingFile || postEditFlag"
              @click="saveDraftPost"
            >
              下書き保存
            </BaseButton>
            <BaseButton
              inverse
              size="large"
              class="post-button"
              :disabled="isLoadingFile"
              @click="onPreviewButtonClick"
            >
              プレビュー
            </BaseButton>
            <BaseButton
              v-if="selectedCategory === 'internal-communication'"
              inverse
              size="large"
              class="post-button"
              @click="onPublishSettingButtonClick"
            >
              公開設定をする
            </BaseButton>
            <BaseButton
              v-if="
                selectedCategory !== 'internal-communication' &&
                  editPostUuid === ''
              "
              inverse
              size="large"
              class="post-button"
              :disabled="invalid || thisRuleFailed"
              @click="passes(onPostButtonClick)"
            >
              投稿
            </BaseButton>
            <BaseButton
              v-if="
                selectedCategory !== 'internal-communication' &&
                  editPostUuid !== ''
              "
              inverse
              size="large"
              class="post-button"
              :disabled="invalid || thisRuleFailed"
              @click="passes(onUpdateButtonClick)"
            >
              更新
            </BaseButton>
          </div>
          <div
            v-else-if="
              showButtonEndInterview &&
                selectedInternalCommunicationTemplate === 'interview'
            "
          >
            <BaseButton
              inverse
              size="large"
              class="post-button"
              @click="endInterviewButtonClick"
            >
              インタビューを終了
            </BaseButton>
          </div>
        </div>
      </div>
      <PostPublicModal
        v-if="publicationSettingModal"
        :selected-permission="selectedPermission"
        :has-validation-error="thisRuleFailed"
        :vee-validate-invalid="invalid"
        :publish-setting="publishSetting"
        :employees="availableEmployees"
        :edit-post-uuid="editPostUuid"
        @close="publicationSettingModal = false"
        @post="onPostButtonOnPublicationSettingModalClick"
        @editPost="onUpdateButtonOnPublicationSettingModalClick"
        @changeStartDate="onStartDateChange"
        @changeEndDate="onEndDateChange"
        @selectPublicRange="selectPublicRange"
        @selectPublicTarget="selectPublicTarget"
        @changeArticleImportant="changeArticleImportant"
      />
      <PostPreviewModal
        v-if="showPreviewModal"
        :post="previewPost"
        :selected-image-src="selectImageSrc"
        :selected-image-src-type="thumbnailType"
        @closePreviewModal="onPreviewModalClose"
      />
      <PostDraftModal
        v-if="showDraftModal"
        :room-id="roomId"
        :draft-post-uuid="fetchPostEditUUID"
        @close="closeDraftModal"
        @click="fetchPostEdit"
      />
    </ValidationObserver>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { merge } from 'lodash';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import dayjs from '@/libs/dayjs';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import PostAddContentsButton from '@/components/App/atoms/buttons/PostAddContentsButton.vue';
import CheckIcon from '@/components/App/atoms/icons/CheckIcon.vue';
import AdditionalContentEnquete from '@/components/App/organisms/post/PostCreateModal/AdditionalContentEnquete.vue';
import FileUpload from '@/components/App/organisms/post/FileUpload.vue';
import PostCreateModalHeader from '@/components/App/organisms/post/PostCreateModal/Header.vue';
import AdditionalContentInterview from '@/components/App/organisms/post/PostCreateModal/AdditionalContentInterview.vue';
import InterviewMessageRoom from '@/components/App/organisms/post/PostCreateModal/InterviewMessageRoom.vue';
import SelectTypeInterview from '@/components/App/organisms/post/PostCreateModal/SelectOptionInterview.vue';
import SelectOrganization from '@/components/App/organisms/post/PostCreateModal/SelectOrganization.vue';
import SelectCommunity from '@/components/App/organisms/post/PostCreateModal/SelectCommunity.vue';
import AdditionalContentEvent from '@/components/App/organisms/post/PostCreateModal/AdditionalContentEvent.vue';
import SelectEmployee from '@/components/App/organisms/post/PostCreateModal/SelectEmployee.vue';
import PostPublicModal from '@/components/App/organisms/modal/PostPublicModal.vue';
import PostPreviewModal from '@/components/App/organisms/modal/PostPreviewModal.vue';
import PostDraftModal from '@/components/App/organisms/modal/PostDraftModal.vue';
import cloneDeep from 'lodash/cloneDeep';
import {
  fetchCurrentTheme,
  fetchPostRules,
  fetchMyCommunities,
  fetchOrganizations,
  fetchPostEdit,
  storeCommunityNewsPost,
  storeDepartmentNewsPost,
  storeMyEpisodePost,
  storeInternalCommunicationPost,
  storeDraftMyEpisodePost,
  storeDraftInternalCommunicationPost,
  updateDraftPost,
  storeDraftDepartmentNewsPost,
  storeDraftCommunityNewsPost,
  updateMyEpisodePosts,
  updateDepartmentNewsPosts,
  updateCommunityNewsPosts,
  updateInternalCommunicationPosts,
  employees,
  createRoomInterview,
  addMessageInterview,
  editMessageInterview,
  deleteMessageInterview,
  getRoomInterview,
  deleteRoomInterview,
} from '@/libs/api/app';

type PostTheme = AppApiResponse.PostTheme;

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

type InternalCommunicationTemplate = typeof internalCommunicationTemplates[number];

type PostCategoryKeyValue = {
  [key in PostCategory]: string;
};

const categoryRuleMap: {
  [key in keyof PostCategoryKeyValue]:
    | keyof AppApiResponse.PostRules
    | undefined;
} = {
  'my-episode': 'my_episode',
  'internal-communication': undefined,
  'department-news': 'team_episode',
  'community-news': 'community_team_episode',
};

type Post = AppApiResponse.Post;

type Employee = AppApiResponse.Employee & {
  comment_position?: CommentPosition;
};

type CommentPosition = 'left' | 'right';

type Awardee = AppApiResponse.Awardee;

type Contents = {
  kind: 'comment' | 'heading';
  commenter?: string;
  body: string;
  user_icon: string;
  content_type?: string;
  comment_position?: string;
  interviewee_uuid?: string;
  id?: number;
  user_name?: string;
  organization_name?: string;
  created_at?: string;
};

type InterviewText = Contents;

type StoreMyEpisodePost = AppApiRequest.StoreMyEpisodePost;
type StoreDepartmentNewsPost = AppApiRequest.StoreDepartmentNewsPost;
type StoreCommunityNewsPost = AppApiRequest.StoreCommunityNewsPost;
type StoreInternalCommunicationPost = AppApiRequest.StoreInternalCommunicationPost;

type StorePostQuestionnaire = AppApiRequest.StorePostQuestionnaire;
type StorePostEvent = AppApiRequest.StorePostEvent;
type StorePostInterview = AppApiRequest.StoreInternalCommunicationPost;
type StorePostInterviewItem = AppApiRequest.StoreInterviewItem;
type UploadImage = AppApiResponse.uploadImage;

export default Vue.extend({
  components: {
    ValidationObserver,
    ValidationProvider,
    BaseButton,
    PostAddContentsButton,
    PostCreateModalHeader,
    AdditionalContentInterview,
    FileUpload,
    CheckIcon,
    SelectEmployee,
    SelectOrganization,
    SelectCommunity,
    AdditionalContentEnquete,
    AdditionalContentEvent,
    PostPreviewModal,
    PostPublicModal,
    PostDraftModal,
    SelectTypeInterview,
    InterviewMessageRoom,
  },
  props: {
    editPostUuid: {
      type: String,
      required: false,
      default: '',
    },
    relatedPostUuid: {
      type: String,
      required: false,
      default: '',
    },
    currentRelatedPost: {
      type: Object as PropType<AppApiResponse.Post>,
      required: false,
      default: null,
    },
  },
  data: () => ({
    categories: {
      'my-episode': 'マイエピソード',
      'internal-communication': '社内連絡投稿',
      'department-news': '組織ニュース',
      'community-news': 'コミュニティニュース',
    } as PostCategoryKeyValue,
    selectedCategory: 'my-episode' as PostCategory,
    internalCommunicationTemplates: {
      none: '選択なし',
      interview: 'インタビュー',
      pickup: 'PICK UP',
      thankyou: 'ありがとう',
    },
    templateInterview: [
      {
        id: 'normal',
        name: '普通に作る',
      },
      {
        id: 'message',
        name: 'メッセージで作る',
      },
    ],
    selectedInternalCommunicationTemplate: 'none' as InternalCommunicationTemplate,
    selectedInterviewTemplate: 'normal' as string,
    theme: {
      title: '',
      example: '',
    } as PostTheme,
    fileUrls: [] as string[],
    editFileUrls: [] as UploadImage[],
    videoUrls: [] as string[],
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
    rules: undefined as AppApiResponse.PostRules | undefined,
    organizations: [] as AppApiResponse.Organization[],
    addOrganizations: [{ name: '全員', uuid: null }] as [{}],
    communities: [] as AppApiResponse.Community[],
    showAdditionalPost: true as boolean,
    showAdditionalContentEnquete: false as boolean,
    showAdditionalContentEvent: false as boolean,
    question: null as StorePostQuestionnaire | null,
    event: null as StorePostEvent | null,
    requestInterviewContents: [] as StorePostInterviewItem[],
    previewInterviewContents: [] as AppApiResponse.InterviewContent[],
    publicationSettingModal: false as boolean,
    showDraftModal: false as boolean,
    showPreviewModal: false as boolean,
    previewPost: {} as AppApiResponse.Post,
    selectImageSrc: '' as string,
    availableEmployees: [] as Employee[],
    selectedInterviewees: [] as Employee[],
    selectedAwardee: null as Employee | null,
    relationalPostUuid: '' as string | null,
    draftFechInterviewContents: [] as InterviewText[],
    defaultImages: [] as string[],
    defaultVideos: [] as string[],
    thumbnailType: '' as string,
    fetchPostEditUUID: '' as string | null,
    postEditFlag: false as boolean,
    isDraftFlag: false as boolean,
    relatedPost: {} as AppApiResponse.Post,
    inComponentRelatedPostUUID: '' as string,
    isLoadingFile: false as boolean,
    interviewMessageRoomContents: [] as StorePostInterviewItem[],
    interviewMemberConfirmed: false as boolean,
    addInterviewFlag: false as boolean,
    endAddInterviewFlag: false as boolean,
    showInterviewRoom: false as boolean,
    disabledTemplateAndCategory: false as boolean,
    disabledEditInterviewMessage: false as boolean,
    disabledTemplateInterviewThankYouPickup: false as boolean,
    showButtonEndInterview: false as boolean,
    roomId: 0 as number,
  }),
  computed: {
    currentWordCount(): number {
      return this.form.content.length;
    },
    currentFileCount(): number {
      return this.fileUrls.length;
    },
    hasWordCountError(): boolean {
      if (!this.thisRule || !('min_word_count' in this.thisRule)) {
        return false;
      }
      return this.currentWordCount < this.thisRule.min_word_count;
    },
    hasSelectedAwardee(): boolean {
      return (
        this.selectedAwardee != null &&
        Object.keys(this.selectedAwardee).length > 0
      );
    },
    hasFileCountError(): boolean {
      if (!this.thisRule || !('min_photo_count' in this.thisRule)) {
        return false;
      }
      return this.currentFileCount < this.thisRule.min_photo_count;
    },
    ruleByCategory(): keyof AppApiResponse.PostRules | undefined {
      return categoryRuleMap[this.selectedCategory];
    },
    thisRule(): AppApiResponse.PostRule | undefined {
      if (!this.rules || !this.selectedCategory || !this.ruleByCategory) {
        return undefined;
      }
      return this.rules[this.ruleByCategory];
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
        return comment.length > 0;
      }
      return false;
    },
    hasImages(): string[] {
      return this.fileUrls.length === 0 ? [] : this.fileUrls;
    },
    hasInternalCommunicationError(): boolean {
      let interviewError = false;
      let awardee = false;
      if (this.selectedInternalCommunicationTemplate === 'interview') {
        interviewError = !this.hasInterview;
      }

      if (
        this.selectedInternalCommunicationTemplate === 'pickup' ||
        this.selectedInternalCommunicationTemplate === 'thankyou'
      )
        awardee = !this.hasSelectedAwardee;
      return interviewError || awardee || this.isLoadingFile;
    },
    thisRuleFailed(): boolean {
      let uuidDoesNotExistError = false;
      let expireAtError = false;
      let hasItemsError = false;

      if (this.selectedCategory === 'department-news') {
        uuidDoesNotExistError = this.selectedOrganization === null;
      }
      if (this.selectedCategory === 'community-news') {
        uuidDoesNotExistError = this.selectedCommunity === null;
      }
      if (this.question) {
        if (
          this.question.items[0].content === '' ||
          this.question.items[1].content === ''
        )
          hasItemsError = true;

        if (Number(this.question.expire_at) <= dayjs(dayjs(new Date())).unix())
          expireAtError = true;
      }
      return (
        this.hasWordCountError ||
        this.hasFileCountError ||
        uuidDoesNotExistError ||
        expireAtError ||
        hasItemsError ||
        !this.isAwardeeSelected ||
        this.isLoadingFile
      );
    },
    isAwardeeSelected(): boolean {
      if (
        this.selectedCategory !== 'internal-communication' ||
        this.selectedInternalCommunicationTemplate !== 'pickup'
      ) {
        return true;
      }
      return this.selectedAwardee !== null;
    },
    selectedOrganizationName(): string {
      return this.selectedOrganization !== null
        ? this.selectedOrganization.name
        : '部署を選択してください';
    },
    selectedCommunityName(): string {
      return this.selectedCommunity !== null
        ? this.selectedCommunity.name
        : 'コミュニティを選択してください';
    },
    selectedType(): string {
      return this.selectedInternalCommunicationTemplate === 'pickup'
        ? 'PICK UP'
        : 'ありがとう';
    },
    shouldDisplaySelectedAwardee(): boolean {
      return (
        this.selectedCategory === 'internal-communication' &&
        (this.selectedInternalCommunicationTemplate === 'pickup' ||
          this.selectedInternalCommunicationTemplate === 'thankyou')
      );
    },
    uploadedImages(): string[] {
      return this.fileUrls.length === 0 ? [] : this.fileUrls;
    },
    hasVideo(): boolean {
      return this.videoUrls.length > 0;
    },
    hasFile(): boolean {
      return this.fileUrls.length > 0;
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
    addNewFileUrls(): string[] {
      return this.fileUrls.length === 0 ? [] : this.fileUrls;
    },
    removedFileUrls(): string[] {
      return [...this.defaultImages];
    },
    addNewVideoUrls(): string[] {
      return this.videoUrls.length === 0 ? [] : this.videoUrls;
    },
    removedVideoUrls(): string[] {
      return [...this.defaultVideos];
    },
    allEditFileUrls(): {} {
      const images = this.fileUrls.map((f: String) => ({
        thumbnail: f,
        type: 'image',
        main_image: f,
      }));
      const videos = this.videoUrls.map((f: String) => ({
        thumbnail: '',
        type: 'video',
        main_image: f,
      }));
      return [...images, ...videos];
    },
    formattedDateTitle() {
      return (startDate: number, endDate: number): string => {
        if (
          dayjs.unix(startDate).format('YYYY/M/D') ===
          dayjs.unix(endDate).format('YYYY/M/D')
        ) {
          const startAt = dayjs.unix(startDate).format('hh:mm');
          const endAt = dayjs.unix(endDate).format('hh:mm');

          return `${dayjs
            .unix(startDate)
            .format('YYYY/M/D（ddd）')}${startAt}〜${endAt}開催`;
        }

        return `${dayjs
          .unix(startDate)
          .format('YYYY/M/D（ddd）hh:mm')}〜${dayjs
          .unix(endDate)
          .format('YYYY/M/D（ddd）hh:mm')}`;
      };
    },
    interviewContents(): InterviewText[] {
      if (this.selectedInterviewTemplate === 'normal') {
        return this.requestInterviewContents;
      }
      return this.interviewMessageRoomContents;
    },
  },
  watch: {
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
  },
  created() {
    this.fetchCurrentTheme();
    this.fetchPostRules();
    this.fetchOrganizations();
    this.fetchMyCommunities();
    this.fetchEmployees(10000).then(() => {
      if (this.editPostUuid !== '') {
        this.fetchPostEdit(this.editPostUuid);
      }
    });
    if (this.currentRelatedPost) {
      this.relatedPost = this.currentRelatedPost;
      this.inComponentRelatedPostUUID = this.relatedPostUuid;
    }
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
    onClose(type: any) {
      let emptyContent = true;
      if (
        this.form.title ||
        this.form.content ||
        this.fileUrls.length > 0 ||
        this.videoUrls.length > 0
      ) {
        emptyContent = false;
      }
      if (emptyContent || type === 'submit') {
        this.$emit('close');
        return;
      }
      if (window.confirm('本当に記事を閉じますか？')) {
        this.$emit('close');
      }
    },
    onCategoryClick(key: PostCategory): void {
      if (this.disabledTemplateAndCategory) {
        return;
      }
      if (key === this.selectedCategory) {
        return;
      }
      this.selectedCategory = key;
      if (key !== 'internal-communication') {
        this.selectedInternalCommunicationTemplate = 'none';
      }
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
    onFileRemove(url: string): void {
      this.fileUrls.splice(this.fileUrls.indexOf(url), 1);
      this.editFileUrls.splice(this.fileUrls.indexOf(url), 1);
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
    onVideoRemove(url: string): void {
      this.videoUrls.splice(this.videoUrls.indexOf(url), 1);
    },
    onChangeSort(sortedAllEditFileUrls: AppApiResponse.uploadImage[]): void {
      this.fileUrls = sortedAllEditFileUrls
        .filter((f: AppApiResponse.uploadImage) => f.type === 'image')
        .map((f: AppApiResponse.uploadImage) => f.main_image);
      this.videoUrls = sortedAllEditFileUrls
        .filter((f: AppApiResponse.uploadImage) => f.type === 'video')
        .map((f: AppApiResponse.uploadImage) => f.main_image);
    },
    onChangeIsLoadingFile(isLoadingFile: boolean): void {
      this.isLoadingFile = isLoadingFile;
    },
    onPublishSettingButtonClick(): void {
      this.publicationSettingModal = true;
    },
    onPostButtonClick(): void {
      if (this.selectedCategory === 'my-episode') {
        this.onPostButtonClickForMyEpisode();
      }
      if (this.selectedCategory === 'department-news') {
        this.onPostButtonClickForDepartmentNews();
      }
      if (this.selectedCategory === 'community-news') {
        this.onPostButtonClickForCommunityNews();
      }
    },
    onUpdateButtonClick() {
      if (this.selectedCategory === 'my-episode') {
        this.onUpdateButtonClickForMyEpisode();
      }
      if (this.selectedCategory === 'department-news') {
        this.onUpdateButtonClickForDepartmentNews();
      }
      if (this.selectedCategory === 'community-news') {
        this.onUpdateButtonClickForCommunityNews();
      }
    },
    async fetchCurrentTheme(): Promise<void> {
      const { data } = await fetchCurrentTheme();
      this.theme = data;
    },
    async fetchPostRules(): Promise<void> {
      const { data } = await fetchPostRules();
      this.rules = data;
    },
    async fetchOrganizations(): Promise<void> {
      // FIXME: アプリ側の現状の実装にあわせてとりあえず組織の一覧を取得するようにしています。自分の属する組織が取得できるAPIが完成次第さしかえてください。
      const { data } = await fetchOrganizations();
      this.organizations = data.organizations;
      this.addOrganizations.push(...data.organizations);
    },
    async fetchMyCommunities(): Promise<void> {
      const { data } = await fetchMyCommunities(
        this.$accessor.userProfile.uuid
      );
      this.communities = data.communities;
    },
    async onDraftSaveButtonClickForMyEpisode(
      payload: StoreMyEpisodePost
    ): Promise<void> {
      try {
        if (this.fetchPostEditUUID && this.isDraftFlag) {
          await updateDraftPost(this.fetchPostEditUUID, payload);
        } else {
          await storeDraftMyEpisodePost(payload);
        }
        this.clearPost();
      } catch (e) {
        alert('下書き保存に失敗しました');
      }
    },
    async onDraftSaveButtonClickForCommunityNews(
      payload: StoreCommunityNewsPost
    ): Promise<void> {
      try {
        if (this.fetchPostEditUUID && this.isDraftFlag) {
          await updateDraftPost(this.fetchPostEditUUID, payload);
        } else {
          await storeDraftCommunityNewsPost(payload);
        }
        this.clearPost();
      } catch (e) {
        alert('下書き保存に失敗しました');
      }
    },
    async onDraftSaveButtonClickForDepartmentNews(
      payload: StoreDepartmentNewsPost
    ): Promise<void> {
      try {
        if (this.fetchPostEditUUID && this.isDraftFlag) {
          await updateDraftPost(this.fetchPostEditUUID, payload);
        } else {
          await storeDraftDepartmentNewsPost(payload);
        }
        this.clearPost();
      } catch (e) {
        alert('下書き保存に失敗しました');
      }
    },
    async onDraftSaveButtonClickForInternalCommunication(
      payload: StoreInternalCommunicationPost
    ): Promise<void> {
      try {
        if (this.fetchPostEditUUID && this.isDraftFlag) {
          await updateDraftPost(this.fetchPostEditUUID, payload);
        } else {
          await storeDraftInternalCommunicationPost(payload);
        }
        this.clearPost();
      } catch (e) {
        alert('下書き保存に失敗しました');
      }
    },
    async onPostButtonClickForMyEpisode(): Promise<void> {
      const payload = this.buildRequestForMyEpisode();
      try {
        if (this.fetchPostEditUUID && this.isDraftFlag) {
          await updateMyEpisodePosts(this.fetchPostEditUUID, payload);
        } else {
          await storeMyEpisodePost(payload);
        }
        alert('記事の投稿に成功しました。');
        this.checkToPushRouter();
      } catch (e) {
        alert('記事の投稿に失敗しました。');
      }
    },
    async onPostButtonClickForDepartmentNews(): Promise<void> {
      const payload = this.buildRequestForDepartmentNews();
      try {
        if (this.fetchPostEditUUID && this.isDraftFlag) {
          await updateDepartmentNewsPosts(this.fetchPostEditUUID, payload);
        } else {
          await storeDepartmentNewsPost(payload);
        }
        alert('記事の投稿に成功しました。');
        this.checkToPushRouter();
      } catch (e) {
        alert('記事の投稿に失敗しました。');
      }
    },
    async onPostButtonClickForCommunityNews(): Promise<void> {
      const payload = this.buildRequestForCommunityNews();
      try {
        if (this.fetchPostEditUUID && this.isDraftFlag) {
          await updateCommunityNewsPosts(this.fetchPostEditUUID, payload);
        } else {
          await storeCommunityNewsPost(payload);
        }
        alert('記事の投稿に成功しました。');
        this.checkToPushRouter();
      } catch (e) {
        alert('記事の投稿に失敗しました。');
      }
    },
    async onUpdateButtonClickForMyEpisode(): Promise<void> {
      const payload = this.buildRequestForMyEpisode();
      try {
        await updateMyEpisodePosts(this.editPostUuid, payload);
        alert('記事の更新に成功しました。');
        this.checkToPushRouter();
      } catch (e) {
        alert('記事の更新に失敗しました。');
      }
    },
    async onUpdateButtonClickForDepartmentNews(): Promise<void> {
      const payload = this.buildRequestForDepartmentNews();
      try {
        await updateDepartmentNewsPosts(this.editPostUuid, payload);
        alert('記事の更新に成功しました。');
        this.checkToPushRouter();
      } catch (e) {
        alert('記事の更新に失敗しました。');
      }
    },
    async onUpdateButtonClickForCommunityNews(): Promise<void> {
      const payload = this.buildRequestForCommunityNews();
      try {
        await updateCommunityNewsPosts(this.editPostUuid, payload);
        alert('記事の更新に成功しました。');
        this.checkToPushRouter();
      } catch (e) {
        alert('記事の更新に失敗しました。');
      }
    },
    async onUpdateButtonOnPublicationSettingModalClick(): Promise<void> {
      const payload = this.buildRequestForInternalCommunication();
      if (
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
      try {
        await updateInternalCommunicationPosts(this.editPostUuid, payload);
        this.publicationSettingModal = false;
        alert('記事の更新に成功しました。');
        this.checkToPushRouter();
      } catch (e) {
        alert('記事の更新に失敗しました。');
      }
    },
    buildRequestForMyEpisode(): StoreMyEpisodePost {
      return {
        type: 'my-episode' as const,
        ...this.form,
        add_image_urls: this.addNewFileUrls,
        delete_image_urls: this.removedFileUrls || [],
        add_video_urls: this.addNewVideoUrls,
        delete_video_urls: this.removedVideoUrls || [],
        is_important: false,
        is_draft: this.isDraftFlag,
        questionnaire: this.question != null ? this.question : null,
        event: this.event != null ? this.event : null,
        relational_post_uuid: this.inComponentRelatedPostUUID
          ? this.inComponentRelatedPostUUID
          : null,
      };
    },
    buildRequestForDepartmentNews(): StoreDepartmentNewsPost {
      return {
        type: 'department-news' as const,
        ...this.form,
        add_image_urls: this.addNewFileUrls || [],
        delete_image_urls: this.removedFileUrls || [],
        add_video_urls: this.addNewVideoUrls || [],
        delete_video_urls: this.removedVideoUrls || [],
        is_important: false,
        is_draft: this.isDraftFlag,
        // @ts-ignore organization_uuidが入っているかどうかの検査をvee-validate上で行っているためts-ignoreしている
        organization_uuid: this.selectedOrganization
          ? this.selectedOrganization.uuid
          : null,
        questionnaire: this.question != null ? this.question : null,
        event: this.event != null ? this.event : null,
        relational_post_uuid: this.inComponentRelatedPostUUID
          ? this.inComponentRelatedPostUUID
          : null,
      };
    },
    buildRequestForCommunityNews(): StoreCommunityNewsPost {
      return {
        type: 'community-news' as const,
        ...this.form,
        add_image_urls: this.addNewFileUrls || [],
        delete_image_urls: this.removedFileUrls || [],
        add_video_urls: this.addNewVideoUrls || [],
        delete_video_urls: this.removedVideoUrls || [],
        is_important: false,
        is_draft: this.isDraftFlag,
        // @ts-ignore organization_uuidが入っているかどうかの検査をvee-validate上で行っているためts-ignoreしている
        community_uuid: this.selectedCommunity
          ? this.selectedCommunity.uuid
          : null,
        questionnaire: this.question != null ? this.question : null,
        event: this.event != null ? this.event : null,
        relational_post_uuid: this.inComponentRelatedPostUUID
          ? this.inComponentRelatedPostUUID
          : null,
      };
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
          const findInterviewer = requestInterview.find(
            (req: any) =>
              typeof req.interviewee_uuid !== 'undefined' &&
              req.interviewee_uuid === item.user_uuid
          );
          if (!findInterviewer) {
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
          }
        });
      }
      return {
        type: 'internal-communication' as const,
        permission: this.selectedPermission,
        organization_uuid: null,
        community_uuid: null,
        ...this.form,
        add_video_urls: this.addNewVideoUrls || [],
        add_image_urls: this.addNewFileUrls || [],
        delete_image_urls: this.removedFileUrls,
        delete_video_urls: this.removedVideoUrls,
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
      let requestInterview = this.requestInterviewContents;
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

      return {
        type: 'internal-communication' as const,
        permission: this.selectedPermission,
        organization_uuid: this.selectedOrganization
          ? this.selectedOrganization.uuid
          : '',
        community_uuid: this.selectedCommunity
          ? this.selectedCommunity.uuid
          : '',
        ...this.form,
        add_video_urls: this.addNewVideoUrls || [],
        add_image_urls: this.addNewFileUrls || [],
        delete_image_urls: this.removedFileUrls,
        delete_video_urls: this.removedVideoUrls,
        is_draft: this.isDraftFlag,
        template: this.selectedInternalCommunicationTemplate,
        awardee_user_uuid: this.selectedAwardee
          ? this.selectedAwardee.user_uuid
          : '',
        publish_setting: this.createPublishSetting(),
        questionnaire: this.question != null ? this.question : null,
        event: this.event != null ? this.event : null,
        interview_contents: requestInterview,
        relational_post_uuid: this.inComponentRelatedPostUUID
          ? this.inComponentRelatedPostUUID
          : null,
      };
    },
    onOrganizationSelect(
      selectedOrganization: AppApiResponse.Organization
    ): void {
      this.selectedOrganization = selectedOrganization;
    },
    onCommunitySelect(selectedCommunity: AppApiResponse.Community): void {
      this.selectedCommunity = selectedCommunity;
    },
    onAdditionalContentEnquete(): void {
      this.showAdditionalContentEnquete = !this.showAdditionalContentEnquete;
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
      this.event = null;
      this.showAdditionalContentEvent = !this.showAdditionalContentEvent;
    },
    eventSelected(event: StorePostEvent): void {
      this.event = event;
    },
    onPreviewButtonClick(): void {
      const questionnaire = this.createQuestionnaire();
      const event = this.createEvent();
      const interview = this.createInterview();
      const awardee = this.createAwardee();
      const publishSetting = this.createPublishSetting();
      const post = this.createPostForPreview(
        questionnaire,
        event,
        interview,
        awardee,
        publishSetting
      );
      if (post) {
        this.showPreview(post);
      }
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
          invitation_users: [],
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
    createPostForPreview(
      questionnaire: AppApiResponse.Questionnaire | null,
      event: AppApiResponse.Event | null,
      interview: AppApiResponse.Interview | null,
      awardee: AppApiResponse.Awardee | null,
      publishSetting: AppApiResponse.PublishSetting | null
    ): Post | undefined {
      const commonProperties: Post = {
        uuid: '',
        date: dayjs().unix(),
        type: this.selectedCategory,
        ...this.form, // title, content
        thumbnail: this.hasThumbnail,
        images: this.uploadedImages,
        videos: this.videoUrls,
        like_count: 0,
        comment_count: 0,
        is_read: false,
        is_liked: false,
        is_favorite: false,
        template: this.selectedInternalCommunicationTemplate,
        user: {
          uuid: this.$accessor.userProfile.uuid,
          icon: this.$accessor.userProfile.user_icon,
          name: this.$accessor.userProfile.name,
          organization: this.$accessor.userProfile.organization_name,
        } as AppApiResponse.PostUser,
        publish_setting: publishSetting,
        event,
        questionnaire,
        interview,
        awardee,
      };
      const partial = this.partialPropertiesForPreview();
      if (Object.keys(partial).length === 0) {
        return undefined;
      }
      return merge(commonProperties, partial);
    },
    partialPropertiesForPreview(): Partial<Post> {
      if (this.selectedCategory === 'my-episode') {
        return {
          type: 'my-episode',
        };
      }
      if (this.selectedCategory === 'internal-communication') {
        return {
          type: 'internal-communication',
          template: this.selectedInternalCommunicationTemplate,
          awardee:
            this.selectedAwardee != null
              ? this.employeeToAwardee(this.selectedAwardee)
              : null,
        };
      }
      if (this.selectedCategory === 'department-news') {
        return {
          type: 'department-news',
        };
      }
      if (this.selectedCategory === 'community-news') {
        return {
          type: 'community-news',
        };
      }
      return {};
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
    onPreviewModalClose() {
      this.showPreviewModal = false;
    },
    closeDraftModal() {
      this.showDraftModal = false;
    },
    showDraft() {
      this.showDraftModal = !this.showDraftModal;
    },
    saveDraftPost() {
      if (this.selectedCategory === 'my-episode') {
        const post = this.buildRequestForMyEpisode();
        this.onDraftSaveButtonClickForMyEpisode(post);
      }
      if (this.selectedCategory === 'department-news') {
        const post = this.buildRequestForDepartmentNews();
        this.onDraftSaveButtonClickForDepartmentNews(post);
      }
      if (this.selectedCategory === 'community-news') {
        const post = this.buildRequestForCommunityNews();
        this.onDraftSaveButtonClickForCommunityNews(post);
      }
      if (this.selectedCategory === 'internal-communication') {
        const post = this.buildRequestDraftPostForInternalCommunication();
        this.onDraftSaveButtonClickForInternalCommunication(post);
      }
    },
    closeModal() {
      this.showButtonEndInterview = false;
      this.disabledEditInterviewMessage = false;
      this.disabledTemplateAndCategory = false;
      this.disabledTemplateInterviewThankYouPickup = false;
      this.$emit('showDraft');
    },
    async onPostButtonOnPublicationSettingModalClick(): Promise<void> {
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
      try {
        if (this.fetchPostEditUUID && this.isDraftFlag) {
          await updateInternalCommunicationPosts(
            this.fetchPostEditUUID,
            payload
          );
        } else {
          await storeInternalCommunicationPost(payload);
        }
        await this.closeInterviewRoom(this.roomId);
        this.clearPost();
        this.publicationSettingModal = false;
        alert('記事の投稿に成功しました。');
        this.checkToPushRouter();
      } catch (e) {
        alert('記事の投稿に失敗しました。');
      }
    },
    addEmployee(value: Employee[]) {
      this.selectedInterviewees = value;
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
      this.showButtonEndInterview = value;
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
        this.postDraftWhenCreateInterviewRoom(post);
      }
    },
    getRoomId(room_url: string): number {
      const arr = room_url.split('/');
      return parseInt(arr[arr.length - 1], 10);
    },
    async changeTemplate(event: string) {
      this.clearInternalCommunicationPost();
      this.selectedInternalCommunicationTemplate = event;
    },
    async changeTypeInterview(event: string) {
      this.clearInternalCommunicationPost();
      this.interviewMemberConfirmed = false;
      this.selectedInterviewTemplate = event;
    },
    async pickUpEmployee(value: Employee, validate: Function): Promise<void> {
      const { valid } = await validate(value);
      if (!valid) {
        return;
      }
      this.selectedAwardee = value;
    },
    employeeToAwardee(employee: Employee): Awardee {
      return {
        uuid: employee.user_uuid,
        name: employee.name,
        email: '',
        user_icon: employee.user_icon,
        company_uuid: '',
        company_name: '',
        organization_uuid: '',
        organization_name: employee.organization_name,
        position_text: '',
        enrollment_text: '',
        enrollment_color: '',
        joined_year: employee.joined_year ?? 0, // Employee が optional だが Awardee が required なのでしかたなく
        joined_month: employee.joined_month ?? 0, // Employee が optional だが Awardee が required なのでしかたなく
      };
    },
    async deletePickUpEmployee(validate: any): Promise<void> {
      const { valid } = await validate(undefined);
      if (!valid) {
        return;
      }
      this.selectedAwardee = {} as Employee;
    },
    clearPost() {
      this.form.title = '';
      this.form.content = '';
      this.form.awardee_user_comment = '';
      this.fileUrls = [];
      this.editFileUrls = [] as UploadImage[];
      this.videoUrls = [];
      this.publishSetting = {
        users: [],
        start_at: null,
        end_at: null,
        is_important: false,
      } as AppApiRequest.PublishSetting;
      this.selectedPermission = 'member';
      this.selectedOrganization = null;
      this.selectedCommunity = null;
      this.question = null;
      this.event = null;
      this.requestInterviewContents = [] as StorePostInterviewItem[];
      this.previewInterviewContents = [] as AppApiResponse.InterviewContent[];
      this.draftFechInterviewContents = [] as InterviewText[];
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
      this.availableEmployees = [] as Employee[];
      this.showAdditionalContentEnquete = false;
      this.showAdditionalContentEvent = false;
      this.interviewMessageRoomContents = [] as StorePostInterviewItem[];
      this.interviewMemberConfirmed = false;
      this.addInterviewFlag = false;
      this.endAddInterviewFlag = false;
      this.showInterviewRoom = false;
      this.disabledTemplateAndCategory = false;
      this.disabledEditInterviewMessage = false;
      this.disabledTemplateInterviewThankYouPickup = false;
      this.showButtonEndInterview = false;
      this.fetchPostEditUUID = '';
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
    selectPublicRange(value: AppApiRequest.Permission) {
      this.selectedPermission = value;
    },
    selectPublicTarget(uuids: string[]) {
      if (this.publishSetting != null) this.publishSetting.users = uuids;
    },
    interviewConfirmed(value: boolean) {
      this.interviewMemberConfirmed = value;
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
    async fetchEmployees(limit: number): Promise<void> {
      const { data } = await employees({ limit });
      this.availableEmployees = data.users;
      this.publishSetting.users = data.users.map(
        (user: AppApiResponse.User) => user.user_uuid
      );
    },
    async fetchPostEdit(uuid: string): Promise<void> {
      const { data } = await fetchPostEdit(uuid);
      await this.setDraftData(data);
      this.defaultImages = [...data.add_image_urls];
      this.defaultVideos = [...data.add_video_urls];
      this.closeDraftModal();
    },
    async setDraftData(data: AppApiResponse.PostEdit) {
      this.fetchPostEditUUID = data.uuid;
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
      if (data.publish_setting != null) {
        this.publishSetting = data.publish_setting;
      } else {
        const publicUsers = this.availableEmployees.map(
          (user: AppApiResponse.User) => user.user_uuid
        );
        this.publishSetting = {
          users: publicUsers,
          start_at: null,
          end_at: null,
          is_important: false,
        } as AppApiRequest.PublishSetting;
      }
      this.postEditFlag = true;
      if (data.is_draft) {
        this.postEditFlag = false;
        this.isDraftFlag = true;
      }
      this.isDraftFlag = data.is_draft;
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
      if (data.template != null) {
        this.selectedInternalCommunicationTemplate = data.template;
        this.disabledTemplateAndCategory = false;
        if (data.template !== 'none') {
          this.disabledTemplateAndCategory = true;
        }
      } else {
        this.selectedInternalCommunicationTemplate = 'none';
        this.disabledTemplateAndCategory = false;
      }
      this.relationalPostUuid = data.relational_post_uuid;
      this.draftFechInterviewContents =
        data.interview != null
          ? this.setInterviewContents(data.interview.contents)
          : ([] as InterviewText[]);
      this.selectedInterviewees =
        data.interview != null
          ? this.setInterviewee(data.interview.contents)
          : ([] as Employee[]);
      this.requestInterviewContents = data.interview
        ? this.setRequestInterviewContents(data.interview.contents)
        : ([] as AppApiResponse.InterviewContent[]);
      this.roomId = 0;
      if (data.template === 'interview') {
        let interviewType: any = {};
        const interviewUserPositions =
          typeof data.interview.user_positions === 'object'
            ? Object.values(data.interview.user_positions)
            : data.interview.user_positions;
        if (interviewUserPositions.length > 0) {
          const interviewContentData = interviewUserPositions[0];
          interviewType = interviewContentData.body;
          this.selectedInterviewTemplate = 'normal';
          this.disabledEditInterviewMessage = false;
          if (interviewType.interview_type === 'MAKE_MESSAGE') {
            this.selectedInterviewTemplate = 'message';
            this.interviewMessageRoomContents = cloneDeep(
              this.requestInterviewContents
            );
            this.disabledEditInterviewMessage = false;
            if (!data.is_draft) {
              this.disabledEditInterviewMessage = true;
            }
          }
          this.selectedInterviewees = interviewUserPositions;
        }
        if (data.room_id && data.room_id > 0) {
          this.roomId = data.room_id;
          this.fetchRoom(data.room_id);
        }
        this.disabledTemplateAndCategory = false;
        this.interviewMemberConfirmed = false;
        if (!data.is_draft) {
          this.disabledTemplateAndCategory = true;
          this.interviewMemberConfirmed = true;

          this.addInterviewFlag = true;
          this.endAddInterviewFlag = true;
          this.showInterviewRoom = false;
          this.showButtonEndInterview = false;
        } else if (interviewType && interviewType.step === 'confirmed') {
          this.interviewMemberConfirmed = true;
          this.addInterviewFlag = false;
          this.endAddInterviewFlag = false;
        } else if (interviewType && interviewType.step === 'created') {
          this.interviewMemberConfirmed = true;
          this.addInterviewFlag = true;
          this.endAddInterviewFlag = true;
          this.showInterviewRoom = false;
        } else {
          this.interviewMemberConfirmed = false;
        }
      }
      if (this.selectedInterviewTemplate === 'normal') {
        this.previewInterviewContents = data.interview.contents;
      }
      if (!data.is_draft) {
        this.disabledTemplateInterviewThankYouPickup = true;
      }
      this.selectedAwardee = data.awardee
        ? this.setAwardee(data.awardee.uuid)
        : null;
      this.selectedCategory = data.type;
      this.selectedOrganization = this.setOrganization(data.organization_uuid);
      this.selectedCommunity = this.setCommunity(data.community_uuid);
    },
    setOrganization(uuid: string): AppApiResponse.Organization | null {
      const organization = this.organizations.find(
        (item: AppApiResponse.Organization) => item.uuid === uuid
      );
      if (organization != null) {
        return organization;
      }
      return null;
    },
    setCommunity(uuid: string) {
      const community = this.communities.find(
        (item: AppApiResponse.Community) => item.uuid === uuid
      );
      if (community != null) {
        return community;
      }
      return null;
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
            interviewee_uuid: item.interviewee.uuid,
            commenter: item.interviewee.uuid,
            user_icon: item.interviewee.user_icon,
            user_name: item.interviewee.name,
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
    editInterviewContents(value: boolean) {
      this.endAddInterviewFlag = value;
      this.addInterviewFlag = true;
      if (this.selectedInterviewTemplate === 'message') {
        this.showInterviewRoom = true;
      } else {
        this.showButtonEndInterview = true;
      }
    },
    checkToPushRouter() {
      if (
        this.$router.history.current.path &&
        (this.$router.history.current.path === '/' ||
          this.$router.history.current.path === '/my-page' ||
          this.$router.history.current.path === '/internal-communications' ||
          this.$router.history.current.name === 'app-users-id' ||
          this.$router.history.current.name ===
            'app-internal-communications-pickup' ||
          this.$router.history.current.name === 'app-communities-id' ||
          this.$router.history.current.path === '/')
      ) {
        this.$emit('re-render');
      } else {
        this.$router.push({ path: '/' });
      }
      this.onClose('submit');
    },
    removeRelationPost() {
      this.relatedPost = {} as AppApiResponse.Post;
      this.inComponentRelatedPostUUID = '';
    },
    setModalHeight() {
      this.$refs.modalWindow.style.paddingBottom = `${this.$refs.bottomMenu.scrollHeight}px`;
    },
    onEnterModal() {
      this.setModalHeight();
      window.addEventListener('resize', this.setModalHeight);
    },
    onLeaveModal() {
      window.removeEventListener('resize', this.setModalHeight);
    },
    clickTemplateInterview(value: string) {
      this.selectedInterviewTemplate = value;
    },
    endInterviewButtonClick() {
      this.addInterviewFlag = false;
      this.endAddInterviewFlag = true;
      this.showInterviewRoom = false;
      this.showButtonEndInterview = false;
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
    async postDraftWhenCreateInterviewRoom(
      payload: StorePostInterview
    ): Promise<void> {
      try {
        await storeDraftInternalCommunicationPost(payload);
      } catch (e) {
        alert('下書き保存に失敗しました');
      }
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
    async closeInterviewRoom(roomId: number) {
      if (roomId > 0) {
        this.roomId = 0;
        await deleteRoomInterview(roomId);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  width: 800px;
  height: 100%;
  background-color: $true_white;
  position: relative;
}

.modal-window-interview {
  width: 800px;
  background-color: $true_white;
  position: relative;
}

.modal-contents {
  height: 100%;
  overflow-y: scroll;
}

.modal-contents-interview {
  height: 100%;
}

// オーバーレイのトランジション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  // オーバーレイに包含されているモーダルウィンドウのトランジション
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

// ディレイを付けるとモーダルウィンドウが消えた後にオーバーレイが消える
.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.modal-enter {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.icon-cross-wrapper {
  position: absolute;
  top: 0;
  right: calc(-23px + -23px);
}

.icon-cross {
  cursor: pointer;
  width: 24px;
}

.content-body {
  padding: 0 40px;
}

.content-body-interview {
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  padding: 0 40px;
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
      // width: 130px;
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

  .selected-employee {
    font-size: 15px;
    font-weight: 600;
    color: $main_color;
    margin: 14px 0;
  }
}

.post-rules-box {
  display: flex;
  justify-content: flex-end;
  font-size: 12px;

  .validation {
    display: flex;
  }

  .validation:first-child {
    margin-right: 16px;
  }

  .error-text {
    color: $link_color;
  }

  .divider {
    margin: 0 2px;
  }

  .icon {
    margin-left: 4px;
  }
}

.bottom-menu {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  text-align: center;
  padding: 18px 15px 14px;
  z-index: 10000;

  .post-button {
    width: 252.5px;
    margin-bottom: 4px;
  }

  .button-large {
    width: 260px;

    &.interview {
      margin-left: 345px;
    }
  }
}

.additional-post {
  margin-top: 24px;
}

.questionnare-event {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 20px;

  button {
    min-width: 350px;

    &:only-child {
      width: 100%;
    }
  }
}

.related-post {
  display: flex;
  align-items: center;
  margin: 0 0 40px 0 !important;
  max-width: 800px;
  background-color: #7e8195;
  border-radius: 5px;
  position: relative;

  &:last-of-type {
    margin: 0;
  }

  &__leftpanel {
    width: 100px;
    height: 75px;
    margin: 0 22px 0 0;
    object-fit: cover;
    padding: 10px 0 0 10px;
    color: white;
  }

  &__inner {
    max-width: 600px;
  }

  &__header {
    font-size: 15px;
    color: white;
    line-height: 1;
  }

  &__content {
    margin: 10px 0 0 0;
    font-size: 15px;
    font-weight: bold;
    color: white;
    width: 100%;
    height: 50px;
    $lines: 2;
    $line-multiple: 1.3;
    $font-size: 15px;

    display: -webkit-box;
    max-height: $font-size * $line-multiple * $lines;
    line-height: $font-size * $line-multiple;
    text-overflow: ellipsis;
    overflow: hidden;
    word-wrap: break-word;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
  }

  .close {
    position: absolute;
    top: 5px;
    right: 5px;
    padding-right: 0 !important;
    padding-left: 0 !important;
    background: #7e8195;
  }
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

.awardee-comment {
  margin-top: 22px;
}

.triangle {
  margin-left: 345px;
  margin-top: 5px;
  position: relative;
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
  margin-bottom: -2px;
  border-left: 7.5px solid transparent;
  border-right: 7.5px solid transparent;
  border-bottom: 11.5px solid white;
}
</style>
