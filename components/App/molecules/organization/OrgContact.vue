<template>
  <div class="org-contact-container contact-section">
    <div class="contact-section__dept">
      <img
        v-if="description && description.length > 0"
        src="/app/icon/icon-building-pink.svg"
        class="contact-section__image"
      />
      <div
        v-if="description && description.length > 0"
        class="contact-section__text"
      >
        <div class="contact-section__title">部署概要</div>
        <div class="contact-section__contents">
          <span>{{ description }}</span>
        </div>
      </div>
    </div>

    <dotted-border :is-vertical="true" />

    <div class="contact-section__phone">
      <img
        v-if="tel && tel.length > 0"
        src="/app/icon/Icon-phone.svg"
        class="contact-section__image"
      />
      <div v-if="tel && tel.length > 0" class="contact-section__text">
        <div class="contact-section__title">電話番号</div>
        <div class="contact-section__contents">
          <span>{{ tel }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import DottedBorder from '../../atoms/borders/DottedBorder.vue';

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
  display: flex;
  justify-content: flex-start;
  padding: 24px 0 0 0;
}

.contact-section__dept {
  flex: 1;
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
  font-size: 15px;
  font-weight: 600;
  color: $main_color;
}

.contact-section__contents {
  font-size: 15px;
  font-weight: 300;
  color: $main-color;
  padding: 16px 0 0;
}

.contact-section__phone {
  flex: 1;
  padding: 0 0 0 16px;
}
</style>
