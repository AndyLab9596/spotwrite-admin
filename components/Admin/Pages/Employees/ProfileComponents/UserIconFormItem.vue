<template>
  <div class="container">
    <div class="heading">
      <label class="label">アイコン写真</label>
    </div>
    <div class="content">
      <div class="icon-wrapper">
        <img class="icon" :src="image" />
      </div>
      <div class="input-area">
        <div class="input-form">
          <div
            class="pseudo-input"
            :class="{ disabled: disabled }"
            @change="changeImage"
            @click.prevent="browseFiles"
          >
            <label for="file" class="pseudo-input-label">{{ imageName }}</label>
          </div>
          <base-button
            size="large"
            :disabled="disabled"
            @click="$refs.file.click()"
          >
            ファイルを選択
          </base-button>
          <input
            id="file"
            ref="file"
            type="file"
            style="display: none;"
            accept="image/*"
            :disabled="disabled"
            @change="changeImage"
          />
        </div>
        <span class="input-help">※画像サイズ 32px × 32px 以上</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import { uploadImage } from '@/libs/api';

type Data = {
  imageName: string;
};

export default Vue.extend({
  name: 'UserIconFormItem',
  components: {
    BaseButton,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data(): Data {
    return {
      imageName: 'ファイルを選択してください',
    };
  },
  computed: {
    image(): string {
      if (this.value) {
        return this.value;
      }

      // デフォルトイメージ
      return '/image/no-image.png';
    },
  },
  methods: {
    browseFiles() {
      (document.getElementById('file') as HTMLElement).click();
    },
    async changeImage(event: Event) {
      try {
        const { files } = event.target as HTMLInputElement;
        if (!files || files.length <= 0) return;
        const file = files[0];

        const formData = new FormData();
        formData.append('image', file);
        const { data } = await uploadImage(formData);
        this.$emit('onChange', data.url);
        this.imageName = file.name;
      } catch (e) {
        if (e.response != null && e.response.status === 422) {
          alert(
            `無効なファイル形式です。\n次のいずれかのファイル形式をアップロードしてください。\nJPEG、PNG、GIF、WEBP`
          );
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
}

.heading {
  display: flex;
  min-width: 180px;
}

.content {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.label {
  font-weight: bold;
}

.icon-wrapper {
  margin-right: 20px;
}

.icon {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid $light_gray_blue_3;
  overflow: hidden;
}

.input-area {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
}

.input-form {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}

.pseudo-input {
  display: flex;
  flex: 1;
  font-size: 13px;
  font-weight: 300;
  line-height: 1;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  color: $gray_blue_4;
  background-color: $extra_light_gray;
  height: 40px;
  width: 100%;
  padding: 10px 10px;
  margin-right: 10px;

  &:not(.disabled) {
    cursor: pointer;

    .pseudo-input-label {
      cursor: pointer;
    }
  }
}

.input-help {
  font-size: 13px;
  font-weight: normal;
}
</style>
