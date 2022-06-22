<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <p class="title">投稿ルール説明表</p>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div class="table-container">
          <div class="section">
            <p class="table-title">投稿ルール</p>
            <table border>
              <tr>
                <th style="width: 140px;"></th>
                <th class="center" style="width: 160px;">
                  コミュニティニュース
                </th>
              </tr>
              <tr>
                <th>ゆっくり</th>
                <td>
                  {{ toLabel(configRules.community_team_episode.slowly) }}
                </td>
              </tr>
              <tr>
                <th>普通</th>
                <td>
                  {{ toLabel(configRules.community_team_episode.normal) }}
                </td>
              </tr>
              <tr>
                <th>頻繁</th>
                <td>
                  {{ toLabel(configRules.community_team_episode.frequent) }}
                </td>
              </tr>
              <tr>
                <th>催促なし</th>
                <td>なし</td>
              </tr>
            </table>
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
    configRules: {
      type: Object as PropType<ApiResponse.ConfigRules>,
      default: {},
    },
  },
  data() {
    return {
      labelMap: {
        three_months: '3ヶ月',
        month: '1ヶ月',
        week: '一週間',
      } as { [key: string]: string },
    };
  },
  methods: {
    onClose() {
      this.$emit('onClose');
    },
    toLabel(key: string): string {
      return this.labelMap[key] ?? '';
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
  width: 360px;
  height: 320px;
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
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.icon-cross {
  cursor: pointer;
}

table {
  background-clip: padding-box;
  border: solid 1px $light_gray_blue_3;

  th,
  td {
    border: solid 1px $light_gray_blue_3;
  }

  th {
    text-align: center;
    font-weight: normal;
    font-size: 14px;
    height: 40px;
    vertical-align: middle;
  }

  td {
    height: 40px;
    font-size: 13px;
    padding: 8px;
    vertical-align: middle;
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

.section {
  color: $dark_blue;

  & + & {
    margin-top: 23px;
  }

  .table-title {
    font-size: 15px;
    font-weight: 600;
  }

  table {
    margin-top: 12px;

    th {
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: $gray_blue_4;
      background-color: $white_1;
      padding: 0 11px;
    }

    .center {
      text-align: center;
    }
  }
}
</style>
