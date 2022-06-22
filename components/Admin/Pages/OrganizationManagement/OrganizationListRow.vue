<template>
  <tr>
    <td class="table__publish">
      <select
        v-model="organization.status"
        class="select"
        name="status"
        @change="changePublicSelectTag"
      >
        <option value="public">公開</option>
        <option value="private">非公開</option>
      </select>
    </td>
    <td class="table__type">
      <select
        v-model="organization.type"
        class="select"
        name="type"
        @change="changeTypeSelectTag()"
      >
        <option v-if="!organization.type" value="null">未属性</option>
        <option value="department">部署</option>
        <option value="branch" selected>支店</option>
        <option value="shop">店舗</option>
        <option value="management">経営陣</option>
        <option value="other">その他</option>
      </select>
    </td>
    <td
      class="table__organization"
      :class="'table__type--' + organization.type"
    >
      <div
        :class="{
          child: parentOrganizationName != '',
          last: isLastChild,
          ...attributeColor,
        }"
      >
        <LineClampPopper :text="parentOrganizationName" is-ruby />
        <LineClampPopper :text="organization.name" />
      </div>
    </td>
    <td class="table__detail">
      <button
        v-if="organization.user_count !== 0"
        class="btn btn-gray"
        @click="clickGoToDetail()"
      >
        変更
      </button>
      <button v-else class="btn btn-pink" @click="clickGoToDetail()">
        未登録
      </button>
    </td>
    <td class="table__leader-name">
      <div class="table__leader-name_box">
        <template v-if="organization.leader && organization.leader.name">
          <LineClampPopper :text="organization.leader.name" />
          <router-link
            :to="
              `/admin/employee-management/employees/${organization.leader.uuid}`
            "
            ><button class="btn btn-gray btn-right">詳細</button></router-link
          >
        </template>
      </div>
    </td>
    <td class="table__member">
      <div class="table__member_box">
        {{ organization.user_count }}人
        <button
          v-if="organization.user_count !== 0"
          class="btn btn-gray btn-right"
          @click="clickGoToMember()"
        >
          変更
        </button>
        <button
          v-else
          class="btn btn-pink btn-right"
          @click="clickGoToMember()"
        >
          未登録
        </button>
      </div>
    </td>
    <td class="table__group">
      {{ formattedGroups(organization.groups) }}
    </td>
    <td class="table__my-episode">
      <template v-if="postRule">
        <select-post-rule
          v-model="postRule.my_episode"
          class="select"
          :rule="configRules.my_episode"
          @input="updatePostRule()"
        />
      </template>
    </td>
    <td class="table__team-episode">
      <template v-if="postRule">
        <select-post-rule
          v-model="postRule.team_episode"
          class="select"
          :rule="configRules.team_episode"
          @input="updatePostRule()"
        />
      </template>
    </td>
    <td class="table__alert">
      <template v-if="postRule">
        <select-alert
          v-model="postRule.alert"
          class="select select--alert"
          :rule="configRules.alert"
          @input="updatePostRule()"
        />
      </template>
    </td>
    <td class="table__profile">
      <template v-if="postRule">
        <select-post-rule
          v-model="postRule.profile"
          class="select"
          :rule="configRules.profile"
          @input="updatePostRule()"
        />
      </template>
    </td>
    <td class="table__access">
      {{ formattedDate(organization.latest_access_date) }}
    </td>
    <td class="table__delete">
      <div class="grid-table-column btn-delete" @click="clickDeleteBtn">
        <img class="icon-delete" src="/icon/icon_delete.svg" alt="" />
      </div>
    </td>
    <check-delete
      v-if="showDeleteModal"
      delete-button-text="完全に削除"
      @close="closeDeleteModal"
      @click="execDeleteOrganization()"
    >
      <div>
        この部署を完全に削除しますか？<br />
        <span style="color: #f00;">
          削除した場合、登録している情報を元に戻すことはできません。
          <br />所属しているメンバーは無所属に変更になります。
        </span>
      </div>
    </check-delete>

    <check-delete
      v-if="showPublicSelectTagModal"
      delete-button-text="変更"
      class="alert"
      @close="cancelChangePublicSelectTag"
      @click="execChangePublicSelectTag()"
    >
      <div v-if="organization.layer === 1">
        <span v-if="currentPublicSelectTag === 'public'">
          非公開に変更しますか？<br />更新した場合、このBOXに紐づく子BOXが公開設定と<br />なっていてもSpotwrite上で非公開になります。
        </span>
        <span v-else>
          公開に変更しますか？<br />このBOXに紐づく子BOXが公開設定になっている場合、<br />自動的に公開されます。
        </span>
      </div>
      <div v-if="organization.layer === 2">
        <span v-if="currentPublicSelectTag === 'public'">
          非公開に変更しますか？<br />変更した場合、spotwriteには表示されません。
        </span>
        <span v-else>
          公開に変更しますか？<br />変更した場合、spotwriteに表示されます。
        </span>
      </div>
    </check-delete>

    <check-delete
      v-if="showTypeSelectTagModal"
      delete-button-text="変更"
      @close="cancelChangeTypeSelectTag"
      @click="execChangeTypeSelectTag()"
    >
      属性を変更しますか？<br />
      属性を変更した場合、入力済みの詳細情報は破棄され<br />
      新たに詳細情報を登録する必要があります。
    </check-delete>

    <check-delete
      v-if="showUnregisteredModal"
      delete-button-text="メンバーを登録"
      @close="cancelUnregisteredModal"
      @click="execUnregisteredModal()"
    >
      選択されたBOXはメンバーが未登録です。<br />
      詳細ページを編集するためにはメンバー追加する必要があります。
    </check-delete>
    <alert-message
      v-if="showOrganizationUnregistedModal"
      button-text="閉じる"
      class="alert-message"
      @close="hideOrganizationUnregistedModal()"
    >
      <div
        v-if="modalOrganizationUnregistedText === 'member'"
        class="alert-message__text"
      >
        メンバー追加には組織(BOX) 名と属性の登録が必要です。<br />
        「未定」をクリックで表示されるポップアップから<br />
        組織(BOX)名と属性を登録して下さい。
      </div>
      <div
        v-if="modalOrganizationUnregistedText === 'public'"
        class="alert-message__text"
      >
        組織(BOX)の公開には組織(BOX) 名と属性の<br />
        登録が必要です。<br />
        組織(BOX)名と属性を登録して下さい。
      </div>
      <div
        v-if="modalOrganizationUnregistedText === 'detail'"
        class="alert-message__text"
      >
        詳細情報の登録には組織(BOX) 名及び属性の登録が必要です。<br />
        組織(BOX) 名及び属性を登録して下さい。
      </div>
    </alert-message>
  </tr>
</template>

<script lang="ts">
import Vue from 'vue';
import { LineClampPopper } from '@/components/Admin/Modules/Popper';
import { CheckDelete, AlertMessage } from '@/components/Admin/Modules/Modal';
import SelectPostRule from '@/components/Admin/Pages/PostRule/SelectPostRule.vue';
import SelectAlert from '@/components/Admin/Pages/PostRule/SelectAlert.vue';
import {
  fetchOrganizationRule,
  updateOrganization,
  updateOrganizationRule,
} from '@/libs/api';
import dayjs from 'dayjs';

export default Vue.extend({
  components: {
    CheckDelete,
    LineClampPopper,
    SelectPostRule,
    SelectAlert,
    AlertMessage,
  },
  props: {
    organization: {
      type: Object,
      required: true,
    },
    parentOrganizationName: {
      type: String,
      required: false,
      default: '' as string,
    },
    parentOrganizationType: {
      type: String,
      required: false,
      default: '' as string,
    },
    configRules: {
      type: Object,
      default: () => ({} as ApiResponse.ConfigRules),
    },
    isLastChild: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      showDeleteModal: false as boolean,
      showPublicSelectTagModal: false as boolean,
      currentPublicSelectTag: '' as string,
      currentTypeSelectTag: '' as string,
      tempUuid: '' as string,
      showProcedure: false as boolean,
      showTypeSelectTagModal: false as boolean,
      showUnregisteredModal: false as boolean,
      postRule: null as null | ApiResponse.OrganizationRule,
      showOrganizationUnregistedModal: false as boolean,
      modalOrganizationUnregistedText: '' as string,
    };
  },
  computed: {
    attributeColor(): {} {
      switch (this.parentOrganizationType) {
        case 'department':
          return { department: true };
        case 'branch':
          return { branch: true };
        case 'shop':
          return { shop: true };
        case 'management':
          return { management: true };
        case 'other':
          return { other: true };
        default:
          return { null: true };
      }
    },
  },
  mounted() {
    this.currentPublicSelectTag = this.organization.status;
    this.currentTypeSelectTag = this.organization.type;
    this.fetchPostRule();
  },
  methods: {
    async fetchPostRule() {
      try {
        const {
          data: { rules },
        } = await fetchOrganizationRule(this.organization.uuid);
        // @ts-ignore
        [this.postRule] = rules;
      } catch (error) {
        console.error(error);
      }
    },
    updatePostRule() {
      try {
        const rules = [this.postRule!];
        updateOrganizationRule({
          // @ts-ignore
          rules,
        });
      } catch (error) {
        console.error(error);
      }
    },
    clickGoToDetail() {
      if (this.organization.type === 'department') {
        this.$router.push({
          path: `/admin/organization-management/organizations/departments/${this.organization.uuid}`,
        });
      } else if (
        this.organization.type === 'shop' ||
        this.organization.type === 'branch'
      ) {
        this.$router.push({
          path: `/admin/organization-management/organizations/shops/${this.organization.uuid}`,
        });
      } else if (this.organization.type === 'management') {
        this.$router.push({
          path: `/admin/organization-management/organizations/managements/${this.organization.uuid}`,
        });
      } else if (this.organization.type === 'other') {
        this.$router.push({
          path: `/admin/organization-management/organizations/others/${this.organization.uuid}`,
        });
      } else {
        this.modalOrganizationUnregistedText = `detail`;
        this.showOrganizationUnregistedModal = true;
      }
    },
    formattedGroups(groups: Types.OrganizationGroup[]): string {
      // eslint-disable-next-line func-names
      const groupNames = groups.map(function(group: Types.OrganizationGroup) {
        // @ts-ignore
        return group.name;
      });
      return groupNames.join(' ');
    },
    clickDeleteBtn() {
      this.showDeleteModal = true;
    },
    formattedDate(unixTime: number): string {
      if (!unixTime) return '';
      return dayjs.unix(unixTime).format('YYYY/MM/DD');
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
    },
    changePublicSelectTag() {
      if (
        this.organization.name === '組織名' ||
        this.organization.type === null
      ) {
        this.modalOrganizationUnregistedText = `public`;
        this.showOrganizationUnregistedModal = true;
      } else {
        this.showPublicSelectTagModal = true;
      }
    },
    async execChangePublicSelectTag() {
      this.$emit(
        'changePublic',
        this.organization.uuid,
        this.organization.status
      );
      this.currentPublicSelectTag = this.organization.status;
      this.showPublicSelectTagModal = false;
    },
    cancelChangePublicSelectTag() {
      this.showPublicSelectTagModal = false;
      this.organization.status = this.currentPublicSelectTag;
    },
    changeTypeSelectTag() {
      this.showTypeSelectTagModal = true;
    },
    async execChangeTypeSelectTag() {
      await updateOrganization(this.organization.uuid, {
        name: this.organization.name,
        kana: this.organization.kana,
        type: this.organization.type,
        pos: this.organization.pos,
      });
      this.showTypeSelectTagModal = false;
    },
    cancelChangeTypeSelectTag() {
      this.showTypeSelectTagModal = false;
      this.organization.type = this.currentTypeSelectTag;
    },
    clickUnregisteredBtn() {
      this.showUnregisteredModal = true;
    },
    execUnregisteredModal() {
      this.$router.push(
        `/admin/employee-management/employees/list/${this.organization.relations.company}`
      );
    },
    cancelUnregisteredModal() {
      this.showUnregisteredModal = false;
    },
    execDeleteOrganization() {
      this.$emit('delete', this.organization.uuid);
      this.showDeleteModal = false;
    },
    clickGoToMember() {
      if (
        this.organization.name === '組織名' ||
        this.organization.type === null
      ) {
        this.modalOrganizationUnregistedText = `member`;
        this.showOrganizationUnregistedModal = true;
      } else {
        this.$router.push(`/admin/employee-management/registration`);
      }
    },
    hideOrganizationUnregistedModal() {
      this.organization.status = this.currentPublicSelectTag;
      this.showOrganizationUnregistedModal = false;
    },
  },
});
</script>

<style lang="scss" scoped>
$color_department: $blue;
$color_branch: $light_blue_green_1;
$color_shop: $purple_1;
$color_management: $wild_blue_yonder;
$color_other: $hopbush;
$color_null: $gray_blue_1;

* {
  color: $dark_blue;
}

.btn {
  width: 45px;
  height: 30px;
  border-radius: 15px;
  font-weight: bold;
  font-size: 13px;
  padding: 0;

  &-right {
    float: right;
  }

  &-gray {
    background-color: $light_gray_blue_4;
    border: 1px solid $light_gray_blue_3;
    color: $gray_blue_4;
  }

  &-pink {
    background-color: $pink;
    border: none;
    color: $true_white;
  }

  &-delete {
    cursor: pointer;
  }
}

.type-tag {
  background-color: #0063b9;

  &--blue {
    background-color: #0063b9;
  }

  &--yellow {
    background-color: #e9b653;
  }

  &--green {
    background-color: #87c34b;
  }
}

.select {
  height: 100%;
  min-height: 30px;
  width: 100%;
  font-size: 12px;
  color: $gray_blue_4;
  background-color: $extra_light_gray;
  border: 1px solid $light_gray_blue_3;
  border-radius: 4px;
  padding-left: 8px;
  appearance: none;
  background-image: url('/icon/icon_pulldown.svg');
  background-repeat: no-repeat;
  background-size: 10px 8px;
  background-position: right 4px center;

  &--alert {
    padding-right: 20px;
  }
}

.child {
  position: relative;
  padding: 0 0 0 30px;
  box-sizing: border-box;

  &::before {
    position: absolute;
    top: 14px;
    left: 8px;
    width: 14px;
    height: 2px;
    margin: auto;
    content: '';
    background-color: $white_1;
  }

  &::after {
    position: absolute;
    top: -12px;
    bottom: 0;
    left: 8px;
    width: 2px;
    height: 50px;
    content: '';
    background-color: $white_1;
  }

  &.last::before {
    border-bottom-left-radius: 30px;
  }

  &.last::after {
    height: 27px;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 10px;
  }
}

.table {
  td {
    border: 1px solid $light_gray_blue_3;
    height: 40px;
    vertical-align: middle;
  }

  &__publish {
    width: 82px;
    padding: 4px;
  }

  &__type {
    width: 82px;
    padding: 4px;

    &--department {
      background-color: $color_department;
    }

    &--branch {
      background-color: $color_branch;
    }

    &--shop {
      background-color: $color_shop;
    }

    &--management {
      background-color: $color_management;
    }

    &--other {
      background-color: $color_other;
    }

    &--null {
      background-color: $color_null;
    }
  }

  &__organization {
    width: 245px;
    line-height: 14px;
    padding: 5px;

    /deep/ .ruby,
    /deep/ .text {
      color: $true_white;
    }
  }

  &__detail {
    padding: 5px;
  }

  &__leader-name {
    width: 160px;
    padding: 5px;

    &_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-left: 5px;
    }
  }

  &__member {
    width: 94px;
    text-align: center;
    padding: 5px;

    &_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
    }
  }

  &__group {
    width: 200px;
    padding: 5px;
  }

  &__my-episode {
    width: 140px;
    padding: 4px;
  }

  &__team-episode {
    width: 140px;
    padding: 4px;
  }

  &__alert {
    width: 130px;
    padding: 4px;
  }

  &__profile {
    width: 140px;
    padding: 4px;
  }

  &__access {
    width: 100px;
    text-align: center;
  }

  &__delete {
    width: 60px;
    text-align: center;
  }

  .alert /deep/ .modal-content {
    white-space: pre-line;
  }
}
</style>
