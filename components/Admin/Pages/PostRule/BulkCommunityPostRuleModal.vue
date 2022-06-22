<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <div />
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div class="table-container">
          <div>
            <div class="label">
              コミュニティニュース
            </div>
            <div>
              <SelectPostRule
                v-model="setting.community_team_episode"
                :rule="configRules.community_team_episode"
              />
            </div>
          </div>

          <div class="center button-box">
            <base-button class="button" @click="onSubmit"
              >一括設定する</base-button
            >
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import { SelectPostRule } from '@/components/Admin/Pages/';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: {
    SelectPostRule,
    BaseButton,
  },
  props: {
    configRules: {
      type: Object,
      default: () => ({} as ApiResponse.ConfigRules),
    },
  },
  data() {
    return {
      setting: {
        community_team_episode: 'normal',
      },
    };
  },
  methods: {
    onClose() {
      this.$emit('onClose');
    },
    onSubmit() {
      this.$emit('onSubmit', this.setting);
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
}

.modal-window {
  display: flex;
  flex-direction: column;
  width: 240px;
  height: 170px;
  background: $true_white;
  border-radius: 6px;
  padding: 18px;
  box-shadow: 0 0 3px 0 $light_gray;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 7px;
}

.icon-cross {
  cursor: pointer;
}

.table-container {
  overflow-y: auto;
  max-height: 400px;
}

table {
  background-clip: padding-box;

  th,
  td {
    border: solid 1px $light_gray_blue_3;
  }

  th {
    font-weight: normal;
    font-size: 14px;
  }

  td {
    width: 150px;
    vertical-align: middle;
  }

  .rule {
    width: 130px;
  }
}

.center {
  text-align: center;
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

.button-box {
  margin-top: 20px;
}

.button {
  width: 200px;
}

.label {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 7px;
}
</style>
