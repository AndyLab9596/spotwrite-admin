<template>
  <div v-if="description || tel" class="org-contact-container contact-section">
    <dotted-border />
    <div class="contact-section__dept">
      <img
        src="/app/icon/icon-building-pink.svg"
        class="contact-section__image"
      />
      <div class="contact-section__text">
        <div class="contact-section__title">部署概要</div>
        <div class="contact-section__contents">
          <span v-if="description && description.length > 0">{{
            description
          }}</span>
        </div>
      </div>
    </div>

    <dotted-border />
    <div class="contact-section__phone">
      <img src="/app/icon/Icon-phone.svg" class="contact-section__image" />
      <div class="contact-section__text">
        <div class="contact-section__title">電話番号</div>
        <div class="contact-section__contents">
          <span v-if="tel && tel.length > 0">{{ tel }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import DottedBorder from '@/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/DottedBorder.vue';

export default Vue.extend({
  components: {
    DottedBorder,
  },
  props: {
    tel: {
      default: null,
      type: String,
    },
    description: {
      default: null,
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped>
.contact-section {
  position: relative;
  padding: 4px 0 0 0;
}

.contact-section__dept {
  padding: 12px 8px 8px 0;
}

.contact-section__dept,
.contact-section__phone {
  display: flex;
  align-items: flex-start;
}

.contact-section__text {
  margin: 3px 0 0 16px;
}

.contact-section__image {
  width: 28px;
  height: auto;
}

.contact-section__title {
  font-size: 13px;
  font-weight: 600;
  color: $main_color;
}

.contact-section__contents {
  font-size: 13px;
  font-weight: 300;
  color: $main-color;
  padding: 6px 0 0;
}

.contact-section__phone {
  padding: 12px 8px 8px 0;
}
</style>
