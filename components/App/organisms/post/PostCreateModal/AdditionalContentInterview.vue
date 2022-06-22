<template>
  <div>
    <section>
      <h2>インタビュー参加社員</h2>
      <DefaultInterview :selected-item="editorEmployee">
        <SelectCommentPosition
          v-model="editorEmployee.comment_position"
          :disabled="$props.memberConfirmed"
        />
      </DefaultInterview>
      <SelectInterviewee
        v-for="(employee, i) in selectedEmployees"
        v-show="employee.user_uuid !== editorEmployee.user_uuid"
        :key="i"
        :selected-item="employee"
        :items="availableEmployees"
        :selected-items="selectedEmployees"
        :confirmed-member="$props.memberConfirmed"
        :is-admin="isAdmin"
        class="select-employee"
        @delete="onEmployeeDelete(i)"
        @select="onEmployeeSelect(i, $event)"
      >
        <SelectCommentPosition
          v-model="employee.comment_position"
          :disabled="$props.memberConfirmed"
          @input="onCommentPositionInput(i, $event)"
        />
      </SelectInterviewee>
      <div v-if="!addInterviewFlag && !endAddInterviewFlag">
        <BaseButton
          class="add"
          size="large"
          :disabled="confirmedMember"
          @click="onAddEmployeeButtonClick"
        >
          {{ addCommentButtonText }}
          <img
            class="icon"
            src="/app/icon/plus_circle_accent.svg"
            width="16px"
          />
        </BaseButton>
        <BaseButton
          class="add"
          size="large"
          :disabled="!canAddComment"
          @click="onConfirmMemberButtonClick"
        >
          メンバーを確定
        </BaseButton>
        <BaseButton
          class="addInterview"
          size="large"
          :disabled="!confirmedMember || $props.postTitle == ''"
          @click="onAddInterviewButtonClick"
        >
          インタビューを作成
        </BaseButton>
      </div>
      <div
        v-if="
          addInterviewFlag &&
            !endAddInterviewFlag &&
            interviewTemplate === 'normal'
        "
        class="boxAddInterview"
      >
        <h2>インタビューの作成</h2>
        <template v-for="(text, i) in interviewTexts">
          <div
            v-if="text.content_type === 'heading'"
            :key="`interview_text_${i}`"
            class="box heading-box"
          >
            <img
              class="icon"
              src="/app/icon/cross.svg"
              @click="onInterviewTextDelete(i)"
            />
            <textarea
              v-model="text.body"
              class="input heading"
              placeholder="見出しを入力してみましょう！"
              @change="changeContents"
            ></textarea>
          </div>
          <div
            v-else-if="text.content_type === 'comment'"
            :key="`interview_text_${i}`"
            class="box comment-box"
          >
            <img
              class="icon"
              src="/app/icon/cross.svg"
              @click="onInterviewTextDelete(i)"
            />
            <select v-model="text.commenter" @change="changeContents">
              <option disabled :value="undefined" selected>
                選択して下さい
              </option>
              <option
                v-for="commenter in availableCommenters"
                v-show="commenter.value"
                :key="commenter.value"
                :value="commenter.value"
                >{{ commenter.name }}</option
              >
            </select>
            <textarea
              v-model="text.body"
              class="input content"
              placeholder="発言を入力してみましょう！"
              @change="changeContents"
            ></textarea>
          </div>
        </template>
        <BaseButton class="add" size="large" @click="onAddHeadingButtonClick">
          見出しを追加
          <img
            class="icon"
            src="/app/icon/plus_circle_accent.svg"
            width="16px"
          />
        </BaseButton>
        <BaseButton
          class="add"
          size="large"
          :style="[{ marginBottom: '40px' }]"
          @click="onAddCommentButtonClick"
        >
          発言を追加
          <img
            class="icon"
            src="/app/icon/plus_circle_accent.svg"
            width="16px"
          />
        </BaseButton>
      </div>
      <div v-if="endAddInterviewFlag" class="boxAddInterview">
        <h2>作成したインタビュー</h2>
        <BaseButton
          class="editInterview"
          size="large"
          :style="[{ marginBottom: '40px' }]"
          :disabled="disabledResumeInterview"
          @click="onEditCommentButtonClick"
        >
          {{ lableButtonEditInterview }}
        </BaseButton>
        <div class="interviewListItem">
          <template v-for="(comment, i) in requestInterviewContents">
            <div
              v-if="comment.content_type == 'heading'"
              :key="i"
              class="titleBox"
            >
              <span class="title">{{ comment.body }}</span>
            </div>
            <div
              v-if="comment.content_type == 'comment'"
              :key="i"
              class="contentBox"
            >
              <div class="userBox">
                <img class="iconUserBox" :src="comment.user_icon" />
                <span class="userName">{{ comment.user_name }}</span>
              </div>
              <div class="quote-container">
                <div class="is-before"></div>
                <div class="quote-box before-radius">
                  <span>{{ comment.body }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { employees } from '@/libs/api/app';
import SelectInterviewee from './SelectInterviewee.vue';
import DefaultInterview from './DefaultInterview.vue';
import SelectCommentPosition from './SelectCommentPosition.vue';
import BaseButton from '../../../atoms/buttons/BaseButton.vue';

type CommentPosition = 'left' | 'right';

type AvailableCommenters = {
  value: string;
  name: string;
};

type Employee = ApiResponse.Employee & {
  comment_position?: CommentPosition;
};
type StorePostInterviewItem = AppApiRequest.StoreInterviewItem;

type Contents = {
  kind: 'comment' | 'heading';
  commenter?: string;
  body: string;
  user_icon?: string;
  user_name?: string;
  content_type?: string;
};

type InterviewText = Contents;

const emptyEmployee: Employee = {
  user_uuid: '',
  name: '',
  user_icon: '',
  organization_name: '',
};

export default Vue.extend({
  components: {
    SelectInterviewee,
    SelectCommentPosition,
    BaseButton,
    DefaultInterview,
  },
  props: {
    interviewee: {
      type: Array as PropType<Employee[]>,
      required: true,
    },
    interviewContents: {
      type: Array as PropType<InterviewText[]>,
      required: true,
    },
    addInterviewFlag: {
      type: Boolean,
      default: false,
    },
    endAddInterviewFlag: {
      type: Boolean,
      default: false,
    },
    requestInterviewContents: {
      type: Array as PropType<StorePostInterviewItem[]>,
      required: false,
      default: [],
    },
    interviewTemplate: {
      type: String,
      required: true,
    },
    postTitle: {
      type: String,
      required: false,
      default: '',
    },
    memberConfirmed: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabledResumeInterview: {
      type: Boolean,
      required: false,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    availableEmployees: [] as Employee[],
    selectedEmployees: [] as Employee[],
    interviewTexts: [] as InterviewText[],
    confirmedMember: false as boolean,
  }),
  computed: {
    lableButtonEditInterview() {
      if (this.$props.interviewTemplate === 'normal') {
        return 'インタビューを編集する';
      }
      return 'インタビューを再開する';
    },
    availableCommenters(): AvailableCommenters[] {
      const employeesList = this.selectedEmployees.map((emp: Employee) => ({
        value: emp.user_uuid,
        name: emp.name,
      })) as AvailableCommenters[];

      return [
        // 重複したuuidを省くためにMap型を使用している
        ...new Map(
          employeesList.map((item: AvailableCommenters) => [item.value, item])
        ).values(),
      ];
    },
    addCommentButtonText(): string {
      let buttonText = 'メンバーを追加';
      const countAvailableCommenters = this.availableCommenters.filter(
        (item: any) => item.value !== this.$store.state.userProfile.uuid
      ).length;
      if (countAvailableCommenters > 0) {
        buttonText = '社員を追加';
      }

      return buttonText;
    },
    canAddComment(): boolean {
      if (this.confirmedMember || !this.$props.postTitle) {
        return false;
      }
      const checkUserAdded = this.availableCommenters.filter(
        (item: any) => item.value === ''
      );
      if (checkUserAdded.length > 0) {
        return false;
      }
      return (
        this.availableCommenters
          .filter(
            (item: any) => item.value !== this.$store.state.userProfile.uuid
          )
          .filter((item: any) => item.value !== '').length > 0
      );
    },
    editorEmployee(): any {
      const editorEmployee = this.selectedEmployees.find(
        (item: any) => item.user_uuid === this.$store.state.userProfile.uuid
      );
      if (editorEmployee !== undefined) {
        return editorEmployee;
      }

      return {
        user_uuid: this.$store.state.userProfile.uuid,
        name: this.$store.state.userProfile.name,
        user_icon: this.$store.state.userProfile.user_icon,
        organization_name: this.$store.state.userProfile.organization_name,
        comment_position: 'left',
      };
    },
  },
  watch: {
    interviewee(value: Employee[]) {
      if (value.length === 0) this.selectedEmployees = [] as Employee[];
      if (value.length > 0) this.selectedEmployees = value;
    },
    interviewContents(value: InterviewText[]) {
      if (value.length === 0) this.interviewTexts = [] as InterviewText[];
      if (value.length > 0) this.interviewTexts = value;
    },
    memberConfirmed() {
      this.confirmedMember = this.$props.memberConfirmed;
    },
    selectedEmployees() {
      const editorEmployee = this.selectedEmployees.find(
        (item: any) => item.user_uuid === this.$store.state.userProfile.uuid
      );
      if (editorEmployee === undefined) {
        this.selectedEmployees.push({
          user_uuid: this.$store.state.userProfile.uuid,
          name: this.$store.state.userProfile.name,
          user_icon: this.$store.state.userProfile.user_icon,
          organization_name: this.$store.state.userProfile.organization_name,
          comment_position: 'left',
        });
      }
    },
  },
  async created() {
    await this.fetchEmployees(0);
    this.selectedEmployees = this.interviewee;
    this.interviewTexts = this.interviewContents;
    this.confirmedMember = this.$props.memberConfirmed;

    const editorEmployee = this.selectedEmployees.find(
      (item: any) => item.user_uuid === this.$store.state.userProfile.uuid
    );
    if (editorEmployee === undefined) {
      this.selectedEmployees.push({
        user_uuid: this.$store.state.userProfile.uuid,
        name: this.$store.state.userProfile.name,
        user_icon: this.$store.state.userProfile.user_icon,
        organization_name: this.$store.state.userProfile.organization_name,
        comment_position: 'left',
      });
    }
  },
  methods: {
    onEmployeeDelete(i: number): void {
      this.selectedEmployees.splice(i, 1);
    },
    onEmployeeSelect(i: number, employee: Employee): void {
      if (!this.selectedEmployees[i]) {
        return;
      }
      // コメント位置を維持するため一時変数に入れる
      const e = this.selectedEmployees[i];
      this.$set(this.selectedEmployees, i, employee);
      this.selectedEmployees[i].comment_position = e.comment_position ?? 'left';
      this.changeSelectEmployee();
    },
    // リストを更新するためにハンドラで Vue.set を呼ぶ
    onCommentPositionInput(i: number, value: CommentPosition): void {
      const e = this.selectedEmployees[i];
      e.comment_position = value;
      this.$set(this.selectedEmployees, i, e);
      this.changeSelectEmployee();
      this.changeContents();
    },
    onAddEmployeeButtonClick(): void {
      this.selectedEmployees.push({
        ...emptyEmployee,
        comment_position: 'left',
      });
    },
    onConfirmMemberButtonClick(): void {
      this.confirmedMember = true;
      this.$emit('interviewMemberConfirmed', this.confirmedMember);
    },
    onAddInterviewButtonClick(): void {
      this.$emit('addInterview', true);
    },
    onAddCommentButtonClick(): void {
      this.interviewTexts.push({
        kind: 'comment',
        content_type: 'comment',
        body: '',
      });
      this.changeContents();
    },
    onEditCommentButtonClick(): void {
      this.$emit('editInterviewContent', false);
    },
    onAddHeadingButtonClick(): void {
      this.interviewTexts.push({
        kind: 'heading',
        content_type: 'heading',
        body: '',
      });
      this.$emit('changeContents', this.interviewTexts);
    },
    onInterviewTextDelete(i: number): void {
      this.interviewTexts.splice(i, 1);
      this.changeContents();
    },
    changeSelectEmployee() {
      this.$emit('selectEmployee', this.selectedEmployees);
    },
    changeContents() {
      this.$emit('changeContents', this.interviewTexts);
    },
    async fetchEmployees(offset: number): Promise<void> {
      const { data } = await employees({ offset });
      this.availableEmployees.push(...data.users);
    },
  },
});
</script>

<style lang="scss" scoped>
section:not(:first-child) {
  margin-top: 40px;
}

h2 {
  font-size: 15px;
  font-weight: 600;
}

.select-employee {
  margin-top: 16px;
}

.add {
  width: 100%;
  margin-top: 14px;
  position: relative;
  background-color: $button_background_color;
  color: $gentle_bluish_purple;
  font-weight: 600;
  border: 1px solid $ruled_line;
  border-radius: 4px;
  padding: 10px 16px;

  .icon {
    position: absolute;
    left: 12px;
    top: 14px;
  }
}

.editInterview {
  width: 100%;
  margin-top: 14px;
  position: relative;
  background-color: #fff;
  color: #f09c9c;
  font-weight: 600;
  border: 1px solid #f09c9c;
  border-radius: 4px;
  padding: 10px 16px;
}

.addInterview {
  width: 100%;
  margin-top: 39px;
  margin-bottom: 40px;
  position: relative;
  background-color: #f09c9c;
  color: #fff;
  font-weight: 600;
  border: 1px solid $ruled_line;
  border-radius: 4px;
  padding: 10px 16px;

  .icon {
    position: absolute;
    left: 12px;
    top: 14px;
  }
}

.addInterview:disabled {
  background-color: $button_background_color;
  opacity: 0.2;
  cursor: not-allowed;
}

.input {
  width: 100%;
  appearance: none;
  border: none;
  color: $main_color;

  .heading {
    padding: 0;
  }

  .content {
    padding: 20px 0;
  }
}

.box {
  margin-top: 16px;
  border: 1px solid $ruled_line;
  border-radius: 4px;
  padding: 16px;
  position: relative;

  > .icon {
    position: absolute;
    right: 16px;
    top: 16px;
    cursor: pointer;
  }
}

.boxAddInterview {
  padding-top: 40px;
}

.comment-box {
  display: flex;
  flex-direction: column;

  select {
    width: 25%;
    border: none;
  }
}

.interviewListItem {
  display: flex;
  flex-direction: column;

  .titleBox {
    margin-bottom: 14px;
    display: flex;

    .title {
      color: #2e303e;
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 14px;
      width: 98%;
      white-space: pre-line;
    }

    .icon-edit {
      float: right;
    }
  }

  .contentBox {
    display: flex;
    padding-bottom: 5px;

    .userBox {
      display: flex;
      flex-direction: column;

      > .icon {
        right: 15px;
      }

      > .iconUserBox {
        object-fit: cover;
        border-radius: 17px;
        width: 44px;
        height: 44px;
      }

      > .userName {
        font-size: 10px;
      }
    }

    .icon-edit {
      margin: auto;
    }
  }
}

.quote-container {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  color: $chart_text;
  margin: 3px 0 16px;
}

.quote-box {
  background: transparent $gradient_6 0% 0% no-repeat padding-box;
  border-radius: 0 0 8px 8px;
  padding: 16px 16px 19px 16px;
}

.before-radius {
  border-radius: 0 8px 8px 8px;
  white-space: pre-line;
}

.is-before {
  margin: 0 -12px 0 0;
  border-left: 20px solid transparent;
  border-top: 20px solid $baby_blue;
  border-bottom: 20px solid transparent;
  background-color: transparent;
}
</style>
