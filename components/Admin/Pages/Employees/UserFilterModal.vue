<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <img src="/icon/icon-close.svg" class="icon-cross" @click="onClose" />
        <div class="modal-content">
          <div>
            <div class="filter-list">
              <div>
                <span>氏名で検索</span>
                <input
                  v-model="name"
                  type="text"
                  placeholder="氏名を入力"
                  @input="onChange"
                />
              </div>
              <div v-if="displayColumns.organization">
                <span>所属組織（BOX）</span>
                <base-select
                  v-model="organization"
                  class="select-box"
                  :items="organizationsItem"
                  @input="onChange"
                />
              </div>
              <div v-if="displayColumns.position">
                <span>役職</span>
                <base-select
                  v-model="position"
                  class="select-box"
                  :items="positionsItem"
                  @input="onChange"
                />
              </div>
              <div v-if="displayColumns.status">
                <span>雇用形態</span>
                <base-select
                  v-model="status"
                  class="select-box"
                  :items="statusesItem"
                  @input="onChange"
                />
              </div>
              <div v-if="displayColumns.authority">
                <span>利用権限</span>
                <!-- FIXME: 未実装だったためv-modelとitemsを仮で入れています。実装する際に値を書き換えてください -->
                <base-select
                  v-model="authority"
                  class="select-box"
                  :items="[
                    { name: 'メンバー', value: 'member' },
                    { name: '準メンバー', value: 'pre-member' },
                    { name: 'ビジター', value: 'visitor' },
                  ]"
                  @input="onChange"
                />
              </div>
              <div v-if="displayColumns.postFrequence">
                <span>投稿頻度</span>
                <base-select
                  v-model="my_episode"
                  class="select-box"
                  :items="frequencies"
                  @input="onChange"
                />
              </div>
              <div v-if="displayColumns.accountStatus">
                <span>アカウント</span>
                <base-select
                  v-model="is_active"
                  class="select-box"
                  :items="[
                    { name: '発行済', value: 'true' },
                    { name: '停止中', value: 'false' },
                  ]"
                  @input="onChange"
                />
              </div>
              <div v-if="displayColumns.joinedCommunity">
                <span>参加コミュニティ</span>
                <base-select
                  v-model="community"
                  class="select-box"
                  :items="communitiesItem"
                  @input="onChange"
                />
              </div>
              <div v-if="displayColumns.gender">
                <span>性別</span>
                <base-select
                  v-model="gender"
                  class="select-box"
                  :items="[
                    { name: '男性', value: 'man' },
                    { name: '女性', value: 'woman' },
                    { name: '回答しない', value: 'free' },
                  ]"
                  @input="onChange"
                />
              </div>
              <div v-if="displayColumns.enrollmentStatus">
                <span>在籍状況</span>
                <base-select
                  v-model="enrollment_statuses"
                  class="select-box"
                  :items="enrollments"
                  @input="onChange"
                />
              </div>
              <div v-if="displayColumns.smartPhone">
                <span>スマホ利用</span>
                <base-select
                  v-model="used_smartphone"
                  class="select-box"
                  :items="[
                    { name: '利用あり', value: 'true' },
                    { name: '利用なし', value: 'false' },
                  ]"
                  @input="onChange"
                />
              </div>
            </div>
            <div class="button-box">
              <base-button class="button" size="large" @click="onExecute()"
                >メンバーを絞り込む</base-button
              >
            </div>
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
    communities: {
      type: Array,
      required: true,
    },
    organizations: {
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
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      name: '',
      organization: '',
      position: '',
      status: '',
      authority: '',
      my_episode: '',
      is_active: '',
      community: '',
      gender: '',
      enrollment_statuses: '',
      used_smartphone: '',
    };
  },
  computed: {
    organizationsItem() {
      return [...this.$props.organizations].map(
        (item: AppApiResponse.Organization) => {
          return { name: item.name, value: item.uuid };
        }
      );
    },
    positionsItem() {
      return [...this.$props.positions].map((item: ApiResponse.Position) => {
        return { name: item.name, value: item.uuid };
      });
    },
    statusesItem() {
      return [...this.$props.statuses].map(
        (item: ApiResponse.EmploymentStatus) => {
          return { name: item.name, value: item.uuid };
        }
      );
    },
    communitiesItem() {
      return [...this.$props.communities].map((item: ApiResponse.Community) => {
        return { name: item.name, value: item.uuid };
      });
    },
  },
  created() {
    // TODO valueの型定義は後でしっかり定義する
    this.community = this.value.community;
    this.enrollment_statuses = this.value.enrollment_statuses;
    this.gender = this.value.gender;
    this.is_active = this.value.is_active;
    this.my_episode = this.value.my_episode;
    this.name = this.value.name;
    this.organization = this.value.organization;
    this.position = this.value.position;
    this.status = this.value.status;
    this.my_episode = this.value.my_episode;
    this.is_active = this.value.is_active;
    this.community = this.value.community;
    this.gender = this.value.gender;
    this.enrollment_statuses = this.value.enrollment_statuses;
    this.used_smartphone = this.value.used_smartphone;
    this.initOrInput();
  },
  methods: {
    initOrInput() {
      this.$emit('input', {
        name: this.name,
        community: this.community,
        organization: this.organization,
        position: this.position,
        status: this.status,
        my_episode: this.my_episode,
        is_active: this.is_active,
        gender: this.gender,
        enrollment_statuses: this.enrollment_statuses,
        used_smartphone: this.used_smartphone,
      });
    },
    onChange() {
      this.initOrInput();
    },
    onExecute() {
      this.$emit('filter');
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
  height: auto;
  background: $true_white;
  border-radius: 6px;
  padding: 32px 30px 20px;
  box-shadow: 0 0 3px 0 $light_gray;
  position: relative;
}

.icon-cross {
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
}

.modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
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
  grid-gap: 18px 20px;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  input {
    padding: 8px;
    width: 150px;
    height: 40px;
    background-color: $extra_light_gray;
    border: solid 1px $light_gray_blue_3;
    border-radius: 4px;
    color: $gray_blue_4;
    display: block;
  }

  span {
    font-weight: bold;
  }
}

.select-box {
  width: 150px;
  padding: 8px;
  height: 40px;
  background-color: $extra_light_gray;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  color: $gray_blue_4;

  & /deep/ .dropdown {
    max-height: calc(34px * 10);
    overflow: auto;
    box-sizing: content-box;
  }
}
</style>
