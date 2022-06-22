<template>
  <div class="contents">
    <p class="text" v-linkified>{{ content }}</p>
    <template v-if="hasQuestionnaire">
      <questionnaire
        :questionnaire="questionnaire"
        :user-uuid="userUuid"
        :preview-mode="previewMode"
        @onClick="clickAnswer"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import linkify from 'vue-linkify';
import Questionnaire from '../../molecules/questionnaire/Questionnaire.vue';

Vue.directive('linkified', linkify);
export default Vue.extend({
  components: {
    Questionnaire,
  },
  props: {
    content: {
      type: String,
      required: true,
    },
    userUuid: {
      type: String,
      required: true,
    },
    questionnaire: {
      type: Object as PropType<AppApiResponse.Questionnaire>,
      required: false,
      default: null,
    },
    previewMode: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    hasQuestionnaire() {
      return this.questionnaire != null;
    },
  },
  methods: {
    clickAnswer(uuid: string) {
      this.$emit('onClick', uuid);
    },
  },
});
</script>

<style lang="scss" scoped>
.text {
  color: $main_color;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.7;
  white-space: pre-wrap;
  margin: 0 0 32px 0;
  overflow-wrap: break-word;
}
</style>
