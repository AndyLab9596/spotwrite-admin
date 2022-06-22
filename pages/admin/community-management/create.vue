<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="コミュニティ一覧・編集">
        <template #description>
          誰でもコミュニティを登録することができます。
        </template>
      </page-header>
      <div class="contents">
        <div class="new-announce">
          <div>
            <p class="sentence">
              最初に、下記ボタンをクリックしてコミュニティを作成してください。<br />
              作成したコミュニティはコミュニティ一覧に表示され、メンバーや詳細情報を<br />
              登録ができます。
            </p>
            <div class="button-box">
              <button class="button" @click="goToCreateCommunityPage">
                <svg
                  id="Icon_plus_pink"
                  data-name="Icon/plus_pink"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <circle
                    id="Ellipse_216"
                    data-name="Ellipse 216"
                    cx="8"
                    cy="8"
                    r="8"
                    fill="#f09c9c"
                  />
                  <g
                    id="Group_1350"
                    data-name="Group 1350"
                    transform="translate(5 5)"
                  >
                    <line
                      id="Line_373"
                      data-name="Line 373"
                      y2="6"
                      transform="translate(3)"
                      fill="#fff"
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-miterlimit="10"
                      stroke-width="1"
                    />
                    <line
                      id="Line_374"
                      data-name="Line 374"
                      x2="6"
                      transform="translate(0 3)"
                      fill="#fff"
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-miterlimit="10"
                      stroke-width="1"
                    />
                  </g>
                </svg>
                <span> コミュニティを新規で登録する</span>
              </button>
            </div>
          </div>
        </div>
        <CommunityCreateModal
          v-if="openCreateModal"
          :loading="createLoading"
          @close="openCreateModal = false"
          @submit="submit"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import { createCommunity } from '@/libs/api';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    PageHeader,
  },
  data() {
    return {
      createLoading: false,
    };
  },
  methods: {
    async submit(newCommunity: ApiRequest.NewCommunity) {
      try {
        this.createLoading = true;
        await createCommunity(newCommunity);
        this.$router.push({
          path: '/admin/community-management',
          query: { page: '1', orders: ['-created_at'] },
        });
      } catch (e) {
        console.error(e);
      } finally {
        this.createLoading = false;
      }
    },
    goToCreateCommunityPage() {
      this.$router.push({
        path: '/admin/community-management/registration',
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.contents {
  position: relative;
  height: 100%;
  min-height: 900px;
  background-color: $true_white;
  margin-top: 14px;
  padding: 14px 30px;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;

  .new-announce {
    margin: auto;
    width: 600px;
    height: 800px;

    & > div {
      margin-top: 200px;
    }
  }
}

.button-box {
  display: flex;
  justify-content: center;
  margin-top: 42px;

  svg {
    position: absolute;
    top: 14px;
    left: 10px;
  }

  button {
    position: relative;
    padding: 0 15px 0 28px;
    border: none;
    border-radius: 4px;
    background-color: $gray_blue_3;
    line-height: 30px;
    width: 300px;
    height: 44px;

    span {
      font-size: 13px;
      font-weight: 600;
      color: $true_white;
    }
  }
}

.sentence {
  font-weight: $dark_blue;
  font-size: 15px;
}
</style>
