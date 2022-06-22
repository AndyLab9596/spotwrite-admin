<template>
  <transition name="modal" appear>
    <div class="modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="icon-cross-wrapper" @click="onClose">
          <img src="/app/icon/cross-white.svg" class="icon-cross" />
        </div>
        <p class="title">{{ title }}</p>
        <base-tabs
          :items="tabItems"
          :selected-tab="selectedTabId"
          :item-count-threshold="4"
          :width="700"
          @change-tab="selectTab"
        />
        <div class="member-list-contents">
          <member-list
            :companies="companies"
            :selected-tab-id="selectedTabId"
            :total-tab-id="totalTabId"
          />
        </div>
        <div class="close-wrapper">
          <base-button class="close-button" @click="onClose">
            {{ closeButton }}
          </base-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseTabs from '../../molecules/tabs/BaseTabs.vue';
import BaseButton from '../../atoms/buttons/BaseButton.vue';
import MemberList from './MemberList.vue';

export default Vue.extend({
  components: {
    BaseTabs,
    BaseButton,
    MemberList,
  },
  props: {
    closeButton: {
      type: String,
      required: false,
      default: '閉じる',
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
    companies: {
      type: Array as PropType<ApiResponse.MemberListCompany[]>,
      required: true,
    },
  },
  data() {
    return {
      selectedTabId: 'total' as string,
      totalTabId: 'total' as string,
    };
  },
  computed: {
    tabItems(): Types.TabItem[] {
      let totalCount = 0 as number;

      const tabItems = this.companies.map(
        (item: ApiResponse.MemberListCompany) => {
          totalCount += item.users.length;
          return { id: item.uuid, name: `${item.name}${item.users.length}名` };
        }
      );
      // 合計タブを追加している
      tabItems.unshift({ id: this.totalTabId, name: `合計${totalCount}名` });
      return tabItems;
    },
  },
  methods: {
    onClose() {
      this.$emit('onClose');
    },
    selectTab(id: string) {
      this.selectedTabId = id;
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
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  width: 780px;
  height: 98%;
  background: $true_white;
  border-radius: 4px 4px 0 0;
  position: relative;
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

.icon-cross-wrapper {
  position: absolute;
  top: 0;
  right: calc(-25px + -25px);
}

.icon-cross {
  cursor: pointer;
  width: 25px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  line-height: 1em;
  color: $gentle_bluish_purple;
  margin: 37px 0 32px 40px;
}

.member-list-contents {
  // モーダル上部の高さを引いてる
  height: calc(100% - (36px + 52px + 68px));
  overflow-y: scroll;
  padding: 0 0 108px 0;
}

.close-wrapper {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 24px 40px 40px;
  box-shadow: 1px 0 2px $box-shadow;
}

.close-button {
  width: 100%;
  background-color: $button_background_color;
  color: $gentle_bluish_purple;
  height: 44px;
}
</style>
