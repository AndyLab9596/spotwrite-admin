<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClick">
      <div class="modal-window">
        <div class="modal-header">
          <p class="title">BOX編集者を編集</p>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClick" />
        </div>
        <div class="modal-content">
          <div class="left">
            <div class="select-box form-item">
              <label class="label">BOX編集者</label>
              <select v-model="selectEditor" name="editor" class="select">
                <option disabled :value="{}">お選びください</option>
                <option
                  v-for="editor in editors"
                  :key="editor.id"
                  :value="editor"
                >
                  {{ editor.name }}
                </option>
              </select>
            </div>
            <button @click="addEditor">追加</button>
          </div>
          →
          <!-- TODO: レイアウト整える -->
          <div class="right">
            <ul>
              <li v-for="boxEditor in boxEditors" :key="boxEditor.id">
                {{ boxEditor.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      editors: [
        { id: 1, name: '安倍 晋三' },
        { id: 2, name: '野田 佳彦' },
        { id: 3, name: '菅 直人' },
        { id: 4, name: '鳩山 由紀夫' },
      ],
      selectEditor: {},
      boxEditors: [],
    };
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
    addEditor() {
      const exist = this.boxEditors.find(
        // オブジェクトの型定義してね
        // @ts-ignore
        (item: {}) => item.id === this.selectEditor.id
      );
      if (!exist) {
        // オブジェクトの型定義してね
        // @ts-ignore
        this.boxEditors.push(this.selectEditor);
      }
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
  width: 700px;
  height: 200px;
  background: $true_white;
  border-radius: 6px;
  padding: 18px;
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
}

.icon-cross {
  cursor: pointer;
}

.modal-content {
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
}

.select {
  flex: 1;
  width: 230px;
  height: 40px;
}

.modal-footer {
  background: #ccc;
  padding: 10px;
  text-align: right;
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
</style>
