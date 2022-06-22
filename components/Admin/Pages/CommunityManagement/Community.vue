<template>
  <div>
    <div class="community-status">
      <div class="left-side">
        <div class="name-box">
          <label v-if="community.is_official" class="official">
            公式
          </label>
          <label v-if="community.type === 'business'" class="type">
            ビジネス
          </label>
          <div class="name">{{ community.name }}</div>
        </div>
        <base-button
          v-if="community.filled_required"
          class="detail-button"
          @click="
            $router.push(`/admin/community-management/detail/${community.uuid}`)
          "
          >詳細編集・削除</base-button
        >
        <base-button
          v-else
          class="detail-button-edit"
          @click="
            $router.push(`/admin/community-management/detail/${community.uuid}`)
          "
          >詳細未設定</base-button
        >
        <div>
          <span class="member">
            メンバー：
          </span>
          <span class="member-count"
            >{{ community.community_user_count }}名</span
          >
        </div>
        <div class="post-rule-label">投稿ルール：</div>
        <div>
          <BaseSelect
            v-model="community.community_team_episode"
            class="type-select select"
            :items="[
              { name: '一般', value: 'normal' },
              { name: 'ゆっくり', value: 'slowly' },
              { name: '頻繁', value: 'frequent' },
              { name: '催促なし', value: 'none' },
            ]"
            required
            @input="
              onChangePostRule(community.community_team_episode, community.uuid)
            "
          />
        </div>
      </div>
      <div>
        <integrated-switch-button
          v-model="community.status"
          :items="[
            { value: 'public', text: '公開' },
            { value: 'private', text: '非公開' },
          ]"
          @input="(status) => togglePublicStatus(status, community.uuid)"
        />
      </div>
    </div>
    <div class="users">
      <scrollable-tabs
        class="tabs"
        :companies="[
          { name: '全てを表示', uuid: 'all' },
          ...Object.values(community.companies),
        ]"
        display-user-count
        :current-id="selectedCompanyUuid"
        @change-tab="changeTab"
      />
      <div class="wrapper">
        <OrganizationMemberTable
          ref="members"
          :users="filteredUsers"
          @delete-user="onDeleteUser"
        />
      </div>
    </div>
    <!-- TODO: 仕様が確定してから実装するが挙動はみたいとのことなので disabled 外す -->
    <add-button
      class="add-member"
      @click="$emit('open-add-user-modal', community.uuid)"
    >
      このコミュニティにメンバーを追加
    </add-button>

    <CheckDelete
      v-if="deleteUserModal"
      delete-button-text="削除"
      @click="deleteUser"
      @close="deleteUserModal = false"
    >
      <div class="delete-message">
        このメンバーをコミュニティから削除しますか？<br />
        <p class="delete-message__red">
          削除した場合、コミュニティにメンバーが不在となるためコミュニティ自体削除されます。
        </p>
      </div>
    </CheckDelete>
    <div class="alert-modal">
      <AlertMessage
        v-if="isAlertModalVisible"
        button-text="OK"
        gray-button
        @close="
          isAlertModalVisible = !isAlertModalVisible;
          alertModalMessage2 = '';
        "
      >
        <p>
          {{ alertModalMessage }}
        </p>
        <p v-if="alertModalMessage2.length > 0">
          {{ alertModalMessage2 }}
        </p>
      </AlertMessage>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import {
  AddButton,
  IntegratedSwitchButton,
  OrganizationMemberTable,
} from '@/components/Admin/Pages';
import ScrollableTabs from '@/components/Admin/Modules/Tab/ScrollableTabs.vue';
import BaseButton from '@/components/Admin/Modules/Button/BaseButton.vue';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';
import {
  deleteCommunityUser,
  publishCommunity,
  unPublishCommunity,
  updateCommunityRule,
} from '@/libs/api';
import { CheckDelete, AlertMessage } from '@/components/Admin/Modules/Modal';

type Organization = pick<ApiResponse.Organization, 'uuid' | 'name'>;

export default Vue.extend({
  components: {
    IntegratedSwitchButton,
    OrganizationMemberTable,
    ScrollableTabs,
    BaseButton,
    AddButton,
    CheckDelete,
    AlertMessage,
    BaseSelect,
  },
  props: {
    community: {
      type: Object as PropType<ApiResponse.Community>,
      required: true,
    },
  },
  data() {
    return {
      selectedCompanyUuid: 'all' as string,
      alertModalMessage: '',
      alertModalMessage2: '',
      isAlertModalVisible: false,
      deleteUserModal: false,
      deleteUserModalUuid: '' as string,
    };
  },
  computed: {
    filteredUsers(): ApiResponse.CommunityUser[] {
      if (this.selectedCompanyUuid === 'all') {
        return Object.values(this.community.companies).flatMap(
          (company: ApiResponse.CommunityCompany) => company.users
        );
      }

      const selectedCompany = Object.values(this.community.companies).find(
        (company: ApiResponse.CommunityCompany) =>
          company.uuid === this.selectedCompanyUuid
      );

      if (selectedCompany == null) {
        throw new Error('invalid company uuid.');
      }

      this.$refs.members.clearMembers();
      return selectedCompany.users;
    },
  },
  methods: {
    changeTab(uuid: string) {
      this.selectedCompanyUuid = uuid;
    },
    async onChangePostRule(value: ApiRequest.Interval, uuid: string) {
      try {
        await updateCommunityRule({
          rules: [
            {
              uuid,
              community_team_episode: value,
            },
          ],
        });
      } catch (e) {
        console.error(e);
      }
    },
    async togglePublicStatus(status: 'private' | 'public', uuid: string) {
      switch (status) {
        case 'public':
          try {
            await publishCommunity(uuid);
          } catch (e) {
            this.community.status = 'private';
            this.alertModalMessage = '詳細が未登録です。';
            this.alertModalMessage2 =
              '詳細から必須項目を記入した後、コミュニティが公開できます。';
            this.isAlertModalVisible = true;
          }
          break;

        case 'private':
          try {
            await unPublishCommunity(uuid);
          } catch (error) {
            this.community.status = 'public';
            this.alertModalMessage = 'コミュニティを非公開にできませんでした。';
            this.isAlertModalVisible = true;
          }
          break;
        default:
          break;
      }
    },
    onDeleteUser(userUuid: string) {
      this.deleteUserModalUuid = userUuid;

      if (this.community.community_user_count === 1) {
        this.deleteUserModal = true;
      } else {
        this.deleteUser();
      }
    },
    async deleteUser() {
      try {
        await deleteCommunityUser(this.community.uuid, {
          users: [this.deleteUserModalUuid],
        });
        this.deleteUserModal = false;
        this.$emit('refresh-community-user');
      } catch (e) {
        console.error(e);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.community {
  margin-top: 40px;
}

.community-status {
  color: $dark_blue;
  border-top: solid 4px $light_gray_blue_3;
  border-bottom: solid 1px $light_gray_blue_3;
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 65px;
  padding: 15px;
  align-items: center;

  .left-side {
    display: flex;
    align-items: center;
  }

  .name-box {
    display: flex;
    background-color: $true_white;
    align-items: center;
    border-radius: 4px;
    height: 100%;

    .official,
    .type {
      height: 30px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 4px;
    }

    .official {
      padding: 3px 9px;
      border: solid 2px $light_gray_blue_3;
    }

    .type {
      padding: 5px 9px;
      background-color: #c6c6c6;
      color: $true_white;
      margin-left: 5px;
    }

    .name {
      max-width: 150px;
      font-size: 15px;
      font-weight: 600;
      margin-left: 10px;
    }
  }

  .member {
    font-size: 13px;
    font-weight: 300;
    margin-left: 15px;
  }

  .member-count {
    font-size: 15px;
    font-weight: 600;
  }

  .post-rule-label {
    font-size: 13px;
    font-weight: 300;
    border-left: solid 1px $light_gray_blue_3;
    height: 30px;
    line-height: 31px;
    margin-left: 20px;
    padding-left: 20px;
  }

  .select {
    background-color: $extra_light_gray;
    color: $gray_blue_4;
    border-color: $light_gray_blue_3;
    border-radius: 4px;
    height: 40px;
    width: 300px;
    font-size: 13px;
    font-weight: 300;

    & /deep/ .vs__dropdown-toggle {
      padding-top: 7px;
      padding-bottom: 7px;
      border-color: $light_gray_blue_3;
    }

    & /deep/ .vs__selected {
      color: $gray_blue_4;
    }
  }

  .type-select {
    width: 128px;
    height: 30px;
  }

  .post-rule {
    border: solid 1px $light_gray_blue_3;
    border-radius: 4px;
    color: $gray_blue_4;
    background-color: $extra_light_gray;
    height: 30px;
    width: 128px;
    padding: 0 4px;
    margin-left: 8px;
  }

  .detail-button {
    padding: 0 10px;
    margin-left: 20px;
    min-width: 110px;
    background-color: $light_gray_blue_4;
    color: $gray_blue_4;
    border: 1px solid $light_gray_blue_3;
    white-space: nowrap;
    line-height: 1em;

    &:hover {
      background-color: $light_gray_blue_1;
    }
  }

  .detail-button-edit {
    padding: 0 10px;
    margin-left: 20px;
    min-width: 110px;
    background-color: $pink;
    color: $true_white;
    line-height: 1em;
  }

  .toggle {
    position: absolute;
    right: 0;
    top: 0;
    height: 36px;
  }
}

.users {
  .tabs {
    margin-top: 15px;
    height: 40px;
  }

  .tabs /deep/ .tab {
    height: 40px;
  }

  .wrapper {
    margin-top: 15px;
    max-height: 282px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #7e8195 white;
  }

  .wrapper::-webkit-scrollbar {
    width: 4px;
    height: 0;
  }

  .wrapper::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #7e8195;
  }
}

.company-name-box {
  padding: 15px 0;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 25px;

  .active {
    font-weight: 700;
  }
}

.add-member {
  margin-top: 15px;

  &:disabled {
    opacity: 0.5;
  }
}

.alert-modal {
  /deep/ .modal-content {
    flex-direction: column;
  }
}

.delete-message {
  display: block;

  &__red {
    color: red;
  }
}
</style>
