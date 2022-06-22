<template>
  <div>
    <vue-loading
      v-if="isLoading"
      type="spin"
      class="loading"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    />

    <div v-else class="data-grid" :class="{ 'data-grid--busho': isBusho }">
      <birthplace-data
        class="data-item--odd"
        :regions="sortedRegions"
        :highest-count="highestCount"
        :show="configStatus.birth_place"
      />

      <places-lived
        class="data-item--even data-item--tall"
        :cities="topCities"
        :other-cities="otherCities"
        :show="configStatus.prefectures_where_lived"
      />

      <dotted-border class="org-dotted" />

      <blood-types
        class="data-item--odd"
        :blood-types="organizationData.blood_type_count"
        :sections="sections"
        :show="configStatus.blood_type"
      />

      <left-brain-right-brain
        class="data-item--even"
        :humanities-or-science="organizationData.humanities_or_science_count"
        :book-count="bookCount"
        :beaker-count="beakerCount"
        :book-equals-beaker="bookEqualsBeaker"
        :show="configStatus.humanities_or_science"
      />

      <dotted-border class="org-dotted" />

      <gender-data
        class="data-item--odd"
        :gender-data="organizationData.gender_count"
        :male-count="maleCount"
        :female-count="femaleCount"
        :show="configStatus.gender"
      />

      <graduate-data
        class="data-item--even"
        :graduate-data="organizationData.new_graduate_or_mid_career_count"
        :grad-count="gradCount"
        :mid-career-count="midCareerCount"
        :show="configStatus.new_graduate_or_mid_career"
      />

      <dotted-border class="org-dotted" />

      <average-age
        class="data-item--odd"
        :age-data="organizationData.age_count"
        :ages-not-average="agesNotAverage"
        :max-age-count="maxAgeCount"
        :total-age-count="totalAgeCount"
        :show="configStatus.age"
      />

      <join-year
        class="data-item--even"
        :top-joined="topJoined"
        :other-joined="otherJoined"
        :show="configStatus.joined_year"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { VueLoading } from 'vue-loading-template';

import BirthplaceData from '@/components/App/molecules/company/data/BirthplaceData.vue';
import PlacesLived from '@/components/App/molecules/company/data/PlacesLived.vue';
import BloodTypes from '@/components/App/molecules/company/data/BloodTypes.vue';
import LeftBrainRightBrain from '@/components/App/molecules/company/data/LeftBrainRightBrain.vue';
import GenderData from '@/components/App/molecules/company/data/GenderData.vue';
import GraduateData from '@/components/App/molecules/company/data/GraduateData.vue';
import AverageAge from '@/components/App/molecules/company/data/AverageAge.vue';
import JoinYear from '@/components/App/molecules/company/data/JoinYear.vue';
import DottedBorder from '../../atoms/borders/DottedBorder.vue';

interface Props {
  data: Array<object>;
  sortBy: Array<string>;
  sortField: string;
}

interface SortByObject {
  [key: string]: number;
}

export default Vue.extend({
  components: {
    VueLoading,
    BirthplaceData,
    PlacesLived,
    BloodTypes,
    LeftBrainRightBrain,
    GenderData,
    GraduateData,
    AverageAge,
    JoinYear,
    DottedBorder,
  },
  props: {
    organizationData: {
      type: Object,
      default: null,
    },
    sections: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isBusho: {
      type: Boolean,
      default: false,
    },
    configStatus: {
      type: Object as PropType<ApiResponse.OrganizationDataConfig>,
      default: {},
    },
  },
  computed: {
    // 出身地 -------------------------------------------------
    regions(): object | null | undefined {
      return this.organizationData.prefecture_count;
    },
    regionArray(): Array<object> {
      if (this.regions === null || this.regions === undefined) {
        return [];
      }
      return Object.values(this.regions).map((region: any) => {
        return region;
      });
    },
    sortedRegions(): object {
      const sortBy = [
        '海外',
        '北海道',
        '九州',
        '中国',
        '中部',
        '東北',
        '四国',
        '近畿',
        '関東',
      ];
      const sortedRegions = this.customSort({
        data: this.regionArray,
        sortBy,
        sortField: 'name',
      });
      return sortedRegions;
    },
    highestCount(): number {
      const regionCopy = [...this.regionArray];
      const sorted: any = regionCopy.sort((a: any, b: any) => {
        return a.count > b.count ? -1 : 1;
      });

      const largestCount = sorted[0].count;

      return largestCount === 0 ? false : largestCount;
    },
    // 住んだことのある街 -------------------------------------------------
    cities(): object {
      return this.organizationData.birth_place_city_count;
    },
    cityArray(): Array<object> {
      if (this.cities === null || this.cities === undefined) {
        return [];
      }
      return Object.values(this.cities).map((city: any) => {
        return city;
      });
    },
    sortedCities(): any {
      const citiesCopy = [...this.cityArray];
      const sorted: object = citiesCopy.sort((a: any, b: any) => {
        return a.count > b.count ? -1 : 1;
      });

      return sorted;
    },
    topCities(): Array<any> {
      if (this.sortedCities.length > 3) {
        return this.sortedCities.slice(0, 3);
      }
      return this.sortedCities;
    },
    otherCities(): Array<any> {
      if (this.sortedCities.length > 3) {
        return this.sortedCities.slice(3);
      }
      return [];
    },
    // 年齢 -------------------------------------------------
    ages(): object {
      return this.organizationData.age_count;
    },
    agesNotAverage(): Array<AppApiResponse.DataCount> {
      if (this.ages === null || this.ages === undefined) {
        return [];
      }
      const allAges = Object.values(this.ages).map((ageRange: any) => {
        return ageRange;
      });

      const isAverage = (element: any) => element.name === '平均年齢';

      const averageIndex = allAges.findIndex(isAverage);

      allAges.splice(averageIndex, 1);

      return allAges;
    },
    totalAgeCount(): Number {
      return this.agesNotAverage
        .map((e: AppApiResponse.DataCount) => e.count)
        .reduce((acc: any, cv: any) => acc + cv);
    },
    maxAgeCount(): Number {
      return this.agesNotAverage
        .map((e: AppApiResponse.DataCount) => e.count)
        .sort((a: any, b: any) => b - a)[0];
    },
    // 入社 -------------------------------------------------
    joined(): object {
      return this.organizationData.joined_year_count;
    },
    joinedArray(): Array<object> {
      if (this.joined === null || this.joined === undefined) {
        return [];
      }
      return Object.values(this.joined).map((joinDate: any) => {
        return joinDate;
      });
    },
    sortedJoined(): any {
      const joinCopy = [...this.joinedArray];
      const sorted: object = joinCopy.sort((a: any, b: any) => {
        return a.count > b.count ? -1 : 1;
      });

      return sorted;
    },
    topJoined(): Array<any> {
      if (this.sortedJoined.length > 3) {
        return this.sortedJoined.slice(0, 3);
      }
      return this.sortedJoined;
    },
    otherJoined(): Array<any> {
      if (this.sortedJoined.length > 3) {
        return this.sortedJoined.slice(3);
      }
      return [];
    },
    // 文系理系 -------------------------------------------------
    bookCount(): Number {
      const bookPercent = this.organizationData.humanities_or_science_count
        .humanities.percent;
      return Math.round(bookPercent / 10);
    },
    beakerCount(): Number {
      const beakerPercent = this.organizationData.humanities_or_science_count
        .science.percent;
      return Math.round(beakerPercent / 10);
    },
    bookEqualsBeaker(): Boolean {
      return this.bookCount === this.beakerCount;
    },
    // 男女比 -------------------------------------------------
    maleCount(): Number {
      const malePercent = this.organizationData.gender_count.man.percent;
      return Math.round(malePercent / 10);
    },
    femaleCount(): Number {
      const femalePercent = this.organizationData.gender_count.woman.percent;
      return Math.round(femalePercent / 10);
    },
    // 新卒・中途 -------------------------------------------------
    gradCount(): Number {
      const gradPercent = this.organizationData.new_graduate_or_mid_career_count
        .new_graduate.percent;
      return Math.round(gradPercent / 10);
    },
    midCareerCount(): Number {
      const midCareerPercent = this.organizationData
        .new_graduate_or_mid_career_count.mid_career.percent;
      return Math.round(midCareerPercent / 10);
    },
  },
  methods: {
    customSort({ data, sortBy, sortField }: Props) {
      const sortByObject: SortByObject = sortBy.reduce(
        (obj: any, item: any, index: any) => {
          return {
            ...obj,
            [item]: index,
          };
        },
        {}
      );
      return data.sort(
        (a: any, b: any) =>
          sortByObject[a[sortField]] - sortByObject[b[sortField]]
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.loading {
  margin: 30px auto 0;
}

.data-grid {
  position: relative;
  display: flex;
  flex-wrap: wrap;

  &--busho {
    padding: 0 40px 40px;
  }
}

.data-item--odd {
  padding: 0 46px 0 0;
  border-right: 1px dotted #7e819587;
}

.data-item--even {
  padding: 0 0 0 47px;
}

.data-item {
  position: relative;
  flex: 50%;
  max-width: 50%;
  margin: 24px 0;
}

.data-item__header {
  display: flex;
  align-items: center;

  span {
    margin: 0 0 0 16px;
    font-size: 15px;
    font-weight: 600;
    color: $main_color;
  }
}

.data-item__contents {
  width: 100%;
  margin: 16px 0 0;
}
</style>
