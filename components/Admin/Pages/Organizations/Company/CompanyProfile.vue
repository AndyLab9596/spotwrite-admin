<template>
  <div class="company-profile-container">
    <ValidationObserver v-slot="{ handleSubmit, invalid }">
      <form
        class="form"
        enctype="multipart/form-data"
        @submit.prevent="handleSubmit(onSubmit)"
      >
        <validation-provider v-slot="name" rules="required" name="会社名">
          <div class="input-box">
            <label class="label"
              >会社名<span class="required">※必須</span></label
            >
            <input
              id="name"
              v-model="input.name"
              type="text"
              class="input"
              :class="{ 'input-error': name.errors[0] || !input.name }"
              placeholder="会社名を入力してください"
            />
          </div>
          <span v-if="name.errors[0]" class="error">※{{ name.errors[0] }}</span>
        </validation-provider>

        <div class="select-box form-item">
          <label class="label">代表者</label>
          <v-select
            v-model="input.leader_uuid"
            class="select"
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
          <textarea
            v-model="input.message"
            class="textarea"
            placeholder="代表メッセージを入力してください。"
          ></textarea>
        </div>

        <validation-provider
          v-slot="establishment"
          rules="required"
          name="設立年月日"
        >
          <div class="input-box form-item">
            <label class="label">設立<span class="required">※必須</span></label>
            <date-input
              v-model="displayEstablishDate"
              :class="{
                'input-error': establishment.errors[0] || !displayEstablishDate,
              }"
              display-format="YYYY年MM月DD日"
              class="date-input"
            />
          </div>
          <span v-if="establishment.errors[0]" class="error"
            >※{{ establishment.errors[0] }}</span
          >
        </validation-provider>
        <validation-provider v-slot="tel" rules="required" name="電話番号">
          <div class="input-box form-item">
            <label class="label"
              >電話番号<span class="required">※必須</span></label
            >
            <input
              v-model="input.tel"
              type="text"
              :class="{ 'input-error': tel.errors[0] || !input.tel }"
              class="input"
              placeholder="例）03-5547-5321"
            />
          </div>
          <span v-if="tel.errors[0]" class="error">※{{ tel.errors[0] }}</span>
        </validation-provider>
        <validation-provider v-slot="homepage" name="ホームページ">
          <div class="input-box form-item">
            <label class="label">ホームページ</label>
            <input
              v-model="input.homepage"
              type="text"
              :class="{ 'input-error': homepage.errors[0] }"
              class="input"
              placeholder="例）https://worksmedia.jp"
            />
          </div>
          <span v-if="homepage.errors[0]" class="error"
            >※{{ homepage.errors[0] }}</span
          >
        </validation-provider>
        <div class="input-file-box form-item">
          <p class="label">会社のロゴ</p>
          <div class="upload-logo-image-box">
            <img
              v-if="logoImage"
              class="upload-logo-image"
              :src="logoImage.url"
            />
          </div>
          <div class="upload-logo-box">
            <p class="update-logo-image-name">{{ uploadedLogoImageName }}</p>
            <label class="upload-logo-image-button">
              ファイルを選択
              <input
                type="file"
                name="pic"
                style="display: none;"
                @change="onLogoFileChange"
              />
            </label>
          </div>
        </div>
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
          :disabled="invalid"
          size="large"
          @click="onSubmit"
        >
          保存する
        </base-button>
      </form>
      <success-message v-if="successModal" @close="toggleSuccessModal">
        入力された情報が保存されました。
      </success-message>
      <alert-message v-if="errorModal" @close="errorModal = false">
        入力された情報が保存できません。
      </alert-message>
      <pick-up-image
        v-if="imageModal"
        :uploaded-image="propUploadedImage"
        @click="toggleImageModal"
      />
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import dayjs from '@/libs/dayjs';
import { updateOrganizationProfile, uploadImage } from '@/libs/api';
import {
  AlertMessage,
  SuccessMessage,
  PickUpImage,
} from '@/components/Admin/Modules/Modal';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BaseRadioButtonCheck from '@/components/Admin/Modules/Button/BaseRadioButtonCheck.vue';
import ImageDropBox from '@/components/Admin/Modules/Image/ImageDropBox.vue';
import DateInput from '@/components/Admin/Modules/Input/DateInput.vue';

export default Vue.extend({
  components: {
    ValidationObserver,
    ValidationProvider,
    AlertMessage,
    SuccessMessage,
    PickUpImage,
    BaseButton,
    BaseRadioButtonCheck,
    ImageDropBox,
    DateInput,
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
      successModal: false as boolean,
      errorModal: false as boolean,
      input: {} as ApiRequest.UpdateOrganizationProfile,
      displayEstablishDate: '' as string,
      currentId: 1,
      uploadedLogoImageName: 'ファイルを選択してください',
      uploadedImages: [] as Types.Image[],
      imageModal: false as boolean,
      propUploadedImage: '' as string,
      mainImage: {} as Types.Image,
      logoImage: {} as Types.Image,
      registeredImages: [] as Types.Image[],
      availableImagesCount: 0 as Number,
      leaderCandidateUsers: [] as Types.UsersInformation[],
    };
  },
  computed: {
    displayImages() {
      return [...this.$data.registeredImages, ...this.$data.uploadedImages];
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
    if (Object.keys(this.$props.organization.detail).length === 0) {
      this.input = {
        name: this.$props.organization.name,
        leader_uuid: '',
        message: '',
        establish_date: 0,
        tel: '',
        homepage: '',
        logo_image_url: '',
        main_image_uuid: '',
        add_image_urls: [],
        delete_image_uuids: [],
      };
    }
    this.input = {
      name: this.$props.organization.name,
      leader_uuid: this.$props.organization.leader?.uuid || '',
      message: this.$props.organization.leader?.message || '',
      establish_date: this.$props.organization.detail.establish_date,
      tel: this.$props.organization.detail.tel,
      homepage: this.$props.organization.detail.url,
      logo_image_url: '',
      main_image_uuid: '',
      add_image_urls: [],
      delete_image_uuids: [],
    };
    if (this.input.establish_date) {
      this.displayEstablishDate = dayjs
        .unix(this.input.establish_date)
        .format('YYYY-MM-DD');
    }
    this.mainImage = this.$props.organization.detail.main_image ?? {
      uuid: '',
      url: '',
    };
    this.logoImage = this.$props.organization.detail.logo_image;
    this.registeredImages = this.$props.organization.detail.images ?? [];
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
    onChangeMainImage(value: Types.Image) {
      this.mainImage = { ...value };
    },
    toggleSuccessModal() {
      this.successModal = !this.successModal;
    },
    onLogoFileChange(e: any) {
      const files = e.target.files || e.dataTransfer.files;
      this.createLogoImage(files[0]);
      this.uploadedLogoImageName = files[0].name;
    },
    async createLogoImage(image: Blob) {
      const formData: any = new FormData();
      formData.append('image', image);
      const res = await uploadImage(formData);
      this.logoImage = {
        url: res.data.url,
        uuid: null,
      };
      this.input.logo_image_url = res.data.url;
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
      if (this.mainImage.uuid === uuid && this.mainImage) {
        this.$data.mainImage = {
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
        if (this.mainImage.uuid === null || this.mainImage.uuid === '') {
          this.input.add_image_urls = this.$data.input.add_image_urls.map(
            (a: ApiRequest.AddImageUrl) => {
              if (this.mainImage.url.includes(a.url)) {
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
          this.input.main_image_uuid = this.mainImage.uuid;
        }
      }
      try {
        const { data } = await updateOrganizationProfile(
          this.$props.organization.uuid,
          {
            ...this.$data.input,
            ...{ establish_date: dayjs.utc(this.displayEstablishDate).unix() },
          }
        );
        this.registeredImages = [...data.detail.images];
        this.uploadedImages = [];
        this.mainImage = data.detail.main_image ?? {
          uuid: '',
          url: '',
        };
        this.logoImage = data.detail.logo_image;
        this.input = {
          name: data.name,
          leader_uuid: data.leader?.uuid || '',
          message: data.leader?.message || '',
          establish_date: data.detail.establish_date,
          tel: data.detail.tel,
          homepage: data.detail.url,
          logo_image_url: '',
          main_image_uuid: '',
          add_image_urls: [],
          delete_image_uuids: [],
        };
        this.$emit('update-organization', data);
        this.toggleSuccessModal();
      } catch (err) {
        this.errorModal = true;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.company-profile-container {
  border-radius: 6px;
  padding-right: 70px;
}

.form {
  display: flex;
  flex-direction: column;
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

.error {
  margin-left: 180px;
  font-size: 0.8em;
  color: red;
}

.select-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.textarea-box {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.input-file-box {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.label {
  width: 180px;
  font-weight: bold;

  .required {
    font-size: 13px;
    color: $gray_blue_1;
    margin-left: 8px;
  }
}

.input {
  color: $gray_blue_4;
  flex: 1;
  height: 40px;
  background-color: $extra_light_gray;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  padding-left: 11px;

  &::placeholder {
    color: $placeholder_gray;
  }
}

.select {
  flex: 1;

  /deep/ .vs__dropdown-toggle {
    height: 40px;
    background-color: $extra_light_gray;
    border: solid 1px $light_gray_blue_3;
  }

  /deep/ .vs__selected {
    color: $gray_blue_4;
  }
}

.textarea {
  color: $gray_blue_4;
  flex: 1;
  height: 120px;
  background-color: $extra_light_gray;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  padding: 11px;

  &::placeholder {
    color: $placeholder_gray;
  }
}

.upload-logo-image-box {
  width: 160px;
  height: 160px;
  border: solid 1px $light_gray_blue_3;
  border-radius: 6px;
  margin-right: 20px;
}

.upload-logo-image {
  width: 158px;
  height: 158px;
  object-fit: cover;
  border-radius: 6px;
}

.upload-logo-box {
  display: flex;
  flex-direction: row;
}

.upload-logo-image-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 40px;
  font-size: 13px;
  background-color: $gray_blue_3;
  color: $true_white;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.update-logo-image-name {
  display: flex;
  align-items: center;
  width: 340px;
  height: 40px;
  border: solid 1px $light_gray_blue_3;
  border-radius: 6px;
  margin-right: 10px;
  padding: 0 12px;
  color: $placeholder_gray;
  font-size: 13px;
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
  top: 6px;
  right: 6px;
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
  border-radius: 4px;

  /deep/ .vs__dropdown-toggle {
    background-color: $light_pink;
  }

  /deep/ .date {
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

.date-input {
  flex: 1;

  /deep/ svg {
    display: none;
  }

  /deep/ .date {
    font-size: 13px;
    padding: 10px 18px 14px 11px;
  }
}
</style>
