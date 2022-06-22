<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="コミュニティ一覧・編集">
        <template #tutorial>
          <TutorialButtonIcon :url="`/admin/tutorial/community-setting.html`" />
        </template>
        <template #description>
          誰でもコミュニティを登録することができます。
        </template>
      </page-header>
      <div v-if="!isLoading" class="l-contents">
        <ValidationObserver v-slot="{ handleSubmit }">
          <form class="form" @submit.prevent="handleSubmit(onSubmit)">
            <div class="contents-top-item">
              <div class="flex-box">
                <div class="item">
                  <Integrated-switch-button
                    v-model="selectedValues"
                    :items="[
                      { value: 'is_official', text: '公式' },
                      { value: '', text: '非公式' },
                    ]"
                    to-boolean
                  />
                </div>
                <validation-provider
                  v-slot="type"
                  rules="required"
                  name="コミュニティタイプ"
                  class="item"
                >
                  <div>
                    <BaseSelect
                      v-model="input.type"
                      class="type-select select"
                      :items="[
                        { name: '一般', value: 'general' },
                        { name: 'ビジネス', value: 'business' },
                      ]"
                      required
                    />
                  </div>
                  <span class="float error ignore-margin">
                    {{ type.errors[0] ? '※' + type.errors[0] : '' }}
                  </span>
                </validation-provider>
                <validation-provider
                  v-slot="name"
                  rules="required|max:100"
                  name="コミュニティ名"
                  class="item"
                >
                  <div>
                    <input
                      id="name"
                      v-model="input.name"
                      class="base-input community-name"
                      :class="{ 'error-input': name.errors[0] }"
                      @input="onNameInput"
                    />
                  </div>
                  <span class="float error ignore-margin">
                    {{ name.errors[0] ? '※' + name.errors[0] : '' }}
                  </span>
                </validation-provider>
              </div>
              <div class="button-box">
                <base-button
                  type="button"
                  class="button"
                  :disabled="isLoading"
                  @click="uploadFilesModal = true"
                >
                  写真登録
                </base-button>
                <base-button
                  type="button"
                  class="button app-preview-button"
                  @click="toggleApplicationPreviewModal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8.838"
                    height="16"
                    viewBox="0 0 8.838 16"
                  >
                    <path
                      id="Path_1584"
                      data-name="Path 1584"
                      d="M707.769,987.385l-5.592-.022a1.6,1.6,0,0,0-1.6,1.591l-.05,12.783a1.6,1.6,0,0,0,1.591,1.6l5.592.022a1.6,1.6,0,0,0,1.6-1.592l.05-12.783A1.6,1.6,0,0,0,707.769,987.385Zm-4.356,1.469h0l3.057.013a.2.2,0,0,1,0,.4h0l-3.057-.013a.2.2,0,0,1,0-.4Zm1.527,13.2a.515.515,0,1,1,.517-.513A.515.515,0,0,1,704.94,1002.057Zm3.471-1.648-6.978-.027.041-10.389,6.978.027Z"
                      transform="translate(-700.523 -987.363)"
                      fill="#fff"
                    />
                  </svg>
                  アプリプレビュー
                </base-button>
              </div>
            </div>

            <div class="inner-container">
              <validation-provider
                v-slot="kana"
                rules="required|isHiragana|max:100"
                name="ふりがな"
              >
                <div class="textarea-box form-item">
                  <div class="field-label-box">
                    <label class="label"
                      >ふりがな<span class="required">※必須</span></label
                    >
                  </div>
                  <input
                    id="kana"
                    v-model="input.kana"
                    class="base-input"
                    :class="{ 'error-input': kana.errors[0] || !input.kana }"
                  />
                </div>
                <span v-if="kana.errors[0]" class="error">
                  {{ kana.errors[0] ? '※' + kana.errors[0] : '' }}
                </span>
              </validation-provider>

              <validation-provider
                v-slot="description"
                rules="required|max:100"
                name="コミュニティ活動内容"
              >
                <div class="textarea-box form-item">
                  <div class="field-label-box">
                    <label class="label">コミュニティ活動内容</label>
                    <span class="required">※必須</span>
                  </div>

                  <textarea
                    v-model="input.description"
                    placeholder="コミュニティの活動内容を入力してください。"
                    class="textarea"
                    :class="{
                      'error-input': isError(description) || !input.description,
                    }"
                    rows="5"
                  ></textarea>
                </div>
                <span v-if="description.errors[0]" class="error">{{
                  description.errors[0] ? '※' + description.errors[0] : ''
                }}</span>
              </validation-provider>
              <validation-provider
                v-slot="representative"
                rules="required"
                name="代表者"
              >
                <div class="input-box form-item form-item-align-center">
                  <div class="field-label-box">
                    <label class="label"
                      >代表者<span class="required">※必須</span></label
                    >
                  </div>
                  <v-select
                    v-model="input.representative_uuid"
                    class="select"
                    :class="{
                      'error-select':
                        isError(representative) || !input.representative_uuid,
                    }"
                    :options="members"
                    :reduce="(member) => member.uuid"
                    :clearable="false"
                    hide-no-data
                    label="name"
                  >
                    <template #open-indicator="{ attributes }">
                      <span v-bind="attributes"></span>
                    </template>
                    <template slot="option" slot-scope="member">
                      {{ member.name }}
                    </template>
                  </v-select>
                </div>
                <span v-if="representative.errors[0]" class="error">{{
                  representative.errors[0] ? '※' + representative.errors[0] : ''
                }}</span>
              </validation-provider>
              <validation-provider
                v-slot="message"
                rules="required|max:100"
                name="代表者からのメッセージ"
              >
                <div class="textarea-box form-item">
                  <div class="field-label-box">
                    <label class="label">代表者からのメッセージ</label>
                    <span class="required">※必須</span>
                  </div>
                  <textarea
                    v-model="input.message"
                    placeholder="代表者の方のメッセージを入力してください。"
                    class="textarea"
                    :class="{
                      'error-input': isError(message) || !input.message,
                    }"
                  ></textarea>
                </div>
                <span v-if="message.errors[0]" class="error">{{
                  message.errors[0] ? '※' + message.errors[0] : ''
                }}</span>
              </validation-provider>

              <div class="input-box form-item form-item-align-center">
                <div class="field-label-box">
                  <label class="label">設立日</label>
                </div>
                <div class="date-box">
                  <date-input
                    v-model="input.establish_date"
                    class="date-input"
                    display-format="YYYY年MM月DD日"
                  />
                </div>
              </div>

              <div class="input-box form-item form-item-align-center">
                <div class="field-label-box">
                  <label class="label">期間設定</label>
                </div>
                <div class="date-box">
                  <div>
                    <span class="date-label">開始</span>
                    <date-input
                      v-model="input.start_date"
                      class="date-input"
                      display-format="YYYY年MM月DD日"
                    />
                  </div>
                  <div class="end-date-box">
                    <span class="date-label">終了</span>
                    <date-input
                      v-model="input.end_date"
                      class="date-input"
                      display-format="YYYY年MM月DD日"
                    />
                  </div>
                </div>
              </div>

              <validation-provider
                v-slot="postRule"
                rules="required"
                name="投稿ルール"
              >
                <div class="select-box form-item form-item-align-center">
                  <div class="field-label-box">
                    <label class="label">投稿ルール</label>
                  </div>
                  <BaseSelect
                    v-model="input.community_team_episode"
                    class="select"
                    :items="postRulesOptions(postRules)"
                  />
                </div>
                <span v-if="postRule.errors[0]" class="error">{{
                  postRule.errors[0] ? '※' + postRule.errors[0] : ''
                }}</span>
              </validation-provider>

              <div class="form-item">
                <div class="field-label-box">
                  <label class="label">公開対象の設定</label>
                </div>
                <div class="field-checkbox publish">
                  <div>
                    <textarea
                      :value="publishTarget"
                      disabled
                      class="textarea"
                    ></textarea>
                  </div>
                  <div>
                    <base-button
                      size="large"
                      class="input"
                      @click="isPublishCompanySelectModalVisible = true"
                      >変更する</base-button
                    >
                  </div>
                </div>
              </div>
              <div class="form-button-box">
                <base-button
                  type="submit"
                  size="large"
                  class="submit-button"
                  :disabled="isLoading || unentered"
                  @click="handleSubmit(onSubmit)"
                >
                  登録する
                </base-button>
              </div>
              <div class="form-button-box delete-button-box">
                <a class="delete-button" @click="toggleDeleteCommunityModal">
                  このコミュニティを削除する
                </a>
              </div>
            </div>
          </form>
        </ValidationObserver>
      </div>
      <div v-else class="no-data"></div>
    </div>
    <application-preview-detail
      v-if="applicationPreviewModal"
      :input="input"
      :community="community"
      :is-offices="selectedValues"
      :main-image="mainImage"
      @click="toggleApplicationPreviewModal"
    />
    <upload-files
      v-if="uploadFilesModal"
      :main-image-uuid="input.main_image_uuid"
      :add-image-urls="input.add_image_urls"
      :delete-image-uuids="input.delete_image_uuids"
      :registered-images="registeredImages"
      :main-image="mainImage"
      @onClick="uploadFiles"
      @onClose="uploadFilesModal = false"
      @onDelete="deleteImages"
      @changeMainImage="changeMainImage"
    />
    <check-delete
      v-if="deleteCommunityModal"
      delete-button-text="削除"
      @click="deleteCommunity"
      @close="toggleDeleteCommunityModal"
    >
      このコミュニティを削除しますか？
    </check-delete>
    <success-message
      v-if="isMessageModalVisible"
      @close="isMessageModalVisible = !isMessageModalVisible"
    >
      入力された情報が保存されました。
    </success-message>
    <alert-message
      v-if="isAlertModalVisible"
      @close="isAlertModalVisible = !isAlertModalVisible"
    >
      {{ alertMessage }}
    </alert-message>
    <publish-company-select-modal
      v-if="isPublishCompanySelectModalVisible"
      :companies="organizations"
      :selected="publishOrganizations"
      @add="addPublishOrganization"
      @close="isPublishCompanySelectModalVisible = false"
    />
    <vue-loading
      v-if="isLoading"
      type="spin"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    ></vue-loading>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { timestampToDateString, toUtcDateTimestamp } from '@/libs/dayjs';
import { flatMap, map, pick } from 'lodash';
import * as AutoKana from 'vanilla-autokana';
import {
  deleteCommunity,
  fetchCommunity,
  fetchConfigRules,
  fetchOrganizations,
  updateCommunity,
} from '@/libs/api';
import {
  AlertMessage,
  CheckDelete,
  SuccessMessage,
  UploadFiles,
} from '@/components/Admin/Modules/Modal';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import DateInput from '@/components/Admin/Modules/Input/DateInput.vue';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';
import { VueLoading } from 'vue-loading-template';
import { IntegratedSwitchButton } from '@/components/Admin/Pages';
import PublishCompanySelectModal from '@/components/Admin/Pages/Community/PublishCompanySelectModal.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';

import dayjs from 'dayjs';
import ApplicationPreviewDetail from '~/components/Admin/Pages/CommunityManagement/AppPreview/ApplicationPreviewDetail.vue';

type Community = ApiResponse.CommunityDetail;

type UpdateCommunityForm = {
  name: string;
  kana: string;
  type: string;
  is_official: boolean;
  description: string;
  representative_uuid: string;
  message: string;
  establish_date: string;
  start_date: string;
  end_date: string;
  community_team_episode: ApiRequest.Interval;
  publish_organizations: string[];
  main_image_uuid: string;
  add_image_urls: ApiRequest.AddImageUrl[];
  delete_image_uuids: string[];
};

export default Vue.extend({
  layout: 'admin/default',
  components: {
    ValidationObserver,
    ValidationProvider,
    ApplicationPreviewDetail,
    CheckDelete,
    UploadFiles,
    SuccessMessage,
    AlertMessage,
    PageHeader,
    BaseButton,
    DateInput,
    VueLoading,
    IntegratedSwitchButton,
    PublishCompanySelectModal,
    BaseSelect,
    TutorialButtonIcon,
  },
  data() {
    return {
      autokana: undefined as AutoKana.AutoKana | undefined,
      community: {} as Community,
      organizations: null as null | ApiResponse.Organization[],
      applicationPreviewModal: false as boolean,
      uploadFilesModal: false as boolean,
      deleteCommunityModal: false as boolean,
      propUploadedImage: '' as string,
      input: {
        start_date: timestampToDateString(dayjs().unix()),
        establish_date: timestampToDateString(dayjs().unix()),
        end_date: '',
      } as UpdateCommunityForm,
      configRules: {} as ApiResponse.ConfigRules,
      publishOrganizations: [] as string,
      isMessageModalVisible: false,
      isAlertModalVisible: false,
      isPublishCompanySelectModalVisible: false,
      alertMessage: '',
      selectedValues: '',
      registeredImages: [] as Types.Image[],
      mainImage: {} as Types.Image | null,
      isLoading: true as boolean,
    };
  },
  computed: {
    unentered(): boolean {
      return (
        this.input.kana === '' ||
        this.input.kana == null ||
        this.input.description === '' ||
        this.input.description == null ||
        this.input.representative_uuid === '' ||
        this.input.representative_uuid == null ||
        this.input.message === '' ||
        this.input.message == null
      );
    },
    publishTarget(): string {
      if (this.publishOrganizations.length === this.organizations?.length) {
        return 'すべての会社';
      }
      const names = this.publishOrganizations.map(
        (uuid: string): string =>
          this.organizations.find(
            (v: ApiResponse.Organization) => v.uuid === uuid
          )?.name
      );
      return names.join('　');
    },
    uuid(): string {
      return this.$route.params.id;
    },
    members(): Pick<ApiResponse.CommunityUser, 'uuid' | 'name'>[] {
      return flatMap(
        this.community.companies,
        (company: ApiResponse.CommunityCompany) => {
          return company.users.map((user: ApiResponse.CommunityUser) =>
            pick(user, 'uuid', 'name')
          );
        }
      );
    },
    postRules(): { key: string; name: string }[] {
      const correspondence = {
        three_months: '3ヶ月',
        month: '1ヶ月',
        week: '一週間',
        none: 'なし',
        '': '', // FIXME: 型定義に合わせて空文字も許容したが修正したい
      };
      return [
        {
          key: 'slowly',
          name: `ゆっくり(${correspondence[
            this.configRules?.community_team_episode?.slowly
          ] ?? correspondence.three_months})`,
        },
        {
          key: 'normal',
          name: `普通(${correspondence[
            this.configRules?.community_team_episode?.normal
          ] ?? correspondence.month})`,
        },
        {
          key: 'frequent',
          name: `頻繁(${correspondence[
            this.configRules?.community_team_episode?.frequent
          ] ?? correspondence.week})`,
        },
        {
          key: 'none',
          name: `催促無し(${correspondence.none})`,
        },
      ];
    },
  },
  async created() {
    try {
      this.isLoading = true;
      await Promise.all([this.fetchCommunityData()]).then(() => {
        this.fetchOrganizations();
        this.fetchConfigRules();
      });
      this.input = this.responseToForm(this.community);

      if (this.community.is_official) {
        this.selectedValues = 'is_official';
      }

      this.registeredImages = this.community.images;
      this.mainImage = this.community.main_image;
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  },
  mounted() {
    try {
      this.autokana = AutoKana.bind('#name', '#kana');
    } catch (err) {
      console.error(err);
    }
  },
  methods: {
    addPublishOrganization(selectedUuidList: []) {
      this.publishOrganizations = selectedUuidList;
      this.isPublishCompanySelectModalVisible = false;
    },
    onNameInput(): void {
      if (this.autokana === undefined) {
        return;
      }
      this.input.kana = this.autokana.getFurigana();
    },
    onSubmit() {
      try {
        const assertion = (
          input: UpdateCommunityForm
        ): input is Required<UpdateCommunityForm> => {
          // @ts-ignore
          if (Object.values(input).includes(undefined)) {
            throw new Error('should not be undefined.');
          }
          return true;
        };
        if (!assertion(this.input)) {
          return;
        }
        if (dayjs(this.input.start_date) > dayjs(this.input.end_date)) {
          this.showAlert('終了日には開始日以降の日付を指定して下さい。');
          return;
        }
        this.input.is_official = this.selectedValues === 'is_official';

        this.input.publish_organizations = this.publishOrganizations;

        // アップロードされた画像がメイン画像として選択された場合
        if (this.mainImage && !this.mainImage.uuid) {
          this.input.add_image_urls = this.$data.input.add_image_urls.map(
            (a: any) => {
              if (this.mainImage && this.mainImage.url.includes(a.url)) {
                return {
                  ...a,
                  is_main: true,
                };
              }
              return a;
            }
          );
          this.input.main_image_uuid = '';
        } else if (this.mainImage)
          // @ts-ignore
          this.input.main_image_uuid = this.mainImage.uuid;

        this.updateCommunity(this.uuid, this.formToRequestBody(this.input));
      } catch (err) {
        console.error(err);
      }
    },
    responseToForm(community: Community): UpdateCommunityForm {
      return {
        ...pick<Community, keyof Community>(
          community,
          'type',
          'name',
          'kana',
          'description',
          'message'
        ),
        representative_uuid: community.user?.uuid,
        // @ts-ignore
        establish_date:
          community.establish_date !== 0
            ? timestampToDateString(community.establish_date, 'YYYY/M/D')
            : timestampToDateString(dayjs().unix()),
        // @ts-ignore
        start_date:
          community.start_date !== 0
            ? timestampToDateString(community.start_date)
            : timestampToDateString(dayjs().unix()),
        // @ts-ignore
        end_date: timestampToDateString(community.end_date),
        community_team_episode: community.community_team_episode,
        publish_organizations: map(community.publish_organizations, 'uuid'),
        main_image_uuid: '',
        add_image_urls: [],
        delete_image_uuids: [],
      };
    },
    formToRequestBody(
      input: Required<UpdateCommunityForm>
    ): ApiRequest.UpdateCommunity {
      return {
        name: input.name,
        kana: input.kana,
        type: input.type,
        is_official: input.is_official,
        description: input.description,
        owner_uuid: input.representative_uuid,
        message: input.message,
        establish_date: toUtcDateTimestamp(input.establish_date),
        start_date: toUtcDateTimestamp(input.start_date),
        end_date: toUtcDateTimestamp(input.end_date),
        community_team_episode: input.community_team_episode,
        publish_organizations: [...input.publish_organizations],
        main_image_uuid: input.main_image_uuid,
        add_image_urls: input.add_image_urls,
        delete_image_uuids: input.delete_image_uuids,
      };
    },
    async fetchCommunityData(): Promise<void> {
      try {
        const { data } = await fetchCommunity(this.uuid);
        this.community = data;
      } catch (e) {
        console.error(e);
      }
    },
    async fetchOrganizations(): Promise<void> {
      try {
        const { data } = await fetchOrganizations({ layer: 0 });
        // 新規作成直後はすべて公開対象とする
        if (
          this.community &&
          this.community.publish_organizations.length === 0
        ) {
          this.publishOrganizations = data.organizations.map(
            (o: { uuid: string }) => o.uuid
          );
        } else {
          this.publishOrganizations = this.community.publish_organizations.map(
            (o: { uuid: string }) => o.uuid
          );
        }
        this.organizations = data.organizations;
      } catch (e) {
        console.error(e);
      }
    },
    toggleApplicationPreviewModal() {
      this.applicationPreviewModal = !this.applicationPreviewModal;
    },
    toggleDeleteCommunityModal() {
      this.deleteCommunityModal = !this.deleteCommunityModal;
    },
    async fetchConfigRules() {
      try {
        this.$accessor.setLoading(true);
        const { data } = await fetchConfigRules();
        this.configRules = data;
      } catch (e) {
        console.error(e);
      } finally {
        this.$accessor.setLoading(false);
      }
    },
    async updateCommunity(uuid: string, payload: ApiRequest.UpdateCommunity) {
      try {
        this.isLoading = true;
        const { data } = await updateCommunity(uuid, payload);
        this.community = data;
        this.input = this.responseToForm(this.community);
        if (this.community.is_official) {
          this.selectedValues = 'is_official';
        }
        this.registeredImages = this.community.images;
        this.mainImage = this.community.main_image;
        this.isMessageModalVisible = true;
      } catch (e) {
        console.error(e);
        this.showAlert('保存に失敗しました。');
      } finally {
        this.isLoading = false;
      }
    },
    async deleteCommunity() {
      try {
        this.isLoading = true;
        await deleteCommunity(this.uuid);
        this.toggleDeleteCommunityModal();
        this.$router.push('/admin/community-management');
      } catch (e) {
        console.error(e);
        this.showAlert('削除に失敗しました。');
      } finally {
        this.isLoading = false;
      }
    },
    showAlert(message: string): void {
      this.alertMessage = message;
      this.isAlertModalVisible = true;
    },
    isError(errorObject: { errors: string[] }) {
      return errorObject.errors[0];
    },
    uploadFiles(url: string) {
      this.input.add_image_urls = [
        ...this.input.add_image_urls,
        {
          url,
          is_main: false,
        },
      ];
    },
    deleteImages(image: Types.Image) {
      if (this.mainImage && this.mainImage.uuid === image.uuid) {
        this.mainImage = {
          uuid: '',
          url: '',
        };
      }

      if (image.uuid) {
        this.input.delete_image_uuids.push(image.uuid);
        this.registeredImages = this.registeredImages.filter(
          (registeredImage: Types.Image) =>
            !(registeredImage.uuid === image.uuid)
        );
      } else {
        this.input.add_image_urls = this.input.add_image_urls.filter(
          (addImageUrl: ApiRequest.AddImageUrl) =>
            !(addImageUrl.url === image.url)
        );
      }
    },
    changeMainImage(image: Types.Image) {
      this.mainImage = {
        url: image.url,
        uuid: image.uuid ?? '',
      };
    },
    postRulesOptions(ojb: object): object[] {
      return ojb.map((o: object) => {
        const value = o.key;
        return { ...o, value };
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.l-contents {
  padding: 15px 30px 30px;
}

.inner-container {
  padding-right: 70px;
}

.select-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.form-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 30px;
}

.form-item-align-center {
  align-items: center;
}

.textarea {
  border-radius: 4px;
  flex-grow: 1;
  padding: 10px;
  background-color: $extra_light_gray;
  color: $gray_blue_4;
  border: solid 1px $light_gray_blue_3;
  min-height: 120px;

  &::placeholder {
    color: $placeholder_gray;
  }
}

.input {
  border-radius: 4px;
  padding: 10px;
  width: 300px;
}

.select {
  background-color: $extra_light_gray;
  color: $gray_blue_4;
  border-color: $light_gray_blue_3;
  border-radius: 4px;
  height: 40px;
  width: 300px;
  font-size: 13px;
  font-weight: 300;

  & /deep/ .vs__dropdown-toggle {
    padding-top: 7px;
    padding-bottom: 7px;
    border-color: $light_gray_blue_3;
  }

  & /deep/ .vs__selected {
    color: $gray_blue_4;
  }
}

.contents-top-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 46px;

  select {
    padding: 4px 10px;
  }

  button {
    padding: 4px 35px;
  }

  label {
    color: $dark_blue;
    font-size: 15px;
    font-weight: 600;
    margin-left: 20px;
    width: auto;
  }
}

.flex-box {
  display: flex;
  align-items: center;

  .item {
    position: relative;

    + .item {
      margin-left: 15px;
    }
  }
}

.field-label-box {
  display: flex;
  flex-direction: column;
  font-size: 15px;
  font-weight: 600;
  width: 180px;
  color: $dark_blue;

  .required {
    font-size: 13px;
    font-weight: 300;
    color: $gray_blue_1;
  }
}

.field-checkbox {
  display: flex;
  flex-direction: column;
}

.checkbox-box {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;

  label {
    width: 33.3%;
    display: flex;
    align-items: baseline;

    input {
      margin-right: 0.5em;
    }
  }
}

.date-box {
  display: flex;
  font-size: 15px;
  font-weight: 300;
  color: $dark_blue;
}

.end-date-box {
  margin-left: 25px;
}

.form-button-box {
  display: flex;
  justify-content: center;
  margin-top: 60px;
}

.publication-not-set-box {
  position: relative;
  margin-bottom: 20px;
}

.publication-not-set {
  display: inline-block;
  height: 40px;
  line-height: 26px;
  color: $true_white;
  background-color: $pink;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 90px;
}

.submit-button {
  padding: 10px 42px;
}

.delete-button-box {
  margin-top: 15px;
}

.delete-button {
  cursor: pointer;
  text-decoration: none;
  color: $pink;
  font-size: 13px;
  font-weight: 300;

  &:hover {
    color: $pink_hover;
  }
}

.error {
  position: relative;
  margin-left: 200px;
  font-size: 13px;
  font-weight: 600;
  color: red;

  &.ignore-margin {
    margin: 0;
  }

  &.float {
    position: absolute;
    bottom: -20px;
    left: 0;
  }
}

.error-publication-setting {
  bottom: -23px;
  left: 0;
  margin-left: 0;
  position: absolute;
}

.button-box {
  display: flex;
  align-items: center;

  .button {
    width: 140px;
  }

  .button + .button {
    margin-left: 10px;
  }

  .app-preview-button {
    position: relative;
    padding-left: 26px;
    padding-right: 10px;

    svg {
      position: absolute;
      top: 7px;
      left: 10px;
    }
  }
}

.type-select {
  width: 100px;
}

.base-input {
  flex-grow: 1;
  width: 650px;
  height: 40px;
  background-color: $extra_light_gray;
  color: $gray_blue_4;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  padding: 0 11px;
}

.community-name {
  font-size: 15px;
  font-weight: 600;
  color: $dark_blue;
  width: 300px;
}

.date-label {
  margin-right: 10px;
}

.date-input {
  width: 200px;
}

.organization-checkbox {
  & + & {
    margin-left: 21px;
  }
}

.publish {
  display: flex;
  flex-direction: row;

  .textarea {
    resize: none;
    width: 450px;
    height: 60px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #7e8195 white;
    border: 1px solid $light_gray_blue_3;
    border-radius: 4px;
  }

  .textarea::-webkit-scrollbar {
    width: 4px;
    height: 0;
  }

  .textarea::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #7e8195;
  }

  .input {
    margin-left: 40px;
    width: 160px;
  }
}

.error-input {
  background-color: $light_pink;
  border: solid 1px $valid_pink;
}

.error-select {
  & /deep/ .vs__dropdown-toggle {
    background-color: $light_pink;
    border: solid 1px $valid_pink;
  }
}

.error-input-date {
  & /deep/ .date {
    background-color: $light_pink;
    border: solid 1px $valid_pink;
  }
}

.official {
  & /deep/ .checkbox-text {
    font-size: 15px;
    font-weight: 600;
  }
}
</style>
