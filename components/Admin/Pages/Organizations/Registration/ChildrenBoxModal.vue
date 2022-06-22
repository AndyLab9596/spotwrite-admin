<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" @click.self="onClose">
      <div class="modal-window">
        <div
          id="children-box-parent"
          class="parent"
          :class="'parent--' + parent.type"
        >
          <img
            src="/icon/icon_cross-white.png"
            class="icon-cross"
            @click="onClose"
          />
          <div class="parent-name">{{ parent.name }}</div>
          <div class="parent-box-count">
            子BOX（{{ nestedOrganizations.length }}）
          </div>
        </div>
        <draggable
          class="children"
          :list="nestedOrganizations"
          :animation="200"
          draggable=".draggable-item"
          @end="
            draggableEnd(
              $event,
              nestedOrganizations.length,
              nestedOrganizations
            )
          "
        >
          <div
            v-for="child in nestedOrganizations"
            :key="child.uuid"
            :ref="'card' + child.uuid"
            :class="{
              'draggable-item':
                child.type !== 'management' && child.type !== null,
            }"
            @dragstart="dragStart(child)"
            @dragend="dragEnd"
          >
            <div class="child" :class="'child--' + parent.type">
              <img
                src="/icon/icon_gear.svg"
                class="child-icon-gear"
                @click="toggleEditChildModal(child)"
              />
              <div class="box-header">
                <toggle-button
                  v-model="child.status"
                  class="switch-button"
                  :name="'switch-button-' + child.uuid"
                  size="small"
                  :contents="[
                    { label: '公開', value: 'public' },
                    { label: '非公開', value: 'private' },
                  ]"
                  @change="() => togglePublishStatus(child)"
                />
                <img
                  v-if="!isDetailRegistered(parent)"
                  src="/icon/label_unregistered_button.svg"
                  class="detail-registration"
                  alt="未登録ボタン"
                  @click="goToDetail(parent)"
                />
              </div>
              <span class="child-name" @click="update(child)">
                <img
                  src="/icon/label_childbox.svg"
                  :style="{ marginBottom: '2px' }"
                />
                {{ child.name }}
              </span>
              <div class="child-footer">
                <button
                  class="button-add button-add-member"
                  @click="addMember(child)"
                >
                  メンバー
                  <span class="member-count">{{ child.user_count }}名</span>
                  <div class="pink-add-icon" />
                </button>
              </div>
            </div>
          </div>
          <!-- Add new box -->
          <div
            :ref="'add-child' + parent.uuid"
            class="addnewbox add-child"
            draggable="false"
            @click="addChildrenBox(parent.uuid)"
          >
            <div class="add-child-text">
              <div class="add-child-icon" />
              子BOX追加
            </div>
          </div>
        </draggable>
        <child-organization-edit-modal
          v-if="editChildModal"
          :offset-top="offsetTop"
          :offset-left="offsetLeft"
          :child="propChildToEdit"
          :same-company-parents="sameCompanyParents"
          @close="toggleEditChildModal"
          @delete="onDelete"
          @move="moveOrganization"
          @goToDetail="goToDetail"
        />
        <update-child-modal
          v-if="updateChildModal"
          :offset-top="offsetTop"
          :offset-left="offsetLeft"
          :child="propChildToEdit"
          :same-company-parents="sameCompanyParents"
          @click="checkChangeOrganization"
          @close="toggleUpdateChildModal"
        />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import draggable from 'vuedraggable';
import _ from 'lodash';
import { createOrganization } from '@/libs/api';
import { ToggleButton } from '@/components/Admin/Modules/Button';
import UpdateChildModal from '@/components/Admin/Pages/Organizations/Registration/UpdateChildModal.vue';
import ChildOrganizationEditModal from '@/components/Admin/Pages/Organizations/Registration/ChildOrganizationEditModal.vue';

export default Vue.extend({
  components: {
    draggable,
    ToggleButton,
    UpdateChildModal,
    ChildOrganizationEditModal,
  },
  props: {
    organizations: {
      type: Array as PropType<Types.GroupOrganization[]>,
      required: true,
    },
    parent: {
      type: Object as PropType<Types.NestedParent>,
      required: true,
    },
  },
  data() {
    return {
      offsetTop: 0 as number,
      offsetLeft: 0 as number,
      editChildModal: false as boolean,
      updateChildModal: false as boolean,
      draggable: false as boolean,
      dragOrganization: {},
      organizationPublished: false,
      propChildToEdit: {} as Types.GroupOrganization,
    };
  },
  computed: {
    nestedOrganizations() {
      const children = this.organizations
        .filter(
          (o: Types.GroupOrganization) =>
            o.layer === 2 && o.relations.parent === this.parent.uuid
        )
        .sort((a: Types.GroupOrganization, b: Types.GroupOrganization) => {
          if (a.type === 'management' && b.type === 'management') {
            return a.pos - b.pos;
          }
          if (a.type === 'management') {
            return -1;
          }
          if (b.type === 'management') {
            return 1;
          }
          if (a.type === null && b.type === null) {
            return a.pos - b.pos;
          }
          if (a.type === null) {
            return 1;
          }
          if (b.type === null) {
            return -1;
          }
          return a.pos - b.pos;
        });
      return [...children];
    },
    sameCompanyParents() {
      // 親BOXを取得
      return this.organizations.filter(
        (organization: Types.GroupOrganization) =>
          organization.layer === 1 &&
          organization.relations.company === this.parent.relations.company
      );
    },
    initialOrganizationName(): string {
      return '組織名';
    },
    initialOrganizationKana(): string {
      return 'そしきめい';
    },
  },
  methods: {
    setOffset(element: HTMLInputElement) {
      this.offsetTop = element.getBoundingClientRect().top;
      this.offsetLeft = element.getBoundingClientRect().left - 9;
    },
    addChildrenBox(parentUuid: string) {
      if (this.parent.children === undefined) {
        return;
      }
      // 一番posが大きい親組織に(2^16)加える
      const companyUuid = this.parent.relations.company;
      const childrents = [...this.nestedOrganizations];
      let pos: number = 0;
      if (childrents && childrents.length > 0) {
        // @ts-ignore
        pos = _.maxBy(childrents, 'pos').pos + 2 ** 16;
      } else {
        pos = 2 ** 16;
      }
      const payload: ApiRequest.CreateOrganization = {
        name: this.initialOrganizationName,
        kana: this.initialOrganizationKana,
        type: null,
        parent_uuid: parentUuid,
        pos,
      };
      this.organizations.push({
        name: this.initialOrganizationName,
        kana: this.initialOrganizationKana,
        user_count: 0,
        uuid: '',
        groups: [],
        // @ts-ignore
        detail: {},
        leader: null,
        latest_access_date: 0,
        status: 'private',
        layer: 2,
        type: null,
        pos,
        relations: { company: companyUuid, parent: parentUuid },
      });
      this.parent.children.push({
        name: this.initialOrganizationName,
        kana: this.initialOrganizationKana,
        user_count: 0,
        uuid: '',
        groups: [],
        // @ts-ignore
        detail: {},
        leader: null,
        latest_access_date: 0,
        status: 'private',
        layer: 2,
        type: null,
        pos,
        relations: { company: companyUuid, parent: parentUuid },
      });

      const index = this.organizations.length - 1;
      this.createOrganization(payload, index);
    },
    // @ts-ignore
    toggleEditChildModal(child: Types.GroupOrganization) {
      if (!this.editChildModal) {
        // @ts-ignore
        const element = this.$refs[`card${child.uuid}`][0];
        this.setOffset(element);
        this.propChildToEdit = child;
      }
      this.editChildModal = !this.editChildModal;
    },
    onClose() {
      this.$emit('close');
    },
    draggableEnd(e: any, index: number, children: Types.GroupOrganization[]) {
      if (e.newIndex === index) return;
      if (children[e.oldIndex] === undefined) return;
      if (children[e.newIndex] === undefined) return;
      if (e.oldIndex !== e.newIndex) {
        this.emitEndEvent(e.newIndex);
      }
    },
    emitEndEvent(newIndex: number) {
      this.$emit('end', {
        newIndex,
        dragOrganization: this.dragOrganization,
        nestedChildren: this.nestedOrganizations,
      });
    },
    dragStart(child: Types.GroupOrganization) {
      if (!this.draggable) {
        this.dragOrganization = child;
      }
      this.draggable = true;
    },
    dragEnd() {
      this.draggable = false;
    },
    async createOrganization(
      payload: ApiRequest.CreateOrganization,
      index: number
    ) {
      try {
        const res = await createOrganization(payload);
        const organization = res.data;
        // @ts-ignore
        this.organizations.splice(index, 1, organization);
      } catch (err) {
        this.organizations.splice(index, 1);
        console.error(err);
      }
    },
    togglePublishStatus(organization: Types.GroupOrganization) {
      this.$emit('togglePublishStatus', organization);
    },
    addMember(organization: Types.GroupOrganization) {
      this.$emit('addMember', organization);
    },
    moveOrganization({
      organization,
      destinationUuid,
    }: {
      organization: Types.GroupOrganization;
      destinationUuid: string;
    }) {
      this.$emit('move', {
        organization,
        destinationUuid,
      });
    },
    goToDetail(organization: Types.GroupOrganization) {
      this.$emit('goToDetail', organization);
    },
    update(child: Types.GroupOrganization) {
      this.toggleUpdateChildModal({
        child,
        // @ts-ignore
        element: this.$refs[`card${child.uuid}`][0],
      });
    },
    // @ts-ignore
    toggleUpdateChildModal({
      child,
      element,
    }: {
      child: Types.GroupOrganization;
      element: HTMLInputElement;
    } = {}) {
      if (!element || !child) {
        this.updateChildModal = false;
        return;
      }
      if (!this.updateChildModal) {
        this.setOffset(element);
        this.propChildToEdit = child;
      }
      this.updateChildModal = !this.updateChildModal;
    },
    onDelete(organization: Types.GroupOrganization) {
      this.editChildModal = false;
      this.$emit('delete', organization);
    },
    isDetailRegistered(organization: Types.GroupOrganization) {
      return (
        organization.name !== this.initialOrganizationName &&
        organization.kana !== this.initialOrganizationKana
      );
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
      this.toggleUpdateChildModal();
      if (
        this.propChildToEdit.type === organization.type ||
        this.propChildToEdit.type === null
      ) {
        if (this.propChildToEdit.type === null) {
          // Case select type is management
          if (organization.type === 'management') {
            const organizationTypeManagement = this.nestedOrganizations.filter(
              (o: Types.GroupOrganization) => o.type === 'management'
            );
            Vue.set(
              organization,
              'pos',
              this.createPosition(organizationTypeManagement)
            );
          }
          // Case select type isn't management and not null
          if (
            organization.type !== null &&
            organization.type !== 'management'
          ) {
            const organizationTarget = this.nestedOrganizations.filter(
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
        this.$emit('updateChild', organization, status, this.propChildToEdit);
      } else {
        // Change form management type to any type
        if (this.propChildToEdit.type === 'management') {
          const organizationTarget = this.nestedOrganizations.filter(
            (o: Types.GroupOrganization) =>
              o.type !== 'management' && o.type !== null
          );
          Vue.set(organization, 'pos', this.createPosition(organizationTarget));
        }
        // Change to any type to management type
        if (organization.type === 'management') {
          const organizationTypeManagement = this.nestedOrganizations.filter(
            (o: Types.GroupOrganization) => o.type === 'management'
          );
          Vue.set(
            organization,
            'pos',
            this.createPosition(organizationTypeManagement)
          );
        }
        this.$emit(
          'toggleCheckUpdateModal',
          organization,
          status,
          this.propChildToEdit
        );
      }
    },
  },
});
</script>

<style lang="scss" scoped>
$color_department: $blue;
$color_branch: $light_blue_green;
$color_shop: $purple;
$color_management: $wild_blue_yonder;
$color_other: $hopbush;
$color_independent: $gray_blue_2;
$color_child_department: $blue;
$color_child_branch: $blue_green;
$color_child_shop: $purple_3;
$color_child_independent: $gray_blue_2;

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
  overflow-y: overlay;
}

.modal-window {
  display: flex;
  flex-direction: column;
  background: $true_white;
  border-radius: 4px;
  padding: 20px 30px;
  width: 732px;
  min-height: 418px;
  box-shadow: 0 0 5px $light_gray;
  max-height: 100%;
  overflow-y: overlay;
}

.parent {
  text-align: center;
  padding: 28px 0 60px 0;
  border: none;
  border-radius: 4px;
  width: 100%;
  height: 94px;
  box-sizing: border-box;
  position: relative;

  &-name {
    font-size: 18px;
    color: $true_white;
    font-weight: bold;
    line-height: 1;
    margin-bottom: 10px;
  }

  &-box-count {
    color: $true_white;
    line-height: 1;
  }

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
    background-color: $color_independent;
  }

  .icon-cross {
    cursor: pointer;
    position: absolute;
    top: 14px;
    right: 14px;
    width: 16px;
    height: 16px;
  }
}

.children {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  grid-gap: 12px 12px;
  width: 100%;
  margin-top: 12px;
}

.child {
  display: flex;
  flex-direction: column;
  width: 216px;
  height: 130px;
  font-size: 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: $true_white;
  font-weight: bold;
  padding: 7px;
  position: relative;

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
    background-color: $color_independent;
  }

  &-name {
    width: 100%;
    font-size: 15px;
    text-align: center;
    margin-top: 27.5px;
    cursor: pointer;
    line-height: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  &-icon-gear {
    width: 18px;
    height: 18px;
    object-fit: cover;
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 10;
  }

  &-icon-add {
    width: 14px;
    height: 14px;
    object-fit: cover;
    margin: 2px;
  }

  &-footer {
    position: absolute;
    bottom: 5px;
  }
}

.addnewbox {
  display: flex;
  flex-direction: column;
  width: 216px;
  height: 130px;
  font-size: 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: $true_white;
  font-weight: bold;
  padding: 7px;
  position: relative;
}

.add-child {
  justify-content: center;
  background-color: $true_white;
  border: solid 1px $light_gray_blue_3;
  color: $dark_blue;
  padding: 7px 7px 7px 28px;

  &:hover {
    background-color: $light_gray_blue_3;
  }

  .add-child-text {
    display: flex;
    align-items: center;
  }

  &-icon {
    width: 20px;
    height: 20px;
    background-color: $pink;
    border-radius: 50%;
    background-position: center;
    background-image: url('/icon/icon_plus_white.svg');
    background-repeat: no-repeat;
    display: inline-block;
    margin-right: 15px;
    vertical-align: text-bottom;
  }
}

.box {
  &-header {
    display: flex;
    width: 205px;
    position: relative;
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
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
    }

    .member-count {
      margin-left: 2px;
      margin-right: 4px;
      font-size: 13px;
      font-weight: bold;
    }
  }
}

.detail-registration {
  margin-left: 5px;
  cursor: pointer;
  width: 70px;
  height: 20px;
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

.switch-button {
  width: 83px;
}
</style>
