<template>
  <div class="invitation-wrapper">
    <img src="/app/icon/Icon-people.svg" class="icon" />
    <div class="invitation-contents">
      <div class="title" @click="memberListModal = true">
        {{ invitationCountText }}
      </div>
      <template v-if="isEventRequiredAnswer">
        <p class="description">{{ invitationDescriptionCountText }}</p>
        <event-profile-icon-list
          :participation-users="participationUserList"
          class="icon-list"
          :dark-icon-number="7"
          :is-visitor="isVisitor"
          @onClick="memberListModal = true"
        />
        <div class="button-wrapper">
          <template v-for="button in buttonContents">
            <base-button
              :key="button.name"
              class="button"
              :class="{ 'answered-button': button.value === answer }"
              :disabled="isDisabledInvitation"
              @click="clickAnswer(button.value)"
            >
              {{ button.name }}
            </base-button>
          </template>
        </div>
      </template>
    </div>
    <member-list-modal
      v-if="memberListModal"
      :title="'招待メンバー'"
      :companies="companies"
      @onClose="memberListModal = false"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from '@/libs/dayjs';
import { fetchEventUsers } from '@/libs/api/app';
import BaseButton from '../../atoms/buttons/BaseButton.vue';
import EventProfileIconList from './EventProfileIconList.vue';
import MemberListModal from '../memberList/MemberListModal.vue';

export default Vue.extend({
  components: {
    BaseButton,
    EventProfileIconList,
    MemberListModal,
  },
  props: {
    participationCount: {
      type: Number,
      required: true,
    },
    invitationCount: {
      type: Number,
      required: true,
    },
    nonParticipationCount: {
      type: Number,
      required: true,
    },
    undecidedCount: {
      type: Number,
      required: true,
    },
    unansweredCount: {
      type: Number,
      required: true,
    },
    endAt: {
      type: Number,
      required: true,
    },
    expiredAt: {
      type: Number,
      required: true,
    },
    isRequiredAnswer: {
      type: Boolean,
      required: true,
    },
    answer: {
      type: String as PropType<string | null>,
      required: false,
      default: null,
    },
    participationUsers: {
      type: Array as PropType<AppApiResponse.EventUser[]>,
      required: true,
    },
    invitationUsers: {
      type: Array as PropType<AppApiResponse.EventUser[]>,
      required: true,
    },
    isVisitor: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      buttonContents: [
        { name: '参加', value: 'participation' },
        { name: '不参加', value: 'non-participation' },
        { name: '未定', value: 'undecided' },
      ],
      firstSelectedAnswer: this.answer as string,
      memberListModal: false as boolean,
      companies: [] as AppApiResponse.MemberListCompany[],
    };
  },
  computed: {
    uuid(): string {
      return this.$route.params.id;
    },
    invitationCountText(): string {
      return `招待${this.invitationCount}名`;
    },
    invitationDescriptionCountText(): string {
      return `参加${this.calculatedParticipationCount}名 不参加${this.calculatedNonParticipationCount}名
      未定${this.calculatedUndecidedCount}名 未回答${this.calculatedUnansweredCount}名`;
    },
    calculatedParticipationCount(): number {
      return this.calculatedCount('participation', this.participationCount);
    },
    calculatedNonParticipationCount(): number {
      return this.calculatedCount(
        'non-participation',
        this.nonParticipationCount
      );
    },
    calculatedUndecidedCount(): number {
      return this.calculatedCount('undecided', this.undecidedCount);
    },
    calculatedUnansweredCount(): number {
      return this.calculatedCount('unanswered', this.unansweredCount);
    },
    isEventEnd(): boolean {
      return dayjs().unix() > this.endAt;
    },
    isInvitationEnd(): boolean {
      return dayjs().unix() > this.expiredAt;
    },
    isEventRequiredAnswer(): boolean {
      return this.isRequiredAnswer;
    },
    participationUserList(): ApiResponse.EventUser[] {
      let result = [...this.participationUsers] as ApiResponse.EventUser[];
      if (this.firstSelectedAnswer === 'participation') {
        // ユーザが2重で登録されてしまうため、既に登録されていたら省く
        result = result.filter(
          (item: ApiResponse.EventUser) =>
            item.uuid !== this.$store.state.userProfile.uuid
        );
      }
      if (this.answer === 'participation') {
        result = [
          ...result,
          {
            uuid: this.$store.state.userProfile.uuid,
            icon: this.$store.state.userProfile.user_icon,
            name: this.$store.state.userProfile.name,
          },
        ];
      }
      return result;
    },
    isInvitationEventUser(): boolean {
      const currentUserUuid = this.$store.state.userProfile.uuid;
      const checkInvitationEventUser = [...this.invitationUsers].find(
        (user: AppApiResponse.EventUser) => currentUserUuid === user.uuid
      );
      if (checkInvitationEventUser) {
        return true;
      }
      return false;
    },
    isDisabledInvitation(): boolean {
      return (
        this.isInvitationEnd || this.isEventEnd || !this.isInvitationEventUser
      );
    },
  },
  created() {
    this.fetchEventUsers();
  },
  methods: {
    async fetchEventUsers() {
      try {
        if (this.uuid !== undefined) {
          const { data } = await fetchEventUsers(this.uuid);
          this.companies = data.companies;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
      }
    },
    clickAnswer(value: string) {
      if (!this.isInvitationEventUser) {
        return;
      }
      this.$emit('onClick', value);
    },
    calculatedCount(type: string, count: number): number {
      let result = count;
      if (this.firstSelectedAnswer === type) result -= 1;
      if (this.answer === type) result += 1;
      return result;
    },
  },
});
</script>

<style lang="scss" scoped>
.invitation-wrapper {
  display: flex;
  align-items: flex-start;
}

.icon {
  width: 10px;
  margin: 0 11px 0 0;
}

.title {
  color: $main_color;
  font-size: 15px;
  font-weight: 600;
  line-height: 1em;
  margin: 0 0 6px 0;
  cursor: pointer;
}

.description {
  color: $main_color;
  font-size: 13px;
  font-weight: 300;
  line-height: 1.6em;
  margin: 0 0 16px 0;
}

.button-wrapper {
  display: flex;
  align-items: center;
}

.button {
  height: 38px;
  width: 93px;
  background-color: $button_background_color;
  color: $gentle_bluish_purple;
  font-size: 12px;
  margin: 0 8px 0 0;

  &:last-of-type {
    margin: 0;
  }

  &:disabled {
    opacity: 1;
    cursor: not-allowed;
  }
}

.icon-list {
  margin: 0 0 25px 0;
}

.answered-button {
  background-color: $link_color;
  color: $true_white;
}
</style>
