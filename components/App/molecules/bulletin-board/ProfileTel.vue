<template>
  <div class="profile-tel-wrapper">
    <div class="tel-wrapper">
      <div v-if="companyTel !== null" class="tel-item">
        <item-board-badge
          name="TEL"
          class="enrollment-status-badge"
          background-color="#7e8195"
        />
        <div v-if="hasTel" class="tel-contents">
          <div v-if="companyTel !== null" class="tel-item">
            <span class="tel-type">社用 </span>
            <span class="tel-number">{{ companyTel }}</span>
          </div>
          <div v-if="tel !== null" class="tel-item">
            <span class="tel-type">個人 </span>
            <span class="tel-number">{{ tel }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="internalTel !== null" class="extension-wrapper">
      <div class="extension-item">
        <item-board-badge
          name="内線"
          class="enrollment-status-badge"
          background-color="#7e8195"
        />
        <p class="tel-number">{{ internalTel }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ItemBoardBadge from '~/components/App/atoms/badges/ItemBoardBadge.vue';

export default Vue.extend({
  components: {
    ItemBoardBadge,
  },
  props: {
    tel: {
      type: String,
      required: false,
      default: null,
    },
    internalTel: {
      type: String,
      required: false,
      default: null,
    },
    companyTel: {
      type: String,
      required: false,
      default: null,
    },
  },
  computed: {
    hasTel() {
      return this.internalTel !== null && this.tel !== null;
    },
  },
});
</script>

<style lang="scss" scoped>
.profile-tel-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.extension-wrapper,
.tel-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tel-wrapper {
  margin: 0 0 8px;
}

.extension-item {
  display: flex;
  align-items: center;
  font-family: 'Lato', sans-serif;
}

.tel-item {
  display: flex;
  align-items: center;

  &:first-of-type {
    margin: 0 0 6px;
  }

  &:only-of-type {
    margin: 0;
  }
}

.tel-contents {
  font-family: 'Lato', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: $main_color;
  line-height: 1em;
}

.tel-type {
  white-space: pre;
  color: $sub_color;
  font-size: 11px;
}

.offset,
.enrollment-status-badge {
  width: 48px;
  margin: 0 7px 0 0;
}
</style>
