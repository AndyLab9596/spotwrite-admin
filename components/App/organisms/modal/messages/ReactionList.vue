<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <div>メッセージリアクション</div>
          <div class="cancel" @click="onClose">閉じる</div>
        </div>
        <div class="tab-content">
          <div
            class="tab-list"
            :class="{ 'tab-active': activeReactionUuid === null }"
            @click="clickIconTab()"
          >
            全{{ message.reaction_info.count }}件
          </div>
          <div
            v-for="reactionIcon in reactionIconList()"
            :key="reactionIcon.reactions_uuid"
            class="tab-list"
            :class="{
              'tab-active': reactionIcon.reactions_uuid === activeReactionUuid,
            }"
            @click="clickIconTab(reactionIcon.reactions_uuid)"
          >
            <img :src="reactionIcon.content" class="reaction-img" />
            <span class="count">{{
              reactionCount(reactionIcon.reactions_uuid)
            }}</span>
          </div>
        </div>
        <div class="modal-content">
          <div
            v-for="reactionUser in reactionUsers(activeReactionUuid)"
            :key="reactionUser.uuid"
            class="reaction-user"
          >
            <img class="reaction-user-img" :src="reactionUser.icon" alt="" />
            <div class="reaction-user-name">{{ reactionUser.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    message: {
      type: Object as PropType<ApiResponse.MessageItem>,
      required: true,
    },
    reactionIcons: {
      type: Array as PropType<ApiResponse.ReactionIcon[]>,
      required: true,
    },
  },
  data() {
    return {
      activeReactionUuid: null as string | null,
    };
  },
  computed: {
    reactionIconList() {
      return (): Array<ApiResponse.ReactionIcon> | undefined => {
        const reactionUuids = [
          ...new Set(
            this.message.reaction_info?.reactions.map(
              (n: { reaction_uuid: any }) => n.reaction_uuid
            )
          ),
        ];
        return this.reactionIcons.filter((n: ApiResponse.ReactionIcon) =>
          reactionUuids.some((s: string) => s === n.reactions_uuid)
        );
      };
    },
    reactionCount() {
      return (reactionUuid: string): any => {
        return this.message.reaction_info?.reactions.filter(
          (n: { reaction_uuid: string }) => n.reaction_uuid === reactionUuid
        ).length;
      };
    },
    reactionUsers() {
      return (reactionUuid: string | null): any => {
        if (!reactionUuid) {
          return this.message.reaction_info?.reactions.map(
            (n: { user_info: any }) => n.user_info
          );
        }
        return this.message.reaction_info?.reactions
          .filter(
            (n: { reaction_uuid: string }) => n.reaction_uuid === reactionUuid
          )
          .map((n: { user_info: any }) => n.user_info);
      };
    },
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    clickIconTab(reactionUuid: string | null) {
      if (!reactionUuid) {
        this.activeReactionUuid = null;
        return;
      }
      this.activeReactionUuid = reactionUuid;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 500px;
  background: #fff;
  padding: 20px 0;
  border-radius: 5px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid #ccc;
  height: 40px;
}

.modal-content {
  display: flex;
  flex-direction: column;
}

.modal-footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0 20px 10px;
}

.submit {
  width: 20%;
  color: #f03d25;
  cursor: pointer;
}

.cancel {
  margin-right: 10px;
  color: #0084ff;
  cursor: pointer;
  position: absolute;
  right: 5px;
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

.reaction-user {
  display: flex;
  border-top: solid 1px #ccc;
  width: 100%;
  padding: 10px 20px;
  height: 50px;
}

.reaction-user-name {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.reaction-user-img {
  width: 40px;
}

.tab-content {
  height: 50px;
  padding: 0 20px;
  color: #7f828b;
  font-size: 15px;
  display: flex;
  align-items: flex-end;
}

.tab-list {
  margin: 8px 8px 0;
  position: relative;
  display: block;
  border-bottom: 1px solid transparent;
  color: #222;
  text-decoration: none;
  transition: 0.25s;
  cursor: pointer;
}

.tab-list:focus,
.tab-list:hover {
  border-bottom-color: #e25c00;
  color: #e25c00;
}

.tab-active {
  border-bottom-color: #e25c00;
  color: #e25c00;
}

.reaction-img {
  height: 15px;
  display: inline-block;
}

.count {
  margin-left: 3px;
  font-size: 14px;
}
</style>
