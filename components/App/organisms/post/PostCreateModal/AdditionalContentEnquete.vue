<template>
  <div class="question-container">
    <button class="close" @click="onClose">
      <img src="/app/icon/Icon-enquete-close.svg" />
    </button>
    <h2>
      <img src="/app/icon/Icon-add-enquete.svg" />
      アンケート
    </h2>
    <section class="question">
      <div class="question-forms">
        アンケート項目を設定
        <div v-for="(item, index) in question.items" :key="index">
          <outlined-text-field
            v-model="item.content"
            :placeholder="
              index + 1 <= 2 ? '回答' + index + '（入力必須）' : '回答' + index
            "
            :input-name="'choices_' + index"
            class="form__input"
            :rules="index + 1 <= 2 ? 'required' : ''"
            type="text"
            @input="changeQuestions(question.items)"
          >
          </outlined-text-field>
          <span class="image-input">
            <label class="upload-image-button">
              <input
                type="file"
                name="pic"
                style="display: none;"
                @change="onAnswerFileChange($event, item)"
              />
              <span v-if="!item.add_image_url">
                <img
                  class="icon"
                  src="/app/icon/icon-camera.svg"
                  width="16px"
                />
              </span>
              <span v-else>
                <img class="icon" src="/icon/icon_image@2x.png" width="16px" />
                <img
                  class="icon circle-checked"
                  src="/icon/icon_circle-check.png"
                  width="10px"
                />
              </span>
            </label>
            <span v-if="question.items.length > 2">
              <img
                class="icon circle-del"
                src="/icon/icon_close_b.svg"
                width="15px"
                @click="removeQuestionItem(index)"
              />
            </span>
          </span>
        </div>
        <button class="add" @click="onAddChoiseButtonClick">
          回答の追加
          <img
            class="icon"
            src="/app/icon/plus_circle_accent.svg"
            width="16px"
          />
        </button>
      </div>
      <div class="question-setting">
        <div class="target">
          <label>回答の対象</label>
          <!-- TODO: 画像を追加する機能をつける必要あり -->
          <select-box-organization
            v-model="question.organization_uuid"
            name="select-box"
            :items="organizations"
            placeholder="全員"
            large-font
            @change="changeOrganization"
          />
        </div>
        <div class="expire">
          回答の期限
          <div>
            <outlined-text-field
              :value="expire_at"
              class="expire-select"
              :class="{ 'expire-select--error': afterTodayExpierAt }"
              @focus="onCalendarActiveButtonClick"
            >
            </outlined-text-field>
            <PostQuestionnaireExpireDateTimeCalendar
              v-if="calendar_active"
              v-model="expire_at"
              class="date-input"
              @onExpireChange="expireChange"
              @onClose="onCalendarActiveInactiveButtonClick"
            ></PostQuestionnaireExpireDateTimeCalendar>
          </div>
        </div>
        <div class="disclosed">
          <div class="text">
            誰がどの回答をしたのか非表示にする
          </div>
          <toggle-button
            v-model="question.is_disclosed_answerers"
            class="button"
            @onChange="changeDisclosedAnswerers"
          ></toggle-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from '@/libs/dayjs';
import { uploadImage } from '@/libs/api/app';
import cloneDeep from 'lodash/cloneDeep';
import OutlinedTextField from '../../../atoms/textFields/OutlinedTextField.vue';
import ToggleButton from '../../../atoms/buttons/ToggleButton.vue';
import PostQuestionnaireExpireDateTimeCalendar from '../../../molecules/date/PostQuestionnaireExpireDateTimeCalendar.vue';
import SelectBoxOrganization from './SelectBoxOrganization.vue';

type StorePostQuestionnaire = AppApiRequest.StorePostQuestionnaire;

type Organization = ApiResponse.Organization;

type Heading = {
  kind: 'heading';
  body: string;
};

export default Vue.extend({
  components: {
    OutlinedTextField,
    PostQuestionnaireExpireDateTimeCalendar,
    ToggleButton,
    SelectBoxOrganization,
  },
  props: {
    organizations: {
      type: Array as PropType<Organization[]>,
      default: [],
    },
    questionnaire: {
      type: Object as PropType<StorePostQuestionnaire | null>,
      required: false,
      default: null,
    },
    editPostUuid: {
      type: String,
      required: false,
      default: '',
    },
    afterTodayExpierAt: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    question: {} as StorePostQuestionnaire,
    expire_at: String(dayjs().format('YYYY/MM/DD HH:mm')) as string,
    selectedOrganization: null as ApiResponse.Organization | null,
    calendar_active: false as boolean,
  }),
  watch: {
    questionnaire(value: StorePostQuestionnaire | null) {
      if (value === null) {
        this.$set(this.question, 'expire_at', dayjs(this.expire_at).unix());
        this.$set(this.question, 'organization_uuid', null);
        this.$set(this.question, 'is_disclosed_answerers', false);
        this.$set(this.question, 'items', []);
        this.$set(this.question.items, this.question.items.length, {
          content: '',
          add_image_url: '',
        });
        this.$set(this.question.items, this.question.items.length, {
          content: '',
          add_image_url: '',
        });
      }
    },
  },
  created() {
    if (this.questionnaire != null) {
      this.question = cloneDeep(this.questionnaire);
      if (this.editPostUuid != null) {
        this.expire_at = dayjs
          .unix(this.questionnaire?.expire_at)
          .format('YYYY/MM/DD HH:mm');
      }
    } else {
      this.$set(this.question, 'expire_at', dayjs(this.expire_at).unix());
      this.$set(this.question, 'organization_uuid', null);
      this.$set(this.question, 'is_disclosed_answerers', false);
      this.$set(this.question, 'items', []);
      this.$set(this.question.items, this.question.items.length, {
        content: '',
        add_image_url: '',
      });
      this.$set(this.question.items, this.question.items.length, {
        content: '',
        add_image_url: '',
      });
    }
  },
  methods: {
    onAddChoiseButtonClick() {
      this.$set(this.question.items, this.question.items.length, {
        content: '',
        add_image_url: '',
      });
    },
    onClose(event: Event) {
      this.question = {} as StorePostQuestionnaire;
      this.$emit('onQuestionSelect', this.question);
      this.$emit('onEnqueteClose', event);
    },
    onCalendarActiveInactiveButtonClick() {
      this.calendar_active = !this.calendar_active;
    },
    onCalendarActiveButtonClick() {
      this.calendar_active = true;
    },
    expireChange(expire_at: Date) {
      this.expire_at = dayjs(expire_at).format('YYYY/MM/DD HH:mm');
      this.$emit('changeExpireAt', dayjs(expire_at).unix());
    },
    changeQuestions(items: AppApiRequest.StoreQuestionnaireItem[]) {
      this.$emit('onQuestionSelect', items);
    },
    changeOrganization(uuid: string) {
      this.$emit('changeOrganization', uuid);
    },
    changeDisclosedAnswerers(value: boolean) {
      this.$emit('changeDisclosedAnswerers', value);
    },
    async onAnswerFileChange(e: any, item: Object) {
      const files = e.target.files || e.dataTransfer.files;
      const image = files[0];
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        const res = await uploadImage(formData);
        let items = [];
        items = this.question.items.map((i: Object) => {
          if (i === item) {
            const returnValue = { ...i };
            returnValue.add_image_url = res.data.url;
            return returnValue;
          }
          return i;
        });
        this.$set(this.question, 'items', items);
        this.$emit('onQuestionSelect', this.question.items);
      }
    },
    removeQuestionItem(index: number) {
      this.question.items.splice(index, 1);
    },
  },
});
</script>

<style lang="scss" scoped>
.question-container {
  padding-top: 25px;
  position: relative;

  .close {
    position: absolute;
    right: 1px;
    border: none;
    background: white;
  }
}

h2 {
  font-size: 15px;
  font-weight: bold;
  padding-bottom: 25px;
}

.add {
  width: fit-content;
  position: relative;
  background-color: $true_white;
  color: $link_color;
  font-weight: 200;
  border: none;
  padding: 10px 16px;
  left: 50%;
  transform: translate(-50%);

  .icon {
    position: absolute;
    right: -3px;
    top: 13px;
  }
}

.input {
  width: 100%;
  appearance: none;
  border: none;
  padding: 20px 0;
  color: $main_color;
}

.question {
  display: flex;
  justify-content: space-between;

  .question-forms {
    width: 340px;
    position: relative;
    margin-bottom: 54px;
  }

  .question-setting {
    width: 340px;
  }

  .image-input {
    display: inline;
    position: relative;
    top: -54px;
    left: 310px;

    .circle-checked {
      position: relative;
      top: -10px;
      right: 10px;
    }

    .circle-del {
      position: relative;
      top: -20px;
      right: -5px;
      cursor: pointer;
    }
  }
}

.expire {
  padding-bottom: 0;

  .expire-select ::v-deep .outline-input {
    width: 100%;
    height: 44px;
    font-size: 13px;
    color: $gray_blue_4;
    background-color: $input_text_background_color;
    outline: none;
    border: solid 1px $light_gray_blue_3;
    border-radius: 4px;
    padding-left: 12px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url('/app/icon/Icon-pulldown.svg');
    background-repeat: no-repeat;
    background-size: 10px 8px;
    background-position: center right 10px;
    cursor: pointer;
  }

  .expire-select--error ::v-deep .outline-input {
    background-color: $light_pink;
    border: 1px solid $invalid_pink;
  }
}

.target {
  padding-bottom: 24px;
}

.disclosed {
  display: flex;
  justify-content: space-between;

  .text {
    width: 165px;
  }
}
</style>
