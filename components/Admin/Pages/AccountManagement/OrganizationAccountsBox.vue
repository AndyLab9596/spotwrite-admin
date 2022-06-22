<template>
  <div>
    <div
      class="member-list-header"
      :class="{ children: isChildren, alone: !hasChildren }"
    >
      <div class="inner">
        <div class="chip">
          <div
            v-if="isChildren"
            ref="relationEnd"
            class="label child-label"
            :class="{
              ...attributeColor,
              'relation-horizontal-line': relationLineHeight.height !== '',
            }"
          >
            {{ typeToJapanese(organization.type) }}
          </div>
          <div
            v-else
            ref="relationStart"
            class="label"
            :class="{
              ...attributeColor,
              'parent-label': relationLineHeight.height !== '',
            }"
          >
            <div
              class="line"
              :class="{ ...attributeColor }"
              :style="relationLineHeight"
            />
            {{ typeToJapanese(organization.type) }}
          </div>

          <div v-if="parentName" class="upper-organization">
            {{ parentName }}
          </div>
          <div class="organization">
            {{ organization.name }}
          </div>
        </div>
        <div class="counter">
          <div>
            発行済み<span class="issue">{{ numberOfSentMembers }}</span
            >人
          </div>
          <div>
            未発行<span class="issue">{{ numberOfNonActiveMembers }}</span
            >人
          </div>
        </div>
      </div>
      <div class="fade-button-box">
        <a role="button" @click="fadeToggle">
          <img
            :class="{ close: !isOpened }"
            src="/app/icon/chevron_down_square.svg"
            alt="arrow_down"
          />
        </a>
      </div>
    </div>
    <transition name="fade">
      <div v-if="isOpened" class="member-box">
        <AccountBox
          v-for="member in subordinatedMembers"
          v-show="shouldShowMember(member)"
          :key="member.user_uuid"
          :member="member"
          :is-checked="isMemberChecked(member)"
          :is-all-user-checked="isAllUserChecked"
          :email-domains="emailDomains"
          @change-status="changeStatus"
          @checked-member="checkedMember($event)"
          @unchecked-member="uncheckedMember($event)"
        />
      </div>
    </transition>

    <template v-if="hasChildren">
      <organization-accounts-box
        v-for="(child, i) in children"
        :key="child.uuid"
        :organization="child"
        :filter-by="filterBy"
        :selected-users="selectedUsers"
        :is-all-user-checked="isAllUserChecked"
        is-children
        :parent-name="organization.name"
        :is-last-children="i === children.length - 1"
        :email-domains="emailDomains"
        @declare-member-count="memberCount"
        @line-height-adjust="lineHeightAdjust"
        @checked-member="checkedMember($event)"
        @unchecked-member="uncheckedMember($event)"
        @fetch-member="fetchMember"
      />
    </template>
  </div>
</template>

<script lang="ts">
// 自己参照するとTSがエラーするので無視する
// @ts-nocheck
import Vue, { PropType } from 'vue';
import { fetchOrganizationUsers } from '@/libs/api';
import AccountBox from './AccountBox.vue';
// eslint-disable-next-line import/no-self-import
import OrganizationAccountsBox from './OrganizationAccountsBox.vue';

export default Vue.extend({
  name: 'OrganizationAccountsBox',
  components: { OrganizationAccountsBox, AccountBox },
  props: {
    organization: { type: Object, required: true },
    children: {
      type: Array,
      default: null,
    },
    isChildren: {
      type: Boolean,
      default: false,
    },
    isLastChildren: {
      type: Boolean,
      default: false,
    },
    parentName: {
      type: String,
      default: null,
    },
    selectedUsers: {
      type: Array as PropType<String[]>,
      required: true,
    },
    isAllUserChecked: {
      type: Boolean,
      required: true,
    },
    filterBy: {
      type: String as PropType<Types.AccountFilterMethod>,
      required: true,
    },
    emailDomains: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  data() {
    return {
      lastChildrenElement: null,
      isOpened: true,
      members: [] as ApiResponse.UsersInformation[],
      childrenMemberTotal: 0,
      relationLineHeight: false as { height: string } | boolean,
    };
  },
  computed: {
    hasChildren(): boolean {
      return this.children && this.children.length;
    },
    numberOfSentMembers(): number {
      return this.members.filter(
        (member: any) => member.is_active || member.is_sent
      ).length;
    },
    subordinatedMembers(): number {
      return this.members.filter(
        (m: ApiResponse.UsersInformation) =>
          this.organization.uuid === m.organization_uuid
      );
    },
    numberOfNonActiveMembers(): number {
      return this.members.filter(
        (member: any) => !member.is_active && !member.is_sent
      ).length;
    },
    attributeColor(): {} {
      switch (this.organization.type) {
        case 'department':
          return { blue: true };
        case 'branches':
          return { purple: true };
        case 'shop':
          return { green: true };
        case 'management':
          return { lightblue: true };
        default:
          return { gray: true };
      }
    },
  },
  async created() {
    const { data } = await fetchOrganizationUsers(this.organization.uuid);
    this.$emit('account-fetched', this.organization.uuid);
    this.members = data.users.filter(
      (u: ApiResponse.UsersInformation) =>
        u.organization_uuid === this.organization.uuid
    );
    this.$emit('fetch-member', this.members);
    // 描写されるのを待つ
    setTimeout(() => {
      if (this.isLastChildren) {
        this.$emit('line-height-adjust', this.$refs.relationEnd);
        setTimeout(
          () => this.$emit('line-height-adjust', this.$refs.relationEnd),
          300
        );
      }
    }, 600);
  },
  methods: {
    fetchMember(members: ApiResponse.UsersInformation[]) {
      this.$emit('fetch-member', members);
    },
    isMemberChecked(member: ApiResponse.UsersInformation) {
      return this.selectedUsers.includes(member.user_uuid);
    },
    lineHeightAdjust(e: Element = null) {
      this.lastChildrenElement = this.lastChildrenElement ?? e;
      if (this.lastChildrenElement == null) {
        return;
      }
      const children = this.lastChildrenElement.getBoundingClientRect();
      const cy = window.pageYOffset + children.top;
      const parent = this.$refs.relationStart.getBoundingClientRect();
      const py = window.pageYOffset + parent.top;
      this.relationLineHeight = { height: `${cy - py - 12}px` };
    },
    declareMemberCount() {
      if (!this.isLastChildren) {
        this.$emit(
          'declare-member-count',
          // @ts-ignore
          this.isOpened ? this.members.length : -this.members.length
        );
      }
    },
    memberCount(c: number) {
      this.childrenMemberTotal += c;
    },
    fadeToggle() {
      this.isOpened = !this.isOpened;
      this.declareMemberCount();
      setTimeout(() => {
        if (this.hasChildren) {
          this.lineHeightAdjust();
          return;
        }

        this.$emit('line-height-adjust');
      }, 300);
    },
    shouldShowMember(member: ApiResponse.UsersInformation) {
      switch (this.filterBy) {
        case 'all': // 全て
          return true;
        case 'active': // 本登録完了
          return member.is_active && member.suspended_at === null;
        case 'unactive': // 未発行
          return (
            !member.is_sent && member.suspended_at === null && !member.is_active
          );
        case 'sent': // 発行済み
          return member.is_sent;
        case 'suspended': // 停止中
          return member.suspended_at !== null;
        default:
          return true;
      }
    },
    checkedMember(uuid: string) {
      this.$emit('checked-member', uuid);
    },
    uncheckedMember(uuid: string) {
      this.$emit('unchecked-member', uuid);
    },
    typeToJapanese(type: string) {
      switch (type) {
        case 'department':
          return '部署';
        case 'shop':
          return '店舗';
        case 'branch':
          return '支店';
        case 'management':
          return '経営陣';
        default:
          return '未属性';
      }
    },
    changeStatus({
      uuid,
      isActivate,
      isSent,
    }: {
      uuid: string;
      isActivate: boolean;
      isSent: boolean;
    }) {
      this.members = this.members.map((m: ApiResponse.UsersInformation) => {
        if (m.user_uuid === uuid) {
          return {
            ...m,
            is_active: isActivate,
            is_sent: isSent,
          };
        }
        return m;
      });
    },
  },
});
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  margin-top: 10px;
}

.issue {
  margin-left: 5px;
}

.member-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;

  .inner {
    display: flex;

    .chip {
      display: flex;
      align-items: center;
      background-color: $true_white;
      border-radius: 8px;

      .label {
        font-size: 13px;
        font-weight: 600;
        border-radius: 4px;
        padding: 3px 8px;
        color: $true_white;
      }

      .upper-organization {
        color: $gray_blue_4;
        margin-left: 8px;
        font-size: 11px;
      }

      .organization {
        font-size: 15px;
        font-weight: 600;
        margin-left: 8px;
        color: $dark_blue;
      }
    }

    .counter {
      display: flex;
      align-items: center;

      div {
        margin-left: 8px;
        font-size: 13px;
        color: $dark_blue;
      }
    }
  }

  .fade-button-box {
    font-size: 11px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666;
    background-color: $true_white;
    border-radius: 2px;
    padding: 0 4px;
    cursor: pointer;

    img {
      margin-right: 4px;
    }

    .button {
      display: flex;
      align-items: center;
    }
  }
}

.member-box {
  margin-top: 15px;
}

$gray: #c3c3c3;

.gray {
  background-color: $gray;
}

.green {
  background-color: $light_blue_green;
}

.blue {
  background-color: $blue;
}

.lightblue {
  background-color: $wild_blue_yonder;
}

.purple {
  background-color: $purple_2;
}

.fade-enter-active {
  animation-duration: 0.2s;
  animation-fill-mode: both;
  animation-name: fade--anime__opend;
}

.fade-leave-active {
  animation-duration: 0.2s;
  animation-fill-mode: both;
  animation-name: fade--anime__closed;
}

@keyframes fade--anime__opend {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fade--anime__closed {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.close {
  transform: rotateZ(180deg);
}

.member-list-header.children {
  margin-top: 15px;
  padding-left: 40px;
}

.parent-label {
  position: relative;
}

.member-list-header:not(.alone) {
  .parent-label {
    &::before {
      position: absolute;
      content: '';
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      margin: auto;
      height: 8px;
      width: 8px;
      border: solid 1px $true_white;
      border-radius: 50px;
      z-index: 1;
    }

    & > .line {
      position: absolute;
      content: '';
      top: 26px;
      left: 50%;
      transform: translateX(-50%);
      margin: auto;
      width: 1px;
      z-index: 0;
    }

    &.blue::before {
      background-color: $blue;
    }

    &.blue > .line {
      border-left: solid 1px $blue;
    }

    &.green::before {
      background-color: $light_blue_green;
    }

    &.green > .line {
      border-left: solid 1px $light_blue_green;
    }

    &.purple::before {
      background-color: $purple_2;
    }

    &.purple > .line {
      border-left: solid 1px $purple_2;
    }

    &.gray::before {
      background-color: $gray;
    }

    &.gray > .line {
      border-left: solid 1px $gray;
    }
  }
}

.child-label {
  position: relative;

  &::before {
    position: absolute;
    content: '';
    left: -4px;
    top: 50%;
    transform: translateY(-50%);
    margin: auto;
    height: 8px;
    width: 8px;
    border: solid 1px $true_white;
    border-radius: 50px;
    z-index: 1;
  }

  &.blue::before {
    background-color: $blue_2;
  }

  &.green::before {
    background-color: $light_blue_green;
  }

  &.purple::before {
    background-color: $purple_2;
  }

  &.gray::before {
    background-color: $gray;
  }
}

.relation-horizontal-line {
  &::after {
    position: absolute;
    content: '';
    left: -19px;
    top: 50%;
    transform: translateY(-50%);
    margin: auto;
    width: 20px;
    height: 1px;
    z-index: 0;
  }

  &.blue::after {
    border-top: solid 1px $blue_2;
  }

  &.green::after {
    border-top: solid 1px $light_blue_green;
  }

  &.purple::after {
    border-top: solid 1px $purple_2;
  }

  &.gray::after {
    border-top: solid 1px $gray;
  }
}
</style>
