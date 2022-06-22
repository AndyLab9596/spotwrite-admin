<template>
  <transition name="modal" appear>
    <div v-scroll-lock="true" class="modal modal-overlay" @click.self="onClose">
      <div
        class="modal-window"
        :style="{ top: offsetTop + 'px', left: offsetLeft + 240 + 'px' }"
      >
        <div class="modal-header">
          <img
            src="/icon/icon_cross-white.png"
            class="icon-cross"
            @click="onClose"
          />
        </div>
        <div class="modal-content">
          <div class="modal-main">
            <button class="button" @click="goToDetail">
              詳細情報を登録
              <img
                src="/icon/icon_external-link.svg"
                class="icon-external-link"
              />
            </button>
            <button
              class="button"
              @click="
                moveChild({
                  organization: child,
                  destinationUuid: child.relations.company,
                })
              "
            >
              親BOXにする
            </button>
            <button class="button" @click="toggleMoveParentModal">
              親BOXを変更する
            </button>
            <button type="button" class="button" @click="onDelete">
              このBOXを削除する
            </button>
          </div>
        </div>
      </div>
      <move-organization-modal
        v-if="moveParentModal"
        :offset-top="offsetTop"
        :offset-left="offsetLeft"
        :target-organization="child"
        :same-company-parents="sameCompanyParents"
        title="親BOXを変更する"
        @close="toggleMoveParentModal"
        @move="moveChild"
      />
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import MoveOrganizationModal from '@/components/Admin/Pages/Organizations/Registration/MoveOrganizationModal.vue';

export default Vue.extend({
  components: {
    MoveOrganizationModal,
  },
  props: {
    offsetTop: {
      type: Number,
      required: false,
      default: 0,
    },
    offsetLeft: {
      type: Number,
      required: false,
      default: 0,
    },
    child: {
      type: Object as PropType<Types.GroupOrganization>,
      required: true,
    },
    sameCompanyParents: {
      type: Array as PropType<Types.GroupOrganization[]>,
      required: true,
    },
  },
  data() {
    return {
      moveParentModal: false as boolean,
      moveChildModal: false,
      input: { ...this.child },
    };
  },
  computed: {
    existDetail(): boolean {
      return !(Object.keys(this.child.detail).length === 0);
    },
  },
  methods: {
    toggleMoveParentModal() {
      this.moveParentModal = !this.moveParentModal;
    },
    moveChild({
      organization,
      destinationUuid,
    }: {
      organization: Types.GroupOrganization;
      destinationUuid: string | undefined;
    }) {
      this.$emit('move', {
        organization,
        destinationUuid,
      });
      if (this.moveParentModal) {
        this.toggleMoveParentModal();
      }
    },
    onClose() {
      this.$emit('close');
    },
    onDelete() {
      this.$emit('delete', this.child);
    },
    goToDetail() {
      this.$emit('goToDetail', this.child);
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  display: flex;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.modal-window {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  background-color: rgba(126, 129, 149, 0.8);
  box-shadow: 0 0 3px #b8c7d829;
  border-radius: 4px;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 8px;
}

.icon-cross {
  cursor: pointer;
}

.icon-external-link {
  margin-left: 15px;
}

.modal-content {
  display: flex;
  flex-direction: row;
}

.modal-main {
  padding: 0 15px;
  position: relative;
  border: none;
}

.button {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #28292f;
  color: $true_white;
  font-size: 13px;
  border: none;
  border-radius: 6px;
  height: 30px;
  width: 138px;
  font-weight: bold;
  opacity: 1;
  margin-bottom: 15px;

  &:disabled {
    color: rgba(204, 204, 204, 0.5);
    background-color: rgba(0, 0, 0, 0.5);
    cursor: auto;
  }
}
</style>
