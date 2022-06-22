<template>
  <div class="overview">
    <div class="overview-header">リーダー</div>
    <div class="leader">
      <leader-icon
        :user-icon="company.leader && company.leader.user_icon"
        :leader-position="company.leader && company.leader.position_name"
        :leader-name="company.leader && company.leader.name"
      />
      <contact-details
        :tel="detail && detail.tel"
        :url="detail && detail.url"
      />
    </div>
    <leader-message :message="company.leader && company.leader.message" />
    <company-images :images="company.images" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import LeaderIcon from '@/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/LeaderIcon.vue';
import ContactDetails from '@/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/ContactDetails.vue';
import LeaderMessage from '@/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/LeaderMessage.vue';
import CompanyImages from '@/components/Admin/Pages/OrganizationManagement/Organizations/AppPreview/CompanyImages.vue';

export default Vue.extend({
  components: {
    LeaderIcon,
    LeaderMessage,
    ContactDetails,
    CompanyImages,
  },
  props: {
    company: {
      type: Object,
      default: null,
    },
    detail: {
      default: () => {},
      type: Object as PropType<ApiResponse.Detail>,
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
  margin: 5px 0 19px;
  font-size: 15px;
  font-weight: 600;
}

.leader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -30px 0 24px 0;
}
</style>
