<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <img src="/icon/icon-close.svg" class="icon-cross" @click="onClose" />
        <div class="modal-content">
          <div>
            <div class="filter-list">
              <div>
                <span>所属組織（BOX）</span>
                <base-select
                  v-model="division"
                  :items="divisionsForSelectTag"
                  class="filter-select"
                />
              </div>
              <div>
                <span>役職</span>
                <base-select
                  v-model="position"
                  :items="positionsForSelectTag"
                  class="filter-select"
                />
              </div>
              <div>
                <span>雇用形態</span>
                <base-select
                  v-model="status"
                  :items="statusesForSelectTag"
                  class="filter-select"
                />
              </div>
              <div>
                <span>利用権限</span>
                <base-select
                  v-model="authority"
                  class="filter-select"
                  :items="[
                    { name: 'メンバー', value: 'member' },
                    { name: '準メンバー', value: 'pre-member' },
                    { name: 'ビジター', value: 'visitor' },
                  ]"
                />
              </div>
              <div>
                <span>投稿頻度</span>
                <base-select
                  v-model="frequency"
                  :items="frequenciesForSelectTag"
                  class="filter-select"
                />
              </div>
              <div>
                <span>アカウント</span>
                <base-select
                  v-model="is_active"
                  class="filter-select"
                  :items="[
                    { name: '発行済', value: 'true' },
                    { name: '停止中', value: 'false' },
                  ]"
                />
              </div>
              <div>
                <span>参加コミュニティ</span>
                <base-select
                  v-model="community"
                  class="filter-select"
                  :items="communityForSelectTag"
                />
              </div>
              <div>
                <span>性別</span>
                <base-select
                  v-model="gender"
                  class="filter-select"
                  :items="[
                    { name: '男性', value: 'man' },
                    { name: '女性', value: 'woman' },
                    { name: '回答しない', value: 'free' },
                  ]"
                />
              </div>
              <div>
                <span>在籍状況</span>
                <base-select
                  v-model="enrollment"
                  :items="enrollmentsForSelectTag"
                  class="filter-select"
                />
              </div>
              <div>
                <span>スマホ利用</span>
                <base-select
                  v-model="used_smartphone"
                  :items="[
                    { name: '選択してください。', value: '' },
                    { name: '利用あり', value: 'true' },
                    { name: '利用なし', value: 'false' },
                  ]"
                  class="filter-select"
                />
              </div>
            </div>
          </div>
          <div class="button-box">
            <base-button class="button" size="large" @click="onExecute()"
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
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';

export default Vue.extend({
  components: { BaseButton, BaseSelect },
  props: {
    displayColumns: {
      type: Object,
      required: true,
    },
    divisions: {
      type: Array,
      required: true,
    },
    positions: {
      type: Array,
      required: true,
    },
    statuses: {
      type: Array,
      required: true,
    },
    frequencies: {
      type: Array,
      required: true,
    },
    enrollments: {
      type: Array,
      required: true,
    },
    communities: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      division: '',
      position: '',
      status: '',
      authority: '',
      frequency: '',
      enrollment: '',
      is_active: '',
      community: '',
      gender: '',
      used_smartphone: '',
    };
  },
  computed: {
    divisionsForSelectTag() {
      return this.divisions.map((division: any) => ({
        name: division.name,
        value: division.uuid,
      }));
    },
    positionsForSelectTag() {
      return this.positions.map((position: any) => ({
        name: position.name,
        value: position.uuid,
      }));
    },
    statusesForSelectTag() {
      return this.statuses.map((status: any) => ({
        name: status.name,
        value: status.uuid,
      }));
    },
    frequenciesForSelectTag() {
      return this.frequencies.map((frequency: any) => ({
        name: frequency.name,
        value: frequency.value,
      }));
    },
    enrollmentsForSelectTag() {
      return this.enrollments.map((enrollment: any) => ({
        name: enrollment.name,
        value: enrollment.value,
      }));
    },
    communityForSelectTag() {
      return this.communities.map((enrollment: any) => ({
        name: enrollment.name,
        value: enrollment.uuid,
      }));
    },
  },
  methods: {
    onExecute() {
      this.$emit('bulk-update', {
        organization: this.division,
        employment_position_uuid: this.position,
        employment_status_uuid: this.status,
        my_episode: this.frequency,
        enrollment_statuses: this.enrollment,
        access_permission: this.authority,
        is_active: this.is_active,
        community: this.community,
        gender: this.gender,
        used_smartphone: this.used_smartphone,
      });
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
  width: 720px;
  background: $true_white;
  border-radius: 6px;
  padding: 32px 30px 20px;
  box-shadow: 0 0 3px 0 $light_gray;
  position: relative;
}

.modal-header-title {
  font-size: 15px;
  font-weight: 600;
  margin-right: 25px;
}

.icon-cross {
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
}

.modal-content {
  background-color: $true_white;
  color: $dark_blue;
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

  .button {
    width: 200px;
  }
}

.filter-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-gap: 12px;

  span {
    font-weight: bold;
  }
}

.filter-select {
  width: 150px;
}
</style>
