<template>
  <div
    class="side-move-organization-modal"
    :style="{ top: offsetTop + 120 + 'px', left: offsetLeft + 245 + 'px' }"
  >
    <div class="move-organization-header">
      <p class="move-organization-title">{{ title }}</p>
      <img src="/icon/icon-close.svg" class="icon-cross" @click="onClose" />
    </div>
    <p class="move-organization-description">
      選択したBOXの子BOXに変更することができます。
    </p>

    <BaseSelect
      v-model="destinationUuid"
      class="move-organization-select"
      :items="selectBoxItems"
      :large-height="false"
      @input="changeSelectBox"
    />
    <button type="button" class="move-organization-button" @click="onClick">
      変更する
    </button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import BaseSelect from '@/components/Admin/Modules/Input/BaseSelect.vue';

export default Vue.extend({
  name: 'MoveOrganizationModal',
  components: {
    BaseSelect,
  },
  props: {
    offsetTop: {
      type: Number,
      required: false,
      default: 0,
    },
    offsetLeft: {
      type: Number,
      required: false,
      default: 0,
    },
    targetOrganization: {
      type: Object as PropType<Types.GroupOrganization>,
      required: true,
    },
    sameCompanyParents: {
      type: Array as PropType<Types.GroupOrganization[]>,
      required: true,
    },
    title: {
      type: String,
      required: false,
      default: '子BOXに変更する',
    },
  },
  data() {
    return {
      destinationUuid:
        this.targetOrganization.layer === 1
          ? ''
          : this.targetOrganization.relations.parent,
    };
  },
  computed: {
    selectBoxItems() {
      return this.sameCompanyParents.map(
        (organization: Types.GroupOrganization) => {
          return { name: organization.name, value: organization.uuid };
        }
      );
    },
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onClick() {
      this.$emit('move', {
        // 移動対象のuuid
        organization: this.targetOrganization,
        // 移動先となる組織のuuid
        destinationUuid: this.destinationUuid,
      });
    },
    changeSelectBox(uuid: string) {
      this.destinationUuid = uuid;
    },
  },
});
</script>

<style lang="scss" scoped>
.side-move-organization-modal {
  display: flex;
  flex-direction: column;
  position: absolute;
  background-color: $true_white;
  width: 390px;
  height: 197px;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 18px;
  font-size: 15px;
  box-shadow: 0 0 3px #b8c7d8;
}

.icon-cross {
  width: 16px;
  height: 16px;
  object-fit: cover;
  cursor: pointer;
}

.move-organization {
  &-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &-title {
    font-weight: bold;
    line-height: 1;
  }

  &-description {
    line-height: 1;
    margin-bottom: 17px;
  }

  &-select {
    width: 170px;
    height: 30px;
    margin: 0 auto 20px;
    background: $extra_light_gray;
    border: 1px solid $light_gray_blue_3;
    border-radius: 4px;
    padding: 0 8px;
    color: $gray_blue_4;
  }

  &-button {
    width: 170px;
    height: 40px;
    border-radius: 4px;
    background-color: $gray_blue_3;
    border: none;
    margin: 0 auto 0;
    font-weight: bold;
    color: $true_white;
    font-size: 13px;
  }
}
</style>
