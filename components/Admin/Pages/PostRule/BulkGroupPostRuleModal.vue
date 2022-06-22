<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <div />
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div class="table-container">
          <table>
            <tr>
              <th class="rule post-rule">マイエピソード</th>
              <th class="rule post-rule">チームエピソード</th>
              <th class="rule post-rule">プロフィール更新</th>
              <th class="rule alert">投稿アラート</th>
            </tr>
            <tr>
              <td>
                <SelectPostRule
                  v-model="setting.my_episode"
                  :rule="configRules.my_episode"
                />
              </td>
              <td>
                <SelectPostRule
                  v-model="setting.team_episode"
                  :rule="configRules.team_episode"
                />
              </td>
              <td>
                <SelectPostRule
                  v-model="setting.profile"
                  :rule="configRules.profile"
                />
              </td>
              <td>
                <SelectAlert
                  v-model="setting.alert"
                  :rule="configRules.alert"
                />
              </td>
            </tr>
          </table>

          <div class="center button-box">
            <base-button class="button" size="large" @click="onSubmit"
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
import { SelectAlert, SelectPostRule } from '@/components/Admin/Pages/';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: {
    SelectAlert,
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
        my_episode: 'normal',
        team_episode: 'normal',
        alert: 'normal',
        profile: 'normal',
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
  width: 800px;
  height: 174px;
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
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
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

  th {
    font-weight: 600;
    font-size: 14px;
    padding: 0 10px;
  }

  td {
    vertical-align: middle;
    padding: 0 10px;
  }

  .rule {
    font-size: 15px;
    font-weight: 600;
    color: $dark_blue;
  }

  .post-rule {
    width: 150px;
  }

  .alert {
    width: 260px;
  }

  select {
    margin-top: 7px;
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
</style>
