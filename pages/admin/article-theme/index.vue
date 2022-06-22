<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="記事テーマの設定">
        <template #tutorial>
          <TutorialButtonIcon :url="`/admin/tutorial/post-theme.html`" />
        </template>
        <template #description>
          会社毎に記事テーマを設定することができます。<br />
          全社共通でテーマを設定することも可能ですのでご利用状況に応じてテーマをお選びください。
        </template>
      </page-header>
      <div class="content-wrapper">
        <CompanyTabs
          :companies="companies"
          :current-id="currentUuid"
          @change-tab="changeTab($event)"
        />
        <div class="contents">
          <vue-loading
            v-if="isLoading"
            type="spin"
            color="#333"
            :size="{ width: '50px', height: '50px' }"
          ></vue-loading>
          <div v-else>
            <div class="rule-text">
              投稿ルール：{{ postRuleString }} ⋯
              会社毎に指定されている投稿ルールの期間がテーマ選択の際、自動的に反映されます。
            </div>
            <div class="theme-columns">
              <div class="theme-column">
                <editable-theme-card
                  v-if="usedTheme"
                  class="editable-theme-card"
                  :class="{
                    selected:
                      selectMode.type === 'use-theme' &&
                      selectMode.activeTheme.uuid === usedTheme.uuid,
                  }"
                  :companies="companies"
                  :current-company="currentCompany"
                  :value="usedTheme"
                  :summary="'利用中のテーマ'"
                  @save="saveUsedTheme($event)"
                  @use-theme-in-every-company="
                    showSetDefaultAlert('use-theme-in-every-company', $event)
                  "
                  @update-rate="updateRate($event)"
                  @enter-select-mode="enterSelectMode('use-theme', $event)"
                  @cancel-select-mode="cancelSelectMode($event)"
                ></editable-theme-card>
                <editable-theme-card
                  v-if="nextTheme"
                  class="editable-theme-card"
                  :class="{
                    selected:
                      selectMode.type === 'next-theme' &&
                      selectMode.activeTheme.uuid === nextTheme.uuid,
                  }"
                  :companies="companies"
                  :current-company="currentCompany"
                  :value="nextTheme"
                  :summary="'次回のテーマ'"
                  @save="saveNextTheme($event)"
                  @use-theme-in-every-company="
                    showSetDefaultAlert(
                      'use-next-theme-in-every-company',
                      $event
                    )
                  "
                  @update-rate="updateRate($event)"
                  @enter-select-mode="enterSelectMode('next-theme', $event)"
                  @cancel-select-mode="cancelSelectMode($event)"
                ></editable-theme-card>
                <div
                  class="reserved-theme"
                  :class="{
                    selected:
                      selectMode.type === 'reserved-theme' ||
                      selectMode.type === 'empty-reserved-theme',
                  }"
                >
                  <h2 class="title">次回以降の予約済みテーマ</h2>
                  <p class="sub-title">
                    こちらで選んだテーマはSpotWrite上に次回以降のテーマとして表示されます。
                  </p>
                  <button
                    class="button cancel-select-mode"
                    @click="cancelSelectMode"
                  >
                    選択モードを閉じる
                    <img src="/icon/icon_cross.png" />
                  </button>
                  <div
                    @drop="dropMiniTheme($event)"
                    @dragover.prevent
                    @dragenter.prevent
                  >
                    <div
                      v-for="theme in reservedThemeList"
                      :key="`reserved-${theme.uuid}`"
                      :data-uuid="theme.uuid"
                      class="draggable-mini-theme-card"
                      :class="{
                        selected:
                          selectMode.type === 'reserved-theme' &&
                          selectMode.activeTheme === theme,
                      }"
                      draggable
                      @dragstart="dragMiniTheme($event, theme)"
                    >
                      <div class="moving-handle">
                        <svg
                          id="icon_move"
                          data-name="icon/move"
                          xmlns="http://www.w3.org/2000/svg"
                          width="9"
                          height="16"
                          viewBox="0 0 9 16"
                        >
                          <circle
                            id="Ellipse_43"
                            data-name="Ellipse 43"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(4 4) rotate(180)"
                            fill="#7e8195"
                          />
                          <circle
                            id="Ellipse_238"
                            data-name="Ellipse 238"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(4 10) rotate(180)"
                            fill="#7e8195"
                          />
                          <circle
                            id="Ellipse_239"
                            data-name="Ellipse 239"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(4 16) rotate(180)"
                            fill="#7e8195"
                          />
                          <circle
                            id="Ellipse_2390"
                            data-name="Ellipse 2390"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(9 4) rotate(180)"
                            fill="#7e8195"
                          />
                          <circle
                            id="Ellipse_2391"
                            data-name="Ellipse 2391"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(9 10) rotate(180)"
                            fill="#7e8195"
                          />
                          <circle
                            id="Ellipse_2392"
                            data-name="Ellipse 2392"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(9 16) rotate(180)"
                            fill="#7e8195"
                          />
                        </svg>
                      </div>
                      <div class="theme-title" :title="theme.title">
                        {{ theme.title }}
                      </div>
                      <div class="theme-elements">
                        <star-rating
                          class="star-rating"
                          :rating="theme.rating"
                        ></star-rating>
                        <post-sample-button
                          @click="
                            openArticleSampleModal(theme.title, theme.sentence)
                          "
                        ></post-sample-button>
                      </div>
                      <div class="theme-change-button">
                        <button
                          class="theme-change-button__button"
                          @click="enterSelectMode('reserved-theme', theme)"
                        >
                          テーマを変更
                        </button>
                      </div>
                      <div
                        class="delete"
                        @click="deleteReservedTheme(theme.uuid)"
                      >
                        <svg
                          id="Group_7648"
                          data-name="Group 7648"
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
                            fill="#7e8195"
                          />
                          <line
                            id="Line_356"
                            data-name="Line 356"
                            x2="6"
                            y2="6"
                            transform="translate(5 5)"
                            fill="none"
                            stroke="#fff"
                            stroke-linecap="round"
                            stroke-miterlimit="10"
                            stroke-width="1.114"
                          />
                          <line
                            id="Line_357"
                            data-name="Line 357"
                            x1="6"
                            y2="6"
                            transform="translate(5 5)"
                            fill="none"
                            stroke="#fff"
                            stroke-linecap="round"
                            stroke-miterlimit="10"
                            stroke-width="1.114"
                          />
                        </svg>
                      </div>
                    </div>
                    <div
                      v-for="emptyTheme in emptyReservedThemeList"
                      :key="`reserved-empty-${emptyTheme}`"
                      class="draggable-mini-theme-card empty-theme"
                      :class="{
                        selected:
                          selectMode.type === 'empty-reserved-theme' &&
                          selectMode.activeTheme === emptyTheme,
                      }"
                    >
                      <div class="moving-handle">
                        <svg
                          id="icon_move"
                          data-name="icon/move"
                          xmlns="http://www.w3.org/2000/svg"
                          width="9"
                          height="16"
                          viewBox="0 0 9 16"
                        >
                          <circle
                            id="Ellipse_43"
                            data-name="Ellipse 43"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(4 4) rotate(180)"
                            fill="#7e8195"
                          />
                          <circle
                            id="Ellipse_238"
                            data-name="Ellipse 238"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(4 10) rotate(180)"
                            fill="#7e8195"
                          />
                          <circle
                            id="Ellipse_239"
                            data-name="Ellipse 239"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(4 16) rotate(180)"
                            fill="#7e8195"
                          />
                          <circle
                            id="Ellipse_2390"
                            data-name="Ellipse 2390"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(9 4) rotate(180)"
                            fill="#7e8195"
                          />
                          <circle
                            id="Ellipse_2391"
                            data-name="Ellipse 2391"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(9 10) rotate(180)"
                            fill="#7e8195"
                          />
                          <circle
                            id="Ellipse_2392"
                            data-name="Ellipse 2392"
                            cx="2"
                            cy="2"
                            r="2"
                            transform="translate(9 16) rotate(180)"
                            fill="#7e8195"
                          />
                        </svg>
                      </div>
                      <div class="theme-title"></div>
                      <div class="theme-elements">
                        <star-rating
                          class="star-rating"
                          :rating="0"
                        ></star-rating>
                        <post-sample-button />
                      </div>
                      <div class="theme-change-button">
                        <button
                          class="theme-change-button__button"
                          @click="
                            enterSelectMode('empty-reserved-theme', emptyTheme)
                          "
                        >
                          テーマを変更
                        </button>
                      </div>
                      <div class="delete">
                        <svg
                          id="Group_7648"
                          data-name="Group 7648"
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
                            fill="#7e8195"
                          />
                          <line
                            id="Line_356"
                            data-name="Line 356"
                            x2="6"
                            y2="6"
                            transform="translate(5 5)"
                            fill="none"
                            stroke="#fff"
                            stroke-linecap="round"
                            stroke-miterlimit="10"
                            stroke-width="1.114"
                          />
                          <line
                            id="Line_357"
                            data-name="Line 357"
                            x1="6"
                            y2="6"
                            transform="translate(5 5)"
                            fill="none"
                            stroke="#fff"
                            stroke-linecap="round"
                            stroke-miterlimit="10"
                            stroke-width="1.114"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="theme-column">
                <h2 class="column-title">
                  <img src="/icon/icon_memo.svg" />
                  記事テーマ一覧
                </h2>
                <div class="column-sub-title">
                  <img src="/image/img_message-bubble.svg" />
                  <div>この中から使いたいテーマを選びましょう！</div>
                  <div>「選択する」ボタンでテーマを設定できます。</div>
                </div>
                <div
                  class="theme-list-area"
                  @drop="dropTheme($event)"
                  @dragover.prevent
                  @dragenter.prevent
                >
                  <div
                    v-for="theme in filteredArticleThemeList"
                    :key="`theme-${theme.uuid}`"
                    :data-uuid="theme.uuid"
                    class="draggable-theme-card"
                    draggable
                    @dragstart="dragTheme($event, theme)"
                  >
                    <div class="moving-handle">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="70"
                        viewBox="0 0 9 70"
                      >
                        <g id="移動大" transform="translate(-693 -390)">
                          <g
                            id="icon_move"
                            data-name="icon/move"
                            transform="translate(693 390)"
                          >
                            <circle
                              id="Ellipse_43"
                              data-name="Ellipse 43"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(4 4) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_238"
                              data-name="Ellipse 238"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(4 10) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_239"
                              data-name="Ellipse 239"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(4 16) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_2390"
                              data-name="Ellipse 2390"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(9 4) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_2391"
                              data-name="Ellipse 2391"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(9 10) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_2392"
                              data-name="Ellipse 2392"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(9 16) rotate(180)"
                              fill="#7e8195"
                            />
                          </g>
                          <g
                            id="icon_move-2"
                            data-name="icon/move"
                            transform="translate(693 408)"
                          >
                            <circle
                              id="Ellipse_43-2"
                              data-name="Ellipse 43"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(4 4) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_238-2"
                              data-name="Ellipse 238"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(4 10) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_239-2"
                              data-name="Ellipse 239"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(4 16) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_2390-2"
                              data-name="Ellipse 2390"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(9 4) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_2391-2"
                              data-name="Ellipse 2391"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(9 10) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_2392-2"
                              data-name="Ellipse 2392"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(9 16) rotate(180)"
                              fill="#7e8195"
                            />
                          </g>
                          <g
                            id="icon_move-3"
                            data-name="icon/move"
                            transform="translate(693 426)"
                          >
                            <circle
                              id="Ellipse_43-3"
                              data-name="Ellipse 43"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(4 4) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_238-3"
                              data-name="Ellipse 238"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(4 10) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_239-3"
                              data-name="Ellipse 239"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(4 16) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_2390-3"
                              data-name="Ellipse 2390"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(9 4) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_2391-3"
                              data-name="Ellipse 2391"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(9 10) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_2392-3"
                              data-name="Ellipse 2392"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(9 16) rotate(180)"
                              fill="#7e8195"
                            />
                          </g>
                          <g
                            id="icon_move-4"
                            data-name="icon/move"
                            transform="translate(693 444)"
                          >
                            <circle
                              id="Ellipse_43-4"
                              data-name="Ellipse 43"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(4 4) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_238-4"
                              data-name="Ellipse 238"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(4 10) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_239-4"
                              data-name="Ellipse 239"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(4 16) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_2390-4"
                              data-name="Ellipse 2390"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(9 4) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_2391-4"
                              data-name="Ellipse 2391"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(9 10) rotate(180)"
                              fill="#7e8195"
                            />
                            <circle
                              id="Ellipse_2392-4"
                              data-name="Ellipse 2392"
                              cx="2"
                              cy="2"
                              r="2"
                              transform="translate(9 16) rotate(180)"
                              fill="#7e8195"
                            />
                          </g>
                        </g>
                      </svg>
                    </div>
                    <div class="theme-content">
                      <div class="top-box">
                        <div class="left">
                          <star-rating :rating="theme.rating"></star-rating>
                          <div class="used-count">
                            利用回数：{{ theme.numberOfUse }}回
                          </div>
                        </div>
                        <post-sample-button
                          @click="
                            openArticleSampleModal(theme.title, theme.sentence)
                          "
                        ></post-sample-button>
                      </div>
                      <div class="middle-box">
                        <base-button
                          v-if="selectMode.type !== ''"
                          class="theme-selection-button"
                          @click="showSelectModeAlert(theme)"
                          >選択する</base-button
                        >
                        <div class="theme-title" :title="theme.title">
                          {{ theme.title }}
                        </div>
                      </div>
                      <div class="bottom-box">
                        <div class="button">
                          説明をみる
                          <span
                            v-if="!theme.sentenceDisplay"
                            @click="theme.sentenceDisplay = true"
                          >
                            <img src="/icon/icon_open@2x.png" />
                          </span>
                          <span
                            v-if="theme.sentenceDisplay"
                            @click="theme.sentenceDisplay = false"
                          >
                            <img src="/icon/icon_hide@2x.png" />
                          </span>
                        </div>
                        <div
                          v-if="theme.sentenceDisplay"
                          class="theme-sentence"
                        >
                          {{ theme.sentence }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <article-sample-modal
        v-if="articleSampleModal.show"
        :title="articleSampleModal.props.title"
        :sentence="articleSampleModal.props.sentence"
        @close="closeArticleSampleModal()"
      ></article-sample-modal>
      <check-update
        v-if="setDefault.alert"
        :update-button-text="'はい'"
        @click="submitSetDefaultAlert"
        @close="hideSetDefaultAlert"
      >
        テーマを全社に適用すると、現在設定されているテーマが<br />
        上書きされます。<br />
        このテーマを全社に適用しますか？
      </check-update>
      <check-update
        v-if="selectMode.alert"
        :update-button-text="'はい'"
        @click="submitSelectModeAlert"
        @close="hideSelectModeAlert"
      >
        選択したテーマに変更しますか？
      </check-update>
      <div v-if="selectMode.type !== ''" class="select-mode-overlay"></div>
    </div>
    <LoadingOverlay v-if="isLoadingOverlay"></LoadingOverlay>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import moment from 'moment';
import { VueLoading } from 'vue-loading-template';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import {
  ArticleSampleModal,
  EditableThemeCard,
  LoadingOverlay,
  PostSampleButton,
  StarRating,
} from '@/components/Admin/Pages/';

import { timestampToDateString, toUtcDateTimestamp } from '@/libs/dayjs';
import CompanyTabs from '@/components/Admin/Pages/ArticleTheme/CompanyTabsForArticleTheme.vue';
import {
  createPostTheme,
  deletePostTheme,
  fetchConfigRules,
  fetchMasterPostTheme,
  fetchOrganizationRules,
  fetchOrganizations,
  fetchPostTheme,
  updatePostTheme,
  updatePostThemePosition,
} from '@/libs/api';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import CheckUpdate from '@/components/Admin/Modules/Modal/CheckUpdate.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';

interface MasterPostTheme {
  uuid: string;
  title: string;
  difficulty_level: number;
  use_count: number;
  pos: number;
  sample_text: string;
}

type PostTheme = {
  uuid: string;
  master_post_theme_uuid: string;
  title: string;
  difficulty_level: number;
  use_count: number;
  start_date: number;
  end_date: number;
  sample_text: string;
};

type Company = {
  uuid: string;
  name: string;
  post_rule: string;
  post_themes?: PostTheme[];
};

type ArticleTheme = {
  uuid: string;
  title: string;
  sentence: string;
  rating: number;
  numberOfUse: number;
  startDate?: string;
  endDate?: string;
  masterPostThemeUuid?: string;
  pos?: number;
};

type MyEpisode = {
  slowly: string;
  normal: string;
  frequent: string;
};
type Config = 'normal' | 'slowly' | 'frequent';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    StarRating,
    EditableThemeCard,
    ArticleSampleModal,
    CompanyTabs,
    VueLoading,
    LoadingOverlay,
    PageHeader,
    PostSampleButton,
    BaseButton,
    CheckUpdate,
    TutorialButtonIcon,
  },
  async asyncData({ error }: any) {
    try {
      const {
        data: { organizations: response },
      } = await fetchOrganizations();

      const layer0Organizations = response.filter(
        (o: ApiResponse.GroupOrganization) => o.layer === 0
      );

      const [firstCompany] = layer0Organizations;

      const {
        data: { my_episode: myEpisodeMaster },
      } = await fetchConfigRules();

      const {
        data: { post_themes },
      } = await fetchPostTheme(firstCompany.uuid);

      const {
        data: { rules },
      } = await fetchOrganizationRules(firstCompany.uuid);

      const myRule = rules.find(
        (rule: { uuid: string }) => rule.uuid === firstCompany.uuid
      );

      const { my_episode } = myRule!;
      const config = my_episode as Config;

      const company = {
        ...firstCompany,
        post_themes,
        post_rule: myEpisodeMaster![config],
      } as Company;

      const companies = [company, ...layer0Organizations.slice(1)];

      return {
        companies,
        myEpisodeMaster,
      };
    } catch (err) {
      error({
        statusCode: err.response.status,
        message: err.response.data.message,
      });
    }
  },
  data() {
    return {
      myEpisodeMaster: null as null | MyEpisode,
      organizations: [],
      postThemes: [],
      isLoading: true as boolean,
      isLoadingOverlay: false as boolean,
      draggedTheme: null as null | ArticleTheme,
      dragPointY: 0,
      dropPointY: 0,
      articleSampleModal: {
        show: false,
        props: {
          title: '',
          sentence: '',
        },
      },
      currentId: null as null | string,
      companies: [] as Company[],
      articleThemeList: [] as null | ArticleTheme[],
      usedTheme: null as null | ArticleTheme,
      nextTheme: null as null | ArticleTheme,
      reservedThemeList: [] as null | ArticleTheme[],
      setDefault: {
        type: '' as string,
        alert: false as boolean,
        selectedTheme: {} as ArticleTheme,
      },
      selectMode: {
        type: '' as string,
        activeTheme: {} as ArticleTheme,
        alert: false as boolean,
        selectedTheme: {} as ArticleTheme,
      },
    };
  },
  computed: {
    filteredArticleThemeList() {
      return this.articleThemeList.filter((theme: ArticleTheme) => {
        if (
          ['use-theme', 'next-theme'].includes(this.selectMode.type) &&
          this.selectMode.activeTheme.masterPostThemeUuid === theme.uuid
        ) {
          return false;
        }
        return true;
      });
    },
    postRuleString() {
      switch (this.currentCompany.post_rule) {
        case 'three_months':
          return '３ヶ月に１回';
        case 'week':
          return '１週間に１回';
        case 'month':
        default:
          return 'ひと月に１回';
      }
    },
    currentUuid: {
      get(): string {
        return this.currentId ? this.currentId : this.companies[0].uuid;
      },
      set(value: string) {
        this.currentId = value;
      },
    },
    currentCompany: {
      get(): Company {
        const company = this.companies.find(
          (c: Company) => c.uuid === this.currentUuid
        );
        return company!;
      },
      set(value: Company) {
        this.companies = this.companies.map((c: Company) => {
          if (c.uuid === this.currentUuid) {
            return value;
          }
          return c;
        });
      },
    },
    emptyReservedThemeList() {
      const resultList = [];
      for (let i = this.reservedThemeList.length; i < 3; i += 1) {
        resultList.push(i);
      }
      return resultList;
    },
  },
  async created() {
    await this.refreshTheme();
    this.isLoading = false;
  },
  mounted() {
    this.companies.forEach(async (company: Company, index: number) => {
      if (index === 0) {
        return;
      }

      const {
        data: { post_themes },
      } = await fetchPostTheme(company.uuid);
      const {
        data: { rules },
      } = await fetchOrganizationRules(company.uuid);
      const myRule = rules.find(
        (rule: { uuid: string }) => rule.uuid === company.uuid
      );
      const { my_episode } = myRule!;
      const config = my_episode as Config;
      const companyWithPostThemes = {
        ...company,
        post_themes,
        post_rule: this.myEpisodeMaster![config],
      };
      this.$set(this.companies, index, companyWithPostThemes);
    });
  },
  methods: {
    async updateRate(data: { uuid: string; rate: number }) {
      const postTheme = this.currentCompany.post_themes!.find(
        (theme: PostTheme) => theme.uuid === data.uuid
      )!;
      if (data.rate === postTheme.difficulty_level) {
        return;
      }

      try {
        this.isLoadingOverlay = true;
        const {
          data: { post_themes },
        } = await updatePostTheme(data.uuid, {
          ...postTheme,
          difficulty_level: data.rate,
        });
        this.currentCompany.post_themes = post_themes;
        if (this.usedTheme?.uuid === data.uuid) {
          this.usedTheme.rating = data.rate;
        } else {
          this.nextTheme!.rating = data.rate;
        }
      } catch (e) {
        throw new Error(e);
      } finally {
        this.isLoadingOverlay = false;
      }
    },
    async useThemeInEveryCompany(selectedTheme: ArticleTheme) {
      this.isLoadingOverlay = true;
      try {
        this.companies = await Promise.all(
          this.companies.map(async (company: Company) => {
            if (this.currentUuid === company.uuid) {
              return company;
            }
            const postThemes = company.post_themes ?? [];
            if (postThemes.length) {
              // 使用済みテーマだったら更新しない
              if (
                postThemes[0].master_post_theme_uuid ===
                selectedTheme.masterPostThemeUuid
              ) {
                return company;
              }
              const theme = {
                master_post_theme_uuid: selectedTheme.masterPostThemeUuid!,
                title: selectedTheme.title,
                sample_text: selectedTheme.sentence,
                difficulty_level: selectedTheme.rating,
                start_date: postThemes[0].start_date,
                end_date: postThemes[0].end_date,
              };
              const {
                data: { post_themes },
              } = await updatePostTheme(postThemes[0].uuid, theme);
              return { ...company, post_themes };
            }
            const theme = {
              master_post_theme_uuid: selectedTheme.masterPostThemeUuid!,
              title: selectedTheme.title,
              sample_text: selectedTheme.sentence,
              difficulty_level: selectedTheme.rating,
              start_date: moment().unix(),
              end_date: this.AdjustEndDateFromNumber(
                moment().unix(),
                company.post_rule
              ),
            };
            const { data: postTheme } = await createPostTheme(
              company.uuid,
              theme
            );
            const post_themes = [postTheme];
            return { ...company, post_themes };
          })
        );

        await this.refreshTheme();
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoadingOverlay = false;
      }
    },
    async useNextThemeInEveryCompany(selectedTheme: ArticleTheme) {
      this.isLoadingOverlay = true;
      try {
        this.companies = await Promise.all(
          this.companies.map(async (company: Company) => {
            if (this.currentUuid === company.uuid) {
              return company;
            }
            // 次回のテーマが設定されていたら上書き
            const postThemes = company.post_themes ?? [];
            if (postThemes.length > 1) {
              // 使用済みテーマだったら更新しない
              if (
                postThemes[1].master_post_theme_uuid ===
                selectedTheme.masterPostThemeUuid
              ) {
                return company;
              }
              const theme = {
                master_post_theme_uuid: selectedTheme.masterPostThemeUuid!,
                title: selectedTheme.title,
                sample_text: selectedTheme.sentence,
                difficulty_level: selectedTheme.rating,
                start_date: postThemes[1].start_date,
                end_date: postThemes[1].end_date,
              };

              const {
                data: { post_themes },
              } = await updatePostTheme(postThemes[1].uuid, theme);
              return { ...company, post_themes };
            }
            let startDate = moment()
              .utc()
              .unix();
            if (postThemes.length) {
              if (
                postThemes[0].master_post_theme_uuid ===
                selectedTheme.masterPostThemeUuid
              ) {
                return company;
              }
              startDate = moment
                .unix(postThemes[0].end_date)
                .add(1, 'days')
                .utc()
                .unix();
            }

            const theme = {
              master_post_theme_uuid: selectedTheme.masterPostThemeUuid!,
              title: selectedTheme.title,
              sample_text: selectedTheme.sentence,
              difficulty_level: selectedTheme.rating,
              start_date: startDate,
              end_date: this.AdjustEndDateFromNumber(
                startDate,
                company.post_rule
              ),
            };
            const { data: postTheme } = await createPostTheme(
              company.uuid,
              theme
            );
            const post_themes = postThemes.concat([postTheme]);
            return { ...company, post_themes };
          })
        );
        await this.refreshTheme();
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoadingOverlay = false;
      }
    },
    async refreshTheme() {
      this.isLoading = true;
      const {
        data: { post_themes: masterPostThemes },
      } = await fetchMasterPostTheme(this.currentUuid);
      this.articleThemeList = masterPostThemes
        .sort((a: MasterPostTheme, b: MasterPostTheme) => {
          return a.pos - b.pos;
        })
        .map((postTheme: MasterPostTheme) => {
          return {
            uuid: postTheme.uuid,
            title: postTheme.title,
            sentence: postTheme.sample_text,
            sentenceDisplay: false,
            rating: postTheme.difficulty_level,
            numberOfUse: postTheme.use_count,
            pos: postTheme.pos,
          };
        });

      let postThemes = this.currentCompany.post_themes;

      if (postThemes == null) {
        const {
          data: { post_themes },
        } = await fetchPostTheme(this.currentUuid);
        postThemes = post_themes;
        if (postThemes == null) {
          this.isLoading = false;
          return null;
        }
      }

      this.isLoading = false;
      this.usedTheme =
        postThemes.length > 0 ? this.mapTheme(postThemes[0]) : null;
      this.nextTheme =
        postThemes.length > 1 ? this.mapTheme(postThemes[1]) : null;

      if (!postThemes.length) {
        this.reservedThemeList = [];
        return null;
      }

      this.reservedThemeList = postThemes
        .filter((_: PostTheme, i: number) => {
          return i > 1;
        })!
        .sort((a: PostTheme, b: PostTheme) => a.start_date - b.start_date)
        .map((c: PostTheme) => this.mapTheme(c));
    },
    showSetDefaultAlert(type: string, selectedTheme: ArticleTheme) {
      this.setDefault.alert = true;
      this.setDefault.type = type;
      this.setDefault.selectedTheme = selectedTheme;
    },
    hideSetDefaultAlert() {
      this.setDefault.alert = false;
      this.setDefault.type = '';
      this.setDefault.selectedTheme = {};
    },
    submitSetDefaultAlert() {
      switch (this.setDefault.type) {
        case 'use-theme-in-every-company':
          this.useThemeInEveryCompany(this.setDefault.selectedTheme);
          break;
        case 'use-next-theme-in-every-company':
          this.useNextThemeInEveryCompany(this.setDefault.selectedTheme);
          break;
        default:
      }
      this.hideSetDefaultAlert();
    },
    showSelectModeAlert(selectedTheme: ArticleTheme) {
      this.selectMode.alert = true;
      this.selectMode.selectedTheme = selectedTheme;
    },
    hideSelectModeAlert() {
      this.selectMode.alert = false;
      this.selectMode.selectedTheme = {};
    },
    submitSelectModeAlert() {
      this.selectTheme();
      this.hideSelectModeAlert();
    },
    changeTab(uuid: string) {
      this.currentUuid = uuid;
      this.refreshTheme();
    },
    mapTheme(postTheme: PostTheme | ApiResponse.PostTheme): ArticleTheme {
      return {
        uuid: postTheme.uuid,
        masterPostThemeUuid: postTheme.master_post_theme_uuid,
        title: postTheme.title,
        sentence: postTheme.sample_text,
        rating: postTheme.difficulty_level,
        numberOfUse: postTheme.use_count,
        startDate: timestampToDateString(postTheme.start_date, 'YYYY/M/D'),
        endDate: timestampToDateString(postTheme.end_date, 'YYYY/M/D'),
      };
    },
    isReservedTheme(uuid: string) {
      if (!this.reservedThemeList) {
        return false;
      }
      return this.reservedThemeList.some(
        (theme: ArticleTheme) => theme.uuid === uuid
      );
    },
    openArticleSampleModal(title: string, sentence: string) {
      this.articleSampleModal = { props: { title, sentence }, show: true };
    },
    closeArticleSampleModal() {
      this.articleSampleModal = {
        props: { title: '', sentence: '' },
        show: false,
      };
    },
    async saveUsedTheme(sentence: null | string = null) {
      this.isLoadingOverlay = true;
      try {
        const {
          data: { post_themes },
        } = await updatePostTheme(this.usedTheme!.uuid, {
          title: this.usedTheme!.title,
          sample_text: sentence ?? this.usedTheme!.sentence,
          difficulty_level: this.usedTheme!.rating,
          start_date: toUtcDateTimestamp(this.usedTheme!.startDate!),
          end_date: toUtcDateTimestamp(this.usedTheme!.endDate!),
          master_post_theme_uuid: this.usedTheme!.masterPostThemeUuid!,
        });
        this.currentCompany = { ...this.currentCompany, post_themes };
        this.usedTheme = this.mapTheme(post_themes[0]);
        this.nextTheme =
          post_themes.length > 1 ? this.mapTheme(post_themes[1]) : null;
      } catch (e) {
        alert(e.message);
      } finally {
        this.isLoadingOverlay = false;
      }
    },
    async saveNextTheme(sentence: null | string = null) {
      this.isLoadingOverlay = true;
      try {
        const {
          data: { post_themes },
        } = await updatePostTheme(this.nextTheme!.uuid, {
          title: this.nextTheme!.title,
          sample_text: sentence ?? this.nextTheme!.sentence,
          difficulty_level: this.nextTheme!.rating,
          start_date: toUtcDateTimestamp(this.nextTheme!.startDate!),
          end_date: toUtcDateTimestamp(this.nextTheme!.endDate!),
          master_post_theme_uuid: this.nextTheme!.masterPostThemeUuid!,
        });
        this.currentCompany = { ...this.currentCompany, post_themes };
        this.usedTheme = this.mapTheme(post_themes[0]);
        this.nextTheme = this.mapTheme(post_themes[1]);
      } catch (e) {
        throw new Error(e);
      } finally {
        this.isLoadingOverlay = false;
      }
    },
    dragTheme(event: DragEvent, theme: ArticleTheme) {
      this.draggedTheme = theme;
      this.dragPointY = event.pageY;
    },
    canDropTheme(): boolean {
      if (this.articleThemeList === null || this.draggedTheme === null)
        return false;
      return this.articleThemeList
        .map((articleTheme: ArticleTheme) => articleTheme.uuid)
        .includes(this.draggedTheme.uuid);
    },
    async dropTheme(event: DragEvent & { path: Element[] }) {
      if (
        !this.draggedTheme ||
        !this.articleThemeList ||
        !this.canDropTheme()
      ) {
        return;
      }
      this.dropPointY = event.pageY;
      let path: any;
      if (event.path) {
        path = event.path;
      } else if (event.composedPath) {
        path = event.composedPath();
      } else {
        console.error('Supports neither `path` nor `composedPath`');
        return;
      }
      const themeElement = path.find(
        (element: Element) => element.className === 'draggable-theme-card'
      );
      if (!themeElement) {
        return;
      }
      const element = (themeElement as any) as HTMLOrSVGElement;
      if (this.draggedTheme.uuid === element.dataset.uuid) {
        return;
      }

      // ドラッグしたテーマを除く
      const list = this.articleThemeList.filter(
        (theme: ArticleTheme) => this.draggedTheme!.uuid !== theme.uuid
      );
      // ドロップしたとき下にあるテーマのインデックス
      const index = list.findIndex(
        (theme: ArticleTheme) => element.dataset.uuid === theme.uuid
      );

      const positionIndex =
        this.dragPointY - this.dropPointY > 0 ? index - 1 : index;
      const pre = list[positionIndex];
      const next = list[positionIndex + 1];
      let pos = 0;
      if (pre && next) {
        pos = (pre.pos! + next.pos!) / 2;
      } else if (!pre) {
        pos = next.pos! / 2;
      } else if (!next) {
        pos = pre.pos! + 2 ** 16;
      }
      // 挿入位置のインデックス
      const insertIndex =
        this.dragPointY - this.dropPointY > 0 ? index : index + 1;
      this.isLoadingOverlay = true;
      try {
        await updatePostThemePosition(
          this.currentCompany.uuid,
          this.draggedTheme.uuid,
          { pos }
        );
      } catch (error) {
        throw new Error(error);
      } finally {
        this.isLoadingOverlay = false;
      }
      this.articleThemeList = list;

      this.articleThemeList.splice(insertIndex, 0, this.draggedTheme);
    },
    dragMiniTheme(event: DragEvent, theme: ArticleTheme) {
      this.draggedTheme = theme;
      this.dragPointY = event.pageY;
    },
    canDropMiniTheme(): boolean {
      if (this.reservedThemeList === null || this.draggedTheme === null)
        return false;
      return this.reservedThemeList
        .map((reservedTheme: ArticleTheme) => reservedTheme.uuid)
        .includes(this.draggedTheme.uuid);
    },
    async dropMiniTheme(event: DragEvent & { path: Element[] }) {
      if (
        !this.draggedTheme ||
        !this.reservedThemeList ||
        !this.canDropMiniTheme()
      ) {
        return;
      }
      this.dropPointY = event.pageY;
      let path: any;
      if (event.path) {
        path = event.path;
      } else if (event.composedPath) {
        path = event.composedPath();
      } else {
        console.error('Supports neither `path` nor `composedPath`');
        return;
      }
      const themeElement = path.find(
        (element: Element) => element.className === 'draggable-mini-theme-card'
      );
      if (!themeElement) {
        return;
      }
      const element = (themeElement as any) as HTMLOrSVGElement;
      if (this.draggedTheme.uuid === element.dataset.uuid) {
        return;
      }
      this.isLoadingOverlay = true;
      try {
        const dropedTheme = this.reservedThemeList!.find(
          (t: ArticleTheme) => t.uuid === element.dataset.uuid
        );
        await updatePostTheme(this.draggedTheme.uuid, {
          title: this.draggedTheme.title,
          sample_text: this.draggedTheme.sentence,
          difficulty_level: this.draggedTheme.rating,
          start_date: toUtcDateTimestamp(dropedTheme!.startDate!),
          end_date: toUtcDateTimestamp(dropedTheme!.endDate!),
          master_post_theme_uuid: this.draggedTheme.masterPostThemeUuid!,
        });
      } catch (error) {
        throw new Error(error);
      } finally {
        this.isLoadingOverlay = false;
      }
      const list = this.reservedThemeList.filter(
        (theme: ArticleTheme) => this.draggedTheme!.uuid !== theme.uuid
      );
      const index = list.findIndex(
        (theme: ArticleTheme) => element.dataset.uuid === theme.uuid
      );
      this.reservedThemeList = list;
      const insertIndex =
        this.dragPointY - this.dropPointY > 0 ? index : index + 1;
      this.reservedThemeList.splice(insertIndex, 0, this.draggedTheme);
    },
    selectTheme() {
      switch (this.selectMode.type) {
        case 'use-theme':
          this.replaceTheme(1);
          break;
        case 'next-theme':
          this.replaceTheme(2);
          break;
        case 'reserved-theme':
          this.editReserveTheme();
          break;
        case 'empty-reserved-theme':
        default:
          this.addReserveTheme();
          break;
      }
    },
    async replaceTheme(priority: number) {
      if (!this.selectMode.selectedTheme) {
        return;
      }
      this.isLoadingOverlay = true;
      try {
        if (priority === 1) {
          if (this.usedTheme) {
            const {
              data: { post_themes },
            } = await updatePostTheme(this.usedTheme!.uuid, {
              title: this.selectMode.selectedTheme.title,
              sample_text: this.selectMode.selectedTheme.sentence,
              difficulty_level: this.selectMode.selectedTheme.rating,
              start_date: toUtcDateTimestamp(this.usedTheme!.startDate!),
              end_date: toUtcDateTimestamp(this.usedTheme!.endDate!),
              master_post_theme_uuid: this.selectMode.selectedTheme.uuid,
            });
            this.articleThemeList = this.articleThemeList!.map(
              (theme: ArticleTheme) => {
                if (theme.uuid === this.selectMode.selectedTheme!.uuid) {
                  const numberOfUse = theme.numberOfUse + 1;
                  return { ...theme, numberOfUse };
                }

                if (theme.uuid === this.usedTheme?.masterPostThemeUuid) {
                  const numberOfUse = theme.numberOfUse - 1;
                  return { ...theme, numberOfUse };
                }
                return theme;
              }
            );
            this.usedTheme = this.mapTheme(post_themes[0]);
            this.currentCompany = { ...this.currentCompany, post_themes };
          } else {
            const startDate = moment();
            const { data: postTheme } = await createPostTheme(
              this.currentCompany.uuid,
              {
                master_post_theme_uuid: this.selectMode.selectedTheme.uuid,
                title: this.selectMode.selectedTheme.title,
                sample_text: this.selectMode.selectedTheme.sentence,
                difficulty_level: this.selectMode.selectedTheme.rating,
                start_date: startDate.utc().unix(),
                end_date: this.AdjustEndDateFromNumber(
                  startDate.utc().unix(),
                  this.currentCompany.post_rule
                ),
              }
            );
            this.articleThemeList = this.articleThemeList!.map(
              (theme: ArticleTheme) => {
                if (theme.uuid === this.selectMode.selectedTheme!.uuid) {
                  const numberOfUse = theme.numberOfUse + 1;
                  return { ...theme, numberOfUse };
                }
                return theme;
              }
            );
            this.usedTheme = this.mapTheme(postTheme);
            const post_themes = [postTheme];
            this.currentCompany = { ...this.currentCompany, post_themes };
          }
        } else if (priority === 2) {
          if (this.usedTheme == null) {
            alert('先に利用中のテーマを設定してください');
            return;
          }
          if (this.nextTheme) {
            const {
              data: { post_themes },
            } = await updatePostTheme(this.nextTheme!.uuid, {
              title: this.selectMode.selectedTheme.title,
              sample_text: this.selectMode.selectedTheme.sentence,
              difficulty_level: this.selectMode.selectedTheme.rating,
              start_date: toUtcDateTimestamp(this.nextTheme!.startDate!),
              end_date: toUtcDateTimestamp(this.nextTheme!.endDate!),
              master_post_theme_uuid: this.selectMode.selectedTheme.uuid,
            });
            this.articleThemeList = this.articleThemeList!.map(
              (theme: ArticleTheme) => {
                if (theme.uuid === this.selectMode.selectedTheme!.uuid) {
                  const numberOfUse = theme.numberOfUse + 1;
                  return { ...theme, numberOfUse };
                }

                if (theme.uuid === this.nextTheme?.masterPostThemeUuid) {
                  const numberOfUse = theme.numberOfUse - 1;
                  return { ...theme, numberOfUse };
                }
                return theme;
              }
            );
            this.nextTheme = this.mapTheme(post_themes[1]);
            this.currentCompany = { ...this.currentCompany, post_themes };
          } else {
            const startDate = moment(this.usedTheme.endDate!).add(1, 'days');
            const { data: postTheme } = await createPostTheme(
              this.currentCompany.uuid,
              {
                master_post_theme_uuid: this.selectMode.selectedTheme.uuid,
                title: this.selectMode.selectedTheme.title,
                sample_text: this.selectMode.selectedTheme.sentence,
                difficulty_level: this.selectMode.selectedTheme.rating,
                start_date: startDate.utc().unix(),
                end_date: this.AdjustEndDateFromNumber(
                  startDate.utc().unix(),
                  this.currentCompany.post_rule
                ),
              }
            );
            this.articleThemeList = this.articleThemeList!.map(
              (theme: ArticleTheme) => {
                if (theme.uuid === this.selectMode.selectedTheme!.uuid) {
                  const numberOfUse = theme.numberOfUse + 1;
                  return { ...theme, numberOfUse };
                }
                return theme;
              }
            );
            this.nextTheme = this.mapTheme(postTheme);
            const post_themes = [postTheme];
            this.currentCompany = { ...this.currentCompany, post_themes };
          }
        }
        this.cancelSelectMode();
      } catch (error) {
        throw new Error(error);
      } finally {
        this.refreshTheme();
        this.isLoadingOverlay = false;
      }
    },
    async editReserveTheme() {
      if (!this.nextTheme) {
        this.cancelSelectMode();
        alert('先に次回のテーマを設定してください');
        return;
      }
      if (!this.selectMode.selectedTheme || !this.selectMode.activeTheme) {
        this.cancelSelectMode();
        return;
      }
      const { uuid } = this.selectMode.selectedTheme;
      if (this.isReservedTheme(uuid)) {
        this.cancelSelectMode();
        return;
      }
      try {
        const {
          data: { post_themes },
        } = await updatePostTheme(this.selectMode.activeTheme.uuid, {
          title: this.selectMode.selectedTheme.title,
          sample_text: this.selectMode.selectedTheme.sentence,
          difficulty_level: this.selectMode.selectedTheme.rating,
          start_date: toUtcDateTimestamp(
            this.selectMode.activeTheme!.startDate!
          ),
          end_date: toUtcDateTimestamp(this.selectMode.activeTheme!.endDate!),
          master_post_theme_uuid: this.selectMode.selectedTheme.uuid,
        });
        this.articleThemeList = this.articleThemeList!.map(
          (theme: ArticleTheme) => {
            if (theme.uuid === this.selectMode.selectedTheme!.uuid) {
              const numberOfUse = theme.numberOfUse + 1;
              return { ...theme, numberOfUse };
            }

            if (
              theme.uuid === this.selectMode.activeTheme?.masterPostThemeUuid
            ) {
              const numberOfUse = theme.numberOfUse - 1;
              return { ...theme, numberOfUse };
            }
            return theme;
          }
        );
        this.currentCompany = { ...this.currentCompany, post_themes };
        this.cancelSelectMode();
      } catch (error) {
        throw new Error(error);
      } finally {
        this.refreshTheme();
        this.isLoadingOverlay = false;
      }
    },
    async addReserveTheme() {
      if (!this.nextTheme) {
        this.cancelSelectMode();
        alert('先に次回のテーマを設定してください');
        return;
      }
      if (!this.selectMode.selectedTheme) {
        this.cancelSelectMode();
        return;
      }
      if (!this.reservedThemeList) {
        this.reservedThemeList = [this.selectMode.selectedTheme];
        this.cancelSelectMode();
        return;
      }
      const { uuid } = this.selectMode.selectedTheme;
      if (this.isReservedTheme(uuid)) {
        this.cancelSelectMode();
        return;
      }
      try {
        const postThemes = [...this.currentCompany.post_themes];
        if (postThemes == null) {
          this.cancelSelectMode();
          return;
        }
        this.isLoadingOverlay = true;
        const lastTheme = postThemes.reverse().find(() => true);

        const startDate = moment.unix(lastTheme!.end_date).add(1, 'days');
        const endDate = this.AdjustEndDateFromNumber(
          startDate.unix(),
          this.currentCompany.post_rule
        );
        const { data: postTheme } = await createPostTheme(
          this.currentCompany.uuid,
          {
            master_post_theme_uuid: this.selectMode.selectedTheme.uuid,
            title: this.selectMode.selectedTheme.title,
            sample_text: this.selectMode.selectedTheme.sentence,
            difficulty_level: this.selectMode.selectedTheme.rating,
            start_date: startDate.utc().unix(),
            end_date: endDate,
          }
        );

        this.reservedThemeList.push(this.mapTheme(postTheme));
        this.articleThemeList = this.articleThemeList!.map(
          (theme: ArticleTheme) => {
            if (theme.uuid === this.selectMode.selectedTheme!.uuid) {
              const numberOfUse = theme.numberOfUse + 1;
              return { ...theme, numberOfUse };
            }
            return theme;
          }
        );
        const post_themes = this.currentCompany.post_themes!;
        post_themes.push(postTheme);
        this.currentCompany = {
          ...this.currentCompany,
          post_themes,
        };
        this.cancelSelectMode();
      } catch (error) {
        throw new Error(error);
      } finally {
        this.refreshTheme();
        this.isLoadingOverlay = false;
      }
    },
    async deleteReservedTheme(uuid: string) {
      if (!this.reservedThemeList) {
        this.cancelSelectMode();
        return;
      }
      this.isLoadingOverlay = true;
      try {
        const postTheme = this.reservedThemeList!.find(
          (theme: ArticleTheme) => theme.uuid === uuid
        );
        this.articleThemeList = this.articleThemeList!.map(
          (theme: ArticleTheme) => {
            if (theme.uuid === postTheme!.masterPostThemeUuid) {
              const numberOfUse = theme.numberOfUse - 1;
              return { ...theme, numberOfUse };
            }
            return theme;
          }
        );
        await deletePostTheme(uuid);
        this.reservedThemeList = this.reservedThemeList!.filter(
          (theme: ArticleTheme) => theme.uuid !== uuid
        );
        const post_themes = this.currentCompany.post_themes!.filter(
          (theme: PostTheme) => theme.uuid !== uuid
        );
        this.currentCompany = { ...this.currentCompany, post_themes };
        this.cancelSelectMode();
      } catch (e) {
        throw new Error(e);
      } finally {
        this.refreshTheme();
        this.isLoadingOverlay = false;
      }
    },
    AdjustEndDateFromNumber(date: number, rule: string) {
      switch (rule) {
        case 'three_months':
          return moment
            .unix(date)
            .add(3, 'months')
            .subtract(1, 'day')
            .utc()
            .unix();
        case 'week':
          return moment
            .unix(date)
            .add(1, 'week')
            .utc()
            .unix();
        case 'month':
        default:
          return moment
            .unix(date)
            .add(1, 'months')
            .subtract(1, 'day')
            .utc()
            .unix();
      }
    },
    enterSelectMode(type: string, activeTheme: number | ArticleTheme = {}) {
      console.log(activeTheme);
      this.selectMode.type = type;
      this.selectMode.activeTheme = activeTheme;
    },
    cancelSelectMode() {
      this.selectMode.type = '';
      this.selectMode.activeTheme = {};
    },
  },
});
</script>

<style lang="scss" scoped>
.content-wrapper {
  margin-top: 30px;
}

.contents {
  position: relative;
  height: 100%;
  min-height: 900px;
  background-color: $true_white;
  margin-top: 16px;

  .new-annouce {
    margin: auto;
    width: 600px;
    height: 800px;

    div {
      margin-top: 200px;
    }
  }
}

.theme-columns {
  position: relative;
  padding-right: 340px;
  margin-top: 15px;
}

.theme-column {
  & + & {
    position: absolute;
    z-index: 9;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    width: 320px;
    height: 100%;
    padding: 10px 8px 10px 10px;
    background: #fff0d2;
    border-radius: 6px;
  }

  .column-title {
    display: flex;
    align-items: center;
    font-size: 15px;
    font-weight: 600;
    color: $dark_blue;

    img {
      margin-right: 7px;
    }
  }

  .column-sub-title {
    position: relative;
    margin: 10px 10px 15px;
    padding: 10px;
    font-size: 10px;
    font-weight: 300;
    color: $dark_blue;

    img {
      position: absolute;
      left: 0;
      bottom: -10px;
      height: 90px;
    }

    div {
      position: relative;
      z-index: 9;
    }
  }
}

.theme-list-area {
  flex-grow: 1;
  padding-right: 6px;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: #7e8195 white;
}

.theme-list-area::-webkit-scrollbar {
  width: 4px;
  height: 0;
}

.theme-list-area::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #7e8195;
}

.editable-theme-card {
  & + & {
    margin-top: 10px;
  }
}

.reserved-theme {
  margin-top: 20px;
  background: #e3e9ef;
  border-radius: 4px;
  padding: 15px;

  .title {
    font-size: 15px;
    font-weight: 600;
    color: $dark_blue;
  }

  .sub-title {
    font-size: 13px;
    font-weight: 300;
    color: $dark_blue;
  }
}

.draggable-mini-theme-card {
  display: flex;
  background: #fff;
  border: solid 1px #e4e5ed;
  border-radius: 6px;
  margin-top: 10px;
  padding: 15px 15px 15px 6px;
  cursor: grab;

  .moving-handle {
    display: flex;
    align-items: center;

    & > img {
      height: 16px;
    }
  }

  .delete {
    display: flex;
    align-items: center;
    margin-left: 10px;
    cursor: pointer;

    & > img {
      height: 18px;
    }
  }

  .theme-elements {
    margin-left: 6px;

    .star-rating {
      text-align: center;
      margin-bottom: 3px;
    }
  }

  .theme-title {
    color: $gray_blue_1;
    flex-grow: 1;
    background-color: #f3f3f3;
    margin-right: 6px;
    border: solid 1px #e4e5ed;
    border-radius: 4px;
    padding: 4px 11px;
    line-height: 32px;
    font-size: 13px;
    font-weight: 300;
    height: 40px;
    width: 279px;
    margin-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.theme-change-button {
  display: flex;
  align-items: center;
  padding-left: 10px;
  margin-left: 10px;
  border-left: solid 1px #e4e5ed;

  .theme-change-button__button {
    width: 100px;
    height: 30px;
    background-color: $light_gray_blue_7;
    color: #6a6d83;
    border: none;
    border-radius: 4px;

    &:hover {
      background-color: $light_gray_blue_8;
    }
  }
}

.draggable-theme-card .moving-handle img {
  height: 70px;
}

.reserved-theme.selected .cancel-select-mode img {
  margin-left: 7px;
  height: 12px;
}

.draggable-theme-card {
  display: flex;
  background: #fff;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  padding: 15px 15px 15px 6px;
  cursor: grab;

  &.invisible {
    display: none;
  }

  & + & {
    margin-top: 10px;
  }

  .moving-handle {
    display: flex;
    padding-top: 20px;
  }

  .theme-content {
    flex-grow: 1;
    margin-left: 6px;
    overflow: hidden;
  }

  .top-box {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 0 20px 0 0;

    .left {
      & + * {
        margin-left: 10px;
      }
    }

    .used-count {
      font-size: 13px;
      font-weight: 300;
      color: $dark_blue;
    }
  }

  .middle-box {
    display: flex;
    margin-top: 10px;

    .theme-title {
      flex-grow: 1;
      border: solid 1px $light_gray_blue_3;
      border-radius: 4px;
      background-color: $white_2;
      color: $gray_blue_1;
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .bottom-box {
    margin-top: 10px;
    color: $gray_blue_4;
    font-size: 13px;
    font-weight: 300;
    border: solid 1px $light_gray_blue_3;
    border-radius: 4px;
    padding: 5px;
    width: 100%;

    .button {
      display: flex;
      align-items: center;
      padding-left: 10px;
      line-height: 1;

      span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border: solid 1px $light_gray_blue_3;
        border-radius: 4px;
        margin-left: auto;
        cursor: pointer;

        img {
          max-height: 100%;
        }
      }
    }

    .theme-sentence {
      border-top: solid 1px $light_gray_blue_3;
      padding: 10px 10px 5px;
      margin-top: 5px;
    }
  }

  .theme-selection-button {
    width: 80px;
    margin-right: 10px;
    background: $light_gray_blue_5;
    color: inherit;
    flex-shrink: 0;
  }

  .theme-title-input {
    height: 40px;
  }
}

.reserved-theme.selected {
  position: relative;
  z-index: 9;
}

.draggable-mini-theme-card.selected {
  border-color: $pink;

  .theme-change-button__button {
    background: #f2f4ff;
    pointer-events: none;
  }
}

.draggable-mini-theme-card.empty-theme {
  cursor: default;

  .moving-handle {
    opacity: 0.7;
  }

  .theme-elements {
    .withIcon {
      opacity: 0.7;
      pointer-events: none;
    }
  }

  .delete {
    opacity: 0.7;
    pointer-events: none;
  }
}

.reserved-theme.selected .cancel-select-mode {
  position: absolute;
  padding: 0 15px;
  height: 30px;
  background: $light_gray_blue_5;
  border: none;
  border-radius: 4px;
  bottom: calc(100% + 25px);
  right: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reserved-theme:not(.selected) .cancel-select-mode {
  display: none;
  pointer-events: none;
}

.select-mode-overlay {
  position: fixed;
  z-index: 8;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.8);
}

.rule-text {
  color: $dark_blue;
}
</style>
