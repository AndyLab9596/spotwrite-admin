<template>
  <div class="company-data-container">
    <p v-if="showDescription" class="description">
      spotwriteに登録されているデータを元にデータは作成されます。<br />各データの表示スイッチをON/OFFすることでサイト上での表示・非表示を選ぶことができます。
    </p>
    <vue-loading
      v-if="isLoading"
      type="spin"
      class="loading"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    />
    <div v-if="!isLoading" class="contents">
      <div v-for="(item, index) in contents" :key="item.id" class="content-box">
        <div class="content-top">
          <p class="content-title">{{ item.title }}</p>
          <toggle-button
            :value="item.value"
            class="button"
            :name="`toggle_${index}`"
            :contents="[
              { label: 'ON', value: 'on' },
              { label: 'OFF', value: 'off' },
            ]"
            @change="onChange(item.key)"
          ></toggle-button>
        </div>
        <div class="content">
          <img :src="item.image" alt="sample" class="example-image" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { VueLoading } from 'vue-loading-template';
import ToggleButton from '@/components/Admin/Modules/Button/ToggleButton.vue';

type Content = {
  id: number;
  title: string;
  value: string;
  key: string;
  image: string;
};

export default Vue.extend({
  components: {
    VueLoading,
    ToggleButton,
  },
  props: {
    configStatus: {
      type: Object as PropType<ApiResponse.OrganizationDataConfig>,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
    showDescription: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    contents(): Content[] {
      return [
        {
          id: 1,
          title: '出身地の割合は？',
          value: this.configStatus.birth_place ? 'on' : 'off',
          key: 'birth_place',
          image: '/image/organizations/birthplace.png',
        },
        {
          id: 2,
          title: '住んだことのある街は？',
          value: this.configStatus.prefectures_where_lived ? 'on' : 'off',
          key: 'prefectures_where_lived',
          image: '/image/organizations/places-lived.png',
        },
        {
          id: 3,
          title: '血液型の割合は？',
          value: this.configStatus.blood_type ? 'on' : 'off',
          key: 'blood_type',
          image: '/image/organizations/blood-types.png',
        },
        {
          id: 4,
          title: 'あなたは文系？理系？',
          value: this.configStatus.humanities_or_science ? 'on' : 'off',
          key: 'humanities_or_science',
          image: '/image/organizations/humanities_or_science.png',
        },
        {
          id: 5,
          title: '男女比の割合は？',
          value: this.configStatus.gender ? 'on' : 'off',
          key: 'gender',
          image: '/image/organizations/gender.png',
        },
        {
          id: 6,
          title: '新卒？中途？',
          value: this.configStatus.new_graduate_or_mid_career ? 'on' : 'off',
          key: 'new_graduate_or_mid_career',
          image: '/image/organizations/graduate-data.png',
        },
        {
          id: 7,
          title: '年齢はいくつですか？',
          value: this.configStatus.age ? 'on' : 'off',
          key: 'age',
          image: '/image/organizations/age.png',
        },
        {
          id: 8,
          title: '入社はいつですか?',
          value: this.configStatus.joined_year ? 'on' : 'off',
          key: 'joined_year',
          image: '/image/organizations/join-year.png',
        },
      ];
    },
  },
  methods: {
    onChange(name: string) {
      const key = name as keyof ApiResponse.OrganizationDataConfig;
      let status = {} as ApiResponse.OrganizationDataConfig;
      status = {
        ...this.configStatus,
        [name]: !this.configStatus[key],
      };
      this.$emit('changeStatus', status);
    },
  },
});
</script>

<style lang="scss" scoped>
.contents {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  grid-gap: 20px;
  width: 100%;
  margin-top: 32px;
}

.content-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.content {
  width: 440px;
  height: 400px;
  border: solid 1px $light_gray_blue_3;
  margin-top: 10px;
}

.description {
  font-size: 13px;
  line-height: 1.8;
}

.content-title {
  font-size: 15px;
  font-weight: bold;
}

.example-image {
  width: 99%;
}
</style>
