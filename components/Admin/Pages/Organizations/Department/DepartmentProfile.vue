<template>
  <div class="department-profile-container">
    <ValidationObserver v-slot="{ handleSubmit, invalid }">
      <form
        class="form"
        enctype="multipart/form-data"
        @submit.prevent="handleSubmit(onSubmit)"
      >
        <validation-provider v-slot="name" rules="required" name="部署名">
          <div class="input-box">
            <label class="label"
              >部署名<span class="required">※必須</span></label
            >
            <input
              id="name"
              v-model="input.name"
              type="text"
              :class="{ 'input-error': name.errors[0] || !input.name }"
              class="input"
              placeholder="部署名を入力してください"
              @input="onNameInput"
            />
          </div>
          <span v-if="name.errors[0]" class="error">※{{ name.errors[0] }}</span>
        </validation-provider>
        <validation-provider v-slot="kana" rules="isHiragana" name="ふりがな">
          <div class="input-box form-item">
            <label class="label">ふりがな</label>
            <base-input-text
              id="kana"
              v-model="input.kana"
              :class="{ 'input-error': kana.errors[0] }"
              class="input"
              placeholder="ふりがなを入力してください"
            ></base-input-text>
          </div>
          <span v-if="kana.errors[0]" class="error">※{{ kana.errors[0] }}</span>
        </validation-provider>
        <p class="form-tips">※ふりがなを入力すると並び替えに利用できます。</p>

        <validation-provider v-slot="description" name="部署概要">
          <div class="textarea-box form-item">
            <label class="label">部署概要</label>
            <base-textarea
              v-model="input.description"
              class="textarea"
              :class="{ 'input-error': descriptionExceeded }"
              placeholder="部署についてまとめた文章を入力してください。"
            ></base-textarea>
          </div>
          <span v-if="description.errors[0]" class="error"
            >※{{ description.errors[0] }}</span
          >
        </validation-provider>
        <p class="form-tips">※入力できる最大文字数は200文字です。</p>

        <div class="select-box form-item">
          <label class="label">部署代表者名</label>
          <v-select
            v-model="input.leader_uuid"
            class="leader-select"
            :options="leaderCandidateUsers"
            :reduce="(user) => user.user_uuid"
          >
            <template slot="option" slot-scope="user">
              {{ user.user_name }}({{ user.organization_name }})
            </template>
            <template slot="selected-option" slot-scope="user">
              {{ user.user_name }}({{ user.organization_name }})
            </template>
            <template v-slot:no-options="{ search, searching }">
              <template v-if="searching">
                <em>
                  {{ search }}
                </em>
                の結果は見つかりませんでした。
              </template>
              <em v-else style="opacity: 0.5;">
                申し訳ありませんが、マッチングするユーザはいません。
              </em>
            </template>
          </v-select>
        </div>

        <div v-if="input.leader_uuid" class="textarea-box form-item">
          <label class="label">代表メッセージ</label>
          <base-textarea
            v-model="input.message"
            class="textarea"
            placeholder="代表者からのメッセージを入力してください。"
          ></base-textarea>
        </div>

        <validation-provider v-slot="tel" name="電話番号">
          <div class="input-box form-item">
            <label class="label">電話番号</label>
            <base-input-text
              v-model="input.tel"
              class="input"
              placeholder="例）03-5547-5321"
            ></base-input-text>
          </div>
          <span v-if="tel.errors[0]" class="error">※{{ tel.errors[0] }}</span>
        </validation-provider>
        <div class="input-file-box form-item">
          <p class="label">写真</p>
          <div class="upload-images-box">
            <image-drop-box
              :available-files-count="availableImagesCount"
              :limit="10"
              @create="createImage"
            />
            <div class="upload-images">
              <p class="upload-images-description">
                登録済み写真<span class="upload-images-description-small"
                  >メイン写真として使用したい写真のチェックボックスにチェックを入れてください。</span
                >
              </p>
              <div class="upload-image-items">
                <div
                  v-for="(displayImage, index) in displayImages"
                  v-show="displayImage"
                  :key="index"
                  class="upload-image-item"
                >
                  <div
                    v-if="displayImage.url.includes('loading')"
                    class="loading"
                  >
                    <img :src="displayImage.url" />
                  </div>
                  <div v-else>
                    <div class="upload-image-box">
                      <img
                        class="upload-image"
                        :src="displayImage.url"
                        @click="toggleImageModal(displayImage.url)"
                      />
                      <base-radio-button-check
                        :id="index"
                        :checked="mainImage.url === displayImage.url"
                        :display-image="displayImage"
                        :url="displayImage.url"
                        class="main-image-check"
                        @change="onChangeMainImage"
                      />
                    </div>
                    <div class="delete-button-wrapper">
                      <button
                        class="delete-button"
                        @click="onDeleteImage(displayImage)"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <base-button
          class="submit-button"
          size="large"
          type="submit"
          :disabled="invalid || descriptionExceeded"
          @click="onSubmit"
        >
          保存する
        </base-button>
      </form>
      <success-message v-if="successModal" @close="toggleSuccessModal">
        入力された情報が保存されました。
      </success-message>
      <alert-message v-if="alertModal" @close="errorModal = false">
        入力された情報が保存できません。
      </alert-message>
      <pick-up-image
        v-if="imageModal"
        :uploaded-image="propUploadedImage"
        @click="toggleImageModal"
      />
    </ValidationObserver>
    <check-update
      v-if="checkDuplicateModal"
      :update-button-text="duplicateModalButtonText"
      @close="toggleCheckDuplicateModal"
      @click="updateDuplicatedModalOrganization"
    >
      その組織（BOX）名はすでに登録されています。登録しますか？
    </check-update>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import * as AutoKana from 'vanilla-autokana';
import {
  uploadImage,
  updateOrganizationProfile,
  fetchOrganizations,
} from '@/libs/api';
import {
  AlertMessage,
  SuccessMessage,
  PickUpImage,
  CheckUpdate,
} from '@/components/Admin/Modules/Modal';
import BaseInputText from '@/components/Admin/Modules/Input/BaseInputText.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BaseTextarea from '@/components/Admin/Modules/Input/BaseTextarea.vue';
import BaseRadioButtonCheck from '@/components/Admin/Modules/Button/BaseRadioButtonCheck.vue';
import ImageDropBox from '@/components/Admin/Modules/Image/ImageDropBox.vue';

export default Vue.extend({
  components: {
    ValidationObserver,
    ValidationProvider,
    AlertMessage,
    SuccessMessage,
    PickUpImage,
    BaseInputText,
    BaseButton,
    BaseTextarea,
    BaseRadioButtonCheck,
    ImageDropBox,
    CheckUpdate,
  },
  props: {
    organization: {
      type: Object,
      required: true,
      default: {} as Types.GroupOrganization,
    },
    organizationUsers: {
      type: Object,
      required: true,
      default: {} as Types.OrganizationUsers,
    },
  },
  data() {
    return {
      autokana: undefined as AutoKana.AutoKana | undefined,
      successModal: false as boolean,
      errorModal: false as boolean,
      multipleClick: false as boolean,
      input: {} as ApiRequest.UpdateOrganizationProfile,
      uploadedImages: [] as Types.Image[],
      imageModal: false as boolean,
      deleteCompanyModal: false as boolean,
      alertModal: false as boolean,
      propUploadedImage: '' as string,
      mainImage: {} as Types.Image,
      registeredImages: [],
      checkDuplicateModal: false as boolean,
      duplicateModalButtonText: '登録する' as string,
      organizationsList: [] as ApiResponse.GroupOrganization[],
      availableImagesCount: 0 as Number,
      leaderCandidateUsers: [] as Types.UsersInformation[],
    };
  },
  computed: {
    displayImages() {
      return [...this.$data.registeredImages, ...this.$data.uploadedImages];
    },
    sameOrganizationInCompany() {
      return [...this.organizationsList].filter(
        (org: Types.GroupOrganization) =>
          org.relations.company === this.organization.relations.company &&
          org.uuid !== this.organization.uuid
      );
    },
    descriptionExceeded() {
      if (!this.input.description) {
        return false;
      }
      return this.input.description && this.input.description.length > 200;
    },
  },
  watch: {
    displayImages(newValue: Types.Image[]) {
      if (newValue.length === 0) {
        this.mainImage = {
          url: '',
          uuid: '',
        };
      }
      if (
        !newValue.some((image: Types.Image) => image.url === this.mainImage.url)
      ) {
        this.mainImage = {
          url: newValue[0]?.url ?? '',
          uuid: newValue[0]?.uuid ?? '',
        };
      }
      this.availableImagesCount = newValue.length;
    },
  },
  mounted() {
    this.autokana = AutoKana.bind('#name', '#kana');

    if (Object.keys(this.$props.organization.detail).length === 0) {
      this.input = {
        name: this.$props.organization.name,
        kana: this.$props.organization.kana,
        description: '',
        leader_uuid: '',
        message: '',
        tel: '',
        main_image_uuid: '',
        add_image_urls: [],
        delete_image_uuids: [],
      };
    } else {
      this.input = {
        name: this.$props.organization.name,
        kana: this.$props.organization.kana,
        description: this.$props.organization.detail.description,
        leader_uuid: this.$props.organization.leader?.uuid || '',
        message: this.$props.organization.leader?.message || '',
        tel: this.$props.organization.detail.tel,
        main_image_uuid: this.$props.organization.detail.main_image_uuid ?? '',
        add_image_urls: [],
        delete_image_uuids: [],
      };
      this.mainImage = this.$props.organization.detail.main_image ?? {
        uuid: '',
        url: '',
      };
      this.registeredImages = this.$props.organization.detail.images;
    }

    this.leaderCandidateUsers = [
      ...new Map(
        this.organizationUsers.users.map((item: Types.UsersInformation) => [
          item.user_uuid,
          item,
        ])
      ).values(),
    ] as Types.UsersInformation[];
  },
  methods: {
    async fetchOrganizationsList() {
      try {
        const { data } = await fetchOrganizations();
        this.organizationsList = data.organizations;
      } catch (e) {
        console.log(e);
      }
    },
    onChangeMainImage(value: Types.Image) {
      this.mainImage = { ...value };
    },
    onNameInput(): void {
      if (this.autokana === undefined) {
        return;
      }
      this.input.kana = this.autokana.getFurigana();
    },
    toggleSuccessModal() {
      this.successModal = !this.successModal;
    },
    async createImage(image: Blob) {
      const uploadedCounter = this.$data.uploadedImages.length;
      this.$data.uploadedImages.push({
        uuid: null,
        url: `/icon/loading.gif`,
      });

      const formData = new FormData();
      formData.append('image', image);
      const res = await uploadImage(formData);
      let check_is_main = false;
      if (this.displayImages.length < 1) {
        check_is_main = true;
      }
      this.$data.input.add_image_urls.push({
        url: res.data.url,
        is_main: check_is_main,
      });
      // プレビュー用
      this.$data.uploadedImages.splice(uploadedCounter, 1, {
        uuid: null,
        url: res.data.url,
      });
    },
    onDeleteImage({ url, uuid }: Types.Image) {
      if (this.$data.mainImage.uuid === uuid && this.mainImage) {
        this.mainImage = {
          uuid: '',
          url: '',
        };
      }
      if (uuid) {
        this.$data.input.delete_image_uuids.push(uuid);
        this.registeredImages = this.registeredImages.filter(
          (r: Types.Image) => !(r.uuid === uuid)
        );
      } else {
        this.uploadedImages = this.uploadedImages.filter(
          (u: Types.Image) => !(u.url === url)
        );
        this.input.add_image_urls = this.$data.input.add_image_urls.filter(
          (a: ApiRequest.AddImageUrl) => !(a.url === url)
        );
      }
    },
    toggleImageModal(item: string = '') {
      if (!this.imageModal) {
        this.propUploadedImage = item;
      }
      this.imageModal = !this.imageModal;
    },
    async onSubmit() {
      // mainはどこに設定されている？
      if (this.mainImage) {
        if (
          this.$data.mainImage.uuid === null ||
          this.$data.mainImage.uuid === ''
        ) {
          this.input.add_image_urls = this.$data.input.add_image_urls.map(
            (a: ApiRequest.AddImageUrl) => {
              if (this.$data.mainImage.url.includes(a.url)) {
                return {
                  ...a,
                  is_main: true,
                };
              }
              return a;
            }
          );
          this.input.main_image_uuid = '';
        } else {
          this.input.main_image_uuid = this.$data.mainImage.uuid;
        }
      }
      try {
        await this.fetchOrganizationsList();
        if (this.checkDuplicateName(this.$data.input.name)) {
          this.toggleCheckDuplicateModal();
          return;
        }
        await this.updateOrganization();
        this.toggleSuccessModal();
      } catch (err) {
        this.errorModal = true;
      }
    },
    checkFirstClick() {
      this.multipleClick = true;
    },
    async updateOrganization() {
      const { data } = await updateOrganizationProfile(
        this.$props.organization.uuid,
        this.$data.input
      );
      this.$data.registeredImages = [...data.detail.images];
      this.uploadedImages = [];
      this.mainImage = data.detail.main_image ?? {
        uuid: '',
        url: '',
      };
      this.input = {
        name: data.name,
        kana: data.kana,
        description: data.detail.description,
        leader_uuid: data.leader?.uuid || '',
        message: data.leader?.message || '',
        tel: data.detail.tel,
        main_image_uuid: '',
        add_image_urls: [],
        delete_image_uuids: [],
      };
      this.$emit('updatedProfile');
    },
    checkDuplicateName(organizationName: string) {
      const duplicateList = [...this.sameOrganizationInCompany].filter(
        (org: Types.GroupOrganization) => {
          return org.name.trim() === organizationName.trim();
        }
      );
      if (duplicateList.length > 0) {
        return true;
      }
      return false;
    },
    toggleCheckDuplicateModal() {
      this.checkDuplicateModal = !this.checkDuplicateModal;
    },
    updateDuplicatedModalOrganization() {
      this.toggleCheckDuplicateModal();
      this.$data.input.name = this.resolveDuplicateName(this.$data.input.name);
      this.updateOrganization();
    },
    resolveDuplicateName(organizationName: string) {
      const organizationNames = [
        ...this.sameOrganizationInCompany,
      ].map((o: Types.GroupOrganization) => o.name.trim());
      if (!organizationNames.includes(organizationName.trim())) {
        return organizationName;
      }
      for (let i = 1; organizationNames.length; i += 1) {
        if (!organizationNames.includes(organizationName.concat(`（${i}）`))) {
          return organizationName.concat(`（${i}）`);
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  padding-right: 100px;
}

.form-item {
  margin-top: 30px;
}

.input-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.input {
  flex: 1;
  height: 40px;
  width: 100%;
  padding: 11px;
  color: $gray_blue_4;
  appearance: none;
  background-color: $extra_light_gray;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;

  &::placeholder {
    color: $placeholder_gray;
  }
}

.error {
  margin-left: 180px;
  font-size: 0.8em;
  color: red;
}

.select-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 618px;
}

.textarea-box {
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  .textarea {
    flex: 1;
  }
}

.input-file-box {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.label {
  width: 180px;
  font-size: 15px;
  font-weight: bold;

  .required {
    font-size: 13px;
    color: $gray_blue_1;
    font-weight: normal;
    margin-left: 9px;
  }
}

.leader-select {
  flex: 1;
  height: 40px;
  min-width: 300px;
  background-color: $extra_light_gray;
  color: $gray_blue_4;
  border-color: $light_gray_blue_3;
  border-radius: 4px;
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

.upload-images-box {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.upload-image-box {
  position: relative;
  cursor: pointer;
}

.main-check {
  position: absolute;
  top: 0;
  right: 0;
}

.upload-images-description {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  margin-top: 12px;
  margin-bottom: 9px;
}

.upload-images-description-small {
  font-size: 11px;
  font-weight: normal;
  margin-left: 10px;
}

.upload-image-items {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.upload-image-item {
  display: flex;
  flex-direction: column;
  width: 120px;
  margin-right: 12px;
  margin-bottom: 9px;
}

.upload-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
}

.loading {
  width: 120px;
  height: 80px;
  display: flex;
}

.loading > img {
  width: 40px;
  height: 40px;
  margin: auto;
}

.submit-button {
  width: 200px;
  margin: 40px auto 0;
}

.input-error {
  background-color: $light_pink;
  border: 1px solid $valid_pink;

  /deep/ .vs__dropdown-toggle {
    background-color: $light_pink;
  }
}

.delete-button {
  width: 56px;
  margin-top: 5px;
  padding: 5px;
  color: $gray_blue_3;
  font-size: 13px;
  font-weight: bold;
  appearance: none;
  background-color: $true_white;
  border: solid 1px $gray_blue_3;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    color: $gray;
    background-color: $white_2;
    cursor: not-allowed;
  }
}

.delete-button-wrapper {
  justify-content: center;
  display: flex;
}

.main-image-check {
  position: absolute;
  top: 6px;
  right: 6px;
}

.form-tips {
  margin-left: 180px;
  margin-top: 4px;
  font-size: 12px;
}
</style>
