<template>
  <div class="overview">
    <org-images
      :main-image="organization.main_image"
      :org-images-not-main="orgImagesNotMain"
      :visible-images="3"
    />
    <div class="overview-header">
      <div class="leader-title">リーダー</div>
      <div>
        <div v-if="leaderName && leaderName.length > 0" class="leader-name">
          {{ leaderName }}
        </div>
        <div
          v-if="leaderPosition && leaderPosition.length > 0"
          class="leader-position"
        >
          {{ leaderPosition }}
        </div>
      </div>
    </div>
    <div class="leader">
      <div v-if="userIcon && userIcon.length > 0">
        <div
          class="leader-image"
          :style="{
            backgroundImage: 'url(' + userIcon + ')',
          }"
        ></div>
      </div>
      <div
        v-else
        class="leader-image"
        style="background-image: url('/image/no-image.png');"
      ></div>
      <div class="quote-container">
        <div v-if="message && message.length > 0" class="leader-quote">
          {{ message }}
        </div>
      </div>
    </div>
    <org-contact
      :tel="detail && detail.tel"
      :description="detail && detail.description"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import OrgImages from '@/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/OrgImages.vue';
import OrgContact from '@/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/OrgContact.vue';

export default Vue.extend({
  components: {
    OrgImages,
    OrgContact,
  },
  props: {
    organization: {
      type: Object,
      default: null,
    },
    detail: {
      default: () => {},
      type: Object as PropType<ApiResponse.Detail>,
    },
    orgImagesNotMain: {
      type: Array,
      default: null,
    },
    visibleImages: {
      type: Number,
      required: true,
      default: null,
    },
  },
  computed: {
    leaderName(): string | null {
      return (
        (this.organization.leader && this.organization.leader.name) || null
      );
    },
    leaderPosition(): string | null {
      return (
        (this.organization.leader && this.organization.leader.position_name) ||
        null
      );
    },
    userIcon(): string | null {
      return (
        (this.organization.leader && this.organization.leader.user_icon) || null
      );
    },
    message(): string | null {
      return (
        (this.organization.leader && this.organization.leader.message) || null
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.overview {
  margin: 10px;
  padding: 10px;
  box-shadow: 0 3px 6px #dce5ef;
  border-radius: 4px;
  background-color: #fff;
}

.overview-header {
  margin: 5px 0 18px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  flex-direction: row;
}

.leader {
  display: flex;
  flex-direction: row;
  margin: -10px 0 24px 0;
}

.leader-title {
  margin-right: 8px;
}

.leader-image {
  width: 50px;
  min-height: 50px;
  height: auto;
  border-radius: 27px;
  background-position: center;
  background-repeat: none;
  background-size: cover;
}

.leader-name {
  font-size: 15px;
  font-weight: 600;
  border-bottom: 1px solid $link_color;
}

.leader-position {
  color: $gentle_bluish_purple;
  font-size: 11px;
  line-height: 1;
  margin: 8.5px 0 0 0;
  font-weight: 300;
}

.left-talk-wrapper {
  position: relative;
  padding: 16px;
  width: 100%;
  color: $chart_text;
  font-size: 13px;
  background: $gradient_7;
  border-radius: 8px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -20px;
    border-style: solid;
    border-color: $baby_blue transparent transparent;
    border-width: 20px;
  }
}

.quote-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
}

.leader-quote {
  background: $gradient_3;
  position: relative;
  padding: 12px;
  width: 100%;
  color: $quote_color;
  font-size: 13px;
  border-radius: 8px;
  margin-left: 12px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -14px;
    border-style: solid;
    border-color: $sand_color transparent transparent;
    border-width: 14px;
  }
}
</style>
