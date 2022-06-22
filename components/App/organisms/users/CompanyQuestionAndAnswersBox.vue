<template>
  <div class="company-question-answer-container">
    <div class="company-question-answer-row">
      <company-question-labeled-text
        label="血液型は？"
        class="company-question-answer-item"
        icon="blood"
        >{{
          bloodType(companyQuestionAndAnswers.blood_type)
        }}</company-question-labeled-text
      >
      <company-question-labeled-text
        label="文系？理系？"
        class="company-question-answer-item"
        icon="pen"
        >{{
          humanitiesOrScience(companyQuestionAndAnswers.humanities_or_science)
        }}</company-question-labeled-text
      >
    </div>
    <div class="company-question-answer-row">
      <company-question-labeled-text
        label="新卒？中途入社？"
        class="company-question-answer-item"
        icon="human"
        >{{
          newGraduateOrMidCareer(
            companyQuestionAndAnswers.new_graduate_or_mid_career
          )
        }}</company-question-labeled-text
      >
      <company-question-labeled-text
        label="住んだこともある都道府県は？"
        class="company-question-answer-item"
        icon="prefecture"
        >{{ birthplace }}</company-question-labeled-text
      >
    </div>
    <div class="company-question-answer-row">
      <company-question-labeled-text
        label="職種"
        class="company-question-answer-item"
        icon="human"
        >{{ jobNames }}</company-question-labeled-text
      >
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue';
import {
  enumBloodTypes,
  enumUniversityTypes,
  enumCompanyJoinTypes,
} from '@/libs/definition';
import CompanyQuestionLabeledText from '../../molecules/texts/CompanyQuestionLabeledText.vue';

export default Vue.extend({
  components: {
    CompanyQuestionLabeledText,
  },
  model: {
    prop: 'selectedTab',
    event: 'clicked',
  },
  props: {
    companyQuestionAndAnswers: {
      type: Object as PropType<ApiResponse.CompanyQuestionsItem>,
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
    },
  },
  computed: {
    bloodType() {
      return (bloodType: string): string => {
        const item = enumBloodTypes
          .filter((typeItem: object) => typeItem.value === bloodType)
          .shift();
        if (item) {
          return item.name;
        }
        return '';
      };
    },
    humanitiesOrScience() {
      return (humanitiesOrScience: string): string => {
        const item = enumUniversityTypes
          .filter((typeItem: object) => typeItem.value === humanitiesOrScience)
          .shift();
        if (item) {
          return item.name;
        }
        return '';
      };
    },
    newGraduateOrMidCareer() {
      return (newGraduateOrMidCareer: string): string => {
        const item = enumCompanyJoinTypes
          .filter(
            (typeItem: object) => typeItem.value === newGraduateOrMidCareer
          )
          .shift();
        if (item) {
          return item.name;
        }
        return '';
      };
    },
    birthplace(): string {
      return [
        this.userInfo.birthplace_country,
        this.userInfo.birthplace_prefecture,
        this.userInfo.birthplace_city,
      ]
        .filter(
          (item: string | null) =>
            item !== 'null' && item != null && item.length > 0
        )
        .join(', ');
    },
    jobNames(): string {
      if (!this.userInfo.jobs) {
        return [];
      }
      return this.userInfo.jobs.map((item: any) => item.name).join(', ');
    },
  },
  methods: {
    onTabClicked(clickedTab: string) {
      this.$emit('clicked', clickedTab);
    },
  },
});
</script>

<style lang="scss" scoped>
.company-question-answer-container {
  display: flex;
  flex-direction: column;
  min-width: 600px;
  width: 100%;
  padding: 5px 20px;
  background-color: #fff;
  border-top: solid 1px #dce5ef;
  border-bottom: solid 1px #dce5ef;
}

.company-question-answer-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: dotted 2px #ccc;
}

.company-question-answer-item {
  flex-grow: 1;
  margin: 16px 0;

  &:not(:last-child) {
    border-right: dotted 2px #ccc;
  }
}

.free-input-first-content {
  display: flex;
  flex-direction: row;
}

.free-input-first-heading {
  font-size: 13px;
  font-weight: 700;
  text-align: center;
}

.baloon-wrapper {
  width: 100%;
  margin-left: 20px;
}

.balloon {
  position: relative;
  padding: 7px 10px;
  width: 100%;
  color: #973;
  font-size: 13px;
  background: #fce9bf;
  border-radius: 10px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -20px;
    border-style: solid;
    border-color: #efeebb transparent transparent;
    border-width: 20px;
  }
}
</style>
