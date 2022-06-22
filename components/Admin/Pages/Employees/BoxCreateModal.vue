<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <div class="title">{{ modalTitle }}</div>
          <img src="/icon/icon_cross.png" class="icon-cross" @click="onClose" />
        </div>
        <div v-if="step === 1" class="modal-content">
          <div class="row">
            <div class="label">会社を選択</div>
            <select v-model="selectedCompanyUuid" class="input">
              <option value="">選択してください</option>
              <option
                v-for="item in companies"
                :key="item.uuid"
                :value="item.uuid"
                v-text="item.name"
              />
            </select>
          </div>
          <div class="row">
            <div class="label">作成するBOX名を入力</div>
            <input
              v-model="name"
              class="input"
              type="text"
              placeholder="名前を入力"
            />
          </div>
          <div class="row">
            <div class="label"></div>
            <input
              v-model="kana"
              class="input"
              type="text"
              placeholder="ふりがなを入力"
            />
          </div>
          <div class="row">
            <div class="label">属性を選択する</div>
            <select v-model="attribute" class="input">
              <option value="">選択してください</option>
              <option value="department">部署</option>
              <option value="branch">支店</option>
              <option value="shop">店舗</option>
            </select>
          </div>
          <div class="button-box">
            <base-button size="large" @click="create">追加する</base-button>
          </div>
        </div>
        <div v-if="step === 2" class="modal-content">
          <div>
            BOXが作成されました。
          </div>
          <div>このBOXを所属組織に選択しますか？</div>
          <div></div>
          <div class="button-box">
            <base-button size="large" class="button" @click="select">
              選択する
            </base-button>
            <base-button size="large" class="cancel" @click="cancelAfterCreated"
              >キャンセル</base-button
            >
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import _ from 'lodash';
import { createOrganization } from '@/libs/api';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: { BaseButton },
  props: {
    companies: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedCompanyUuid: '',
      name: '',
      kana: '',
      step: 1,
      createdOrganization: null as null | ApiResponse.GroupOrganization,
      attribute: '',
    };
  },
  computed: {
    modalTitle(): string {
      return this.$data.step === 1 ? 'BOXを新規に作成' : '';
    },
  },
  methods: {
    select() {
      if (this.createdOrganization == null) {
        return;
      }
      this.$emit(
        'select-after-creating-organization',
        this.createdOrganization
      );
      this.onClose();
    },
    cancelAfterCreated() {
      if (this.createdOrganization == null) {
        return;
      }
      this.$emit(
        'add-created-organization-to-organizations',
        this.createdOrganization
      );
      this.onClose();
    },
    async create() {
      if (!this.selectedCompanyUuid) {
        alert('会社を選択してください');
        return;
      }
      if (!this.name || !this.kana) {
        alert('box名を入力してください');
        return;
      }
      if (!this.attribute) {
        alert('属性を選択してください');
        return;
      }

      try {
        const pos =
          _.maxBy(this.companies as { pos: number }[], 'pos')!.pos + 2 ** 16;
        const { data: response } = await createOrganization({
          name: this.name,
          kana: this.kana,
          type: this.attribute,
          parent_uuid: this.selectedCompanyUuid,
          pos,
        });
        this.createdOrganization = response;
        this.step = 2;
      } catch (e) {
        console.error(e);
      }
    },
    onClose() {
      this.$emit('close');
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
  width: auto;
  height: auto;
  background: $true_white;
  border-radius: 6px;
  padding: 26px;
  border: 1px solid #47494e;
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

.title {
  font-size: 15px;
  font-weight: 600;
  margin-right: 25px;
  color: $dark_blue;
}

.icon-cross {
  cursor: pointer;
}

.modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 600px;
  background-color: $true_white;
  margin-top: 14px;
  color: $dark_blue;
  font-size: 15px;
  font-weight: 600;
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
  text-align: center;
  margin-top: 20px;
}

.button {
  width: 200px;
}

.cancel {
  border: solid 1px $light_gray_blue_3;
  color: $gray_blue_4;
  background-color: $true_white;
}

.row {
  display: flex;
  align-items: center;

  + .row {
    margin-top: 13px;
  }
}

.label {
  width: 230px;
}

.input {
  flex-grow: 1;
  color: $gray_blue_4;
  width: 100%;
  height: 40px;
  padding: 4px;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  background-color: $extra_light_gray;
  margin-left: 5px;
}
</style>
