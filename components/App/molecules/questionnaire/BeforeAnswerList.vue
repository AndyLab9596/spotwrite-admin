<template>
  <div>
    <template v-if="hasImages">
      <questionnaire-item
        v-for="(item, index) in questionnaireItems"
        :key="item.uuid"
        :answer="item.content"
        :uuid="item.uuid"
        :index="index + 1"
        class="item"
        @onClick="clickAnswer"
      />
    </template>
    <template v-else>
      <questionnaire-item
        v-for="item in questionnaireItems"
        :key="item.uuid"
        :answer="item.content"
        :uuid="item.uuid"
        class="item"
        @onClick="clickAnswer"
      />
    </template>
    <p class="answered-text">{{ voteCount }}票 残り{{ formattedDate }}日</p>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import dayjs from '@/libs/dayjs';
import QuestionnaireItem from '../../atoms/questionnaire/QuestionnaireItem.vue';

export default Vue.extend({
  components: {
    QuestionnaireItem,
  },
  props: {
    questionnaireItems: {
      type: Array as PropType<ApiResponse.QuestionnaireItem[]>,
      required: false,
      default: null,
    },
    expireAt: {
      type: Number,
      required: true,
    },
    hasImages: {
      type: Boolean,
      required: true,
    },
    voteCount: {
      type: Number,
      required: true,
    },
  },
  computed: {
    formattedDate(): string {
      return dayjs.unix(this.expireAt - dayjs().unix()).format('D');
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
.item {
  margin: 0 0 8px 0;

  &:last-of-type {
    margin: 0;
  }
}

.answered-text {
  font-size: 13px;
  color: $main_color;
  font-weight: 300;
  line-height: 1em;
  margin: 16px 0 0 0;
}
</style>
