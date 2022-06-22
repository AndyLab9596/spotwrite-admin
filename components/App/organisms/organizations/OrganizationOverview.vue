<template>
  <div class="org-overview-container">
    <div v-if="!leader && !detail">
      <span>詳細情報が登録されていません</span>
    </div>
    <org-images
      :main-image="mainImage"
      :org-images-not-main="orgImagesNotMain"
      :visible-images="3"
    />

    <div v-if="leader" class="leader-section">
      <leader-icon
        :leader-icon="leader && leader.user_icon"
        :leader-position="leader && leader.position_name"
        :leader-name="leader && leader.name"
      />
      <leader-message is-before :message="leader && leader.message" />
    </div>

    <dotted-border v-if="detail && (detail.tel || detail.description)" />

    <org-contact
      v-if="detail && (detail.tel || detail.description)"
      :tel="detail && detail.tel"
      :description="detail && detail.description"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import LeaderIcon from '../../molecules/organization/LeaderIcon.vue';
import LeaderMessage from '../../atoms/messages/LeaderMessage.vue';
import OrgImages from '../../molecules/organization/OrgImages.vue';
import DottedBorder from '../../atoms/borders/DottedBorder.vue';
import OrgContact from '../../molecules/organization/OrgContact.vue';

export default Vue.extend({
  components: {
    LeaderMessage,
    LeaderIcon,
    OrgImages,
    DottedBorder,
    OrgContact,
  },
  props: {
    leader: {
      default: () => {},
      type: Object as PropType<ApiResponse.Leader>,
    },
    detail: {
      default: () => {},
      type: Object as PropType<ApiResponse.Detail>,
    },
    mainImage: {
      type: String,
      default: null,
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
});
</script>

<style lang="scss" scoped>
.org-overview-container {
  margin: 40px 0 0;
}

.leader-section {
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin: 0 0 24px;
}
</style>
