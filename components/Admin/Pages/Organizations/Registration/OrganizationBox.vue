<template>
  <div :ref="'card' + parent.uuid" class="box">
    <div class="box-header">
      <toggle-button
        v-model="parent.status"
        class="switch-button"
        :name="'switch-button-' + parent.uuid"
        size="small"
        :contents="[
          { label: '公開', value: 'public' },
          { label: '非公開', value: 'private' },
        ]"
        @change="() => togglePublishStatus(parent)"
      />
      <img
        v-if="!isDetailRegistered(parent)"
        src="/icon/label_unregistered_button.svg"
        class="detail-registration"
        alt="未登録ボタン"
        @click="goToDetail(parent)"
      />
    </div>
    <img
      src="/icon/icon_gear.svg"
      class="parent-icon-gear"
      @click="toggleOrganizationEditModal()"
    />

    <div class="parent-name">
      <img
        v-if="isChild"
        class="lable-child-box"
        src="/icon/lable_childbox.svg"
        @click="toggleChildrenBoxModal()"
      />
      <span @click="toggleUpdateParentModal()">{{ parent.name }}</span>
    </div>
    <div class="parent-icon-add-area">
      <div class="parent-icon-add-container">
        <button
          class="button-add button-add-member"
          :style="[isChild ? { float: 'left' } : '']"
          @click="addMember()"
        >
          メンバー
          <span class="font-bold">{{ parent.user_count }}名</span>
          <div class="button-add__pink-add-icon pink-add-icon" />
        </button>
        <button
          v-if="!isChild"
          class="button-add button-add-child-box"
          @click="toggleChildrenBoxModal()"
        >
          子BOX
          <span class="font-bold">({{ countChildBox(parent.uuid) }})</span>
          <div class="pink-add-icon" />
        </button>
      </div>
    </div>
    <organization-edit-modal
      v-if="organizationEditModal && !isChild"
      :offset-top="offsetTop"
      :offset-left="offsetLeft"
      :parent="parent"
      :subordinated-children-exist="countSubordinatedChildren()"
      :same-company-parents="pickSameCompanyParents()"
      @close="toggleOrganizationEditModal"
      @delete="toggleDeleteOrganizationModal"
      @move="moveOrganization"
      @goToDetail="goToDetail"
    />
    <child-organization-edit-modal
      v-if="organizationEditModal && isChild"
      :offset-top="offsetTop"
      :offset-left="offsetLeft"
      :child="parent"
      :same-company-parents="pickSameCompanyParents()"
      @close="toggleOrganizationEditModal"
      @delete="toggleDeleteOrganizationModal"
      @move="moveOrganization"
      @goToDetail="goToDetail"
    />
    <update-parent-modal
      v-if="updateParentModal"
      :offset-top="offsetTop"
      :offset-left="offsetLeft"
      :parent="parent"
      :same-company-parents="pickSameCompanyParents()"
      :subordinated-children-exist="countSubordinatedChildren()"
      @click="checkChangeOrganization"
      @close="toggleUpdateParentModal"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import _ from 'lodash';
import { ToggleButton } from '@/components/Admin/Modules/Button';
import {
  OrganizationEditModal,
  UpdateParentModal,
} from '@/components/Admin/Pages';
import ChildOrganizationEditModal from '@/components/Admin/Pages/Organizations/Registration/ChildOrganizationEditModal.vue';

export default Vue.extend({
  components: {
    ToggleButton,
    OrganizationEditModal,
    UpdateParentModal,
    ChildOrganizationEditModal,
  },
  props: {
    parent: {
      type: Object as PropType<Types.GroupOrganization>,
      required: true,
    },
    organizations: {
      type: Array as PropType<Types.GroupOrganization[]>,
      required: true,
    },
    itemNumber: {
      type: Number,
      required: true,
    },
    isChild: {
      default: false,
      type: Boolean,
      required: false,
    },
    nestedOrganizations: {
      type: Array as PropType<Types.GroupOrganization[]>,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      organizationEditModal: false as boolean,
      updateParentModal: false as boolean,
      offsetTop: 0 as number,
      offsetLeft: 0 as number,
    };
  },
  computed: {
    initialOrganizationName(): string {
      return '組織名';
    },
    initialOrganizationKana(): string {
      return 'そしきめい';
    },
    countChildBox() {
      return (uuid: string) => {
        return this.organizations.filter(
          (o: Types.GroupOrganization) => o.relations.parent === uuid
        ).length;
      };
    },
  },
  methods: {
    setOffset(element: HTMLInputElement) {
      this.offsetTop = element.getBoundingClientRect().top;
      this.offsetLeft = element.getBoundingClientRect().left;
      this.offsetTop =
        this.offsetTop + 320 + 75 > window.innerHeight
          ? window.innerHeight - 320
          : this.offsetTop + 75;
      // 画面幅が狭いときにModalを画面の内側に表示するためのコード
      if (window.innerWidth <= 1350 && this.itemNumber % 4 === 0) {
        this.offsetLeft -= 210;
      }
    },
    isDetailRegistered(organization: Types.GroupOrganization) {
      return (
        organization.name !== this.initialOrganizationName &&
        organization.kana !== this.initialOrganizationKana
      );
    },
    togglePublishStatus(organization: Types.GroupOrganization) {
      this.$emit('togglePublishStatus', organization);
    },
    goToDetail(organization: Types.GroupOrganization) {
      this.$emit('goToDetail', organization);
    },
    toggleOrganizationEditModal() {
      if (!this.organizationEditModal) {
        // @ts-ignore
        this.setOffset(this.$refs[`card${this.parent.uuid}`]);
      }
      this.organizationEditModal = !this.organizationEditModal;
    },
    // @ts-ignore
    toggleUpdateParentModal() {
      if (!this.updateParentModal) {
        // @ts-ignore
        this.setOffset(this.$refs[`card${this.parent.uuid}`]);
      }
      this.updateParentModal = !this.updateParentModal;
    },
    toggleChildrenBoxModal() {
      this.$emit('toggleChildrenBoxModal', this.parent);
    },
    toggleDeleteOrganizationModal() {
      if (this.organizationEditModal) {
        this.toggleOrganizationEditModal();
      }
      this.$emit('toggleDeleteOrganizationModal', this.parent);
    },
    addMember() {
      this.$emit('addMember', this.parent);
    },
    countSubordinatedChildren() {
      // 移動する親組織の子組織の数
      const subordinatedChildrenCount: number = this.organizations.filter(
        (o: Types.GroupOrganization) => {
          return o.layer === 2 && o.relations.parent === this.parent.uuid;
        }
      ).length;
      return subordinatedChildrenCount > 0;
    },
    pickSameCompanyParents() {
      // 自分以外の同じ会社内の親BOX
      return this.organizations.filter((o: Types.GroupOrganization) => {
        return (
          o.uuid !== this.parent.uuid &&
          o.layer === 1 &&
          o.relations.company === this.parent.relations.company
        );
      });
    },
    moveOrganization({
      organization,
      destinationUuid,
    }: {
      organization: Types.GroupOrganization;
      destinationUuid: string;
    }) {
      this.$emit('moveOrganization', {
        organization,
        destinationUuid,
      });
      if (this.organizationEditModal) {
        this.toggleOrganizationEditModal();
      }
    },
    createPosition(targetList: any) {
      let position: number = 0;
      // @ts-ignore
      if (targetList.length > 0) {
        // @ts-ignore
        position = _.maxBy(targetList, 'pos').pos + 2 ** 16;
      } else {
        position = 2 ** 16;
      }
      return position;
    },
    checkChangeOrganization({
      organization,
      status,
    }: {
      organization: Types.GroupOrganization;
      status: string;
    }) {
      this.toggleUpdateParentModal();
      // 親要素・子要素の属性を変更するときのチェック
      // 親要素の場合
      const targetNestedOrganizations = this.nestedOrganizations;
      if (this.parent.type === organization.type || this.parent.type === null) {
        if (this.parent.type === null) {
          if (organization.type === 'management') {
            const organizationTypeManagement = targetNestedOrganizations.filter(
              (o: Types.GroupOrganization) => o.type === 'management'
            );
            Vue.set(
              organization,
              'pos',
              this.createPosition(organizationTypeManagement)
            );
          }
          if (
            organization.type !== null &&
            organization.type !== 'management'
          ) {
            const organizationTarget = targetNestedOrganizations.filter(
              (o: Types.GroupOrganization) =>
                o.type !== 'management' && o.type !== null
            );
            Vue.set(
              organization,
              'pos',
              this.createPosition(organizationTarget)
            );
          }
        }
        this.$emit(
          'updateOrganizationWithCheckDuplicate',
          organization,
          status,
          this.parent
        );
      } else {
        if (this.parent.type === 'management') {
          const organizationTarget = targetNestedOrganizations.filter(
            (o: Types.GroupOrganization) =>
              o.type !== 'management' && o.type !== null
          );
          Vue.set(organization, 'pos', this.createPosition(organizationTarget));
        }
        if (organization.type === 'management') {
          const organizationTypeManagement = targetNestedOrganizations.filter(
            (o: Types.GroupOrganization) => o.type === 'management'
          );
          Vue.set(
            organization,
            'pos',
            this.createPosition(organizationTypeManagement)
          );
        }
        this.$emit('toggleCheckUpdateModal', organization, status, this.parent);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
* {
  color: $dark_blue;
}

.box {
  position: absolute;
  width: 216px;
  padding: 7px;

  .box-header {
    position: absolute;
    display: flex;

    .switch-button {
      margin-right: 5px;
    }
  }
}

.button {
  &-add {
    border: none;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    font-size: 12px;
    padding: 1px 2px;

    &-member {
      width: 110px;
    }

    &-child-box {
      width: 86px;
    }

    &__pink-add-icon {
      margin-bottom: 1px;
    }
  }
}

.parent {
  height: 130px;
  min-width: 216px;
  padding: 7px;
  font-size: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;

  &-name {
    margin-top: 45px;
    width: 100%;
    font-size: 15px;
    color: $true_white;
    font-weight: bold;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    span {
      color: $true_white;
    }
  }

  &-icon-gear {
    width: 18px;
    height: 18px;
    float: right;
  }

  &-icon-add {
    &-container {
      text-align: center;

      .parent-icon-add:hover::before {
        display: block;
        position: absolute;
        width: 100px;
        content: '子BOXを追加';
        font-size: 12px;
        text-align: center;
        background-color: $true_white;
        border: 1px solid $light_gray_blue_3;
        border-radius: 4px;
        padding: 2px;
        top: 0;
        left: 0;
      }
    }

    &-area {
      margin-top: 25px;
      position: relative;
    }
  }
}

.detail-registration {
  display: block;
  cursor: pointer;
  width: 70px;
  height: 20px;
}

.font-bold {
  font-weight: bold;
}

.pink-add-icon {
  width: 16px;
  height: 16px;
  background-color: $pink;
  border-radius: 50%;
  background-position: center;
  background-image: url('/icon/icon_plus_white.svg');
  background-size: 8px 8px;
  background-repeat: no-repeat;
  display: inline-block;
  vertical-align: middle;
}

.lable-child-box {
  width: 25px;
  height: 9px;
  margin-bottom: 7px;
}
</style>
