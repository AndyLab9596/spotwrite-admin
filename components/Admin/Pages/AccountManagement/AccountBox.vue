<template>
  <div class="account-box">
    <div class="inner">
      <div class="field check">
        <base-checkbox
          :value="member.user_uuid"
          :disabled="disabledCheckbox"
          :selected-values="shouldCheck ? [member.user_uuid] : []"
          @change="onChange"
        />
      </div>
      <div class="field no">
        {{ member.number }}
      </div>
      <div class="field account">
        <select
          v-if="!member.suspended_at && !member.is_active"
          v-model="accountStatus"
          :disabled="disabledSelect"
          @change="onChangeSelect()"
        >
          <option value="0">未発行</option
          ><option value="1">発行する</option>
          <option v-if="sent" value="2" :selected="sent">発行済み</option>
        </select>
        <select v-else @change="onChangeAccountStop()">
          <option value="1" disabled :selected="member.is_active"
            >本登録完了</option
          ><option value="2" :selected="member.suspended_at">停止中</option>
        </select>
      </div>
      <div class="field name">
        <router-link
          :to="`/admin/employee-management/employees/${member.user_uuid}`"
          class="name"
        >
          {{ member.user_name }}
        </router-link>
      </div>
      <div class="field email input-box">
        <input
          ref="emailInput"
          v-model="member.email"
          class="input__text"
          :class="{
            'email-required': !member.email.length || invalidEmail,
            duplicated: duplicatedEmail,
          }"
          type="text"
          @blur="updateEmail(member.email)"
        />
        <template v-if="isShowDomainAutocomplete">
          <ul class="autocomplete">
            <li
              v-for="domain in emailDomains"
              :key="domain"
              class="domain"
              @click="member.email = member.email + domain"
              @mouseenter="focusEmailInput"
            >
              {{ domain }}
            </li>
          </ul>
        </template>

        <div class="email-error-wrapper">
          <div v-if="member.email !== '' && !isEmail" class="email-error">
            使用できない文字が使われています。
          </div>
        </div>
      </div>
    </div>
    <check-update
      v-if="checkSendEmailModal"
      update-button-text="メールを送信"
      @click="updateAccount"
      @close="toggleCheckSendEmailModal"
      >選択したメンバーにspotwriteへの招待メールを送りますか？</check-update
    >
    <success-message
      v-if="successSendEmailModal"
      @close="toggleSuccessSendEmailModal"
      >メール送信が完了しました</success-message
    >
    <alert-message
      v-if="alertSendEmailModal"
      button-text="元の画面に戻る"
      @close="toggleAlertSendEmailModal"
      >メールアドレスが未入力のメンバーが選択されていました。<br />
      必要事項を入力後、再度メール送信を行ってください。</alert-message
    >
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import {
  sendInvitationMail,
  updateUserEmail,
  suspendedUser,
  checkExistsUserEmail,
} from '@/libs/api';
import {
  CheckUpdate,
  SuccessMessage,
  AlertMessage,
} from '@/components/Admin/Modules/Modal';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';
import dayjs from '@/libs/dayjs';

export default Vue.extend({
  components: {
    CheckUpdate,
    SuccessMessage,
    AlertMessage,
    BaseCheckbox,
  },
  props: {
    member: {
      type: Object,
      required: true,
    },
    isChecked: {
      type: Boolean,
      required: true,
    },
    isAllUserChecked: {
      type: Boolean,
      required: true,
    },
    emailDomains: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  data() {
    return {
      areaDisabled: false as boolean,
      sent: this.member.is_sent as boolean,
      accountStatus: this.member.is_sent ? 2 : 0,
      oldEmail: this.member.email,
      registeredEmail: this.member.email,
      emailChanged: false,
      checkSendEmailModal: false as boolean,
      successSendEmailModal: false as boolean,
      alertSendEmailModal: false as boolean,
      checked: [],
      duplicatedEmail: false,
    };
  },
  computed: {
    isShowDomainAutocomplete(): boolean {
      return !!this.member.email.length && !this.member.email.includes('@');
    },
    shouldCheck(): boolean {
      if (this.member.is_active || this.sent || this.areaDisabled) {
        return false;
      }
      return this.isChecked || this.isAllUserChecked;
    },
    disabledCheckbox(): boolean {
      return (
        this.member.is_active ||
        this.sent ||
        this.areaDisabled ||
        !this.isValidEmail
      );
    },
    disabledSelect(): boolean {
      return this.sent || this.areaDisabled || !this.isValidEmail;
    },
    isValidEmail(): boolean {
      return this.member.email !== '' && this.isEmail;
    },
    isEmail(): boolean {
      // FIXME: メールアドレスに使用できない文字の定義がわからなかったので一旦仕様書に合わせてアスタリスクだけ検知する
      return !/\*/.test(this.member.email);
    },
    invalidEmail(): boolean {
      // FIXME: メールアドレスに使用できない文字が分かり次第修正する必要あり
      // @see https://www.javadrive.jp/regex-basic/sample/index13.html
      const regex = /^[a-zA-Z0-9_+-]+(\.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
      return !regex.test(this.member.email);
    },
  },
  watch: {
    isAllUserChecked() {
      // プロパティでチェックが変わるとイベントが発火しないためここで強制発火している（uuid を渡すため発火は必要）
      if (
        !(this.member.is_active || this.sent || this.areaDisabled) &&
        this.isChecked !== this.isAllUserChecked
      ) {
        this.checkMember(this.isAllUserChecked);
      }
    },
  },
  methods: {
    focusEmailInput() {
      const input = (this.$refs.emailInput as any) as { focus: () => void };
      input.focus();
    },
    async updateEmail(email: string) {
      if (this.member.email === this.oldEmail) return;
      try {
        const { data: validated } = await checkExistsUserEmail(email);
        try {
          if (validated.email !== null) {
            throw new Error('error');
          }
          this.duplicatedEmail = false;
          if (!this.invalidEmail) {
            try {
              await updateUserEmail(this.member.user_uuid, {
                email: this.member.email,
              });
              this.oldEmail = this.member.email;
            } catch (e) {
              console.error(e);
            }
          }
        } catch (e) {
          this.duplicatedEmail = true;
        }
      } catch (e) {
        console.error(e);
      }
    },
    onChange(arr: string[]) {
      this.checkMember(!!arr.length);
    },
    checkMember(checked: Boolean) {
      if (checked) {
        this.$emit('checked-member', this.member.user_uuid);
      } else {
        this.$emit('unchecked-member', this.member.user_uuid);
      }
    },
    onChangeSelect() {
      this.toggleCheckSendEmailModal();
    },
    async updateAccount() {
      this.checkSendEmailModal = false;
      if (!this.member.email) {
        this.toggleAlertSendEmailModal();
        this.accountStatus = 0;
        return;
      }
      this.areaDisabled = true;
      this.accountStatus = 2;
      this.sent = true;
      try {
        // 本登録完了していないユーザーのメールアドレス変更
        if (this.registeredEmail !== this.member.email) {
          const { data: validated } = await checkExistsUserEmail(
            this.member.email
          );
          if (validated.email === null) {
            await updateUserEmail(this.member.user_uuid, {
              email: this.member.email,
            });
          }
        }
        this.registeredEmail = this.member.email;
        await sendInvitationMail([this.member.user_uuid]);
        this.$emit('change-status', {
          uuid: this.member.user_uuid,
          isActive: false,
          isSent: true,
        });
        this.toggleSuccessSendEmailModal();
      } catch (e) {
        this.sent = false;
        this.accountStatus = 0;
        this.$emit('change-status', {
          uuid: this.member.user_uuid,
          isActive: false,
          isSent: false,
        });
        if (e.response.data.message === 'exceeded max members') {
          alert(
            'アカウント発行に失敗しました。契約プランの最大アカウント数を超過しています。'
          );
        } else {
          alert('アカウント発行に失敗しました');
        }
      } finally {
        this.areaDisabled = false;
      }
    },
    onFocusInput() {
      this.oldEmail = this.member.email;
    },
    onBlurInput() {
      // 編集前のメールアドレスから変更されていた場合はラベルを「未発行に戻す」
      if (this.oldEmail !== this.member.email) {
        this.accountStatus = 0;
        this.sent = false;
        this.emailChanged = true;
        this.$emit('change-status', {
          uuid: this.member.user_uuid,
          isActive: false,
          isSent: false,
        });
      }
      // 編集前のメールアドレスから変更されている値が登録されているメールアドレスの場合「発行済み」のまま
      if (
        !this.sent &&
        this.emailChanged &&
        this.registeredEmail &&
        this.registeredEmail === this.member.email
      ) {
        this.accountStatus = 2;
        this.sent = true;
        this.$emit('change-status', {
          uuid: this.member.user_uuid,
          isActive: false,
          isSent: true,
        });
      }
    },
    async onChangeAccountStop() {
      await suspendedUser(this.member.user_uuid, dayjs().unix());
    },
    toggleCheckSendEmailModal() {
      if (this.checkSendEmailModal) {
        this.accountStatus = 0;
      }
      this.checkSendEmailModal = !this.checkSendEmailModal;
    },
    toggleSuccessSendEmailModal() {
      this.successSendEmailModal = !this.successSendEmailModal;
    },
    toggleAlertSendEmailModal() {
      this.alertSendEmailModal = !this.alertSendEmailModal;
    },
  },
});
</script>

<style lang="scss" scoped>
td {
  padding: 5px;
  background-color: $true_white;
  font-size: 15px;
  vertical-align: middle;
  height: 38px;
  text-align: center;
}

.check {
  width: 30px;
}

.no {
  width: 60px;
}

.account {
  width: 120px;
  padding: 0 4px;

  select {
    width: 100%;
    height: 30px;
    border-radius: 4px;
    color: $gray_blue_4;
    border: solid 1px $light_gray_blue_3;
    background-color: $extra_light_gray;
  }
}

.name {
  width: 280px;
  padding: 0 4px;

  input {
    width: 100%;
    height: 30px;
    border-radius: 4px;
    color: $gray_blue_4;
    border: solid 1px $light_gray_blue_3;
    background-color: $extra_light_gray;
  }
}

.email {
  flex-grow: 1;
  padding: 0 4px;
  text-align: left;

  input {
    width: 100%;
    height: 30px;
    border-radius: 4px;
    color: $gray_blue_4;
    border: solid 1px $light_gray_blue_3;
    background-color: $extra_light_gray;
    padding: 0 10px;

    &.email-required {
      background-color: $light_pink;
      border-color: $pink;
    }

    &.duplicated {
      color: $red;
    }
  }
}

.account-box {
  position: relative;
  height: 40px;

  .inner {
    display: flex;
    align-items: center;
    z-index: 2;
    height: 100%;
    width: 100%;
    background-color: $true_white;
    border: solid 1px $light_gray_blue_3;
    border-radius: 4px;
  }

  & + & {
    margin-top: 8px;
  }

  .field {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 10px);
  }

  .field + .field {
    border-left: solid 1px $light_gray_blue_3;
  }

  .name {
    display: -webkit-box;
    overflow: hidden;
    text-align: left;
    color: inherit;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 15px;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
}

.input-box {
  display: block;
  position: relative;
}

.email-error-wrapper {
  position: absolute;
  top: 35px;
  left: -6px;
  z-index: 1;
}

.email-error {
  position: relative;
  color: $true-white;
  font-size: 12px;
  font-weight: 600;
  background-color: $gray_blue_5;
  border-radius: 4px;
  padding: 5px 10px;
  white-space: nowrap;

  &::before {
    content: '';
    position: absolute;
    top: -25px;
    left: 29px;
    border-style: solid;
    border-color: transparent transparent $gray_blue_5;
    border-width: 13px;
  }
}

.autocomplete {
  position: absolute;
  top: 30px;
  left: 10px;
  z-index: 1;
  background-color: $true_white;
  padding: 10px 15px;
  border-radius: 4px;
  border: 1px solid $light_gray_blue_3;
  overflow-y: auto;
  max-height: 200px;

  .domain {
    text-align: left;
    padding: 3px 8px;
    cursor: pointer;

    &:hover {
      background-color: $light_gray_blue_5;
    }
  }
}
</style>
