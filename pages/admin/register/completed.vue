<template>
  <div class="page-container">
    <div class="box">
      <div class="header">
        <img class="logo" src="/image/logo_white@2x.png" />
      </div>
      <div class="thank-you">
        <div>ご登録ありがとうございます。</div>
        <div>決済が完了しました。</div>
      </div>
      <div class="icons">
        <!-- icon -->
        <div class="mail-icon">
          <div class="verify-email-mail-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="55.358"
              height="39.359"
              viewBox="0 0 55.358 39.359"
            >
              <g transform="translate(0.679 0.68)">
                <rect width="54" height="38" fill="#fff" opacity="0" />
                <path
                  d="M514.649,1135.576H464.626a1.993,1.993,0,0,1-1.988-2v-34a1.993,1.993,0,0,1,1.988-2h50.023a1.993,1.993,0,0,1,1.988,2v34A1.993,1.993,0,0,1,514.649,1135.576Z"
                  transform="translate(-462.637 -1097.576)"
                  fill="none"
                  stroke="#fff"
                  stroke-miterlimit="10"
                  stroke-width="1.359"
                />
                <path
                  d="M462.638,1097.576l26.734,23.465,26.73-23.465"
                  transform="translate(-462.102 -1097.041)"
                  fill="none"
                  stroke="#fff"
                  stroke-miterlimit="10"
                  stroke-width="1.359"
                />
                <line
                  x1="16.653"
                  y2="21.836"
                  transform="translate(0.5 15.664)"
                  fill="none"
                  stroke="#fff"
                  stroke-miterlimit="10"
                  stroke-width="1.638"
                />
                <line
                  x2="17.116"
                  y2="22.149"
                  transform="translate(36.558 15.664)"
                  fill="none"
                  stroke="#fff"
                  stroke-miterlimit="10"
                  stroke-width="1.638"
                />
              </g>
            </svg>
          </div>
        </div>
        <div class="send-icon">
          <img src="/icon/icon-send.svg" />
        </div>
      </div>
      <div class="guide">
        spotwriteを早速ご利用ください。
      </div>
      <div class="action">
        <BaseButton size="large" @click="onShowButtonClick">
          管理画面を表示
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import { fetchOwnerProfile } from '@/libs/api';

export default Vue.extend({
  layout: 'clean',
  components: {
    BaseButton,
  },
  async created() {
    // 契約が完了し owner とひもづくのでプロフィールを取り直す
    await this.fetchUserProfile();
  },
  methods: {
    async fetchUserProfile(): Promise<void> {
      const { data } = await fetchOwnerProfile();
      this.$accessor.setUserProfile(data);
    },
    onShowButtonClick(): void {
      this.$router.push('/admin/account-holder/login');
    },
  },
});
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: $gradient_pink_blue;
  color: $true_white;
}

.box {
  background-color: rgba(#fff, 0.3);
  box-shadow: 0 1px 3px #000;
  border-radius: 8px;
  padding: 20px 20px 30px 20px;
  min-width: 557px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header {
  padding: 60px 0 38px 0;
}

.thank-you {
  font-size: 24px;
  text-align: center;
}

.icons {
  margin: 30px 0;
  position: relative;

  .send-icon {
    position: absolute;
    right: -16px;
    bottom: -16px;
  }
}

.action {
  margin-top: 40px;

  .button {
    width: 290px;
  }
}
</style>
