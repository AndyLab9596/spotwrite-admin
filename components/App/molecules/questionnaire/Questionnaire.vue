<template>
  <div>
    <div class="questionnaire-item-image-wrapper">
      <template v-for="(item, index) in questionnaire.items">
        <mask-image
          v-if="item.image !== null"
          :key="item.uuid"
          :src="item.image"
          :image-index="index"
          :display-number="index + 1"
          class="questionnaire-item images-wrapper"
          @imageClick="onImageClick"
        />
      </template>
    </div>
    <CoolLightBox
      :items="lightBoxItems"
      :index="lightBoxIndex"
      :slideshow="false"
      :gallery="false"
      @close="lightBoxIndex = null"
    >
    </CoolLightBox>
    <template v-if="isDisplayQuestionnaireVoteList">
      <before-answer-list
        :questionnaire-items="questionnaire.items"
        :expire-at="questionnaire.expire_at"
        :has-images="hasImages"
        :vote-count="questionnaire.vote_count"
        :class="{ 'preview-mode': previewMode }"
        @onClick="clickAnswer"
      />
    </template>
    <template v-else>
      <after-answering-list
        :questionnaire-items="questionnaire.items"
        :vote-count="questionnaire.vote_count"
        :vote="questionnaire.vote"
        :class="{ 'preview-mode': previewMode }"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from '@/libs/dayjs';
import CoolLightBox from 'vue-cool-lightbox';
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css';
import BeforeAnswerList from './BeforeAnswerList.vue';
import AfterAnsweringList from './AfterAnsweringList.vue';
import MaskImage from '../images/MaskImage.vue';

export default Vue.extend({
  components: {
    BeforeAnswerList,
    AfterAnsweringList,
    MaskImage,
    CoolLightBox,
  },
  props: {
    questionnaire: {
      type: Object as PropType<AppApiResponse.Questionnaire>,
      required: false,
      default: null,
    },
    userUuid: {
      type: String,
      required: true,
    },
    previewMode: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      lightBoxIndex: null,
    };
  },
  computed: {
    isDisplayQuestionnaireVoteList(): boolean {
      if (this.previewMode) return true;

      if (this.questionnaire != null) {
        // 投稿者
        if (this.$accessor.userProfile.uuid === this.userUuid) return false;

        // 回答できないユーザ
        if (!this.questionnaire.can_answer) return false;

        // 回答済み
        if (this.questionnaire.vote != null) return false;

        // 締め切り済み
        if (
          this.questionnaire.expire_at &&
          dayjs().unix() > this.questionnaire.expire_at
        )
          return false;
      }
      return true;
    },
    hasImages(): boolean {
      const images = this.questionnaire.items.map(
        (item: AppApiResponse.QuestionnaireItem) => item.image
      );
      const nullCheck = (value: string | null) => value === null;

      return !images.every(nullCheck);
    },
    lightBoxItems(): Array<Object> {
      return this.questionnaire.items.map((item: any) => {
        return { src: item.image };
      });
    },
  },
  methods: {
    clickAnswer(uuid: string) {
      this.$emit('onClick', uuid);
    },
    onImageClick(index: number) {
      this.lightBoxIndex = index;
    },
  },
});
</script>

<style lang="scss" scoped>
.questionnaire-item-image-wrapper {
  display: flex;
  margin: 0 0 25px 0;
  padding-bottom: 5px;
  width: inherit;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    width: 0;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #7e8195;
  }
}

.questionnaire-item {
  margin-right: 28px;

  &:first-of-type {
    margin-left: auto;
  }

  &:last-of-type {
    margin-right: auto;
  }
}

.preview-mode {
  pointer-events: none;
}
</style>
