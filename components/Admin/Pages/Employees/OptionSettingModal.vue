<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <div class="row">
            <h3 class="modal-header-title">オプション権限</h3>
            <base-checkbox
              id="option-all"
              class="check-box title"
              label="全てのオプション権限にチェックをいれる"
              @change="selectAllOffice"
            />
          </div>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <form>
          <div class="modal-content">
            <div class="check-box-row content-space">
              <div class="row-column">
                <div class="row">
                  <base-checkbox
                    v-model="selectedCategories"
                    label="チームごとの分析ができる"
                    class="title"
                    value="team-analysis"
                  />
                </div>
                <label class="sub-title">リーダにおすすめ！</label>
              </div>
              <div class="check-box-area">
                <div
                  v-for="organization in organizations"
                  :key="organization.uuid"
                  class="row check-box-area-row"
                >
                  <base-checkbox
                    class="check-box"
                    :label="organization.name"
                    :value="organization.uuid"
                  />
                </div>
              </div>
            </div>
            <div class="check-box-row content-space">
              <div class="row-column">
                <div class="row">
                  <base-checkbox
                    v-model="selectedCategories"
                    value="mental-analysis"
                    label="モチベーションチェックの分析ができる"
                    class="title check-box-text-red-color"
                  />
                </div>
                <label class="sub-title red-color">
                  モチベーションチェックは個人情報のため権限を付与する際、細心の注意をお願いします。
                </label>
              </div>
              <div class="check-box-area">
                <div
                  v-for="organization in organizations"
                  :key="organization.uuid"
                  class="row check-box-area-row"
                >
                  <base-checkbox
                    class="check-box"
                    :label="organization.name"
                    :value="organization.uuid"
                  />
                </div>
              </div>
            </div>
            <div class="check-box-row content-space">
              <div class="row-column">
                <div class="row">
                  <base-checkbox
                    :selected-values="selectedCategories"
                    value="management-screen"
                    label="管理画面を操作できる"
                    class="title"
                  />
                </div>
                <label class="sub-title">
                  人事データ、組織図など操作できます。
                </label>
              </div>
              <div class="check-box-area">
                <div
                  v-for="organization in organizations"
                  :key="organization.uuid"
                  class="row check-box-area-row"
                >
                  <base-checkbox
                    class="check-box"
                    :label="organization.name"
                    :value="organization.uuid"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseCheckbox from '@/components/Admin/Modules/Checkbox/BaseCheckbox.vue';

export default Vue.extend({
  components: { BaseCheckbox },
  props: {
    organizations: {
      type: Array as PropType<ApiResponse.GroupOrganization[]>,
      default: () => [],
    },
  },
  data() {
    return {
      isAllSelected: false,
      selectedCategories: [] as string[],
      isDisabledSelected: true,
    };
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    selectAllOffice() {
      this.isAllSelected = !this.isAllSelected;

      if (this.isAllSelected) {
        this.selectedCategories = [
          'team-analysis',
          'mental-analysis',
          'management-screen',
        ];
        return;
      }
      this.selectedCategories = [];
    },
    selectDisabledSelected() {
      this.isDisabledSelected = !this.isDisabledSelected;
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
  right: 0;
  width: 100%;
  height: 100%;
}

.modal-window {
  display: flex;
  flex-direction: column;
  width: 940px;
  height: auto;
  background: $true_white;
  border-radius: 4px;
  padding: 20px 30px;
  border: none;
  box-shadow: 0 0 3px #b8c7d8;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;

  img {
    object-fit: contain;
  }
}

.modal-header-title {
  font-size: 15px;
  margin-right: 25px;
}

.icon-cross {
  cursor: pointer;
}

.modal-content {
  margin-top: 20px;

  h3 {
    margin-right: 20px;
  }
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

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.row-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 300px;
}

.check-box-area {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border: 1px solid #e4e5ed;
  border-radius: 6px;
  padding: 13px 15px;
  overflow: scroll;
  background-color: $true_white;
  width: 572px;
  height: 100px;
  align-items: flex-start;

  &-row {
    margin-bottom: 10px;
  }
}

.check-box-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.check-box {
  margin-right: 30px;

  & /deep/ .checkbox-text {
    font-size: 15px;
  }

  &-text-red-color {
    & /deep/ .checkbox-text {
      color: #e74b4b;
    }
  }
}

.title {
  & /deep/ .checkbox-text {
    font-size: 15px;
  }
}

.sub-title {
  font-size: 13px;
  margin-top: 7px;
  margin-left: 23px;
}

.content-space {
  margin-bottom: 20px;
}

.red-color {
  color: #e74b4b;
}
</style>
