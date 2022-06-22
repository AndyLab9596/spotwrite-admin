<template>
  <nuxt-link
    class="back-to-index-container"
    tag="a"
    to="/admin/organization-management/organizations"
    >＜ 組織一覧に戻る</nuxt-link
  >
</template>

<style lang="scss" scoped>
.back-to-index-container {
  display: flex;
  color: $gray_blue_4;
  font-weight: bold;
  border: solid 1px $light_gray_blue_3;
  background-color: $light_gray_blue_4;
  border-radius: 4px;
  width: 135px;
  height: 30px;
  position: absolute;
  top: 17px;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: $light_gray_blue_1;
  }
}
</style>
