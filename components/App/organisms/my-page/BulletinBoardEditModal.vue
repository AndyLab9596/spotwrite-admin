<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <div class="icon-cross__wrapper" @click="onClose">
            <img src="/app/icon/cross.svg" class="icon-cross" />
          </div>
        </div>
        <div class="modal-content">
          <p class="bulletin-board-title">在席状況の更新</p>
          <normal-select-box
            v-model="enrollmentBulletinBoardText"
            name="select-box"
            large-font
            :items="filterEnrollmentStatus"
            :display-pull-down="true"
            placeholder="選択してください"
            class="select-box"
          />
          <outlined-text-field
            v-model="enrollmentBulletinBoardDescription"
            class="form-input"
            :class="{ not_error: isValidEnrollmentStatus }"
            placeholder="詳しい状況（外出先、帰社時間などをご記入ください）"
            type="text"
            rules="max:20"
          />
          <p v-if="!isValidEnrollmentStatus" class="bulletin-board-error">
            ※20文字以内で入力してください。
          </p>
        </div>
        <div class="modal-footer">
          <base-button
            size="large"
            class="submit-button"
            inverse
            :disabled="!isValidEnrollmentStatus"
            @click="onClick"
          >
            在席状況を更新
          </base-button>
          <p class="cancel-button" @click="onClose">キャンセル</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseButton from '@/components/App/atoms/buttons/BaseButton.vue';
import NormalSelectBox from '@/components/App/atoms/selectBox/NormalSelectBox.vue';
import OutlinedTextField from '@/components/App/atoms/textFields/OutlinedTextField.vue';

export default Vue.extend({
  components: {
    BaseButton,
    NormalSelectBox,
    OutlinedTextField,
  },
  props: {
    enrollmentStatus: {
      type: Object as PropType<AppApiResponse.EnrollmentStatus>,
      default: 'OK',
    },
    enrollmentText: {
      type: String,
      required: true,
    },
    enrollmentDescription: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      enrollmentBulletinBoardText: '' as string,
      enrollmentBulletinBoardDescription: '' as string,
    };
  },
  computed: {
    filterEnrollmentStatus(): AppApiResponse.Color[] {
      const enrollmentStatus = Object.entries(
        this.enrollmentStatus
      ).map((item: any) => item.pop());
      return enrollmentStatus.filter(
        (item: AppApiResponse.Color) => item.name !== ''
      );
    },
    isValidEnrollmentStatus(): boolean {
      if (
        this.enrollmentBulletinBoardDescription &&
        this.enrollmentBulletinBoardDescription.length > 20
      ) {
        return false;
      }
      return true;
    },
  },
  created() {
    this.enrollmentBulletinBoardText = this.enrollmentText;
    this.enrollmentBulletinBoardDescription = this.enrollmentDescription;
  },
  methods: {
    onClick() {
      const enrollmentStatus = this.getEnrollmentStatus();
      if (enrollmentStatus) {
        const request = {
          color_code: enrollmentStatus.color_code,
          text: enrollmentStatus.name,
          description: this.enrollmentBulletinBoardDescription,
        } as AppApiRequest.EnrollmentStatus;
        this.$emit('click', request);
      }
    },
    getEnrollmentStatus(): AppApiResponse.Color {
      const filterEnrollmentStatus = Object.entries(
        this.enrollmentStatus
      ).map((item: any) => item.pop());
      const enrollmentStatus = filterEnrollmentStatus.find(
        (item: AppApiResponse.Color) =>
          item.name === this.enrollmentBulletinBoardText
      );
      return enrollmentStatus;
    },
    onClose() {
      this.$emit('close');
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
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 460px;
  background: $true-white;
  border-radius: 6px;
  padding: 20px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.icon-cross__wrapper {
  display: inline-block;

  .icon-cross {
    cursor: pointer;
    width: 12px;
    height: 12px;
  }
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
}

// オーバーレイのトランジション
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  // オーバーレイに包含されているモーダルウィンドウのトランジション
  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

// ディレイを付けるとモーダルウィンドウが消えた後にオーバーレイが消える
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

.select {
  flex: 1;
  width: 230px;
  height: 40px;
}

.modal-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px 10px;
}

.submit-button {
  width: 100%;
  margin: 0 0 18px 0;
}

.cancel-button {
  font-size: 13px;
  color: $gray_blue_1;
  cursor: pointer;
}

.bulletin-board-title {
  font-size: 15px;
  color: $main_color;
  font-weight: 600;
  line-height: 1em;
  margin: 0 0 24px 0;
}

.select-box {
  width: 100%;
  margin: 0 0 8px 0;
}

.form-input {
  width: 100%;
}

.form-input /deep/ .outline-label {
  padding: 0;
}

.form-input /deep/ .outline-input {
  color: $gentle_bluish_purple;
  margin: 0;
}

.bulletin-board-error {
  color: #f09c9c;
  width: 100%;
  margin: 0 0 20px 0;
}

.not_error {
  margin: 0 0 40px 0;
}
</style>
