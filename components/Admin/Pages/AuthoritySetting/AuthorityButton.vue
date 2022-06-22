<template>
  <div
    class="authority-button"
    :class="{ 'has-authority': hasAuthority, disabled }"
    role="button"
    @click="onClick"
  >
    <div v-if="hasAuthority">
      <span>あり</span>
      <span v-if="hasFullAuthority">
        全社
      </span>
      <template v-else>
        <span class="attention">{{ authorityCompanyCount }}</span>
        <span>社</span>
      </template>
      <template v-if="isAccessiblePersonalInformation">
        <span class="separator">|</span>
        <span>個人</span>
      </template>
    </div>
    <div v-else class="none">ー</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    totalCompanyCount: {
      type: Number,
      default: null,
    },
    authorityCompanyCount: {
      type: Number,
      default: null,
    },
    isAccessiblePersonalInformation: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasAuthority() {
      return this.authorityCompanyCount > 0;
    },
    hasFullAuthority() {
      if (
        this.authorityCompanyCount == null ||
        this.totalCompanyCount == null
      ) {
        return false;
      }
      return this.authorityCompanyCount === this.totalCompanyCount;
    },
  },
  methods: {
    onClick() {
      if (!this.disabled) {
        this.$emit('click');
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.authority-button {
  display: inline-block;
  height: 30px;
  width: 120px;
  line-height: 30px;
  border: solid 1px $light_gray_blue_3;
  border-radius: 4px;
  background-color: #f1f7ff;
  color: $true_white;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
}

.authority-button.has-authority {
  border: none;
  background-color: #585e82;
}

.attention {
  color: $pink;
}

.none {
  color: $gray_blue_4;
}

.separator {
  font-size: 12px;
  font-weight: 300;
}

.disabled {
  cursor: default;
}
</style>
