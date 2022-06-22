<template>
  <transition name="modal" appear>
    <div
      v-scroll-lock="false"
      class="modal modal-overlay"
      @click.self="onClose"
    >
      <div
        class="modal-window"
        :style="{ top: offsetTop - 8 + 'px', left: offsetLeft + 220 + 'px' }"
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
              :disabled="subordinatedChildrenExist"
              @click="toggleMoveParentModal"
            >
              子BOXに変更する
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
        :target-organization="parent"
        :same-company-parents="sameCompanyParents"
        @close="toggleMoveParentModal"
        @move="moveParent"
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
    parent: {
      type: Object as PropType<Types.GroupOrganization>,
      required: true,
    },
    sameCompanyParents: {
      type: Array as PropType<Types.GroupOrganization[]>,
      required: true,
    },
    subordinatedChildrenExist: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      moveParentModal: false as boolean,
      input: { ...this.parent },
    };
  },
  computed: {
    existDetail(): boolean {
      return !(Object.keys(this.parent.detail).length === 0);
    },
  },
  methods: {
    toggleMoveParentModal() {
      this.moveParentModal = !this.moveParentModal;
    },
    moveParent({
      organization,
      destinationUuid,
    }: {
      organization: Types.GroupOrganization;
      destinationUuid: string;
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
      this.$emit('delete', this.parent);
    },
    goToDetail() {
      this.$emit('goToDetail', this.parent);
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
  overflow: scroll;
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
  margin-top: 2px;
  display: block;
  float: right;
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
  display: block;
  flex-direction: row;
  align-items: center;
  background-color: #28292f;
  color: $true_white;
  font-size: 13px;
  border: none;
  border-radius: 6px;
  height: 30px;
  width: 148px;
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
