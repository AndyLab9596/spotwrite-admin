<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <p class="title">記事テーマを登録・編集</p>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div v-show="summaryError" class="error summary-error">
          {{ summaryError }}
        </div>
        <div class="modal-container">
          <vue-loading
            v-if="isLoading"
            type="spin"
            color="#333"
            :size="{ width: '50px', height: '50px' }"
          />
          <validation-observer v-slot="{ invalid, passes }">
            <validation-provider
              v-slot="difficulty"
              rules="required"
              name="難易度"
            >
              <div class="flex mb-4">
                <div class="label">
                  難易度
                </div>
                <div>
                  <select
                    v-model="currentArticleTheme.difficulty_level"
                    class="select"
                    name="difficulty_level"
                    :class="{ 'input-error-back': difficulty.errors[0] }"
                  >
                    <option value="0" disabled>-</option>
                    <option value="1">★☆☆☆☆</option>
                    <option value="2">★★☆☆☆</option>
                    <option value="3">★★★☆☆</option>
                    <option value="4">★★★★☆</option>
                    <option value="5">★★★★★</option>
                  </select>
                  <div v-if="difficulty.errors[0]" class="error">
                    難易度をお選びください。
                  </div>
                </div>
              </div>
            </validation-provider>
            <validation-provider
              v-slot="title"
              rules="required"
              name="タイトル"
            >
              <div class="flex mb-4">
                <div class="label">
                  タイトル
                </div>
                <div>
                  <input
                    id="title"
                    v-model="currentArticleTheme.title"
                    class="input"
                    :class="{ 'input-error-back': title.errors[0] }"
                    type="text"
                    placeholder="タイトルを入力してください。"
                  />
                  <div v-if="title.errors[0]" class="error">
                    タイトルをご入力ください。
                  </div>
                </div>
              </div>
            </validation-provider>
            <validation-provider
              v-slot="description"
              rules="required"
              name="説明文"
            >
              <div class="flex mb-4">
                <div class="label">
                  説明文
                </div>
                <div>
                  <textarea
                    v-model="currentArticleTheme.description"
                    class="input textarea-small"
                    :class="{ 'input-error-back': description.errors[0] }"
                    type="text"
                    placeholder="テーマタイトルがどのような主旨のものか説明してください。"
                  />
                  <div v-if="description.errors[0]" class="error">
                    説明文をご入力ください。
                  </div>
                </div>
              </div>
            </validation-provider>
            <validation-provider
              v-slot="sample_text"
              rules="required"
              name="サンプル文"
            >
              <div class="flex mb-4">
                <div class="label">
                  サンプル文
                </div>
                <div>
                  <textarea
                    v-model="currentArticleTheme.sample_text"
                    class="input textarea"
                    :class="{ 'input-error-back': sample_text.errors[0] }"
                    type="text"
                    placeholder="テーマタイトルで記事を書いた場合のサンプル文を記入してください。"
                  />
                  <div v-if="sample_text.errors[0]" class="error">
                    サンプル文をご入力ください。
                  </div>
                </div>
              </div>
            </validation-provider>
            <div>
              <div class="modal-footer">
                <div class="button-container">
                  <div class="add">
                    <base-button
                      size="large"
                      class="add-button"
                      :disabled="invalid"
                      @click="passes(onSubmit)"
                    >
                      保存する
                    </base-button>
                  </div>
                  <div class="close">
                    <base-button
                      size="large"
                      class="cancel-button"
                      @click="onClose"
                    >
                      キャンセル
                    </base-button>
                  </div>
                </div>
                <div class="delete-btn">
                  <nuxt-link
                    tag="a"
                    to=""
                    class="button-box"
                    @click.native="deleteFunction()"
                  >
                    <p>この記事テーマを削除する</p>
                  </nuxt-link>
                </div>
              </div>
            </div>
          </validation-observer>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import Vue from 'vue';
import { VueLoading } from 'vue-loading-template';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { BaseButton } from '@/components/Admin/Modules/Button';
import {
  getPostThemeDetail,
  updateAdminPostTheme,
  deleteAdminPostTheme,
} from '@/libs/api';

type PostTheme = ApiRequest.PostTheme;

type PostThemeDetail = ApiResponse.PostThemeDetail;

export default Vue.extend({
  components: {
    ValidationObserver,
    ValidationProvider,
    BaseButton,
    VueLoading,
  },
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentArticleTheme: {
        uuid: '' as string,
        title: '' as string,
        description: '' as string,
        sample_text: '' as string,
        difficulty_level: 0 as number,
        use_count: 0 as number,
        is_public: 0 as number,
      },
      isLoading: true,
      summaryError: '',
    };
  },
  async created() {
    this.fetchPostThemeDetail();
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onSubmit() {
      if (
        !this.currentArticleTheme.title ||
        !this.currentArticleTheme.description ||
        !this.currentArticleTheme.difficulty_level ||
        !this.currentArticleTheme.sample_text
      ) {
        this.summaryError = '入力を確認してください。';
      } else {
        const updateThemeData = {
          title: this.currentArticleTheme.title,
          description: this.currentArticleTheme.description,
          sample_text: this.currentArticleTheme.sample_text,
          difficulty_level: this.currentArticleTheme.difficulty_level,
          is_public: this.currentArticleTheme.is_public,
        } as ApiRequest.PostTheme;
        this.isLoading = true;
        this.updatePostThemeDetail(
          this.currentArticleTheme.uuid,
          updateThemeData
        );
      }
    },
    deleteFunction() {
      if (this.currentArticleTheme.use_count) {
        this.summaryError =
          'この記事テーマは利用中の企業がいます。未使用のとき削除してください。';
      } else {
        this.isLoading = true;
        this.deletePostTheme(this.currentArticleTheme.uuid);
      }
    },
    async fetchPostThemeDetail() {
      try {
        const { data } = await getPostThemeDetail(this.uuid);
        (this.currentArticleTheme as PostThemeDetail) = data;
      } catch (e) {
        throw new Error(e);
      } finally {
        this.isLoading = false;
      }
    },
    async updatePostThemeDetail(uuid: string, updatePostTheme: PostTheme) {
      try {
        await updateAdminPostTheme(uuid, updatePostTheme);
      } catch (e) {
        throw new Error(e);
      } finally {
        this.isLoading = false;
        this.summaryError = '';
        this.$emit('fresh');
        this.$emit('close');
      }
    },
    async deletePostTheme(uuid: string) {
      try {
        await deleteAdminPostTheme(uuid);
      } catch (e) {
        throw new Error(e);
      } finally {
        this.isLoading = false;
        this.summaryError = '';
        this.$emit('fresh');
        this.$emit('close');
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
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(126, 129, 149, 0.8);
}

.modal-window {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 700px;
  background: $true_white;
  border-radius: 6px;
  padding: 15px 30px 20px 30px;

  .post-rule-label {
    font-size: 13px;
    font-weight: 300;
    border-left: solid 1px $light_gray_blue_3;
    height: 30px;
    line-height: 31px;
    margin-left: 20px;
    padding-left: 20px;
  }

  .post-rule {
    border: solid 1px $light_gray_blue_3;
    border-radius: 4px;
    color: $gray_blue_4;
    background-color: $extra_light_gray;
    height: 30px;
    width: 128px;
    padding: 0 4px;
    margin-left: 8px;
  }
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  margin-bottom: 16px;
}

.icon-cross {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.flex {
  display: flex;
}

.mb-4 {
  margin-bottom: 30px;
}

.label {
  width: 180px;
  height: 40px;
  line-height: 40px;
}

.require {
  font-size: 13px;
  font-weight: normal;
}

.error {
  position: absolute;
  color: red;
  margin-top: 4px;
}

.input-error-back {
  background-color: $light_pink !important;
}

.warning {
  font-size: 14px;
  color: red;
}

.modal-contents {
  display: flex;
  flex-direction: column;
  padding-top: 18px;
}

.description {
  font-size: 14px;
  background-color: #f7f7f7;
  margin: 16px 0;
}

.modal-footer {
  display: block;
  margin: 0 auto;
}

.add {
  display: inline;
  margin: 10px;
}

.close {
  display: inline;
  margin: 10px;

  button {
    background: none;
    border: solid 1px #e4e5ed;
    color: #6a6d83;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

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

#title {
  width: 400px;
}

.textarea {
  width: 400px !important;
  height: 200px !important;
}

.textarea-small {
  width: 400px !important;
  height: 120px !important;
}

.select {
  width: 200px;
  height: 40px;
  border: 1px solid $light_gray_blue_3;
  background-color: $extra_light_gray;
  border-radius: 4px;
  color: $gray_blue_4;
  font-size: 13px;
  font-weight: 300;
  padding: 0 0 0 8px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('/icon/icon_pulldown.svg');
  background-repeat: no-repeat;
  background-size: 10px 8px;
  background-position: right 8px center;

  &::-ms-expand {
    display: none;
  }
}

.input {
  width: 200px;
  height: 40px;
  border: 1px solid $light_gray_blue_3;
  background-color: $extra_light_gray;
  border-radius: 4px;
  color: $gray_blue_4;
  font-size: 13px;
  font-weight: 300;
  padding: 0 0 0 8px;
}

::placeholder {
  color: $placeholder_gray;
}

.button-container {
  display: flex;
  justify-content: center;
  cursor: pointer;

  button {
    width: 200px;
    font-weight: normal;
  }
}

.delete-btn {
  text-align: center;

  a {
    color: $pink !important;
  }
}

.summary-error {
  top: 34px;
}
</style>
