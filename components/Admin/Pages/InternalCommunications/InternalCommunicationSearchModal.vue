<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div class="modal-header">
          <img src="/icon/icon_cross.svg" class="icon-cross" @click="onClose" />
        </div>
        <div class="modal-container">
          <div class="grid">
            <div class="column">
              <div class="title">会社</div>
              <div>
                <select v-model="company" class="select">
                  <option value="" disabled>選択してください</option>
                  <option
                    v-for="option in companyOrganizations(organizations)"
                    :key="option.uuid"
                    :value="option.uuid"
                    >{{ option.name }}</option
                  >
                </select>
              </div>
            </div>
            <div class="column">
              <div class="title">送信者</div>
              <div>
                <select v-model="sendUser" class="select">
                  <option value="" disabled>選択してください</option>
                  <option
                    v-for="option in jointlyOrganizationMembersWithLogedUser"
                    :key="option.user_uuid"
                    :value="option.user_uuid"
                    >{{ option.user_name }}</option
                  >
                </select>
              </div>
            </div>
            <div class="column">
              <div class="title">フリーワードで検索</div>
              <input
                v-model="searchPrams.word"
                type="text"
                name="フリーワード"
                class="input place-holder"
                placeholder="氏名を入力"
              />
            </div>
          </div>
          <div class="grid">
            <div class="column">
              <div class="title">部署・支店・店舗</div>
              <div>
                <select v-model="departmentOrganization" class="select">
                  <option value="" disabled>選択してください</option>
                  <option
                    v-for="option in departmentOrganizations(organizations)"
                    :key="option.uuid"
                    :value="option.uuid"
                    >{{ option.name }}</option
                  >
                </select>
              </div>
            </div>
            <div class="column">
              <div class="start-date">
                <div class="title">日付</div>
                <date-input v-model="start_date" class="date-input" />
              </div>
            </div>
            <div class="column">
              <div class="title empty-title">&nbsp;&nbsp;&nbsp;</div>
              <date-input v-model="end_date" class="date-input" />
            </div>
          </div>
          <div class="search-button-container">
            <base-button size="large" class="search-button" @click="onSubmit">
              社内連絡を絞り込む
            </base-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import { fetchOrganizations, fetchOrganizationUsers } from '@/libs/api';
import { toUtcDateTimestamp } from '@/libs/dayjs';
import DateInput from '@/components/Admin/Modules/Input/DateInput.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';

export default Vue.extend({
  components: {
    BaseButton,
    DateInput,
  },
  data() {
    return {
      start_date: '' as string,
      end_date: '' as string,
      searchPrams: {} as ApiRequest.InternalCommunicationQuery,
      organizations: [] as ApiResponse.GroupOrganization[],
      sendUser: '' as string,
      company: '' as string,
      departmentOrganization: '' as string,
      jointlyOrganizationMembersWithLogedUser: [] as AppApiResponse.Users,
    };
  },
  computed: {
    companyOrganizations() {
      return (
        organizations: Array<ApiResponse.GroupOrganization>
      ): Array<ApiResponse.GroupOrganization> => {
        return organizations.filter(
          (o: ApiResponse.GroupOrganization) => o.layer === 0
        );
      };
    },
    departmentOrganizations() {
      return (
        organizations: Array<ApiResponse.GroupOrganization>
      ): Array<ApiResponse.GroupOrganization> => {
        return organizations.filter(
          (o: ApiResponse.GroupOrganization) => o.layer === 1 || o.layer === 2
        );
      };
    },
  },
  async created() {
    this.organizations = (await fetchOrganizations()).data.organizations;
    const loginUserOrganizationUuid = this.$accessor.userProfile
      .organization_uuid;
    if (loginUserOrganizationUuid) {
      this.jointlyOrganizationMembersWithLogedUser = (
        await fetchOrganizationUsers(loginUserOrganizationUuid)
      ).data.users;
    }
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onSubmit() {
      if (this.start_date) {
        this.searchPrams.start_date = toUtcDateTimestamp(this.start_date);
      }
      if (this.end_date) {
        this.searchPrams.end_date = toUtcDateTimestamp(this.end_date);
      }
      if (this.company) {
        this.searchPrams.company_organization_uuid = this.company;
      }
      if (this.sendUser) {
        this.searchPrams.user_uuid = this.sendUser;
      }
      if (this.departmentOrganization) {
        this.searchPrams.department_organization_uuid = this.departmentOrganization;
      }
      this.searchPrams.page = 1;
      this.$emit('submit', this.searchPrams);
      this.onClose();
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
  width: 720px;
  background: $true_white;
  border-radius: 6px;
  padding: 10px 10px 20px 30px;
  box-shadow: 0 0 3px $light_gray;
}

.modal-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: $dark_blue;
  margin: 0 0 7px 0;
}

.modal-contents {
  display: flex;
  flex-direction: column;
  padding-top: 18px;
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

.grid {
  display: flex;
  margin-bottom: 20px;
}

.column {
  flex: 1;
  min-width: 0;
  word-wrap: break-word;
  padding: 5px 10px;
}

.search-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  cursor: pointer;
}

.search-button {
  width: 200px;
}

.search-button-text {
  font-weight: bold;
}

.text-box {
  padding: 5px 8px;
  border-radius: 6px;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 2px solid #ccc;
  border-bottom: 2px solid #ccc;
  font-size: 16px;
}

.start-date {
  width: 400px;

  &::after {
    content: '〜';
    font-weight: bold;
    margin-left: 5px;
    margin-right: 5px;
    color: $dark_blue;
  }
}

.empty-title {
  margin-bottom: 5px;
}

.w-100 {
  width: 100%;
}

.icon-cross {
  cursor: pointer;
  width: 28px;
}

.select {
  width: 200px;
  height: 40px;
  border: 1px solid $light_gray_blue_3;
  background-color: $extra_light_gray;
  border-radius: 4px;
  color: $gray_blue_4;
  font-size: 13px;
  font-weight: 300;
  padding: 0 0 0 8px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('/icon/icon_pulldown.svg');
  background-repeat: no-repeat;
  background-size: 10px 8px;
  background-position: right 8px center;

  &::-ms-expand {
    display: none;
  }
}

.input {
  width: 200px;
  height: 40px;
  border: 1px solid $light_gray_blue_3;
  background-color: $extra_light_gray;
  border-radius: 4px;
  color: $gray_blue_4;
  font-size: 13px;
  font-weight: 300;
  padding: 0 0 0 8px;
}

::placeholder {
  color: $placeholder_gray;
}

.date-input {
  width: 200px;
}
</style>
