<template>
  <div class="thank-you-wrapper" :class="{ 'preview-mode': previewMode }">
    <thank-you-head-contents :title="title" class="thank-you-head-contents" />
    <pick-up-member
      :uuid="userUuid"
      :icon="userIcon"
      :name="userName"
      :organization="userOrganization"
      :joined-year="userJoinedYear"
      :joined-month="userJoinedMonth"
      :is-visitor="isVisitor"
      class="pick-up-member"
    />
    <div v-if="awardeeUserComment" class="awardee-comment">
      <p class="comment">{{ awardeeUserComment }}</p>
    </div>
    <pick-up-letter-body :letter-body="letterBody" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PickUpMember from '../../molecules/pick-up/PickUpMember.vue';
import PickUpLetterBody from '../../molecules/pick-up/PickUpLetterBody.vue';
import ThankYouHeadContents from '../../molecules/thank-you/ThankYouHeadContents.vue';

export default Vue.extend({
  components: {
    PickUpMember,
    ThankYouHeadContents,
    PickUpLetterBody,
  },
  props: {
    letterBody: {
      type: String,
      required: true,
    },
    userUuid: {
      type: String,
      required: true,
    },
    userIcon: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userOrganization: {
      type: String,
      required: false,
      default: null,
    },
    userJoinedYear: {
      type: Number,
      required: false,
      default: 0,
    },
    userJoinedMonth: {
      type: Number,
      required: false,
      default: 0,
    },
    title: {
      type: String,
      required: true,
    },
    isVisitor: {
      type: Boolean,
      required: false,
      default: false,
    },
    previewMode: {
      type: Boolean,
      required: false,
      default: false,
    },
    awardeeUserComment: {
      type: String,
      required: false,
      default: null,
    },
  },
});
</script>

<style lang="scss" scoped>
.thank-you-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 26px 31px 33px 33px;
}

.thank-you-head-contents {
  margin: 0 0 28px;
}

.pick-up-member {
  margin: 0 0 26px;
}

.preview-mode {
  pointer-events: none;
}

.awardee-comment {
  padding: 15px;
  border-radius: 8px;
  background-color: $true_white;
  margin-bottom: 20px;
  width: 655px;
  max-width: 100%;
  margin-top: -10px;

  .comment {
    font-size: 15px;
    font-weight: 300;
    line-height: 1.5;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
</style>
