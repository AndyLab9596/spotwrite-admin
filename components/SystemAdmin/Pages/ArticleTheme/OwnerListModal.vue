<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <p class="title">利用中企業リスト</p>
          <img src="/icon/icon_cross.svg" class="icon-cross" @click="onClose" />
        </div>

        <div class="modal-content">
          <div class="owner-list">
            <div>
              ・<nuxt-link
                v-for="owner in ownerList"
                :key="owner.uuid"
                tag="a"
                :to="`/system-admin/contract-company/detail/${owner.uuid}`"
                >{{ owner.name }}</nuxt-link
              >
            </div>
          </div>
        </div>

        <div class="button-box">
          <base-button class="button" @click="onClose">
            閉じる
          </base-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import { BaseButton } from '@/components/Admin/Modules/Button';

export default Vue.extend({
  components: { BaseButton },
  props: {
    ownerList: {
      type: Array,
      required: true,
    },
  },
  methods: {
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
  left: 0;
  width: 100%;
  height: 100%;
}

.modal-window {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 464px;
  background: $true_white;
  border-radius: 4px;
  padding: 17px 30px 30px 30px;
  box-shadow: 0 0 3px #b8c7d8;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 15px;
  color: $dark_blue;
}

.icon-cross {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.modal-content {
  display: flex;
  flex-direction: column;
  margin-top: 21px;

  .owner-list {
    height: 260px;
    overflow: auto;
    list-style: initial;

    a {
      text-decoration: underline;
      color: #2e303e;
    }
  }
}

.button-box {
  margin-top: 20px;
  text-align: center;

  button {
    padding: 0 15px;
    background: #7e8195;
    color: #fff;
    width: 200px;
    height: 40px;
    font-weight: normal;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s;

  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

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

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background: #fff;
}

::-webkit-scrollbar-thumb {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  background: #7b8195;
}
</style>
