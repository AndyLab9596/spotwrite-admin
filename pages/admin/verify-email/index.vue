<template>
  <div class="page-container">
    <div class="verify-email-content-container">
      <img class="verify-email-logo" src="/image/logo_white@2x.png" />
      <div class="verify-email-top-message">
        <p>メールアドレスの確認ができました</p>
      </div>
      <div class="verify-email-icon-container">
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
        <div class="verify-email-send-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="32"
            height="32"
            viewBox="0 0 32 32"
          >
            <defs>
              <clipPath id="a">
                <path
                  d="M109.646,422.97l-15.787,6.546,3.659,2.439,10.686-7.766L98.48,432.6l5.776,3.722,5.391-13.35Z"
                  transform="translate(-93.859 -422.97)"
                  fill="none"
                  clip-rule="evenodd"
                />
              </clipPath>
              <clipPath id="b">
                <rect
                  width="24"
                  height="21"
                  transform="translate(0.24 -0.027)"
                  fill="none"
                />
              </clipPath>
              <clipPath id="c">
                <rect
                  width="16"
                  height="13"
                  transform="translate(-0.394 -0.18)"
                  fill="none"
                />
              </clipPath>
              <clipPath id="d">
                <path
                  d="M97.4,439.222l2.817-2.294L97.4,435.051Z"
                  transform="translate(-97.403 -435.051)"
                  fill="none"
                  clip-rule="evenodd"
                />
              </clipPath>
            </defs>
            <g transform="translate(-631 -422)">
              <circle
                cx="16"
                cy="16"
                r="16"
                transform="translate(631 422)"
                fill="#f09c9c"
              />
              <g transform="translate(639 431)">
                <g clip-path="url(#a)">
                  <g
                    transform="translate(-3.719 -3.922)"
                    style="isolation: isolate;"
                  >
                    <g transform="translate(0 0)">
                      <g transform="translate(0)" clip-path="url(#b)">
                        <g transform="translate(3.634 4.153)">
                          <g transform="translate(0 0)" clip-path="url(#c)">
                            <rect
                              width="23.757"
                              height="21.319"
                              transform="translate(-3.899 -4.215)"
                              fill="#fff"
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
                <g transform="translate(2.824 9.627)">
                  <g clip-path="url(#d)">
                    <rect
                      width="10.786"
                      height="12.14"
                      transform="translate(-3.985 -3.985)"
                      fill="#fff"
                    />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
      <div class="verify-email-bottom-message">
        <p>メールアドレスの登録が完了しました。</p>
        <p>引き続き、契約プランや会社情報などご登録にお進みください。</p>
        <p>登録頂いたメールアドレスでログインしていただくと、</p>
        <p>ご契約画面に進むことができます。</p>
      </div>
      <base-button
        class="verify-email-bottom-button"
        size="large"
        @click="$router.push('/admin/account-holder/login')"
      >
        ログインに進む
      </base-button>
    </div>
    <AlertMessage
      v-if="invalid"
      button-text="ログインページに戻る"
      @close="$router.push('/admin/login')"
    >
      メールアドレスの確認に失敗しました。
    </AlertMessage>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Context } from '@nuxt/types';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import { AlertMessage } from '@/components/Admin/Modules/Modal';
import { axios } from '@/plugins/axios';

export default Vue.extend({
  components: { AlertMessage, BaseButton },
  layout: 'clean',
  async asyncData({ query }: Context): Promise<{ invalid: boolean }> {
    if (!query?.url || Array.isArray(query.url)) {
      return { invalid: true };
    }
    try {
      await axios.get(query.url);
    } catch (error) {
      return { invalid: true };
    }
    return { invalid: false };
  },
  async mounted() {
    localStorage.removeItem('REGISTER_EMAIL');
  },
});
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: $gradient_pink_blue;
}

.verify-email-content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 557px;
  padding: 60px 0 30px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
}

.verify-email-logo {
  width: 113px;
  margin: 0 0 30px 0;
}

.verify-email-top-message {
  font-weight: normal;
  font-size: 24px;
  color: $true_white;
  margin-bottom: 40px;
}

.verify-email-icon-container {
  position: relative;
  margin-bottom: calc(24px + 16px);
}

.verify-email-send-icon {
  position: absolute;
  bottom: -16px;
  right: -10px;
}

.verify-email-bottom-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: normal;
  font-size: 13px;
  color: $true_white;
  margin-bottom: 40px;
}

.verify-email-bottom-button {
  width: 290px;
}
</style>
