<template>
  <div>
    <template v-for="(item, i) in questionnaireItems">
      <div :key="item.uuid + i" class="questionnaire-answer-user-icon-list">
        <profile-list-icon
          v-for="(user, index) in slicedUsersList(item.users)"
          :key="user.uuid"
          :dark-icon-number="8"
          :src="user.icon"
          :index="index + 1"
          :user-uuid="user.uuid"
          class="questionnaire-answer-user-icon"
          @onClick="openModal"
        />
      </div>
      <questionnaire-answered-item
        :key="item.uuid"
        :answer="item.content"
        :vote-count="item.vote_count"
        :uuid="item.uuid"
        class="item"
        :style="variableWidth(item.vote_count)"
        :class="{
          'answered-item': isAnswered(item.uuid),
        }"
      />
    </template>
    <p class="answered-text">{{ voteCount }}票</p>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import QuestionnaireAnsweredItem from '../../atoms/questionnaire/QuestionnaireAnsweredItem.vue';
import ProfileListIcon from '../profile/ProfileListIcon.vue';

export default Vue.extend({
  components: {
    QuestionnaireAnsweredItem,
    ProfileListIcon,
  },
  props: {
    questionnaireItems: {
      type: Array as PropType<ApiResponse.QuestionnaireItem[]>,
      required: false,
      default: null,
    },
    voteCount: {
      type: Number,
      required: true,
    },
    vote: {
      type: Object as PropType<ApiResponse.Vote>,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      // TODO: API連携時修正お願いします
      memberListModal: false as boolean,
    };
  },
  methods: {
    variableWidth(voteCount: number) {
      // 最低40%の横幅を保持、残り60%で幅の増幅を表現する
      const initialVariableWidth = 40;
      const totalCount = this.voteCount;
      const width =
        initialVariableWidth +
        (voteCount / totalCount || 0) * (100 - initialVariableWidth);
      return {
        width: `${width}%`,
      };
    },
    isAnswered(uuid: string): boolean {
      if (this.vote === null) return false;
      return uuid === this.vote.uuid;
    },
    // 7つ以上は表示させないようにする
    slicedUsersList(users: ApiResponse.QuestionnaireItem[]) {
      return users.length > 7 ? users.slice(0, 8) : users;
    },
    openModal() {
      // TODO: API連携時モーダルを開くように修正お願いします
      this.memberListModal = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.item {
  margin: 0 0 8px 0;

  &:last-of-type {
    margin: 0;
  }
}

.answered-item {
  background-color: $link_color;
}

.answered-text {
  font-size: 13px;
  color: $main_color;
  font-weight: 300;
  line-height: 1em;
  margin: 16px 0 0 0;
}

.questionnaire-answer-user-icon-list {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0 0 10px 0;
}

.questionnaire-answer-user-icon {
  margin: 0 5px 0 0;

  &:last-of-type {
    margin: 0;
  }
}
</style>
