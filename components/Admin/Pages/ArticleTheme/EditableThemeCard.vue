<template>
  <div class="theme-card">
    <div class="theme-summary">
      <div>{{ summary }}</div>
      <label>
        <button class="button select-mode enter" @click="enterSelectMode">
          テーマを変更
        </button>
        <button class="button select-mode cancel" @click="cancelSelectMode">
          選択モードを閉じる
          <img src="/icon/icon_cross.png" />
        </button>
        <button v-if="usedInAllCompanies" class="button default">
          <img src="/icon/icon_circle-check.png" />
          全社に適用済み
        </button>
        <button
          v-else
          class="button set-default"
          @click="setUsedInAllCompanies"
        >
          <img src="/icon/icon_circle.svg" />
          全社に適応する
        </button>
      </label>
    </div>
    <div class="top-box">
      <div class="theme-title" :title="editableValue.title">
        {{ editableValue.title }}
      </div>
      <div>
        <star-rating
          class="star-rating"
          :rating="editableValue.rating"
          editable
          @click="onClick($event)"
        ></star-rating>
        <post-sample-button
          @click="openArticleSampleModal()"
        ></post-sample-button>
      </div>
    </div>
    <div class="middle-box">
      <div v-if="mode === 'normal'" class="theme-sentence">
        {{ editableValue.sentence
        }}<svg
          class="edit-button"
          height="26"
          viewBox="0 0 17 17"
          width="26"
          xmlns="http://www.w3.org/2000/svg"
          @click="enterEditMode()"
        >
          <g transform="translate(-243.611 -149.5)">
            <g fill="#7e8195">
              <path
                d="m250.55 157.563-.325 1.642a.547.547 0 0 0 .65.642l1.636-.345a.529.529 0 0 0 .123-.031l-2.051-2.051a.541.541 0 0 0 -.033.143z"
              />
              <path d="m250.922 156.984 2.15 2.15 5.344-5.305-2.15-2.15z" />
              <path
                d="m259.949 151.53-1.381-1.371a.547.547 0 0 0 -.771 0l-1.143 1.134 2.151 2.15 1.144-1.136a.547.547 0 0 0 0-.777z"
              />
            </g>
            <path
              d="m260.111 156.713v8.4a.889.889 0 0 1 -.889.889h-14.222a.889.889 0 0 1 -.889-.889v-14.224a.889.889 0 0 1 .889-.889h7.691"
              fill="none"
              stroke="#7e8195"
              stroke-linecap="round"
              stroke-miterlimit="10"
            />
          </g>
        </svg>
      </div>
      <div v-show="mode === 'edit'" class="theme-sentence-wrapper">
        <textarea
          ref="sentenceTextarea"
          v-model="editableValue.sentence"
          class="theme-sentence textarea"
        ></textarea>
        <span class="save-button" @click="save()">保存</span>
      </div>
    </div>
    <div class="bottom-box">
      <span class="date-edit item">
        <DateInput
          v-if="summary === '次回のテーマ'"
          v-model="formattedStartDate"
          class="date-input"
          display-format="YYYY/M/D"
          :min-date="formattedStartDate"
          :max-date="subDate(formattedEndDate)"
          @input="save()"
        />
        <DateInput
          v-else
          v-model="formattedStartDate"
          class="date-input"
          disabled
          display-format="YYYY/M/D"
        />
      </span>
      <span class="item">~</span>
      <span class="date-edit item">
        <DateInput
          v-model="formattedEndDate"
          class="date-input"
          display-format="YYYY/M/D"
          :min-date="addDay(formattedStartDate)"
          @input="save()"
        />
      </span>
    </div>

    <article-sample-modal
      v-if="articleSampleModal"
      :editable="true"
      :title="value.title"
      :sentence="value.sentence"
      @save="saveEditedSentenceOnModal($event)"
      @close="closeArticleSampleModal()"
    ></article-sample-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { StarRating } from '@/components/Admin/Pages/';
import DateInput from '@/components/Admin/Modules/Input/DateInput.vue';
import dayjs from 'dayjs';
import ArticleSampleModal from './AtricleSampleModal.vue';
import PostSampleButton from './PostSampleButton.vue';

type Mode = 'normal' | 'edit';

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

export default Vue.extend({
  components: {
    StarRating,
    ArticleSampleModal,
    DateInput,
    PostSampleButton,
  },
  props: {
    companies: {
      type: Array,
      required: true,
    },
    currentCompany: {
      type: Object,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      checked: false,
      mode: 'normal' as Mode,
      articleSampleModal: false,
    };
  },
  computed: {
    editableValue: {
      get() {
        return this.value;
      },
    },
    formattedStartDate: {
      get(): string {
        const { startDate } = this.value;
        return startDate;
      },
      set(newValue: string) {
        this.value.startDate = newValue.replaceAll('-', '/');
      },
    },
    formattedEndDate: {
      get(): string {
        const { endDate } = this.value;
        return endDate;
      },
      set(newValue: string) {
        this.value.endDate = newValue.replaceAll('-', '/');
      },
    },
    usedInAllCompanies() {
      const valueIndex = this.currentCompany.post_themes
        .map((postTheme: PostTheme) => postTheme.uuid)
        .indexOf(this.value.uuid);
      const usedCompanies = this.companies.filter((company: Company) => {
        if (company.uuid === this.currentCompany.uuid) {
          return true;
        }
        if (
          company.post_themes &&
          company.post_themes[valueIndex] &&
          company.post_themes[valueIndex].master_post_theme_uuid ===
            this.value.masterPostThemeUuid
        ) {
          return true;
        }
        return false;
      });
      return usedCompanies.length === this.companies.length;
    },
  },
  methods: {
    addDay(date: string) {
      return dayjs(date)
        .startOf('day')
        .add(1, 'day')
        .format('YYYY/MM/DD');
    },
    subDate(date: string) {
      return dayjs(date)
        .startOf('day')
        .subtract(1, 'day')
        .format('YYYY/MM/DD');
    },
    onClick(i: number) {
      this.$emit('update-rate', { rate: i, uuid: this.value.uuid });
    },
    setUsedInAllCompanies() {
      setTimeout(() => {
        this.$emit('use-theme-in-every-company', this.value);
      }, 0);
    },
    openArticleSampleModal() {
      this.articleSampleModal = true;
    },
    closeArticleSampleModal() {
      this.articleSampleModal = false;
    },
    save() {
      this.$emit('save');
      this.exitEditMode();
    },
    saveEditedSentenceOnModal(sentence: string) {
      this.$emit('save', sentence);
      this.closeArticleSampleModal();
    },
    enterEditMode() {
      this.mode = 'edit';
      const element: any = this.$refs.sentenceTextarea;
      setTimeout(() => {
        element.focus();
      }, 0);
    },
    exitEditMode() {
      this.mode = 'normal';
    },
    enterSelectMode() {
      this.$emit('enter-select-mode', this.value);
    },
    cancelSelectMode() {
      this.$emit('cancel-select-mode');
    },
  },
});
</script>

<style lang="scss" scoped>
.theme-card {
  border: solid 1px $light_gray_blue_3;
  border-radius: 6px;
  padding: 20px 15px 15px 15px;

  .theme-summary {
    display: flex;
    font-size: 15px;
    align-items: center;
    height: 20px;

    > div {
      font-weight: bold;
    }

    .button {
      min-width: 130px;
      height: 30px;
      background-color: $light_gray_blue_5;
      border: none;
      border-radius: 4px;

      &:hover {
        background-color: $light_gray_blue_1;
      }

      &:not(.select-mode) {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 16px;

        img {
          margin-right: 7px;
          height: 16px;
        }

        &.set-default {
          background: #edeff7;
          border: solid 1px $light_gray_blue_5;
        }

        &.default {
          cursor: default;
          background: #fce9e9;
          border: solid 1px #e4e5ed;
        }
      }

      &.select-mode {
        &.cancel {
          position: absolute;
          padding: 0 15px;
          bottom: calc(100% + 25px);
          right: 45px;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            margin-left: 7px;
            height: 12px;
          }
        }
      }
    }
  }

  &.selected {
    position: relative;
    z-index: 10;

    .theme-summary {
      .button.select-mode.enter {
        background: #f2f4ff;
        pointer-events: none;
      }
    }
  }

  &:not(.selected) {
    .theme-summary {
      .button.select-mode.cancel {
        display: none;
      }
    }
  }

  .top-box {
    display: flex;
    margin-top: 20px;

    .theme-title {
      color: $gray_blue_1;
      flex-grow: 1;
      background-color: $white_2;
      margin-right: 6px;
      border: solid 1px $light_gray_blue_3;
      border-radius: 4px;
      padding: 4px 11px;
      line-height: 32px;
      font-size: 13px;
      font-weight: 300;
      height: 40px;
      width: 310px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .middle-box {
    margin-top: 15px;

    .theme-sentence-wrapper {
      position: relative;
      height: 86px;

      .save-button {
        position: absolute;
        top: 2px;
        right: 1px;
        background-color: $light_gray_blue_1;
        padding: 3px 2px;
        height: 26px;
        width: 26px;
        cursor: pointer;
        font-size: 11px;
        font-weight: 600;
        color: $gray_blue_4;
        border-radius: 0 8px 0 0;
      }
    }

    .theme-sentence {
      position: relative;
      border: solid 1px $light_gray_blue_3;
      border-radius: 4px;
      padding: 11px 28px 11px 11px;
      height: 86px;
      overflow-y: auto;
      color: $gray_blue_4;
      scrollbar-width: thin;
      scrollbar-color: #7e8195 white;

      &.textarea {
        resize: none;
        width: 100%;
        border: solid 3px $light_gray_blue_3;
        font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
          'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 16px;
        word-spacing: 1px;
      }

      .edit-button {
        position: absolute;
        top: 0;
        right: 0;
        background-color: $white_2;
        padding: 6px;
        cursor: pointer;
      }
    }

    .theme-sentence::-webkit-scrollbar {
      width: 4px;
      height: 0;
    }

    .theme-sentence::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background: #7e8195;
    }
  }

  .bottom-box {
    display: flex;
    margin-top: 15px;
    align-items: center;

    .item + .item {
      margin-left: 10px;
    }

    .date {
      width: 115px;
      border: solid 1px #707070;
      border-radius: 8px;
      padding: 3px 6px;
    }
  }

  h2 {
    color: $dark_blue;
    font-size: 15px;
    font-weight: 600;
    width: 105px;
  }

  label {
    display: flex;
    margin-left: 16px;
  }
}

.star-rating {
  text-align: center;
  margin-bottom: 3px;
}

.date-edit {
  position: relative;
}

.date-input {
  width: 120px;
}
</style>
