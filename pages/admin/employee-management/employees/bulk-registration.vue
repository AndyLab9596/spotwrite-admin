<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="CSV一括登録">
        <template #description>
          CSVを利用して新しいメンバーを一括でインポート（読み込む）することができます。<br />
          CSVの作成にはインポート用のフォーマットをダウンロードしてご利用ください。
        </template>
      </page-header>
      <div class="contents">
        <div class="download-box">
          <div class="top">
            <div class="title">メンバー追加用CSVをダウンロードする</div>
            <base-button
              class="button"
              size="large"
              :disabled="isDownloading"
              @click="downloadCsv()"
            >
              <vue-loading
                v-show="isDownloading"
                type="spin"
                color="#333"
                :size="{ width: '16px', height: '16px' }"
              ></vue-loading>
              <p v-show="!isDownloading">保存する</p>
            </base-button>
          </div>
          <div class="notes">
            <div>
              <img class="icon_exclamation" src="/icon/icon_exclamation.svg" />
            </div>
            <ul class="list">
              <li>
                CSVのご利用方法は操作マニュアルをご確認ください。
              </li>
              <li>
                必須項目は必ずご記入ください。必須項目で未入力がある場合、CSVをインポートすることができません。
              </li>
              <li>
                1回につき一括インポートできる人数は1000人まで可能です。
              </li>
              <li>
                会社名、部署・支店・店舗名は正しくご入力ください。<br />
                登録済みの情報と異なっている場合、正しくメンバーが追加されません。
              </li>
            </ul>
          </div>
        </div>
        <div class="import-box">
          <div class="title">作成したCSVファイルをインポートする</div>
          <div class="select">
            <input
              v-model="fileName"
              placeholder="ファイルを選択してください"
              class="file-name"
              type="text"
              disabled
            />
            <label class="input-button" for="file">
              ファイルを選択する
              <input
                id="file"
                class="file"
                type="file"
                accept=".csv"
                @change="onFileChange"
              />
            </label>
          </div>
          <div class="upload">
            <base-button
              class="button"
              size="large"
              :disabled="!canUpload"
              @click="uploadCsv()"
            >
              <vue-loading
                v-if="isUploading"
                type="spin"
                color="#333"
                :size="{ width: '16px', height: '16px' }"
              ></vue-loading>
              <p v-else>アップロード</p>
            </base-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { axios } from '@/plugins/axios';
import { VueLoading } from 'vue-loading-template';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import dayjs from '@/libs/dayjs';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    VueLoading,
    PageHeader,
    BaseButton,
  },
  data() {
    return {
      fileName: '' as string,
      files: [] as any[],
      isDownloading: false as boolean,
      isUploading: false as boolean,
    };
  },
  computed: {
    canUpload(): boolean {
      return !this.isUploading && !!this.files.length;
    },
  },
  methods: {
    onFileChange(file: any) {
      const { files } = file.target;
      if (files.length > 0) {
        this.fileName = files[0].name;
        this.files = files;
      }
    },
    async downloadCsv() {
      this.isDownloading = true;
      const json = await axios.get(
        `/owner/users/download-csv?v=${dayjs().unix()}`
      );
      const { data } = json;
      // eslint-disable-next-line prettier/prettier
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const blob = new Blob([bom, data], { type: 'text/csv' });
      const url = (window.URL || window.webkitURL).createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'spotwrite_template.csv';
      link.click();

      this.isDownloading = false;
    },
    async uploadCsv() {
      this.isUploading = true;

      const formData = new FormData();
      formData.append('csv', this.files[0]);
      try {
        await this.$axios.post('/owner/users/upload-csv', formData);
        alert('CSVファイルのインポートに成功しました');
      } catch (e) {
        alert('CSVファイルのインポートに失敗しました');
      } finally {
        this.isUploading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.tabs {
  margin-top: 30px;
}

.contents {
  position: relative;
  height: 100%;
  min-height: 800px;
  margin-top: 14px;
}

.title {
  font-weight: bold;
  color: $dark_blue;
  margin: auto 0;
}

.download-box {
  padding: 30px 22px;
  background-color: $true_white;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  opacity: 1;

  .top {
    display: flex;
    justify-content: space-between;
  }
}

.notes {
  display: flex;
  margin-top: 30px;
  padding: 16px 20px;
  color: $gray_blue_4;
  background-color: $white_1;
  border-radius: 6px;
  opacity: 1;
  font-size: 15px;

  .icon_exclamation {
    width: 16px;
    height: 16px;
    vertical-align: baseline;
  }

  .list {
    flex-grow: 1;
    margin-left: 20px;

    li {
      position: relative;
      margin-left: 20px;
    }

    li::before {
      position: absolute;
      content: '・';
      left: -20px;
    }
  }
}

.import-box {
  margin-top: 40px;
  padding: 30px 22px;
  background-color: $true_white;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  opacity: 1;

  .select {
    margin-top: 17px;

    .file-name {
      width: 600px;
      height: 40px;
      background: $extra_light_gray;
      border: 1px solid $light_gray_blue_3;
      border-radius: 4px;
      opacity: 1;
      color: $placeholder_gray;
      padding-left: 11px;

      &::placeholder {
        color: $placeholder_gray;
      }
    }

    .file {
      display: none;
    }
  }

  .upload {
    text-align: center;
    margin-top: 30px;
  }

  .input-button {
    display: inline-block;
    border: 0;
    border-radius: 4px;
    padding-top: 10px;
    cursor: pointer;
    background-color: $gray_blue_3;
    color: $true_white;
    font-weight: bold;
    width: 200px;
    height: 40px;
    text-align: center;
    font-size: 13px;
    vertical-align: middle;

    &:hover {
      background-color: $gray_blue_4;
    }
  }
}

.button {
  width: 200px;
}
</style>
