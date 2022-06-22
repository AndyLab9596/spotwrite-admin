<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClick">
      <div class="modal-window">
        <div class="modal-content">
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClick" />
          <div class="input-file-box form-item">
            <p class="label">コミュニティーに写真を登録</p>
            <div class="upload-images-box">
              <image-drop-box @create="createImage" />
              <div class="upload-images">
                <p class="upload-images-description">
                  登録済み写真
                  <span class="upload-images-description-small">
                    メイン写真として使用したい写真のチェックボックスにチェックを入れてください。
                  </span>
                </p>
                <div v-if="displayImages.length > 0" class="upload-image-items">
                  <div
                    v-for="(displayImage, index) in displayImages"
                    v-show="displayImage"
                    :key="index"
                    class="upload-image-item"
                  >
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
                        class="main-check"
                        @change="onChangeMainImage"
                      />
                    </div>
                    <div class="delete-button-box">
                      <button
                        class="delete-button"
                        type="button"
                        @click="onDeleteImage(displayImage)"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
                <div class="submit-box">
                  <base-button size="large" @click="onClick">
                    写真を反映する
                  </base-button>
                </div>
                <pick-up-image
                  v-if="imageModal"
                  :uploaded-image="uploadedImage"
                  @click="toggleImageModal"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import ImageDropBox from '@/components/Admin/Modules/Image/ImageDropBox.vue';
import { uploadImage } from '@/libs/api';
import BaseRadioButtonCheck from '@/components/Admin/Modules/Button/BaseRadioButtonCheck.vue';
import { PickUpImage } from '@/components/Admin/Modules/Modal';

type displayImage = {
  url: string;
  is_main?: boolean;
  uuid?: string;
};

export default Vue.extend({
  components: { BaseButton, ImageDropBox, BaseRadioButtonCheck, PickUpImage },
  props: {
    mainImageUuid: {
      type: String,
      required: true,
    },
    addImageUrls: {
      type: Array as PropType<ApiRequest.AddImageUrl[]>,
      required: true,
    },
    deleteImageUuids: {
      type: Array as PropType<string[]>,
      required: true,
    },
    registeredImages: {
      type: Array as PropType<Types.Image[]>,
      required: true,
    },
    mainImage: {
      type: Object as PropType<Types.Image | null>,
      required: true,
    },
  },
  data() {
    return {
      imageModal: false as boolean,
      uploadedImage: '' as string,
    };
  },
  computed: {
    displayImages(): (Types.Image | ApiRequest.AddImageUrl)[] {
      return [...this.registeredImages, ...this.addImageUrls];
    },
  },
  watch: {
    displayImages(newValue: Types.Image[]) {
      if (newValue.length === 0) {
        this.$emit('changeMainImage', {
          url: '',
          uuid: '',
        });
      }
      if (
        !newValue.some(
          (image: Types.Image) =>
            this.mainImage && image.url === this.mainImage.url
        )
      ) {
        this.$emit('changeMainImage', {
          url: newValue[0]?.url ?? '',
          uuid: newValue[0]?.uuid ?? '',
        });
      }
    },
  },
  methods: {
    onClick() {
      this.$emit('onClose');
    },
    onFileChange(e: any) {
      const files = e.target.files || (e.dataTransfer.files as Blob);
      this.createImage(files[0]);
    },
    onDeleteImage(image: Types.Image) {
      this.$emit('onDelete', image);
    },
    async createImage(image: Blob) {
      if (this.displayImages.length === 10) {
        alert('登録できる写真は最大10枚です');
        return;
      }
      try {
        const formData = new FormData();
        formData.append('image', image);
        const { data } = await uploadImage(formData);
        this.$emit('onClick', data.url);
      } catch (e) {
        if (e.response != null && e.response.status === 422) {
          alert(
            `無効なファイル形式です。\n次のいずれかのファイル形式をアップロードしてください。\nJPEG、PNG、GIF、WEBP`
          );
        }
      }
    },
    onChangeMainImage(value: displayImage) {
      // registeredImagesが入ってきた場合
      if (value.uuid) {
        this.$emit('changeMainImage', {
          url: value.url,
          uuid: value.uuid,
        });
      }

      // addImageUrlsが入ってきた場合
      if (value.is_main) {
        this.$emit('changeMainImage', {
          url: value.url,
          uuid: '',
        });
      }
    },
    toggleImageModal(item: string = '') {
      if (!this.imageModal) {
        this.uploadedImage = item;
      }
      this.imageModal = !this.imageModal;
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
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(126, 129, 149, 0.8);
}

.modal-window {
  background: $true_white;
  border-radius: 4px;
}

.modal-content {
  position: relative;
  padding: 20px 30px;
}

.icon-cross {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}

.image {
  width: 540px;
  height: 360px;
  object-fit: cover;
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

.upload-images-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  width: 650px;

  button {
    margin-top: 5px;
  }
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
  font-size: 13px;
  font-weight: bold;
  margin: 12px 0 9px;
  color: $dark_blue;
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
  max-width: 650px;
  width: 100%;
  height: 120px;
  overflow-y: auto;
}

.upload-image-item {
  display: flex;
  flex-direction: column;
  width: 120px;
  margin-top: 5px;
  margin-right: 12px;

  &:nth-of-type(5n) {
    margin-right: 0;
  }
}

.upload-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
}

.submit-box {
  display: flex;
  justify-content: center;
  margin-top: 40px;

  button {
    width: 200px;
  }
}

.delete-button-box {
  display: flex;
  justify-content: center;
}

.delete-button {
  font-size: 13px;
  background-color: $true_white;
  border: solid 1px $gray_blue_3;
  border-radius: 4px;
  height: 30px;
  width: 56px;
  font-weight: 600;
  color: $gray_blue_4;
}

.label {
  color: $dark_blue;
  font-size: 15px;
  font-weight: 600;
}
</style>
