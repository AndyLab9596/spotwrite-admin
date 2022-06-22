<template>
  <div class="overview">
    <div v-if="leader || detail">
      <div class="overview-header">
        <span v-if="leader">リーダー</span>
      </div>
      <div class="leader">
        <leader-icon
          :user-icon="leader && leader.user_icon"
          :leader-position="leader && leader.position_name"
          :leader-name="leader && leader.name"
        />
        <contact-details
          :tel="detail && detail.tel"
          :url="detail && detail.url"
        />
      </div>
      <leader-message :message="leader && leader.message" />
    </div>
    <div class="emptyDataMsg" v-if="!leader && !detail">
      <span>詳細情報が登録されていません</span>
    </div>

    <company-images :images="images" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import LeaderMessage from '@/components/App/atoms/messages/LeaderMessage.vue';
import LeaderIcon from '@/components/App/molecules/company/LeaderIcon.vue';
import ContactDetails from '@/components/App/molecules/company/ContactDetails.vue';
import CompanyImages from '@/components/App/molecules/company/CompanyImages.vue';

export default Vue.extend({
  components: {
    LeaderMessage,
    LeaderIcon,
    ContactDetails,
    CompanyImages,
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
    images: {
      type: Array,
      default: () => [],
    },
  },
});
</script>

<style lang="scss" scoped>
.overview-header {
  margin: 24px 0 19px;
  font-size: 15px;
  font-weight: 600;
}

.leader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 24px;
}

.emptyDataMsg {
  padding-top: 30px;
}
</style>
