<template>
  <div class="l-page-container">
    <div class="l-page">
      <page-header title="機能追加">
        <template #tutorial>
          <TutorialButtonIcon :url="`/admin/tutorial/function-addition.html`" />
        </template>
        <template #description>
          spotwriteで提供している機能の利用の有無を選ぶことができます。
        </template>
      </page-header>

      <div class="l-contents">
        <extension
          :active="configStatus.bulletin_board"
          title="在籍掲示板機能"
          name="bulletin_board"
          description="在籍状況をシェアできる「在籍掲示板」の機能の利用の有無をご選択いただけます。"
          @on="turnOn('bulletin_board')"
          @off="turnOff('bulletin_board')"
        ></extension>
        <extension
          :active="configStatus.motivation"
          title="モチベーションチェック"
          name="motivation"
          description="メンバーの日々のモチベーションを確認することができる機能のご利用の有無をご選択いただけます。"
          @on="turnOn('motivation')"
          @off="turnOff('motivation')"
        ></extension>
        <extension
          :active="configStatus.messenger"
          title="メッセンジャー機能"
          name="messenger"
          description="社内でメッセージのやり取りができる機能のご利用の有無をご選択いただけます。"
          @on="turnOn('messenger')"
          @off="turnOff('messenger')"
        ></extension>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Extension } from '@/components/Admin/Pages';
import PageHeader from '@/components/Admin/Templates/PageHeader.vue';
import TutorialButtonIcon from '@/components/Admin/Modules/Icons/TutorialButtonIcon.vue';
import {
  fetchConfigStatus,
  turnOnBulletinBoard,
  turnOffBulletinBoard,
  turnOnMotivation,
  turnOffMotivation,
  turnOnMessenger,
  turnOffMessenger,
} from '@/libs/api';
import { Context } from '@nuxt/types';

export default Vue.extend({
  layout: 'admin/default',
  components: {
    Extension,
    PageHeader,
    TutorialButtonIcon,
  },
  async asyncData(context: Context) {
    const { error } = context;
    try {
      const configStatus = await fetchConfigStatus();

      return {
        configStatus: configStatus.data,
      };
    } catch (err) {
      error({
        statusCode: err.response.status,
        message: err.response.data.message,
      });
    }
  },
  data() {
    return {
      configStatus: {
        bulletin_board: true,
        motivation: true,
        messenger: true,
      },
    };
  },
  methods: {
    async turnOn(name: string) {
      try {
        switch (name) {
          case 'bulletin_board':
            this.configStatus.bulletin_board = true;
            await turnOnBulletinBoard();
            break;
          case 'motivation':
            this.configStatus.motivation = true;
            await turnOnMotivation();
            break;
          case 'messenger':
            this.configStatus.messenger = true;
            await turnOnMessenger();
            break;
          default:
            break;
        }
      } catch (err) {
        console.error(err);
        switch (name) {
          case 'bulletin_board':
            this.configStatus.bulletin_board = false;
            break;
          case 'motivation':
            this.configStatus.motivation = false;
            break;
          case 'messenger':
            this.configStatus.messenger = false;
            break;
          default:
            break;
        }
      }
    },
    async turnOff(name: string) {
      try {
        switch (name) {
          case 'bulletin_board':
            this.configStatus.bulletin_board = false;
            await turnOffBulletinBoard();
            break;
          case 'motivation':
            this.configStatus.motivation = false;
            await turnOffMotivation();
            break;
          case 'messenger':
            this.configStatus.messenger = false;
            await turnOffMessenger();
            break;
          default:
            break;
        }
      } catch (err) {
        console.error(err);
        switch (name) {
          case 'bulletin_board':
            this.configStatus.bulletin_board = true;
            break;
          case 'motivation':
            this.configStatus.motivation = true;
            break;
          case 'messenger':
            this.configStatus.messenger = true;
            break;
          default:
            break;
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
/* Only scoped */
</style>
