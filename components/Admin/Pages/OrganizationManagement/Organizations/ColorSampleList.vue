<template>
  <ul class="color-sample-list">
    <li class="color-sample-list-item">
      <div
        class="color-sample-list__category color-sample-list__category--department"
      />
      部署
    </li>
    <li class="color-sample-list-item">
      <div
        class="color-sample-list__category color-sample-list__category--branch"
      />
      支店
    </li>
    <li class="color-sample-list-item">
      <div
        class="color-sample-list__category color-sample-list__category--shop"
      />
      店舗
    </li>
    <li class="color-sample-list-item">
      <div
        class="color-sample-list__category color-sample-list__category--management"
      />
      経営陣
    </li>
    <li class="color-sample-list-item">
      <div
        class="color-sample-list__category color-sample-list__category--other"
      />
      その他
    </li>
    <li class="color-sample-list-item">
      <div
        class="color-sample-list__category color-sample-list__category--null"
      />
      未属性
    </li>
  </ul>
</template>

<style lang="scss" scoped>
$color_department: $blue;
$color_branch: $light_blue_green;
$color_shop: $purple;
$color_management: $wild_blue_yonder;
$color_other: $hopbush;
$color_null: $gray_blue_1;

.color-sample-list {
  display: flex;
  flex-direction: row;
  align-items: center;

  &-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 12px;
    margin-right: 24px;
  }

  &__category {
    width: 32px;
    height: 32px;
    margin-right: 9px;
    background-position: center;
    background-image: url('/icon/icon_pepole_white.svg');
    background-repeat: no-repeat;
    border-radius: 50%;

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
}
</style>
