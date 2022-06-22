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
          <img src="/image/img_iphone-outline.png" class="image" />
          <div class="modal-body">
            <img class="app-top" src="/image/app_preview-community_top.png" />
            <div class="app-container">
              <div class="tab-container">
                <div
                  :class="{ active: input.type === 'general' || !input.type }"
                >
                  一般コミュニティ
                </div>
                <div :class="{ active: input.type === 'business' }">
                  ビジネスコミュニティ
                </div>
              </div>
              <div class="community-container">
                <div class="community-card">
                  <div class="heading">
                    <div class="title">
                      <img
                        v-if="isOffices.includes('is_official')"
                        class="official"
                        src="/icon/app_preview-community_official_icon.png"
                      />
                      <span v-if="input.type === 'business'" class="type"
                        >ビジネス</span
                      >
                      <span v-else class="type">一般</span>
                      <span class="name">{{ input.name }}</span>
                      <img
                        class="flag"
                        src="/icon/app_preview-community_flag_icon.png"
                      />
                    </div>
                    <div class="body">
                      <div v-if="input.description" class="description">
                        {{ input.description }}
                      </div>
                      <div class="left">
                        <img
                          v-if="mainImage && !showMessage"
                          :src="mainImage.url"
                          @error="showMessage = true"
                        />
                        <div v-else-if="input.message">{{ input.message }}</div>
                      </div>
                      <div class="right">
                        <div class="line">
                          <div class="small">部長</div>
                          <div>{{ community.user.name }}</div>
                        </div>
                        <div class="line">
                          <div class="small">設立</div>
                          <div>
                            {{ formatedYear(community.user.establish) }}
                          </div>
                        </div>
                        <div class="line">
                          <div class="small">メンバー数</div>
                          <div>
                            {{ members.count }}名<br />
                            <div class="member-value">
                              （{{ members.value }}）
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="community.last_news" class="separator"></div>
                  </div>
                  <div v-if="community.last_news" class="news-container">
                    <img
                      class="news-icon"
                      src="/icon/app_preview-community_news_icon.png"
                    />
                    <div class="title">
                      <div class="date">
                        {{ formatedDate(community.last_news.created_at) }}
                      </div>
                      <div class="name">{{ community.last_news.title }}</div>
                    </div>
                    <img
                      class="right-icon"
                      src="/icon/app_preview-community_right_icon.png"
                    />
                  </div>
                </div>
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
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: { BaseButton },
  props: {
    input: {
      type: Object,
      required: true,
    },
    community: {
      type: Object,
      required: true,
    },
    isOffices: {
      type: Array,
      required: true,
    },
    mainImage: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      members: {} as object,
      showMessage: false as boolean,
    };
  },
  async created() {
    const genders = Object.values(this.community.companies).reduce(
      (accumulator: array, company: any) => {
        return accumulator.concat(
          company.users.map((user: any) => user.gender)
        );
      },
      []
    );
    const members = [];
    if (genders.includes('man')) {
      members.push(
        `男${genders.filter((gender: any) => gender === 'man').length}名`
      );
    }
    if (genders.includes('woman')) {
      members.push(
        `女${genders.filter((gender: any) => gender === 'woman').length}名`
      );
    }
    if (genders.includes('free')) {
      members.push(
        `その他${genders.filter((gender: any) => gender === 'free').length}名`
      );
    }
    this.members = {
      count: genders.length,
      value: members.join('/'),
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
  pointer-events: none;

  .app-top,
  .app-bottom {
    width: 100%;

    &.app-top {
      transform: translateY(-6px);
    }
  }

  .app-container {
    flex-grow: 1;
    background: #eff0f7;
    font-size: 11px;

    .tab-container {
      display: flex;
      background: #fff;

      div {
        width: 50%;
        flex-shrink: 0;
        text-align: center;
        padding: 12px 0;

        &.active {
          position: relative;
          color: #f09b9c;
          font-weight: 600;

          &::before {
            content: '';
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            height: 2px;
            background: linear-gradient(to right, #f09b9c, #b2b7d8);
          }
        }
      }
    }

    .community-container {
      padding: 12px;

      .community-card {
        background: #fff;
        border-radius: 2px;

        .heading {
          padding: 12px;

          .title {
            display: flex;
            align-items: center;
            padding: 12px;
            border-radius: 2px;
            background: linear-gradient(to right, #ebecf5, #fae6eb);

            .official {
              height: 16px;
              margin-right: 5px;
            }

            .type {
              margin-right: 5px;
              background: #88d3ca;
              color: #fff;
              padding: 2px 3px;
              border-radius: 2px;
              font-weight: 600;
              white-space: nowrap;
            }

            .name {
              font-size: 12px;
              font-weight: 600;
              line-height: 20px;
              color: #715660;
              margin-right: 10px;
            }

            .flag {
              height: 16px;
              margin-left: auto;
            }
          }

          .body {
            display: flex;
            flex-wrap: wrap;
            padding: 10px 0;

            > div {
              &.description {
                width: 100%;
                flex-shrink: 0;
                margin-bottom: 10px;
              }

              &.left {
                width: calc(50% - 4px);
                margin-right: 8px;

                img {
                  width: 100%;
                }

                div {
                  padding: 5px 0;
                }
              }

              &.right {
                width: calc(50% - 4px);
                border-top: dotted 1px #000;
                border-bottom: dotted 1px #000;
                border-radius: 8px;
                padding: 14px 0;
                display: flex;
                flex-direction: column;
                justify-content: center;

                .line {
                  display: flex;
                  width: 100%;
                  margin: 5px 0;

                  .small {
                    font-size: 9px;
                    padding-top: 2px;
                    width: 50px;
                    color: #9c9da5;
                    flex-shrink: 0;
                  }

                  .member-value {
                    font-size: 9px;
                  }
                }
              }
            }
          }

          .separator {
            border-bottom: solid 1px #e7ebed;
          }
        }

        .news-container {
          display: flex;
          align-items: center;
          padding: 12px 17px 12px 15px;

          .news-icon {
            height: 30px;
            margin-right: 8px;
          }

          .title {
            .date {
              color: #f09b9c;
              font-size: 10px;
            }

            .name {
              font-weight: 600;
            }
          }

          .right-icon {
            height: 12px;
            margin-left: auto;
          }
        }
      }
    }
  }
}

.image {
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

.icon {
  margin-left: 10px;
}
</style>
