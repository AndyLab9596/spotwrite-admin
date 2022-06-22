<template>
  <div class="company-wrapper" :class="{ 'is-child': parentName !== '' }">
    <div v-if="border" class="border"></div>
    <div class="company-row">
      <img src="/icon/icon_company_label.svg" alt="" class="company-icon" />
      <div class="company-name">
        {{ companyName }}
      </div>
      <p class="company-bagde" :class="'badge-type--' + type">
        {{ displayTypeBadge(type) }}
      </p>
      <p v-if="parentName !== ''" class="parent-name">
        {{ parentName }}
      </p>
      <p class="display-name">
        {{ displayName }}
      </p>
      <p v-if="isAddition" class="member-count">未登録{{ memberCount }}名</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  layout: 'admin/default',
  props: {
    companyName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: null,
    },
    displayName: {
      type: String,
      required: true,
    },
    parentName: {
      type: String,
      default: '',
    },
    memberCount: {
      type: Number,
      default: 0,
    },
    isAddition: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    displayMargin(): { [key: string]: string } {
      return this.parentName !== ''
        ? { margin: '0 0 10px 40px' }
        : { margin: '0 0 10px 0' };
    },
  },
  methods: {
    displayTypeBadge(type: string): string {
      switch (type) {
        case 'department':
          return '部署';
        case 'branch':
          return '支店';
        case 'shop':
          return '店舗';
        case 'management':
          return '経営陣';
        case 'other':
          return 'その他';
        default:
          return '未属性';
      }
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
$color_independent: $gray_blue_1;

.company-wrapper {
  position: relative;

  .company-row {
    display: flex;
    align-items: center;
    margin: 0 0 10px 0;

    .company-icon {
      width: 40px;
      height: 40px;
      margin-right: 15px;
      z-index: 0;
    }

    .display-name,
    .company-name {
      font-size: 15px;
      font-weight: bold;
      color: $dark_blue;
    }

    .company-name {
      margin: 0 20px 0 0;
    }

    .display-name {
      margin: 0 40px 0 0;
    }

    .parent-name {
      font-size: 11px;
      color: $gray_blue_4;
      margin: 0 10px 0 0;
    }

    .company-bagde {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 24px;
      padding: 5px 8px;
      color: $true-white;
      font-size: 13px;
      font-weight: 600;
      background-color: $true-black;
      margin: 0 10px 0 0;
      border-radius: 4px;
    }

    .badge-type {
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

      &--independent {
        background-color: $color_independent;
      }

      &--other {
        background-color: $color_other;
      }
    }
  }

  .border {
    position: absolute;
    content: '';
    height: 2px;
    width: 16px;
    left: -14px;
    top: 19px;
    z-index: 0;
    border-radius: 2px 0 0 0;
    border-bottom: 2px solid #a5a8b6;
  }

  .member-count {
    border: 1px solid $light_gray_blue_3;
    border-radius: 4px;
    color: $link_color;
    font-size: 15px;
    font-weight: 600;
    padding: 5px 25px;
    line-height: 1;
  }

  &.is-child {
    .company-row {
      margin: 0 0 10px 40px;
    }

    .border {
      width: 56px;
    }
  }
}
</style>
