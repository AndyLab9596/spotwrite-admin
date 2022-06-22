<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClick">
      <div class="modal-window">
        <div class="modal-header">
          <base-button size="large" @click="onClick"
            >プレビューを閉じる<svg
              class="icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16.707"
              height="16.707"
              viewBox="0 0 16.707 16.707"
            >
              <g
                id="Icon_close_w_large"
                data-name="Icon/close_w_large"
                transform="translate(0.354 0.354)"
              >
                <line
                  id="Line_879"
                  data-name="Line 879"
                  x2="16"
                  y2="16"
                  fill="none"
                  stroke="#fff"
                  stroke-width="1"
                />
                <line
                  id="Line_880"
                  data-name="Line 880"
                  x2="16"
                  y2="16"
                  transform="translate(16) rotate(90)"
                  fill="none"
                  stroke="#fff"
                  stroke-width="1"
                />
              </g>
            </svg>
          </base-button>
        </div>
        <div class="modal-content">
          <img src="/image/img_iphone-outline.png" class="image-outline" />
          <div class="modal-body">
            <img
              class="app-top"
              src="/image/app_preview-community_top_detail.png"
            />
            <div class="app-title">{{ community.name }}</div>
            <div class="app-container">
              <div class="community-container">
                <div class="community-name-bar">
                  <div v-if="community.is_official" class="official-label">
                    公式
                  </div>
                  <div class="community-name">
                    {{ community.name }}
                  </div>
                  <icon
                    style="width: 12px;"
                    :name="'favorite'"
                    class="favorite"
                  />
                </div>

                <div class="community">
                  <div class="contents">
                    <div class="item summary">
                      <img
                        v-if="community.main_image"
                        class="image"
                        :src="community.main_image.url"
                        onerror="this.remove()"
                        alt="main image"
                      />
                      <div class="description">{{ community.description }}</div>
                    </div>
                    <div class="item profile">
                      <div class="element">
                        <div class="label-with-icon">
                          <div class="icon-wrapper">
                            <icon name="person" style="width: 10px;" />
                          </div>
                          <div class="label">
                            {{ community.user_organization }}
                          </div>
                        </div>
                        <div class="data">{{ community.user.name }}</div>
                      </div>
                      <div class="separator"></div>
                      <div class="element">
                        <div class="label-with-icon">
                          <div class="icon-wrapper">
                            <icon name="buildings" style="width: 18px;" />
                          </div>
                          <div class="label">
                            設立
                          </div>
                        </div>
                        <div class="data">{{ establishDate }}</div>
                      </div>
                    </div>
                    <div class="item members">
                      <div class="element">
                        <div class="label-with-icon">
                          <div class="icon-wrapper">
                            <icon name="buildings" style="width: 18px;" />
                          </div>
                          <div class="label">
                            メンバー数
                          </div>
                        </div>
                        <div class="data">
                          {{ userCount.all }}名<span class="member-details"
                            >（男{{ userCount.man }}名 &nbsp; 女{{
                              userCount.woman
                            }}名 &nbsp; 未回答{{ userCount.free }}名）</span
                          >
                        </div>
                        <div>
                          <div
                            v-for="(members, index) in chunkedMembers"
                            :key="`members-${index}`"
                            class="users"
                          >
                            <div
                              v-for="member in members"
                              :key="member.uuid"
                              class="user"
                            >
                              <img
                                class="icon"
                                :src="getImageUrl(member.icon)"
                                onerror="this.src='/image/no-image.png'"
                                alt="user icon"
                              />
                              <div class="name">{{ member.name }}</div>
                            </div>
                          </div>
                          <div
                            v-if="!isShowAllMembers"
                            class="button"
                            role="button"
                            @click="isShowAllMembers = true"
                          >
                            もっと見る
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="community-post">{{ community.name }}の投稿</div>

                <post-cards class="posts" :items="posts" />
              </div>
            </div>
            <img
              class="app-bottom"
              src="/image/app_preview-community_bottom.png"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import { chunk } from 'lodash';
import { fetchCommunityPosts } from '@/libs/api';
import BaseButton from '~/components/Admin/Modules/Button/BaseButton.vue';
import Icon from '~/components/Admin/Pages/CommunityManagement/AppPreview/Icon.vue';
import PostCards from '~/components/Admin/Pages/CommunityManagement/AppPreview/PostCards.vue';

export default Vue.extend({
  components: {
    BaseButton,
    Icon,
    PostCards,
  },
  props: {
    community: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      type: 'general' as string,
      memberLists: {} as object,
      userCount: {} as object,
      showMessage: false as boolean,
      isShowAllMembers: false as boolean,
      posts: [] as object[],
    };
  },
  computed: {
    establishDate(): string {
      return dayjs.unix(this.community.establish_date).format(`YYYY年`);
    },
    chunkedMembers(): unknown[][] {
      const chunked = chunk(this.memberLists, 10);
      return this.isShowAllMembers ? chunked : chunked.slice(0, 1);
    },
  },
  async created() {
    const { data } = await fetchCommunityPosts(this.community.uuid);
    this.posts = data.posts;
    this.memberLists = Object.values(this.community.companies).reduce(
      (accumulator: array, company: any) => {
        return accumulator.concat(company.users);
      },
      []
    );
    const man = this.memberLists.filter((user: any) => user.gender === 'man')
      .length;
    const woman = this.memberLists.filter(
      (user: any) => user.gender === 'woman'
    ).length;
    const free = this.memberLists.filter((user: any) => user.gender === 'free')
      .length;
    this.userCount = {
      all: this.memberLists.length,
      man,
      woman,
      free,
    };
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
    formatedDate(time: number) {
      return dayjs(time).format('YYYY/MM/DD');
    },
    formatedYear(time: number) {
      return dayjs(time).format('YYYY年');
    },
    getImageUrl(url: string) {
      if (url && url.length) {
        return url;
      }
      return '/image/no-image.png';
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
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(126, 129, 149, 0.8);
}

.modal-window {
  background-color: transparent;
}

.modal-header {
  display: flex;
  justify-content: flex-end;

  .icon {
    margin-left: 10px;
    position: relative;
    top: 4px;
  }
}

.modal-content {
  position: relative;
  margin-top: 25px;
}

.modal-body {
  position: absolute;
  top: calc(3.5%);
  right: calc(6.9%);
  bottom: calc(3.8%);
  left: calc(7.8%);
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .app-top,
  .app-bottom {
    width: 100%;

    &.app-top {
      transform: translateY(-6px);
      border-bottom: solid 1px #eff0f7;
    }

    &.app-bottom {
      border-top: solid 1px #eff0f7;
    }
  }

  .app-title {
    position: relative;
    width: fit-content;
    line-height: 38px;
    margin: calc(-38px - 6px) auto 0;
    font-weight: bold;
  }

  .app-container {
    position: relative;
    flex-grow: 1;
    background: #fff;
    font-size: 11px;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .community-container {
      padding: 12px;
      overflow: auto;
    }
  }
}

.image-outline {
  width: 390px;
  height: auto;
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

.community-container .community-name-bar {
  width: 100%;
  display: flex;
  align-items: center;

  .community-name {
    color: $main_color;
    font-size: 18px;
    font-weight: 600;
    flex-grow: 1;
    margin-left: 8px;
  }
}

.community-container .community {
  margin-top: 10px;
}

.community-container .official-label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 17px;
  border-radius: 4px;
  color: $true_white;
  background-color: #89d3ca;
  font-size: 10px;
  font-weight: 600;
}

.community-container .thumbnail {
  border-radius: 4px;
}

.community-container .image {
  width: 100%;
  margin-bottom: 12px;
}

.community-container .summary {
  display: flex;
  flex-direction: column;
}

.community-container .description {
  font-size: 15px;
  line-height: 1.4;
}

.community-container .element {
  padding: 16px 0;
}

.community-container .profile {
  margin-top: 15px;
  display: flex;
  border-top: dotted 1px $icon_gray;
  border-bottom: dotted 1px $icon_gray;

  .element {
    width: 360px;
  }
}

.community-container .members {
  .element {
    width: 100%;
  }
}

.community-container .separator + .element {
  padding-left: 16px;
}

.community-container .data {
  margin-left: 34px;
  color: $main_color;
  font-size: 15px;
}

.community-container .label {
  font-size: 15px;
  margin-left: 6px;
  font-weight: 600;
  line-height: 28px;
}

.community-container .separator {
  border-left: dotted 1px $icon_gray;
  margin: 16px 0;
}

.community-container .icon-wrapper {
  width: 28px;
  height: 28px;
  background: $gradient_2;
  border-radius: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.community-container .label-with-icon {
  display: flex;
}

.community-container .users {
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;

  .user {
    display: flex;
    flex-direction: column;
    width: calc((100% - 32px) / 5);
    margin-bottom: 8px;

    &:not(:nth-of-type(5n)) {
      margin-right: 8px;
    }

    .icon {
      border-radius: 17px;
      width: 44px;
      height: 44px;
      align-self: center;
      object-fit: cover;
    }

    .name {
      margin-top: 10px;
      font-size: 11px;
      font-weight: 600;
      align-self: center;
    }
  }
}

.community-container .button {
  width: 100%;
  margin-top: 8px;
  background-color: $button_background_color;
  color: $gentle_bluish_purple;
  font-size: 13px;
  font-weight: 600;
  border-radius: 4px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
}

.community-container .community-post {
  width: 100%;
  background-color: $white_1;
  height: 50px;
  line-height: 50px;
  padding: 0 15px;
  font-size: 14px;
  color: $gentle_bluish_purple;
  border-top: solid 1px $ruled_line;
  border-bottom: solid 1px $ruled_line;
}

.community-container .posts {
  margin-top: 60px;
}
</style>
