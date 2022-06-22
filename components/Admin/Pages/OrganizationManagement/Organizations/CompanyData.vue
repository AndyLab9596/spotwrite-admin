<template>
  <div>
    <vue-loading
      v-if="isLoading"
      type="spin"
      class="loading"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    />
    <div v-else class="data-grid">
      <div class="data-item data-item--odd">
        <div class="data-item__header">
          <icon-bg src="/icon/icon-earth.svg" />
          <span>出身地の割合は？</span>
        </div>
        <div class="data-item__contents hometown">
          <div
            v-for="region in sortedRegions"
            :key="region.name"
            class="region"
            :class="{ 'region--pink': region.count === highestCount }"
          >
            <div class="region__name">{{ region.name }}</div>
            <div class="region__count">{{ region.count }}</div>
          </div>
        </div>
      </div>
      <div class="data-item data-item--even data-item--tall">
        <div class="data-item__header">
          <icon-bg src="/icon/icon-house.svg" />
          <span>住んだことのある街は？</span>
        </div>
        <div class="data-item__contents">
          <div
            v-for="(city, index) in topCities"
            :key="city.name + index"
            class="top-city"
          >
            <div class="top-city--left">
              <span class="city-icon">
                <img
                  v-if="index === 0"
                  class="city-icon__house"
                  src="/icon/icon-house-pink.svg"
                />
                <img
                  v-else
                  class="city-icon__house"
                  src="/icon/icon-house-gray.svg"
                />
                <span class="city-icon__number">{{ index + 1 }}</span>
              </span>
              <span
                class="top-city__name"
                :class="{ 'top-city__name--pink': index === 0 }"
                >{{ city.name }}</span
              >
            </div>
            <div class="top-city--right">
              <img class="top-city__dots" src="/icon/icon-triple-dot.svg" />
              <span class="top-city__count">{{ city.count }}</span>
            </div>
          </div>
          <div
            v-if="otherCities && otherCities.length > 0"
            class="other-cities"
          >
            <div
              v-for="(city, index) in otherCities"
              :key="city.name"
              class="other-city"
            >
              <span class="other-city-icon">
                <img
                  class="other-city-icon__house"
                  src="/icon/icon-house-rainbow.svg"
                />
                <span class="other-city-icon__number">{{ index + 4 }}</span>
              </span>
              <span class="other-city__name">{{ city.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <dotted-border class="org-dotted" />
      <div class="data-item data-item--odd">
        <div class="data-item__header">
          <icon-bg src="/icon/icon-blood.svg" />
          <span>血液型の割合は？</span>
        </div>
        <div class="data-item__contents blood">
          <div class="blood-row">
            <div class="blood-drop">
              <div class="droplet droplet--ab">
                <img src="/icon/icon-blood-ab.svg" />
              </div>
              <div
                v-if="Object.keys(organizationData).length > 0"
                class="blood-drop__count"
              >
                {{ organizationData.blood_type_count.type_ab.count }}
              </div>
            </div>
            <!-- TODO ソートして、円グラフのセクションの色を順番に合わせる -->
            <vc-donut
              background="white"
              foreground="#d8d8d8"
              class="blood-graph"
              :size="70"
              unit="px"
              :thickness="50"
              :sections="sections"
              :start-angle="0"
              :total="100"
            ></vc-donut>
            <!-- TODO ソートして、dropletの色順番に合わせる -->
            <div class="blood-drop">
              <div class="droplet droplet--a">
                <img src="/icon/icon-blood-a.svg" />
              </div>
              <div
                v-if="Object.keys(organizationData).length > 0"
                class="blood-drop__count"
              >
                {{ organizationData.blood_type_count.type_a.count }}
              </div>
            </div>
          </div>
          <div class="blood-row blood-row--bottom">
            <div class="blood-drop">
              <div class="droplet droplet--b">
                <img src="/icon/icon-blood-b.svg" />
              </div>
              <div
                v-if="Object.keys(organizationData).length > 0"
                class="blood-drop__count"
              >
                {{ organizationData.blood_type_count.type_b.count }}
              </div>
            </div>
            <div class="blood-drop">
              <div class="droplet droplet--o">
                <img src="/icon/icon-blood-o.svg" />
              </div>
              <div
                v-if="Object.keys(organizationData).length > 0"
                class="blood-drop__count"
              >
                {{ organizationData.blood_type_count.type_o.count }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="data-item data-item--even">
        <div class="data-item__header">
          <icon-bg src="/icon/icon-pencil.svg" />
          <span>あなたは文系？理系？</span>
        </div>
        <div
          v-if="Object.keys(organizationData).length > 0"
          class="data-item__contents study"
        >
          <div class="repeating-background">
            <div v-for="i in 5" :key="i.index" class="repeating-row--study">
              <!-- TODO organizationData.humanities_or_science_count.humanities/science.percentで書き直す -->
              <img
                v-for="j in 4"
                :key="j.index"
                src="/icon/icon-book.svg"
                class="repeating-image--study"
              />
              <img
                v-for="k in 3"
                :key="k.index"
                src="/icon/icon-beaker.svg"
                class="repeating-image--study"
              />
            </div>
            <div class="data-circles">
              <div
                class="data-circle"
                :class="{
                  'data-circle--pink':
                    organizationData.humanities_or_science_count.humanities
                      .percent >
                    organizationData.humanities_or_science_count.science
                      .percent,
                }"
              >
                <!-- TODO  organizationData.humanities_or_science_count.humanities.nameを漢字で返すように -->
                <div class="data-circle__label">文系</div>
                <div class="data-circle__number">
                  {{
                    Math.round(
                      organizationData.humanities_or_science_count.humanities
                        .percent / 100
                    )
                  }}
                </div>
              </div>
              <div
                class="data-circle"
                :class="{
                  'data-circle--pink':
                    organizationData.humanities_or_science_count.science
                      .percent >
                    organizationData.humanities_or_science_count.humanities
                      .percent,
                }"
              >
                <!-- TODO  organizationData.humanities_or_science_count.science.nameを漢字で返すように -->
                <div class="data-circle__label">理系</div>
                <div class="data-circle__number">
                  {{
                    Math.round(
                      organizationData.humanities_or_science_count.science
                        .percent / 100
                    )
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <dotted-border class="org-dotted" />
      <div class="data-item data-item--odd">
        <div class="data-item__header">
          <icon-bg src="/icon/icon-sex.svg" />
          <span>男女比の割合は？</span>
        </div>
        <div
          v-if="Object.keys(organizationData).length > 0"
          class="data-item__contents gender"
        >
          <div class="repeating-background">
            <div v-for="l in 5" :key="l.index" class="repeating-row--gender">
              <!-- TODO organizationData.gender_count.man/woman.percentで書き直す -->
              <img
                v-for="m in 5"
                :key="m.index"
                src="/icon/icon-male.svg"
                class="repeating-image--gender"
              />
              <img
                v-for="n in 4"
                :key="n.index"
                src="/icon/icon-female.svg"
                class="repeating-image--gender"
              />
            </div>
            <div class="data-circles">
              <div
                class="data-circle"
                :class="{
                  'data-circle--pink':
                    organizationData.gender_count.man.percent >
                    organizationData.gender_count.woman.percent,
                }"
              >
                <!-- TODO  organizationData.gender_count.man.nameを漢字で返すように -->
                <div class="data-circle__label">男性</div>
                <div class="data-circle__number">
                  {{
                    Math.round(organizationData.gender_count.man.percent / 100)
                  }}
                </div>
              </div>
              <div
                class="data-circle"
                :class="{
                  'data-circle--pink':
                    organizationData.gender_count.woman.percent >
                    organizationData.gender_count.man.percent,
                }"
              >
                <!-- TODO  organizationData.gender_count.woman.nameを漢字で返すように -->
                <div class="data-circle__label">女性</div>
                <div class="data-circle__number">
                  {{
                    Math.round(
                      organizationData.gender_count.woman.percent / 100
                    )
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="data-item data-item--even">
        <div class="data-item__header">
          <icon-bg src="/icon/icon-graduate.svg" /><span>新卒？中途？</span>
        </div>
        <div
          v-if="Object.keys(organizationData).length > 0"
          class="data-item__contents grad"
        >
          <div class="repeating-background--grad">
            <div v-for="o in 5" :key="o.index" class="repeating-row--grad">
              <!-- TODO organizationData.new_graduate_or_mid_career_count.mid_career/new_graduate.percentで書き直す -->
              <img
                v-for="p in 4"
                :key="p.index"
                src="/icon/icon-grad-cap.svg"
                class="repeating-image--grad"
              />
              <img
                v-for="q in 2"
                :key="q.index"
                src="/icon/icon-briefcase.svg"
                class="repeating-image--briefcase"
              />
            </div>
            <div class="data-circles">
              <div
                class="data-circle"
                :class="{
                  'data-circle--pink':
                    organizationData.new_graduate_or_mid_career_count
                      .new_graduate.percent >
                    organizationData.new_graduate_or_mid_career_count.mid_career
                      .percent,
                }"
              >
                <!-- TODO  organizationData.new_graduate_or_mid_career_count.new_graduate.nameを漢字で返すように -->
                <div class="data-circle__label">新卒</div>
                <div class="data-circle__number">
                  {{
                    Math.round(
                      organizationData.new_graduate_or_mid_career_count
                        .new_graduate.percent / 100
                    )
                  }}
                </div>
              </div>
              <div
                class="data-circle"
                :class="{
                  'data-circle--pink':
                    organizationData.new_graduate_or_mid_career_count.mid_career
                      .percent >
                    organizationData.new_graduate_or_mid_career_count
                      .new_graduate.percent,
                }"
              >
                <!-- TODO  organizationData.new_graduate_or_mid_career_count.mid_career.nameを漢字で返すように -->
                <div class="data-circle__label">中途</div>
                <div class="data-circle__number">
                  {{
                    Math.round(
                      organizationData.new_graduate_or_mid_career_count
                        .mid_career.percent / 100
                    )
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <dotted-border class="org-dotted" />
      <div class="data-item data-item--odd">
        <div class="data-item__header">
          <icon-bg src="/icon/icon-cake.svg" /><span>年齢はいくつですか？</span>
        </div>
        <div
          v-if="Object.keys(organizationData).length > 0"
          class="data-item__contents"
        >
          <div class="age">
            <img src="/icon/icon-male.svg" class="age-icon" />
            <img src="/icon/icon-female.svg" class="age-icon" />
            <div class="average-age">
              <div class="average-age__name">
                {{ organizationData.age_count.average.name }}
              </div>
              <div class="average-age__count">
                {{ Math.round(organizationData.age_count.average.count) }}
              </div>
            </div>
          </div>
          <div
            v-for="age in agesNotAverage"
            :key="age.name"
            class="age-bracket"
          >
            <span class="age-bracket__name">{{ age.name }}</span>
            <span class="age-bracket__icons">
              <span v-for="i in 3" :key="i.index" class="gender-icons">
                <!-- TODO 割合でピンク色当てていく -->
                <img
                  src="/icon/icon-male-gray.svg"
                  class="gender-icon"
                  :class="{ 'gender-icon--pink': age.count > 10 }"
                />
                <img
                  src="/icon/icon-female-gray.svg"
                  class="gender-icon"
                  :class="{ 'gender-icon--pink': age.count > 20 }"
                />
              </span>
            </span>
            <span class="age-bracket__count">{{ age.count }}</span>
          </div>
        </div>
      </div>
      <div class="data-item data-item--even">
        <div class="data-item__header">
          <icon-bg src="/icon/icon-sakura.svg" /><span>入社はいつですか?</span>
        </div>
        <div class="data-item__contents">
          <div
            v-for="(joinDate, index) in topJoined"
            :key="joinDate.name + index"
            class="top-joined"
          >
            <div class="top-joined--left">
              <span class="joined-icon">
                <img
                  v-if="index === 0"
                  class="joined-icon__sakura"
                  src="/icon/icon-sakura-pink.svg"
                />
                <img
                  v-else
                  class="joined-icon__sakura"
                  src="/icon/icon-sakura-gray.svg"
                />
                <span class="joined-icon__number">{{ index + 1 }}</span>
              </span>
              <span
                class="top-joined__name"
                :class="{ 'top-joined__name--pink': index === 0 }"
                >{{ joinDate.year }}</span
              >
              <span
                class="top-joined__name--jp"
                :class="{ 'top-joined__name--jp--pink': index === 0 }"
              >
                {{ joinDate.name }}
              </span>
            </div>
            <div class="top-joined--right">
              <img class="top-joined__dots" src="/icon/icon-triple-dot.svg" />
              <span class="top-joined__count">{{ joinDate.count }}</span>
            </div>
          </div>
          <div
            v-if="otherJoined && otherJoined.length > 0"
            class="other-joined"
          >
            <div
              v-for="(joinedDate, index) in otherJoined"
              :key="joinedDate.name"
              class="other-join"
            >
              <span class="other-join-icon">
                <img
                  class="other-join-icon__sakura"
                  src="/icon/icon-sakura-rainbow.svg"
                />
                <span class="other-join-icon__number">{{ index + 4 }}</span>
              </span>
              <span class="other-join__name">{{ joinedDate.year }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { VueLoading } from 'vue-loading-template';
import IconBg from '@/components/Admin/Pages/OrganizationManagement/Organizations/IconBg.vue';
import DottedBorder from '@/components/Admin/Pages/OrganizationManagement/Organizations/DottedBorder.vue';
import Donut from 'vue-css-donut-chart';
import 'vue-css-donut-chart/dist/vcdonut.css';

Vue.use(Donut);

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
    IconBg,
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
  },
  computed: {
    regions(): object {
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
    ages(): object {
      return this.organizationData.age_count;
    },
    agesNotAverage(): Array<object> {
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
    sortedRegions(): object {
      const sortBy = [
        '北海道',
        '九州',
        '中国',
        '中部',
        '東北',
        '海外',
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
}

.data-item--odd {
  padding: 0 5px;
  border-right: 1px dotted #7e819587;
}

.data-item {
  position: relative;
  flex: 50%;
  max-width: 50%;
  margin: 10px 0;
  padding: 0 5px;
  display: flex;
  flex-direction: column;
}

.data-item__header {
  display: flex;
  align-items: center;

  span {
    margin: 0 0 0 5px;
    font-size: 11px;
    font-weight: 600;
    color: $main_color;
  }
}

.data-item__contents {
  width: 100%;
  margin: 5px auto auto;
}

.data-item__contents.hometown {
  background-image: url('/image/japan.svg');
  background-size: initial;
  background-position: center;
  background-repeat: no-repeat;
}

.hometown {
  width: auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 0fr 0fr 0fr;
  column-gap: 6px;
  row-gap: 6px;

  :first-child {
    grid-column-start: 4;
    grid-column-end: 5;
  }
}

.region {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: $icon_gray;
  opacity: 90%;
  color: $true_white;

  &--pink {
    background-color: $link_color;
  }
}

.region__name {
  font-size: 8px;
  letter-spacing: 0;
  line-height: 10px;
}

.region__count {
  font-size: 12px;
  line-height: 14px;
  margin: 0 2px 0 0;
  position: relative;

  &::after {
    content: '%';
    font-size: 8px;
    line-height: 10px;
    position: absolute;
    bottom: 0;
    left: 105%;
  }
}

// CITY + JOINED
.top-city,
.top-joined {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  background: $gradient_6;
  margin: 4px 0 0;
  padding: 5px;
  border-radius: 4px;
}

.top-city--left,
.top-city--right,
.top-joined--left,
.top-joined--right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.city-icon,
.joined-icon {
  position: relative;
  display: inline-block;
  margin: 0 5px 0 0;
}

.city-icon__number,
.joined-icon__number {
  font-size: 15px;
  color: $true_white;
  position: absolute;
  top: 57%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.top-city__name,
.top-joined__name {
  font-size: 11px;
  color: $chart_text;
}

.top-city__name--pink,
.top-joined__name--pink {
  font-weight: 600;
  color: $link_color;
}

.top-joined__name--jp {
  font-size: 11px;
  color: $chart_text;
  line-height: 20px;
  margin: 0 0 0 5px;
}

.top-joined__name--jp--pink {
  font-weight: 600;
  color: $link_color;
}

.top-city__dots,
.top-joined__dots {
  width: 24px;
  margin: 0 5px 0 0;
}

.top-city__count,
.top-joined__count {
  font-size: 15px;
  color: $chart_text;
  white-space: nowrap;
  position: relative;

  &::after {
    content: '人';
    font-size: 8px;
  }
}

.other-cities,
.other-joined {
  max-height: 140px;
  margin: 16px 0 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
}

.other-city,
.other-join {
  display: flex;
  font-size: 13px;
  line-height: 34px;
  color: $main_color;
  flex: 1;
  min-width: 124px;
  margin: 0 24px 8px 0;

  &:nth-child(3) {
    margin-bottom: 0;
  }

  &:nth-child(6) {
    margin-bottom: 0;
  }
}

.other-city-icon,
.other-join-icon {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 8px 0 0;
}

.other-city-icon__number,
.other-join-icon__number {
  font-size: 13px;
  color: $main_color;
  position: absolute;
  top: 57%;
  left: 50%;
  transform: translate(-50%, -50%);
}

// BLOOD ---------------------------------------------------------------------------------
.blood {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.study {
  margin-top: auto;
}

.gender {
  margin-top: auto;
}

.grad {
  margin-top: auto;
}

.blood-row {
  width: 100%;
  display: flex;

  .blood-drop:first-of-type {
    margin-right: auto;
  }

  .blood-drop:last-of-type {
    margin-left: auto;
    margin-right: 12px;
  }
}

.blood-row--bottom {
  margin: -23px 0 0;
  justify-content: center;
}

.blood-graph {
  margin: 13px 3px 0 16px;
}

.droplet {
  position: relative;

  img {
    width: 24px;
  }
}

.droplet::after {
  content: '型';
  position: absolute;
  bottom: 0;
  font-size: 11px;
  color: $main_color;
  line-height: 19px;
}

.droplet--a::before {
  content: 'A';
}

.droplet--b::before {
  content: 'B';
}

.droplet--ab::before {
  content: 'AB';
}

.droplet--o::before {
  content: 'O';
}

.droplet--a::before,
.droplet--b::before,
.droplet--ab::before,
.droplet--o::before {
  position: absolute;
  top: 56%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 11px;
  color: $true_white;
}

.blood-drop__count {
  position: relative;
  font-size: 18px;
  color: $main_color;
  width: 100%;
  text-align: center;

  &::after {
    content: '人';
    position: absolute;
    left: 100%;
    bottom: 0;
    font-size: 11px;
    color: $main_color;
  }
}

// BUNKEI RIKEI
.repeating-background {
  width: max-content;
  margin: auto;
  position: relative;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  row-gap: 6px;

  &--grad {
    width: max-content;
    margin: auto;
    position: relative;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    row-gap: 8px;
  }
}

.repeating-image {
  &--study {
    width: 14px;
  }

  &--gender {
    width: 10px;
  }

  &--grad {
    width: 20px;
  }

  &--briefcase {
    width: 20px;
  }
}

.repeating-row {
  &--study {
    display: grid;
    grid-template-columns: 14px 14px 14px 14px 14px 14px 14px;
    column-gap: 6px;
  }

  &--gender {
    display: grid;
    grid-template-columns: 10px 10px 10px 10px 10px 10px 10px 10px 10px;
    column-gap: 8px;
  }

  &--grad {
    display: grid;
    grid-template-columns: 20px 20px 20px 20px 20px 20px;
    column-gap: 6px;
  }
}

.data-circles {
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: space-around;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.data-circle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: $icon_gray;
  color: $true_white;
}

.data-circle--pink {
  background-color: $link_color;
}

.data-circle__label {
  font-size: 11px;
}

.data-circle__number {
  font-size: 20px;
}

// AGE
.age {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 8px;
}

.age-icon {
  width: 24px;
  height: 47px;

  &:first-of-type {
    margin: 0 8px 0 0;
  }
}

.average-age {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 20px 0 10px;
}

.average-age__name {
  font-size: 12px;
  color: $main_color;
}

.average-age__count {
  font-size: 40px;
  line-height: 48px;
  color: $main_color;

  &::after {
    content: '歳';
    height: 12px;
    position: absolute;
    top: 26px;
    right: -18px;
    font-size: 12px;
    color: $main_color;
  }
}

.age-bracket {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background: $gradient_6;
  border-radius: 4px;

  &:nth-of-type(n) {
    margin: 4px 0;
  }
}

.age-bracket__name {
  font-size: 11px;
  color: $chart-text;
  white-space: nowrap;
}

.age-bracket__icons {
  display: flex;
}

.age-bracket__count {
  text-align: right;
  font-size: 15px;
  color: $chart_text;
  white-space: nowrap;

  &::after {
    content: '人';
    font-size: 9px;
    color: $chart_text;
  }
}

.gender-icons {
  display: flex;
}

.gender-icon {
  height: 16px;
  margin: 0 1px;
}

.gender-icon--pink {
  filter: invert(70%) sepia(36%) saturate(587%) hue-rotate(311deg)
    brightness(98%) contrast(92%);
}
</style>
