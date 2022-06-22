<template>
  <div>
    <div v-if="isThemeVisible" class="header-container">
      <div class="row">
        <div class="heading">
          {{ title }}
        </div>
        <BaseButton
          :disabled="disabledClick"
          inverse
          class="button"
          @click="openArticleSampleModal"
        >
          サンプルを見る
        </BaseButton>
      </div>
      <div class="row">
        <div class="title">
          {{ theme.title }}
        </div>
      </div>
    </div>
    <div
      v-else-if="category === 'internal-communication'"
      class="header-container"
    >
      <div class="row">
        <div class="heading">
          {{ title }}
        </div>
      </div>
      <div class="row">
        <div class="title">
          <ul class="templates">
            <li
              v-for="(name, key) in internalCommunicationTemplates"
              :key="key"
              :class="{ active: key === template }"
              @click="onTemplateClick(key)"
            >
              {{ name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <article-sample-modal
      v-if="articleSampleModal.show"
      :title="articleSampleModal.props.title"
      :sentence="articleSampleModal.props.sentence"
      @close="closeArticleSampleModal()"
    ></article-sample-modal>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ArticleSampleModal } from '@/components/Admin/Pages/';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';

export default Vue.extend({
  components: {
    BaseButton,
    ArticleSampleModal,
  },
  props: {
    category: {
      type: String,
      required: true,
    },
    theme: {
      type: Object as PropType<AppApiResponse.PostTheme>,
      required: true,
    },
    internalCommunicationTemplates: {
      type: Object,
      required: true,
    },
    template: {
      type: String as PropType<string | null>,
      required: false,
      default: null,
    },
    disabledClick: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabledClickTemplateInterviewThankYouPickup: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    articleSampleModal: {
      show: false,
      props: {
        title: '',
        sentence: '',
      },
    },
  }),
  computed: {
    title(): string {
      const categoryTitleMap: { [key: string]: string } = {
        'my-episode': '今回の投稿テーマ',
        'internal-communication': '社内連絡投稿テンプレート',
        'department-news': '今回の投稿テーマ',
        'community-news': '今回の投稿テーマ',
      };
      return categoryTitleMap[this.category] ?? '';
    },
    isThemeVisible(): boolean {
      return this.category === 'my-episode';
    },
  },
  methods: {
    onTemplateClick(key: string): void {
      if (
        this.$props.disabledClick ||
        this.$props.disabledClickTemplateInterviewThankYouPickup
      ) {
        return;
      }
      this.$emit('update-template', key);
    },
    openArticleSampleModal() {
      this.articleSampleModal = {
        show: true,
        props: {
          title: this.theme.title,
          sentence: this.theme.example,
        },
      };
    },
    closeArticleSampleModal() {
      this.articleSampleModal = {
        props: { title: '', sentence: '' },
        show: false,
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.header-container {
  padding: 16px 16px 24px 16px;
  background-color: $white_1;

  .row {
    display: flex;
    justify-content: space-between;
  }

  .heading {
    color: $gentle_bluish_purple;
    font-weight: 600;
    font-size: 13px;
  }

  .button {
    height: 28px;
    padding: 0 16px;
  }

  .title {
    font-size: 15px;
    font-weight: 600;
  }

  .templates {
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
</style>
