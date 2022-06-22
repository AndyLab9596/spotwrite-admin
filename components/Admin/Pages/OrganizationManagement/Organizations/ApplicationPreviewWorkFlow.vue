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
                  :class="{ active: activeTab === 'data' }"
                  @click="activeTab = 'data'"
                >
                  事業部概要
                </div>
                <div
                  :class="{ active: activeTab === 'history' }"
                  @click="activeTab = 'history'"
                >
                  仕事の流れ・部署データ
                </div>
              </div>
              <div class="container">
                <company-history
                  v-show="activeTab === 'history'"
                  :histories="workflows"
                />
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
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import CompanyHistory from '@/components/Admin/Pages/OrganizationManagement/Organizations/CompanyHistory.vue';

export default Vue.extend({
  components: {
    BaseButton,
    CompanyHistory,
  },
  props: {
    activeTab: {
      type: String,
      default: 'history',
    },
    sections: {
      type: Array,
      default: () => [],
    },
    organizationData: {
      type: Object as ApiResponse.OrganizationData,
      required: true,
      default: {},
    },
    workflows: {
      type: Array as PropType<Types.Workflow[]>,
      required: true,
      default: [],
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
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

  .app-top,
  .app-bottom {
    width: 100%;

    &.app-top {
      transform: translateY(-6px);
    }
  }

  .app-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    font-size: 11px;
    margin-bottom: 1px;
    overflow: hidden;
    background: #eff0f7;

    .tab-container {
      display: flex;
      background: #fff;

      div {
        width: 50%;
        flex-shrink: 0;
        text-align: center;
        padding: 12px 0;
        cursor: pointer;

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

    .container {
      background: $true_white;
      margin-top: 1px;
      margin-bottom: 1px;
      pointer-events: none;
      overflow: hidden;

      .list {
        text-align: center;
        box-shadow: 0 1px 1px #ccc;
      }

      .favorite {
        background-repeat: no-repeat;
        background-size: 12px 16px;
        height: 16px;
        width: 12px;
        cursor: pointer;

        &--true {
          background-image: url('/icon/favorite_yellow.svg');
        }

        &--false {
          background-image: url('/icon/favorite_white.svg');
        }
      }

      .people-num {
        display: inline-block;
        font-size: 6px;
        color: #fff;
        background-color: #f09c9c;
        border-radius: 20px;
        opacity: 0.9;
        height: 16px;
        padding: 2px 4px;
        min-width: 39px;
        line-height: 13px;

        &__number {
          font-size: 10px;
          font-weight: bold;
        }
      }

      .kobusyo-num {
        display: inline-block;
        font-size: 6px;
        color: #fff;
        background-color: #7e8195;
        border-radius: 20px;
        opacity: 0.9;
        height: 16px;
        padding: 2px 4px;
        min-width: 39px;
        line-height: 13px;

        &__icon {
          padding-bottom: 4px;
        }

        &__number {
          font-size: 10px;
          font-weight: bold;
        }
      }

      .logo {
        height: 24px;
        margin: 20px 0;
      }

      .company {
        text-align: center;
        position: relative;

        &__favorite {
          position: absolute;
          top: 0;
          right: 0;
          margin: 10px;
          z-index: 1;
        }

        &__image {
          width: 100%;
          border-radius: 4px;
          display: block;
        }

        &__box {
          position: relative;
          display: flex;
          align-items: center;
          background: linear-gradient(to right, #f09c9c 0%, #b2b7d8 100%);
          border-radius: 4px;
          margin-top: 8px;
          z-index: 0;
          height: calc(320px * 0.5);
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.3),
              transparent,
              transparent
            );
          }
        }

        &__title {
          padding: 8px 0 14px 16px;
          position: absolute;
          bottom: 0;
          text-align: left;
        }

        &__group-name {
          font-size: 11px;
          color: #fff;
        }

        &__name {
          font-size: 15px;
          color: #fff;
          font-weight: bold;
        }

        &__chips {
          position: absolute;
          bottom: 0;
          right: 0;
          margin: 16px;
        }
      }

      .organization {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        position: relative;
        padding: 7px;
        background: #fff;

        &__box {
          position: relative;
          display: flex;
          align-items: center;
          width: calc((100% - 7px) / 2);
          background: linear-gradient(to right, #f09c9c 0%, #b2b7d8 100%);
          border-radius: 4px;
          z-index: 0;
          height: calc(165px * 0.6);
          overflow: hidden;

          &:not(:nth-of-type(2n)) {
            margin-right: 7px;
          }

          &:not(:nth-child(1)):not(:nth-child(2)) {
            margin-top: 7px;
          }

          &::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.3);
          }
        }

        &__favorite {
          position: absolute;
          top: 0;
          right: 0;
          margin: 10px;
          z-index: 1;
          cursor: pointer;
        }

        &__image {
          display: block;
          width: 100%;
          border-radius: 4px;
        }

        &__name {
          font-size: 12px;
          font-weight: bold;
          color: #fff;
          position: absolute;
          top: 0;
          display: flex;
          width: 100%;
          height: 100%;
          margin: 0;
          align-items: center;
          justify-content: center;
          padding: 0 25px;
        }

        &__chips {
          position: absolute;
          bottom: 0;
          right: 0;
          margin: 8px;
        }
      }

      .company__logo {
        max-height: 24px;
        margin-top: 10px;
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
